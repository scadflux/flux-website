import Navigation from '../../components/common/Navigation'
import Footer from '../../components/common/Footer'
import { Icon } from '@iconify/react'

export default function Fluxathon() {
  const pastWinners = [
    {
      year: '2024',
      theme: 'Platform Redesign',
      winner: 'Roblox Redesign',
      place: '1st Place',
      members: 'Chloe Landingin (Team Member)',
      month: 'September 2024'
    },
    {
      year: '2023',
      theme: 'Closing the Loop in Circularity',
      winner: 'Tiers',
      place: '2nd Place',
      members: 'Privacy-centric smart home system',
      month: '2023'
    },
    {
      year: '2020',
      theme: 'Virtual/Language Learning',
      winner: 'Duolingo Partnership',
      place: 'First Virtual Fluxathon',
      members: 'Partnership with Duolingo',
      month: '2020'
    },
    {
      year: '2019',
      theme: 'Community Connection',
      winner: 'Angela Martin\'s Team',
      place: '1st Place',
      members: 'Concept: Bridging community differences',
      month: '2019'
    },
    {
      year: '2018',
      theme: 'Mental Health & Social Isolation',
      winner: 'LiveWhale',
      place: 'Winner',
      members: 'Andrew Goodridge & Team',
      month: '2018'
    }
  ]

  const sponsors = [
    { name: 'Google', description: 'AI Design Competition Sponsor (2025)' },
    { name: 'Duolingo', description: 'Virtual Fluxathon Partner (2020-2021)' },
    { name: 'SCADamp', description: 'Pitch coaching and mentorship' }
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
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/assets/fluxathon-logo.png" alt="FLUX-A-THON" className="h-[80px] md:h-[100px] lg:h-[120px]" />
            </div>

            {/* Title */}
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              Fluxathon Design Sprint
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              A weekend-long design hackathon where teams research, prototype, and pitch digital product solutions to industry judges
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* About Section */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                What is Fluxathon?
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  Fluxathon is FLUX's premier event—a design hackathon rooted in the <span className="font-semibold text-[#316EFF]">Design Sprint methodology</span> pioneered by Google Ventures. Unlike traditional engineering hackathons that prioritize functional code, Fluxathon focuses on user research, interaction design, and business viability.
                </p>
                <p>
                  Teams of students work cross-functionally over a weekend to tackle real-world design challenges. The prompts are kept secret until kickoff, forcing teams to rely on their foundational process rather than pre-conceived ideas—just like in the professional world.
                </p>
              </div>
            </div>

            {/* Event Format */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Event Format
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-blue-200 rounded-2xl p-6">
                  <Icon icon="mdi:rocket-launch" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Day 1: Kickoff
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Teams meet, receive the secret prompt, and begin exploration. Google Workshop included.
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-2xl p-6">
                  <Icon icon="mdi:lightning-bolt" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Day 2: Sprint
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Shed Sessions for intensive work time. SCADamp coaches help teams refine pitches.
                  </p>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-2xl p-6">
                  <Icon icon="mdi:trophy" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Day 3: Finals
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Final presentations to industry judges. Winners announced and celebrated.
                  </p>
                </div>
              </div>
            </div>

            {/* Themes Evolution */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Theme Evolution
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start border-l-4 border-[#316EFF] pl-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[20px] md:text-[24px] font-semibold text-[#242424]" style={{ fontFamily: 'Space Grotesk' }}>
                        2025: Artificial Intelligence
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[12px] rounded-full font-semibold">COMPLETED</span>
                    </div>
                    <p className="text-[16px] md:text-[18px] text-[#646464] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      AI design competition sponsored by Google. Exploring the intersection of artificial intelligence and human-centered design.
                    </p>
                    <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                      October 23-25, 2025
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-l-4 border-gray-300 pl-6">
                  <div className="flex-1">
                    <h3 className="text-[20px] md:text-[24px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2022-2023: Circularity & Sustainability
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      "Closing the loop in circularity" - challenging students to design sustainable systems and circular economy solutions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-l-4 border-gray-300 pl-6">
                  <div className="flex-1">
                    <h3 className="text-[20px] md:text-[24px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2020-2021: Virtual Scaling
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Pivoted to fully virtual format during COVID-19. Partnered with Duolingo and achieved record attendance by expanding global reach.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start border-l-4 border-gray-300 pl-6">
                  <div className="flex-1">
                    <h3 className="text-[20px] md:text-[24px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      2018-2019: Social Good Era
                    </h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      Focused on mental health, social isolation, and community connection. Established the ethos of "design for social good."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Past Winners */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Past Winners
              </h2>
              <div className="space-y-6">
                {pastWinners.map((winner, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-blue-300 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-[24px] md:text-[28px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                            {winner.year}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-[#316EFF] text-[12px] md:text-[14px] rounded-full font-semibold">
                            {winner.place}
                          </span>
                        </div>
                        <p className="text-[16px] md:text-[18px] text-[#787878] italic mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                          Theme: {winner.theme}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                          {winner.month}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-[20px] md:text-[24px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                      {winner.winner}
                    </h4>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      {winner.members}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors */}
            <div>
              <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
                Our Sponsors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sponsors.map((sponsor, index) => (
                  <div key={index} className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
                    <h3 className="text-[24px] md:text-[28px] font-bold text-[#316EFF] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                      {sponsor.name}
                    </h3>
                    <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                      {sponsor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Participate */}
            <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 md:p-12">
              <h2 className="text-[28px] md:text-[36px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                Why Participate?
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  Fluxathon simulates the time pressure, cross-functional collaboration, and pitch dynamics of the real world. It's not just about creating a beautiful interface—it's about solving real problems under industry conditions.
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Build Your Portfolio:</strong> Create a showcase-worthy case study in just one weekend</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Network with Industry:</strong> Get feedback from judges at companies like Google and Duolingo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Win Prizes:</strong> Recognition, awards, and potential opportunities with sponsor companies</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#316EFF] flex-shrink-0">•</span>
                    <span><strong>Practice Real Workflows:</strong> Experience the design sprint process used by top tech companies</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center pt-8">
              <button
                className="inline-block px-8 md:px-10 py-4 md:py-5 bg-[#316EFF] text-white rounded-full text-[18px] md:text-[20px] font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-102 hover:shadow-lg"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                Learn More About Fluxathon
              </button>
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
