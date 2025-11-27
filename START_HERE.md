# 🚀 START HERE - PopStruct Quick Navigation

Welcome to **PopStruct** - Your genomic population structure analysis platform!

---

## 🎯 What is PopStruct?

A **production-ready SaaS platform** for analyzing genomic data:
- 📊 **PCA Analysis** - Visualize population structure
- 👥 **K-means Clustering** - Identify genetic groups
- 🧬 **Kinship Matrix** - Calculate relatedness (IBS/GRM)
- 📦 **One-Click Reports** - Download results as ZIP

---

## 🆓 Deploy NOW (100% FREE)

Want your app live in 20 minutes?

### Quick Path:
1. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ← Start here! Step-by-step checklist
2. Follow the guide
3. Your app is live! 🎉

### Detailed Guide:
**[FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)** - Complete walkthrough with screenshots

**Stack**: Vercel + Render + Neon + Upstash
**Cost**: $0/month
**Time**: 20 minutes

---

## 📚 Documentation Index

### Getting Started
- 📋 **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Easiest way to deploy
- 🆓 **[FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)** - Detailed free deployment guide
- 🚀 **[QUICK_START.md](./QUICK_START.md)** - All deployment options overview
- ⚖️ **[DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md)** - Compare all hosting options

### Development
- 📖 **[README.md](./README.md)** - Project overview and tech stack
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development setup and guidelines
- 📡 **[API_EXAMPLES.md](./API_EXAMPLES.md)** - API usage examples (Python, JS, curl)

### Production
- 🚢 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment (AWS, DigitalOcean)
- ⚙️ **[.env.example](./.env.example)** - Environment configuration template
- 🆓 **[.env.free-tier](./.env.free-tier)** - Free tier environment template

---

## 🎬 Choose Your Path

### Path 1: I want to deploy NOW (FREE) ⚡
→ **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

### Path 2: I want to understand options first 🤔
→ **[DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md)**

### Path 3: I want to develop locally 💻
→ **[CONTRIBUTING.md](./CONTRIBUTING.md)** + run `docker-compose up -d`

### Path 4: I need production hosting 🏢
→ **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Path 5: I just want to see the API 📡
→ **[API_EXAMPLES.md](./API_EXAMPLES.md)**

---

## 💡 Quick Commands

### Local Development:
```bash
# Start everything
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Validate Environment:
```bash
python validate-env.py
```

### Check Deployment Health:
```bash
./check-deployment.sh https://your-backend.onrender.com https://your-app.vercel.app
```

---

## 🎓 How It Works

### Upload Data
- VCF files (genomic variants)
- CSV files (genotype matrix)

### Run Analysis
- **PCA**: See population structure in 2D/3D plots
- **Clustering**: Auto-identify K genetic groups
- **Kinship**: Calculate relatedness matrix

### Download Results
- ZIP file with:
  - CSV data files
  - PNG plots (PCA, clusters, heatmaps)
  - Summary report
  - Analysis metadata

---

## 🏗️ Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL + SQLAlchemy
- Celery + Redis
- scikit-learn
- scikit-allel (VCF parsing)

**Frontend:**
- Next.js 14 + TypeScript
- TailwindCSS
- React Query
- shadcn/ui

**Infrastructure:**
- Docker + Docker Compose
- Alembic migrations
- JWT authentication
- Stripe (payments)

---

## 📊 Deployment Comparison

| Option | Cost | Setup | Best For |
|--------|------|-------|----------|
| **FREE Tier** | $0/mo | 20 min | MVP, Testing |
| **Railway** | $5-10/mo | 10 min | Small Production |
| **DigitalOcean** | $40/mo | 2 hrs | Growing Apps |
| **AWS** | $100+/mo | 4 hrs | Enterprise |

Full comparison: **[DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md)**

---

## 🆘 Need Help?

### Common Issues:
- **Backend not responding?** → Wait 30-60s (cold start on free tier)
- **CORS errors?** → Update `ALLOWED_ORIGINS` in environment
- **Database errors?** → Run migrations: `alembic upgrade head`
- **Upload fails?** → Check file size limits for your tier

### Resources:
- 📖 Read the [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md) troubleshooting section
- 🐛 Open an issue on GitHub
- 📧 Check your backend logs on Render/Railway
- 🔍 Visit API docs at `/docs` endpoint

---

## ✅ Quick Checklist

Before deploying, make sure you have:

- [ ] GitHub account
- [ ] Code pushed to GitHub
- [ ] Signed up for Vercel (frontend)
- [ ] Signed up for Render (backend)
- [ ] Created Neon database (PostgreSQL)
- [ ] Created Upstash database (Redis)
- [ ] Read [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**Ready?** → **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

---

## 🎉 What's Next?

After deploying:

1. **Test it out**:
   - Sign up for an account
   - Upload a sample VCF/CSV
   - Run PCA analysis
   - Download results

2. **Customize**:
   - Add your logo
   - Change color scheme
   - Configure Stripe for payments

3. **Scale**:
   - Monitor usage
   - Upgrade when needed
   - See [DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md)

---

## 🌟 Features to Explore

- 🔐 **JWT Authentication** - Secure user accounts
- 📁 **File Upload** - Drag-and-drop VCF/CSV
- ⚡ **Background Jobs** - Celery + Redis for async processing
- 📊 **Beautiful Plots** - PCA scatter, cluster plots, heatmaps
- 💰 **Subscription Tiers** - Free & Premium with usage limits
- 📦 **ZIP Reports** - Download all results at once

---

## 📜 License

MIT License - Free to use, modify, and distribute!

---

## 🙏 Credits

Built with:
- FastAPI
- Next.js
- scikit-learn
- scikit-allel
- TailwindCSS

---

**Ready to deploy?**

👉 **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ← Start here!

Or jump to: **[FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md)** for the full guide

---

*PopStruct - Making genomic analysis accessible to everyone* 🧬✨
