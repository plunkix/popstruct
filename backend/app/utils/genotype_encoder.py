import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


def encode_genotypes(genotype_matrix: np.ndarray, missing_value: int = -1) -> np.ndarray:
    """
    Encode genotypes for analysis.

    - Handles missing values by imputation (mean)
    - Returns encoded matrix
    """
    # Replace missing values with NaN for imputation
    matrix = genotype_matrix.copy().astype(float)
    matrix[matrix == missing_value] = np.nan

    # Impute missing values with mean
    imputer = SimpleImputer(strategy="mean")
    matrix_imputed = imputer.fit_transform(matrix)

    return matrix_imputed


def normalize_genotypes(genotype_matrix: np.ndarray) -> np.ndarray:
    """
    Normalize genotype matrix (standardize by variant).

    Each variant (column) is standardized to have mean=0 and std=1.
    """
    scaler = StandardScaler()
    return scaler.fit_transform(genotype_matrix)


def filter_low_maf_variants(
    genotype_matrix: np.ndarray,
    min_maf: float = 0.01
) -> tuple[np.ndarray, np.ndarray]:
    """
    Filter variants with low minor allele frequency.

    Args:
        genotype_matrix: shape (n_samples, n_variants)
        min_maf: minimum MAF threshold

    Returns:
        filtered_matrix: filtered genotype matrix
        kept_indices: indices of kept variants
    """
    n_samples = genotype_matrix.shape[0]

    # Calculate allele frequencies for each variant
    allele_counts = np.sum(genotype_matrix, axis=0)
    allele_freqs = allele_counts / (2 * n_samples)

    # MAF is the minimum of freq and 1-freq
    maf = np.minimum(allele_freqs, 1 - allele_freqs)

    # Keep variants above MAF threshold
    kept_indices = np.where(maf >= min_maf)[0]
    filtered_matrix = genotype_matrix[:, kept_indices]

    return filtered_matrix, kept_indices


def prepare_genotype_matrix(
    genotype_matrix: np.ndarray,
    normalize: bool = True,
    filter_maf: float = 0.0
) -> np.ndarray:
    """
    Prepare genotype matrix for analysis.

    Steps:
    1. Handle missing values
    2. Filter low MAF variants (optional)
    3. Normalize (optional)

    Args:
        genotype_matrix: raw genotype matrix
        normalize: whether to normalize
        filter_maf: MAF threshold (0 = no filtering)

    Returns:
        prepared genotype matrix
    """
    # Encode and impute
    matrix = encode_genotypes(genotype_matrix)

    # Filter low MAF variants
    if filter_maf > 0:
        matrix, _ = filter_low_maf_variants(matrix, min_maf=filter_maf)

    # Normalize
    if normalize:
        matrix = normalize_genotypes(matrix)

    return matrix
