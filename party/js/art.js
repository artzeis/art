// Creature artwork, shared with the family version of Myth Seekers.
const CREATURE_SVG = {
  fairy: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="wing-l"><ellipse cx="62" cy="80" rx="40" ry="26" fill="#b3e5fc" opacity=".8" transform="rotate(-25 62 80)"/><ellipse cx="66" cy="118" rx="28" ry="16" fill="#e1bee7" opacity=".8" transform="rotate(20 66 118)"/></g>
    <g class="wing-r"><ellipse cx="138" cy="80" rx="40" ry="26" fill="#b3e5fc" opacity=".8" transform="rotate(25 138 80)"/><ellipse cx="134" cy="118" rx="28" ry="16" fill="#e1bee7" opacity=".8" transform="rotate(-20 134 118)"/></g>
    <path d="M100 92 L130 160 L70 160 Z" fill="#f48fb1"/>
    <rect x="90" y="158" width="6" height="22" rx="3" fill="#ffcc80"/><rect x="104" y="158" width="6" height="22" rx="3" fill="#ffcc80"/>
    <circle cx="100" cy="70" r="22" fill="#ffe0b2"/>
    <path d="M78 66 Q80 42 100 44 Q122 42 122 66 Q116 54 100 54 Q86 54 78 66Z" fill="#ffb74d"/>
    <circle cx="86" cy="52" r="5" fill="#f06292"/><circle cx="100" cy="47" r="5" fill="#ba68c8"/><circle cx="114" cy="52" r="5" fill="#f06292"/>
    <circle cx="92" cy="72" r="3" fill="#4e342e"/><circle cx="108" cy="72" r="3" fill="#4e342e"/>
    <path d="M93 81 Q100 87 107 81" stroke="#d84315" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="86" cy="79" r="4" fill="#f8bbd0"/><circle cx="114" cy="79" r="4" fill="#f8bbd0"/>
    <line x1="128" y1="118" x2="152" y2="92" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
    <path d="M152 80 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#ffeb3b"/>
  </svg>`,
  gnome: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="186" rx="50" ry="8" fill="#000" opacity=".15"/>
    <rect x="70" y="120" width="60" height="55" rx="18" fill="#1e88e5"/>
    <rect x="70" y="150" width="60" height="8" fill="#5d4037"/>
    <ellipse cx="82" cy="180" rx="14" ry="8" fill="#5d4037"/><ellipse cx="118" cy="180" rx="14" ry="8" fill="#5d4037"/>
    <path d="M100 10 L140 92 L60 92 Z" fill="#e53935"/>
    <ellipse cx="100" cy="92" rx="44" ry="9" fill="#c62828"/>
    <circle cx="100" cy="104" r="24" fill="#ffe0b2"/>
    <path d="M72 108 Q100 175 128 108 Q114 120 100 118 Q86 120 72 108Z" fill="#fafafa"/>
    <circle cx="100" cy="110" r="9" fill="#ffab91"/>
    <circle cx="90" cy="99" r="3" fill="#3e2723"/><circle cx="110" cy="99" r="3" fill="#3e2723"/>
    <path d="M84 93 l10 -2 M106 91 l10 2" stroke="#9e9e9e" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  elf: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="190" rx="40" ry="6" fill="#000" opacity=".15"/>
    <path d="M72 100 L128 100 L138 175 L62 175 Z" fill="#43a047"/>
    <rect x="66" y="132" width="68" height="7" fill="#795548"/>
    <rect x="84" y="174" width="10" height="14" rx="4" fill="#5d4037"/><rect x="106" y="174" width="10" height="14" rx="4" fill="#5d4037"/>
    <path d="M58 66 L80 72 L80 82 Z" fill="#ffe0b2"/><path d="M142 66 L120 72 L120 82 Z" fill="#ffe0b2"/>
    <circle cx="100" cy="76" r="24" fill="#ffe0b2"/>
    <path d="M74 80 Q72 40 100 36 Q128 40 126 80 Q122 58 100 56 Q78 58 74 80Z" fill="#2e7d32"/>
    <path d="M100 36 Q114 20 126 26" stroke="#2e7d32" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M86 64 Q100 58 114 64 Q100 54 86 64Z" fill="#fff59d"/>
    <ellipse cx="91" cy="78" rx="3" ry="4" fill="#1b5e20"/><ellipse cx="109" cy="78" rx="3" ry="4" fill="#1b5e20"/>
    <path d="M94 88 Q100 92 106 88" stroke="#6d4c41" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M150 90 Q172 135 150 180" stroke="#b0bec5" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="150" y1="90" x2="150" y2="180" stroke="#eceff1" stroke-width="1.5"/>
    <path d="M150 110 q8 -6 14 0 q-6 6 -14 0z" fill="#66bb6a"/>
  </svg>`,
  bird: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M70 120 Q20 150 30 190 Q55 160 80 140Z" fill="#ff7043"/>
    <path d="M78 126 Q45 170 64 196 Q76 160 92 140Z" fill="#ffca28"/>
    <ellipse cx="105" cy="112" rx="44" ry="36" fill="#ff9800"/>
    <g class="wing-r"><path d="M100 104 Q150 60 184 82 Q160 110 112 124Z" fill="#ffb300"/><path d="M110 112 Q150 92 176 100 Q150 120 116 124Z" fill="#ff7043"/></g>
    <circle cx="138" cy="74" r="24" fill="#ffa726"/>
    <path d="M128 52 Q124 26 134 20 Q136 40 140 50 Q146 28 156 26 Q150 44 146 54Z" fill="#ff5722"/>
    <path d="M160 72 L184 80 L160 86 Z" fill="#fdd835"/>
    <circle cx="146" cy="70" r="5" fill="#fff"/><circle cx="147" cy="70" r="3" fill="#3e2723"/>
    <path d="M96 146 l-4 22 M110 146 l2 22" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="3" fill="#fff59d"/><circle cx="62" cy="24" r="2" fill="#fff59d"/><circle cx="176" cy="132" r="3" fill="#fff59d"/>
  </svg>`,
  centaur: `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="104" cy="192" rx="62" ry="6" fill="#000" opacity=".15"/>
    <path d="M150 118 Q186 120 178 168 Q170 140 154 136Z" fill="#4e342e"/>
    <ellipse cx="112" cy="128" rx="48" ry="24" fill="#8d6e63"/>
    <rect x="72" y="138" width="10" height="48" rx="5" fill="#795548"/><rect x="88" y="140" width="10" height="46" rx="5" fill="#8d6e63"/>
    <rect x="128" y="138" width="10" height="48" rx="5" fill="#795548"/><rect x="144" y="140" width="10" height="46" rx="5" fill="#8d6e63"/>
    <rect x="70" y="182" width="14" height="7" rx="2" fill="#3e2723"/><rect x="86" y="182" width="14" height="7" rx="2" fill="#3e2723"/>
    <rect x="126" y="182" width="14" height="7" rx="2" fill="#3e2723"/><rect x="142" y="182" width="14" height="7" rx="2" fill="#3e2723"/>
    <path d="M60 120 Q60 76 78 70 L96 70 Q108 80 98 122Z" fill="#7e57c2"/>
    <path d="M62 82 Q42 96 48 118" stroke="#ffe0b2" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="50" r="21" fill="#ffe0b2"/>
    <path d="M58 54 Q54 22 82 26 Q106 28 100 56 Q98 38 82 38 Q66 38 62 62Z" fill="#4e342e"/>
    <path d="M60 54 Q50 80 58 96" stroke="#4e342e" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="74" cy="52" r="3" fill="#3e2723"/><circle cx="88" cy="52" r="3" fill="#3e2723"/>
    <path d="M75 61 Q81 66 87 61" stroke="#8d4a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M38 108 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="#ffeb3b"/>
  </svg>`,
};
