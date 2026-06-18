import { Link } from 'react-router-dom'
import { BedDouble, Activity, LogIn, LogOut, Clock, ArrowRight } from 'lucide-react'
import DashboardHeader from '../../components/DashboardHeader.jsx'
import KpiCard from '../../components/KpiCard.jsx'
import OccupancyChart from '../../components/charts/OccupancyChart.jsx'
import AlertPanel from '../../components/AlertPanel.jsx'
import {
  DEPARTMENTS, hospitalTotals, occupancyPct, freeBeds, statusOf, STATUS_META,
} from '../../data/departments.js'

const toneFor = (pct) => (statusOf(pct) === 'critical' ? 'rose' : statusOf(pct) === 'filling' ? 'amber' : 'brand')

const alerts = DEPARTMENTS
  .map((d) => ({ d, pct: occupancyPct(d) }))
  .filter((x) => x.pct >= 80)
  .sort((a, b) => b.pct - a.pct)
  .map(({ d, pct }) => {
    const severity = statusOf(pct)
    return severity === 'critical'
      ? { id: d.id, dept: d.name, pct, severity, owner: 'Human-approved', action: `Only ${freeBeds(d)} beds free — open overflow ward & reallocate beds` }
      : { id: d.id, dept: d.name, pct, severity, owner: 'Auto', action: `Auto-flag ${d.dischargesExpected} discharge-ready patients & flex roster` }
  })

function Bar({ pct }) {
  const meta = STATUS_META[statusOf(pct)]
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.bar }} />
      </div>
      <span className={`text-sm font-semibold ${meta.text}`}>{pct}%</span>
    </div>
  )
}

export default function Dashboard() {
  const t = hospitalTotals()
  const rows = [...DEPARTMENTS].sort((a, b) => occupancyPct(b) - occupancyPct(a))

  return (
    <div className="bg-slate-50">
      <DashboardHeader active="overview" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <KpiCard icon={Activity} tone={toneFor(t.occupancyPct)} label="Occupancy" value={`${t.occupancyPct}%`} sub={`${t.occupied.toLocaleString('en-IN')} of ${t.beds.toLocaleString('en-IN')} beds`} />
          <KpiCard icon={BedDouble} tone="brand" label="Free beds" value={t.free} sub="available right now" />
          <KpiCard icon={LogIn} tone="sky" label="Admissions today" value={t.admissionsToday} sub="across 10 departments" />
          <KpiCard icon={LogOut} tone="slate" label="Discharges expected" value={t.dischargesExpected} sub="frees beds today" />
          <KpiCard icon={Clock} tone="amber" label="Avg wait" value={`${t.avgWaitMin} min`} sub="OPD / ED mean" />
        </div>

        {/* Chart + alerts */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">Occupancy by department</h3>
              <div className="flex gap-3 text-xs font-medium text-slate-500">
                {['ok', 'filling', 'critical'].map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META[s].bar }} />
                    {STATUS_META[s].label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 h-[380px]">
              <OccupancyChart />
            </div>
          </div>
          <AlertPanel alerts={alerts} />
        </div>

        {/* Ward table */}
        <div className="card mt-5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Live ward & bed status</h3>
            <Link to="/dashboard/forecast" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              View 7-day forecast <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto scroll-thin">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2.5 pr-4 font-semibold">Department</th>
                  <th className="py-2.5 pr-4 font-semibold">Beds</th>
                  <th className="py-2.5 pr-4 font-semibold">Occupied</th>
                  <th className="py-2.5 pr-4 font-semibold">Free</th>
                  <th className="py-2.5 pr-4 font-semibold">Occupancy</th>
                  <th className="py-2.5 pr-4 font-semibold">Admits</th>
                  <th className="py-2.5 pr-4 font-semibold">Avg wait</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((d) => {
                  const pct = occupancyPct(d)
                  const meta = STATUS_META[statusOf(pct)]
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70">
                      <td className="py-3 pr-4 font-semibold text-slate-800">
                        <span className="mr-1.5">{d.emoji}</span> {d.name}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{d.beds}</td>
                      <td className="py-3 pr-4 text-slate-600">{d.occupied}</td>
                      <td className="py-3 pr-4 font-semibold text-slate-800">{freeBeds(d)}</td>
                      <td className="py-3 pr-4"><Bar pct={pct} /></td>
                      <td className="py-3 pr-4 text-slate-600">{d.admissionsToday}</td>
                      <td className="py-3 pr-4 text-slate-600">{d.avgWaitMin} min</td>
                      <td className="py-3">
                        <span className={`chip ${meta.bg} ${meta.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
