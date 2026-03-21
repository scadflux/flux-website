import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

export default function Resources() {
  const featuredArticles = [
    {
      title: 'Defining Game UX',
      author: 'Varun',
      category: 'Game UX Series',
      description: 'A comprehensive exploration of the intersection between gaming and user experience design.',
      link: 'https://medium.com/scadflux'
    },
    {
      title: 'The Great Wave of the Quarantine',
      author: 'Zachra Pradipta',
      category: 'Pandemic Response',
      description: 'Tips on survival and remote work during the lockdown, providing peer support during uncertain times.',
      link: 'https://medium.com/scadflux'
    },
    {
      title: 'Breaking the Glass Ceiling Before Entering the Building',
      author: 'Sarah Doncals',
      category: 'Diversity & Inclusion',
      description: 'Documenting the founding of workplace diversity initiatives within FLUX and the design community.',
      link: 'https://medium.com/scadflux'
    },
    {
      title: 'LiveWhale: De-stigmatizing Mental Health Resources',
      author: 'Andrew Goodridge',
      category: 'Case Study',
      description: 'A detailed breakdown of the winning Fluxathon 2018 project that addressed mental health stigma for students.',
      link: 'https://medium.com/scadflux/livewhale-de-stigmatizing-mental-health-resources-for-students-24bf87726653'
    },
    {
      title: 'Service Design: Plastic Bag Levies',
      author: 'Raymond Yiu Nam Wong',
      category: 'Service Design',
      description: 'Analysis of plastic bag levies from a service design perspective, demonstrating engagement with societal issues.',
      link: 'https://medium.com/scadflux'
    },
    {
      title: 'The Next Level',
      author: 'Varun',
      category: 'Game UX Series',
      description: 'Continuing the exploration of game UX design principles and best practices.',
      link: 'https://medium.com/scadflux'
    }
  ]

  const studentWork = [
    {
      title: 'Tiers - Smart Home Privacy System',
      year: '2023',
      award: 'Fluxathon 2nd Place',
      category: 'Circular Economy',
      description: 'Privacy-centric smart home system addressing the circular economy challenge.'
    },
    {
      title: 'Roblox Redesign',
      year: '2024',
      award: 'Fluxathon 1st Place',
      category: 'Platform Redesign',
      description: 'Complete platform redesign focusing on user experience improvements.'
    },
    {
      title: 'Lupa - AR Device Concept',
      year: '2021',
      award: 'Indigo Award Winner',
      category: 'Augmented Reality',
      description: 'Innovative AR device concept by Zachra Pradipta, recognized with international design awards.'
    },
    {
      title: 'Community Connection Platform',
      year: '2019',
      award: 'Fluxathon 1st Place',
      category: 'Social Impact',
      description: 'Angela Martin\'s winning concept for bridging community differences.'
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
              Resources & Showcase
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#787878] max-w-3xl mx-auto" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
              Explore our community's intellectual output, case studies, and award-winning student work
            </p>
          </div>
        </section>

        {/* Medium Publication */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h2 className="text-[28px] md:text-[36px] font-medium mb-4 text-green-700" style={{ fontFamily: 'Space Grotesk' }}>
                    SCAD Flux on Medium
                  </h2>
                  <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    Our Medium publication serves as a repository for written case studies, think-pieces, and professional discourse. Members publish long-form content covering game UX, pandemic response, diversity & inclusion, service design, and detailed case studies of winning Fluxathon projects.
                  </p>
                  <a
                    href="https://medium.com/scadflux"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-4 bg-green-600 text-white rounded-full text-[16px] md:text-[18px] font-medium hover:bg-green-700 transition-all duration-300 hover:scale-102"
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    Read on Medium
                  </a>
                </div>
                <div className="flex-shrink-0">
                  <Icon icon="mdi:book-open-page-variant" className="text-[80px] md:text-[100px] text-[#316EFF]" />
                </div>
              </div>
            </div>

            {/* Featured Articles */}
            <h3 className="text-[24px] md:text-[32px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
              Featured Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {featuredArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-all duration-300 hover:shadow-lg block"
                >
                  <div className="mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[12px] rounded-full font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <h4 className="text-[18px] md:text-[20px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    {article.title}
                  </h4>
                  <p className="text-[14px] text-[#787878] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    By {article.author}
                  </p>
                  <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
                    {article.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* InFLUX Podcast */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h2 className="text-[28px] md:text-[36px] font-medium mb-4 text-purple-700" style={{ fontFamily: 'Space Grotesk' }}>
                    fluxcore Podcast
                  </h2>
                  <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#646464] mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                    Our podcast features interviews with students, faculty, and industry titans, offering raw and authentic perspectives on design careers. Episodes cover everything from Adobe leadership to ethics in UX research, internship realities, and "The Pragmatic Punk's Guide to Leading Design."
                  </p>
                  <Link
                    to="/initiatives/influx"
                    className="inline-block px-8 py-4 bg-purple-600 text-white rounded-full text-[16px] md:text-[18px] font-medium hover:bg-purple-700 transition-all duration-300 hover:scale-102"
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    Listen to Episodes
                  </Link>
                </div>
                <div className="flex-shrink-0">
                  <Icon icon="mdi:microphone" className="text-[80px] md:text-[100px] text-[#316EFF]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student Work Showcase */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[28px] md:text-[36px] font-medium mb-8" style={{ fontFamily: 'Space Grotesk' }}>
              Award-Winning Student Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {studentWork.map((work, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-blue-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-[#316EFF] text-[12px] md:text-[14px] rounded-full font-semibold">
                      {work.award}
                    </span>
                    <span className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk' }}>
                      {work.year}
                    </span>
                  </div>
                  <h3 className="text-[20px] md:text-[24px] font-semibold text-[#242424] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    {work.title}
                  </h3>
                  <p className="text-[14px] text-[#787878] italic mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                    {work.category}
                  </p>
                  <p className="text-[14px] md:text-[16px] text-[#646464]" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.5' }}>
                    {work.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Recognition */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 text-center">
              <h3 className="text-[24px] md:text-[32px] font-medium mb-6 text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                Global Recognition
              </h3>
              <p className="text-[16px] md:text-[18px] text-[#646464] mb-6" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
                FLUX members consistently win global design awards including Red Dot Awards, Indigo Awards, and European Product Design Awards. Our work is regularly featured in international design competitions, validating our community's quality on a global stage.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-[14px] md:text-[16px] font-semibold text-[#316EFF]" style={{ fontFamily: 'Space Grotesk' }}>
                <span className="px-4 py-2 bg-blue-100 rounded-full">Red Dot Awards</span>
                <span className="px-4 py-2 bg-blue-100 rounded-full">Indigo Awards</span>
                <span className="px-4 py-2 bg-blue-100 rounded-full">European Product Design</span>
              </div>
            </div>
          </div>
        </section>

        {/* Browse More */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[24px] md:text-[32px] font-medium mb-6" style={{ fontFamily: 'Space Grotesk' }}>
              Want to See More?
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#646464] mb-8" style={{ fontFamily: 'Space Grotesk', lineHeight: '1.6' }}>
              Explore individual member portfolios in our Community section to see the full range of work produced by FLUX members.
            </p>
            <Link
              to="/community"
              className="inline-block px-8 py-4 bg-[#316EFF] text-white rounded-full text-[16px] md:text-[18px] font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-102"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Browse Community
            </Link>
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
