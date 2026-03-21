import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

export default function EventCMS() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8">
        <section className="pt-20 pb-16 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-4 md:mb-6" style={{ lineHeight: '1.1' }}>
              Fall Kickoff
            </h1>
            <p className="text-[16px] md:text-[18px] lg:text-[20px] mb-6 md:mb-8" style={{ lineHeight: '1.5' }}>
              Sept 13 | 5:00PM - 7:00PM EDT<br/>
              SCAD BEACH
            </p>
            <p className="text-[18px] md:text-[20px] lg:text-[24px] mb-8 md:mb-10" style={{ lineHeight: '1.4' }}>
              Celebrate the beginning of the quarter with us at our Fall Social! Relax, talk with other members of our community, and enjoy an afternoon of camaraderie.
            </p>
            <button className="bg-black text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-[18px] md:text-[20px] lg:text-[24px]">
              Get involved
            </button>
          </div>
          <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-flux-blue rounded-2xl flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0">
            <svg className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" />
              <path d="M35 50 L50 35 L65 50 L50 65 Z" fill="currentColor" />
            </svg>
          </div>
        </section>

        <section className="pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-[#E5E7EB] rounded-xl overflow-hidden">
              <img src={`/assets/ue_${(i % 4) + 1}.png`} alt={`Event photo ${i+1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <h2 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-12 md:mb-14 lg:mb-16" style={{ lineHeight: '1.1' }}>
            Presenters / Organizers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            <div className="text-center">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-[#E5E7EB] rounded-full mx-auto mb-4 md:mb-6 overflow-hidden">
                <img src="/assets/ue_1.png" alt="Corey West" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-[#31353E] tracking-[0.64px]">Corey West</h3>
            </div>
            <div className="w-40 h-40 md:w-48 md:h-48 bg-[#E5E7EB] rounded-full mx-auto overflow-hidden">
              <img src="/assets/ue_2.png" alt="Organizer" className="w-full h-full object-cover" />
            </div>
            <div className="w-40 h-40 md:w-48 md:h-48 bg-[#E5E7EB] rounded-full mx-auto overflow-hidden">
              <img src="/assets/ue_3.png" alt="Organizer" className="w-full h-full object-cover" />
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
