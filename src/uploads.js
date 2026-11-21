import { api } from './api';
// Signed direct upload to Cloudinary. No `capture` attribute is used by callers, so phones offer gallery, files and camera.
export async function uploadImage(file, kind = 'product') {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file');
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be under 8MB');
  const s = await api(`/uploads/sign?kind=${kind}`); const fd = new FormData();
  Object.entries({ file, api_key: s.apiKey, timestamp: s.timestamp, folder: s.folder, signature: s.signature }).forEach(([k, v]) => fd.append(k, v));
  const r = await (await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: 'POST', body: fd })).json();
  if (!r.secure_url) throw new Error(r.error?.message || 'Upload failed. Is Cloudinary configured on the server?');
  return r.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_900/');
}
