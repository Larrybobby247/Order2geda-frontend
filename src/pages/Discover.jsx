import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { RoomCard, Skeleton, Empty } from '../components';
export default function Discover() {
  const [q, setQ] = useState(''); const [sort, setSort] = useState('new');
  const { data, isLoading, error } = useQuery({ queryKey: ['rooms', q, sort], queryFn: () => api(`/rooms?q=${encodeURIComponent(q)}&sort=${sort}`) });
  return (<div><Link to="/app/my-rooms" className="block mb-3 text-sm text-brand font-semibold">My rooms →</Link><div className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rooms" className="flex-1 rounded-[12px] border p-3" />
    <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-[12px] border p-3"><option value="new">Newest</option><option value="progress">Closest to target</option></select></div>
    <div className="mt-4 grid gap-3">{isLoading ? [1, 2, 3].map((i) => <Skeleton key={i} />) : error ? <Empty text={error.message} /> : data.length ? data.map((r) => <RoomCard key={r._id} room={r} />) : <Empty text="No rooms found. Create one!" />}</div></div>);
}
