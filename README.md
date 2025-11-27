# PopStruct - Population Structure Analyzer

A production-grade SaaS platform for genomic population structure analysis.

> **👋 New here?** Start with **[START_HERE.md](./START_HERE.md)** for guided navigation!

## 🚀 Quick Start

**Want to deploy for FREE right now?**

👉 **[Follow the Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step guide (20 mins, $0/month!)

Or:
- 📋 [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Easiest path
- 🆓 [FREE Deployment Guide](./FREE_DEPLOYMENT.md) - Detailed walkthrough
- 📊 [Compare Options](./DEPLOYMENT_OPTIONS.md) - Choose the right hosting

---

## Features

- **PCA Analysis**: Principal Component Analysis for population structure
- **K-means Clustering**: Automated population clustering
- **Kinship Matrix**: Identity-by-state (IBS) and Genomic Relationship Matrix (GRM)
- **Interactive Visualizations**: PCA plots, cluster plots, and kinship heatmaps
- **File Support**: VCF and CSV genotype data
- **Export Reports**: Downloadable ZIP archives with results

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL + SQLAlchemy
- Celery + Redis (background jobs)
- scikit-learn, pandas, numpy
- scikit-allel (VCF parsing)

### Frontend
- Next.js 14 + TypeScript
- TailwindCSS
- shadcn/ui components
- React Query
- Recharts for visualizations

### Infrastructure
- Docker & Docker Compose
- JWT authentication
- Stripe integration for subscriptions

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Setup with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd PopStruct
```

2. Create environment files:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- Database credentials
- JWT secret keys
- Stripe API keys
- Redis URL

4. Start all services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
docker-compose exec backend alembic upgrade head
```

6. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Celery Worker
```bash
cd backend
celery -A app.worker.celery worker --loglevel=info
```

## Project Structure

```
PopStruct/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── core/            # Config, security, dependencies
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── worker/          # Celery tasks
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Documentation

After starting the backend, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

See `.env.example` for all required environment variables.

### Key Variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key
- `STRIPE_SECRET_KEY`: Stripe API key
- `REDIS_URL`: Redis connection string
- `ALLOWED_ORIGINS`: CORS origins

## Usage Limits

### Free Tier
- Max file size: 50MB
- Max jobs per day: 10
- Storage: 1GB

### Premium Tier
- Max file size: 500MB
- Max jobs per day: 100
- Storage: 50GB

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue.
