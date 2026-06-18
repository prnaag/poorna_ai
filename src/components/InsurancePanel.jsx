import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { insurerById } from '../data/insurance.js'
import { fmtINR } from '../config.js'

function hashNum(str, len) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 1e9
  return String(h).padStart(len, '0').slice(0, len)
}

export default function InsurancePanel({ insurerId, estimate = 18500, patientName = 'Poorna R.' }) {
  const ins = insurerById(insurerId)
  if (!ins) return null

  const isGovt = ins.kind === 'govt'
  const coverPct = isGovt ? 100 : 90
  const insurerShare = Math.round((estimate * coverPct) / 100)
  const patientShare = estimate - insurerShare

  const abha = hashNum('abha' + patientName, 14).replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4')
  const policy = (isGovt ? 'CG' : ins.name.slice(0, 2).toUpperCase()) + '-' + hashNum(ins.id + patientName, 8)

  const Row = ({ label, value, strong }) => (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}>{value}</span>
    </div>
  )

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3 text-white">
        <span className="flex items-center gap-2 font-bold">
          <ShieldCheck size={18} /> Insurance — pre-filled
        </span>
        <span className="chip bg-white/15 text-white">
          <Sparkles size={13} /> Auto-filled via ABDM
        </span>
      </div>

      <div className="p-5">
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <Row label="Scheme / insurer" value={ins.name} strong />
          <Row label="Policy / scheme ID" value={policy} />
          <Row label="Linked ABHA ID" value={abha} />
        </div>

        <div className="mt-4 space-y-0.5 border-t border-dashed border-slate-200 pt-3">
          <Row label="Estimated package" value={fmtINR(estimate)} />
          <Row label={`Insurer covers (${coverPct}%)`} value={`− ${fmtINR(insurerShare)}`} />
          <div className="mt-1 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2">
            <span className="font-semibold text-brand-800">You pay</span>
            <span className="text-lg font-extrabold text-brand-800">{fmtINR(patientShare)}</span>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} /> Pre-authorisation {isGovt ? 'approved — fully cashless' : 'approved for cashless treatment'}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Claim drafted automatically from your ABHA health record and submitted to the insurer before your visit.
        </p>
      </div>
    </div>
  )
}
