import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

export default function CommunityCompany() {
  const companies = [
    { name: 'GOOGLE', count: 29, active: true },
    { name: 'AMAZON', count: 21, active: false },
    { name: 'MICROSOFT', count: 29, active: false },
    { name: 'META', count: 29, active: false },
    { name: 'LENOVO', count: 2, active: false },
    { name: 'ADOBE', count: 29, active: false },
    { name: 'INTUIT', count: 29, active: false },
    { name: 'VISUAL LOGIC', count: 29, active: false },
    { name: 'STATE FARM', count: 29, active: false },
    { name: 'ROCKET MORTGAGE', count: 29, active: false },
    { name: 'HONEYWELL', count: 29, active: false }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8">
        <section className="pt-20 pb-16 text-center">
          <p className="text-[#969696] text-[16px] md:text-[20px] font-medium uppercase mb-6 tracking-wide" style={{ lineHeight: '20.74px' }}>
            SCAD'S COOLEST COMMUNITY
          </p>
          <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-12 px-4" style={{ lineHeight: '1.1' }}>
            <span className="text-[#242424]">Meet the Future Leaders</span><br />
            <span className="text-[#242424]">of </span><span className="text-flux-blue">User Experience.</span>
          </h1>
          <div className="flex justify-center gap-3">
            <button className="bg-flux-blue text-white px-5 md:px-6 py-2 md:py-2.5 rounded-lg text-[14px] md:text-base font-bold">Company</button>
            <button className="border border-gray-300 px-5 md:px-6 py-2 md:py-2.5 rounded-lg text-[14px] md:text-base font-medium">Year</button>
          </div>
        </section>

        <section className="pb-24 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-72 border border-gray-200 rounded-lg p-4 md:p-6 h-fit">
            <div className="space-y-4 md:space-y-5 mb-6">
              {companies.map((company) => (
                <div key={company.name}>
                  <h4 className="text-[#B2B2B2] text-[14px] md:text-base font-bold mb-2 uppercase tracking-[0.32px]">
                    {company.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${company.active ? 'bg-flux-blue' : 'bg-gray-300'}`}></span>
                    <span className="text-black text-[14px] md:text-base uppercase tracking-[0.32px]">{company.count}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full bg-black text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-[14px] md:text-base font-bold">
              Community Submission
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                <div className="aspect-square bg-[#E5E7EB]"></div>
                <div className="p-4">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#31353E] tracking-[0.4px] mb-1">Jon Rodz</h3>
                  <p className="text-[12px] md:text-[14px] text-[#31353E] tracking-[0.28px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Community Outreach Officer | UXDG Senior
                  </p>
                </div>
              </div>
            ))}
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
