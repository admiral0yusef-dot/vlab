const QB = () => { const r = Math.random(); return r < .35 ? rnd(CB)() : r < .65 ? EQ() : TQ[rnd(Object.keys(TQ))](); };
function arcHead(t) { const a = $('arc'); a.innerHTML = "<div class='arcv'><div style='display:flex;justify-content:space-between;align-items:center;gap:8px'><b>" + t + "</b><button class='btn g' onclick='$(\"arc\").innerHTML=\"\"'>إغلاق ×</button></div><div id='arcB'></div></div>"; a.scrollIntoView({ behavior: 'smooth', block: 'start' }); return $('arcB'); }
function fitArcCanvas(c, w, h) { const dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1)); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.imageSmoothingEnabled = true; return g; }
function askQ(box, cb) { const x = QB(); box.innerHTML = `<h4 style='margin:6px 0'>${x.q}</h4>` + x.o.map((o, i) => `<button class='op' data-i='${i}'>${o}</button>`).join(''); box.querySelectorAll('.op').forEach(b => b.onclick = () => { const ok = b.dataset.i == x.a; box.querySelectorAll('.op').forEach((c, k) => { c.disabled = true; if (k == x.a)
    c.classList.add('ok'); }); if (!ok)
    b.classList.add('no'); tone(ok ? 880 : 150, .15, ok ? 'sine' : 'sawtooth', .08); setTimeout(() => cb(ok), 700); }); }
function aXO() {
    const b = arcHead('❌⭕ إكس أو العلمي — أجب صح لتضع علامتك');
    let B = Array(9).fill(''), ov = 0;
    b.innerHTML = "<div class='xo' id='xg'></div><div class='qb' id='xq'></div>";
    const W = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], win = p => W.find(w => w.every(i => B[i] == p)), dr = () => { $('xg').innerHTML = B.map((v, i) => `<button data-i='${i}' ${v || ov ? 'disabled' : ''} style='color:${v == 'X' ? '#38bdf8' : '#f87171'}'>${v}</button>`).join(''); $('xg').querySelectorAll('button').forEach(bt => bt.onclick = () => pick(+bt.dataset.i)); }, en = m => { ov = 1; dr(); $('xq').innerHTML = `<h3>${m}</h3><button class='btn' onclick='aXO()'>العب مجدداً</button>`; fin(m.includes('فزت')); return 1; }, ai = () => { const e = B.map((v, i) => v ? -1 : i).filter(i => i >= 0); let m = null; for (const p of ['O', 'X']) {
        for (const i of e) {
            B[i] = p;
            const w = win(p);
            B[i] = '';
            if (w) {
                m = i;
                break;
            }
        }
        if (m !== null)
            break;
    } if (m === null)
        m = B[4] ? rnd(e) : 4; B[m] = 'O'; tone(300, .1, 'triangle', .06); }, ck = () => win('X') ? en('🏆 فزت!') : win('O') ? en('😢 فاز الخصم') : B.every(v => v) ? en('🤝 تعادل') : 0, pick = i => { $('xg').querySelectorAll('button').forEach(q => q.disabled = true); askQ($('xq'), ok => { if (ok)
        B[i] = 'X'; if (ck())
        return; ai(); if (ck())
        return; dr(); $('xq').innerHTML = 'اختر مربعاً'; }); };
    dr();
    $('xq').innerHTML = 'اختر مربعاً للبدء';
}
function aCatch() {
    const b = arcHead('🧺 اصطد الصحيح — حرّك السلة بإصبعك أو الفأرة');
    b.innerHTML = "<canvas id='ct' width='640' height='300'></canvas>";
    const c = $('ct'), x = fitArcCanvas(c, 640, 300), R = [['حمضي', 'ليمون خل قهوة طماطم'.split(' ')], ['قاعدي', 'صابون أمونيا صودا منظف'.split(' ')], ['فلز', 'حديد نحاس ذهب ألمنيوم'.split(' ')], ['لافلز', 'كربون كبريت أكسجين نيتروجين'.split(' ')]];
    let tg = 0, bx = 320, sc = 0, lv = 3, it = [], tm = 0, ov = 0, last = performance.now();
    c.onpointermove = e => { const r = c.getBoundingClientRect(); bx = (e.clientX - r.left) / r.width * 640; };
    (function L(t) {
        if (!document.body.contains(c))
            return;
        const dt = Math.min(.04, (t - last) / 1000);
        last = t;
        if (!ov) {
            tm += dt;
            if (tm > .8) {
                tm = 0;
                const k = Math.random() < .5 ? tg : Math.floor(Math.random() * 4);
                it.push({ x: 40 + Math.random() * 560, y: -10, k, t: rnd(R[k][1]) });
            }
            it.forEach(o => o.y += (90 + sc * 4) * dt);
            it = it.filter(o => { if (o.y > 262 && Math.abs(o.x - bx) < 55) {
                if (o.k == tg) {
                    sc++;
                    tone(900, .08, 'sine', .08);
                    if (sc % 7 == 0)
                        tg = (tg + 1) % 4;
                }
                else {
                    lv--;
                    tone(140, .25, 'sawtooth', .08);
                    if (lv <= 0) {
                        ov = 1;
                        fin(sc >= 15);
                    }
                }
                return 0;
            } return o.y < 310; });
        }
        x.fillStyle = '#0f172a';
        x.fillRect(0, 0, 640, 300);
        it.forEach(o => { x.fillStyle = '#334155'; x.beginPath(); x.roundRect(o.x - 34, o.y - 12, 68, 24, 12); x.fill(); x.fillStyle = '#fff'; x.font = '700 13px Cairo'; x.textAlign = 'center'; x.fillText(o.t, o.x, o.y + 5); });
        x.fillStyle = '#f59e0b';
        x.beginPath();
        x.roundRect(bx - 55, 268, 110, 24, 10);
        x.fill();
        x.textAlign = 'start';
        x.fillStyle = '#fde047';
        x.font = '700 15px Cairo';
        x.fillText('اصطد: ' + R[tg][0] + '  ·  النقاط ' + sc + '  ·  ' + '❤️'.repeat(Math.max(lv, 0)), 12, 22);
        if (ov) {
            x.fillStyle = '#fff';
            x.font = '800 28px Cairo';
            x.fillText((sc >= 15 ? '🏆 فزت! ' : '😢 انتهت اللعبة ') + sc + '  — حدّث الصفحة/أعد التشغيل من البطاقة', 40, 150);
        }
        requestAnimationFrame(L);
    })(performance.now());
}
function aRace(lv) {
    lv = lv || 1;
    const b = arcHead('🏎️ سباق الأبطال — المرحلة ' + lv + '/3 · تفادَ المخاريط والتقط أسهم السرعة');
    b.innerHTML = "<canvas id='rc' width='640' height='260'></canvas><div class='chips' style='justify-content:center;margin:8px 0'><button class='btn g' id='rup'>⬆️ مسار أعلى</button><button class='btn g' id='rdn'>⬇️ مسار أدنى</button></div><div class='qb' id='rq'></div>";
    const c = $('rc'), x = fitArcCanvas(c, 640, 260), Y = [45, 100, 155, 210], P = { l: 1, p: 0, c: '#38bdf8' }, A = [{ l: 0, p: 0, c: '#f87171', s: 13 + lv * 2 }, { l: 2, p: 0, c: '#4ade80', s: 12 + lv * 2 }];
    if (lv > 1)
        A.push({ l: 3, p: 0, c: '#fbbf24', s: 12 + lv * 2 });
    let bst = 0, dn = 0, tt = 0, last = performance.now(), fl = 0;
    const n = 4 + lv * 2, cn = Array.from({ length: n }, (_, i) => ({ l: Math.floor(Math.random() * 4), p: 80 + i * (400 / n) })), pd = Array.from({ length: 4 }, (_, i) => ({ l: Math.floor(Math.random() * 4), p: 50 + i * 115 }));
    const mvl = d => { if (!dn)
        P.l = Math.max(0, Math.min(3, P.l + d)); };
    $('rup').onclick = () => mvl(-1);
    $('rdn').onclick = () => mvl(1);
    document.onkeydown = e => { if (e.key == 'ArrowUp') {
        e.preventDefault();
        mvl(-1);
    } if (e.key == 'ArrowDown') {
        e.preventDefault();
        mvl(1);
    } };
    function nq() { askQ($('rq'), ok => { if (dn)
        return; if (ok) {
        bst = 2.2;
        tone(1000, .1, 'square', .05);
    }
    else
        bst = -1; nq(); }); }
    nq();
    const car = (y, p, col) => { x.fillStyle = col; x.beginPath(); x.roundRect(20 + p, y - 13, 56, 26, 9); x.fill(); x.fillStyle = '#e0f2fe'; x.fillRect(46 + p, y - 9, 16, 18); x.fillStyle = '#111'; [[34, -13], [62, -13], [34, 13], [62, 13]].forEach(q => { x.beginPath(); x.arc(20 + p + q[0], y + q[1], 5, 0, 7); x.fill(); }); };
    (function L(t) {
        if (!document.body.contains(c)) {
            document.onkeydown = null;
            return;
        }
        const dt = Math.min(.05, (t - last) / 1000);
        last = t;
        if (!dn) {
            tt += dt;
            bst *= Math.pow(.6, dt);
            P.p += (14 + bst * 18) * dt;
            A.forEach(a => { a.s = Math.max(10, Math.min(18 + lv * 2, a.s + (Math.random() - .5) * 8 * dt)); a.p += a.s * dt; });
            cn.forEach(o => { if (o.l == P.l && Math.abs(o.p - P.p) < 10 && !o.h) {
                o.h = 1;
                bst = -1.5;
                fl = .4;
                tone(120, .25, 'sawtooth', .08);
            } });
            pd.forEach(o => { if (o.l == P.l && Math.abs(o.p - P.p) < 10 && !o.h) {
                o.h = 1;
                bst = Math.max(bst, 2);
                tone(1200, .12, 'square', .05);
            } });
            fl = Math.max(0, fl - dt);
            const w = [P, ...A].find(q => q.p >= 500);
            if (w) {
                dn = 1;
                const win = w == P, s = win ? (tt < 32 ? 3 : tt < 46 ? 2 : 1) : 0;
                if (win)
                    saveStar('race' + lv, s);
                $('rq').innerHTML = `<h3>${win ? '🏆 فزت! ' + SN(s) : '😢 سبقك منافس'}</h3>` + (win && lv < 3 ? `<button class='btn' onclick='aRace(${lv + 1})'>المرحلة التالية ➜</button> ` : '') + `<button class='btn g' onclick='aRace(${lv})'>إعادة</button>`;
                fin(win);
            }
        }
        x.fillStyle = fl > 0 ? '#7f1d1d' : '#1e293b';
        x.fillRect(0, 0, 640, 260);
        x.strokeStyle = '#ffffff44';
        x.setLineDash([16, 12]);
        x.lineDashOffset = -t / 20;
        [72, 127, 182].forEach(y => { x.beginPath(); x.moveTo(0, y); x.lineTo(640, y); x.stroke(); });
        x.setLineDash([]);
        for (let k = 0; k < 14; k++) {
            x.fillStyle = k % 2 ? '#fff' : '#111';
            x.fillRect(585, 6 + k * 18, 12, 9);
            x.fillStyle = k % 2 ? '#111' : '#fff';
            x.fillRect(597, 6 + k * 18, 12, 9);
        }
        pd.forEach(o => { if (!o.h) {
            x.fillStyle = '#38bdf8';
            x.font = '700 22px Cairo';
            x.fillText('»', 20 + o.p, Y[o.l] + 8);
        } });
        cn.forEach(o => { if (!o.h) {
            x.fillStyle = '#f97316';
            x.beginPath();
            x.moveTo(20 + o.p, Y[o.l] - 12);
            x.lineTo(32 + o.p, Y[o.l] + 12);
            x.lineTo(8 + o.p, Y[o.l] + 12);
            x.fill();
        } });
        A.forEach(a => car(Y[a.l], a.p, a.c));
        car(Y[P.l], P.p, P.c);
        x.fillStyle = '#fde047';
        x.font = '700 12px Cairo';
        x.fillText('أنت', 22 + P.p, Y[P.l] - 18);
        requestAnimationFrame(L);
    })(performance.now());
}
function aRun(lv) {
    lv = lv || 1;
    const D = [150, 250, 350][lv - 1], b = arcHead('🍄 ماريو العلوم — المرحلة ' + lv + '/3 · اقفز فوق البكتيريا للقضاء عليها وصولاً إلى العلم 🚩');
    b.innerHTML = "<canvas id='rn' width='640' height='240'></canvas><div class='qb' id='rnq'></div>";
    const c = $('rn'), x = fitArcCanvas(c, 640, 240);
    let y = 0, vy = 0, lvs = 3, co = 0, dist = 0, ob = [], en = [], cn = [], pz = 0, ov = 0, sh = 0, last = performance.now(), spd = 190 + lv * 30, tm = 0, sc = 0;
    const jump = () => { if (y == 0 && !pz && !ov) {
        vy = 540;
        tone(600, .08, 'square', .05);
    } };
    c.onpointerdown = jump;
    document.onkeydown = e => { if (e.code == 'Space' || e.key == 'ArrowUp') {
        e.preventDefault();
        jump();
    } };
    const end = w => { ov = 1; const s = w ? lvs : 0; if (w) {
        saveStar('run' + lv, s);
        PG.run = Math.max(PG.run, Math.floor(dist));
        sv();
    } $('rnq').innerHTML = `<h3>${w ? '🏁 وصلت العلم! ' + SN(s) : '😢 انتهت المحاولة — المسافة ' + Math.floor(dist) + ' م'}</h3>` + (w && lv < 3 ? `<button class='btn' onclick='aRun(${lv + 1})'>المرحلة التالية ➜</button> ` : '') + `<button class='btn g' onclick='aRun(${lv})'>إعادة</button>`; fin(w); }, hit = () => { if (sh > 0)
        return; lvs--; sh = 1.2; tone(120, .3, 'sawtooth', .08); if (lvs <= 0)
        end(0); };
    (function L(t) {
        if (!document.body.contains(c)) {
            document.onkeydown = null;
            return;
        }
        const dt = Math.min(.04, (t - last) / 1000);
        last = t;
        if (!pz && !ov) {
            tm += dt;
            dist += spd * dt / 10;
            vy -= 1500 * dt;
            y = Math.max(0, y + vy * dt);
            if (y == 0 && vy < 0)
                vy = 0;
            sh = Math.max(0, sh - dt);
            if (dist >= D) {
                end(1);
                return;
            }
            if (tm > 1.3 - lv * .1 + Math.random() * .5 && D - dist > 14) {
                tm = 0;
                const r = Math.random();
                if (r < .4)
                    ob.push({ x: 660, w: 26, h: 30 + Math.random() * 20 });
                else if (r < .8)
                    en.push({ x: 660, w: 26 });
                if (Math.random() < .6)
                    cn.push({ x: 700, y: 45 + Math.random() * 60, s: Math.random() < .12 });
            }
            ob.forEach(o => o.x -= spd * dt);
            en.forEach(o => o.x -= (spd + 50) * dt);
            cn.forEach(o => o.x -= spd * dt);
            ob = ob.filter(o => { if (o.x < -40)
                return 0; if (o.x < 84 && o.x + o.w > 50 && y < o.h) {
                hit();
                return 0;
            } return 1; });
            en = en.filter(o => { if (o.x < -40)
                return 0; if (o.x < 84 && o.x + o.w > 50 && y < 24) {
                if (vy < 0 && y >= 14) {
                    vy = 380;
                    sc += 5;
                    tone(900, .1, 'square', .07);
                    return 0;
                }
                hit();
                return 0;
            } return 1; });
            cn = cn.filter(o => { if (o.x < -20)
                return 0; if (Math.abs(o.x - 67) < 28 && Math.abs(o.y - (y + 22)) < 30) {
                co++;
                if (o.s) {
                    sh = 6;
                    toast('🛡️ درع مؤقت!');
                }
                tone(1100, .07, 'sine', .07);
                if (co % 6 == 0 && !o.s) {
                    pz = 1;
                    askQ($('rnq'), ok => { if (ok)
                        lvs = Math.min(5, lvs + 1); pz = 0; $('rnq').innerHTML = ''; });
                }
                return 0;
            } return 1; });
        }
        const g = x.createLinearGradient(0, 0, 0, 200);
        g.addColorStop(0, '#38bdf8');
        g.addColorStop(1, '#e0f2fe');
        x.fillStyle = g;
        x.fillRect(0, 0, 640, 200);
        {
            const sun = x.createRadialGradient(548, 48, 2, 548, 48, 57);
            sun.addColorStop(0, 'rgba(255,250,205,.98)');
            sun.addColorStop(.25, 'rgba(253,224,71,.72)');
            sun.addColorStop(1, 'rgba(253,224,71,0)');
            x.fillStyle = sun;
            x.beginPath();
            x.arc(548, 48, 57, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#fffbea';
            x.beginPath();
            x.arc(548, 48, 18, 0, Math.PI * 2);
            x.fill();
            for (let ci = 0; ci < 3; ci++) {
                const px = (ci * 237 - dist * .28 + 840) % 840 - 100, py = 40 + ci % 2 * 35;
                x.fillStyle = 'rgba(255,255,255,.48)';
                x.beginPath();
                x.ellipse(px, py, 24, 7, 0, 0, Math.PI * 2);
                x.ellipse(px + 14, py - 5, 17, 10, 0, 0, Math.PI * 2);
                x.ellipse(px + 29, py, 22, 7, 0, 0, Math.PI * 2);
                x.fill();
            }
        }
        x.fillStyle = '#86efac';
        [[80, 200, 70], [260, 200, 50], [460, 200, 80]].forEach(q => { x.beginPath(); x.arc((q[0] - dist * 4 + 1200) % 800 - 80, q[1], q[2], Math.PI, 0); x.fill(); });
        x.fillStyle = '#14532d';
        x.fillRect(0, 200, 640, 40);
        x.fillStyle = '#78350f';
        x.fillRect(0, 200, 640, 6);
        ob.forEach(o => { const spike = x.createLinearGradient(o.x, 200 - o.h, o.x + o.w, 200); spike.addColorStop(0, '#fecaca'); spike.addColorStop(.28, '#fb7185'); spike.addColorStop(1, '#9f1239'); x.save(); x.shadowColor = 'rgba(244,63,94,.36)'; x.shadowBlur = 8; x.fillStyle = spike; x.beginPath(); x.moveTo(o.x, 200); x.quadraticCurveTo(o.x + 3, 200 - o.h * .65, o.x + o.w / 2, 200 - o.h); x.quadraticCurveTo(o.x + o.w - 3, 200 - o.h * .65, o.x + o.w, 200); x.closePath(); x.fill(); x.restore(); });
        en.forEach(o => { x.save(); x.shadowColor = 'rgba(101,163,13,.42)'; x.shadowBlur = 8; const eg = x.createRadialGradient(o.x + 8, 180, 1, o.x + 13, 188, 17); eg.addColorStop(0, '#d9f99d'); eg.addColorStop(.55, '#84cc16'); eg.addColorStop(1, '#3f6212'); x.fillStyle = eg; x.beginPath(); for (let j = 0; j < 12; j++) {
            const a = j * Math.PI / 6, rr = j % 2 ? 14 : 18, xx = o.x + 13 + Math.cos(a) * rr, yy = 188 + Math.sin(a) * rr;
            j ? x.lineTo(xx, yy) : x.moveTo(xx, yy);
        } x.closePath(); x.fill(); x.restore(); x.fillStyle = '#fff'; x.beginPath(); x.ellipse(o.x + 9, 185, 3, 4, 0, 0, Math.PI * 2); x.ellipse(o.x + 17, 185, 3, 4, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#172554'; x.beginPath(); x.arc(o.x + 10, 186, 1.5, 0, Math.PI * 2); x.arc(o.x + 17, 186, 1.5, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#365314'; x.lineWidth = 1.5; x.beginPath(); x.arc(o.x + 13, 192, 4, .15, Math.PI - .15); x.stroke(); });
        cn.forEach(o => { const yy = 200 - o.y, r = o.s ? 13 : 11; x.save(); x.shadowColor = o.s ? 'rgba(167,139,250,.9)' : 'rgba(250,204,21,.85)'; x.shadowBlur = 12; const cg = x.createRadialGradient(o.x - r * .35, yy - r * .4, 1, o.x, yy, r * 1.25); cg.addColorStop(0, '#fff'); cg.addColorStop(.3, o.s ? '#ddd6fe' : '#fef9c3'); cg.addColorStop(1, o.s ? '#7c3aed' : '#ca8a04'); x.fillStyle = cg; x.beginPath(); x.arc(o.x, yy, r, 0, Math.PI * 2); x.fill(); x.restore(); x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.2; x.beginPath(); x.arc(o.x, yy, r + 3, 0, Math.PI * 2); x.stroke(); x.fillStyle = o.s ? '#5b21b6' : '#78350f'; x.font = '700 10px Cairo'; x.textAlign = 'center'; x.fillText(o.s ? '★' : 'e⁻', o.x, yy + 4); x.textAlign = 'start'; });
        if (D - dist < 50) {
            const fx = 84 + (D - dist) * 10;
            x.fillStyle = '#fff';
            x.fillRect(fx, 90, 4, 110);
            x.fillStyle = '#ef4444';
            x.beginPath();
            x.moveTo(fx + 4, 90);
            x.lineTo(fx + 40, 105);
            x.lineTo(fx + 4, 120);
            x.fill();
        }
        if (sh > 0 && Math.floor(t / 100) % 2 || sh > 1.2) {
            x.strokeStyle = '#22d3ee';
            x.lineWidth = 3;
            x.beginPath();
            x.arc(67, 178 - y, 30, 0, 7);
            x.stroke();
            x.lineWidth = 1;
        }
        {
            const feet = 200 - y, stride = y === 0 ? Math.sin(t / 65) * 3 : 0;
            x.save();
            x.fillStyle = 'rgba(15,23,42,.23)';
            x.beginPath();
            x.ellipse(67, 201, Math.max(5, 14 - y * .025), 3, 0, 0, Math.PI * 2);
            x.fill();
            x.shadowColor = 'rgba(79,70,229,.38)';
            x.shadowBlur = 6;
            const body = x.createLinearGradient(52, 166 - y, 82, 190 - y);
            body.addColorStop(0, '#a5b4fc');
            body.addColorStop(.35, '#6366f1');
            body.addColorStop(1, '#312e81');
            x.fillStyle = body;
            x.beginPath();
            x.roundRect(54, 169 - y, 26, 20, 6);
            x.fill();
            x.shadowBlur = 0;
            x.fillStyle = '#1e40af';
            x.beginPath();
            x.roundRect(55 + stride, 185 - y, 9, 12, 3);
            x.roundRect(70 - stride, 185 - y, 9, 12, 3);
            x.fill();
            x.fillStyle = '#111827';
            x.beginPath();
            x.roundRect(53 + stride, 194 - y, 12, 5, 2);
            x.roundRect(69 - stride, 194 - y, 12, 5, 2);
            x.fill();
            x.fillStyle = '#f8fafc';
            x.beginPath();
            x.roundRect(54 + stride, 195 - y, 7, 2, 1);
            x.roundRect(70 - stride, 195 - y, 7, 2, 1);
            x.fill();
            x.fillStyle = '#ef4444';
            x.beginPath();
            x.ellipse(67, 162 - y, 10, 11, 0, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#fed7aa';
            x.beginPath();
            x.ellipse(68, 165 - y, 7, 8, 0, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#7f1d1d';
            x.beginPath();
            x.ellipse(62, 160 - y, 5, 8, -.35, 0, Math.PI * 2);
            x.fill();
            const cap = x.createLinearGradient(50, 151 - y, 80, 162 - y);
            cap.addColorStop(0, '#fecaca');
            cap.addColorStop(.4, '#ef4444');
            cap.addColorStop(1, '#991b1b');
            x.fillStyle = cap;
            x.beginPath();
            x.ellipse(67, 154 - y, 12, 7, 0, Math.PI, Math.PI * 2);
            x.fill();
            x.beginPath();
            x.roundRect(67, 152 - y, 15, 4, 2);
            x.fill();
            x.fillStyle = '#fff';
            x.beginPath();
            x.ellipse(71, 163 - y, 2.3, 3, 0, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#0f172a';
            x.beginPath();
            x.arc(72, 164 - y, 1, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#fde68a';
            x.beginPath();
            x.roundRect(57, 172 - y, 4, 8, 2);
            x.fill();
            x.restore();
        }
        x.fillStyle = '#0f172a';
        x.font = '700 13px Cairo';
        x.fillText('❤️'.repeat(lvs) + '  ⚡' + co + '  ✨' + sc + '  ' + Math.floor(dist) + '/' + D + ' م', 10, 20);
        requestAnimationFrame(L);
    })(performance.now());
}
function aSnk(lv) {
    lv = lv || 1;
    const b = arcHead('🎲🐍 السلم والثعبان — المرحلة ' + lv + '/2 · اجمع النجوم ⭐');
    b.innerHTML = "<canvas id='sc' width='640' height='300'></canvas><div class='qb' id='sq'></div>";
    const c = $('sc'), x = fitArcCanvas(c, 640, 300), L = lv == 1 ? { 3: 12, 9: 21, 19: 28 } : { 4: 14, 11: 23, 20: 27 }, S = lv == 1 ? { 16: 5, 24: 11, 29: 18 } : { 13: 3, 17: 6, 25: 9, 28: 12, 29: 7 }, ST = [7, 14, 22, 26], got = new Set(), p = [0, 0];
    let dice = 0;
    const xy = n => { n = Math.max(n, 1); const r = Math.floor((n - 1) / 6); let k = (n - 1) % 6; if (r % 2)
        k = 5 - k; return [50 + k * 90 + 45, 15 + (4 - r) * 54 + 27]; };
    const draw = () => {
        x.fillStyle = '#0f172a';
        x.fillRect(0, 0, 640, 300);
        for (let n = 1; n <= 30; n++) {
            const q = xy(n);
            const tg = x.createLinearGradient(q[0] - 45, q[1] - 27, q[0] + 45, q[1] + 27);
            tg.addColorStop(0, n % 2 ? '#3156a8' : '#5142a0');
            tg.addColorStop(1, n % 2 ? '#152d66' : '#28205e');
            x.fillStyle = tg;
            x.beginPath();
            x.roundRect(q[0] - 43, q[1] - 25, 86, 50, 7);
            x.fill();
            x.strokeStyle = 'rgba(255,255,255,.16)';
            x.stroke();
            x.fillStyle = '#94a3b8';
            x.font = '12px Cairo';
            x.fillText(n, q[0] - 40, q[1] - 14);
            if (ST.includes(n) && !got.has(n)) {
                x.font = '20px Cairo';
                x.fillText('⭐', q[0] + 8, q[1] + 6);
            }
        }
        x.lineCap = 'round';
        for (const k in L) {
            const a = xy(+k), d = xy(L[k]), dx = d[0] - a[0], dy = d[1] - a[1], len = Math.hypot(dx, dy) || 1, nx = dy / len * 5, ny = -dx / len * 5, lg = x.createLinearGradient(a[0], a[1], d[0], d[1]);
            lg.addColorStop(0, '#bbf7d0');
            lg.addColorStop(.5, '#22c55e');
            lg.addColorStop(1, '#166534');
            x.strokeStyle = lg;
            x.lineWidth = 4;
            x.beginPath();
            x.moveTo(a[0] - nx, a[1] - ny);
            x.lineTo(d[0] - nx, d[1] - ny);
            x.moveTo(a[0] + nx, a[1] + ny);
            x.lineTo(d[0] + nx, d[1] + ny);
            x.stroke();
            x.lineWidth = 2;
            x.strokeStyle = 'rgba(236,253,245,.9)';
            for (let r = 1; r < 6; r++) {
                const t = r / 6, px = a[0] + dx * t, py = a[1] + dy * t;
                x.beginPath();
                x.moveTo(px - nx, py - ny);
                x.lineTo(px + nx, py + ny);
                x.stroke();
            }
        }
        for (const k in S) {
            const a = xy(+k), d = xy(S[k]), cx = (a[0] + d[0]) / 2 + 40, cy = (a[1] + d[1]) / 2, sg = x.createLinearGradient(a[0], a[1], d[0], d[1]);
            sg.addColorStop(0, '#fda4af');
            sg.addColorStop(.5, '#e11d48');
            sg.addColorStop(1, '#881337');
            x.save();
            x.strokeStyle = 'rgba(2,6,23,.4)';
            x.lineWidth = 14;
            x.beginPath();
            x.moveTo(a[0], a[1]);
            x.quadraticCurveTo(cx, cy, d[0], d[1]);
            x.stroke();
            x.strokeStyle = sg;
            x.lineWidth = 9;
            x.beginPath();
            x.moveTo(a[0], a[1]);
            x.quadraticCurveTo(cx, cy, d[0], d[1]);
            x.stroke();
            for (let r = 1; r < 7; r++) {
                const t = r / 7, px = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * d[0], py = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * d[1];
                x.fillStyle = 'rgba(255,228,230,.65)';
                x.beginPath();
                x.arc(px, py, 1.7, 0, Math.PI * 2);
                x.fill();
            }
            x.fillStyle = '#fb7185';
            x.beginPath();
            x.arc(a[0], a[1], 7, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#fff1f2';
            x.beginPath();
            x.arc(a[0] - 2, a[1] - 2, 2, 0, Math.PI * 2);
            x.arc(a[0] + 3, a[1] - 2, 2, 0, Math.PI * 2);
            x.fill();
            x.strokeStyle = '#7f1d1d';
            x.lineWidth = 1.5;
            x.beginPath();
            x.moveTo(a[0], a[1] + 6);
            x.lineTo(a[0] + 2, a[1] + 10);
            x.stroke();
            x.restore();
        }
        x.lineWidth = 1;
        p.forEach((q, i) => { const a = xy(q || 1); x.fillStyle = i ? '#f87171' : '#38bdf8'; x.beginPath(); x.arc(a[0] - 10 + i * 20, a[1] + 10, 11, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.stroke(); });
        x.fillStyle = '#fde047';
        x.font = '700 18px Cairo';
        x.fillText('🎲 ' + (dice || '-') + '   ⭐ ' + got.size, 500, 292);
    };
    const mv = (i, n, cb) => { let s = 0; const iv = setInterval(() => { p[i] = Math.min(30, p[i] + 1); tone(500 + p[i] * 10, .05, 'triangle', .05); draw(); if (++s >= n) {
        clearInterval(iv);
        const pr = p[i], j = L[pr] || S[pr];
        if (j) {
            p[i] = j;
            tone(j > pr ? 900 : 200, .2, 'sine', .08);
        }
        if (i == 0 && ST.includes(p[0]) && !got.has(p[0])) {
            got.add(p[0]);
            tone(1300, .15, 'sine', .1);
            toast('⭐ نجمة!');
        }
        draw();
        cb();
    } }, 250); };
    const fn = w => { const s = w ? (got.size >= 3 ? 3 : got.size >= 1 ? 2 : 1) : 0; if (w)
        saveStar('snk' + lv, s); $('sq').innerHTML = `<h3>${w ? '🏆 فزت! ' + SN(s) : '😢 فاز الخصم'}</h3>` + (w && lv < 2 ? `<button class='btn' onclick='aSnk(2)'>المرحلة التالية ➜</button> ` : '') + `<button class='btn g' onclick='aSnk(${lv})'>إعادة</button>`; fin(w); };
    const ai = () => { dice = 1 + Math.floor(Math.random() * 6); draw(); mv(1, dice, () => { if (p[1] >= 30)
        return fn(0); turn(); }); };
    const turn = () => { askQ($('sq'), ok => { if (!ok) {
        $('sq').innerHTML = '❌ خسرت دورك';
        return setTimeout(ai, 800);
    } dice = 1 + Math.floor(Math.random() * 6); draw(); mv(0, dice, () => { if (p[0] >= 30)
        return fn(1); ai(); }); }); };
    draw();
    turn();
}
const ARC = [['🏎️', 'سباق السيارات', 'أجب بسرعة لتتفوق على المنافسين', 'linear-gradient(135deg,#ef4444,#f97316)', aRace], ['❌', 'إكس أو العلمي', 'اربح الخط بإجاباتك', 'linear-gradient(135deg,#0ea5e9,#6366f1)', aXO], ['🐍', 'السلم والثعبان', 'اجتز الأسئلة وتقدّم للقمة', 'linear-gradient(135deg,#16a34a,#14b8a6)', aSnk], ['🏃', 'عدّاء العلوم', 'اقفز واجمع الإلكترونات', 'linear-gradient(135deg,#7c3aed,#ec4899)', aRun], ['🧺', 'اصطد الصحيح', 'التقط العناصر المطلوبة فقط', 'linear-gradient(135deg,#f59e0b,#eab308)', aCatch]];
function addArcade() { var _a; const p = (_a = $('gm')) === null || _a === void 0 ? void 0 : _a.querySelector('.panel'); if (!p || $('arcade'))
    return; const el = document.createElement('div'); el.className = 'arcade'; el.id = 'arcade'; el.innerHTML = "<h3>🕹️ ألعاب الحركة والمرح</h3><div class='arc-grid'>" + ARC.map((g, i) => `<div class='arc-card' style='background:${g[3]}' onclick='ARC[${i}][4]()'><span>${g[0]}</span><b>${g[1]}</b><small>${g[2]}</small></div>`).join('') + "</div><div id='arc'></div>"; const hd = p.querySelector('.games-head'); if (hd)
    hd.after(el);
else
    p.prepend(el); }
let PG = { xp: 0, lv: 1, wins: 0, plays: 0, st: {}, b: [], run: 0 };
try {
    PG = Object.assign(PG, JSON.parse(localStorage.getItem('ylab_pg') || '{}'));
}
catch (e) { }
const sv = () => { try {
    localStorage.setItem('ylab_pg', JSON.stringify(PG));
}
catch (e) { } }, lvOf = x => Math.floor(Math.sqrt(x / 60)) + 1, stars = () => Object.values(PG.st).reduce((a, b) => a + b, 0);
const BD = [['w1', '🏆', 'أول انتصار', p => p.wins >= 1], ['w5', '🔥', '5 انتصارات', p => p.wins >= 5], ['x100', '⭐', '100 نقطة خبرة', p => p.xp >= 100], ['x500', '🌟', '500 نقطة خبرة', p => p.xp >= 500], ['s6', '🎖️', '6 نجوم', p => stars() >= 6], ['g10', '🎮', '10 مباريات', p => p.plays >= 10], ['r300', '🏃', 'عدّاء 300 م', p => p.run >= 300]];
function toast(m) { let t = $('toast'); if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
} t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600); }
function award(xp) { PG.xp += xp; const n = lvOf(PG.xp); if (n > PG.lv) {
    PG.lv = n;
    toast('🎉 ارتقيت إلى المستوى ' + n);
    if (typeof clap == 'function')
        clap();
} BD.forEach(b => { if (!PG.b.includes(b[0]) && b[3](PG)) {
    PG.b.push(b[0]);
    setTimeout(() => toast('🏅 شارة جديدة: ' + b[2]), 900);
} }); sv(); renderProf(); }
function saveStar(k, s) { PG.st[k] = Math.max(PG.st[k] || 0, s); award(s * 10); }
function renderProf() { var _a; const gm = (_a = $('gm')) === null || _a === void 0 ? void 0 : _a.querySelector('.panel'); if (!gm)
    return; let p = $('prof'); if (!p) {
    p = document.createElement('div');
    p.id = 'prof';
    p.className = 'prof';
    const ar = $('arcade');
    ar ? ar.before(p) : gm.prepend(p);
} const lo = 60 * Math.pow(PG.lv - 1, 2), hi = 60 * Math.pow(PG.lv, 2), pc = Math.min(100, (PG.xp - lo) / (hi - lo) * 100); p.innerHTML = `<div class='pav'>${PG.lv}</div><div style='flex:1;min-width:180px'><b>المتعلّم المبدع · المستوى ${PG.lv}</b><div class='xbar'><i style='width:${pc}%'></i></div><small>${PG.xp} نقطة خبرة · ⭐ ${stars()} · 🏆 ${PG.wins} انتصار</small></div><div class='bdg'>${BD.map(b => `<span class='${PG.b.includes(b[0]) ? 'on' : ''}' title='${b[2]}'>${b[1]}</span>`).join('')}</div><div class='byy'>🎓 برعاية الأستاذ يوسف القاق</div>`; }
{
    const _f = fin;
    fin = function (w) { _f(w); PG.plays++; if (w)
        PG.wins++; award(w ? 30 : 5); };
}
{
    const _aa = addArcade;
    addArcade = function () { _aa(); renderProf(); };
}
const SN = n => '⭐'.repeat(n);
ARC[0] = ['🏎️', 'سباق الأبطال', '3 مراحل · عقبات وتعزيزات', 'linear-gradient(135deg,#ef4444,#f97316)', aRace];
ARC[2] = ['🐍', 'السلم والثعبان', 'مرحلتان · نجوم ومكافآت', 'linear-gradient(135deg,#16a34a,#14b8a6)', aSnk];
ARC[3] = ['🍄', 'ماريو العلوم', '3 مراحل · أعداء وعلم النهاية', 'linear-gradient(135deg,#7c3aed,#ec4899)', aRun];
window.afterGamesRender = function () { const a = document.getElementById('arcade'); if (a)
    a.remove(); const p = document.getElementById('prof'); if (p)
    p.remove(); addArcade(); };
const _ah = arcHead;
arcHead = function (t) { const s = document.getElementById('sgStage'); if (s) {
    s.style.display = 'none';
    s.innerHTML = '';
} return _ah(t); };
