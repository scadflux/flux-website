import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

export default function Alumni() {
  const alumni = [
    {
      name: 'Zachra Pradipta',
      role: 'UX Designer',
      company: 'Amazon',
      fluxRole: 'President (2020-2021)',
      image: '/assets/alumni/zachra.jpg',
      story: 'Led FLUX through the critical pandemic transition, pioneering the virtual format that expanded our reach globally. Her leadership during unprecedented times set the foundation for our modern hybrid approach.',
      awards: 'Indigo Award Winner for "Lupa" AR device concept'
    },
    {
      name: 'Angela Martin',
      role: 'Staff User Experience Designer',
      company: 'Lenovo',
      fluxRole: 'Fluxathon Winner 2019',
      image: '/assets/alumni/angela.jpg',
      story: 'Won 1st place at Fluxathon 2019 with a concept centered on connecting communities and bridging differences. Her winning project became a cornerstone portfolio piece.',
      awards: ''
    },
    {
      name: 'Archana Kannan',
      role: 'UX Designer',
      company: 'Deloitte & UBS',
      fluxRole: 'Visual Design Team',
      image: '/assets/alumni/archana.jpg',
      story: 'Exemplified the FLUX-to-SCADpro pipeline, leveraging club experience to secure leadership roles in major corporate engagements before transitioning to industry.',
      awards: ''
    },
    {
      name: 'Quintin Williams',
      role: 'Product Designer',
      company: 'Multiple Roles',
      fluxRole: 'FLUX Officer',
      image: '/assets/alumni/quintin.jpg',
      story: 'Served as Team Co-Lead for SCADpro x Google projects, demonstrating how FLUX leadership translates directly to high-stakes professional opportunities.',
      awards: ''
    },
    {
      name: 'Lara Federspiel',
      role: 'Designer & StartUp Coordinator',
      company: 'SCADpro → Industry',
      fluxRole: 'FLUX Officer & StartUp Coordinator',
      image: '/assets/alumni/lara.jpg',
      story: 'Co-led the 2020 virtual Fluxathon pivot and secured the historic Duolingo partnership. Her event management skills translated directly into professional logistics coordination roles.',
      awards: ''
    },
    {
      name: 'Andrew Goodridge',
      role: 'UX Designer',
      company: 'Multiple Roles',
      fluxRole: 'Medium Publication Editor',
      image: '/assets/alumni/andrew.jpg',
      story: 'Created "LiveWhale," a mental health app that won at Fluxathon 2018. As Editor of SCAD Flux Medium, he built a portfolio of case studies that launched his professional career.',
      awards: ''
    }
  ]

  const companies = [
    { name: 'Amazon', logo: '/assets/companies/amazon.png' },
    { name: 'Google', logo: '/assets/companies/google.png' },
    { name: 'Microsoft', logo: '/assets/companies/microsoft.png' },
    { name: 'Lenovo', logo: '/assets/companies/lenovo.png' },
    { name: 'Deloitte', logo: '/assets/companies/deloitte.png' },
    { name: 'UBS', logo: '/assets/companies/ubs.png' },
    { name: 'Adobe', logo: '/assets/companies/adobe.png' },
    { name: 'Spotify', logo: '/assets/companies/spotify.png' }
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
              Alumni Success Stories
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              From FLUX leadership to industry leaders
            </p>
          </div>
        </section>

        {/* Where FLUX Members Work */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-medium mb-8 text-center" style={{ fontFamily: 'Space Grotesk' }}>
              Where FLUX Members Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {companies.map((company, index) => (
                <div key={index} className="w-full h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                  <div className="text-[18px] md:text-[20px] font-semibold text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    {company.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Alumni */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-medium mb-12 text-center" style={{ fontFamily: 'Space Grotesk' }}>
              Featured Alumni
            </h2>

            <div className="space-y-8">
              {alumni.map((person, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Side - Info */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-[24px] md:text-[28px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                          {person.name}
                        </h3>
                        <p className="text-[18px] md:text-[20px] text-[#316EFF] font-medium mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                          {person.role} at {person.company}
                        </p>
                        <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'DM Sans' }}>
                          {person.fluxRole}
                        </p>
                      </div>

                      <p className="text-[16px] md:text-[18px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                        {person.story}
                      </p>

                      {person.awards && (
                        <div className="inline-block bg-white px-4 py-2 rounded-full">
                          <p className="text-[14px] md:text-[16px] text-[#316EFF] font-medium" style={{ fontFamily: 'Space Grotesk' }}>
                            🏆 {person.awards}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statement */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-[28px] md:text-[36px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
              The FLUX Effect
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#646464] mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
              Research indicates that FLUX leadership is a statistically significant predictor of high-level professional placement and industry readiness. Our alumni outcomes demonstrate that participation in FLUX accelerates career trajectories and opens doors to elite opportunities.
            </p>
            <p className="text-[16px] md:text-[18px] text-[#787878] italic" style={{ fontFamily: 'Space Grotesk' }}>
              "FLUX is not merely a club; it's a career accelerator."
            </p>
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
