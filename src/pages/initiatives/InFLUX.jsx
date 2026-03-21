import Navigation from '../../components/common/Navigation'
import Footer from '../../components/common/Footer'

export default function InFLUX() {
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
              <img src="/assets/influx-logo.png" alt="inFLUX" className="h-[80px] md:h-[100px] lg:h-[120px]" />
            </div>

            {/* Title */}
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              fluxcore
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto mb-8" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              The most unserious corner of the internet
            </p>

            {/* Podcast Platforms */}
            <div className="flex justify-center gap-4 mt-8">
              <a
                href="https://open.spotify.com/show/300FcmRPc5Pe92SdTYFH6A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-full hover:bg-[#1ed760] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Spotify
              </a>
              <a
                href="https://podcasts.apple.com/us/podcast/fluxcore/id1843948513"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#9933CC] text-white rounded-full hover:bg-[#b44de6] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818-5.423 0-9.818-4.395-9.818-9.818 0-5.423 4.395-9.818 9.818-9.818zM12 5.727a6.273 6.273 0 100 12.546 6.273 6.273 0 000-12.546zm0 2.182a4.091 4.091 0 110 8.182 4.091 4.091 0 010-8.182zm0 1.636a2.455 2.455 0 100 4.91 2.455 2.455 0 000-4.91z"/>
                </svg>
                Apple Podcasts
              </a>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* About Section */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                About fluxcore
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>fluxcore, aka the most unserious corner of the internet is a podcast produced by SCAD FLUX. We talk about design, UX, and more. Each episode contains a casual, chill vibe with student hot takes. We aim to bring the wondrous world of design back down to earth.</p>
              </div>
            </div>

            {/* Episodes Section */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                Latest Episodes
              </h2>
              <div className="space-y-6">
                {/* Episode 4 */}
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-[#316EFF] transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img src="/assets/fluxcore-logo.png" alt="Episode 4" className="w-full md:w-32 h-32 object-cover rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[12px] md:text-[14px] text-[#787878] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>Nov 2 • 57 min</span>
                          <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#242424] mt-1" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.2' }}>
                            EP 4 - Hmm...something's off
                          </h3>
                          <p className="text-[14px] md:text-[16px] text-[#316EFF] italic mt-1" style={{ fontFamily: 'Space Grotesk' }}>"I should get my eyes checked..."</p>
                        </div>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                        In this episode, Neha and Arnav talk about their semi-controversial opinions on redesigns, recent big UI changes, and Cracker Barrel.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Episode 3 */}
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-[#316EFF] transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img src="/assets/fluxcore-logo.png" alt="Episode 3" className="w-full md:w-32 h-32 object-cover rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[12px] md:text-[14px] text-[#787878] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>Oct 19 • 1h 7m</span>
                          <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#242424] mt-1" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.2' }}>
                            EP 3 - Where did YOU come from?
                          </h3>
                          <p className="text-[14px] md:text-[16px] text-[#316EFF] italic mt-1" style={{ fontFamily: 'Space Grotesk' }}>"Do you not know how to open a f*king door?"</p>
                        </div>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                        Neha and Arnav are still trapped at The Shed, when a mysterious person finally opens up the door for them. Listen to find out what happens next!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Episode 2 */}
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-[#316EFF] transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img src="/assets/fluxcore-logo.png" alt="Episode 2" className="w-full md:w-32 h-32 object-cover rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[12px] md:text-[14px] text-[#787878] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>Episode 2</span>
                          <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#242424] mt-1" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.2' }}>
                            EP 2 - Is art school worth it?
                          </h3>
                        </div>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                        Exploring the value of art education and what it means for aspiring designers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Episode 1 */}
                <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-[#316EFF] transition-all duration-300 hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img src="/assets/fluxcore-logo.png" alt="Episode 1" className="w-full md:w-32 h-32 object-cover rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[12px] md:text-[14px] text-[#787878] uppercase tracking-wide" style={{ fontFamily: 'Space Grotesk' }}>Episode 1</span>
                          <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#242424] mt-1" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.2' }}>
                            EP 1 - Welcome to fluxcore
                          </h3>
                        </div>
                      </div>
                      <p className="text-[14px] md:text-[16px] text-[#646464] mb-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                        The debut episode introducing fluxcore and what you can expect from this podcast journey.
                      </p>
                    </div>
                  </div>
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
