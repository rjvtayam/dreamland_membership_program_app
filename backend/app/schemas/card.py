from pydantic import BaseModel, Field
from datetime import datetime, date


class CardCreate(BaseModel):
    member_id: int
    tier: str = Field(default="qualifier", pattern=r"^(qualifier|silver|gold|black)$")


class CardUpgrade(BaseModel):
    current_card_id: str = Field(..., min_length=1, max_length=20)


class CardResponse(BaseModel):
    id: int
    member_id: int
    card_id: str
    tier: str
    previous_card_id: str | None
    status: str
    points_carried_over: int
    points_earned: int
    total_points: int
    welcome_bonus_issued: bool
    date_registered: date
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CardLookup(BaseModel):
    card_id: str
    member_name: str
    tier: str
    total_points: int
    status: str
    discount_percent: float
    welcome_bonus_issued: bool
    ready_to_upgrade: bool
