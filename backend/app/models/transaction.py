from sqlalchemy import Column, Integer, String, Numeric, Boolean, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(String(20), ForeignKey("member_cards.card_id"), nullable=False, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False, index=True)
    token_package_id = Column(Integer, ForeignKey("token_packages.id"), nullable=False)
    cash_value = Column(Numeric(10, 2), nullable=False)
    points_earned = Column(Integer, nullable=False)
    discount_eligible = Column(Boolean, default=False)
    discount_percent = Column(Numeric(4, 2), default=0)
    discount_amount = Column(Numeric(10, 2), default=0)
    amount_to_collect = Column(Numeric(10, 2), nullable=False)
    staff_user_id = Column(Integer, ForeignKey("staff_users.id"))
    notes = Column(Text)
    transaction_date = Column(Date, server_default=func.current_date(), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    card = relationship("MemberCard", back_populates="transactions")
    member = relationship("Member", back_populates="transactions")
    token_package = relationship("TokenPackage", lazy="selectin")
    staff_user = relationship("StaffUser", lazy="selectin")

    def __repr__(self):
        return f"<Transaction {self.id} - {self.card_id}>"
