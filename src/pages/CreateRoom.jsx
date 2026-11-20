import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, naira } from '../api';
export default function CreateRoom() {
  const [f, setF] = useState({ name: '', shoppingPlatform: 'Temu', targetNaira: 30000, visibility: 'PUBLIC', description: '' }); const [err, setErr] = useState(''); const nav = useNavigate(); const [invite, setInvite] = useState(null);
  const target = Math.round(f.targetNaira * 100), threshold = target + Math.round(target * 0.05);
  async function submit(e) {
    e.preventDefault(); setErr('');
    try { const { room, inviteToken } = await api('/rooms', { method: 'POST', body: { name: f.name, shoppingPlatform: f.shoppingPlatform, description: f.description, visibility: f.visibility, targetAmount: target } });
      if (inviteToken) setInvite({ id: room._id, link: `${location.origin}/invite/${inviteToken}` }); else nav(`/app/rooms/${room._id}`); } catch (x) { setErr(x.message); }
  }
  if (invite) return <div className="bg-white rounded-card border p-5"><p className="font-bold">Private room created</p><p className="break-all text-sm mt-2">{invite.link}</p><button className="mt-3 px-4 py-2 rounded-[14px] bg-brand text-white" onClick={() => { navigator.clipboard.writeText(invite.link); nav(`/app/rooms/${invite.id}`); }}>Copy link & open room</button></div>;
  const inp = 'mt-1 w-full rounded-[12px] border p-3';
  return (<form onSubmit={submit} className="bg-white rounded-card border p-5 space-y-3"><h1 className="font-bold text-xl">Create a shopping room</h1>
    <label className="block text-sm">Room name<input required minLength={3} className={inp} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
    <label className="block text-sm">Platform<select className={inp} onChange={(e) => setF({ ...f, shoppingPlatform: e.target.value })}>{['Temu', 'Shein', 'AliExpress', 'Other'].map((p) => <option key={p}>{p}</option>)}</select></label>
    <label className="block text-sm">Target (₦)<input type="number" min="1000" value={f.targetNaira} className={inp} onChange={(e) => setF({ ...f, targetNaira: Number(e.target.value) })} /></label>
    <p className="text-xs text-slate-500">Your room closes automatically when accepted products reach {naira(threshold)} (target + 5% buffer).</p>
    <label className="block text-sm">Visibility<select className={inp} onChange={(e) => setF({ ...f, visibility: e.target.value })}><option>PUBLIC</option><option>PRIVATE</option></select></label>
    {err && <p role="alert" className="text-red-500 text-sm">{err}</p>}<button className="w-full py-3 rounded-[14px] bg-brand text-white font-bold">Create Room</button></form>);
}
