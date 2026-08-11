from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.database import get_db
from app.models.member import Member
from app.models.card import MemberCard
from app.models.transaction import Transaction
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse, MemberWithCards
from app.schemas.card import CardResponse
from app.schemas.common import PaginatedResponse, MessageResponse
from app.dependencies import get_current_user
from app.utils.card_generator import generate_card_id
from app.utils.audit import log_audit
from app.models.staff import StaffUser

router = APIRouter()


@router.get("", response_model=PaginatedResponse[MemberResponse])
async def list_members(
    search: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    query = select(Member)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Member.name.ilike(search_pattern),
                Member.contact_number.ilike(search_pattern),
                Member.email.ilike(search_pattern),
            )
        )

    # Get total count
    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar() or 0

    # Paginate
    query = query.order_by(Member.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    # Enrich with active card info
    enriched_items = []
    for member in items:
        card_result = await db.execute(
            select(MemberCard)
            .where(MemberCard.member_id == member.id, MemberCard.status == "active")
            .limit(1)
        )
        active_card = card_result.scalar_one_or_none()

        member_data = MemberResponse.model_validate(member)
        if active_card:
            member_data.current_tier = active_card.tier
            member_data.active_card_id = active_card.card_id
        enriched_items.append(member_data)

    return PaginatedResponse(
        items=enriched_items,
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.post("", response_model=MemberResponse, status_code=201)
async def create_member(
    request: MemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    member = Member(
        name=request.name,
        contact_number=request.contact_number,
        email=request.email,
    )
    db.add(member)
    await db.flush()

    # Auto-issue Qualifier card
    card_id = await generate_card_id(db, "qualifier")
    card = MemberCard(
        member_id=member.id,
        card_id=card_id,
        tier="qualifier",
        status="active",
    )
    db.add(card)

    await log_audit(db, "create_member", "member", member.id, current_user.id, {
        "name": member.name,
        "card_id": card_id,
    })

    return MemberResponse.model_validate(member)


@router.get("/search", response_model=list[MemberResponse])
async def search_members(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    search_pattern = f"%{q}%"
    result = await db.execute(
        select(Member)
        .where(
            or_(
                Member.name.ilike(search_pattern),
                Member.contact_number.ilike(search_pattern),
            )
        )
        .limit(limit)
    )
    members = result.scalars().all()
    return [MemberResponse.model_validate(m) for m in members]


@router.get("/{member_id}", response_model=MemberWithCards)
async def get_member(
    member_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    response = MemberWithCards.model_validate(member)
    response.cards = [CardResponse.model_validate(c) for c in member.cards]
    return response


@router.put("/{member_id}", response_model=MemberResponse)
async def update_member(
    member_id: int,
    request: MemberUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if request.name is not None:
        member.name = request.name
    if request.contact_number is not None:
        member.contact_number = request.contact_number
    if request.email is not None:
        member.email = request.email

    await db.flush()
    return MemberResponse.model_validate(member)


@router.get("/{member_id}/transactions")
async def get_member_transactions(
    member_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    query = select(Transaction).where(Transaction.member_id == member_id)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar() or 0

    query = query.order_by(Transaction.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    transactions = result.scalars().all()

    return PaginatedResponse(
        items=transactions,
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )
