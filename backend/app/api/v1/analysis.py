from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.dependencies import get_db, get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.models.dataset import Dataset
from app.models.job import Job, JobStatus, AnalysisType
from app.schemas.job import JobCreate, JobResponse
from app.worker.tasks import (
    run_pca_analysis,
    run_clustering_analysis,
    run_kinship_analysis,
    run_full_analysis
)

router = APIRouter()


def check_daily_job_limit(user: User, db: Session) -> None:
    """Check if user has exceeded daily job limit."""
    today = datetime.utcnow().date()
    jobs_today = (
        db.query(Job)
        .filter(
            Job.user_id == user.id,
            Job.created_at >= datetime.combine(today, datetime.min.time())
        )
        .count()
    )

    max_jobs = (
        settings.PREMIUM_MAX_JOBS_PER_DAY
        if user.subscription_tier.value == "premium"
        else settings.FREE_MAX_JOBS_PER_DAY
    )

    if jobs_today >= max_jobs:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily job limit of {max_jobs} reached for {user.subscription_tier.value} tier"
        )


@router.post("/pca", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_pca_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new PCA analysis job."""
    # Check daily limit
    check_daily_job_limit(current_user, db)

    # Verify dataset exists and belongs to user
    dataset = db.query(Dataset).filter(Dataset.id == job_data.dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this dataset"
        )

    # Create job
    job = Job(
        name=job_data.name,
        analysis_type=AnalysisType.PCA,
        parameters=job_data.parameters,
        user_id=current_user.id,
        dataset_id=job_data.dataset_id,
        status=JobStatus.PENDING
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    # Start Celery task
    task = run_pca_analysis.delay(job.id)
    job.celery_task_id = task.id
    db.commit()

    return job


@router.post("/clustering", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_clustering_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new clustering analysis job."""
    check_daily_job_limit(current_user, db)

    dataset = db.query(Dataset).filter(Dataset.id == job_data.dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this dataset"
        )

    job = Job(
        name=job_data.name,
        analysis_type=AnalysisType.CLUSTERING,
        parameters=job_data.parameters,
        user_id=current_user.id,
        dataset_id=job_data.dataset_id,
        status=JobStatus.PENDING
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    task = run_clustering_analysis.delay(job.id)
    job.celery_task_id = task.id
    db.commit()

    return job


@router.post("/kinship", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_kinship_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new kinship analysis job."""
    check_daily_job_limit(current_user, db)

    dataset = db.query(Dataset).filter(Dataset.id == job_data.dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this dataset"
        )

    job = Job(
        name=job_data.name,
        analysis_type=AnalysisType.KINSHIP,
        parameters=job_data.parameters,
        user_id=current_user.id,
        dataset_id=job_data.dataset_id,
        status=JobStatus.PENDING
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    task = run_kinship_analysis.delay(job.id)
    job.celery_task_id = task.id
    db.commit()

    return job


@router.post("/full", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_full_analysis_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a full analysis job (PCA + Clustering + Kinship)."""
    check_daily_job_limit(current_user, db)

    dataset = db.query(Dataset).filter(Dataset.id == job_data.dataset_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this dataset"
        )

    job = Job(
        name=job_data.name,
        analysis_type=AnalysisType.FULL_ANALYSIS,
        parameters=job_data.parameters,
        user_id=current_user.id,
        dataset_id=job_data.dataset_id,
        status=JobStatus.PENDING
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    task = run_full_analysis.delay(job.id)
    job.celery_task_id = task.id
    db.commit()

    return job
