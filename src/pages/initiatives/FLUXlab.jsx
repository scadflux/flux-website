import Navigation from '../../components/common/Navigation'
import Footer from '../../components/common/Footer'
import { Icon } from '@iconify/react'

export default function FLUXlab() {
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
              <img src="/assets/fluxlab-logo.png" alt="FLUXlab" className="h-[80px] md:h-[100px] lg:h-[120px]" />
            </div>

            {/* Title */}
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              FLUXlab Mentorship
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              Looking for 1:1 help? Mentorship Center is here for you 🤝
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* About Section */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                What is FLUXlab?
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>FLUXlab Mentorship is a structured program where upperclassmen provide 1:1 peer tutoring to help you succeed in the rigorous UX major. Whether you need feedback on student projects, portfolio work, or general UX advice, our mentors are here to support you through your journey.</p>
                <p>We offer help with anything UX-related—from UI feedback and prototyping to practicing presentations and career guidance. Our mentors visit introductory UX 101 classes to offer live feedback and host weekly tutoring sessions to ensure you have the support you need.</p>
              </div>
            </div>

            {/* What We Offer */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                What We Offer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <Icon icon="mdi:message-text" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    1:1 Peer Tutoring
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Get personalized guidance from experienced upperclassmen who've been through the same challenges
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <Icon icon="mdi:palette" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Portfolio Reviews
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Receive feedback on your portfolio work and learn how to present your projects effectively
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <Icon icon="mdi:microphone" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Presentation Practice
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Practice your presentations in a low-pressure environment and get constructive feedback
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <Icon icon="mdi:school" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    UX 101 Class Visits
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Our mentors visit introductory classes to provide real-time support and guidance
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <Icon icon="mdi:flash" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Project Feedback
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Get help with your coursework, from wireframes to final prototypes
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <Icon icon="mdi:rocket-launch" className="text-[40px] mb-3 text-[#316EFF]" />
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    Career Guidance
                  </h3>
                  <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>
                    Learn about internship opportunities, job applications, and navigating the design industry
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div>
              <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                How to Join
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>Sign up for an in-person or an online appointment using our Calendly booking system!</p>

                {/* Session Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                    <Icon icon="mdi:map-marker" className="text-[32px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>Location</h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>The Shed 104</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                    <Icon icon="mdi:clock-outline" className="text-[32px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>Time</h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>2-5PM</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                    <Icon icon="mdi:calendar" className="text-[32px] mb-3 text-[#316EFF]" />
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>Schedule</h3>
                    <p className="text-[16px] md:text-[18px] text-[#646464]" style={{ fontFamily: 'Space Grotesk' }}>Every Sunday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Become a Mentor */}
            <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 md:p-12">
              <h2 className="text-[28px] md:text-[36px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
                Become a Mentor
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  Are you an upperclassman looking to give back? Join our mentorship program and help guide the next generation of UX designers. Mentors gain valuable leadership experience, teaching skills, and the satisfaction of helping peers succeed.
                </p>
                <p className="font-medium text-[#316EFF]">
                  This program operationalizes our mission to guide students "from their first class to their first job" through vertical integration of mentorship.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center pt-8">
              <a
                href="https://calendly.com/scad-flux/flux-mentorship-center?month=2025-11"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 md:px-10 py-4 md:py-5 bg-[#316EFF] text-white rounded-full text-[18px] md:text-[20px] font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-102 hover:shadow-lg"
                style={{ fontFamily: 'Space Grotesk' }}
              >
                Book a Mentorship Session
              </a>
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
