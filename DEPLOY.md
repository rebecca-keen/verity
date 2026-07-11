# Verity — GitHub + Vercel Deploy Guide

Follow these steps in order. You do **not** need to write code.

---

## PART 1 — Upload to GitHub (browser method)

### 1. Open the app folder on your Mac

1. Open **Finder**
2. Press **Cmd + Shift + G**
3. Paste this path and press Enter:

```
/Users/rkeen/Projects/verity
```

4. Keep this Finder window open

### 2. Create a new GitHub repository

1. Go to https://github.com and sign in
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `verity`
4. Description (optional): `Trusted clean-beauty med spas — Miami`
5. Choose **Public**
6. **IMPORTANT:** Do NOT check "Add a README file"
7. Click **Create repository**

### 3. Upload all app files

**IMPORTANT — Do NOT drag individual files.** GitHub will break the folder structure and the app will fail to build.

**Use GitHub Desktop instead:**

1. Download https://desktop.github.com
2. Sign in with GitHub
3. **File → Add Local Repository**
4. Choose: `/Users/rkeen/Projects/verity`
5. Click **Publish repository** (or **Push origin** if already connected)
6. Set remote to: `rebecca-keen/Verity`
7. Click **Push origin**

Your repo MUST show these **folders** (not flat files):

```
app/
components/
lib/
package.json
```

If you see `page.tsx` and `Header.tsx` sitting at the root with no folders, the upload failed.

---

## PART 2 — Deploy on Vercel (this "builds" the app)

Vercel reads your GitHub code and builds the live website automatically.

### 1. Connect Vercel to GitHub

1. Go to https://vercel.com and sign in
2. If asked, sign in with **GitHub** (same account)

### 2. Import your project

1. Click **Add New…** → **Project**
2. Find **verity** in the list of repositories
3. If you don't see it, click **Adjust GitHub App Permissions** and allow access to `verity`
4. Click **Import** next to `verity`

### 3. Deploy settings (leave defaults)

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js (auto-detected) |
| Root Directory | `./` |
| Build Command | `next build` (default) |
| Output Directory | (default) |

5. Click **Deploy**
6. Wait 1–3 minutes

### 4. Your app is live

When you see **Congratulations**, click **Visit** to open your live app.

Your URL will look like: `https://verity-xxxxx.vercel.app`

---

## PART 3 — Test your app

Click through these pages:

- Home page
- **Spas** — Miami med spa listings
- Click any spa → profile, booking form
- **Products** — product reviews
- **AI Concierge** — type a question or click a suggestion
- **For Spas** — partner pricing

---

## PART 4 — Contact form (required for “Contact us” to work)

The site uses a contact form at `/contact`. Your email is **not** shown publicly — submissions are emailed server-side to **hello@verityaesthetics.app**.

### Local testing (on your Mac)

1. Open `/Users/rkeen/Projects/verity/.env.local` in Cursor (this file is gitignored and stays on your Mac only).
2. Paste your Resend API key on the line after `RESEND_API_KEY=` (no quotes, no spaces).
3. Confirm these lines are present (already set in the template):
   - `RESEND_API_KEY=` (paste your key from https://resend.com/api-keys)
   - `CONTACT_EMAIL=hello@verityaesthetics.app`
   - `CONTACT_FROM=Verity Aesthetics <onboarding@resend.dev>` (optional — this is the default)
4. Restart the dev server: stop it if running, then run `npm run dev` in the project folder.
5. Open http://localhost:3000/contact, submit a test message, and check **hello@verityaesthetics.app**.

The default sender (`onboarding@resend.dev`) works without domain verification and delivers to the email on your Resend account.

### Production (Vercel) — **required**

1. Go to https://vercel.com → your **verity** project → **Settings** → **Environment Variables**
2. Add these variables for **Production** (and Preview if you want staging to work too):

| Name | Value | Required |
|------|-------|----------|
| `RESEND_API_KEY` | Your Resend API key from https://resend.com/api-keys | **Yes** |
| `CONTACT_EMAIL` | `hello@verityaesthetics.app` | No (default) |
| `CONTACT_FROM` | `Verity Aesthetics <onboarding@resend.dev>` | No (default) |

3. Click **Save**
4. Go to **Deployments** → open the latest deployment → **⋯** → **Redeploy** (required after adding env vars)

**Verify after deploy:** open `https://verityaesthetics.app/api/contact` in a browser — you should see `"resendConfigured": true`. If it is `false`, the contact form will not work.

**Important:** `RESEND_API_KEY` is required. Without it, the form falls back to FormSubmit, which requires a one-time email activation and is unreliable in production.

---

## PART 5 — Optional: smarter AI

1. Vercel → your project → **Settings** → **Environment Variables**
2. Add:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI API key
3. **Save** → **Deployments** → **Redeploy**

---

## Updating the app later

1. Edit files in Cursor (or upload new files to GitHub)
2. Commit changes on GitHub
3. Vercel automatically rebuilds and updates your live site

---

## Need help?

If Vercel shows a red **Build Failed** error, copy the error message and ask Cursor to fix it.
