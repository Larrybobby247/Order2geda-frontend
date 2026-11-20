import { useQuery } from '@tanstack/react-query';
import { api, naira } from '../api';
export default function ModeratorDashboard() {
  const d = useQuery({ queryKey: ['mod-dash'], queryFn: () => api('/moderator/dashboard') }); const rooms = useQuery({ queryKey: ['mod-rooms'], queryFn: () => api('/moderator/rooms') });
  if (d.error) return <p className="p-6 text-red-500">{d.error.message}</p>;
  return (<div className="p-6 max-w-3xl mx-auto"><h1 className="text-xl font-bold">Moderator dashboard</h1><p className="mt-2 text-lg num">{d.data ? `${d.data.activeRooms} / ${d.data.capacity} active rooms` : '…'}</p>
    <div className="mt-4 space-y-3">{rooms.data?.length === 0 && <p className="text-slate-500">No rooms assigned yet.</p>}{rooms.data?.map((r) => <div key={r._id} className="bg-white border rounded-card p-4"><b>{r.name}</b><div className="text-sm text-slate-500 num">{r.status} · {naira(r.acceptedProductTotal)} / {naira(r.closingThreshold)}</div></div>)}</div></div>);
}
