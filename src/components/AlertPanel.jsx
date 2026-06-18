import { AlertTriangle, Bot, UserCheck, ArrowRight } from 'lucide-react'
import { STATUS_META } from '../data/departments.js'

// alerts: [{ id, dept, pct, severity: 'critical'|'filling', action, owner: 'Auto'|'Human-approved' }]
export default function AlertPanel({ alerts }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <AlertTriangle size={18} className="text-amber-500" /> Bottleneck alerts
        </h3>
        <span className="chip bg-rose-50 text-rose-700">{alerts.filter((a) => a.severity === 'critical').length} critical</span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {alerts.map((a) => {
          const meta = STATUS_META[a.severity]
          const Owner = a.owner === 'Auto' ? Bot : UserCheck
          return (
            <li key={a.id} className={`rounded-xl ${meta.bg} p-3.5 ring-1 ${meta.ring}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-semibold text-slate-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  {a.dept}
                </p>
                <span className={`text-sm font-bold ${meta.text}`}>{a.pct}% full</span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600">
                <ArrowRight size={14} className="shrink-0 text-slate-400" /> {a.action}
              </p>
              <div className="mt-2.5">
                <span
                  className={`chip ${
                    a.owner === 'Auto' ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Owner size={13} /> {a.owner === 'Auto' ? 'Automated' : 'Human-approved'}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
