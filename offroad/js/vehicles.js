// ============================================================
// OFFROAD LEGENDS — vehicles.js : vehicle data + upgrade maths
// (pure data, shared by physics, garage UI and tests)
// ============================================================

// Local coordinates: x forward, y up, origin = chassis centre of mass.
export const VEHICLES = [
  { id: 'ranger', ar: 'رينجر 4×4', en: 'Ranger 4x4', color: 0xe63a2e, price: 0, dia: 0,
    desc: 'سيارة دفع رباعي متوازنة — مثالية للبداية',
    mass: 820, inertia: 900, wheelR: 0.46, rear: [-1.25, -0.30], front: [1.30, -0.30], susp: 0.55, k: 30000, c: 3600,
    torque: 2300, maxW: 52, brake: 3800, grip: 1.05, drive: 'rwd', air: 2600, fuel: 52, burn: 1.35, boost: 6200, boostCap: 2.2,
    hull: [[-1.75, 0.0], [1.85, 0.05], [1.7, 0.55], [-1.6, 0.6], [-0.2, 0.9]], head: [-0.15, 1.35], drag: 0.42 },
  { id: 'truck', ar: 'شاحنة الطين', en: 'Mud Truck', color: 0x2f6fd6, price: 22000, dia: 0,
    desc: 'ثقيلة وقوية بدفع رباعي — تتسلق كل شيء',
    mass: 1300, inertia: 1700, wheelR: 0.62, rear: [-1.55, -0.38], front: [1.55, -0.38], susp: 0.70, k: 42000, c: 5600,
    torque: 4300, maxW: 38, brake: 6500, grip: 1.15, drive: 'awd', air: 3600, fuel: 70, burn: 1.7, boost: 9000, boostCap: 2.4,
    hull: [[-2.1, 0.0], [2.15, 0.05], [2.0, 0.75], [-2.0, 0.8], [0.3, 1.25]], head: [0.35, 1.6], drag: 0.55 },
  { id: 'kart', ar: 'سبرنت كارت', en: 'Sprint Kart', color: 0xffc21a, price: 38000, dia: 0,
    desc: 'خفيفة وسريعة جداً — تحتاج تحكماً دقيقاً',
    mass: 520, inertia: 430, wheelR: 0.36, rear: [-1.05, -0.18], front: [1.10, -0.18], susp: 0.36, k: 26000, c: 2500,
    torque: 1700, maxW: 88, brake: 3000, grip: 1.12, drive: 'rwd', air: 1700, fuel: 40, burn: 1.15, boost: 5200, boostCap: 2.6,
    hull: [[-1.45, -0.05], [1.55, -0.05], [1.4, 0.3], [-1.3, 0.35]], head: [-0.25, 1.0], drag: 0.30 },
  { id: 'buggy', ar: 'باجي الكثبان', en: 'Dune Buggy', color: 0xff7a1a, price: 65000, dia: 20,
    desc: 'تعليق طويل وقفزات مذهلة في الصحراء',
    mass: 700, inertia: 720, wheelR: 0.55, rear: [-1.35, -0.35], front: [1.40, -0.35], susp: 0.85, k: 22000, c: 2900,
    torque: 2500, maxW: 62, brake: 3600, grip: 1.08, drive: 'awd', air: 2900, fuel: 55, burn: 1.3, boost: 7000, boostCap: 2.8,
    hull: [[-1.7, 0.0], [1.8, 0.0], [1.4, 0.55], [-1.5, 0.6], [-0.1, 1.0]], head: [-0.1, 1.4], drag: 0.40 },
  { id: 'strider', ar: 'سترايدر الآلي', en: 'Strider Mech', color: 0xb0482c, price: 120000, dia: 60,
    desc: 'مركبة ميكانيكية بأرجل — تمشي على أصعب التضاريس',
    mass: 950, inertia: 1900, wheelR: 0.74, rear: [-1.6, -0.6], front: [1.6, -0.6], susp: 0.9, k: 30000, c: 5600,
    torque: 3000, maxW: 31, brake: 6000, grip: 1.6, drive: 'awd', air: 3800, fuel: 60, burn: 1.25, boost: 7500, boostCap: 2.0, legs: true,
    hull: [[-1.4, -0.1], [1.4, -0.1], [1.2, 0.5], [-1.2, 0.5]], head: [0.0, 1.25], drag: 0.6 },
  { id: 'nova', ar: 'نوفا X', en: 'Nova X', color: 0x22e3ff, price: 250000, dia: 150,
    desc: 'مركبة مستقبلية بعجلات مضيئة ودفع نفاث جبّار',
    mass: 760, inertia: 760, wheelR: 0.48, rear: [-1.35, -0.28], front: [1.40, -0.28], susp: 0.6, k: 32000, c: 3600,
    torque: 3000, maxW: 82, brake: 4500, grip: 1.15, drive: 'awd', air: 3400, fuel: 65, burn: 1.25, boost: 12000, boostCap: 3.4, glow: true,
    hull: [[-1.8, 0.0], [1.95, 0.0], [1.6, 0.45], [-1.6, 0.5], [-0.2, 0.8]], head: [-0.2, 1.25], drag: 0.28 },
];

export const UPGRADES = [
  { id: 'engine', ar: 'المحرك', en: 'Engine', icon: '⚙️', desc: 'قوة وتسارع أعلى' },
  { id: 'susp', ar: 'التعليق', en: 'Suspension', icon: '🛞', desc: 'امتصاص أفضل للصدمات' },
  { id: 'tires', ar: 'الإطارات', en: 'Tires', icon: '🔘', desc: 'تماسك أقوى مع الأرض' },
  { id: 'tank', ar: 'خزان الوقود', en: 'Fuel Tank', icon: '⛽', desc: 'سعة وقود أكبر' },
  { id: 'boost', ar: 'التعزيز', en: 'Boost', icon: '🚀', desc: 'دفعة أقوى وأطول' },
  { id: 'stab', ar: 'الثبات', en: 'Stability', icon: '⚖️', desc: 'تحكم أفضل في الهواء وثبات أعلى' },
];
export const MAX_LVL = 10;
export function upgradeCost(v, up, lvl) {
  const base = 900 + v.price * 0.035; const mult = { engine: 1.25, susp: 1, tires: 1, tank: 0.85, boost: 1.1, stab: 0.95 }[up];
  return Math.round(base * mult * Math.pow(1.55, lvl) / 50) * 50;
}

// Effective physics parameters after upgrades (each level has a real effect)
export function tuned(v, lv = {}) {
  const L = k => lv[k] || 0;
  return Object.assign({}, v, {
    torque: v.torque * (1 + 0.075 * L('engine')),
    maxW: v.maxW * (1 + 0.035 * L('engine')),
    k: v.k * (1 + 0.04 * L('susp')),
    c: v.c * (1 + 0.07 * L('susp')),
    susp: v.susp * (1 + 0.025 * L('susp')),
    grip: v.grip * (1 + 0.055 * L('tires')),
    fuel: v.fuel * (1 + 0.12 * L('tank')),
    boost: v.boost * (1 + 0.08 * L('boost')),
    boostCap: v.boostCap * (1 + 0.1 * L('boost')),
    air: v.air * (1 + 0.08 * L('stab')),
    angDamp: 0.15 + 0.06 * L('stab'),
  });
}

// Displayed stat bars 0..1
export function statBars(v, lv) {
  const t = tuned(v, lv);
  return {
    speed: Math.min(1, t.maxW * t.wheelR / 50),
    power: Math.min(1, t.torque / t.mass / 4.4),
    grip: Math.min(1, t.grip / 1.9),
    fuel: Math.min(1, t.fuel / 130),
    boost: Math.min(1, t.boost / t.mass / 22),
  };
}
