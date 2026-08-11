from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class MemberCard(Base):
    __tablename__ = "member_cards"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False, index=True)
    card_id = Column(String(20), unique=True, nullable=False, index=True)
    tier = Column(String(20), nullable=False, index=True)
    previous_card_id = Column(String(20))
    status = Column(String(20), default="active", index=True)
    points_carried_over = Column(Integer, default=0)
    points_earned = Column(Integer, default=0)
    total_points = Column(Integer, default=0)
    welcome_bonus_issued = Column(Boolean, default=False)
    date_registered = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    member = relationship("Member", back_populates="cards")
    transactions = relationship("Transaction", back_populates="card", lazy="selectin")

    def __repr__(self):
        return f"<MemberCard {self.card_id} ({self.tier})>"
