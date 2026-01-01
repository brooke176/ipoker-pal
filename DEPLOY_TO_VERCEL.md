# 🚀 Deploy to Vercel (5 minutes)

## Step 1: Push to GitHub (if not already done)

```bash
cd /Users/brookeskinner/Desktop/Repos/ipoker-pal

# Check if remote exists
git remote -v

# If no remote, add one:
# Go to github.com, create a new repo called "ipoker-pal"
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/ipoker-pal.git
git branch -M main
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

## Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Log In"** (use GitHub login)
3. Click **"Add New Project"**
4. Click **"Import Git Repository"**
5. Select your `ipoker-pal` repository
6. Vercel auto-detects it's a Vite app - click **"Deploy"**
7. Wait 2-3 minutes for deployment

## Step 3: Add Environment Variables

After deployment:
1. Click **"Settings"** in your project dashboard
2. Click **"Environment Variables"**
3. Add these from your `.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_URL`
4. Click **"Redeploy"** at the top

## Step 4: Get Your Production URL

Vercel will give you a URL like:
```
https://ipoker-pal-xxxxx.vercel.app
```

Copy this URL!

## Step 5: Update iOS App

I'll update the iOS app automatically once you give me the URL.

---

**Alternatively: Use Lovable (if this was built there)**

If you built this on Lovable, you already have deployment! Just:
1. Go to lovable.dev
2. Find your project
3. Click "Deploy"
4. Copy the production URL
