import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { fetchEvents } from '../services/events'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)

  // Sample events for testing
  const sampleEvents = [
    {
      id: '1',
      title: 'Design Thinking Workshop',
      description: 'Join us for an interactive workshop.',
      event_date: '2025-12-15T18:00:00',
      location: 'Arnold Hall, Room 301',
      photo_urls: ['/assets/ue_1.png']
    },
    {
      id: '2',
      title: 'Figma Masterclass',
      description: 'Learn advanced prototyping.',
      event_date: '2025-12-20T19:00:00',
      location: 'Virtual Event',
      photo_urls: ['/assets/ue_2.png']
    },
    {
      id: '3',
      title: 'FLUX Social Night',
      description: 'Connect with fellow designers.',
      event_date: '2025-12-18T20:00:00',
      location: 'Student Center',
      photo_urls: ['/assets/ue_3.png']
    },
    {
      id: '4',
      title: 'Portfolio Review',
      description: 'Get feedback on your work.',
      event_date: '2025-12-22T17:00:00',
      location: 'Design Lab',
      photo_urls: ['/assets/ue_4.png']
    }
  ]

  // Fetch upcoming events from Supabase (limit to 4 for homepage)
  const { data: allEvents = sampleEvents, isLoading: loading } = useQuery({
    queryKey: ['events', 'upcoming-home'],
    queryFn: () => fetchEvents({ upcoming: true }),
    staleTime: 1000 * 60 * 5,
    placeholderData: sampleEvents
  })

  const upcomingEvents = allEvents.slice(0, 4)

  const faqData = [
    {
      question: 'How do I become a member?',
      answer: 'Becoming a FLUX member is easy! Simply click on the "Become a Member" button and fill out our membership application form. Once submitted, our team will review your application and get back to you within a few days. Membership is open to all SCAD students interested in UX design and related fields.'
    },
    {
      question: 'How can I help support the club?',
      answer: 'There are many ways to support FLUX! You can sponsor us with a donation, volunteer at our events, join the FLUX team, or simply attend and engage with our workshops and community gatherings. We also welcome partnerships with companies interested in connecting with UX talent.'
    },
    {
      question: 'Can I run an event as a student?',
      answer: 'Absolutely! We encourage student-led initiatives and events. If you have an idea for a workshop, talk, or gathering, reach out to our team. We can help you plan, promote, and execute your event. This is a great opportunity to build leadership skills and contribute to the FLUX community.'
    }
  ]

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Background Shapes - Absolute Position at Top, Behind Everything */}
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

      {/* Hero Section */}
      <section className="relative" style={{ zIndex: 1 }}>
        <main className="max-w-[1728px] mx-auto px-4 md:px-8">
          <div className="pt-20 pb-24 flex flex-col lg:flex-row justify-center items-center lg:items-end gap-8 lg:gap-[72px]">
            <div className="flex-shrink-0">
              <img src="/assets/flux-logo-main.png" alt="FLUX" className="w-[240px] lg:w-[320px]" />
            </div>

            <div className="flex flex-col gap-4 lg:gap-[21px] w-full max-w-[629px]">
              <div className="text-[#969696] text-[16px] lg:text-[20px] uppercase text-center lg:text-left" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '20.74px' }}>
                SCAD'S UX CLUB & COMMUNITY
              </div>
              <div className="text-center lg:text-left">
                <span className="text-[#242424] text-[36px] lg:text-[60px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>The future of UX starts here—and it starts </span>
                <span className="text-[#316EFF] text-[36px] lg:text-[60px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>with you.</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 lg:gap-[15px]">
                {/* STATIC MODE: Our Community button hidden
                <Link to="/community" className="cursor-pointer w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 14, paddingBottom: 14, background: '#316EFF', borderRadius: 43, justifyContent: 'center', alignItems: 'center', gap: 3.24, display: 'flex' }}>
                  <div className="text-white text-[16px] lg:text-[20px] whitespace-nowrap" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Our Community</div>
                </Link>
                */}
                <a href="mailto:scadflux@gmail.com?subject=FLUX%20Membership%20Request" className="cursor-pointer w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 14, paddingBottom: 14, borderRadius: 43, outline: '2px #316EFF solid', outlineOffset: '-2px', justifyContent: 'center', alignItems: 'center', gap: 3.24, display: 'flex' }}>
                  <div className="text-[#316EFF] text-[16px] lg:text-[20px] whitespace-nowrap" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Join FLUX</div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </section>

      <main className="max-w-[1728px] mx-auto px-8">

        {/* Stats */}
        <section className="py-12 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-[45.51px]">
          {[
            { num: '32', label: 'Partners' },
            { num: '678', label: 'Community Members' },
            { num: '353', label: 'Events' }
          ].map(({ num, label }) => (
            <div key={label} className="w-full md:w-[339.66px] h-[134.89px] relative rounded-[29.25px] p-6 md:p-8 flex flex-col justify-center" style={{ outline: '2px solid rgba(120, 120, 120, 0.41)', outlineOffset: '-2px' }}>
              {/* Arrow Icon */}
              <div className="absolute right-6 top-6">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.1528 23.2599L24.8462 1.56653M24.8462 1.56653H1.60327M24.8462 1.56653V24.8095" stroke="black" strokeWidth="3.09906" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Content */}
              <div className="pr-8">
                <div className="text-[#242424] text-[52.01px] break-words mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '53.93px' }}>{num}</div>
                <div className="text-[#242424] text-[19.5px] break-words" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '20.22px' }}>{label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* STATIC MODE: Upcoming Events section hidden
        <section style={{ marginTop: '272.11px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 72, display: 'flex', width: '100%', paddingBottom: '20px' }}>
          <div className="text-center text-black text-[36px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '37.33px' }}>Upcoming events</div>

          <div style={{ width: '100%', maxWidth: '1728px', overflowX: 'auto', overflowY: 'visible', paddingBottom: '20px', overscrollBehaviorX: 'contain' }} className="events-scroll-container">
            {loading ? (
              <div className="text-center text-[#787878] py-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Loading upcoming events...
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center text-[#787878] py-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                No upcoming events. Check back soon!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
                {upcomingEvents.map((event, i) => {
                  const eventDate = new Date(event.event_date)
                  const dateString = eventDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }).toUpperCase()

                  return (
                    <Link key={event.id} to={`/events/${event.id}`} style={{ textDecoration: 'none' }} className="group">
                      <div style={{ position: 'relative', width: '469px', height: '564px', flexShrink: 0 }}>
                        <div style={{ width: '469px', height: '564px', background: '#EAEAEA', borderRadius: i % 2 === 1 ? '50px' : 0, position: 'absolute', top: 0, left: 0 }} />
                        <div style={{ position: 'absolute', width: '405px', left: '32px', top: '60px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 72, display: 'flex' }}>
                          <div style={{ width: '346px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 36, display: 'flex' }}>
                            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'flex' }}>
                              <div className="text-black text-[18px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '24.12px' }}>{event.location}</div>
                              <div className="text-black text-[36px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, lineHeight: '48.24px' }}>{event.title}</div>
                              <div style={{ padding: 6, background: '#6B6B6B', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                                <div className="text-white text-[18px] uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '24.12px' }}>{dateString}</div>
                              </div>
                            </div>
                            <div className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 14, paddingBottom: 14, background: 'black', borderRadius: 43, justifyContent: 'center', alignItems: 'center', gap: 3.24, display: 'inline-flex' }}>
                              <div className="text-white text-[20px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>View Details</div>
                            </div>
                          </div>
                          <img style={{ width: '405px', height: '161px', borderRadius: '13.94px', objectFit: 'cover' }} src={event.photo_urls?.[0] || `/assets/ue_${(i % 4) + 1}.png`} alt={event.title} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
        */}

        {/* FLUX Initiatives */}
        <section className="py-20 md:py-40 lg:py-60">
          {/* Max width: 1728px - 161px left - 161px right = 1406px content area */}
          <div className="max-w-[1406px] mx-auto px-4 md:px-8">
            <h2 className="text-[36px] md:text-[48px] lg:text-[60px] mb-8 lg:mb-12" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
              <span style={{ color: '#316EFF' }}>FLUX </span>
              <span style={{ color: '#000000' }}>Initiatives</span>
            </h2>

            {/* 2-column grid with proper spacing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                {/* Figma Bootcamp */}
                <div className="flex gap-4 items-start pb-8 border-b border-gray-300">
                  <img src="/assets/figmabootcamp.png" alt="Figma Bootcamp" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Figma Bootcamp</h3>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '1.45' }}>A quarterly, three-part bootcamp series designed to help all majors learn and master Figma.</p>
                  </div>
                </div>

                {/* Mentorship Center */}
                <div className="flex gap-4 items-start pb-8 border-b border-gray-300">
                  <img src="/assets/figmamentorship.png" alt="Mentorship Center" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Mentorship Center</h3>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '1.45' }}>Gain feedback and guidance on student projects, portfolio work, and UX advice.</p>
                  </div>
                </div>

                {/* Fluxathon */}
                <div className="flex gap-4 items-start pb-8 border-b border-gray-300 lg:border-b-0 lg:pb-0">
                  <img src="/assets/fluxathon.png" alt="Fluxathon" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Fluxathon</h3>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '1.45' }}>A 24-hour design competition, happening quarterly!</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8">
                {/* Podcast */}
                <div className="flex gap-4 items-start pb-8 border-b border-gray-300">
                  <img src="/assets/influx.png" alt="Podcast" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Podcast</h3>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '1.45' }}>Listen in to find out more about professors, FLUX, industry professionals & alumni.</p>
                  </div>
                </div>

                {/* Conference */}
                <div className="flex gap-4 items-start pb-8 border-b border-gray-300">
                  <img src="/assets/conflux.png" alt="Conference" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Conference</h3>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '1.45' }}>Grow your skills, at our annual Product Design Conference, with speakers & workshops.</p>
                  </div>
                </div>

                {/* Design Agency */}
                <div className="flex gap-4 items-start">
                  <img src="/assets/fluxlab.png" alt="Design Agency" className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Design Agency</h3>
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '1.45' }}>Real-world client projects where students gain hands-on experience designing for actual businesses and organizations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners/Brands */}
        <div className="py-14 -mx-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <img src="/assets/brand.png" alt="Partners and Brands" className="w-full h-auto" />
        </div>

        {/* Programs */}
        <section className="py-20 md:py-40 lg:py-60">
          <div className="grid grid-cols-1 md:grid-cols-2 min-[1400px]:grid-cols-4 justify-center items-start gap-4 md:gap-6 px-4 md:px-8 lg:px-28 max-w-[1600px] mx-auto">
            {[
              {
                title: 'Mentorship',
                desc: 'Need help with a project or tool? Our FLUX Mentors are here to help!',
                logo: '/assets/fluxlab-logo.png',
                link: '/initiatives/fluxlab'
              },
              {
                title: 'Conference',
                desc: 'Grow your skills, at our UK Conference, launched this fall with a series of workshops.',
                logo: '/assets/conflux-logo.png',
                link: '/initiatives/conflux'
              },
              {
                title: 'Podcast',
                desc: 'Grow your skills, at our UK Conference, launched this fall with a series of workshops.',
                logo: '/assets/influx-logo.png',
                link: '/initiatives/influx'
              },
              {
                title: 'Competition',
                desc: 'Grow your skills, at our UK Conference, launched this fall with a series of workshops.',
                logo: '/assets/fluxathon-logo.png',
                link: '/initiatives/fluxathon'
              }
            ].map(({ title, desc, logo, link }, i) => (
              <Link key={i} to={link} className="w-full min-h-[328.72px] relative bg-white rounded-[27.62px] p-[30px] cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group block">
                {/* Arrow Icon */}
                <div className="absolute right-[30px] top-[30px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.79004 28.0713L29.9019 1.95935M29.9019 1.95935H1.93066M29.9019 1.95935V29.9306" stroke="black" strokeWidth="3.73372" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Logo */}
                <img src={logo} alt={title} className="h-[61.31px] mb-5 transition-transform duration-300 group-hover:scale-110" />

                {/* Title */}
                <div className="text-[#242424] text-[19.75px] mb-4 transition-colors duration-300 group-hover:text-[#316EFF]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, lineHeight: '24.12px' }}>
                  {title}
                </div>

                {/* Description */}
                <div className="text-[#787878] text-[17.78px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '24.12px' }}>
                  {desc}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-20 md:pb-40 lg:pb-[530px]">
          <div style={{ width: '100%', position: 'relative' }}>
            <h2
              className="text-[#242424] text-[36px] md:text-[48px] lg:text-[60px] text-center mb-16 md:mb-32 lg:mb-[243px]"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                lineHeight: '1.1'
              }}
            >
              Have a question?
            </h2>

            <div className="max-w-[1374px] mx-auto px-4 md:px-16 lg:px-44">
              {faqData.map((faq, i) => (
                <div key={i} className="group">
                  <div
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingTop: i === 0 ? 0 : '35px',
                      paddingBottom: '35px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3
                        className="text-[#242424] text-[18px] md:text-[24px] lg:text-[28px] pr-4 transition-colors duration-300 group-hover:text-[#316EFF]"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 500,
                          lineHeight: '1.1'
                        }}
                      >
                        {faq.question}
                      </h3>

                      <div style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                        {/* Vertical line - hidden when open */}
                        <div style={{
                          width: '16px',
                          height: '2px',
                          position: 'absolute',
                          left: '4px',
                          top: '11px',
                          background: '#242424',
                          transform: 'rotate(90deg)',
                          opacity: openFaq === i ? 0 : 1,
                          transition: 'opacity 0.3s ease'
                        }} />
                        {/* Horizontal line - always visible */}
                        <div style={{
                          width: '16px',
                          height: '2px',
                          position: 'absolute',
                          left: '4px',
                          top: '11px',
                          background: '#242424'
                        }} />
                      </div>
                    </div>

                    {/* Answer - with smooth expand/collapse animation */}
                    <div style={{
                      maxHeight: openFaq === i ? '500px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease-in-out, margin-top 0.4s ease-in-out',
                      marginTop: openFaq === i ? '20px' : '0'
                    }}>
                      <p
                        className="text-[#787878] text-[16px] md:text-[18px] lg:text-[20px]"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 400,
                          lineHeight: '1.6'
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '1px',
                    background: '#787878'
                  }} />
                </div>
              ))}
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
