// ============================================================
// OFFROAD LEGENDS — audio.js
// 100% synthesized with Web Audio (original sounds, no files):
// RPM-driven engines per vehicle, boost, skids, landings, crashes,
// coin/diamond/fuel pickups, UI clicks and an arcade music loop.
// ============================================================
const ENG = { ranger: [52, 'sawtooth', 900], truck: [38, 'sawtooth', 650], kart: [78, 'square', 1500], buggy: [58, 'sawtooth', 1100], strider: [34, 'square', 520], nova: [92, 'triangle', 2600] };

export class Audio {
  constructor() { this.ctx = null; this.sfxVol = 0.8; this.musVol = 0.45; this.on = false; }
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = this.ctx = new AC();
    this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(c.destination);
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.connect(this.master); this.bus = comp;
    this.sfx = c.createGain(); this.sfx.gain.value = this.sfxVol; this.sfx.connect(this.bus);
    this.mus = c.createGain(); this.mus.gain.value = this.musVol; this.mus.connect(this.bus);
    // noise buffer
    const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = nb;
    this.on = true;
  }
  setVolumes(s, m) { this.sfxVol = s; this.musVol = m; if (this.ctx) { this.sfx.gain.setTargetAtTime(s, this.ctx.currentTime, .05); this.mus.gain.setTargetAtTime(m, this.ctx.currentTime, .05); } }
  // ---------------- engine ----------------
  startEngine(id) {
    if (!this.ctx) return; this.stopEngine(); const c = this.ctx, [base, type, cut] = ENG[id] || ENG.ranger;
    const o1 = c.createOscillator(), o2 = c.createOscillator(), o3 = c.createOscillator(); o1.type = type; o2.type = 'square'; o3.type = 'sine';
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cut; f.Q.value = 4;
    const g = c.createGain(); g.gain.value = 0; const g2 = c.createGain(); g2.gain.value = 0.35; const g3 = c.createGain(); g3.gain.value = 0.5;
    o1.connect(f); o2.connect(g2).connect(f); o3.connect(g3).connect(f); f.connect(g).connect(this.sfx);
    // rumble LFO (piston feel)
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 18; lg.gain.value = 0.12; lfo.connect(lg).connect(g.gain);
    // boost whoosh
    const ns = c.createBufferSource(); ns.buffer = this.noise; ns.loop = true; const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1800; nf.Q.value = 0.8; const ng = c.createGain(); ng.gain.value = 0; ns.connect(nf).connect(ng).connect(this.sfx);
    // skid
    const ss = c.createBufferSource(); ss.buffer = this.noise; ss.loop = true; const sf = c.createBiquadFilter(); sf.type = 'bandpass'; sf.frequency.value = 900; sf.Q.value = 3; const sg = c.createGain(); sg.gain.value = 0; ss.connect(sf).connect(sg).connect(this.sfx);
    [o1, o2, o3, lfo, ns, ss].forEach(o => o.start());
    this.eng = { o1, o2, o3, f, g, base, cut, lfo, ng, nf, sg, sf, all: [o1, o2, o3, lfo, ns, ss], id };
  }
  stopEngine() { if (!this.eng) return; const t = this.ctx.currentTime; this.eng.g.gain.setTargetAtTime(0, t, .05); const all = this.eng.all; setTimeout(() => all.forEach(o => { try { o.stop(); } catch (e) { } }), 300); this.eng = null; }
  engine(rpm, gas, boost, skid, running) {
    const e = this.eng; if (!e) return; const t = this.ctx.currentTime;
    const f = e.base * (0.7 + rpm * 2.6) * (boost ? 1.12 : 1);
    e.o1.frequency.setTargetAtTime(f, t, .04); e.o2.frequency.setTargetAtTime(f * 1.006 * 0.5, t, .04); e.o3.frequency.setTargetAtTime(f * 2, t, .04);
    e.lfo.frequency.setTargetAtTime(8 + rpm * 30, t, .05);
    e.f.frequency.setTargetAtTime(e.cut * (0.5 + rpm * 1.2 + gas * .4), t, .05);
    e.g.gain.setTargetAtTime(running ? 0.16 + gas * 0.14 + rpm * 0.06 : 0, t, .08);
    e.ng.gain.setTargetAtTime(boost ? 0.25 : 0, t, .06); e.nf.frequency.setTargetAtTime(boost ? 1400 + rpm * 1800 : 1800, t, .1);
    e.sg.gain.setTargetAtTime(skid * 0.22, t, .05);
  }
  // ---------------- one-shot sfx ----------------
  tone(freq, dur, type = 'sine', vol = 0.3, slide = 0, delay = 0) {
    if (!this.ctx) return; const c = this.ctx, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.sfx); o.start(t); o.stop(t + dur + 0.05);
  }
  noiseHit(dur, freq, vol = 0.4, type = 'lowpass', delay = 0) {
    if (!this.ctx) return; const c = this.ctx, t = c.currentTime + delay, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noise; f.type = type; f.frequency.value = freq; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(this.sfx); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  coin(v = 5) { const b = v >= 500 ? 1320 : v >= 100 ? 1180 : 988; this.tone(b, 0.08, 'square', 0.12); this.tone(b * 1.5, 0.18, 'square', 0.12, 0, 0.06); }
  diamond() { [0, 4, 7, 12, 16].forEach((s, i) => this.tone(880 * Math.pow(2, s / 12), 0.22, 'triangle', 0.18, 0, i * 0.05)); }
  fuel() { this.tone(300, 0.35, 'sawtooth', 0.12, 2.6); this.tone(600, 0.25, 'sine', 0.15, 1.8, 0.12); this.noiseHit(0.15, 3000, 0.1, 'highpass'); }
  land(v) { const k = Math.min(1, v / 14); this.tone(120, 0.25, 'sine', 0.3 * k + 0.08, 0.4); this.noiseHit(0.18, 500, 0.25 * k + 0.05); }
  thud(v) { this.noiseHit(0.12, 300, Math.min(.4, v / 30)); }
  crash() { this.noiseHit(0.7, 800, 0.6); this.tone(90, 0.6, 'sawtooth', 0.3, 0.3); this.noiseHit(0.4, 4000, 0.2, 'highpass', 0.05); }
  boostStart() { this.tone(200, 0.4, 'sawtooth', 0.15, 3); }
  click() { this.tone(660, 0.05, 'square', 0.1); }
  buy() { [0, 7, 12].forEach((s, i) => this.tone(523 * Math.pow(2, s / 12), 0.15, 'square', 0.12, 0, i * 0.07)); }
  achieve() { [0, 4, 7, 12, 7, 12].forEach((s, i) => this.tone(659 * Math.pow(2, s / 12), 0.18, 'triangle', 0.16, 0, i * 0.08)); }
  bonus() { this.tone(784, 0.1, 'square', 0.1); this.tone(1046, 0.18, 'square', 0.1, 0, 0.08); }
  recover() { this.tone(220, 0.3, 'triangle', 0.2, 2); }
  fuelLow() { this.tone(440, 0.12, 'square', 0.1); this.tone(440, 0.12, 'square', 0.1, 0, 0.2); }

  // ---------------- music: arcade loop with lookahead scheduler ----------------
  startMusic(style = 0) {
    if (!this.ctx || this.musTimer) return; const c = this.ctx; this.step16 = 0; this.nextT = c.currentTime + 0.1; this.style = style;
    const bpm = 124, s16 = 60 / bpm / 4;
    const prog = [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-7, -3, 0]]; const root = 220 * Math.pow(2, -5 / 12);
    const bassPat = [0, null, 0, null, 7, null, 0, 12, 0, null, 0, null, 5, null, 7, null];
    const leadPat = [0, 2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2, 2, 1, 0, 1];
    const sched = () => {
      while (this.nextT < c.currentTime + 0.25) {
        const st = this.step16 % 16, bar = Math.floor(this.step16 / 16) % 4, ch = prog[bar], t = this.nextT;
        const note = (semi, oct) => root * Math.pow(2, semi / 12 + oct);
        // drums
        if (st % 4 === 0) this.kick(t); if (st % 8 === 4) this.snare(t); if (st % 2 === 1) this.hat(t);
        // bass
        const b = bassPat[st]; if (b !== null) this.mtone(note(ch[0] + b, -1), s16 * 1.6, 'square', 0.07, t);
        // lead arp (2nd half of the loop only, variation)
        if (Math.floor(this.step16 / 64) % 2 === 1 || st % 2 === 0) this.mtone(note(ch[leadPat[st]], 1), s16 * 0.9, 'triangle', 0.045, t);
        // pad on bar start
        if (st === 0) ch.forEach(s => this.mtone(note(s, 0), s16 * 15, 'sine', 0.03, t));
        this.step16++; this.nextT += s16;
      }
    };
    this.musTimer = setInterval(sched, 60); sched();
  }
  stopMusic() { clearInterval(this.musTimer); this.musTimer = null; }
  mtone(f, dur, type, vol, t) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(this.mus); o.start(t); o.stop(t + dur + 0.02); }
  kick(t) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15); g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); o.connect(g).connect(this.mus); o.start(t); o.stop(t + 0.22); }
  snare(t) { const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.noise; f.type = 'highpass'; f.frequency.value = 1500; g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14); s.connect(f).connect(g).connect(this.mus); s.start(t, Math.random()); s.stop(t + 0.15); }
  hat(t) { const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = this.noise; f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04); s.connect(f).connect(g).connect(this.mus); s.start(t, Math.random()); s.stop(t + 0.05); }
}
