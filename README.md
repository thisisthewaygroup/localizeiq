# MiniMed Analytics Dashboard

eCommerce Funnel · Day One Operations View

## Push to GitHub

Run these commands in your terminal from the project directory:

```bash
cd /Users/ryansoifer/minimed-analytics-dashboard

# Remove any partial .git (if present)
rm -rf .git

# Initialize repo, commit, and push
git init
git add .
git commit -m "Initial commit: MiniMed analytics dashboard"

# Create repo on GitHub (requires GitHub CLI: brew install gh && gh auth login)
gh repo create minimed-analytics-dashboard --public --source=. --push
```

**Without GitHub CLI:** Create a new repo at [github.com/new](https://github.com/new) named `minimed-analytics-dashboard`, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/minimed-analytics-dashboard.git
git branch -M main
git push -u origin main
```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI (recommended)

```bash
# Install Vercel CLI globally (if not already)
npm i -g vercel

# From the project directory
cd minimed-analytics-dashboard
npm install
vercel
```

Follow the prompts to link your project and deploy.

### Option 2: Deploy via Vercel Dashboard

1. Push this project to GitHub (or GitLab/Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New** → **Project**
4. Import your repository
5. Vercel will auto-detect Next.js — click **Deploy**

### Option 3: One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/minimed-analytics-dashboard)

(Replace `YOUR_USERNAME` with your GitHub username after pushing)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Changes from original

- **Insurance Scan** → **Insurance Upload**
- **Rx + Product Choice** → **Product Review & Resupply Cadence**
- **Payment** → **Order**
