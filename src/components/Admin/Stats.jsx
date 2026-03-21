import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Admin Dashboard 통계 컴포넌트
 * 멤버, 이벤트, 초대 통계를 시각화
 */
const Stats = ({ stats, loading }) => {
  // FLUX 컬러 팔레트
  const COLORS = {
    primary: '#316EFF',
    secondary: '#3164DC',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gray: '#969696',
    lightGray: '#F3F4F6',
  };

  // 파이차트용 컬러 배열
  const PIE_COLORS = ['#316EFF', '#3164DC', '#60A5FA', '#93C5FD', '#DBEAFE'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flux-blue mx-auto mb-4"></div>
          <p className="text-[#969696]">통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 전체 멤버 */}
        <StatCard
          title="전체 멤버"
          value={stats.totalMembers}
          icon="👥"
          color={COLORS.primary}
          subtitle={`Student: ${stats.studentCount} | Faculty: ${stats.facultyCount} | Alumni: ${stats.alumniCount}`}
        />

        {/* 전체 이벤트 */}
        <StatCard
          title="전체 이벤트"
          value={stats.totalEvents}
          icon="📅"
          color={COLORS.success}
          subtitle={`예정: ${stats.upcomingEvents} | 완료: ${stats.pastEvents}`}
        />

        {/* 전체 초대 */}
        <StatCard
          title="전체 초대"
          value={stats.totalInvites}
          icon="✉️"
          color={COLORS.warning}
          subtitle={`대기: ${stats.pendingInvites} | 수락: ${stats.acceptedInvites}`}
        />

        {/* 활성 멤버 비율 */}
        <StatCard
          title="학생 비율"
          value={`${stats.totalMembers > 0 ? Math.round((stats.studentCount / stats.totalMembers) * 100) : 0}%`}
          icon="🎓"
          color={COLORS.secondary}
          subtitle={`${stats.studentCount} / ${stats.totalMembers} 멤버`}
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 멤버 가입 추세 */}
        <ChartCard title="멤버 가입 추세 (최근 6개월)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.memberTrends}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                stroke="#646464"
                style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
              />
              <YAxis
                stroke="#646464"
                style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontFamily: 'Space Grotesk'
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                name="신규 가입"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 역할별 멤버 분포 */}
        <ChartCard title="역할별 멤버 분포">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.membersByRole}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.membersByRole.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontFamily: 'Space Grotesk'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 멤버 상태 분포 차트 */}
      <ChartCard title="멤버 상태 분포">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: 'Student', count: stats.studentCount },
              { name: 'Faculty', count: stats.facultyCount },
              { name: 'Alumni', count: stats.alumniCount },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              stroke="#646464"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
            />
            <YAxis
              stroke="#646464"
              style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontFamily: 'Space Grotesk'
              }}
            />
            <Bar dataKey="count" fill={COLORS.primary} radius={[8, 8, 0, 0]} name="멤버 수" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

/**
 * 통계 카드 컴포넌트
 */
const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[rgba(120,120,120,0.2)] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-[#969696] text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#242424]" style={{ color }}>{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {subtitle && (
        <p className="text-xs text-[#969696] mt-2 border-t border-[rgba(120,120,120,0.1)] pt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * 차트 카드 컴포넌트
 */
const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-[rgba(120,120,120,0.2)]">
      <h3 className="text-lg font-semibold text-[#242424] mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default Stats;
