import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import RSVPModal from '../components/modals/RSVPModal'
import { fetchEventById } from '../services/events'

export default function EventDetail() {
  const { eventId } = useParams()
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false)

  // Sample events for testing (same as in Events.jsx and Home.jsx)
  const sampleEvents = {
    '1': {
      id: '1',
      title: 'Design Thinking Workshop',
      description: 'Join us for an interactive workshop where we explore the fundamentals of design thinking. Learn how to empathize with users, define problems, ideate solutions, prototype rapidly, and test your ideas. Perfect for beginners and experienced designers alike!',
      event_date: '2025-12-15T18:00:00',
      location: 'Arnold Hall, Room 301',
      event_type: 'workshop',
      photo_urls: ['/assets/ue_1.png', '/assets/ue_2.png', '/assets/ue_3.png', '/assets/ue_4.png'],
      organizers: [
        { name: 'Sarah Johnson', image: '/assets/ue_1.png' },
        { name: 'Michael Chen', image: '/assets/ue_2.png' }
      ]
    },
    '2': {
      id: '2',
      title: 'Figma Masterclass',
      description: 'Learn advanced prototyping techniques in Figma from industry professionals. This hands-on session covers component variants, auto-layout mastery, interactive components, and smart animation techniques that will elevate your design workflow.',
      event_date: '2025-12-20T19:00:00',
      location: 'Virtual Event',
      event_type: 'workshop',
      photo_urls: ['/assets/ue_2.png', '/assets/ue_3.png', '/assets/ue_1.png'],
      organizers: [
        { name: 'Emma Davis', image: '/assets/ue_3.png' }
      ]
    },
    '3': {
      id: '3',
      title: 'FLUX Social Night',
      description: 'Connect with fellow UX designers over games, food, and great conversation. This casual networking event is perfect for meeting new people in the FLUX community, sharing experiences, and building lasting friendships.',
      event_date: '2025-12-18T20:00:00',
      location: 'Student Center',
      event_type: 'social',
      photo_urls: ['/assets/ue_3.png', '/assets/ue_4.png', '/assets/ue_1.png', '/assets/ue_2.png'],
      organizers: [
        { name: 'Alex Rivera', image: '/assets/ue_4.png' },
        { name: 'Jordan Lee', image: '/assets/ue_1.png' },
        { name: 'Taylor Kim', image: '/assets/ue_2.png' }
      ]
    }
  }

  const { data: fetchedEvent, isLoading: loading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId),
    enabled: !!eventId,
  })

  // Use sample event if fetch fails or returns null
  const event = fetchedEvent || sampleEvents[eventId]

  // Format event date
  const formattedDate = event ? new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : ''

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
          <p className="text-[#787878] text-[16px] md:text-[20px]" style={{ fontFamily: 'Space Grotesk' }}>Loading event...</p>
        </div>

        {/* Shapes Section */}
        <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
          <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <Footer />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-8" style={{ lineHeight: '1.1' }}>Event Not Found</h1>
          <Link to="/events" className="text-[#316EFF] text-[16px] md:text-[20px]">Back to Events</Link>
        </div>

        {/* Shapes Section */}
        <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
          <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Background Shapes */}
      <div
        className="absolute left-0 w-full pointer-events-none hidden md:block"
        style={{
          zIndex: 0,
          top: '0',
          height: '800px'
        }}
      >
        {/* Left Side Shapes */}
        <img src="/assets/flux-shape-left.png" alt="" className="absolute left-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />

        {/* Right Side Shapes */}
        <img src="/assets/flux-shape-right.png" alt="" className="absolute right-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
      </div>

      {/* Navigation - Above Background */}
      <div className="relative">
        <Navigation />
      </div>

      <main className="relative" style={{ zIndex: 1 }}>
        {/* Event Header Container */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
          {/* Main Container - Centered */}
          <div className="flex flex-col gap-8 md:gap-10 max-w-4xl mx-auto">
            {/* Event Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-[89px]">
              {/* Left: Event Info */}
              <div className="w-full lg:w-[583px] flex flex-col gap-8 md:gap-12 lg:gap-[69px]">
                {/* Title and Date */}
                <div className="flex flex-col gap-3 md:gap-4">
                  <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium text-black" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                    {event.title}
                  </h1>
                  <p className="text-[16px] md:text-[18px] lg:text-[20px] font-normal text-black" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
                    {formattedDate}<br/>{event.location}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[18px] md:text-[20px] lg:text-[24px] font-normal text-black" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.4' }}>
                  {event.description}
                </p>
              </div>

              {/* Right: FLUX Logo with Blue Background */}
              <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] lg:w-[289px] lg:h-[289px] flex-shrink-0">
                {/* Blue rounded square */}
                <div className="absolute w-full h-full bg-[#316EFF] rounded-[12.72px]"></div>

                {/* FLUX Logo centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-[60px] h-[72px] md:w-[70px] md:h-[84px] lg:w-[78px] lg:h-[94px]" viewBox="0 0 78 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.6734 59.2742L21.6394 84.6479C21.6394 95.2133 37.1677 95.2133 37.1677 84.6479L39.5191 25.9746C38.69 8.24328 50.8687 5.33928 52.6483 4.78659C57.5512 3.49063 60.1004 2.99988 65.0009 1.92785C78.2898 -0.492551 80.3267 14.1013 69.6846 16.9672L18.9521 30.2341C-8.15211 37.3738 -0.404647 66.1066 22.6734 59.2742ZM22.6734 59.2742C22.6734 59.2742 20.7103 43.3176 39.0236 38.3268C39.0236 38.3268 47.1641 35.6038 56.0908 33.8576C70.6686 30.2985 73.4369 46.3241 61.0581 49.0542L22.6734 59.2742Z" stroke="white" strokeWidth="2.27359" strokeMiterlimit="10"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* RSVP Button - Aligned Left */}
            <button
              onClick={() => setRsvpModalOpen(true)}
              className="px-8 py-4 md:px-10 md:py-5 rounded-xl border-2 border-[#316EFF] bg-[#316EFF] hover:bg-blue-700 hover:border-blue-700 group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg w-fit self-center lg:self-start"
            >
              <div className="text-[18px] md:text-[20px] lg:text-[24px] font-normal text-white transition-all duration-300" style={{ fontFamily: 'Space Grotesk' }}>
                RSVP for This Event
              </div>
            </button>
          </div>
        </div>

        {/* Photo Dump - Full Width */}
        {event.photo_urls && event.photo_urls.length > 0 && (
          <div className="w-screen overflow-x-auto mt-32 md:mt-48 lg:mt-[300px]">
            <div className="inline-flex justify-start items-center gap-3 md:gap-5 px-4">
              {event.photo_urls.map((img, idx) => (
                <div key={idx} className="overflow-hidden">
                  <img
                    className={`flex-shrink-0 h-[280px] md:h-[350px] lg:h-[450px] ${idx === 0 ? 'w-[280px] md:w-[350px] lg:w-[450px] rounded-[30px] md:rounded-[40px] lg:rounded-[50px]' : idx === 2 ? 'w-[420px] md:w-[525px] lg:w-[675px] rounded-[30px] md:rounded-[40px] lg:rounded-[50px]' : 'w-[280px] md:w-[350px] lg:w-[450px]'}`}
                    src={img}
                    alt={`Event photo ${idx + 1}`}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presenters / Organizers */}
        {event.organizers && event.organizers.length > 0 && (
          <div className="max-w-[1198px] relative mx-auto px-4 md:px-8 mt-24 md:mt-32 lg:mt-[200px] mb-24 md:mb-40 lg:mb-[312px]">
            <div className="text-center text-black text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-12 md:mb-16 lg:mb-20" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              Presenters / Organizers
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-[19px] justify-items-center">
              {event.organizers.map((organizer, index) => (
                <div key={index} className="w-full max-w-[360px] h-[380px] md:h-[420px] lg:h-[443px] relative">
                  <div className="w-full h-full bg-zinc-100 rounded-xl absolute"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-neutral-700 text-[20px] md:text-[24px] lg:text-[28px] font-bold tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>
                    {organizer.name}
                  </div>
                  {/* White circle border */}
                  <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] lg:w-[260px] lg:h-[260px] bg-white rounded-full absolute left-1/2 top-[24px] md:top-[28px] lg:top-[32px] -translate-x-1/2 flex items-center justify-center shadow-lg overflow-hidden">
                    {/* Profile image inside white circle */}
                    <img className="w-[170px] h-[170px] md:w-[200px] md:h-[200px] lg:w-[220px] lg:h-[220px] rounded-full object-cover" src={organizer.image} alt={organizer.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Shapes Section */}
      <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
        <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <Footer />

      {/* RSVP Modal */}
      {event && (
        <RSVPModal
          isOpen={rsvpModalOpen}
          onClose={() => setRsvpModalOpen(false)}
          event={event}
        />
      )}
    </div>
  )
}
