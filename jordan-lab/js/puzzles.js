/* ============================================================
   JG Puzzles — الكيمياء داخل ميكانيكيات اللعب
   كل تحدٍّ يؤثر في العالم: يفتح باباً، يمنح أداة، أو يكسر درع زعيم.
   الخطأ = نتيجة تعليمية واضحة + تلميح متدرّج من «ذرّة» (لا تُكشف الإجابة من أول خطأ)
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {};
  var Z = JG.Puz = {};
  var rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var shuf = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* عزل الصيغ والمعادلات اللاتينية داخل النص العربي */
  Z.fmt = function (s) {
    return esc(s).replace(/[A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻\[(°√Δ][A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻\[\]()°%.,=+\-×÷\/→⇌·:'^ √Δ]*[A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻\])°%]|[A-Za-z0-9₀-₉⁰-⁹¹²³]/g, function (m) {
      var eq = /[→⇌]/.test(m) && m.length > 8; return '<span class="ltr' + (eq ? ' eq' : '') + '">' + m + '</span>';
    });
  };
  Z.shuf = shuf; Z.rnd = rnd;

  /* ---------- 1) سؤال من قاعدة البيانات مع سلّم التلميحات ---------- */
  Z.mcq = function (G, o, cb) {
    var q = o.q || JG.DB.pick({ lessons: o.lessons, diff: JG.Atom.diffFor(o.lessons), avoid: G.session.asked });
    if (!q) { cb(true); return; } G.session.asked.push(q.id);
    var t0 = Date.now(), tries = 0, hints = 0, done = false, elim = -1, order = q.options.map(function (_, i) { return i; });
    order = shuf(order);
    JG.UI.modal({ title: o.title || 'محطة المعرفة', icon: o.icon || '🧪', render: function (el, close) {
      var paint = function (msg, cls) {
        el.innerHTML = '<div class="pz-meta"><span>' + esc(q.lesson || '') + '</span><span>' + esc(q.skill || '') + '</span>' + (o.stakes ? '<span class="st">' + esc(o.stakes) + '</span>' : '') + '</div>' +
          '<div class="pz-q">' + Z.fmt(q.question) + '</div><div class="pz-ops">' + order.map(function (i, k) {
            return '<button class="pz-op" data-i="' + i + '"' + (i === elim ? ' disabled data-x="1"' : '') + '><b>' + 'أبجد'[k] + '</b><span>' + Z.fmt(q.options[i]) + '</span></button>'; }).join('') + '</div>' +
          '<div class="pz-foot"><button class="pz-hint" id="pzHint">💡 تلميح من ذرّة (' + (2 - hints) + ')</button><span class="pz-msg ' + (cls || '') + '">' + (msg || '') + '</span></div>';
        el.querySelector('#pzHint').disabled = hints >= 2 || done;
        el.querySelector('#pzHint').onclick = function () {
          hints++; JG.Audio.play('atom');
          if (hints === 1) { JG.Atom.say(JG.Atom.hint1(q), 'hint'); paint('ذرّة: ' + JG.Atom.hint1(q), 'h'); }
          else { var wrong = order.filter(function (i) { return i !== q.answer && i !== elim; }); elim = wrong[0]; JG.Atom.say('استبعدتُ لك خياراً خاطئاً. فكّر في الباقي.', 'hint'); paint('ذرّة: استبعدتُ خياراً خاطئاً — فكّر بالسبب.', 'h'); }
        };
        [].forEach.call(el.querySelectorAll('.pz-op'), function (b) {
          b.onclick = function () {
            if (done) return; var i = +b.dataset.i; tries++;
            if (i === q.answer) { done = true; b.classList.add('ok'); JG.Audio.play('ok');
              G.log({ kind: 'mcq', qid: q.id, lesson: q.lessonId || q.lesson, skill: q.skill, ok: tries === 1, tries: tries, hints: hints, ms: Date.now() - t0, zone: G.zoneNow() });
              JG.Atom.result(q.lessonId, tries === 1);
              el.querySelector('.pz-foot').innerHTML = '<div class="pz-exp ok">✔ ' + (tries === 1 ? 'إجابة صحيحة!' : 'صحيح في المحاولة الثانية.') + (q.explanation ? '<br>' + Z.fmt(q.explanation) : '') + '</div><button class="pz-go" id="pzGo">' + (o.okText || 'متابعة ←') + '</button>';
              el.querySelector('#pzGo').onclick = function () { close(); cb(true, { tries: tries, hints: hints }); };
            } else {
              b.classList.add('bad'); b.disabled = true; JG.Audio.play('bad'); if (o.onWrong) o.onWrong(tries);
              if (tries === 1) { var h = JG.Atom.hint1(q); JG.Atom.say('ليس تماماً. ' + h, 'wrong'); var m = el.querySelector('.pz-msg'); m.className = 'pz-msg bad'; m.innerHTML = '✖ ' + esc(o.wrongWorld || 'ليست الإجابة الصحيحة.') + ' ذرّة: ' + Z.fmt(h) + ' — حاول مرة أخرى.'; }
              else { done = true; G.log({ kind: 'mcq', qid: q.id, lesson: q.lessonId || q.lesson, skill: q.skill, ok: false, tries: tries, hints: hints, ms: Date.now() - t0, zone: G.zoneNow() }); JG.Atom.result(q.lessonId, false);
                [].forEach.call(el.querySelectorAll('.pz-op'), function (x) { if (+x.dataset.i === q.answer) x.classList.add('ok'); });
                el.querySelector('.pz-foot').innerHTML = '<div class="pz-exp bad">التفسير العلمي: ' + (q.explanation ? Z.fmt(q.explanation) : 'الإجابة الصحيحة مظللة بالأخضر.') + '</div><button class="pz-go" id="pzGo">' + (o.retry === false ? 'متابعة' : 'جرّب سؤالاً آخر ↻') + '</button>';
                el.querySelector('#pzGo').onclick = function () { close(); if (o.retry === false) cb(false); else Z.mcq(G, { lessons: o.lessons, title: o.title, icon: o.icon, stakes: o.stakes, okText: o.okText, wrongWorld: o.wrongWorld, onWrong: o.onWrong }, cb); };
              }
            }
            JG.UI.fitEq(el);
          };
        });
        JG.UI.fitEq(el);
      };
      paint();
    } });
  };

  /* ---------- 2) باب الدليل: حدّد طبيعة المحلول بالكاشف ---------- */
  var IND = {
    php: { n: 'الفينولفثالين', col: '#f9a8d4', f: function (pH) { return pH >= 8.2 ? ['وردي', '#ec4899'] : ['عديم اللون', '#e2e8f0']; } },
    mo: { n: 'الميثيل البرتقالي', col: '#fb923c', f: function (pH) { return pH < 3.1 ? ['أحمر', '#ef4444'] : (pH > 4.4 ? ['أصفر', '#facc15'] : ['برتقالي', '#fb923c']); } },
    lit: { n: 'ورق تباع الشمس', col: '#a78bfa', f: function (pH) { return pH < 6.5 ? ['أحمر', '#ef4444'] : (pH > 7.5 ? ['أزرق', '#3b82f6'] : ['بنفسجي (لا تغيّر)', '#a78bfa']); } }
  };
  var SOLS = [
    { f: 'HCl', n: 'حمض الهيدروكلوريك', pH: 1, nat: 'حمضي', why: 'HCl حمض قوي يتأين كلياً فيزيد [H₃O⁺].' },
    { f: 'HNO₃', n: 'حمض النيتريك', pH: 1.5, nat: 'حمضي', why: 'HNO₃ حمض قوي.' },
    { f: 'CH₃COOH', n: 'حمض الإيثانويك', pH: 3, nat: 'حمضي', why: 'CH₃COOH حمض ضعيف لكنه يبقى حمضياً (pH < 7).' },
    { f: 'NaOH', n: 'هيدروكسيد الصوديوم', pH: 13, nat: 'قاعدي', why: 'NaOH قاعدة قوية تزيد [OH⁻].' },
    { f: 'KOH', n: 'هيدروكسيد البوتاسيوم', pH: 13, nat: 'قاعدي', why: 'KOH قاعدة قوية.' },
    { f: 'NH₃', n: 'الأمونيا', pH: 11, nat: 'قاعدي', why: 'NH₃ قاعدة ضعيفة تستقبل بروتوناً من الماء فينتج OH⁻.' },
    { f: 'NaCl', n: 'كلوريد الصوديوم', pH: 7, nat: 'متعادل', why: 'NaCl ملح من حمض قوي وقاعدة قوية: أيوناته لا تتميه.' },
    { f: 'KNO₃', n: 'نترات البوتاسيوم', pH: 7, nat: 'متعادل', why: 'KNO₃ ملح من حمض قوي وقاعدة قوية.' },
    { f: 'NH₄Cl', n: 'كلوريد الأمونيوم', pH: 5, nat: 'حمضي', why: 'NH₄⁺ (الحمض المرافق لقاعدة ضعيفة) يتميه وينتج H₃O⁺.' },
    { f: 'CH₃COONa', n: 'إيثانوات الصوديوم', pH: 9, nat: 'قاعدي', why: 'CH₃COO⁻ (القاعدة المرافقة لحمض ضعيف) يتميه وينتج OH⁻.' },
    { f: 'NaF', n: 'فلوريد الصوديوم', pH: 8.5, nat: 'قاعدي', why: 'F⁻ قاعدة مرافقة لحمض ضعيف HF فيتميه وينتج OH⁻.' },
    { f: 'KCN', n: 'سيانيد البوتاسيوم', pH: 11, nat: 'قاعدي', why: 'CN⁻ قاعدة مرافقة لحمض ضعيف جداً HCN.' }
  ];
  Z.IND = IND; Z.SOLS = SOLS;
  Z.indicatorDoor = function (G, door, cb) {
    var s = door.sol || (door.sol = rnd(SOLS)), ind = G.player.carry && G.player.carry.ind, tested = door.tested || (door.tested = {});
    if (ind) { tested[ind] = IND[ind].f(s.pH); }
    JG.UI.modal({ title: 'باب الدليل — حدّد طبيعة المحلول', icon: '🚪', render: function (el, close) {
      var keys = Object.keys(tested);
      el.innerHTML = '<p class="pz-lead">خزان الباب يحوي محلولاً مجهولاً (<span class="ltr">X</span>). أضف كواشف من رف الأدلة في الردهة، ثم حدّد طبيعة المحلول ليُفتح الباب.</p>' +
        '<div class="pz-flex"><div class="pz-tank"><div class="liq" style="background:' + (ind ? tested[ind][1] : '#e2e8f0') + '"></div><b class="ltr">X</b></div><div class="pz-tests">' +
        (keys.length ? keys.map(function (k) { return '<div class="pz-test"><i style="background:' + tested[k][1] + '"></i>' + IND[k].n + ': <b>' + tested[k][0] + '</b></div>'; }).join('') : '<div class="pz-test">لم تختبر بأي كاشف بعد. احمل قارورة كاشف (اضغط E عند الرف) ثم عُد إلى الباب.</div>') + '</div></div>' +
        '<div class="pz-ops3">' + ['حمضي', 'قاعدي', 'متعادل'].map(function (n) { return '<button class="pz-op big" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div><div class="pz-msg" id="pzm"></div>';
      if (ind) { JG.Audio.play('pour'); G.player.carry = null; }
      [].forEach.call(el.querySelectorAll('[data-n]'), function (b) { b.onclick = function () {
        if (!keys.length) { el.querySelector('#pzm').textContent = 'اختبر المحلول بكاشف واحد على الأقل قبل الحكم.'; return; }
        var ok = b.dataset.n === s.nat; door.tries = (door.tries || 0) + 1;
        G.log({ kind: 'indicator', lesson: 'u4l4', skill: 'تفسير نتائج التجارب', ok: ok, tries: door.tries, hints: 0, ms: 0, zone: 1 });
        if (ok) { JG.Audio.play('ok'); el.innerHTML = '<div class="pz-exp ok">✔ صحيح! المحلول هو <b>' + s.n + '</b> (<span class="ltr">' + s.f + '</span>) وطبيعته ' + s.nat + '.<br>' + Z.fmt(s.why) + '</div><button class="pz-go" id="pzGo">افتح الباب ←</button>'; el.querySelector('#pzGo').onclick = function () { close(); cb(true); }; }
        else { JG.Audio.play('bad'); G.player.hurt(6, door.x, door.z, JG.Audio);
          var amb = keys.length === 1 && keys[0] === 'php' && tested.php[0] === 'عديم اللون';
          var tip = amb ? 'الفينولفثالين يبقى عديم اللون في الوسط الحمضي والمتعادل معاً! استخدم كاشفاً آخر للتمييز.' : 'تذكّر مدى تغيّر لون كل كاشف: الميثيل البرتقالي أحمر في الحمض القوي، وتباع الشمس أحمر في الحمض وأزرق في القاعدة.';
          JG.Atom.say(tip, 'wrong'); el.querySelector('#pzm').innerHTML = '<span class="bad">⚡ شرارة من قفل الباب! الحكم غير صحيح.</span> ذرّة: ' + tip;
          if (door.tries >= 3) { door.sol = rnd(SOLS); door.tested = {}; door.tries = 0; el.querySelector('#pzm').innerHTML += '<br>تم تبديل المحلول بآخر جديد. أعد الاختبار.'; setTimeout(function () { close(); }, 2600); } }
      }; });
    } });
  };

  /* ---------- 3) فرز الأملاح حسب طبيعة محاليلها ---------- */
  Z.saltSort = function (G, cb) {
    var salts = shuf(SOLS.filter(function (s) { return /Cl|NO₃|COONa|F|CN/.test(s.f) && !/^H/.test(s.f); })).slice(0, 3), ans = {};
    if (!salts.some(function (s) { return s.nat === 'حمضي'; })) salts[0] = SOLS.find(function (s) { return s.f === 'NH₄Cl'; });
    JG.UI.modal({ title: 'خزانة الأملاح — صنّف المحاليل', icon: '🧂', render: function (el, close) {
      var t0 = Date.now(), tries = 0;
      var paint = function (msg) {
        el.innerHTML = '<p class="pz-lead">ضع كل ملح على الرف المناسب حسب طبيعة محلوله المائي. الأملاح الصحيحة تفتح قفل الرفوف وتشحن جهاز المعادلة.</p>' + salts.map(function (s, i) {
          return '<div class="pz-row"><b class="ltr">' + s.f + '</b><span>' + s.n + '</span><div class="pz-seg">' + ['حمضي', 'قاعدي', 'متعادل'].map(function (n) { return '<button data-i="' + i + '" data-n="' + n + '" class="' + (ans[i] === n ? 'on' : '') + '">' + n + '</button>'; }).join('') + '</div></div>'; }).join('') +
          '<button class="pz-go" id="pzChk">تحقّق</button><div class="pz-msg">' + (msg || '') + '</div>';
        [].forEach.call(el.querySelectorAll('[data-n]'), function (b) { b.onclick = function () { ans[+b.dataset.i] = b.dataset.n; JG.Audio.play('ui'); paint(); }; });
        el.querySelector('#pzChk').onclick = function () {
          if (Object.keys(ans).length < salts.length) { paint('صنّف الأملاح الثلاثة أولاً.'); return; } tries++;
          var wrong = salts.filter(function (s, i) { return ans[i] !== s.nat; });
          G.log({ kind: 'salts', lesson: 'u4l4', skill: 'تطبيق', ok: !wrong.length && tries === 1, tries: tries, hints: 0, ms: Date.now() - t0, zone: 1 });
          if (!wrong.length) { JG.Audio.play('ok'); el.innerHTML = '<div class="pz-exp ok">✔ تصنيف صحيح!<br>' + salts.map(function (s) { return Z.fmt(s.f + ': ' + s.why); }).join('<br>') + '</div><button class="pz-go" id="pzGo">متابعة ←</button>'; el.querySelector('#pzGo').onclick = function () { close(); cb(true); }; }
          else { JG.Audio.play('bad'); var h = tries === 1 ? 'اسأل نفسك عن كل أيون: هل هو حمض مرافق لقاعدة ضعيفة (مثل NH₄⁺) أم قاعدة مرافقة لحمض ضعيف (مثل CH₃COO⁻ وF⁻)؟ أيونات الحموض والقواعد القوية لا تتميه.' : 'التفسير: ' + wrong.map(function (s) { return s.f + ' ' + s.nat + ' لأن ' + s.why; }).join(' ');
            JG.Atom.say(h, 'wrong'); wrong.forEach(function (s) { delete ans[salts.indexOf(s)]; }); paint('<span class="bad">✖ ' + wrong.length + ' تصنيف غير صحيح (أُعيد للاختيار).</span> ذرّة: ' + Z.fmt(h)); }
        };
      };
      paint();
    } });
  };

  /* ---------- 4) منحنى الطاقة التفاعلي: انقر السهم الصحيح ---------- */
  Z.energyGraph = function (G, cb) {
    var Er = rnd([40, 60, 80]), Ep = rnd([10, 20, 100, 120]), Ea = rnd([150, 180, 200]), Hc = Er + Ea; // ارتفاع المعقد المنشط
    var dH = Ep - Er, qs = shuf([
      { k: 'a', q: 'انقر السهم الذي يمثّل طاقة التنشيط للتفاعل الأمامي', why: 'طاقة التنشيط الأمامية = طاقة المعقد المنشّط − طاقة المتفاعلات.' },
      { k: 'b', q: 'انقر السهم الذي يمثّل التغير في المحتوى الحراري ΔH', why: 'ΔH = طاقة النواتج − طاقة المتفاعلات.' },
      { k: 'c', q: 'انقر السهم الذي يمثّل طاقة التنشيط للتفاعل العكسي', why: 'طاقة التنشيط العكسية = طاقة المعقد المنشّط − طاقة النواتج.' }]).slice(0, 2);
    var step = 0, t0 = Date.now(), err = 0;
    JG.UI.modal({ title: 'شاشة منحنى الطاقة', icon: '📈', render: function (el, close) {
      var svg = function (hl) {
        var X = function (v) { return v; }, Y = function (e) { return 250 - e * 1.0; }, yr = Y(Er), yp = Y(Ep), yh = Y(Hc);
        var path = 'M30 ' + yr + ' L110 ' + yr + ' C170 ' + yr + ' 170 ' + yh + ' 200 ' + yh + ' C230 ' + yh + ' 230 ' + yp + ' 290 ' + yp + ' L370 ' + yp;
        var arr = function (k, x, y1, y2, c) { return '<g class="arw" data-k="' + k + '" style="cursor:pointer"><line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="5" marker-end="url(#ah)"/><rect x="' + (x - 16) + '" y="' + Math.min(y1, y2) + '" width="32" height="' + Math.abs(y2 - y1) + '" fill="transparent"/><circle cx="' + (x + 18) + '" cy="' + ((y1 + y2) / 2) + '" r="13" fill="' + c + '"/><text x="' + (x + 18) + '" y="' + ((y1 + y2) / 2 + 5) + '" fill="#fff" font-size="15" font-weight="800" text-anchor="middle">' + k.toUpperCase() + '</text></g>'; };
        return '<svg viewBox="0 0 400 270" width="100%" style="max-width:520px;direction:ltr"><defs><marker id="ah" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="7" refY="7" orient="auto"><path d="M0,0 L14,7 L0,14 z" fill="#e2e8f0"/></marker></defs>' +
          '<path d="M30 10 L30 255 L390 255" stroke="#94a3b8" fill="none" stroke-width="2"/><text x="10" y="18" fill="#cbd5e1" font-size="12">E (kJ)</text><text x="300" y="268" fill="#cbd5e1" font-size="12">سير التفاعل</text>' +
          '<path d="' + path + '" stroke="#fb923c" stroke-width="4" fill="none"/><line x1="110" y1="' + yr + '" x2="380" y2="' + yr + '" stroke="#64748b" stroke-dasharray="4 4"/><line x1="200" y1="' + yh + '" x2="330" y2="' + yh + '" stroke="#64748b" stroke-dasharray="4 4"/>' +
          arr('a', 150, yr, yh + 4, '#22c55e') + arr('b', 320, yr, yp + (yp > yr ? -4 : 4), '#3b82f6') + arr('c', 250, yp, yh + 4, '#a855f7') +
          '<text x="40" y="' + (yr - 8) + '" fill="#e2e8f0" font-size="12">' + Er + '</text><text x="335" y="' + (yp - 8) + '" fill="#e2e8f0" font-size="12">' + Ep + '</text><text x="170" y="' + (yh - 8) + '" fill="#e2e8f0" font-size="12">' + Hc + '</text></svg>';
      };
      var paint = function (msg) {
        if (step >= qs.length) { G.log({ kind: 'energy', lesson: 'u5l3', skill: 'تحليل', ok: err === 0, tries: err + 1, hints: 0, ms: Date.now() - t0, zone: 2 });
          el.innerHTML = '<div class="pz-exp ok">✔ قراءة صحيحة للمنحنى! هذا التفاعل ' + (dH < 0 ? 'طارد للحرارة (ΔH = ' + dH + ' kJ)' : 'ماص للحرارة (ΔH = +' + dH + ' kJ)') + '، وطاقة التنشيط الأمامية = ' + Ea + ' kJ.</div><button class="pz-go" id="pzGo">متابعة ←</button>';
          el.querySelector('#pzGo').onclick = function () { close(); cb(err === 0); }; return; }
        el.innerHTML = '<p class="pz-lead"><b>' + Z.fmt(qs[step].q) + '</b> (' + (step + 1) + '/' + qs.length + ')</p><div class="pz-svg">' + svg() + '</div><div class="pz-msg">' + (msg || '') + '</div>';
        [].forEach.call(el.querySelectorAll('.arw'), function (g) { g.onclick = function () {
          if (g.dataset.k === qs[step].k) { JG.Audio.play('ok'); step++; paint('<span class="ok">✔ ' + Z.fmt(qs[step - 1].why) + '</span>'); }
          else { err++; JG.Audio.play('bad'); var h = err === 1 ? 'تتبّع بداية السهم ونهايته: من أي مستوى طاقة يبدأ، وإلى أين ينتهي؟' : qs[step].why; JG.Atom.say(h, 'wrong'); paint('<span class="bad">✖ ليس هذا السهم.</span> ذرّة: ' + Z.fmt(h)); }
        }; });
      };
      paint();
    } });
  };

  /* ---------- 5) بوابة لوشاتلييه: أزِح الاتزان بالاتجاه المطلوب ---------- */
  var RX = [
    { eq: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)', dH: -92, ng: [4, 2], R: 'N₂', P: 'NH₃', pn: 'الأمونيا' },
    { eq: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)', dH: -198, ng: [3, 2], R: 'O₂', P: 'SO₃', pn: 'ثالث أكسيد الكبريت' },
    { eq: 'N₂O₄(g) ⇌ 2NO₂(g)', dH: 58, ng: [1, 2], R: 'N₂O₄', P: 'NO₂', pn: 'ثاني أكسيد النيتروجين' },
    { eq: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)', dH: 88, ng: [1, 2], R: 'PCl₅', P: 'Cl₂', pn: 'الكلور' },
    { eq: 'CO(g) + 2H₂(g) ⇌ CH₃OH(g)', dH: -91, ng: [3, 1], R: 'CO', P: 'CH₃OH', pn: 'الميثانول' }
  ];
  Z.RX = RX;
  function shiftOf(rx, s) { // +1 أمامي، -1 عكسي، 0 لا إزاحة
    switch (s) { case 'addR': return 1; case 'remP': return 1; case 'addP': return -1; case 'remR': return -1;
      case 'hot': return rx.dH > 0 ? 1 : -1; case 'cold': return rx.dH > 0 ? -1 : 1;
      case 'pUp': return rx.ng[0] === rx.ng[1] ? 0 : (rx.ng[1] < rx.ng[0] ? 1 : -1); case 'pDn': return rx.ng[0] === rx.ng[1] ? 0 : (rx.ng[1] < rx.ng[0] ? -1 : 1); case 'cat': return 0; }
  }
  Z.shiftOf = shiftOf;
  Z.leChatelier = function (G, cb) {
    var rx = rnd(RX), level = 0, need = 2, t0 = Date.now(), err = 0;
    var S = [['addR', 'إضافة ' + rx.R], ['remP', 'سحب ' + rx.P + ' أولاً بأول'], ['addP', 'إضافة ' + rx.P], ['hot', 'رفع درجة الحرارة'], ['cold', 'خفض درجة الحرارة'], ['pUp', 'زيادة الضغط (تقليل الحجم)'], ['pDn', 'خفض الضغط (زيادة الحجم)'], ['cat', 'إضافة عامل مساعد']];
    var used = {};
    JG.UI.modal({ title: 'بوابة الاتزان — مبدأ لوتشاتلييه', icon: '⚖️', render: function (el, close) {
      var paint = function (msg) {
        var fr = Math.max(0, Math.min(1, .35 + level * .3));
        el.innerHTML = '<p class="pz-lead">تفتح البوابة عندما يمتلئ خزان النواتج. أزِح موضع الاتزان نحو تكوين <b>' + rx.pn + '</b> بتطبيق مؤثرين صحيحين.</p><div class="pz-eq"><span class="ltr eq">' + rx.eq + '</span><small>ΔH = ' + (rx.dH > 0 ? '+' : '') + rx.dH + ' kJ</small></div>' +
          '<div class="pz-flex"><div class="pz-tank sm"><div class="liq" style="height:' + ((1 - fr) * 100) + '%;background:#22d3ee"></div><b>المتفاعلات</b></div><div class="pz-tank sm"><div class="liq" style="height:' + (fr * 100) + '%;background:#f472b6"></div><b>النواتج</b></div><div class="pz-prog"><span class="ltr">' + level + ' / ' + need + '</span></div></div>' +
          '<div class="pz-grid">' + S.map(function (s) { return '<button class="pz-op" data-s="' + s[0] + '"' + (used[s[0]] ? ' disabled' : '') + '>' + Z.fmt(s[1]) + '</button>'; }).join('') + '</div><div class="pz-msg">' + (msg || '') + '</div>';
        [].forEach.call(el.querySelectorAll('[data-s]'), function (b) { b.onclick = function () {
          var k = b.dataset.s, d = shiftOf(rx, k); used[k] = 1;
          if (d > 0) { level++; JG.Audio.play('ok'); JG.Audio.play('bubble');
            var why = { addR: 'زيادة تركيز مادة متفاعلة', remP: 'سحب الناتج يقلل تركيزه', hot: 'التفاعل الأمامي ماص للحرارة', cold: 'التفاعل الأمامي طارد للحرارة', pUp: 'الإزاحة نحو عدد مولات غازية أقل', pDn: 'الإزاحة نحو عدد مولات غازية أكثر' }[k];
            if (level >= need) { G.log({ kind: 'lechatelier', lesson: 'u3l1', skill: 'تطبيق', ok: err === 0, tries: err + 1, hints: 0, ms: Date.now() - t0, zone: 3 });
              el.innerHTML = '<div class="pz-exp ok">✔ امتلأ خزان النواتج وانفتحت البوابة! (' + Z.fmt(why) + ')</div><button class="pz-go" id="pzGo">متابعة ←</button>'; el.querySelector('#pzGo').onclick = function () { close(); cb(err === 0); }; return; }
            paint('<span class="ok">✔ إزاحة نحو النواتج: ' + Z.fmt(why) + '.</span>');
          } else { err++; JG.Audio.play('bad'); level = Math.max(0, level - (d < 0 ? 1 : 0));
            var h = d === 0 ? (k === 'cat' ? 'العامل المساعد يسرّع الوصول إلى الاتزان ولا يغيّر موضعه.' : 'عدد مولات الغاز متساوٍ في الطرفين، فالضغط لا يزيح الاتزان.') :
              'هذا المؤثر أزاح الاتزان نحو المتفاعلات. ' + (k === 'hot' || k === 'cold' ? 'انظر إلى إشارة ΔH: هل التفاعل الأمامي ماص أم طارد؟' : (k === 'pUp' || k === 'pDn' ? 'قارن عدد مولات الغاز في الطرفين.' : 'إضافة ناتج تدفع التفاعل للخلف.'));
            JG.Atom.say(h, 'wrong'); paint('<span class="bad">✖ انخفض مستوى خزان النواتج.</span> ذرّة: ' + Z.fmt(h)); }
        }; });
        JG.UI.fitEq(el);
      };
      paint();
    } });
  };

  /* ---------- 6) حاسبة ثابت الاتزان Kc ---------- */
  Z.kcCalc = function (G, cb) {
    var cases = [
      function () { var a = rnd([.1, .2, .4]), b = rnd([.1, .2, .5]), c = rnd([.2, .4, .6, .8]); return { eq: 'H₂(g) + I₂(g) ⇌ 2HI(g)', d: [['H₂', a], ['I₂', b], ['HI', c]], k: c * c / (a * b), w: [c / (a * b), c * c / (a + b), (a * b) / (c * c)] }; },
      function () { var a = rnd([.2, .4, .5]), b = rnd([.1, .2]), c = rnd([.1, .2, .3]); return { eq: 'N₂O₄(g) ⇌ 2NO₂(g)', d: [['N₂O₄', a], ['NO₂', c]], k: c * c / a, w: [c / a, a / (c * c), 2 * c / a] }; },
      function () { var a = rnd([.2, .5, 1]), b = rnd([.1, .2, .4]), c = rnd([.2, .4]); return { eq: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)', d: [['PCl₅', a], ['PCl₃', b], ['Cl₂', c]], k: b * c / a, w: [a / (b * c), (b + c) / a, b * c * a] }; }
    ];
    var C0 = rnd(cases)(), f = function (v) { return (Math.round(v * 1000) / 1000).toString(); }, uniq = [f(C0.k)];
    C0.w.concat([C0.k * 2, C0.k / 2, C0.k * 10, C0.k / 10, C0.k * 4]).forEach(function (v) { var s = f(v); if (uniq.length < 4 && uniq.indexOf(s) < 0 && +s > 0) uniq.push(s); });
    var opts = shuf(uniq), ans = opts.indexOf(f(C0.k));
    var q = { id: 'gen-kc-' + Date.now(), lessonId: 'u3l2', lesson: 'تعبيرات ثابت الاتزان', skill: 'حل مسائل حسابية', difficulty: 2,
      question: 'في وعاء مغلق وصل التفاعل ' + C0.eq + ' إلى الاتزان، وكانت التراكيز: ' + C0.d.map(function (x) { return '[' + x[0] + '] = ' + x[1] + ' M'; }).join(' ، ') + '. قيمة Kc تساوي:',
      options: opts, answer: ans, explanation: 'Kc = تراكيز النواتج مرفوعة لمعاملاتها ÷ تراكيز المتفاعلات مرفوعة لمعاملاتها = ' + f(C0.k) + '.' };
    Z.mcq(G, { q: q, title: 'حاسبة ثابت الاتزان', icon: '🧮' }, cb);
  };

  /* ---------- 7) آلة الجزيئات: الذرات المجموعة + اختيار البنية ---------- */
  var MOL = [
    { n: 'الإيثانول', f: 'C₂H₆O', need: { C: 2, H: 6, O: 1 }, ok: 'CH₃CH₂OH', bad: ['CH₃OCH₃', 'CH₃CHO'], why: 'الإيثانول كحول: مجموعته الوظيفية OH متصلة بذرة كربون. أما CH₃OCH₃ فإيثر له الصيغة الجزيئية نفسها.' },
    { n: 'ميثوكسي ميثان (إيثر)', f: 'C₂H₆O', need: { C: 2, H: 6, O: 1 }, ok: 'CH₃OCH₃', bad: ['CH₃CH₂OH', 'HCOOCH₃'], why: 'الإيثر فيه ذرة أكسجين بين مجموعتي ألكيل (R–O–R).' },
    { n: 'الإيثانال', f: 'C₂H₄O', need: { C: 2, H: 4, O: 1 }, ok: 'CH₃CHO', bad: ['CH₃COCH₃', 'CH₂=CHOH'], why: 'الألدهيد مجموعته الوظيفية CHO في نهاية السلسلة.' },
    { n: 'البروبانون', f: 'C₃H₆O', need: { C: 3, H: 6, O: 1 }, ok: 'CH₃COCH₃', bad: ['CH₃CH₂CHO', 'CH₃CH₂CH₂OH'], why: 'الكيتون مجموعة الكربونيل C=O فيه بين ذرتي كربون.' },
    { n: 'حمض الإيثانويك', f: 'C₂H₄O₂', need: { C: 2, H: 4, O: 2 }, ok: 'CH₃COOH', bad: ['HCOOCH₃', 'CH₃CH₂OH'], why: 'الحمض الكربوكسيلي مجموعته الوظيفية COOH.' },
    { n: 'الإيثين', f: 'C₂H₄', need: { C: 2, H: 4 }, ok: 'CH₂=CH₂', bad: ['CH₃–CH₃', 'HC≡CH'], why: 'الألكين فيه رابطة ثنائية C=C.' }
  ];
  Z.MOL = MOL;
  Z.moleculeMachine = function (G, mol, cb) {
    var inv = G.inv || {}, need = mol.need, enough = Object.keys(need).every(function (k) { return (inv[k] || 0) === need[k]; }) && Object.keys(inv).every(function (k) { return !inv[k] || need[k]; });
    JG.UI.modal({ title: 'آلة الجزيئات — إصلاح المفاعل', icon: '🧬', render: function (el, close) {
      var cnt = function (k) { return '<span class="pz-atom a' + k + '">' + k + ' <b>' + (inv[k] || 0) + '/' + (need[k] || 0) + '</b></span>'; };
      if (!enough) {
        el.innerHTML = '<p class="pz-lead">المطلوب: جزيء <b>' + mol.n + '</b> بالصيغة الجزيئية <span class="ltr">' + mol.f + '</span>. اجمع العدد المطلوب تماماً من الذرات المنتشرة في المختبر.</p><div class="pz-atoms">' + ['C', 'H', 'O'].map(cnt).join('') + '</div>' +
          '<p class="pz-msg">' + (Object.keys(inv).some(function (k) { return (inv[k] || 0) > (need[k] || 0); }) ? '<span class="bad">لديك ذرات زائدة! أفرغ المخزن وأعد الجمع.</span>' : 'عُد إلى الآلة عند اكتمال العدد.') + '</p><button class="pz-go" id="pzDump">إفراغ مخزن الذرات</button> <button class="pz-go ghost" id="pzX">متابعة الجمع</button>';
        el.querySelector('#pzDump').onclick = function () { G.inv = {}; G.respawnAtoms(); close(); }; el.querySelector('#pzX').onclick = close; return;
      }
      var ops = shuf([mol.ok].concat(mol.bad)), t0 = Date.now(), tries = 0;
      var paint = function (msg) {
        el.innerHTML = '<p class="pz-lead">اكتملت الذرات (<span class="ltr">' + mol.f + '</span>). اختر البنية الصحيحة لجزيء <b>' + mol.n + '</b> لتجميعه في الآلة:</p><div class="pz-grid">' + ops.map(function (o) { return '<button class="pz-op big" data-o="' + o + '"><span class="ltr">' + o + '</span></button>'; }).join('') + '</div><div class="pz-msg">' + (msg || '') + '</div>';
        [].forEach.call(el.querySelectorAll('[data-o]'), function (b) { b.onclick = function () { tries++;
          if (b.dataset.o === mol.ok) { JG.Audio.play('ok'); JG.Audio.play('machine'); G.inv = {}; G.log({ kind: 'molecule', lesson: 'u7l1', skill: 'تطبيق', ok: tries === 1, tries: tries, hints: 0, ms: Date.now() - t0, zone: 4 });
            el.innerHTML = '<div class="pz-exp ok">✔ تم تجميع ' + mol.n + ' وإصلاح الآلة!<br>' + Z.fmt(mol.why) + '</div><button class="pz-go" id="pzGo">متابعة ←</button>'; el.querySelector('#pzGo').onclick = function () { close(); cb(true); }; }
          else { JG.Audio.play('bad'); b.disabled = true; var h = tries === 1 ? 'الذرات نفسها قد تكوّن مركبات مختلفة (متصاوغات). ابحث عن المجموعة الوظيفية التي يدل عليها اسم المركب.' : mol.why; JG.Atom.say(h, 'wrong'); G.player.hurt(4, null, null, JG.Audio); paint('<span class="bad">✖ الآلة رفضت البنية وأطلقت دخاناً.</span> ذرّة: ' + Z.fmt(h)); } }; });
      };
      paint();
    } });
  };

  /* ---------- 8) باني الخلية الجلفانية ---------- */
  var EO = { Mg: -2.37, Al: -1.66, Zn: -0.76, Fe: -0.44, Ni: -0.23, Pb: -0.13, Cu: 0.34, Ag: 0.80 };
  Z.EO = EO;
  Z.galvanic = function (G, cb) {
    var metals = shuf(Object.keys(EO)).slice(0, 4), target = 0, best = 0;
    metals.forEach(function (a) { metals.forEach(function (b) { best = Math.max(best, EO[b] - EO[a]); }); });
    target = Math.floor((best - .05) * 10) / 10; if (target < .4) target = .4; var sel = { an: null, ca: null }, t0 = Date.now(), tries = 0;
    JG.UI.modal({ title: 'باني الخلية الجلفانية — شغّل البوابة', icon: '🔋', render: function (el, close) {
      var paint = function (msg) {
        var E = sel.an && sel.ca ? (EO[sel.ca] - EO[sel.an]) : null;
        el.innerHTML = '<p class="pz-lead">البوابة تحتاج جهداً معيارياً لا يقل عن <b class="ltr">' + target.toFixed(1) + ' V</b>. اختر قطب المصعد (يحدث عنده التأكسد) وقطب المهبط (يحدث عنده الاختزال).</p>' +
          '<div class="pz-tbl"><table><tr><th>نصف التفاعل</th><th>E° (V)</th></tr>' + metals.slice().sort(function (a, b) { return EO[a] - EO[b]; }).map(function (m) { return '<tr><td><span class="ltr">' + m + (m === 'Ag' ? '⁺' : (m === 'Al' ? '³⁺' : '²⁺')) + ' + ' + (m === 'Ag' ? '' : (m === 'Al' ? '3' : '2')) + 'e⁻ → ' + m + '</span></td><td><span class="ltr">' + EO[m].toFixed(2) + '</span></td></tr>'; }).join('') + '</table></div>' +
          '<div class="pz-cell"><div><b>المصعد (−)</b><div class="pz-seg">' + metals.map(function (m) { return '<button data-r="an" data-m="' + m + '" class="' + (sel.an === m ? 'on' : '') + '">' + m + '</button>'; }).join('') + '</div></div>' +
          '<div class="pz-volt">' + (E === null ? '<span class="ltr">— V</span>' : '<span class="ltr">' + E.toFixed(2) + ' V</span>') + '</div>' +
          '<div><b>المهبط (+)</b><div class="pz-seg">' + metals.map(function (m) { return '<button data-r="ca" data-m="' + m + '" class="' + (sel.ca === m ? 'on' : '') + '">' + m + '</button>'; }).join('') + '</div></div></div>' +
          '<button class="pz-go" id="pzOn">⚡ شغّل الخلية</button><div class="pz-msg">' + (msg || '') + '</div>';
        [].forEach.call(el.querySelectorAll('[data-r]'), function (b) { b.onclick = function () { sel[b.dataset.r] = b.dataset.m; JG.Audio.play('ui'); paint(); }; });
        el.querySelector('#pzOn').onclick = function () {
          if (!sel.an || !sel.ca || sel.an === sel.ca) { paint('اختر فلزين مختلفين.'); return; } tries++;
          var E = EO[sel.ca] - EO[sel.an];
          if (E >= target - 1e-9) { JG.Audio.play('zap'); JG.Audio.play('ok'); G.log({ kind: 'galvanic', lesson: 'u6l2', skill: 'حل مسائل حسابية', ok: tries === 1, tries: tries, hints: 0, ms: Date.now() - t0, zone: 5 });
            el.innerHTML = '<div class="pz-exp ok">✔ الخلية تعمل! <span class="ltr">E°cell = E°(' + sel.ca + ') − E°(' + sel.an + ') = ' + E.toFixed(2) + ' V</span><br>يتأكسد ' + sel.an + ' عند المصعد، وتتحرك الإلكترونات في الدارة الخارجية من المصعد إلى المهبط.</div><button class="pz-go" id="pzGo">متابعة ←</button>';
            el.querySelector('#pzGo').onclick = function () { close(); cb(tries === 1); }; }
          else { JG.Audio.play('bad'); var h = E < 0 ? 'الجهد سالب: التفاعل غير تلقائي! المهبط يجب أن يكون صاحب جهد الاختزال الأعلى.' : (tries === 1 ? 'الجهد موجب لكنه غير كافٍ. ابحث عن أكبر فرق بين جهدي الاختزال.' : 'E°cell = E°(المهبط) − E°(المصعد): اختر الأعلى جهداً مهبطاً والأقل جهداً مصعداً.');
            JG.Atom.say(h, 'wrong'); paint('<span class="bad">✖ البوابة لم تعمل (' + E.toFixed(2) + ' V).</span> ذرّة: ' + Z.fmt(h)); }
        };
      };
      paint();
    } });
  };

  /* ---------- 9) التحليل الكهربائي لمصهور ---------- */
  var MELT = [{ s: 'NaCl', c: 'Na', a: 'Cl₂' }, { s: 'KBr', c: 'K', a: 'Br₂' }, { s: 'MgCl₂', c: 'Mg', a: 'Cl₂' }, { s: 'CaBr₂', c: 'Ca', a: 'Br₂' }, { s: 'LiI', c: 'Li', a: 'I₂' }, { s: 'KCl', c: 'K', a: 'Cl₂' }];
  Z.molten = function (G, cb) {
    var m = rnd(MELT), others = shuf(MELT.filter(function (x) { return x !== m; }));
    var opts = shuf([[m.c, m.a], [m.a, m.c], [m.c, 'H₂'], ['O₂', m.c]]).map(function (p) { return 'عند المهبط: ' + p[0] + ' ، عند المصعد: ' + p[1]; });
    var q = { id: 'gen-melt-' + m.s, lessonId: 'u6l3', lesson: 'خلايا التحليل الكهربائي', skill: 'تطبيق', difficulty: 2,
      question: 'عند التحليل الكهربائي لمصهور ' + m.s + ' باستخدام أقطاب غرافيت، فإن الناتجين عند القطبين هما:', options: opts, answer: opts.indexOf('عند المهبط: ' + m.c + ' ، عند المصعد: ' + m.a),
      explanation: 'في المصهور لا يوجد ماء: يُختزل الأيون الموجب عند المهبط (السالب) فيتكون ' + m.c + '، ويتأكسد الأيون السالب عند المصعد (الموجب) فيتكون ' + m.a + '.' };
    Z.mcq(G, { q: q, title: 'خلية التحليل الكهربائي', icon: '⚗️' }, cb);
  };
})();
