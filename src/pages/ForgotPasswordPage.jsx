import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const errorMessages = {
  invalid_email: 'Please enter a valid email | الرجاء إدخال بريد إلكتروني صحيح',
  not_found: 'No account is registered with this email | لا يوجد حساب مسجل بهذا البريد',
  no_match: 'Student number and name do not match our records. Write your name exactly as you registered, or contact your instructor. | الرقم الجامعي والاسم غير متطابقين. اكتب اسمك كما سجلته أو تواصل مع المحاضر',
  has_email: 'This account already has an email. Use the "I registered with an email" option. | هذا الحساب لديه بريد مسجل مسبقاً، استخدم الخيار الأول',
  email_taken: 'This email is already used by another account | هذا البريد مستخدم في حساب آخر',
  too_soon: 'An email was just sent. Please wait a minute before trying again. | تم إرسال بريد للتو، انتظر دقيقة ثم حاول مرة أخرى',
};

const ForgotPasswordPage = ({ onNavigate }) => {
  const [mode, setMode] = useState('email'); // 'email' | 'old'
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    const { data, error: fnError } = await supabase.functions.invoke('password-reset', {
      body: mode === 'old'
        ? { email: email.trim().toLowerCase(), studentNumber: studentNumber.trim(), studentName: studentName.trim() }
        : { email: email.trim().toLowerCase() },
    });
    if (fnError) {
      // Non-2xx responses still carry our JSON body with an error code.
      try { result = await fnError.context.json(); } catch { result = { ok: false }; }
    } else {
      result = data;
    }

    setLoading(false);
    if (result?.ok) {
      setSent(true);
    } else {
      setError(errorMessages[result?.error] || 'Something went wrong. Please try again. | حدث خطأ، حاول مرة أخرى');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-cyan-300/70 font-arabic">نسيت كلمة المرور</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-4 text-cyan-300">
              📧 Your password has been sent to <b className="text-white">{email.trim()}</b>. Check your inbox (and spam folder).
              <p className="mt-2 font-arabic">تم إرسال كلمة المرور إلى بريدك الإلكتروني. تحقق من البريد الوارد (والرسائل غير المرغوب فيها).</p>
            </div>
            <button onClick={() => onNavigate('login')} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg">
              Back to Login | العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm flex items-center gap-2">
                  <span>❌</span> {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1 rounded-lg">
                {[['email', 'I registered with an email', 'سجلت ببريد إلكتروني'], ['old', 'My account has no email', 'حسابي بدون بريد']].map(([key, en, ar]) => (
                  <button key={key} type="button" onClick={() => { setMode(key); setError(''); }} className={`py-2 px-2 rounded-md text-xs leading-tight ${mode === key ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    {en}<br /><span className="font-arabic">{ar}</span>
                  </button>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                {mode === 'email'
                  ? "Enter the email you registered with and we'll send you your password. | أدخل بريدك الإلكتروني المسجل وسنرسل لك كلمة المرور."
                  : 'Registered before emails were required? Enter your student number and full name exactly as you registered, plus your email. We will save the email to your account and send your password to it. Your progress is kept. | أدخل رقمك الجامعي واسمك الكامل كما سجلته وبريدك الإلكتروني، وسنحفظ البريد في حسابك ونرسل لك كلمة المرور. تقدمك محفوظ.'}
              </p>
              {mode === 'old' && (
                <>
                  <div>
                    <label className="block text-slate-300 text-sm mb-2">Student Number | الرقم الجامعي</label>
                    <input type="text" inputMode="numeric" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" required disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm mb-2">Full Name (as registered) | الاسم الكامل كما سجلته</label>
                    <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" required disabled={loading} />
                  </div>
                </>
              )}
              <div>
                <label className="block text-slate-300 text-sm mb-2">Email | البريد الإلكتروني</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" placeholder="you@example.com" required disabled={loading} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Sending...</>) : 'Send my password | أرسل كلمة المرور'}
              </button>
            </form>
            <p className="text-center text-slate-400 mt-6">
              Remembered it? <button onClick={() => onNavigate('login')} className="text-cyan-400 hover:underline">Login</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
