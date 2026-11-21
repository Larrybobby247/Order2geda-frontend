import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { api } from '../api';
import { RoomCard, Skeleton, Empty } from '../components';
import { Reveal } from '../ui';
const CATS = ['Fashion', 'Electronics', 'Home and Living', 'Beauty', 'Accessories', 'General Shopping']; const PLATFORMS = ['Temu', 'Shein', 'AliExpress', 'Other'];
export default function Discover() {
  const [sp, setSp] = useSearchParams(); const [q, setQ] = useState(''); const [sort, setSort] = useState('new'); const category = sp.get('category') || ''; const platform = sp.get('platform') || '';
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }); };
  const { data, isLoading, error, isFetching } = useQuery({ queryKey: ['rooms', q, sort, category, platform], queryFn: () => api(`/rooms?q=${encodeURIComponent(q)}&sort=${sort}&category=${encodeURIComponent(category)}&platform=${encodeURIComponent(platform)}`), placeholderData: (p) => p });
  const chip = (on, label, fn) => <button key={label} onClick={fn} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${on ? 'bg-brand-dark text-white border-brand-dark shadow-soft' : 'bg-white text-slate-600 hover:border-brand-200 hover:text-brand-dark'}`}>{label}</button>;
  const filtered = category || platform || q;
  return (<div><div className="mb-5"><h1 className="text-2xl font-black tracking-tight text-brand-deep">Discover rooms</h1><p className="text-slate-500 text-sm">Public rooms you can join right now.</p></div>
    <div className="flex gap-2"><div className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rooms" className="w-full rounded-2xl border pl-10 pr-9 py-3" />{q && <button aria-label="Clear" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={16} /></button>}</div>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border px-3 text-sm font-semibold"><option value="new">Newest</option><option value="progress">Closest to target</option></select></div>
    <div className="flex gap-2 overflow-x-auto py-3 -mx-4 px-4">{chip(!platform, 'All stores', () => set('platform', ''))}{PLATFORMS.map((p) => chip(platform === p, p, () => set('platform', platform === p ? '' : p)))}</div>
    <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">{chip(!category, 'All categories', () => set('category', ''))}{CATS.map((c) => chip(category === c, c, () => set('category', category === c ? '' : c)))}</div>
    <div className={`grid sm:grid-cols-2 gap-4 transition-opacity ${isFetching && data ? 'opacity-60' : ''}`}>{isLoading ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-60" />) : error ? <div className="sm:col-span-2"><Empty text={error.message} /></div> : data?.length ? data.map((r, i) => <Reveal key={r._id} delay={(i % 4) * 60}><RoomCard room={r} /></Reveal>) : <div className="sm:col-span-2"><Empty text={filtered ? 'No rooms match your filters.' : 'No rooms yet. Create the first one!'} action={<Link to="/app/rooms/create" className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold">Create a room</Link>} /></div>}</div></div>);
}
