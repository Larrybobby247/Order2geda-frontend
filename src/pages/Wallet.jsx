import { useQuery } from '@tanstack/react-query';
import { api, naira } from '../api';
import { Skeleton, Empty } from '../components';
export default function Wallet() {
  const { data, isLoading } = useQuery({ queryKey: ['wallet'], queryFn: () => api('/me/wallet') });
  if (isLoading) return <Skeleton />;
  return (<div><div className="rounded-[24px] bg-gradient-to-br from-brand to-brand-dark text-white p-6"><p className="text-sm opacity-80">Available balance</p><p className="text-3xl font-extrabold num">{naira(data.balance)}</p><p className="text-sm mt-2 opacity-80 num">Total earned {naira(data.totalEarned)}</p></div>
    <h2 className="font-bold mt-5 mb-2">Transactions</h2>{!data.transactions.length ? <Empty text="No transactions yet." /> : data.transactions.map((t) => <div key={t._id} className="flex justify-between bg-white border rounded-[14px] p-3 mb-2 text-sm"><span>{t.description}<br /><span className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span></span><b className={`num ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-500'}`}>{t.type === 'CREDIT' ? '+' : '−'}{naira(t.amount)}</b></div>)}</div>);
}
