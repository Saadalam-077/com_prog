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
The function looks up the student by email and emails them their student number
and password. One account can be emailed at most once per 60 seconds. If the
email isn't registered, the page says so.
