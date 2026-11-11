import React, { useState } from 'react';
import { weekData, weekNumbers, TOTAL_WEEKS, isCourseWeekKey } from '../data/courseData';

const EmailCard = ({ user, onUpdateEmail }) => {
  const [email, setEmail] = useState(user.email || '');
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    const result = await onUpdateEmail(email);
    setSaving(false);
    if (result === true) setMessage({ ok: true, text: 'Email saved | تم حفظ البريد' });
    else if (result === 'email_exists') setMessage({ ok: false, text: 'This email is already used | هذا البريد مستخدم' });
    else setMessage({ ok: false, text: 'Could not save email | تعذر حفظ البريد' });
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
      <h2 className="text-xl font-bold text-white mb-2">Recovery Email | البريد الإلكتروني</h2>
      <p className="text-slate-400 text-sm mb-4">Used to reset your password if you forget it. | يُستخدم لاستعادة كلمة المرور.</p>
      {!user.email && (
        <p className="text-yellow-400 text-sm mb-4">⚠️ No email set yet — add one so you can recover your password. | لم تضف بريداً بعد</p>
      )}
      <form onSubmit={save} className="flex flex-col sm:flex-row gap-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" placeholder="you@example.com" required disabled={saving} />
        <button type="submit" disabled={saving || email.trim().toLowerCase() === (user.email || '')} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? 'Saving...' : 'Save | حفظ'}
        </button>
      </form>
      {message && <p className={`mt-3 text-sm ${message.ok ? 'text-cyan-400' : 'text-red-400'}`}>{message.text}</p>}
    </div>
  );
};

const ProfilePage = ({ user, onNavigate, onLogout, onUpdateEmail }) => {
  const completedWeeks = Object.entries(user.progress).filter(([key, val]) => val.completed && isCourseWeekKey(key)).length;

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-cyan-400';
    if (grade === 'B+' || grade === 'B') return 'text-blue-400';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-400';
    if (grade === 'D+' || grade === 'D') return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30">
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-slate-400 hover:text-white"><span>←</span> Back to Course</button>
            <button onClick={onLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-cyan-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">{user.studentName.charAt(0)}</div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.studentName}</h1>
              <p className="text-slate-400">Student ID: {user.studentNumber}</p>
              <p className="text-cyan-400">Section: {user.sectionNumber}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700/50 rounded-xl p-5 text-center">
              <p className="text-slate-400 text-sm mb-2">Overall Grade</p>
              <p className={`text-4xl font-bold ${getGradeColor(user.overallGrade)}`}>{user.overallGrade}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-5 text-center">
              <p className="text-slate-400 text-sm mb-2">Average Score</p>
              <p className="text-4xl font-bold text-white">{user.totalScore}%</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-5 text-center">
              <p className="text-slate-400 text-sm mb-2">Progress</p>
              <p className="text-4xl font-bold text-cyan-400">{completedWeeks}/{TOTAL_WEEKS}</p>
            </div>
          </div>
        </div>

        <EmailCard user={user} onUpdateEmail={onUpdateEmail} />

        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Week Progress | تقدم الأسابيع</h2>
          <div className="space-y-3">
            {weekNumbers.map((week) => {
              const weekProgress = user.progress[`week${week}`];
              const isCompleted = weekProgress?.completed;
              const score = weekProgress?.score || 0;
              return (
                <div key={week} className={`flex items-center justify-between p-4 rounded-xl ${isCompleted ? 'bg-cyan-900/30 border border-cyan-500/30' : 'bg-slate-700/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-cyan-600' : 'bg-slate-600'}`}>{isCompleted ? '✓' : week}</div>
                    <span className="text-white">Week {week}: {weekData[week].titleEn}</span>
                  </div>
                  {isCompleted ? (<span className={`font-bold ${score >= 90 ? 'text-cyan-400' : score >= 75 ? 'text-blue-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{score}%</span>) : (<span className="text-slate-500">Not completed</span>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
