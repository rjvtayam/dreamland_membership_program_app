# DREAMLAND ARCADE MEMBERSHIP CARD SYSTEM
## Full Architecture & Implementation Plan
### React.js + FastAPI + PostgreSQL

---

## 1. BUSINESS REQUIREMENTS SUMMARY

### Membership Tiers
| Tier | Points Required | Discount % | Welcome Bonus (Tokens) |
|------|----------------|------------|----------------------|
| Qualifier | 0 | 0% | 0 |
| Silver | 1,000 | 5% | 100 |
| Gold | 3,500 | 10% | 150 |
| Black | 5,500 | 15% | 250 |

### Points Earning Rate
| Token Package | Cash Value | Points Earned |
|--------------|------------|---------------|
| 1 Token | P5 | 1 |
| 5 Tokens | P25 | 1 |
| 10 Tokens | P50 | 5 |
| 20 Tokens | P100 | 10 |
| 30 Tokens | P150 | 15 |
| 50 Tokens | P250 | 20 |

### Core Workflows
1. New member -> Issue Qualifier card -> Register
2. Purchase -> Log on tier tab -> Auto-calc points & discount
3. Upgrade Check -> Total Points >= next tier -> Flag "Ready to Upgrade"
4. Tier Upgrade -> NEW card -> Link Previous Card -> Mark old "Upgraded" -> Welcome Bonus
5. Discount -> Only when purchase >= P150 -> Tier discount %

### Card ID Format
- Qualifier: DLA-Q-000001
- Silver: DLA-S-000001
- Gold: DLA-G-000001
- Black: DLA-B-000001

---

## 2. TECHNOLOGY STACK

### Why This Stack?
- FastAPI is async, high-performance Python backend ideal for transaction-heavy systems
- React.js SPA gives full control over UI/UX, no server rendering overhead
- PostgreSQL handles millions of rows with proper indexing and partitioning
- Decoupled frontend/backend = independent scaling, separate deployments, team parallelism

### Frontend (React.js)
- React 18 with TypeScript
- Vite - Lightning-fast build tool (faster than CRA)
- React Router v6 - Client-side routing
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - High-quality component library
- TanStack Query (React Query) - Server state management & caching
- Zustand - Lightweight client state management
- Recharts - Dashboard charts and analytics
- React Hook Form + Zod - Form validation
- Axios - HTTP client with interceptors
- Date-fns - Date formatting
- React Hot Toast - Notifications

### Backend (FastAPI + Python)
- Python 3.12
- FastAPI - High-performance async API framework
- SQLAlchemy 2.0 - Async ORM with full type hints
- Alembic - Database migrations
- Pydantic v2 - Request/response validation
- PostgreSQL 16 - Primary database
- Redis - Session cache + rate limiting (optional)
- python-jose - JWT token handling
- passlib[bcrypt] - Password hashing
- uvicorn - ASGI server
- python-multipart - File uploads
- httpx - Async HTTP client (for external APIs)

### Infrastructure
- Docker + Docker Compose - Containerized development & deployment
- Nginx - Reverse proxy + static file serving
- VPS (Hetzner/DigitalOcean) - Backend hosting
- Vercel/Cloudflare Pages - Frontend hosting (or same VPS)
- Cloudflare - CDN + DNS + DDoS protection
- GitHub Actions - CI/CD pipelines

### Dev Tools
- ESLint + Prettier - Frontend code quality
- Ruff + Black - Python code formatting
- Vitest - Frontend unit testing
- Pytest - Backend unit/integration testing
- Playwright - E2E testing
- PgAdmin / DBeaver - Database management

---

## 3. SYSTEM ARCHITECTURE DIAGRAM

```
+------------------+         +------------------+         +------------------+
|                  |         |                  |         |                  |
|   REACT.JS SPA   |  HTTPS  |  FASTAPI SERVER   |  SQL    |   POSTGRESQL     |
|   (Vite Build)   |-------->|  (Uvicorn/ASGI)  |-------->|   DATABASE       |
|                  |         |                  |         |                  |
+------------------+         +------------------+         +------------------+
       |                           |       |                      |
       |                           |       |                      |
       v                           v       v                      v
  - Dashboard               - JWT Auth   - SQLAlchemy        - Members
  - Member Mgmt             - REST API   - Alembic Migrations - Cards
  - POS                     - Business   - Pydantic Models    - Transactions
  - Card Management           Logic     - Rate Limiting      - Tier Defs
  - Reports                 - Audit Log  - Caching            - Audit Log
  - Settings                - WebSocket                            - Packages
    (real-time)

+------------------+
|    REDIS (opt)    |
|  - Session Cache  |
|  - Rate Limiting  |
|  - Real-time      |
+------------------+
```

### Request Flow
```
1. Staff opens React app in browser
2. Staff logs in -> POST /api/auth/login -> FastAPI validates -> Returns JWT
3. Staff enters card ID -> GET /api/cards/lookup/DLA-S-000001
4. FastAPI queries PostgreSQL -> Returns card + member + tier info
5. Staff selects token package -> POST /api/transactions
6. FastAPI:
   a. Validates request (Pydantic)
   b. Calculates points + discount (business logic)
   c. Saves transaction (SQLAlchemy)
   d. Updates card points
   e. Checks upgrade eligibility
   f. Returns transaction result
7. React updates UI instantly (React Query cache invalidation)
```

---

## 4. DATABASE SCHEMA

### Entity Relationship Diagram

```
staff_users          token_packages        tier_definitions
+-----------+        +---------------+      +------------------+
| id (PK)   |        | id (PK)       |      | id (PK)          |
| name      |        | name          |      | tier_name        |
| email     |        | cash_value    |      | points_required  |
| pass_hash |        | points_earned |      | discount_percent |
| role      |        | is_active     |      | welcome_bonus    |
| is_active |        | created_at    |      | sort_order       |
+-----------+        +---------------+      | created_at       |
                                            +------------------+

members (1) ----< (N) member_cards (1) ----< (N) transactions
+-----------+        +------------------+     +------------------+
| id (PK)   |        | id (PK)          |     | id (PK)          |
| name      |        | member_id (FK)   |     | card_id (FK)     |
| contact   |        | card_id (UNIQUE) |     | member_id (FK)   |
| email     |        | tier             |     | token_pkg_id(FK) |
| created_at|        | previous_card_id |     | cash_value       |
| updated_at|        | status           |     | points_earned    |
+-----------+        | points_carried   |     | discount info    |
                     | points_earned    |     | staff_user_id(FK)|
                     | total_points     |     | transaction_date |
                     | welcome_bonus    |     | created_at       |
                     | date_registered  |     +------------------+
                     | created_at       |
                     | updated_at       |
                     +------------------+

audit_log
+------------------+
| id (PK)          |
| action           |
| entity_type      |
| entity_id        |
| staff_user_id(FK)|
| details (JSONB)  |
| created_at       |
+------------------+
```

### Full SQL Schema (PostgreSQL)

```sql
-- =============================================
-- TIER DEFINITIONS (Reference Data)
-- =============================================
CREATE TABLE tier_definitions (
    id SERIAL PRIMARY KEY,
    tier_name VARCHAR(20) NOT NULL UNIQUE,
    points_required INTEGER NOT NULL DEFAULT 0,
    discount_percent NUMERIC(4,2) NOT NULL DEFAULT 0,
    welcome_bonus_tokens INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO tier_definitions (tier_name, points_required, discount_percent, welcome_bonus_tokens, sort_order) VALUES
('qualifier', 0, 0.00, 0, 1),
('silver', 1000, 5.00, 100, 2),
('gold', 3500, 10.00, 150, 3),
('black', 5500, 15.00, 250, 4);

-- =============================================
-- TOKEN PACKAGES (Reference Data)
-- =============================================
CREATE TABLE token_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    cash_value NUMERIC(10,2) NOT NULL,
    points_earned INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO token_packages (name, cash_value, points_earned) VALUES
('1 Token', 5.00, 1),
('5 Tokens', 25.00, 1),
('10 Tokens', 50.00, 5),
('20 Tokens', 100.00, 10),
('30 Tokens', 150.00, 15),
('50 Tokens', 250.00, 20);

-- =============================================
-- STAFF USERS
-- =============================================
CREATE TABLE staff_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'cashier' CHECK (role IN ('admin', 'cashier')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MEMBERS
-- =============================================
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MEMBER CARDS
-- =============================================
CREATE TABLE member_cards (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
    card_id VARCHAR(20) NOT NULL UNIQUE,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('qualifier', 'silver', 'gold', 'black')),
    previous_card_id VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'upgraded', 'retired')),
    points_carried_over INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    welcome_bonus_issued BOOLEAN DEFAULT false,
    date_registered DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRANSACTIONS
-- =============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    card_id VARCHAR(20) NOT NULL REFERENCES member_cards(card_id),
    member_id INTEGER NOT NULL REFERENCES members(id),
    token_package_id INTEGER NOT NULL REFERENCES token_packages(id),
    cash_value NUMERIC(10,2) NOT NULL,
    points_earned INTEGER NOT NULL,
    discount_eligible BOOLEAN DEFAULT false,
    discount_percent NUMERIC(4,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    amount_to_collect NUMERIC(10,2) NOT NULL,
    staff_user_id INTEGER REFERENCES staff_users(id),
    notes TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG
-- =============================================
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    staff_user_id INTEGER REFERENCES staff_users(id),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES (Performance Optimization)
-- =============================================
CREATE INDEX idx_members_contact ON members(contact_number);
CREATE INDEX idx_members_name ON members(name);

CREATE INDEX idx_member_cards_member_id ON member_cards(member_id);
CREATE INDEX idx_member_cards_tier ON member_cards(tier);
CREATE INDEX idx_member_cards_status ON member_cards(status);
CREATE INDEX idx_member_cards_card_id ON member_cards(card_id);

CREATE INDEX idx_transactions_card_id ON transactions(card_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_staff ON transactions(staff_user_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);

CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_staff ON audit_log(staff_user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- =============================================
-- FUNCTIONS (Auto-update timestamps)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_cards_updated_at BEFORE UPDATE ON member_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

---

## 5. FASTAPI BACKEND ARCHITECTURE

### Project Structure
```
backend/
  alembic/                      - Database migrations
    versions/                   - Migration files
    env.py
    script.py.mako
  app/
    __init__.py
    main.py                     - FastAPI app entry point
    config.py                   - Settings (env vars, config)
    database.py                 - SQLAlchemy engine + session
    dependencies.py             - Dependency injection (get_db, get_current_user)
    models/                     - SQLAlchemy ORM models
      __init__.py
      member.py                 - Member model
      card.py                   - MemberCard model
      transaction.py            - Transaction model
      staff.py                  - StaffUser model
      tier.py                   - TierDefinition model
      package.py                - TokenPackage model
      audit.py                  - AuditLog model
    schemas/                    - Pydantic request/response schemas
      __init__.py
      member.py                 - MemberCreate, MemberResponse
      card.py                   - CardCreate, CardResponse, CardUpgrade
      transaction.py            - TransactionCreate, TransactionResponse
      auth.py                   - LoginRequest, TokenResponse
      dashboard.py              - DashboardStats, TierDistribution
      common.py                 - PaginatedResponse, MessageResponse
    api/                        - API route handlers
      __init__.py
      auth.py                   - /api/auth/*
      members.py                - /api/members/*
      cards.py                  - /api/cards/*
      transactions.py           - /api/transactions/*
      dashboard.py              - /api/dashboard/*
      reports.py                - /api/reports/*
      settings.py               - /api/settings/*
    services/                   - Business logic layer
      __init__.py
      member_service.py         - Member CRUD operations
      card_service.py           - Card management + upgrade logic
      transaction_service.py    - Transaction processing + points calc
      dashboard_service.py      - Stats aggregation
      auth_service.py           - Authentication + JWT
    utils/                      - Helper functions
      __init__.py
      card_generator.py         - Generate next card ID
      validators.py             - Input validation helpers
      date_helpers.py           - Date formatting
    middleware/                  - Custom middleware
      __init__.py
      cors.py                   - CORS configuration
      logging.py                - Request logging
      rate_limit.py             - Rate limiting
  tests/                        - Pytest test files
    __init__.py
    test_auth.py
    test_members.py
    test_cards.py
    test_transactions.py
  .env.example                  - Environment variables
  requirements.txt              - Python dependencies
  pyproject.toml                - Project config (ruff, pytest, etc.)
  alembic.ini                   - Alembic config
  Dockerfile                    - Backend Docker image
  docker-compose.yml            - Full stack orchestration
```

### FastAPI Application Entry Point
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, members, cards, transactions, dashboard, reports, settings as settings_api
from app.middleware.cors import cors_origins

app = FastAPI(
    title="Dreamland Arcade API",
    description="Membership Card Management System",
    version="1.0.0",
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "dreamland-api"}
```

### Configuration
```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
```

### Database Connection
```python
# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False, pool_size=20, max_overflow=10)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

### API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Staff login, returns JWT |
| POST | /api/auth/logout | Invalidate session |
| GET | /api/auth/me | Get current user info |
| PUT | /api/auth/password | Change password |

#### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/members | List members (paginated, searchable) |
| POST | /api/members | Register new member + issue Qualifier card |
| GET | /api/members/{id} | Get member details + all cards |
| PUT | /api/members/{id} | Update member info |
| DELETE | /api/members/{id} | Soft delete member |
| GET | /api/members/{id}/cards | Get all cards for member |
| GET | /api/members/{id}/transactions | Get all transactions for member |
| GET | /api/members/search?q= | Search members by name/phone/card |

#### Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cards/lookup/{card_id} | Lookup card by card_id |
| GET | /api/cards/{id} | Get card details |
| POST | /api/cards/upgrade | Process tier upgrade |
| PUT | /api/cards/{id}/welcome-bonus | Mark welcome bonus issued |
| GET | /api/cards/ready-for-upgrade | List upgrade-eligible cards |
| GET | /api/cards/tier/{tier} | List cards of specific tier |
| GET | /api/cards/next-id/{tier} | Get next available card ID |

#### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/transactions | Log a new transaction |
| GET | /api/transactions | List transactions (paginated, filterable) |
| GET | /api/transactions/{id} | Get transaction details |
| GET | /api/transactions/today | Get today's transactions |
| GET | /api/transactions/summary | Get summary stats |
| GET | /api/transactions/export | Export transactions (CSV/Excel) |

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Overall statistics |
| GET | /api/dashboard/tier-distribution | Member count per tier |
| GET | /api/dashboard/revenue | Revenue over time |
| GET | /api/dashboard/recent-activity | Recent transactions |
| GET | /api/dashboard/upgrade-alerts | Members ready to upgrade |

#### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/settings/tiers | Get tier definitions |
| PUT | /api/settings/tiers/{id} | Update tier settings |
| GET | /api/settings/packages | Get token packages |
| PUT | /api/settings/packages/{id} | Update token package |
| POST | /api/settings/packages | Create new token package |

### Business Logic Services

#### Transaction Service
```python
# app/services/transaction_service.py
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Transaction, MemberCard, TierDefinition, TokenPackage

DISCOUNT_THRESHOLD = Decimal("150.00")

async def process_transaction(
    db: AsyncSession,
    card_id: str,
    token_package_id: int,
    staff_user_id: int,
    notes: str = None
) -> Transaction:
    # 1. Get card with member info
    card = await get_card_with_member(db, card_id)

    # 2. Get token package
    package = await get_token_package(db, token_package_id)

    # 3. Get tier discount
    tier = await get_tier_definition(db, card.tier)

    # 4. Calculate discount
    discount_eligible = package.cash_value >= DISCOUNT_THRESHOLD
    discount_percent = tier.discount_percent if discount_eligible else Decimal("0.00")
    discount_amount = (package.cash_value * discount_percent / 100).quantize(Decimal("0.01"))
    amount_to_collect = package.cash_value - discount_amount

    # 5. Create transaction
    transaction = Transaction(
        card_id=card_id,
        member_id=card.member_id,
        token_package_id=token_package_id,
        cash_value=package.cash_value,
        points_earned=package.points_earned,
        discount_eligible=discount_eligible,
        discount_percent=discount_percent,
        discount_amount=discount_amount,
        amount_to_collect=amount_to_collect,
        staff_user_id=staff_user_id,
        notes=notes,
    )
    db.add(transaction)

    # 6. Update card points
    card.points_earned += package.points_earned
    card.total_points = card.points_carried_over + card.points_earned

    # 7. Check upgrade eligibility
    next_tier = await get_next_tier(db, card.tier)
    ready_to_upgrade = next_tier is not None and card.total_points >= next_tier.points_required

    await db.flush()
    return transaction, ready_to_upgrade
```

#### Card Upgrade Service
```python
# app/services/card_service.py
async def upgrade_card(
    db: AsyncSession,
    current_card_id: str,
    staff_user_id: int
) -> MemberCard:
    # 1. Get current card
    current_card = await get_card(db, current_card_id)

    # 2. Get next tier
    next_tier = await get_next_tier(db, current_card.tier)
    if not next_tier:
        raise ValueError("Already at highest tier")

    # 3. Generate new card ID
    new_card_id = await generate_card_id(db, next_tier.tier_name)

    # 4. Create new card
    new_card = MemberCard(
        member_id=current_card.member_id,
        card_id=new_card_id,
        tier=next_tier.tier_name,
        previous_card_id=current_card_id,
        status="active",
        points_carried_over=current_card.total_points,
        points_earned=0,
        total_points=current_card.total_points,
        welcome_bonus_issued=False,
    )
    db.add(new_card)

    # 5. Mark old card as upgraded
    current_card.status = "upgraded"

    # 6. Audit log
    await log_audit(db, "upgrade_card", "card", new_card.id, staff_user_id, {
        "old_card_id": current_card_id,
        "new_card_id": new_card_id,
        "from_tier": current_card.tier,
        "to_tier": next_tier.tier_name,
        "points_carried": current_card.total_points,
    })

    await db.flush()
    return new_card
```

---

## 6. REACT.JS FRONTEND ARCHITECTURE

### Project Structure
```
frontend/
  public/
    favicon.ico
    logo.svg
  src/
    main.tsx                    - App entry point
    App.tsx                     - Router setup
    api/                        - API client layer
      client.ts                 - Axios instance with interceptors
      auth.ts                   - Auth API calls
      members.ts                - Members API calls
      cards.ts                  - Cards API calls
      transactions.ts           - Transactions API calls
      dashboard.ts              - Dashboard API calls
      reports.ts                - Reports API calls
      settings.ts               - Settings API calls
    components/                 - React components
      ui/                       - shadcn/ui base components
        button.tsx
        input.tsx
        dialog.tsx
        table.tsx
        badge.tsx
        card.tsx
        select.tsx
        toast.tsx
        pagination.tsx
        skeleton.tsx
      layout/
        AppLayout.tsx           - Main app layout with sidebar
        Sidebar.tsx             - Navigation sidebar
        TopBar.tsx              - Header bar
        MobileNav.tsx           - Mobile bottom nav
      members/
        MemberForm.tsx          - Registration/edit form
        MemberCard.tsx          - Member info display
        MemberSearchBar.tsx     - Search input with results
        MemberTable.tsx         - Members data table
        MemberHistory.tsx       - Transaction history
      pos/
        CardLookup.tsx          - Card ID input field
        PackageGrid.tsx         - Token package selection grid
        TransactionPreview.tsx  - Pre-submit summary
        DiscountBadge.tsx       - Discount indicator
        POSPage.tsx             - Full POS screen
      cards/
        CardBadge.tsx           - Visual tier card
        CardTable.tsx           - Cards data table
        UpgradeDialog.tsx       - Upgrade confirmation
        WelcomeBonusDialog.tsx  - Mark bonus issued
        TierProgress.tsx        - Progress bar
        UpgradeQueue.tsx        - Ready to upgrade list
      dashboard/
        StatsCards.tsx          - KPI summary cards
        TierDistribution.tsx    - Pie chart
        RevenueChart.tsx        - Bar/line chart
        RecentActivity.tsx      - Activity feed
        UpgradeAlerts.tsx       - Upgrade notifications
      shared/
        DataTable.tsx           - Reusable table component
        Pagination.tsx          - Page navigation
        LoadingSpinner.tsx      - Loading state
        EmptyState.tsx          - No data placeholder
        ConfirmDialog.tsx       - Confirmation modal
        ErrorBoundary.tsx       - Error handler
    hooks/                      - Custom React hooks
      useAuth.ts                - Authentication hook
      useMembers.ts             - Members data hook
      useCards.ts               - Cards data hook
      useTransactions.ts        - Transactions data hook
      useDashboard.ts           - Dashboard data hook
      useDebounce.ts            - Search debounce hook
    pages/                      - Page components
      LoginPage.tsx             - Staff login
      DashboardPage.tsx         - Dashboard overview
      MembersPage.tsx           - Member list
      MemberDetailPage.tsx      - Member detail
      MemberNewPage.tsx         - Register new member
      POSPage.tsx               - Point of Sale
      CardsPage.tsx             - Card management
      UpgradePage.tsx           - Upgrade queue
      TransactionsPage.tsx      - Transaction history
      ReportsPage.tsx           - Reports & analytics
      SettingsPage.tsx          - System settings
    stores/                     - Zustand stores
      authStore.ts              - Auth state (user, token)
      uiStore.ts                - UI state (sidebar, modals)
    types/                      - TypeScript types
      index.ts                  - All type definitions
    utils/                      - Utility functions
      formatters.ts             - Currency, date formatting
      validators.ts             - Form validation schemas
      constants.ts              - App constants
    styles/
      globals.css               - Global styles + Tailwind
  index.html                    - HTML entry
  vite.config.ts                - Vite configuration
  tailwind.config.ts            - Tailwind configuration
  tsconfig.json                 - TypeScript config
  package.json                  - Dependencies
  .env.example                  - Environment variables
```

### API Client (Axios)
```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Custom Hooks (React Query)
```typescript
// src/hooks/useMembers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/query';
import { membersApi } from '../api/members';

export function useMembers(search?: string, page = 1) {
  return useQuery({
    queryKey: ['members', search, page],
    queryFn: () => membersApi.list({ search, page, limit: 20 }),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: membersApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  });
}

export function useMember(id: number) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.getById(id),
    enabled: !!id,
  });
}
```

### Pages Overview
```
/login              - Login form (email + password)
/                   - Dashboard (stats, charts, alerts)
/members            - Member list (searchable table)
/members/new        - Register new member form
/members/:id        - Member detail (cards, history)
/pos                - Point of Sale (card lookup, package select, confirm)
/cards              - All cards by tier
/cards/upgrade      - Ready to upgrade queue
/transactions       - Transaction history (date filter, export)
/reports            - Revenue reports, tier analytics
/settings           - Tier config, token packages, staff management
```

---

## 7. DOCKER DEPLOYMENT

### docker-compose.yml
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: dreamland
      POSTGRES_USER: dreamland_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dreamland_user -d dreamland"]
      interval: 10s
      timeout: 5s
      retries: 5

  # FastAPI Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql+asyncpg://dreamland_user:${DB_PASSWORD}@db:5432/dreamland
      SECRET_KEY: ${SECRET_KEY}
      CORS_ORIGINS: '["http://localhost:5173"]'
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - backend

  # Redis (optional - for caching/rate limiting)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Backend Dockerfile
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 8. ENVIRONMENT VARIABLES

### Backend (.env)
```env
DATABASE_URL=postgresql+asyncpg://dreamland_user:password@localhost:5432/dreamland
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:5173"]
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Dreamland Arcade
```

---

## 9. IMPLEMENTATION PLAN

### Phase 1: Infrastructure & Foundation (Week 1)
- [ ] Initialize both projects (frontend + backend)
- [ ] Set up Docker Compose (PostgreSQL + backend + frontend)
- [ ] Create database schema + Alembic migrations
- [ ] Seed tier_definitions and token_packages
- [ ] Set up FastAPI with CORS, health check
- [ ] Set up React with Vite, Tailwind, React Router
- [ ] Create API client (Axios) + auth interceptor
- [ ] Build login page + JWT auth flow

### Phase 2: Core Backend (Week 2)
- [ ] Members CRUD API + service layer
- [ ] Card management API (create, lookup, list)
- [ ] Transaction processing API + business logic
- [ ] Card upgrade workflow API
- [ ] Welcome bonus tracking
- [ ] Audit logging middleware
- [ ] Input validation (Pydantic schemas)
- [ ] Unit tests (Pytest)

### Phase 3: Core Frontend (Week 3)
- [ ] App layout (sidebar, top nav, responsive)
- [ ] Dashboard page (stats cards, charts)
- [ ] Member management (list, search, create, detail)
- [ ] POS page (card lookup, package select, confirm)
- [ ] Card management (list, upgrade queue)
- [ ] Transaction history (filterable table)
- [ ] React Query integration for all data

### Phase 4: Polish & Deploy (Week 4)
- [ ] Reports page (revenue, tier analytics)
- [ ] Settings management (tiers, packages)
- [ ] CSV/Excel export functionality
- [ ] Mobile responsive design
- [ ] Error handling + loading states
- [ ] Pytest + Vitest test coverage
- [ ] Deploy to VPS (Docker)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Documentation

---

## 10. KEY DESIGN DECISIONS

1. **Decoupled Architecture** - React SPA + FastAPI = independent scaling, separate deployments, team parallelism
2. **Async PostgreSQL** - SQLAlchemy async + asyncpg for non-blocking database queries
3. **FastAPI** - 10x faster than Flask, auto-generated OpenAPI docs, native async support
4. **Card-centric model** - Transactions link to cards (not directly to members) matching physical workflow
5. **Points carry forward** - Stored on card record (points_carried_over + points_earned)
6. **Discount at P150+** - Business rule enforced at both API (Pydantic) and UI (React) level
7. **Audit trail** - Every significant action logged for accountability
8. **Tier thresholds configurable** - Stored in DB, not hardcoded, so they can be adjusted
9. **JWT Authentication** - Stateless, scalable, works across domains
10. **Docker** - Consistent environments from dev to production, one-command setup
```
