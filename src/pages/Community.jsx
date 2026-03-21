import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
/* STATIC MODE: comment out DB dependencies
import { useQuery } from '@tanstack/react-query'
import { fetchMembers } from '../services/members'
*/
import Navigation from '../components/common/Navigation'
import Footer from '../components/common/Footer'

export default function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('students')
  const [selectedYear, setSelectedYear] = useState(null)

  /* STATIC MODE: comment out live DB query
  const { data: members = [], isLoading: loading, error } = useQuery({
    queryKey: ['members'],
    queryFn: () => fetchMembers(),
    staleTime: 1000 * 60 * 5,
  })
  */
  // STATIC MODE: use empty array
  const members = []
  const loading = false
  const error = null

  // Separate students and alumni
  const students = members.filter(m => !m.is_alumni)
  const alumni = members.filter(m => m.is_alumni)

  // Student year counts (excluding alumni)
  const yearCounts = {
    'SENIOR': members.filter(m => !m.is_alumni && m.year === 'SENIOR').length,
    'MASTERS FIRST-YEAR': members.filter(m => !m.is_alumni && m.year === 'MASTERS FIRST-YEAR').length,
    'JUNIOR': members.filter(m => !m.is_alumni && m.year === 'JUNIOR').length,
    'MASTERS': members.filter(m => !m.is_alumni && m.year === 'MASTERS').length,
    'SOPHOMORE': members.filter(m => !m.is_alumni && m.year === 'SOPHOMORE').length,
    'MASTERS FINAL-YEAR': members.filter(m => !m.is_alumni && m.year === 'MASTERS FINAL-YEAR').length,
    'FRESHMAN': members.filter(m => !m.is_alumni && m.year === 'FRESHMAN').length,
  }

  // Alumni batch counts (graduation years from 2016 to current year)
  const currentYear = new Date().getFullYear()
  const batchCounts = {}
  for (let year = currentYear; year >= 2016; year--) {
    batchCounts[year.toString()] = members.filter(m => m.is_alumni && m.graduation_year === year.toString()).length
  }

  // Filtered members based on active tab and selected filter
  const filteredMembers = activeTab === 'students'
    ? selectedYear
      ? members.filter(m => !m.is_alumni && m.year === selectedYear)
      : students
    : selectedYear
      ? members.filter(m => m.is_alumni && m.graduation_year === selectedYear)
      : alumni

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
        <section className="pt-20 pb-16 text-center">
          <p className="text-[#969696] text-[16px] md:text-[20px] uppercase mb-6 tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 400, lineHeight: '20.74px' }}>
            SCAD'S COOLEST COMMUNITY
          </p>
          <h1 className="text-[36px] md:text-[48px] lg:text-[60px] mb-12 px-4" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, lineHeight: '1.1' }}>
            <span style={{ color: '#242424' }}>Meet the Future Leaders</span><br />
            <span style={{ color: '#242424' }}>of </span><span style={{ color: '#316EFF' }}>User Experience.</span>
          </h1>
        </section>

        <section className="pb-24 flex flex-col lg:flex-row gap-6 lg:gap-6 mt-12 md:mt-16 lg:mt-20">
          {/* Sidebar */}
          <div className="w-full lg:w-[266px] flex flex-col gap-8 lg:gap-[64px]">
            {/* Tabs */}
            <div className="flex justify-center lg:justify-start items-center gap-2">
              <div
                onClick={() => {
                  setActiveTab('students')
                  setSelectedYear(null)
                }}
                className="flex-1 px-5 py-2.5 rounded-full cursor-pointer flex justify-center items-center transition-all duration-300 hover:scale-105"
                style={{
                  background: activeTab === 'students' ? '#316EFF' : 'white',
                  outline: `2px ${activeTab === 'students' ? '#316EFF' : '#B2B2B2'} solid`,
                  outlineOffset: '-2px'
                }}
              >
                <div className="text-[14px] md:text-[16px] font-bold whitespace-nowrap" style={{ color: activeTab === 'students' ? 'white' : '#B2B2B2', fontFamily: 'Space Grotesk' }}>Students</div>
              </div>
              <div
                onClick={() => {
                  setActiveTab('alumni')
                  setSelectedYear(null)
                }}
                className="flex-1 px-5 py-2.5 rounded-full cursor-pointer flex justify-center items-center transition-all duration-300 hover:scale-105"
                style={{
                  background: activeTab === 'alumni' ? '#316EFF' : 'white',
                  outline: `2px ${activeTab === 'alumni' ? '#316EFF' : '#B2B2B2'} solid`,
                  outlineOffset: '-2px'
                }}
              >
                <div className="text-[14px] md:text-[16px] font-bold whitespace-nowrap" style={{ color: activeTab === 'alumni' ? 'white' : '#B2B2B2', fontFamily: 'Space Grotesk' }}>Alumni</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <div className="w-full rounded-md flex flex-col">
                  {activeTab === 'students' ? (
                    // Student year filters
                    [
                      { name: 'SENIOR', count: yearCounts['SENIOR'] },
                      { name: 'MASTERS FIRST-YEAR', count: yearCounts['MASTERS FIRST-YEAR'] },
                      { name: 'JUNIOR', count: yearCounts['JUNIOR'] },
                      { name: 'MASTERS', count: yearCounts['MASTERS'] },
                      { name: 'SOPHOMORE', count: yearCounts['SOPHOMORE'] },
                      { name: 'MASTERS FINAL-YEAR', count: yearCounts['MASTERS FINAL-YEAR'] },
                      { name: 'FRESHMAN', count: yearCounts['FRESHMAN'] }
                    ].map((filter, i, array) => (
                      <div
                        key={i}
                        onClick={() => setSelectedYear(selectedYear === filter.name ? null : filter.name)}
                        className="h-[45px] flex justify-between items-center cursor-pointer px-2 rounded transition-all duration-300 hover:bg-gray-50 hover:pl-3"
                        style={{
                          backgroundColor: selectedYear === filter.name ? '#F0F4FF' : 'transparent',
                          borderBottom: i < array.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}
                      >
                        <div className="text-[14px] md:text-[16px] uppercase tracking-wide transition-colors duration-300" style={{ color: selectedYear === filter.name ? '#316EFF' : 'black', fontFamily: 'Space Grotesk, sans-serif', fontWeight: selectedYear === filter.name ? 600 : 400 }}>{filter.name}</div>
                        <div className="text-[14px] md:text-[16px] uppercase transition-colors duration-300" style={{ color: selectedYear === filter.name ? '#316EFF' : 'black', fontFamily: 'Space Grotesk, sans-serif', fontWeight: selectedYear === filter.name ? 600 : 400 }}>{filter.count}</div>
                      </div>
                    ))
                  ) : (
                    // Alumni batch filters (graduation years)
                    Object.keys(batchCounts).map((year, i, array) => (
                      <div
                        key={i}
                        onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                        className="h-[45px] flex justify-between items-center cursor-pointer px-2 rounded transition-all duration-300 hover:bg-gray-50 hover:pl-3"
                        style={{
                          backgroundColor: selectedYear === year ? '#F0F4FF' : 'transparent',
                          borderBottom: i < array.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}
                      >
                        <div className="text-[14px] md:text-[16px] tracking-wide transition-colors duration-300" style={{ color: selectedYear === year ? '#316EFF' : 'black', fontFamily: 'Space Grotesk, sans-serif', fontWeight: selectedYear === year ? 600 : 400 }}>Class of {year}</div>
                        <div className="text-[14px] md:text-[16px] transition-colors duration-300" style={{ color: selectedYear === year ? '#316EFF' : 'black', fontFamily: 'Space Grotesk, sans-serif', fontWeight: selectedYear === year ? 600 : 400 }}>{batchCounts[year]}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <a
              href="mailto:scadflux@gmail.com?subject=FLUX%20Membership%20Request"
              className="w-full px-5 py-3 md:py-4 bg-black rounded-full flex justify-center items-center hover:bg-gray-800 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="text-white text-[14px] md:text-[16px]" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>Join FLUX</div>
            </a>
          </div>

          {/* Member Grid */}
          <div className="flex-1">
            {activeTab === 'students' ? (
              error ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-[16px] md:text-[18px] text-red-500 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Failed to load members
                    </p>
                    <p className="text-[14px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Please try again later
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Loading members...
                    </p>
                  </div>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Member directory coming soon
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => navigate(`/member/${member.id}`)}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group"
                    >
                      <div className="aspect-square bg-[#E5E7EB] relative overflow-hidden">
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        {member.is_flux_team && (
                          <div className="absolute top-3 right-3 bg-gradient-to-br from-[#316EFF] to-[#2557CC] text-white text-[11px] md:text-[13px] px-4 py-2 rounded-full font-bold shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>
                            FLUX TEAM
                          </div>
                        )}
                      </div>
                      <div className="p-5 md:p-6 min-h-[120px] flex flex-col">
                        <h3 className="text-[18px] md:text-[20px] font-bold text-[#31353E] tracking-[0.4px] mb-2 transition-colors duration-300 group-hover:text-[#316EFF] line-clamp-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{member.name}</h3>
                        <p className="text-[12px] md:text-[14px] text-[#787878] tracking-[0.28px] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {member.year} | {member.campus}
                        </p>
                        {member.is_flux_team && member.flux_team_role && (
                          <div className="mt-auto pt-3 border-t border-gray-200">
                            <p className="text-[12px] md:text-[14px] text-[#316EFF] font-normal tracking-[0.28px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                              {member.flux_team_role}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              alumni.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-[16px] md:text-[18px] text-[#787878]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      No alumni members yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {alumni.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => navigate(`/member/${member.id}`)}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group"
                    >
                      <div className="aspect-square bg-[#E5E7EB] relative overflow-hidden">
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[11px] md:text-[13px] px-4 py-2 rounded-full font-bold shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}>
                          🎓 ALUMNI
                        </div>
                      </div>
                      <div className="p-5 md:p-6 min-h-[120px]">
                        <h3 className="text-[18px] md:text-[20px] font-bold text-[#31353E] tracking-[0.4px] mb-2 transition-colors duration-300 group-hover:text-[#316EFF] line-clamp-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{member.name}</h3>
                        {member.graduation_year && (
                          <p className="text-[12px] md:text-[14px] text-[#787878] tracking-[0.28px] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Class of {member.graduation_year}
                          </p>
                        )}
                        <p className="text-[12px] md:text-[14px] text-[#787878] tracking-[0.28px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {member.campus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
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
