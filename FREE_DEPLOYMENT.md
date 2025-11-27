# FREE Deployment Guide for PopStruct

Deploy PopStruct completely FREE using:
- **Vercel** (Frontend)
- **Render** (Backend)
- **Neon** (PostgreSQL)
- **Upstash** (Redis)

Total Cost: **$0/month** 🎉

> **📋 Prefer a checklist format?** See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## Prerequisites

- GitHub account
- Accounts on: Vercel, Render, Neon, Upstash (all free)

---

## Step 1: Setup Database (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Sign up/login (free)
3. Click **"Create Project"**
4. Name it `popstruct`
5. Copy the **Connection String** (looks like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)
6. Save it for later ✅

---

## Step 2: Setup Redis (Upstash)

1. Go to [upstash.com](https://upstash.com)
2. Sign up/login (free)
3. Click **"Create Database"**
4. Choose **Redis**, name it `popstruct`
5. Select closest region
6. Copy the **Redis URL** (looks like: `redis://default:xxx@xxx.upstash.io:6379`)
7. Save it for later ✅

---

## Step 3: Push Code to GitHub

```bash
cd PopStruct
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/popstruct.git
git push -u origin main
```

---

## Step 4: Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. Click **"New +"** → **"Blueprint"**
4. Connect your `popstruct` repository
5. Render will detect `render.yaml` automatically
6. Click **"Apply"**

### Add Environment Variables:

Go to **Dashboard** → **popstruct-backend** → **Environment**

Add these variables:

```bash
DATABASE_URL=<your-neon-connection-string>
REDIS_URL=<your-upstash-redis-url>
CELERY_BROKER_URL=<your-upstash-redis-url>
CELERY_RESULT_BACKEND=<your-upstash-redis-url>
SECRET_KEY=<generate-random-32-char-string>
ALLOWED_ORIGINS=https://your-app.vercel.app
ENVIRONMENT=production
```

To generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

7. Click **"Save Changes"**
8. Wait for deployment (5-10 mins)
9. Copy your backend URL: `https://popstruct-backend.onrender.com`

### Run Database Migration:

In Render dashboard → **popstruct-backend** → **Shell**

```bash
alembic upgrade head
```

---

## Step 5: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import your `popstruct` repository
5. Set **Root Directory** to `frontend`
6. Framework: **Next.js** (auto-detected)

### Add Environment Variable:

```bash
NEXT_PUBLIC_API_URL=https://popstruct-backend.onrender.com
```

7. Click **"Deploy"**
8. Wait 2-3 minutes
9. Your app is live! 🚀

---

## Step 6: Update CORS

Go back to **Render** → **popstruct-backend** → **Environment**

Update `ALLOWED_ORIGINS` with your Vercel URL:
```bash
ALLOWED_ORIGINS=https://your-app-name.vercel.app
```

Save and redeploy.

---

## Step 7: Test Your App

1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Click **"Sign Up"**
3. Create an account
4. Upload a test VCF/CSV file
5. Run an analysis!

---

## Important Notes

### Free Tier Limitations:

**Render (Backend):**
- ⏰ Sleeps after 15 mins of inactivity
- 🐌 Cold start takes 30-60 seconds
- 💾 750 hours/month (enough for testing)
- 🔄 Restarts daily

**Neon (Database):**
- 💽 500 MB storage
- 🔌 Auto-pause after 5 mins inactivity
- 📊 Enough for ~1000 datasets

**Upstash (Redis):**
- 📦 10,000 commands/day
- 🔄 Good for ~100 jobs/day

**Vercel (Frontend):**
- ⚡ Always fast
- 🌐 100 GB bandwidth/month
- 🔥 Unlimited builds

### File Storage Issue:

⚠️ **Render uses ephemeral storage** - uploaded files are deleted on restart!

**Solutions:**
1. **Supabase Storage** (1GB free): [supabase.com](https://supabase.com)
2. **Cloudflare R2** (10GB free): [cloudflare.com](https://cloudflare.com/products/r2)
3. **Upgrade to Render Disk** ($1/month for 1GB persistent)

---

## Alternative: Railway (Simpler but costs $5/month after free credit)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub"**
4. Select `popstruct` repo
5. Railway auto-detects everything!
6. Add PostgreSQL and Redis from Railway marketplace
7. Environment variables auto-populate
8. Deploy! ✅

**Pros:** Simpler, persistent storage, no cold starts
**Cons:** $5-10/month after free trial

---

## Monitoring

### Render:
- View logs: Dashboard → Service → Logs
- Check health: `https://your-backend.onrender.com/health`

### Vercel:
- View deployments: Dashboard → Project → Deployments
- Check analytics: Dashboard → Analytics

---

## Troubleshooting

### Backend not responding:
- First request after sleep takes 30-60s (cold start)
- Check Render logs for errors
- Verify environment variables are set

### Database connection failed:
- Check Neon is active (auto-pauses after 5 mins)
- Verify DATABASE_URL is correct
- Check connection string includes `?sslmode=require`

### CORS errors:
- Update ALLOWED_ORIGINS in Render
- Must include `https://` in URL
- Restart backend service

### File upload fails:
- Files stored in `/tmp` (ephemeral)
- Implement S3/Supabase for persistence
- Or upgrade to Render Disk

---

## Upgrade Path

When you're ready to scale:

1. **Render Starter** ($7/month): No sleep, faster
2. **Persistent Storage** ($1/month): Keep uploaded files
3. **Neon Pro** ($19/month): More storage & compute
4. **Upstash Pro** ($10/month): More Redis capacity

Or migrate to AWS/DigitalOcean for full control.

---

## Need Help?

- Render Docs: [render.com/docs](https://render.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Neon Docs: [neon.tech/docs](https://neon.tech/docs)
- Open an issue on GitHub

---

## Summary

✅ **FREE Full-Stack Deployment**
✅ **No Credit Card Required**
✅ **Auto-Scaling**
✅ **HTTPS Included**
✅ **Perfect for MVP/Testing**

**Your PopStruct app is now live!** 🎉🧬

Time to deploy: ~20 minutes
Cost: **$0/month**

Happy analyzing! 🚀
