from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from datetime import date
from app.database import get_db
from app.models.transaction import Transaction
from app.models.card import MemberCard
from app.models.package import TokenPackage
from app.models.tier import TierDefinition
from app.models.member import Member
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.schemas.common import PaginatedResponse, MessageResponse
from app.dependencies import get_current_user
from app.utils.audit import log_audit
from app.models.staff import StaffUser

router = APIRouter()

DISCOUNT_THRESHOLD = Decimal("150.00")

TIER_THRESHOLDS = {
    "qualifier": 1000,
    "silver": 3500,
    "gold": 5500,
    "black": None,
}


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    request: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    # 1. Get card
    card_result = await db.execute(
        select(MemberCard).where(MemberCard.card_id == request.card_id)
    )
    card = card_result.scalar_one_or_none()

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    if card.status != "active":
        raise HTTPException(status_code=400, detail="Card is not active")

    # 2. Get token package
    package_result = await db.execute(
        select(TokenPackage).where(TokenPackage.id == request.token_package_id)
    )
    package = package_result.scalar_one_or_none()

    if not package or not package.is_active:
        raise HTTPException(status_code=404, detail="Token package not found")

    # 3. Get tier discount
    tier_result = await db.execute(
        select(TierDefinition).where(TierDefinition.tier_name == card.tier)
    )
    tier = tier_result.scalar_one_or_none()

    # 4. Calculate discount
    discount_eligible = package.cash_value >= DISCOUNT_THRESHOLD
    discount_percent = tier.discount_percent if discount_eligible and tier else Decimal("0.00")
    discount_amount = (package.cash_value * discount_percent / 100).quantize(Decimal("0.01"))
    amount_to_collect = package.cash_value - discount_amount

    # 5. Create transaction
    transaction = Transaction(
        card_id=card.card_id,
        member_id=card.member_id,
        token_package_id=package.id,
        cash_value=package.cash_value,
        points_earned=package.points_earned,
        discount_eligible=discount_eligible,
        discount_percent=discount_percent,
        discount_amount=discount_amount,
        amount_to_collect=amount_to_collect,
        staff_user_id=current_user.id,
        notes=request.notes,
    )
    db.add(transaction)

    # 6. Update card points
    card.points_earned += package.points_earned
    card.total_points = card.points_carried_over + card.points_earned

    # 7. Audit log
    await log_audit(db, "create_transaction", "transaction", None, current_user.id, {
        "card_id": card.card_id,
        "package": package.name,
        "amount": float(amount_to_collect),
        "points": package.points_earned,
    })

    await db.flush()

    # Build response
    member_result = await db.execute(select(Member).where(Member.id == card.member_id))
    member = member_result.scalar_one_or_none()

    response = TransactionResponse.model_validate(transaction)
    response.member_name = member.name if member else None
    response.package_name = package.name
    response.staff_name = current_user.name

    return response


@router.get("", response_model=PaginatedResponse[TransactionResponse])
async def list_transactions(
    card_id: str | None = None,
    member_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    query = select(Transaction)

    if card_id:
        query = query.where(Transaction.card_id == card_id)
    if member_id:
        query = query.where(Transaction.member_id == member_id)
    if start_date:
        query = query.where(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.where(Transaction.transaction_date <= end_date)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar() or 0

    query = query.order_by(Transaction.created_at.desc())
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    transactions = result.scalars().all()

    return PaginatedResponse(
        items=[TransactionResponse.model_validate(t) for t in transactions],
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit,
    )


@router.get("/today")
async def get_today_transactions(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(Transaction)
        .where(Transaction.transaction_date == date.today())
        .order_by(Transaction.created_at.desc())
    )
    transactions = result.scalars().all()

    return [TransactionResponse.model_validate(t) for t in transactions]


@router.get("/summary")
async def get_transaction_summary(
    start_date: date | None = None,
    end_date: date | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    query = select(
        func.count(Transaction.id).label("total_transactions"),
        func.sum(Transaction.amount_to_collect).label("total_revenue"),
        func.sum(Transaction.points_earned).label("total_points"),
        func.sum(Transaction.discount_amount).label("total_discounts"),
    )

    if start_date:
        query = query.where(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.where(Transaction.transaction_date <= end_date)

    result = await db.execute(query)
    row = result.one()

    return {
        "total_transactions": row.total_transactions or 0,
        "total_revenue": float(row.total_revenue or 0),
        "total_points": row.total_points or 0,
        "total_discounts": float(row.total_discounts or 0),
    }
