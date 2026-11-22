/* ============================================================
   JG Audio — منظومة صوتية أصلية مولّدة بالكامل عبر Web Audio API
   (لا ملفات مرخّصة من أطراف أخرى: كل صوت وكل لحن مُركّب بالكود)
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {};
  var A = JG.Audio = { ctx: null, music: true, sfx: true, voice: true, mvol: .32, svol: .7, _mus: null, _track: '', _step: 0 };

  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    try { A.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    var c = A.ctx; A.master = c.createGain(); A.master.gain.value = 1; A.master.connect(c.destination);
    A.sGain = c.createGain(); A.sGain.gain.value = A.svol; A.sGain.connect(A.master);
    A.mGain = c.createGain(); A.mGain.gain.value = A.music ? A.mvol : 0; A.mGain.connect(A.master);
    // صدى بسيط للأجواء
    A.dl = c.createDelay(); A.dl.delayTime.value = .27; A.fb = c.createGain(); A.fb.gain.value = .28; A.wet = c.createGain(); A.wet.gain.value = .22;
    A.dl.connect(A.fb); A.fb.connect(A.dl); A.dl.connect(A.wet); A.wet.connect(A.master);
    A.noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); var d = A.noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    setInterval(A._tick, 25);
  };
  A.setMusic = function (on) { A.music = on; if (A.mGain) A.mGain.gain.setTargetAtTime(on ? A.mvol : 0, A.ctx.currentTime, .2); };
  A.setSfx = function (on) { A.sfx = on; };

  function env(g, t, a, d, peak) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function osc(type, f, t, dur, peak, dest, f2, wet) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    env(g, t, .005, dur, peak); o.connect(g); g.connect(dest || A.sGain); if (wet) g.connect(A.dl); o.start(t); o.stop(t + dur + .05); return o;
  }
  function noise(t, dur, peak, fType, f, f2, dest) {
    var c = A.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = A.noiseBuf; s.loop = true;
    fl.type = fType || 'bandpass'; fl.frequency.setValueAtTime(f || 1200, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur); fl.Q.value = 1.2;
    env(g, t, .01, dur, peak); s.connect(fl); fl.connect(g); g.connect(dest || A.sGain); s.start(t); s.stop(t + dur + .05);
  }
  /* مكتبة المؤثرات */
  A.play = function (name, v) {
    if (!A.ctx || !A.sfx) return; var t = A.ctx.currentTime; v = v === undefined ? 1 : v;
    switch (name) {
      case 'step': noise(t, .05, .05 * v, 'lowpass', 500, 200); break;
      case 'jump': osc('square', 220, t, .18, .06 * v, 0, 520); break;
      case 'land': noise(t, .09, .09 * v, 'lowpass', 300, 90); break;
      case 'pick': osc('sine', 880, t, .09, .14 * v, 0, 0, 1); osc('sine', 1320, t + .07, .14, .12 * v, 0, 0, 1); break;
      case 'coin': osc('square', 988, t, .06, .05 * v); osc('square', 1318, t + .06, .16, .05 * v); break;
      case 'shoot': osc('sawtooth', 900, t, .12, .05 * v, 0, 260); noise(t, .08, .04 * v, 'highpass', 2500); break;
      case 'shootB': osc('triangle', 600, t, .16, .08 * v, 0, 1400); break;
      case 'hit': osc('square', 180, t, .12, .1 * v, 0, 60); noise(t, .1, .08 * v, 'bandpass', 900, 300); break;
      case 'hurt': osc('sawtooth', 300, t, .25, .1 * v, 0, 90); break;
      case 'kill': noise(t, .35, .12 * v, 'bandpass', 2400, 200); osc('sine', 660, t, .3, .1 * v, 0, 1760, 1); break;
      case 'ok': [523, 659, 784, 1047].forEach(function (f, i) { osc('triangle', f, t + i * .07, .22, .11 * v, 0, 0, 1); }); break;
      case 'bad': osc('square', 220, t, .16, .07 * v); osc('square', 165, t + .14, .3, .07 * v); break;
      case 'door': noise(t, .9, .1 * v, 'lowpass', 900, 160); osc('sine', 90, t, .8, .12 * v, 0, 60); break;
      case 'locked': osc('square', 140, t, .1, .08 * v); osc('square', 140, t + .14, .1, .08 * v); break;
      case 'bubble': for (var i = 0; i < 4; i++) osc('sine', 400 + Math.random() * 700, t + i * .05, .07, .05 * v, 0, 1300); break;
      case 'pour': noise(t, .7, .07 * v, 'bandpass', 800, 1800); break;
      case 'machine': osc('sawtooth', 70, t, .6, .05 * v, 0, 110); noise(t, .6, .04 * v, 'bandpass', 400); break;
      case 'zap': noise(t, .25, .14 * v, 'highpass', 3000, 6000); osc('square', 1200, t, .2, .05 * v, 0, 300); break;
      case 'lever': osc('square', 330, t, .05, .08 * v); osc('square', 495, t + .05, .08, .08 * v); break;
      case 'boss': osc('sawtooth', 55, t, 1.6, .16 * v, 0, 41); noise(t, 1.4, .09 * v, 'lowpass', 400, 80); osc('square', 110, t + .2, 1.2, .06 * v, 0, 82); break;
      case 'bossHit': osc('square', 120, t, .2, .13 * v, 0, 50); noise(t, .2, .1 * v, 'bandpass', 600); break;
      case 'roar': noise(t, .8, .14 * v, 'bandpass', 300, 120); osc('sawtooth', 80, t, .8, .1 * v, 0, 45); break;
      case 'warn': osc('square', 880, t, .08, .05 * v); osc('square', 880, t + .16, .08, .05 * v); break;
      case 'level': [392, 523, 659, 784, 1047, 1319].forEach(function (f, i) { osc('square', f, t + i * .08, .25, .06 * v, 0, 0, 1); }); break;
      case 'win': [523, 659, 784, 1047, 784, 1047, 1319, 1568].forEach(function (f, i) { osc('triangle', f, t + i * .11, .4, .1 * v, 0, 0, 1); }); break;
      case 'lose': [392, 349, 311, 262].forEach(function (f, i) { osc('triangle', f, t + i * .2, .45, .1 * v); }); break;
      case 'ui': osc('sine', 1200, t, .05, .06 * v); break;
      case 'atom': osc('sine', 1568, t, .08, .06 * v, 0, 0, 1); osc('sine', 2093, t + .06, .12, .05 * v, 0, 0, 1); break;
      case 'dash': noise(t, .3, .1 * v, 'bandpass', 600, 3000); break;
      case 'shield': osc('sine', 300, t, .5, .08 * v, 0, 900, 1); break;
    }
  };
  /* ---------- موسيقى إجرائية: مسار المختبر ومسار الزعيم ---------- */
  var TR = {
    lab: { bpm: 96, root: 57, scale: [0, 3, 5, 7, 10, 12, 15], bass: [0, 0, 5, 3], lead: 'sine', pad: true },
    boss: { bpm: 140, root: 45, scale: [0, 1, 3, 5, 7, 8, 10, 12], bass: [0, 0, 1, 0, 8, 7, 5, 3], lead: 'square', pad: false },
    final: { bpm: 150, root: 43, scale: [0, 2, 3, 6, 7, 8, 11, 12], bass: [0, 3, 6, 7, 0, 8, 7, 3], lead: 'sawtooth', pad: false },
    title: { bpm: 84, root: 60, scale: [0, 2, 4, 7, 9, 12, 14], bass: [0, 5, 3, 4], lead: 'triangle', pad: true }
  };
  var mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
  A.track = function (name) { A._track = name; A._step = 0; A._next = A.ctx ? A.ctx.currentTime + .1 : 0; };
  A._tick = function () {
    var c = A.ctx; if (!c || !A._track || !A.music) return; var T = TR[A._track]; if (!T) return; var sp = 60 / T.bpm / 2;
    while (A._next < c.currentTime + .12) {
      var s = A._step, t = A._next, bar = Math.floor(s / 8) % T.bass.length, dest = A.mGain;
      if (s % 2 === 0) osc('triangle', mtof(T.root - 12 + T.bass[bar]), t, sp * 1.8, .16, dest);
      if (A._track !== 'title' && A._track !== 'lab' && s % 4 === 0) { noise(t, .12, .12, 'lowpass', 160, 60, dest); }
      if (A._track !== 'title' && s % 4 === 2) noise(t, .06, .05, 'highpass', 5000, 0, dest);
      // لحن يعتمد بذرة الخطوة (متكرر ومتغيّر)
      var r = Math.sin(s * 12.9898 + bar * 78.233) * 43758.5453; r = r - Math.floor(r);
      if (r > (T.pad ? .55 : .35)) { var deg = T.scale[Math.floor(r * 97) % T.scale.length]; osc(T.lead, mtof(T.root + 12 + T.bass[bar] % 12 + deg), t, sp * (T.pad ? 3 : 1.2), T.pad ? .045 : .03, dest, 0, 1); }
      if (T.pad && s % 16 === 0) { [0, 7, 12].forEach(function (k) { osc('sine', mtof(T.root + T.bass[bar] + k), t, sp * 15, .035, dest); }); }
      A._step++; A._next += sp;
    }
  };
  /* ---------- صوت «ذرّة» العربي (Speech Synthesis إن توفر) ---------- */
  A.say = function (txt) {
    if (!A.voice || !window.speechSynthesis) return;
    try {
      var vs = speechSynthesis.getVoices().filter(function (v) { return /^ar/i.test(v.lang); });
      if (!vs.length) return; speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(txt).replace(/[A-Za-z₀-₉⁺⁻→⇌]+/g, ' ').slice(0, 220)); u.lang = vs[0].lang; u.voice = vs[0]; u.rate = 1.05; u.pitch = 1.25; speechSynthesis.speak(u);
    } catch (e) {}
  };
  A.hasArabicVoice = function () { try { return !!(window.speechSynthesis && speechSynthesis.getVoices().some(function (v) { return /^ar/i.test(v.lang); })); } catch (e) { return false; } };
})();
