import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, token } from '../api';
import { Logo } from '../components';
export default function Auth({ mode }) {
  const [f, setF] = useState({}); const [need, setNeed] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      if (mode === 'register' && f.password !== f.confirm) throw new Error('Passwords do not match');
      const r = await api(`/auth/${mode}`, { method: 'POST', body: f }); if (r.twoFactorRequired) { setNeed(true); return; } token.set(r.token); nav({ ADMIN: '/admin/dashboard', MODERATOR: '/moderator/dashboard' }[r.user?.role] || '/app/home');
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const field = (k, label, type = 'text') => <label className="block text-sm font-medium mt-3">{label}<input required={k !== 'referralCode'} type={type} onChange={set(k)} className="mt-1 w-full rounded-[12px] border border-slate-200 p-3" /></label>;
  return (<form onSubmit={submit} className="max-w-sm mx-auto p-6 mt-8 bg-white rounded-card border"><Logo /><h1 className="text-2xl font-bold mt-4">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
    {mode === 'register' && <>{field('fullName', 'Full name')}{field('phone', 'Phone number', 'tel')}</>}{field('email', 'Email', 'email')}{field('password', 'Password', 'password')}
    {mode === 'register' && <>{field('confirm', 'Confirm password', 'password')}{field('referralCode', 'Referral code (optional)')}</>}
    {need && field('code', 'Authentication code (6 digits)')}
    {err && <p role="alert" className="text-red-500 text-sm mt-3">{err}</p>}
    <button disabled={busy} className="mt-5 w-full py-3 rounded-[14px] bg-brand text-white font-bold disabled:opacity-60">{busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account'}</button>
    <p className="text-sm mt-4 text-center">{mode === 'login' ? <Link to="/register" className="text-brand">New here? Register</Link> : <Link to="/login" className="text-brand">Have an account? Login</Link>}</p></form>);
}
