import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, MapPin, RotateCcw, Search } from 'lucide-react'
import HospitalCard from '../../components/HospitalCard.jsx'
import { HOSPITALS } from '../../data/hospitals.js'
import { INSURERS, insurerById } from '../../data/insurance.js'
import { DEPARTMENTS, deptById } from '../../data/departments.js'

const norm = (val, min, max) => (max === min ? 0 : (val - min) / (max - min))

function computeReasons(list, insurer) {
  if (!list.length) return {}
  const min = (k) => Math.min(...list.map((h) => h[k]))
  const max = (k) => Math.max(...list.map((h) => h[k]))
  const closest = min('distanceKm')
  const fastest = min('expectedWaitMin')
  const cheapest = min('opdFee')
  const mostSlots = max('freeSlotsToday')
  const emptiest = min('occupancyPct')
  const out = {}
  list.forEach((h) => {
    const r = []
    if (h.expectedWaitMin === fastest) r.push('Shortest wait')
    if (h.distanceKm === closest) r.push('Closest to you')
    if (insurer !== 'any' && h.insurers.includes(insurer)) r.push(`Cashless: ${insurerById(insurer)?.name}`)
    if (h.opdFee === cheapest) r.push('Lowest fee')
    if (h.freeSlotsToday === mostSlots) r.push('Most free slots')
    if (h.occupancyPct === emptiest) r.push('Most beds free')
    out[h.id] = r.slice(0, 3)
  })
  return out
}

export default function SearchResults() {
  const [params] = useSearchParams()
  const loc = params.get('loc') || 'South Delhi'
  const [dept, setDept] = useState(params.get('dept') || 'all')
  const [insurer, setInsurer] = useState('any')
  const [type, setType] = useState('all')
  const [maxDistance, setMaxDistance] = useState(20)
  const [sort, setSort] = useState('match')

  const filtered = useMemo(() => {
    return HOSPITALS.filter(
      (h) =>
        (dept === 'all' || h.departments.includes(dept)) &&
        (insurer === 'any' || h.insurers.includes(insurer)) &&
        (type === 'all' || h.type === type) &&
        h.distanceKm <= maxDistance,
    )
  }, [dept, insurer, type, maxDistance])

  const ranked = useMemo(() => {
    const list = [...filtered]
    if (sort === 'distance') return list.sort((a, b) => a.distanceKm - b.distanceKm)
    if (sort === 'wait') return list.sort((a, b) => a.expectedWaitMin - b.expectedWaitMin)
    if (sort === 'cost') return list.sort((a, b) => a.opdFee - b.opdFee)
    // Best match: weighted, lower is better.
    const w = [Math.min(...list.map((h) => h.expectedWaitMin)), Math.max(...list.map((h) => h.expectedWaitMin))]
    const d = [Math.min(...list.map((h) => h.distanceKm)), Math.max(...list.map((h) => h.distanceKm))]
    const o = [Math.min(...list.map((h) => h.occupancyPct)), Math.max(...list.map((h) => h.occupancyPct))]
    const s = [Math.min(...list.map((h) => h.freeSlotsToday)), Math.max(...list.map((h) => h.freeSlotsToday))]
    const score = (h) =>
      0.4 * norm(h.expectedWaitMin, ...w) +
      0.22 * norm(h.distanceKm, ...d) +
      0.13 * ((h.costBand - 1) / 2) +
      0.15 * norm(h.occupancyPct, ...o) +
      0.1 * (1 - norm(h.freeSlotsToday, ...s))
    return list.sort((a, b) => score(a) - score(b))
  }, [filtered, sort])

  const reasons = useMemo(() => computeReasons(ranked, insurer), [ranked, insurer])

  const reset = () => {
    setDept('all'); setInsurer('any'); setType('all'); setMaxDistance(20); setSort('match')
  }

  const Field = ({ label, children }) => (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
  const selectCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-brand-400'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {ranked.length} hospital{ranked.length !== 1 ? 's' : ''} near you
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={14} /> {loc}
            {dept !== 'all' && <> · {deptById(dept)?.emoji} {deptById(dept)?.name}</>}
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-slate-500">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls + ' w-auto'}>
            <option value="match">Best match</option>
            <option value="wait">Shortest wait</option>
            <option value="distance">Nearest</option>
            <option value="cost">Lowest cost</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="card h-fit p-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-slate-800">
              <SlidersHorizontal size={16} /> Filters
            </h2>
            <button onClick={reset} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-brand-700">
              <RotateCcw size={13} /> Reset
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <Field label="Department">
              <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectCls}>
                <option value="all">All departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Insurance accepted">
              <select value={insurer} onChange={(e) => setInsurer(e.target.value)} className={selectCls}>
                <option value="any">Any insurance</option>
                {INSURERS.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Hospital type">
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Government', 'Private', 'Trust'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`chip ${type === t ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {t === 'all' ? 'All' : t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={`Within ${maxDistance} km`}>
              <input
                type="range" min="2" max="20" value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
            </Field>
          </div>
        </aside>

        {/* Results */}
        <div className="space-y-4">
          {ranked.length === 0 ? (
            <div className="card grid place-items-center p-12 text-center">
              <Search className="text-slate-300" size={40} />
              <p className="mt-3 font-semibold text-slate-700">No hospitals match these filters</p>
              <p className="text-sm text-slate-400">Try widening the distance or clearing a filter.</p>
              <button onClick={reset} className="btn-ghost mt-4">Reset filters</button>
            </div>
          ) : (
            ranked.map((h, i) => (
              <HospitalCard key={h.id} hospital={h} rank={sort === 'match' ? i + 1 : undefined} reasons={reasons[h.id]} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
