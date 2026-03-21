import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { Icon } from '@iconify/react'

export default function About() {
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
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/assets/flux-logo-blob.png" alt="FLUX" className="h-[100px] md:h-[120px] lg:h-[140px]" />
            </div>

            {/* Title */}
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              About FLUX
            </h1>

            {/* Mission Statement */}
            <p className="text-[20px] md:text-[24px] lg:text-[28px] text-[#316EFF] font-medium max-w-4xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.4' }}>
              "From your first class to your first job"
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* What is FLUX */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                What is FLUX?
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  SCAD FLUX—Future Leaders of User Experience—is more than just a student organization. We're a sophisticated pre-professional development community designed to bridge the gap between classroom theory and the rigorous demands of the technology and design industries.
                </p>
                <p>
                  Operating out of both Savannah and Atlanta campuses, FLUX serves as the primary student-led hub for the university's STEM-designated User Experience (UX) Design program, welcoming students from over 40 different majors.
                </p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 text-center">
                <div className="text-[40px] md:text-[48px] font-bold text-[#316EFF] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  300+
                </div>
                <p className="text-[16px] md:text-[18px] text-[#646464] font-medium" style={{ fontFamily: 'Space Grotesk' }}>
                  Active Students
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 text-center">
                <div className="text-[40px] md:text-[48px] font-bold text-[#316EFF] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  40+
                </div>
                <p className="text-[16px] md:text-[18px] text-[#646464] font-medium" style={{ fontFamily: 'Space Grotesk' }}>
                  Different Majors
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 text-center">
                <div className="text-[40px] md:text-[48px] font-bold text-[#316EFF] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  $5K+
                </div>
                <p className="text-[16px] md:text-[18px] text-[#646464] font-medium" style={{ fontFamily: 'Space Grotesk' }}>
                  Prize Pools
                </p>
              </div>
            </div>

            {/* Our History */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                Our History
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  Founded around 2015-2016, FLUX has evolved from a student club into a career accelerator that plays a critical role in maintaining SCAD's reputation as a pipeline for top-tier design talent.
                </p>
                <p>
                  Through events like Fluxathon and SCAD StartUp, industry partnerships with companies like Google and Duolingo, and a robust mentorship program, we've built a community where students don't just learn design—they actively practice it under real industry pressures.
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-8 space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 bg-[#316EFF] rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2015-2016: Foundation
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      FLUX was established as the primary student-led organization for UX Design at SCAD
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 bg-[#316EFF] rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2018-2019: Social Good Era
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Fluxathon focused on mental health and community connection, establishing our ethos of "design for social good"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 bg-[#316EFF] rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2020-2021: Virtual Scaling
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Pivoted to virtual format during COVID-19, partnered with Duolingo, and achieved record attendance
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-3 h-3 bg-[#316EFF] rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2022-Present: Emerging Tech Focus
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Integrated AI and sustainability themes, partnered with Google, and expanded professional development programs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SCADpro Connection */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                Our Connection to SCADpro
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  FLUX maintains a symbiotic relationship with <span className="font-semibold text-[#316EFF]">SCADpro</span>, the university's collaborative design studio that connects students with Fortune 500 clients like Delta, NASA, and Deloitte.
                </p>
                <p>
                  While SCADpro is a credit-bearing, faculty-led consultancy, FLUX serves as its de facto feeder system. Through events like Fluxathon and StartUp, students develop the professional skills—pitching, agile collaboration, and rapid prototyping—that are essential for success in high-stakes SCADpro engagements.
                </p>
                <p>
                  FLUX leadership is often a strong predictor of SCADpro success. Many of our officers go on to lead major SCADpro projects with industry partners like Google, demonstrating the effectiveness of our "battle-testing" approach.
                </p>
              </div>
            </div>

            {/* Awards & Recognition */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                Awards & Recognition
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  FLUX members consistently win global design awards, validating our community's quality on an international stage.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <Icon icon="mdi:trophy" className="text-[40px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      Red Dot Awards
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      SCAD named #1 design university in the Americas by Red Dot for seven consecutive years, driven by student work incubated in FLUX events
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <Icon icon="mdi:star" className="text-[40px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      Indigo Awards
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      FLUX leaders have won prestigious Indigo Awards for innovative design concepts
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <Icon icon="mdi:palette" className="text-[40px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      European Product Design Awards
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Our students regularly win distinctions that rival professional agencies
                    </p>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                    <Icon icon="mdi:briefcase" className="text-[40px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      Industry Placement
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Alumni at Amazon, Google, Microsoft, Lenovo, and Deloitte
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Philosophy */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12">
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                Our Philosophy
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  FLUX operates on principles of <span className="font-semibold text-[#316EFF]">servant leadership</span> and <span className="font-semibold text-[#316EFF]">collaborative design thinking</span>. We believe in:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Vertical Integration:</strong> Upperclassmen and alumni actively mentor incoming students</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Simulation:</strong> Events replicate real-world industry pressures and workflows</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Cross-Disciplinary Collaboration:</strong> Breaking down departmental silos</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Strategic Autonomy:</strong> Student-led management of budgets, partnerships, and events</span>
                  </li>
                </ul>
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
