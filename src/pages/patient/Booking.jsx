import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Calendar, Clock, Stethoscope, User, CheckCircle2, ChevronRight, Star,
} from 'lucide-react'
import SlotPicker from '../../components/SlotPicker.jsx'
import InsurancePanel from '../../components/InsurancePanel.jsx'
import { hospitalById, doctorsFor } from '../../data/hospitals.js'
import { deptById } from '../../data/departments.js'
import { insurerById } from '../../data/insurance.js'
import { fmtINR } from '../../config.js'

const ESTIMATES = { cardiology: 48000, oncology: 62000, neurology: 41000, ortho: 38000, emergency: 26000, nephrology: 44000 }

function nextDates(n = 4) {
  const out = []
  const base = new Date('2026-06-18T09:00:00')
  for (let i = 0; i < n; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    out.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
      sub: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    })
  }
  return out
}
const DATES = nextDates()

const seedOf = (s) => s.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

export default function Booking() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const h = hospitalById(id)

  const [dept, setDept] = useState(params.get('dept') || h?.departments[0])
  const doctors = doctorsFor(h?.id || '', dept)
  const [docId, setDocId] = useState(params.get('doc') || doctors[0]?.id)
  const [dateIdx, setDateIdx] = useState(0)
  const [slot, setSlot] = useState(null)
  const [insurer, setInsurer] = useState(h?.insurers[0])
  const [patient, setPatient] = useState({ name: 'Poorna Rao', age: 24, phone: '+91 98xxx 41208' })

  if (!h) return <div className="p-20 text-center">Hospital not found. <Link className="text-brand-700 underline" to="/find">Search</Link></div>

  const currentDoc = doctors.find((d) => d.id === docId) || doctors[0]
  const estimate = ESTIMATES[dept] || 18500

  const changeDept = (v) => { setDept(v); setDocId(doctorsFor(h.id, v)[0].id); setSlot(null) }
  const changeDoc = (v) => { setDocId(v); setSlot(null) }
  const changeDate = (i) => { setDateIdx(i); setSlot(null) }

  const confirm = () => {
    const token = `${h.name.replace(/[^A-Z]/g, '').slice(0, 4) || 'HOSP'}-${deptById(dept).short.toUpperCase()}-${1000 + (seedOf(docId + slot) % 9000)}`
    navigate('/confirm', {
      state: {
        token,
        hospitalId: h.id,
        hospital: h.name,
        dept: deptById(dept).name,
        doctor: currentDoc.name,
        date: `${DATES[dateIdx].label}, ${DATES[dateIdx].sub}`,
        time: slot,
        insurer,
        fee: h.opdFee,
        estimate,
        patient,
      },
    })
  }

  const StepHead = ({ n, title }) => (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">{n}</span>
      <h2 className="font-bold text-slate-900">{title}</h2>
    </div>
  )
  const input = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-brand-400'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to={`/hospital/${h.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700">
        <ArrowLeft size={16} /> Back to {h.name}
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Book an appointment</h1>
      <p className="text-sm text-slate-500">{h.fullName}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="space-y-5">
          <div className="card p-5">
            <StepHead n={1} title="Department & doctor" />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Department</span>
                <select value={dept} onChange={(e) => changeDept(e.target.value)} className={input + ' mt-1.5'}>
                  {h.departments.map((d) => (
                    <option key={d} value={d}>{deptById(d).emoji} {deptById(d).name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Doctor</span>
                <select value={docId} onChange={(e) => changeDoc(e.target.value)} className={input + ' mt-1.5'}>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} · {d.exp} yrs</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="card p-5">
            <StepHead n={2} title="Pick a date" />
            <div className="grid grid-cols-4 gap-2">
              {DATES.map((d, i) => (
                <button
                  key={i}
                  onClick={() => changeDate(i)}
                  className={`rounded-xl border px-3 py-2.5 text-center transition ${
                    dateIdx === i ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <span className="block text-sm font-bold">{d.label}</span>
                  <span className="block text-xs text-slate-400">{d.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <StepHead n={3} title="Choose a time slot" />
            <SlotPicker value={slot} onChange={setSlot} seed={seedOf(docId + dateIdx)} />
          </div>

          <div className="card p-5">
            <StepHead n={4} title="Patient details" />
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</span>
                <input className={input + ' mt-1.5'} value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Age</span>
                <input className={input + ' mt-1.5'} value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} />
              </label>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 size={14} className="text-brand-600" /> Identity & ABHA health ID auto-linked from your Swasth profile.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-5 lg:sticky lg:top-20 lg:h-fit">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900">Booking summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {[
                [Stethoscope, 'Hospital', h.name],
                [User, 'Doctor', `${currentDoc.name}`],
                [Stethoscope, 'Department', deptById(dept).name],
                [Calendar, 'Date', `${DATES[dateIdx].label}, ${DATES[dateIdx].sub}`],
                [Clock, 'Time', slot || <span className="text-amber-600">Select a slot</span>],
              ].map(([Icon, k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-500"><Icon size={15} /> {k}</span>
                  <span className="text-right font-semibold text-slate-800">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
                <span className="text-slate-500">OPD registration</span>
                <span className="font-bold text-slate-900">{fmtINR(h.opdFee)}</span>
              </div>
            </dl>
            <button onClick={confirm} disabled={!slot} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
              Confirm booking <ChevronRight size={16} />
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">Skip the physical queue — arrive at your slot.</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Use insurance</label>
            <select value={insurer} onChange={(e) => setInsurer(e.target.value)} className={input + ' mb-3 mt-1.5'}>
              {h.insurers.map((iId) => (
                <option key={iId} value={iId}>{insurerById(iId).name}</option>
              ))}
            </select>
            <InsurancePanel insurerId={insurer} estimate={estimate} patientName={patient.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
