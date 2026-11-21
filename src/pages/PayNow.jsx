import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Skeleton, Empty } from '../components';
import { PayPanel } from '../payment';
export default function PayNow() {
  const { id } = useParams(); const { data: o, isLoading, error } = useQuery({ queryKey: ['pay-order', id], queryFn: () => api(`/orders/${id}`) });
  if (isLoading) return <Skeleton className="h-96" />; if (error) return <Empty text={error.message} />;
  return (<div className="max-w-md mx-auto"><Link to="/app/orders" className="text-sm font-semibold text-brand-700">← My orders</Link><h1 className="text-2xl font-black text-brand-deep mt-2">Complete your payment</h1>
    <div className="bg-white rounded-[28px] border shadow-soft mt-4 overflow-hidden">{o.orderStatus === 'CANCELLED' ? <p className="p-6 text-slate-600">This order was cancelled.</p> : o.paymentStatus === 'PAID' ? <div className="p-6 text-center"><p className="text-4xl">✅</p><p className="font-bold mt-2">This order is already paid.</p><Link to={`/app/orders/${o._id}`} className="inline-block mt-4 px-5 py-2.5 rounded-2xl bg-brand text-white font-bold">Track order</Link></div> : <PayPanel order={o} />}</div></div>);
}
