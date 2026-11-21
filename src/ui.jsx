import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
export function useInView(opts = { threshold: 0.15 }) {
  const ref = useRef(null); const [seen, setSeen] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, opts); io.observe(el); return () => io.disconnect(); }, []);
  return [ref, seen];
}
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, seen] = useInView(); return <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${seen ? 'in' : ''} ${className}`}>{children}</Tag>;
}
export function CountUp({ to, duration = 1400, prefix = '', suffix = '', format = (n) => Math.round(n).toLocaleString() }) {
  const [ref, seen] = useInView(); const [v, setV] = useState(0);
  useEffect(() => { if (!seen) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; } let raf, t0;
    const step = (t) => { t0 ??= t; const p = Math.min(1, (t - t0) / duration); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [seen, to]);
  return <span ref={ref} className="num">{prefix}{format(v)}{suffix}</span>;
}
export const Skeleton = ({ className = 'h-28' }) => <div className={`skeleton rounded-card ${className}`} />;
export const Empty = ({ text, action }) => (<div className="text-center py-14 animate-fade-up"><svg width="96" height="96" viewBox="0 0 96 96" fill="none" className="mx-auto animate-float-slow"><circle cx="48" cy="48" r="44" fill="#D1FAE5" /><rect x="26" y="34" width="44" height="34" rx="8" fill="#fff" stroke="#10B981" strokeWidth="3" /><path d="M36 34v-4a12 12 0 0124 0v4" stroke="#059669" strokeWidth="3" strokeLinecap="round" /><circle cx="42" cy="50" r="2.5" fill="#10B981" /><circle cx="54" cy="50" r="2.5" fill="#10B981" /><path d="M43 58c3 3 7 3 10 0" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" /></svg><p className="text-slate-500 mt-4 max-w-xs mx-auto">{text}</p>{action && <div className="mt-4">{action}</div>}</div>);
export function Progress({ value, className = '' }) {
  const [w, setW] = useState(0); useEffect(() => { const t = setTimeout(() => setW(value), 90); return () => clearTimeout(t); }, [value]);
  return <div className={`h-2.5 bg-slate-100 rounded-full overflow-hidden ${className}`}><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 relative overflow-hidden transition-[width] duration-1000 ease-out" style={{ width: w + '%' }}><span className="absolute inset-0 bar-shine" /></div></div>;
}
const CHIP = { OPEN: 'bg-emerald-100 text-emerald-800', CLOSED: 'bg-amber-100 text-amber-800', PROCESSING: 'bg-sky-100 text-sky-800', COMPLETED: 'bg-brand-dark text-white', CANCELLED: 'bg-slate-200 text-slate-600', PAID: 'bg-emerald-100 text-emerald-800', UNPAID: 'bg-amber-100 text-amber-800', AWAITING_PAYMENT: 'bg-amber-100 text-amber-800', PAYMENT_COMPLETED: 'bg-emerald-100 text-emerald-800', SHIPPED: 'bg-sky-100 text-sky-800', IN_TRANSIT: 'bg-sky-100 text-sky-800' };
export const StatusChip = ({ s }) => <span className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${CHIP[s] || 'bg-slate-100 text-slate-600'}`}>{String(s).replace(/_/g, ' ')}</span>;
export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return <div className="space-y-3">{items.map(([q, a], i) => <div key={q} className={`rounded-[18px] border bg-white transition-all ${open === i ? 'border-brand-200 shadow-soft' : 'border-slate-200'}`}>
    <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="w-full flex justify-between items-center gap-4 text-left p-5 font-semibold"><span>{q}</span><ChevronDown size={20} className={`shrink-0 text-brand transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} /></button>
    <div className={`grid transition-all duration-300 ease-out ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><p className="px-5 pb-5 text-slate-600 leading-relaxed">{a}</p></div></div></div>)}</div>;
}
