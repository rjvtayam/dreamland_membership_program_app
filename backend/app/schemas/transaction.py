from pydantic import BaseModel, Field
from datetime import datetime, date
from decimal import Decimal


class TransactionCreate(BaseModel):
    card_id: str = Field(..., min_length=1, max_length=20)
    token_package_id: int
    notes: str | None = Field(None, max_length=500)


class TransactionResponse(BaseModel):
    id: int
    card_id: str
    member_id: int
    token_package_id: int
    cash_value: Decimal
    points_earned: int
    discount_eligible: bool
    discount_percent: Decimal
    discount_amount: Decimal
    amount_to_collect: Decimal
    staff_user_id: int | None
    notes: str | None
    transaction_date: date
    created_at: datetime

    # Joined fields
    member_name: str | None = None
    package_name: str | None = None
    staff_name: str | None = None

    model_config = {"from_attributes": True}
