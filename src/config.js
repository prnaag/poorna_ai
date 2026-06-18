// Single source of truth for product branding. Rename here to rebrand everywhere.
export const BRAND = {
  name: 'Swasth',
  tagline: 'Find care. Book a slot. Skip the queue.',
  blurb:
    'A public booking platform for hospitals in India — see in real time which nearby hospital has space, a free doctor, the shortest wait, and accepts your insurance.',
}

// The hospital used for the worked example throughout the dashboard.
export const FEATURED_HOSPITAL_ID = 'aiims-delhi'

// FX + costing constants taken from the planning deck so figures stay consistent.
export const CONSTANTS = {
  fxRate: 86, // ₹ per USD
  costPerBedDay: 2307, // ₹, mean public-tertiary cost/bed-day (PGIMER/PHFI 2022)
  avgLosDays: 5.5,
}

export const fmtINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
