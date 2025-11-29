from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class JobCreate(BaseModel):
    name: str
    dataset_id: int
    analysis_type: str  # "pca", "clustering", "kinship", "full_analysis"
    parameters: Optional[Dict[str, Any]] = None


class JobUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    name: str
    analysis_type: str
    status: str
    progress_percent: int
    error_message: Optional[str]
    dataset_id: int
    dataset_name: Optional[str] = None
    user_id: int
    parameters: Optional[Dict[str, Any]] = None
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class JobList(BaseModel):
    jobs: list[JobResponse]
    total: int
    page: int
    page_size: int
