// Supabase Edge Function: password-reset
//
// POST { action: "request", email }                       -> emails a 6-digit code
// POST { action: "confirm", email, code, newPassword }    -> sets the new password
//
// Required secrets (supabase secrets set ...):
//   RESEND_API_KEY   - API key from https://resend.com
//   RESET_FROM_EMAIL - verified sender, e.g. "Computer Programming <noreply@yourdomain.com>"
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const CODE_TTL_MINUTES = 15;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

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

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return n.toString().padStart(6, "0");
}

async function findStudentByEmail(email: string) {
  const { data } = await supabase
    .from("cp2_students")
    .select("student_number, student_name, email")
    .eq("email", email) // emails are stored lower-cased by the app
    .limit(1)
    .maybeSingle();
  return data;
}

async function sendEmail(to: string, name: string, studentNumber: string, code: string) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px">
      <h2>Computer Programming | برمجة الحاسب</h2>
      <p>Hello ${name},</p>
      <p>Your password reset code for student number <b>${studentNumber}</b> is:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:6px">${code}</p>
      <p>The code expires in ${CODE_TTL_MINUTES} minutes. If you did not request this, ignore this email.</p>
      <hr/>
      <p dir="rtl">رمز إعادة تعيين كلمة المرور الخاص بك هو <b>${code}</b> وينتهي خلال ${CODE_TTL_MINUTES} دقيقة.</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("RESET_FROM_EMAIL") ?? "onboarding@resend.dev",
      to,
      subject: "Password reset code | رمز إعادة تعيين كلمة المرور",
      html,
    }),
  });
  if (!res.ok) throw new Error(`Email send failed: ${res.status} ${await res.text()}`);
}

async function handleRequest(email: string) {
  const student = await findStudentByEmail(email);
  // Always answer the same way so the form can't be used to discover registered emails.
  if (!student) return json({ ok: true });

  const { data: last } = await supabase
    .from("cp2_password_resets")
    .select("created_at")
    .eq("student_number", student.student_number)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (last && Date.now() - new Date(last.created_at).getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
    return json({ ok: true });
  }

  const code = randomCode();
  await supabase.from("cp2_password_resets")
    .update({ used: true })
    .eq("student_number", student.student_number)
    .eq("used", false);
  const { error } = await supabase.from("cp2_password_resets").insert({
    student_number: student.student_number,
    code_hash: await sha256(code),
    expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString(),
  });
  if (error) throw error;

  await sendEmail(student.email, student.student_name, student.student_number, code);
  return json({ ok: true });
}

async function handleConfirm(email: string, code: string, newPassword: string) {
  if (!/^\d{6}$/.test(code)) return json({ ok: false, error: "invalid_code" }, 400);
  if (!newPassword || newPassword.length < 4) return json({ ok: false, error: "weak_password" }, 400);

  const student = await findStudentByEmail(email);
  if (!student) return json({ ok: false, error: "invalid_code" }, 400);

  const { data: reset } = await supabase
    .from("cp2_password_resets")
    .select("*")
    .eq("student_number", student.student_number)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!reset || new Date(reset.expires_at).getTime() < Date.now() || reset.attempts >= MAX_ATTEMPTS) {
    return json({ ok: false, error: "expired" }, 400);
  }

  if ((await sha256(code)) !== reset.code_hash) {
    await supabase.from("cp2_password_resets")
      .update({ attempts: reset.attempts + 1 })
      .eq("id", reset.id);
    return json({ ok: false, error: "invalid_code" }, 400);
  }

  const { error } = await supabase
    .from("cp2_students")
    .update({ password: newPassword })
    .eq("student_number", student.student_number);
  if (error) throw error;

  await supabase.from("cp2_password_resets").update({ used: true }).eq("id", reset.id);
  return json({ ok: true, studentNumber: student.student_number });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  try {
    const { action, email, code, newPassword } = await req.json();
    const cleanEmail = String(email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return json({ ok: false, error: "invalid_email" }, 400);
    }
    if (action === "request") return await handleRequest(cleanEmail);
    if (action === "confirm") return await handleConfirm(cleanEmail, String(code ?? "").trim(), String(newPassword ?? ""));
    return json({ ok: false, error: "unknown_action" }, 400);
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "server_error" }, 500);
  }
});
