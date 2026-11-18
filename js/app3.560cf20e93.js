(function advancedScienceUpgrade() {
    // Branding and low-opacity educator watermark
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle)
        heroTitle.innerHTML = 'المختبر الافتراضي للعلوم';
    const heroP = document.querySelector('.hero p');
    if (heroP)
        heroP.textContent = 'مختبر علمي تفاعلي لاستكشاف الظواهر الفيزيائية والكيميائية والحيوية بنماذج مرئية وقراءات قابلة للتغيير.';
    document.title = 'المختبر الافتراضي للعلوم VLab | 629 تجربة تفاعلية مجانية';
    const style = document.createElement('style');
    style.textContent = `body:before{content:'الأستاذ يوسف القاق';position:fixed;top:0;right:0;bottom:0;left:0;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0;font-size:clamp(34px,8vw,92px);font-weight:900;letter-spacing:2px;color:var(--ac);opacity:.055;transform:rotate(-24deg);white-space:nowrap}body>*{position:relative;z-index:1}.hero,.panel,.card{-webkit-backdrop-filter:saturate(1.08);backdrop-filter:saturate(1.08)}.card{position:relative;overflow:hidden}.card:after{content:'✦';position:absolute;left:12px;bottom:4px;color:var(--ac);opacity:.12;font-size:38px;pointer-events:none}#cv{box-shadow:0 12px 34px #0003,0 0 0 1px #7dd3fc22}#ctls .ctl{border:1px solid var(--bd)}.lab-mark{color:#10b981;font-size:10px;vertical-align:middle}@media(prefers-reduced-motion:no-preference){.card{animation:riseIn .35s both}@keyframes riseIn{from{opacity:.55;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}}`;
    document.head.appendChild(style);
    // Lens simulator: switch between convex and concave optics and redraw the actual lens profile.
    S.lens = { c: [R('k', 'نوع العدسة (0 مقعرة، 1 محدبة)', 0, 1, 1, 1), R('u', 'بعد الجسم عن العدسة (سم)', 5, 60, 1, 30), R('f', 'البعد البؤري المطلق (سم)', 5, 25, 1, 10)],
        f(v) {
            const convex = v.k === 1, F = convex ? v.f : -v.f, u = v.u, AY = H / 2, x0 = W / 2 + 10, h = 46, den = 1 / F - 1 / u, inf = Math.abs(den) < 1e-6, q = inf ? Infinity : 1 / den, m = inf ? Infinity : -q / u, fa = v.f;
            const L = Math.max(u, q < 0 && isFinite(q) ? -q : 0, 2 * fa) + 3, Rr = Math.max(q > 0 && isFinite(q) ? q : 0, 2 * fa) + 3, sc = Math.max(1.4, Math.min(5, (x0 - 18) / L, (W - 18 - x0) / Rr));
            const g = cx.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, '#06182b');
            g.addColorStop(1, '#0c2b45');
            cx.fillStyle = g;
            cx.fillRect(0, 0, W, H);
            const ln = (a, b, c2, d, col, dash, w) => { cx.strokeStyle = col; cx.lineWidth = w || 1.8; cx.setLineDash(dash ? [6, 5] : []); cx.beginPath(); cx.moveTo(a, b); cx.lineTo(c2, d); cx.stroke(); cx.setLineDash([]); };
            const tx = (t, x, y, col, al, sz) => { cx.fillStyle = col; cx.font = `700 ${sz || 11}px Cairo,Tahoma`; cx.textAlign = al || 'center'; cx.fillText(t, x, y); };
            ln(12, AY, W - 12, AY, '#64809a', 0, 1.2);
            ln(x0, AY - 92, x0, AY + 92, 'rgba(139,229,247,.22)', 1, 1);
            const step = sc >= 3 ? 5 : 10;
            for (let d = step; d * sc < Math.max(x0, W - x0) - 20; d += step) {
                [-1, 1].forEach(s => { const X = x0 + s * d * sc; ln(X, AY - 3, X, AY + 3, '#64809a', 0, 1); if (d % (step * 2) == 0)
                    tx(String(d), X, AY + 16, '#7f98ae'); });
            }
            tx('سم', W - 22, AY + 16, '#7f98ae');
            const top = AY - 82, bot = AY + 82;
            cx.beginPath();
            if (convex) {
                cx.moveTo(x0, top);
                cx.bezierCurveTo(x0 + 24, top + 32, x0 + 24, bot - 32, x0, bot);
                cx.bezierCurveTo(x0 - 24, bot - 32, x0 - 24, top + 32, x0, top);
            }
            else {
                cx.moveTo(x0 - 14, top);
                cx.lineTo(x0 + 14, top);
                cx.bezierCurveTo(x0 + 3, top + 32, x0 + 3, bot - 32, x0 + 14, bot);
                cx.lineTo(x0 - 14, bot);
                cx.bezierCurveTo(x0 - 3, bot - 32, x0 - 3, top + 32, x0 - 14, top);
            }
            const lg = cx.createLinearGradient(x0 - 24, 0, x0 + 24, 0);
            lg.addColorStop(0, 'rgba(120,215,245,.45)');
            lg.addColorStop(.5, 'rgba(190,240,255,.25)');
            lg.addColorStop(1, 'rgba(120,215,245,.45)');
            cx.fillStyle = lg;
            cx.fill();
            cx.strokeStyle = '#9be8fa';
            cx.lineWidth = 2;
            cx.stroke();
            [[top, -1], [bot, 1]].forEach(([y, s]) => { const o = convex ? s : -s; cx.fillStyle = '#9be8fa'; cx.beginPath(); cx.moveTo(x0, y + o * 8); cx.lineTo(x0 - 6, y - o * 3); cx.lineTo(x0 + 6, y - o * 3); cx.closePath(); cx.fill(); });
            tx(convex ? 'عدسة محدبة' : 'عدسة مقعرة', x0, top - 8, '#bff3ff', 'center', 12);
            [[-1, 'F₁'], [1, 'F₂']].forEach(([s, l]) => { const X = x0 + s * fa * sc; cx.fillStyle = '#fbbf24'; cx.beginPath(); cx.arc(X, AY, 4.5, 0, 7); cx.fill(); tx(l, X, AY - 9, '#fde68a'); tx('f=' + (convex ? '+' : '−') + fa, X, AY + 30, '#fde68a', 'center', 10); const X2 = x0 + s * 2 * fa * sc; if (X2 > 10 && X2 < W - 10) {
                cx.fillStyle = '#f59e0b';
                cx.beginPath();
                cx.arc(X2, AY, 3, 0, 7);
                cx.fill();
                tx('2' + l, X2, AY - 9, '#fcd34d', 'center', 10);
            } });
            const ox = x0 - u * sc, ty = AY - h, arrow = (X, Y, col, dash) => { ln(X, AY, X, Y, col, dash, 3); const s = Y < AY ? 1 : -1; cx.fillStyle = col; cx.beginPath(); cx.moveTo(X, Y); cx.lineTo(X - 6, Y + 10 * s); cx.lineTo(X + 6, Y + 10 * s); cx.closePath(); cx.fill(); };
            arrow(ox, ty, '#fbbf24');
            tx('الجسم', ox, AY + 46, '#fbbf24');
            let ix = 0, iy = 0;
            if (!inf) {
                ix = x0 + q * sc;
                iy = AY - h * m;
                const right = (px, py, dx, dy) => { if (dx <= 0.001)
                    return; const t = (W - 8 - px) / dx; ln(px, py, px + dx * t, py + dy * t, ''); };
                const ray = (py, dirx, diry, col) => {
                    ln(ox, ty, x0, py, col);
                    const real = q > 0;
                    if (dirx === null) { }
                    let dx, dy;
                    if (diry === 0) {
                        dx = 1;
                        dy = 0;
                    }
                    else {
                        dx = dirx;
                        dy = diry;
                    }
                    const t = (W - 8 - x0) / dx;
                    ln(x0, py, x0 + dx * t, py + dy * t, col);
                    if (!real)
                        ln(x0, py, ix, iy, col, 1, 1.4);
                };
                // 1) موازٍ للمحور 2) عبر المركز 3) عبر البؤرة
                const real = q > 0, r1 = real ? [ix - x0, iy - (AY - h)] : [x0 - ix, (AY - h) - iy];
                ray(AY - h, r1[0], r1[1], '#38bdf8');
                ln(ox, ty, x0, AY, '#a78bfa');
                {
                    const dx = x0 - ox, dy = AY - ty, t = (W - 8 - x0) / dx;
                    ln(x0, AY, x0 + dx * t, AY + dy * t, '#a78bfa');
                }
                if (!real)
                    ln(x0, AY, ix, iy, '#a78bfa', 1, 1.4);
                if (Math.abs(iy - AY) < 78)
                    ray(iy, 1, 0, '#34d399');
                if (ix > 6 && ix < W - 6 && Math.abs(iy - AY) < 175) {
                    arrow(ix, iy, real ? '#34d399' : '#fb7185', !real);
                    tx('الصورة', ix, iy > AY ? iy + 22 : iy - 14, real ? '#34d399' : '#fb7185');
                }
            }
            else {
                const dx = fa * sc, dy = h;
                [[AY - h, dx, dy], [AY, x0 - ox, AY - ty]].forEach(([py, a, b], i) => { ln(ox, ty, x0, py, i ? '#a78bfa' : '#38bdf8'); const t = (W - 8 - x0) / a; ln(x0, py, x0 + a * t, py + b * t, i ? '#a78bfa' : '#38bdf8'); });
                tx('الأشعة تخرج متوازية: لا تتكون صورة', W / 2, H - 10, '#fde68a', 'center', 12);
            }
            const sg = n => n > 0 ? '+' + n : String(n), P = 100 / F, mm = Math.abs(m);
            let nat, loc, rule;
            if (!convex) {
                nat = 'تقديرية، معتدلة، مصغّرة';
                loc = `على جانب الجسم نفسه، بين العدسة والبؤرة F₁ (على بعد ${Math.abs(q).toFixed(1)} سم من العدسة)`;
                rule = 'العدسة المقعرة تعطي دائمًا صورة تقديرية معتدلة مصغّرة بين العدسة والبؤرة، مهما كان موضع الجسم.';
            }
            else if (inf) {
                nat = 'لا تتكوّن صورة (الأشعة المنكسرة متوازية)';
                loc = 'تقع في اللانهاية';
                rule = 'الجسم عند البؤرة (u = f).';
            }
            else if (q < 0) {
                nat = 'تقديرية، معتدلة، مكبّرة';
                loc = `على جانب الجسم نفسه، أبعد من الجسم (على بعد ${(-q).toFixed(1)} سم من العدسة)`;
                rule = 'الجسم بين العدسة والبؤرة (u < f): تعمل العدسة كعدسة مكبّرة.';
            }
            else {
                const nm = Math.abs(u - 2 * fa) < .5 ? 'مساوية للجسم' : mm < 1 ? 'مصغّرة' : 'مكبّرة';
                nat = 'حقيقية، مقلوبة، ' + nm;
                loc = Math.abs(u - 2 * fa) < .5 ? `عند 2F₂ تمامًا (v = ${q.toFixed(1)} سم)` : u > 2 * fa ? `بين F₂ و2F₂ (v = ${q.toFixed(1)} سم)` : `بعد 2F₂ (v = ${q.toFixed(1)} سم)`;
                rule = u > 2 * fa ? 'الجسم أبعد من 2F (u > 2f): صورة حقيقية مقلوبة مصغّرة بين F₂ و2F₂.' : Math.abs(u - 2 * fa) < .5 ? 'الجسم عند 2F: صورة حقيقية مقلوبة مساوية للجسم عند 2F₂.' : 'الجسم بين F و2F: صورة حقيقية مقلوبة مكبّرة أبعد من 2F₂.';
            }
            return `📐 ${convex ? 'عدسة محدبة (مجمِّعة)' : 'عدسة مقعرة (مفرِّقة)'}: البعد البؤري f = ${sg(F)} سم (القدرة ${P.toFixed(1)} ديوبتر). البؤرتان F₁ وF₂ على بعد ${fa} سم من مركز العدسة على جانبيها (الإشارة ${convex ? 'موجبة لأن البؤرة حقيقية' : 'سالبة لأن البؤرة تقديرية'}).\n📍 مكان الصورة: ${loc}.\n🔍 صفات الصورة: ${nat}${inf ? '' : `، التكبير m = ${m.toFixed(2)} (طول الصورة ${(mm * 100).toFixed(0)}% من طول الجسم)`}.\n✏️ العلاقات: 1/f = 1/u + 1/v ⟹ ${inf ? '1/v = 0' : `v = ${q.toFixed(1)} سم`}، m = −v/u. ${rule}\n🎨 الأشعة: الأزرق موازٍ للمحور، البنفسجي عبر المركز، الأخضر عبر البؤرة. الخط المتقطع امتداد وهمي للأشعة (صورة تقديرية).`;
        } };
    // Detailed, custom experiment renderers. All reactions are virtual demonstrations, not lab instructions.
    const drawBase = (title, subtitle) => { cx.clearRect(0, 0, W, H); const bg = cx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#102b42'); bg.addColorStop(1, '#06111f'); cx.fillStyle = bg; cx.fillRect(0, 0, W, H); cx.strokeStyle = '#24445b'; cx.lineWidth = 1; for (let x = 20; x < W; x += 40) {
        cx.beginPath();
        cx.moveTo(x, 0);
        cx.lineTo(x, H);
        cx.stroke();
    } for (let y = 20; y < H; y += 40) {
        cx.beginPath();
        cx.moveTo(0, y);
        cx.lineTo(W, y);
        cx.stroke();
    } cx.textAlign = 'right'; cx.fillStyle = '#e0f2fe'; cx.font = 'bold 16px Tahoma'; cx.fillText(title, 610, 28); cx.fillStyle = '#93c5fd'; cx.font = '12px Tahoma'; cx.fillText(subtitle, 610, 48); };
    const text = (s, x, y, color = '#e5f3ff', size = 13, align = 'center') => { cx.fillStyle = color; cx.font = `${size}px Tahoma`; cx.textAlign = align; cx.fillText(s, x, y); };
    const beaker = (x, y, w, h, liquid, color, label) => { cx.lineWidth = 3; cx.strokeStyle = '#b9d7e8'; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + 5, y + h - 8); cx.quadraticCurveTo(x + w / 2, y + h + 4, x + w - 5, y + h - 8); cx.lineTo(x + w, y); cx.stroke(); cx.fillStyle = color; cx.globalAlpha = .78; cx.fillRect(x + 7, y + h * (1 - liquid), w - 14, h * liquid - 7); cx.globalAlpha = 1; cx.strokeStyle = '#b9d7e8'; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x + 7, y + h * (1 - liquid)); cx.lineTo(x + w - 7, y + h * (1 - liquid)); cx.stroke(); text(label, x + w / 2, y + h + 20, '#e2e8f0', 12); };
    S.atomx = { c: [R('p', 'عدد البروتونات', 1, 20, 1, 8), R('n', 'عدد النيوترونات', 0, 30, 1, 8), R('e', 'عدد الإلكترونات', 0, 20, 1, 8)], f(v) {
            const p = v.p, n = v.n, e = v.e, el = EL.find(x => x.z === p), name = el ? el.n : 'عنصر غير محدد', sym = el ? el.s : '؟', mass = p + n, charge = p - e;
            drawBase('استوديو بناء الذرة', 'غيّر الجسيمات وشاهد العنصر والشحنة الناتجين');
            const cx0 = 260, cy = 165;
            cx.strokeStyle = '#335b77';
            cx.lineWidth = 2;
            for (let sh = 1; sh <= Math.ceil(e / 2); sh++) {
                const r = 24 + sh * 24;
                cx.beginPath();
                cx.ellipse(cx0, cy, r, r * .72, 0, 0, Math.PI * 2);
                cx.strokeStyle = '#3b617a';
                cx.stroke();
            }
            const total = p + n, rad = Math.min(12, 85 / Math.sqrt(Math.max(total, 1)));
            for (let i = 0; i < total; i++) {
                const a = i * 2.399, rr = rad * Math.sqrt(i), x = cx0 + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .8;
                cx.beginPath();
                cx.arc(x, y, rad, 0, Math.PI * 2);
                cx.fillStyle = i < p ? '#ef4444' : '#94a3b8';
                cx.fill();
                cx.strokeStyle = i < p ? '#fecaca' : '#e2e8f0';
                cx.stroke();
            }
            for (let i = 0; i < e; i++) {
                const shell = i < 2 ? 1 : i < 10 ? 2 : i < 18 ? 3 : 4;
                const countBefore = i < 2 ? i : i < 10 ? i - 2 : i < 18 ? i - 10 : i - 18;
                const cap = shell === 1 ? 2 : shell === 2 ? 8 : shell === 3 ? 8 : 2;
                const angle = (countBefore / Math.max(1, cap)) * Math.PI * 2 + (shell % 2) * .3;
                const r = 24 + shell * 24;
                cx.beginPath();
                cx.arc(cx0 + Math.cos(angle) * r, cy + Math.sin(angle) * r * .72, 5, 0, Math.PI * 2);
                cx.fillStyle = '#38bdf8';
                cx.fill();
                cx.strokeStyle = '#e0f2fe';
                cx.stroke();
            }
            cx.textAlign = 'right';
            text(`العنصر: ${name} (${sym})`, 605, 100, '#f8fafc', 18, 'right');
            text(`العدد الذري Z = ${p}`, 605, 132, '#fca5a5', 15, 'right');
            text(`العدد الكتلي A = ${mass}`, 605, 158, '#cbd5e1', 15, 'right');
            text(`الشحنة = ${charge > 0 ? '+' : ''}${charge}`, 605, 184, charge === 0 ? '#86efac' : '#fcd34d', 15, 'right');
            text(charge === 0 ? 'ذرة متعادلة' : charge > 0 ? 'أيون موجب (فقد إلكترونات)' : 'أيون سالب (اكتسب إلكترونات)', 605, 214, charge === 0 ? '#86efac' : '#fcd34d', 13, 'right');
            text('🔴 بروتون', 85, 275, '#fca5a5', 13);
            text('⚪ نيوترون', 220, 275, '#cbd5e1', 13);
            text('🔵 إلكترون', 355, 275, '#7dd3fc', 13);
            return `${name} (${sym}) · البروتونات ${p} · النيوترونات ${n} · الإلكترونات ${e}. العدد الذري = عدد البروتونات = ${p}، والعدد الكتلي = p+n = ${mass}. ${charge === 0 ? 'الشحنة الكلية صفر، فالذرة متعادلة.' : `الشحنة الصافية ${charge > 0 ? '+' : ''}${charge}؛ لأن عدد البروتونات والإلكترونات غير متساوٍ.`} التوزيع الإلكتروني هنا نموذج مبسط للصفوف المدرسية.`;
        } };
    S.galv = { c: [R('c', 'تركيز الأيونات (نسبي)', 1, 10, 1, 5), R('t', 'زمن التشغيل (min)', 1, 30, 1, 12), R('b', 'الجسر الملحي (0 مفتوح، 1 موصول)', 0, 1, 1, 1)], f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, on = v.b === 1, E = on ? 1.1 - .012 * (10 - v.c) : 0, sp = on ? 1 : 0, hs = i => { const x = Math.sin(i * 91.7 + 17.3) * 43758.5453; return x - Math.floor(x); };
            h.bg(W, H);
            const bk = (x, col) => { cx.fillStyle = col; cx.fillRect(x + 3, 170, 164, 92); cx.strokeStyle = '#a5d8f5'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(x, 140); cx.lineTo(x + 4, 264); cx.lineTo(x + 166, 264); cx.lineTo(x + 170, 140); cx.stroke(); };
            bk(70, 'rgba(96,165,250,.42)');
            bk(400, 'rgba(52,211,153,.42)');
            const zh = 150 * (1 - .3 * v.t / 30 * sp), cw = 18 + 14 * v.t / 30 * sp;
            cx.fillStyle = '#cbd5e1';
            cx.fillRect(140, 262 - zh, 18, zh);
            cx.fillStyle = '#d97706';
            cx.fillRect(479 - cw / 2, 112, cw, 150);
            h.L([[149, 112], [149, 70], [290, 70]]);
            h.L([[338, 70], [479, 70], [479, 112]]);
            h.meter(314, 70, 'V', null, '#fde68a');
            h.T(E.toFixed(2) + ' V', 352, 60, '#fde68a', 13, 'left');
            const br = [[232, 185], [232, 130], [408, 130], [408, 185]];
            cx.save();
            cx.lineCap = 'round';
            cx.strokeStyle = '#475569';
            cx.lineWidth = 18;
            cx.beginPath();
            br.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]));
            cx.stroke();
            cx.strokeStyle = on ? '#94a3b8' : '#334155';
            cx.lineWidth = 12;
            cx.stroke();
            cx.restore();
            h.T(on ? 'الجسر الملحي (موصول)' : 'الجسر الملحي مفتوح: لا يمر تيار', 320, 112, on ? '#bbf7d0' : '#fca5a5', 11);
            if (on) {
                h.dots([[149, 112], [149, 70], [290, 70]], 5, T0 * .25, '#38bdf8', 3.4);
                h.dots([[338, 70], [479, 70], [479, 112]], 5, T0 * .25, '#38bdf8', 3.4);
                h.dots(br, 8, T0 * .12, '#f87171', 3.4);
                h.dots(br.slice().reverse(), 8, T0 * .12, '#93c5fd', 3.4);
            }
            const nI = 6 + v.c;
            for (let i = 0; i < nI; i++) {
                const ph = ((T0 * .14 * sp + hs(i)) % 1), y = 185 + hs(i + 30) * 66, zx = 160 + ph * 70;
                cx.fillStyle = '#f87171';
                cx.beginPath();
                cx.arc(on ? zx : 165 + hs(i) * 70, y, 6, 0, 7);
                cx.fill();
                h.T('2+', on ? zx : 165 + hs(i) * 70, y + 3.5, '#fff', 8);
                const cxp = 400 + (1 - ph) * 68, y2 = 185 + hs(i + 60) * 66;
                cx.fillStyle = '#38bdf8';
                cx.beginPath();
                cx.arc(on ? (470 - ph * 70) : 405 + hs(i + 9) * 60, y2, 6, 0, 7);
                cx.fill();
                h.T('2+', on ? (470 - ph * 70) : 405 + hs(i + 9) * 60, y2 + 3.5, '#04263a', 8);
            }
            h.T('المصعد (−): Zn', 149, 102, '#e2e8f0', 11);
            h.T('المهبط (+): Cu', 479, 102, '#e2e8f0', 11);
            h.T('ZnSO₄', 155, 282, '#bfdbfe', 12);
            h.T('CuSO₄', 485, 282, '#bbf7d0', 12);
            h.T('Zn → Zn²⁺ + 2e⁻ (أكسدة)', 155, 300, '#fca5a5', 11);
            h.T('Cu²⁺ + 2e⁻ → Cu (اختزال)', 485, 300, '#7dd3fc', 11);
            h.T('● إلكترونات  ● كاتيونات  ● أنيونات', 320, H - 8, '#94a3b8', 10);
            return `الخلية الجلفانية تحوّل الطاقة الكيميائية إلى كهربائية. عند المصعد (Zn) تحدث الأكسدة فتتحرر الإلكترونات وتنتقل عبر السلك إلى المهبط (Cu) حيث تُختزل أيونات Cu²⁺ فتترسب نحاسًا. يحافظ الجسر الملحي على تعادل الشحنة: تتحرك الأنيونات نحو المصعد والكاتيونات نحو المهبط. جهد الخلية القياسي ≈ 1.10 V، والمقروء الآن ${E.toFixed(2)} V. ${on ? 'الدارة مغلقة والتيار يمر.' : 'الجسر مفتوح فتنقطع الدارة ولا يمر تيار.'}`;
        } };
    S.electro = { c: [R('v', 'فرق الجهد (V)', 1, 12, 1, 6), R('c', 'تركيز المحلول (نسبي)', 1, 10, 1, 5), R('t', 'زمن التحليل (min)', 1, 30, 1, 10)], f(v, t) { return YQ_ELECF(cx, W, H, v, t, 0); } };
    S.tyndall = { c: [R('m', 'نوع المخلوط (0 محلول، 1 غروي، 2 معلق)', 0, 2, 1, 1), R('d', 'تركيز الجسيمات (نسبي)', 1, 10, 1, 5), R('l', 'شدة الضوء', 1, 10, 1, 7)], f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, m = v.m, I0 = .25 + v.l * .07, hs = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
            h.bg(W, H);
            cx.fillStyle = '#334155';
            cx.fillRect(18, 150, 62, 40);
            cx.fillStyle = '#fbbf24';
            cx.fillRect(80, 156, 10, 28);
            h.T('مصدر الضوء', 50, 208, '#e2e8f0', 11);
            const bx = 215, bw = 200, by = 95, bh = 165, ly = 125, beam = (x1, x2, a) => { cx.fillStyle = `rgba(253,230,138,${a})`; cx.fillRect(x1, 156, x2 - x1, 28); };
            beam(90, bx, Math.min(.8, I0));
            const lc = ['rgba(120,190,255,.22)', 'rgba(190,230,150,.28)', 'rgba(200,170,240,.34)'][m];
            cx.fillStyle = lc;
            cx.fillRect(bx + 3, ly, bw - 6, by + bh - ly);
            beam(bx, bx + bw, [.1, .2, .16][m] * I0 * 2);
            const n = m == 0 ? 70 : m == 1 ? 22 + v.d * 9 : 8 + v.d * 3;
            for (let i = 0; i < n; i++) {
                const px = bx + 10 + hs(i) * (bw - 20), py0 = ly + 8 + hs(i + 50) * (by + bh - ly - 16);
                let py = py0, pxx = px;
                if (m == 1) {
                    pxx += Math.sin(T0 * 2.2 + i) * 3;
                    py += Math.cos(T0 * 1.7 + i * 2) * 3;
                }
                else if (m == 2) {
                    py = Math.min(by + bh - 8, py0 + ((T0 * 5 + i * 7) % 40) * .6);
                }
                const inb = Math.abs(py - 170) < 18;
                if (m == 0) {
                    cx.fillStyle = 'rgba(200,230,255,.25)';
                    cx.beginPath();
                    cx.arc(pxx, py, 1, 0, 7);
                    cx.fill();
                }
                else {
                    const r = m == 1 ? 2.1 : 3 + hs(i + 9) * 4;
                    cx.fillStyle = inb ? `rgba(255,250,200,${.6 + .4 * I0})` : (m == 1 ? 'rgba(250,250,255,.45)' : 'rgba(120,90,60,.8)');
                    cx.beginPath();
                    if (m == 1)
                        cx.arc(pxx, py, r, 0, 7);
                    else {
                        for (let a = 0; a < 6; a++) {
                            const q = r * (.7 + .5 * hs(i * 7 + a));
                            cx.lineTo(pxx + q * Math.cos(a * 1.047), py + q * Math.sin(a * 1.047));
                        }
                        cx.closePath();
                    }
                    cx.fill();
                    if (inb) {
                        cx.strokeStyle = `rgba(255,244,170,${.35 * I0 * 1.6})`;
                        cx.lineWidth = 1;
                        for (let a = 0; a < 6; a++) {
                            const an = a * 1.05 + T0 * 3 + i, l = 6 + 4 * Math.sin(T0 * 5 + i + a);
                            cx.beginPath();
                            cx.moveTo(pxx, py);
                            cx.lineTo(pxx + l * Math.cos(an), py + l * Math.sin(an));
                            cx.stroke();
                        }
                    }
                }
            }
            cx.strokeStyle = '#a5d8f5';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(bx, by);
            cx.lineTo(bx + 4, by + bh);
            cx.lineTo(bx + bw - 4, by + bh);
            cx.lineTo(bx + bw, by);
            cx.stroke();
            const tr = [1, .62, .2][m];
            beam(bx + bw, 470, Math.min(.8, I0 * tr));
            cx.fillStyle = '#e5e7eb';
            cx.fillRect(470, 100, 8, 150);
            cx.fillStyle = `rgba(253,230,138,${Math.min(1, I0 * tr * 1.2)})`;
            cx.beginPath();
            cx.arc(474, 170, 12, 0, 7);
            cx.fill();
            h.T(['محلول حقيقي', 'مخلوط غروي', 'مخلوط معلق'][m], bx + bw / 2, by - 10, '#bff3ff', 13);
            h.T('الضوء النافذ ' + Math.round(tr * 100) + '%', 474, 266, '#fde68a', 10);
            const cxi = 548, cyi = 88, r = 40;
            cx.fillStyle = '#071827';
            cx.strokeStyle = '#7dd3fc';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.arc(cxi, cyi, r, 0, 7);
            cx.fill();
            cx.stroke();
            cx.save();
            cx.beginPath();
            cx.arc(cxi, cyi, r - 2, 0, 7);
            cx.clip();
            for (let i = 0; i < (m == 0 ? 30 : m == 1 ? 9 : 4); i++) {
                const qx = cxi - 30 + hs(i + 7) * 60, qy = cyi - 30 + hs(i + 17) * 60;
                cx.fillStyle = m == 2 ? 'rgba(150,110,70,.95)' : 'rgba(240,250,255,.85)';
                cx.beginPath();
                if (m == 2) {
                    for (let a = 0; a < 7; a++) {
                        const q = 9 * (.7 + .5 * hs(i * 9 + a));
                        cx.lineTo(qx + q * Math.cos(a * .9), qy + q * Math.sin(a * .9));
                    }
                    cx.closePath();
                }
                else
                    cx.arc(qx, qy, m == 0 ? 1.4 : 4, 0, 7);
                cx.fill();
            }
            cx.restore();
            h.T('تكبير الجسيمات', cxi, cyi - r - 8, '#7dd3fc', 11);
            h.T(['أقل من 1 nm', 'من 1 إلى 1000 nm', 'أكبر من 1000 nm'][m], cxi, cyi + r + 16, '#fde68a', 11);
            h.T(['الضوء يمر دون أن يظهر مساره', 'يظهر مسار الضوء بسبب التشتت', 'تشتت قوي ويقل الضوء النافذ وتترسب الجسيمات'][m], W / 2, H - 12, '#f8fafc', 12);
            return `${['المحلول الحقيقي: الجسيمات (أيونات أو جزيئات) أصغر من 1 nm، لا تشتت الضوء فلا يظهر مساره، ومخلوطه متجانس لا يترسب ولا يُفصل بالترشيح.', 'المخلوط الغروي: حجم الجسيمات بين 1 و1000 nm، فهي كبيرة بما يكفي لتشتيت الضوء وتظهر حزمة الضوء داخل المخلوط (تأثير تندال)، ولا تترسب مع الزمن ولا تُفصل بورق الترشيح العادي، مثل الحليب والضباب.', 'المخلوط المعلق: الجسيمات أكبر من 1000 nm فتشتت الضوء بقوة وتحجبه، وتترسب مع الزمن ويمكن فصلها بالترشيح، مثل ماء الطين.'][m]}\nتأثير تندال: تشتت الجسيمات الغروية الضوء في جميع الاتجاهات فنرى مساره. زيادة التركيز أو شدة الضوء تزيد وضوح الحزمة.`;
        } };
    S.boil = { c: [R('p', 'الضغط الجوي (kPa)', 30, 120, 1, 101), R('h', 'مستوى التسخين (نسبي)', 1, 10, 1, 7)], f(v, t) { const bp = 1730.63 / (8.07131 - Math.log10(v.p * 7.50062)) - 233.426; drawBase('درجة الغليان والضغط الجوي', 'الغليان يحدث عندما يساوي ضغط البخار الضغط الخارجي'); beaker(180, 100, 190, 145, .68, '#38bdf8', 'ماء'); cx.fillStyle = '#64748b'; cx.fillRect(220, 250, 110, 12); cx.fillStyle = '#f97316'; cx.globalAlpha = .25 + v.h * .06; cx.beginPath(); cx.ellipse(275, 250, 45, 14, 0, 0, Math.PI * 2); cx.fill(); cx.globalAlpha = 1; for (let i = 0; i < Math.min(30, v.h * 3); i++) {
            const x = 210 + (i * 29) % 130, y = 115 + (i * 37 + t * 20) % 125;
            cx.beginPath();
            cx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
            cx.strokeStyle = '#e0f2fe';
            cx.stroke();
        } text(`P = ${v.p} kPa`, 480, 115, '#c4b5fd', 16); text(`درجة الغليان التقريبية ${bp.toFixed(1)}°س`, 480, 150, '#fde68a', 15); text(v.p < 80 ? 'ضغط منخفض → غليان أبكر' : 'ضغط أعلى → درجة غليان أعلى', 480, 185, '#e0f2fe', 12); return `عند ضغط ${v.p} kPa، درجة غليان الماء المقدرة بالنموذج ${bp.toFixed(1)}°س. انخفاض الضغط الجوي يخفض درجة الغليان، وارتفاعه يرفعها. الحساب بمعادلة أنطوان لبخار الماء.`; } };
    const organicTitles = ['الكشف عن عدم التشبع بماء البروم', 'اختبار تولينز للألدهيدات', 'اختبار فهلنج للألدهيدات', 'تفاعل الصوديوم مع الكحول', 'كربونات الصوديوم والحموض الكربوكسيلية'];
    S.organic = { c: [R('r', 'اختبار كيميائي (0–4)', 0, 4, 1, 0), R('a', 'كمية العينة (افتراضية)', 1, 10, 1, 5), R('t', 'زمن الملاحظة (ثانية)', 1, 20, 1, 8)], f(v, t) {
            const n = Math.round(v.r), names = organicTitles;
            drawBase(names[n], 'محاكاة بصرية نوعية — لا تنفّذ هذه التفاعلات دون مختبر وإشراف مختص');
            const liquid = ['#f59e0b', '#9ca3af', '#3f8f61', '#dbeafe', '#f8fafc'][n];
            beaker(245, 90, 145, 155, .58, liquid, 'أنبوب التفاعل');
            if (n === 0) {
                cx.fillStyle = '#f8fafc';
                cx.globalAlpha = Math.min(.95, v.t / 8);
                cx.fillRect(255, 140, 125, 35);
                cx.globalAlpha = 1;
                text('زوال اللون البرتقالي', 320, 298, '#fde68a', 14);
            }
            else if (n === 1) {
                cx.fillStyle = '#64748b';
                cx.beginPath();
                cx.ellipse(318, 205, 45, 18, 0, 0, Math.PI * 2);
                cx.fill();
                for (let i = 0; i < Math.min(24, v.t * 2); i++) {
                    cx.beginPath();
                    cx.arc(285 + (i * 17) % 65, 195 + (i * 7) % 25, 2, 0, Math.PI * 2);
                    cx.fillStyle = '#d1d5db';
                    cx.fill();
                }
                text('مرآة فضية / فضة مترسبة', 320, 298, '#e5e7eb', 13);
            }
            else if (n === 2) {
                cx.fillStyle = '#9a3412';
                cx.beginPath();
                cx.ellipse(320, 210, 44, 22, 0, 0, Math.PI * 2);
                cx.fill();
                text('راسب أحمر آجري عند التسخين', 320, 298, '#fdba74', 13);
            }
            else if (n === 3) {
                for (let i = 0; i < Math.min(20, v.t); i++) {
                    cx.beginPath();
                    cx.arc(275 + (i * 19) % 90, 150 + (i * 31) % 80, 3, 0, Math.PI * 2);
                    cx.strokeStyle = '#e0f2fe';
                    cx.stroke();
                }
                text('تصاعد غاز الهيدروجين', 320, 298, '#7dd3fc', 14);
            }
            else {
                for (let i = 0; i < Math.min(30, v.t * 2); i++) {
                    cx.beginPath();
                    cx.arc(270 + (i * 13) % 100, 140 + (i * 17) % 85, 2 + i % 2, 0, Math.PI * 2);
                    cx.strokeStyle = '#f8fafc';
                    cx.stroke();
                }
                text('فقاعات CO₂', 320, 298, '#e0f2fe', 14);
            }
            const explanations = ['ماء البروم البرتقالي المصفر يزول لونه عند تفاعله مع رابطة مزدوجة في مركب غير مشبع؛ ليس اختباراً عاماً لكل المركبات العضوية.', 'يعطي كاشف تولينز مع الألدهيدات نتيجة فضية. يجب ألا تُحضّر أو تُخزّن بقاياه؛ قد تتكون مركبات فضة خطرة عند الجفاف.', 'يختزل الألدهيد محلول فهلنج عند التسخين، ويتكون راسب أحمر آجري من أكسيد النحاس الأحادي.', 'يتفاعل الصوديوم مع الكحولات مطلقاً غاز الهيدروجين ومكوناً ألكوكسيد الصوديوم؛ التفاعل خطر ويتطلب احتياطات مختبرية صارمة.', 'تتفاعل كربونات الصوديوم مع الحمض الكربوكسيلي مطلقة CO₂؛ تُلاحظ فقاعات الغاز.'];
            return explanations[n] + ' هذه محاكاة تعليمية وليست وصفة لإجراء التجربة.';
        } };
    S.catalyst = { c: [R('c', 'العامل المساعد (0 بلا، 1 بكمية قليلة، 2 أكثر)', 0, 2, 1, 1), R('T', 'درجة الحرارة (°س)', 20, 80, 5, 40), R('a', 'مساحة السطح (نسبية)', 1, 10, 1, 5)], f(v, t) { drawBase('أثر العامل المساعد في سرعة التفاعل', 'طاقة تنشيط أقل ومسار بديل للتفاعل'); const rate = (.35 + v.c * 1.25) * Math.exp((v.T - 40) / 80) * (0.5 + v.a / 10); cx.strokeStyle = '#38bdf8'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(65, 240); cx.lineTo(575, 240); cx.stroke(); cx.strokeStyle = '#64748b'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(70, 240); cx.quadraticCurveTo(250, 10, 340, 240); cx.stroke(); cx.strokeStyle = '#34d399'; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(70, 240); cx.quadraticCurveTo(250, 160 - v.c * 40, 340, 240); cx.stroke(); cx.strokeStyle = '#fbbf24'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(340, 240); cx.quadraticCurveTo(455, 100, 575, 240); cx.stroke(); text('من دون عامل مساعد', 235, 75, '#cbd5e1', 12); text('بوجود عامل مساعد', 245, 165, '#86efac', 12); text(`سرعة نسبية ≈ ${rate.toFixed(2)}`, 460, 280, '#fde68a', 16); return `العامل المساعد يوفر مساراً بديلاً بطاقة تنشيط أقل، فيزيد سرعة التفاعل دون أن يُستهلك في المحصلة، ولا يغيّر قيمة ΔH أو موضع الاتزان النهائي. السرعة النسبية المعروضة مؤشر نوعي تعليمي وليست قيمة تجريبية.`; } };
    // Register new catalogue entries, including a separate card for each qualitative test.
    E.push([910, 'chem', 'بناء الذرة: البروتونات والنيوترونات والإلكترونات', 'atomx', { p: 8, n: 8, e: 8 }], [910, 'chem', 'الخلية الجلفانية: توليد الكهرباء', 'galv', { c: 5, t: 12, b: 1 }], [910, 'chem', 'خلية التحليل الكهربائي', 'electro', { v: 6, c: 5, t: 10 }], [910, 'chem', 'تجربة تندال: تشتت الضوء في المخاليط', 'tyndall', { m: 1, d: 5, l: 7 }], [910, 'chem', 'حساب درجة الغليان وتغيرها مع الضغط', 'boil', { p: 101, h: 7 }], [910, 'chem', 'الكشف عن عدم التشبع بماء البروم', 'organic', { r: 0, a: 5, t: 8 }], [910, 'chem', 'الكشف عن الألدهيدات بكاشف تولينز', 'organic', { r: 1, a: 5, t: 8 }], [910, 'chem', 'الكشف عن الألدهيدات بمحلول فهلنج', 'organic', { r: 2, a: 5, t: 8 }], [910, 'chem', 'تفاعل الصوديوم مع الكحول (محاكاة آمنة)', 'organic', { r: 3, a: 5, t: 8 }], [910, 'chem', 'تفاعل كربونات الصوديوم مع الحموض الكربوكسيلية', 'organic', { r: 4, a: 5, t: 8 }], [910, 'chem', 'أثر العامل المساعد في سرعة التفاعل', 'catalyst', { c: 1, T: 40, a: 5 }]);
    // Fixed, topic-specific quizzes. No random questions are imported from unrelated topics.
    const fixedQuizzes = {
        atomx: [['العدد الذري يساوي عدد:', ['البروتونات', 'النيوترونات', 'البروتونات + النيوترونات'], 0], ['ذرة متعادلة فيها 11 بروتوناً، كم إلكتروناً فيها؟', ['10', '11', '12'], 1], ['العدد الكتلي يساوي:', ['p+n', 'p−n', 'n−e'], 0]],
        galv: [['في الخلية الجلفانية تتحول الطاقة:', ['الكيميائية إلى كهربائية', 'الكهربائية إلى كيميائية فقط', 'الحرارية إلى ضوئية'], 0], ['تحدث الأكسدة عند:', ['المصعد', 'المهبط', 'الجسر الملحي'], 0], ['وظيفة الجسر الملحي هي:', ['إكمال الدائرة والمحافظة على التعادل', 'زيادة كتلة الأقطاب', 'إيقاف انتقال الأيونات'], 0]],
        electro: [['في خلية التحليل الكهربائي، مصدر الطاقة هو:', ['مصدر كهربائي خارجي', 'التفاعل التلقائي وحده', 'الضوء فقط'], 0], ['تحدث عملية الاختزال عند:', ['المهبط', 'المصعد', 'الجسر الملحي'], 0], ['زيادة الشحنة المارة تزيد غالباً:', ['كمية المادة المتكونة', 'العدد الذري', 'كتلة الإلكترون'], 0]],
        tyndall: [['يظهر تأثير تندال بوضوح في:', ['المخاليط الغروية', 'المحاليل الحقيقية فقط', 'المواد النقية الصلبة فقط'], 0], ['سبب ظهور مسار الضوء هو:', ['تشتت الضوء بالجسيمات', 'انعدام الضوء', 'تحول الضوء إلى مادة'], 0], ['المحلول الحقيقي غالباً:', ['لا يظهر مسار الضوء بوضوح', 'يظهر مساراً شديداً دائماً', 'يترسب فوراً'], 0]],
        boil: [['عند انخفاض الضغط الخارجي، درجة غليان الماء:', ['تنخفض', 'ترتفع', 'لا تتغير مطلقاً'], 0], ['يحدث الغليان عندما يتساوى ضغط البخار مع:', ['الضغط الخارجي', 'الضغط داخل النواة', 'الضغط الأسموزي فقط'], 0], ['على قمة جبل، يغلي الماء عادة عند درجة:', ['أقل من 100°س', 'أعلى من 100°س', '1000°س'], 0]],
        organic: [['زوال لون ماء البروم قد يدل على وجود:', ['رابطة غير مشبعة', 'كلوريد الصوديوم فقط', 'ماء نقي فقط'], 0], ['يعطي كاشف تولينز نتيجة فضية مميزة مع:', ['الألدهيدات', 'الألكانات المشبعة دائماً', 'الأملاح المتعادلة'], 0], ['راسب فهلنج الموجب للألدهيد يكون غالباً:', ['أحمر آجري', 'أزرق شفاف فقط', 'بنفسجي'], 0], ['تفاعل الصوديوم مع الكحول يطلق:', ['الهيدروجين', 'الأكسجين', 'الكلور'], 0], ['تفاعل كربونات الصوديوم مع حمض كربوكسيلي يطلق:', ['ثاني أكسيد الكربون', 'النيتروجين', 'الأمونيا'], 0]],
        catalyst: [['العامل المساعد يزيد سرعة التفاعل لأنه:', ['يخفض طاقة التنشيط', 'يرفع طاقة النواتج دائماً', 'يُستهلك كلياً'], 0], ['العامل المساعد في المحصلة:', ['لا يُستهلك', 'يغيّر العدد الذري', 'يزيد ΔH دائماً'], 0], ['العامل المساعد يغيّر موضع الاتزان النهائي؟', ['لا', 'نعم، دائماً', 'يجعل Kc صفراً'], 0]],
        lens: [['العدسة المحدبة في العادة:', ['مجمعة للأشعة المتوازية', 'مفرقة دائماً', 'لا تكسر الضوء'], 0], ['العدسة المقعرة تعطي لجسم حقيقي صورة:', ['افتراضية معتدلة مصغرة', 'حقيقية مقلوبة دائماً', 'مساوية دائماً'], 0], ['إذا كان الجسم داخل بؤرة عدسة محدبة فالصورة:', ['افتراضية معتدلة مكبرة', 'حقيقية مقلوبة', 'لا تتكون مطلقاً'], 0]],
        micro: [['تتميز الخلية النباتية غالباً بوجود:', ['جدار خلوي وفجوة عصارية كبيرة', 'جدار من الكيتين دائماً', 'عدم وجود غشاء'], 0], ['العضية المسؤولة عن البناء الضوئي هي:', ['البلاستيدة الخضراء', 'الميتوكوندريا فقط', 'الريبوسوم'], 0], ['توجد النواة في:', ['الخلايا النباتية والحيوانية غالباً', 'الخلايا الحيوانية فقط', 'لا توجد في الخلايا حقيقية النواة'], 0]],
        blood: [['فصيلة الدم O− تُعد مانحاً عاماً لكريات الدم الحمراء ضمن التوافق الأساسي لأنها:', ['لا تحمل A أو B أو Rh(D)', 'تحمل A وB', 'تحمل Rh فقط'], 0], ['قبل نقل الدم يجب:', ['اختبار التوافق حسب البروتوكول الطبي', 'الاعتماد على اللون', 'تجاهل العامل الريزيسي'], 0], ['العامل Rh يشير هنا إلى وجود أو غياب:', ['المستضد D', 'الهيموغلوبين فقط', 'الصفائح فقط'], 0]]
    };
    const extraBanks = {
        atomx: [
            ['النظير للعنصر نفسه يختلف في عدد:', ['النيوترونات', 'البروتونات', 'الإلكترونات في الذرة المتعادلة'], 0],
            ['إذا كان عدد البروتونات 8 فإن العدد الذري:', ['8', '16', '4'], 0],
            ['النواة تحتوي على:', ['بروتونات ونيوترونات', 'إلكترونات فقط', 'بروتونات وإلكترونات'], 0],
            ['الأيون الموجب يتكون عندما تفقد الذرة:', ['إلكترونات', 'بروتونات', 'نيوترونات'], 0],
            ['ذرة عددها الذري 6 وعددها الكتلي 12، عدد النيوترونات:', ['6', '12', '18'], 0],
            ['الإلكترونات توجد غالباً:', ['حول النواة', 'داخل البروتون', 'داخل النيوترون'], 0]
        ],
        galv: [
            ['في الخلية الجلفانية تنتقل الإلكترونات في الدائرة الخارجية من:', ['المصعد إلى المهبط', 'المهبط إلى المصعد', 'الجسر الملحي إلى المصعد'], 0],
            ['الخلية الجلفانية تعمل بتفاعل:', ['تلقائي منتج للكهرباء', 'غير تلقائي يحتاج مصدراً خارجياً دائماً', 'ضوئي فقط'], 0],
            ['عند المصعد في الخلية الجلفانية تحدث:', ['الأكسدة', 'الاختزال', 'الترسيب فقط'], 0],
            ['وظيفة القطب هي:', ['توفير سطح لحدوث نصف التفاعل', 'منع انتقال الإلكترونات', 'إيقاف التفاعل'], 0],
            ['الجسر الملحي يساعد على انتقال:', ['الأيونات', 'الإلكترونات عبر المحلول مباشرة فقط', 'الذرات المتعادلة فقط'], 0],
            ['في الخلية الجلفانية تتحول الطاقة الكيميائية إلى:', ['طاقة كهربائية', 'طاقة نووية', 'طاقة صوتية فقط'], 0]
        ],
        electro: [
            ['التحليل الكهربائي يُستخدم لدفع تفاعل:', ['غير تلقائي', 'تلقائي دائماً دون طاقة', 'لا يتضمن أيونات'], 0],
            ['تنجذب الكاتيونات نحو:', ['المهبط', 'المصعد', 'مفتاح الدائرة'], 0],
            ['تنجذب الأنيونات نحو:', ['المصعد', 'المهبط', 'مصدر الضوء'], 0],
            ['في التحليل الكهربائي، الاختزال يحدث عند:', ['المهبط', 'المصعد', 'كلاهما دائماً'], 0],
            ['التيار الكهربائي في المحلول تحمله أساساً:', ['الأيونات', 'النيوترونات', 'الذرات المتعادلة وحدها'], 0],
            ['زيادة زمن التحليل مع ثبات التيار تزيد الشحنة المارة وفق:', ['Q = I × t', 'Q = I ÷ t', 'Q = t ÷ I'], 0]
        ],
        tyndall: [
            ['أي خليط يُظهر مسار حزمة الضوء غالباً؟', ['الحليب المخفف', 'محلول ملح حقيقي', 'ماء مقطر'], 0],
            ['تأثير تندال ناتج عن تفاعل الضوء مع:', ['جسيمات الغروي', 'نواة الذرة', 'سطح المرآة فقط'], 0],
            ['يمكن التمييز بتأثير تندال بين الغروي و:', ['المحلول الحقيقي', 'المادة الصلبة فقط', 'الغاز النقي فقط'], 0],
            ['عند مرور الضوء في غروي، يحدث:', ['تشتت للضوء', 'اختفاء الجسيمات', 'تكوّن بروتونات'], 0],
            ['أي وصف أدق للمحلول الحقيقي؟', ['جسيماته صغيرة جداً ولا تشتت الضوء بوضوح', 'جسيماته تترسب فوراً دائماً', 'لا يحتوي على مذيب'], 0],
            ['الغبار في شعاع ضوء مرئي مثال على مشاهدة:', ['تشتت الضوء', 'التحليل الكهربائي', 'الانعكاس الكلي فقط'], 0]
        ],
        boil: [
            ['درجة الغليان هي الدرجة التي عندها ضغط البخار يساوي:', ['الضغط الخارجي', 'الضغط داخل النواة', 'الضغط الأسموزي'], 0],
            ['عند زيادة الضغط الخارجي، درجة الغليان عادة:', ['ترتفع', 'تنخفض', 'تصبح صفراً'], 0],
            ['يتبخر السائل من سطحه:', ['عند درجات حرارة مختلفة', 'عند درجة الغليان فقط', 'فقط تحت الصفر'], 0],
            ['على المرتفعات يقل الضغط الجوي، لذلك يغلي الماء عند:', ['درجة أقل', 'درجة أعلى', 'درجة ثابتة دائماً'], 0],
            ['فقاعات الغليان تتكون داخل:', ['السائل', 'الهواء فوق السائل فقط', 'جدار الوعاء فقط'], 0],
            ['زيادة مساحة سطح السائل تؤثر مباشرة غالباً في سرعة:', ['التبخر', 'العدد الذري', 'درجة الانصهار فقط'], 0]
        ],
        catalyst: [
            ['العامل المساعد يوفّر مساراً بتكلفة طاقة تنشيط:', ['أقل', 'أعلى دائماً', 'تساوي صفراً دائماً'], 0],
            ['وجود عامل مساعد يؤثر في سرعة الوصول إلى الاتزان لكنه لا يغيّر:', ['ثابت الاتزان', 'سرعة التفاعل', 'مسار التفاعل'], 0],
            ['العامل المساعد في نهاية التفاعل:', ['يتجدد ولا يُستهلك محصلّياً', 'يتحول كله إلى ناتج', 'يزيد كتلة النواتج دائماً'], 0],
            ['طاقة التنشيط هي الطاقة اللازمة لبدء:', ['التفاعل الكيميائي', 'تكوين النواة فقط', 'انتقال الحرارة فقط'], 0],
            ['عند استخدام عامل مساعد، تزداد سرعة التفاعل غالباً بسبب:', ['زيادة نسبة التصادمات الفعالة', 'زيادة طاقة النواتج دائماً', 'تغيير نوع العناصر'], 0],
            ['العامل المساعد يغيّر قيمة ΔH للتفاعل؟', ['لا', 'نعم دائماً', 'يجعلها موجبة دائماً'], 0]
        ],
        lens: [
            ['العدسة المقعرة تكون عادة:', ['مفرقة للأشعة المتوازية', 'مجمعة دائماً', 'عاكسة فقط'], 0],
            ['البؤرة في العدسة المحدبة هي نقطة تجمع:', ['الأشعة المتوازية بعد انكسارها', 'كل الأشعة قبل دخول العدسة', 'الأشعة المنعكسة فقط'], 0],
            ['الصورة الناتجة عن عدسة مقعرة لجسم حقيقي تكون غالباً:', ['افتراضية ومعتدلة ومصغرة', 'حقيقية ومقلوبة ومكبرة', 'حقيقية ومعتدلة دائماً'], 0],
            ['عند إبعاد جسم عن عدسة محدبة خارج البؤرة، الصورة تكون:', ['حقيقية ومقلوبة', 'افتراضية دائماً', 'غير مرتبطة بالعدسة'], 0],
            ['تغيّر تحدب العدسة يؤثر في:', ['البعد البؤري', 'عدد البروتونات', 'كتلة الجسم'], 0],
            ['تحدث عملية انكسار الضوء عند انتقاله بين:', ['وسطين مختلفين بصرياً', 'جسمين لهما اللون نفسه فقط', 'فراغين متطابقين دائماً'], 0]
        ],
        micro: [
            ['الغشاء البلازمي وظيفته الأساسية:', ['تنظيم مرور المواد', 'صنع الضوء', 'تخزين المعلومات الوراثية وحده'], 0],
            ['الميتوكوندريا مرتبطة أساساً بإنتاج:', ['الطاقة المتاحة للخلية', 'الجدار الخلوي', 'صبغة اليخضور'], 0],
            ['الجدار الخلوي في الخلية النباتية يساعد على:', ['الدعم والحماية', 'تصنيع البروتين وحده', 'نقل الأكسجين في الدم'], 0],
            ['العدسة العينية والمجهر تساعدان على:', ['تكبير صورة العينة', 'زيادة كتلة العينة', 'تغيير نوع الخلية'], 0],
            ['زيادة قوة التكبير لا تعني بالضرورة زيادة:', ['الدقة', 'حجم الصورة', 'سرعة التصوير'], 0],
            ['البلاستيدات الخضراء تحتوي على صبغة:', ['اليخضور', 'الهيموغلوبين', 'الميلانين فقط'], 0]
        ],
        blood: [
            ['وظيفة كريات الدم الحمراء الأساسية هي نقل:', ['الأكسجين', 'الهرمونات فقط', 'العظام'], 0],
            ['الصفائح الدموية تسهم في:', ['تخثر الدم', 'نقل الأكسجين أساساً', 'إنتاج العصارة الصفراوية'], 0],
            ['خلايا الدم البيضاء تشارك في:', ['الدفاع المناعي', 'نقل الأكسجين فقط', 'تكوين العظام'], 0],
            ['توافق فصائل الدم مهم قبل النقل لتقليل خطر:', ['التفاعل المناعي', 'تبخر البلازما', 'تغير العدد الذري'], 0],
            ['البلازما هي:', ['الجزء السائل من الدم', 'نوع من كريات الدم الحمراء', 'نسيج عظمي'], 0],
            ['العامل Rh في هذا السياق يرتبط بمستضد على:', ['سطح كريات الدم الحمراء', 'سطح الصفائح فقط', 'بلازما الدم فقط'], 0]
        ]
    };
    Object.keys(extraBanks).forEach(k => { if (fixedQuizzes[k])
        fixedQuizzes[k].push(...extraBanks[k]); });
    const organicBanks = [
        [
            ['في اختبار ماء البروم، زوال اللون يشير غالباً إلى:', ['وجود عدم تشبع', 'وجود ملح الطعام فقط', 'وجود ماء نقي'], 0],
            ['ماء البروم لونه قبل التفاعل عادة:', ['برتقالي مصفر', 'أخضر داكن', 'أبيض حليبي دائماً'], 0],
            ['الرابطة المرتبطة غالباً باختبار عدم التشبع هي:', ['رابطة متعددة بين ذرتي كربون', 'رابطة أيونية فقط', 'رابطة هيدروجينية فقط'], 0],
            ['الغرض من اختبار ماء البروم هنا هو الكشف عن:', ['عدم التشبع', 'الأيونات الموجبة فقط', 'الماء'], 0]
        ],
        [
            ['كاشف تولينز يُستخدم للكشف عن:', ['الألدهيدات', 'الألكانات فقط', 'الأملاح المتعادلة'], 0],
            ['النتيجة المميزة لاختبار تولينز الموجب هي:', ['مرآة فضية', 'راسب أزرق فقط', 'غاز أخضر'], 0],
            ['في اختبار تولنز الموجب يتأكسد الألدهيد فيتحول إلى:', ['حمض كربوكسيلي (أو ملحه)', 'ألكان', 'لا تتغير'], 0],
            ['يجب التعامل مع كاشف تولينز وفق:', ['تعليمات السلامة المخبرية', 'التذوق المباشر', 'التخزين العشوائي'], 0]
        ],
        [
            ['راسب فهلنج الموجب يكون غالباً:', ['أحمر آجري', 'أبيض', 'أسود دائماً'], 0],
            ['اختبار فهلنج يُستخدم عادة للكشف عن:', ['الألدهيدات المختزلة', 'الألكانات فقط', 'الأملاح غير الذائبة فقط'], 0],
            ['لون محلول فهلنج قبل ظهور النتيجة الموجبة يكون غالباً:', ['أزرق', 'عديم اللون دائماً', 'أصفر'], 0],
            ['تكوّن الراسب الأحمر يدل على اختزال أيونات:', ['النحاس الثنائي', 'الصوديوم', 'الكلوريد'], 0]
        ],
        [
            ['ينتج عن تفاعل الصوديوم مع الكحول غاز:', ['الهيدروجين', 'ثاني أكسيد الكربون', 'النيتروجين'], 0],
            ['تفاعل الصوديوم مع الكحول يُعد تفاعلاً بين فلز و:', ['كحول', 'غاز نبيل', 'ماء مقطر فقط'], 0],
            ['عند تفاعل الصوديوم مع الكحول يتكون أيضاً:', ['ألكوكسيد الصوديوم', 'كلوريد الصوديوم', 'كربونات الصوديوم'], 0],
            ['هذا التفاعل يتطلب الحذر لأن الصوديوم:', ['شديد التفاعل', 'خامل تماماً', 'غاز غير قابل للاشتعال'], 0]
        ],
        [
            ['تفاعل كربونات الصوديوم مع حمض كربوكسيلي ينتج غاز:', ['ثاني أكسيد الكربون', 'الأكسجين', 'الهيدروجين فقط'], 0],
            ['يمكن الاستدلال على انطلاق الغاز من:', ['ظهور فقاعات', 'تكوّن مرآة فضية', 'اختفاء كل السائل فوراً'], 0],
            ['الكربونات مع الحمض تعطي عادة ملحاً وماءً و:', ['ثاني أكسيد الكربون', 'النيتروجين', 'الكلور'], 0],
            ['وجود فقاعات في هذا التفاعل يدل على انطلاق:', ['غاز', 'إلكترونات حرة فقط', 'ضوء مرئي بالضرورة'], 0]
        ]
    ];
    // Focused assessment banks: every question is tied to the named simulation, its controls, or its observable result.
    const focusedBanks = {
        atomx: [
            ['في محاكاة بناء الذرة، أي جسيم يحدد هوية العنصر؟', ['البروتون', 'النيوترون', 'الإلكترون'], 0],
            ['إذا أضفت بروتوناً واحداً إلى نواة الذرة، ماذا يتغير؟', ['العدد الذري وهوية العنصر', 'عدد النيوترونات فقط', 'شحنة الإلكترون'], 0],
            ['في الذرة المتعادلة، عند ضبط البروتونات على 8، كم إلكتروناً يلزم؟', ['8', '7', '9'], 0],
            ['ما الجسيم الذي تضيفه إلى النواة لتغيير النظير مع بقاء العنصر نفسه؟', ['النيوترون', 'البروتون', 'الإلكترون'], 0],
            ['إذا زاد عدد الإلكترونات عن عدد البروتونات بواحد، تصبح الذرة:', ['أيوناً سالباً', 'أيوناً موجباً', 'متعادلة'], 0],
            ['أين تضع البروتونات والنيوترونات في نموذج الذرة؟', ['في النواة', 'في مستوى الطاقة الخارجي فقط', 'خارج الذرة'], 0],
            ['في النموذج، إزالة إلكترون واحد من ذرة متعادلة تجعل شحنتها:', ['موجبة', 'سالبة', 'صفراً دائماً'], 0],
            ['العدد الكتلي في بناء الذرة يساوي مجموع:', ['البروتونات والنيوترونات', 'البروتونات والإلكترونات', 'النيوترونات والإلكترونات'], 0],
            ['ذرة فيها 6 بروتونات و6 نيوترونات؛ عددها الكتلي:', ['12', '6', '18'], 0],
            ['أي تغيير لا يبدل هوية العنصر؟', ['تغيير عدد النيوترونات فقط', 'تغيير عدد البروتونات', 'تحويل كل البروتونات إلى إلكترونات'], 0]
        ],
        galv: [
            ['في محاكاة الخلية الجلفانية، ما التحول الطاقي الذي تمثله الخلية؟', ['كيميائية إلى كهربائية', 'كهربائية إلى كيميائية بفعل مصدر خارجي', 'ضوئية إلى كيميائية'], 0],
            ['ما وظيفة الجسر الملحي في تركيب الخلية الظاهر بالمحاكاة؟', ['إكمال الدائرة والمحافظة على التعادل الأيوني', 'نقل الإلكترونات داخل السلك الخارجي', 'منع حركة الأيونات'], 0],
            ['في الدائرة الخارجية للخلية الجلفانية، تنتقل الإلكترونات من:', ['المصعد إلى المهبط', 'المهبط إلى المصعد', 'الجسر الملحي إلى القطبين'], 0],
            ['عند المصعد في الخلية الجلفانية تحدث عملية:', ['الأكسدة', 'الاختزال', 'التعادل فقط'], 0],
            ['عند المهبط في الخلية الجلفانية تحدث عملية:', ['الاختزال', 'الأكسدة', 'التبخر'], 0],
            ['إذا انقطع السلك الخارجي في نموذج الخلية، ماذا يحدث للتيار؟', ['تتوقف الدائرة عن تمرير التيار', 'يزداد التيار حتماً', 'يستمر التيار كما هو'], 0],
            ['أي جزء في النموذج يسمح بانتقال الأيونات بين نصفي الخلية؟', ['الجسر الملحي', 'السلك المعدني الخارجي', 'الفولتميتر فقط'], 0],
            ['ما الذي يقيسه الفولتميتر الموصول بالخلية؟', ['فرق الجهد بين القطبين', 'كتلة القطبين', 'عدد الأيونات في الجسر'], 0],
            ['تنتج الكهرباء في الخلية الجلفانية من حدوث:', ['تفاعل أكسدة واختزال تلقائي', 'تسخين القطبين فقط', 'تبخر المحلول'], 0],
            ['إذا لم يوجد مسار أيوني بين نصفي الخلية، فإن عمل الخلية يتأثر بسبب:', ['اختلال استمرار انتقال الشحنة', 'زيادة عدد البروتونات في النواة', 'تحول الإلكترونات إلى نيوترونات'], 0]
        ],
        electro: [
            ['في محاكاة التحليل الكهربائي، ما الذي يدفع التفاعل غير التلقائي؟', ['مصدر كهربائي خارجي', 'الجسر الملحي وحده', 'ضوء الغرفة'], 0],
            ['تتجه الكاتيونات في الخلية نحو القطب:', ['السالب (المهبط)', 'الموجب (المصعد)', 'غير المتصل بالدائرة'], 0],
            ['تتجه الأنيونات في الخلية نحو القطب:', ['الموجب (المصعد)', 'السالب (المهبط)', 'كلا القطبين دون تمييز'], 0],
            ['أين يحدث الاختزال في خلية التحليل الكهربائي؟', ['المهبط', 'المصعد', 'المحلول بعيداً عن الأقطاب فقط'], 0],
            ['أين تحدث الأكسدة في خلية التحليل الكهربائي؟', ['المصعد', 'المهبط', 'مصدر الطاقة'], 0],
            ['إذا فُصل مصدر الطاقة عن الدائرة، فإن عملية التحليل الكهربائي:', ['تتوقف أو لا تستمر بالشكل نفسه', 'تتسارع دائماً', 'تتحول تلقائياً إلى خلية جلفانية في النموذج نفسه'], 0],
            ['ما دور الأقطاب في المحاكاة؟', ['توفير أسطح لحدوث تفاعلات الأكسدة والاختزال', 'توليد النيوترونات', 'منع حركة الأيونات كلياً'], 0],
            ['عند زيادة زمن التحليل مع ثبات التيار، تزداد الشحنة المارة وفق العلاقة:', ['Q = I × t', 'Q = I ÷ t', 'Q = t ÷ I'], 0],
            ['التيار داخل المحلول الإلكتروليتي ينتقل أساساً بواسطة:', ['حركة الأيونات', 'حركة النيوترونات', 'حركة الذرات المتعادلة وحدها'], 0],
            ['أي ملاحظة يمكن أن تشير إلى حدوث تفاعل عند أحد الأقطاب في تجربة التحليل؟', ['تكوّن مادة على القطب أو ظهور غاز بحسب المحلول', 'تغيّر عدد البروتونات في الأقطاب', 'اختفاء مصدر الطاقة من الدائرة'], 0]
        ],
        tyndall: [
            ['في تجربة تندال، ما الملاحظة التي تدل على تشتت الضوء؟', ['ظهور مسار حزمة الضوء داخل الخليط', 'اختفاء الوعاء', 'تغير كتلة الضوء'], 0],
            ['أي عينة يُتوقع أن يظهر فيها مسار الضوء بوضوح في التجربة؟', ['خليط غروي مثل الحليب المخفف', 'ماء مقطر صافٍ', 'محلول ملح حقيقي شفاف'], 0],
            ['ما العامل الذي تفحصه التجربة عند تمرير حزمة ضوء في عينات مختلفة؟', ['مدى تشتت الضوء داخل العينة', 'درجة انصهار العينة', 'توصيل العينة للكهرباء فقط'], 0],
            ['إذا لم يظهر مسار الضوء بوضوح في محلول ملحي شفاف، فهذا يتفق مع أن المحلول:', ['حقيقي ولا يشتت الضوء بوضوح', 'غروي بالضرورة', 'مكوّن من جسيمات مرئية كبيرة'], 0],
            ['في تجربة تندال، لماذا تظهر الحزمة في الوسط الغروي؟', ['لأن جسيماته تشتت الضوء', 'لأن الضوء يتحول إلى مادة', 'لأن الجسيمات تنتج ضوءاً من تلقاء نفسها'], 0],
            ['للمقارنة العادلة بين العينات، ما الذي ينبغي تثبيته قدر الإمكان؟', ['شدة الضوء ومسار الحزمة والظروف نفسها', 'اسم العينة فقط', 'لون خلفية الشاشة فقط'], 0],
            ['إذا ظهر مسار الضوء في عينة ولم يظهر في أخرى شفافة، فإن الاختلاف المرتبط بالتجربة هو:', ['اختلاف تشتت الضوء بسبب الجسيمات', 'اختلاف عدد البروتونات', 'حدوث تحليل كهربائي'], 0],
            ['هل ظهور مسار الضوء هو نفسه ترسب جسيمات العينة؟', ['لا، إنه نتيجة تشتت الضوء', 'نعم، هما الظاهرة نفسها دائماً', 'نعم، لأن الضوء يكوّن راسباً'], 0],
            ['أي نتيجة تدعم وجود جسيمات غروية في العينة؟', ['رؤية مسار الضوء داخلها', 'عدم مرور أي ضوء مطلقاً في كل الحالات', 'تحول لونها إلى معدن'], 0],
            ['ما المقارنة الأساسية في هذه التجربة؟', ['عينة تشتت الضوء بوضوح وأخرى لا تشتته بوضوح', 'سائل ساخن وآخر متجمد فقط', 'قطبان معدنيان مختلفان'], 0]
        ],
        boil: [
            ['في محاكاة درجة الغليان، ما الشرط الذي يتحقق عند الغليان؟', ['يتساوى ضغط بخار السائل مع الضغط الخارجي', 'يتساوى عدد البروتونات مع الإلكترونات', 'ينعدم الضغط الخارجي دائماً'], 0],
            ['عند خفض الضغط الخارجي في إعدادات المحاكاة، درجة غليان الماء عادةً:', ['تنخفض', 'ترتفع', 'تبقى 100°س مهما تغير الضغط'], 0],
            ['عند رفع الضغط الخارجي على السائل، درجة غليانه عادةً:', ['ترتفع', 'تنخفض', 'تصبح صفراً'], 0],
            ['إذا أظهرت المحاكاة ضغطاً جوياً أقل كما في المرتفعات، فما المتوقع للماء؟', ['يغلي عند درجة أقل من المعتاد', 'يغلي عند درجة أعلى حتماً', 'لا يمكن أن يغلي'], 0],
            ['أي متغير تتحكم به التجربة لدراسة تغير درجة الغليان؟', ['الضغط الخارجي', 'عدد البروتونات في الماء', 'لون الوعاء فقط'], 0],
            ['ما الفرق بين التبخر والغليان الذي ينبغي ملاحظته في هذه التجربة؟', ['الغليان يحدث عندما يساوي ضغط البخار الضغط الخارجي', 'التبخر يحدث فقط عند 100°س', 'الغليان يحدث من سطح السائل فقط دون داخله'], 0],
            ['إذا بقي نوع السائل نفسه وتغير الضغط الخارجي، فإن درجة الغليان:', ['يمكن أن تتغير', 'لا تتغير مطلقاً', 'تساوي دائماً درجة حرارة الغرفة'], 0],
            ['ما الذي ينبغي تثبيته عند مقارنة أثر الضغط في درجة الغليان؟', ['نوع السائل والظروف الأخرى قدر الإمكان', 'الضغط نفسه في كل المحاولات', 'اسم التجربة فقط'], 0],
            ['لماذا قد ينضج الطعام ببطء أكبر في المرتفعات عند استخدام الماء المغلي؟', ['لأن الماء يغلي عند درجة حرارة أقل', 'لأن الماء يغلي عند درجة أعلى دائماً', 'لأن الضغط لا يؤثر في الغليان'], 0],
            ['أي استنتاج يطابق علاقة الضغط بدرجة غليان الماء؟', ['زيادة الضغط الخارجي ترفع درجة الغليان عادةً', 'خفض الضغط يرفع درجة الغليان دائماً', 'درجة الغليان مستقلة عن الضغط'], 0]
        ],
        catalyst: [
            ['في تجربة أثر العامل المساعد، ما المتغير الذي تتم ملاحظته أساساً؟', ['سرعة التفاعل', 'العدد الذري للنواتج', 'لون الضوء المحيط'], 0],
            ['كيف يزيد العامل المساعد سرعة التفاعل في النموذج؟', ['يوفر مساراً أقل في طاقة التنشيط', 'يرفع طاقة التنشيط', 'يزيد كتلة المواد المتفاعلة'], 0],
            ['عند مقارنة تفاعل بوجود عامل مساعد وآخر بدونه، ما الذي يجب تثبيته؟', ['كمية المواد ودرجة الحرارة وبقية الظروف', 'وجود العامل المساعد في الحالتين فقط', 'سرعة التفاعل النهائية فقط'], 0],
            ['هل يُستهلك العامل المساعد كلياً في المحصلة أثناء التفاعل؟', ['لا', 'نعم دائماً', 'يتحول كله إلى غاز'], 0],
            ['ما المتوقع عند إضافة عامل مساعد مناسب إلى التفاعل؟', ['زيادة سرعة التفاعل', 'توقف التصادمات الفعالة', 'تغير هوية العناصر'], 0],
            ['هل يغيّر العامل المساعد قيمة التغير في الإنثالبي للتفاعل؟', ['لا، لا يغير فرق طاقة المتفاعلات والنواتج', 'نعم، يجعلها صفراً دائماً', 'نعم، يغير النواتج إلى عناصر أخرى'], 0],
            ['إذا كان منحنى التفاعل مع العامل المساعد أقل ارتفاعاً في حاجز الطاقة، فهذا يعني:', ['انخفاض طاقة التنشيط', 'زيادة طاقة التنشيط', 'اختفاء النواتج'], 0],
            ['ما المقارنة الصحيحة في هذه التجربة؟', ['سرعة التفاعل في وجود العامل المساعد وغيابه', 'كتلة العامل المساعد فقط دون تفاعل', 'لون الوعاءين فقط'], 0],
            ['هل يجعل العامل المساعد التفاعل الطارد للحرارة ماصاً للحرارة؟', ['لا', 'نعم دائماً', 'فقط إذا كان صلباً'], 0],
            ['إذا لم تتغير سرعة التفاعل بعد إضافة المادة، فأي احتمال ينبغي التحقق منه؟', ['أن المادة ليست عاملاً مساعداً مناسباً لهذا التفاعل', 'أن الذرات فقدت نواها', 'أن طاقة التنشيط أصبحت سالبة حتماً'], 0]
        ],
        lens: [
            ['في محاكاة العدسات، أي عدسة تجمع الأشعة المتوازية عادةً؟', ['المحدبة', 'المقعرة', 'كلتاهما تفرقان الأشعة دائماً'], 0],
            ['أي عدسة تفرق الأشعة المتوازية عادةً؟', ['المقعرة', 'المحدبة', 'العدسة المستوية دائماً'], 0],
            ['عند وضع جسم حقيقي داخل البؤرة أمام عدسة محدبة، تكون الصورة عادةً:', ['افتراضية معتدلة مكبرة', 'حقيقية مقلوبة', 'حقيقية مصغرة دائماً'], 0],
            ['ما المتغير الذي تغيّره عند تحريك الجسم في المحاكاة؟', ['بعد الجسم عن العدسة', 'عدد البروتونات في الجسم', 'معامل انكسار الهواء تلقائياً'], 0],
            ['إذا غيّرت نوع العدسة من محدبة إلى مقعرة، فما الذي يجب إعادة ملاحظته؟', ['مسار الأشعة وصفات الصورة', 'كتلة الجسم', 'درجة غليان العدسة'], 0],
            ['في العدسة المحدبة، إذا كان الجسم خارج البؤرة، تكون الصورة في الحالة المعتادة:', ['حقيقية ومقلوبة', 'افتراضية ومعتدلة دائماً', 'غير مرتبطة بموقع الجسم'], 0],
            ['ما أثر تغيير البعد البؤري في محاكاة العدسة؟', ['يغيّر موضع البؤرة وتكوّن الصورة', 'يغيّر لون الجسم فقط', 'يوقف انكسار الضوء'], 0],
            ['الصورة التي تظهر على شاشة في تجربة العدسات تكون:', ['حقيقية', 'افتراضية لا يمكن استقبالها على شاشة', 'دائماً معتدلة ومكبرة'], 0],
            ['ما الظاهرة الضوئية التي تعتمد عليها العدسات لتغيير اتجاه الأشعة؟', ['الانكسار', 'التحليل الكهربائي', 'الانتشار الأسموزي'], 0],
            ['لإجراء مقارنة صحيحة بين العدستين، ما الأفضل؟', ['استخدام موضع جسم وظروف متقاربة ثم مقارنة مسار الأشعة والصورة', 'تغيير جميع المتغيرات معاً', 'مقارنة لون العدستين فقط'], 0]
        ],
        micro: [
            ['في محاكاة المجهر، ما أثر زيادة قوة العدسة الشيئية؟', ['زيادة التكبير', 'تغيير نوع الخلية من نباتية إلى حيوانية', 'إزالة الشريحة'], 0],
            ['إذا كانت الصورة ضبابية في المحاكاة، فما الإعداد الذي تضبطه أولاً؟', ['التركيز', 'عدد النيوترونات', 'فصيلة الدم'], 0],
            ['ما أثر زيادة شدة الإضاءة في عرض العينة؟', ['تجعل العينة أكثر إضاءة وقد تساعد على رؤيتها', 'تزيد عدد عضيات الخلية', 'تحول الخلية النباتية إلى حيوانية'], 0],
            ['أي بنية يُتوقع تمييزها في نموذج الخلية النباتية ولا تظهر عادةً في الخلية الحيوانية؟', ['الجدار الخلوي', 'الغشاء البلازمي', 'السيتوبلازم'], 0],
            ['عند مقارنة خلية نباتية بخلية حيوانية في المحاكاة، ما الذي تختاره؟', ['نوع العينة أو الخلية', 'ضغط الهواء الخارجي', 'نوع القطب الكهربائي'], 0],
            ['ما وظيفة ضبط التركيز في تجربة المجهر؟', ['جعل تفاصيل العينة أوضح', 'زيادة حجم العينة الحقيقي', 'تغيير تركيبها الكيميائي'], 0],
            ['إذا زادت قوة التكبير كثيراً دون ضبط التركيز، فقد تبدو الصورة:', ['أكبر لكن غير واضحة', 'أصغر دائماً وواضحة', 'مضيئة بلا حدود'], 0],
            ['ما الذي ينبغي أن يبقى ثابتاً عند مقارنة تأثير قوتي تكبير؟', ['العينة والإضاءة والتركيز قدر الإمكان', 'نوع العينة يتغير كل مرة', 'كل الإعدادات تتغير معاً'], 0],
            ['ما الغرض من تدوير الشريحة في المحاكاة؟', ['تغيير اتجاه عرض العينة', 'زيادة عدد الخلايا في العينة', 'تغيير قوة العدسة تلقائياً'], 0],
            ['إذا ظهرت بنية خلوية أوضح بعد تعديل التركيز، فهذا يدل على أن:', ['الوضوح يعتمد على ضبط بؤرة المجهر', 'تركيب الخلية تغيّر', 'العدسة أنتجت خلايا جديدة'], 0]
        ],
        blood: [
            ['في محاكاة نقل الدم، ما العاملان اللذان تختارهما لتحديد توافق المتبرع والمستقبل؟', ['فصيلة ABO والعامل Rh', 'لون الدم ودرجة حرارته فقط', 'طول الشخص ووزنه'], 0],
            ['في النموذج، ماذا تعني إشارة Rh السالب للمتبرع؟', ['غياب المستضد D على كريات دمه', 'وجود المستضد A دائماً', 'غياب الهيموغلوبين'], 0],
            ['وفق قواعد توافق كريات الدم الحمراء الأساسية، يمكن لمتلقي O− استقبال دم من:', ['O− فقط', 'أي فصيلة دون اختبار', 'AB+ فقط'], 0],
            ['في محاكاة التوافق، إذا كان المتبرع يحمل مستضداً لا يناسب المستقبل، فالنتيجة:', ['عدم توافق بحسب قواعد النموذج', 'توافق مضمون', 'اختفاء العامل Rh'], 0],
            ['ما الذي ينبغي فحصه قبل اعتماد نتيجة نقل الدم في المحاكاة؟', ['توافق فصيلة المتبرع مع فصيلة المستقبل وRh', 'لون ملابس المتبرع', 'درجة إضاءة الشاشة'], 0],
            ['ما الذي يتغير عند اختيار فصيلة مختلفة للمتبرع في النموذج؟', ['نتيجة التوافق مع المستقبل', 'عدد حجرات القلب', 'قوة تكبير المجهر'], 0],
            ['لماذا لا يكفي تطابق ABO وحده في إعدادات المحاكاة؟', ['لأن عامل Rh يؤثر أيضاً في التوافق', 'لأن فصائل الدم لا علاقة لها بالمستضدات', 'لأن كل الفصائل متطابقة'], 0],
            ['إذا كان المتبرع O+ والمستقبل O−، فبحسب قواعد Rh الأساسية يكون النقل:', ['غير متوافق بسبب Rh', 'متوافقاً دائماً', 'لا يتأثر بعامل Rh'], 0],
            ['ما المقصود بنتيجة «متوافق» في هذه المحاكاة؟', ['أن تركيبة فصيلة المتبرع وRh مقبولة وفق قواعد النموذج', 'أن حجم الدم متساوٍ بالضرورة', 'أن لون الدمين متطابق فقط'], 0],
            ['هل تُغني نتيجة المحاكاة عن فحوصات التوافق الطبية الفعلية؟', ['لا، المحاكاة تعليمية ولا تستبدل الإجراءات الطبية', 'نعم في كل الحالات', 'نعم إذا كان اللون متشابهاً'], 0]
        ]
    };
    const focusedOrganicBanks = [
        [
            ['ما لون ماء البروم قبل إضافته إلى العينة في اختبار عدم التشبع؟', ['برتقالي مصفر', 'أزرق داكن', 'عديم اللون دائماً'], 0],
            ['ما الملاحظة الدالة على نتيجة موجبة لاختبار ماء البروم؟', ['زوال لون البروم', 'تكوّن مرآة فضية', 'ظهور راسب أحمر آجري'], 0],
            ['ما نوع العينة الذي يكشف عنه اختبار ماء البروم في هذه التجربة؟', ['مركب غير مشبع', 'ملح الطعام حصراً', 'ماء مقطر'], 0],
            ['عند إجراء المقارنة، لماذا نضيف كميات متقاربة من ماء البروم إلى العينات؟', ['للمقارنة العادلة بين تغير اللون', 'لزيادة عدد البروتونات', 'لمنع حدوث أي تلامس'], 0],
            ['إذا بقي لون البروم ظاهراً بعد إضافته إلى العينة، فهذا يعني أن نتيجة زوال اللون:', ['لم تُلاحظ في هذه العينة', 'موجبة حتماً', 'تدل على تكون مرآة فضية'], 0],
            ['ما الرابطة التي ترتبط غالباً بالاستجابة الإيجابية لاختبار عدم التشبع؟', ['رابطة متعددة بين ذرتي كربون', 'رابطة أيونية بين ملحين فقط', 'رابطة فلزية'], 0],
            ['ما الذي يجب تسجيله عند اختبار العينة بماء البروم؟', ['لون العينة قبل الإضافة وبعدها', 'كتلة المجهر', 'ضغط الخلية الجلفانية'], 0],
            ['إذا اختفى لون البروم سريعاً عند إضافته إلى العينة، فما الاستنتاج المناسب ضمن الاختبار؟', ['وجود عدم تشبع محتمل', 'وجود ألدهيد مثبت حتماً', 'وجود كربونات حتماً'], 0],
            ['أي اختبار من الخيارات هو موضوع هذه التجربة تحديداً؟', ['الكشف عن عدم التشبع بماء البروم', 'اختبار تولينز', 'اختبار فهلنج'], 0],
            ['ما الدليل المرئي الذي تعتمد عليه التجربة بدلاً من قياس التيار؟', ['تغير لون ماء البروم', 'قراءة الفولتميتر', 'تغير صورة العدسة'], 0]
        ],
        [
            ['ما الكاشف المستخدم في تجربة تولينز؟', ['كاشف تولينز', 'ماء البروم', 'محلول فهلنج'], 0],
            ['ما العلامة المرئية المميزة للنتيجة الموجبة في اختبار تولينز؟', ['تكوّن مرآة فضية أو ترسب فضي', 'زوال اللون البرتقالي لماء البروم', 'راسب أحمر آجري'], 0],
            ['ما المجموعة الوظيفية التي يستهدفها اختبار تولينز في هذه التجربة؟', ['الألدهيد', 'الرابطة المزدوجة فقط', 'مجموعة الكربونات'], 0],
            ['إذا لم تتكون طبقة أو مرآة فضية، فما الذي يمكن قوله عن النتيجة المرئية؟', ['لم تظهر علامة تولينز الموجبة المتوقعة', 'الاختبار موجب حتماً', 'تكون راسب فهلنج'], 0],
            ['ما الذي ينبغي ملاحظته في أنبوب اختبار تولينز؟', ['ظهور طبقة فضية على جدار الأنبوب أو ترسب فضي', 'انطلاق فقاعات ثاني أكسيد الكربون فقط', 'زوال لون البروم'], 0],
            ['ما وظيفة كاشف تولينز في هذه التجربة؟', ['المساعدة في الكشف عن الألدهيدات', 'الكشف عن ضغط بخار السائل', 'تحديد قوة العدسة'], 0],
            ['أي نتيجة تخص اختبار تولينز لا اختبار فهلنج؟', ['مرآة فضية', 'راسب أحمر آجري', 'زوال لون ماء البروم'], 0],
            ['لماذا يجب عدم استخدام كاشف تولينز خارج إجراءات المختبر المعتمدة؟', ['لأن التعامل معه يتطلب احتياطات سلامة خاصة', 'لأنه ماء شرب', 'لأنه لا يتفاعل مع أي مادة'], 0],
            ['عند مقارنة عينة مرجعية بعينة مجهولة، ما الملاحظة التي تبحث عنها في اختبار تولينز؟', ['وجود علامة فضية مميزة', 'وجود لون بروم برتقالي', 'انخفاض درجة غليان الماء'], 0],
            ['أي وصف يطابق نتيجة الاختبار الموجبة للألدهيد في التجربة؟', ['تكوّن فضة على جدار الأنبوب', 'تكوّن راسب أحمر آجري من فهلنج', 'انطلاق ثاني أكسيد الكربون من الكربونات'], 0]
        ],
        [
            ['ما لون محلول فهلنج عادة قبل ظهور النتيجة الموجبة؟', ['أزرق', 'برتقالي مصفر', 'فضي لامع'], 0],
            ['ما العلامة المميزة لنتيجة فهلنج الموجبة للألدهيد؟', ['راسب أحمر آجري', 'مرآة فضية', 'زوال لون ماء البروم'], 0],
            ['ما نوع المركبات الذي يفحصه اختبار فهلنج في هذه التجربة؟', ['الألدهيدات القابلة للاختبار بالكاشف', 'المركبات غير المشبعة فقط', 'الكربونات فقط'], 0],
            ['إذا بقي محلول فهلنج أزرق ولم يتكون الراسب المتوقع، فما الذي لم يُلاحظ؟', ['النتيجة الموجبة المميزة', 'مرآة فضية', 'زوال لون البروم'], 0],
            ['ما الذي تسجله عند متابعة تفاعل فهلنج؟', ['تغير اللون وتكون الراسب', 'قراءة ضغط الهواء', 'اتجاه الضوء في العدسة'], 0],
            ['ما الذي يختزل في اختبار فهلنج الموجب ويؤدي إلى الراسب الأحمر؟', ['أيونات النحاس الثنائي', 'أيونات الصوديوم إلى فضة', 'جزيئات البروم إلى غاز'], 0],
            ['أي نتيجة تميز فهلنج عن تولينز؟', ['راسب أحمر آجري بدلاً من المرآة الفضية', 'زوال لون ماء البروم', 'انطلاق ثاني أكسيد الكربون من الحمض'], 0],
            ['ما الغرض من تسخين خليط فهلنج وفق خطوات الاختبار المعتادة؟', ['المساعدة على ظهور التفاعل والنتيجة المميزة', 'تغيير عدد البروتونات', 'قياس شدة الضوء'], 0],
            ['إذا ظهرت طبقة فضية بدلاً من راسب أحمر آجري، فأي اختبار قد تكون علامته المقصودة؟', ['تولينز', 'فهلنج', 'ماء البروم'], 0],
            ['ما الاستنتاج المتوافق مع ظهور راسب أحمر آجري في اختبار فهلنج؟', ['نتيجة موجبة للكاشف مع العينة', 'نتيجة موجبة لاختبار ماء البروم حصراً', 'دليل على خلية جلفانية'], 0]
        ],
        [
            ['ما الغاز المتوقع عند تفاعل الصوديوم مع الكحول في هذه التجربة؟', ['الهيدروجين', 'ثاني أكسيد الكربون', 'الأكسجين'], 0],
            ['ما نوع المواد المتفاعلة في التجربة؟', ['فلز الصوديوم وكحول', 'كربونات الصوديوم وحمض كربوكسيلي', 'ألدهيد وكاشف تولينز'], 0],
            ['ما المركب الذي يتكون مع انطلاق الهيدروجين عند تفاعل الصوديوم مع الكحول؟', ['ألكوكسيد الصوديوم', 'كربونات الصوديوم', 'بروميد الصوديوم حتماً'], 0],
            ['أي ملاحظة قد تدل على حدوث التفاعل في النموذج؟', ['ظهور فقاعات غازية', 'تكوّن مرآة فضية', 'زوال لون ماء البروم'], 0],
            ['لماذا تمثل هذه التجربة تفاعلاً يحتاج احتياطات سلامة؟', ['لأن الصوديوم يتفاعل ويُطلق غاز الهيدروجين القابل للاشتعال', 'لأن الكحول لا يتفاعل مطلقاً', 'لأن الناتج ماء فقط دون أي خطر'], 0],
            ['ما الذي لا ينبغي فعله مع تجربة الصوديوم والكحول؟', ['تقريب لهب من الغاز المتولد', 'متابعة الملاحظة ضمن محاكاة آمنة', 'تسجيل ظهور الفقاعات'], 0],
            ['عند استبدال اختبار ماء البروم بهذه التجربة، ما الدليل الذي يخص تفاعل الصوديوم والكحول؟', ['انطلاق غاز أثناء التفاعل', 'مرآة فضية على جدار الأنبوب', 'راسب فهلنج أحمر آجري'], 0],
            ['أي مادة تُعد فلزاً في زوج المتفاعلات؟', ['الصوديوم', 'الكحول', 'الهيدروجين الناتج'], 0],
            ['ما الهدف من ملاحظة الفقاعات في هذه المحاكاة؟', ['الاستدلال على انطلاق الغاز أثناء التفاعل', 'قياس قوة العدسة', 'تحديد فصيلة الدم'], 0],
            ['أي عبارة تصف التفاعل المعروض؟', ['تفاعل الصوديوم مع الكحول مطلقاً الهيدروجين', 'تفاعل كربونات مع حمض مطلقاً ثاني أكسيد الكربون', 'اختبار ألدهيد بكاشف تولينز'], 0]
        ],
        [
            ['ما الغاز المتوقع عند تفاعل كربونات الصوديوم مع حمض كربوكسيلي؟', ['ثاني أكسيد الكربون', 'الهيدروجين', 'الأكسجين'], 0],
            ['ما الملاحظة المرئية التي تدل على انطلاق الغاز في هذه التجربة؟', ['ظهور فقاعات', 'تكوّن مرآة فضية', 'اختفاء العدسة'], 0],
            ['أي مادتين تتفاعلان في هذه التجربة؟', ['كربونات الصوديوم وحمض كربوكسيلي', 'الصوديوم الفلزي والكحول', 'ألدهيد وكاشف فهلنج'], 0],
            ['ما النواتج العامة لتفاعل الكربونات مع الحمض؟', ['ملح وماء وثاني أكسيد الكربون', 'فضة وهيدروجين', 'بروم وماء فقط'], 0],
            ['إذا لم تظهر فقاعات بعد خلط المواد، فما الملاحظة التي لم تتحقق؟', ['انطلاق الغاز المرئي المتوقع', 'تكون مرآة فضية', 'تغير شكل العدسة'], 0],
            ['ما الدليل الذي يميز هذا التفاعل عن اختبار تولينز؟', ['فقاعات ثاني أكسيد الكربون', 'مرآة فضية', 'زوال لون ماء البروم'], 0],
            ['ما دور الحمض في التفاعل المعروض؟', ['يتفاعل مع الكربونات مطلقاً ثاني أكسيد الكربون', 'يعمل كعدسة محدبة', 'يمنع أي تفاعل مع الكربونات'], 0],
            ['أي اختبار بسيط للغاز يمكن أن يؤكد أنه ثاني أكسيد الكربون في المختبر المدرسي المجهز؟', ['تمريره في ماء الجير وملاحظة تعكره', 'تقريبه من اللهب لاختبار الهيدروجين', 'ملاحظة مرآة فضية'], 0],
            ['عند تكرار التجربة بكميات متقاربة، ما الذي تقارنه؟', ['سرعة أو شدة ظهور الفقاعات', 'قوة تكبير المجهر', 'شدة تشتت الضوء'], 0],
            ['أي عبارة تخص التجربة الحالية تحديداً؟', ['الكربونات مع الحمض تنتج ثاني أكسيد الكربون', 'الصوديوم مع الكحول ينتج الهيدروجين', 'تولينز يعطي مرآة فضية'], 0]
        ]
    ];
    // Keyed banks for the original catalogue. These replace the old mixed-topic fallback.
    const legacyFacts = { "float": ["عند مقارنة الجسم بالسائل، ما الذي يحدد الطفو أو الغرق؟", "كثافة الجسم مقارنة بكثافة السائل", ["لون الجسم", "درجة حرارة الغرفة"]], "photo": ["في محاكاة البناء الضوئي، ما الغاز الذي يمتصه النبات لإنتاج الغذاء؟", "ثاني أكسيد الكربون", ["النيتروجين", "الهيدروجين"]], "states": ["عند تسخين المادة في نموذج حالات المادة، ماذا يحدث عادة لحركة جسيماتها؟", "تزداد حركة الجسيمات", ["تتوقف الجسيمات", "تختفي الجسيمات"]], "pend": ["في تجربة البندول، ما المتغير الذي يؤثر في الزمن الدوري عند ثبات الجاذبية؟", "طول البندول", ["لون الثقل", "مادة الخيط فقط"]], "refr": ["في محاكاة انكسار الضوء، لماذا يتغير اتجاه الشعاع عند الحد الفاصل؟", "لتغير سرعة الضوء بين الوسطين", ["لأن الضوء يتحول إلى صوت", "لأن كتلة الشعاع تتغير"]], "proj": ["في تجربة المقذوفات، ما العاملان اللذان يحددان مسار المقذوف في النموذج؟", "سرعة الانطلاق وزاوية القذف", ["لون المقذوف وكتلته فقط", "اسم الجسم"]], "boyle": ["عند ثبات درجة الحرارة في تجربة بويل، ماذا يحدث للحجم إذا زاد الضغط؟", "يقل الحجم", ["يزداد الحجم", "يبقى الحجم ثابتاً دائماً"]], "ohm": ["في تجربة قانون أوم، كيف نحسب شدة التيار عند معرفة الجهد والمقاومة؟", "I = V ÷ R", ["I = V × R", "I = R ÷ V"]], "ph": ["في محاكاة المعايرة، ما العلامة التي تساعد على تحديد نقطة النهاية؟", "تغير لون الدليل قرب نقطة النهاية", ["تكوّن مرآة فضية", "ظهور مسار الضوء"]], "pun": ["في مربع بانيت، ماذا تمثل الرموز على حواف المربع؟", "الأمشاج الممكنة من الأبوين", ["أعضاء جسم الكائن", "مراحل دورة الماء"]], "acid": ["في تجربة مقياس pH، ماذا يدل الرقم الأقل من 7 عادة؟", "محلول حمضي", ["محلول قاعدي", "محلول متعادل دائماً"]], "circ": ["في الدائرة على التوالي، ماذا يحدث للتيار في العناصر المتصلة؟", "يمر التيار نفسه في جميع العناصر", ["يختلف التيار في كل عنصر دائماً", "لا يمر تيار"]], "moon": ["في نموذج أطوار القمر، ما الذي يحدد الجزء المضاء المرئي من الأرض؟", "موضع القمر بالنسبة إلى الأرض والشمس", ["تغير شكل القمر فعلياً", "ظل الأرض في كل طور"]], "spring": ["في تجربة قانون هوك ضمن حد المرونة، كيف ترتبط الاستطالة بالقوة؟", "تتناسب طردياً مع القوة", ["تتناسب عكسياً دائماً", "لا تتأثر بالقوة"]], "wave": ["في محاكاة الموجات، كيف ترتبط سرعة الموجة بالتردد والطول الموجي؟", "v = fλ", ["v = f ÷ λ", "v = f + λ"]], "mol": ["في تجربة المولارية، كيف تحسب التركيز المولاري؟", "عدد مولات المذاب ÷ حجم المحلول باللتر", ["كتلة المذاب × حجم المحلول", "حجم المحلول ÷ الكتلة المولية"]], "rate": ["في تجربة سرعة التفاعل، ما أثر رفع درجة الحرارة غالباً؟", "زيادة سرعة التفاعل", ["إيقاف التصادمات الفعالة", "خفض السرعة دائماً"]], "faraday": ["في تجربة الحث الكهرومغناطيسي، متى يتولد جهد حثي في الملف؟", "عند تغير الفيض المغناطيسي خلاله", ["عند ثبات الفيض تماماً", "عند انعدام الملف"]], "decay": ["في محاكاة عمر النصف، ماذا يعني عمر النصف؟", "الزمن اللازم لانخفاض عدد الأنوية غير المتحللة إلى النصف", ["الزمن اللازم لتحلل كل الأنوية", "زمن تضاعف عدد الأنوية"]], "growth": ["في تجربة نمو النبات، ما أثر نقص الماء عادة في نمو النبات؟", "يحد من النمو", ["يزيد النمو بلا حدود", "لا يؤثر في النبات"]], "magnet": ["في تجربة المغناطيس، ما الذي يؤثر في قوة التجاذب المغناطيسي في النموذج؟", "نوع المادة والمسافة عن المغناطيس", ["لون المادة", "شكل اسم التجربة"]], "shadow": ["في تجربة الظل، ماذا يحدث للظل عادة عندما يقترب الجسم من مصدر الضوء؟", "يكبر الظل", ["يختفي الظل دائماً", "يبقى حجمه ثابتاً في كل الحالات"]], "soil": ["في تجربة نفاذية التربة، أي تربة تسمح عادة بمرور الماء أسرع؟", "التربة الحصوية أو الرملية الخشنة", ["الطين شديد الدقة", "الطين المضغوط دائماً"]], "heart": ["في محاكاة القلب والنشاط، ماذا يحدث لمعدل النبض غالباً أثناء النشاط البدني؟", "يرتفع", ["ينخفض إلى الصفر", "يبقى ثابتاً تماماً"]], "digest": ["في محاكاة الهضم، ما دور الإنزيمات الهاضمة؟", "تسريع تفكيك جزيئات الغذاء الكبيرة", ["تكوين خلايا الدم الحمراء", "نقل الأكسجين في الدم"]], "react": ["في تجربة تفاعل صودا الخبز والخل، ما الدليل المرئي على تكون الغاز؟", "ظهور الفقاعات", ["تكوّن مرآة فضية", "انكسار شعاع الضوء"]], "layers": ["في نموذج طبقات الأرض، ما الطبقة التي تقع في مركز الأرض؟", "اللب الداخلي", ["القشرة", "الغلاف الجوي"]], "ramp": ["في تجربة السطح المائل، ما فائدة زيادة طول المنحدر مع الارتفاع نفسه؟", "تقليل القوة اللازمة عادة مع زيادة المسافة", ["إلغاء الجاذبية", "جعل الكتلة تساوي صفراً"]], "micro": ["في تجربة الخلية تحت المجهر، ما وظيفة التركيز البؤري؟", "جعل تفاصيل العينة واضحة", ["زيادة عدد الخلايا", "تغيير نوع العينة"]], "quake": ["في نموذج الموجات الزلزالية، أي موجات تصل أولاً عادة إلى محطة الرصد؟", "موجات P الأولية", ["موجات S الثانوية", "الموجات السطحية دائماً"]], "osmo": ["في تجربة الأسموزية، عبر أي بنية ينتقل الماء بين المحاليل؟", "غشاء شبه منفذ", ["جدار معدني صلب", "سلك كهربائي"]], "pred": ["في نموذج المفترس والفريسة، ماذا قد يحدث لجماعة الفرائس عند زيادة المفترسات؟", "قد ينخفض عدد الفرائس", ["تزداد الفرائس دائماً بلا حد", "تختفي المفترسات فوراً"]], "yeast": ["في تجربة الخميرة، ما الغاز الذي قد ينتج عن التخمر؟", "ثاني أكسيد الكربون", ["الأكسجين", "الكلور"]], "heat": ["في حساب الطاقة الحرارية، ما العلاقة المستخدمة لتغير درجة الحرارة؟", "Q = mcΔT", ["Q = m ÷ cT", "Q = c ÷ mΔT"]], "charles": ["في تجربة قانون شارل عند ثبات الضغط، ماذا يحدث لحجم الغاز عند ارتفاع درجة حرارته المطلقة؟", "يزداد الحجم", ["يقل الحجم دائماً", "لا يتغير الحجم مطلقاً"]], "mineral": ["في اختبار خصائص المعادن، ما الخاصية التي تصف مقاومة المعدن للخدش؟", "الصلادة", ["الانقسام الخلوي", "المولارية"]], "dens": ["في تجربة قياس الكثافة، كيف تحسب كثافة جسم؟", "الكتلة ÷ الحجم", ["الحجم ÷ الكتلة", "الكتلة × الحجم"]], "wepend": ["في تجربة الشغل والطاقة، كيف يحسب الشغل عندما تكون القوة في اتجاه الإزاحة؟", "القوة × الإزاحة", ["القوة ÷ الإزاحة", "الكتلة × الزمن"]], "stair": ["في تجربة القدرة عند صعود الدرج، كيف تحسب القدرة؟", "الشغل ÷ الزمن", ["الزمن ÷ الشغل", "الشغل × الزمن"]], "incl": ["في تجربة كفاءة المستوى المائل، كيف تقارن الكفاءة؟", "الشغل الناتج المفيد إلى الشغل المبذول", ["الكتلة إلى الزمن", "السرعة إلى درجة الحرارة"]], "lever": ["في تجربة الرافعة المتزنة، ما العلاقة بين القوة وذراعها على الجانبين؟", "عزم القوة في أحد الجانبين يساوي عزم القوة في الآخر", ["القوتان يجب أن تكونا مختلفتين دائماً", "ذراع القوة لا يؤثر"]], "cathode": ["في تجربة الأشعة المهبطية، مم تتكون الأشعة المهبطية؟", "إلكترونات", ["نيوترونات", "فوتونات فقط"]], "elec": ["في التحليل الكهربائي لمحلول كلوريد النحاس، ماذا يترسب عادة عند المهبط؟", "النحاس", ["الكلور الصلب", "الصوديوم"]], "strength": ["في مقارنة قوة الحموض، ما الذي يدل على حمض أقوى في الظروف نفسها؟", "تأين أكبر في الماء", ["عدم تأينه إطلاقاً", "تحوله إلى فلز"]], "salt": ["في تجربة pH لمحاليل الأملاح، لماذا قد يختلف pH الملح عن 7؟", "لأن أيوناته قد تتفاعل مع الماء", ["لأن كل الأملاح متعادلة دائماً", "لأن pH يقيس الكتلة"]], "mold": ["في تجربة عفن الخبز، أي عامل يساعد عادة على نمو العفن؟", "الرطوبة ودرجة حرارة مناسبة", ["الجفاف الشديد", "غياب الماء تماماً"]], "photot": ["في تجربة اتجاه نمو النبات نحو الضوء، ما الظاهرة التي تلاحظ؟", "انحناء النمو باتجاه مصدر الضوء", ["انجذاب الجذور للصوت", "تكوّن مرآة فضية"]], "diffuse": ["في تجربة الانتشار، كيف تؤثر زيادة درجة الحرارة غالباً في سرعة الانتشار؟", "تزيد السرعة", ["توقف الانتشار", "تجعل الجسيمات أكبر"]], "starch": ["في اختبار النشا باليود، ما اللون الإيجابي المميز؟", "أزرق مسود", ["أحمر آجري", "فضي"]], "oxy": ["في تجربة البذور النابتة، ما الغاز الذي تستهلكه البذور في التنفس؟", "الأكسجين", ["ثاني أكسيد الكربون فقط", "النيتروجين"]], "ps": ["في مقارنة البناء الضوئي والتنفس الخلوي، أي عملية تطلق الأكسجين عادة؟", "البناء الضوئي", ["التنفس الخلوي الهوائي", "التخمر فقط"]], "imm": ["في محاكاة الخلايا المناعية، ما دور الخلايا التائية القاتلة؟", "قتل الخلايا المصابة ببعض الممرضات", ["إنتاج الأنسولين", "نقل الأكسجين"]], "neph": ["في نموذج النيفرون، ما الوظيفة الأساسية للكلية؟", "ترشيح الدم وتنظيم الماء والأملاح وإخراج الفضلات", ["ضخ الدم إلى الجسم", "إنتاج العصارة الصفراوية"]], "anat": ["في مجسم الأعضاء الداخلية، ما العضو الذي يضخ الدم؟", "القلب", ["المعدة", "القصبة الهوائية"]], "div": ["في مقارنة الانقسام المتساوي والمنصف، كم خلية تنتج عادة من الانقسام المتساوي لخلية واحدة؟", "خليتان بنتان", ["أربع خلايا بنت", "خلية واحدة دائماً"]], "orgn": ["في تجربة عضيات الخلية، ما وظيفة الميتوكوندريا الأساسية؟", "إنتاج معظم ATP عبر التنفس الخلوي", ["تخزين المعلومات الوراثية حصراً", "تصنيع جدار الخلية"]], "nat": ["في محاكاة الانتخاب الطبيعي، ما الصفة التي تزيد فرص انتقالها للأجيال؟", "صفة وراثية تمنح ميزة في البيئة", ["صفة مكتسبة لا تورث بالضرورة", "صفة لا تؤثر في البقاء"]], "fiss": ["في نموذج الانشطار الثنائي للبكتيريا، كيف تتكاثر الخلية؟", "تنسخ مادتها الوراثية ثم تنقسم إلى خليتين", ["تنتج بذوراً", "تندمج مع خلية حيوانية"]], "lech": ["في محاكاة مبدأ لوتشاتلييه، ماذا يفعل النظام المتزن عند إحداث تغيير خارجي؟", "ينزاح بما يخفف أثر التغيير", ["يتوقف الاتزان نهائياً في كل الحالات", "يتغير ثابت الاتزان مع أي تغيير"]] };
    const legacyBanks = {};
    Object.keys(legacyFacts).forEach(key => {
        const [base, correct, wrong] = legacyFacts[key];
        const variants = [
            base,
            `وفقًا لما توضحه هذه التجربة: ${base.charAt(0).toLowerCase() + base.slice(1)}`,
            `أي إجابة تفسر النتيجة الأساسية في هذه التجربة؟ ${base}`,
            `عند تحليل نتائج هذه التجربة، ${base.charAt(0).toLowerCase() + base.slice(1)}`,
            `ما الاختيار الصحيح المرتبط مباشرة بالمحاكاة؟ ${base}`,
            `أي عبارة توافق المبدأ الذي تعرضه التجربة؟ ${base}`,
            `في سياق هذه التجربة، ما الإجابة الصحيحة؟ ${base}`,
            `ما الذي ينبغي استنتاجه من النموذج في هذه التجربة؟ ${base}`,
            `اختر الإجابة التي تتفق مع نتائج التجربة: ${base}`,
            `أي خيار يطابق المفهوم الذي تحاكيه التجربة؟ ${base}`
        ];
        legacyBanks[key] = variants.map(q => [q, [correct, ...wrong], 0]);
    });
    // Expose the authored, topic-keyed banks to the unified assessment engine added below.
    window.SCI_BANKS = { focusedBanks, fixedQuizzes, extraBanks, legacyFacts, legacyBanks, focusedOrganicBanks, organicBanks };
    const oldLabQuiz = window.labQuiz;
    window.labQuiz = function () {
        var _a;
        if (!cur)
            return;
        let bank = focusedBanks[cur[3]];
        if (cur[3] === 'organic') {
            const r = Math.max(0, Math.min(4, Math.round(((_a = cur[4]) === null || _a === void 0 ? void 0 : _a.r) || 0)));
            bank = focusedOrganicBanks[r];
        }
        // Never fall back to the mixed general quiz: use a bank for this simulation and title.
        if (!bank)
            bank = legacyBanks[cur[3]];
        // One legacy catalogue item uses the buoyancy renderer by mistake; its assessment must follow its actual soil-permeability title.
        if (cur[3] === 'float' && /التربة|نفاذية/.test(cur[2] || ''))
            bank = legacyBanks.soil;
        if (bank) {
            const shuffled = [...bank].sort(() => Math.random() - .5);
            const chosen = shuffled.slice(0, 5);
            const qs = chosen.map(q => { const options = q[1].map((t, i) => ({ t, i })).sort(() => Math.random() - .5); return { q: q[0], o: options.map(x => x.t), a: options.findIndex(x => x.i === q[2]) }; });
            startQ(qs, cur[2]);
            return;
        }
        const panel = document.getElementById('qb');
        if (panel) {
            panel.innerHTML = '<h3>لا يتوفر بنك أسئلة خاص بهذه التجربة بعد.</h3><p>تم إيقاف الأسئلة العامة حتى لا تظهر أسئلة من موضوع آخر.</p>';
            show('qz');
        }
    };
    // Improve plant growth rendering with stages, visible root system, soil layers and leaf response.
    if (S.growth) {
        const base = S.growth;
        S.growth = { c: [R('w', 'الماء (%)', 0, 100, 5, 60), R('l', 'الضوء (%)', 0, 100, 5, 60)],
            f(v, t) {
                const h = YQH(cx), T0 = t || performance.now() / 1000, wf = v.w <= 70 ? v.w / 70 : Math.max(.35, 1 - (v.w - 70) / 50), lf = Math.min(1, v.l / 80), rate = Math.min(wf, lf), day = (T0 * 1.6) % 28, gr = rate * (1 - Math.exp(-day / 9)), ht = gr * 150, lim = wf < lf ? 'الماء' : lf < wf ? 'الضوء' : 'متوازنان';
                h.bg(W, H, '#0e2a3d', '#0a1a2a');
                cx.fillStyle = `rgba(253,224,71,${.15 + v.l / 150})`;
                cx.beginPath();
                cx.arc(70, 60, 18 + v.l / 6, 0, 7);
                cx.fill();
                for (let i = 0; i < 8; i++) {
                    const a = i * .785;
                    cx.strokeStyle = `rgba(253,224,71,${v.l / 160})`;
                    cx.beginPath();
                    cx.moveTo(70 + (30 + v.l / 6) * Math.cos(a), 60 + (30 + v.l / 6) * Math.sin(a));
                    cx.lineTo(70 + (40 + v.l / 5) * Math.cos(a), 60 + (40 + v.l / 5) * Math.sin(a));
                    cx.stroke();
                }
                cx.fillStyle = '#7c4a2a';
                cx.fillRect(215, 250, 150, 60);
                cx.fillStyle = '#5b3a1f';
                cx.fillRect(215, 250, 150, 60 * (1 - .0));
                cx.fillStyle = `rgba(56,130,200,${v.w / 180})`;
                cx.fillRect(215, 250, 150, 60);
                cx.strokeStyle = '#a16207';
                cx.lineWidth = 3;
                cx.strokeRect(215, 250, 150, 60);
                const rl = 20 + rate * 45;
                cx.strokeStyle = '#e5d3b3';
                cx.lineWidth = 2;
                for (let i = -3; i <= 3; i++) {
                    cx.beginPath();
                    cx.moveTo(290, 252);
                    cx.quadraticCurveTo(290 + i * 10, 252 + rl * .5, 290 + i * 18, 252 + rl);
                    cx.stroke();
                }
                const green = `hsl(${70 + lf * 55},${40 + lf * 30}%,${30 + lf * 14}%)`, droop = (1 - wf) * .9;
                cx.strokeStyle = lf < .4 ? '#c7d27a' : green;
                cx.lineWidth = 5;
                cx.lineCap = 'round';
                cx.beginPath();
                cx.moveTo(290, 250);
                cx.quadraticCurveTo(290, 250 - ht * .5, 290 + droop * 18, 250 - ht);
                cx.stroke();
                const nl = Math.floor(gr * 8);
                for (let i = 0; i < nl; i++) {
                    const y = 250 - (i + 1) * ht / (nl + 1), s = i % 2 ? 1 : -1;
                    cx.save();
                    cx.translate(290 + droop * 18 * (i / nl), y);
                    cx.rotate(s * (.5 + droop * 1.1));
                    cx.fillStyle = green;
                    cx.beginPath();
                    cx.ellipse(s * 18, 0, 20, 7, 0, 0, 7);
                    cx.fill();
                    cx.restore();
                }
                if (rate < .08)
                    h.T('لا نمو', 290, 230, '#fca5a5', 12);
                for (let i = 0; i < Math.round(v.w / 20); i++) {
                    const y = (T0 * 60 + i * 40) % 80;
                    cx.fillStyle = 'rgba(125,211,252,.8)';
                    cx.beginPath();
                    cx.arc(245 + i * 18, 175 + y, 2.5, 0, 7);
                    cx.fill();
                }
                [['الماء', wf, '#38bdf8'], ['الضوء', lf, '#fde047'], ['معدل النمو', rate, '#4ade80']].forEach((b, i) => { const y = 60 + i * 34; h.T(b[0], W - 14, y, '#e2e8f0', 12, 'right'); cx.fillStyle = '#1e293b'; cx.fillRect(W - 210, y + 6, 190, 9); cx.fillStyle = b[2]; cx.fillRect(W - 210, y + 6, 190 * b[1], 9); });
                h.T('العامل المحدِّد: ' + lim, W - 14, 176, '#fca5a5', 13, 'right');
                h.T(`اليوم ${day.toFixed(0)} من 28 · الارتفاع ≈ ${(gr * 30).toFixed(1)} cm`, W - 14, 200, '#fde68a', 12, 'right');
                cx.strokeStyle = '#475569';
                cx.strokeRect(400, 222, 220, 86);
                cx.strokeStyle = '#4ade80';
                cx.beginPath();
                for (let d = 0; d <= 28; d += 1) {
                    const y = 308 - rate * (1 - Math.exp(-d / 9)) * 82;
                    d ? cx.lineTo(400 + d / 28 * 220, y) : cx.moveTo(400, y);
                }
                cx.stroke();
                cx.fillStyle = '#fff';
                cx.beginPath();
                cx.arc(400 + day / 28 * 220, 308 - gr * 82, 4, 0, 7);
                cx.fill();
                return `النمو يتحدد بالعامل الأقل توفرًا (قانون العامل المحدِّد): الماء ${v.w}% (استجابة ${(wf * 100).toFixed(0)}%) والضوء ${v.l}% (استجابة ${(lf * 100).toFixed(0)}%) فالعامل المحدِّد الآن: ${lim}. قلة الماء تُذبل النبات، وزيادته الشديدة تختنق بها الجذور لنقص الأكسجين، وقلة الضوء تُضعف البناء الضوئي فيصفرّ الورق ويطول الساق شاحبًا. أفضل نمو عند ماء معتدل (نحو 60–70%) وضوء كافٍ.`;
            } };
    }
    // Blood typing visualization: clearer agglutination wells and an explicit compatibility note.
    if (S.blood) {
        const base = S.blood;
        S.blood = Object.assign(Object.assign({}, base), { f(v, t) { var _a, _b; const types = [['O−', 0, 0, 0], ['O+', 0, 0, 1], ['A−', 1, 0, 0], ['A+', 1, 0, 1], ['B−', 0, 1, 0], ['B+', 0, 1, 1], ['AB−', 1, 1, 0], ['AB+', 1, 1, 1]]; const donor = types[Math.max(0, Math.min(7, Math.round((_a = v.d) !== null && _a !== void 0 ? _a : 3)))], recipient = types[Math.max(0, Math.min(7, Math.round((_b = v.r) !== null && _b !== void 0 ? _b : 0)))]; drawBase('مختبر فصائل الدم', 'نموذج تعليمي لمستضدات A وB وRh(D)'); const wells = [['Anti-A', donor[1]], ['Anti-B', donor[2]], ['Anti-D', donor[3]]]; wells.forEach((w, i) => { const x = 130 + i * 150; cx.beginPath(); cx.ellipse(x, 150, 48, 58, 0, 0, Math.PI * 2); cx.fillStyle = '#b91c1c'; cx.fill(); cx.strokeStyle = '#fecaca'; cx.lineWidth = 3; cx.stroke(); if (w[1]) {
                for (let k = 0; k < 28; k++) {
                    const a = k * 2.399, r = 8 + Math.sqrt(k) * 8;
                    cx.beginPath();
                    cx.arc(x + Math.cos(a) * r, 150 + Math.sin(a) * r * .7, 3, 0, Math.PI * 2);
                    cx.fillStyle = '#fecaca';
                    cx.fill();
                }
            }
            else {
                for (let k = 0; k < 8; k++) {
                    cx.beginPath();
                    cx.arc(x - 20 + k * 6, 150 + (k % 3) * 4, 2, 0, Math.PI * 2);
                    cx.fillStyle = '#fca5a5';
                    cx.fill();
                }
            } text(w[0], x, 225, '#e2e8f0', 13); }); text(`العينة: ${donor[0]}`, 320, 65, '#f8fafc', 19); text(`مستقبل افتراضي: ${recipient[0]}`, 320, 270, '#c4b5fd', 14); text('تكتل = تفاعل مع المستضد', 320, 300, '#fca5a5', 12); return `العينة المعروضة ${donor[0]}: Anti-A ${donor[1] ? 'إيجابي' : 'سلبي'}، Anti-B ${donor[2] ? 'إيجابي' : 'سلبي'}، Anti-D ${donor[3] ? 'إيجابي' : 'سلبي'}. هذا نموذج مبسط لفصائل ABO/Rh وليس أداة لاتخاذ قرار نقل الدم؛ النقل الحقيقي يتطلب فحوص توافق وبروتوكولاً طبياً.`; } });
    }
    // Botanical realism: photosynthesis bubbles, visible leaf venation, light direction and phototropism.
    if (S.photo) {
        const base = S.photo;
        S.photo = Object.assign(Object.assign({}, base), { f(v, t) { var _a, _b, _c; const light = Number((_a = v.d) !== null && _a !== void 0 ? _a : 50), co2 = Number((_b = v.c) !== null && _b !== void 0 ? _b : 50), temp = Number((_c = v.T) !== null && _c !== void 0 ? _c : 25), rate = Math.max(0, Math.min(100, (light / (light + 25)) * (co2 / (co2 + 20)) * Math.max(.1, 1 - Math.abs(temp - 28) / 45) * 100)); drawBase('البناء الضوئي في النبات', 'تأثير الضوء وثاني أكسيد الكربون والحرارة'); cx.fillStyle = '#5b4636'; cx.fillRect(55, 250, 530, 35); cx.strokeStyle = '#22c55e'; cx.lineWidth = 9; cx.beginPath(); cx.moveTo(320, 250); cx.lineTo(320, 112); cx.stroke(); for (let i = 0; i < 6; i++) {
                const side = i % 2 ? 1 : -1, x = 320 + side * (30 + i * 4), y = 210 - i * 17;
                cx.save();
                cx.translate(x, y);
                cx.rotate(side * .5);
                cx.fillStyle = light < 12 ? '#a3a34b' : '#22a65a';
                cx.beginPath();
                cx.ellipse(0, 0, 34, 13, 0, 0, Math.PI * 2);
                cx.fill();
                cx.strokeStyle = '#bbf7d0';
                cx.lineWidth = 1.4;
                cx.stroke();
                cx.beginPath();
                cx.moveTo(-27, 0);
                cx.lineTo(27, 0);
                cx.stroke();
                for (let k = -2; k <= 2; k++) {
                    cx.beginPath();
                    cx.moveTo(k * 8, 0);
                    cx.lineTo(k * 11, -7);
                    cx.stroke();
                }
                cx.restore();
            } for (let i = 0; i < Math.round(rate / 5); i++) {
                const x = 270 + (i * 29) % 100, y = 225 - (i * 31 + t * 20) % 115;
                cx.beginPath();
                cx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
                cx.fillStyle = '#e0f2fe';
                cx.fill();
            } text(`معدل نسبي للبناء الضوئي: ${rate.toFixed(0)}%`, 320, 70, '#86efac', 15); text(`ضوء ${light} · CO₂ ${co2} · حرارة ${temp}°س`, 320, 295, '#e0f2fe', 12); return `يزداد معدل البناء الضوئي مع زيادة الضوء وCO₂ إلى حد الإشباع، وتتأثر الإنزيمات بدرجة الحرارة. المؤشر هنا نوعي ومبسّط ولا يمثل قياساً مخبرياً. الفقاعات تمثل الأكسجين الناتج رمزياً.`; } });
    }
    if (S.photot) {
        const base = S.photot;
        S.photot = { c: [R('a', 'زاوية الضوء (°، موجبة = من اليمين)', -80, 80, 5, 45), R('i', 'شدة الضوء (%)', 10, 100, 5, 60), R('d', 'الأيام', 1, 10, 1, 4)],
            f(v, t) {
                const h = YQH(cx), T0 = t || performance.now() / 1000, a = v.a * Math.PI / 180, prog = 1 - Math.exp(-v.d / 3), th = Math.max(-1.0, Math.min(1.0, Math.sin(a) * v.i / 100 * 1.25)) * prog, px = 300, py = 290, Lh = 150;
                h.bg(W, H, '#0d1f33', '#07111e');
                const lx = px + Math.sin(a) * 250, ly = 140 - Math.cos(a) * 90;
                cx.fillStyle = '#fde68a';
                cx.beginPath();
                cx.arc(lx, ly, 16, 0, 7);
                cx.fill();
                cx.strokeStyle = `rgba(253,224,71,${.15 + v.i / 200})`;
                cx.lineWidth = 1.5;
                for (let k = -2; k <= 2; k++) {
                    cx.beginPath();
                    cx.moveTo(lx + k * 8, ly + k * 5);
                    cx.lineTo(px + k * 22 + Math.sin(a) * 10, py - Lh * .8);
                    cx.stroke();
                }
                h.T('مصدر الضوء', lx, ly - 24, '#fde68a', 11);
                cx.fillStyle = '#6b4423';
                cx.fillRect(210, py, 180, 26);
                const tx = px + Lh * Math.sin(th) * 1.0, ty = py - Lh * Math.cos(th * .9);
                cx.strokeStyle = '#6dbb5a';
                cx.lineWidth = 7;
                cx.lineCap = 'round';
                cx.beginPath();
                cx.moveTo(px, py);
                cx.quadraticCurveTo(px, py - Lh * .55, tx, ty);
                cx.stroke();
                [[-1], [1]].forEach(([s]) => { cx.save(); cx.translate(tx, ty); cx.rotate(s * .7 + th); cx.fillStyle = '#4ea03f'; cx.beginPath(); cx.ellipse(s * 14, 0, 16, 6, 0, 0, 7); cx.fill(); cx.restore(); });
                const sh = Math.sign(a) || 1, aux = Math.round(14 * Math.abs(Math.sin(a)) * v.i / 100 * (.4 + prog));
                cx.fillStyle = 'rgba(16,40,26,.85)';
                cx.fillRect(470, 170, 150, 120);
                cx.strokeStyle = '#86efac';
                cx.strokeRect(470, 170, 150, 120);
                h.T('مقطع في الساق (مكبّر)', 545, 164, '#bbf7d0', 11);
                for (let r = 0; r < 6; r++)
                    for (let c = 0; c < 2; c++) {
                        const side = c == 0 ? -sh : sh, shaded = side < 0, wdt = shaded ? 18 + aux * 1.6 * prog : 14;
                        const x = shaded ? (sh > 0 ? 470 : 620 - wdt - 4) : (sh > 0 ? 620 - wdt - 4 : 470), xx = c == 0 ? (sh > 0 ? 476 : 614 - wdt) : (sh > 0 ? 614 - wdt : 476);
                    }
                const cellW = (sd) => sd ? 16 + aux * 1.4 * prog : 14, xl = 476, xr = 550;
                [0, 1].forEach(c => { const lightSide = (c == 1) == (sh > 0), wd = lightSide ? 14 : cellW(1); for (let r = 0; r < 5; r++) {
                    const x = c ? xr : xl;
                    cx.fillStyle = lightSide ? '#bbf7d0' : '#fde68a';
                    cx.strokeStyle = '#14532d';
                    cx.fillRect(x, 178 + r * 21, wd + 20, 18);
                    cx.strokeRect(x, 178 + r * 21, wd + 20, 18);
                } });
                for (let i = 0; i < aux; i++) {
                    const lightSide = false, ax = (sh > 0 ? 476 : 550) + 10 + (i % 4) * 8, ay = 182 + ((i * 17 + Math.floor(T0 * 8)) % 100);
                    cx.fillStyle = '#facc15';
                    cx.beginPath();
                    cx.arc(ax, ay, 2.4, 0, 7);
                    cx.fill();
                }
                h.T('● أوكسين يتراكم في الجهة المظللة فتستطيل خلاياها', 545, 306, '#fde68a', 10);
                h.T(`زاوية الانحناء ≈ ${(th * 57.3).toFixed(0)}° نحو الضوء`, W / 2, H - 10, '#f8fafc', 13);
                return `الانتحاء الضوئي: ينحني الساق نحو الضوء لأن هرمون الأوكسين ينتقل إلى الجهة المظللة فتستطيل خلاياها أكثر من خلايا الجهة المضاءة، فيميل الساق نحو المصدر. كلما زادت شدة الضوء وزاوية سقوطه (غير العمودي) وزادت الأيام ازداد الانحناء. هنا: الزاوية ${v.a}° والشدة ${v.i}% بعد ${v.d} أيام فينحني الساق نحو ${(th * 57.3).toFixed(0)}°. إذا جاء الضوء من الأعلى مباشرة (0°) ينمو الساق مستقيمًا.`;
            } };
    }
    // Refresh catalogue, and show an explicit safety notice in the lab explanation.
    if (typeof mk === 'function')
        mk();
    const oldOpen = window.open_;
    if (typeof oldOpen === 'function')
        window.open_ = function (i) { oldOpen(i); if (cur && ['organic', 'electro', 'galv'].includes(cur[3])) {
            $('gd').textContent = 'تنبيه سلامة: هذه محاكاة تعليمية افتراضية فقط. لا تُجرِ تفاعلات الصوديوم مع الكحول أو اختبارات تولينز/فهلنج أو التحليل الكهربائي عملياً دون مختبر مجهز وإشراف مختص. قد تكون المواد والنواتج خطرة.';
        } };
})();
