from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta
from app.database import get_db
from app.models.member import Member
from app.models.card import MemberCard
from app.models.transaction import Transaction
from app.schemas.dashboard import DashboardStats, TierDistribution, RevenueData, UpgradeAlert
from app.dependencies import get_current_user
from app.models.staff import StaffUser

router = APIRouter()

TIER_THRESHOLDS = {
    "qualifier": 1000,
    "silver": 3500,
    "gold": 5500,
    "black": None,
}


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    # Total members
    members_result = await db.execute(select(func.count(Member.id)))
    total_members = members_result.scalar() or 0

    # Active cards
    cards_result = await db.execute(
        select(func.count(MemberCard.id)).where(MemberCard.status == "active")
    )
    active_cards = cards_result.scalar() or 0

    # Revenue today
    today = date.today()
    revenue_result = await db.execute(
        select(func.sum(Transaction.amount_to_collect))
        .where(Transaction.transaction_date == today)
    )
    total_revenue_today = revenue_result.scalar() or 0

    # Transactions today
    tx_result = await db.execute(
        select(func.count(Transaction.id))
        .where(Transaction.transaction_date == today)
    )
    total_transactions_today = tx_result.scalar() or 0

    # Pending upgrades
    cards_all = await db.execute(
        select(MemberCard).where(MemberCard.status == "active")
    )
    cards = cards_all.scalars().all()
    pending_upgrades = sum(
        1 for c in cards
        if TIER_THRESHOLDS.get(c.tier) is not None
        and c.total_points >= TIER_THRESHOLDS[c.tier]
    )

    return DashboardStats(
        total_members=total_members,
        active_cards=active_cards,
        total_revenue_today=total_revenue_today,
        pending_upgrades=pending_upgrades,
        total_transactions_today=total_transactions_today,
    )


@router.get("/tier-distribution", response_model=list[TierDistribution])
async def get_tier_distribution(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(MemberCard.tier, func.count(MemberCard.id))
        .where(MemberCard.status == "active")
        .group_by(MemberCard.tier)
    )
    rows = result.all()

    return [TierDistribution(tier=row[0], count=row[1]) for row in rows]


@router.get("/revenue", response_model=list[RevenueData])
async def get_revenue(
    days: int = Query(7, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    start_date = date.today() - timedelta(days=days)

    result = await db.execute(
        select(
            Transaction.transaction_date,
            func.sum(Transaction.amount_to_collect).label("revenue"),
            func.count(Transaction.id).label("transactions"),
        )
        .where(Transaction.transaction_date >= start_date)
        .group_by(Transaction.transaction_date)
        .order_by(Transaction.transaction_date)
    )
    rows = result.all()

    return [
        RevenueData(
            date=str(row[0]),
            revenue=row[1],
            transactions=row[2],
        )
        for row in rows
    ]


@router.get("/upgrade-alerts", response_model=list[UpgradeAlert])
async def get_upgrade_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(MemberCard).where(MemberCard.status == "active")
    )
    cards = result.scalars().all()

    alerts = []
    for card in cards:
        threshold = TIER_THRESHOLDS.get(card.tier)
        if threshold is not None and card.total_points >= threshold:
            member_result = await db.execute(
                select(Member).where(Member.id == card.member_id)
            )
            member = member_result.scalar_one_or_none()
            alerts.append(UpgradeAlert(
                card_id=card.card_id,
                member_name=member.name if member else "Unknown",
                tier=card.tier,
                total_points=card.total_points,
                points_needed=0,
            ))

    return alerts
