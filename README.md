# 🐦 Bird Sort Solver

Mobile-optimized puzzle game built with React 18 + Vite + Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Deploy to GitHub Pages
npm run deploy
```

## 📦 Project Info

- **Project name:** birdsolver
- **GitHub repo:** birdsolver (must match exactly!)
- **Live URL:** https://YOUR-USERNAME.github.io/birdsolver/

## ⚙️ Configuration

The `vite.config.js` is already configured:
```javascript
base: '/birdsolver/'  // Matches repo name
```

## 🎮 Features

- Random puzzle generation
- Auto-solver with optimal solutions
- Hidden mode and discovery mode
- Mobile-optimized (24px birds, 2-column layout)
- Save/load puzzles
- Undo system
- Solution playback

## 📱 Mobile Optimizations

- Responsive bird sizing (24px on mobile, 36px tablet, 48px desktop)
- 2-column grid on all devices
- Touch-friendly interface
- Optimized animations
- Minimal spacing for maximum content

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

## 📂 Project Structure

```
birdsolver/
├── src/
│   ├── App.jsx         # Main game component (88KB)
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles + Tailwind
├── index.html          # HTML template
├── vite.config.js      # Vite config (base: '/birdsolver/')
├── tailwind.config.js  # Tailwind config
└── package.json        # Dependencies
```

## 🚀 Deployment to GitHub Pages

### Step 1: Create GitHub Repo

1. Go to https://github.com/new
2. Repository name: **birdsolver** (exactly this!)
3. Make it Public
4. Don't initialize with README
5. Create repository

### Step 2: Deploy

```bash
npm run deploy
```

This will:
1. Build your project
2. Create `gh-pages` branch
3. Push built files to GitHub

### Step 3: Configure GitHub Pages

1. Go to repo Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages**
4. Folder: **/ (root)**
5. Save

### Step 4: Visit

Wait 2-3 minutes, then visit:
```
https://YOUR-USERNAME.github.io/birdsolver/
```

## ✅ Success Checklist

- [ ] Created GitHub repo named `birdsolver`
- [ ] Ran `npm install`
- [ ] Tested with `npm run dev` (works locally)
- [ ] Ran `npm run deploy` (shows "Published")
- [ ] Set GitHub Pages to `gh-pages` branch
- [ ] Waited 2-3 minutes
- [ ] Site loads at https://USERNAME.github.io/birdsolver/

## 🔧 Troubleshooting

### 404 Errors
- Make sure GitHub repo is named **birdsolver** (exactly)
- Verify GitHub Pages is set to `gh-pages` branch
- Hard refresh browser: Ctrl+Shift+R

### npm not found
- Install Node.js from https://nodejs.org

### Deploy fails
- Check if you have git configured
- Make sure you pushed to a GitHub repo named `birdsolver`

## 📊 Performance

- **Build time:** 5-10 seconds
- **Bundle size:** ~150KB gzipped
- **Load time:** 1-2 seconds
- **Lighthouse score:** 90+

## 🎯 Why This Name?

**birdsolver** is used consistently everywhere:
- Local folder name ✅
- GitHub repository name ✅
- vite.config.js base path ✅
- No confusion, no mismatches!

---

Made with ❤️ and 🐦
