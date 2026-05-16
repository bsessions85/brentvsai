# BrentVsAI — Claude Code Context

## Project overview
Static HTML site for the BrentVsAI brand. No framework, no build step, no dependencies.
Brent is doing a $0 to $10K in 90 days challenge using AI, documenting it publicly on TikTok, Instagram, and YouTube (@brentvsai). He sells a white-labeled digital marketing course on Skool for $497.

## Repo structure
```
brentvsai/
  site/                        <- everything served by Vercel
    index.html                 <- link-in-bio homepage
    free/index.html            <- 3-second redirect to Skool free community
    course/index.html          <- "Build It With AI" sales page ($497)
    quiz/niche/index.html      <- Find Your Niche quiz (lead magnet)
    assets/
      profile.png              <- profile photo used site-wide
      favicon.svg              <- source favicon (bold gold "B" on dark)
      favicon.ico              <- generated from realfavicongenerator.net
      favicon-96x96.png
      apple-touch-icon.png
      web-app-manifest-*.png
  .env                         <- GITHUB_TOKEN + GITHUB_REPO (never commit)
  .gitignore                   <- excludes .env and .DS_Store
```

## Deployment
- Hosted on Vercel, connected to GitHub repo: https://github.com/bsessions85/brentvsai.git
- Vercel root directory is set to `site/` in Vercel dashboard settings (no vercel.json)
- Pushing to `main` triggers auto-deploy (~30 seconds)
- No build step — Vercel serves static files directly

## Key URLs
- Live site: https://brentvsai.com
- Free community: https://www.skool.com/brent-vs-ai-1732
- Paid course: https://www.skool.com/brent-vs-ai-1732

## Design system
All pages share the same design tokens. Never introduce new colors or fonts.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0e0e0e` | Page background |
| `--surface` | `#161616` | Card backgrounds |
| `--surface2` | `#1e1e1e` | Elevated surfaces |
| `--border` | `#2a2a2a` | Default borders |
| `--border2` | `#3a3a3a` | Elevated borders |
| `--text` | `#e8e6e0` | Primary text |
| `--muted` | `#6b6b6b` | Secondary text |
| `--accent` | `#e8c468` | Gold - CTAs, highlights |
| `--mono` | JetBrains Mono | Code, labels, headings |
| `--sans` | DM Sans | Body text |

## Page-specific notes

### site/index.html — Link in bio
- CONFIG block near bottom of file controls all editable content
- Update `day`, `earned`, `tiktok`, `instagram`, `youtube` stats here weekly
- Profile photo: `assets/profile.png` (falls back to "B" initials if missing)
- Skool free community link is in the `links` array

### site/free/index.html — Skool redirect
- Single variable `SKOOL_URL` at bottom of file controls where it redirects
- 3-second countdown then auto-redirect

### site/course/index.html — Sales page
- Course name: **Build It With AI** — never call it "the $497 course" or "the white-label course"
- 9 numbered modules (01-09) + 3 bonus modules
- Profile photo path: `../assets/profile.png` (one level up from course/)
- All Skool URLs point to: https://www.skool.com/brent-vs-ai-1732

### site/quiz/niche/index.html — Niche quiz
- 5 questions, 44 niches, tag-based scoring
- Results push to free community (primary CTA) and course page (secondary)
- No email required — intentional

## Voice and tone rules
- Dry, self-deprecating, real — never guru, never hype
- Short sentences
- No em dashes — use a plain dash or rewrite
- Connect content back to the challenge or the course
- Never call it "the white-label course" or "the $497 course"
- Call it "Build It With AI" or "the course"

## Common tasks

### Update weekly stats (index.html CONFIG block)
Find the CONFIG block near the bottom of `site/index.html` and update:
```js
day:       "X",
earned:    "$X",
tiktok:    "X",
instagram: "X",
youtube:   "X",
```

### Push to GitHub
Network access is restricted in Claude's sandbox — Brent must push from Terminal:
```bash
cd ~/brentvsai
git add .
git commit -m "describe changes"
git push
```
