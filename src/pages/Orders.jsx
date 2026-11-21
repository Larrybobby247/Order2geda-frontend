import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, ArrowRight, Undo2 } from 'lucide-react';
import { api, naira } from '../api';
import { Skeleton, Empty } from '../components';
import { StatusChip, Reveal } from '../ui';
const SHIPPED = ['SHIPPED', 'IN_TRANSIT', 'CUSTOMS_CLEARANCE', 'ARRIVED_IN_NIGERIA', 'SORTING_ORDERS', 'READY_FOR_COLLECTION', 'OUT_FOR_DELIVERY'];
const TABS = [['all', 'All', () => true], ['pay', 'Awaiting payment', (o) => o.paymentStatus === 'UNPAID' && o.orderStatus !== 'CANCELLED'], ['proc', 'Processing', (o) => o.paymentStatus === 'PAID' && !SHIPPED.includes(o.orderStatus) && !['COMPLETED', 'CANCELLED'].includes(o.orderStatus)], ['ship', 'Shipped', (o) => SHIPPED.includes(o.orderStatus)], ['done', 'Completed', (o) => o.orderStatus === 'COMPLETED'], ['can', 'Cancelled', (o) => o.orderStatus === 'CANCELLED']];
export default function Orders() {
  const [tab, setTab] = useState('all'); const [busy, setBusy] = useState(''); const { data, isLoading, error } = useQuery({ queryKey: ['orders'], queryFn: () => api('/orders') });
  const pay = async (id) => { setBusy(id); try { const r = await api(`/orders/${id}/pay`, { method: 'POST' }); if (r.authorizationUrl) location.href = r.authorizationUrl; else alert('Payment could not be started. Is Paystack configured on the server?'); } catch (e) { alert(e.message); } finally { setBusy(''); } };
  const list = (data || []).filter(TABS.find((t) => t[0] === tab)[2]);
  return (<div><h1 className="text-2xl font-black tracking-tight text-brand-deep mb-4">My orders</h1>
    <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">{TABS.map(([k, l, fn]) => <button key={k} onClick={() => setTab(k)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${tab === k ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-slate-600'}`}>{l}{data && <span className="ml-1.5 opacity-70">{data.filter(fn).length}</span>}</button>)}</div>
    {isLoading ? <div className="space-y-3"><Skeleton className="h-36" /><Skeleton className="h-36" /></div> : error ? <Empty text={error.message} /> : !list.length ? <Empty text={tab === 'all' ? 'No orders yet. Join a room and your order will appear here once the room closes.' : 'Nothing in this tab.'} action={tab === 'all' && <Link to="/app/discover" className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold">Explore rooms</Link>} /> :
      <div className="space-y-3">{list.map((o, i) => <Reveal key={o._id} delay={i * 50}><div className={`bg-white rounded-card border p-5 ${o.orderStatus === 'CANCELLED' ? 'opacity-80 bg-slate-50' : ''}`}><div className="flex justify-between items-start gap-2"><div><b className="text-brand-deep">{o.orderReference}</b><p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p></div><div className="flex gap-1.5 flex-wrap justify-end"><StatusChip s={o.paymentStatus} /><StatusChip s={o.orderStatus} /></div></div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs num">{[['Products', o.productSubtotal], ['Commission', o.commissionAmount], ['Shipping', o.estimatedShipping]].map(([k, v]) => <div key={k} className="bg-brand-50 rounded-xl py-2"><p className="text-slate-500">{k}</p><b className="text-sm">{naira(v || 0)}</b></div>)}</div>
        <div className="mt-3 flex items-center justify-between"><p className="num"><span className="text-xs text-slate-500">Total </span><b className="text-lg text-brand-dark">{naira(o.totalAmount || 0)}</b></p><div className="flex gap-2 flex-wrap justify-end">
          {o.paymentStatus === 'UNPAID' && o.orderStatus !== 'CANCELLED' && <button disabled={busy === o._id} onClick={() => pay(o._id)} className="px-4 py-2 rounded-[12px] bg-brand text-white text-sm font-bold inline-flex items-center gap-1.5 disabled:opacity-60"><CreditCard size={15} />{busy === o._id ? 'Opening…' : 'Pay now'}</button>}
          {o.paymentStatus === 'PAID' && o.refundStatus === 'NONE' && o.orderStatus !== 'CANCELLED' && <Link to={`/app/orders/${o._id}/refund`} className="px-3 py-2 rounded-[12px] border text-sm font-semibold inline-flex items-center gap-1.5"><Undo2 size={14} />Refund</Link>}
          <Link to={`/app/orders/${o._id}`} className="px-3 py-2 rounded-[12px] border text-sm font-semibold inline-flex items-center gap-1">Details <ArrowRight size={14} /></Link></div></div>
        {o.refundStatus !== 'NONE' && <p className="mt-3 text-xs bg-amber-50 text-amber-800 rounded-xl px-3 py-2">Refund {String(o.refundStatus).toLowerCase()}{o.orderStatus === 'CANCELLED' && ' · this order has been cancelled'}</p>}</div></Reveal>)}</div>}</div>);
}
