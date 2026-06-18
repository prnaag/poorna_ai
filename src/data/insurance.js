// Insurance schemes & insurers commonly seen in Indian hospitals.
export const INSURERS = [
  { id: 'cghs', name: 'CGHS', full: 'Central Government Health Scheme', kind: 'govt' },
  { id: 'pmjay', name: 'Ayushman Bharat', full: 'PM-JAY (National Health Authority)', kind: 'govt' },
  { id: 'star', name: 'Star Health', full: 'Star Health & Allied Insurance', kind: 'private' },
  { id: 'hdfc', name: 'HDFC ERGO', full: 'HDFC ERGO General Insurance', kind: 'private' },
  { id: 'icici', name: 'ICICI Lombard', full: 'ICICI Lombard General Insurance', kind: 'private' },
  { id: 'niva', name: 'Niva Bupa', full: 'Niva Bupa Health Insurance', kind: 'private' },
  { id: 'care', name: 'Care Health', full: 'Care Health Insurance', kind: 'private' },
]

export const insurerById = (id) => INSURERS.find((i) => i.id === id)
