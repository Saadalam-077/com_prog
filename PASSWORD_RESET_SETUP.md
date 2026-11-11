# Forgot Password — Setup

Students who forget their password click **"Forgot password?"** on the login page,
enter their email, receive a 6‑digit code by email, and choose a new password.

Because the site is hosted on GitHub Pages (static), the email is sent by a
**Supabase Edge Function** using **[Resend](https://resend.com)** (free tier: 3,000 emails/month).

## 1. Database
Open Supabase → **SQL Editor** and run
`supabase/migrations/20261111000000_password_reset.sql`.
It adds an `email` column to `cp2_students` and a `cp2_password_resets` table.

## 2. Email provider (Resend)
1. Create an account at resend.com and create an API key.
2. To email any student you must verify a domain you own in Resend
   (without one, Resend only delivers to your own address — fine for testing).

## 3. Deploy the Edge Function
```bash
npm install -g supabase
supabase login
supabase link --project-ref zxqpcuncbpzxsaqmfcby
supabase secrets set RESEND_API_KEY=re_xxx RESET_FROM_EMAIL="Computer Programming <noreply@yourdomain.com>"
supabase functions deploy password-reset
```

## 4. Existing students
Students who registered before this change have no email. They should log in,
open **Profile**, and save a recovery email. New students enter it at registration.

## How it works
- `request`: looks up the student by email, stores a SHA‑256 hash of a random
  6‑digit code (valid 15 min, one request per 60 s), and emails the code.
  It responds identically whether or not the email exists.
- `confirm`: checks the code (max 5 wrong attempts), then updates the password.
