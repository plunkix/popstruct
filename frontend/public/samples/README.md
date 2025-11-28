# Sample Data Files

This directory contains sample data files demonstrating the accepted formats for PopStruct analysis.

## VCF Format (sample.vcf)

**Standard Variant Call Format** files with the following requirements:
- Must include genotype (GT) field in FORMAT column
- Genotypes encoded as 0/0, 0/1, 1/1 (reference/alternate alleles)
- At least 3 samples recommended for meaningful analysis
- Minimum 10 SNPs recommended

## CSV Format (sample.csv)

**Comma-separated values** file with the following structure:
- First column: `sample_id` (unique identifier for each sample)
- Subsequent columns: SNP genotypes (named `snp_1`, `snp_2`, etc.)
- Genotypes encoded as 0, 1, or 2:
  - 0 = homozygous reference
  - 1 = heterozygous
  - 2 = homozygous alternate
- Optional: `population` column for validation (not required for analysis)
- At least 3 samples and 10 SNPs recommended

## Usage

Users can download these sample files to:
1. Understand the required data format
2. Test the PopStruct platform
3. Verify their own data formatting before upload
