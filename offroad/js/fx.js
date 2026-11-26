// ============================================================
// OFFROAD LEGENDS — fx.js : GPU particles (dust, snow spray, sparks,
// exhaust smoke, coin sparkles) + boost flames + floating score text
// ============================================================
import * as THREE from '../lib/three.module.min.js';

const MAX = 900;
export class FX {
  constructor(scene) {
    this.scene = scene; this.n = 0;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(MAX * 3); this.col = new Float32Array(MAX * 3); this.size = new Float32Array(MAX); this.alpha = new Float32Array(MAX);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1)); g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { scale: { value: 600 } }, transparent: true, depthWrite: false, vertexColors: true,
      vertexShader: 'attribute float size; attribute float alpha; varying vec3 vC; varying float vA; uniform float scale; void main(){ vC = color; vA = alpha; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = size*scale/(-mv.z); gl_Position = projectionMatrix*mv; }',
      fragmentShader: 'varying vec3 vC; varying float vA; void main(){ vec2 d = gl_PointCoord-0.5; float r = dot(d,d); if(r>0.25) discard; float a = vA*smoothstep(0.25,0.05,r); gl_FragColor = vec4(vC,a); }'
    });
    this.points = new THREE.Points(g, this.mat); this.points.frustumCulled = false; scene.add(this.points);
    this.parts = [];
    // boost flame (additive cones)
    const fm = new THREE.MeshBasicMaterial({ color: 0xffa21a, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const fm2 = new THREE.MeshBasicMaterial({ color: 0x8ad8ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const cone = new THREE.ConeGeometry(0.22, 1.2, 12, 1, true); cone.rotateZ(Math.PI / 2); cone.translate(-0.6, 0, 0);
    this.flame = new THREE.Group(); this.flameO = new THREE.Mesh(cone, fm); this.flameI = new THREE.Mesh(cone, fm2); this.flameI.scale.set(0.6, 0.55, 0.55);
    this.flame.add(this.flameO, this.flameI); this.flame.visible = false; scene.add(this.flame);
  }
  resize(h) { this.mat.uniforms.scale.value = h * 0.9; }
  emit(x, y, z, vx, vy, vz, life, size, color, grav = -4, grow = 1.2) {
    if (this.parts.length >= MAX) this.parts.shift();
    const c = new THREE.Color(color); this.parts.push({ x, y, z, vx, vy, vz, life, max: life, size, r: c.r, g: c.g, b: c.b, grav, grow });
  }
  dust(x, y, z, dir, color, amt = 1) { for (let i = 0; i < amt; i++) this.emit(x + (Math.random() - .5) * .4, y + .1, z + (Math.random() - .5) * 1.2, -dir * (1 + Math.random() * 3), 1 + Math.random() * 2.2, (Math.random() - .5) * 1.6, 0.6 + Math.random() * 0.6, 0.5 + Math.random() * 0.5, color, -2.5, 1.8); }
  burst(x, y, color, n = 14, sp = 5) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = sp * (0.4 + Math.random()); this.emit(x, y, 0.3, Math.cos(a) * v, Math.sin(a) * v, (Math.random() - .5) * 2, 0.45 + Math.random() * .3, 0.25 + Math.random() * .2, color, -6, -0.6); } }
  update(dt) {
    const P = this.parts; let w = 0;
    for (let i = 0; i < P.length; i++) { const p = P[i]; p.life -= dt; if (p.life <= 0) continue; p.vy += p.grav * dt; p.vx *= 1 - 1.2 * dt; p.vz *= 1 - 1.2 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.size = Math.max(0.02, p.size + p.grow * dt * .5); P[w++] = p; }
    P.length = w;
    for (let i = 0; i < MAX; i++) {
      if (i < w) { const p = P[i]; this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z; this.col[i * 3] = p.r; this.col[i * 3 + 1] = p.g; this.col[i * 3 + 2] = p.b; this.size[i] = p.size; this.alpha[i] = Math.min(1, p.life / p.max * 1.4) * 0.85; }
      else { this.alpha[i] = 0; this.size[i] = 0; }
    }
    const g = this.points.geometry; g.attributes.position.needsUpdate = g.attributes.color.needsUpdate = g.attributes.size.needsUpdate = g.attributes.alpha.needsUpdate = true;
  }
  setFlame(on, x, y, a, t) {
    this.flame.visible = on; if (!on) return;
    this.flame.position.set(x, y, 0.0); this.flame.rotation.z = a; const f = 0.85 + Math.sin(t * 60) * 0.12 + Math.random() * 0.15; this.flame.scale.set(f * 1.3, f, f);
  }
}
