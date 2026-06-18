import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, ArrowRight, Clock, CalendarCheck, ShieldCheck, Star,
  Stethoscope, LayoutDashboard, TrendingUp, BedDouble,
} from 'lucide-react'
import { BRAND } from '../../config.js'
import { DEPARTMENTS } from '../../data/departments.js'

const TRUST = [
  { value: '79.9 cr', label: 'ABHA health IDs created' },
  { value: '4 lakh+', label: 'registered facilities' },
  { value: '~63%', label: 'health bills paid out-of-pocket' },
  { value: '~85%', label: 'average bed occupancy' },
]

const STEPS = [
  { icon: Search, title: 'Search', text: 'Tell us your symptom or department and where you are.' },
  { icon: TrendingUp, title: 'Compare live', text: 'See nearby hospitals ranked by wait, free slots, cost & insurance.' },
  { icon: CalendarCheck, title: 'Book & skip the queue', text: 'Reserve a slot in advance with your insurance claim pre-filled.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [dept, setDept] = useState('all')
  const [loc, setLoc] = useState('South Delhi')

  const search = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (dept !== 'all') params.set('dept', dept)
    if (loc) params.set('loc', loc)
    navigate(`/find?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-700 to-emerald-800 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="chip bg-white/15 text-white">
              <ShieldCheck size={14} /> Built on India's ABDM digital health stack
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {BRAND.tagline}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">{BRAND.blurb}</p>

            {/* Search card */}
            <form onSubmit={search} className="mt-7 rounded-2xl bg-white p-3 shadow-card sm:flex sm:items-end sm:gap-3">
              <label className="block flex-1 px-2 py-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Symptom / department</span>
                <div className="mt-1 flex items-center gap-2">
                  <Stethoscope size={18} className="text-brand-600" />
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none"
                  >
                    <option value="all">Any department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </label>
              <div className="hidden h-10 w-px bg-slate-200 sm:block" />
              <label className="block flex-1 px-2 py-1 text-left">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</span>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-600" />
                  <input
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none"
                    placeholder="Your area"
                  />
                </div>
              </label>
              <button type="submit" className="btn-primary mt-3 w-full sm:mt-0 sm:w-auto">
                <Search size={18} /> Find hospitals
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {['cardiology', 'emergency', 'pediatrics', 'ortho'].map((id) => {
                const d = DEPARTMENTS.find((x) => x.id === id)
                return (
                  <button
                    key={id}
                    onClick={() => navigate(`/find?dept=${id}`)}
                    className="chip bg-white/10 text-white transition hover:bg-white/20"
                  >
                    {d.emoji} {d.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* App preview */}
          <div className="relative hidden lg:block">
            <div className="ml-auto max-w-sm rotate-1 rounded-3xl bg-white p-4 text-slate-800 shadow-2xl">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-slate-900">Nearby · Cardiology</p>
                <span className="chip bg-brand-50 text-brand-700">3 open now</span>
              </div>
              {[
                { n: 'Max Saket', w: '18 min', s: 26, c: '₹₹₹', tone: 'from-sky-600 to-indigo-700' },
                { n: 'Sir Ganga Ram', w: '30 min', s: 17, c: '₹₹', tone: 'from-teal-600 to-emerald-700' },
                { n: 'AIIMS Delhi', w: '95 min', s: 12, c: '₹', tone: 'from-brand-600 to-brand-800' },
              ].map((h, i) => (
                <div key={h.n} className={`mt-2 flex items-center gap-3 rounded-2xl border border-slate-100 p-3 ${i === 0 ? 'ring-2 ring-brand-200' : ''}`}>
                  <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${h.tone} text-sm font-bold text-white`}>
                    {h.n.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{h.n}</p>
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={12} /> {h.w} · <CalendarCheck size={12} /> {h.s} slots · {h.c}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-brand-600" />
                </div>
              ))}
              <button onClick={() => navigate('/find?dept=cardiology')} className="btn-primary mt-3 w-full">
                Book in advance
              </button>
            </div>
          </div>
        </div>

        {/* Trust band */}
        <div className="relative border-t border-white/15 bg-black/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.label}>
                <p className="text-2xl font-extrabold">{t.value}</p>
                <p className="text-sm text-white/75">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold text-slate-900">Stop queuing. Book the right hospital first.</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-500">
          {BRAND.name} matches real-time patient demand to live hospital supply — so you find space before you travel.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon size={22} />
                </span>
                <span className="text-sm font-bold text-slate-300">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="card flex flex-col items-start justify-between gap-5 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10">
              <LayoutDashboard size={24} />
            </span>
            <div>
              <h3 className="text-xl font-bold">For hospitals: the live capacity dashboard</h3>
              <p className="mt-1 max-w-2xl text-white/75">
                See live occupancy, free beds and a 7-day demand forecast by department — and act before crowding hits.
              </p>
            </div>
          </div>
          <Link to="/dashboard" className="btn bg-white px-5 py-3 text-slate-900 hover:bg-slate-100">
            Open dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
