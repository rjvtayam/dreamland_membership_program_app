from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.tier import TierDefinition
from app.models.package import TokenPackage
from app.dependencies import get_current_user, require_admin
from app.models.staff import StaffUser

router = APIRouter()


@router.get("/tiers")
async def get_tiers(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(
        select(TierDefinition).order_by(TierDefinition.sort_order)
    )
    tiers = result.scalars().all()
    return [
        {
            "id": t.id,
            "tier_name": t.tier_name,
            "points_required": t.points_required,
            "discount_percent": float(t.discount_percent),
            "welcome_bonus_tokens": t.welcome_bonus_tokens,
            "sort_order": t.sort_order,
        }
        for t in tiers
    ]


@router.put("/tiers/{tier_id}")
async def update_tier(
    tier_id: int,
    points_required: int | None = None,
    discount_percent: float | None = None,
    welcome_bonus_tokens: int | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(require_admin),
):
    result = await db.execute(select(TierDefinition).where(TierDefinition.id == tier_id))
    tier = result.scalar_one_or_none()

    if not tier:
        raise HTTPException(status_code=404, detail="Tier not found")

    if points_required is not None:
        tier.points_required = points_required
    if discount_percent is not None:
        tier.discount_percent = discount_percent
    if welcome_bonus_tokens is not None:
        tier.welcome_bonus_tokens = welcome_bonus_tokens

    await db.flush()

    return {
        "message": "Tier updated successfully",
        "tier_name": tier.tier_name,
    }


@router.get("/packages")
async def get_packages(
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(get_current_user),
):
    result = await db.execute(select(TokenPackage))
    packages = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "cash_value": float(p.cash_value),
            "points_earned": p.points_earned,
            "is_active": p.is_active,
        }
        for p in packages
    ]


@router.put("/packages/{package_id}")
async def update_package(
    package_id: int,
    cash_value: float | None = None,
    points_earned: int | None = None,
    is_active: bool | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: StaffUser = Depends(require_admin),
):
    result = await db.execute(
        select(TokenPackage).where(TokenPackage.id == package_id)
    )
    package = result.scalar_one_or_none()

    if not package:
        raise HTTPException(status_code=404, detail="Package not found")

    if cash_value is not None:
        package.cash_value = cash_value
    if points_earned is not None:
        package.points_earned = points_earned
    if is_active is not None:
        package.is_active = is_active

    await db.flush()

    return {"message": "Package updated successfully"}
