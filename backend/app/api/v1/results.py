from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.models.job import Job, JobStatus
from app.models.result import Result
import os
import json
import base64
from pathlib import Path

router = APIRouter()


@router.get("/{job_id}/preview")
async def get_results_preview(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get analysis results preview with plots and summary statistics."""
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

    # Build response with metrics from database
    response_data = {
        "job_id": job_id,
        "job_name": job.name,
        "analysis_type": job.analysis_type.value,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        "plots": [],
        "summaries": [],
        "metrics": {}
    }

    # Get metrics from Result model (stored in database)
    for result in results:
        # Use summary_data if available (preferred for ephemeral storage)
        if result.summary_data:
            response_data["metrics"] = result.summary_data

        # Also extract from result fields
        if result.pca_variance_explained:
            response_data["metrics"]["variance_explained"] = result.pca_variance_explained

        if result.n_clusters:
            response_data["metrics"]["n_clusters"] = result.n_clusters

        if result.silhouette_score:
            response_data["metrics"]["silhouette_score"] = result.silhouette_score

        # Try to load plots from disk (may not exist on ephemeral storage)
        if result.result_file_path and os.path.exists(result.result_file_path):
            result_dir = os.path.dirname(result.result_file_path)

            # Look for PNG files (plots)
            for file_path in Path(result_dir).glob("*.png"):
                try:
                    with open(file_path, "rb") as f:
                        img_base64 = base64.b64encode(f.read()).decode('utf-8')
                        response_data["plots"].append({
                            "name": file_path.stem.replace("_", " ").title(),
                            "filename": file_path.name,
                            "data": f"data:image/png;base64,{img_base64}"
                        })
                except Exception as e:
                    print(f"Error reading plot {file_path}: {e}")

    # If no plots available, show a message
    if not response_data["plots"] and response_data["metrics"]:
        response_data["message"] = "Plots are not available (ephemeral storage), but metrics are shown below. Download the full package to get visualizations."

    return response_data
