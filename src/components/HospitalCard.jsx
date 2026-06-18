import { Link } from 'react-router-dom'
import { MapPin, Clock, CalendarCheck, Star, BedDouble, ShieldCheck, ChevronRight, Check } from 'lucide-react'
import Badge from './Badge.jsx'
import { COST_BANDS } from '../data/hospitals.js'
import { insurerById } from '../data/insurance.js'
import { statusOf, STATUS_META } from '../data/departments.js'

const TYPE_TONE = { Government: 'brand', Private: 'sky', Trust: 'violet' }

function Metric({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={17} />
      </span>
      <div className="leading-tight">
        <p className={`text-sm font-bold ${accent || 'text-slate-800'}`}>{value}</p>
        <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      </div>
    </div>
  )
}

export default function HospitalCard({ hospital: h, rank, reasons = [] }) {
  const initials = h.name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  const occStatus = STATUS_META[statusOf(h.occupancyPct)]

  return (
    <div className="card overflow-hidden transition hover:shadow-lg">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {/* Identity */}
        <div className="flex flex-1 items-start gap-4">
          <div className={`relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${h.hue} text-lg font-extrabold text-white shadow-soft`}>
            {initials}
            {rank && (
              <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-extrabold text-slate-700 shadow">
                {rank}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{h.name}</h3>
              <Badge tone={TYPE_TONE[h.type]}>{h.type}</Badge>
              <span className="chip bg-amber-50 text-amber-700">
                <Star size={13} className="fill-amber-400 text-amber-400" /> {h.rating}
              </span>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={14} /> {h.area} · {h.distanceKm} km away
            </p>
            {reasons.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {reasons.map((r) => (
                  <span key={r} className="chip bg-brand-50 text-brand-700">
                    <Check size={12} /> {r}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:gap-x-8">
          <Metric icon={Clock} label="Est. wait" value={`${h.expectedWaitMin} min`} accent={h.expectedWaitMin <= 30 ? 'text-brand-700' : 'text-slate-800'} />
          <Metric icon={CalendarCheck} label="Free slots" value={`${h.freeSlotsToday} today`} />
          <Metric icon={BedDouble} label="Occupancy" value={`${h.occupancyPct}%`} accent={occStatus.text} />
        </div>

        {/* CTA */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-40">
          <div className="text-right">
            <p className="text-xs text-slate-400">OPD fee from</p>
            <p className="text-lg font-extrabold text-slate-900">
              ₹{h.opdFee} <span className="text-sm font-semibold text-slate-400">{COST_BANDS[h.costBand]}</span>
            </p>
          </div>
          <Link to={`/hospital/${h.id}`} className="btn-primary w-full">
            View & book <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Insurers */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-2.5">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          <ShieldCheck size={14} className="text-brand-600" /> Cashless:
        </span>
        {h.insurers.map((id) => (
          <span key={id} className="chip bg-white text-slate-600 ring-1 ring-slate-200">
            {insurerById(id)?.name}
          </span>
        ))}
      </div>
    </div>
  )
}
