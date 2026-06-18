import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, MapPin, Stethoscope, LayoutDashboard, Github } from 'lucide-react'
import { BRAND } from '../config.js'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
        <Activity size={20} strokeWidth={2.5} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-extrabold tracking-tight text-slate-900">{BRAND.name}</span>
        <span className="hidden text-[11px] font-medium text-slate-400 sm:block">Booking & live capacity</span>
      </span>
    </Link>
  )
}

function ViewToggle() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const onDash = pathname.startsWith('/dashboard')
  const base = 'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition'
  return (
    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
      <button
        className={`${base} ${!onDash ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
        onClick={() => navigate('/')}
      >
        <Stethoscope size={16} /> <span className="hidden sm:inline">Patient app</span><span className="sm:hidden">Patient</span>
      </button>
      <button
        className={`${base} ${onDash ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`}
        onClick={() => navigate('/dashboard')}
      >
        <LayoutDashboard size={16} /> <span className="hidden sm:inline">Hospital dashboard</span><span className="sm:hidden">Hospital</span>
      </button>
    </div>
  )
}

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <ViewToggle />
          <div className="hidden items-center gap-3 md:flex">
            <span className="chip bg-slate-100 text-slate-600">
              <MapPin size={14} /> South Delhi
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              PR
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:px-6">
          <p>
            <span className="font-semibold text-slate-500">{BRAND.name}</span> · {BRAND.tagline}
          </p>
          <p className="flex items-center gap-1.5">
            <Github size={14} /> Mockup for Foundations for AI · Group 5 — demo data only
          </p>
        </div>
      </footer>
    </div>
  )
}
