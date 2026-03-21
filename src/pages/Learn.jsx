import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { Icon } from '@iconify/react'

export default function Learn() {
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
              Certifications & Learning
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              Professional development programs to accelerate your design career
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Figma Friday Bootcamp */}
            <div>
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="inline-block bg-[#316EFF] text-white px-4 py-2 rounded-full text-[14px] font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                      FIGMA CERTIFICATION
                    </div>
                    <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                      Figma Friday Bootcamp
                    </h2>
                    <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                      <p>
                        A formalized, 9-hour intensive bootcamp that certifies proficiency in industry-standard design tools. This isn't a casual drop-in session—it's structured training that ensures all FLUX members have baseline technical competency.
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex-shrink-0">
                    <div className="bg-white rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
                      <div className="text-center mb-4">
                        <Icon icon="mdi:school" className="text-[56px] mb-2 text-[#316EFF]" />
                        <h3 className="text-[20px] md:text-[24px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                          Digital Badge
                        </h3>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-[#646464] text-center" style={{ fontFamily: 'Space Grotesk' }}>
                        Official SCAD FLUX Certification
                      </p>
                    </div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-[22px] md:text-[26px] font-semibold text-[#242424] mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                    What You'll Learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Figma Design
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Auto-layout, component libraries, design systems
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          FigJam
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Collaborative whiteboarding and brainstorming
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Figma Slides
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Professional presentation design
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Advanced Prototyping
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Animations, interactions, and transitions
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Grid Systems
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Responsive layouts and constraints
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#316EFF] rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Collaboration Tools
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Real-time teamwork and version control
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-8 flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:timer" className="text-[28px] text-[#316EFF]" />
                    <div>
                      <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>Duration</p>
                      <p className="text-[18px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>9 Hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:calendar" className="text-[28px] text-[#316EFF]" />
                    <div>
                      <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>Schedule</p>
                      <p className="text-[18px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>Every Friday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:target" className="text-[28px] text-[#316EFF]" />
                    <div>
                      <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>Format</p>
                      <p className="text-[18px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>Peer-Led Training</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lextant Research Certification */}
            <div>
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-[14px] font-semibold mb-4" style={{ fontFamily: 'Space Grotesk' }}>
                      RESEARCH CERTIFICATION
                    </div>
                    <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                      Lextant Research Certificate
                    </h2>
                    <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                      <p>
                        Partnering with <span className="font-semibold text-purple-600">Lextant</span>, a leading user experience research consultancy, FLUX offers professional certification in research methodology. This validates the rigor of SCAD's research curriculum and distinguishes you from designers who lack formal research training.
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex-shrink-0">
                    <div className="bg-white rounded-2xl p-6 border-2 border-purple-300 shadow-lg">
                      <div className="text-center mb-4">
                        <div className="text-[48px] mb-2">🔬</div>
                        <h3 className="text-[20px] md:text-[24px] font-semibold text-purple-600" style={{ fontFamily: 'Space Grotesk' }}>
                          Professional Credential
                        </h3>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-[#646464] text-center" style={{ fontFamily: 'Space Grotesk' }}>
                        Industry-Recognized Certificate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Curriculum */}
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-[22px] md:text-[26px] font-semibold text-[#242424] mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                    Curriculum
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Contextual Research
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Field studies and ethnographic methods
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Design Methods
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Interviews, surveys, and usability testing
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Discussion Guide Creation
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Structured interview protocols
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-[14px] font-bold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-[16px] md:text-[18px] font-semibold text-[#242424] mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          Insight Translation
                        </h4>
                        <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                          Converting research into actionable design
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Workshops */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Additional Workshops
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300">
                  <Icon icon="mdi:palette" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Adobe XD vs. Figma
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    Critical discourse comparing design tools, analyzing features like prototyping, collaboration, and plugins to help you make informed technical decisions.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300">
                  <Icon icon="mdi:lightbulb" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Design System Bootcamps
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    Learn to build scalable design systems used by companies like Google and Airbnb. Master components, tokens, and documentation.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300">
                  <Icon icon="mdi:chart-bar" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Analytics & Data
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    Understanding user behavior through analytics platforms. Learn to read data and translate insights into design improvements.
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300">
                  <Icon icon="mdi:rocket-launch" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[20px] md:text-[22px] font-semibold text-[#242424] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    Portfolio Reviews
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    Get feedback from industry professionals and FLUX alumni. Learn to present your work and tell compelling stories.
                  </p>
                </div>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12">
              <h2 className="text-[28px] md:text-[36px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                Why Professional Development Matters
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  FLUX functions as a supplemental educational provider, filling gaps in the standard curriculum with rapid, skill-based training. This "shadow curriculum" ensures that students remain on the cutting edge of tool proficiency, often moving faster than formal university syllabi can adapt.
                </p>
                <p>
                  Our peer-led training reinforces the "see one, do one, teach one" model of learning, ensuring that all FLUX members have baseline technical competency while advanced workshops focus on strategy rather than just tooling.
                </p>
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
