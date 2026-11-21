import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, Gift, ShieldCheck, Users, Truck } from 'lucide-react';
import { api, token } from '../api';
import { Logo } from '../components';
const strength = (p = '') => [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
export default function Auth({ mode }) {
  const [f, setF] = useState({}); const [errs, setErrs] = useState({}); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [need, setNeed] = useState(false); const [show, setShow] = useState(false); const [remember, setRemember] = useState(true); const [terms, setTerms] = useState(false);
  const nav = useNavigate(); const loc = useLocation(); const [sp] = useSearchParams(); const reg = mode === 'register';
  const val = (k) => f[k] ?? (k === 'referralCode' ? sp.get('ref') || '' : '');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const sc = strength(f.password);
  async function submit(e) {
    e.preventDefault(); const er = {};
    if (reg) { if ((f.fullName || '').trim().length < 2) er.fullName = 'Enter your full name'; if ((f.phone || '').length < 7) er.phone = 'Enter a valid phone number'; if (sc < 3) er.password = 'Use 8+ characters with an uppercase letter and a number'; if (f.password !== f.confirm) er.confirm = 'Passwords do not match'; if (!terms) er.terms = 'Please accept the terms'; }
    setErrs(er); if (Object.keys(er).length) return; setBusy(true); setErr('');
    try {
      const body = reg ? { fullName: f.fullName, email: f.email, phone: f.phone, password: f.password, referralCode: val('referralCode') || undefined } : { email: f.email, password: f.password, code: f.code };
      const r = await api(`/auth/${mode}`, { method: 'POST', body }); if (r.twoFactorRequired) { setNeed(true); return; }
      token.set(r.token, reg ? true : remember); nav(loc.state?.from || { ADMIN: '/admin/dashboard', MODERATOR: '/moderator/dashboard' }[r.user?.role] || '/app/home', { replace: true });
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const field = (k, label, Icon, type = 'text', extra = {}) => <label className="block text-sm font-semibold mt-4">{label}<div className="relative mt-1.5"><Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input required={k !== 'referralCode'} type={k === 'password' || k === 'confirm' ? (show ? 'text' : 'password') : type} value={val(k)} onChange={set(k)} className={`w-full rounded-[14px] border pl-10 pr-10 py-3 ${errs[k] ? 'border-red-400' : 'border-slate-200'}`} {...extra} />{(k === 'password' || k === 'confirm') && <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>}</div>{errs[k] && <span className="text-xs text-red-500 font-medium">{errs[k]}</span>}</label>;
  return (<div className="min-h-screen lg:grid lg:grid-cols-2">
    <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-brand-deep via-brand-dark to-emerald-800 text-white p-12 flex-col justify-between"><div className="absolute inset-0 bg-grid opacity-40" /><div className="absolute -top-20 -right-20 w-96 h-96 bg-brand/40 rounded-full blur-3xl animate-blob" /><div className="absolute bottom-0 -left-20 w-80 h-80 bg-brand-gold/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-7s' }} /><div className="relative"><Logo light /></div>
      <div className="relative"><h2 className="text-4xl font-black leading-tight tracking-tight">Shop together.<br /><span className="grad-text">Spend smarter.</span></h2><ul className="mt-8 space-y-4">{[[Users, 'Join rooms and combine orders'], [ShieldCheck, 'Secure payments with Paystack'], [Truck, 'Track every stage to your door']].map(([Icon, t], i) => <li key={t} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.12}s` }}><span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Icon size={18} className="text-brand-gold" /></span>{t}</li>)}</ul></div><p className="relative text-xs text-emerald-100/60">© {new Date().getFullYear()} Order2Geda</p></div>
    <div className="flex items-center justify-center p-5 sm:p-10 min-h-screen"><form onSubmit={submit} noValidate className="w-full max-w-md bg-white rounded-[28px] border shadow-soft p-7 sm:p-9 animate-pop"><div className="lg:hidden mb-5"><Logo /></div>
      <h1 className="text-3xl font-black tracking-tight text-brand-deep">{reg ? 'Create your account' : 'Welcome back'}</h1><p className="text-slate-500 mt-1">{reg ? 'Join free and start shopping together.' : 'Log in to continue to your rooms.'}</p>
      {reg && <>{field('fullName', 'Full name', User, 'text', { autoComplete: 'name' })}{field('phone', 'Phone number', Phone, 'tel', { autoComplete: 'tel', inputMode: 'tel' })}</>}{field('email', 'Email address', Mail, 'email', { autoComplete: 'email' })}{field('password', 'Password', Lock, 'password', { autoComplete: reg ? 'new-password' : 'current-password' })}
      {reg && f.password && <div className="mt-2 flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < sc ? ['bg-red-400', 'bg-amber-400', 'bg-lime-500', 'bg-brand'][sc - 1] : 'bg-slate-200'}`} />)}</div>}
      {reg && <>{field('confirm', 'Confirm password', Lock, 'password', { autoComplete: 'new-password' })}{field('referralCode', 'Referral code (optional)', Gift)}<label className="flex gap-2 text-sm mt-4"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 accent-emerald-600" /><span>I agree to the <Link to="/terms" className="text-brand-700 font-semibold">Terms</Link> and <Link to="/privacy" className="text-brand-700 font-semibold">Privacy Policy</Link>.</span></label>{errs.terms && <span className="text-xs text-red-500 font-medium">{errs.terms}</span>}</>}
      {need && <div className="animate-pop">{field('code', 'Authentication code (6 digits)', ShieldCheck, 'text', { inputMode: 'numeric', autoComplete: 'one-time-code' })}</div>}
      {!reg && <div className="flex justify-between items-center mt-4 text-sm"><label className="flex gap-2 items-center"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-emerald-600" />Remember me</label><Link to="/forgot-password" className="font-semibold text-brand-700">Forgot password?</Link></div>}
      {err && <p role="alert" className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl p-3 animate-pop">{err}</p>}
      <button disabled={busy} className="mt-6 w-full py-3.5 rounded-[14px] bg-brand text-white font-bold disabled:opacity-60">{busy ? 'Please wait…' : reg ? 'Create account' : 'Log in'}</button>
      <p className="text-sm mt-5 text-center text-slate-600">{reg ? <>Already have an account? <Link to="/login" className="font-bold text-brand-700">Log in</Link></> : <>New to Order2Geda? <Link to="/register" className="font-bold text-brand-700">Create an account</Link></>}</p></form></div></div>);
}
