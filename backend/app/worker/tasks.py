from celery import Task
from app.worker.celery import celery_app
from app.core.database import SessionLocal
from app.models.job import Job, JobStatus
from app.models.dataset import Dataset
from app.models.result import Result
from app.utils.vcf_parser import get_genotype_matrix
from app.utils.genotype_encoder import prepare_genotype_matrix
from app.services.pca_service import PCAService
from app.services.clustering_service import ClusteringService
from app.services.kinship_service import KinshipService
from app.services.report_service import ReportService
from app.core.config import settings
import os
from datetime import datetime
import traceback


class DatabaseTask(Task):
    """Base task with database session."""
    _db = None

    @property
    def db(self):
        if self._db is None:
            self._db = SessionLocal()
        return self._db

    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()
            self._db = None


@celery_app.task(base=DatabaseTask, bind=True)
def run_pca_analysis(self, job_id: int):
    """Run PCA analysis task."""
    db = self.db

    try:
        # Get job and dataset
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found")

        dataset = db.query(Dataset).filter(Dataset.id == job.dataset_id).first()
        if not dataset:
            raise ValueError(f"Dataset {dataset.id} not found")

        # Update job status
        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        job.progress_percent = 10
        db.commit()

        # Load genotype data
        genotype_matrix, sample_names, variant_ids = get_genotype_matrix(
            dataset.file_path,
            dataset.file_type.value
        )

        job.progress_percent = 30
        db.commit()

        # Prepare genotype matrix
        params = job.parameters or {}
        n_components = params.get("n_components", 10)
        normalize = params.get("normalize", True)

        prepared_matrix = prepare_genotype_matrix(genotype_matrix, normalize=normalize)

        job.progress_percent = 50
        db.commit()

        # Run PCA
        pca_service = PCAService(n_components=n_components)
        pca_service.fit(prepared_matrix)

        job.progress_percent = 70
        db.commit()

        # Create output directory
        job_dir = os.path.join(settings.RESULTS_DIR, f"job_{job_id}")
        os.makedirs(job_dir, exist_ok=True)

        # Save results
        components_path = os.path.join(job_dir, "pca_components.csv")
        pca_service.save_components(components_path, sample_names)

        plot_path = os.path.join(job_dir, "pca_plot.png")
        pca_service.plot_pca(plot_path, sample_names)

        scree_path = os.path.join(job_dir, "scree_plot.png")
        pca_service.plot_scree(scree_path)

        job.progress_percent = 90
        db.commit()

        # Create result record
        result = Result(
            job_id=job_id,
            pca_variance_explained=pca_service.get_variance_explained(),
            pca_components_path=components_path,
            pca_plot_path=plot_path
        )
        db.add(result)

        # Update job
        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        job.progress_percent = 100
        db.commit()

        return {"status": "success", "job_id": job_id}

    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()

        raise


@celery_app.task(base=DatabaseTask, bind=True)
def run_clustering_analysis(self, job_id: int):
    """Run clustering analysis task."""
    db = self.db

    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        dataset = db.query(Dataset).filter(Dataset.id == job.dataset_id).first()

        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        job.progress_percent = 10
        db.commit()

        # Load genotype data
        genotype_matrix, sample_names, variant_ids = get_genotype_matrix(
            dataset.file_path,
            dataset.file_type.value
        )

        job.progress_percent = 30
        db.commit()

        # Prepare matrix (run PCA first for dimensionality reduction)
        prepared_matrix = prepare_genotype_matrix(genotype_matrix, normalize=True)

        # Run PCA for clustering (use first 10 PCs)
        pca_service = PCAService(n_components=10)
        pca_service.fit(prepared_matrix)
        pca_components = pca_service.get_components()

        job.progress_percent = 50
        db.commit()

        # Run clustering
        params = job.parameters or {}
        n_clusters = params.get("n_clusters", 3)

        clustering_service = ClusteringService(n_clusters=n_clusters)
        clustering_service.fit(pca_components)

        job.progress_percent = 70
        db.commit()

        # Save results
        job_dir = os.path.join(settings.RESULTS_DIR, f"job_{job_id}")
        os.makedirs(job_dir, exist_ok=True)

        labels_path = os.path.join(job_dir, "cluster_labels.csv")
        clustering_service.save_labels(labels_path, sample_names)

        plot_path = os.path.join(job_dir, "cluster_plot.png")
        clustering_service.plot_clusters(plot_path, pca_components, sample_names)

        job.progress_percent = 90
        db.commit()

        # Create result
        result = Result(
            job_id=job_id,
            n_clusters=n_clusters,
            cluster_labels_path=labels_path,
            cluster_plot_path=plot_path,
            silhouette_score=clustering_service.get_silhouette_score()
        )
        db.add(result)

        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        job.progress_percent = 100
        db.commit()

        return {"status": "success", "job_id": job_id}

    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()

        raise


@celery_app.task(base=DatabaseTask, bind=True)
def run_kinship_analysis(self, job_id: int):
    """Run kinship analysis task."""
    db = self.db

    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        dataset = db.query(Dataset).filter(Dataset.id == job.dataset_id).first()

        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        job.progress_percent = 10
        db.commit()

        # Load genotype data
        genotype_matrix, sample_names, variant_ids = get_genotype_matrix(
            dataset.file_path,
            dataset.file_type.value
        )

        job.progress_percent = 30
        db.commit()

        # Prepare matrix
        prepared_matrix = prepare_genotype_matrix(genotype_matrix, normalize=False)

        job.progress_percent = 50
        db.commit()

        # Run kinship
        params = job.parameters or {}
        method = params.get("method", "ibs")

        kinship_service = KinshipService(method=method)
        kinship_service.fit(prepared_matrix)

        job.progress_percent = 70
        db.commit()

        # Save results
        job_dir = os.path.join(settings.RESULTS_DIR, f"job_{job_id}")
        os.makedirs(job_dir, exist_ok=True)

        matrix_path = os.path.join(job_dir, "kinship_matrix.csv")
        kinship_service.save_matrix(matrix_path, sample_names)

        heatmap_path = os.path.join(job_dir, "kinship_heatmap.png")
        kinship_service.plot_heatmap(heatmap_path, sample_names)

        job.progress_percent = 90
        db.commit()

        # Create result
        result = Result(
            job_id=job_id,
            kinship_matrix_path=matrix_path,
            kinship_heatmap_path=heatmap_path
        )
        db.add(result)

        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        job.progress_percent = 100
        db.commit()

        return {"status": "success", "job_id": job_id}

    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()

        raise


@celery_app.task(base=DatabaseTask, bind=True)
def run_full_analysis(self, job_id: int):
    """Run full analysis (PCA + Clustering + Kinship)."""
    db = self.db

    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        dataset = db.query(Dataset).filter(Dataset.id == job.dataset_id).first()

        job.status = JobStatus.RUNNING
        job.started_at = datetime.utcnow()
        job.progress_percent = 5
        db.commit()

        # Load genotype data
        genotype_matrix, sample_names, variant_ids = get_genotype_matrix(
            dataset.file_path,
            dataset.file_type.value
        )

        prepared_matrix = prepare_genotype_matrix(genotype_matrix, normalize=True)

        job.progress_percent = 15
        db.commit()

        # Create output directory
        job_dir = os.path.join(settings.RESULTS_DIR, f"job_{job_id}")
        os.makedirs(job_dir, exist_ok=True)

        results_data = {}

        # Run PCA
        params = job.parameters or {}
        pca_params = params.get("pca", {})
        n_components = pca_params.get("n_components", 10)

        pca_service = PCAService(n_components=n_components)
        pca_service.fit(prepared_matrix)

        pca_components_path = os.path.join(job_dir, "pca_components.csv")
        pca_service.save_components(pca_components_path, sample_names)

        pca_plot_path = os.path.join(job_dir, "pca_plot.png")
        pca_service.plot_pca(pca_plot_path, sample_names)

        scree_plot_path = os.path.join(job_dir, "scree_plot.png")
        pca_service.plot_scree(scree_plot_path)

        results_data["pca"] = {
            "variance_explained": pca_service.get_variance_explained(),
            "components_path": pca_components_path,
            "plot_path": pca_plot_path,
            "scree_plot_path": scree_plot_path
        }

        job.progress_percent = 40
        db.commit()

        # Run Clustering
        clustering_params = params.get("clustering", {})
        n_clusters = clustering_params.get("n_clusters", 3)

        pca_components = pca_service.get_components()
        clustering_service = ClusteringService(n_clusters=n_clusters)
        clustering_service.fit(pca_components)

        labels_path = os.path.join(job_dir, "cluster_labels.csv")
        clustering_service.save_labels(labels_path, sample_names)

        cluster_plot_path = os.path.join(job_dir, "cluster_plot.png")
        clustering_service.plot_clusters(cluster_plot_path, pca_components, sample_names)

        # Plot PCA with cluster colors
        pca_cluster_plot_path = os.path.join(job_dir, "pca_clusters.png")
        pca_service.plot_pca(
            pca_cluster_plot_path,
            sample_names,
            cluster_labels=clustering_service.get_labels()
        )

        results_data["clustering"] = {
            "n_clusters": n_clusters,
            "silhouette_score": clustering_service.get_silhouette_score(),
            "labels_path": labels_path,
            "plot_path": cluster_plot_path
        }

        job.progress_percent = 65
        db.commit()

        # Run Kinship
        kinship_params = params.get("kinship", {})
        method = kinship_params.get("method", "ibs")

        kinship_service = KinshipService(method=method)
        kinship_service.fit(genotype_matrix)  # Use original matrix

        matrix_path = os.path.join(job_dir, "kinship_matrix.csv")
        kinship_service.save_matrix(matrix_path, sample_names)

        heatmap_path = os.path.join(job_dir, "kinship_heatmap.png")
        kinship_service.plot_heatmap(heatmap_path, sample_names)

        results_data["kinship"] = {
            "method": method,
            "matrix_path": matrix_path,
            "heatmap_path": heatmap_path
        }

        job.progress_percent = 85
        db.commit()

        # Save summary JSON for preview
        import json
        summary_data = {
            "n_samples": len(sample_names),
            "n_variants": len(variant_ids),
            "variance_explained": results_data["pca"]["variance_explained"],
            "n_clusters": n_clusters,
            "silhouette_score": results_data["clustering"]["silhouette_score"],
            "dataset_name": dataset.name
        }
        summary_path = os.path.join(job_dir, "analysis_summary.json")
        with open(summary_path, "w") as f:
            json.dump(summary_data, f)

        # Generate report
        report_service = ReportService(job_dir)
        report_files = report_service.generate_full_report(
            job_info={"id": job.id, "name": job.name, "analysis_type": job.analysis_type.value},
            dataset_info={
                "name": dataset.name,
                "file_type": dataset.file_type.value,
                "n_samples": len(sample_names),
                "n_variants": len(variant_ids)
            },
            pca_results=results_data["pca"],
            clustering_results=results_data["clustering"],
            kinship_results=results_data["kinship"]
        )

        # Create result
        result = Result(
            job_id=job_id,
            result_file_path=report_files["zip"],
            result_size_mb=os.path.getsize(report_files["zip"]) / (1024 * 1024),
            pca_variance_explained=results_data["pca"]["variance_explained"],
            pca_components_path=pca_components_path,
            n_clusters=n_clusters,
            cluster_labels_path=labels_path,
            cluster_plot_path=cluster_plot_path,
            silhouette_score=results_data["clustering"]["silhouette_score"],
            kinship_matrix_path=matrix_path,
            kinship_heatmap_path=heatmap_path,
            pca_plot_path=pca_plot_path,
            summary_data=summary_data  # Store summary for preview
        )
        db.add(result)

        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.utcnow()
        job.progress_percent = 100
        db.commit()

        return {"status": "success", "job_id": job_id}

    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.FAILED
            job.error_message = str(e) + "\n" + traceback.format_exc()
            job.completed_at = datetime.utcnow()
            db.commit()

        raise
