from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class PCAParameters(BaseModel):
    n_components: int = 10
    normalize: bool = True


class ClusteringParameters(BaseModel):
    n_clusters: int = 3
    max_iter: int = 300
    n_init: int = 10


class KinshipParameters(BaseModel):
    method: str = "ibs"  # "ibs" or "grm"


class FullAnalysisParameters(BaseModel):
    pca: PCAParameters = PCAParameters()
    clustering: ClusteringParameters = ClusteringParameters()
    kinship: KinshipParameters = KinshipParameters()


class ResultResponse(BaseModel):
    id: int
    job_id: int
    result_file_path: Optional[str]
    result_size_mb: Optional[float]
    pca_variance_explained: Optional[List[float]]
    n_clusters: Optional[int]
    silhouette_score: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class PCAResult(BaseModel):
    variance_explained: List[float]
    components: List[List[float]]
    sample_names: List[str]


class ClusteringResult(BaseModel):
    n_clusters: int
    cluster_labels: List[int]
    silhouette_score: float
    sample_names: List[str]


class KinshipResult(BaseModel):
    kinship_matrix: List[List[float]]
    sample_names: List[str]
