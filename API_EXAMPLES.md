# PopStruct API Examples

This document provides examples of using the PopStruct API.

## Base URL

```
http://localhost:8000  (Development)
https://api.yourdomain.com  (Production)
```

## Authentication

### Sign Up

```bash
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
  }'
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Login

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Get Current User

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Datasets

### Upload Dataset

```bash
curl -X POST "http://localhost:8000/api/v1/datasets" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/genotypes.vcf" \
  -F "name=My Dataset" \
  -F "description=Test genomic data"
```

Response:
```json
{
  "id": 1,
  "name": "My Dataset",
  "description": "Test genomic data",
  "file_type": "vcf",
  "file_size_mb": 12.5,
  "n_samples": 100,
  "n_variants": 50000,
  "owner_id": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### List Datasets

```bash
curl -X GET "http://localhost:8000/api/v1/datasets?page=1&page_size=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Dataset by ID

```bash
curl -X GET "http://localhost:8000/api/v1/datasets/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Dataset

```bash
curl -X DELETE "http://localhost:8000/api/v1/datasets/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Analysis

### Create PCA Analysis

```bash
curl -X POST "http://localhost:8000/api/v1/analysis/pca" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PCA Analysis - Dataset 1",
    "dataset_id": 1,
    "parameters": {
      "n_components": 10,
      "normalize": true
    }
  }'
```

Response:
```json
{
  "id": 1,
  "name": "PCA Analysis - Dataset 1",
  "analysis_type": "pca",
  "status": "pending",
  "progress_percent": 0,
  "dataset_id": 1,
  "user_id": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Create Clustering Analysis

```bash
curl -X POST "http://localhost:8000/api/v1/analysis/clustering" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "K-means Clustering",
    "dataset_id": 1,
    "parameters": {
      "n_clusters": 3,
      "max_iter": 300
    }
  }'
```

### Create Kinship Analysis

```bash
curl -X POST "http://localhost:8000/api/v1/analysis/kinship" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kinship Matrix",
    "dataset_id": 1,
    "parameters": {
      "method": "ibs"
    }
  }'
```

### Create Full Analysis

```bash
curl -X POST "http://localhost:8000/api/v1/analysis/full" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Complete Population Analysis",
    "dataset_id": 1,
    "parameters": {
      "pca": {
        "n_components": 10,
        "normalize": true
      },
      "clustering": {
        "n_clusters": 3
      },
      "kinship": {
        "method": "ibs"
      }
    }
  }'
```

## Jobs

### List Jobs

```bash
curl -X GET "http://localhost:8000/api/v1/jobs?page=1&page_size=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Job by ID

```bash
curl -X GET "http://localhost:8000/api/v1/jobs/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response:
```json
{
  "id": 1,
  "name": "PCA Analysis - Dataset 1",
  "analysis_type": "pca",
  "status": "completed",
  "progress_percent": 100,
  "dataset_id": 1,
  "user_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "started_at": "2024-01-01T00:01:00Z",
  "completed_at": "2024-01-01T00:05:00Z"
}
```

### Get Job Results

```bash
curl -X GET "http://localhost:8000/api/v1/jobs/1/results" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response:
```json
{
  "job_id": 1,
  "results": [
    {
      "id": 1,
      "job_id": 1,
      "pca_variance_explained": [0.15, 0.12, 0.08, 0.06],
      "result_file_path": "/path/to/results.zip",
      "result_size_mb": 2.5,
      "created_at": "2024-01-01T00:05:00Z"
    }
  ]
}
```

### Download Results

```bash
curl -X GET "http://localhost:8000/api/v1/jobs/1/download" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o results.zip
```

### Delete Job

```bash
curl -X DELETE "http://localhost:8000/api/v1/jobs/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Python Client Example

```python
import requests

BASE_URL = "http://localhost:8000"

# Login
response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": "user@example.com", "password": "securepassword"}
)
tokens = response.json()
access_token = tokens["access_token"]

# Set headers
headers = {"Authorization": f"Bearer {access_token}"}

# Upload dataset
with open("genotypes.vcf", "rb") as f:
    files = {"file": f}
    data = {"name": "My Dataset", "description": "Test data"}
    response = requests.post(
        f"{BASE_URL}/api/v1/datasets",
        headers=headers,
        files=files,
        data=data
    )
    dataset = response.json()

# Create full analysis
response = requests.post(
    f"{BASE_URL}/api/v1/analysis/full",
    headers=headers,
    json={
        "name": "Complete Analysis",
        "dataset_id": dataset["id"],
        "parameters": {
            "pca": {"n_components": 10},
            "clustering": {"n_clusters": 3},
            "kinship": {"method": "ibs"}
        }
    }
)
job = response.json()

# Poll job status
import time
while True:
    response = requests.get(
        f"{BASE_URL}/api/v1/jobs/{job['id']}",
        headers=headers
    )
    job_status = response.json()
    print(f"Status: {job_status['status']} ({job_status['progress_percent']}%)")

    if job_status["status"] in ["completed", "failed"]:
        break

    time.sleep(5)

# Download results
if job_status["status"] == "completed":
    response = requests.get(
        f"{BASE_URL}/api/v1/jobs/{job['id']}/download",
        headers=headers
    )
    with open("results.zip", "wb") as f:
        f.write(response.content)
    print("Results downloaded!")
```

## JavaScript/TypeScript Client Example

```typescript
const BASE_URL = 'http://localhost:8000';

// Login
async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

// Upload dataset
async function uploadDataset(token: string, file: File, name: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);

  const response = await fetch(`${BASE_URL}/api/v1/datasets`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return response.json();
}

// Create analysis
async function createFullAnalysis(token: string, datasetId: number) {
  const response = await fetch(`${BASE_URL}/api/v1/analysis/full`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Full Analysis',
      dataset_id: datasetId,
      parameters: {
        pca: { n_components: 10 },
        clustering: { n_clusters: 3 },
        kinship: { method: 'ibs' },
      },
    }),
  });
  return response.json();
}

// Get job status
async function getJobStatus(token: string, jobId: number) {
  const response = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid file type. Allowed: .vcf, .csv"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "detail": "Dataset not found"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Daily job limit of 10 reached for free tier"
}
```

## Rate Limits

- **Free Tier**: 10 jobs/day, 50MB max file size
- **Premium Tier**: 100 jobs/day, 500MB max file size

## Support

For API support, please refer to the interactive documentation at `/docs` or contact support.
