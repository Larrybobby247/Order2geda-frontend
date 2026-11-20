import { Link, NavLink, Outlet, Navigate } from 'react-router-dom';
import { Home, Search, PlusCircle, ShoppingBag, User } from 'lucide-react';
import { token, naira } from './api';
export const Logo = () => <Link to="/" className="text-xl font-extrabold text-brand-dark">Order<span className="text-brand">2</span>Geda</Link>;
export function RoomCard({ room }) {
  const pct = Math.min(100, Math.round((room.acceptedProductTotal / room.closingThreshold) * 100));
  return (
    <Link to={`/app/rooms/${room._id}`} className="block rounded-card bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between"><h3 className="font-bold">{room.name}</h3><span className="text-xs bg-brand-mint text-brand-dark px-2 py-1 rounded-full">{room.shoppingPlatform}</span></div>
      <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-brand transition-all duration-700" style={{ width: pct + '%' }} /></div>
      <div className="mt-2 flex justify-between text-sm text-slate-500 num"><span>{naira(room.acceptedProductTotal)} / {naira(room.targetAmount)}</span><span>{room.participantCount} members</span></div>
      <p className="text-xs text-slate-400 mt-1">Closes automatically at {naira(room.closingThreshold)}</p>
    </Link>);
}
export const Skeleton = () => <div className="h-28 rounded-card bg-slate-200 animate-pulse" />;
export const Empty = ({ text }) => <div className="text-center py-12 text-slate-500">{text}</div>;
export function CustomerLayout() {
  if (!token.get()) return <Navigate to="/login" replace />;
  const tab = (to, Icon, label) => <NavLink to={to} className={({ isActive }) => `flex flex-col items-center text-xs ${isActive ? 'text-brand' : 'text-slate-400'}`}><Icon size={22} />{label}</NavLink>;
  return (<div className="max-w-2xl mx-auto pb-24 min-h-screen"><header className="p-4 bg-white border-b"><Logo /></header><main className="p-4"><Outlet /></main>
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
      {tab('/app/home', Home, 'Home')}{tab('/app/discover', Search, 'Discover')}{tab('/app/rooms/create', PlusCircle, 'Create')}{tab('/app/orders', ShoppingBag, 'Orders')}{tab('/app/settings', User, 'Profile')}</nav></div>);
}
