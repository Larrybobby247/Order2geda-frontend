import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Lock, Users, Clock } from 'lucide-react';
import { api, naira } from '../api';
import { Progress, StatusChip, Skeleton } from '../ui';
import RoomChat from './RoomChat';
import { useState } from 'react';
function Preview({ room, refresh }) {
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const open = room.status === 'OPEN'; const pct = Math.min(100, Math.round((room.acceptedProductTotal / room.closingThreshold) * 100));
  const join = async () => { setBusy(true); setErr(''); try { await api(`/rooms/${room._id}/join`, { method: 'POST' }); refresh(); } catch (x) { setErr(x.message); } finally { setBusy(false); } };
  return (<div className="max-w-xl mx-auto space-y-4"><Link to="/app/discover" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700"><ArrowLeft size={15} />Discover</Link>
    <div className="bg-white rounded-[28px] border overflow-hidden shadow-soft"><div className="h-32 bg-gradient-to-br from-brand via-brand-600 to-brand-dark relative"><span className="absolute inset-0 bg-grid opacity-60" /><div className="absolute bottom-3 left-4 flex gap-2"><span className="text-xs font-bold bg-white/90 text-brand-dark px-3 py-1 rounded-full">{room.shoppingPlatform}</span><StatusChip s={room.status} /></div></div>
      <div className="p-6"><h1 className="text-2xl font-black tracking-tight text-brand-deep">{room.name}</h1>{room.description && <p className="text-slate-600 mt-1">{room.description}</p>}
        <div className="mt-5 flex justify-between text-sm num"><span><b className="text-xl text-brand-deep">{naira(room.acceptedProductTotal)}</b> <span className="text-slate-500">of {naira(room.closingThreshold)}</span></span><b className="text-brand-700 text-lg">{pct}%</b></div><Progress value={pct} className="mt-2" />
        <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs"><div className="rounded-xl bg-brand-50 p-3"><Users size={16} className="mx-auto text-brand-700" /><b className="block mt-1 num">{room.participants?.length ?? 0}</b>members</div><div className="rounded-xl bg-brand-50 p-3"><p className="text-brand-700 font-bold">Target</p><b className="block mt-1 num">{naira(room.targetAmount)}</b></div><div className="rounded-xl bg-brand-50 p-3"><Clock size={16} className="mx-auto text-brand-700" /><b className="block mt-1 num">{open ? naira(Math.max(0, room.closingThreshold - room.acceptedProductTotal)) : '—'}</b>to go</div></div>
        <div className="mt-5 rounded-2xl bg-slate-50 border p-4 text-sm text-slate-600 space-y-1.5"><b className="text-brand-deep">How it works</b><p>1. Join the room (free). You'll land in the room chat.</p><p>2. Add your products from the chat. Edit them any time until the room closes.</p><p>3. When it reaches {naira(room.closingThreshold)} it closes automatically and everyone pays their own total.</p></div>
        {!open && <p className="mt-4 rounded-2xl bg-amber-50 text-amber-800 p-3 text-sm">This room is {room.status.toLowerCase()}, so new members can't join.</p>}
        {err && <p role="alert" className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl p-3">{err}</p>}
        {open && (room.visibility === 'PUBLIC' ? <button disabled={busy} onClick={join} className="mt-5 w-full py-4 rounded-2xl bg-brand text-white font-extrabold text-lg disabled:opacity-60">{busy ? 'Joining…' : 'Join room & open chat'}</button> : <p className="mt-5 flex items-center gap-2 text-sm text-slate-500"><Lock size={15} />Private room: join using the invitation link you were sent.</p>)}</div></div></div>);
}
export default function RoomDetails() {
  const { id } = useParams(); const qc = useQueryClient();
  const room = useQuery({ queryKey: ['room', id], queryFn: () => api(`/rooms/${id}`) }); const mem = useQuery({ queryKey: ['members', id], queryFn: () => api(`/rooms/${id}/members`), retry: false }); const me = useQuery({ queryKey: ['me'], queryFn: () => api('/auth/me'), staleTime: 600000 });
  const refresh = () => { qc.invalidateQueries({ queryKey: ['room', id] }); qc.invalidateQueries({ queryKey: ['members', id] }); };
  if (room.error) return <div className="text-center py-16"><p className="text-red-500">{room.error.message}</p><Link to="/app/discover" className="text-brand-700 font-semibold">Back to discover</Link></div>;
  if (room.isLoading || mem.isLoading || me.isLoading) return <Skeleton className="h-80" />;
  if (mem.data && room.data) return <RoomChat id={id} room={room.data} members={mem.data} me={me.data} refresh={refresh} />;
  return <Preview room={room.data} refresh={refresh} />;
}
