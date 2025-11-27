import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Tuple, List
import os


class PCAService:
    """Service for PCA analysis on genotype data."""

    def __init__(self, n_components: int = 10):
        self.n_components = n_components
        self.pca = None
        self.components = None
        self.variance_explained = None

    def fit(self, genotype_matrix: np.ndarray) -> None:
        """
        Fit PCA on genotype matrix.

        Args:
            genotype_matrix: shape (n_samples, n_variants)
        """
        n_samples = genotype_matrix.shape[0]
        n_components = min(self.n_components, n_samples)

        self.pca = PCA(n_components=n_components)
        self.components = self.pca.fit_transform(genotype_matrix)
        self.variance_explained = self.pca.explained_variance_ratio_.tolist()

    def get_components(self) -> np.ndarray:
        """Get principal components."""
        return self.components

    def get_variance_explained(self) -> List[float]:
        """Get variance explained by each component."""
        return self.variance_explained

    def save_components(self, output_path: str, sample_names: List[str]) -> str:
        """
        Save PC scores to CSV.

        Args:
            output_path: path to save CSV
            sample_names: list of sample names

        Returns:
            path to saved CSV file
        """
        # Create DataFrame
        n_components = self.components.shape[1]
        columns = [f"PC{i+1}" for i in range(n_components)]

        df = pd.DataFrame(
            self.components,
            index=sample_names,
            columns=columns
        )

        # Save to CSV
        df.to_csv(output_path)
        return output_path

    def plot_pca(
        self,
        output_path: str,
        sample_names: List[str],
        pc1: int = 0,
        pc2: int = 1,
        cluster_labels: np.ndarray = None
    ) -> str:
        """
        Create PCA scatter plot.

        Args:
            output_path: path to save plot
            sample_names: list of sample names
            pc1: first PC to plot (0-indexed)
            pc2: second PC to plot (0-indexed)
            cluster_labels: optional cluster labels for coloring

        Returns:
            path to saved plot
        """
        plt.figure(figsize=(10, 8))

        if cluster_labels is not None:
            scatter = plt.scatter(
                self.components[:, pc1],
                self.components[:, pc2],
                c=cluster_labels,
                cmap="viridis",
                s=50,
                alpha=0.7
            )
            plt.colorbar(scatter, label="Cluster")
        else:
            plt.scatter(
                self.components[:, pc1],
                self.components[:, pc2],
                s=50,
                alpha=0.7
            )

        plt.xlabel(
            f"PC{pc1+1} ({self.variance_explained[pc1]:.2%} variance)",
            fontsize=12
        )
        plt.ylabel(
            f"PC{pc2+1} ({self.variance_explained[pc2]:.2%} variance)",
            fontsize=12
        )
        plt.title("PCA Plot", fontsize=14, fontweight="bold")
        plt.grid(alpha=0.3)

        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        plt.close()

        return output_path

    def plot_scree(self, output_path: str) -> str:
        """
        Create scree plot showing variance explained.

        Args:
            output_path: path to save plot

        Returns:
            path to saved plot
        """
        plt.figure(figsize=(10, 6))

        pcs = range(1, len(self.variance_explained) + 1)

        plt.plot(
            pcs,
            self.variance_explained,
            marker="o",
            linestyle="-",
            linewidth=2,
            markersize=8
        )

        plt.xlabel("Principal Component", fontsize=12)
        plt.ylabel("Variance Explained", fontsize=12)
        plt.title("Scree Plot", fontsize=14, fontweight="bold")
        plt.grid(alpha=0.3)

        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        plt.close()

        return output_path
