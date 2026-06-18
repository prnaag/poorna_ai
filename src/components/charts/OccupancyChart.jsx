import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  LabelList,
} from 'recharts'
import { DEPARTMENTS, occupancyPct, statusOf, STATUS_META } from '../../data/departments.js'

const data = DEPARTMENTS.map((d) => {
  const pct = occupancyPct(d)
  return { name: d.short, full: d.name, pct, fill: STATUS_META[statusOf(pct)].bar }
}).sort((a, b) => b.pct - a.pct)

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-card">
      <p className="font-semibold text-slate-800">{p.full}</p>
      <p className="text-slate-500">{p.pct}% occupied</p>
    </div>
  )
}

export default function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, left: 8, bottom: 0 }} barCategoryGap={6}>
        <CartesianGrid horizontal={false} stroke="#eef2f7" />
        <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={64}
          tick={{ fontSize: 12, fill: '#475569' }}
        />
        <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
        <ReferenceLine x={90} stroke="#e11d48" strokeDasharray="4 4" label={{ value: 'Crowding 90%', position: 'top', fontSize: 11, fill: '#e11d48' }} />
        <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
          <LabelList dataKey="pct" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
