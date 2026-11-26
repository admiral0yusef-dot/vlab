// ============================================================
// OFFROAD LEGENDS — save.js : auto-save (localStorage) + progression data
// ============================================================
import { VEHICLES } from './vehicles.js';
import { WORLDS } from './terrain.js';

const KEY = 'offroadLegends.save.v1';
const blankLv = () => ({ engine: 0, susp: 0, tires: 0, tank: 0, boost: 0, stab: 0 });
export function defaults() {
  const lv = {}; VEHICLES.forEach(v => lv[v.id] = blankLv());
  return {
    v: 1, coins: 1500, dia: 5, owned: ['ranger'], sel: 'ranger', lv, worlds: [0], selWorld: 0,
    best: {}, bestAny: 0, ach: {}, ch: {}, chIdx: 0, daily: { date: '', id: -1, done: false },
    stats: { runs: 0, dist: 0, coins: 0, flips: 0, fuel: 0, dia: 0, maxAir: 0, secrets: 0 },
    discovered: [0], settings: { sfx: 0.8, mus: 0.45, quality: 'auto', shake: true, hints: true },
  };
}
export function load() {
  try { const raw = localStorage.getItem(KEY); if (!raw) return defaults(); const s = JSON.parse(raw), d = defaults();
    // forward-compatible merge
    const out = Object.assign(d, s); out.lv = Object.assign(d.lv, s.lv || {}); for (const k in d.lv) out.lv[k] = Object.assign(blankLv(), out.lv[k]);
    out.stats = Object.assign(defaults().stats, s.stats || {}); out.settings = Object.assign(defaults().settings, s.settings || {}); out.daily = Object.assign(defaults().daily, s.daily || {});
    return out;
  } catch (e) { return defaults(); }
}
export function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }
export function reset() { try { localStorage.removeItem(KEY); } catch (e) { } return defaults(); }

// ---------------- challenges (stages, unlocked in order) ----------------
// test(run, save) -> true when completed. run = summary of the finished/ongoing run.
export const CHALLENGES = [
  { id: 'c1', ar: 'اقطع مسافة 300 متر', rew: [1000, 0], test: r => r.dist >= 300 },
  { id: 'c2', ar: 'اجمع 1500 عملة في جولة واحدة', rew: [1500, 0], test: r => r.coins >= 1500 },
  { id: 'c3', ar: 'ابقَ في الهواء 1.5 ثانية في قفزة واحدة', rew: [2000, 2], test: r => r.maxAir >= 1.5 },
  { id: 'c4', ar: 'اقطع 600 متر في الصحراء', rew: [3000, 5], test: r => r.startWorld === 1 && r.dist >= 600 },
  { id: 'c5', ar: 'نفّذ شقلبة كاملة في الهواء', rew: [3000, 5], test: r => r.flips >= 1 },
  { id: 'c6', ar: 'اقطع 1000 متر في جولة واحدة', rew: [5000, 5], test: r => r.dist >= 1000 },
  { id: 'c7', ar: 'التقط 5 عبوات وقود في جولة واحدة', rew: [4000, 5], test: r => r.fuel >= 5 },
  { id: 'c8', ar: 'اقطع 800 متر في الجبال الثلجية', rew: [6000, 10], test: r => r.startWorld === 2 && r.dist >= 800 },
  { id: 'c9', ar: 'نفّذ 3 شقلبات في جولة واحدة', rew: [8000, 10], test: r => r.flips >= 3 },
  { id: 'c10', ar: 'اقطع 1100 متر دون استخدام التعزيز', rew: [9000, 10], test: r => r.dist >= 1100 && !r.usedBoost },
  { id: 'c11', ar: 'اقطع 900 متر في الوادي الصخري', rew: [12000, 15], test: r => r.startWorld === 3 && r.dist >= 900 },
  { id: 'c12', ar: 'اقطع 800 متر بمركبة سترايدر الآلية', rew: [15000, 20], test: r => r.vehicle === 'strider' && r.dist >= 800 },
  { id: 'c13', ar: 'اقطع 2000 متر في جولة واحدة', rew: [20000, 20], test: r => r.dist >= 2000 },
  { id: 'c14', ar: 'اجمع 3 ماسات في جولة واحدة', rew: [15000, 25], test: r => r.dia >= 3 },
  { id: 'c15', ar: 'اعبر 3 عوالم متتالية في جولة واحدة', rew: [30000, 40], test: r => r.zones >= 3 },
];
export const ACHIEVEMENTS = [
  { id: 'first', ar: 'أول انطلاقة', d: 'أكمل جولتك الأولى', dia: 2, test: s => s.stats.runs >= 1 },
  { id: 'flip1', ar: 'بهلوان', d: 'نفّذ أول شقلبة', dia: 3, test: s => s.stats.flips >= 1 },
  { id: 'flip25', ar: 'سيد الشقلبات', d: 'نفّذ 25 شقلبة', dia: 10, test: s => s.stats.flips >= 25 },
  { id: 'air3', ar: 'طائر', d: 'ابقَ في الهواء 3 ثوانٍ', dia: 5, test: s => s.stats.maxAir >= 3 },
  { id: 'd1k', ar: 'رحّالة', d: 'اقطع 1000 متر في جولة', dia: 4, test: s => s.bestAny >= 1000 },
  { id: 'd3k', ar: 'أسطورة الطرق الوعرة', d: 'اقطع 3000 متر في جولة', dia: 15, test: s => s.bestAny >= 3000 },
  { id: 'tot20k', ar: 'عدّاد لا يتوقف', d: 'اقطع 20 كم إجمالاً', dia: 10, test: s => s.stats.dist >= 20000 },
  { id: 'coins50k', ar: 'جامع الكنوز', d: 'اجمع 50,000 عملة إجمالاً', dia: 8, test: s => s.stats.coins >= 50000 },
  { id: 'fuel50', ar: 'لا يجف الخزان', d: 'التقط 50 عبوة وقود', dia: 6, test: s => s.stats.fuel >= 50 },
  { id: 'car2', ar: 'مرآب متنامٍ', d: 'اشترِ مركبة جديدة', dia: 4, test: s => s.owned.length >= 2 },
  { id: 'car6', ar: 'المجموعة الكاملة', d: 'امتلك جميع المركبات', dia: 50, test: s => s.owned.length >= VEHICLES.length },
  { id: 'max', ar: 'ميكانيكي محترف', d: 'طوّر أي جزء للمستوى الأقصى', dia: 8, test: s => Object.values(s.lv).some(l => Object.values(l).some(x => x >= 10)) },
  { id: 'worlds', ar: 'مستكشف العوالم', d: 'اكتشف العوالم السبعة', dia: 30, test: s => s.discovered.length >= WORLDS.length },
  { id: 'secret', ar: 'الكنز المخفي', d: 'اعثر على مخبأ ماس سري', dia: 10, test: s => s.stats.secrets >= 1 },
];
// ---------------- daily challenge (deterministic by date) ----------------
const DAILY = [
  { ar: n => `اجمع ${n} عملة في جولة`, n: [2000, 3500, 5000], test: (r, n) => r.coins >= n },
  { ar: n => `اقطع ${n} متر`, n: [500, 800, 1200], test: (r, n) => r.dist >= n },
  { ar: n => `نفّذ ${n} شقلبات في جولة`, n: [1, 2, 3], test: (r, n) => r.flips >= n },
  { ar: n => `ابقَ في الهواء ${n} ثانية`, n: [1.5, 2, 2.5], test: (r, n) => r.maxAir >= n },
  { ar: n => `التقط ${n} عبوات وقود`, n: [3, 4, 6], test: (r, n) => r.fuel >= n },
];
export function today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
export function dailyFor(date) {
  let h = 0; for (const ch of date) h = (h * 31 + ch.charCodeAt(0)) | 0; h = Math.abs(h);
  const D = DAILY[h % DAILY.length], n = D.n[(h >> 3) % D.n.length];
  return { text: D.ar(n), test: r => D.test(r, n), rew: [2500 + (h % 5) * 500, 8] };
}
