from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class FileType(str, enum.Enum):
    VCF = "vcf"
    CSV = "csv"
    TXT = "txt"


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_type = Column(Enum(FileType), nullable=False)
    file_path = Column(String, nullable=False)
    file_size_mb = Column(Float, nullable=False)

    # Genotype matrix info
    n_samples = Column(Integer, nullable=True)
    n_variants = Column(Integer, nullable=True)

    # Owner
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="datasets")
    jobs = relationship("Job", back_populates="dataset", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Dataset(id={self.id}, name={self.name})>"
