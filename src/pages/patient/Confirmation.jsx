import { useLocation, Link } from 'react-router-dom'
import {
  CheckCircle2, Calendar, Clock, Stethoscope, User, ShieldCheck, MapPin,
  CalendarPlus, Navigation, ArrowRight, Ticket,
} from 'lucide-react'
import { insurerById } from '../../data/insurance.js'
import { fmtINR } from '../../config.js'

const FALLBACK = {
  token: 'AIIMS-CARD-4821', hospital: 'AIIMS Delhi', hospitalId: 'aiims-delhi', dept: 'Cardiology',
  doctor: 'Dr. Aarav Sharma', date: 'Today, 18 Jun', time: '10:20', insurer: 'cghs', fee: 10,
  estimate: 48000, patient: { name: 'Poorna Rao' },
}

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 131 + str.charCodeAt(i)) >>> 0
  return h
}

function QrCode({ seed, n = 11 }) {
  const cells = []
  for (let i = 0; i < n * n; i++) cells.push(hash(seed + ':' + i) % 100 < 47)
  const isFinder = (r, c) =>
    (r < 3 && c < 3) || (r < 3 && c >= n - 3) || (r >= n - 3 && c < 3)
  return (
    <div className="grid gap-[2px] rounded-xl bg-white p-3 shadow-soft ring-1 ring-slate-200" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
      {cells.map((on, i) => {
        const r = Math.floor(i / n), c = i % n
        const finder = isFinder(r, c)
        return <span key={i} className={`h-3 w-3 rounded-[2px] ${finder ? 'bg-slate-900' : on ? 'bg-slate-800' : 'bg-transparent'}`} />
      })}
    </div>
  )
}

export default function Confirmation() {
  const { state } = useLocation()
  const b = state || FALLBACK
  const ins = insurerById(b.insurer)
  const isGovt = ins?.kind === 'govt'
  const patientShare = b.estimate ? b.estimate - Math.round((b.estimate * (isGovt ? 100 : 90)) / 100) : 0

  const Line = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-2 text-sm text-slate-500"><Icon size={15} /> {label}</span>
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Success header */}
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-brand-700">
          <CheckCircle2 size={36} />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Booking confirmed</h1>
        <p className="mt-1 text-slate-500">
          Your slot is reserved — <span className="font-semibold text-slate-700">skip the queue</span> and arrive at your time.
        </p>
      </div>

      <div className="card mt-8 overflow-hidden">
        {/* Ticket header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Ticket size={18} />
            <span className="font-semibold">Appointment token</span>
          </div>
          <span className="rounded-lg bg-white/15 px-3 py-1 font-mono text-lg font-bold tracking-wider">{b.token}</span>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto]">
          <div>
            <Line icon={Stethoscope} label="Hospital" value={b.hospital} />
            <Line icon={User} label="Doctor" value={b.doctor} />
            <Line icon={Stethoscope} label="Department" value={b.dept} />
            <Line icon={Calendar} label="Date" value={b.date} />
            <Line icon={Clock} label="Time" value={b.time} />
            <Line icon={User} label="Patient" value={b.patient?.name} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <QrCode seed={b.token} />
            <p className="mt-2 text-xs text-slate-400">Show at the help desk</p>
          </div>
        </div>

        {/* Insurance status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-brand-50/60 px-6 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
            <ShieldCheck size={18} /> {ins?.name} — cashless claim pre-filed & approved
          </p>
          <p className="text-sm text-slate-600">
            You pay <span className="font-bold text-slate-900">{fmtINR(patientShare)}</span>
            {isGovt && <span className="text-slate-400"> (fully covered)</span>}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button className="btn-ghost"><CalendarPlus size={16} /> Add to calendar</button>
        <Link to={`/hospital/${b.hospitalId || 'aiims-delhi'}`} className="btn-ghost"><Navigation size={16} /> Get directions</Link>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-brand-700">← Back to home</Link>
        <Link to="/dashboard" className="btn-primary">
          See the hospital capacity view <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
