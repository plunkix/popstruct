# 🚀 QUICK START - Deploy in 20 Minutes

## Choose Your Path:

### Option 1: FREE Deployment (Recommended for MVP)
👉 **Follow [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)**

**Stack:**
- Vercel (Frontend)
- Render (Backend)
- Neon (PostgreSQL)
- Upstash (Redis)

**Cost:** $0/month
**Time:** 20 minutes
**Limitations:** Backend sleeps after inactivity, ephemeral storage

---

### Option 2: Railway ($5-10/month)
👉 **Easiest Setup**

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "Deploy from GitHub"
4. Add PostgreSQL & Redis services
5. Done! ✅

**Cost:** $5-10/month (after $5 free credit)
**Time:** 10 minutes
**Pros:** No cold starts, persistent storage

---

### Option 3: Local Development

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your settings
# (Use local PostgreSQL and Redis)

# 3. Start services
docker-compose up -d

# 4. Run migrations
docker-compose exec backend alembic upgrade head

# 5. Access app
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## After Deployment:

### Create First User:
Visit your app URL → Click "Sign Up"

### Test Analysis:
1. Upload a sample VCF/CSV file
2. Go to "Analysis" → "Create New"
3. Select PCA, Clustering, or Full Analysis
4. Wait for completion
5. Download results!

---

## Need Help?

- 📖 [Full README](./README.md)
- 🆓 [Free Deployment Guide](./FREE_DEPLOYMENT.md)
- 🚢 [Production Deployment](./DEPLOYMENT.md)
- 📡 [API Examples](./API_EXAMPLES.md)
- 🤝 [Contributing](./CONTRIBUTING.md)

---

**Choose FREE deployment to start testing with zero cost!** 🎉
