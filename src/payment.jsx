import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { api, naira } from './api';
// Shared pay UI (used in the chat's "room closed" sheet and on /app/pay/:orderId, the link emailed to every participant).
export function PayPanel({ order }) {
  const [agree, setAgree] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const items = (order.products || []).filter((p) => p.status === 'ACTIVE');
  async function pay() { setBusy(true); setErr(''); try { const r = await api(`/orders/${order._id}/pay`, { method: 'POST', body: { acceptPolicies: true } }); if (!r.authorizationUrl) throw new Error('Payment could not be started. Please try again shortly.'); window.location.href = r.authorizationUrl; } catch (x) { setErr(x.message); setBusy(false); } }
  const rows = [['Products', order.productSubtotal], [`Service commission (${order.commissionRate ?? 10}%)`, order.commissionAmount], ['Shipping share (estimate)', order.estimatedShipping], ...(order.walletCreditUsed ? [['Wallet credit', -order.walletCreditUsed]] : [])];
  return (<div className="p-5 space-y-4">
    <div className="rounded-2xl bg-gradient-to-br from-brand-deep to-brand-dark text-white p-5 text-center"><p className="text-xs uppercase tracking-widest text-emerald-200">Total due now</p><p className="text-4xl font-black num mt-1">{naira(order.totalAmount || 0)}</p><p className="text-xs text-emerald-100/80 mt-1">Order {order.orderReference}</p></div>
    {items.length > 0 && <div className="space-y-2">{items.map((p) => <div key={p._id} className="flex items-center gap-3 text-sm">{p.image ? <img src={p.image} alt="" loading="lazy" className="w-10 h-10 rounded-xl object-cover" /> : <span className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">🛍️</span>}<span className="flex-1 min-w-0 truncate">{p.name} <span className="text-slate-400">× {p.quantity}</span></span><b className="num">{naira(p.price * p.quantity)}</b></div>)}</div>}
    <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4 text-sm space-y-2 num">{rows.map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-slate-600">{k}</span><b>{naira(v || 0)}</b></div>)}<div className="flex justify-between pt-2 border-t border-brand-200 text-base"><b>Total</b><b className="text-brand-dark">{naira(order.totalAmount || 0)}</b></div></div>
    <p className="text-xs text-slate-500">Shipping is shared by product value. If the actual cost differs from this estimate, the adjustment is recorded and you are notified. Unpaid orders can't be included in the bulk order.</p>
    <label className="flex gap-2 text-sm"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-emerald-600" /><span>I accept the purchasing, <Link to="/shipping-policy" className="text-brand-700 font-semibold">shipping</Link> and <Link to="/refund-policy" className="text-brand-700 font-semibold">refund</Link> policies.</span></label>
    {err && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-xl p-3">{err}</p>}
    <button disabled={!agree || busy} onClick={pay} className="w-full py-4 rounded-2xl bg-brand text-white font-extrabold text-lg inline-flex items-center justify-center gap-2 disabled:opacity-50"><Lock size={18} />{busy ? 'Opening Paystack…' : `Pay ${naira(order.totalAmount || 0)} now`}</button>
    <p className="text-center text-xs text-slate-400 inline-flex items-center justify-center gap-1 w-full"><ShieldCheck size={13} />Secured by Paystack. We never see your card details.</p></div>);
}
