from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.card import MemberCard
from app.models.member import Member
from app.models.tier import TierDefinition
from app.schemas.card import CardResponse, CardUpgrade, CardLookup
from app.schemas.common import MessageResponse
from app.dependencies import get_current_user
from app.utils.card_generator import generate_card_id, get_next_tier_name
from app.utils.audit import log_audit
from app.models.staff import StaffUser

router = APIRouter()

TIER_THRESHOLDS = {
    "qualifier": 1000,
    "silver": 3500,
    "gold": 5500,
    "black": None,
}


@router.get("/lookup/{card_id}", response_model=CardLookup)
async def lookup_card(
    card_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(MemberCard).where(MemberCard.card_id == card_id)
    )
    card = result.scalar_one_or_none()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Get member name
    member_result = await db.execute(select(Member).where(Member.id == card.member_id))
    member = member_result.scalar_one_or_none()

    # Get tier discount
    tier_result = await db.execute(
        select(TierDefinition).where(TierDefinition.tier_name == card.tier)
    )
    tier = tier_result.scalar_one_or_none()

    # Check upgrade eligibility
    threshold = TIER_THRESHOLDS.get(card.tier)
    ready_to_upgrade = threshold is not None and card.total_points >= threshold

    return CardLookup(
        card_id=card.card_id,
        member_name=member.name if member else "Unknown",
        tier=card.tier,
        total_points=card.total_points,
        status=card.status,
        discount_percent=float(tier.discount_percent) if tier else 0,
        welcome_bonus_issued=card.welcome_bonus_issued,
        ready_to_upgrade=ready_to_upgrade,
    )


@router.get("/next-id/{tier}")
async def get_next_card_id(
    tier: str,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    card_id = await generate_card_id(db, tier)
    return {"card_id": card_id}


@router.get("/ready-for-upgrade")
async def get_ready_for_upgrade(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(MemberCard).where(MemberCard.status == "active")
    )
    cards = result.scalars().all()

    ready = []
    for card in cards:
        threshold = TIER_THRESHOLDS.get(card.tier)
        if threshold is not None and card.total_points >= threshold:
            member_result = await db.execute(
                select(Member).where(Member.id == card.member_id)
            )
            member = member_result.scalar_one_or_none()
            ready.append({
                "card_id": card.card_id,
                "member_name": member.name if member else "Unknown",
                "tier": card.tier,
                "total_points": card.total_points,
                "points_needed": 0,
            })

    return ready


@router.get("/tier/{tier}", response_model=list[CardResponse])
async def get_cards_by_tier(
    tier: str,
    status: str = Query("active", regex=r"^(active|upgraded|retired|all)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    query = select(MemberCard).where(MemberCard.tier == tier)
    if status != "all":
        query = query.where(MemberCard.status == status)

    query = query.order_by(MemberCard.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)

    result = await db.execute(query)
    cards = result.scalars().all()
    return [CardResponse.model_validate(c) for c in cards]


@router.post("/upgrade", response_model=CardResponse)
async def upgrade_card(
    request: CardUpgrade,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    # Get current card
    result = await db.execute(
        select(MemberCard).where(MemberCard.card_id == request.current_card_id)
    )
    current_card = result.scalar_one_or_none()

    if not current_card:
        raise HTTPException(status_code=404, detail="Card not found")

    if current_card.status != "active":
        raise HTTPException(status_code=400, detail="Card is not active")

    # Get next tier
    next_tier_name = await get_next_tier_name(current_card.tier)
    if not next_tier_name:
        raise HTTPException(status_code=400, detail="Already at highest tier")

    # Check eligibility
    threshold = TIER_THRESHOLDS.get(current_card.tier)
    if threshold is None or current_card.total_points < threshold:
        raise HTTPException(status_code=400, detail="Not eligible for upgrade yet")

    # Generate new card ID
    new_card_id = await generate_card_id(db, next_tier_name)

    # Create new card
    new_card = MemberCard(
        member_id=current_card.member_id,
        card_id=new_card_id,
        tier=next_tier_name,
        previous_card_id=current_card.card_id,
        status="active",
        points_carried_over=current_card.total_points,
        points_earned=0,
        total_points=current_card.total_points,
        welcome_bonus_issued=False,
    )
    db.add(new_card)

    # Mark old card as upgraded
    current_card.status = "upgraded"

    # Audit log
    await log_audit(db, "upgrade_card", "card", new_card.id, current_user.id, {
        "old_card_id": current_card.card_id,
        "new_card_id": new_card_id,
        "from_tier": current_card.tier,
        "to_tier": next_tier_name,
        "points_carried": current_card.total_points,
    })

    return CardResponse.model_validate(new_card)


@router.put("/{card_id}/welcome-bonus", response_model=MessageResponse)
async def mark_welcome_bonus(
    card_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(MemberCard).where(MemberCard.card_id == card_id)
    )
    card = result.scalar_one_or_none()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    card.welcome_bonus_issued = True

    await log_audit(db, "welcome_bonus_issued", "card", card.id, current_user.id, {
        "card_id": card_id,
        "tier": card.tier,
    })

    return MessageResponse(message="Welcome bonus marked as issued")
