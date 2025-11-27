from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.core.dependencies import get_db, get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.models.dataset import Dataset, FileType
from app.schemas.dataset import DatasetResponse, DatasetList
from app.utils.file_utils import (
    get_file_size_mb,
    generate_unique_filename,
    save_upload_file,
    validate_file_extension,
    get_file_type,
    delete_file
)
from app.utils.vcf_parser import get_genotype_matrix
import os

router = APIRouter()


@router.post("/", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a new dataset (VCF or CSV file)."""
    # Validate file extension
    if not validate_file_extension(file.filename, settings.ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Read file content
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)

    # Check file size limits based on subscription
    max_size = (
        settings.PREMIUM_MAX_FILE_SIZE_MB
        if current_user.subscription_tier.value == "premium"
        else settings.FREE_MAX_FILE_SIZE_MB
    )

    if file_size_mb > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds {max_size}MB limit for {current_user.subscription_tier.value} tier"
        )

    # Generate unique filename
    unique_filename = generate_unique_filename(file.filename, current_user.id)
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Save file
    try:
        with open(file_path, "wb") as f:
            f.write(file_content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # Determine file type
    file_type_str = get_file_type(file.filename)
    if not file_type_str:
        delete_file(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not determine file type"
        )

    # Parse file to get dimensions
    try:
        genotype_matrix, sample_names, variant_ids = get_genotype_matrix(
            file_path,
            file_type_str
        )
        n_samples = len(sample_names)
        n_variants = len(variant_ids)
    except Exception as e:
        delete_file(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse file: {str(e)}"
        )

    # Create dataset record
    dataset = Dataset(
        name=name,
        description=description,
        file_type=FileType(file_type_str),
        file_path=file_path,
        file_size_mb=file_size_mb,
        n_samples=n_samples,
        n_variants=n_variants,
        owner_id=current_user.id
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return dataset


@router.get("/", response_model=DatasetList)
async def list_datasets(
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all datasets for current user."""
    offset = (page - 1) * page_size

    datasets = (
        db.query(Dataset)
        .filter(Dataset.owner_id == current_user.id)
        .order_by(Dataset.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    total = db.query(Dataset).filter(Dataset.owner_id == current_user.id).count()

    return {
        "datasets": datasets,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific dataset."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()

    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this dataset"
        )

    return dataset


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a dataset."""
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()

    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )

    if dataset.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this dataset"
        )

    # Delete file from disk
    delete_file(dataset.file_path)

    # Delete from database
    db.delete(dataset)
    db.commit()

    return None
