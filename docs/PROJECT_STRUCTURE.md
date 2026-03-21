# FLUX UX Website - Project Structure

## Directory Structure

```
flux-ux-website/
├── site/                          # Main React application
│   ├── public/                    # Static assets
│   │   └── assets/               # Images, logos, icons
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── Navigation.jsx    # Site navigation with active states
│   │   │   └── Footer.jsx        # Site footer with social links
│   │   ├── pages/                # Page components (routes)
│   │   │   ├── Home.jsx          # Homepage
│   │   │   ├── Community.jsx     # Community directory
│   │   │   ├── CommunityCompany.jsx  # Company-filtered members
│   │   │   ├── EventCMS.jsx      # Event detail page
│   │   │   ├── Events.jsx        # Events listing
│   │   │   ├── GetInvolved.jsx   # Onboarding page
│   │   │   └── Member.jsx        # Member profile
│   │   ├── App.jsx               # Main app with routing
│   │   ├── main.jsx              # App entry point
│   │   └── index.css             # Global styles (Tailwind + fonts)
│   ├── index.html                # HTML template
│   ├── package.json              # Dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── postcss.config.js         # PostCSS configuration
│   └── eslint.config.js          # ESLint configuration
└── assets/                       # Source design assets (copied to site/public/)

## Tech Stack

- **React 19** - UI library
- **React Router DOM 7** - Client-side routing
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Space Grotesk** - Primary font (Google Fonts)

## Key Features

- 7 fully responsive pages
- Pixel-perfect design implementation
- Consistent 1440px centered layout
- Active navigation state tracking
- Clean component architecture
- Production-ready code

## Development

```bash
cd site
npm install
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Design System

- **Colors**: 
  - Primary Blue: #316EFF
  - Text Dark: #242424
  - Text Medium: #646464, #787878
  - Text Light: #969696, #B2B2B2
- **Typography**: Space Grotesk (400, 500, 600, 700)
- **Spacing**: Consistent 8px/16px/24px/32px rhythm
- **Border Radius**: 8px (rounded-lg), 12px (rounded-xl)
