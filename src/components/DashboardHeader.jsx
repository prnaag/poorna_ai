import { Link } from 'react-router-dom'
import { LayoutDashboard, LineChart, Building2 } from 'lucide-react'
import { hospitalById } from '../data/hospitals.js'
import { FEATURED_HOSPITAL_ID } from '../config.js'

const TABS = [
  { id: 'overview', label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { id: 'forecast', label: '7-day & demand forecast', to: '/dashboard/forecast', icon: LineChart },
]

export default function DashboardHeader({ active }) {
  const h = hospitalById(FEATURED_HOSPITAL_ID)
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${h.hue} text-white shadow-soft`}>
              <Building2 size={22} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">{h.name} · Capacity dashboard</h1>
              <p className="text-sm text-slate-400">{h.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="chip bg-emerald-50 text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <span className="text-slate-400">Thu, 18 Jun 2026 · 11:24</span>
          </div>
        </div>

        <nav className="mt-5 flex gap-1">
          {TABS.map((t) => (
            <Link
              key={t.id}
              to={t.to}
              className={`flex items-center gap-1.5 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                active === t.id
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
