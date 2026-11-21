import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, naira } from '../api';
import { Card, TwoFactorCard } from '../components2';
import { Skeleton, Empty } from '../components';
const btn = 'px-3 py-1.5 rounded-[10px] text-sm font-semibold';
const FLOW = ['PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'CUSTOMS_CLEARANCE', 'ARRIVED_IN_NIGERIA', 'SORTING_ORDERS', 'READY_FOR_COLLECTION', 'OUT_FOR_DELIVERY', 'COMPLETED'];
export function ModeratorRooms() {
  const { data, error } = useQuery({ queryKey: ['mod-rooms'], queryFn: () => api('/moderator/rooms') }); if (error) return <p className="text-red-500">{error.message}</p>; if (!data) return <Skeleton />;
  return <div className="space-y-3"><h1 className="text-xl font-bold">Assigned rooms</h1>{!data.length && <Empty text="No rooms assigned yet." />}{data.map((r) => <Link key={r._id} to={`/moderator/rooms/${r._id}`} className="block bg-white border rounded-card p-4"><b>{r.name}</b><div className="text-sm text-slate-500 num">{r.status} · {naira(r.acceptedProductTotal)} / {naira(r.closingThreshold)}</div></Link>)}</div>;
}
export function ModeratorRoom() {
  const { roomId } = useParams(); const qc = useQueryClient(); const [msg, setMsg] = useState(''); const [ext, setExt] = useState({ externalPlatform: '', externalOrderReference: '', externalShipping: 0 });
  const prods = useQuery({ queryKey: ['mp', roomId], queryFn: () => api(`/moderator/rooms/${roomId}/products`) }); const bulk = useQuery({ queryKey: ['mb', roomId], queryFn: () => api(`/moderator/rooms/${roomId}/bulk-order`) });
  const verify = (pid, status) => api(`/moderator/rooms/${roomId}/products/${pid}/verify`, { method: 'POST', body: { status, notes: status === 'VERIFIED' ? '' : prompt('Reason / note') || '' } }).then(() => qc.invalidateQueries({ queryKey: ['mp', roomId] }));
  const run = async (fn) => { try { await fn(); setMsg('Done'); qc.invalidateQueries(); } catch (x) { setMsg(x.message); } };
  const place = () => confirm('Place the bulk order? Only paid, non-cancelled orders are included.') && run(() => api(`/moderator/rooms/${roomId}/bulk-order/place`, { method: 'POST', body: { ...ext, externalShipping: Math.round(ext.externalShipping * 100) } }));
  const status = (s) => confirm(`Move all active orders to ${s}?`) && run(() => api(`/moderator/rooms/${roomId}/status`, { method: 'PATCH', body: { status: s } }));
  const announce = () => { const content = prompt('Announcement'); content && run(() => api(`/messages/room/${roomId}/announce`, { method: 'POST', body: { content, pin: true } })); };
  return (<div className="space-y-5"><div className="flex justify-between"><h1 className="text-xl font-bold">Room management</h1><span className="flex gap-2"><Link className={`${btn} border`} to={`/app/rooms/${roomId}`}>Open chat</Link><button className={`${btn} border`} onClick={announce}>Pin announcement</button></span></div>{msg && <p className="text-sm">{msg}</p>}
    <section><h2 className="font-bold mb-2">Product review</h2>{!prods.data ? <Skeleton /> : prods.data.map((p) => <div key={p._id} className="bg-white border rounded-[14px] p-3 mb-2 text-sm flex justify-between gap-2"><span><b>{p.name}</b> × {p.quantity} · <span className="num">{naira(p.price)}</span><br /><span className="text-slate-500">{p.customer?.fullName} · {p.verificationStatus} · {p.status}{p.productUrl && <> · <a className="text-brand" href={p.productUrl} target="_blank" rel="noreferrer">link</a></>}</span></span>
      <span className="flex gap-1 items-start"><button className={`${btn} bg-brand text-white`} onClick={() => verify(p._id, 'VERIFIED')}>Verify</button><button className={`${btn} border`} onClick={() => verify(p._id, 'FLAGGED')}>Flag</button><button className={`${btn} border`} onClick={() => verify(p._id, 'UNAVAILABLE')}>N/A</button></span></div>)}</section>
    <section><h2 className="font-bold mb-2">Consolidated bulk order</h2>{bulk.data && <><div className="grid grid-cols-3 gap-3"><Card label="Paid orders" value={bulk.data.orders.length} /><Card label="Value" value={naira(bulk.data.totalValue)} /><Card label="Cancelled (excluded)" value={bulk.data.cancelledCount} /></div>
      {bulk.data.orders.map((o) => <div key={o._id} className="text-sm border-b py-2"><b>{o.customer?.fullName}</b> · {o.orderReference} · <span className="num">{naira(o.productSubtotal)}</span> · {o.orderStatus}<div className="text-slate-500">{o.products.map((p) => `${p.name}×${p.quantity}`).join(', ')}</div></div>)}</>}
      <div className="bg-white border rounded-card p-3 mt-3 grid sm:grid-cols-3 gap-2 text-sm"><input placeholder="Platform" className="border rounded p-2" onChange={(e) => setExt({ ...ext, externalPlatform: e.target.value })} /><input placeholder="External order ref" className="border rounded p-2" onChange={(e) => setExt({ ...ext, externalOrderReference: e.target.value })} /><input type="number" placeholder="Shipping ₦" className="border rounded p-2" onChange={(e) => setExt({ ...ext, externalShipping: e.target.value })} /><button onClick={place} className={`${btn} bg-brand text-white sm:col-span-3`}>Place bulk order</button></div>
      <div className="flex flex-wrap gap-2 mt-3">{FLOW.map((s) => <button key={s} onClick={() => status(s)} className={`${btn} border text-xs`}>{s.replace(/_/g, ' ')}</button>)}</div></section></div>);
}
export const ModeratorSecurity = () => <div className="space-y-4"><h1 className="text-xl font-bold">Account security</h1><TwoFactorCard /></div>;
export function ModeratorEarnings() {
  const { data, error } = useQuery({ queryKey: ['mod-earn'], queryFn: () => api('/moderator/earnings') }); if (error) return <p className="text-red-500">{error.message}</p>; if (!data) return <Skeleton />;
  return <div><h1 className="text-xl font-bold mb-1">Earnings</h1><p className="text-xs text-slate-500 mb-3">Separate from platform commission. Read-only.</p>{!data.length && <Empty text="No earnings yet." />}{data.map((c) => <div key={c._id} className="bg-white border rounded-[14px] p-3 mb-2 text-sm flex justify-between"><span>{c.compensationType} · {c.calculationBasis}<br /><span className="text-slate-500">{c.status}{c.payoutReference ? ' · ' + c.payoutReference : ''}</span></span><b className="num">{naira(c.compensationAmount)}</b></div>)}</div>;
}
