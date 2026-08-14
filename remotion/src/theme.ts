// Visual system for the MOTU AVB Series reels.
//
// Light-background convention throughout (prompt s4). The dark-metal chassis is
// anchored against the light field with hard drop-shadows and edge light, per
// the creative brief's negative-fill / side-key direction (brief s6). TFT
// displays are the only saturated colour source in frame.

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const PART_FRAMES = 88 * FPS; // 2640

/** Instagram safe-zone geometry, carried forward unchanged from the
 *  M-Series and TASCAM reel projects (prompt s4). */
export const SAFE = {
  top: 250,
  bottom: 1580, // content must end above this line
  side: 90,
} as const;

export const C = {
  // Light stage
  bg: '#EEEFF2',
  bgWarm: '#F5F5F7',
  bgSink: '#E2E4E9',

  // Ink
  ink: '#12161F',
  inkSoft: '#3A4150',
  inkFaint: '#767E8E',
  rule: '#C9CDD6',

  // Accent - drawn from the TFT display glow, used sparingly
  accent: '#0B63CE',
  accentLift: '#3E93F5',
  signal: '#12B76A', // meter green
  warn: '#F5A524',

  // Plate that dark product photography sits on
  plate: '#161A22',
  plateEdge: '#2C3340',
} as const;

export const F = {
  // Headline claims - massive, bold, heavily tracked (brief s8)
  head: '"Helvetica Neue", "Arial Black", Inter, system-ui, sans-serif',
  // Specification callouts - monospaced, technical
  mono: '"SF Mono", ui-monospace, "Roboto Mono", Menlo, Consolas, monospace',
  // Body / micro callouts
  body: '"Helvetica Neue", Inter, system-ui, -apple-system, sans-serif',
} as const;

export const SHADOW = {
  plate: '0 40px 90px rgba(12,18,32,0.30), 0 8px 24px rgba(12,18,32,0.18)',
  lift: '0 24px 60px rgba(12,18,32,0.22)',
  chip: '0 6px 18px rgba(12,18,32,0.14)',
} as const;

/** Brand / CTA constants. Exact unabbreviated designation - never generalised
 *  to "across India", never shortened to "dealer" (prompt s1/s6/s7). */
export const BRAND = {
  distributor: 'Shivansh Electronics',
  designation: "MOTU's Authorized Distributor for East and North East India",
  whatsapp: ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755'],
  web: 'shivanshelectronics.in',
  address:
    'Raja Electric — Shivansh Electronics, 3, Ramanath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal, India 700031',
  mop: '₹1,87,900',
} as const;
