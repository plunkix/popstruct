from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None


class DatasetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class DatasetResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    file_type: str
    file_size_mb: float
    n_samples: Optional[int]
    n_variants: Optional[int]
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class DatasetList(BaseModel):
    datasets: list[DatasetResponse]
    total: int
    page: int
    page_size: int
