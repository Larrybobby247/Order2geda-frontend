import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CreditCard, Package, Undo2, Gift, Users, Megaphone, CheckCheck } from 'lucide-react';
import { api, socket } from '../api';
import { Skeleton, Empty } from '../components';
const ICON = { payment: CreditCard, order: Package, refund: Undo2, referral: Gift, room: Users, announcement: Megaphone, compensation: CreditCard };
const TABS = [['all', 'All', () => true], ['unread', 'Unread', (n) => !n.readAt], ['order', 'Orders', (n) => n.type === 'order'], ['room', 'Rooms', (n) => n.type === 'room'], ['payment', 'Payments', (n) => ['payment', 'refund'].includes(n.type)], ['referral', 'Referrals', (n) => n.type === 'referral']];
const ago = (d) => { const s = (Date.now() - new Date(d)) / 1000; return s < 60 ? 'just now' : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : new Date(d).toLocaleDateString(); };
export default function Notifications() {
  const qc = useQueryClient(); const nav = useNavigate(); const [tab, setTab] = useState('all'); const { data, isLoading } = useQuery({ queryKey: ['notifs'], queryFn: () => api('/me/notifications') });
  useEffect(() => { const s = socket(); s.on('notification:new', () => qc.invalidateQueries({ queryKey: ['notifs'] })); return () => s.disconnect(); }, []);
  const refresh = () => { qc.invalidateQueries({ queryKey: ['notifs'] }); qc.invalidateQueries({ queryKey: ['bell'] }); };
  const open = async (n) => { if (!n.readAt) await api('/me/notifications/read', { method: 'POST', body: { id: n._id } }).catch(() => {}); refresh(); const e = n.relatedEntity; if (e?.kind === 'Room') nav(`/app/rooms/${e.id}`); else if (e?.kind === 'Order') nav(`/app/orders/${e.id}`); };
  if (isLoading) return <div className="space-y-2"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>;
  const list = data.items.filter(TABS.find((t) => t[0] === tab)[2]);
  return (<div><div className="flex justify-between items-center mb-4"><h1 className="text-2xl font-black tracking-tight text-brand-deep">Notifications</h1>{data.unread > 0 && <button onClick={() => api('/me/notifications/read', { method: 'POST', body: {} }).then(refresh)} className="text-sm font-bold text-brand-700 inline-flex items-center gap-1"><CheckCheck size={16} />Mark all read</button>}</div>
    <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">{TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border ${tab === k ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-slate-600'}`}>{l}{k === 'unread' && data.unread > 0 && ` ${data.unread}`}</button>)}</div>
    {!list.length ? <Empty text="You're all caught up." /> : <div className="space-y-2">{list.map((n, i) => { const Icon = ICON[n.type] || Bell; return <button key={n._id} onClick={() => open(n)} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }} className={`w-full text-left flex gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft animate-fade-up ${n.readAt ? 'bg-white' : 'bg-brand-50 border-brand-200'}`}><span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${n.readAt ? 'bg-slate-100 text-slate-500' : 'bg-brand text-white'}`}><Icon size={18} /></span><span className="flex-1 min-w-0"><span className="flex justify-between gap-2"><b className="text-sm">{n.title}</b><span className="text-[11px] text-slate-400 shrink-0">{ago(n.createdAt)}</span></span><span className="block text-sm text-slate-600 mt-0.5">{n.body}</span></span>{!n.readAt && <span className="w-2 h-2 rounded-full bg-brand mt-2 shrink-0" />}</button>; })}</div>}</div>);
}
