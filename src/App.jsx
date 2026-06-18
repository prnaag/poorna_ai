import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import Home from './pages/patient/Home.jsx'
import SearchResults from './pages/patient/SearchResults.jsx'
import HospitalDetail from './pages/patient/HospitalDetail.jsx'
import Booking from './pages/patient/Booking.jsx'
import Confirmation from './pages/patient/Confirmation.jsx'
import Dashboard from './pages/hospital/Dashboard.jsx'
import Forecast from './pages/hospital/Forecast.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<SearchResults />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />
        <Route path="/book/:id" element={<Booking />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/forecast" element={<Forecast />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
