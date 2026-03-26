export default function Avatar({ soundWaveRef }) {
  return (
    <div id="avatar-presenter">
      <div id="avatar-human">
        <svg className="human-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="96" fill="#EBF4FF" stroke="#2ea3f2" strokeWidth="2"/>
          <path d="M60 170 C60 135 75 120 100 120 C125 120 140 135 140 170" fill="#2ea3f2"/>
          <path d="M82 120 L100 135 L118 120" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round"/>
          <circle cx="100" cy="85" r="32" fill="#F5D6B8"/>
          <path d="M68 80 C68 58 82 48 100 48 C118 48 132 58 132 80 C132 72 125 62 100 62 C75 62 68 72 68 80Z" fill="#3A3A3A"/>
          <ellipse cx="88" cy="88" rx="3.5" ry="4" fill="#2D3748"/>
          <ellipse cx="112" cy="88" rx="3.5" ry="4" fill="#2D3748"/>
          <path d="M82 80 Q88 76 94 80" stroke="#3A3A3A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M106 80 Q112 76 118 80" stroke="#3A3A3A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M90 100 Q100 110 110 100" stroke="#C4956A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <rect x="108" y="130" width="28" height="12" rx="3" fill="#fff" opacity="0.9"/>
          <circle cx="114" cy="136" r="2.5" fill="#CC0000"/>
          <rect x="119" y="134" width="14" height="3" rx="1" fill="#2ea3f2"/>
        </svg>
        <div id="avatar-ring"></div>
      </div>
      <div id="sound-wave" ref={soundWaveRef}>
        <span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
  )
}
