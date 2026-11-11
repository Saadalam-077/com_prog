-- Forgot-password support for cp2_students
-- Run this once in the Supabase SQL editor (or with `supabase db push`).

-- 1) Students now have an email address (used for password recovery).
alter table public.cp2_students
  add column if not exists email text;

-- One account per email (case-insensitive). Existing rows without email are allowed.
create unique index if not exists cp2_students_email_unique
  on public.cp2_students (lower(email))
  where email is not null;

-- 2) Log of recovery emails, used to limit how often one account can be emailed.
--    Only the Edge Function (service role) touches this table.
create table if not exists public.cp2_password_emails (
  id             bigint generated always as identity primary key,
  student_number text not null,
  created_at     timestamptz not null default now()
);

create index if not exists cp2_password_emails_student_idx
  on public.cp2_password_emails (student_number, created_at desc);

-- RLS on with no policies = the browser (anon key) cannot read or write it.
alter table public.cp2_password_emails enable row level security;
