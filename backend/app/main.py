from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.api import auth, members, cards, transactions, dashboard, reports, settings as settings_api


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"Starting Dreamland Arcade API - {settings.ENVIRONMENT}")
    yield
    # Shutdown
    print("Shutting down Dreamland Arcade API")


app = FastAPI(
    title="Dreamland Arcade API",
    description="Membership Card Management System",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(members.router, prefix="/api/members", tags=["Members"])
app.include_router(cards.router, prefix="/api/cards", tags=["Cards"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(settings_api.router, prefix="/api/settings", tags=["Settings"])


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/api/docs")


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "dreamland-api",
        "version": "1.0.0",
    }
