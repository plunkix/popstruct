import os
import shutil
from pathlib import Path
from typing import Optional
import hashlib
from datetime import datetime


def get_file_size_mb(file_path: str) -> float:
    """Get file size in megabytes."""
    size_bytes = os.path.getsize(file_path)
    return size_bytes / (1024 * 1024)


def generate_unique_filename(original_filename: str, user_id: int) -> str:
    """Generate unique filename using timestamp and hash."""
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    file_ext = Path(original_filename).suffix
    base_name = Path(original_filename).stem

    # Create hash from user_id and timestamp
    hash_input = f"{user_id}_{timestamp}_{base_name}".encode()
    file_hash = hashlib.md5(hash_input).hexdigest()[:8]

    return f"{user_id}_{timestamp}_{file_hash}{file_ext}"


def save_upload_file(file_content: bytes, filename: str, upload_dir: str) -> str:
    """Save uploaded file to disk."""
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as f:
        f.write(file_content)

    return file_path


def delete_file(file_path: str) -> bool:
    """Delete a file from disk."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        print(f"Error deleting file {file_path}: {e}")
        return False


def create_results_directory(job_id: int, results_base_dir: str) -> str:
    """Create a directory for job results."""
    job_dir = os.path.join(results_base_dir, f"job_{job_id}")
    os.makedirs(job_dir, exist_ok=True)
    return job_dir


def zip_directory(directory_path: str, output_path: str) -> str:
    """Create a ZIP archive of a directory."""
    shutil.make_archive(output_path.replace(".zip", ""), "zip", directory_path)
    return output_path


def validate_file_extension(filename: str, allowed_extensions: list) -> bool:
    """Validate file extension."""
    file_ext = Path(filename).suffix.lower()
    return file_ext in allowed_extensions


def get_file_type(filename: str) -> Optional[str]:
    """Determine file type from extension."""
    file_ext = Path(filename).suffix.lower()

    if file_ext in [".vcf", ".vcf.gz"]:
        return "vcf"
    elif file_ext == ".csv":
        return "csv"
    elif file_ext == ".txt":
        return "txt"
    else:
        return None
