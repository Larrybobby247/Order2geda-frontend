import { useState } from 'react';
import { MapPin, Loader2, LocateFixed } from 'lucide-react';
import { api } from './api';
import { STATES, areasFor } from './locations';
// State + area picker. "Use my current location" reads GPS, asks the server to reverse-geocode it, and then lets the member confirm or correct the result.
export function useLocate(onFound) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const locate = () => { setErr(''); if (!navigator.geolocation) return setErr('Your browser does not support location.'); setBusy(true);
    navigator.geolocation.getCurrentPosition(async (pos) => { try { const r = await api(`/geo/reverse?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`); if (!r.state) throw new Error('We could not match that to a Nigerian state. Please choose it manually.'); onFound(r); } catch (e) { setErr(e.message); } finally { setBusy(false); } },
      (e) => { setBusy(false); setErr(e.code === 1 ? 'Location permission was denied. You can choose your area manually.' : 'We could not get your location. Please choose it manually.'); }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }); };
  return { locate, busy, err };
}
export default function LocationPicker({ value, onChange, light }) {
  const [cands, setCands] = useState([]); const v = value || { state: '', area: '' };
  const { locate, busy, err } = useLocate((r) => { setCands(r.candidates || []); onChange({ state: r.state, area: r.area || '' }); });
  const inp = 'mt-1.5 w-full rounded-[14px] border border-slate-200 px-3.5 py-3 text-[15px]'; const list = [...new Set([...(cands || []), ...areasFor(v.state)])];
  return (<div className="space-y-3"><div className="grid sm:grid-cols-2 gap-3">
    <label className="block text-sm font-semibold">State<select className={inp} value={v.state} onChange={(e) => onChange({ state: e.target.value, area: '' })}><option value="">Select state…</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
    <label className="block text-sm font-semibold">Area / neighbourhood<input className={inp} list="o2g-areas" value={v.area} onChange={(e) => onChange({ ...v, area: e.target.value })} placeholder={v.state ? 'e.g. ' + (areasFor(v.state)[0] || 'your area') : 'Pick a state first'} /><datalist id="o2g-areas">{list.map((a) => <option key={a} value={a} />)}</datalist></label></div>
    <button type="button" onClick={locate} disabled={busy} className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 bg-brand-100 hover:bg-brand-200 rounded-full px-4 py-2 transition disabled:opacity-60">{busy ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}{busy ? 'Finding you…' : 'Use my current location'}</button>
    {cands.length > 1 && <div className="flex flex-wrap gap-1.5 items-center"><span className="text-xs text-slate-500">Is it one of these?</span>{cands.map((c) => <button key={c} type="button" onClick={() => onChange({ ...v, area: c })} className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${v.area === c ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white hover:border-brand'}`}>{c}</button>)}</div>}
    {err && <p className="text-xs text-red-500">{err}</p>}{cands.length > 0 && <p className="text-xs text-slate-500 flex gap-1"><MapPin size={13} className="shrink-0 mt-0.5" />We detected this from your device. Please check it is correct before saving.</p>}</div>);
}
