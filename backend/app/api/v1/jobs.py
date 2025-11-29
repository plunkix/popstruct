from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.models.job import Job, JobStatus, AnalysisType
from app.models.result import Result
from app.schemas.job import JobResponse, JobList, JobCreate
import os

router = APIRouter()


@router.get("/", response_model=JobList)
async def list_jobs(
    page: int = 1,
    page_size: int = 20,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all jobs for current user."""
    offset = (page - 1) * page_size

    query = db.query(Job).options(joinedload(Job.dataset)).filter(Job.user_id == current_user.id)

    if status_filter:
        query = query.filter(Job.status == JobStatus(status_filter))

    jobs = query.order_by(Job.created_at.desc()).offset(offset).limit(page_size).all()

    total = db.query(Job).filter(Job.user_id == current_user.id).count()

    # Add dataset_name to each job
    jobs_list = []
    for job in jobs:
        job_dict = {
            "id": job.id,
            "name": job.name,
            "analysis_type": job.analysis_type.value,
            "status": job.status.value,
            "progress_percent": job.progress_percent,
            "error_message": job.error_message,
            "dataset_id": job.dataset_id,
            "dataset_name": job.dataset.name if job.dataset else None,
            "user_id": job.user_id,
            "parameters": job.parameters,
            "created_at": job.created_at,
            "started_at": job.started_at,
            "completed_at": job.completed_at,
        }
        jobs_list.append(job_dict)

    return {
        "jobs": jobs_list,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific job."""
    job = db.query(Job).options(joinedload(Job.dataset)).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this job"
        )

    return {
        "id": job.id,
        "name": job.name,
        "analysis_type": job.analysis_type.value,
        "status": job.status.value,
        "progress_percent": job.progress_percent,
        "error_message": job.error_message,
        "dataset_id": job.dataset_id,
        "dataset_name": job.dataset.name if job.dataset else None,
        "user_id": job.user_id,
        "parameters": job.parameters,
        "created_at": job.created_at,
        "started_at": job.started_at,
        "completed_at": job.completed_at,
    }


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a job and its results."""
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this job"
        )

    # Delete job (results will be deleted via cascade)
    db.delete(job)
    db.commit()

    return None


@router.get("/{job_id}/results")
async def get_job_results(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get results for a completed job."""
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this job"
        )

    if job.status != JobStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job is not completed (status: {job.status.value})"
        )

    # Get results
    results = db.query(Result).filter(Result.job_id == job_id).all()

    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No results found for this job"
        )

    return {"job_id": job_id, "results": results}


@router.get("/{job_id}/download")
async def download_results(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Download results ZIP file."""
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if job.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this job"
        )

    if job.status != JobStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job is not completed"
        )

    # Get result
    result = db.query(Result).filter(Result.job_id == job_id).first()

    if not result or not result.result_file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result file not found"
        )

    if not os.path.exists(result.result_file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result file does not exist on disk"
        )

    return FileResponse(
        path=result.result_file_path,
        filename=f"job_{job_id}_results.zip",
        media_type="application/zip"
    )
