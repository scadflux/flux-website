import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { Icon } from '@iconify/react'

export default function Partners() {
  const corporatePartners = [
    {
      name: 'Google',
      type: 'Event Sponsor & Workshop Partner',
      description: 'Sponsors the AI Design Competition (Fluxathon 2025) and provides workshop facilitators.',
      impact: 'Workshop Leadership, Event Sponsorship, Career Pipeline'
    },
    {
      name: 'Duolingo',
      type: 'Virtual Event Partner',
      description: 'Partnered for the 2020-2021 virtual Fluxathon, providing prompts and mentorship that helped FLUX navigate the pandemic transition and achieve record attendance.',
      impact: 'Virtual Format Innovation, Global Reach Expansion'
    },
    {
      name: 'Lextant',
      type: 'Research Certification Partner',
      description: 'Leading user experience research consultancy that partners with FLUX to offer professional certifications in research methodology, validating SCAD\'s curriculum rigor.',
      impact: 'Professional Credentials, Research Training'
    },
    {
      name: 'Deloitte',
      type: 'Industry Partner & Employer',
      description: 'FLUX members often move into roles at Deloitte Digital, demonstrating the effectiveness of our career pipeline.',
      impact: 'Corporate Projects, Alumni Employment'
    },
    {
      name: 'SCADamp',
      type: 'Pitch Coaching Partner',
      description: 'Provides professional coaches during Fluxathon to help teams refine their pitches and presentations, bringing real-world startup accelerator expertise.',
      impact: 'Pitch Training, Presentation Skills'
    }
  ]

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
        {/* Hero Section */}
        <section className="py-20 md:py-28 lg:py-32">
          <div className="text-center mb-12 md:mb-16">
            {/* Title */}
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              Partners & Sponsors
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              Collaborating with industry leaders to bridge the gap between education and professional practice
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Corporate Partners */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Corporate Partners
              </h2>
              <p className="text-[16px] md:text-[18px] text-[#646464] mb-8" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                Our corporate partnerships provide students with direct access to industry expertise, professional mentorship, and career opportunities. These collaborations ensure that FLUX operates at the cutting edge of design practice.
              </p>

              <div className="space-y-6">
                {corporatePartners.map((partner, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-blue-300 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-[24px] md:text-[28px] font-semibold text-[#316EFF] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                          {partner.name}
                        </h3>
                        <p className="text-[14px] md:text-[16px] text-[#787878] font-medium mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                          {partner.type}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="px-4 py-2 bg-white text-[#316EFF] text-[12px] md:text-[14px] rounded-full font-semibold border-2 border-gray-200">
                          Active Partner
                        </span>
                      </div>
                    </div>
                    <p className="text-[16px] md:text-[18px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                      {partner.description}
                    </p>
                    <div className="pt-4 border-t-2 border-gray-100">
                      <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                        <span className="font-semibold">Impact:</span> {partner.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partnership Impact */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Partnership Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                  <Icon icon="mdi:school" className="text-[48px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#316EFF] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Professional Development
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Industry workshops, certifications, and mentorship programs
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                  <Icon icon="mdi:briefcase" className="text-[48px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#316EFF] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Career Pipeline
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Direct pathways to internships and full-time roles at partner companies
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                  <Icon icon="mdi:rocket-launch" className="text-[48px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#316EFF] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Real-World Projects
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Experience working on actual business challenges with industry feedback
                  </p>
                </div>
              </div>
            </div>

            {/* Partner with Us CTA */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-[28px] md:text-[36px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                Interested in Partnering?
              </h2>
              <p className="text-[16px] md:text-[18px] text-[#646464] mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                We're always looking for opportunities to collaborate with companies who want to engage with talented design students. Partner with FLUX to sponsor events, provide workshops, offer mentorship, or recruit our members.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:flux@scad.edu"
                  className="inline-block px-8 py-4 bg-[#316EFF] text-white rounded-full text-[16px] md:text-[18px] font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-102"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                What Our Partners Say
              </h2>
              <div className="space-y-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
                  <p className="text-[16px] md:text-[18px] text-[#646464] italic mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    "FLUX students bring a unique combination of design thinking, technical proficiency, and professional maturity that's rare to find in undergraduate programs."
                  </p>
                  <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                    — Industry Partner
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8">
                  <p className="text-[16px] md:text-[18px] text-[#646464] italic mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    "The students we've worked with through FLUX have consistently exceeded our expectations. Many have joined our team full-time after graduation."
                  </p>
                  <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                    — Corporate Recruiter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Shapes Section */}
      <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '108px', marginTop: '108px' }}>
        <img src="/assets/shapes.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      <Footer />
    </div>
  )
}
