/* ============================================================
   JG Admin — نظام إدارة الأسئلة (داخل اللعبة وفي admin.html)
   استيراد JSON/CSV · قوالب · تصدير · إضافة وتعديل وحذف · تصفح وبحث
   التحديث لا يحتاج أي تعديل على برمجة اللعبة
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {};
  var esc = function (s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var AD = JG.Admin = { page: 0, q: '', les: '', edit: null };
  var TPL_ROWS = [
    ['', 'المرحلة الثانوية', 'الثاني عشر (التوجيهي)', 'الكيمياء', 'الفصل الأول', 'الوحدة الرابعة: الحموض والقواعد', 'الأملاح والأيون المشترك', 'يتنبأ بطبيعة محاليل الأملاح', 'تميّه الأملاح', 'محلول الملح NH₄Cl في الماء يكون:', 'حمضياً', 'قاعدياً', 'متعادلاً', 'لا يمكن التنبؤ', '1', 'NH₄⁺ حمض مرافق لقاعدة ضعيفة فيتميه وينتج H₃O⁺.', '2', 'فهم', 'كتاب الكيمياء – الصف الثاني عشر', 'ص 120', '1'],
    ['', 'المرحلة الأساسية', 'التاسع', 'العلوم', 'الفصل الثاني', 'الوحدة الثالثة', 'الحموض والقواعد', 'يميّز الحمض من القاعدة بالكواشف', 'الكواشف', 'لون ورق تباع الشمس في المحلول القاعدي:', 'أزرق', 'أحمر', 'أصفر', 'عديم اللون', '1', 'القواعد تحوّل تباع الشمس إلى الأزرق.', '1', 'تذكر', 'كتاب العلوم – الصف التاسع', 'ص 45', '']
  ];
  AD.templateCSV = function () { var D = JG.DB, e = function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }; return '﻿' + [D.FIELDS.join(',')].concat(TPL_ROWS.map(function (r) { return r.map(e).join(','); })).join('\r\n'); };
  AD.templateJSON = function () { var D = JG.DB; return JSON.stringify({ format: 'JG-Questions-1', questions: TPL_ROWS.map(function (r) { var o = {}; D.FIELDS.forEach(function (f, i) { o[f] = r[i]; }); o.options = [o.option1, o.option2, o.option3, o.option4]; o.answer = +o.answer - 1; delete o.option1; delete o.option2; delete o.option3; delete o.option4; delete o.id; return o; }) }, null, 1); };
  AD.render = function (el) {
    var D = JG.DB, cur = D.curriculum || D.buildCurriculum(), dl = JG.UI.download;
    var tree = cur.stages.map(function (st) { return '<details open><summary>' + esc(st.name) + '</summary>' + st.grades.map(function (g) { return '<details><summary>' + esc(g.name) + '</summary>' + g.subjects.map(function (sb) { return '<details><summary>' + esc(sb.name) + '</summary>' + sb.units.map(function (u) { return '<div class="tu"><b>' + esc(u.name) + '</b>' + (u.semester ? ' <small>' + esc(u.semester) + '</small>' : '') + '<ul>' + u.lessons.map(function (l) { return '<li>' + esc(l.name) + ' <small>(' + l.count + ' سؤالاً)</small>' + (l.outcomes.length ? '<em>' + esc(l.outcomes[0]) + '</em>' : '') + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</details>'; }).join('') + '</details>'; }).join('') + '</details>'; }).join('');
    var lessons = {}; D.items.forEach(function (q) { lessons[q.lesson] = 1; });
    var list = D.items.filter(function (q) { return (!AD.les || q.lesson === AD.les) && (!AD.q || (q.question + ' ' + q.options.join(' ')).indexOf(AD.q) >= 0); });
    var pages = Math.max(1, Math.ceil(list.length / 20)); AD.page = Math.min(AD.page, pages - 1);
    var rows = list.slice(AD.page * 20, AD.page * 20 + 20).map(function (q) {
      return '<div class="qrow"><div><b>' + esc(q.question) + '</b><small>' + esc(q.lesson) + ' · صعوبة ' + q.difficulty + ' · ' + esc(q.skill) + ' · الإجابة: ' + esc(q.options[q.answer]) + '</small></div><div class="qa">' + (q.builtin ? '<span class="tag">مدمج</span>' : '<button data-ed="' + esc(q.id) + '">تعديل</button><button data-del="' + esc(q.id) + '" class="dng">حذف</button>') + '</div></div>'; }).join('');
    var E = AD.edit || {}, opt = E.options || ['', '', '', ''];
    el.innerHTML = '<div class="adm">' +
      '<div class="acard"><h3>📦 حالة القاعدة</h3><div class="kpis"><div><b>' + D.items.length.toLocaleString('en') + '</b><small>إجمالي الأسئلة</small></div><div><b>' + D.builtin.length.toLocaleString('en') + '</b><small>مدمجة (تجريبية)</small></div><div><b>' + D.custom.length + '</b><small>مستوردة/مضافة</small></div><div><b>' + (D.customMode === 'replace' ? 'استبدال' : 'إضافة') + '</b><small>وضع الدمج</small></div></div>' +
      '<p class="note">الأسئلة المدمجة مأخوذة من بنك VLab لكيمياء التوجيهي (مؤلفة ومولّدة على نمط المكثف والامتحان الوزاري) وهي <b>تجريبية</b> تحتاج اعتماد المعلم. استورد الأسئلة المعتمدة من الكتب الرسمية بملف JSON أو CSV، وستستخدمها اللعبة مباشرة دون أي تعديل برمجي.</p></div>' +
      '<div class="acard"><h3>⬆️ استيراد أسئلة</h3><div class="arow"><input type="file" id="adFile" accept=".json,.csv,.txt"><select id="adMode"><option value="append">إضافة إلى الأسئلة الحالية</option><option value="replace">استبدال الأسئلة المدمجة بالكامل</option></select><button id="adImp" class="pri">استيراد</button></div><div id="adRes"></div>' +
      '<div class="arow"><button id="adTc">⬇ قالب CSV</button><button id="adTj">⬇ قالب JSON</button><button id="adEj">⬇ تصدير الكل JSON</button><button id="adEc">⬇ تصدير الكل CSV</button><button id="adEm">⬇ تصدير المستوردة فقط</button><button id="adRs" class="dng">مسح المستوردة</button></div>' +
      '<details class="fmt"><summary>صيغة الملف</summary><p>أعمدة CSV (الصف الأول): <code dir="ltr">' + D.FIELDS.join(', ') + '</code>. عمود <code>answer</code> رقم الخيار الصحيح (1–4) أو الحرف (أ/ب/ج/د). <code>difficulty</code>: 1 سهل، 2 متوسط، 3 قدرات عليا. <code>skill</code>: ' + D.SKILLS.join('، ') + '. <code>zone</code> (اختياري): رقم مختبر اللعبة 1–6 لربط السؤال بمنطقة معينة. في JSON: مصفوفة <code>options</code> و<code>answer</code> يبدأ من 0.</p></details></div>' +
      '<div class="acard"><h3>' + (E.id ? '✏️ تعديل سؤال' : '➕ إضافة سؤال') + '</h3><div class="aform">' +
      [['grade', 'الصف'], ['subject', 'المادة'], ['semester', 'الفصل الدراسي'], ['unit', 'الوحدة'], ['lesson', 'الدرس'], ['outcome', 'النتاج التعليمي'], ['concept', 'المفهوم العلمي'], ['source', 'مصدر السؤال'], ['ref', 'رقم الصفحة/المرجع']].map(function (f) { return '<label>' + f[1] + '<input data-f="' + f[0] + '" value="' + esc(E[f[0]] || (f[0] === 'grade' ? 'الثاني عشر (التوجيهي)' : f[0] === 'subject' ? 'الكيمياء' : '')) + '"></label>'; }).join('') +
      '<label class="w">نص السؤال<textarea data-f="question" rows="2">' + esc(E.question || '') + '</textarea></label>' + [0, 1, 2, 3].map(function (i) { return '<label>الخيار ' + 'أبجد'[i] + '<input data-o="' + i + '" value="' + esc(opt[i] || '') + '"></label>'; }).join('') +
      '<label>الإجابة الصحيحة<select data-f="answer">' + [0, 1, 2, 3].map(function (i) { return '<option value="' + i + '"' + (E.answer === i ? ' selected' : '') + '>' + 'أبجد'[i] + '</option>'; }).join('') + '</select></label>' +
      '<label>الصعوبة<select data-f="difficulty">' + [1, 2, 3].map(function (d) { return '<option' + (E.difficulty === d ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label>' +
      '<label>نوع المهارة<select data-f="skill">' + D.SKILLS.map(function (s) { return '<option' + (E.skill === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></label>' +
      '<label>منطقة اللعبة (1–6، اختياري)<input data-f="zone" value="' + esc(E.zone || '') + '"></label>' +
      '<label class="w">التفسير العلمي<textarea data-f="explanation" rows="2">' + esc(E.explanation || '') + '</textarea></label></div><div class="arow"><button id="adSave" class="pri">حفظ السؤال</button>' + (E.id ? '<button id="adCancel">إلغاء التعديل</button>' : '') + '<span id="adMsg"></span></div></div>' +
      '<div class="acard"><h3>🔎 تصفّح الأسئلة</h3><div class="arow"><input id="adQ" placeholder="ابحث في نص السؤال" value="' + esc(AD.q) + '"><select id="adL"><option value="">كل الدروس</option>' + Object.keys(lessons).map(function (l) { return '<option' + (AD.les === l ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select><span>' + list.length + ' نتيجة</span></div>' + rows +
      '<div class="arow pg"><button id="adPv"' + (AD.page ? '' : ' disabled') + '>السابق</button><span>' + (AD.page + 1) + ' / ' + pages + '</span><button id="adNx"' + (AD.page < pages - 1 ? '' : ' disabled') + '>التالي</button></div></div>' +
      '<div class="acard"><h3>🌳 شجرة المنهاج</h3><p class="note">المرحلة ← الصف ← المادة ← الوحدة ← الدرس ← النتاج. تتوسع تلقائياً عند استيراد أسئلة لصفوف ومواد أخرى.</p><div class="tree">' + tree + '</div></div></div>';
    var $ = function (s) { return el.querySelector(s); }, rr = function () { AD.render(el); };
    $('#adImp').onclick = function () {
      var f = $('#adFile').files[0]; if (!f) { $('#adRes').innerHTML = '<p class="bad">اختر ملفاً أولاً.</p>'; return; }
      var r = new FileReader(); r.onload = function () { try { var kind = /\.csv$/i.test(f.name) || /^﻿?[a-z_]+,/i.test(String(r.result).slice(0, 40)) ? 'csv' : 'json', res = D.importData(r.result, kind, $('#adMode').value);
        $('#adRes').innerHTML = '<p class="ok">✔ تم استيراد ' + res.added + ' سؤالاً.</p>' + (res.errors.length ? '<details open><summary class="bad">' + res.errors.length + ' سطراً مرفوضاً</summary><ul>' + res.errors.slice(0, 30).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></details>' : ''); setTimeout(rr, res.errors.length ? 4000 : 1200);
      } catch (e) { $('#adRes').innerHTML = '<p class="bad">تعذّر قراءة الملف: ' + esc(e.message) + '</p>'; } }; r.readAsText(f, 'utf-8');
    };
    $('#adTc').onclick = function () { dl('questions_template.csv', AD.templateCSV(), 'text/csv;charset=utf-8'); };
    $('#adTj').onclick = function () { dl('questions_template.json', AD.templateJSON(), 'application/json'); };
    $('#adEj').onclick = function () { dl('jg_questions_all.json', D.toJSON(), 'application/json'); };
    $('#adEc').onclick = function () { dl('jg_questions_all.csv', D.toCSV(), 'text/csv;charset=utf-8'); };
    $('#adEm').onclick = function () { dl('jg_questions_custom.json', D.toJSON(D.custom), 'application/json'); };
    $('#adRs').onclick = function () { if (this.dataset.c) { D.resetCustom(); rr(); } else { this.dataset.c = 1; this.textContent = 'اضغط مرة أخرى للتأكيد'; } };
    $('#adSave').onclick = function () {
      var q = Object.assign({}, AD.edit || {}); el.querySelectorAll('[data-f]').forEach(function (i) { q[i.dataset.f] = i.value; }); q.options = [0, 1, 2, 3].map(function (i) { return el.querySelector('[data-o="' + i + '"]').value.trim(); }).filter(Boolean);
      q.answer = +q.answer; q.difficulty = +q.difficulty; q.stage = q.stage || (/عشر|الحادي|الثاني عشر/.test(q.grade) ? 'المرحلة الثانوية' : 'المرحلة الأساسية'); q.id = q.id || ('man-' + Date.now().toString(36));
      if (!q.lessonId) { var m = Object.keys(JG.LESSONS || {}).find(function (k) { return JG.LESSONS[k] === q.lesson; }); if (m) q.lessonId = m; }
      delete q.builtin; var e = D.validate(q, 0); if (e) { $('#adMsg').innerHTML = '<span class="bad">' + esc(e) + '</span>'; return; }
      D.upsertCustom(q); AD.edit = null; rr(); JG.UI.toast('تم حفظ السؤال ✔');
    };
    if ($('#adCancel')) $('#adCancel').onclick = function () { AD.edit = null; rr(); };
    $('#adQ').onchange = function () { AD.q = this.value.trim(); AD.page = 0; rr(); }; $('#adL').onchange = function () { AD.les = this.value; AD.page = 0; rr(); };
    $('#adPv').onclick = function () { AD.page--; rr(); }; $('#adNx').onclick = function () { AD.page++; rr(); };
    el.querySelectorAll('[data-ed]').forEach(function (b) { b.onclick = function () { AD.edit = JSON.parse(JSON.stringify(D.byId[b.dataset.ed])); rr(); el.scrollIntoView(); }; });
    el.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { if (b.dataset.c) { D.removeCustom(b.dataset.del); rr(); } else { b.dataset.c = 1; b.textContent = 'تأكيد'; } }; });
  };
})();
