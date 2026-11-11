# Forgot Password — Setup

Students who forget their password click **"Forgot password?"** on the login page,
enter their email, and receive their student number and current password by email.

Because the site is hosted on GitHub Pages (static), the email is sent by a
**Supabase Edge Function** using **[Resend](https://resend.com)** (free tier: 3,000 emails/month).

## 1. Database
Open Supabase → **SQL Editor** and run
`supabase/migrations/20261111000000_password_reset.sql`.
It adds an `email` column to `cp2_students` and a `cp2_password_emails` table (used to limit to one email per minute per account).

## 2. Email provider (Resend)
1. Sign up at https://resend.com.
2. **API Keys** → **Create API Key** (permission: *Sending access*) → copy the key (starts with `re_`, shown once).
3. To email students you need a domain you own: **Domains** → **Add Domain** → add the DNS
   records it shows at your domain provider → wait for **Verified**.
   Without a domain you can only send from `onboarding@resend.dev` to your own Resend email (testing only).

## 3. Deploy the Edge Function

### Option A — Supabase dashboard (no install)
1. Supabase project → **Edge Functions** → **Secrets** → add
   `RESEND_API_KEY` = your key and `RESET_FROM_EMAIL` = `Computer Programming <noreply@yourdomain.com>`.
2. **Edge Functions** → **Deploy a new function** → **Via Editor**, name it exactly `password-reset`,
   paste the contents of `supabase/functions/password-reset/index.ts`, click **Deploy**.

### Option B — Supabase CLI
Run from the project folder:
```bash
npx supabase login
npx supabase link --project-ref zxqpcuncbpzxsaqmfcby
npx supabase secrets set RESEND_API_KEY=re_xxx RESET_FROM_EMAIL="Computer Programming <noreply@yourdomain.com>"
npx supabase functions deploy password-reset
```

## 4. Existing students
Students who registered before this change have no email. They should log in,
open **Profile**, and save a recovery email. New students enter it at registration.

## How it works
The function looks up the student by email and emails them their student number
and password. One account can be emailed at most once per 60 seconds. If the
email isn't registered, the page says so.
