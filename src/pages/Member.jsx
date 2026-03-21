import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import PortfolioGallery from '../components/portfolio/PortfolioGallery'
import { fetchMemberById } from '../services/members'

export default function Member() {
  const { id } = useParams()
  const [selectedProject, setSelectedProject] = useState(0)
  // No auth system currently - all profiles are read-only
  const isOwner = false

  const { data: member, isLoading, error } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMemberById(id),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
          <p className="text-[#787878]">Loading member...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-[28px] md:text-[36px] lg:text-[40px] font-bold mb-4">Member not found</h1>
          <Link to="/community" className="text-flux-blue text-[16px] md:text-[18px] underline">
            Back to Community
          </Link>
        </main>
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
        <img src="/assets/flux-shape-left.png" alt="" className="absolute left-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
        <img src="/assets/flux-shape-right.png" alt="" className="absolute right-0" style={{ top: '-40px', height: '800px', maxWidth: '30%', objectFit: 'contain', objectPosition: 'top' }} />
      </div>

      <div className="relative">
        <Navigation />
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 relative" style={{ zIndex: 1 }}>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-10 lg:gap-16 max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="w-full lg:w-[500px] lg:flex-shrink-0 order-2 lg:order-1">
              {/* Name */}
              <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-10">
                <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                  {member.name}
                </h1>
                {member.is_alumni && (
                  <div className="flex flex-col gap-1">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[12px] md:text-[14px] font-bold rounded-full shadow-md" style={{ fontFamily: 'Space Grotesk' }}>
                      🎓 ALUMNI
                    </span>
                    {member.graduation_year && (
                      <span className="text-[12px] md:text-[14px] text-[#787878] text-center" style={{ fontFamily: 'Space Grotesk' }}>
                        Class of {member.graduation_year}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bio - Fixed minimum height */}
              <div className="mb-10 md:mb-12 min-h-[120px]">
                <p className="text-[16px] md:text-[18px] lg:text-[20px] font-normal" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                  {member.bio}
                </p>
              </div>

              {/* Major & Minor - Fixed height */}
              <div className="space-y-2 mb-8 min-h-[60px]">
                {member.major && (
                  <p className="text-[14px] md:text-[16px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                    <span className="font-medium text-[#242424]">Major:</span> {member.major}
                  </p>
                )}
                {member.minor && (
                  <p className="text-[14px] md:text-[16px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                    <span className="font-medium text-[#242424]">Minor:</span> {member.minor}
                  </p>
                )}
              </div>

              {/* SNS Buttons */}
              <div className="flex gap-3 mb-6">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 hover:border-[#316EFF] transition-all duration-300 hover:scale-110 hover:bg-blue-50"
                    title="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {member.instagram_url && (
                  <a
                    href={member.instagram_url.startsWith('http') ? member.instagram_url : `https://instagram.com/${member.instagram_url.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 hover:border-[#316EFF] transition-all duration-300 hover:scale-110 hover:bg-blue-50"
                    title="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white border-2 border-gray-300 hover:border-[#316EFF] transition-all duration-300 hover:scale-110 hover:bg-blue-50"
                    title="Email"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Portfolio Button */}
              {member.portfolio_url && (
                <a
                  href={member.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#316EFF] text-white px-7 md:px-9 py-3 md:py-4 rounded-full text-[16px] md:text-[18px] lg:text-[20px] font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  Visit Portfolio
                </a>
              )}
            </div>

            {/* Right: Blue geometric shape with profile */}
            <div className="w-full max-w-[340px] md:max-w-[400px] lg:max-w-[480px] order-1 lg:order-2">
              <div className="relative w-full aspect-square">
                {/* Blue background with angled corners */}
                <div
                  className="absolute w-full h-full bg-[#316EFF] rounded-[30px] md:rounded-[35px] lg:rounded-[40px]"
                  style={{
                    clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'
                  }}
                />

                {/* Profile Image */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[30px] md:rounded-[35px] lg:rounded-[40px]">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    style={{
                      clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)'
                    }}
                  />
                </div>

                {/* Tags */}
                <div className="absolute top-4 md:top-5 lg:top-6 flex flex-col gap-1.5 md:gap-2" style={{ right: '20px' }}>
                  {[member.year, 'UXDG', member.campus, member.location, member.role].map((tag, i) => (
                    <span
                      key={i}
                      className="bg-black text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[12px] md:text-[13px] lg:text-[14px] font-medium text-center whitespace-nowrap"
                      style={{ fontFamily: 'Space Grotesk' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12 md:pb-16 mt-24 md:mt-32 lg:mt-[200px]">
          <PortfolioGallery memberId={member.id} isOwner={isOwner} />

          {/* Legacy projects support - only show if no portfolio items */}
          {!isOwner && member.projects && member.projects.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Legacy Projects</h3>
              <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 justify-center lg:justify-end">
                {member.projects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(index)}
                    className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[14px] md:text-[16px] lg:text-[20px] font-medium transition-all duration-300 hover:scale-105 ${
                      selectedProject === index
                        ? 'bg-[#316EFF] text-white'
                        : 'bg-white text-black border border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    {project.title}
                  </button>
                ))}
              </div>
              <div className="h-[350px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-2xl md:rounded-3xl mb-8 overflow-hidden group cursor-pointer">
                <img
                  src={member.projects[selectedProject].images[0]}
                  alt={`${member.projects[selectedProject].title} showcase`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          )}
        </section>

        {/* Custom Section */}
        {(member.custom_section_title || member.custom_section_description || (member.custom_section_images && member.custom_section_images.length > 0)) && (
          <section className="pb-12 md:pb-16 mt-24 md:mt-32 lg:mt-[200px]">
            {member.custom_section_title && (
              <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-medium text-center mb-6 md:mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                {member.custom_section_title}
              </h2>
            )}
            {member.custom_section_description && (
              <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#787878] text-center max-w-[800px] mx-auto mb-12 md:mb-16 px-4" style={{ fontFamily: 'Space Grotesk' }}>
                {member.custom_section_description}
              </p>
            )}
            {member.custom_section_images && Array.isArray(member.custom_section_images) && member.custom_section_images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {member.custom_section_images.map((image, idx) => (
                  <div
                    key={idx}
                    className="aspect-square cursor-pointer group overflow-hidden rounded-2xl md:rounded-3xl"
                  >
                    <img
                      src={image}
                      alt={`${member.custom_section_title || 'Custom section'} ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Photo Dump Section - Vibe Images */}
        {member.vibe_images && Array.isArray(member.vibe_images) && member.vibe_images.length > 0 && (
          <section className="pb-12 md:pb-16 mt-24 md:mt-32 lg:mt-[300px] mb-24 md:mb-32 lg:mb-[300px]">
            <h2 className="text-[28px] md:text-[36px] font-medium text-center mb-12 md:mb-16" style={{ fontFamily: 'Space Grotesk' }}>
              Vibe Check ✨
            </h2>
            <div className="flex gap-4 md:gap-6 items-center justify-center flex-wrap">
              {member.vibe_images.map((image, idx) => (
                <div
                  key={idx}
                  className="w-[280px] h-[220px] md:w-[350px] md:h-[280px] lg:w-[450px] lg:h-[350px] cursor-pointer group overflow-hidden"
                  style={{
                    transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * (Math.random() * 8 + 2)}deg)`
                  }}
                >
                  <img
                    src={image}
                    alt={`Vibe ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl md:rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Photo Dump Section - Project Images (fallback) */}
        {(!member.vibe_images || member.vibe_images.length === 0) && member.projects && member.projects.length > 0 && member.projects[selectedProject].images.length > 1 && (
          <section className="pb-12 md:pb-16 mt-24 md:mt-32 lg:mt-[300px] mb-24 md:mb-32 lg:mb-[300px]">
            <div className="flex gap-4 md:gap-6 items-center justify-center flex-wrap">
              {member.projects[selectedProject].images.slice(1, 6).map((image, idx) => (
                <div
                  key={idx}
                  className="w-[280px] h-[220px] md:w-[350px] md:h-[280px] lg:w-[450px] lg:h-[350px] cursor-pointer group overflow-hidden"
                  style={{
                    transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * (Math.random() * 8 + 2)}deg)`
                  }}
                >
                  <img
                    src={image}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl md:rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Shapes Section */}
      <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px' }}>
        <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <Footer />
    </div>
  )
}
