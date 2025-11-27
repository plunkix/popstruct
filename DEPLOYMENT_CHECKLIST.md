# ✅ FREE Deployment Checklist

Follow this checklist to deploy PopStruct for **$0/month**

---

## Pre-Deployment (5 mins)

- [ ] Create GitHub account (if you don't have one)
- [ ] Create accounts on:
  - [ ] [Vercel.com](https://vercel.com) - Sign up with GitHub
  - [ ] [Render.com](https://render.com) - Sign up with GitHub
  - [ ] [Neon.tech](https://neon.tech) - Sign up (free PostgreSQL)
  - [ ] [Upstash.com](https://upstash.com) - Sign up (free Redis)

---

## Step 1: Database Setup (3 mins)

### Neon PostgreSQL:
- [ ] Go to [neon.tech](https://neon.tech)
- [ ] Click "Create Project"
- [ ] Name: `popstruct`
- [ ] Copy connection string → Save in notepad
- [ ] ✅ Done!

### Upstash Redis:
- [ ] Go to [upstash.com](https://upstash.com)
- [ ] Click "Create Database"
- [ ] Type: Redis
- [ ] Name: `popstruct`
- [ ] Copy Redis URL → Save in notepad
- [ ] ✅ Done!

---

## Step 2: Push to GitHub (2 mins)

```bash
cd PopStruct
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/popstruct.git
git push -u origin main
```

- [ ] Code pushed to GitHub
- [ ] ✅ Done!

---

## Step 3: Deploy Backend on Render (5 mins)

- [ ] Go to [render.com](https://render.com)
- [ ] Click "New +" → "Blueprint"
- [ ] Connect GitHub repository: `popstruct`
- [ ] Render detects `render.yaml` automatically
- [ ] Click "Apply"
- [ ] Wait for services to spin up (~3 mins)

### Add Environment Variables:
- [ ] Go to Dashboard → `popstruct-backend` → Environment
- [ ] Add these variables:

```bash
DATABASE_URL=<paste-your-neon-connection-string>
REDIS_URL=<paste-your-upstash-redis-url>
CELERY_BROKER_URL=<paste-your-upstash-redis-url>
CELERY_RESULT_BACKEND=<paste-your-upstash-redis-url>
SECRET_KEY=<generate-random-string>
ALLOWED_ORIGINS=*
ENVIRONMENT=production
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

- [ ] Click "Save Changes"
- [ ] Wait for redeploy (~2 mins)
- [ ] Copy backend URL: `https://popstruct-backend.onrender.com`

### Run Database Migration:
- [ ] Dashboard → `popstruct-backend` → Shell (top right)
- [ ] Run: `alembic upgrade head`
- [ ] Wait for "✓ Running migrations complete"
- [ ] ✅ Done!

---

## Step 4: Deploy Frontend on Vercel (3 mins)

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New Project"
- [ ] Import `popstruct` from GitHub
- [ ] Set Root Directory: `frontend`
- [ ] Framework Preset: Next.js (auto-detected)

### Add Environment Variable:
```bash
NEXT_PUBLIC_API_URL=https://popstruct-backend.onrender.com
```

- [ ] Click "Deploy"
- [ ] Wait ~2 mins
- [ ] Copy your Vercel URL: `https://your-app.vercel.app`
- [ ] ✅ Done!

---

## Step 5: Update CORS (1 min)

- [ ] Go back to Render → `popstruct-backend` → Environment
- [ ] Update `ALLOWED_ORIGINS`:
```bash
ALLOWED_ORIGINS=https://your-app.vercel.app
```
- [ ] Save Changes
- [ ] ✅ Done!

---

## Step 6: Test Your App! (2 mins)

- [ ] Visit: `https://your-app.vercel.app`
- [ ] Click "Sign Up"
- [ ] Create account with email/password
- [ ] You should see the dashboard
- [ ] ✅ App is LIVE! 🎉

---

## Optional: Test Upload & Analysis

- [ ] Click "Upload Dataset"
- [ ] Upload a small VCF or CSV file
- [ ] Go to "Analysis" → "Create New"
- [ ] Select "Full Analysis"
- [ ] Wait for job to complete
- [ ] Download results ZIP
- [ ] ✅ Everything works! 🚀

---

## Troubleshooting

### Backend not responding?
- ⏰ First request takes 30-60s (cold start)
- Check Render logs for errors
- Verify all env variables are set

### Can't sign up?
- Check browser console for CORS errors
- Verify ALLOWED_ORIGINS matches your Vercel URL exactly
- Try with `ALLOWED_ORIGINS=*` temporarily

### Database errors?
- Verify Neon connection string is correct
- Make sure you ran `alembic upgrade head`
- Check Neon dashboard - database should be active

---

## 🎉 Congratulations!

Your PopStruct app is now deployed and running for **FREE**!

**Share your deployment:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://popstruct-backend.onrender.com`
- API Docs: `https://popstruct-backend.onrender.com/docs`

---

## Next Steps

- [ ] Add custom domain (Vercel → Settings → Domains)
- [ ] Set up file storage (Supabase/Cloudflare R2)
- [ ] Configure Stripe for payments
- [ ] Monitor usage and upgrade if needed

---

**Total Time:** ~20 minutes
**Total Cost:** $0/month

Welcome to PopStruct! 🧬✨
