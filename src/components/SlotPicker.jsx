import { useMemo } from 'react'
import { Sun, Sunset } from 'lucide-react'

function buildGroup(label, icon, startHour, count, seed) {
  const slots = []
  for (let i = 0; i < count; i++) {
    const mins = startHour * 60 + i * 20
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    // Deterministically mark roughly 1 in 3 as already booked.
    const booked = (seed + i * 7) % 3 === 0
    slots.push({ time, booked })
  }
  return { label, icon, slots }
}

export default function SlotPicker({ value, onChange, seed = 0 }) {
  const groups = useMemo(
    () => [buildGroup('Morning', Sun, 9, 9, seed), buildGroup('Afternoon', Sunset, 15, 9, seed + 2)],
    [seed],
  )

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <g.icon size={15} /> {g.label}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {g.slots.map((s) => {
              const active = value === s.time
              return (
                <button
                  key={s.time}
                  disabled={s.booked}
                  onClick={() => onChange(s.time)}
                  className={[
                    'rounded-xl border px-2 py-2 text-sm font-semibold transition',
                    s.booked
                      ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through'
                      : active
                        ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700',
                  ].join(' ')}
                >
                  {s.time}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
