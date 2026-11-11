# Forgot Password — Setup

Students who forget their password click **"Forgot password?"** on the login page,
enter their email, and receive their student number and current password by email.

Because the site is hosted on GitHub Pages (static), the email is sent by a
**Supabase Edge Function** using **[Resend](https://resend.com)** (free tier: 3,000 emails/month).

## Automatic setup (recommended)
`.github/workflows/supabase.yml` runs on every push to `main` that changes `supabase/`
(or manually from **Actions → Deploy Supabase → Run workflow**). It applies the database
change, saves the email key in Supabase and deploys the `password-reset` function.
Students and their progress are never deleted.

One-time: add these in GitHub → repo **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Where to get it |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | supabase.com → your avatar → **Account preferences → Access Tokens → Generate new token**. Give it full access (no permission restrictions), and use an account that is **Owner** or **Administrator** of the project's organization |
| `GMAIL_USER` | a Gmail address for sending, e.g. `cpcourse.tu@gmail.com` |
| `GMAIL_APP_PASSWORD` | Google app password for that Gmail (see below) |
| `RESEND_API_KEY` | alternative to Gmail; only works for students once a domain is verified in Resend |
| `RESET_FROM_EMAIL` | Resend only, e.g. `Computer Programming <noreply@yourdomain.com>` |

When `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set, Gmail is used (any student can
receive emails, about 500 per day). Otherwise Resend is used, which without a verified
domain only delivers to your own Resend account email.

### Gmail app password
1. Sign in to the Gmail account → https://myaccount.google.com/security → turn on **2-Step Verification**.
2. Open https://myaccount.google.com/apppasswords → name it `com_prog` → **Create**.
3. Copy the 16-letter password into the `GMAIL_APP_PASSWORD` secret.

## Manual setup (alternative)
1. Supabase → **SQL Editor** → run `supabase/migrations/20261111000000_password_reset.sql`.
2. Supabase → **Edge Functions → Secrets** → add `RESEND_API_KEY` (and `RESET_FROM_EMAIL`).
3. **Edge Functions → Deploy a new function → Via Editor**, name `password-reset`,
   paste `supabase/functions/password-reset/index.ts`, **Deploy**.

## 4. Existing students (registered without email)
Their account and progress are untouched. They have three ways back in:
- **Self-service:** Forgot password → "My account has no email" → enter student number,
  full name (as registered) and email. If number and name match, the email is saved to
  the account and the password is sent to it.
- **Admin:** in the Admin Dashboard each student row has **Password** (see / change it)
  and **Email** (add / fix their email) buttons.
- If they can still log in, they can add the email on their **Profile** page.

## How it works
The function looks up the student by email and emails them their student number
and password. One account can be emailed at most once per 60 seconds. If the
email isn't registered, the page says so.
