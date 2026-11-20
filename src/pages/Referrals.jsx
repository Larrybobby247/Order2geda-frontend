import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, naira } from '../api';
import { Skeleton } from '../components';
export default function Referrals() {
  const { data, isLoading } = useQuery({ queryKey: ['referrals'], queryFn: () => api('/me/referrals') }); const [copied, setCopied] = useState(false);
  if (isLoading) return <Skeleton />;
  const copy = () => { navigator.clipboard.writeText(data.link); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const stat = (l, v) => <div className="bg-white border rounded-card p-3 text-center"><div className="text-xl font-bold num">{v}</div><div className="text-xs text-slate-500">{l}</div></div>;
  return (<div className="space-y-4"><div className="rounded-[24px] bg-brand-mint p-5"><p className="font-bold text-brand-dark">Invite friends, earn wallet rewards</p><p className="text-sm mt-1">Rewards are credited after your friend's first paid order. Code: <b>{data.code}</b></p>
    <div className="flex gap-2 mt-3"><button onClick={copy} className="px-4 py-2 rounded-[14px] bg-brand text-white font-semibold">{copied ? 'Copied!' : 'Copy link'}</button><a href={`https://wa.me/?text=${encodeURIComponent('Shop together on Order2Geda: ' + data.link)}`} className="px-4 py-2 rounded-[14px] border border-brand text-brand-dark">WhatsApp</a></div></div>
    <div className="grid grid-cols-4 gap-2">{stat('Invited', data.invited)}{stat('Successful', data.successful)}{stat('Pending', data.pending)}{stat('Earned', naira(data.rewards))}</div></div>);
}
