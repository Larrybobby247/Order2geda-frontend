import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { RoomCard, Skeleton, Empty } from '../components';
export default function MyRooms() {
  const { data, isLoading } = useQuery({ queryKey: ['my-rooms'], queryFn: () => api('/rooms/mine'), refetchInterval: 30000 });
  return (<div><h1 className="text-2xl font-black tracking-tight text-brand-deep mb-4">My rooms</h1>{isLoading ? <div className="grid sm:grid-cols-2 gap-4"><Skeleton className="h-60" /><Skeleton className="h-60" /></div> : !data.length ? <Empty text="You haven't joined any rooms yet." action={<Link to="/app/discover" className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold">Explore rooms</Link>} /> : <div className="grid sm:grid-cols-2 gap-4">{data.map((r) => <RoomCard key={r._id} room={r} unread={r.unread} />)}</div>}</div>);
}
