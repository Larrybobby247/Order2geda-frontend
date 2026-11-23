import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, X, MapPin, SlidersHorizontal, LocateFixed, Loader2 } from 'lucide-react';
import { api } from '../api';
import { RoomCard, Skeleton, Empty } from '../components';
import { Reveal } from '../ui';
import { STATES, areasFor, locLabel } from '../locations';
import { useLocate } from '../LocationPicker';
const CATS = ['Fashion', 'Electronics', 'Home and Living', 'Beauty', 'Accessories', 'General Shopping']; const PLATFORMS = ['Temu', 'Shein', 'AliExpress', 'Other'];
export default function Discover() {
  const qc = useQueryClient(); const [sp, setSp] = useSearchParams(); const [q, setQ] = useState(''); const [sort, setSort] = useState('nearby'); const [showLoc, setShowLoc] = useState(false);
  const me = useQuery({ queryKey: ['me'], queryFn: () => api('/auth/me'), staleTime: 600000 }).data; const mine = me?.location?.state ? me.location : null;
  const g = (k) => sp.get(k) || ''; const state = g('state'), area = g('area'), category = g('category'), platform = g('platform');
  const set = (obj) => { const n = new URLSearchParams(sp); Object.entries(obj).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); setSp(n, { replace: true }); };
  const strict = !!state; // an explicit location filter overrides "near me"
  const qs = new URLSearchParams({ q, sort: strict && sort === 'nearby' ? 'new' : sort, category, platform, state, area, ...(!strict && mine ? { nearState: mine.state, nearArea: mine.area || '' } : {}) }).toString();
  const { data, isLoading, error, isFetching } = useQuery({ queryKey: ['rooms', qs], queryFn: () => api('/rooms?' + qs), placeholderData: (p) => p });
  const loc = useLocate((r) => { set({ state: r.state, area: r.area || '' }); setShowLoc(true); });
  const saveAsMine = async () => { await api('/me/profile', { method: 'PATCH', body: { location: { state, area } } }); qc.invalidateQueries({ queryKey: ['me'] }); alert('Saved. We\'ll show rooms near ' + locLabel({ state, area }) + ' first.'); };
  const chip = (on, label, fn) => <button key={label} onClick={fn} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${on ? 'bg-brand-dark text-white border-brand-dark shadow-soft' : 'bg-white text-slate-600 hover:border-brand-200 hover:text-brand-dark'}`}>{label}</button>;
  const filtered = category || platform || q || state; const sel = 'rounded-2xl border px-3 py-3 text-sm font-semibold w-full';
  return (<div><div className="mb-4"><h1 className="text-2xl font-black tracking-tight text-brand-deep">Discover rooms</h1><p className="text-slate-500 text-sm">Public rooms you can join right now.</p></div>
    <div className="rounded-2xl bg-white border p-3 mb-4"><div className="flex items-center gap-2"><span className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0"><MapPin size={17} /></span>
      <div className="flex-1 min-w-0 text-sm">{strict ? <><b>Only {locLabel({ state, area })}</b><p className="text-xs text-slate-500">Showing rooms from this location only</p></> : mine ? <><b>Near {locLabel(mine)}</b><p className="text-xs text-slate-500">Rooms closest to you are shown first</p></> : <><b>Set your location</b><p className="text-xs text-slate-500">See rooms near you first</p></>}</div>
      {strict && <button onClick={() => set({ state: '', area: '' })} aria-label="Clear location filter" className="p-2 text-slate-400"><X size={16} /></button>}
      <button onClick={() => setShowLoc(!showLoc)} className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-100 rounded-full px-3 py-2"><SlidersHorizontal size={13} />{showLoc ? 'Close' : 'Change'}</button></div>
      {showLoc && <div className="mt-3 pt-3 border-t space-y-2.5 animate-fade-up"><div className="grid grid-cols-2 gap-2"><select className={sel} value={state} onChange={(e) => set({ state: e.target.value, area: '' })}><option value="">All states</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select><div><input className={sel} list="disc-areas" placeholder="Area (optional)" value={area} disabled={!state} onChange={(e) => set({ area: e.target.value })} /><datalist id="disc-areas">{areasFor(state).map((a) => <option key={a} value={a} />)}</datalist></div></div>
        <div className="flex flex-wrap gap-2"><button onClick={loc.locate} disabled={loc.busy} className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand text-white rounded-full px-4 py-2 disabled:opacity-60">{loc.busy ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} />}Near me now</button>{strict && <button onClick={saveAsMine} className="text-xs font-bold border rounded-full px-4 py-2">Save as my location</button>}</div>{loc.err && <p className="text-xs text-red-500">{loc.err}</p>}</div>}</div>
    <div className="flex gap-2"><div className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rooms" className="w-full rounded-2xl border pl-10 pr-9 py-3" />{q && <button aria-label="Clear" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X size={16} /></button>}</div>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border px-3 text-sm font-semibold"><option value="nearby">Nearest</option><option value="new">Newest</option><option value="progress">Closest to target</option></select></div>
    <div className="flex gap-2 overflow-x-auto py-3 -mx-4 px-4">{chip(!platform, 'All stores', () => set({ platform: '' }))}{PLATFORMS.map((p) => chip(platform === p, p, () => set({ platform: platform === p ? '' : p })))}</div>
    <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">{chip(!category, 'All categories', () => set({ category: '' }))}{CATS.map((c) => chip(category === c, c, () => set({ category: category === c ? '' : c })))}</div>
    <div className={`grid sm:grid-cols-2 gap-4 transition-opacity ${isFetching && data ? 'opacity-60' : ''}`}>{isLoading ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-60" />) : error ? <div className="sm:col-span-2"><Empty text={error.message} /></div> : data?.length ? data.map((r, i) => <Reveal key={r._id} delay={(i % 4) * 60}><RoomCard room={r} /></Reveal>) : <div className="sm:col-span-2"><Empty text={filtered ? 'No rooms match your filters.' : 'No rooms yet. Create the first one!'} action={<Link to="/app/rooms/create" className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold">Create a room</Link>} /></div>}</div></div>);
}
