import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, socket } from '../api';
import { Skeleton, Empty } from '../components';
export default function Notifications() {
  const qc = useQueryClient(); const { data, isLoading } = useQuery({ queryKey: ['notifs'], queryFn: () => api('/me/notifications') });
  useEffect(() => { const s = socket(); s.on('notification:new', () => qc.invalidateQueries({ queryKey: ['notifs'] })); return () => s.disconnect(); }, []);
  const readAll = () => api('/me/notifications/read', { method: 'POST', body: {} }).then(() => qc.invalidateQueries({ queryKey: ['notifs'] }));
  if (isLoading) return <Skeleton />;
  return (<div><div className="flex justify-between items-center mb-3"><h1 className="font-bold text-xl">Notifications ({data.unread} unread)</h1><button onClick={readAll} className="text-sm text-brand">Mark all read</button></div>
    {!data.items.length ? <Empty text="You're all caught up." /> : data.items.map((n) => <div key={n._id} className={`rounded-[14px] border p-3 mb-2 ${n.readAt ? 'bg-white' : 'bg-brand-mint/40'}`}><b className="text-sm">{n.title}</b><p className="text-sm text-slate-600">{n.body}</p><span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</span></div>)}</div>);
}
