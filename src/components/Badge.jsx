const TONES = {
  slate: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-50 text-brand-700',
  rose: 'bg-rose-50 text-rose-700',
  amber: 'bg-amber-50 text-amber-700',
  sky: 'bg-sky-50 text-sky-700',
  violet: 'bg-violet-50 text-violet-700',
  white: 'bg-white/15 text-white backdrop-blur',
}

export default function Badge({ children, tone = 'slate', className = '' }) {
  return <span className={`chip ${TONES[tone] || TONES.slate} ${className}`}>{children}</span>
}
