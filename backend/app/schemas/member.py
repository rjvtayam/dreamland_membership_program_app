from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.card import CardResponse


class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    contact_number: str = Field(..., min_length=1, max_length=20)
    email: str | None = Field(None, max_length=255)


class MemberUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=150)
    contact_number: str | None = Field(None, min_length=1, max_length=20)
    email: str | None = Field(None, max_length=255)


class MemberResponse(BaseModel):
    id: int
    name: str
    contact_number: str
    email: str | None
    created_at: datetime
    updated_at: datetime
    current_tier: str | None = None
    active_card_id: str | None = None

    model_config = {"from_attributes": True}


class MemberWithCards(MemberResponse):
    cards: list[CardResponse] = []
