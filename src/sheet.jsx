import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
// Bottom sheet on phones, centred modal on larger screens.
export function Sheet({ open, onClose, title, subtitle, children, footer }) {
  useEffect(() => { if (!open) return; const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', k); }; }, [open]);
  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}><div className="absolute inset-0 bg-black/60 backdrop" onClick={onClose} />
    <div className="sheet relative w-full sm:max-w-lg max-h-[92dvh] flex flex-col bg-white text-ink rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden">
      <div className="shrink-0 pt-2.5 pb-3 px-5 border-b border-slate-100"><div className="sm:hidden mx-auto w-10 h-1.5 rounded-full bg-slate-200 mb-3" /><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-extrabold text-brand-deep leading-tight">{title}</h2>{subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}</div><button onClick={onClose} aria-label="Close" className="shrink-0 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"><X size={18} /></button></div></div>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {footer && <div className="shrink-0 border-t bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}</div></div>, document.body);
}
