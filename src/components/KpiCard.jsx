const TONES = {
  brand: { ring: 'ring-brand-100', icon: 'bg-brand-50 text-brand-600' },
  rose: { ring: 'ring-rose-100', icon: 'bg-rose-50 text-rose-600' },
  amber: { ring: 'ring-amber-100', icon: 'bg-amber-50 text-amber-600' },
  sky: { ring: 'ring-sky-100', icon: 'bg-sky-50 text-sky-600' },
  slate: { ring: 'ring-slate-100', icon: 'bg-slate-100 text-slate-600' },
}

export default function KpiCard({ icon: Icon, label, value, sub, tone = 'brand', footer }) {
  const t = TONES[tone] || TONES.brand
  return (
    <div className={`card p-5 ring-1 ${t.ring}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {sub && <p className="mt-0.5 text-sm text-slate-400">{sub}</p>}
        </div>
        {Icon && (
          <span className={`grid h-11 w-11 place-items-center rounded-xl ${t.icon}`}>
            <Icon size={22} />
          </span>
        )}
      </div>
      {footer && <div className="mt-3 border-t border-slate-100 pt-3 text-sm">{footer}</div>}
    </div>
  )
}
