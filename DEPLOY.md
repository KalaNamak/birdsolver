# 🚀 Deployment Guide

## Clean, Simple Process

### Prerequisites
- Node.js installed (https://nodejs.org)
- GitHub account
- Git configured locally

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: **birdsolver**
3. Public repository
4. Don't initialize with anything
5. Click "Create repository"

### Step 2: Local Setup

```bash
# Extract the birdsolver folder
# Open terminal in the birdsolver folder

# Install dependencies
npm install
```

### Step 3: Test Locally

```bash
npm run dev
```

Open http://localhost:5173 - should work perfectly!

Press Ctrl+C to stop.

### Step 4: Deploy

```bash
npm run deploy
```

You'll see:
```
✓ built in 2.31s
Published
```

### Step 5: Configure GitHub Pages

1. Go to your repo: https://github.com/YOUR-USERNAME/birdsolver
2. Click **Settings**
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** ← Select this
   - Folder: **/ (root)** ← Select this
5. Click **Save**

### Step 6: Wait & Visit

Wait 2-3 minutes, then visit:
```
https://YOUR-USERNAME.github.io/birdsolver/
```

## 🎉 Done!

Your game should load in 1-2 seconds!

## 🔧 If Something Goes Wrong

### Problem: 404 errors for CSS/JS

**Solution:**
```bash
# Delete gh-pages branch and redeploy
git push origin --delete gh-pages
npm run build
npm run deploy
```

### Problem: npm not found

**Solution:** Install Node.js from https://nodejs.org

### Problem: Deploy says "Permission denied"

**Solution:** Configure git:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## ✅ Verification Checklist

- [ ] GitHub repo is named `birdsolver` (exact match)
- [ ] `npm install` completed successfully
- [ ] `npm run dev` works locally
- [ ] `npm run deploy` shows "Published"
- [ ] GitHub Pages set to `gh-pages` branch
- [ ] Waited 2-3 minutes
- [ ] Hard refreshed browser (Ctrl+Shift+R)

## 🎯 Key Points

**Everything is named `birdsolver`:**
- Folder name: `birdsolver` ✅
- GitHub repo: `birdsolver` ✅
- vite.config.js: `base: '/birdsolver/'` ✅

**No naming confusion = No deployment issues!**

---

Need help? Check README.md for troubleshooting tips.
