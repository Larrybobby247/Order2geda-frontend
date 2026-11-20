import { io } from 'socket.io-client';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const token = { get: () => localStorage.getItem('o2g_token'), set: (t) => localStorage.setItem('o2g_token', t), clear: () => localStorage.removeItem('o2g_token') };
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(token.get() && { Authorization: `Bearer ${token.get()}` }) }, body: body && JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
export const socket = () => io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { auth: { token: token.get() } });
export const naira = (kobo) => '₦' + (kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 0 });
