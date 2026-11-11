// Supabase Edge Function: password-reset
//
// POST { email } -> emails the student their student number and current password
// POST { email, studentNumber, studentName }
//      -> for old accounts that have no email yet: if the number and full name match,
//         saves the email on the account and sends the password to it
//
// Email is sent with Gmail when GMAIL_USER and GMAIL_APP_PASSWORD are set, otherwise with Resend.
// Secrets (supabase secrets set ...):
//   GMAIL_USER         - Gmail address that sends the emails, e.g. cpcourse@gmail.com
//   GMAIL_APP_PASSWORD - 16-character Google app password for that account
//   RESEND_API_KEY     - (alternative) API key from https://resend.com
//   RESET_FROM_EMAIL   - (Resend only) verified sender, e.g. "Computer Programming <noreply@yourdomain.com>"
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import nodemailer from "npm:nodemailer@6.9.16";

// Minimum time between two recovery emails to the same account (stops spamming a student).
const RESEND_COOLDOWN_SECONDS = 60;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

class EmailSendError extends Error {}

async function sendEmail(to: string, name: string, studentNumber: string, password: string) {
  const n = escapeHtml(name), num = escapeHtml(studentNumber), pw = escapeHtml(password);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px">
      <h2>Computer Programming | برمجة الحاسب</h2>
      <p>Hello ${n},</p>
      <p>Here are your login details:</p>
      <p>Student number: <b>${num}</b><br/>Password: <b style="font-size:20px">${pw}</b></p>
      <p>If you did not request this, you can ignore this email.</p>
      <hr/>
      <div dir="rtl">
        <p>مرحباً ${n}،</p>
        <p>الرقم الجامعي: <b>${num}</b><br/>كلمة المرور: <b>${pw}</b></p>
      </div>
    </div>`;

  const subject = "Your password | كلمة المرور الخاصة بك";

  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailPass = Deno.env.get("GMAIL_APP_PASSWORD");
  if (gmailUser && gmailPass) {
    // Port 465 (SSL): Supabase Edge Functions block outgoing ports 25 and 587.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass.replace(/\s+/g, "") },
    });
    try {
      await transporter.sendMail({ from: `"Computer Programming" <${gmailUser}>`, to, subject, html });
    } catch (e) {
      throw new EmailSendError(`Gmail: ${(e as Error).message}`);
    }
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("RESET_FROM_EMAIL") ?? "onboarding@resend.dev",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = text;
    try { detail = JSON.parse(text).message ?? text; } catch { /* keep raw text */ }
    throw new EmailSendError(`${res.status}: ${detail}`);
  }
}

// Lower-case, collapse spaces, drop Arabic diacritics/tatweel so small typing differences still match.
const normalizeName = (s: string) =>
  String(s ?? "")
    .normalize("NFKC")
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

async function linkEmailToOldAccount(email: string, studentNumber: string, studentName: string) {
  const { data: student } = await supabase
    .from("cp2_students")
    .select("id, student_number, student_name, email")
    .eq("student_number", studentNumber)
    .maybeSingle();

  if (!student || normalizeName(student.student_name) !== normalizeName(studentName)) {
    return json({ ok: false, error: "no_match" }, 404);
  }
  if (student.email) return json({ ok: false, error: "has_email" }, 409);

  const { data: taken } = await supabase
    .from("cp2_students").select("id").eq("email", email).maybeSingle();
  if (taken) return json({ ok: false, error: "email_taken" }, 409);

  const { error } = await supabase.from("cp2_students").update({ email }).eq("id", student.id);
  if (error) return json({ ok: false, error: error.code === "23505" ? "email_taken" : "server_error" }, 409);
  return null; // linked; continue with the normal "send password" flow
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  try {
    const { email, studentNumber, studentName } = await req.json();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return json({ ok: false, error: "invalid_email" }, 400);
    }

    if (studentNumber) {
      const failure = await linkEmailToOldAccount(cleanEmail, String(studentNumber).trim(), String(studentName ?? ""));
      if (failure) return failure;
    }

    const { data: student } = await supabase
      .from("cp2_students")
      .select("student_number, student_name, email, password")
      .eq("email", cleanEmail) // emails are stored lower-cased by the app
      .limit(1)
      .maybeSingle();
    if (!student) return json({ ok: false, error: "not_found" }, 404);

    const { data: last } = await supabase
      .from("cp2_password_emails")
      .select("created_at")
      .eq("student_number", student.student_number)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last && Date.now() - new Date(last.created_at).getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
      return json({ ok: false, error: "too_soon" }, 429);
    }

    await sendEmail(student.email, student.student_name, student.student_number, student.password);
    await supabase.from("cp2_password_emails").insert({ student_number: student.student_number });
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    if (err instanceof EmailSendError) {
      return json({ ok: false, error: "email_failed", detail: err.message }, 502);
    }
    return json({ ok: false, error: "server_error", detail: err instanceof Error ? err.message : String(err) }, 500);
  }
});
