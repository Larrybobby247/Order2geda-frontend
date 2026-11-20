import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Pin, Trash2, Send } from 'lucide-react';
import { api, socket, naira } from '../api';
import { ImageUploader } from '../components2';
const Avatar = ({ u }) => u?.profileImage ? <img src={u.profileImage} alt={u.fullName} loading="lazy" className="w-8 h-8 rounded-full object-cover border-2 border-white" /> : <span title={u?.fullName} className="w-8 h-8 rounded-full bg-brand-mint text-brand-dark text-xs font-bold flex items-center justify-center border-2 border-white">{(u?.fullName || '?')[0]}</span>;
export default function RoomDetails() {
  const { id } = useParams(); const nav = useNavigate(); const qc = useQueryClient(); const end = useRef(null); const lastTyping = useRef(0);
  const [msgs, setMsgs] = useState([]); const [text, setText] = useState(''); const [att, setAtt] = useState(); const [online, setOnline] = useState(0); const [typing, setTyping] = useState(false); const [sock, setSock] = useState(null);
  const [reply, setReply] = useState(null); const [items, setItems] = useState([]); const [p, setP] = useState({ name: '', price: '', quantity: 1 }); const [img, setImg] = useState(); const [err, setErr] = useState(''); const [accept, setAccept] = useState(false);
  const room = useQuery({ queryKey: ['room', id], queryFn: () => api(`/rooms/${id}`) });
  const mem = useQuery({ queryKey: ['members', id], queryFn: () => api(`/rooms/${id}/members`), retry: false });
  const mine = useQuery({ queryKey: ['mine', id], queryFn: () => api(`/rooms/${id}/products/mine`), enabled: !!mem.data });
  const me = useQuery({ queryKey: ['me'], queryFn: () => api('/auth/me'), staleTime: 600000 }).data;
  const joined = !!mem.data;
  useEffect(() => {
    if (!joined) return; const s = socket(); setSock(s); let t;
    s.emit('room:join', id, (r) => { if (r?.ok) api(`/rooms/${id}/messages`).then((m) => { setMsgs(m); api(`/rooms/${id}/read`, { method: 'POST' }).catch(() => {}); }).catch(() => {}); });
    s.on('message:new', (m) => { setMsgs((x) => [...x, m]); api(`/rooms/${id}/read`, { method: 'POST' }).catch(() => {}); }); s.on('message:deleted', ({ id: d }) => setMsgs((x) => x.filter((m) => m._id !== d)));
    s.on('message:pinned', ({ id: d, pinned }) => setMsgs((x) => x.map((m) => (m._id === d ? { ...m, pinned } : m)))); s.on('presence:update', (e) => setOnline(e.online));
    s.on('message:typing', () => { setTyping(true); clearTimeout(t); t = setTimeout(() => setTyping(false), 2000); });
    ['room:progress-updated', 'room:closed', 'room:member-joined'].forEach((e) => s.on(e, () => { qc.invalidateQueries({ queryKey: ['room', id] }); qc.invalidateQueries({ queryKey: ['members', id] }); }));
    s.on('reconnect', () => s.emit('room:join', id)); return () => { clearTimeout(t); s.disconnect(); };
  }, [id, joined]);
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [msgs.length]);
  if (room.error) return <p className="text-red-500">{room.error.message}</p>; if (!room.data) return <div className="h-40 rounded-card bg-slate-200 animate-pulse" />;
  const r = room.data; const open = r.status === 'OPEN'; const pct = Math.min(100, Math.round((r.acceptedProductTotal / r.closingThreshold) * 100)); const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const refresh = () => { qc.invalidateQueries({ queryKey: ['room', id] }); qc.invalidateQueries({ queryKey: ['members', id] }); qc.invalidateQueries({ queryKey: ['mine', id] }); };
  const act = (fn) => fn().then(() => { setErr(''); refresh(); }).catch((e) => setErr(e.message));
  const send = (e) => { e.preventDefault(); if (!text.trim() && !att) return; sock?.emit('message:new', { roomId: id, content: text, attachments: att ? [att] : [], replyTo: reply?._id }); setText(''); setAtt(undefined); setReply(null); };
  const onType = (v) => { setText(v); if (Date.now() - lastTyping.current > 1200) { lastTyping.current = Date.now(); sock?.emit('message:typing', id); } };
  const pinned = msgs.filter((m) => m.pinned);
  return (<div className="space-y-4">
    <div className="bg-white rounded-card border p-5"><div className="flex justify-between gap-2"><h1 className="font-bold text-xl">{r.name}</h1><span className={`text-xs px-2 py-1 rounded-full h-fit ${open ? 'bg-brand-mint text-brand-dark' : 'bg-amber-100 text-amber-800'}`}>{r.status}</span></div>
      <p className="text-sm text-slate-500">{r.shoppingPlatform} · {r.visibility}</p>
      <div className="mt-3 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-brand transition-all duration-700" style={{ width: pct + '%' }} /></div>
      <p className="text-sm mt-2 num">{naira(r.acceptedProductTotal)} of {naira(r.closingThreshold)} ({pct}%) · target {naira(r.targetAmount)} · {naira(Math.max(0, r.closingThreshold - r.acceptedProductTotal))} to go</p>
      <p className="text-xs text-slate-400 mt-1">The room closes automatically when accepted products reach {naira(r.closingThreshold)} (target + {r.bufferPercentage}% buffer).</p>
      {mem.data && <div className="mt-3 flex items-center"><div className="flex -space-x-2">{mem.data.members.slice(0, 8).map((u) => <Avatar key={u._id} u={u} />)}</div><span className="text-xs text-slate-500 ml-3">{mem.data.members.length} members{mem.data.moderator ? ` · moderator ${mem.data.moderator.fullName}` : ' · no moderator yet'}</span></div>}
      {!open && <p className="mt-3 rounded-[12px] bg-amber-50 text-amber-800 p-3 text-sm">This room is {r.status.toLowerCase()}: joining and product changes are disabled.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {!joined && open && r.visibility === 'PUBLIC' && <button onClick={() => act(() => api(`/rooms/${id}/join`, { method: 'POST' }))} className="px-4 py-2 rounded-[14px] bg-brand text-white font-semibold">Join Room</button>}
        {joined && open && me && mem.data.creator !== me._id && <button onClick={() => confirm('Leave this room?') && act(() => api(`/rooms/${id}/leave`, { method: 'POST' }).then(() => nav('/app/discover')))} className="px-4 py-2 rounded-[14px] border text-sm">Leave</button>}</div>
      {err && <p role="alert" className="text-red-500 text-sm mt-2">{err}</p>}</div>
    {joined && !open && <div className="bg-white rounded-card border p-5"><h2 className="font-bold">Checkout</h2><p className="text-sm text-slate-500 mt-1">Commission (10%) and your shared shipping are calculated by the server.</p>
      <label className="flex gap-2 text-sm mt-3"><input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />I accept the purchasing, shipping and refund policies.</label>
      <button disabled={!accept} onClick={() => act(() => api(`/orders/checkout/${id}`, { method: 'POST', body: { acceptPolicies: true } }).then(() => nav('/app/orders')))} className="mt-3 w-full py-3 rounded-[14px] bg-brand text-white font-bold disabled:opacity-40">Review order & pay</button></div>}
    {joined && open && <div className="bg-white rounded-card border p-5"><h2 className="font-bold">Add products</h2><div className="grid grid-cols-3 gap-2 mt-2">
      <input placeholder="Name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="border rounded-[12px] p-2" /><input placeholder="₦ price" type="number" min="1" value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} className="border rounded-[12px] p-2" /><input type="number" min="1" value={p.quantity} onChange={(e) => setP({ ...p, quantity: e.target.value })} className="border rounded-[12px] p-2" /></div><ImageUploader onUploaded={setImg} />
      <button onClick={() => p.name && p.price > 0 && (setItems([...items, { name: p.name, price: Math.round(p.price * 100), quantity: Math.max(1, Number(p.quantity)), ...(img && { image: img }) }]), setP({ name: '', price: '', quantity: 1 }))} className="mt-2 px-3 py-2 rounded-[12px] bg-brand-mint text-brand-dark font-semibold">Add to list</button>
      {items.map((i, k) => <div key={k} className="flex justify-between text-sm mt-2 num"><span>{i.name} × {i.quantity}</span><span>{naira(i.price * i.quantity)} <button aria-label="Remove" className="text-red-500 ml-2" onClick={() => setItems(items.filter((_, j) => j !== k))}>✕</button></span></div>)}
      {items.length > 0 && <><p className="font-bold mt-3 num">Subtotal {naira(subtotal)}</p><button onClick={() => act(() => api(`/rooms/${id}/products`, { method: 'POST', body: { items } }).then(() => setItems([])))} className="mt-2 w-full py-3 rounded-[14px] bg-brand text-white font-bold">Submit products</button></>}</div>}
    {joined && mine.data?.length > 0 && <div className="bg-white rounded-card border p-5"><h2 className="font-bold mb-2">My products</h2>{mine.data.map((x) => <MyProductRow key={x._id} x={x} open={open} act={act} />)}{!open && <p className="text-xs text-slate-400 mt-2">Products are read-only because the room has closed.</p>}</div>}
    {joined && <div className="bg-slate-900 text-white rounded-card p-4"><div className="flex justify-between items-center mb-2"><h2 className="font-bold">Room chat</h2><span className="text-xs text-emerald-300">● {online} online</span></div>
      {pinned.map((m) => <div key={m._id} className="flex gap-2 text-xs bg-white/10 rounded-[10px] p-2 mb-1"><Pin size={14} className="shrink-0 text-brand-gold" />{m.content}</div>)}
      <div className="h-64 overflow-y-auto space-y-2 text-sm mt-1">{msgs.length === 0 && <p className="text-slate-400">No messages yet. Say hello 👋</p>}{msgs.map((m) => m.messageType === 'SYSTEM' ? <p key={m._id} className="text-center text-xs text-slate-400">{m.content}</p> :
        <div key={m._id} className={`flex gap-2 ${m.messageType === 'ANNOUNCEMENT' ? 'bg-amber-400/20 rounded-[10px] p-2' : ''}`}><Avatar u={m.sender} /><div className="min-w-0 flex-1"><b className="text-brand">{m.sender?.fullName || 'Member'}</b>{m.sender?.role === 'MODERATOR' && <span className="ml-1 text-[10px] bg-brand text-white px-1 rounded">MOD</span>} <span className="text-[10px] text-slate-500">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {m.replyTo && <p className="text-xs border-l-2 border-brand pl-2 text-slate-400 truncate">{m.replyTo.content}</p>}{m.content && <p className="break-words">{m.content}</p>}<LinkPreview roomId={id} text={m.content} />{m.attachments?.map((a) => <img key={a} src={a} alt="Attachment" loading="lazy" className="mt-1 max-h-40 rounded-[10px]" />)}<button className="text-[10px] text-slate-400 hover:text-white" onClick={() => setReply(m)}>Reply</button></div>
          {(m.sender?._id === me?._id || ['MODERATOR', 'ADMIN'].includes(me?.role)) && <button aria-label="Delete message" className="text-slate-500 hover:text-red-400 self-start" onClick={() => api(`/messages/${m._id}`, { method: 'DELETE' }).catch(() => {})}><Trash2 size={14} /></button>}</div>)}<div ref={end} /></div>
      <div className="h-4 text-xs text-slate-400">{typing && 'Someone is typing…'}</div>{reply && <div className="flex justify-between text-xs bg-white/10 rounded-[10px] p-2 mb-1"><span className="truncate">Replying to: {reply.content || 'attachment'}</span><button aria-label="Cancel reply" onClick={() => setReply(null)}>✕</button></div>}
      <form className="flex gap-2 items-center" onSubmit={send}><input value={text} onChange={(e) => onType(e.target.value)} className="flex-1 rounded-[12px] p-2 text-ink" placeholder="Message" maxLength={2000} /><button aria-label="Send" className="p-2.5 rounded-[12px] bg-brand"><Send size={18} /></button></form>
      <div className="text-slate-300 text-xs [&_input]:text-xs"><ImageUploader kind="chat" onUploaded={setAtt} /></div></div>}</div>);
}

function LinkPreview({ roomId, text }) {
  const url = (text || '').match(/https:\/\/[^\s<>"']+/)?.[0];
  const { data } = useQuery({ queryKey: ['lp', url], queryFn: () => api(`/rooms/${roomId}/link-preview?url=${encodeURIComponent(url)}`), enabled: !!url, retry: false, staleTime: 3600000 });
  if (!url || !data?.title) return null;
  return <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 flex gap-2 bg-white/10 rounded-[10px] overflow-hidden max-w-xs">{data.image && <img src={data.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="w-16 h-16 object-cover" />}<span className="p-2 min-w-0"><b className="block text-xs truncate">{data.title}</b><span className="text-[10px] text-slate-400">{data.host}</span></span></a>;
}
function MyProductRow({ x, open, act }) {
  const [edit, setEdit] = useState(false); const [f, setF] = useState({ name: x.name, price: x.price / 100, quantity: x.quantity });
  const save = () => act(() => api(`/rooms/products/${x._id}`, { method: 'PATCH', body: { name: f.name, price: Math.round(f.price * 100), quantity: Number(f.quantity) } }).then(() => setEdit(false)));
  if (edit) return <div className="grid grid-cols-4 gap-1 py-1 text-sm"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="border rounded p-1 col-span-2" /><input type="number" min="1" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} className="border rounded p-1" /><input type="number" min="1" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className="border rounded p-1" /><button onClick={save} className="col-span-2 bg-brand text-white rounded p-1">Save</button><button onClick={() => setEdit(false)} className="col-span-2 border rounded p-1">Cancel</button></div>;
  return <div className={`flex justify-between text-sm py-1 num ${x.status === 'CANCELLED' ? 'line-through text-slate-400' : ''}`}><span>{x.name} × {x.quantity} <span className="text-xs text-slate-400">{x.verificationStatus}</span></span><span>{naira(x.price * x.quantity)} {open && x.status === 'ACTIVE' && <><button className="text-brand ml-2 text-xs" onClick={() => setEdit(true)}>Edit</button><button aria-label="Delete" className="text-red-500 ml-2" onClick={() => act(() => api(`/rooms/products/${x._id}`, { method: 'DELETE' }))}>✕</button></>}</span></div>;
}
