from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func
from app.database import Base


class TierDefinition(Base):
    __tablename__ = "tier_definitions"

    id = Column(Integer, primary_key=True, index=True)
    tier_name = Column(String(20), unique=True, nullable=False)
    points_required = Column(Integer, nullable=False, default=0)
    discount_percent = Column(Numeric(4, 2), nullable=False, default=0)
    welcome_bonus_tokens = Column(Integer, nullable=False, default=0)
    sort_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<TierDefinition {self.tier_name}>"
