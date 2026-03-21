import Navigation from '../../components/common/Navigation'
import Footer from '../../components/common/Footer'
import { Icon } from '@iconify/react'

export default function CONFLUX() {
  const podcastGuests = [
    {
      name: 'Khoi Vinh',
      title: 'Principal Designer, Adobe',
      description: 'Deep dive into design thinking, creative tools democratization, and the role of writing in design practice.',
      topics: ['Design Leadership', 'Adobe Ecosystem', 'Design Philosophy']
    },
    {
      name: 'Sophie Campbell',
      title: 'Writer/Artist, Teenage Mutant Ninja Turtles',
      description: 'Sequential storytelling, visual narrative structure, and collaborative workflows between writers and artists.',
      topics: ['Visual Communication', 'Narrative Design', 'Collaboration']
    },
    {
      name: 'Marcos Martin',
      title: 'Artist, Panel Syndicate',
      description: 'Digital-first distribution models, alternative business strategies, and independent creative platforms.',
      topics: ['Product Distribution', 'Business Models', 'Digital Publishing']
    }
  ]

  const ethicsSeries = [
    {
      title: 'The Changing Face of Ethical Design',
      subtitle: 'Why Responsible Intent Matters Now More Than Ever',
      speaker: 'Andy Vitale',
      description: 'Addressing the growing backlash against dark patterns, addictive algorithms, and privacy violations in modern technology.',
      focus: 'Ethical Foundations'
    },
    {
      title: 'Bring Your Own Seat to the Table',
      subtitle: 'How to Design a Culture of Experience',
      speaker: 'Andy Vitale',
      description: 'Building political agency within corporations and advocating for the value of design to stakeholders.',
      focus: 'Organizational Advocacy'
    },
    {
      title: 'Taking the Leap',
      subtitle: 'Rising from Designer to Design Leader',
      speaker: 'Andy Vitale',
      description: 'Navigating the critical transition from individual contributor to design management and leadership.',
      focus: 'Career Trajectory'
    }
  ]

  const formatTypes = [
    {
      icon: 'mdi:microphone',
      title: 'InFLUX Podcast',
      description: 'Long-form conversations with industry leaders, independent creatives, and design thinkers. Raw, authentic perspectives on design careers.',
      duration: '45-60 min episodes',
      format: 'Asynchronous Audio'
    },
    {
      icon: 'mdi:presentation',
      title: 'Ethics Lecture Series',
      description: 'Curated talks addressing the moral and political dimensions of design work. Moving beyond "how to build" to "what should we build."',
      duration: '60-90 min sessions',
      format: 'Live Webinars'
    },
    {
      icon: 'mdi:forum',
      title: 'Industry Dialogues',
      description: 'Interactive discussions with Fortune 500 design leaders, exploring career narratives, technical challenges, and industry insights.',
      duration: 'Varies by format',
      format: 'Q&A & Panel'
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
            <h1 className="text-[36px] md:text-[48px] lg:text-[60px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.1' }}>
              ConFLUX
            </h1>

            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              Industry conversations, ethical discourse, and professional insights
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-[28px] md:text-[36px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                The Discursive Track
              </h2>
              <div className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] space-y-4" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                <p>
                  ConFLUX represents FLUX's commitment to intellectual discourse beyond hands-on competition. Through podcasts, lecture series, and industry dialogues, we create space for the "why" and "should we" questions that define responsible design practice.
                </p>
                <p>
                  This programming serves as an always-on conference track—asynchronous content that democratizes access to high-level design philosophy and authentic career narratives from students, faculty, and industry leaders.
                </p>
              </div>
            </div>

            {/* Format Types */}
            <h3 className="text-[24px] md:text-[32px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
              Conference Formats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {formatTypes.map((format, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 hover:scale-102">
                  <Icon icon={format.icon} className="text-[48px] mb-4 text-[#316EFF]" />
                  <h4 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    {format.title}
                  </h4>
                  <p className="text-[14px] text-[#787878] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    {format.duration} • {format.format}
                  </p>
                  <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
                    {format.description}
                  </p>
                </div>
              ))}
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
