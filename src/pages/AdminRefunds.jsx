import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, naira } from '../api';
export default function AdminRefunds() {
  const qc = useQueryClient(); const { data, error } = useQuery({ queryKey: ['admin-refunds'], queryFn: () => api('/admin/refunds') });
  const act = async (id, status) => {
    let transferReference;
    if (status === 'COMPLETED') { if (!confirm("Completing this refund cancels the customer's ENTIRE order and removes it from bulk-order processing. Other customers are unaffected. If the external order was placed, it will be flagged. Continue?")) return; transferReference = prompt('Bank transfer reference'); if (!transferReference) return; }
    try { await api(`/admin/refunds/${id}/status`, { method: 'PATCH', body: { status, transferReference } }); qc.invalidateQueries({ queryKey: ['admin-refunds'] }); } catch (e) { alert(e.message); }
  };
  const reveal = async (id) => { try { const b = await api(`/admin/refunds/${id}/bank`); alert(`${b.bankName}\n${b.accountName}\n${b.accountNumber}`); } catch (e) { alert(e.message); } };
  if (error) return <p className="p-6 text-red-500">{error.message}</p>;
  return <div className="p-6 max-w-4xl mx-auto"><h1 className="text-xl font-bold mb-4">Refunds</h1>{!data?.length ? <p className="text-slate-500">No refund requests.</p> : data.map((r) => <div key={r._id} className="bg-white border rounded-card p-4 mb-3 flex justify-between items-center"><div><b>{naira(r.requestedAmount)}</b> · {r.reason}<div className="text-xs text-slate-500">{r.bankName} · {r.accountName} · {r.status} · <button className="text-brand underline" onClick={() => reveal(r._id)}>Reveal account number (logged)</button></div></div>
    <div className="flex gap-2 text-sm">{r.status === 'PENDING' && <><button onClick={() => act(r._id, 'APPROVED')} className="px-3 py-1 rounded bg-brand text-white">Approve</button><button onClick={() => act(r._id, 'REJECTED')} className="px-3 py-1 rounded border">Reject</button></>}{['APPROVED', 'PROCESSING'].includes(r.status) && <button onClick={() => act(r._id, 'COMPLETED')} className="px-3 py-1 rounded bg-brand-dark text-white">Mark completed</button>}</div></div>)}</div>;
}
