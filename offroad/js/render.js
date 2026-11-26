// ============================================================
// OFFROAD LEGENDS — render.js
// Three.js world: layered 3D terrain chunks (road strip + grassy lip
// + textured cliff face + deep back fields), far mountain ranges,
// sky dome, moving clouds, biome-blended lighting/fog, instanced
// scenery per world, ramps, bridges, ice, pipes and pickups.
// ============================================================
import * as THREE from '../lib/three.module.min.js';
import { WORLDS, layoutPickups, rng } from './terrain.js';
import { coinAssets, COIN_VALUES, makeFuelCan, diamondAssets, mat } from './models.js';

const CH = 48, RES = 0.5, COLS = CH / RES + 1;
const ROAD_F = 3.4, LIP = 3.8, ROAD_B = -3.6;
const BACK_Z = [-3.6, -5.2, -7.5, -10.5, -14.5, -19.5, -26, -34, -44, -56, -70];
const tmpC = new THREE.Color(), tmpC2 = new THREE.Color();
const hashf = (a, b) => { let x = (a * 374761393 + b * 668265263) | 0; x = (x ^ (x >>> 13)) * 1274126177 | 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967295; };
const vn2 = (x, z, s) => { const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz, ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz); const a = hashf(ix + s, iz), b = hashf(ix + 1 + s, iz), c = hashf(ix + s, iz + 1), d = hashf(ix + 1 + s, iz + 1); return (a * (1 - ux) + b * ux) * (1 - uz) + (c * (1 - ux) + d * ux) * uz; };

// ---------- geometry merge with per-part vertex colours ----------
function merge(parts) {
  const pos = [], nor = [], col = [];
  for (const { g, c, m } of parts) {
    const geo = g.index ? g.toNonIndexed() : g; if (m) geo.applyMatrix4(m); geo.computeVertexNormals();
    const P = geo.attributes.position.array, N = geo.attributes.normal.array; tmpC.setHex(c);
    for (let i = 0; i < P.length; i += 3) { pos.push(P[i], P[i + 1], P[i + 2]); nor.push(N[i], N[i + 1], N[i + 2]); col.push(tmpC.r, tmpC.g, tmpC.b); }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return out;
}
const T4 = (x, y, z, sx = 1, sy = 1, sz = 1, ry = 0, rz = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, rz)), new THREE.Vector3(sx, sy, sz));
const G = {
  cyl: (a, b, h, s = 8) => new THREE.CylinderGeometry(a, b, h, s), sph: (r, s = 8) => new THREE.IcosahedronGeometry(r, s > 8 ? 2 : 1),
  box: (x, y, z) => new THREE.BoxGeometry(x, y, z), cone: (r, h, s = 8) => new THREE.ConeGeometry(r, h, s), dodec: r => new THREE.DodecahedronGeometry(r, 0),
};

// ---------- scenery prototypes (merged, vertex coloured) ----------
function buildProps() {
  const P = {};
  P.tree = merge([{ g: G.cyl(.18, .26, 2.2), c: 0x7a4b2a, m: T4(0, 1.1, 0) }, { g: G.sph(1.3), c: 0x4fae3b, m: T4(0, 2.9, 0) }, { g: G.sph(1.0), c: 0x5fc246, m: T4(.6, 3.5, .3) }, { g: G.sph(.9), c: 0x46a034, m: T4(-.7, 3.2, -.2) }]);
  P.bush = merge([{ g: G.sph(.7), c: 0x56b13f, m: T4(0, .45, 0) }, { g: G.sph(.55), c: 0x67c24b, m: T4(.6, .4, .2) }, { g: G.sph(.5), c: 0x4a9e36, m: T4(-.55, .35, -.1) }]);
  P.barn = merge([{ g: G.box(5, 3.2, 4), c: 0xc8372d, m: T4(0, 1.6, 0) }, { g: new THREE.CylinderGeometry(0.01, 3.1, 1.8, 4, 1), c: 0x5b3a29, m: T4(0, 4.1, 0, 1.15, 1, .93, Math.PI / 4) }, { g: G.box(1.6, 2, .1), c: 0xf3e6d2, m: T4(0, 1, 2.02) }, { g: G.box(1, .8, .1), c: 0xf7f0e2, m: T4(-1.6, 2.2, 2.02) }]);
  P.fence = merge([{ g: G.box(.12, 1, .12), c: 0x9b6b43, m: T4(-1.5, .5, 0) }, { g: G.box(.12, 1, .12), c: 0x9b6b43, m: T4(1.5, .5, 0) }, { g: G.box(3.2, .12, .08), c: 0xb88358, m: T4(0, .75, 0) }, { g: G.box(3.2, .12, .08), c: 0xb88358, m: T4(0, .4, 0) }]);
  P.hay = merge([{ g: new THREE.CylinderGeometry(.8, .8, 1.3, 14), c: 0xe8c75a, m: T4(0, .8, 0, 1, 1, 1, 0, Math.PI / 2) }]);
  P.rock = merge([{ g: G.dodec(1), c: 0x8d8f94, m: T4(0, .5, 0, 1.2, .8, 1) }, { g: G.dodec(.6), c: 0x7b7d82, m: T4(.9, .3, .3) }]);
  P.cactus = merge([{ g: G.cyl(.32, .36, 3.4, 10), c: 0x3f9b4a, m: T4(0, 1.7, 0) }, { g: G.cyl(.22, .22, 1.2, 8), c: 0x46a852, m: T4(.55, 1.8, 0, 1, 1, 1, 0, -Math.PI / 2) }, { g: G.cyl(.22, .22, 1.1, 8), c: 0x46a852, m: T4(.95, 2.3, 0) }, { g: G.cyl(.2, .2, .9, 8), c: 0x46a852, m: T4(-.5, 1.4, 0, 1, 1, 1, 0, Math.PI / 2) }, { g: G.cyl(.2, .2, .9, 8), c: 0x46a852, m: T4(-.85, 1.85, 0) }]);
  P.palm = merge([{ g: G.cyl(.16, .26, 5, 7), c: 0x9c7046, m: T4(.3, 2.5, 0, 1, 1, 1, 0, -.12) }, ...[0, 1, 2, 3, 4, 5].map(i => ({ g: G.box(2.6, .08, .55), c: i % 2 ? 0x3fa142 : 0x55b84a, m: new THREE.Matrix4().makeRotationY(i * 1.05).multiply(T4(1.1, 4.9, 0, 1, 1, 1, 0, -.35)) }))]);
  P.rockD = merge([{ g: G.dodec(1.2), c: 0xc98f52, m: T4(0, .6, 0, 1.4, .9, 1) }, { g: G.dodec(.7), c: 0xb57a40, m: T4(1.2, .35, .2) }]);
  P.pine = merge([{ g: G.cyl(.16, .22, 1.4), c: 0x6a4325, m: T4(0, .7, 0) }, { g: G.cone(1.5, 2.4, 9), c: 0x2f7d3e, m: T4(0, 2.2, 0) }, { g: G.cone(1.15, 2.0, 9), c: 0x37904a, m: T4(0, 3.3, 0) }, { g: G.cone(.8, 1.6, 9), c: 0x3fa154, m: T4(0, 4.3, 0) }]);
  P.pineS = merge([{ g: G.cyl(.16, .22, 1.4), c: 0x6a4325, m: T4(0, .7, 0) }, { g: G.cone(1.5, 2.4, 9), c: 0x2e6e48, m: T4(0, 2.2, 0) }, { g: G.cone(1.25, .7, 9), c: 0xf4f8ff, m: T4(0, 3.0, 0) }, { g: G.cone(1.15, 2.0, 9), c: 0x2f7a50, m: T4(0, 3.3, 0) }, { g: G.cone(.85, .6, 9), c: 0xf4f8ff, m: T4(0, 4.0, 0) }, { g: G.cone(.6, 1.2, 9), c: 0xf4f8ff, m: T4(0, 4.6, 0) }]);
  P.rockS = merge([{ g: G.dodec(1), c: 0x8798aa, m: T4(0, .5, 0, 1.3, .8, 1) }, { g: G.dodec(.85), c: 0xf4f8ff, m: T4(0, .85, 0, 1.25, .35, .95) }]);
  P.snowman = merge([{ g: G.sph(.7, 12), c: 0xffffff, m: T4(0, .6, 0) }, { g: G.sph(.5, 12), c: 0xffffff, m: T4(0, 1.5, 0) }, { g: G.sph(.35, 12), c: 0xffffff, m: T4(0, 2.2, 0) }, { g: G.cone(.08, .4, 6), c: 0xff8a1a, m: T4(.38, 2.2, 0, 1, 1, 1, 0, -Math.PI / 2) }, { g: G.cyl(.3, .3, .4, 10), c: 0x222222, m: T4(0, 2.6, 0) }]);
  P.pillar = merge([{ g: G.cyl(1.6, 2.4, 9, 7), c: 0xb85a32, m: T4(0, 4.5, 0) }, { g: G.cyl(2.0, 1.6, 1.4, 7), c: 0xd0703f, m: T4(0, 9.4, 0) }, { g: G.cyl(1.9, 1.9, .5, 7), c: 0x9e4a27, m: T4(0, 5, 0) }]);
  P.boulder = merge([{ g: G.dodec(1.4), c: 0xa9552e, m: T4(0, .9, 0, 1.2, .9, 1.1) }]);
  P.dead = merge([{ g: G.cyl(.12, .2, 2.4, 6), c: 0x5a3b26, m: T4(0, 1.2, 0) }, { g: G.cyl(.06, .1, 1.2, 5), c: 0x5a3b26, m: T4(.4, 2.2, 0, 1, 1, 1, 0, -.8) }, { g: G.cyl(.05, .09, 1, 5), c: 0x5a3b26, m: T4(-.35, 1.9, 0, 1, 1, 1, 0, .9) }]);
  P.tree2 = merge([{ g: G.cyl(.25, .35, 3.2), c: 0x5a3a22, m: T4(0, 1.6, 0) }, { g: G.sph(1.8), c: 0x2f8a3c, m: T4(0, 4.4, 0) }, { g: G.sph(1.3), c: 0x3a9b47, m: T4(.9, 5.0, .4) }, { g: G.sph(1.2), c: 0x287a33, m: T4(-1, 4.8, -.3) }]);
  P.mush = merge([{ g: G.cyl(.12, .16, .7, 8), c: 0xf3ead8, m: T4(0, .35, 0) }, { g: new THREE.SphereGeometry(.45, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), c: 0xe0332f, m: T4(0, .68, 0) }]);
  P.log = merge([{ g: G.cyl(.35, .35, 2.4, 10), c: 0x7b5232, m: T4(0, .35, 0, 1, 1, 1, 0, Math.PI / 2) }]);
  P.chimney = merge([{ g: G.cyl(.7, .9, 12, 10), c: 0x8a4b3a, m: T4(0, 6, 0) }, { g: G.cyl(.78, .78, .5, 10), c: 0xd7d7d7, m: T4(0, 10.5, 0) }, { g: G.cyl(.78, .78, .5, 10), c: 0xd7d7d7, m: T4(0, 8.5, 0) }]);
  P.factory = merge([{ g: G.box(8, 5, 6), c: 0x7d858f, m: T4(0, 2.5, 0) }, { g: G.box(8.2, .6, 6.2), c: 0x5c636c, m: T4(0, 5.2, 0) }, ...[0, 1, 2].map(i => ({ g: G.box(1.2, 1.2, .1), c: 0xffd88a, m: T4(-2.5 + i * 2.5, 3, 3.02) }))]);
  P.container = merge([{ g: G.box(5, 2.4, 2.4), c: 0x2f6fd6, m: T4(0, 1.2, 0) }, ...[0, 1, 2, 3, 4, 5, 6].map(i => ({ g: G.box(.08, 2.2, 2.45), c: 0x265cb3, m: T4(-2.2 + i * .73, 1.2, 0) }))]);
  P.container2 = merge([{ g: G.box(5, 2.4, 2.4), c: 0xe0612b, m: T4(0, 1.2, 0) }, ...[0, 1, 2, 3, 4, 5, 6].map(i => ({ g: G.box(.08, 2.2, 2.45), c: 0xbb4f22, m: T4(-2.2 + i * .73, 1.2, 0) }))]);
  P.crane = merge([{ g: G.box(.6, 14, .6), c: 0xf2b705, m: T4(0, 7, 0) }, { g: G.box(12, .5, .5), c: 0xf2b705, m: T4(3.5, 14, 0) }, { g: G.box(1.6, 1.4, 1.4), c: 0x444444, m: T4(-1.5, 13.3, 0) }, { g: G.box(.06, 6, .06), c: 0x333333, m: T4(8, 11, 0) }]);
  P.tank = merge([{ g: G.cyl(2.2, 2.2, 4.5, 16), c: 0xcfd4d9, m: T4(0, 2.25, 0) }, { g: new THREE.SphereGeometry(2.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), c: 0xb9bfc6, m: T4(0, 4.5, 0) }]);
  P.pylon = merge([{ g: G.cyl(.25, .5, 8, 6), c: 0x3a2f8a, m: T4(0, 4, 0) }, { g: G.sph(.55, 12), c: 0x22e3ff, m: T4(0, 8.3, 0) }, { g: new THREE.TorusGeometry(.9, .07, 6, 24), c: 0xff2bd6, m: T4(0, 6.5, 0) }]);
  P.crystal = merge([{ g: new THREE.OctahedronGeometry(1, 0), c: 0x8a6bff, m: T4(0, 1.6, 0, .6, 1.8, .6) }, { g: new THREE.OctahedronGeometry(.6, 0), c: 0x22e3ff, m: T4(.8, .9, .3, .5, 1.3, .5, 0, .4) }, { g: new THREE.OctahedronGeometry(.5, 0), c: 0xff2bd6, m: T4(-.7, .7, -.2, .5, 1.1, .5, 0, -.5) }]);
  P.dome = merge([{ g: new THREE.SphereGeometry(3, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2), c: 0x5b4bd6, m: T4(0, 0, 0) }, { g: new THREE.TorusGeometry(3, .15, 6, 30), c: 0x22e3ff, m: new THREE.Matrix4().makeRotationX(Math.PI / 2) }]);
  P.ring = merge([{ g: new THREE.TorusGeometry(2.2, .18, 8, 32), c: 0x22e3ff, m: T4(0, 6, 0) }]);
  P.tuft = merge([0, 1, 2, 3].map(i => ({ g: G.cone(.12, .7, 4), c: 0x4fae3b, m: T4((i - 1.5) * .18, .3, (i % 2) * .1, 1, 1, 1, 0, (i - 1.5) * .25) })));
  return P;
}
const SCENERY = {
  hills: [['tree', 4], ['bush', 4], ['rock', 1.5], ['barn', .5], ['fence', 2], ['hay', 1.5]],
  desert: [['cactus', 4], ['palm', 1.5], ['rockD', 3]],
  snow: [['pineS', 6], ['rockS', 2.5], ['snowman', .4]],
  canyon: [['pillar', 1.6], ['boulder', 3], ['dead', 2]],
  forest: [['pine', 6], ['tree2', 3], ['mush', 2], ['log', 1]],
  indus: [['factory', 1], ['chimney', 1.2], ['container', 1.4], ['container2', 1.2], ['crane', .4], ['tank', .8]],
  future: [['pylon', 2], ['crystal', 3], ['dome', .6], ['ring', .6]],
};

// ---------- procedural cliff-face texture (neutral, tinted by vertex colour) ----------
function cliffTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#d6d6d6'; x.fillRect(0, 0, 256, 256);
  const R = rng(77);
  for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(0,0,0,${0.03 + R() * 0.05})`; x.beginPath(); x.arc(R() * 256, R() * 256, 1 + R() * 3, 0, 7); x.fill(); }
  for (let i = 0; i < 38; i++) { const px = R() * 256, py = R() * 256, r = 5 + R() * 13; x.fillStyle = `rgba(0,0,0,${0.1 + R() * .08})`; x.beginPath(); x.ellipse(px + 2, py + 2, r, r * .75, R(), 0, 7); x.fill(); x.fillStyle = `rgba(255,255,255,${0.12 + R() * .1})`; x.beginPath(); x.ellipse(px, py, r, r * .75, R(), 0, 7); x.fill(); x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 1.5; x.stroke(); }
  for (let i = 0; i < 26; i++) { x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 2; x.beginPath(); const px = R() * 256, py = R() * 256; x.arc(px, py, 10 + R() * 14, 3.6, 5.8); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function woodTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 64; const x = c.getContext('2d');
  x.fillStyle = '#b07a46'; x.fillRect(0, 0, 128, 64); const R = rng(5);
  for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(80,40,10,${.1 + R() * .15})`; x.lineWidth = 1 + R() * 2; x.beginPath(); const y = R() * 64; x.moveTo(0, y); x.bezierCurveTo(40, y + R() * 6 - 3, 80, y + R() * 6 - 3, 128, y); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ============================================================
export class WorldRenderer {
  constructor(canvas, quality = 'high') {
    this.quality = quality;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: quality === 'high', powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : quality === 'mid' ? 1.5 : 1));
    this.renderer.shadowMap.enabled = quality !== 'low'; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.05;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.5, 900);
    this.scene.fog = new THREE.Fog(0xcfe9fb, 70, 420);
    // lights
    this.hemi = new THREE.HemisphereLight(0xdff3ff, 0x6b5a3a, 1.25); this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xfff1d0, 2.4); this.sun.position.set(-30, 60, 40); this.sun.castShadow = quality !== 'low';
    const sz = quality === 'high' ? 2048 : 1024; this.sun.shadow.mapSize.set(sz, sz); const sc = this.sun.shadow.camera; sc.left = -26; sc.right = 26; sc.top = 20; sc.bottom = -16; sc.near = 1; sc.far = 160; this.sun.shadow.bias = -0.0006; this.sun.shadow.normalBias = 0.03;
    this.scene.add(this.sun, this.sun.target);
    // sky dome
    this.skyU = { top: { value: new THREE.Color(0x7ec8f5) }, bot: { value: new THREE.Color(0xd8f1ff) }, sunDir: { value: new THREE.Vector3(-.4, .6, -.7).normalize() } };
    const sky = new THREE.Mesh(new THREE.SphereGeometry(800, 32, 16), new THREE.ShaderMaterial({
      uniforms: this.skyU, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6+0.15,0.0,1.0); vec3 c = mix(bot, top, pow(h,0.8)); float s = max(dot(vP, sunDir),0.0); c += vec3(1.0,0.9,0.7)*pow(s,350.0)*1.4 + vec3(1.0,0.85,0.6)*pow(s,8.0)*0.18; gl_FragColor = vec4(c,1.0); }'
    }));
    sky.renderOrder = -10; this.sky = sky; this.scene.add(sky);
    // environment map (reflections for metal/chrome/coins) generated from a gradient sky
    { const pm = new THREE.PMREMGenerator(this.renderer); const es = new THREE.Scene(); const eg = new THREE.SphereGeometry(10, 32, 16); const ec = []; const P = eg.attributes.position; const top = new THREE.Color(0x9fd4ff), mid = new THREE.Color(0xfff4e0), bot = new THREE.Color(0x6b5a44);
      for (let i = 0; i < P.count; i++) { const y = P.getY(i) / 10; const c = y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(bot, -y); ec.push(c.r, c.g, c.b); } eg.setAttribute('color', new THREE.Float32BufferAttribute(ec, 3));
      es.add(new THREE.Mesh(eg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide }))); const sunB = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); sunB.position.set(-4, 6, 5); es.add(sunB);
      this.scene.environment = pm.fromScene(es, 0.03).texture; this.scene.environmentIntensity = 0.55; pm.dispose(); }
    this.cliffTex = cliffTexture(); this.woodTex = woodTexture();
    this.matTop = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.matCliff = new THREE.MeshLambertMaterial({ vertexColors: true, map: this.cliffTex });
    this.matBack = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.matProp = new THREE.MeshLambertMaterial({ vertexColors: true });
    this.matGlow = new THREE.MeshBasicMaterial({ vertexColors: true });
    this.matWood = new THREE.MeshLambertMaterial({ map: this.woodTex, color: 0xffffff });
    this.matMetalRamp = mat(0x9aa3ad, { metalness: 0.7, roughness: 0.35 });
    this.matIce = new THREE.MeshStandardMaterial({ color: 0xbfeaff, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.75 });
    this.matWater = new THREE.MeshStandardMaterial({ color: 0x2f8fd0, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.85 });
    this.props = buildProps();
    this.coins = coinAssets(); this.dia = diamondAssets(); this.fuelProto = makeFuelCan();
    this.chunks = new Map(); this.pickups = []; this.T = null;
    this.buildClouds(); this.mountains = [this.makeRange(-190, 1), this.makeRange(-330, 2)];
    this.shake = 0; this.camPos = new THREE.Vector3(0, 5, 20); this.camLook = new THREE.Vector3(); this.fovBase = 48;
    this.resize();
  }
  setQuality(q) { this.quality = q; this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q === 'high' ? 2 : q === 'mid' ? 1.5 : 1)); this.renderer.shadowMap.enabled = q !== 'low'; this.sun.castShadow = q !== 'low'; this.scene.traverse(o => { if (o.material) o.material.needsUpdate = true; }); }
  resize() { const w = window.innerWidth, h = window.innerHeight; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.fovBase = w / h < 1.2 ? 62 : 48; this.camera.updateProjectionMatrix(); }

  // ---------- clouds ----------
  buildClouds() {
    const geo = merge([{ g: G.sph(4, 9), c: 0xffffff, m: T4(0, 0, 0, 1.4, .8, 1) }, { g: G.sph(3.2, 9), c: 0xffffff, m: T4(4, .8, .5) }, { g: G.sph(3, 9), c: 0xf3f7ff, m: T4(-4.2, .3, .3) }, { g: G.sph(2.6, 9), c: 0xf7faff, m: T4(1.5, 2.6, 0) }]);
    this.cloudMat = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x9aa8c0, emissiveIntensity: 0.35, transparent: true, opacity: 0.95 });
    this.clouds = new THREE.InstancedMesh(geo, this.cloudMat, 18); this.cloudData = [];
    const R = rng(3); for (let i = 0; i < 18; i++) this.cloudData.push({ x: R() * 700 - 350, y: 30 + R() * 35, z: -90 - R() * 160, s: .8 + R() * 1.1, v: .6 + R() * 1.4 });
    this.clouds.frustumCulled = false; this.scene.add(this.clouds);
  }
  updateClouds(dt, cx, cy) {
    const o = new THREE.Object3D();
    this.cloudData.forEach((c, i) => { c.x += c.v * dt; let rx = ((c.x - cx * 0.3) % 700 + 1050) % 700 - 350; o.position.set(cx + rx, cy * 0.4 + c.y, c.z); o.scale.setScalar(c.s); o.updateMatrix(); this.clouds.setMatrixAt(i, o.matrix); });
    this.clouds.instanceMatrix.needsUpdate = true;
  }
  // ---------- far mountain ranges (3D parallax happens naturally) ----------
  makeRange(z, layer) {
    const N = 160, W = 1400, geo = new THREE.PlaneGeometry(W, 1, N, 1); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, fog: true }));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3)); m.userData = { z, layer, N, W, cx: -1e9 }; m.position.z = z; this.scene.add(m); return m;
  }
  updateRange(m, camX, camY, colTop, colBot) {
    const u = m.userData; const snap = Math.round(camX / 40) * 40; const P = m.geometry.attributes.position, C = m.geometry.attributes.color;
    if (Math.abs(snap - u.cx) > 1 || u.dirty) {
      u.cx = snap; u.dirty = false;
      for (let i = 0; i <= u.N; i++) {
        const lx = -u.W / 2 + i * u.W / u.N, wx = snap + lx; const f = u.layer;
        const h = (vn2(wx / (90 * f), 0, 900 * f) * 1.0 + vn2(wx / (30 * f), 3, 300 * f) * 0.35) * (f === 1 ? 55 : 95) + (f === 1 ? 5 : 15);
        P.setXYZ(i, lx, h, 0); P.setXYZ(i + u.N + 1, lx, -40, 0);
        tmpC.copy(colTop).lerp(colBot, 0.15 * f); C.setXYZ(i, tmpC.r, tmpC.g, tmpC.b); tmpC2.copy(colBot); C.setXYZ(i + u.N + 1, tmpC2.r, tmpC2.g, tmpC2.b);
      }
      P.needsUpdate = true; C.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
    }
    m.position.set(snap, camY * (u.layer === 1 ? 0.35 : 0.2) - 10, u.z);
  }

  // ============================================================
  // terrain chunks
  // ============================================================
  setTerrain(T, seed) { this.clear(); this.T = T; this.seed = seed; T._nextFuel = undefined; T._nextCoin = undefined; T._nextDia = undefined; this.mountains.forEach(m => m.userData.dirty = true); this.pickLayoutTo = 0; }
  clear() { for (const [k, ch] of this.chunks) this.disposeChunk(ch); this.chunks.clear(); this.pickups = []; }
  disposeChunk(ch) {
    if (!this.shared) { this.shared = new Set([...Object.values(this.props), this.coins.geo, this.dia.geo]); this.fuelProto.traverse(o => o.geometry && this.shared.add(o.geometry)); }
    this.scene.remove(ch.group);
    ch.group.traverse(o => {
      if (o.geometry && !this.shared.has(o.geometry)) o.geometry.dispose();
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) if (m.map && m.map.isCanvasTexture && m.map !== this.cliffTex && m.map !== this.woodTex && !Object.values(this.coins.mats).some(a => a.includes(m))) { m.map.dispose(); m.dispose(); }
    });
  }
  worldColorAt(x, key, out) {
    const { w, a, b } = this.T.blendInfo(Math.max(0, x)); out.setHex(WORLDS[a][key]); if (w > 0) { tmpC2.setHex(WORLDS[b][key]); out.lerp(tmpC2, w); } return out;
  }
  backH(x, z, gv) {
    const t = Math.min(1, (-z - 3.6) / 30), T = this.T;
    const smooth = (T.height(x - 14) + T.height(x + 14) + T.height(x) * 2) / 4;
    return gv * (1 - t) + (smooth + (vn2(x / 26, z / 18, 5) - .5) * 9 * t + (-z - 3.6) * 0.12) * t - t * 1.5;
  }
  buildChunk(ci) {
    const T = this.T, x0 = ci * CH, group = new THREE.Group(); group.userData.ci = ci;
    const gv = new Float32Array(COLS); for (let i = 0; i < COLS; i++) gv[i] = T.groundVisual(x0 + i * RES);
    const pos = [], col = [], idx = []; const cTop = new THREE.Color(), cDirt = new THREE.Color(), cMid = new THREE.Color(), cFar = new THREE.Color(), c = new THREE.Color();
    // --- road strip + lip (one mesh) ---
    const rowsZ = [LIP, ROAD_F, 2.2, 0.8, -0.8, -2.2, ROAD_B];
    for (let i = 0; i < COLS; i++) {
      const x = x0 + i * RES; this.worldColorAt(x, 'top', cTop); const surf = T.surface(x);
      for (let r = 0; r < rowsZ.length; r++) {
        const z = rowsZ[r]; let y = gv[i] + (r === 0 ? -0.38 : 0) + (r > 1 ? (hashf(Math.round(x * 2), r) - .5) * 0.05 : 0);
        c.copy(cTop).multiplyScalar(0.9 + hashf(Math.round(x * 2), r * 7) * 0.18); if (r === 0) c.multiplyScalar(0.72);
        if (surf.type === 'ice') c.lerp(tmpC.setHex(0xcff2ff), 0.8);
        if ((z === 0.8 || z === -0.8) && surf.type !== 'ice') c.multiplyScalar(0.86); // tyre tracks
        pos.push(x, y, z); col.push(c.r, c.g, c.b);
      }
    }
    const NR = rowsZ.length;
    for (let i = 0; i < COLS - 1; i++) for (let r = 0; r < NR - 1; r++) { const a = i * NR + r, b = a + NR; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    group.add(this.mkMesh(pos, col, idx, this.matTop, true));
    // --- cliff face (vertical, textured) ---
    const fp = [], fc = [], fi = [], fu = []; const depth = 26;
    for (let i = 0; i < COLS; i++) { const x = x0 + i * RES; this.worldColorAt(x, 'dirt', cDirt); this.worldColorAt(x, 'side', c); const yt = gv[i] - 0.38;
      fp.push(x, yt, LIP, x, yt - depth, LIP); fc.push(cDirt.r, cDirt.g, cDirt.b, c.r * .8, c.g * .8, c.b * .8); fu.push(x / 7, yt / 7, x / 7, (yt - depth) / 7); }
    for (let i = 0; i < COLS - 1; i++) { const a = i * 2; fi.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const fm = this.mkMesh(fp, fc, fi, this.matCliff, false, fu); group.add(fm);
    // --- back fields ---
    const bp = [], bc = [], bi = []; const NB = BACK_Z.length, step = 2;
    for (let i = 0; i < COLS; i += step) {
      const x = x0 + i * RES; this.worldColorAt(x, 'mid', cMid); this.worldColorAt(x, 'far', cFar); this.worldColorAt(x, 'top', cTop);
      const wid = this.T.surface(x).world;
      for (let r = 0; r < NB; r++) {
        const z = BACK_Z[r], y = r === 0 ? gv[i] : this.backH(x, z, gv[i]); const t = r / (NB - 1);
        c.copy(cTop).lerp(cMid, Math.min(1, t * 2)).lerp(cFar, Math.max(0, t * 1.4 - .4));
        if (wid === 0 && r > 1) { const fld = hashf(Math.floor(x / 14), Math.floor(z / 7)); if (fld > .72) c.lerp(tmpC.setHex(0xe7cf6a), .55); else if (fld < .2) c.lerp(tmpC.setHex(0x3f8f2e), .5); }
        c.multiplyScalar(0.92 + hashf(Math.floor(x), r) * 0.12);
        bp.push(x, y, z); bc.push(c.r, c.g, c.b);
      }
    }
    const BC = Math.floor((COLS - 1) / step) + 1;
    for (let i = 0; i < BC - 1; i++) for (let r = 0; r < NB - 1; r++) { const a = i * NB + r, b = a + NB; bi.push(a, b, a + 1, b, b + 1, a + 1); }
    const bm = this.mkMesh(bp, bc, bi, this.matBack, true); bm.castShadow = false; group.add(bm);
    // --- scenery ---
    this.addScenery(group, ci, x0);
    // --- features (ramps, bridges, ice, pipes) ---
    this.addFeatures(group, x0, x0 + CH);
    // --- distance signs every 250 m (relative to run start x=8) ---
    for (let m = Math.ceil((x0 - 8) / 250) * 250; m + 8 < x0 + CH; m += 250) if (m > 0) group.add(this.sign(m + 8, m));
    // --- pickups ---
    this.addPickups(group, x0, x0 + CH);
    this.scene.add(group); return { group, ci };
  }
  mkMesh(pos, col, idx, material, recv, uv) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, material); m.receiveShadow = !!recv; m.userData.own = true; return m;
  }
  addScenery(group, ci, x0) {
    const R = rng(ci * 7717 + 13), byType = {};
    const add = (type, x, z, s, ry) => { (byType[type] = byType[type] || []).push([x, z, s, ry]); };
    for (let x = x0; x < x0 + CH; x += 2.2 + R() * 2.5) {
      const W = WORLDS[this.T.surface(x).world].id, list = SCENERY[W]; let tot = 0; for (const [, w] of list) tot += w;
      let r = R() * tot, type = list[0][0]; for (const [t, w] of list) { if ((r -= w) < 0) { type = t; break; } }
      const big = ['barn', 'factory', 'tank', 'crane', 'pillar', 'dome', 'chimney'].includes(type);
      const z = big ? -22 - R() * 30 : -6.5 - R() * 30; add(type, x + R() * 2, z, (0.75 + R() * 0.6) * (z < -30 ? 1.25 : 1), R() * 6.28);
      if (R() < .35) { const W2 = SCENERY[W]; const t2 = W2[Math.floor(R() * W2.length)][0]; if (!['barn', 'factory', 'tank', 'crane', 'dome'].includes(t2)) add(t2, x + R() * 3, -40 - R() * 28, 1 + R() * .6, R() * 6.28); }
      if ((W === 'hills' || W === 'forest') && R() < .5) add('tuft', x + R(), ROAD_F - 0.3 - R() * 0.4, .8 + R() * .6, R() * 6);
    }
    const o = new THREE.Object3D();
    for (const t in byType) {
      const arr = byType[t]; const glow = ['pylon', 'crystal', 'ring'].includes(t);
      const im = new THREE.InstancedMesh(this.props[t], glow ? this.matGlow : this.matProp, arr.length);
      arr.forEach(([x, z, s, ry], i) => { const y = z > -4 ? this.T.groundVisual(x) : this.backH(x, z, this.T.groundVisual(x)); o.position.set(x, y - 0.1, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
      im.castShadow = this.quality === 'high' && !['tuft'].includes(t); im.receiveShadow = false; group.add(im);
    }
  }
  addFeatures(group, x0, x1) {
    const T = this.T; const zi0 = T.zoneOf(x0), zi1 = T.zoneOf(x1);
    for (let zi = zi0; zi <= zi1; zi++) for (const F of T.features(zi)) {
      if (F.x1 < x0 || F.x0 >= x1) continue; if (F.x0 < x0) continue; // build each feature once (in chunk containing x0)
      const wid = WORLDS[T.worldAtZone(zi)].id;
      if (F.t === 'ramp') group.add(this.rampMesh(F, wid));
      else if (F.t === 'bridge') group.add(this.bridgeMesh(F));
      else if (F.t === 'ice') { const n = Math.ceil((F.x1 - F.x0) / 0.5); const pos = [], idx = []; for (let i = 0; i <= n; i++) { const x = F.x0 + i * (F.x1 - F.x0) / n, y = T.height(x) + 0.03; pos.push(x, y, ROAD_F - .2, x, y, ROAD_B + .3); if (i < n) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); const m = new THREE.Mesh(g, this.matIce); m.receiveShadow = true; m.userData.own = true; group.add(m); }
      else if (F.t === 'pipe') { const r = F.h, cx = (F.x0 + F.x1) / 2; const m = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.05, r * 1.05, 8.2, 18), mat(0xb4472f, { metalness: .6, roughness: .4 })); m.rotation.x = Math.PI / 2; m.position.set(cx, T.rawNoBridge(F.x0) + 0.02, -0.2); m.castShadow = true; m.userData.own = true; group.add(m); }
    }
  }
  rampMesh(F, wid) {
    const T = this.T, g = new THREE.Group(); const metal = wid === 'indus' || wid === 'future';
    const n = Math.max(6, Math.round((F.x1 - F.x0) / 0.45)); const o = new THREE.Object3D();
    const plank = new THREE.BoxGeometry(0.42, 0.1, 3.2); const im = new THREE.InstancedMesh(plank, metal ? this.matMetalRamp : this.matWood, n);
    for (let i = 0; i < n; i++) { const x = F.x0 + (i + .5) * (F.x1 - F.x0) / n, y = T.height(x); o.position.set(x, y + 0.03, 0); o.rotation.set(0, 0, Math.atan(T.slope(x))); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
    im.castShadow = true; im.receiveShadow = true; g.add(im);
    // side frame + support posts
    const top = T.height(F.x1 - 0.1), base = T.rawNoBridge(F.x1 + 2);
    for (const z of [1.7, -1.7]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, Math.max(0.3, top - base + 0.4), 0.22), metal ? this.matMetalRamp : this.matWood); post.position.set(F.x1 - 0.15, (top + base) / 2 - 0.2, z); post.castShadow = true; g.add(post); }
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 3), mat(0xffd21a, { emissive: 0x664d00 })); arrow.rotation.z = -Math.PI / 2; arrow.position.set(F.x0 - 3, T.height(F.x0 - 3) + 1.4, -2.4); g.add(arrow);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.4, 6), mat(0x333333)); pole.position.set(F.x0 - 3.3, T.height(F.x0 - 3) + .7, -2.4); g.add(pole);
    return g;
  }
  bridgeMesh(F) {
    const T = this.T, g = new THREE.Group(), o = new THREE.Object3D(); const n = Math.round((F.x1 - F.x0) / 0.55);
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.48, 0.16, 4.2), this.matWood, n);
    for (let i = 0; i < n; i++) { const x = F.x0 + (i + .5) * (F.x1 - F.x0) / n; o.position.set(x, T.height(x) - 0.08, 0); o.rotation.set(0, (hashf(i, 3) - .5) * 0.04, Math.atan(T.slope(x))); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
    im.castShadow = true; im.receiveShadow = true; g.add(im);
    const rope = mat(0x6b4a2b); const posts = Math.round((F.x1 - F.x0) / 3);
    for (const z of [2.2, -2.2]) { for (let i = 0; i <= posts; i++) { const x = F.x0 + i * (F.x1 - F.x0) / posts; const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 1.3, 6), this.matWood); p.position.set(x, T.height(x) + .55, z); p.castShadow = true; g.add(p); }
      const pts = []; for (let i = 0; i <= 24; i++) { const x = F.x0 + i * (F.x1 - F.x0) / 24; pts.push(new THREE.Vector3(x, T.height(x) + 1.1 - Math.sin(i / 24 * Math.PI) * 0.15, z)); }
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.04, 5), rope)); }
    const wy = T.height((F.x0 + F.x1) / 2) - F.dip * 0.75; const water = new THREE.Mesh(new THREE.PlaneGeometry(F.x1 - F.x0 + 4, 12), this.matWater); water.rotation.x = -Math.PI / 2; water.position.set((F.x0 + F.x1) / 2, wy, -1); g.add(water);
    return g;
  }
  addPickups(group, x0, x1) {
    const list = layoutPickups(this.T, x0, x1, this.seed); const o = new THREE.Object3D();
    const coinsBy = {}; const dias = [];
    for (const p of list) {
      if (p.k === 'coin') { const v = COIN_VALUES.includes(p.v) ? p.v : (p.v >= 500 ? 500 : p.v >= 100 ? 100 : p.v >= 25 ? 25 : 5); (coinsBy[v] = coinsBy[v] || []).push(p); p.vis = v; }
      else if (p.k === 'dia') dias.push(p);
      else if (p.k === 'fuel') { const f = this.fuelProto.clone(); f.position.set(p.x, p.y, 0); group.add(f); p.obj = f; }
      p.got = false; this.pickups.push(p);
    }
    for (const v in coinsBy) { const arr = coinsBy[v]; const im = new THREE.InstancedMesh(this.coins.geo, this.coins.mats[v], arr.length); im.castShadow = true; arr.forEach((p, i) => { p.im = im; p.ii = i; const s = v >= 100 ? 1.12 : 1; o.position.set(p.x, p.y, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(s * (p.v > p.vis ? 1.35 : 1)); o.updateMatrix(); im.setMatrixAt(i, o.matrix); p.sc = o.scale.x; }); group.add(im); }
    if (dias.length) { const im = new THREE.InstancedMesh(this.dia.geo, this.dia.mat, dias.length); dias.forEach((p, i) => { p.im = im; p.ii = i; p.sc = 1; o.position.set(p.x, p.y, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); group.add(im); }
  }
  sign(x, m) {
    const g = new THREE.Group(), y = this.T.groundVisual(x);
    const c = document.createElement('canvas'); c.width = 256; c.height = 128; const k = c.getContext('2d');
    k.fillStyle = '#f6e7c8'; k.fillRect(0, 0, 256, 128); k.strokeStyle = '#6b4a2b'; k.lineWidth = 10; k.strokeRect(5, 5, 246, 118);
    k.fillStyle = '#3b2a18'; k.font = '900 64px Arial Black, Arial'; k.textAlign = 'center'; k.textBaseline = 'middle'; k.fillText(m + 'm', 128, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const board = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 0.1), [this.matWood, this.matWood, this.matWood, this.matWood, new THREE.MeshLambertMaterial({ map: t }), this.matWood]);
    board.position.set(x, y + 2.3, -3.2); board.castShadow = true; g.add(board);
    for (const dx of [-0.8, 0.8]) { const post = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2.3, 6), this.matWood); post.position.set(x + dx, y + 1.1, -3.25); g.add(post); }
    return g;
  }
  bestFlag(x) {
    if (!this.flag) {
      const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 4, 8), mat(0xeeeeee, { metalness: .6 })); pole.position.y = 2; g.add(pole);
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .9, 8, 1), new THREE.MeshLambertMaterial({ color: 0xff3b30, side: THREE.DoubleSide, emissive: 0x551010 })); cloth.position.set(.7, 3.5, 0); g.add(cloth); g.userData.cloth = cloth;
      const c = document.createElement('canvas'); c.width = 128; c.height = 48; const k = c.getContext('2d'); k.fillStyle = '#ffd21a'; k.fillRect(0, 0, 128, 48); k.fillStyle = '#0d1b2a'; k.font = '900 30px Arial'; k.textAlign = 'center'; k.fillText('BEST', 64, 35);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .42), new THREE.MeshBasicMaterial({ map: t })); lab.position.set(0, 4.35, 0.05); g.add(lab);
      this.flag = g; this.scene.add(g);
    }
    this.flag.visible = x != null; if (x != null) this.flag.position.set(x, this.T.height(x), -2.6);
  }
  hidePickup(p) { if (p.obj) p.obj.visible = false; if (p.im) { const m = new THREE.Matrix4().makeScale(0, 0, 0); p.im.setMatrixAt(p.ii, m); p.im.instanceMatrix.needsUpdate = true; } }
  animatePickups(t, x0, x1) {
    const o = new THREE.Object3D(); const touched = new Set();
    for (const p of this.pickups) {
      if (p.got || p.x < x0 || p.x > x1) continue;
      if (p.k === 'fuel') { p.obj.position.y = p.y + Math.sin(t * 3 + p.x) * 0.12; p.obj.rotation.y = Math.sin(t * 1.5 + p.x) * 0.5; continue; }
      o.position.set(p.x, p.y + Math.sin(t * 3 + p.x * .7) * 0.1, 0);
      o.rotation.set(0, p.k === 'dia' ? t * 2 + p.x : Math.sin(t * 2.2 + p.x * .5) * 0.6, 0); o.scale.setScalar(p.sc); o.updateMatrix(); p.im.setMatrixAt(p.ii, o.matrix); touched.add(p.im);
    }
    touched.forEach(im => im.instanceMatrix.needsUpdate = true);
  }
  ensureChunks(camX) {
    const a = Math.floor((camX - 60) / CH), b = Math.floor((camX + 150) / CH);
    for (let ci = Math.max(-1, a); ci <= b; ci++) if (!this.chunks.has(ci)) this.chunks.set(ci, this.buildChunk(ci));
    for (const [ci, ch] of this.chunks) if (ci < a - 1 || ci > b + 1) { this.disposeChunk(ch); this.chunks.delete(ci); this.pickups = this.pickups.filter(p => p.x >= (a - 1) * CH); }
  }
  // ---------- per-frame environment (biome-blended colours) ----------
  updateEnv(camX, camY, dt) {
    const fogC = this.worldColorAt(camX, 'fog', new THREE.Color()); this.scene.fog.color.copy(fogC);
    this.worldColorAt(camX, 'sky', this.skyU.top.value);
    const { w, a, b } = this.T.blendInfo(Math.max(0, camX));
    this.skyU.top.value.setHex(WORLDS[a].sky[0]).lerp(tmpC.setHex(WORLDS[b].sky[0]), w);
    this.skyU.bot.value.setHex(WORLDS[a].sky[1]).lerp(tmpC.setHex(WORLDS[b].sky[1]), w);
    this.worldColorAt(camX, 'sun', this.sun.color);
    const fut = (a === 6 ? 1 - w : 0) + (b === 6 ? w : 0);
    this.hemi.intensity = 1.25 - fut * 0.35; this.sun.intensity = 2.4 - fut * 1.0; this.hemi.color.copy(this.skyU.bot.value).lerp(tmpC.setHex(0xffffff), .3);
    this.cloudMat.opacity = 0.95 - fut * 0.6;
    const farTop = this.worldColorAt(camX, 'far', new THREE.Color()).lerp(fogC, .2), farBot = this.worldColorAt(camX, 'mid', new THREE.Color()).lerp(fogC, .35);
    this.updateRange(this.mountains[0], camX, camY, farTop, farBot);
    this.updateRange(this.mountains[1], camX, camY, farTop.clone().lerp(fogC, .4), farBot.clone().lerp(fogC, .4));
    this.sky.position.set(camX, camY, 0); this.updateClouds(dt, camX, camY);
  }
  render() { this.renderer.render(this.scene, this.camera); }
}
