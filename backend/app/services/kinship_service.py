import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import List
import os


class KinshipService:
    """Service for computing kinship/GRM matrices."""

    def __init__(self, method: str = "ibs"):
        """
        Initialize kinship service.

        Args:
            method: "ibs" (identity by state) or "grm" (genomic relationship matrix)
        """
        self.method = method
        self.kinship_matrix = None

    def compute_ibs(self, genotype_matrix: np.ndarray) -> np.ndarray:
        """
        Compute Identity-By-State (IBS) matrix.

        IBS measures the proportion of shared alleles between samples.

        Args:
            genotype_matrix: shape (n_samples, n_variants), values 0, 1, 2

        Returns:
            IBS matrix: shape (n_samples, n_samples), values in [0, 1]
        """
        n_samples, n_variants = genotype_matrix.shape

        # Initialize IBS matrix
        ibs_matrix = np.zeros((n_samples, n_samples))

        for i in range(n_samples):
            for j in range(i, n_samples):
                # Count shared alleles
                gt_i = genotype_matrix[i, :]
                gt_j = genotype_matrix[j, :]

                # IBS = 1 - (proportion of different alleles)
                # For diploid: max difference is 2, so we normalize by 2
                differences = np.abs(gt_i - gt_j)
                ibs = 1 - (np.mean(differences) / 2)

                ibs_matrix[i, j] = ibs
                ibs_matrix[j, i] = ibs

        return ibs_matrix

    def compute_grm(self, genotype_matrix: np.ndarray) -> np.ndarray:
        """
        Compute Genomic Relationship Matrix (GRM).

        GRM is similar to IBS but accounts for allele frequencies.

        Args:
            genotype_matrix: shape (n_samples, n_variants)

        Returns:
            GRM matrix: shape (n_samples, n_samples)
        """
        n_samples, n_variants = genotype_matrix.shape

        # Center genotype matrix by subtracting mean allele frequency
        allele_freqs = np.mean(genotype_matrix, axis=0) / 2  # Divide by 2 for diploid
        centered_matrix = genotype_matrix - (2 * allele_freqs)

        # Compute GRM
        grm = np.dot(centered_matrix, centered_matrix.T)

        # Normalize
        normalizer = 2 * np.sum(allele_freqs * (1 - allele_freqs))
        grm = grm / normalizer

        return grm

    def fit(self, genotype_matrix: np.ndarray) -> None:
        """
        Compute kinship matrix.

        Args:
            genotype_matrix: shape (n_samples, n_variants)
        """
        if self.method == "ibs":
            self.kinship_matrix = self.compute_ibs(genotype_matrix)
        elif self.method == "grm":
            self.kinship_matrix = self.compute_grm(genotype_matrix)
        else:
            raise ValueError(f"Unknown method: {self.method}")

    def get_kinship_matrix(self) -> np.ndarray:
        """Get kinship matrix."""
        return self.kinship_matrix

    def save_matrix(self, output_path: str, sample_names: List[str]) -> str:
        """
        Save kinship matrix to CSV.

        Args:
            output_path: path to save CSV
            sample_names: list of sample names

        Returns:
            path to saved CSV file
        """
        df = pd.DataFrame(
            self.kinship_matrix,
            index=sample_names,
            columns=sample_names
        )

        df.to_csv(output_path)
        return output_path

    def plot_heatmap(self, output_path: str, sample_names: List[str]) -> str:
        """
        Create kinship heatmap.

        Args:
            output_path: path to save plot
            sample_names: list of sample names

        Returns:
            path to saved plot
        """
        plt.figure(figsize=(12, 10))

        sns.heatmap(
            self.kinship_matrix,
            cmap="RdYlBu_r",
            center=0.5 if self.method == "ibs" else 0,
            cbar_kws={"label": "Kinship Coefficient"},
            square=True,
            linewidths=0.5,
            linecolor="lightgray"
        )

        plt.xlabel("Sample", fontsize=12)
        plt.ylabel("Sample", fontsize=12)
        plt.title(
            f"Kinship Matrix ({self.method.upper()})",
            fontsize=14,
            fontweight="bold"
        )

        # Only show tick labels if not too many samples
        if len(sample_names) <= 50:
            plt.xticks(
                np.arange(len(sample_names)) + 0.5,
                sample_names,
                rotation=90,
                fontsize=8
            )
            plt.yticks(
                np.arange(len(sample_names)) + 0.5,
                sample_names,
                rotation=0,
                fontsize=8
            )
        else:
            plt.xticks([])
            plt.yticks([])

        plt.tight_layout()
        plt.savefig(output_path, dpi=300, bbox_inches="tight")
        plt.close()

        return output_path

    def get_pairwise_relatedness(
        self,
        sample_names: List[str],
        threshold: float = 0.1
    ) -> pd.DataFrame:
        """
        Get pairwise relatedness above threshold.

        Args:
            sample_names: list of sample names
            threshold: minimum kinship coefficient

        Returns:
            DataFrame with related pairs
        """
        n_samples = len(sample_names)
        related_pairs = []

        for i in range(n_samples):
            for j in range(i + 1, n_samples):
                kinship = self.kinship_matrix[i, j]
                if kinship >= threshold:
                    related_pairs.append({
                        "sample1": sample_names[i],
                        "sample2": sample_names[j],
                        "kinship": kinship
                    })

        return pd.DataFrame(related_pairs)
