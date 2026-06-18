import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts'
import { TrendingUp, Gauge, LogOut, Bot, UserCheck, Info, AlertTriangle } from 'lucide-react'
import DashboardHeader from '../../components/DashboardHeader.jsx'
import DemandByDeptChart from '../../components/charts/DemandByDeptChart.jsx'
import ForecastChart from '../../components/charts/ForecastChart.jsx'
import { OCCUPANCY_7DAY, MODEL_STATS } from '../../data/forecast.js'
import { DEPARTMENTS, occupancyPct, freeBeds } from '../../data/departments.js'

const OCC_LINES = [
  { key: 'overall', name: 'Whole hospital', color: '#0a9367', width: 3 },
  { key: 'emergency', name: 'Emergency', color: '#e11d48', width: 2 },
  { key: 'medicine', name: 'Gen. Medicine', color: '#2563eb', width: 2 },
  { key: 'oncology', name: 'Oncology', color: '#7c3aed', width: 2 },
]

const discharges = [...DEPARTMENTS].sort((a, b) => b.dischargesExpected - a.dischargesExpected).slice(0, 4)
const critical = DEPARTMENTS.filter((d) => occupancyPct(d) >= 90).sort((a, b) => occupancyPct(b) - occupancyPct(a))

function StatChip({ icon: Icon, label, value, tone = 'brand', note }) {
  const tones = { brand: 'text-brand-700 bg-brand-50', amber: 'text-amber-700 bg-amber-50', sky: 'text-sky-700 bg-sky-50' }
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2.5 ring-1 ring-slate-200">
      <span className={`grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}><Icon size={18} /></span>
      <div>
        <p className="text-lg font-extrabold leading-none text-slate-900">{value}</p>
        <p className="text-xs text-slate-400">{label}{note && <span className="text-slate-300"> · {note}</span>}</p>
      </div>
    </div>
  )
}

export default function Forecast() {
  return (
    <div className="bg-slate-50">
      <DashboardHeader active="forecast" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Model quality chips */}
        <div className="flex flex-wrap gap-3">
          <StatChip icon={TrendingUp} tone="brand" label="Demand MAPE" value={`${MODEL_STATS.demandMape}%`} note={`beats naive ${MODEL_STATS.naiveMape}%`} />
          <StatChip icon={Gauge} tone="sky" label="Forecast MASE" value={MODEL_STATS.forecastMase} note="< 1.0 = better than naive" />
          <StatChip icon={Gauge} tone="amber" label="LOS model AUC" value={MODEL_STATS.losAuc} note="length-of-stay" />
        </div>

        {/* Monthly demand by department */}
        <div className="card mt-5 p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly demand forecast by department</h3>
              <p className="text-sm text-slate-400">AIIMS Delhi · admissions over 12 months — winter respiratory & monsoon peaks</p>
            </div>
          </div>
          <div className="mt-4 h-[360px]">
            <DemandByDeptChart />
          </div>
        </div>

        {/* Arrivals forecast + 7-day occupancy */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-base font-bold text-slate-900">Emergency arrivals — 7-day forecast</h3>
            <p className="text-sm text-slate-400">Daily arrivals: history → forecast with ±confidence band</p>
            <div className="mt-4 h-[300px]">
              <ForecastChart />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-base font-bold text-slate-900">7-day occupancy forecast</h3>
            <p className="text-sm text-slate-400">Projected % occupancy — crossing 90% triggers bottleneck alerts</p>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={OCCUPANCY_7DAY} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis domain={[60, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={32} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                  <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
                  <ReferenceLine y={90} stroke="#e11d48" strokeDasharray="4 4" label={{ value: 'Crowding 90%', position: 'insideTopRight', fontSize: 11, fill: '#e11d48' }} />
                  {OCC_LINES.map((l) => (
                    <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={l.width} dot={false} activeDot={{ r: 4 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action prompts — predictions that change a decision */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-slate-900"><LogOut size={18} className="text-brand-600" /> Discharge planning</h3>
              <span className="chip bg-brand-100 text-brand-700"><Bot size={13} /> Automated</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">Patients flagged discharge-ready to free beds today.</p>
            <ul className="mt-3 space-y-2">
              {discharges.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-semibold text-slate-700">{d.emoji} {d.name}</span>
                  <span className="font-bold text-brand-700">{d.dischargesExpected} beds</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-slate-900"><AlertTriangle size={18} className="text-rose-500" /> Roster & bed flex</h3>
              <span className="chip bg-slate-200 text-slate-700"><UserCheck size={13} /> Human-approved</span>
            </div>
            <p className="mt-1 text-sm text-slate-400">Units forecast above 90% — needs a staffing/overflow decision.</p>
            <ul className="mt-3 space-y-2">
              {critical.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 text-sm ring-1 ring-rose-100">
                  <span className="font-semibold text-slate-700">{d.emoji} {d.name}</span>
                  <span className="font-bold text-rose-700">{occupancyPct(d)}% · {freeBeds(d)} free</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-slate-900 p-5 text-white">
            <h3 className="flex items-center gap-2 font-bold"><Info size={18} className="text-brand-300" /> Forecast confidence</h3>
            <p className="mt-2 text-sm text-white/80">
              Routine demand forecasts are reliable — single-digit MAPE. We separate routine from surge:
              accuracy drops for rare spikes, so we <span className="font-semibold text-white">don't over-promise</span> on emergency surges.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                <span className="text-white/80">Routine days</span><span className="font-bold">High confidence</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                <span className="text-white/80">Surge events</span><span className="font-bold text-amber-300">Wider band</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo data for the Foundations for AI pitch (Group 5). Figures are illustrative, not live hospital feeds.
        </p>
      </div>
    </div>
  )
}
