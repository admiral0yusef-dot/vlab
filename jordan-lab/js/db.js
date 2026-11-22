/* ============================================================
   JG DB — قاعدة بيانات المنهاج والأسئلة
   الهيكل: المرحلة ← الصف ← المادة ← الفصل ← الوحدة ← الدرس ← النتاج ← المفهوم ← السؤال
   - الأسئلة المدمجة: بنك VLab للتوجيهي (مؤلف/مولّد على نمط المكثف والامتحان الوزاري، تجريبي يحتاج اعتماد المعلم)
   - الاستيراد: JSON / CSV ويُحفظ في IndexedDB (احتياط: localStorage) دون تعديل برمجة اللعبة
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {};
  var SKILLS = ['تذكر', 'فهم', 'تطبيق', 'تحليل', 'استنتاج', 'حل مسائل حسابية', 'تفسير نتائج التجارب'];
  var FIELDS = ['id','stage','grade','subject','semester','unit','lesson','outcome','concept','question','option1','option2','option3','option4','answer','explanation','difficulty','skill','source','ref','zone'];
  /* نتاجات مقترحة لكل درس (وصفية؛ تُستبدل بالنتاجات الرسمية عند استيرادها) */
  var OUT = {
    u1l1: 'يفسّر سلوك الغازات بنظرية الحركة الجزيئية ويطبّق قوانين الغازات', u1l2: 'يقارن بين السوائل في قوى التجاذب والضغط البخاري وطاقة التبخر',
    u1l3: 'يصنّف المواد الصلبة ويربط خصائصها بنوع الجسيمات وقوى الترابط', u2l1: 'يصنّف المحاليل والمخاليط ويفسّر الذائبية',
    u2l2: 'يفسّر الخصائص الجامعة للمحاليل', u3l1: 'يصف حالة الاتزان ويتنبأ بأثر العوامل وفق مبدأ لوتشاتلييه', u3l2: 'يكتب تعبير ثابت الاتزان ويجري حسابات عليه',
    u4l1: 'يميّز الحموض والقواعد وفق مفاهيم أرهينيوس وبرونستد-لوري ولويس', u4l2: 'يحسب الرقم الهيدروجيني لمحاليل الحموض والقواعد القوية',
    u4l3: 'يقارن قوة الحموض والقواعد الضعيفة ويجري حسابات عليها', u4l4: 'يتنبأ بطبيعة محاليل الأملاح ويفسّر أثر الأيون المشترك',
    u5l1: 'يحسب سرعة التفاعل المتوسطة واللحظية', u5l2: 'يستنتج قانون السرعة ورتبة التفاعل ووحدة ثابت السرعة',
    u5l3: 'يفسّر أثر العوامل في سرعة التفاعل بنظرية التصادم', u6l1: 'يحدد أعداد التأكسد والعوامل المؤكسدة والمختزلة',
    u6l2: 'يحسب جهد الخلية الجلفانية ويتنبأ بتلقائية التفاعل', u6l3: 'يتنبأ بنواتج التحليل الكهربائي للمصاهير', u7l1: 'يتنبأ بنواتج تفاعلات المركبات العضوية ويميّزها بالكشوف'
  };
  var CONCEPT = {
    u1l1: 'الضغط والحجم ودرجة الحرارة وعدد المولات', u1l2: 'قوى التجاذب بين الجزيئات والضغط البخاري', u1l3: 'أنواع المواد الصلبة',
    u2l1: 'المحلول الحقيقي والمعلق والغروي والذائبية', u2l2: 'عدد جسيمات المذاب وأثره في الخصائص الجامعة', u3l1: 'مبدأ لوتشاتلييه',
    u3l2: 'ثابت الاتزان Kc', u4l1: 'الزوج المترافق وتعريفات الحموض والقواعد', u4l2: 'pH وpOH و Kw', u4l3: 'Ka وKb وقوة الحمض',
    u4l4: 'تميّه الأملاح والأيون المشترك', u5l1: 'التغير في التركيز مع الزمن', u5l2: 'رتبة التفاعل وقانون السرعة', u5l3: 'طاقة التنشيط والتصادمات الفعالة',
    u6l1: 'عدد التأكسد وفقد الإلكترونات وكسبها', u6l2: 'جهود الاختزال المعيارية', u6l3: 'المصعد والمهبط في خلية التحليل', u7l1: 'المجموعات الوظيفية وتفاعلاتها'
  };
  var DB = JG.DB = { curriculum: null, items: [], builtin: [], custom: [], customMode: 'append', recent: [], ready: false, SKILLS: SKILLS, FIELDS: FIELDS };

  function skillOf(q, d, hasNum) {
    var t = q;
    if (/الجدول|الشكل|المنحنى|الرسم البياني|النتائج/.test(t)) return /تجربة|تجارب|أجريت|النتائج/.test(t) ? 'تفسير نتائج التجارب' : 'تحليل';
    if (hasNum && /احسب|قيمة|تساوي|تركيز|عدد مولات|سرعة|ثابت/.test(t)) return 'حل مسائل حسابية';
    if (d === 1) return /يسمى|يُسمى|تعريف|المقصود|هو:|هي:/.test(t) ? 'تذكر' : 'فهم';
    if (d === 2) return /في التفاعل|عند إضافة|عند|المعادلة/.test(t) ? 'تطبيق' : 'فهم';
    return /فإن|نستنتج|يمكن الاستنتاج|الترتيب|الأقوى|الأعلى|الأقل/.test(t) ? 'استنتاج' : 'تحليل';
  }
  /* تحويل بنك VLab ([id,lesson,diff,q,opts,ans,expl,key,fig]) إلى مخطط القاعدة */
  DB.fromVLab = function (QB) {
    var meta = QB.meta, out = [];
    (QB.q || []).forEach(function (r) {
      if (r[8]) return; if (r[4].some(function (o) { return String(o)[0] === '§'; })) return;
      var u = r[1].slice(0, 2), M = meta[u]; if (!M) return;
      var hasNum = r[4].every(function (o) { return /^[\s\-–+]*[\d.,×⁰-⁹¹²³⁻ ]+/.test(String(o)); });
      out.push({ id: 'vlab-' + r[0], stage: 'المرحلة الثانوية', grade: 'الثاني عشر (التوجيهي)', subject: 'الكيمياء', semester: '',
        unit: M.n + ': ' + M.t, unitId: u, lesson: M.l[r[1]], lessonId: r[1], outcome: OUT[r[1]] || '', concept: CONCEPT[r[1]] || '',
        question: r[3], options: r[4].slice(), answer: r[5], explanation: r[6] || '', difficulty: r[2], skill: skillOf(r[3], r[2], hasNum),
        source: 'بنك أسئلة VLab للتوجيهي — مؤلَّف/مولَّد على نمط مكثف اللوبيتال والامتحان الوزاري 2026 (تجريبي: يحتاج اعتماد المعلم)', ref: '', builtin: true });
    });
    return out;
  };
  DB.buildCurriculum = function () {
    var cur = JG.CURRICULUM ? JSON.parse(JSON.stringify(JG.CURRICULUM)) : { stages: [] };
    var find = function (arr, name, mk) { var x = arr.find(function (a) { return a.name === name; }); if (!x) { x = mk(); arr.push(x); } return x; };
    DB.items.forEach(function (q) {
      var st = find(cur.stages, q.stage || 'غير مصنف', function () { return { name: q.stage || 'غير مصنف', grades: [] }; });
      var gr = find(st.grades, q.grade || 'غير مصنف', function () { return { name: q.grade || 'غير مصنف', subjects: [] }; });
      var sb = find(gr.subjects, q.subject || 'غير مصنف', function () { return { name: q.subject || 'غير مصنف', units: [] }; });
      var un = find(sb.units, q.unit || 'غير مصنف', function () { return { name: q.unit || 'غير مصنف', semester: q.semester || '', lessons: [] }; });
      var ls = find(un.lessons, q.lesson || 'غير مصنف', function () { return { name: q.lesson || 'غير مصنف', id: q.lessonId || '', outcomes: [], count: 0 }; });
      ls.count++; if (q.outcome && ls.outcomes.indexOf(q.outcome) < 0) ls.outcomes.push(q.outcome);
    });
    DB.curriculum = cur; return cur;
  };
  DB.validate = function (q, i) {
    var e = [];
    if (!q.question || String(q.question).trim().length < 4) e.push('نص السؤال مفقود');
    if (!Array.isArray(q.options) || q.options.filter(function (o) { return String(o).trim(); }).length < 2) e.push('يلزم خياران على الأقل');
    if (!(q.answer >= 0 && q.answer < (q.options || []).length)) e.push('رقم الإجابة الصحيحة غير صالح');
    if (q.difficulty && [1, 2, 3].indexOf(+q.difficulty) < 0) e.push('مستوى الصعوبة يجب أن يكون 1 أو 2 أو 3');
    if (q.skill && SKILLS.indexOf(q.skill) < 0) e.push('نوع المهارة غير معروف: ' + q.skill);
    return e.length ? ('السطر ' + (i + 1) + ': ' + e.join('، ')) : '';
  };
  function norm(q, i) {
    var o = Object.assign({}, q);
    if (!o.options) o.options = [o.option1, o.option2, o.option3, o.option4].filter(function (x) { return x !== undefined && String(x).trim() !== ''; });
    var a = o.answer; if (typeof a === 'string') { var t = a.trim(); var L = { 'أ': 0, 'ب': 1, 'ج': 2, 'د': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      if (L[t] !== undefined) a = L[t]; else if (/^\d+$/.test(t)) a = +t - 1; else a = o.options.indexOf(t); }
    else if (typeof a === 'number' && q.answerBase !== 0 && q.option1 !== undefined) a = a - 1;
    o.answer = a; o.difficulty = +o.difficulty || 2; o.skill = o.skill || 'فهم'; o.id = o.id || ('imp-' + Date.now().toString(36) + '-' + i);
    o.stage = o.stage || 'المرحلة الثانوية'; o.grade = o.grade || 'الثاني عشر (التوجيهي)'; o.subject = o.subject || 'الكيمياء';
    if (!o.lessonId && o.lesson) { var m = Object.keys(JG.LESSONS || {}).find(function (k) { return JG.LESSONS[k] === o.lesson; }); if (m) o.lessonId = m; }
    if (!o.unitId && o.lessonId) o.unitId = String(o.lessonId).slice(0, 2);
    delete o.option1; delete o.option2; delete o.option3; delete o.option4; return o;
  }
  /* CSV → صفوف (يدعم علامات الاقتباس والفواصل داخل الحقول) */
  DB.parseCSV = function (text) {
    text = String(text).replace(/^﻿/, ''); var rows = [], row = [], f = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
      else if (ch === '"') q = true; else if (ch === ',' || ch === '\t' || ch === ';' && false) { row.push(f); f = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); f = ''; if (row.some(function (x) { return x.trim(); })) rows.push(row); row = []; }
      else f += ch;
    }
    row.push(f); if (row.some(function (x) { return x.trim(); })) rows.push(row);
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim(); });
    return rows.slice(1).map(function (r) { var o = {}; head.forEach(function (h, k) { if (h) o[h] = (r[k] || '').trim(); }); return o; });
  };
  DB.importData = function (text, kind, mode) {
    var raw;
    if (kind === 'csv') raw = DB.parseCSV(text);
    else { var j = JSON.parse(text); raw = Array.isArray(j) ? j : (j.questions || j.items || []); }
    var ok = [], errs = [];
    raw.forEach(function (r, i) { var q = norm(r, i), e = DB.validate(q, i); if (e) errs.push(e); else ok.push(q); });
    if (mode === 'replace') { DB.custom = ok; DB.customMode = 'replace'; } else { var ids = {}; DB.custom.forEach(function (q) { ids[q.id] = 1; }); ok.forEach(function (q) { if (!ids[q.id]) DB.custom.push(q); }); if (DB.customMode !== 'replace') DB.customMode = 'append'; }
    DB.merge(); DB.persist(); return { added: ok.length, errors: errs };
  };
  DB.merge = function () {
    DB.items = DB.customMode === 'replace' ? DB.custom.slice() : DB.builtin.concat(DB.custom);
    DB.byId = {}; DB.items.forEach(function (q) { DB.byId[q.id] = q; }); DB.buildCurriculum();
  };
  DB.resetCustom = function () { DB.custom = []; DB.customMode = 'append'; DB.merge(); DB.persist(); };
  DB.removeCustom = function (id) { DB.custom = DB.custom.filter(function (q) { return q.id !== id; }); DB.merge(); DB.persist(); };
  DB.upsertCustom = function (q) { var i = DB.custom.findIndex(function (x) { return x.id === q.id; }); if (i >= 0) DB.custom[i] = q; else DB.custom.push(q); DB.merge(); DB.persist(); };
  /* تخزين دائم: IndexedDB ثم localStorage */
  var IDB = null;
  function idb(cb) {
    if (IDB) return cb(IDB); try { var r = indexedDB.open('jg_db', 1); r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onsuccess = function () { IDB = r.result; cb(IDB); }; r.onerror = function () { cb(null); }; } catch (e) { cb(null); }
  }
  DB.persist = function () {
    var v = { mode: DB.customMode, items: DB.custom };
    idb(function (d) { if (d) { try { d.transaction('kv', 'readwrite').objectStore('kv').put(v, 'custom'); return; } catch (e) {} } try { localStorage.setItem('jg_custom_q', JSON.stringify(v)); } catch (e) {} });
  };
  DB.load = function (cb) {
    var src = window.JG_QBANK; try { if (!src && window.parent && window.parent !== window && window.parent.YQ_QB) src = window.parent.YQ_QB; } catch (e) {}
    if (src) { JG.LESSONS = {}; Object.keys(src.meta).forEach(function (u) { Object.assign(JG.LESSONS, src.meta[u].l); }); JG.UNITS = src.meta; DB.builtin = DB.fromVLab(src); }
    var done = function (v) { if (v && v.items) { DB.custom = v.items; DB.customMode = v.mode || 'append'; } DB.merge(); DB.ready = true; cb && cb(); };
    idb(function (d) {
      if (!d) { var v = null; try { v = JSON.parse(localStorage.getItem('jg_custom_q') || 'null'); } catch (e) {} return done(v); }
      try { var g = d.transaction('kv').objectStore('kv').get('custom'); g.onsuccess = function () { var v = g.result; if (!v) { try { v = JSON.parse(localStorage.getItem('jg_custom_q') || 'null'); } catch (e) {} } done(v); }; g.onerror = function () { done(null); }; }
      catch (e) { done(null); }
    });
    try { DB.recent = JSON.parse(localStorage.getItem('jg_recent') || '[]'); } catch (e) { DB.recent = []; }
  };
  /* اختيار سؤال مناسب للمهمة: حسب الدروس + الصعوبة التكيفية + المهارة + عدم التكرار */
  DB.pick = function (o) {
    o = o || {}; var L = o.lessons, Z = o.zone, pool = DB.items.filter(function (q) {
      if (Z !== undefined && q.zone !== undefined && q.zone !== '' && +q.zone === Z) return true;
      return !L || L.indexOf(q.lessonId) >= 0 || L.indexOf(q.lesson) >= 0;
    });
    if (!pool.length) pool = DB.items.slice(); if (!pool.length) return null;
    var rec = {}; DB.recent.forEach(function (id) { rec[id] = 1; }); (o.avoid || []).forEach(function (id) { rec[id] = 1; });
    var fresh = pool.filter(function (q) { return !rec[q.id]; }); if (fresh.length < 3) fresh = pool;
    var want = o.diff || 2, sk = o.skill;
    var score = function (q) { return Math.abs((q.difficulty || 2) - want) * 2 + (sk && q.skill !== sk ? 1 : 0) + Math.random() * 1.6; };
    var best = null, bs = 1e9; for (var i = 0; i < Math.min(fresh.length, 400); i++) { var q = fresh[Math.floor(Math.random() * fresh.length)], s = score(q); if (s < bs) { bs = s; best = q; } }
    DB.recent.push(best.id); if (DB.recent.length > 400) DB.recent = DB.recent.slice(-400);
    try { localStorage.setItem('jg_recent', JSON.stringify(DB.recent)); } catch (e) {}
    return best;
  };
  DB.toCSV = function (items) {
    var esc = function (v) { v = v === undefined || v === null ? '' : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var lines = [FIELDS.join(',')];
    (items || DB.items).forEach(function (q) { var o = q.options || []; lines.push([q.id, q.stage, q.grade, q.subject, q.semester, q.unit, q.lesson, q.outcome, q.concept, q.question, o[0], o[1], o[2], o[3], (q.answer | 0) + 1, q.explanation, q.difficulty, q.skill, q.source, q.ref, q.zone].map(esc).join(',')); });
    return '﻿' + lines.join('\r\n');
  };
  DB.toJSON = function (items) {
    return JSON.stringify({ format: 'JG-Questions-1', exported: new Date().toISOString(), questions: (items || DB.items).map(function (q) { var o = Object.assign({}, q); delete o.builtin; return o; }) }, null, 1);
  };
  DB.OUT = OUT; DB.CONCEPT = CONCEPT;
})();
