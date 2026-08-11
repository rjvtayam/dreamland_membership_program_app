from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog


async def log_audit(
    db: AsyncSession,
    action: str,
    entity_type: str | None = None,
    entity_id: int | None = None,
    staff_user_id: int | None = None,
    details: dict | None = None,
) -> AuditLog:
    audit = AuditLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        staff_user_id=staff_user_id,
        details=details,
    )
    db.add(audit)
    await db.flush()
    return audit
