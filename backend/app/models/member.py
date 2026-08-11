from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    contact_number = Column(String(20), nullable=False, index=True)
    email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    cards = relationship("MemberCard", back_populates="member", lazy="selectin")
    transactions = relationship("Transaction", back_populates="member", lazy="selectin")

    def __repr__(self):
        return f"<Member {self.name}>"
