// Forecasting mock data for the hospital dashboard (featured hospital: AIIMS Delhi).
// Patterns encode real-world seasonality: winter respiratory peaks (Dec–Feb) and a
// monsoon vector-borne bump (Jul–Sep). Numbers are illustrative.

// Departments shown on the monthly demand chart, with stable colors used everywhere.
export const DEMAND_SERIES = [
  { id: 'emergency', name: 'Emergency', color: '#e11d48' },
  { id: 'medicine', name: 'General Medicine', color: '#0a9367' },
  { id: 'pulmonology', name: 'Pulmonology', color: '#2563eb' },
  { id: 'pediatrics', name: 'Pediatrics', color: '#f59e0b' },
  { id: 'cardiology', name: 'Cardiology', color: '#7c3aed' },
]

// Monthly admissions per department (12-month view).
export const MONTHLY_DEMAND = [
  { month: 'Jan', emergency: 1850, medicine: 1620, pulmonology: 980, pediatrics: 880, cardiology: 720 },
  { month: 'Feb', emergency: 1720, medicine: 1500, pulmonology: 900, pediatrics: 820, cardiology: 690 },
  { month: 'Mar', emergency: 1580, medicine: 1380, pulmonology: 760, pediatrics: 760, cardiology: 670 },
  { month: 'Apr', emergency: 1490, medicine: 1300, pulmonology: 620, pediatrics: 720, cardiology: 650 },
  { month: 'May', emergency: 1520, medicine: 1280, pulmonology: 560, pediatrics: 740, cardiology: 660 },
  { month: 'Jun', emergency: 1610, medicine: 1340, pulmonology: 600, pediatrics: 820, cardiology: 670 },
  { month: 'Jul', emergency: 1760, medicine: 1480, pulmonology: 700, pediatrics: 960, cardiology: 690 },
  { month: 'Aug', emergency: 1880, medicine: 1560, pulmonology: 760, pediatrics: 1020, cardiology: 700 },
  { month: 'Sep', emergency: 1840, medicine: 1520, pulmonology: 740, pediatrics: 960, cardiology: 690 },
  { month: 'Oct', emergency: 1700, medicine: 1440, pulmonology: 820, pediatrics: 860, cardiology: 700 },
  { month: 'Nov', emergency: 1790, medicine: 1560, pulmonology: 940, pediatrics: 900, cardiology: 730 },
  { month: 'Dec', emergency: 1920, medicine: 1680, pulmonology: 1060, pediatrics: 940, cardiology: 760 },
]

// 7-day forward occupancy forecast (%) for the whole hospital + watch departments.
// The mid-week → weekend climb pushes several units past the 90% crowding line.
export const OCCUPANCY_7DAY = [
  { day: 'Mon', overall: 85, emergency: 94, medicine: 90, oncology: 92 },
  { day: 'Tue', overall: 86, emergency: 95, medicine: 91, oncology: 93 },
  { day: 'Wed', overall: 88, emergency: 96, medicine: 92, oncology: 93 },
  { day: 'Thu', overall: 90, emergency: 97, medicine: 94, oncology: 94 },
  { day: 'Fri', overall: 92, emergency: 98, medicine: 95, oncology: 95 },
  { day: 'Sat', overall: 89, emergency: 96, medicine: 92, oncology: 93 },
  { day: 'Sun', overall: 86, emergency: 93, medicine: 90, oncology: 92 },
]

// Emergency-department daily arrivals: 7 days of history → 7 days of forecast,
// with a ±confidence band to show honest uncertainty (deck stresses this).
export const ARRIVALS_14DAY = [
  { label: '−6d', actual: 58 },
  { label: '−5d', actual: 61 },
  { label: '−4d', actual: 57 },
  { label: '−3d', actual: 64 },
  { label: '−2d', actual: 60 },
  { label: '−1d', actual: 66 },
  { label: 'Today', actual: 64, forecast: 64, lo: 64, hi: 64 },
  { label: '+1d', forecast: 67, lo: 61, hi: 73 },
  { label: '+2d', forecast: 69, lo: 62, hi: 76 },
  { label: '+3d', forecast: 71, lo: 63, hi: 79 },
  { label: '+4d', forecast: 73, lo: 64, hi: 82 },
  { label: '+5d', forecast: 70, lo: 61, hi: 79 },
  { label: '+6d', forecast: 66, lo: 57, hi: 75 },
  { label: '+7d', forecast: 63, lo: 54, hi: 72 },
]

// Headline model-quality numbers shown as small stat chips (illustrative).
export const MODEL_STATS = {
  demandMape: 6, // %
  naiveMape: 11, // %
  forecastMase: 0.82,
  losAuc: 0.84,
}
