export default function Footer() {
  const socials = [
    { name: 'Discord', icon: '/assets/discord-under.png', url: 'https://discord.com/invite/m2jE9Ng58y' },
    { name: 'Instagram', icon: '/assets/instagram-under.png', url: 'https://www.instagram.com/scadflux/?hl=en' },
    { name: 'LinkedIn', icon: '/assets/linkedin-under.png', url: 'https://www.linkedin.com/company/scadflux/posts/?feedView=all' },
    // STATIC MODE: GitHub and Figma hidden (no URLs yet)
    // { name: 'GitHub', icon: '/assets/github-under.png', url: '#' },
    // { name: 'Figma', icon: '/assets/figma-under.png', url: '#' },
  ]

  return (
    <footer className="bg-[#F5F5F5]" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
      <div className="max-w-[1728px] mx-auto px-4 md:px-8" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
        {socials.map(({ name, icon, url }) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition">
            <img src={icon} alt={name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </a>
        ))}
      </div>
    </footer>
  )
}