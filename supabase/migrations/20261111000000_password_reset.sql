-- Forgot-password support for cp2_students
-- Run this once in the Supabase SQL editor (or with `supabase db push`).

-- 1) Students now have an email address (used only for password recovery).
alter table public.cp2_students
  add column if not exists email text;

-- One account per email (case-insensitive). Existing rows without email are allowed.
create unique index if not exists cp2_students_email_unique
  on public.cp2_students (lower(email))
  where email is not null;

-- 2) One-time reset codes. Only the Edge Function (service role) touches this table.
create table if not exists public.cp2_password_resets (
  id          bigint generated always as identity primary key,
  student_number text not null,
  code_hash   text   not null,
  attempts    int    not null default 0,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists cp2_password_resets_student_idx
  on public.cp2_password_resets (student_number, created_at desc);

-- RLS on with no policies = the browser (anon key) cannot read or write codes.
alter table public.cp2_password_resets enable row level security;
