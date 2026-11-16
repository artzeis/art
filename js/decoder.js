// Imagamigos — Tangle's Secret Messages, cracked with the Secret Decoder Wheel.
//
// The wheel: an outer ring A–Z and a turning inner dial A–Z with a pointer at its "A".
// Turn the pointer to the KEY letter on the outer ring. Then every code letter on the inner dial
// sits right next to its real letter on the outer ring.
// Maths: with the pointer on key K, real letter P  ↔  code letter (P − K).
const CODE_MESSAGES = [
  { from: "tangle", key: "C", text: "YOU ARE A MAZE MASTER" },
  { from: "scribbi", key: "F", text: "SCRIBBI WINKS TO SAY HI" },
  { from: "leo", key: "K", text: "WELCOME TO THE PACK" },
  { from: "orbit", key: "H", text: "PANCAKES ARE THE BEST" },
  { from: "glitch", key: "G", text: "LEVEL UP AMIGO" },
  { from: "craggle", key: "M", text: "NO RUSH SAYS CRAGGLE" },
  { from: "nyxie", key: "S", text: "SWEET DREAMS LITTLE AMIGO" },
  { from: "tangle", key: "T", text: "GIVE YOUR GROWN UP A HUG" },
  { from: "leo", key: "W", text: "HOWL AT THE MOON TONIGHT" },
  { from: "nyxie", key: "R", text: "COUNT THE STARS WITH ME" },
];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const shiftLetter = (ch, by) => {
  const i = ALPHA.indexOf(ch);
  return i < 0 ? ch : ALPHA[(i + by + 26 * 4) % 26];
};
const encodeMessage = (text, key) => [...text.toUpperCase()].map((ch) => shiftLetter(ch, -ALPHA.indexOf(key))).join("");

// On-screen decoder wheel (for families without the toy, or to check an answer).
// `turn` is the outer letter index the pointer points at.
function decoderWheelSVG(turn) {
  const C = 150, step = 360 / 26;
  const pos = (i, r) => {
    const a = (90 - i * step) * Math.PI / 180;
    return [C + r * Math.cos(a), C - r * Math.sin(a)];
  };
  const letter = (ch, i, r, size, cls) => {
    const [x, y] = pos(i, r);
    const rot = i * step;
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}" class="${cls}" text-anchor="middle" dominant-baseline="central"
      transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})">${ch}</text>`;
  };
  return `
  <svg viewBox="0 0 300 300" class="dw" role="img" aria-label="Decoder wheel, pointer on ${ALPHA[turn]}">
    <circle cx="150" cy="150" r="146" class="dw-outer"/>
    ${[...ALPHA].map((ch, i) => letter(ch, i, 128, 17, "dw-o")).join("")}
    <g class="dw-dial" style="transform: rotate(${(turn * step).toFixed(2)}deg)">
      <circle cx="150" cy="150" r="108" class="dw-inner"/>
      <path d="M 141 46 L 159 46 L 150 30 Z" class="dw-pointer"/>
      ${[...ALPHA].map((ch, i) => letter(ch, i, 90, 15, "dw-i")).join("")}
      <circle cx="150" cy="150" r="52" class="dw-maze"/><circle cx="150" cy="150" r="36" class="dw-maze"/>
      <circle cx="150" cy="150" r="16" class="dw-hub"/>
    </g>
  </svg>`;
}
