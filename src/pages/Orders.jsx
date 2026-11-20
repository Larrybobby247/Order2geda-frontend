import { useQuery } from '@tanstack/react-query';
import { api, naira } from '../api';
import { Skeleton, Empty } from '../components';
export default function Orders() {
  const { data, isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => api('/orders') });
  const pay = async (id) => { const r = await api(`/orders/${id}/pay`, { method: 'POST' }); if (r.authorizationUrl) location.href = r.authorizationUrl; };
  if (isLoading) return <Skeleton />; if (!data?.length) return <Empty text="No orders yet. Join a room to get started." />;
  return <div className="space-y-3">{data.map((o) => <div key={o._id} className="bg-white rounded-card border p-4"><div className="flex justify-between"><b>{o.orderReference}</b><span className="text-xs px-2 py-1 rounded-full bg-slate-100">{o.orderStatus}</span></div>
    <p className="text-sm text-slate-500 num mt-1">Products {naira(o.productSubtotal)} + commission (10%) {naira(o.commissionAmount)} + shipping {naira(o.estimatedShipping)} = <b>{naira(o.totalAmount)}</b></p>
    {o.paymentStatus === 'UNPAID' && o.orderStatus !== 'CANCELLED' && <button onClick={() => pay(o._id)} className="mt-3 px-4 py-2 rounded-[14px] bg-brand text-white font-semibold">Pay with Paystack</button>}</div>)}</div>;
}
