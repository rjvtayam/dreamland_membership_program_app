from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.card import MemberCard
from app.models.member import Member


TIER_PREFIXES = {
    "qualifier": "Q",
    "silver": "S",
    "gold": "G",
    "black": "B",
}


async def generate_card_id(db: AsyncSession, tier: str) -> str:
    prefix = TIER_PREFIXES.get(tier, "Q")

    result = await db.execute(
        select(func.count(MemberCard.id)).where(MemberCard.tier == tier)
    )
    count = result.scalar() or 0

    next_number = count + 1
    return f"DLA-{prefix}-{next_number:06d}"


async def get_next_tier_name(current_tier: str) -> str | None:
    tier_order = ["qualifier", "silver", "gold", "black"]
    try:
        current_index = tier_order.index(current_tier)
        if current_index < len(tier_order) - 1:
            return tier_order[current_index + 1]
    except ValueError:
        pass
    return None
