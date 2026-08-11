from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date
from app.database import get_db
from app.models.transaction import Transaction
from app.models.card import MemberCard
from app.dependencies import get_current_user
from app.models.staff import StaffUser

router = APIRouter()


@router.get("/revenue-by-tier")
async def revenue_by_tier(
    start_date: date | None = None,
    end_date: date | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    query = (
        select(
            MemberCard.tier,
            func.sum(Transaction.amount_to_collect).label("revenue"),
            func.count(Transaction.id).label("transactions"),
        )
        .join(MemberCard, Transaction.card_id == MemberCard.card_id)
    )

    if start_date:
        query = query.where(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.where(Transaction.transaction_date <= end_date)

    query = query.group_by(MemberCard.tier)
    result = await db.execute(query)
    rows = result.all()

    return [
        {"tier": row[0], "revenue": float(row[1] or 0), "transactions": row[2]}
        for row in rows
    ]


@router.get("/top-members")
async def top_members(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    from app.models.member import Member

    result = await db.execute(
        select(
            Member.id,
            Member.name,
            func.sum(Transaction.amount_to_collect).label("total_spent"),
            func.count(Transaction.id).label("total_transactions"),
        )
        .join(Transaction, Member.id == Transaction.member_id)
        .group_by(Member.id, Member.name)
        .order_by(func.sum(Transaction.amount_to_collect).desc())
        .limit(limit)
    )
    rows = result.all()

    return [
        {
            "member_id": row[0],
            "name": row[1],
            "total_spent": float(row[2] or 0),
            "total_transactions": row[3],
        }
        for row in rows
    ]


@router.get("/package-popularity")
async def package_popularity(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    from app.models.package import TokenPackage

    result = await db.execute(
        select(
            TokenPackage.name,
            func.count(Transaction.id).label("count"),
            func.sum(Transaction.cash_value).label("total_value"),
        )
        .join(Transaction, TokenPackage.id == Transaction.token_package_id)
        .group_by(TokenPackage.id, TokenPackage.name)
        .order_by(func.count(Transaction.id).desc())
    )
    rows = result.all()

    return [
        {
            "package_name": row[0],
            "count": row[1],
            "total_value": float(row[2] or 0),
        }
        for row in rows
    ]
