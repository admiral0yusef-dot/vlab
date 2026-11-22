/* ============================================================
   JG UI — واجهة عربية RTL: HUD، خريطة مصغرة، نوافذ التحديات، الشاشات
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var U = JG.UI = { open: null };

  /* ---------- تنزيل ملف ---------- */
  U.download = function (name, text, mime) {
    try { var b = new Blob([text], { type: mime || 'application/octet-stream' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000); U.toast('تم تجهيز الملف: ' + name); }
    catch (e) { U.toast('تعذّر التنزيل في هذا المتصفح'); }
  };
  U.toast = function (m, ms) { var t = $('toast'); t.innerHTML = m; t.classList.add('on'); clearTimeout(U._tt); U._tt = setTimeout(function () { t.classList.remove('on'); }, ms || 2400); };
  U.banner = function (big, small, col) { var b = $('banner'); b.innerHTML = '<small>' + esc(small || '') + '</small><b>' + esc(JG.ND(big)) + '</b>'; b.style.setProperty('--bc', col || '#38bdf8'); b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); };
  U.letterbox = function (on) { document.body.classList.toggle('cine', !!on); };
  U.fitEq = function (root) { (root || document).querySelectorAll('.eq').forEach(function (e) { e.style.fontSize = ''; var w = e.parentNode.clientWidth, sw = e.scrollWidth; if (w > 30 && sw > w) { var f = parseFloat(getComputedStyle(e).fontSize) || 16; e.style.fontSize = Math.max(10, f * w / sw * .96) + 'px'; } }); };

  /* ---------- نافذة تحدٍّ (تُوقف اللعب) ---------- */
  U.modal = function (o) {
    var m = $('modal'), body = m.querySelector('.mbody'); m.querySelector('.mti').textContent = JG.ND(o.title || ''); m.querySelector('.mic').textContent = o.icon || '🧪';
    m.hidden = false; U.open = o; if (JG.G) JG.G.paused = true; body.scrollTop = 0;
    var close = function () { m.hidden = true; U.open = null; body.innerHTML = ''; if (JG.G) { JG.G.paused = false; JG.G.input.reset(); } if (o.onClose) o.onClose(); };
    m.querySelector('.mx').onclick = function () { if (o.noClose) return; close(); if (o.onCancel) o.onCancel(); };
    m.querySelector('.mx').hidden = !!o.noClose;
    o.render(body, close); return close;
  };
  /* ---------- فقاعة ذرّة ---------- */
  U.atomShow = function (txt, kind) {
    var a = $('atom'); if (!a) return; a.querySelector('.bub').innerHTML = JG.Puz ? JG.Puz.fmt(txt) : esc(txt); a.className = 'on k-' + kind; clearTimeout(U._at);
    U._at = setTimeout(function () { a.className = ''; }, Math.min(11000, 3500 + txt.length * 55));
  };
  /* ---------- HUD ---------- */
  U.hud = function (G) {
    var P = G.player, S = G.save;
    $('hE').style.width = (P.energy / P.maxE * 100) + '%'; $('hE').classList.toggle('low', P.energy < 30);
    $('hEn').textContent = Math.ceil(P.energy); $('hSc').textContent = S.score.toLocaleString('en'); $('hLv').textContent = S.level;
    $('hXp').style.width = (S.xp / G.xpNeed() * 100) + '%';
    var cr = ''; for (var i = 1; i <= 6; i++) cr += '<i class="' + (S.crystals[i] ? 'on' : '') + '" style="--c:' + G.ZC[i] + '"></i>'; if ($('hCr').innerHTML !== cr) $('hCr').innerHTML = cr;
    var md = P.mode === 'acid' ? '<b class="m-a">حمض <span class="ltr">H₃O⁺</span></b>' : '<b class="m-b">قاعدة <span class="ltr">OH⁻</span></b>';
    var tools = '<span class="tl ' + (S.tools.boost ? 'on' : '') + '" title="المحفّز (R)">⚡' + (P.boostCd > 0 ? '<em>' + Math.ceil(P.boostCd) + '</em>' : '') + '</span><span class="tl ' + (S.tools.shield ? 'on' : '') + '" title="درع لوشاتلييه (F)">🛡️' + (P.shieldCd > 0 ? '<em>' + Math.ceil(P.shieldCd) + '</em>' : '') + '</span><span class="tl ' + (S.tools.magnet ? 'on' : '') + '" title="مجمّع الجزيئات">🧲</span><span class="tl ' + (S.tools.beam ? 'on' : '') + '" title="قطب الإلكترونات">🔋</span>';
    var h = '<span class="md">' + md + '</span>' + tools + (G.inv && Object.keys(G.inv).some(function (k) { return G.inv[k]; }) ? '<span class="inv">' + Object.keys(G.inv).filter(function (k) { return G.inv[k]; }).map(function (k) { return k + '×' + G.inv[k]; }).join(' ') + '</span>' : '') + (P.carry ? '<span class="inv">يحمل: ' + esc(P.carry.name) + '</span>' : '');
    if ($('tool').innerHTML !== h) $('tool').innerHTML = h;
    var b = G.boss; $('boss').hidden = !(b && b.alive && !b.intro);
    if (b && b.alive) { $('bossHp').style.width = (b.hp / b.max * 100) + '%'; $('bossName').textContent = JG.ND(b.D.name); $('bossSt').textContent = b.shield ? '🛡️ درع منيع — حلّ تحدّي محطة الإضعاف المضيئة' : (b.stun > 0 ? '💫 مشلول! أطلق الآن' : '');
      $('boss').classList.toggle('sh', !!b.shield); }
  };
  U.objective = function (t) { var o = $('obj'); if (o.dataset.t !== t) { o.dataset.t = t; o.innerHTML = '<span>🎯</span>' + (JG.Puz ? JG.Puz.fmt(t) : esc(t)); o.classList.remove('pulse'); void o.offsetWidth; o.classList.add('pulse'); } };
  U.prompt = function (t, x, y) { var p = $('prompt'); if (!t) { p.hidden = true; return; } p.hidden = false; p.innerHTML = '<kbd>E</kbd> ' + (JG.Puz ? JG.Puz.fmt(t) : esc(t)); if (x !== undefined) { p.style.left = x + 'px'; p.style.top = y + 'px'; } };

  /* ---------- الخريطة المصغرة ---------- */
  U.minimap = function (G, big) {
    var cv = $('mini'), W = JG.World, S = G.save, s = big ? Math.min(innerWidth, innerHeight) * .82 : (innerWidth < 640 ? 112 : 150), dpr = Math.min(2, devicePixelRatio || 1);
    if (cv._s !== s * dpr) { cv._s = s * dpr; cv.width = cv.height = s * dpr; cv.style.width = cv.style.height = s + 'px'; }
    var x = cv.getContext('2d'), k = cv.width / W.MW; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.fillStyle = 'rgba(7,10,22,.82)'; x.fillRect(0, 0, cv.width, cv.height);
    var oy = (cv.height - W.MH * k) / 2;
    W.ROOMS.forEach(function (r) { if (!S.seen[r.id] && !big) return; if (r.id === 'sec' && !S.seen.sec) return; x.fillStyle = S.seen[r.id] ? r.theme + (r.id === G.roomId ? 'aa' : '55') : 'rgba(100,116,139,.18)'; x.fillRect(r.x * k, oy + r.y * k, r.w * k, r.h * k);
      if (big) { x.fillStyle = '#e2e8f0'; x.font = '700 ' + Math.max(10, k * 1.25) + 'px ' + JG.FONT; x.textAlign = 'center'; x.direction = 'rtl'; x.fillText(r.name, (r.x + r.w / 2) * k, oy + (r.y + r.h / 2) * k); } });
    W.CORR.forEach(function (c) { if (c.secret && !W.secretOpen) return; x.fillStyle = 'rgba(148,163,184,.35)'; x.fillRect(c.x * k, oy + c.y * k, c.w * k, c.h * k); });
    W.doors.forEach(function (d) { if (d.secret && !W.secretOpen) return; x.fillStyle = d.open > .5 ? '#22c55e' : (d.locked ? '#ef4444' : '#facc15'); var w = d.horiz ? k * .9 : d.span / 2 * k, h = d.horiz ? d.span / 2 * k : k * .9; x.fillRect(d.x / 2 * k - w / 2, oy + d.z / 2 * k - h / 2, w, h); });
    JG.Ent.foes.forEach(function (f) { if (f.dead || f.room !== G.roomId) return; x.fillStyle = '#f87171'; x.beginPath(); x.arc(f.x / 2 * k, oy + f.z / 2 * k, k * .55, 0, 6.3); x.fill(); });
    if (G.boss && G.boss.alive) { x.fillStyle = '#ef4444'; x.beginPath(); x.arc(G.boss.x / 2 * k, oy + G.boss.zz / 2 * k, k * 1.2, 0, 6.3); x.fill(); }
    if (G.target) { var tt = (Date.now() / 300) % 1; x.strokeStyle = '#fde047'; x.lineWidth = 2 * dpr; x.beginPath(); x.arc(G.target[0] / 2 * k, oy + G.target[1] / 2 * k, k * (1 + tt * 1.5), 0, 6.3); x.stroke(); }
    var P = G.player; x.save(); x.translate(P.pos[0] / 2 * k, oy + P.pos[2] / 2 * k); x.rotate(-P.h + Math.PI); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(0, -k * 1.4); x.lineTo(k * .9, k); x.lineTo(-k * .9, k); x.closePath(); x.fill(); x.restore();
    cv.classList.toggle('big', !!big);
  };

  /* ---------- الشاشات ---------- */
  U.screen = function (name, G) {
    var s = $('screen'); if (!name) { s.hidden = true; s.innerHTML = ''; return; } s.hidden = false; s.className = 'sc-' + name; s.scrollTop = 0;
    var back = '<button class="sbtn ghost" data-a="back">→ رجوع</button>';
    var f = U.SC[name]; s.innerHTML = '<div class="spanel">' + f(G, back) + '</div>';
    s.querySelectorAll('[data-a]').forEach(function (b) { b.onclick = function (e) { JG.Audio.play('ui'); G.onScreenAction(b.dataset.a, b, e); }; });
    if (U.SCmount[name]) U.SCmount[name](s, G);
  };
  var DIFF = ['', 'سهل', 'متوسط', 'صعب'];
  U.SC = {
    title: function (G) {
      var has = G.hasSave();
      return '<div class="ttl"><div class="logo"><span>⚛</span></div><small>VLab · Jordan Smart Chemistry Arcade</small><h1>مختبر الأردن الذكي</h1><p>العب بشخصية عالم كيميائي شاب داخل مختبر أردني متطوّر: استكشف، اجمع الأدوات، افتح الأبواب بالكيمياء، وواجه ستة زعماء.</p></div>' +
        '<div class="frm"><label>اسم اللاعب<input id="pName" maxlength="40" value="' + esc(G.save.name || '') + '" placeholder="اكتب اسمك"></label><label>مستوى الصعوبة<div class="seg" id="pDiff">' + [1, 2, 3].map(function (d) { return '<button type="button" data-d="' + d + '" class="' + (G.settings.diff === d ? 'on' : '') + '">' + DIFF[d] + '</button>'; }).join('') + '</div></label></div>' +
        '<div class="btns">' + (has ? '<button class="sbtn big" data-a="continue">▶ متابعة المغامرة</button><button class="sbtn" data-a="new">✦ مغامرة جديدة</button>' : '<button class="sbtn big" data-a="new">▶ ابدأ المغامرة</button>') +
        '<button class="sbtn" data-a="help">❓ طريقة اللعب</button><button class="sbtn" data-a="ach">🏆 الإنجازات</button><button class="sbtn" data-a="report">📊 تقرير الأداء</button><button class="sbtn" data-a="admin">🗂️ إدارة الأسئلة</button><button class="sbtn" data-a="settings">⚙️ الإعدادات</button></div>' +
        '<div class="sfoot">تصميم وبرمجة: <b>الأستاذ يوسف القاق</b> · المختبر الافتراضي للعلوم VLab · ' + JG.DB.items.length.toLocaleString('en') + ' سؤالاً في قاعدة البيانات</div>';
    },
    pause: function (G) {
      return '<h2>⏸ اللعبة متوقفة</h2><div class="btns col"><button class="sbtn big" data-a="resume">▶ متابعة</button><button class="sbtn" data-a="map">🗺️ الخريطة</button><button class="sbtn" data-a="missions">📋 قائمة المهام</button><button class="sbtn" data-a="ach">🏆 الإنجازات</button><button class="sbtn" data-a="report">📊 تقرير الأداء</button><button class="sbtn" data-a="settings">⚙️ الإعدادات</button><button class="sbtn" data-a="help">❓ طريقة اللعب</button><button class="sbtn ghost" data-a="quit">💾 حفظ والعودة للبداية</button></div>';
    },
    missions: function (G, back) {
      return '<h2>📋 قائمة المهام</h2><div class="mis">' + G.missionList().map(function (m) { return '<div class="mi ' + (m.done ? 'done' : (m.cur ? 'cur' : '')) + '"><i>' + (m.done ? '✔' : (m.cur ? '➤' : '○')) + '</i><div><b>' + esc(m.t) + '</b><small>' + esc(m.d) + '</small></div></div>'; }).join('') + '</div>' + back;
    },
    help: function (G, back) {
      return '<h2>❓ طريقة اللعب</h2><div class="help"><div><h3>⌨️ لوحة المفاتيح</h3><ul><li><kbd>W A S D</kbd> أو الأسهم: الحركة</li><li><kbd>Shift</kbd>: الجري</li><li><kbd>Space</kbd>: القفز</li><li><kbd>E</kbd>: التفاعل والالتقاط</li><li><kbd>J</kbd> أو النقر: إطلاق جهاز المعادلة</li><li><kbd>Q</kbd>: تبديل وضع الجهاز (حمض/قاعدة)</li><li><kbd>R</kbd>: المحفّز · <kbd>F</kbd>: الدرع</li><li><kbd>Z</kbd>/<kbd>C</kbd> أو السحب بالفأرة: تدوير الكاميرا</li><li><kbd>M</kbd>: الخريطة · <kbd>Esc</kbd>: إيقاف</li></ul></div>' +
        '<div><h3>📱 اللمس والشاشات التفاعلية</h3><ul><li>عصا التحكم في الجهة اليسرى للحركة</li><li>اسحب في الجهة اليمنى لتدوير الكاميرا</li><li>أزرار: قفز، تفاعل، إطلاق، تبديل، جري</li></ul><h3>🧪 الكيمياء في اللعب</h3><ul><li>الأبواب تُفتح بتجارب حقيقية: كواشف، تعادل، اتزان، خلايا جلفانية…</li><li>أيونات H₃O⁺ تُعادَل بوضع القاعدة، وأيونات OH⁻ بوضع الحمض</li><li>دروع الزعماء تُكسر فقط بحلّ تحديات محطات الإضعاف</li><li>«ذرّة» تعطيك تلميحات متدرجة ولا تكشف الإجابة من أول خطأ</li></ul></div></div>' + back;
    },
    ach: function (G, back) {
      var A = G.ACH, got = G.save.ach; return '<h2>🏆 الإنجازات والأوسمة <small>(' + Object.keys(got).length + '/' + A.length + ')</small></h2><div class="achs">' + A.map(function (a) { var on = got[a.id]; return '<div class="ac ' + (on ? 'on' : '') + '"><i>' + a.i + '</i><b>' + esc(a.n) + '</b><small>' + esc(a.d) + '</small></div>'; }).join('') + '</div>' + back;
    },
    report: function (G, back) {
      var R = G.report(); var row = function (l) { var p = l.n ? Math.round(l.ok / l.n * 100) : 0; return '<tr><td>' + esc(l.name) + '</td><td>' + l.n + '</td><td>' + l.ok + '</td><td>' + (l.n - l.ok) + '</td><td><div class="mb"><i style="width:' + p + '%;background:' + (p >= 80 ? '#22c55e' : p >= 50 ? '#eab308' : '#ef4444') + '"></i></div>' + p + '%</td></tr>'; };
      return '<h2>📊 تقرير الأداء التعليمي</h2><div class="kpis"><div><b>' + R.total + '</b><small>سؤالاً وتحدياً</small></div><div><b>' + R.ok + '</b><small>صحيحة من أول محاولة</small></div><div><b>' + (R.total - R.ok) + '</b><small>خاطئة/بمحاولة ثانية</small></div><div><b>' + R.time + '</b><small>زمن اللعب</small></div><div><b>' + G.save.score.toLocaleString('en') + '</b><small>النقاط</small></div><div><b>' + G.save.level + '</b><small>المستوى</small></div></div>' +
        '<h3>المهارات المتقنة</h3><p class="chips">' + (R.mastered.length ? R.mastered.map(function (x) { return '<span class="ok">' + esc(x) + '</span>'; }).join('') : '<span>لم تُتقن مهارة بعد (80% فأكثر بثلاث محاولات على الأقل)</span>') + '</p>' +
        '<h3>مفاهيم تحتاج إلى مراجعة</h3><p class="chips">' + (R.review.length ? R.review.map(function (x) { return '<span class="bad">' + esc(x) + '</span>'; }).join('') : '<span>لا توجد حالياً 👏</span>') + '</p>' +
        '<h3>حسب الدرس</h3><div class="tw"><table><tr><th>الدرس</th><th>محاولات</th><th>صحيحة</th><th>خاطئة</th><th>الإتقان</th></tr>' + R.lessons.map(row).join('') + '</table></div>' +
        '<h3>حسب نوع المهارة</h3><div class="tw"><table><tr><th>المهارة</th><th>محاولات</th><th>صحيحة</th><th>خاطئة</th><th>الإتقان</th></tr>' + R.skills.map(row).join('') + '</table></div>' +
        '<div class="btns"><button class="sbtn" data-a="expJSON">⬇ تصدير JSON</button><button class="sbtn" data-a="expCSV">⬇ تصدير CSV</button>' + back + '</div>';
    },
    settings: function (G, back) {
      var st = G.settings, tg = function (k, n) { return '<label class="tg"><input type="checkbox" data-k="' + k + '"' + (st[k] ? ' checked' : '') + '><span>' + n + '</span></label>'; };
      return '<h2>⚙️ الإعدادات</h2><div class="sets">' + tg('music', '🎵 الموسيقى') + tg('sfx', '🔊 المؤثرات الصوتية') + tg('voice', '🗣️ صوت ذرّة العربي' + (JG.Audio.hasArabicVoice() ? '' : ' (غير متوفر في هذا الجهاز)')) + tg('touch', '📱 إظهار أزرار اللمس دائماً') + tg('reflect', '✨ الانعكاسات على الأرضية') +
        '<label>الجودة الرسومية<div class="seg" id="sQ">' + [['auto', 'تلقائية'], ['high', 'عالية'], ['low', 'موفّرة']].map(function (q) { return '<button type="button" data-q="' + q[0] + '" class="' + (st.quality === q[0] ? 'on' : '') + '">' + q[1] + '</button>'; }).join('') + '</div></label>' +
        '<label>حساسية الكاميرا<input type="range" min="0.4" max="2" step="0.1" id="sSens" value="' + st.sens + '"></label></div>' + back;
    },
    admin: function (G, back) { return '<h2>🗂️ إدارة قاعدة الأسئلة</h2><div id="admin"></div>' + back; },
    map: function (G, back) { return '<h2>🗺️ خريطة المختبر</h2><div class="mapw"><canvas id="bigmap"></canvas></div><p class="lgd"><i style="background:#22c55e"></i> باب مفتوح <i style="background:#ef4444"></i> باب مغلق <i style="background:#fde047"></i> الهدف الحالي</p>' + back; },
    dead: function (G) { return '<div class="ttl"><h1>⚠️ نفدت طاقتك!</h1><p>لا بأس — العلماء يتعلّمون من كل تجربة. ستعود إلى مدخل المختبر بطاقة كاملة، وتخسر 10% من نقاط هذه الجولة.</p></div><div class="btns"><button class="sbtn big" data-a="respawn">↻ أعد المحاولة</button></div>'; },
    win: function (G) { var R = G.report(); return '<div class="ttl"><div class="logo win"><span>🏆</span></div><h1>انتصرت على الخيميائي المظلم!</h1><p>أعدتَ المختبر المركزي إلى العمل يا ' + esc(G.save.name || 'بطل الكيمياء') + '. أنهيت المغامرة بـ <b>' + G.save.score.toLocaleString('en') + '</b> نقطة، وأجبت عن <b>' + R.total + '</b> تحدياً (' + (R.total ? Math.round(R.ok / R.total * 100) : 0) + '% من أول محاولة) في زمن ' + R.time + '.</p></div><div class="btns"><button class="sbtn big" data-a="report">📊 التقرير التعليمي</button><button class="sbtn" data-a="ach">🏆 الإنجازات</button><button class="sbtn" data-a="freeplay">🧪 تابع الاستكشاف</button></div>'; }
  };
  U.SCmount = {
    title: function (s, G) { s.querySelectorAll('#pDiff [data-d]').forEach(function (b) { b.onclick = function () { G.settings.diff = +b.dataset.d; G.saveSettings(); s.querySelectorAll('#pDiff button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; }); },
    settings: function (s, G) {
      s.querySelectorAll('[data-k]').forEach(function (c) { c.onchange = function () { G.settings[c.dataset.k] = c.checked; G.applySettings(); }; });
      s.querySelectorAll('#sQ [data-q]').forEach(function (b) { b.onclick = function () { G.settings.quality = b.dataset.q; G.applySettings(); s.querySelectorAll('#sQ button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
      $('sSens').oninput = function () { G.settings.sens = +this.value; G.applySettings(); };
    },
    map: function (s, G) { var bm = $('bigmap'), mini = $('mini'); U.minimap(G, true); bm.width = mini.width; bm.height = mini.height; bm.style.width = mini.style.width; bm.getContext('2d').drawImage(mini, 0, 0); U.minimap(G, false); },
    admin: function (s, G) { JG.Admin.render($('admin')); }
  };
})();
