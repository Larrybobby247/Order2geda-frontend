import { useState } from 'react';
import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { token, api } from './api';
import { Logo } from './components';
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
      if (!r.secure_url) throw new Error('Upload failed');
      const opt = r.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_600/'); setUrl(opt); onUploaded(opt);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (<div className="mt-2"><input type="file" accept="image/*" capture="environment" onChange={pick} className="text-sm" />{busy && <span className="text-xs ml-2">Uploading…</span>}
    {url && <div className="mt-2 flex items-center gap-2"><img src={url} alt="Preview" width="64" height="64" loading="lazy" className="w-16 h-16 object-cover rounded-[10px]" /><button type="button" className="text-xs text-red-500" onClick={() => { setUrl(''); onUploaded(undefined); }}>Remove</button></div>}
    {err && <p className="text-xs text-red-500">{err}</p>}</div>);
}
export function SidebarLayout({ role, title, links }) {
  const [open, setOpen] = useState(false);
  if (!token.get()) return <Navigate to="/login" replace />;
  const nav = <nav className="p-3 space-y-1">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-[10px] px-3 py-2 text-sm ${isActive ? 'bg-brand-mint text-brand-dark font-semibold' : 'text-slate-600'}`}>{label}</NavLink>)}
    <button onClick={() => { token.clear(); location.href = '/login'; }} className="block w-full text-left px-3 py-2 text-sm text-slate-500">Logout</button></nav>;
  return (<div className="min-h-screen md:flex"><header className="md:hidden flex justify-between items-center p-3 bg-white border-b"><Logo /><button aria-label="Menu" onClick={() => setOpen(!open)} className="px-3 py-1 border rounded-[10px]">☰</button></header>
    {open && <div className="md:hidden bg-white border-b">{nav}</div>}
    <aside className="hidden md:block w-56 bg-white border-r min-h-screen"><div className="p-4"><Logo /><p className="text-xs text-slate-400 mt-1">{title}</p></div>{nav}</aside><main className="flex-1 p-4 md:p-8 max-w-5xl"><Outlet /></main></div>);
}
export const Card = ({ label, value }) => <div className="bg-white border rounded-card p-4"><div className="text-xs text-slate-500">{label}</div><div className="text-2xl font-bold num">{value}</div></div>;
