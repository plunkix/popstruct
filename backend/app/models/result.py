from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    # Result files
    result_file_path = Column(String, nullable=True)  # Path to result ZIP
    result_size_mb = Column(Float, nullable=True)

    # PCA results
    pca_variance_explained = Column(JSON, nullable=True)  # Array of variance ratios
    pca_components_path = Column(String, nullable=True)  # CSV with PC scores

    # Clustering results
    n_clusters = Column(Integer, nullable=True)
    cluster_labels_path = Column(String, nullable=True)  # CSV with cluster assignments
    silhouette_score = Column(Float, nullable=True)

    # Kinship results
    kinship_matrix_path = Column(String, nullable=True)  # CSV with kinship matrix

    # Plots
    pca_plot_path = Column(String, nullable=True)
    cluster_plot_path = Column(String, nullable=True)
    kinship_heatmap_path = Column(String, nullable=True)

    # Summary data (for preview without files)
    summary_data = Column(JSON, nullable=True)  # Stores n_samples, n_variants, etc.

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="results")

    def __repr__(self):
        return f"<Result(id={self.id}, job_id={self.job_id})>"
