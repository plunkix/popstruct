from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import auth, datasets, jobs, analysis, users

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Population Structure Analysis SaaS Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "PopStruct API"}


# Include routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["Authentication"]
)

app.include_router(
    users.router,
    prefix=f"{settings.API_V1_STR}/users",
    tags=["Users"]
)

app.include_router(
    datasets.router,
    prefix=f"{settings.API_V1_STR}/datasets",
    tags=["Datasets"]
)

app.include_router(
    analysis.router,
    prefix=f"{settings.API_V1_STR}/analysis",
    tags=["Analysis"]
)

app.include_router(
    jobs.router,
    prefix=f"{settings.API_V1_STR}/jobs",
    tags=["Jobs"]
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()
    print("Database initialized")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to PopStruct API",
        "version": "1.0.0",
        "docs": "/docs"
    }
