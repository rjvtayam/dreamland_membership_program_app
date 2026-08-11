# Dreamland Arcade - Membership Card System

A full-stack membership card management system built with React.js, FastAPI, and PostgreSQL.

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and navigate to project
cd "DREAMLAND MEMBERSHIP APP"

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database (make sure PostgreSQL is running)
# Update DATABASE_URL in .env if needed

# Run database migrations and seed
python seed.py

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dreamland.com | admin123 |
| Cashier | cashier@dreamland.com | cashier123 |

## Features

- **Member Management** - Register members, view profiles, track history
- **Card System** - 4-tier membership (Qualifier → Silver → Gold → Black)
- **Point of Sale** - Process transactions, apply discounts, earn points
- **Auto-Upgrade** - System detects when members qualify for tier upgrade
- **Dashboard** - Real-time stats, charts, and alerts
- **Reports** - Revenue analytics, top members, package popularity

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker, Nginx

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Project Structure

```
dreamland-membership/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # Route handlers
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers
│   ├── alembic/            # Migrations
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/            # API clients
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # State management
│   │   └── types/          # TypeScript types
│   └── package.json
└── docker-compose.yml
```

## License

Private - Dreamland Arcade
