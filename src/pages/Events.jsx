import { useState } from 'react'
import { Link } from 'react-router-dom'
/* STATIC MODE: comment out DB dependencies
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RSVPModal from '../components/modals/RSVPModal'
import { fetchEvents, registerForEvent, getRegistrationCount } from '../services/events'
import { sendRSVPConfirmationEmail } from '../services/email'
*/
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming')
  /* STATIC MODE: comment out RSVP + query state
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const queryClient = useQueryClient()
  */

  // Sample events for testing
  const sampleUpcomingEvents = [
    {
      id: '1',
      title: 'Design Thinking Workshop',
      description: 'Join us for an interactive workshop where we explore the fundamentals of design thinking.',
      event_date: '2025-12-15T18:00:00',
      location: 'Arnold Hall, Room 301',
      event_type: 'workshop',
      photo_urls: ['/assets/ue_1.png']
    },
    {
      id: '2',
      title: 'Figma Masterclass',
      description: 'Learn advanced prototyping techniques in Figma from industry professionals.',
      event_date: '2025-12-20T19:00:00',
      location: 'Virtual Event',
      event_type: 'workshop',
      photo_urls: ['/assets/ue_2.png']
    },
    {
      id: '3',
      title: 'FLUX Social Night',
      description: 'Connect with fellow UX designers over games, food, and great conversation.',
      event_date: '2025-12-18T20:00:00',
      location: 'Student Center',
      event_type: 'social',
      photo_urls: ['/assets/ue_3.png']
    }
  ]

  const samplePastEvents = [
    {
      id: '4',
      title: 'Portfolio Review Session',
      description: 'Get feedback on your portfolio from experienced designers and faculty.',
      event_date: '2024-11-10T17:00:00',
      location: 'Design Lab',
      event_type: 'general',
      photo_urls: ['/assets/ue_4.png']
    },
    {
      id: '5',
      title: 'UX Research Workshop',
      description: 'Deep dive into user research methodologies and best practices.',
      event_date: '2024-10-25T18:30:00',
      location: 'Arnold Hall',
      event_type: 'workshop',
      photo_urls: ['/assets/ue_1.png']
    }
  ]

  /* STATIC MODE: comment out live DB queries and mutations
  // Fetch upcoming events
  const { data: upcomingEvents = sampleUpcomingEvents, isLoading: loadingUpcoming, error: errorUpcoming } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => fetchEvents({ upcoming: true }),
    staleTime: 1000 * 60 * 5,
    placeholderData: sampleUpcomingEvents
  })

  // Fetch past events
  const { data: pastEvents = samplePastEvents, isLoading: loadingPast, error: errorPast } = useQuery({
    queryKey: ['events', 'past'],
    queryFn: () => fetchEvents({ upcoming: false }),
    staleTime: 1000 * 60 * 5,
    placeholderData: samplePastEvents
  })

  const loading = activeTab === 'upcoming' ? loadingUpcoming : loadingPast
  const error = activeTab === 'upcoming' ? errorUpcoming : errorPast

  const { mutate: register, isPending: isRegistering } = useMutation({
    mutationFn: async (registrationData) => {
      return await registerForEvent(selectedEvent.id, registrationData)
    },
    onSuccess: async (data, registrationData) => {
      sendRSVPConfirmationEmail({
        email: registrationData.user_email,
        name: registrationData.user_name,
        event: selectedEvent
      });
      setSuccessMessage(`Successfully registered for ${selectedEvent.title}! Check your email for confirmation.`)
      setRsvpModalOpen(false)
      setSelectedEvent(null)
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setTimeout(() => setSuccessMessage(''), 5000)
    },
    onError: (error) => {
      alert(error.message || 'Failed to register for event. Please try again.')
    }
  })

  const handleRSVPClick = (event) => {
    setSelectedEvent(event)
    setRsvpModalOpen(true)
  }

  const handleRSVPSubmit = (formData) => {
    register(formData)
  }
  */

  // STATIC MODE: use sample data directly
  const upcomingEvents = sampleUpcomingEvents
  const pastEvents = samplePastEvents
  const loading = false
  const error = null
  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* STATIC MODE: RSVPModal and success message disabled
      <RSVPModal
        isOpen={rsvpModalOpen}
        onClose={() => {
          setRsvpModalOpen(false)
          setSelectedEvent(null)
        }}
        onSubmit={handleRSVPSubmit}
        event={selectedEvent}
        isLoading={isRegistering}
      />
      {successMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          ✓ {successMessage}
        </div>
      )}
      */}

      {/* Background Shapes */}
      <div
        className="absolute left-0 w-full pointer-events-none hidden md:block"
        style={{
          zIndex: 0,
          top: '0',
          height: '800px'
        }}
      >
        <img src="/assets/flux-shape-left.png" alt="" className="absolute left-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
        <img src="/assets/flux-shape-right.png" alt="" className="absolute right-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
      </div>

      <div className="relative">
        <Navigation />
      </div>
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 relative" style={{ zIndex: 1 }}>
        <section className="pt-20 pb-12 text-center px-4">
          <p className="text-[#969696] text-[16px] md:text-[20px] uppercase mb-6 tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '20.74px' }}>
            WHERE IDEAS MEET ACTION
          </p>
          <h1 className="text-[36px] md:text-[48px] lg:text-[60px] mb-12" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
            <span className="text-[#242424]">Where </span>
            <span style={{ color: '#316EFF' }}>Future UX Stars</span>
            <br />
            <span className="text-[#242424]">come to play</span>
          </h1>
        </section>

        <section className="w-full relative px-4 md:px-8 lg:px-28 xl:px-56">
          <div className="flex justify-center mb-8">
            <div className="flex justify-start items-center gap-2 flex-wrap">
              <div
                onClick={() => setActiveTab('upcoming')}
                className="px-5 py-2.5 rounded-full cursor-pointer flex justify-center items-center transition-all duration-300 hover:scale-105"
                style={{ background: activeTab === 'upcoming' ? '#316EFF' : 'white', outline: `2px ${activeTab === 'upcoming' ? '#316EFF' : '#B2B2B2'} solid`, outlineOffset: '-2px' }}>
                <div className="text-sm md:text-base font-bold whitespace-nowrap" style={{ color: activeTab === 'upcoming' ? 'white' : '#B2B2B2', fontFamily: 'Space Grotesk' }}>Upcoming Event</div>
              </div>
              <div
                onClick={() => setActiveTab('past')}
                className="px-5 py-2.5 rounded-full cursor-pointer flex justify-center items-center transition-all duration-300 hover:scale-105"
                style={{ background: activeTab === 'past' ? '#316EFF' : 'white', outline: `2px ${activeTab === 'past' ? '#316EFF' : '#B2B2B2'} solid`, outlineOffset: '-2px' }}>
                <div className="text-sm md:text-base font-bold whitespace-nowrap" style={{ color: activeTab === 'past' ? 'white' : '#B2B2B2', fontFamily: 'Space Grotesk' }}>Previous Event</div>
              </div>
            </div>
          </div>
          {error ? (
            <div className="text-center text-red-500 py-10" style={{ fontFamily: 'Space Grotesk' }}>
              Failed to load events. Please try again later.
            </div>
          ) : loading ? (
            <div className="text-center text-[#787878] py-10" style={{ fontFamily: 'Space Grotesk' }}>
              Loading events...
            </div>
          ) : displayEvents.length === 0 ? (
            <div className="text-center text-[#787878] py-10" style={{ fontFamily: 'Space Grotesk' }}>
              No {activeTab} events found.
            </div>
          ) : (
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 justify-items-center">
              {displayEvents.slice(0, 6).map((event, index) => {
                const eventDate = new Date(event.event_date)
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })

                return (
                  <div key={event.id} className="w-full max-w-[320px] flex flex-col gap-5 group">
                    <svg width="100%" height="2" viewBox="0 0 300 2" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                      <path d="M0 1H300" stroke="#AEAEAE"/>
                    </svg>
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-2">
                        <div className="text-sm md:text-base" style={{ color: 'black', fontFamily: 'Space Grotesk', fontWeight: 400, lineHeight: '1.4' }}>
                          {formattedDate}<br/>{event.location}
                        </div>
                        <div className="text-[32px] md:text-[40px] lg:text-[48px] transition-colors duration-300 group-hover:text-[#316EFF]" style={{ color: 'black', fontFamily: 'Space Grotesk', fontWeight: 500, lineHeight: '1.1' }}>
                          {event.title}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="overflow-hidden rounded-lg">
                          <img
                            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                            src={event.cover_image_url || event.photo_urls?.[0] || `/assets/ue_${(index % 4) + 1}.png`}
                            alt={event.title}
                          />
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {activeTab === 'upcoming' && (
                            /* STATIC MODE: replace RSVP button with external form link (update href when live) */
                            <a
                              href="#"
                              className="px-6 py-3 rounded-full flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-lg no-underline"
                              style={{ background: '#316EFF' }}
                            >
                              <div className="text-base md:text-lg lg:text-xl text-white" style={{ fontFamily: 'Space Grotesk', fontWeight: 500 }}>
                                RSVP
                              </div>
                            </a>
                          )}
                          <Link to={`/events/${event.id}`} className="px-6 py-3 rounded-full flex justify-center items-center no-underline transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-300" style={{ background: '#EAEAEA' }}>
                            <div className="text-base md:text-lg lg:text-xl" style={{ color: 'black', fontFamily: 'Space Grotesk', fontWeight: 500 }}>View Detail</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section style={{ paddingTop: '44px', paddingBottom: '80px', display: 'flex', justifyContent: 'center' }}>
          <button className="transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:border-gray-400" style={{ border: '1px solid #D1D1D1', paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '43px', justifyContent: 'center', alignItems: 'center', gap: '3.24px', display: 'flex' }}>
            <div style={{ color: '#646464', fontSize: '16px', fontFamily: 'Space Grotesk', fontWeight: 400, lineHeight: '16.59px', wordWrap: 'break-word' }}>More Events</div>
          </button>
        </section>

        <section className="py-20">
          <h2 className="text-[32px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: '33.18px' }}>Winter 26'</h2>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
            {/* Calendar Header */}
            <div className="grid grid-cols-8 bg-[#316EFF] text-white">
              <div></div>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                <div key={day} className="p-3 text-center text-[14px] font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Body */}
            <div className="grid grid-cols-8">
              {/* Week numbers column */}
              <div className="col-span-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-16 flex items-center justify-center border-b border-r" style={{ borderColor: '#E5E7EB', background: '#F9FAFB' }}>
                    <span className="text-[12px]" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#6B7280' }}>Week {i + 1}</span>
                  </div>
                ))}
              </div>
              {/* Days grid */}
              <div className="col-span-7">
                {(() => {
                  // Generate calendar from Jan 5, 2026 to March 12, 2026
                  const startDate = new Date(2026, 0, 5) // January 5, 2026 (month is 0-indexed)
                  const endDate = new Date(2026, 2, 12) // March 12, 2026
                  const firstDay = startDate.getDay() // Day of week for Jan 5 (should be Monday = 1)
                  const totalCells = 70 // 10 weeks * 7 days

                  // Create map of dates to events
                  const eventsByDate = new Map()
                  const allEvents = [...upcomingEvents, ...pastEvents]
                  allEvents.forEach(event => {
                    const eventDate = new Date(event.event_date)
                    const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`
                    if (!eventsByDate.has(dateKey)) {
                      eventsByDate.set(dateKey, [])
                    }
                    eventsByDate.get(dateKey).push(event)
                  })

                  const cells = []
                  let currentMonth = null

                  for (let i = 0; i < totalCells; i++) {
                    const dayOffset = i - firstDay
                    const currentDate = new Date(2026, 0, 5 + dayOffset)
                    const dayNum = currentDate.getDate()
                    const month = currentDate.getMonth()
                    const year = currentDate.getFullYear()
                    const dateKey = `${year}-${month}-${dayNum}`
                    const dayEvents = eventsByDate.get(dateKey) || []
                    const hasEvent = dayEvents.length > 0

                    // Check if date is within range (Jan 5 - March 12, 2026)
                    const isInRange = currentDate >= startDate && currentDate <= endDate

                    // Check if we should show month label (first day of new month in range)
                    const showMonthLabel = isInRange && (currentMonth !== month)
                    if (showMonthLabel) {
                      currentMonth = month
                    }

                    cells.push(
                      <div key={i} className={`h-16 border-b border-r last:border-r-0 flex flex-col items-start justify-start p-2 relative transition-all duration-200 ${hasEvent ? 'hover:bg-blue-50 cursor-pointer' : ''}`} style={{ borderColor: '#E5E7EB', background: 'white' }}>
                        {isInRange && (
                          <>
                            {showMonthLabel && (
                              <div className="absolute top-1 left-1 text-[10px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {['JAN', 'FEB', 'MAR'][month]}
                              </div>
                            )}
                            <span className="text-[12px] font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif', marginTop: showMonthLabel ? '14px' : '0' }}>
                              {dayNum.toString().padStart(2, '0')}
                            </span>
                            {hasEvent && (
                              <>
                                {dayEvents.slice(0, 2).map((event, idx) => (
                                  <div
                                    key={event.id}
                                    className="w-full text-[9px] font-medium truncate mt-0.5 px-1 py-0.5 rounded"
                                    style={{
                                      fontFamily: 'Space Grotesk, sans-serif',
                                      background: '#316EFF',
                                      color: 'white'
                                    }}
                                    title={event.title}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-[8px] text-[#316EFF] font-medium mt-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )
                  }

                  // Group into weeks
                  const weeks = []
                  for (let i = 0; i < 10; i++) {
                    weeks.push(
                      <div key={i} className="grid grid-cols-7">
                        {cells.slice(i * 7, (i + 1) * 7)}
                      </div>
                    )
                  }

                  return weeks
                })()}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Shapes Section */}
      <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
        <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <Footer />
    </div>
  )
}
