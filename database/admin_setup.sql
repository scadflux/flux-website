-- Admin Dashboard 설정을 위한 데이터베이스 마이그레이션
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. members 테이블에 is_admin 컬럼 추가 (이미 있다면 무시됨)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. members 테이블에 role 컬럼 추가 (이미 있다면 무시됨)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Member';

-- 3. events 테이블 생성 (이미 있다면 무시됨)
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
 
-- 4. invites 테이블 생성 (이미 있다면 무시됨)
CREATE TABLE IF NOT EXISTS invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    invited_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE
);

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_members_is_admin ON members(is_admin);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_invites_status ON invites(status);
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);

-- 6. Row Level Security (RLS) 정책 설정

-- members 테이블 RLS 활성화
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 모든 인증된 사용자는 members를 읽을 수 있음
CREATE POLICY IF NOT EXISTS "Anyone can view members"
    ON members FOR SELECT
    USING (true);

-- 자기 자신의 프로필은 업데이트 가능
CREATE POLICY IF NOT EXISTS "Users can update own profile"
    ON members FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin만 다른 사용자의 is_admin과 status를 업데이트 가능
CREATE POLICY IF NOT EXISTS "Admins can update any member"
    ON members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM members
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- events 테이블 RLS 활성화
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 모든 사람이 이벤트를 볼 수 있음
CREATE POLICY IF NOT EXISTS "Anyone can view events"
    ON events FOR SELECT
    USING (true);

-- Admin만 이벤트를 생성/수정/삭제 가능
CREATE POLICY IF NOT EXISTS "Admins can manage events"
    ON events FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM members
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- invites 테이블 RLS 활성화
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Admin만 초대를 관리할 수 있음
CREATE POLICY IF NOT EXISTS "Admins can manage invites"
    ON invites FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM members
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- 7. 함수: 최초 Admin 사용자 생성 (특정 이메일을 Admin으로 설정)
-- 아래 이메일을 실제 Admin 이메일로 변경하세요
-- 예시: UPDATE members SET is_admin = true WHERE email = 'your-admin-email@scad.edu';

-- 8. updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- events 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'Admin dashboard setup completed successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update a member to be admin: UPDATE members SET is_admin = true WHERE email = ''your-admin-email@scad.edu'';';
    RAISE NOTICE '2. Restart your application';
    RAISE NOTICE '3. Login with the admin account and navigate to /admin';
END $$;
