import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Phone, Star, Clock, CalendarCheck, BedDouble, ShieldCheck,
  Stethoscope, ChevronRight, Ambulance, Navigation,
} from 'lucide-react'
import Badge from '../../components/Badge.jsx'
import { hospitalById, doctorsFor, COST_BANDS } from '../../data/hospitals.js'
import { deptById } from '../../data/departments.js'
import { insurerById } from '../../data/insurance.js'
import { statusOf, STATUS_META } from '../../data/departments.js'

const TYPE_TONE = { Government: 'brand', Private: 'sky', Trust: 'violet' }

export default function HospitalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const h = hospitalById(id)
  const [dept, setDept] = useState(h?.departments[0])

  if (!h) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-slate-700">Hospital not found.</p>
        <Link to="/find" className="btn-primary mt-4 inline-flex">Back to search</Link>
      </div>
    )
  }

  const doctors = doctorsFor(h.id, dept)
  const occ = STATUS_META[statusOf(h.occupancyPct)]

  const Stat = ({ icon: Icon, label, value, accent }) => (
    <div className="card flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-50 text-slate-500"><Icon size={18} /></span>
      <div>
        <p className={`text-lg font-extrabold ${accent || 'text-slate-900'}`}>{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  )

  return (
    <div>
      {/* Banner */}
      <div className={`bg-gradient-to-br ${h.hue} text-white`}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Link to="/find" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft size={16} /> Back to results
          </Link>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">{h.name}</h1>
                <Badge tone="white">{h.type}</Badge>
                {h.emergency24x7 && <Badge tone="white"><Ambulance size={13} /> 24×7 Emergency</Badge>}
              </div>
              <p className="mt-1 text-white/85">{h.fullName}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
                <span className="flex items-center gap-1"><Star size={14} className="fill-amber-300 text-amber-300" /> {h.rating}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {h.area} · {h.distanceKm} km</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {h.phone}</span>
              </p>
            </div>
            <button onClick={() => navigate(`/book/${h.id}?dept=${dept}`)} className="btn bg-white px-5 py-3 text-slate-900 hover:bg-slate-100">
              <CalendarCheck size={18} /> Book appointment
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat icon={Clock} label="Estimated wait" value={`${h.expectedWaitMin} min`} accent={h.expectedWaitMin <= 30 ? 'text-brand-700' : undefined} />
          <Stat icon={CalendarCheck} label="Free slots today" value={h.freeSlotsToday} />
          <Stat icon={BedDouble} label="Occupancy" value={`${h.occupancyPct}%`} accent={occ.text} />
          <Stat icon={Stethoscope} label="OPD fee from" value={`₹${h.opdFee}`} />
          <Stat icon={BedDouble} label="Total beds" value={h.beds.toLocaleString('en-IN')} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div>
            <h2 className="text-lg font-bold text-slate-900">Choose a department</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {h.departments.map((dId) => {
                const d = deptById(dId)
                const active = dept === dId
                return (
                  <button
                    key={dId}
                    onClick={() => setDept(dId)}
                    className={`chip text-sm ${active ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300'}`}
                  >
                    <span>{d.emoji}</span> {d.name}
                  </button>
                )
              })}
            </div>

            <h2 className="mt-8 text-lg font-bold text-slate-900">
              Doctors in {deptById(dept)?.name}
            </h2>
            <div className="mt-3 space-y-3">
              {doctors.map((doc) => (
                <div key={doc.id} className="card flex items-center gap-4 p-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 font-bold text-brand-700">
                    {doc.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{doc.name}</p>
                    <p className="text-sm text-slate-500">
                      {deptById(dept)?.name} · {doc.exp} yrs exp ·{' '}
                      <span className="inline-flex items-center gap-0.5"><Star size={12} className="fill-amber-400 text-amber-400" /> {doc.rating}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Next slot</p>
                    <p className="font-semibold text-brand-700">{doc.nextSlot}</p>
                  </div>
                  <button onClick={() => navigate(`/book/${h.id}?dept=${dept}&doc=${doc.id}`)} className="btn-primary">
                    Book <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck size={18} className="text-brand-600" /> Cashless insurance
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {h.insurers.map((iId) => (
                  <span key={iId} className="chip bg-slate-100 text-slate-700">{insurerById(iId)?.name}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">Claims pre-filled from your ABHA record at booking.</p>
            </div>

            <div className="card overflow-hidden">
              <div className="relative grid h-40 place-items-center bg-[linear-gradient(135deg,#e6f7ef_25%,transparent_25%,transparent_50%,#e6f7ef_50%,#e6f7ef_75%,transparent_75%)] bg-[length:24px_24px]">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-card">
                  <MapPin size={22} />
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-800">{h.address}</p>
                <button className="btn-ghost mt-3 w-full">
                  <Navigation size={16} /> Get directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
