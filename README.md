# Verity

**Trusted clean-beauty med spas** — Miami launch, nationwide expansion.

Built for Vercel. No backend setup required for the MVP demo.

## What's included

- **Discovery** — verified Miami med spa listings
- **Provider profiles** — trust panel, gallery, Instagram, products used
- **Product reviews** — clean scores + linked spas
- **Reviews** — verified visit badges
- **Booking** — request-to-book flow
- **AI Concierge** — smart spa matching (add `OPENAI_API_KEY` for GPT-enhanced replies)

## Deploy to Vercel (easiest launch)

1. Push this folder to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the repo — Vercel auto-detects Next.js
4. Click **Deploy**

Optional: add `OPENAI_API_KEY` in Vercel → Settings → Environment Variables for AI Concierge.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Next steps

- [ ] Connect Supabase for real data + auth
- [ ] Add Resend for booking confirmation emails
- [ ] Add Stripe for spa subscriptions
- [ ] Instagram Graph API for Partner tier auto-sync
