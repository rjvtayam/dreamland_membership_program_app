from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class TokenPackage(Base):
    __tablename__ = "token_packages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    cash_value = Column(Numeric(10, 2), nullable=False)
    points_earned = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<TokenPackage {self.name}>"
