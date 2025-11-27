from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AnalysisType(str, enum.Enum):
    PCA = "pca"
    CLUSTERING = "clustering"
    KINSHIP = "kinship"
    FULL_ANALYSIS = "full_analysis"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    analysis_type = Column(Enum(AnalysisType), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, nullable=False)

    # Parameters
    parameters = Column(JSON, nullable=True)  # Store analysis parameters as JSON

    # Progress and error tracking
    progress_percent = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)

    # Celery task ID
    celery_task_id = Column(String, nullable=True)

    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="jobs")
    dataset = relationship("Dataset", back_populates="jobs")
    results = relationship("Result", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job(id={self.id}, name={self.name}, status={self.status})>"
