import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerLayout } from './components';
import { ScreenLoader } from './ui';
import { SidebarLayout } from './components2';
import { PublicLayout } from './publicLayout';
import './index.css';
const named = (file, n) => lazy(() => import(`./pages/${file}.jsx`).then((m) => ({ default: m[n] })));
const A = (n) => named('AdminPages', n), M = (n) => named('ModeratorPages', n), X = (n) => named('MiscPages', n);
const adminLinks = [['/admin/dashboard', 'Overview'], ['/admin/users', 'Users'], ['/admin/rooms', 'Rooms'], ['/admin/moderators', 'Moderators'], ['/admin/compensation', 'Compensation'], ['/admin/compensation-rules', 'Comp. rules'], ['/admin/payments', 'Payments'], ['/admin/refunds', 'Refunds'], ['/admin/commissions', 'Commission'], ['/admin/wallets', 'Wallets'], ['/admin/announcements', 'Announcements'], ['/admin/settings', 'Settings'], ['/admin/security', 'Security']];
const modLinks = [['/moderator/dashboard', 'Dashboard'], ['/moderator/rooms', 'Rooms'], ['/moderator/earnings', 'Earnings'], ['/moderator/security', 'Security']];
const P = (n) => named('PublicPages', n);
const About = P('About'), HowItWorks = P('HowItWorks'), Fees = P('Fees'), FaqPage = P('FaqPage'), Safety = P('Safety'), Contact = P('Contact'), Terms = P('Terms'), Privacy = P('Privacy'), RefundPolicy = P('RefundPolicy'), ShippingPolicy = P('ShippingPolicy');
const p = (n) => lazy(() => import(`./pages/${n}.jsx`));
const ShippingManager = p('ShippingManager'), ShippingInvoice = p('ShippingInvoice'), PayNow = p('PayNow'), Profile = p('Profile'), Home = p('Home'), OrderDetails = p('OrderDetails'), RefundRequest = p('RefundRequest'), PaymentSuccess = p('PaymentSuccess'), Landing = p('Landing'), Auth = p('Auth'), Discover = p('Discover'), CreateRoom = p('CreateRoom'), RoomDetails = p('RoomDetails'), Orders = p('Orders'), AdminRefunds = p('AdminRefunds'), Wallet = p('Wallet'), Referrals = p('Referrals'), Notifications = p('Notifications'), ModeratorDashboard = p('ModeratorDashboard');
const ForgotPassword = X('ForgotPassword'), ResetPassword = X('ResetPassword'), VerifyEmail = X('VerifyEmail'), Invite = X('Invite'), ModeratorInvite = X('ModeratorInvite'), Settings = X('Settings');
const AdminDashboard = A('AdminDashboard'), AdminUsers = A('AdminUsers'), AdminModerators = A('AdminModerators'), AdminCompensation = A('AdminCompensation'), AdminCommissions = A('AdminCommissions'), AdminWallets = A('AdminWallets'), AdminAnnouncements = A('AdminAnnouncements'), AdminSettings = A('AdminSettings'), AdminPayments = A('AdminPayments'), AdminRooms = A('AdminRooms'), AdminSecurity = A('AdminSecurity'), AdminCompensationRules = A('AdminCompensationRules'), MyRooms = p('MyRooms');
const ModeratorRooms = M('ModeratorRooms'), ModeratorRoom = M('ModeratorRoom'), ModeratorEarnings = M('ModeratorEarnings'), ModeratorSecurity = M('ModeratorSecurity');
const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: 1 } } });
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={qc}><BrowserRouter><Suspense fallback={<ScreenLoader />}>
    <Routes>
      <Route element={<PublicLayout />}><Route path="/" element={<Landing />} /><Route path="/about" element={<About />} /><Route path="/how-it-works" element={<HowItWorks />} /><Route path="/fees" element={<Fees />} /><Route path="/faq" element={<FaqPage />} /><Route path="/safety" element={<Safety />} /><Route path="/contact" element={<Contact />} /><Route path="/terms" element={<Terms />} /><Route path="/privacy" element={<Privacy />} /><Route path="/refund-policy" element={<RefundPolicy />} /><Route path="/shipping-policy" element={<ShippingPolicy />} /></Route>
      <Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /><Route path="/reset-password/:token" element={<ResetPassword />} /><Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/invite/:token" element={<Invite />} /><Route path="/moderator/invite/:token" element={<ModeratorInvite />} />
      <Route path="/app" element={<CustomerLayout />}>
        <Route path="home" element={<Home />} /><Route path="discover" element={<Discover />} />
        <Route path="rooms/create" element={<CreateRoom />} /><Route path="rooms/:id" element={<RoomDetails />} />
        <Route path="orders" element={<Orders />} /><Route path="orders/:id" element={<OrderDetails />} /><Route path="orders/:id/refund" element={<RefundRequest />} /><Route path="payment/success" element={<PaymentSuccess />} /><Route path="my-rooms" element={<MyRooms />} /><Route path="wallet" element={<Wallet />} /><Route path="referrals" element={<Referrals />} /><Route path="notifications" element={<Notifications />} /><Route path="settings" element={<Profile />} /><Route path="pay/:id" element={<PayNow />} /><Route path="shipping/:id" element={<ShippingInvoice />} />
      </Route>
      <Route path="/moderator" element={<SidebarLayout title="Moderator" links={modLinks} allow={['MODERATOR']} />}>
        <Route path="dashboard" element={<ModeratorDashboard />} /><Route path="rooms" element={<ModeratorRooms />} /><Route path="rooms/:roomId" element={<ModeratorRoom />} /><Route path="rooms/:roomId/shipping" element={<ShippingManager />} /><Route path="earnings" element={<ModeratorEarnings />} /><Route path="security" element={<ModeratorSecurity />} />
      </Route>
      <Route path="/admin" element={<SidebarLayout title="Admin" links={adminLinks} allow={['ADMIN']} />}>
        <Route path="dashboard" element={<AdminDashboard />} /><Route path="users" element={<AdminUsers />} /><Route path="rooms/:roomId/shipping" element={<ShippingManager />} /><Route path="compensation-rules" element={<AdminCompensationRules />} /><Route path="security" element={<AdminSecurity />} /><Route path="rooms" element={<AdminRooms />} /><Route path="payments" element={<AdminPayments />} /><Route path="moderators" element={<AdminModerators />} /><Route path="compensation" element={<AdminCompensation />} />
        <Route path="refunds" element={<AdminRefunds />} /><Route path="commissions" element={<AdminCommissions />} /><Route path="wallets" element={<AdminWallets />} /><Route path="announcements" element={<AdminAnnouncements />} /><Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes></Suspense></BrowserRouter></QueryClientProvider>);

if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
