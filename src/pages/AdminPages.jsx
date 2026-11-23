import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api, naira } from '../api';
import { Card } from '../components2';
import { Skeleton, Empty } from '../components';
const useQ = (key, path) => useQuery({ queryKey: key, queryFn: () => api(path) });
const Err = ({ e }) => <p role="alert" className="text-red-500 text-sm">{e.message}</p>;
const btn = 'px-3 py-1.5 rounded-[10px] text-sm font-semibold';
const day = (rows, key) => (rows || []).map((r) => ({ d: r._id.slice(5), v: key === 'n' ? r.n : r[key] / 100 }));
const Chart = ({ title, children }) => <div className="bg-white border rounded-card p-4"><p className="text-sm font-semibold mb-2">{title}</p><div className="h-48"><ResponsiveContainer>{children}</ResponsiveContainer></div></div>;
const bars = (data, k = 'v', x = 'd') => <BarChart data={data}><XAxis dataKey={x} fontSize={11} /><YAxis fontSize={11} allowDecimals={false} /><Tooltip /><Bar dataKey={k} fill="#10B981" radius={[6, 6, 0, 0]} /></BarChart>;
export function AdminDashboard() {
  const [days, setDays] = useState(30); const { data, error } = useQ(['a-dash'], '/admin/dashboard'); const an = useQ(['a-an', days], `/admin/analytics?days=${days}`);
  if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  const rev = (an.data?.revenue || []).map((r) => ({ d: r._id.slice(5), amount: r.amount / 100, commission: r.commission / 100 }));
  const st = (rows) => (rows || []).map((r) => ({ s: r._id, n: r.n }));
  return (<div className="space-y-4"><div className="flex justify-between items-center"><h1 className="text-xl font-bold">Overview</h1><select value={days} onChange={(e) => setDays(Number(e.target.value))} className="border rounded p-2 text-sm"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3"><Card label="Customers" value={data.customers} /><Card label="Active rooms" value={data.activeRooms} /><Card label="Orders" value={data.orders} /><Card label="Product value" value={naira(data.gross)} /><Card label="Commission" value={naira(data.commission)} /><Card label="Pending refunds" value={data.pendingRefunds} /><Card label="Shipping received" value={naira(data.shippingReceived || 0)} /><Card label="Shipping outstanding" value={naira(data.shippingOutstanding || 0)} /></div>
    {!an.data ? <Skeleton /> : <div className="grid md:grid-cols-2 gap-3">
      <Chart title="Revenue & commission (₦)"><BarChart data={rev}><XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="amount" fill="#064E3B" radius={[6, 6, 0, 0]} /><Bar dataKey="commission" fill="#10B981" radius={[6, 6, 0, 0]} /></BarChart></Chart>
      <Chart title="Orders over time">{bars(day(an.data.orders, 'n'))}</Chart><Chart title="New customers">{bars(day(an.data.signups, 'n'))}</Chart>
      <Chart title="Rooms by status">{bars(st(an.data.rooms), 'n', 's')}</Chart>
      <Chart title="Moderator workload (active rooms)">{bars((an.data.workload || []).map((w) => ({ s: w.name || '—', n: w.n })), 'n', 's')}</Chart><Chart title="Referral conversions">{bars(st(an.data.referrals), 'n', 's')}</Chart></div>}</div>);
}
export function AdminSecurity() {
  const [setup, setSetup] = useState(null); const [msg, setMsg] = useState(''); const m = useQuery({ queryKey: ['a-metrics'], queryFn: () => api('/admin/metrics'), refetchInterval: 10000 });
  const start = () => api('/auth/2fa/setup', { method: 'POST' }).then(setSetup).catch((e) => setMsg(e.message));
  const enable = (e) => { e.preventDefault(); api('/auth/2fa/enable', { method: 'POST', body: { code: e.target.code.value } }).then(() => { setMsg('Two-factor authentication enabled'); setSetup(null); }).catch((x) => setMsg(x.message)); };
  return (<div className="space-y-5"><h1 className="text-xl font-bold">Security & health</h1>
    <section className="bg-white border rounded-card p-4"><h2 className="font-bold">Two-factor authentication</h2><p className="text-sm text-slate-500">Use any authenticator app (Google Authenticator, Authy, Microsoft Authenticator).</p>
      {!setup ? <button onClick={start} className={`${btn} bg-brand text-white mt-3`}>Set up 2FA</button> : <form onSubmit={enable} className="mt-3 space-y-2 text-sm"><p>Add this key in your app (manual entry):</p><code className="block bg-slate-100 rounded p-2 break-all">{setup.secret}</code><p className="text-xs text-slate-500 break-all">{setup.otpauthUrl}</p><input name="code" required placeholder="6-digit code" className="border rounded p-2" /><button className={`${btn} bg-brand text-white ml-2`}>Verify & enable</button></form>}{msg && <p className="text-sm mt-2">{msg}</p>}</section>
    <section><h2 className="font-bold mb-2">Live server metrics (since last restart)</h2>{m.data ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Card label="Requests" value={m.data.requests} /><Card label="5xx errors" value={m.data.errors5xx} /><Card label="p95 latency" value={m.data.latencyMs.p95 + ' ms'} /><Card label="p99 latency" value={m.data.latencyMs.p99 + ' ms'} /><Card label="Event-loop lag" value={m.data.eventLoopLagMs.mean + ' ms'} /><Card label="Memory" value={m.data.memoryMB + ' MB'} /><Card label="Sockets" value={m.data.sockets} /><Card label="Email queue" value={m.data.emailQueue ? `${m.data.emailQueue.waiting} waiting / ${m.data.emailQueue.failed} failed` : 'direct'} /></div> : <Skeleton />}</section></div>);
}
export function AdminCompensationRules() {
  const qc = useQueryClient(); const rules = useQ(['a-rules'], '/admin/compensation/rules'); const mods = useQ(['a-mods'], '/admin/moderators'); const rooms = useQ(['a-rooms'], '/admin/rooms'); const [msg, setMsg] = useState(''); const [type, setType] = useState('PERCENTAGE');
  const save = async (e) => { e.preventDefault(); const f = e.target; const rate = Number(f.rate.value);
    try { await api('/admin/compensation/rules', { method: 'POST', body: { moderatorId: f.mod.value, roomId: f.room.value || undefined, type, rate: type === 'FIXED' ? Math.round(rate * 100) : rate, basis: f.basis.value, effectiveFrom: f.eff.value || undefined } }); setMsg('Rule saved'); qc.invalidateQueries({ queryKey: ['a-rules'] }); } catch (x) { setMsg(x.message); } };
  const preview = type === 'PERCENTAGE' ? 'Example: 5% of ₦100,000 eligible value = ₦5,000' : 'Example: fixed ₦3,000 per completed room = ₦3,000';
  return (<div className="space-y-4"><h1 className="text-xl font-bold">Compensation rules</h1><p className="text-xs text-slate-500">A room-specific rule overrides the moderator's general rule. Rules apply from their effective date. Separate from the 10% platform commission.</p>
    <form onSubmit={save} className="bg-white border rounded-card p-4 grid sm:grid-cols-2 gap-2 text-sm"><select name="mod" required className="border rounded p-2"><option value="">Moderator…</option>{mods.data?.map((m) => <option key={m._id} value={m._id}>{m.fullName}</option>)}</select>
      <select name="room" className="border rounded p-2"><option value="">All rooms (general rule)</option>{rooms.data?.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}</select>
      <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded p-2"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed per room</option></select>
      <input name="rate" type="number" step="0.01" min="0.01" required placeholder={type === 'FIXED' ? '₦ amount' : '% rate'} className="border rounded p-2" />
      <select name="basis" disabled={type === 'FIXED'} className="border rounded p-2"><option value="PRODUCT_VALUE">Eligible product value</option><option value="PAID_ORDER_VALUE">Eligible paid order value</option></select><input name="eff" type="date" className="border rounded p-2" title="Effective date" />
      <p className="sm:col-span-2 text-xs text-slate-500">{preview}</p><button className={`${btn} bg-brand text-white sm:col-span-2`}>Save rule</button>{msg && <p className="sm:col-span-2">{msg}</p>}</form>
    {rules.data?.map((r) => <div key={r._id} className="bg-white border rounded-[14px] p-3 text-sm flex justify-between"><span><b>{r.moderator?.fullName}</b> · {r.room?.name || 'all rooms'}<br /><span className="text-slate-500 num">{r.compensationType === 'FIXED' ? naira(r.rate) : r.rate + '%'} · {r.calculationBasis} · from {new Date(r.effectiveFrom).toLocaleDateString()} · {r.status}</span></span>{r.status === 'ACTIVE' && <button className={`${btn} border`} onClick={() => api(`/admin/compensation/rules/${r._id}/deactivate`, { method: 'PATCH' }).then(() => qc.invalidateQueries({ queryKey: ['a-rules'] }))}>Deactivate</button>}</div>)}</div>);
}
export function AdminUsers() {
  const qc = useQueryClient(); const { data, error } = useQ(['a-users'], '/admin/users'); const [q, setQ] = useState('');
  const toggle = (u) => api(`/admin/users/${u._id}/status`, { method: 'PATCH', body: { status: u.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } }).then(() => qc.invalidateQueries({ queryKey: ['a-users'] }));
  if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  return (<div><h1 className="text-xl font-bold mb-3">Users</h1><input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} className="border rounded-[12px] p-2 mb-3 w-full" />
    {data.filter((u) => (u.fullName + u.email).toLowerCase().includes(q.toLowerCase())).map((u) => <div key={u._id} className="bg-white border rounded-[14px] p-3 mb-2 flex justify-between items-center text-sm"><span><b>{u.fullName}</b> · {u.role}<br /><span className="text-slate-500">{u.email} · {u.accountStatus}</span></span>
      <button onClick={() => toggle(u)} className={`${btn} border`}>{u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Reactivate'}</button></div>)}</div>);
}
export function AdminModerators() {
  const qc = useQueryClient(); const mods = useQ(['a-mods'], '/admin/moderators'); const inv = useQ(['a-inv'], '/admin/moderators/invitations'); const rooms = useQ(['a-rooms'], '/admin/rooms');
  const [email, setEmail] = useState(''); const [msg, setMsg] = useState(''); const [assign, setAssign] = useState({});
  const invite = async (e) => { e.preventDefault(); try { const r = await api('/admin/moderators/invite', { method: 'POST', body: { email } }); setMsg(r.devInviteToken ? `Invite created (dev token: ${r.devInviteToken})` : 'Invitation sent'); qc.invalidateQueries({ queryKey: ['a-inv'] }); } catch (x) { setMsg(x.message); } };
  const doAssign = async (roomId) => { try { await api(`/admin/rooms/${roomId}/assign`, { method: 'POST', body: { moderatorId: assign[roomId] } }); qc.invalidateQueries(); setMsg('Assigned'); } catch (x) { setMsg(x.message); } };
  return (<div className="space-y-6"><h1 className="text-xl font-bold">Moderators</h1>
    <form onSubmit={invite} className="flex gap-2"><input required type="email" placeholder="Moderator email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 border rounded-[12px] p-2" /><button className={`${btn} bg-brand text-white`}>Send invitation</button></form>{msg && <p className="text-sm text-slate-600 break-all">{msg}</p>}
    <section>{mods.data?.map((m) => <div key={m._id} className="bg-white border rounded-[14px] p-3 mb-2 text-sm flex justify-between"><span><b>{m.fullName}</b> · {m.email}</span><span className="num">{m.activeRooms} / {m.maxActiveRooms} rooms</span></div>)}{mods.data?.length === 0 && <Empty text="No moderators yet." />}</section>
    <section><h2 className="font-bold mb-2">Invitations</h2>{inv.data?.map((i) => <div key={i._id} className="flex justify-between text-sm py-1"><span>{i.email} · {i.status}</span>{i.status === 'PENDING' && <button className="text-red-500" onClick={() => api(`/admin/moderators/invitations/${i._id}/revoke`, { method: 'POST' }).then(() => qc.invalidateQueries({ queryKey: ['a-inv'] }))}>Revoke</button>}</div>)}</section>
    <section><h2 className="font-bold mb-2">Assign rooms</h2>{rooms.data?.filter((r) => ['OPEN', 'CLOSED', 'PROCESSING'].includes(r.status)).map((r) => <div key={r._id} className="flex gap-2 items-center text-sm mb-2"><span className="flex-1">{r.name} ({r.status})</span><select className="border rounded p-1" onChange={(e) => setAssign({ ...assign, [r._id]: e.target.value })}><option value="">Moderator…</option>{mods.data?.map((m) => <option key={m._id} value={m._id}>{m.fullName}</option>)}</select><button disabled={!assign[r._id]} onClick={() => doAssign(r._id)} className={`${btn} border disabled:opacity-40`}>Assign</button></div>)}</section></div>);
}
export function AdminCompensation() {
  const qc = useQueryClient(); const { data, error } = useQ(['a-comp'], '/admin/compensation'); const rooms = useQ(['a-rooms'], '/admin/rooms');
  const [f, setF] = useState({ roomId: '', type: 'PERCENTAGE', rate: 5, basis: 'PRODUCT_VALUE' }); const [msg, setMsg] = useState('');
  const calc = async (e) => { e.preventDefault(); try { await api(`/admin/compensation/calculate/${f.roomId}`, { method: 'POST', body: f.useRule ? { useRule: true } : { type: f.type, rate: f.type === 'FIXED' ? Math.round(f.rate * 100) : Number(f.rate), basis: f.basis } }); setMsg('Recorded as pending'); qc.invalidateQueries({ queryKey: ['a-comp'] }); } catch (x) { setMsg(x.message); } };
  const act = async (id, status) => { const payoutReference = status === 'PAID' ? prompt('Payout reference') : undefined; if (status === 'PAID' && !payoutReference) return; await api(`/admin/compensation/${id}`, { method: 'PATCH', body: { status, payoutReference } }); qc.invalidateQueries({ queryKey: ['a-comp'] }); };
  if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  return (<div className="space-y-4"><h1 className="text-xl font-bold">Moderator compensation</h1><p className="text-xs text-slate-500">Separate from the platform's 10% commission.</p>
    <div className="grid grid-cols-3 gap-3"><Card label="Pending" value={naira(data.totals.pending)} /><Card label="Approved" value={naira(data.totals.approved)} /><Card label="Paid" value={naira(data.totals.paid)} /></div>
    <form onSubmit={calc} className="bg-white border rounded-card p-4 grid sm:grid-cols-4 gap-2 text-sm"><select required className="border rounded p-2" onChange={(e) => setF({ ...f, roomId: e.target.value })}><option value="">Room…</option>{rooms.data?.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}</select>
      <select className="border rounded p-2" onChange={(e) => setF({ ...f, type: e.target.value })}><option>PERCENTAGE</option><option>FIXED</option></select>
      <input type="number" step="0.1" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} className="border rounded p-2" title={f.type === 'FIXED' ? 'Naira' : 'Percent'} />
      <select className="border rounded p-2" disabled={f.type === 'FIXED'} onChange={(e) => setF({ ...f, basis: e.target.value })}><option value="PRODUCT_VALUE">Product value</option><option value="PAID_ORDER_VALUE">Paid order value</option></select>
      <label className="sm:col-span-4 flex gap-2"><input type="checkbox" checked={!!f.useRule} onChange={(e) => setF({ ...f, useRule: e.target.checked })} />Use the configured compensation rule (room must be COMPLETED)</label><button className={`${btn} bg-brand text-white sm:col-span-4`}>Calculate & record</button>{msg && <p className="sm:col-span-4">{msg}</p>}</form>
    {data.items.map((c) => <div key={c._id} className="bg-white border rounded-[14px] p-3 text-sm flex justify-between items-center"><span><b>{c.moderator?.fullName}</b> · {c.room?.name}<br /><span className="text-slate-500 num">{c.compensationType} · {c.calculationBasis} · {naira(c.compensationAmount)} · {c.status}{c.payoutReference ? ' · ' + c.payoutReference : ''}</span></span>
      <span className="flex gap-2">{c.status === 'PENDING' && <><button className={`${btn} bg-brand text-white`} onClick={() => act(c._id, 'APPROVED')}>Approve</button><button className={`${btn} border`} onClick={() => act(c._id, 'REVERSED')}>Reverse</button></>}{c.status === 'APPROVED' && <button className={`${btn} bg-brand-dark text-white`} onClick={() => act(c._id, 'PAID')}>Mark paid</button>}</span></div>)}</div>);
}
export function AdminCommissions() {
  const { data, error } = useQ(['a-comm'], '/admin/commissions'); if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  return (<div><h1 className="text-xl font-bold mb-3">Commission</h1><div className="grid grid-cols-3 gap-3"><Card label="Gross" value={naira(data.gross)} /><Card label="Refunded" value={naira(data.refunded)} /><Card label="Net" value={naira(data.net)} /></div></div>);
}
export function AdminSettings() {
  const { data, error } = useQ(['a-set'], '/admin/settings'); const [msg, setMsg] = useState('');
  const fields = [['commissionRate', 'Commission % (future orders only)', 10, 1], ['bufferPercentage', 'Room closing buffer %', 5, 1], ['maxBufferPercentage', 'Max buffer creators may set %', 10, 1], ['referralReward', 'Referral reward (₦)', 500, 0.01]];
  const save = async (key, v, mult) => { try { await api(`/admin/settings/${key}`, { method: 'PUT', body: { value: key === 'referralReward' ? Math.round(v * 100) : Number(v) } }); setMsg('Saved'); } catch (x) { setMsg(x.message); } };
  if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  return (<div className="space-y-3"><h1 className="text-xl font-bold">Platform settings</h1>{fields.map(([k, label, def]) => { const cur = data[k] ?? (k === 'referralReward' ? 50000 : def); return <form key={k} onSubmit={(e) => { e.preventDefault(); save(k, e.target.v.value); }} className="bg-white border rounded-card p-3 flex gap-2 items-end text-sm"><label className="flex-1">{label}<input name="v" type="number" step="any" defaultValue={k === 'referralReward' ? cur / 100 : cur} className="block w-full border rounded p-2 mt-1" /></label><button className={`${btn} bg-brand text-white`}>Save</button></form>; })}{msg && <p className="text-sm">{msg}</p>}</div>);
}
export function AdminWallets() {
  const [uid, setUid] = useState(''); const [d, setD] = useState(null); const [msg, setMsg] = useState(''); const users = useQ(['a-users'], '/admin/users');
  const load = (id) => { setUid(id); id && api(`/admin/wallets/${id}`).then(setD).catch((e) => setMsg(e.message)); };
  const adjust = async (e) => { e.preventDefault(); try { await api(`/admin/wallets/${uid}/adjust`, { method: 'POST', body: { amount: Math.round(e.target.amount.value * 100), reason: e.target.reason.value } }); load(uid); setMsg('Adjustment recorded'); } catch (x) { setMsg(x.message); } };
  return (<div className="space-y-3"><h1 className="text-xl font-bold">Wallets</h1><select className="border rounded p-2 w-full" onChange={(e) => load(e.target.value)}><option value="">Select user…</option>{users.data?.map((u) => <option key={u._id} value={u._id}>{u.fullName} · {u.email}</option>)}</select>
    {d && <><Card label="Balance" value={naira(d.wallet?.availableBalance || 0)} /><form onSubmit={adjust} className="bg-white border rounded-card p-3 flex flex-wrap gap-2 text-sm"><input name="amount" type="number" step="0.01" required placeholder="± ₦ amount" className="border rounded p-2" /><input name="reason" required minLength={5} placeholder="Reason (required)" className="flex-1 border rounded p-2" /><button className={`${btn} bg-brand text-white`}>Apply</button></form>
      {d.transactions.map((t) => <div key={t._id} className="text-sm flex justify-between border-b py-1"><span>{t.description}</span><span className="num">{t.type} {naira(t.amount)}</span></div>)}</>}{msg && <p className="text-sm">{msg}</p>}</div>);
}
export function AdminAnnouncements() {
  const [msg, setMsg] = useState(''); const send = async (e) => { e.preventDefault(); try { const r = await api('/admin/announcements', { method: 'POST', body: { title: e.target.title.value, body: e.target.body.value } }); setMsg(`Queued for ${r.queued} users`); e.target.reset(); } catch (x) { setMsg(x.message); } };
  return <form onSubmit={send} className="space-y-3"><h1 className="text-xl font-bold">Announcements</h1><input name="title" required placeholder="Title" className="w-full border rounded p-2" /><textarea name="body" required placeholder="Message" className="w-full border rounded p-2" rows="4" /><button className={`${btn} bg-brand text-white`}>Send to all users</button>{msg && <p className="text-sm">{msg}</p>}</form>;
}
export function AdminPayments() {
  const { data, error } = useQ(['a-pay'], '/admin/payments'); if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  return (<div><h1 className="text-xl font-bold mb-3">Payments</h1><p className="text-xs text-slate-500 mb-3">Statuses come from verified Paystack data and cannot be edited here.</p>{!data.length && <Empty text="No payments yet." />}
    {data.map((p) => <div key={p._id} className="bg-white border rounded-[14px] p-3 mb-2 text-sm flex justify-between"><span><b>{p.order?.orderReference}</b> · {p.customer?.fullName}<br /><span className="text-slate-500 break-all">{p.providerReference} · {new Date(p.createdAt).toLocaleString()}</span></span><span className="text-right num"><b>{naira(p.amount)}</b><br /><span className={p.status === 'SUCCESS' ? 'text-green-600' : 'text-amber-600'}>{p.status}</span></span></div>)}</div>);
}
export function AdminRooms() {
  const qc = useQueryClient(); const { data, error } = useQ(['a-rooms'], '/admin/rooms'); const [msg, setMsg] = useState('');
  const run = async (fn) => { try { await fn(); setMsg('Done'); qc.invalidateQueries(); } catch (x) { setMsg(x.message); } };
  const shipping = (id) => { const v = prompt('Actual group shipping cost (₦)'); v && run(() => api(`/admin/rooms/${id}/shipping`, { method: 'POST', body: { totalShipping: Math.round(Number(v) * 100) } })); };
  const status = (id, s) => { const reason = prompt(`Reason to mark room ${s} (min 5 chars)`); reason && run(() => api(`/admin/rooms/${id}/status`, { method: 'POST', body: { status: s, reason } })); };
  if (error) return <Err e={error} />; if (!data) return <Skeleton />;
  return (<div><h1 className="text-xl font-bold mb-3">Rooms</h1>{msg && <p className="text-sm mb-2">{msg}</p>}{data.map((r) => <div key={r._id} className="bg-white border rounded-[14px] p-3 mb-2 text-sm"><div className="flex justify-between"><b>{r.name}</b><span>{r.visibility} · {r.status}</span></div><div className="text-slate-500 num">{naira(r.acceptedProductTotal)} / {naira(r.closingThreshold)} · {r.participants.length} members</div>
    <div className="flex gap-2 mt-2">{['CLOSED', 'PROCESSING', 'COMPLETED'].includes(r.status) && <Link className={`${btn} border`} to={`/admin/rooms/${r._id}/shipping`}>Shipping</Link>}{['OPEN', 'CLOSED'].includes(r.status) && <><button className={`${btn} border`} onClick={() => status(r._id, 'CLOSED')}>Close</button><button className={`${btn} border text-red-600`} onClick={() => status(r._id, 'CANCELLED')}>Cancel</button></>}</div></div>)}</div>);
}
