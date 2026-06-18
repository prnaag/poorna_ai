// Departments + a live capacity snapshot for the featured hospital (AIIMS Delhi).
// Bed totals sum to 2,084 and occupied sums to 1,771 (= 85.0% overall occupancy),
// matching the planning deck's AIIMS Delhi figures.

export const DEPARTMENTS = [
  { id: 'emergency',  name: 'Emergency',              short: 'ED',     emoji: '🚑', beds: 180, occupied: 173, admissionsToday: 64, dischargesExpected: 9,  avgWaitMin: 52, doctorsOnDuty: 14 },
  { id: 'medicine',   name: 'General Medicine',       short: 'Med',    emoji: '🩺', beds: 340, occupied: 316, admissionsToday: 48, dischargesExpected: 31, avgWaitMin: 41, doctorsOnDuty: 22 },
  { id: 'cardiology', name: 'Cardiology',             short: 'Cardio', emoji: '❤️', beds: 230, occupied: 209, admissionsToday: 22, dischargesExpected: 18, avgWaitMin: 36, doctorsOnDuty: 12 },
  { id: 'oncology',   name: 'Oncology',               short: 'Onco',   emoji: '🎗️', beds: 250, occupied: 235, admissionsToday: 17, dischargesExpected: 12, avgWaitMin: 33, doctorsOnDuty: 11 },
  { id: 'pulmonology',name: 'Pulmonology',            short: 'Pulmo',  emoji: '🫁', beds: 134, occupied: 123, admissionsToday: 19, dischargesExpected: 8,  avgWaitMin: 38, doctorsOnDuty: 7  },
  { id: 'nephrology', name: 'Nephrology',             short: 'Nephro', emoji: '🧪', beds: 150, occupied: 129, admissionsToday: 11, dischargesExpected: 10, avgWaitMin: 29, doctorsOnDuty: 8  },
  { id: 'neurology',  name: 'Neurology',              short: 'Neuro',  emoji: '🧠', beds: 170, occupied: 133, admissionsToday: 13, dischargesExpected: 16, avgWaitMin: 31, doctorsOnDuty: 9  },
  { id: 'ortho',      name: 'Orthopedics',            short: 'Ortho',  emoji: '🦴', beds: 200, occupied: 148, admissionsToday: 15, dischargesExpected: 22, avgWaitMin: 27, doctorsOnDuty: 10 },
  { id: 'obgyn',      name: 'Obstetrics & Gynae',     short: 'OB-GYN', emoji: '🤰', beds: 210, occupied: 151, admissionsToday: 26, dischargesExpected: 24, avgWaitMin: 24, doctorsOnDuty: 13 },
  { id: 'pediatrics', name: 'Pediatrics',             short: 'Paeds',  emoji: '🧒', beds: 220, occupied: 154, admissionsToday: 20, dischargesExpected: 21, avgWaitMin: 22, doctorsOnDuty: 12 },
]

export const deptById = (id) => DEPARTMENTS.find((d) => d.id === id)

// --- Derived helpers (single source of truth so totals always reconcile) ---

export const freeBeds = (d) => d.beds - d.occupied
export const occupancyPct = (d) => Math.round((d.occupied / d.beds) * 1000) / 10

export const statusOf = (pct) =>
  pct >= 90 ? 'critical' : pct >= 80 ? 'filling' : 'ok'

export const STATUS_META = {
  critical: { label: 'Critical', text: 'text-rose-700',  bg: 'bg-rose-50',   ring: 'ring-rose-200',   dot: 'bg-rose-500',   bar: '#e11d48' },
  filling:  { label: 'Filling',  text: 'text-amber-700', bg: 'bg-amber-50',  ring: 'ring-amber-200',  dot: 'bg-amber-500',  bar: '#f59e0b' },
  ok:       { label: 'Healthy',  text: 'text-brand-700', bg: 'bg-brand-50',  ring: 'ring-brand-200',  dot: 'bg-brand-500',  bar: '#16b67e' },
}

export const hospitalTotals = () => {
  const beds = DEPARTMENTS.reduce((s, d) => s + d.beds, 0)
  const occupied = DEPARTMENTS.reduce((s, d) => s + d.occupied, 0)
  const admissionsToday = DEPARTMENTS.reduce((s, d) => s + d.admissionsToday, 0)
  const dischargesExpected = DEPARTMENTS.reduce((s, d) => s + d.dischargesExpected, 0)
  const avgWaitMin = Math.round(
    DEPARTMENTS.reduce((s, d) => s + d.avgWaitMin, 0) / DEPARTMENTS.length,
  )
  return {
    beds,
    occupied,
    free: beds - occupied,
    occupancyPct: Math.round((occupied / beds) * 1000) / 10,
    admissionsToday,
    dischargesExpected,
    avgWaitMin,
  }
}
