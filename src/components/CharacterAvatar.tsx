import React from 'react';

interface CharacterAvatarProps {
  id: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function CharacterAvatar({ id, className = '', size = 'sm' }: CharacterAvatarProps) {
  // Sizing mapping helper
  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const currentSize = sizeClasses[size] || 'w-full h-full';

  // SVG emblem renderer based on character ID
  const renderEmblem = () => {
    switch (id) {
      case 'butcher':
        // Billy Butcher: Crossed Crowbars & Neon Laser Eyes
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crossed Crowbars */}
            <path d="M20 80 L80 20 M25 83 L18 76 M75 17 L82 24" stroke="#78716c" strokeWidth="6" strokeLinecap="round" />
            <path d="M80 80 L20 20 M75 83 L82 76 M25 17 L18 24" stroke="#78716c" strokeWidth="6" strokeLinecap="round" />
            
            {/* Beard and shades outline */}
            <path d="M35 48 H65" stroke="#1c1917" strokeWidth="8" strokeLinecap="round" />
            <path d="M30 65 Q50 85 70 65" stroke="#1c1917" strokeWidth="7" fill="none" strokeLinecap="round" />
            
            {/* Piercing Neon Blue Laser Beams */}
            <g filter="url(#glow-blue)">
              <circle cx="38" cy="48" r="5" fill="#06b6d4" />
              <circle cx="62" cy="48" r="5" fill="#06b6d4" />
              <line x1="38" y1="48" x2="10" y2="12" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="62" y1="48" x2="90" y2="12" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
            </g>
            
            <defs>
              <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        );

      case 'hughie':
        // Hughie: Teleportation Speed Rings & Electric Taser Spark
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
            <circle cx="50" cy="50" r="26" stroke="#047857" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="14" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Lightning bolt spark */}
            <path d="M52 22 L35 52 H50 L45 78 L65 46 H50 L52 22Z" fill="#34d399" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        );

      case 'mm':
        // Mother's Milk: Tactical Target & Military Golden Shield
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield Outline */}
            <path d="M25 22 V45 C25 65 50 82 50 82 C50 82 75 65 75 45 V22 L50 14 L25 22Z" fill="#78350f" fillOpacity="0.3" stroke="#eab308" strokeWidth="4" strokeLinejoin="round" />
            
            {/* Gun crosshairs lines */}
            <line x1="50" y1="20" x2="50" y2="76" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="22" y1="46" x2="78" y2="46" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
            
            {/* Central Badge and Star */}
            <circle cx="50" cy="46" r="10" stroke="#facc15" strokeWidth="2" fill="#1e1b4b" />
            <path d="M50 39 L53 44 H59 L54 48 L56 53 L50 50 L44 53 L46 48 L41 44 H47 L50 39Z" fill="#fbbf24" />
          </svg>
        );

      case 'frenchie':
        // Frenchie: Bubbling Chemistry Flask & Gas clouds
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Gaseous nebula background */}
            <path d="M22 68 Q10 40 34 32 T70 30 T75 65 T50 78 Z" fill="#6366f1" fillOpacity="0.25" />
            
            {/* Beaker Flask */}
            <path d="M42 22 H58 V35 L80 72 A6 6 0 0 1 75 80 H25 A6 6 0 0 1 20 72 L42 35 V22Z" stroke="#818cf8" strokeWidth="4.5" strokeLinejoin="round" />
            
            {/* Bubbling liquid inside */}
            <path d="M28 68 C35 64 45 72 55 68 C65 64 71 70 72 68 L75 74 H25 Z" fill="#6366f1" />
            <circle cx="44" cy="54" r="3" fill="#a5b4fc" />
            <circle cx="56" cy="60" r="2.5" fill="#a5b4fc" />
            <circle cx="50" cy="44" r="4.5" fill="#c7d2fe" />
          </svg>
        );

      case 'kimiko':
        // Kimiko: Sharp Feral Razor-Red Claw Marks
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#e11d48" strokeWidth="6.5" strokeLinecap="round" filter="url(#claw-glow)">
              {/* Slash 1 */}
              <path d="M25 25 L45 75" />
              {/* Slash 2 */}
              <path d="M42 16 L62 84" />
              {/* Slash 3 */}
              <path d="M60 25 L80 75" />
            </g>
            <defs>
              <filter id="claw-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        );

      case 'starlight':
        // Starlight: Radiant Multi-pointed Solar Star Logo
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Golden Star Pattern */}
            <circle cx="50" cy="50" r="20" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* The multi pointed star */}
            <path d="M50 8 L55 35 L82 40 L58 48 L72 75 L50 56 L28 75 L42 48 L18 40 L45 35 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
            
            {/* Outer halo accents */}
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
            <circle cx="50" cy="50" r="36" stroke="#fbbf24" strokeWidth="0.75" />
          </svg>
        );

      case 'homelander':
        // Homelander: Red Horizontal Vision Beams and Vought Eagle Crest
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Eagle/Wing Background elements */}
            <path d="M12 28 Q50 36 88 28 L84 45 Q50 52 16 45 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
            <path d="M22 18 L50 26 L78 18 L70 32 L50 34 L30 32 Z" fill="#b91c1c" />
            
            {/* Central Crest */}
            <path d="M55 45 H45 V78 L50 84 L55 78 Z" fill="#facc15" stroke="#eab308" strokeWidth="2" />
            
            {/* Incinerating Red Laser line beams */}
            <g filter="url(#glow-red)">
              <line x1="12" y1="18" x2="88" y2="82" stroke="#ef4444" strokeWidth="4.5" />
              <line x1="88" y1="18" x2="12" y2="82" stroke="#ef4444" strokeWidth="4.5" />
              <circle cx="50" cy="50" r="8" fill="#ffffff" stroke="#ef4444" strokeWidth="3.5" />
            </g>
            <defs>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>
        );

      case 'maeve':
        // Maeve: Glinting Amazonian Sword & Shield
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Heavy Shield backdrop */}
            <circle cx="50" cy="50" r="34" fill="#a16207" fillOpacity="0.2" stroke="#b45309" strokeWidth="4" />
            <circle cx="50" cy="50" r="24" stroke="#d97706" strokeWidth="1.5" />
            
            {/* Broadsword cutting vertically */}
            <path d="M50 14 L55 24 V70 L50 78 L45 70 V24 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
            <path d="M36 68 H64 V72 H36 Z" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
            <path d="M47 72 H53 V86 H47 Z" fill="#334155" />
            
            {/* Sword glint sparkles */}
            <path d="M50 25 L52 30 L57 32 L52 34 L50 39 L48 34 L43 32 L48 30 Z" fill="#ffffff" />
          </svg>
        );

      case 'atrain':
        // A-Train: Supersonic Wings and Speed Trails
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sonic Boom shockwave expanding rings */}
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6 4" transform="rotate(-15 50 50)" />
            <ellipse cx="50" cy="50" rx="26" ry="10" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" transform="rotate(-15 50 50)" />
            
            {/* Fast velocity streaks */}
            <line x1="8" y1="36" x2="72" y2="36" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="16" y1="52" x2="88" y2="52" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="24" y1="68" x2="80" y2="68" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
            
            {/* Glowing speed vector triangle bolt */}
            <path d="M68 34 L88 52 L68 70 L74 52 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        );

      case 'blacknoir':
        // Black Noir: Throwing Shuriken and Ninja Daggers
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shuriken Ninja Star */}
            <g fill="#27272a" stroke="#d4d4d8" strokeWidth="3" strokeLinejoin="round">
              <path d="M50 14 L55 38 L78 38 L58 48 L68 72 L50 56 L32 72 L42 48 L22 38 L45 38 Z" />
            </g>
            
            {/* Core mechanical target eye */}
            <circle cx="50" cy="46" r="6" fill="#18181b" stroke="#ef4444" strokeWidth="2" />
            
            {/* Double crossed Kunai handles */}
            <path d="M15 85 L35 65 M85 85 L65 65" stroke="#71717a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="15" cy="85" r="3" fill="#e4e4e7" />
            <circle cx="85" cy="85" r="3" fill="#e4e4e7" />
          </svg>
        );

      case 'thedeep':
        // The Deep: Golden Neptune Trident and Waves
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Circular waves bottom */}
            <path d="M15 65 Q32.5 55 50 65 T85 65" stroke="#14b8a6" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M22 78 Q36 70 50 78 T78 78" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
            
            {/* Majestic Neptune Trident */}
            <g stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              {/* Shaft */}
              <line x1="50" y1="20" x2="50" y2="82" />
              {/* Outer prongs */}
              <path d="M32 28 C32 44 68 44 68 28" fill="none" />
              {/* Spear points */}
              <path d="M32 28 L32 18 M68 28 L68 18" />
              <path d="M50 20 L50 10" />
            </g>
          </svg>
        );

      case 'sagesister':
        // Sister Sage: Brilliant Mind Network of Nodes (Single eye of providence)
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Glowing Brain network arcs */}
            <path d="M30 35 C30 20 70 20 70 35 C70 45 60 55 50 65 C40 55 30 45 30 35Z" fill="#a855f7" fillOpacity="0.15" />
            
            {/* Eye outline */}
            <path d="M20 50 Q50 25 80 50 Q50 75 20 50Z" stroke="#a855f7" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="12" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="4.5" fill="#e9d5ff" />
            
            {/* Constellation line connectors */}
            <line x1="20" y1="50" x2="5" y2="50" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80" y1="50" x2="95" y2="50" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="25" x2="50" y2="5" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="5" r="3" fill="#e9d5ff" />
            <circle cx="5" cy="50" r="3" fill="#e9d5ff" />
            <circle cx="95" cy="50" r="3" fill="#e9d5ff" />
          </svg>
        );

      default:
        // Default generic emblem for unrecognized/generated hostiles
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full antialiased" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="50,22 74,68 26,68" fill="#bc1a1a" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="50" cy="52" r="5" fill="#facc15" />
            <line x1="50" y1="36" x2="50" y2="44" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center shrink-0 overflow-hidden ${currentSize} ${className}`}>
      {renderEmblem()}
    </div>
  );
}
