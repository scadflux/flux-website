import { useState } from 'react'
import { Link } from 'react-router-dom'
/* STATIC MODE: comment out DB dependencies
import { useQuery } from '@tanstack/react-query'
import { fetchMembers } from '../services/members'
import { subscribeToEmailList } from '../services/emailList'
*/
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

export default function GetInvolved() {
  const [selectedTeam, setSelectedTeam] = useState(null)
  /* STATIC MODE: comment out email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  */

  /* STATIC MODE: comment out live DB query
  const { data: allMembers = [], isLoading, error } = useQuery({
    queryKey: ['flux-team-members'],
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5,
  })
  */
  // STATIC MODE: use empty array
  const allMembers = []
  const isLoading = false
  const error = null

  // Filter only FLUX team members
  const fluxTeamMembers = allMembers.filter(member => member.is_flux_team)

  // Helper function to check if a role is an officer role
  const isOfficerRole = (role) => {
    if (!role) return false
    const upperRole = role.toUpperCase()
    const officerKeywords = [
      'PRESIDENT', 'VICE PRESIDENT', 'SECRETARY', 'TREASURER',
      'EVENTS COORDINATOR', 'MARKETING LEAD', 'SOCIAL MEDIA MANAGER',
      'WORKSHOP COORDINATOR', 'COMMUNITY MANAGER', 'OFFICER'
    ]
    return officerKeywords.some(keyword => upperRole.includes(keyword))
  }

  // Count members by team role
  const teamCounts = {
    'OFFICER BOARD': fluxTeamMembers.filter(m => isOfficerRole(m.flux_team_role)).length,
    'UX FACULTY': fluxTeamMembers.filter(m => m.flux_team_role?.toUpperCase().includes('FACULTY') || m.flux_team_role?.toUpperCase().includes('ADVISOR')).length,
    'FIGMA FRIDAYS': fluxTeamMembers.filter(m => m.flux_team_role?.toUpperCase().includes('FIGMA')).length,
    'YEARBOOK COMMITTEE': fluxTeamMembers.filter(m => m.flux_team_role?.toUpperCase().includes('YEARBOOK')).length,
    'MENTORSHIP CENTER': fluxTeamMembers.filter(m => m.flux_team_role?.toUpperCase().includes('MENTOR')).length,
    'CONFLUX': fluxTeamMembers.filter(m => m.flux_team_role?.toUpperCase().includes('CONFLUX')).length,
    '1-DAY VOLUNTEERS': fluxTeamMembers.filter(m => m.flux_team_role?.toUpperCase().includes('VOLUNTEER')).length,
  }

  const teamFilters = [
    { name: 'OFFICER BOARD', count: teamCounts['OFFICER BOARD'] },
    { name: 'UX FACULTY', count: teamCounts['UX FACULTY'] },
    { name: 'FIGMA FRIDAYS', count: teamCounts['FIGMA FRIDAYS'] },
    { name: 'YEARBOOK COMMITTEE', count: teamCounts['YEARBOOK COMMITTEE'] },
    { name: 'MENTORSHIP CENTER', count: teamCounts['MENTORSHIP CENTER'] },
    { name: 'CONFLUX', count: teamCounts['CONFLUX'] },
    { name: '1-DAY VOLUNTEERS', count: teamCounts['1-DAY VOLUNTEERS'] }
  ]

  // Filter members by selected team
  const displayMembers = selectedTeam
    ? fluxTeamMembers.filter(m => {
        if (selectedTeam === 'OFFICER BOARD') {
          return isOfficerRole(m.flux_team_role)
        }
        if (selectedTeam === 'UX FACULTY') {
          return m.flux_team_role?.toUpperCase().includes('FACULTY') || m.flux_team_role?.toUpperCase().includes('ADVISOR')
        }
        // For other teams, check if role includes the first word of the team name
        return m.flux_team_role?.toUpperCase().includes(selectedTeam.split(' ')[0])
      })
    : fluxTeamMembers

  /* STATIC MODE: comment out email subscription handler
  const handleEmailSubscription = async (e) => {
    e.preventDefault()
    setEmailSubmitting(true)
    try {
      await subscribeToEmailList(emailInput, nameInput)
      setEmailSuccess(true)
      setTimeout(() => {
        setEmailModalOpen(false)
        setEmailSuccess(false)
        setEmailInput('')
        setNameInput('')
      }, 2000)
    } catch (error) {
      console.error('Failed to subscribe:', error)
      alert('Failed to subscribe. Please try again.')
    } finally {
      setEmailSubmitting(false)
    }
  }
  */

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
        <img src="/assets/flux-shape-left.png" alt="" className="absolute left-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
        <img src="/assets/flux-shape-right.png" alt="" className="absolute right-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
      </div>

      <div className="relative">
        <Navigation />
      </div>
      {/* Hero Section */}
      <section className="relative" style={{ zIndex: 1 }}>
        <main className="max-w-[1728px] mx-auto px-4 md:px-8">
          <div className="pt-20 pb-24 flex flex-col lg:flex-row justify-center items-center lg:items-end gap-8 lg:gap-[72px]">
            <div className="flex-shrink-0">
              <img src="/assets/getinvolvedlogo.svg" alt="Get Involved" className="w-[180px] lg:w-[222.28px]" />
            </div>

            <div className="flex flex-col gap-4 lg:gap-[21px] w-full max-w-[629px]">
              <div className="text-[#969696] text-[16px] md:text-[20px] uppercase text-center lg:text-left" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '20.74px' }}>
                THE WORLD'S COOLEST CLUB
              </div>
              <div className="text-center lg:text-left">
                <span className="text-[#242424] text-[36px] md:text-[48px] lg:text-[60px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>Our community is built by students like you.</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 lg:gap-[25px]">
                <button className="cursor-pointer px-6 md:px-7 py-3 md:py-4 rounded-full flex justify-center items-center w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ background: '#316EFF' }}>
                  <div className="text-white text-[16px] md:text-[20px] whitespace-nowrap" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>View Opportunities</div>
                </button>
                {/* STATIC MODE: replace email modal button with external form link (update href when live) */}
                <a
                  href="#"
                  className="cursor-pointer px-6 md:px-7 py-3 md:py-4 rounded-full flex justify-center items-center w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:bg-blue-50 no-underline"
                  style={{ outline: '2px #316EFF solid', outlineOffset: '-2px' }}
                >
                  <div className="text-[#316EFF] text-[16px] md:text-[20px] whitespace-nowrap" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500 }}>Join Email List</div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </section>

      <main className="max-w-[1440px] mx-auto px-8 relative" style={{ zIndex: 1 }}>

        <section className="py-16 md:py-20 lg:py-[123px] mt-24 md:mt-32 lg:mt-[236px]" style={{ background: '#316EFF', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
          <div className="max-w-[1728px] mx-auto px-4 md:px-8 lg:px-[101px]">
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-[42px] mb-12 md:mb-16 lg:mb-20">
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-[50px] w-full max-w-[626px] px-4 md:px-0">
                <div className="text-white text-[28px] md:text-[34px] lg:text-[40px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
                  Welcome to FLUX!
                </div>
                <div className="text-white text-[16px] md:text-[18px] lg:text-[21px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400 }}>
                  FLUX is a student-led club and UX community focused on User Experience (UX) at the Savannah College of Art and Design (Savannah Campus). We're a community of designers, thinkers, innovators, and researchers passionate about creative problem solving through design, tech, and empathy.<br/><br/>
                  Founded in 2015—the same year the UX Design major launched—our goal is to build an active UX community and help students grow their skills. We host all kinds of programming, from hands-on workshops and industry talks to employer visits, FLUX hangs, and even a SCAD yearbook, all year round to support the Future Leaders of UX (FLUX).<br/><br/>
                  While most of our members are UX Design majors, we're proud to include students from 30+ other majors like Industrial Design, Service Design, Game & Interactive Design, and Graphic Design.
                </div>
              </div>

              <img src="/assets/ue_3.png" alt="FLUX Community" className="w-full max-w-[500px] lg:max-w-[791px] h-auto aspect-[791/525] rounded-[25px] object-cover px-4 md:px-0" />
            </div>

            <div className="text-center text-white text-[24px] md:text-[28px] lg:text-[32px] mb-12 md:mb-16 lg:mb-[83px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
              How to get involved
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center max-w-7xl mx-auto">
              {[
                { title: 'Sponsor Us with a Donation', desc: 'Make a Donation to Sponsor our community and help power student-led UX programming.', link: '#' },
                { title: 'Become a Member', desc: 'Join our vibrant community and access exclusive events, workshops, and networking opportunities.', link: '/signup' },
                { title: 'Join the FLUX Team', desc: 'Become part of our leadership team and help shape the future of UX at SCAD.', link: '#' },
                { title: 'Volunteer this quarter', desc: 'Grow your skills, at our UX Conference, launched this semester with a series of workshops.', link: '#' }
              ].map((item, i) => (
                <div key={i} className="w-full cursor-default">
                  <div className="h-full min-h-[280px] bg-white rounded-3xl p-8 flex flex-col justify-between relative">
                    {/* Arrow Icon - Top Right */}
                    <div className="absolute top-8 right-8">
                      <svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.09523 21.6142L22.4207 2.2887M22.4207 2.2887H1.71484M22.4207 2.2887V22.9945" stroke="#316EFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-8">
                      <h3 className="text-[#242424] text-[22px] md:text-[24px] mb-3 font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.2' }}>
                        {item.title}
                      </h3>
                      <p className="text-[#646464] text-[16px] md:text-[18px]" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.5' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 mt-16 md:mt-24 lg:mt-[183px]">
          <h2 className="text-center text-[#242424] text-[36px] md:text-[48px] lg:text-[60px] mb-12 md:mb-16 lg:mb-[126px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
            The 25-26 FLUX Team
          </h2>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[47px]">
            {/* Sidebar */}
            <div className="w-full lg:w-[266px] flex flex-col gap-8 lg:gap-[64px]">
              <div className="flex flex-col gap-6">
                <div className="w-full rounded-md flex flex-col">
                  {teamFilters.map((filter, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedTeam(selectedTeam === filter.name ? null : filter.name)}
                      className="h-[45px] flex justify-between items-center cursor-pointer px-2 rounded transition-all duration-300 hover:bg-gray-50 hover:pl-3"
                      style={{
                        backgroundColor: selectedTeam === filter.name ? '#F0F4FF' : 'transparent',
                        borderBottom: i < teamFilters.length - 1 ? '1px solid #E5E7EB' : 'none'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {filter.name === 'UX FACULTY' && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="black" transform="rotate(-26 6 6)"/>
                          </svg>
                        )}
                        {filter.name === 'YEARBOOK COMMITTEE' && (
                          <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6342 12.4985L0 12.5L5.82385 0.5L11.6342 12.4985Z" fill="black"/>
                          </svg>
                        )}
                        <div className="text-[14px] md:text-[16px] uppercase tracking-wide transition-colors duration-300" style={{ color: selectedTeam === filter.name ? '#316EFF' : 'black', fontFamily: 'Space Grotesk, sans-serif', fontWeight: selectedTeam === filter.name ? 600 : 400 }}>
                          {filter.name}
                        </div>
                      </div>
                      <div className="text-[14px] md:text-[16px] uppercase transition-colors duration-300" style={{ color: selectedTeam === filter.name ? '#316EFF' : 'black', fontFamily: 'Space Grotesk, sans-serif', fontWeight: selectedTeam === filter.name ? 600 : 400 }}>
                        {filter.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Loading team members...
                  </p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-[16px] md:text-[18px] text-red-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Failed to load team members
                  </p>
                </div>
              ) : displayMembers.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {selectedTeam ? `No team members found in ${selectedTeam}` : 'No FLUX team members yet. Check back soon!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
                  {displayMembers.map((member) => (
                    <Link key={member.id} to={`/member/${member.id}`} className="flex flex-col gap-4 group cursor-pointer">
                      {/* Member Card */}
                      <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Member Info */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[#31353E] text-[18px] md:text-[20px] group-hover:text-[#316EFF] transition-colors duration-300" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                          {member.name}
                        </div>
                        <div className="text-[#31353E] text-[12px] md:text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>
                          {member.flux_team_role} | {member.year}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Shapes Section */}
      <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
        <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <Footer />

      {/* STATIC MODE: email subscription modal disabled
      {emailModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={() => setEmailModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl md:rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {emailSuccess ? (
              <div className="text-center">
                <div className="text-[48px] mb-4">✓</div>
                <h3 className="text-[24px] md:text-[28px] font-medium text-green-600 mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  Successfully Subscribed!
                </h3>
                <p className="text-[16px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                  You'll receive updates from FLUX
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-[24px] md:text-[28px] font-medium text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  Join Our Email List
                </h2>
                <p className="text-[16px] text-[#787878] mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                  Stay updated with FLUX events, workshops, and opportunities!
                </p>
                <form onSubmit={handleEmailSubscription} className="space-y-4">
                  <div>
                    <label className="block text-[14px] md:text-[16px] font-medium text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#316EFF] transition-colors"
                      placeholder="Your name"
                      style={{ fontFamily: 'Space Grotesk' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] md:text-[16px] font-medium text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      Email <span className="text-[#316EFF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#316EFF] transition-colors"
                      placeholder="your.email@example.com"
                      style={{ fontFamily: 'Space Grotesk' }}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEmailModalOpen(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#242424] rounded-xl hover:bg-gray-50 transition-colors text-[16px] font-medium"
                      style={{ fontFamily: 'Space Grotesk' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={emailSubmitting}
                      className="flex-1 px-6 py-3 bg-[#316EFF] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-lg text-[16px] font-medium"
                      style={{ fontFamily: 'Space Grotesk' }}
                    >
                      {emailSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      */}
    </div>
  )
}
