# FLUX UX Community Website

A modern, beautiful website for the FLUX UX community at SCAD.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173**

## 📁 Project Structure

```
flux-website/
├── src/
│   ├── components/       # React components
│   │   ├── common/       # Navigation, Footer, etc.
│   │   ├── modals/       # Modal dialogs
│   │   └── portfolio/    # Portfolio components
│   ├── pages/            # Page components
│   │   ├── initiatives/  # FLUXlab, CONFLUX, InFLUX, Fluxathon
│   │   └── ...          # Home, Events, Community, etc.
│   ├── services/         # API services (members, events, emailList)
│   ├── contexts/         # React contexts
│   └── lib/             # Supabase client, query client
├── public/              # Static assets (images, fonts)
└── database/            # SQL migration scripts
    └── sql/
```

## 🎨 Current Features

### Public Pages
- **Home** (`/`) - Hero, stats, upcoming events, initiatives showcase, team highlights
- **Events** (`/events`) - Event listings with calendar view
- **Event Details** (`/events/:eventId`) - Individual event pages with RSVP
- **Get Involved** (`/get-involved`) - How to join FLUX
- **Apply** (`/apply`) - Membership application form with portfolio section
- **Community** (`/community`) - Member directory with filters (students/alumni, year, campus)
- **Member Profile** (`/member/:id`) - Individual member profiles with portfolio gallery

### Initiative Pages
- **FLUXlab** (`/initiatives/fluxlab`) - Mentorship program
  - Location: The Shed 104
  - Time: Every Sunday, 2-5PM
- **CONFLUX** (`/initiatives/conflux`) - UX Conference (Coming Fall)
- **InFLUX** (`/initiatives/influx`) - fluxcore Podcast
  - 4 Episodes published
  - Available on Spotify & Apple Podcasts
- **FLUX-A-THON** (`/initiatives/fluxathon`) - Quarterly design competition

### Admin Features
- **Admin Dashboard** (`/admin-manage`) - Password protected
- **Event Management** (`/event-manage`) - Create and manage events
- **Member Management** - Approve/reject applications
- **FLUX Team Management** - Assign team roles and badges

### Member Features
- **Portfolio Gallery** - Showcase projects with images, descriptions, tools, and links
- **Custom Sections** - Personalize profile with custom content and images
- **Vibe Images** - Up to 5 images representing your creative style
- **Profile Customization** - Bio, social links, skills, and more

### Design System
- **Consistent Card Design** - Uniform member cards with proper spacing
- **FLUX Team Badges** - Gradient badges for team members
- **Responsive Layout** - Mobile-first design with breakpoints
- **Space Grotesk Font** - Primary typography
- **Color Palette** - FLUX Blue (#316EFF) as primary brand color

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Email**: Resend API (via Supabase Edge Functions)
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)
- **UI Components**: Heroicons
- **Charts**: Recharts

## 📊 Database Tables

Main tables in Supabase:
- **members** - Member profiles, bios, social links
- **portfolio_items** - Member portfolio projects
- **member_applications** - Pending membership applications
- **events** - Event listings and details
- **event_registrations** - RSVP tracking
- **email_list** - Newsletter subscribers

## 🔧 Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📝 Application Flow

### New Member Joins:
1. Fill out application form (`/apply`)
   - Personal information
   - Bio
   - Optional: Portfolio items (up to 10)
   - Optional: Custom section with images
   - Optional: Vibe images (up to 5)
2. Application stored with status: `pending`
3. Admin reviews in admin dashboard
4. Admin approves → Creates member record + portfolio items
5. Member appears in community directory
6. Confirmation email sent automatically

### Portfolio System:
- Members can add portfolio items during application
- Each item includes:
  - Title, category, description
  - Tools used (comma-separated)
  - Project URL
  - Project image
- Portfolio items are created when application is approved
- Displayed in member profile page (`/member/:id`)
- Hidden if member has no portfolio items

## 🚀 Deployment Checklist

1. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add Supabase credentials

2. **Database Setup**
   - Run migrations from `/database/sql/`
   - Verify all tables exist
   - Check RLS policies are active

3. **Email Configuration**
   - Deploy Supabase Edge Functions
   - Configure Resend API key
   - Test email notifications

4. **Build & Deploy**
   - Run `npm run build`
   - Deploy `/dist` to hosting service
   - Verify environment variables in production

## 🎯 Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/events` | Event listings |
| `/events/:eventId` | Event details |
| `/get-involved` | Join information |
| `/apply` | Application form |
| `/community` | Member directory |
| `/community/:company` | Company-filtered members |
| `/member/:id` | Member profile |
| `/initiatives/fluxlab` | Mentorship program |
| `/initiatives/conflux` | Conference page |
| `/initiatives/influx` | Podcast page |
| `/initiatives/fluxathon` | Competition page |
| `/admin-manage` | Admin dashboard |
| `/event-manage` | Event management |

## 📱 Responsive Design

- **Mobile**: 2-column member grid
- **Tablet (lg)**: 3-column member grid
- **Desktop (xl)**: 4-column member grid
- All cards have consistent height
- Images are optimized and lazy-loaded

## 🤝 Member Card Features

- **FLUX Team Badge**: Gradient badge for team members
- **Team Role Display**: Shows role below member info (e.g., "Vice President")
- **Hover Effects**: Scale and shadow on hover
- **Consistent Height**: All cards maintain same height
- **Name Truncation**: Long names truncated with ellipsis

## ⚡ Performance Optimizations

- Lazy loading for images
- React Query for caching
- Optimistic updates
- Debounced search inputs
- Efficient re-renders with React.memo

## 📄 Documentation

- `README.md` - This file (current features & setup)
- `AUTH_SETUP_GUIDE.md` - Authentication system details (archived)
- `OPTIMIZED_AUTH_SYSTEM.md` - Performance optimizations (archived)

## 📈 Future Enhancements

- Email verification system
- Password reset flow
- Member authentication/login
- Real-time notifications
- Advanced portfolio filtering
- Event calendar integration

---

**Built with ❤️ for FLUX UX at SCAD**
**Current Status**: Active Development
**Version**: 1.0.0
