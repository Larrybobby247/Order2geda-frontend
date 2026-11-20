import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Logo, RoomCard, Skeleton } from '../components';
export default function Landing() {
  const { data, isLoading } = useQuery({ queryKey: ['rooms', 'featured'], queryFn: () => api('/rooms') });
  return (<div><header className="flex justify-between items-center p-4 max-w-5xl mx-auto"><Logo /><Link className="px-4 py-2 rounded-[14px] bg-brand text-white font-semibold" to="/register">Join Now</Link></header>
    <section className="bg-gradient-to-br from-brand to-brand-dark text-white text-center px-6 py-16"><h1 className="text-4xl font-extrabold max-w-xl mx-auto">Shop Together. Save Together. Get More Together.</h1>
      <p className="mt-4 max-w-md mx-auto opacity-90">Join a shopping community, combine orders, and reach minimum purchase requirements without shopping alone.</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"><Link to="/app/discover" className="px-6 py-3 rounded-[14px] bg-white text-brand-dark font-bold">Explore Shopping Rooms</Link><a href="#how" className="px-6 py-3 rounded-[14px] border border-white/60">How It Works</a></div></section>
    <section id="how" className="max-w-5xl mx-auto p-6 grid sm:grid-cols-3 gap-4">{['Find or create a shopping room', 'Add the products you want', 'Shop together and track the group order'].map((t, i) => <div key={t} className="rounded-card bg-white border p-5"><div className="text-brand font-extrabold text-2xl">{i + 1}</div>{t}</div>)}</section>
    <section className="max-w-5xl mx-auto p-6"><h2 className="font-bold text-xl mb-3">Featured public rooms</h2><div className="grid sm:grid-cols-2 gap-3">{isLoading ? <Skeleton /> : data?.map((r) => <RoomCard key={r._id} room={r} />)}</div></section>
    <footer className="p-8 text-center text-sm text-slate-500">© Order2Geda · Terms · Privacy · Refund Policy · Shipping Policy</footer></div>);
}
