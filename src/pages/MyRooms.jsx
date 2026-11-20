import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, naira } from '../api';
import { Skeleton, Empty } from '../components';
export default function MyRooms() {
  const { data, isLoading } = useQuery({ queryKey: ['my-rooms'], queryFn: () => api('/rooms/mine'), refetchInterval: 30000 });
  if (isLoading) return <Skeleton />; if (!data.length) return <Empty text="You haven't joined any rooms yet." />;
  return <div className="space-y-3"><h1 className="font-bold text-xl">My rooms</h1>{data.map((r) => <Link key={r._id} to={`/app/rooms/${r._id}`} className="block bg-white border rounded-card p-4"><div className="flex justify-between"><b>{r.name}</b>{r.unread > 0 && <span className="bg-brand text-white text-xs rounded-full px-2 py-0.5">{r.unread > 99 ? '99+' : r.unread} new</span>}</div><div className="text-sm text-slate-500 num">{r.status} · {naira(r.acceptedProductTotal)} / {naira(r.closingThreshold)}</div></Link>)}</div>;
}
