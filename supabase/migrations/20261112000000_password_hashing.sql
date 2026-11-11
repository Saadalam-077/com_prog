-- Computer Programming course: hashed student passwords + fixed recovery code.
-- Safe to re-run. Keeps all students, emails and progress.
-- Function names use the cp2_ prefix so they don't clash with the OOP course
-- functions that live in the same Supabase project.

create extension if not exists pgcrypto with schema extensions;

alter table public.cp2_students
  add column if not exists password_hash text;

-- Hash existing plaintext passwords, then replace the plaintext with random unusable text.
update public.cp2_students
set password_hash = extensions.crypt(password, extensions.gen_salt('bf', 12)),
    password = encode(extensions.gen_random_bytes(32), 'hex')
where password_hash is null
  and password is not null;

-- Login is checked inside the database; the browser never reads password hashes.
create or replace function public.cp2_student_login(
  p_student_number text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_student public.cp2_students%rowtype;
begin
  if p_student_number is null or p_password is null then
    return jsonb_build_object('success', false);
  end if;

  select * into v_student
  from public.cp2_students s
  where s.student_number = trim(p_student_number)
    and s.password_hash is not null
    and extensions.crypt(p_password, s.password_hash) = s.password_hash
  limit 1;

  if not found then
    return jsonb_build_object('success', false);
  end if;

  return jsonb_build_object(
    'success', true,
    'id', v_student.id,
    'student_name', v_student.student_name,
    'student_number', v_student.student_number,
    'section_number', v_student.section_number,
    'email', v_student.email,
    'progress', coalesce(v_student.progress, '{}'::jsonb)
  );
end;
$$;

-- Registration hashes the password. Returns error 'exists' or 'email_exists' on duplicates.
create or replace function public.cp2_register_student(
  p_student_name text,
  p_student_number text,
  p_section_number text,
  p_email text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_student public.cp2_students%rowtype;
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
begin
  if length(trim(coalesce(p_student_name, ''))) = 0
     or coalesce(trim(p_student_number), '') !~ '^[0-9]{8}$'
     or length(coalesce(p_password, '')) < 8 then
    return jsonb_build_object('success', false, 'error', 'invalid');
  end if;

  if exists (select 1 from public.cp2_students where student_number = trim(p_student_number)) then
    return jsonb_build_object('success', false, 'error', 'exists');
  end if;

  if v_email is not null and exists (select 1 from public.cp2_students where lower(email) = v_email) then
    return jsonb_build_object('success', false, 'error', 'email_exists');
  end if;

  insert into public.cp2_students (
    student_name, student_number, section_number, email, password, password_hash, progress
  ) values (
    trim(p_student_name), trim(p_student_number), p_section_number, v_email,
    encode(extensions.gen_random_bytes(32), 'hex'),
    extensions.crypt(p_password, extensions.gen_salt('bf', 12)),
    '{}'::jsonb
  )
  returning * into v_student;

  return jsonb_build_object(
    'success', true,
    'student', jsonb_build_object(
      'id', v_student.id,
      'student_name', v_student.student_name,
      'student_number', v_student.student_number,
      'section_number', v_student.section_number,
      'email', v_student.email,
      'progress', coalesce(v_student.progress, '{}'::jsonb)
    )
  );
exception when unique_violation then
  return jsonb_build_object('success', false, 'error', 'exists');
end;
$$;

-- Fixed recovery code for all students: 1234567890 (reusable, not consumed).
create or replace function public.cp2_reset_student_password(
  p_student_number text,
  p_recovery_code text,
  p_new_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_student_id public.cp2_students.id%type;
begin
  if p_student_number is null
     or p_recovery_code is null
     or length(coalesce(p_new_password, '')) < 8 then
    return false;
  end if;

  select id into v_student_id
  from public.cp2_students
  where student_number = trim(p_student_number)
    and trim(p_recovery_code) = '1234567890'
  for update;

  if not found then
    return false;
  end if;

  update public.cp2_students
  set password_hash = extensions.crypt(p_new_password, extensions.gen_salt('bf', 12)),
      password = encode(extensions.gen_random_bytes(32), 'hex')
  where id = v_student_id;

  return true;
end;
$$;

revoke all on function public.cp2_student_login(text, text) from public;
revoke all on function public.cp2_register_student(text, text, text, text, text) from public;
revoke all on function public.cp2_reset_student_password(text, text, text) from public;
grant execute on function public.cp2_student_login(text, text) to anon, authenticated;
grant execute on function public.cp2_register_student(text, text, text, text, text) to anon, authenticated;
grant execute on function public.cp2_reset_student_password(text, text, text) to anon, authenticated;

-- Browser clients can no longer read or change passwords/hashes.
revoke all on table public.cp2_students from anon, authenticated;
grant select (id, student_name, student_number, section_number, email, progress)
  on table public.cp2_students to anon, authenticated;
grant update (progress, email) on table public.cp2_students to anon, authenticated;
grant delete on table public.cp2_students to anon, authenticated;
