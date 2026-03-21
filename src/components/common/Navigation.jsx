import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navigation() {
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isActive = (path) => pathname.startsWith(path) && (path !== '/' || pathname === '/')

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <nav className="bg-transparent relative z-50">
      <div className="max-w-[1728px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center w-auto md:w-[200px]">
          <img src="/assets/flux-logo-blob.png" alt="FLUX" className="h-10 md:h-12 lg:h-14" />
        </Link>

        {/* Navigation Links - Center (Hidden when screen is 670px or less) */}
        <div className="min-[671px]:flex hidden gap-4 xl:gap-10 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="relative pb-2 group">
            <span className={`text-[16px] xl:text-[20px]`} style={{ fontFamily: 'Space Grotesk, sans-serif', color: isActive('/') && pathname === '/' ? '#3164DC' : '#787878', fontWeight: isActive('/') && pathname === '/' ? 600 : 500 }}>
              Home
            </span>
            {isActive('/') && pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#316EFF] rounded-full"></div>
            )}
          </Link>

          <Link to="/about" className="relative pb-2 group">
            <span className={`text-[16px] xl:text-[20px]`} style={{ fontFamily: 'Space Grotesk, sans-serif', color: isActive('/about') || isActive('/alumni') || isActive('/learn') || isActive('/resources') || isActive('/partners') ? '#3164DC' : '#787878', fontWeight: isActive('/about') || isActive('/alumni') || isActive('/learn') || isActive('/resources') || isActive('/partners') ? 600 : 500 }}>
              About
            </span>
            {(isActive('/about') || isActive('/alumni') || isActive('/learn') || isActive('/resources') || isActive('/partners')) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#316EFF] rounded-full"></div>
            )}
          </Link>

          {/* STATIC MODE: Events, Get Involved, Community tabs hidden
          <Link to="/events" className="relative pb-2 group">
            <span className={`text-[16px] xl:text-[20px]`} style={{ fontFamily: 'Space Grotesk, sans-serif', color: isActive('/event') ? '#3164DC' : '#787878', fontWeight: isActive('/event') ? 600 : 500 }}>
              Events
            </span>
            {isActive('/event') && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#316EFF] rounded-full"></div>
            )}
          </Link>

          <Link to="/get-involved" className="relative pb-2 group">
            <span className={`text-[16px] xl:text-[20px]`} style={{ fontFamily: 'Space Grotesk, sans-serif', color: isActive('/get-involved') ? '#3164DC' : '#787878', fontWeight: isActive('/get-involved') ? 600 : 500 }}>
              Get Involved
            </span>
            {isActive('/get-involved') && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#316EFF] rounded-full"></div>
            )}
          </Link>

          <Link to="/community" className="relative pb-2 group">
            <span className={`text-[16px] xl:text-[20px]`} style={{ fontFamily: 'Space Grotesk, sans-serif', color: (isActive('/community') || isActive('/member')) ? '#3164DC' : '#787878', fontWeight: (isActive('/community') || isActive('/member')) ? 600 : 500 }}>
              Community
            </span>
            {(isActive('/community') || isActive('/member')) && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#316EFF] rounded-full"></div>
            )}
          </Link>
          */}
        </div>

        {/* Right Side - Icons & Login Button */}
        <div className="flex items-center gap-2 w-auto justify-end">
          {/* Social Icons - Hidden on smaller screens */}
          <a href="https://discord.com/invite/m2jE9Ng58y" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center justify-center w-10 h-10 hover:opacity-80 transition">
            <img src="/assets/discord-icon.png" alt="Discord" className="w-7 h-7 object-contain" style={{ filter: 'grayscale(100%) opacity(0.5)' }} />
          </a>
          <a href="https://www.instagram.com/scadflux/?hl=en" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center justify-center w-10 h-10 hover:opacity-80 transition">
            <img src="/assets/instagram-icon.png" alt="Instagram" className="w-7 h-7 object-contain" style={{ filter: 'grayscale(100%) opacity(0.5)' }} />
          </a>

          {/* Join FLUX Button */}
          <div className="min-[671px]:flex hidden items-center gap-2">
            <a
              href="mailto:scadflux@gmail.com?subject=FLUX%20Membership%20Request"
              className="px-6 py-3 bg-[#316EFF] text-white text-[16px] xl:text-[20px] font-medium rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Join FLUX
            </a>
          </div>

          {/* Hamburger Menu Button - Shows only when screen is 670px or less */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="max-[670px]:flex hidden flex-col justify-center items-center w-8 h-8 gap-1.5 z-[10001] relative"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-[#787878] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[#787878] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[#787878] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Shows only when screen is 670px or less */}
      <div className={`max-[670px]:block hidden fixed inset-0 bg-white z-[9999] transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-8 relative z-[10000]">
          {/* Mobile Navigation Links - Right Aligned */}
          <div className="flex flex-col gap-6 mb-8 items-end w-full">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-[24px] py-3 border-b border-gray-200 w-full text-right"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                color: isActive('/') && pathname === '/' ? '#316EFF' : '#787878',
                fontWeight: isActive('/') && pathname === '/' ? 600 : 500
              }}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="text-[24px] py-3 border-b border-gray-200 w-full text-right"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                color: isActive('/about') || isActive('/alumni') || isActive('/learn') || isActive('/resources') || isActive('/partners') ? '#316EFF' : '#787878',
                fontWeight: isActive('/about') || isActive('/alumni') || isActive('/learn') || isActive('/resources') || isActive('/partners') ? 600 : 500
              }}
            >
              About
            </Link>
            {/* STATIC MODE: Events, Get Involved, Community tabs hidden
            <Link
              to="/events"
              onClick={closeMobileMenu}
              className="text-[24px] py-3 border-b border-gray-200 w-full text-right"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                color: isActive('/event') ? '#316EFF' : '#787878',
                fontWeight: isActive('/event') ? 600 : 500
              }}
            >
              Events
            </Link>
            <Link
              to="/get-involved"
              onClick={closeMobileMenu}
              className="text-[24px] py-3 border-b border-gray-200 w-full text-right"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                color: isActive('/get-involved') ? '#316EFF' : '#787878',
                fontWeight: isActive('/get-involved') ? 600 : 500
              }}
            >
              Get Involved
            </Link>
            <Link
              to="/community"
              onClick={closeMobileMenu}
              className="text-[24px] py-3 w-full text-right border-b border-gray-200"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                color: (isActive('/community') || isActive('/member')) ? '#316EFF' : '#787878',
                fontWeight: (isActive('/community') || isActive('/member')) ? 600 : 500
              }}
            >
              Community
            </Link>
            */}
          </div>

          {/* Join FLUX Button - Mobile */}
          <div className="flex flex-col gap-4 pt-6 items-end w-full">
            <a
              href="mailto:scadflux@gmail.com?subject=FLUX%20Membership%20Request"
              onClick={closeMobileMenu}
              className="px-6 py-3 bg-[#316EFF] text-white text-[16px] rounded-full"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}
            >
              Join FLUX
            </a>
          </div>

          {/* Social Icons - Right Aligned */}
          <div className="flex flex-col gap-6 pt-6 items-end w-full">
            <div className="w-full flex justify-end items-center gap-4">
              <a href="https://discord.com/invite/m2jE9Ng58y" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 hover:opacity-80 transition">
                <img src="/assets/discord-icon.png" alt="Discord" className="w-6 h-5 object-contain" style={{ filter: 'grayscale(100%) opacity(0.5)' }} />
              </a>
              <a href="https://www.instagram.com/scadflux/?hl=en" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 hover:opacity-80 transition">
                <img src="/assets/instagram-icon.png" alt="Instagram" className="w-6 h-6 object-contain" style={{ filter: 'grayscale(100%) opacity(0.5)' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
