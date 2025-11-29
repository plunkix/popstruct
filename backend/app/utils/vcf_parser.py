import allel
import numpy as np
import pandas as pd
from typing import Tuple, Optional
import gzip


def parse_vcf_file(vcf_path: str) -> Tuple[np.ndarray, list, list]:
    """
    Parse VCF file and extract genotype matrix.

    Returns:
        genotype_matrix: numpy array of shape (n_samples, n_variants) with values 0, 1, 2
        sample_names: list of sample IDs
        variant_ids: list of variant IDs
    """
    try:
        # Read VCF file using scikit-allel with specific fields
        vcf_data = allel.read_vcf(
            vcf_path,
            fields=['samples', 'calldata/GT', 'variants/CHROM', 'variants/POS']
        )

        if vcf_data is None:
            raise ValueError("Failed to parse VCF file - file may be empty or invalid")

        # Check if GT field exists
        if 'calldata/GT' not in vcf_data:
            raise ValueError("VCF file does not contain genotype (GT) data in FORMAT field")

        # Extract genotypes
        gt = vcf_data["calldata/GT"]  # Shape: (n_variants, n_samples, ploidy)

        if gt is None or len(gt) == 0:
            raise ValueError("No genotype data found in VCF file")

        # Convert to genotype counts (0, 1, 2 for diploid)
        # Sum across ploidy dimension (axis=2)
        genotype_matrix = np.sum(gt, axis=2).T  # Shape: (n_samples, n_variants)

        # Get sample names
        if 'samples' not in vcf_data or vcf_data['samples'] is None:
            raise ValueError("No sample names found in VCF file")

        sample_names = vcf_data["samples"].tolist()

        # Create variant IDs
        chroms = vcf_data["variants/CHROM"]
        positions = vcf_data["variants/POS"]
        variant_ids = [f"{chrom}_{pos}" for chrom, pos in zip(chroms, positions)]

        return genotype_matrix, sample_names, variant_ids

    except Exception as e:
        raise ValueError(f"Error parsing VCF file: {str(e)}")


def parse_csv_genotypes(csv_path: str) -> Tuple[np.ndarray, list, list]:
    """
    Parse CSV file with genotype matrix.

    Expected format:
    - First column: sample IDs
    - First row: variant IDs
    - Values: 0, 1, 2 (or NA/missing)

    Returns:
        genotype_matrix: numpy array
        sample_names: list of sample IDs
        variant_ids: list of variant IDs
    """
    try:
        # Read CSV
        df = pd.read_csv(csv_path, index_col=0)

        # Extract data
        sample_names = df.index.tolist()
        variant_ids = df.columns.tolist()

        # Convert to numpy array and handle missing values
        genotype_matrix = df.values

        # Replace NaN with -1 (missing)
        genotype_matrix = np.nan_to_num(genotype_matrix, nan=-1)

        return genotype_matrix, sample_names, variant_ids

    except Exception as e:
        raise ValueError(f"Error parsing CSV file: {str(e)}")


def get_genotype_matrix(file_path: str, file_type: str) -> Tuple[np.ndarray, list, list]:
    """
    Parse genotype file and return matrix.

    Args:
        file_path: path to file
        file_type: "vcf" or "csv"

    Returns:
        genotype_matrix, sample_names, variant_ids
    """
    if file_type == "vcf":
        return parse_vcf_file(file_path)
    elif file_type == "csv":
        return parse_csv_genotypes(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")


def validate_genotype_matrix(genotype_matrix: np.ndarray) -> bool:
    """
    Validate genotype matrix.

    Checks:
    - Values are 0, 1, 2, or -1 (missing)
    - Matrix has proper shape
    """
    # Check if values are valid
    unique_values = np.unique(genotype_matrix)
    valid_values = {-1, 0, 1, 2}

    if not set(unique_values).issubset(valid_values):
        return False

    # Check shape
    if genotype_matrix.ndim != 2:
        return False

    if genotype_matrix.shape[0] < 2 or genotype_matrix.shape[1] < 2:
        return False

    return True
