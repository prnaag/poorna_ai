import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import { ARRIVALS_14DAY } from '../../data/forecast.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-card">
      <p className="font-semibold text-slate-800">{label}</p>
      {row.actual != null && <p className="text-slate-600">Actual: {row.actual}/day</p>}
      {row.forecast != null && (
        <p className="text-brand-700">
          Forecast: {row.forecast}/day
          {row.lo != null && row.hi != null && row.hi !== row.lo && (
            <span className="text-slate-400">
              {' '}
              ({row.lo}–{row.hi})
            </span>
          )}
        </p>
      )}
    </div>
  )
}

export default function ForecastChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={ARRIVALS_14DAY} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis domain={[40, 90]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={32} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
        {/* Confidence band: green 'hi' area, masked below by a white 'lo' area */}
        <Area dataKey="hi" stroke="none" fill="#d6f9e8" legendType="none" tooltipType="none" isAnimationActive={false} />
        <Area dataKey="lo" stroke="none" fill="#ffffff" legendType="none" tooltipType="none" isAnimationActive={false} />
        <ReferenceLine x="Today" stroke="#cbd5e1" strokeDasharray="3 3" />
        <Line dataKey="actual" name="Actual" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 2.5 }} />
        <Line dataKey="forecast" name="Forecast" stroke="#0a9367" strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
