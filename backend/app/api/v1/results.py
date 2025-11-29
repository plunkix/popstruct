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

    # Build response with plots and summaries
    response_data = {
        "job_id": job_id,
        "job_name": job.name,
        "analysis_type": job.analysis_type.value,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
        "plots": [],
        "summaries": [],
        "metrics": {}
    }

    # Extract plots and summaries from results directory
    for result in results:
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

            # Look for summary JSON files
            for file_path in Path(result_dir).glob("*summary*.json"):
                try:
                    with open(file_path, "r") as f:
                        summary_data = json.load(f)
                        response_data["summaries"].append({
                            "name": file_path.stem.replace("_", " ").title(),
                            "data": summary_data
                        })
                except Exception as e:
                    print(f"Error reading summary {file_path}: {e}")

    # Extract key metrics
    if response_data["summaries"]:
        # Combine all summaries into metrics
        for summary in response_data["summaries"]:
            response_data["metrics"].update(summary.get("data", {}))

    return response_data
