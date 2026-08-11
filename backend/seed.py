import asyncio
from app.database import async_session_factory, engine, Base
from app.models.tier import TierDefinition
from app.models.package import TokenPackage
from app.models.staff import StaffUser
from app.dependencies import hash_password


async def seed():
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as db:
        # Check if data already exists
        from sqlalchemy import select, func

        result = await db.execute(select(func.count(TierDefinition.id)))
        if result.scalar() > 0:
            print("Database already seeded.")
            return

        # Seed tiers
        tiers = [
            TierDefinition(tier_name="qualifier", points_required=0, discount_percent=0, welcome_bonus_tokens=0, sort_order=1),
            TierDefinition(tier_name="silver", points_required=1000, discount_percent=5, welcome_bonus_tokens=100, sort_order=2),
            TierDefinition(tier_name="gold", points_required=3500, discount_percent=10, welcome_bonus_tokens=150, sort_order=3),
            TierDefinition(tier_name="black", points_required=5500, discount_percent=15, welcome_bonus_tokens=250, sort_order=4),
        ]
        db.add_all(tiers)

        # Seed token packages
        packages = [
            TokenPackage(name="1 Token", cash_value=5, points_earned=1),
            TokenPackage(name="5 Tokens", cash_value=25, points_earned=1),
            TokenPackage(name="10 Tokens", cash_value=50, points_earned=5),
            TokenPackage(name="20 Tokens", cash_value=100, points_earned=10),
            TokenPackage(name="30 Tokens", cash_value=150, points_earned=15),
            TokenPackage(name="50 Tokens", cash_value=250, points_earned=20),
        ]
        db.add_all(packages)

        # Seed default admin user
        admin = StaffUser(
            name="Admin",
            email="admin@dreamland.com",
            password_hash=hash_password("admin123"),
            role="admin",
        )
        db.add(admin)

        # Seed default cashier
        cashier = StaffUser(
            name="Cashier",
            email="cashier@dreamland.com",
            password_hash=hash_password("cashier123"),
            role="cashier",
        )
        db.add(cashier)

        await db.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
