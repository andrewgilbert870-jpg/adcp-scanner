# ANZ AdCP Readiness Scanner
### by Systems That Decide · systemsthatdecide.io

Live scanner showing which ANZ publishers and advertisers have implemented the Ad Context Protocol (AdCP). Checks `adagents.json` (supply side) and `brand.json` (demand side) across the top 100 publishers and advertisers in the ANZ market.

---

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub

```bash
cd adcp-scanner
git init
git add .
git commit -m "Initial commit"
gh repo create adcp-scanner --public --push
```

Or create the repo manually at github.com and push.

### 2. Import to Vercel

1. Go to vercel.com → Add New Project
2. Import your GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy**

It will fail on first deploy because the API key is missing. That's expected.

### 3. Add your Anthropic API key

1. In Vercel: Project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
3. Click Save
4. Go to Deployments → Redeploy

Done. Your scanner is live.

---

## Run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000

---

## How it works

- The UI calls `/api/scan` with a scan type (`publishers` or `advertisers`)
- The API route holds the Anthropic API key server-side (never exposed to the browser)
- One API call returns all 100 assessments as a JSON array
- Results render immediately on completion

## Updating the publisher/advertiser lists

Edit the `PUBLISHERS` and `ADVERTISERS` arrays in `/pages/api/scan.js`.

---

## Notes

- API costs: ~$0.01–0.03 per full scan (100 items, single call)
- Each scan takes 15–30 seconds depending on API response time
- Results reflect Claude's knowledge of AdCP adoption as of May 2026
- For live endpoint verification: `curl https://[domain]/.well-known/adagents.json`
