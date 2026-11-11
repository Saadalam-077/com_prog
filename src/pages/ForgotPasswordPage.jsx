import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const inputClass = 'w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500';

const errorMessages = {
  invalid_email: 'Please enter a valid email | الرجاء إدخال بريد إلكتروني صحيح',
  invalid_code: 'Incorrect code | الرمز غير صحيح',
  expired: 'Code expired or too many attempts. Request a new one. | انتهت صلاحية الرمز، اطلب رمزاً جديداً',
  weak_password: 'Password must be at least 4 characters | كلمة المرور يجب أن تكون 4 أحرف على الأقل',
};

const callResetFunction = async (body) => {
  const { data, error } = await supabase.functions.invoke('password-reset', { body });
  if (error) {
    // Non-2xx responses still carry our JSON body with an error code.
    try {
      const payload = await error.context.json();
      return payload;
    } catch {
      return { ok: false, error: 'server_error' };
    }
  }
  return data;
};

const ForgotPasswordPage = ({ onNavigate }) => {
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'done'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const showError = (code) =>
    setError(errorMessages[code] || 'Something went wrong. Please try again. | حدث خطأ، حاول مرة أخرى');

  const requestCode = async (e) => {
    e?.preventDefault();
    setError(''); setInfo('');
    setLoading(true);
    const result = await callResetFunction({ action: 'request', email: email.trim().toLowerCase() });
    setLoading(false);
    if (!result?.ok) return showError(result?.error);
    setInfo('If this email is registered, a 6-digit code has been sent. Check your inbox (and spam). | إذا كان البريد مسجلاً فسيصلك رمز من 6 أرقام');
    setStep('code');
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match | كلمات المرور غير متطابقة');
      return;
    }
    if (newPassword.length < 4) return showError('weak_password');
    setLoading(true);
    const result = await callResetFunction({
      action: 'confirm',
      email: email.trim().toLowerCase(),
      code: code.trim(),
      newPassword,
    });
    setLoading(false);
    if (!result?.ok) return showError(result?.error);
    setStudentNumber(result.studentNumber || '');
    setStep('done');
  };

  const Spinner = () => <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;

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

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm flex items-center gap-2 mb-4">
            <span>❌</span> {error}
          </div>
        )}
        {info && (
          <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-3 text-cyan-300 text-sm flex items-center gap-2 mb-4">
            <span>📧</span> {info}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Email | البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required disabled={loading} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (<><Spinner />Sending...</>) : 'Send reset code | إرسال الرمز'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={confirmReset} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">6-digit code | الرمز المكون من 6 أرقام</label>
              <input type="text" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className={`${inputClass} tracking-widest text-center text-xl`} required disabled={loading} />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">New Password | كلمة المرور الجديدة</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} required disabled={loading} />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Confirm Password | تأكيد كلمة المرور</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required disabled={loading} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (<><Spinner />Saving...</>) : 'Reset password | تعيين كلمة المرور'}
            </button>
            <button type="button" onClick={requestCode} disabled={loading} className="w-full text-sm text-cyan-400 hover:underline disabled:opacity-50">
              Didn't get it? Resend code | إعادة إرسال الرمز
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4">
            <div className="bg-cyan-500/20 border border-cyan-500/50 rounded-lg p-4 text-cyan-300">
              ✅ Password changed successfully! | تم تغيير كلمة المرور بنجاح
              {studentNumber && <p className="mt-2 text-white">Student number | الرقم الجامعي: <b>{studentNumber}</b></p>}
            </div>
            <button onClick={() => onNavigate('login')} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg">
              Back to Login | العودة لتسجيل الدخول
            </button>
          </div>
        )}

        {step !== 'done' && (
          <p className="text-center text-slate-400 mt-6">
            Remembered it? <button onClick={() => onNavigate('login')} className="text-cyan-400 hover:underline">Login</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
