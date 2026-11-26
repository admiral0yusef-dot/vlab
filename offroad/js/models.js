// ============================================================
// OFFROAD LEGENDS — models.js
// Original 3D vehicle, driver and pickup models built from geometry
// (rounded extrusions, lathes, cylinders) — no external assets.
// ============================================================
import * as THREE from '../lib/three.module.min.js';

const matCache = new Map();
export function mat(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.08 }, o)));
  return matCache.get(key);
}
const M = {
  tire: () => mat(0x1c1d21, { roughness: 0.92 }),
  rim: () => mat(0xc9ced6, { roughness: 0.3, metalness: 0.75 }),
  dark: () => mat(0x2a2d34, { roughness: 0.6 }),
  chrome: () => mat(0xe8edf3, { roughness: 0.18, metalness: 0.9 }),
  glass: () => mat(0x9fd8ff, { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.55 }),
  skin: () => mat(0xf2c39b, { roughness: 0.7 }),
  light: () => mat(0xfff6c8, { emissive: 0xfff2a0, emissiveIntensity: 1.2 }),
  red: () => mat(0xff3b30, { emissive: 0xaa1010, emissiveIntensity: 0.8 }),
};

// Rounded box via extruded rounded-rect profile (x length, y height, z depth)
export function rbox(w, h, d, r = 0.12, color = 0xffffff, o) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const bev = Math.min(r * 0.6, d * 0.2);
  const g = new THREE.ExtrudeGeometry(s, { depth: d - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 6 });
  g.translate(0, 0, -(d - bev * 2) / 2); g.computeVertexNormals();
  const m = new THREE.Mesh(g, color instanceof THREE.Material ? color : mat(color, o)); m.castShadow = true; m.receiveShadow = true; return m;
}
// Custom side-profile body (points in x,y) extruded in z
export function profile(pts, d, color, bevel = 0.08) {
  const s = new THREE.Shape(); s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3 });
  g.translate(0, 0, -(d - bevel * 2) / 2); g.computeVertexNormals();
  const m = new THREE.Mesh(g, color instanceof THREE.Material ? color : mat(color)); m.castShadow = true; return m;
}
const cyl = (r1, r2, h, c, seg = 16) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), c instanceof THREE.Material ? c : mat(c)); m.castShadow = true; return m; };
const sph = (r, c, seg = 16) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg * 0.75 | 0)), c instanceof THREE.Material ? c : mat(c)); m.castShadow = true; return m; };
const at = (o, x, y, z, rx = 0, ry = 0, rz = 0) => { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); return o; };

// ---------- wheel with tread blocks, rim, spokes ----------
export function makeWheel(R, width, style = 'offroad', accent = 0xffcc00) {
  const g = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(R, R, width, 28, 1), M.tire()); tire.rotation.x = Math.PI / 2; tire.castShadow = true; g.add(tire);
  // tread lugs
  const lugs = style === 'slick' ? 0 : style === 'big' ? 22 : 18;
  if (lugs) {
    const lugG = new THREE.BoxGeometry(R * 0.2, R * 0.12, width * 1.02), lm = M.tire();
    const inst = new THREE.InstancedMesh(lugG, lm, lugs); const o = new THREE.Object3D();
    for (let i = 0; i < lugs; i++) { const a = i / lugs * Math.PI * 2; o.position.set(Math.cos(a) * R * 0.99, Math.sin(a) * R * 0.99, 0); o.rotation.set(0, 0, a); o.scale.set(1, 1, i % 2 ? 0.8 : 1); o.updateMatrix(); inst.setMatrixAt(i, o.matrix); }
    inst.castShadow = true; g.add(inst);
  }
  const rimR = R * (style === 'big' ? 0.5 : 0.6);
  const rimM = style === 'neon' ? mat(0x111827, { metalness: 0.8, roughness: 0.25 }) : M.rim();
  for (const sz of [1, -1]) {
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(rimR, rimR, 0.06, 24), rimM); rim.rotation.x = Math.PI / 2; rim.position.z = sz * width * 0.5; g.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(rimR * 0.28, rimR * 0.28, 0.1, 12), style === 'neon' ? mat(accent, { emissive: accent, emissiveIntensity: 2 }) : mat(accent, { metalness: 0.6, roughness: 0.3 })); hub.rotation.x = Math.PI / 2; hub.position.z = sz * (width * 0.5 + 0.03); g.add(hub);
    for (let k = 0; k < 5; k++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(rimR * 0.95, rimR * 0.16, 0.05), rimM); const a = k / 5 * Math.PI * 2; sp.position.set(Math.cos(a) * rimR * 0.48, Math.sin(a) * rimR * 0.48, sz * (width * 0.5 + 0.02)); sp.rotation.z = a; g.add(sp); }
    if (style === 'neon') { const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 0.82, 0.035, 8, 40), mat(accent, { emissive: accent, emissiveIntensity: 2.4 })); ring.position.z = sz * width * 0.52; g.add(ring); }
  }
  return g;
}

// ---------- driver (original character: helmet + goggles) ----------
export function makeDriver(helmet = 0xffffff, suit = 0x2b6cb0) {
  const g = new THREE.Group();
  const body = rbox(0.42, 0.62, 0.42, 0.18, suit); at(body, 0, 0.3, 0, 0, 0, -0.15); g.add(body);
  const head = new THREE.Group(); head.position.set(0.02, 0.86, 0); g.add(head);
  head.add(sph(0.2, M.skin(), 18));
  const hel = new THREE.Mesh(new THREE.SphereGeometry(0.235, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58), mat(helmet, { roughness: 0.35 })); hel.castShadow = true; hel.rotation.z = 0.25; head.add(hel);
  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 24, Math.PI), mat(0xff3b30)); stripe.rotation.set(0, Math.PI / 2, 0.2); stripe.position.y = 0.05; head.add(stripe);
  const gog = rbox(0.1, 0.09, 0.34, 0.04, mat(0x22313f, { roughness: 0.2, metalness: 0.4 })); gog.position.set(0.17, 0.04, 0); head.add(gog);
  const nose = sph(0.05, M.skin(), 10); nose.position.set(0.2, -0.04, 0); head.add(nose);
  const arm = rbox(0.42, 0.12, 0.12, 0.05, suit); at(arm, 0.25, 0.45, 0.16, 0, 0, -0.5); g.add(arm);
  const arm2 = arm.clone(); arm2.position.z = -0.16; g.add(arm2);
  g.userData.head = head; return g;
}

function lights(g, x, y, z, s = 1) { for (const zz of [z, -z]) { const l = cyl(0.11 * s, 0.11 * s, 0.06, M.light(), 14); l.rotation.z = Math.PI / 2; l.position.set(x, y, zz); g.add(l); } }
function tail(g, x, y, z) { for (const zz of [z, -z]) { const l = rbox(0.06, 0.14, 0.18, 0.03, M.red()); l.position.set(x, y, zz); g.add(l); } }

// ============================================================
// Vehicle builders. Return {body, wheels:[rearPair, frontPair], exhaust, driver, legs?}
// body is placed in chassis-local coordinates (origin = centre of mass)
// ============================================================
export function buildVehicle(v) {
  const body = new THREE.Group(); const C = v.color; let wheelStyle = 'offroad', ww = 0.42, track = 1.0, accent = 0xffcc00;
  let driverPos = [-0.15, 0.25], exhaust = [-1.75, 0.15, 0.55];
  switch (v.id) {
    case 'ranger': {
      body.add(at(profile([[-1.78, -0.15], [1.8, -0.15], [1.86, 0.32], [1.15, 0.42], [0.55, 0.45], [0.35, 0.5], [-1.7, 0.5]], 1.7, C, 0.1), 0, 0, 0));
      body.add(at(rbox(0.9, 0.08, 1.6, 0.04, mat(0x222428)), 1.2, 0.47, 0)); // hood vent
      const ws = profile([[0.3, 0.48], [0.55, 0.48], [0.22, 1.05], [0.1, 1.05]], 1.5, M.glass(), 0.03); body.add(ws);
      const frame = new THREE.Group(); body.add(frame);
      for (const z of [0.78, -0.78]) { const b = cyl(0.045, 0.045, 1.6, M.dark(), 8); b.rotation.z = Math.PI / 2 - 0.1; b.position.set(-0.75, 1.05, z); frame.add(b); const p = cyl(0.045, 0.045, 0.6, M.dark(), 8); p.position.set(-1.5, 0.78, z); frame.add(p); }
      const roll = cyl(0.05, 0.05, 1.6, M.dark(), 8); roll.rotation.x = Math.PI / 2; roll.position.set(0.05, 1.05, 0); frame.add(roll);
      body.add(at(rbox(0.5, 0.42, 0.42, 0.08, mat(0x3a3f47)), -1.95, 0.3, 0)); // spare wheel mount
      const spare = makeWheel(0.3, 0.22); spare.rotation.y = Math.PI / 2; spare.position.set(-2.12, 0.35, 0); body.add(spare);
      body.add(at(rbox(0.2, 0.18, 1.82, 0.06, M.chrome()), 1.9, -0.05, 0)); // bumper
      body.add(at(rbox(0.2, 0.18, 1.82, 0.06, M.dark()), -1.82, -0.05, 0));
      lights(body, 1.86, 0.18, 0.55); tail(body, -1.8, 0.28, 0.65);
      const ant = cyl(0.012, 0.012, 1.1, M.dark(), 5); ant.position.set(-1.55, 1.15, 0.6); ant.rotation.z = 0.2; body.add(ant);
      driverPos = [-0.35, 0.2]; break;
    }
    case 'truck': {
      wheelStyle = 'big'; ww = 0.55; track = 1.12; accent = 0xffffff;
      body.add(profile([[-2.15, -0.05], [2.2, -0.05], [2.25, 0.45], [1.0, 0.62], [0.7, 0.62], [0.55, 1.45], [-0.55, 1.5], [-0.62, 0.7], [-2.1, 0.7]], 1.9, C, 0.1));
      body.add(at(profile([[0.52, 0.7], [0.66, 0.7], [0.5, 1.35], [0.38, 1.35]], 1.75, M.glass(), 0.02), 0, 0, 0));
      for (const z of [0.97, -0.97]) { const win = rbox(0.75, 0.48, 0.03, 0.06, M.glass()); win.position.set(0.0, 1.08, z); body.add(win); }
      body.add(at(rbox(1.4, 0.16, 1.9, 0.06, mat(0x23262b)), -1.35, 0.78, 0)); // bed rail
      body.add(at(rbox(0.8, 0.12, 1.7, 0.05, mat(0x30343b)), 0.0, 1.55, 0)); // roof rack
      for (let i = 0; i < 4; i++) body.add(at(cyl(0.07, 0.07, 0.08, M.light(), 10), 0.25 - i * 0.18, 1.62, 0, Math.PI / 2, 0, 0));
      body.add(at(rbox(0.25, 0.3, 2.0, 0.08, M.chrome()), 2.32, 0.15, 0));
      for (let i = 0; i < 5; i++) body.add(at(rbox(0.04, 0.24, 1.2, 0.01, M.dark()), 2.43, 0.18, 0, 0, 0, 0));
      lights(body, 2.3, 0.42, 0.62, 1.3); tail(body, -2.15, 0.45, 0.75);
      const ex = cyl(0.07, 0.07, 1.1, M.chrome(), 10); ex.position.set(-0.7, 1.25, -0.85); body.add(ex);
      exhaust = [-0.7, 1.85, -0.85]; driverPos = [0.0, 0.62]; break;
    }
    case 'kart': {
      wheelStyle = 'slick'; ww = 0.38; track = 0.92; accent = 0xff3b30;
      body.add(profile([[-1.5, -0.12], [1.62, -0.12], [1.7, 0.02], [0.9, 0.18], [0.2, 0.22], [-0.5, 0.42], [-1.45, 0.42]], 1.2, C, 0.08));
      body.add(at(profile([[1.0, 0.1], [1.75, -0.02], [1.78, 0.04], [1.05, 0.22]], 1.9, mat(0x1b1e24), 0.03), 0, 0, 0)); // front wing
      const wing = rbox(0.5, 0.06, 1.7, 0.03, mat(0x1b1e24)); wing.position.set(-1.45, 0.95, 0); body.add(wing);
      for (const z of [0.5, -0.5]) body.add(at(rbox(0.06, 0.5, 0.06, 0.02, mat(0x1b1e24)), -1.4, 0.68, z));
      body.add(at(rbox(0.7, 0.06, 0.04, 0.02, mat(0xffffff)), 0.5, 0.2, 0.61)); body.add(at(rbox(0.7, 0.06, 0.04, 0.02, mat(0xffffff)), 0.5, 0.2, -0.61));
      const num = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), mat(0xffffff)); num.position.set(0.55, 0.12, 0.62); body.add(num);
      const ex = cyl(0.06, 0.08, 0.35, M.chrome(), 10); ex.rotation.z = Math.PI / 2; ex.position.set(-1.62, 0.2, 0.25); body.add(ex);
      exhaust = [-1.82, 0.2, 0.25]; driverPos = [-0.3, -0.05]; break;
    }
    case 'buggy': {
      wheelStyle = 'offroad'; ww = 0.5; track = 1.08; accent = 0x111111;
      body.add(profile([[-1.5, -0.1], [1.55, -0.1], [1.7, 0.2], [0.9, 0.35], [-1.3, 0.35]], 1.3, C, 0.08));
      const cage = new THREE.Group(); body.add(cage); const tm = mat(0x2a2a2a, { metalness: 0.6, roughness: 0.4 });
      const tube = (a, b, z) => { const A = new THREE.Vector3(a[0], a[1], z), B = new THREE.Vector3(b[0], b[1], z); const L = A.distanceTo(B); const m = cyl(0.045, 0.045, L, tm, 8); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); cage.add(m); };
      for (const z of [0.62, -0.62]) { tube([-1.2, 0.35], [-0.7, 1.15], z); tube([-0.7, 1.15], [0.45, 1.15], z); tube([0.45, 1.15], [1.0, 0.35], z); tube([-1.2, 0.35], [1.0, 0.35], z); }
      for (const x of [-0.7, 0.45]) { const m = cyl(0.045, 0.045, 1.24, tm, 8); m.rotation.x = Math.PI / 2; m.position.set(x, 1.15, 0); cage.add(m); }
      body.add(at(rbox(1.2, 0.05, 1.3, 0.02, mat(0x3b3b3b)), -0.12, 1.18, 0));
      const eng = rbox(0.6, 0.45, 0.8, 0.1, mat(0x555a62, { metalness: 0.6 })); eng.position.set(-1.25, 0.55, 0); body.add(eng);
      lights(body, 1.4, 1.2, 0.35, 0.9);
      exhaust = [-1.7, 0.6, 0.3]; driverPos = [-0.1, 0.25]; break;
    }
    case 'strider': {
      wheelStyle = 'none'; accent = 0xff9f1a;
      const hull = profile([[-1.3, -0.2], [1.3, -0.2], [1.5, 0.15], [1.1, 0.45], [-1.1, 0.45], [-1.45, 0.15]], 1.3, C, 0.1); body.add(hull);
      const eng = cyl(0.32, 0.32, 1.1, mat(0x8a8f99, { metalness: 0.7, roughness: 0.35 }), 18); eng.rotation.z = Math.PI / 2; eng.position.set(-0.3, -0.2, 0); body.add(eng);
      for (let i = 0; i < 6; i++) body.add(at(cyl(0.34, 0.34, 0.05, mat(0x5b6069, { metalness: 0.7 }), 18), -0.75 + i * 0.18, -0.2, 0, 0, 0, Math.PI / 2));
      for (const [x, z] of [[-1.3, 0.75], [1.3, 0.75], [-1.3, -0.75], [1.3, -0.75]]) { const gear = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 10), mat(0xf0a020, { metalness: 0.7, roughness: 0.3 })); gear.rotation.x = Math.PI / 2; gear.position.set(x, 0.05, z); body.add(gear); }
      lights(body, 1.45, 0.25, 0.4); exhaust = [-1.4, 0.35, 0.3]; driverPos = [0.0, 0.3]; break;
    }
    case 'nova': {
      wheelStyle = 'neon'; ww = 0.4; track = 1.0; accent = 0x22e3ff;
      body.add(profile([[-1.85, -0.1], [1.95, -0.08], [2.05, 0.08], [1.0, 0.32], [0.3, 0.75], [-0.6, 0.78], [-1.4, 0.45], [-1.85, 0.4]], 1.7, mat(0x101426, { metalness: 0.7, roughness: 0.25 }), 0.12));
      body.add(at(profile([[0.28, 0.7], [0.95, 0.35], [0.4, 0.72], [-0.55, 0.76]], 1.45, mat(0x4ff0ff, { transparent: true, opacity: 0.55, emissive: 0x0a5a70, roughness: 0.05 }), 0.04), 0, 0.02, 0));
      const stripeM = mat(0x22e3ff, { emissive: 0x22e3ff, emissiveIntensity: 2.2 });
      for (const z of [0.86, -0.86]) { const st = rbox(3.4, 0.05, 0.03, 0.02, stripeM); st.position.set(0.05, 0.12, z); body.add(st); }
      const fin = profile([[-1.85, 0.4], [-1.45, 0.45], [-1.75, 1.05], [-1.95, 1.05]], 0.12, stripeM, 0.02); body.add(fin);
      const under = rbox(3.2, 0.04, 1.3, 0.02, mat(0xff2bd6, { emissive: 0xff2bd6, emissiveIntensity: 2.5 })); under.position.set(0, -0.14, 0); body.add(under);
      for (const z of [0.4, -0.4]) { const th = cyl(0.12, 0.15, 0.3, mat(0x9aa3b5, { metalness: 0.9, roughness: 0.2 }), 12); th.rotation.z = Math.PI / 2; th.position.set(-1.95, 0.22, z); body.add(th); }
      exhaust = [-2.15, 0.22, 0]; driverPos = [-0.25, 0.12]; break;
    }
  }
  const driver = makeDriver(v.id === 'nova' ? 0x222b45 : 0xffffff, v.id === 'truck' ? 0x3a7d44 : v.id === 'nova' ? 0x5b21b6 : 0x2b6cb0);
  driver.position.set(driverPos[0], driverPos[1], v.id === 'truck' ? 0.25 : 0); if (v.id === 'kart') driver.scale.setScalar(0.92);
  body.add(driver);

  const wheels = [];
  if (wheelStyle !== 'none') {
    for (let i = 0; i < 2; i++) {
      const pair = new THREE.Group();
      for (const z of [track, -track]) { const w = makeWheel(v.wheelR, ww, wheelStyle, accent); w.position.z = z; pair.add(w); }
      wheels.push(pair);
    }
  }
  let legs = null;
  if (v.legs) legs = buildLegs(v);
  return { body, wheels, driver, exhaust, legs, track, glow: !!v.glow };
}

// ---------- walker legs (two-bone IK, animated from the physics wheels) ----------
function buildLegs(v) {
  const g = new THREE.Group(); const legs = [];
  const thM = mat(0x8c96a3, { metalness: 0.75, roughness: 0.3 }), jM = mat(0xf0a020, { metalness: 0.7, roughness: 0.3 }), fM = mat(0x3a3f47);
  const mk = (hip, z, phase, wheel) => {
    const up = new THREE.Group(), lo = new THREE.Group(), foot = rbox(0.5, 0.12, 0.34, 0.05, fM);
    const ub = rbox(1.0, 0.16, 0.16, 0.06, thM); ub.position.x = 0.5; up.add(ub);
    const lb = rbox(1.05, 0.14, 0.14, 0.05, thM); lb.position.x = 0.52; lo.add(lb);
    const j1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.22, 12), jM); j1.rotation.x = Math.PI / 2; up.add(j1);
    const j2 = j1.clone(); lo.add(j2);
    for (let k = 0; k < 3; k++) { const st = cyl(0.03, 0.03, 0.9, thM, 6); st.rotation.z = Math.PI / 2; st.position.set(0.5, 0.07 * (k - 1), 0.1); up.add(st); }
    g.add(up, lo, foot); legs.push({ hip, z, phase, wheel, up, lo, foot, L1: 1.0, L2: 1.05 });
  };
  mk([-1.25, 0.0], 0.85, 0, 0); mk([-1.25, 0.0], -0.85, Math.PI, 0); mk([1.25, 0.0], 0.85, Math.PI, 1); mk([1.25, 0.0], -0.85, 0, 1);
  return { group: g, legs };
}
// Update legs: chassis (x,y,a), physics wheels, terrain
export function updateLegs(L, car, T) {
  const c = Math.cos(car.a), s = Math.sin(car.a);
  for (const leg of L.legs) {
    const hx = car.x + leg.hip[0] * c - leg.hip[1] * s, hy = car.y + leg.hip[0] * s + leg.hip[1] * c;
    const W = car.wheels[leg.wheel]; const ph = W.ang * 0.5 + leg.phase;
    const stride = 0.9, lift = Math.max(0, Math.sin(ph)) * 0.55;
    const fx = hx + Math.cos(ph) * stride * 0.6 + car.vx * 0.04; let fy = T.height(fx) + lift + 0.06;
    let dx = fx - hx, dy = fy - hy; let d = Math.hypot(dx, dy); const maxD = leg.L1 + leg.L2 - 0.02;
    if (d > maxD) { dx *= maxD / d; dy *= maxD / d; d = maxD; fy = hy + dy; }
    const base = Math.atan2(dy, dx); const cosA = (leg.L1 * leg.L1 + d * d - leg.L2 * leg.L2) / (2 * leg.L1 * d);
    const A = Math.acos(Math.max(-1, Math.min(1, cosA))); const a1 = base + (leg.hip[0] < 0 ? A : -A);
    const kx = hx + Math.cos(a1) * leg.L1, ky = hy + Math.sin(a1) * leg.L1; const a2 = Math.atan2(hy + dy - ky, hx + dx - kx);
    leg.up.position.set(hx, hy, leg.z); leg.up.rotation.z = a1;
    leg.lo.position.set(kx, ky, leg.z); leg.lo.rotation.z = a2;
    leg.foot.position.set(hx + dx, hy + dy - 0.02, leg.z); leg.foot.rotation.z = Math.atan(T.slope(hx + dx)) * (lift < 0.05 ? 1 : 0.4);
  }
}

// ============================================================
// Pickups
// ============================================================
function coinTexture(val) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const col = { 5: ['#ffd84a', '#d39a10'], 25: ['#ffe066', '#c9850d'], 100: ['#ffb627', '#b8650a'], 500: ['#ff7b3a', '#a8360b'] }[val] || ['#ffd84a', '#d39a10'];
  const g = x.createRadialGradient(50, 44, 8, 64, 64, 64); g.addColorStop(0, '#fff6c2'); g.addColorStop(0.35, col[0]); g.addColorStop(1, col[1]);
  x.fillStyle = g; x.beginPath(); x.arc(64, 64, 62, 0, 7); x.fill();
  x.lineWidth = 6; x.strokeStyle = 'rgba(120,60,0,.45)'; x.beginPath(); x.arc(64, 64, 50, 0, 7); x.stroke();
  x.fillStyle = '#7a3d00'; x.font = `900 ${val >= 100 ? 40 : 52}px Arial Black, Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(val), 64, 68);
  x.fillStyle = '#fff3b0'; x.fillText(String(val), 62, 65);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.center.set(.5, .5); t.rotation = Math.PI / 2; return t;
}
export const COIN_VALUES = [5, 25, 100, 500];
export function coinAssets() {
  const geo = new THREE.CylinderGeometry(0.55, 0.55, 0.14, 28); geo.rotateX(Math.PI / 2);
  const side = mat(0xd9a316, { metalness: 0.85, roughness: 0.25, emissive: 0x4a3000, emissiveIntensity: 0.4 });
  const mats = {};
  for (const v of COIN_VALUES) { const face = new THREE.MeshStandardMaterial({ map: coinTexture(v), metalness: 0.55, roughness: 0.3, emissive: 0x3a2600, emissiveIntensity: 0.35 }); mats[v] = [side, face, face]; }
  return { geo, mats };
}
export function makeFuelCan() {
  const g = new THREE.Group(); const red = mat(0xe02424, { roughness: 0.35 });
  const b = rbox(0.62, 0.8, 0.34, 0.1, red); b.position.y = 0; g.add(b);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 8, 16, Math.PI), mat(0xb81818)); h.position.set(-0.08, 0.42, 0); g.add(h);
  const cap = cyl(0.07, 0.07, 0.16, mat(0x333333), 10); cap.position.set(0.2, 0.46, 0); cap.rotation.z = -0.5; g.add(cap);
  const x1 = rbox(0.42, 0.05, 0.02, 0.02, mat(0xffd0d0)); x1.rotation.z = 0.6; x1.position.z = 0.18; g.add(x1);
  const x2 = x1.clone(); x2.rotation.z = -0.6; g.add(x2);
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.72, 32), new THREE.MeshBasicMaterial({ color: 0xfff1a0, transparent: true, opacity: 0.5, side: THREE.DoubleSide })); halo.position.z = -0.25; g.add(halo);
  return g;
}
export function diamondAssets() {
  const geo = new THREE.OctahedronGeometry(0.5, 0); geo.scale(1, 1.25, 0.7);
  const m = new THREE.MeshStandardMaterial({ color: 0x5ee7ff, emissive: 0x1aa7d8, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.08, flatShading: true });
  return { geo, mat: m };
}
