/* VLab — إحصائيات مجهولة الهوية (Supabase)
   يسجّل: الزيارات، فتح التجارب، أسئلة المساعد، أهداف الوكيل، الاختبارات، الألعاب.
   لا يسجّل أسماء ولا عناوين IP ولا نص الأسئلة. المعرّف رقم عشوائي محفوظ في المتصفح فقط. */
(function () {
  'use strict';
  if (window.__vstat) return; window.__vstat = 1;
  var H = location.hostname, TEST = /[?&]vstat=test\b/.test(location.search);
  if (!TEST && (!/(^|\.)vlabjo\.com$/.test(H) || navigator.webdriver)) return;
  if (/^\/stats(\/|$)/.test(location.pathname)) return;
  var URL_ = 'https://uxjsbkopkizixvlzqmpk.supabase.co/rest/v1/rpc/vl_track',
      KEY = 'sb_publishable_v7aarJOT6IsFXsS51CQSMA_bWI6WG5i';
  try { if (window.YQ_CLOUD && YQ_CLOUD.url && YQ_CLOUD.key) { URL_ = YQ_CLOUD.url.replace(/\/$/, '') + '/rest/v1/rpc/vl_track'; KEY = YQ_CLOUD.key; } } catch (e) {}

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var sid = ls('vl_sid');
  if (!sid || sid.length < 6) { sid = 'v' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); ls('vl_sid', sid); }

  function dev() {
    var ua = navigator.userAgent || '', w = Math.min(screen.width || innerWidth, screen.height || innerHeight);
    if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))) return 'tablet';
    if (/Mobi|iPhone|Android/i.test(ua) || w < 600) return 'mobile';
    return 'desktop';
  }
  function ref() {
    var m = location.search.match(/[?&]utm_source=([^&]+)/); if (m) return decodeURIComponent(m[1]).slice(0, 80);
    try { var r = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; return /vlabjo\.com$/.test(r) ? '' : r; } catch (e) { return ''; }
  }
  function grade() { var g = +(ls('yq_ai_grade') || 0); return g >= 1 && g <= 12 ? g : undefined; }
  function path() { var p = location.pathname; try { p = decodeURIComponent(p); } catch (e) {} return p.slice(0, 160); }
  var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}

  var Q = [], T = null;
  function track(ev, o) {
    o = o || {}; var e = { sid: sid, ev: ev, page: o.page || path(), grade: grade() };
    if (o.sig) e.sig = String(o.sig).slice(0, 80);
    if (o.label) e.label = String(o.label).slice(0, 120);
    if (o.val != null && isFinite(o.val)) e.val = Math.round(o.val * 10) / 10;
    if (ev === 'visit') { e.dev = dev(); e.ref = ref(); e.tz = tz; e.lang = (navigator.language || '').slice(0, 12); }
    Q.push(e); clearTimeout(T); T = setTimeout(flush, 4000);
  }
  function flush() {
    if (!Q.length) return; var b = Q.splice(0, 30);
    try { fetch(URL_, { method: 'POST', keepalive: true, headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p: b }) }).catch(function () {}); } catch (e) {}
    if (Q.length) T = setTimeout(flush, 500);
  }
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  window.vlTrack = track;

  // 1) زيارة الصفحة
  track('visit');

  // 2) صفحات الألعاب المستقلة
  var P = location.pathname;
  if (/^\/(bridge-game|offroad|games)\//.test(P)) track('game', { label: (document.title || P).split(/[|—-]/)[0].trim() });

  // 3) فتح تجربة داخل المختبر (بطاقة، بحث، وكيل، رابط)
  var inLab = false, lastExp = '';
  function expCheck() {
    var on = document.body && document.body.classList.contains('yqInLab');
    if (on && !inLab) setTimeout(function () {
      var p = location.pathname, m = p.match(/^\/exp\/(\d+)/), t = (document.title || '').split(' — ')[0].trim();
      var key = (m ? m[1] : '') + '|' + t; if (key === lastExp) return; lastExp = key;
      track('exp_open', { sig: m ? m[1] : '', label: t, page: path() });
    }, 350);
    if (!on) lastExp = '';
    inLab = on;
  }
  function boot() {
    if (!document.body) return setTimeout(boot, 200);
    new MutationObserver(expCheck).observe(document.body, { attributes: true, attributeFilter: ['class'] }); expCheck();
    // 4) أسئلة المساعد الذكي (العدد فقط، بلا نص)
    var hooked = false;
    function hookMsgs() {
      var m = document.getElementById('msgs'); if (!m || hooked) return; hooked = true;
      new MutationObserver(function (ms) {
        ms.forEach(function (mu) { if (mu.addedNodes.length !== 1) return; var n = mu.addedNodes[0];
          if (n.classList && n.classList.contains('m') && n.classList.contains('u')) track('ai_q'); });
      }).observe(m, { childList: true });
    }
    // 5) الوكيل واختباراته
    var vHooked = false;
    function hookAgent() {
      var V = window.VAgent; if (!V || vHooked) return; vHooked = true;
      var T2 = V.tools, q0 = T2 && T2.give_quiz;
      if (q0) T2.give_quiz = function (a) { var r = q0.apply(this, arguments);
        Promise.resolve(r).then(function (o) { if (o && o.total) track('quiz', { label: o.unit || '', val: 100 * (o.score || 0) / o.total }); }).catch(function () {}); return r; };
    }
    setTimeout(function () { hookMsgs(); hookAgent(); }, 2500);
    setInterval(function () { hookMsgs(); hookAgent(); }, 4000);
  }
  boot();
})();
