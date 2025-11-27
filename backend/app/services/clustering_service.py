import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
from typing import Tuple, List
import os


class ClusteringService:
    """Service for K-means clustering on genotype data."""

    def __init__(self, n_clusters: int = 3, max_iter: int = 300, n_init: int = 10):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.n_init = n_init
        self.kmeans = None
        self.labels = None
        self.silhouette = None

    def fit(self, genotype_matrix: np.ndarray) -> None:
        """
        Fit K-means clustering on genotype matrix.

        Args:
            genotype_matrix: shape (n_samples, n_variants) or PC scores
        """
        self.kmeans = KMeans(
            n_clusters=self.n_clusters,
            max_iter=self.max_iter,
            n_init=self.n_init,
            random_state=42
        )

        self.labels = self.kmeans.fit_predict(genotype_matrix)

        # Calculate silhouette score
        if len(np.unique(self.labels)) > 1:
            self.silhouette = silhouette_score(genotype_matrix, self.labels)
        else:
            self.silhouette = 0.0

    def get_labels(self) -> np.ndarray:
        """Get cluster labels."""
        return self.labels

    def get_silhouette_score(self) -> float:
        """Get silhouette score."""
        return self.silhouette

    def save_labels(self, output_path: str, sample_names: List[str]) -> str:
        """
        Save cluster labels to CSV.

        Args:
            output_path: path to save CSV
            sample_names: list of sample names

        Returns:
            path to saved CSV file
        """
        df = pd.DataFrame({
            "sample": sample_names,
            "cluster": self.labels
        })

        df.to_csv(output_path, index=False)
        return output_path

    def plot_clusters(
        self,
        output_path: str,
        pca_components: np.ndarray,
        sample_names: List[str],
        pc1: int = 0,
        pc2: int = 1
    ) -> str:
        """
        Create cluster plot on PCA space.

        Args:
            output_path: path to save plot
            pca_components: PCA components for visualization
            sample_names: list of sample names
            pc1: first PC to plot (0-indexed)
            pc2: second PC to plot (0-indexed)

        Returns:
            path to saved plot
        """
        plt.figure(figsize=(10, 8))

        scatter = plt.scatter(
            pca_components[:, pc1],
            pca_components[:, pc2],
            c=self.labels,
            cmap="Set2",
            s=100,
            alpha=0.7,
            edgecolors="black",
            linewidths=0.5
        )

        plt.xlabel(f"PC{pc1+1}", fontsize=12)
        plt.ylabel(f"PC{pc2+1}", fontsize=12)
        plt.title(
            f"K-means Clustering (k={self.n_clusters}, silhouette={self.silhouette:.3f})",
            fontsize=14,
            fontweight="bold"
        )

        # Add legend
        legend_labels = [f"Cluster {i}" for i in range(self.n_clusters)]
        plt.legend(
            handles=scatter.legend_elements()[0],
            labels=legend_labels,
            title="Clusters",
            loc="best"
        )

        plt.grid(alpha=0.3)
        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        plt.close()

        return output_path

    def plot_cluster_sizes(self, output_path: str) -> str:
        """
        Create bar plot of cluster sizes.

        Args:
            output_path: path to save plot

        Returns:
            path to saved plot
        """
        unique, counts = np.unique(self.labels, return_counts=True)

        plt.figure(figsize=(8, 6))
        plt.bar(unique, counts, color="steelblue", edgecolor="black")
        plt.xlabel("Cluster", fontsize=12)
        plt.ylabel("Number of Samples", fontsize=12)
        plt.title("Cluster Size Distribution", fontsize=14, fontweight="bold")
        plt.xticks(unique)
        plt.grid(axis="y", alpha=0.3)

        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        plt.close()

        return output_path
