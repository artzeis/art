// Myth Seekers — character illustrations (inline SVG, shaded storybook style).
// Each drawing uses its own id prefix so gradients never clash on a page.
const CREATURE_SVG = {
  fairy: `
<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="f-aura" cx=".5" cy=".45" r=".5"><stop offset="0" stop-color="#ffd1ec" stop-opacity=".9"/><stop offset="1" stop-color="#ff8ccf" stop-opacity="0"/></radialGradient>
    <linearGradient id="f-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8f3ff"/><stop offset=".5" stop-color="#d9c2ff"/><stop offset="1" stop-color="#ffc4e6"/></linearGradient>
    <radialGradient id="f-skin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffe8d8"/><stop offset="1" stop-color="#eab397"/></radialGradient>
    <linearGradient id="f-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9733a"/><stop offset="1" stop-color="#8f3a1c"/></linearGradient>
    <linearGradient id="f-dress" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9ccf"/><stop offset="1" stop-color="#c2307f"/></linearGradient>
    <linearGradient id="f-dress2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc6e3"/><stop offset="1" stop-color="#e05a9f"/></linearGradient>
    <radialGradient id="f-star" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe0"/><stop offset=".5" stop-color="#ffe066" stop-opacity=".8"/><stop offset="1" stop-color="#ffd000" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="120" cy="135" r="118" fill="url(#f-aura)"/>
  <g class="wing-l" opacity=".85">
    <path d="M114 122 C70 30 6 44 24 112 C36 152 92 146 114 130Z" fill="url(#f-wing)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
    <path d="M112 128 C80 90 50 70 34 84 M112 128 C70 110 44 112 32 118" stroke="#fff" stroke-opacity=".6" fill="none"/>
    <path d="M114 138 C72 146 46 200 74 210 C98 216 110 176 116 146Z" fill="url(#f-wing)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
  </g>
  <g class="wing-r" opacity=".85">
    <path d="M126 122 C170 30 234 44 216 112 C204 152 148 146 126 130Z" fill="url(#f-wing)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
    <path d="M128 128 C160 90 190 70 206 84 M128 128 C170 110 196 112 208 118" stroke="#fff" stroke-opacity=".6" fill="none"/>
    <path d="M126 138 C168 146 194 200 166 210 C142 216 130 176 124 146Z" fill="url(#f-wing)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
  </g>
  <path d="M100 66 C92 100 94 130 102 150 L138 150 C146 130 148 100 140 66Z" fill="url(#f-hair)"/>
  <path d="M113 200 L111 250 Q110 256 104 258 L114 258 Q118 252 118 246 L119 200Z M127 200 L129 250 Q130 256 136 258 L126 258 Q122 252 122 246 L121 200Z" fill="url(#f-skin)"/>
  <ellipse cx="106" cy="258" rx="8" ry="4" fill="#d6418a"/><ellipse cx="134" cy="258" rx="8" ry="4" fill="#d6418a"/>
  <path d="M120 140 C96 150 80 186 74 214 C92 206 104 212 120 206 C136 212 148 206 166 214 C160 186 144 150 120 140Z" fill="url(#f-dress)"/>
  <path d="M120 142 C104 158 96 186 94 206 C106 198 114 204 120 198 C126 204 134 198 146 206 C144 186 136 158 120 142Z" fill="url(#f-dress2)" opacity=".9"/>
  <path d="M107 112 Q120 106 133 112 L130 146 Q120 152 110 146Z" fill="url(#f-dress)"/>
  <path d="M110 118 Q120 124 130 118" stroke="#ffd6ec" stroke-width="2" fill="none"/>
  <rect x="115" y="96" width="10" height="14" rx="4" fill="url(#f-skin)"/>
  <path d="M108 116 Q96 132 98 152" stroke="url(#f-skin)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M132 116 Q148 116 154 98" stroke="url(#f-skin)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <line x1="156" y1="102" x2="172" y2="58" stroke="#f3e2c0" stroke-width="3" stroke-linecap="round"/>
  <circle cx="174" cy="52" r="22" fill="url(#f-star)"/>
  <path d="M174 40 l3.5 8 8.5 1 -6.5 5.5 2 8.5 -7.5 -4.5 -7.5 4.5 2 -8.5 -6.5 -5.5 8.5 -1z" fill="#fff6b3" stroke="#f2b600" stroke-width="1"/>
  <ellipse cx="120" cy="80" rx="18.5" ry="21.5" fill="url(#f-skin)"/>
  <path d="M100 82 C96 56 112 50 122 52 C138 52 146 66 140 86 C136 70 128 64 118 64 C110 66 104 72 100 82Z" fill="url(#f-hair)"/>
  <path d="M104 70 Q114 72 120 62 Q124 72 136 72" stroke="#f2a06b" stroke-width="2" fill="none" opacity=".7"/>
  <g>
    <circle cx="104" cy="60" r="5" fill="#ff6fb5"/><circle cx="104" cy="60" r="2" fill="#ffe066"/>
    <circle cx="114" cy="54" r="5" fill="#b78bff"/><circle cx="114" cy="54" r="2" fill="#ffe066"/>
    <circle cx="126" cy="53" r="5" fill="#ff8fc8"/><circle cx="126" cy="53" r="2" fill="#ffe066"/>
    <circle cx="136" cy="59" r="5" fill="#8fd3ff"/><circle cx="136" cy="59" r="2" fill="#ffe066"/>
    <path d="M98 64 q3 -5 8 -3 M140 63 q-3 -5 -8 -3" stroke="#5fbf6d" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <path d="M107 75 q5 -3 9 0 M124 75 q5 -3 9 0" stroke="#8f3a1c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="112" cy="82" rx="4" ry="4.8" fill="#fff"/><ellipse cx="128" cy="82" rx="4" ry="4.8" fill="#fff"/>
  <circle cx="112.5" cy="82.5" r="3.2" fill="#3fa36b"/><circle cx="128.5" cy="82.5" r="3.2" fill="#3fa36b"/>
  <circle cx="112.5" cy="82.8" r="1.6" fill="#18301f"/><circle cx="128.5" cy="82.8" r="1.6" fill="#18301f"/>
  <circle cx="113.6" cy="81.3" r="1" fill="#fff"/><circle cx="129.6" cy="81.3" r="1" fill="#fff"/>
  <path d="M107.5 78.5 l-2 -2 M132.5 78.5 l2 -2" stroke="#3b1a0c" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M120 86 q1.5 3 -1 4" stroke="#d48c70" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M114 94 Q120 98 126 94" stroke="#c94f63" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="106" cy="90" rx="4" ry="2.5" fill="#ff9fb5" opacity=".6"/><ellipse cx="134" cy="90" rx="4" ry="2.5" fill="#ff9fb5" opacity=".6"/>
  <g fill="#fff"><circle cx="40" cy="190" r="2"/><circle cx="200" cy="200" r="2.5"/><circle cx="60" cy="40" r="1.5"/><circle cx="205" cy="150" r="1.5"/></g>
</svg>`,

  gnome: `
<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="g-hat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff6b5c"/><stop offset=".55" stop-color="#e0352b"/><stop offset="1" stop-color="#9d1d17"/></linearGradient>
    <linearGradient id="g-coat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f8df5"/><stop offset="1" stop-color="#1d4fb3"/></linearGradient>
    <radialGradient id="g-skin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffe2cc"/><stop offset="1" stop-color="#e3a183"/></radialGradient>
    <radialGradient id="g-nose" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#ffc0a8"/><stop offset="1" stop-color="#e0735a"/></radialGradient>
    <linearGradient id="g-beard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd6e0"/></linearGradient>
    <linearGradient id="g-boot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5634"/><stop offset="1" stop-color="#4a2a17"/></linearGradient>
    <radialGradient id="g-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#ffb300" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="120" cy="264" rx="70" ry="9" fill="#000" opacity=".22"/>
  <path d="M92 236 L90 256 L116 256 L114 236Z M126 236 L124 256 L150 256 L148 236Z" fill="#5b3a26"/>
  <path d="M80 258 Q80 244 96 244 L114 244 Q118 252 118 260 L82 262Z" fill="url(#g-boot)"/>
  <path d="M160 258 Q160 244 144 244 L126 244 Q122 252 122 260 L158 262Z" fill="url(#g-boot)"/>
  <path d="M74 182 Q72 146 120 140 Q168 146 166 182 L170 236 Q120 252 70 236Z" fill="url(#g-coat)"/>
  <path d="M74 214 Q120 226 166 214 L168 226 Q120 238 72 226Z" fill="#5d3a22"/>
  <rect x="110" y="214" width="20" height="16" rx="3" fill="#ffcc4d" stroke="#b8860b" stroke-width="2"/>
  <rect x="116" y="219" width="8" height="6" fill="#5d3a22"/>
  <path d="M76 168 Q58 190 72 214" stroke="url(#g-coat)" stroke-width="16" stroke-linecap="round" fill="none"/>
  <path d="M164 168 Q186 186 178 206" stroke="url(#g-coat)" stroke-width="16" stroke-linecap="round" fill="none"/>
  <circle cx="74" cy="214" r="9" fill="url(#g-skin)"/>
  <circle cx="186" cy="214" r="26" fill="url(#g-glow)"/>
  <rect x="176" y="204" width="20" height="24" rx="4" fill="#ffe08a" stroke="#6b4a1d" stroke-width="3"/>
  <path d="M178 204 L186 196 L194 204" stroke="#6b4a1d" stroke-width="3" fill="none"/>
  <circle cx="178" cy="206" r="8" fill="url(#g-skin)"/>
  <ellipse cx="120" cy="120" rx="32" ry="28" fill="url(#g-skin)"/>
  <path d="M86 122 C84 160 96 206 120 214 C144 206 156 160 154 122 C146 134 134 140 120 140 C106 140 94 134 86 122Z" fill="url(#g-beard)"/>
  <path d="M104 150 Q102 180 110 200 M120 146 Q118 182 120 208 M136 150 Q138 180 130 200 M94 140 Q94 166 100 186 M146 140 Q146 166 140 186" stroke="#b9c3d1" stroke-width="1.5" fill="none" opacity=".8"/>
  <path d="M96 134 Q108 126 120 134 Q132 126 144 134 Q140 146 120 140 Q100 146 96 134Z" fill="#f2f4f8"/>
  <g transform="translate(0 -7)">
  <path d="M120 10 C112 30 96 70 80 108 Q120 122 160 108 C150 72 140 46 128 22 C138 22 150 30 152 42 C152 22 136 8 120 10Z" fill="url(#g-hat)"/>
  <path d="M106 50 Q112 80 104 104" stroke="#ff9a8a" stroke-width="3" fill="none" opacity=".5"/>
  <path d="M78 106 Q120 124 162 106 Q164 116 160 118 Q120 132 80 118 Q76 114 78 106Z" fill="#a61f19"/>
  </g>
  <path d="M100 113 q8 -5 14 0 M126 113 q8 -5 14 0" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>
  <ellipse cx="107" cy="120" rx="3.2" ry="3.8" fill="#2b1b12"/><ellipse cx="133" cy="120" rx="3.2" ry="3.8" fill="#2b1b12"/>
  <circle cx="108" cy="118.6" r="1.1" fill="#fff"/><circle cx="134" cy="118.6" r="1.1" fill="#fff"/>
  <ellipse cx="96" cy="130" rx="6" ry="4" fill="#ff8f8f" opacity=".5"/><ellipse cx="144" cy="130" rx="6" ry="4" fill="#ff8f8f" opacity=".5"/>
  <ellipse cx="120" cy="130" rx="11" ry="10" fill="url(#g-nose)"/>
  <ellipse cx="116" cy="126" rx="3" ry="2" fill="#fff" opacity=".6"/>
</svg>`,

  elf: `
<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="e-cloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fbf74"/><stop offset="1" stop-color="#145c3a"/></linearGradient>
    <linearGradient id="e-tunic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6f5c9"/><stop offset="1" stop-color="#8fcf8a"/></linearGradient>
    <radialGradient id="e-skin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff0e2"/><stop offset="1" stop-color="#e8bc9c"/></radialGradient>
    <linearGradient id="e-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d6"/><stop offset="1" stop-color="#e2c37a"/></linearGradient>
    <linearGradient id="e-bow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9fb2c4"/></linearGradient>
    <radialGradient id="e-glow" cx=".5" cy=".4" r=".55"><stop offset="0" stop-color="#d8ffd9" stop-opacity=".7"/><stop offset="1" stop-color="#5fd38a" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="120" cy="120" r="110" fill="url(#e-glow)"/>
  <ellipse cx="120" cy="268" rx="50" ry="7" fill="#000" opacity=".2"/>
  <path d="M168 40 Q206 140 168 240" stroke="url(#e-bow)" stroke-width="5" fill="none" stroke-linecap="round"/>
  <line x1="168" y1="40" x2="168" y2="240" stroke="#e8f0f7" stroke-width="1"/>
  <path d="M184 120 q10 -8 18 0 q-8 8 -18 0z M186 150 q10 -6 16 2 q-8 6 -16 -2z" fill="#6fd08a"/>
  <path d="M96 64 C82 110 80 150 90 172 L150 172 C160 150 158 110 144 64Z" fill="url(#e-hair)"/>
  <path d="M86 108 Q120 96 154 108 L176 262 Q120 272 64 262Z" fill="url(#e-cloak)"/>
  <path d="M100 112 Q120 106 140 112 L146 250 Q120 258 94 250Z" fill="url(#e-tunic)"/>
  <path d="M96 176 Q120 184 144 176 L145 186 Q120 194 95 186Z" fill="#7a5532"/>
  <circle cx="120" cy="184" r="5" fill="#cfe8ff" stroke="#8aa6c2" stroke-width="1.5"/>
  <path d="M120 112 L120 176" stroke="#7fbf7a" stroke-width="1.5"/>
  <path d="M90 122 Q76 160 88 196" stroke="url(#e-cloak)" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M150 122 Q164 160 152 196" stroke="url(#e-cloak)" stroke-width="13" stroke-linecap="round" fill="none"/>
  <circle cx="88" cy="198" r="6.5" fill="url(#e-skin)"/><circle cx="152" cy="198" r="6.5" fill="url(#e-skin)"/>
  <path d="M104 256 L102 268 L116 268 L114 256Z M126 256 L124 268 L138 268 L136 256Z" fill="#5d3a22"/>
  <path d="M100 104 Q120 118 140 104 L136 98 Q120 108 104 98Z" fill="#2e8f57"/>
  <path d="M112 102 q8 -8 16 0 q-8 6 -16 0z" fill="#9be08f" stroke="#2e8f57" stroke-width="1"/>
  <rect x="115" y="90" width="10" height="12" rx="4" fill="url(#e-skin)"/>
  <path d="M100 74 L74 56 L102 84Z" fill="url(#e-skin)"/><path d="M140 74 L166 56 L138 84Z" fill="url(#e-skin)"/>
  <path d="M98 74 L82 63 L100 80Z M142 74 L158 63 L140 80Z" fill="#f2b8a0" opacity=".6"/>
  <ellipse cx="120" cy="72" rx="19" ry="23" fill="url(#e-skin)"/>
  <path d="M100 76 C96 46 112 40 120 40 C132 40 146 48 140 76 C136 62 126 56 116 56 C108 60 104 66 100 76Z" fill="url(#e-hair)"/>
  <path d="M100 58 Q120 50 140 58" stroke="#c9d8e6" stroke-width="2.5" fill="none"/>
  <path d="M117 52 q3 -6 6 0 q-3 4 -6 0z" fill="#8fe0ff"/>
  <path d="M107 69 q6 -3 10 0 M123 69 q6 -3 10 0" stroke="#b08a4a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M107 76 Q112 72 117 76 Q112 79 107 76Z M123 76 Q128 72 133 76 Q128 79 123 76Z" fill="#fff"/>
  <circle cx="112" cy="76" r="2.7" fill="#2f8f5a"/><circle cx="128" cy="76" r="2.7" fill="#2f8f5a"/>
  <circle cx="112" cy="76" r="1.3" fill="#0d2a1a"/><circle cx="128" cy="76" r="1.3" fill="#0d2a1a"/>
  <circle cx="113" cy="75" r=".8" fill="#fff"/><circle cx="129" cy="75" r=".8" fill="#fff"/>
  <path d="M120 80 q1.5 3 -1 4" stroke="#d29a80" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M115 88 Q120 91 125 88" stroke="#b5606a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <g fill="#e9ffd8"><circle cx="50" cy="80" r="1.8"/><circle cx="196" cy="70" r="1.5"/><circle cx="60" cy="200" r="2"/></g>
</svg>`,

  bird: `
<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="b-glow" cx=".55" cy=".45" r=".55"><stop offset="0" stop-color="#ffe29a" stop-opacity=".9"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
    <linearGradient id="b-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffcf4d"/><stop offset=".6" stop-color="#ff8a1f"/><stop offset="1" stop-color="#e2461b"/></linearGradient>
    <linearGradient id="b-breast" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset="1" stop-color="#ffb347"/></linearGradient>
    <linearGradient id="b-plume" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a1f"/><stop offset=".6" stop-color="#e53a1c"/><stop offset="1" stop-color="#8f1a3a"/></linearGradient>
    <linearGradient id="b-plume2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#ff7a1a"/></linearGradient>
    <linearGradient id="b-wing" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff6a1a"/><stop offset=".5" stop-color="#ffb52e"/><stop offset="1" stop-color="#fff1a8"/></linearGradient>
    <linearGradient id="b-branch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a3a"/><stop offset="1" stop-color="#4f3020"/></linearGradient>
  </defs>
  <circle cx="132" cy="120" r="118" fill="url(#b-glow)"/>
  <path d="M96 170 C60 200 30 240 14 276 C46 250 70 226 104 196Z" fill="url(#b-plume)"/>
  <path d="M104 178 C86 220 72 254 70 280 C92 252 106 222 118 194Z" fill="url(#b-plume2)"/>
  <path d="M90 166 C50 180 18 204 4 232 C40 214 70 200 100 186Z" fill="url(#b-plume2)" opacity=".9"/>
  <circle cx="24" cy="262" r="6" fill="#ffe066"/><circle cx="24" cy="262" r="3" fill="#2a7fff"/>
  <circle cx="74" cy="270" r="5" fill="#ffe066"/><circle cx="74" cy="270" r="2.5" fill="#2a7fff"/>
  <path d="M30 236 L216 230 Q222 238 214 242 L30 248Z" fill="url(#b-branch)"/>
  <path d="M190 232 q10 -14 22 -12 q-6 10 -22 12z" fill="#5fbf6d"/>
  <path d="M120 200 l-6 34 M140 200 l4 32" stroke="#a0522d" stroke-width="5" stroke-linecap="round"/>
  <path d="M104 234 h16 M136 232 h16" stroke="#a0522d" stroke-width="4" stroke-linecap="round"/>
  <path d="M86 150 C86 110 120 92 152 100 C182 110 186 160 166 190 C150 212 112 214 96 194 C88 182 86 166 86 150Z" fill="url(#b-body)"/>
  <path d="M136 112 C160 120 170 160 156 190 C144 206 124 206 116 194 C128 170 132 140 136 112Z" fill="url(#b-breast)"/>
  <g class="wing-r">
    <path d="M110 140 C80 90 60 50 70 30 C100 46 130 86 140 130Z" fill="url(#b-wing)"/>
    <path d="M112 146 C84 110 56 84 40 80 C56 108 84 140 118 158Z" fill="url(#b-wing)" opacity=".9"/>
    <path d="M80 50 L118 128 M74 70 L114 136 M64 92 L110 146" stroke="#e2461b" stroke-width="1.5" opacity=".5"/>
  </g>
  <circle cx="160" cy="82" r="28" fill="url(#b-body)"/>
  <path d="M146 58 C136 30 140 14 150 8 C150 28 154 44 158 56 C160 30 170 18 182 16 C174 34 168 48 166 60 C176 44 190 40 200 44 C186 52 176 60 170 66Z" fill="url(#b-plume)"/>
  <path d="M184 76 C196 76 212 82 214 92 C204 92 194 92 184 94Z" fill="#ffd23f" stroke="#c98a00" stroke-width="1.5"/>
  <path d="M184 90 Q196 96 206 92" stroke="#c98a00" stroke-width="1.5" fill="none"/>
  <circle cx="170" cy="78" r="8" fill="#fff"/><circle cx="171" cy="78" r="5.5" fill="#7a2e0e"/>
  <circle cx="171" cy="78" r="2.8" fill="#1a0a04"/><circle cx="173" cy="76" r="1.6" fill="#fff"/>
  <path d="M162 70 Q170 64 180 70" stroke="#c4361a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g fill="#fff4b0"><circle cx="40" cy="60" r="2.5"/><circle cx="214" cy="140" r="2"/><circle cx="200" cy="190" r="2.5"/><circle cx="60" cy="120" r="1.5"/></g>
</svg>`,

  centaur: `
<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="c-horse" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9774c"/><stop offset="1" stop-color="#6b3d22"/></linearGradient>
    <linearGradient id="c-leg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f5532"/><stop offset="1" stop-color="#5a321c"/></linearGradient>
    <linearGradient id="c-tail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3d2416"/><stop offset="1" stop-color="#1c0f08"/></linearGradient>
    <radialGradient id="c-skin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f7d2b2"/><stop offset="1" stop-color="#c98e68"/></radialGradient>
    <linearGradient id="c-vest" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9c7bff"/><stop offset="1" stop-color="#5134b8"/></linearGradient>
    <linearGradient id="c-hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2c1a"/><stop offset="1" stop-color="#22130a"/></linearGradient>
    <radialGradient id="c-sky" cx=".5" cy=".4" r=".55"><stop offset="0" stop-color="#cdbbff" stop-opacity=".55"/><stop offset="1" stop-color="#7a5cff" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="120" cy="120" r="116" fill="url(#c-sky)"/>
  <ellipse cx="128" cy="268" rx="88" ry="8" fill="#000" opacity=".22"/>
  <path d="M196 150 C226 156 232 200 214 236 C214 206 206 186 192 176Z" fill="url(#c-tail)"/>
  <path d="M168 196 L176 232 L172 260 L186 260 L188 230 L184 196Z" fill="url(#c-leg)"/>
  <path d="M90 196 L86 232 L90 260 L104 260 L102 230 L106 196Z" fill="url(#c-leg)"/>
  <path d="M68 150 C66 132 90 130 120 134 C150 130 196 130 202 156 C206 182 196 204 172 206 L96 208 C74 206 66 180 68 150Z" fill="url(#c-horse)"/>
  <path d="M96 140 Q130 150 180 140" stroke="#d99a6c" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>
  <path d="M74 188 L70 232 L76 260 L90 260 L86 230 L92 200Z" fill="url(#c-horse)"/>
  <path d="M150 196 L154 232 L150 260 L164 260 L168 230 L170 198Z" fill="url(#c-horse)"/>
  <rect x="73" y="246" width="16" height="10" rx="2" fill="#f5efe6"/><rect x="149" y="246" width="16" height="10" rx="2" fill="#f5efe6"/>
  <path d="M72 256 h20 v8 h-20z M148 256 h20 v8 h-20z M88 258 h18 v6 h-18z M170 258 h18 v6 h-18z" fill="#2a1a10"/>
  <path d="M76 150 C70 120 74 100 92 96 L108 96 C120 104 118 132 112 154Z" fill="url(#c-vest)"/>
  <path d="M84 98 L92 150 M108 98 L102 150" stroke="#ffd36b" stroke-width="2.5"/>
  <path d="M80 104 Q60 120 56 148" stroke="url(#c-skin)" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M110 104 Q126 116 132 132" stroke="url(#c-skin)" stroke-width="10" stroke-linecap="round" fill="none"/>
  <rect x="124" y="124" width="34" height="14" rx="7" fill="#f2e3c0" stroke="#b08a4a" stroke-width="1.5" transform="rotate(-18 141 131)"/>
  <path d="M132 130 l2 -3 2 3 M144 126 l1.5 -3 1.5 3" stroke="#5134b8" stroke-width="1.5" fill="none"/>
  <circle cx="56" cy="150" r="6" fill="url(#c-skin)"/>
  <rect x="94" y="80" width="10" height="16" rx="4" fill="url(#c-skin)"/>
  <path d="M80 60 C72 90 74 120 84 134 L92 134 C88 112 88 88 92 70Z" fill="url(#c-hair)"/>
  <ellipse cx="99" cy="64" rx="18" ry="21" fill="url(#c-skin)"/>
  <path d="M80 66 C78 40 96 36 104 38 C118 40 124 52 118 68 C114 54 106 50 96 50 C88 52 84 58 80 66Z" fill="url(#c-hair)"/>
  <path d="M90 61 q5 -3 9 0 M104 61 q5 -3 9 0" stroke="#2a160b" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="94" cy="67" rx="3.6" ry="4.2" fill="#fff"/><ellipse cx="108" cy="67" rx="3.6" ry="4.2" fill="#fff"/>
  <circle cx="94.5" cy="67.5" r="2.8" fill="#6b3a1a"/><circle cx="108.5" cy="67.5" r="2.8" fill="#6b3a1a"/>
  <circle cx="94.5" cy="67.8" r="1.4" fill="#1a0a04"/><circle cx="108.5" cy="67.8" r="1.4" fill="#1a0a04"/>
  <circle cx="95.4" cy="66.5" r=".9" fill="#fff"/><circle cx="109.4" cy="66.5" r=".9" fill="#fff"/>
  <path d="M101 71 q1.5 3 -1 4" stroke="#a86f50" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M95 79 Q101 83 107 79" stroke="#9c4a48" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M84 44 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1z" fill="#ffe066"/>
  <g fill="#fff8d0"><circle cx="170" cy="40" r="2.5"/><circle cx="196" cy="70" r="1.8"/><circle cx="150" cy="60" r="1.5"/><circle cx="210" cy="40" r="1.2"/>
  <path d="M170 40 L196 70 L150 60 Z" stroke="#fff8d0" stroke-width=".6" fill="none" opacity=".5"/></g>
</svg>`,

  leo: `
<svg viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="l-aura" cx=".5" cy=".45" r=".55"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".8"/><stop offset="1" stop-color="#5fa8ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="l-grey" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a7a2a4"/><stop offset="1" stop-color="#5f5a5d"/></linearGradient>
    <linearGradient id="l-white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3dfdc"/></linearGradient>
    <linearGradient id="l-ear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e3df"/><stop offset="1" stop-color="#d9b9b4"/></linearGradient>
    <radialGradient id="l-nose" cx=".4" cy=".3" r=".7"><stop offset="0" stop-color="#8a6a66"/><stop offset="1" stop-color="#2e2422"/></radialGradient>
    <radialGradient id="l-eye" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#c7853f"/><stop offset="1" stop-color="#6b3c16"/></radialGradient>
    <linearGradient id="l-tag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9fb0c2"/></linearGradient>
  </defs>
  <circle cx="120" cy="130" r="118" fill="url(#l-aura)"/>
  <ellipse cx="120" cy="268" rx="76" ry="8" fill="#000" opacity=".22"/>
  <path d="M176 240 C214 236 222 206 208 190 C206 214 192 226 170 226Z" fill="url(#l-grey)"/>
  <path d="M192 196 C204 206 208 214 206 222" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M66 262 C50 214 60 166 90 138 Q120 128 150 138 C180 166 190 214 174 262 Q120 272 66 262Z" fill="url(#l-grey)"/>
  <path d="M88 150 C76 186 80 232 94 258 Q120 266 146 258 C160 232 164 186 152 150 C140 166 100 166 88 150Z" fill="url(#l-white)"/>
  <path d="M100 190 C96 214 94 238 92 252 C90 262 98 268 108 268 C116 268 120 262 118 254 C116 236 116 212 114 190Z" fill="url(#l-white)" stroke="#d6d0cc" stroke-width="1.2"/>
  <path d="M140 190 C144 214 146 238 148 252 C150 262 142 268 132 268 C124 268 120 262 122 254 C124 236 124 212 126 190Z" fill="url(#l-white)" stroke="#d6d0cc" stroke-width="1.2"/>
  <path d="M100 262 v5 M106 263 v5 M134 263 v5 M140 262 v5" stroke="#c9c2bd" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M104 200 C102 220 100 236 100 248 M136 200 C138 220 140 236 140 248" stroke="#e2ddd9" stroke-width="2" fill="none"/>
  <path d="M84 136 Q120 154 156 136 L158 146 Q120 166 82 146Z" fill="#2f3135"/>
  <path d="M86 140 Q120 156 154 140" stroke="#c7ab92" stroke-width="3" fill="none"/>
  <circle cx="112" cy="156" r="3" fill="none" stroke="#c9d3dd" stroke-width="2"/>
  <path d="M100 162 q-6 0 -6 6 q0 6 6 6 l24 0 q6 0 6 -6 q0 -6 -6 -6 q-2 -6 -6 -2 l-12 0 q-4 -4 -6 2z" fill="url(#l-tag)" stroke="#7d8da0" stroke-width="1"/>
  <text x="112" y="172" text-anchor="middle" font-family="Georgia, serif" font-size="9" fill="#4a5868">Leo</text>
  <path d="M74 66 L64 8 Q90 20 108 52Z" fill="url(#l-grey)"/>
  <path d="M166 66 L176 8 Q150 20 132 52Z" fill="url(#l-grey)"/>
  <path d="M78 58 L70 18 Q88 30 100 52Z" fill="url(#l-ear)"/>
  <path d="M162 58 L170 18 Q152 30 140 52Z" fill="url(#l-ear)"/>
  <path d="M72 40 l4 10 M78 34 l2 12 M168 40 l-4 10 M162 34 l-2 12" stroke="#fff" stroke-width="2" opacity=".8" stroke-linecap="round"/>
  <path d="M120 44 C86 44 64 66 64 96 C64 124 82 142 120 146 C158 142 176 124 176 96 C176 66 154 44 120 44Z" fill="url(#l-grey)"/>
  <path d="M120 58 C108 58 102 70 96 80 C80 84 70 98 72 114 C80 134 100 144 120 146 C140 144 160 134 168 114 C170 98 160 84 144 80 C138 70 132 58 120 58Z" fill="url(#l-white)"/>
  <path d="M66 96 C58 108 62 122 74 128 C70 118 72 108 76 102Z M174 96 C182 108 178 122 166 128 C170 118 168 108 164 102Z" fill="#cfc9c6"/>
  <path d="M120 58 C114 66 112 76 114 86 L126 86 C128 76 126 66 120 58Z" fill="#cfc9c6"/>
  <path d="M90 86 Q99 80 108 86 Q99 92 90 86Z M132 86 Q141 80 150 86 Q141 92 132 86Z" fill="#3a2a22"/>
  <circle cx="99" cy="86" r="4.6" fill="url(#l-eye)"/><circle cx="141" cy="86" r="4.6" fill="url(#l-eye)"/>
  <circle cx="99" cy="86" r="2" fill="#140a05"/><circle cx="141" cy="86" r="2" fill="#140a05"/>
  <circle cx="100.6" cy="84.4" r="1.3" fill="#fff"/><circle cx="142.6" cy="84.4" r="1.3" fill="#fff"/>
  <path d="M110 112 C110 102 130 102 130 112 C130 120 124 124 120 124 C116 124 110 120 110 112Z" fill="url(#l-nose)"/>
  <ellipse cx="116" cy="108" rx="3" ry="1.8" fill="#fff" opacity=".45"/>
  <path d="M120 124 L120 130 M110 132 Q120 138 130 132" stroke="#5a4844" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g>
    <path d="M120 30 l3 7 7.5 .8 -5.6 5 1.6 7.4 -6.5 -3.8 -6.5 3.8 1.6 -7.4 -5.6 -5 7.5 -.8z" fill="#e8f6ff" stroke="#8fd0ff" stroke-width="1"/>
    <g fill="#dff3ff"><circle cx="40" cy="70" r="2.5"/><circle cx="206" cy="90" r="2"/><circle cx="36" cy="180" r="1.8"/><circle cx="214" cy="160" r="2.4"/><circle cx="60" cy="30" r="1.4"/><circle cx="190" cy="30" r="1.6"/></g>
    <path d="M30 120 Q50 100 40 80 M212 130 Q194 110 206 92" stroke="#bfe6ff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
  </g>
</svg>`,
};

// ---------- Professional artwork ----------
// Drop a finished picture into assets/characters/<id>.png (transparent background,
// e.g. assets/characters/fairy.png) and it automatically replaces the drawing above
// everywhere in the app, including AR. Missing files simply fall back to the drawing.
const CREATURE_IMG = {};
function creatureArt(id) {
  return CREATURE_IMG[id]
    ? `<img class="char-img" src="${CREATURE_IMG[id]}" alt="" draggable="false">`
    : CREATURE_SVG[id];
}
function loadCreatureImages(ids) {
  return Promise.all(ids.map((id) => new Promise((resolve) => {
    const url = `assets/characters/${id}.png`;
    const img = new Image();
    img.onload = () => { CREATURE_IMG[id] = url; resolve(); };
    img.onerror = () => resolve();
    img.src = url;
  })));
}
