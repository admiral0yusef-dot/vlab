/* ============================================================
   JG Grades — اختيار الصف قبل اللعب، وأسئلة كل صف من اختبارات موقع VLab
   - الصفوف 1–8: «العلوم» · 9–12: كل المباحث أو مبحث واحد
   - الثاني عشر + الكيمياء = وضع التوجيهي الأصلي بكل ألغاز الكيمياء
   - غير ذلك: كل محطات المعرفة والألغاز تصبح أسئلة من بنك الصف المختار
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG, G = JG.G, U = JG.UI, Z = JG.Puz, DB = JG.DB;
  var GN = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  var SUBN = { all: 'كل المباحث', chem: 'الكيمياء', phys: 'الفيزياء', bio: 'الأحياء', earth: 'علوم الأرض' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var GR = JG.GRADE = { g: +ls('jg_grade') || 0, s: ls('jg_subj') || 'all', active: false, units: [] };
  GR.name = function (g) { return 'الصف ' + GN[g || GR.g]; };
  GR.isTawjihiChem = function () { return GR.g === 12 && GR.s === 'chem'; };
  GR.label = function () { return GR.g ? GR.name() + (GR.g >= 9 ? ' · ' + SUBN[GR.s] : '') : ''; };

  /* تحميل ملف أسئلة الصف عند الحاجة */
  GR.load = function (g, cb) {
    if (window.JG_GB && JG_GB[g]) return cb(true);
    var s = document.createElement('script'); s.src = 'data/g/' + g + '.js';
    s.onload = function () { cb(!!(window.JG_GB && JG_GB[g])); }; s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  };
  GR.subjects = function (g) { var o = {}; ((window.JG_GB || {})[g] || []).forEach(function (u) { o[u.s] = 1; }); return Object.keys(o).filter(function (s) { return s !== 'sci'; }); };

  /* تحويل بنك الصف إلى مخطط قاعدة اللعبة، وتوزيع الوحدات على مختبرات اللعبة الستة */
  var builtinItems = null;
  GR.apply = function () {
    if (!builtinItems) builtinItems = DB.items.slice();
    if (GR.isTawjihiChem() || !GR.g) { GR.active = false; DB.items = builtinItems.slice(); return; }
    var units = ((window.JG_GB || {})[GR.g] || []).filter(function (u) { return GR.g < 9 || GR.s === 'all' || u.s === GR.s; });
    if (!units.length) units = (window.JG_GB || {})[GR.g] || [];
    var items = []; GR.units = units; JG.LESSONS = JG.LESSONS || {};
    units.forEach(function (u, ui) {
      var lid = 'g' + GR.g + '-' + u.s + '-' + u.u, zone = (ui % 6) + 1; JG.LESSONS[lid] = u.label + (GR.g >= 9 ? ' (' + u.sn + ')' : '');
      u.qs.forEach(function (q, qi) {
        var len = q[0].length + q[1].join('').length;
        items.push({ id: lid + '-' + qi, stage: GR.g <= 6 ? 'المرحلة الأساسية الدنيا' : (GR.g <= 10 ? 'المرحلة الأساسية العليا' : 'المرحلة الثانوية'), grade: GR.name(), subject: u.sn,
          unit: u.label, unitId: lid, lesson: JG.LESSONS[lid], lessonId: lid, concept: u.label, outcome: '', question: q[0], options: q[1].slice(), answer: q[2],
          explanation: '', difficulty: len < 90 ? 1 : (len < 170 ? 2 : 3), skill: /احسب|كم |قيمة|تساوي/.test(q[0]) ? 'حل مسائل حسابية' : (/لماذا|علل|فسّر|السبب/.test(q[0]) ? 'تفسير' : 'فهم'),
          source: 'أسئلة اختبارات موقع VLab — ' + GR.name(), zone: zone, builtin: true });
      });
    });
    GR.active = true; DB.items = items; DB.recent = [];
  };

  /* اختيار السؤال في وضع الصف: حسب مختبر اللعبة الحالي، وإلا من كل وحدات الصف */
  var origPick = DB.pick;
  DB.pick = function (o) {
    if (!GR.active) return origPick.call(DB, o);
    o = Object.assign({}, o || {}); var z = G.zoneNow ? G.zoneNow() : -1;
    o.lessons = null; if (z >= 1 && z <= 6) o.zone = z; else delete o.zone;
    var q = origPick.call(DB, o); if (q && o.zone && q.zone !== o.zone) { var pool = DB.items.filter(function (x) { return x.zone === o.zone; }); if (pool.length) { var rec = {}; (o.avoid || []).forEach(function (id) { rec[id] = 1; }); var f = pool.filter(function (x) { return !rec[x.id]; }); q = (f.length ? f : pool)[Math.floor(Math.random() * (f.length ? f.length : pool.length))]; } }
    return q;
  };

  /* ألغاز الكيمياء التخصصية تصبح بوابات أسئلة من بنك الصف */
  GR.gate = function (Gm, n, title, icon, cb) {
    var i = 0, rep = function (o) { if (JG.NET && JG.NET.room) JG.NET.report(o); }, next = function () { if (i >= n) { rep({ mission: 1 }); cb(true); return; } i++; Z.mcq(Gm, { retry: false, title: title + (n > 1 ? ' (' + i + '/' + n + ')' : ''), icon: icon, okText: i < n ? 'السؤال التالي ←' : 'افتح البوابة ←' }, function () { next(); }); };
    next();
  };
  var PZ = { indicatorDoor: ['بوابة الكاشف', '🚪', 1], saltSort: ['خزانة الأسئلة', '🧂', 1], energyGraph: ['شاشة الطاقة', '📈', 1], leChatelier: ['مفاعل الاتزان', '⚖️', 1],
    kcCalc: ['حاسوب المختبر', '🧮', 1], moleculeMachine: ['آلة الجزيئات', '🧬', 1], galvanic: ['محطة الكهرباء', '🔋', 1], molten: ['فرن المصاهير', '🔥', 1] };
  Object.keys(PZ).forEach(function (k) {
    var orig = Z[k]; if (!orig) return;
    Z[k] = function () {
      if (!GR.active) return orig.apply(Z, arguments);
      var a = arguments, cb = a[a.length - 1], p = PZ[k], extra = (JG.ARENA && JG.ARENA.tier && JG.ARENA.tier() >= 2) ? 1 : 0;
      GR.gate(a[0], p[2] + extra, p[0], p[1], function () { if (typeof cb === 'function') cb(true); });
    };
  });

  /* واجهة اختيار الصف في شاشة البداية */
  var origTitle = U.SC.title;
  U.SC.title = function (Gm) {
    var h = origTitle(Gm);
    var pick = '<div class="gpick" id="gPick"><b>صفّك الدراسي <span class="req">(مطلوب قبل البدء)</span></b><div class="gsegs">' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (g) { return '<button type="button" data-g="' + g + '" class="' + (GR.g === g ? 'on' : '') + '">' + g + '</button>'; }).join('') +
      '</div><div class="gsub" id="gSub"></div><small id="gInfo">' + (GR.g ? 'الأسئلة من اختبارات ' + esc(GR.label()) + ' في موقع VLab' : 'اختر صفك لتظهر لك أسئلة مناسبة لمنهاجك') + '</small></div>';
    var extra = '<div class="btns mp"><button class="sbtn" data-a="arena">🏟️ تحدي المراحل</button><button class="sbtn" data-a="multi">👥 اللعب الجماعي</button></div>';
    return h.replace('<div class="btns">', pick + '<div class="btns">').replace('<div class="sfoot">', extra + '<div class="sfoot">');
  };
  function paintSub(root) {
    var box = root.querySelector('#gSub'), info = root.querySelector('#gInfo'); if (!box) return;
    if (GR.g < 9) { box.innerHTML = ''; info.textContent = GR.g ? 'الأسئلة من اختبارات ' + GR.label() + ' (العلوم) في موقع VLab' : info.textContent; return; }
    box.innerHTML = '<small>جارٍ تحميل المباحث…</small>';
    GR.load(GR.g, function (ok) {
      var subs = ok ? GR.subjects(GR.g) : []; if (GR.s !== 'all' && subs.indexOf(GR.s) < 0) { GR.s = GR.g === 12 && subs.indexOf('chem') >= 0 ? 'chem' : 'all'; ls('jg_subj', GR.s); }
      box.innerHTML = ['all'].concat(subs).map(function (s) { return '<button type="button" data-s="' + s + '" class="' + (GR.s === s ? 'on' : '') + '">' + SUBN[s] + '</button>'; }).join('');
      box.querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { GR.s = b.dataset.s; ls('jg_subj', GR.s); paintSub(root); JG.Audio.play('ui'); }; });
      info.textContent = GR.isTawjihiChem() ? 'وضع التوجيهي: بنك كيمياء التوجيهي وكل ألغاز الكيمياء التفاعلية' : 'الأسئلة من اختبارات ' + GR.label() + ' في موقع VLab';
    });
  }
  var origMount = U.SCmount.title;
  U.SCmount.title = function (s, Gm) {
    if (origMount) origMount(s, Gm);
    s.querySelectorAll('#gPick [data-g]').forEach(function (b) { b.onclick = function () { GR.g = +b.dataset.g; ls('jg_grade', GR.g); GR.s = GR.g === 12 ? 'chem' : 'all'; ls('jg_subj', GR.s); s.querySelectorAll('#gPick [data-g]').forEach(function (x) { x.classList.toggle('on', x === b); }); s.querySelector('#gPick').classList.remove('need'); paintSub(s); JG.Audio.play('ui'); }; });
    paintSub(s);
  };

  /* لا بدء قبل اختيار الصف، ثم تحميل أسئلته وتطبيقها */
  GR.ensure = function (cb) {
    if (!GR.g) { var p = document.getElementById('gPick'); if (p) { p.classList.add('need'); p.scrollIntoView({ block: 'center', behavior: 'smooth' }); } U.toast('اختر صفك الدراسي أولاً ليختار المختبر أسئلة مناسبة لك'); return; }
    if (GR.isTawjihiChem()) { GR.apply(); cb(); return; }
    U.toast('جارٍ تجهيز أسئلة ' + GR.label() + '…');
    GR.load(GR.g, function (ok) { if (!ok) { U.toast('تعذّر تحميل أسئلة الصف؛ تأكد من الاتصال ثم أعد المحاولة'); return; } GR.apply(); cb(); });
  };
  var origAct = G.onScreenAction;
  G.onScreenAction = function (a, b, e) {
    if (a === 'new' || a === 'continue') { GR.ensure(function () { origAct.call(G, a, b, e); if (G.save) { G.save.grade = GR.g; G.save.subj = GR.s; } setTimeout(function () { U.banner(GR.label() || 'مختبر الأردن الذكي', GR.active ? 'أسئلة من اختبارات موقع VLab' : 'وضع التوجيهي — كيمياء', '#38bdf8'); }, 1200); }); return; }
    return origAct.call(G, a, b, e);
  };

  var st = document.createElement('style');
  st.textContent = '.gpick{margin:10px 0 4px;padding:12px;border:1px solid #334155;border-radius:14px;background:#0f172a88;text-align:right}.gpick.need{border-color:#f59e0b;box-shadow:0 0 0 3px #f59e0b55;animation:gp 1s 2}' +
    '@keyframes gp{50%{transform:scale(1.02)}}.gpick b{display:block;margin-bottom:8px}.gpick .req{color:#fbbf24;font-size:.8em;font-weight:600}.gsegs{display:grid;grid-template-columns:repeat(12,1fr);gap:5px}' +
    '.gsegs button,.gsub button{border:1px solid #475569;background:#1e293b;color:#e2e8f0;border-radius:9px;padding:8px 0;font:800 15px inherit;cursor:pointer}.gsegs button.on,.gsub button.on{background:#0ea5e9;border-color:#38bdf8;color:#fff}' +
    '.gsub{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.gsub button{padding:6px 12px;font-size:13px}.gpick small{display:block;margin-top:8px;color:#94a3b8;font-size:12.5px}.btns.mp{margin-top:8px}' +
    '@media(max-width:560px){.gsegs{grid-template-columns:repeat(6,1fr)}}';
  document.head.appendChild(st);
})();
