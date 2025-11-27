# PopStruct Deployment Guide

This guide covers deploying PopStruct to production.

## Prerequisites

- Docker & Docker Compose
- PostgreSQL database
- Redis instance
- Domain name (optional)
- SSL certificate (recommended)

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@db-host:5432/popstruct
POSTGRES_USER=popstruct
POSTGRES_PASSWORD=strong-password-here
POSTGRES_DB=popstruct

# Security
SECRET_KEY=your-secret-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Redis
REDIS_URL=redis://redis-host:6379/0
CELERY_BROKER_URL=redis://redis-host:6379/0
CELERY_RESULT_BACKEND=redis://redis-host:6379/0

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_basic_monthly_id

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Email
SMTP_HOST=smtp.yourmailserver.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@yourdomain.com

# Environment
ENVIRONMENT=production
```

## Docker Deployment

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/popstruct.git
cd popstruct
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

### 3. Build and Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Run Database Migrations
```bash
docker-compose exec backend alembic upgrade head
```

### 5. Create Admin User (Optional)
```bash
docker-compose exec backend python -c "
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
admin = User(
    email='admin@yourdomain.com',
    hashed_password=get_password_hash('your-admin-password'),
    full_name='Admin User',
    is_admin=True,
    is_active=True
)
db.add(admin)
db.commit()
print('Admin user created')
"
```

## Production Considerations

### Security

1. **Use HTTPS**: Always use SSL/TLS in production
2. **Strong Secrets**: Generate strong SECRET_KEY
3. **Firewall**: Restrict database and Redis access
4. **Rate Limiting**: Implement rate limiting on API
5. **CORS**: Configure proper CORS origins

### Database

1. **Backups**: Set up automated database backups
2. **Connection Pooling**: Configure appropriate pool sizes
3. **Monitoring**: Monitor database performance

### File Storage

For production, consider using:
- AWS S3 for file storage
- CloudFront for CDN
- Configure in `app/core/config.py`

### Monitoring

1. **Application Logs**: Use centralized logging (e.g., ELK stack)
2. **Error Tracking**: Integrate Sentry or similar
3. **Performance**: Use APM tools (New Relic, Datadog)
4. **Health Checks**: Monitor `/health` endpoint

### Scaling

#### Horizontal Scaling

1. **Backend**: Run multiple FastAPI instances behind load balancer
2. **Celery Workers**: Scale workers based on queue length
3. **Database**: Consider read replicas for heavy read loads

#### Vertical Scaling

- Increase CPU/RAM for compute-heavy tasks
- Optimize PostgreSQL configuration
- Tune Redis settings

## Nginx Configuration Example

```nginx
upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Docs
    location /docs {
        proxy_pass http://backend;
    }
}
```

## Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (to be added).

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment script
          ssh user@server 'cd /app && git pull && docker-compose up -d --build'
```

## Troubleshooting

### Database Connection Issues
```bash
# Check database connectivity
docker-compose exec backend python -c "from app.core.database import engine; engine.connect()"
```

### Celery Not Processing Jobs
```bash
# Check Celery worker logs
docker-compose logs -f celery_worker

# Inspect Redis queue
docker-compose exec redis redis-cli
> LLEN celery
```

### High Memory Usage
- Monitor with `docker stats`
- Adjust worker counts
- Implement caching strategies

## Maintenance

### Database Backup
```bash
docker-compose exec db pg_dump -U popstruct popstruct > backup.sql
```

### Database Restore
```bash
docker-compose exec -T db psql -U popstruct popstruct < backup.sql
```

### Update Application
```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
docker-compose exec backend alembic upgrade head
```

## Support

For deployment issues, please open an issue on GitHub or contact support.
