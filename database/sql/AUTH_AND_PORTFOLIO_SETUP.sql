-- ============================================================================
-- Authentication and Portfolio Setup for FLUX Website
-- ============================================================================

-- 1. Link members to Supabase Auth users
ALTER TABLE members
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS behance_url TEXT,
ADD COLUMN IF NOT EXISTS dribbble_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS personal_website TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_alumni BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS graduation_year VARCHAR(4),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Create portfolio_items table for member portfolios
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  project_url TEXT,
  tools_used TEXT[],
  category VARCHAR(100), -- UI Design, UX Research, Branding, etc.
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create user_preferences table for settings like dark mode
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  dark_mode BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  profile_visibility VARCHAR(50) DEFAULT 'public', -- public, members_only, private
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_member_id ON portfolio_items(member_id);
CREATE INDEX IF NOT EXISTS idx_members_auth_user_id ON members(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_auth_user_id ON user_preferences(auth_user_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for portfolio_items
-- Anyone can view public portfolios
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolio_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = portfolio_items.member_id
      AND members.is_public = true
    )
  );

-- Members can create their own portfolio items
CREATE POLICY "Members can create own portfolio items" ON portfolio_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = portfolio_items.member_id
      AND members.auth_user_id = auth.uid()
    )
  );

-- Members can update their own portfolio items
CREATE POLICY "Members can update own portfolio items" ON portfolio_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = portfolio_items.member_id
      AND members.auth_user_id = auth.uid()
    )
  );

-- Members can delete their own portfolio items
CREATE POLICY "Members can delete own portfolio items" ON portfolio_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = portfolio_items.member_id
      AND members.auth_user_id = auth.uid()
    )
  );

-- 7. RLS Policies for user_preferences
-- Users can view their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth_user_id = auth.uid());

-- Users can create their own preferences
CREATE POLICY "Users can create own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth_user_id = auth.uid());

-- 8. Create storage bucket for portfolio images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage policies for portfolio images
CREATE POLICY "Anyone can view portfolio images" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own portfolio images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own portfolio images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 10. Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Sample portfolio categories
INSERT INTO portfolio_items (member_id, title, description, image_url, category)
SELECT
  id,
  'Sample Portfolio Item',
  'This is a placeholder portfolio item. Update or delete this after adding your own work.',
  '/assets/portfolio-placeholder.jpg',
  'UI Design'
FROM members
LIMIT 0; -- Don't actually insert, just show structure

COMMENT ON TABLE portfolio_items IS 'Stores portfolio items for FLUX members to showcase their work';
COMMENT ON TABLE user_preferences IS 'Stores user preferences including dark mode and notification settings';