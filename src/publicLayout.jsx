import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Twitter, Facebook, Mail, MessageCircle } from 'lucide-react';
import { Logo } from './components';
import { token } from './api';
const links = [['/how-it-works', 'How it works'], ['/fees', 'Fees'], ['/about', 'About'], ['/safety', 'Safety'], ['/faq', 'FAQ'], ['/contact', 'Contact']];
export function PublicLayout() {
  const loc = useLocation(); const home = loc.pathname === '/'; const [scrolled, setScrolled] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [loc.pathname]);
  const light = home && !scrolled && !open; const e = import.meta.env; const logged = !!token.get();
  const social = [[e.VITE_SOCIAL_INSTAGRAM, Instagram, 'Instagram'], [e.VITE_SOCIAL_X, Twitter, 'X'], [e.VITE_SOCIAL_FACEBOOK, Facebook, 'Facebook']].filter((x) => x[0]);
  return (<div className="min-h-screen flex flex-col">
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${light ? 'bg-transparent' : 'glass shadow-soft'}`}><div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between"><Logo light={light} />
      <nav className="hidden lg:flex gap-1">{links.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => `px-3 py-2 rounded-full text-sm font-semibold transition-colors ${light ? 'text-white/85 hover:text-white' : isActive ? 'text-brand-700 bg-brand-100' : 'text-slate-600 hover:text-brand-dark'}`}>{l}</NavLink>)}</nav>
      <div className="hidden sm:flex items-center gap-2">{logged ? <Link to="/app/home" className="px-5 py-2.5 rounded-full bg-brand text-white font-bold text-sm">Open app</Link> : <><Link to="/login" className={`px-4 py-2 text-sm font-semibold ${light ? 'text-white' : 'text-brand-dark'}`}>Log in</Link><Link to="/register" className="px-5 py-2.5 rounded-full bg-brand text-white font-bold text-sm">Join now</Link></>}</div>
      <button aria-label="Menu" onClick={() => setOpen(!open)} className={`lg:hidden p-2 rounded-lg ${light ? 'text-white' : 'text-brand-dark'}`}>{open ? <X /> : <Menu />}</button></div>
      {open && <div className="lg:hidden glass border-t animate-fade-in px-5 py-3 space-y-1">{links.map(([to, l]) => <Link key={to} to={to} className="block py-2.5 font-semibold text-brand-dark">{l}</Link>)}<div className="flex gap-2 pt-2"><Link to="/login" className="flex-1 text-center py-2.5 rounded-xl border font-semibold">Log in</Link><Link to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-brand text-white font-bold">Join now</Link></div></div>}</header>
    <main className="flex-1"><Outlet /></main>
    <footer className="bg-brand-deep text-emerald-100/80 relative overflow-hidden"><div className="absolute inset-0 bg-grid opacity-30" /><div className="relative max-w-6xl mx-auto px-5 pt-14 pb-8 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-1"><Logo light /><p className="text-sm mt-4 leading-relaxed">Shop together, spend smarter. Group buying for Nigerians who want more from Temu, Shein, AliExpress and beyond.</p><div className="flex gap-2 mt-4">{social.map(([h, Icon, n]) => <a key={n} href={h} target="_blank" rel="noopener noreferrer" aria-label={n} className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand flex items-center justify-center transition"><Icon size={16} /></a>)}</div></div>
      {[['Company', [['/about', 'About us'], ['/how-it-works', 'How it works'], ['/fees', 'Fees & pricing'], ['/safety', 'Trust & safety']]], ['Help', [['/faq', 'FAQs'], ['/contact', 'Contact us'], ['/register', 'Create an account'], ['/login', 'Log in']]], ['Legal', [['/terms', 'Terms & Conditions'], ['/privacy', 'Privacy Policy'], ['/refund-policy', 'Refund Policy'], ['/shipping-policy', 'Shipping Policy']]]].map(([h, ls]) => <div key={h}><p className="text-white font-bold mb-3">{h}</p><ul className="space-y-2 text-sm">{ls.map(([to, l]) => <li key={to}><Link to={to} className="hover:text-brand-gold transition-colors">{l}</Link></li>)}</ul></div>)}</div>
      <div className="relative max-w-6xl mx-auto px-5 py-5 border-t border-white/10 text-xs flex flex-col sm:flex-row justify-between gap-2"><span>© {new Date().getFullYear()} Order2Geda. All rights reserved.</span><span>Payments by Paystack · Made for Nigeria 🇳🇬</span></div></footer></div>);
}
