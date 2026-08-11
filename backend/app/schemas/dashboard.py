from pydantic import BaseModel
from decimal import Decimal


class DashboardStats(BaseModel):
    total_members: int
    active_cards: int
    total_revenue_today: Decimal
    pending_upgrades: int
    total_transactions_today: int


class TierDistribution(BaseModel):
    tier: str
    count: int


class RevenueData(BaseModel):
    date: str
    revenue: Decimal
    transactions: int


class UpgradeAlert(BaseModel):
    card_id: str
    member_name: str
    tier: str
    total_points: int
    points_needed: int
