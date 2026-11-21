import { useState } from 'react';
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { token, api } from './api';
import { Logo } from './components';
import { CountUp } from './ui';
export function ImageUploader({ kind = 'product', onUploaded }) {
  const [busy, setBusy] = useState(false); const [url, setUrl] = useState(''); const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files[0]; if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return setErr('Choose an image under 5MB');
    setBusy(true); setErr('');
    try {
      const s = await api(`/uploads/sign?kind=${kind}`); const fd = new FormData();
      Object.entries({ file, api_key: s.apiKey, timestamp: s.timestamp, folder: s.folder, signature: s.signature }).forEach(([k, v]) => fd.append(k, v));
      const r = await (await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: 'POST', body: fd })).json();
      if (!r.secure_url) throw new Error('Upload failed (is Cloudinary configured on the server?)');
      const opt = r.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_600/'); setUrl(opt); onUploaded(opt);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (<div className="mt-2"><input type="file" accept="image/*" capture="environment" onChange={pick} className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-100 file:text-brand-dark file:px-3 file:py-1.5 file:font-semibold" />{busy && <span className="text-xs ml-2 animate-pulse">Uploading…</span>}
    {url && <div className="mt-2 flex items-center gap-2 animate-pop"><img src={url} alt="Preview" width="64" height="64" loading="lazy" className="w-16 h-16 object-cover rounded-[10px]" /><button type="button" className="text-xs text-red-500" onClick={() => { setUrl(''); onUploaded(undefined); }}>Remove</button></div>}
    {err && <p className="text-xs text-red-500">{err}</p>}</div>);
}
export function SidebarLayout({ title, links, allow }) {
  const [open, setOpen] = useState(false); const has = !!token.get();
  const me = useQuery({ queryKey: ['me'], queryFn: () => api('/auth/me'), staleTime: 600000, retry: false, enabled: has });
  if (!has) return <Navigate to="/login" replace />;
  if (me.data && allow && !allow.includes(me.data.role)) return <div className="min-h-screen flex items-center justify-center p-6"><div className="text-center max-w-sm animate-pop"><ShieldAlert size={44} className="mx-auto text-amber-500" /><h1 className="text-xl font-bold mt-3">Permission denied</h1><p className="text-slate-500 mt-1">Your account doesn't have access to the {title.toLowerCase()} area.</p><Link to="/app/home" className="inline-block mt-4 px-5 py-2.5 rounded-[14px] bg-brand text-white font-semibold">Back to the app</Link></div></div>;
  const nav = <nav className="p-3 space-y-1">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-white/12 text-white border-l-4 border-brand-gold pl-2' : 'text-emerald-100/80 hover:bg-white/5 hover:text-white'}`}>{label}</NavLink>)}
    <button onClick={() => { token.clear(); location.href = '/login'; }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-emerald-100/70 hover:text-white"><LogOut size={15} />Logout</button></nav>;
  return (<div className="min-h-screen md:flex"><header className="md:hidden sticky top-0 z-30 flex justify-between items-center p-3 bg-brand-deep text-white"><Logo light /><button aria-label="Menu" onClick={() => setOpen(!open)} className="p-2 rounded-lg bg-white/10">{open ? <X size={20} /> : <Menu size={20} />}</button></header>
    {open && <div className="md:hidden bg-gradient-to-b from-brand-deep to-brand-dark animate-fade-in">{nav}</div>}
    <aside className="hidden md:block w-60 shrink-0 bg-gradient-to-b from-brand-deep via-brand-dark to-brand-deep min-h-screen sticky top-0 self-start h-screen overflow-y-auto"><div className="p-5"><Logo light /><p className="text-[11px] uppercase tracking-widest text-brand-400 mt-2 flex items-center gap-1"><LayoutDashboard size={12} />{title}</p></div>{nav}</aside>
    <main className="flex-1 p-4 md:p-8 max-w-5xl w-full animate-fade-up"><Outlet /></main></div>);
}
export const Card = ({ label, value, icon }) => <div className="bg-white border rounded-card p-4 hover:-translate-y-0.5 transition-transform"><div className="text-xs text-slate-500 flex items-center gap-1.5">{icon}{label}</div><div className="text-2xl font-extrabold num mt-1 text-brand-dark">{typeof value === 'number' ? <CountUp to={value} /> : value}</div></div>;
export function TwoFactorCard() {
  const [setup, setSetup] = useState(null); const [msg, setMsg] = useState('');
  const start = () => api('/auth/2fa/setup', { method: 'POST' }).then(setSetup).catch((e) => setMsg(e.message));
  const enable = (e) => { e.preventDefault(); api('/auth/2fa/enable', { method: 'POST', body: { code: e.target.code.value } }).then(() => { setMsg('Two-factor authentication enabled'); setSetup(null); }).catch((x) => setMsg(x.message)); };
  return (<section className="bg-white border rounded-card p-5"><h2 className="font-bold">Two-factor authentication</h2><p className="text-sm text-slate-500">Protect your account with an authenticator app (Google Authenticator, Authy, Microsoft Authenticator).</p>
    {!setup ? <button onClick={start} className="mt-3 px-4 py-2 rounded-[12px] bg-brand text-white text-sm font-semibold">Set up 2FA</button> : <form onSubmit={enable} className="mt-3 space-y-2 text-sm"><p>Add this key in your app (manual entry):</p><code className="block bg-slate-100 rounded p-2 break-all">{setup.secret}</code><input name="code" required placeholder="6-digit code" className="border rounded-[12px] p-2" /><button className="ml-2 px-4 py-2 rounded-[12px] bg-brand text-white font-semibold">Verify & enable</button></form>}{msg && <p className="text-sm mt-2">{msg}</p>}</section>);
}
