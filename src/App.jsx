import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import Home from './pages/Home'
import Events from './pages/Events'
import GetInvolved from './pages/GetInvolved'
import Community from './pages/Community'
import CommunityCompany from './pages/CommunityCompany'
import EventCMS from './pages/EventCMS'
import EventDetail from './pages/EventDetail'
import Member from './pages/Member'
import Admin from './pages/Admin'
import Apply from './pages/Apply'
import FLUXlab from './pages/initiatives/FLUXlab'
import CONFLUX from './pages/initiatives/CONFLUX'
import InFLUX from './pages/initiatives/InFLUX'
import Fluxathon from './pages/initiatives/Fluxathon'
import About from './pages/About'
import Alumni from './pages/Alumni'
import Learn from './pages/Learn'
import Resources from './pages/Resources'
import Partners from './pages/Partners'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/community" element={<Community />} />

          {/* STATIC MODE: routes that require DB redirect instead of rendering */}
          <Route path="/apply" element={<Navigate replace to="/" />} />
          <Route path="/events/:eventId" element={<Navigate replace to="/events" />} />
          <Route path="/community/:company" element={<Navigate replace to="/community" />} />
          <Route path="/member/:id" element={<Navigate replace to="/community" />} />
          <Route path="/event/:id" element={<Navigate replace to="/events" />} />

          {/* Initiative Pages */}
          <Route path="/initiatives/fluxlab" element={<FLUXlab />} />
          <Route path="/initiatives/conflux" element={<CONFLUX />} />
          <Route path="/initiatives/influx" element={<InFLUX />} />
          <Route path="/initiatives/fluxathon" element={<Fluxathon />} />

          {/* Information Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/partners" element={<Partners />} />

          {/* Admin Routes — redirect in static mode */}
          <Route path="/admin-manage" element={<Navigate replace to="/" />} />
          <Route path="/event-manage" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
