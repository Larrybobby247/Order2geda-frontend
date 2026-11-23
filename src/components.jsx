import { useEffect } from 'react';
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Home, Search, Plus, ShoppingBag, User, Bell, Users, ArrowRight, MailWarning, MapPin } from 'lucide-react';
import { api, token, naira, socket } from './api';
import { Progress, StatusChip } from './ui';
export { Skeleton, Empty } from './ui';
export const Logo = ({ light }) => <Link to="/" className="inline-flex items-center gap-2 group"><span className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-brand to-brand-dark text-white font-black text-sm flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">O2</span><span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-dark'}`}>Order<span className="text-brand-gold">2</span>Geda</span></Link>;
const COVER = ['from-emerald-400 to-teal-700', 'from-teal-400 to-emerald-800', 'from-lime-400 to-emerald-700', 'from-amber-300 to-emerald-600', 'from-emerald-300 to-cyan-700'];
const EMOJI = { Fashion: '👗', Electronics: '🎧', 'Home and Living': '🛋️', Beauty: '💄', Accessories: '⌚', 'General Shopping': '🛍️' };
export function RoomCard({ room, unread }) {
  const pct = Math.min(100, Math.round((room.acceptedProductTotal / room.closingThreshold) * 100)); const cover = COVER[(room.name || 'x').charCodeAt(0) % COVER.length]; const left = Math.max(0, room.closingThreshold - room.acceptedProductTotal);
  return (<Link to={`/app/rooms/${room._id}`} className="block rounded-card bg-white border border-slate-200 overflow-hidden group">
    <div className={`h-24 bg-gradient-to-br ${cover} relative overflow-hidden`}><span className="absolute inset-0 bg-grid opacity-60" /><span className="absolute -right-3 -bottom-4 text-6xl opacity-90 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">{EMOJI[room.category] || '🛍️'}</span>
      <div className="absolute top-3 left-3 flex gap-2"><span className="text-[11px] font-bold bg-white/90 text-brand-dark px-2.5 py-1 rounded-full">{room.shoppingPlatform}</span><StatusChip s={room.status} /></div>
      {unread > 0 && <span className="absolute top-3 right-3 bg-brand-gold text-brand-deep text-xs font-bold rounded-full px-2 py-0.5 animate-pop">{unread} new</span>}</div>
    <div className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="font-bold leading-snug line-clamp-1">{room.name}</h3>{room.match && <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${room.match === 'area' ? 'bg-brand text-white' : 'bg-brand-100 text-brand-700'}`}>{room.match === 'area' ? 'In your area' : 'In your state'}</span>}</div>{room.state && <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={12} />{[room.area, room.state].filter(Boolean).join(', ')}</p>}
      <div className="mt-3 flex justify-between text-xs text-slate-500 num"><span><b className="text-ink text-sm">{naira(room.acceptedProductTotal)}</b> of {naira(room.closingThreshold)}</span><b className="text-brand-700">{pct}%</b></div><Progress value={pct} className="mt-1.5" />
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span className="inline-flex items-center gap-1"><Users size={14} />{room.participantCount ?? '—'} members</span><span className="num">{room.status === 'OPEN' ? `${naira(left)} to go` : 'Closed'}</span></div>
      <p className="mt-2 text-xs font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">{room.status === 'OPEN' ? 'View & join' : 'View room'} <ArrowRight size={13} /></p></div></Link>);
}
export function CustomerLayout() {
  const loc = useLocation(); const qc = useQueryClient(); const has = !!token.get();
  const me = useQuery({ queryKey: ['me'], queryFn: () => api('/auth/me'), staleTime: 600000, retry: false, enabled: has });
  const bell = useQuery({ queryKey: ['bell'], queryFn: () => api('/me/notifications?unread=1'), refetchInterval: 45000, enabled: has });
  useEffect(() => { if (me.error && /unauthor/i.test(me.error.message)) { token.clear(); window.location.href = '/login'; } }, [me.error]);
  useEffect(() => { if (!has) return; const s = socket(); s.on('notification:new', () => { qc.invalidateQueries({ queryKey: ['bell'] }); qc.invalidateQueries({ queryKey: ['notifs'] }); }); return () => s.disconnect(); }, [has]);
  if (!has) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  const u = me.data; const resend = () => api('/auth/resend-verification', { method: 'POST' }).then(() => alert('Verification email sent. Check your inbox.')).catch((e) => alert(e.message));
  const link = (to, Icon, label) => <NavLink to={to} className={({ isActive }) => `relative flex flex-col items-center gap-0.5 text-[11px] font-semibold px-3 py-1 rounded-xl transition-colors ${isActive ? 'text-brand-700' : 'text-slate-400 hover:text-slate-600'}`}>{({ isActive }) => <><span className={`absolute -top-2 h-1 w-8 rounded-full bg-brand transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-x-0'}`} /><Icon size={22} strokeWidth={isActive ? 2.6 : 2} />{label}</>}</NavLink>;
  const dlink = (to, label) => <NavLink to={to} className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${isActive ? 'bg-brand-100 text-brand-dark' : 'text-slate-500 hover:text-brand-dark'}`}>{label}</NavLink>;
  return (<div className="min-h-screen pb-28 md:pb-10"><header className="sticky top-0 z-30 glass border-b border-white/60"><div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4"><Logo />
    <nav className="hidden md:flex gap-1">{dlink('/app/home', 'Home')}{dlink('/app/discover', 'Discover')}{dlink('/app/my-rooms', 'My rooms')}{dlink('/app/orders', 'Orders')}{dlink('/app/wallet', 'Wallet')}</nav>
    <div className="flex items-center gap-3"><Link to="/app/notifications" aria-label="Notifications" className="relative w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:shadow-soft transition"><Bell size={19} />{bell.data?.unread > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-brand-deep text-[10px] font-bold flex items-center justify-center animate-pop">{bell.data.unread > 9 ? '9+' : bell.data.unread}</span>}</Link>
      <Link to="/app/settings" aria-label="Profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white font-bold flex items-center justify-center shadow-glow">{(u?.fullName || '?')[0]}</Link></div></div></header>
    {u && !u.emailVerified && u.role === 'CUSTOMER' && <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm"><div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2"><MailWarning size={16} /><span className="flex-1">Please verify your email to secure your account.</span><button onClick={resend} className="font-bold underline">Resend link</button></div></div>}
    <main key={loc.pathname} className="max-w-4xl mx-auto px-4 pt-6 animate-fade-up"><Outlet /></main>
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-white/70 pb-[env(safe-area-inset-bottom)]"><div className="max-w-md mx-auto flex items-end justify-around pt-3 pb-2">{link('/app/home', Home, 'Home')}{link('/app/discover', Search, 'Discover')}
      <NavLink to="/app/rooms/create" aria-label="Create room" className="-mt-8 flex flex-col items-center text-[11px] font-semibold text-brand-700"><span className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center shadow-glow border-4 border-white"><span className="absolute inset-0 rounded-full bg-brand animate-ring" /><Plus size={26} className="relative" /></span>Create</NavLink>
      {link('/app/orders', ShoppingBag, 'Orders')}{link('/app/settings', User, 'Profile')}</div></nav></div>);
}
