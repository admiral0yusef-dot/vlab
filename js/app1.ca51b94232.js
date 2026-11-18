if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(typeof r === 'object' ? (r[0] || 0) : (r || 0), Math.abs(w) / 2, Math.abs(h) / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); };
}
const $ = id => document.getElementById(id), cx = $('cv').getContext('2d'), W = 640, H = 320;
/* === ترقية الرسوم الواقعية: استبدال الخلفيات الداكنة المسطحة بمشهد المختبر الواقعي (الأستاذ يوسف القاق) === */
(function () {
    try {
        const GP = CanvasGradient.prototype;
        if (!GP.__yq) {
            const ad = GP.addColorStop;
            GP.addColorStop = function (o, c) { (this.__st || (this.__st = [])).push(c); return ad.call(this, o, c); };
            GP.__yq = 1;
        }
    }
    catch (e) { }
    const lum = c => { if (typeof c !== 'string')
        return 1; let m = /^#([0-9a-f]{6})/i.exec(c), r, g, b, a = 1; if (m) {
        r = parseInt(m[1].slice(0, 2), 16);
        g = parseInt(m[1].slice(2, 4), 16);
        b = parseInt(m[1].slice(4, 6), 16);
    }
    else if (m = /^#([0-9a-f]{3})$/i.exec(c)) {
        r = parseInt(m[1][0] + m[1][0], 16);
        g = parseInt(m[1][1] + m[1][1], 16);
        b = parseInt(m[1][2] + m[1][2], 16);
    }
    else if (m = /rgba?\(([^)]+)\)/.exec(c)) {
        const q = m[1].split(',').map(parseFloat);
        r = q[0];
        g = q[1];
        b = q[2];
        a = q[3] == null ? 1 : q[3];
    }
    else
        return 1; if (a < .9)
        return 1; return (.2126 * r + .7152 * g + .0722 * b) / 255; };
    window.__yqDark = fs => { if (fs && typeof fs === 'object' && fs.__st && fs.__st.length) {
        return fs.__st.every(c => lum(c) < .28);
    } return lum(fs) < .22; };
    const F = cx.fillRect.bind(cx);
    let busy = 0;
    cx.fillRect = function (x, y, w, h) { if (!busy && x <= 1 && y <= 1 && w >= W - 2 && h >= H - 2 && window.YQART && !window.__yqNoBG && window.__yqDark(this.fillStyle)) {
        busy = 1;
        this.save();
        this.shadowBlur = 0;
        this.shadowOffsetY = 0;
        this.globalAlpha = 1;
        this.setTransform(this.getTransform());
        YQART.labScene(this, W, H, { dpr: 2 });
        this.restore();
        busy = 0;
        return;
    } return F(x, y, w, h); };
})();
const SUB = { all: 'الكل', phys: '⚡ فيزياء', chem: '⚗️ كيمياء', bio: '🧬 أحياء', earth: '🌍 علوم الأرض' };
// الدليل: [الصف, المبحث, العنوان, نوع المحاكاة, قيم افتراضية]
const E = [
    [1, 'phys', 'يطفو أم يغرق؟', 'float', { d: 600 }], [1, 'bio', 'ماذا يحتاج النبات ليعيش؟', 'photo', { d: 10 }],
    [2, 'chem', 'حالات الماء الثلاث', 'states', { T: 20 }], [2, 'phys', 'الحرارة وحركة الجسيمات', 'states', { T: 60 }],
    [3, 'bio', 'الضوء والنبات', 'photo', { d: 20 }], [3, 'phys', 'الطفو في السوائل', 'float', { d: 1200 }],
    [4, 'phys', 'البندول وزمنه الدوري', 'pend', { L: 0.5 }], [4, 'chem', 'انصهار وتبخر المواد', 'states', { T: 100 }],
    [5, 'phys', 'الطفو وكثافة الأجسام', 'float', { d: 900 }], [5, 'phys', 'انكسار الضوء', 'refr', { a: 30, n: 1.33 }],
    [6, 'phys', 'حركة المقذوف', 'proj', { a: 45, v: 15 }], [6, 'bio', 'البناء الضوئي والضوء', 'photo', { d: 30 }],
    [7, 'chem', 'النظرية الحركية للجسيمات', 'states', { T: 120 }], [7, 'phys', 'البندول والجاذبية', 'pend', { L: 1, g: 9.8 }],
    [8, 'phys', 'قانون بويل', 'boyle', { V: 50 }], [8, 'phys', 'قاعدة أرخميدس', 'float', { d: 2700 }],
    [9, 'phys', 'قانون أوم', 'ohm', { V: 6, R: 10 }], [9, 'phys', 'انكسار الضوء وقانون سنيل', 'refr', { a: 50, n: 1.5 }], [9, 'bio', 'معدل البناء الضوئي', 'photo', { d: 8 }], [9, 'chem', 'الحموض والقواعد: معايرة', 'ph', { Vb: 10 }],
    [10, 'phys', 'المقذوفات', 'proj', { a: 30, v: 20 }], [10, 'phys', 'قانون أوم والمقاومة', 'ohm', { V: 12, R: 4 }], [10, 'chem', 'الغازات والضغط', 'boyle', { V: 30 }], [10, 'earth', 'نفاذية التربة (الكثافة والطفو)', 'float', { d: 1800 }],
    [11, 'chem', 'معايرة حمض قوي بقاعدة قوية', 'ph', { Vb: 24 }], [11, 'phys', 'المقذوف بزوايا مختلفة', 'proj', { a: 60, v: 25 }], [11, 'bio', 'الوراثة: مربع بانيت', 'pun', { p: 1, q: 1 }],
    [12, 'chem', 'منحنى المعايرة ونقطة التكافؤ', 'ph', { Vb: 25 }], [12, 'phys', 'البندول على كواكب مختلفة', 'pend', { L: 1, g: 3.7 }], [12, 'bio', 'تجارب مندل', 'pun', { p: 1, q: 2 }],
    [7, 'chem', 'الحموض والقواعد: مقياس pH والكواشف', 'acid', { p: 3 }], [7, 'phys', 'العدسات وتكوّن الصور', 'lens', { u: 30, f: 10 }], [7, 'phys', 'التوصيل على التسلسل والتوازي', 'circ', { n: 2, m: 0 }], [7, 'earth', 'أطوار القمر', 'moon', { d: 7 }],
    [8, 'phys', 'قانون هوك والنوابض', 'spring', { m: 200, k: 20 }], [8, 'phys', 'الموجات: التردد والطول الموجي', 'wave', { fq: 2, l: 2 }], [8, 'chem', 'تركيز المحاليل', 'mol', { m: 10, V: 500 }],
    [9, 'phys', 'المقاومة في التسلسل والتوازي', 'circ', { n: 3, m: 1 }], [9, 'chem', 'مقياس pH للمحاليل', 'acid', { p: 11 }], [9, 'chem', 'عوامل سرعة التفاعل الكيميائي', 'rate', { c: 1, T: 45 }],
    [10, 'chem', 'المولارية وتحضير المحاليل', 'mol', { m: 30, V: 250 }], [10, 'phys', 'العدسات وتكوّن الصور', 'lens', { u: 20, f: 10 }], [10, 'phys', 'الحث الكهرومغناطيسي (فاراداي)', 'faraday', { N: 200, s: 1.5 }], [10, 'earth', 'أطوار القمر والمد والجزر', 'moon', { d: 15 }],
    [11, 'phys', 'الحث الكهرومغناطيسي', 'faraday', { N: 400, s: 2 }], [11, 'phys', 'الموجات والصوت', 'wave', { fq: 5, l: 1 }], [11, 'chem', 'سرعة التفاعل والحرارة', 'rate', { c: 1.5, T: 60 }], [11, 'phys', 'قانون هوك وطاقة الوضع', 'spring', { m: 300, k: 50 }],
    [12, 'phys', 'النشاط الإشعاعي وعمر النصف', 'decay', { T: 8 }], [12, 'phys', 'العدسات الرقيقة', 'lens', { u: 35, f: 15 }], [12, 'chem', 'المحاليل والتركيز', 'mol', { m: 45, V: 800 }], [12, 'phys', 'الحث وتوليد التيار', 'faraday', { N: 500, s: 2.5 }],
    [1, 'bio', 'النبات يحتاج الماء', 'growth', { w: 60, l: 60 }], [1, 'phys', 'المغناطيس يجذب أم لا؟', 'magnet', { d: 3 }], [1, 'phys', 'كيف يتكوّن الظل؟', 'shadow', { o: 50 }], [1, 'earth', 'أنواع التربة وتسرب الماء', 'soil', { k: 1 }],
    [2, 'bio', 'النبات والماء والضوء', 'growth', { w: 80, l: 30 }], [2, 'phys', 'حجم الظل', 'shadow', { o: 20 }], [2, 'phys', 'الصوت واهتزازه', 'wave', { fq: 6, l: .8 }], [2, 'bio', 'الجسم والقلب والنشاط', 'heart', { a: 3 }],
    [3, 'earth', 'التربة: حصى ورمل وطين', 'soil', { k: 0 }], [3, 'phys', 'المغناطيس والمسافة', 'magnet', { d: 8 }], [3, 'bio', 'رحلة الغذاء في الجسم', 'digest', { p: 30 }], [3, 'chem', 'صودا الخبز والخل', 'react', { r: 0 }],
    [4, 'bio', 'القلب والدورة الدموية', 'heart', { a: 6 }], [4, 'earth', 'طبقات الأرض', 'layers', { d: 500 }], [4, 'phys', 'الاحتكاك والسطح المائل', 'ramp', { a: 25, u: .4 }], [4, 'bio', 'نمو النبات والضوء', 'growth', { w: 60, l: 100 }],
    [5, 'bio', 'الجهاز الهضمي', 'digest', { p: 60 }], [5, 'bio', 'الخلية تحت المجهر', 'micro', { t: 0, z: 10 }], [5, 'earth', 'نفاذية الطين', 'soil', { k: 3 }], [5, 'chem', 'التفاعل الكيميائي وتصاعد الغاز', 'react', { r: 1 }],
    [6, 'earth', 'الزلازل والموجات الزلزالية', 'quake', { d: 400 }], [6, 'bio', 'الخلية النباتية', 'micro', { t: 1, z: 40 }], [6, 'earth', 'باطن الأرض', 'layers', { d: 3000 }], [6, 'phys', 'السطح المائل', 'ramp', { a: 35, u: .2 }],
    [7, 'bio', 'المجهر: خلية نباتية', 'micro', { t: 1, z: 60 }], [7, 'bio', 'الجهاز الدوري والنبض', 'heart', { a: 8 }], [7, 'earth', 'الزلازل: موجتا P وS', 'quake', { d: 900 }], [7, 'chem', 'تفاعل الفلزات مع الحمض', 'react', { r: 2 }],
    [8, 'bio', 'الجهاز الهضمي والإنزيمات', 'digest', { p: 45 }], [8, 'bio', 'الأسموزية في الخلية', 'osmo', { s: .3 }], [8, 'earth', 'نفاذية الطمي', 'soil', { k: 2 }], [8, 'earth', 'الطبقات الداخلية للأرض', 'layers', { d: 4000 }], [8, 'chem', 'التعادل بين حمض وقاعدة', 'react', { r: 4 }],
    [9, 'bio', 'الخلية الحيوانية والمجهر', 'micro', { t: 0, z: 80 }], [9, 'bio', 'الانتشار والأسموزية', 'osmo', { s: 2 }], [9, 'bio', 'الدورة الدموية والجهد', 'heart', { a: 10 }], [9, 'earth', 'الزلازل وبعد المركز', 'quake', { d: 1500 }], [9, 'chem', 'النحاس والحمض: لا تفاعل', 'react', { r: 3 }],
    [10, 'bio', 'المجهر والخلية', 'micro', { t: 1, z: 100 }], [10, 'bio', 'الهضم الكيميائي', 'digest', { p: 70 }], [10, 'earth', 'التربة والمسامية', 'soil', { k: 1 }], [10, 'earth', 'القشرة والستار واللب', 'layers', { d: 6000 }],
    [11, 'bio', 'النقل عبر الغشاء الخلوي', 'osmo', { s: 1.5 }], [11, 'bio', 'عوامل نمو النبات', 'growth', { w: 40, l: 80 }], [11, 'bio', 'القلب والتحمل', 'heart', { a: 5 }],
    [12, 'bio', 'الخلية والمجهر', 'micro', { t: 0, z: 50 }], [12, 'earth', 'الزلازل وقياس الموجات', 'quake', { d: 1800 }],
    [10, 'bio', 'المفترس والفريسة', 'pred', { a: .6, b: .04 }], [11, 'bio', 'العلاقات في النظام البيئي', 'pred', { a: .8, b: .05 }], [12, 'bio', 'ديناميكية الجماعات', 'pred', { a: .4, b: .03 }], [9, 'bio', 'الحرارة ونشاط الخميرة', 'yeast', { T: 37 }], [10, 'bio', 'التنفس اللاهوائي في الخميرة', 'yeast', { T: 50 }], [8, 'bio', 'التنفس الخلوي', 'yeast', { T: 25 }],
    [6, 'phys', 'الحرارة النوعية', 'heat', { m: 1, s: 0, dT: 20 }], [8, 'phys', 'انتقال الحرارة والمواد', 'heat', { m: 2, s: 2, dT: 30 }], [10, 'phys', 'الطاقة الحرارية Q=mcΔT', 'heat', { m: .5, s: 1, dT: 50 }], [9, 'chem', 'قانون شارل', 'charles', { T: 100 }], [10, 'chem', 'الغازات والحرارة', 'charles', { T: -50 }], [11, 'chem', 'الحجم ودرجة الحرارة (شارل)', 'charles', { T: 150 }],
    [910, 'earth', 'خصائص المعادن الفيزيائية', 'mineral', { i: 2, k: 2 }], [910, 'earth', 'المسامية والنفاذية', 'soil', { k: 0 }], [910, 'earth', 'علاقة مياه الأمطار بالمياه الجوفية', 'soil', { k: 1 }],
    [910, 'phys', 'قياس الكثافة', 'dens', { m: 80, r: 2, l: 8 }], [910, 'phys', 'قانون هوك', 'spring', { m: 200, k: 20 }], [910, 'phys', 'القوة والحركة: أثر الاحتكاك', 'ramp', { a: 20, u: .5 }], [910, 'phys', 'العلاقة بين الشغل والطاقة', 'wepend', { h: 20, m: 50, M: 200, u: .3 }], [910, 'phys', 'الشغل والقدرة: صعود الدرج', 'stair', { m: 50, n: 20, t: 10 }], [910, 'phys', 'الكفاءة للمستوى المائل', 'incl', { a: 25, m: 500, u: .1, L: .8 }], [910, 'phys', 'قانون الرافعة', 'lever', { m1: 50, m2: 100, d1: 20, d2: 10 }],
    [910, 'chem', 'التفريغ الكهربائي والأشعة المهبطية', 'cathode', { V: 8, P: 2, B: 0 }], [910, 'chem', 'التحليل الكهربائي لمحلول كلوريد النحاس', 'elec', { V: 6, c: 1, t: 10 }], [910, 'chem', 'الخصائص الحمضية والقاعدية: مقياس pH', 'acid', { p: 2 }], [910, 'chem', 'قوة الحموض والقواعد', 'strength', { s: 0, c: .1 }], [910, 'chem', 'الرقم الهيدروجيني لمحاليل الأملاح', 'salt', { s: 0, c: .1 }], [910, 'chem', 'حمض HCl مع المغنيسيوم وكربونات الكالسيوم', 'react', { r: 1 }],
    [910, 'bio', 'أثر الحرارة في نمو عفن الخبز', 'mold', { T: 25, h: 70, l: 10, d: 5 }], [910, 'bio', 'أثر الضوء في اتجاه نمو النبات', 'photot', { a: 45, i: 60, d: 4 }], [910, 'bio', 'خلايا نباتية وحيوانية بالمجهر', 'micro', { t: 1, z: 40 }], [910, 'bio', 'أثر الحرارة في الانتشار', 'diffuse', { T: 40, t: 5 }], [910, 'bio', 'الكشف عن النشا', 'starch', { f: 1, d: 3 }], [910, 'bio', 'استهلاك البذور النابتة للأكسجين', 'oxy', { m: 20, t: 10, T: 25 }],
    [910, 'bio', 'نقل فصائل الدم والعامل الريزيسي (Rh)', 'blood', { d: 3, r: 0, x: 0, y: 1 }], [11, 'bio', 'التوافق بين فصائل الدم', 'blood', { d: 0, r: 1, x: 1, y: 0 }], [910, 'bio', 'البناء الضوئي والتنفس الخلوي: الآلية', 'ps', { L: 60, C: 50, T: 25 }], [11, 'bio', 'العوامل المحدّدة للبناء الضوئي', 'ps', { L: 20, C: 80, T: 30 }],
    [11, 'bio', 'الخلايا المناعية B وT والممرضات', 'imm', { p: 0, s: 0, h: 1 }], [12, 'bio', 'T القاتلة والخلايا المصابة بفيروس', 'imm', { p: 1, s: 0, h: 1 }],
    [11, 'bio', 'النيفرون: الامتصاص والطرح في الكلية', 'neph', { bp: 100, adh: 50, g: 100 }], [12, 'bio', 'وظيفة الكلية وهرمون ADH', 'neph', { bp: 120, adh: 90, g: 250 }],
    [8, 'bio', 'جسم الإنسان: مجسمات 3D للأعضاء', 'anat', { o: 3, a: 30, z: 1, sk: 1 }], [910, 'bio', 'تشريح الأعضاء الداخلية (3D)', 'anat', { o: 4, a: 60, z: 1.2, sk: 1 }],
    [910, 'bio', 'الانقسام الخلوي المتساوي (ميتوز)', 'div', { t: 0, s: 0, k: 2 }], [11, 'bio', 'الانقسام المنصّف (ميوز)', 'div', { t: 1, s: 0, k: 2 }], [12, 'bio', 'مقارنة الميتوز والميوز', 'div', { t: 1, s: 2, k: 3 }],
    [7, 'bio', 'وظائف عضيات الخلية الحيوانية', 'orgn', { t: 0, o: 2 }], [910, 'bio', 'عضيات الخلية النباتية ووظائفها', 'orgn', { t: 1, o: 9 }],
    [11, 'bio', 'الانتخاب الطبيعي لدارون', 'nat', { e: 80, p: 60, i: 10, g: 0 }], [12, 'bio', 'التكيّف والتطور بالانتخاب الطبيعي', 'nat', { e: 20, p: 80, i: 5, g: 5 }],
    [910, 'bio', 'الانشطار الثنائي في البكتيريا', 'fiss', { T: 37, n: 80, t: 60, N: 1 }], [12, 'bio', 'النمو الأسي للبكتيريا', 'fiss', { T: 30, n: 60, t: 180, N: 2 }],
    [11, 'chem', 'مبدأ لوتشاتلييه: العوامل المؤثرة في الاتزان', 'lech', { rx: 0, dT: 0, P: 1, aR: 0, aP: 0 }], [12, 'chem', 'التفاعلات المنعكسة: الأمامي والعكسي (N₂O₄ ⇌ 2NO₂)', 'lech', { rx: 0, dT: 30, P: 1, aR: 0, aP: 0 }], [12, 'chem', 'اتزان هابر لتصنيع الأمونيا', 'lech', { rx: 1, dT: 0, P: 4, aR: 0, aP: 0 }], [12, 'chem', 'لوتشاتلييه: تفاعل H₂ + I₂ (الضغط لا يؤثر)', 'lech', { rx: 2, dT: 0, P: 4, aR: 0, aP: 0 }],
    [10, 'chem', 'نموذج دالتون: الذرة كرة صلبة وقانون النسب', 'dalton', { c: 0, n: 3 }],
    [10, 'chem', 'تجربة طومسون: الأشعة المهبطية واكتشاف الإلكترون', 'thomson', { V: 3, E: 10, B: 0 }],
    [10, 'chem', 'تجربة رذرفورد: تشتت جسيمات ألفا بصفيحة الذهب', 'ruth', { E: 5, Z: 79, n: 120 }],
    [10, 'chem', 'نموذج بور: مستويات الطاقة وطيف الهيدروجين', 'bohr', { ni: 3, nf: 2, Z: 1 }],
    [10, 'chem', 'مكونات الذرة: البروتونات والنيوترونات والإلكترونات', 'atomparts', { Z: 6, N: 6, ch: 0 }],
    [10, 'phys', 'المتجهات: تحليل المتجه إلى مركّبتين', 'vcomp', { A: 8, th: 35 }],
    [10, 'phys', 'جمع المتجهات بالمركّبات وبزوايا مختلفة', 'vadd', { A: 8, tA: 20, B: 6, tB: 110 }],
    [10, 'phys', 'الضرب القياسي للمتجهات (النقطي)', 'vdot', { A: 8, B: 6, th: 50 }],
    [10, 'phys', 'الضرب الاتجاهي للمتجهات (الصليبي)', 'vcross', { A: 8, B: 6, th: 60, o: 0 }]
];
const gl = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
let G = 0, SB = 'all', cur = null, vals = {}, P = [], t0 = 0;
const R = (k, l, a, b, s, d) => ({ k, l, a, b, s, d });
const S = {
    dalton: { c: [R('c', 'المركب (0 H₂O، 1 NH₃، 2 CH₄، 3 CO، 4 CO₂)', 0, 4, 1, 0), R('n', 'عدد الجزيئات', 1, 6, 1, 3)],
        f(v, t) {
            const h = YQH(cx), X = YQX, T0 = t || performance.now() / 1000, EL = { H: ['#cbd5e1', 9, 1], C: ['#475569', 14, 12], N: ['#3b82f6', 13, 14], O: ['#ef4444', 13, 16] }, CP = [['الماء H₂O', { H: 2, O: 1 }, [['O', 0, -4], ['H', -15, 12], ['H', 15, 12]]], ['الأمونيا NH₃', { N: 1, H: 3 }, [['N', 0, -6], ['H', -18, 12], ['H', 0, 17], ['H', 18, 12]]], ['الميثان CH₄', { C: 1, H: 4 }, [['C', 0, 0], ['H', -17, -17], ['H', 17, -17], ['H', -17, 17], ['H', 17, 17]]], ['أول أكسيد الكربون CO', { C: 1, O: 1 }, [['C', -13, 0], ['O', 13, 0]]], ['ثاني أكسيد الكربون CO₂', { C: 1, O: 2 }, [['O', -27, 0], ['C', 0, 0], ['O', 27, 0]]]], c = CP[v.c | 0], n = v.n | 0;
            h.bg(W, H, '#0f172a', '#0a1226');
            h.T('ذرات منفصلة (كرات صلبة غير قابلة للتجزئة)', 170, 28, '#bff3ff', 11);
            let k = 0;
            const tot = [];
            Object.entries(c[1]).forEach(([s, q]) => { for (let i = 0; i < q * n; i++)
                tot.push(s); });
            tot.forEach((s, i) => { const col = i % 12, row = Math.floor(i / 12), x = 40 + col * 24 + Math.sin(T0 * 1.4 + i) * 3, y = 64 + row * 26 + Math.cos(T0 * 1.1 + i * 2) * 3; X.sphere(cx, x, y, EL[s][1] * .78, EL[s][0], s); });
            X.arrow(cx, 170, 112, 170, 138, '#fbbf24', 3);
            h.T('تتحد بنسب عددية بسيطة', 170, 126, '#fde68a', 10);
            h.T(`${n} جزيء من ${c[0]}`, 170, 150, '#bff3ff', 11);
            cx.fillStyle = 'rgba(255,255,255,.04)';
            cx.fillRect(14, 158, 312, 110);
            const cols = Math.min(3, n), rows = Math.ceil(n / cols);
            for (let i = 0; i < n; i++) {
                const mx = 60 + (i % cols) * 100 + (rows == 1 ? (3 - cols) * 50 : 0), my = 190 + Math.floor(i / cols) * 58;
                c[2].forEach(([s, dx, dy]) => X.sphere(cx, mx + dx * .95, my + dy * .95, EL[s][1] * .78, EL[s][0], s));
            }
            const masses = Object.entries(c[1]).map(([s, q]) => [s, q * EL[s][2]]);
            h.T(`نسبة الكتل: ${masses.map(m => m[0] + ' = ' + m[1]).join('  :  ')}`, 170, 286, '#86efac', 11);
            h.T(v.c >= 3 ? 'قانون النسب المتضاعفة: مع 12 g كربون، الأكسجين 16 g في CO و32 g في CO₂ (نسبة 1:2)' : 'قانون النسب الثابتة: لكل مركب نسبة كتلية ثابتة بين عناصره', 170, 306, '#fde68a', 9);
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(345, 18, 285, 300);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(345, 18, 285, 300);
            h.T('فرضيات دالتون (1803)', 487, 40, '#fde68a', 13);
            ['1. المادة تتكون من ذرات صغيرة جدًا غير قابلة للتجزئة', '2. ذرات العنصر الواحد متماثلة في الكتلة والخواص', '3. تختلف ذرات العناصر المختلفة عن بعضها', '4. تتحد الذرات بنسب عددية صحيحة بسيطة لتكوين المركبات', '5. التفاعل الكيميائي إعادة ترتيب للذرات ولا تُفنى ولا تُستحدث'].forEach((l, i) => { const y = 70 + i * 46; h.T(l, 620, y, '#e2e8f0', 10.5, 'right'); if (i == 3 || i == 4)
                cx.fillStyle = 'rgba(251,191,36,.15)', cx.fillRect(352, y - 14, 272, 32); });
            h.T('تم تعديل النموذج لاحقًا: الذرة قابلة للتجزئة (إلكترون، بروتون، نيوترون)', 487, 306, '#94a3b8', 9);
            return `نموذج دالتون: الذرة كرة صلبة مصمتة لا تتجزأ، وذرات العنصر الواحد متماثلة، وتتحد بنسب عددية بسيطة لتكوين المركبات. هنا ${n} جزيء من ${c[0]}: عدد الذرات ${Object.entries(c[1]).map(([s, q]) => q * n + ' ذرة ' + s).join(' و')}، ونسبة الكتل ${masses.map(m => m[0] + ':' + m[1]).join(' : ')}. يفسّر النموذج قانون حفظ الكتلة (إعادة ترتيب الذرات) وقانون النسب الثابتة وقانون النسب المتضاعفة (مثل CO وCO₂). لكنه عجز عن تفسير الكهرباء والطيف وتركيب الذرة، فجاءت نماذج طومسون ورذرفورد وبور.`;
        } },
    thomson: { c: [R('V', 'جهد التسريع (kV)', 1, 10, .5, 3), R('E', 'المجال الكهربائي بين اللوحين (kV/m)', 0, 30, 1, 0), R('B', 'المجال المغناطيسي (mT) داخل الصفحة', 0, 5, .1, 0)],
        f(v, t) {
            const h = YQH(cx), X = YQX, T0 = t || performance.now() / 1000, e = 1.602e-19, m = 9.109e-31, vx = Math.sqrt(2 * e * v.V * 1000 / m), Ef = v.E * 1000, Bf = v.B * 1e-3, l = .05, Ls = .15;
            h.bg(W, H, '#0b1220', '#070d18');
            const gx = 60, gw = 500, sx = gx + gw, pyc = 150, px = x => gx + x * (180 / l) * .0 + x / (l + Ls) * 0;
            const sc = 3000; // px per m أفقيًا للمنطقة
            let x = 0, y = 0, vxs = vx, vys = 0;
            const path = [[0, 0]], dt = l / vx / 160;
            for (let i = 0; i < 160; i++) {
                const ay = (e / m) * (Ef - vxs * Bf * 0) - (e / m) * (vxs * Bf);
                const ax = (e / m) * (vys * Bf);
                vxs += ax * dt;
                vys += ay * dt;
                x += vxs * dt;
                y += vys * dt;
                if (i % 8 == 0)
                    path.push([x, y]);
            }
            const slope = vys / vxs, yEnd = y, xEnd = x, yS = yEnd + slope * (l + Ls - xEnd), yE = (e * Ef / (m * vx * vx)) * l * (l / 2 + Ls), yB = (() => { if (Bf < 1e-9)
                return 0; const r = m * vx / (e * Bf), s = Math.min(.98, l / r), th = Math.asin(s); return -(r * (1 - Math.cos(th)) + Ls * Math.tan(th)); })();
            cx.strokeStyle = '#a5d8f5';
            cx.lineWidth = 3;
            cx.fillStyle = 'rgba(120,170,220,.06)';
            cx.beginPath();
            cx.rect(gx, 70, gw, 160);
            cx.fill();
            cx.stroke();
            cx.fillStyle = '#94a3b8';
            cx.fillRect(gx + 4, pyc - 14, 8, 28);
            h.T('المهبط', gx + 8, pyc + 30, '#cbd5e1', 10);
            cx.fillStyle = '#64748b';
            cx.fillRect(gx + 60, pyc - 20, 6, 40);
            cx.fillRect(gx + 60, pyc - 20, 6, 12);
            h.T('المصعد', gx + 63, pyc - 26, '#cbd5e1', 10);
            const px0 = gx + 150, pw = 120, pyT = pyc - 48, pyB = pyc + 48;
            cx.fillStyle = Ef > 0 ? '#ef4444' : '#475569';
            cx.fillRect(px0, pyT - 6, pw, 6);
            cx.fillStyle = Ef > 0 ? '#3b82f6' : '#475569';
            cx.fillRect(px0, pyB, pw, 6);
            if (Ef > 0) {
                h.T('+', px0 + pw / 2, pyT - 10, '#fca5a5', 14);
                h.T('−', px0 + pw / 2, pyB + 20, '#93c5fd', 16);
                for (let i = 0; i < 4; i++)
                    X.arrow(cx, px0 + 14 + i * 30, pyT + 6, px0 + 14 + i * 30, pyT + 30, 'rgba(253,186,116,.8)', 1.6);
            }
            if (Bf > 0)
                for (let i = 0; i < 4; i++)
                    for (let j = 0; j < 3; j++) {
                        h.T('⊗', px0 + 14 + i * 30, pyc - 26 + j * 26, 'rgba(167,139,250,.8)', 13);
                    }
            const vscale = Math.min(7500, Math.max(1, 1)), mapY = yy => pyc - yy * (100 / .06), mapX = xx => px0 + xx / l * pw;
            const pts = [[gx + 14, pyc], [gx + 66, pyc], [px0, pyc]];
            path.forEach(p => pts.push([mapX(p[0]), mapY(p[1])]));
            pts.push([sx - 6, Math.max(80, Math.min(220, mapY(yS)))]);
            cx.strokeStyle = 'rgba(134,239,172,.7)';
            cx.lineWidth = 2.4;
            cx.beginPath();
            pts.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]));
            cx.stroke();
            h.dots(pts, 10, T0 * .4, '#bef264', 3);
            cx.fillStyle = '#d1d5db';
            cx.fillRect(sx - 6, 76, 8, 148);
            const spy = Math.max(80, Math.min(220, mapY(yS)));
            cx.fillStyle = 'rgba(190,255,150,.95)';
            cx.shadowColor = '#bef264';
            cx.shadowBlur = 14;
            cx.beginPath();
            cx.arc(sx - 2, spy, 6, 0, 7);
            cx.fill();
            cx.shadowBlur = 0;
            h.T('الشاشة', sx - 2, 246, '#cbd5e1', 10);
            const bal = Ef > 0 && Bf > 0 && Math.abs(Ef / Bf - vx) / vx < .03;
            h.T(bal ? 'متوازن: eE = evB فلا انحراف ⟹ v = E/B' : Ef > 0 && Bf > 0 ? 'القوتان متعاكستان: الكهربائية للأعلى والمغناطيسية للأسفل' : '', (gx + sx) / 2, 258, '#fde68a', 11);
            cx.fillStyle = '#fde68a';
            cx.beginPath();
            cx.arc(66, 292, 22, 0, 7);
            cx.globalAlpha = .25;
            cx.fill();
            cx.globalAlpha = 1;
            cx.strokeStyle = '#fde68a';
            cx.stroke();
            h.T('+', 66, 298, '#fde68a', 20);
            [[-10, -6], [8, -10], [12, 8], [-8, 10], [0, 0]].forEach(p => { cx.fillStyle = '#38bdf8'; cx.beginPath(); cx.arc(66 + p[0], 292 + p[1], 3.5, 0, 7); cx.fill(); });
            h.T('نموذج طومسون (كعكة البرقوق): كرة موجبة تتخللها إلكترونات', 270, 296, '#bff3ff', 10.5);
            h.T(`v = √(2eV/m) = ${(vx / 1e7).toFixed(2)}×10⁷ m/s`, 580, 40, '#fde68a', 11, 'right');
            h.T(`انحراف بالمجال الكهربائي فقط: ${(yE * 100).toFixed(1)} cm`, 580, 56, '#fdba74', 11, 'right');
            h.T(`انحراف بالمجال المغناطيسي فقط: ${(yB * 100).toFixed(1)} cm`, 580, 274, '#c4b5fd', 11, 'right');
            return `تجربة طومسون (1897): أنبوب أشعة مهبطية مفرغ تُسرَّع فيه الإلكترونات بجهد V فتكتسب سرعة v = √(2eV/m) = ${(vx / 1e7).toFixed(2)}×10⁷ m/s. المجال الكهربائي بين اللوحين يحرف الحزمة نحو اللوح الموجب (الأشعة سالبة الشحنة) بمقدار ${(yE * 100).toFixed(1)} cm، والمجال المغناطيسي يحرفها في الاتجاه المعاكس بمقدار ${(Math.abs(yB) * 100).toFixed(1)} cm. عند ضبط المجالين بحيث eE = evB لا تنحرف الحزمة فنحصل على السرعة v = E/B، ومنها حسب طومسون نسبة الشحنة إلى الكتلة e/m = 1.76×10¹¹ C/kg، وهي نفسها مهما كان الغاز أو مادة المهبط، فاستنتج أن الإلكترونات مكوّن مشترك في جميع الذرات. فاقترح نموذج «كعكة البرقوق»: ذرة كروية موجبة الشحنة تتوزع فيها إلكترونات سالبة. ثم نقض رذرفورد هذا النموذج.`;
        } },
    ruth: { c: [R('E', 'طاقة جسيمات ألفا (MeV)', 2, 9, .5, 5), R('Z', 'العدد الذري لنواة الهدف', 13, 79, 1, 79), R('n', 'عدد جسيمات ألفا المرسومة', 20, 300, 10, 120)],
        f(v, t) {
            const h = YQH(cx), X = YQX, T0 = t || performance.now() / 1000, K = 1.44 * v.Z / v.E, Kpx = Math.max(5, K * .5), nx = 360, ny = 165, cache = window.__yqR = window.__yqR || {};
            const key = v.E + '|' + v.Z + '|' + v.n;
            if (cache.key !== key) {
                cache.key = key;
                cache.P = [];
                const nn = v.n | 0;
                for (let i = 0; i < nn; i++) {
                    const b = ((i + .5) / nn * 2 - 1) * 150 + (Math.sin(i * 91.7) * 3);
                    let px = 50, py = ny + b, vx = 1, vy = 0;
                    const pts = [[px, py]];
                    let ok = true;
                    for (let s = 0; s < 900; s++) {
                        const dx = px - nx, dy = py - ny, r2 = dx * dx + dy * dy, r = Math.sqrt(r2) + 1e-6, a = Kpx / r2, ax = a * dx / r, ay = a * dy / r;
                        vx += ax * .5;
                        vy += ay * .5;
                        px += vx * .5;
                        py += vy * .5;
                        if (s % 5 == 0)
                            pts.push([px, py]);
                        if (px > 620 || px < 30 || py < 10 || py > 320)
                            break;
                    }
                    const ang = Math.atan2(vy, vx) * 180 / Math.PI;
                    cache.P.push({ pts, ang: Math.abs(ang) });
                }
            }
            h.bg(W, H, '#0b1220', '#070d18');
            cx.fillStyle = '#475569';
            cx.fillRect(20, ny - 18, 30, 36);
            h.T('مصدر α', 35, ny + 34, '#94a3b8', 9);
            cx.fillStyle = 'rgba(250,204,21,.07)';
            cx.fillRect(nx - 6, 20, 12, 290);
            h.T('صفيحة الذهب الرقيقة', nx, 14, '#fde68a', 10);
            for (let k = 0; k < 18; k++) {
                cx.fillStyle = 'rgba(250,204,21,.25)';
                cx.beginPath();
                cx.arc(nx, 28 + k * 16, 3.5, 0, 7);
                cx.fill();
            }
            cache.P.forEach((p, i) => { const col = p.ang > 90 ? '#ef4444' : p.ang > 20 ? '#fb923c' : 'rgba(125,211,252,.55)'; cx.strokeStyle = col; cx.lineWidth = p.ang > 20 ? 1.6 : .8; cx.beginPath(); p.pts.forEach((q, j) => j ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.stroke(); const L = p.pts.length, ph = ((T0 * .5 + i * .137) % 1) * L, j = Math.floor(ph), q = p.pts[Math.min(L - 1, j)]; if (!q)
                return; cx.fillStyle = p.ang > 20 ? '#fde047' : '#e0f2fe'; cx.beginPath(); cx.arc(q[0], q[1], 2.4, 0, 7); cx.fill(); });
            cx.shadowColor = '#ef4444';
            cx.shadowBlur = 18;
            cx.fillStyle = '#ef4444';
            cx.beginPath();
            cx.arc(nx, ny, 5, 0, 7);
            cx.fill();
            cx.shadowBlur = 0;
            h.T('النواة (موجبة، صغيرة جدًا)', nx + 80, ny + 4, '#fca5a5', 10);
            const N = 1389, A = Math.pow(2.88e5, 2), frac = th => Math.min(1, N * Math.PI * Math.pow(K / Math.tan(th * Math.PI / 360) / 2 * 1, 2) * 4 / 4 / A), bins = [['>1°', 1], ['>10°', 10], ['>45°', 45], ['>90°', 90], ['>150°', 150]];
            const f2 = th => Math.min(1, N * Math.PI * Math.pow((K) / Math.tan(th * Math.PI / 360), 2) / A);
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(448, 20, 184, 196);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(448, 20, 184, 196);
            h.T('نسبة الجسيمات المنحرفة (تقدير)', 540, 38, '#bff3ff', 10.5);
            bins.forEach((b, i) => { const y = 56 + i * 30, fr = f2(b[1]), lg = fr > 0 ? Math.max(0, Math.min(1, (Math.log10(fr) + 6) / 6)) : 0; h.T(b[0], 466, y + 10, '#e2e8f0', 10, 'left'); cx.fillStyle = '#1e293b'; cx.fillRect(496, y, 128, 12); cx.fillStyle = b[1] >= 90 ? '#ef4444' : b[1] >= 45 ? '#fb923c' : '#38bdf8'; cx.fillRect(496, y, 128 * lg, 12); h.T(fr >= .01 ? (fr * 100).toFixed(0) + '%' : '1 من ' + Math.round(1 / Math.max(fr, 1e-12)).toLocaleString('en'), 620, y + 22, '#94a3b8', 8.5, 'right'); });
            h.T('مستقيم: معظم الجسيمات تنفذ دون انحراف ⟹ الذرة معظمها فراغ', 320, H - 26, '#86efac', 11);
            h.T('انحراف حاد: نادر ⟹ مركز صغير ثقيل موجب (النواة)', 320, H - 8, '#fca5a5', 11);
            const frac90 = f2(90);
            return `تجربة رذرفورد (غايغر ومارسدن 1909): قصفت جسيمات ألفا (موجبة، طاقتها ${v.E} MeV) صفيحة ذهب رقيقة جدًا. المشاهدات: (1) معظم الجسيمات نفذت دون انحراف يُذكر؛ (2) بعضها انحرف زوايا صغيرة؛ (3) عدد ضئيل جدًا ارتدّ بزاوية أكبر من 90° (نحو 1 من 8000 في التجربة الأصلية). الاستنتاج: الذرة معظمها فراغ، وفي مركزها نواة صغيرة جدًا (≈10⁻¹⁵ m مقابل ≈10⁻¹⁰ m للذرة) موجبة الشحنة تتركز فيها معظم الكتلة، والإلكترونات تدور حولها. دليل الحساب: مسافة الاقتراب الأعظمي للجسيمات تتناسب مع Z/E، وهنا نسبة التشتت فوق 90° المقدّرة ${frac90 >= 1e-3 ? (frac90 * 100).toFixed(2) + '%' : '1 من ' + Math.round(1 / Math.max(frac90, 1e-12)).toLocaleString('en')} للهدف ذي العدد الذري ${v.Z}. زيادة Z أو إنقاص الطاقة تزيد التشتت. الرسم مكبّر جدًا قرب نواة واحدة لتظهر المسارات.`;
        } },
    bohr: { c: [R('ni', 'المستوى الابتدائي n_i', 1, 7, 1, 3), R('nf', 'المستوى النهائي n_f', 1, 7, 1, 2), R('Z', 'العدد الذري للأيون الشبيه بالهيدروجين', 1, 3, 1, 1)],
        f(v, t) {
            const h = YQH(cx), X = YQX, T0 = t || performance.now() / 1000, Z = v.Z | 0;
            let ni = v.ni | 0, nf = v.nf | 0;
            if (ni === nf)
                nf = ni > 1 ? ni - 1 : ni + 1;
            const En = n => -13.6 * Z * Z / (n * n), dE = Math.abs(En(ni) - En(nf)), lam = 1239.84 / dE, emit = ni > nf, cxo = 170, cyo = 165, rr = n => 3.4 * n * n + 10;
            h.bg(W, H, '#0b1020', '#080c18');
            for (let n = 1; n <= 7; n++) {
                cx.strokeStyle = n === ni || n === nf ? 'rgba(125,211,252,.7)' : 'rgba(148,163,184,.25)';
                cx.lineWidth = n === ni || n === nf ? 1.6 : 1;
                cx.beginPath();
                cx.arc(cxo, cyo, rr(n), 0, 7);
                cx.stroke();
                h.T(String(n), cxo + rr(n) * .72 + 4, cyo - rr(n) * .7, '#64748b', 9);
            }
            X.sphere(cx, cxo, cyo, 9, '#ef4444', '+', null);
            const cyc = T0 % 5, state = cyc < 1.6 ? 0 : cyc < 1.9 ? 1 : 2;
            let n = state === 0 ? ni : state === 2 ? nf : (ni + nf) / 2, ang = T0 * (2.2 / n) + .5;
            const ex = cxo + rr(n) * Math.cos(ang), ey = cyo + rr(n) * Math.sin(ang);
            X.sphere(cx, ex, ey, 6, '#38bdf8', '−');
            const col = X.wl(lam);
            if (state === 1) {
                cx.fillStyle = col;
                cx.globalAlpha = .45;
                cx.beginPath();
                cx.arc(ex, ey, 18, 0, 7);
                cx.fill();
                cx.globalAlpha = 1;
            }
            if (state === 2 && emit) {
                const u = (cyc - 1.9) / 3.1;
                const px = ex + u * 190 * Math.cos(ang), py = ey + u * 190 * Math.sin(ang);
                cx.strokeStyle = col;
                cx.lineWidth = 2.6;
                cx.beginPath();
                for (let k = 0; k < 26; k++) {
                    const q = px - k * Math.cos(ang) * 3, w = Math.sin(k * .9) * 5;
                    const ox = q - w * Math.sin(ang), oy = py - k * Math.sin(ang) * 3 + w * Math.cos(ang);
                    k ? cx.lineTo(ox, oy) : cx.moveTo(ox, oy);
                }
                cx.stroke();
                h.T(`فوتون ${lam.toFixed(0)} nm`, Math.max(40, Math.min(300, px)), Math.max(30, Math.min(300, py)) - 10, col, 10);
            }
            if (!emit && state === 0) {
                const u = 1 - cyc / 1.6, px = cxo + rr(ni) + u * 150, py = cyo - 40 * u;
                cx.strokeStyle = col;
                cx.lineWidth = 2.6;
                cx.beginPath();
                for (let k = 0; k < 26; k++) {
                    const q = px + k * 3, w = Math.sin(k * .9) * 5;
                    k ? cx.lineTo(q, py + w) : cx.moveTo(q, py + w);
                }
                cx.stroke();
                h.T('فوتون ممتص', px + 40, py - 10, col, 10);
            }
            const lx = 370, top = 40, bot = 250, yv = n => bot - (1 - 1 / (n * n)) * (bot - top);
            cx.fillStyle = 'rgba(255,255,255,.05)';
            cx.fillRect(350, 20, 150, 250);
            h.T('مستويات الطاقة (eV)', 425, 34, '#bff3ff', 10);
            for (let n = 1; n <= 7; n++) {
                const y = yv(n);
                cx.strokeStyle = n === ni || n === nf ? '#fde68a' : '#64748b';
                cx.lineWidth = n === ni || n === nf ? 2.4 : 1.2;
                cx.beginPath();
                cx.moveTo(lx, y);
                cx.lineTo(lx + 90, y);
                cx.stroke();
                h.T(`n=${n}: ${En(n).toFixed(2)}`, lx + 94, y + 4, n === ni || n === nf ? '#fde68a' : '#94a3b8', 9, 'left');
            }
            X.arrow(cx, lx + 45, yv(ni), lx + 45, yv(nf), col, 2.8);
            const sy = 290, sx0 = 350, sw = 270;
            cx.fillStyle = '#0b1020';
            cx.fillRect(sx0, sy - 18, sw, 22);
            for (let i = 0; i < sw; i++) {
                cx.fillStyle = X.wl(380 + i / sw * 400);
                cx.fillRect(sx0 + i, sy - 18, 1, 22);
            }
            const lp = lam >= 380 && lam <= 780 ? sx0 + (lam - 380) / 400 * sw : null;
            cx.fillStyle = 'rgba(0,0,0,.55)';
            if (emit && lp !== null) {
                cx.fillRect(sx0, sy - 18, sw, 22);
                cx.fillStyle = col;
                cx.fillRect(lp - 2, sy - 18, 4, 22);
            }
            else if (!emit && lp !== null) {
                cx.fillStyle = '#000';
                cx.fillRect(lp - 2, sy - 18, 4, 22);
            }
            h.T('380', sx0, sy + 16, '#94a3b8', 9);
            h.T('780 nm', sx0 + sw, sy + 16, '#94a3b8', 9);
            h.T(lp === null ? (lam < 380 ? 'الأشعة فوق البنفسجية (خارج المرئي)' : 'الأشعة تحت الحمراء (خارج المرئي)') : 'طيف ' + (emit ? 'الانبعاث' : 'الامتصاص'), sx0 + sw / 2, sy - 24, '#cbd5e1', 10);
            const ser = nf < ni ? nf : ni, sn = ser === 1 ? 'ليمان (فوق بنفسجي)' : ser === 2 ? 'بالمر (مرئي)' : ser === 3 ? 'باشن (تحت أحمر)' : 'سلسلة أخرى';
            h.T(`${emit ? 'انتقال انبعاث' : 'انتقال امتصاص'}: n=${ni} → n=${nf}  ·  ΔE = ${dE.toFixed(2)} eV  ·  λ = ${lam.toFixed(0)} nm  ·  سلسلة ${sn}`, W / 2, H - 8, '#f8fafc', 10.5);
            return `نموذج بور (1913): الإلكترون يدور في مدارات (مستويات) محددة طاقتها Eₙ = −13.6·Z²/n² eV. عند انتقال الإلكترون من المستوى ${ni} إلى ${nf} ${emit ? 'يُطلق فوتونًا' : 'يمتص فوتونًا'} طاقته ΔE = |E_i − E_f| = ${dE.toFixed(2)} eV وطوله الموجي λ = hc/ΔE = 1240/ΔE = ${lam.toFixed(0)} nm (${lam < 380 ? 'فوق بنفسجي' : lam > 780 ? 'تحت أحمر' : 'ضوء مرئي'}). ولهذا يعطي كل عنصر طيف خطوط محددًا؛ سلسلة ليمان (n_f=1) فوق بنفسجية، وبالمر (n_f=2) مرئية، وباشن (n_f=3) تحت حمراء. نصف قطر المدار r = 0.529·n²/Z Å. نجح النموذج في تفسير طيف الهيدروجين لكنه لم ينجح مع الذرات متعددة الإلكترونات، فتطور إلى النموذج الكمي.`;
        } },
    atomparts: { c: [R('Z', 'العدد الذري Z (عدد البروتونات)', 1, 20, 1, 6), R('N', 'عدد النيوترونات N', 0, 25, 1, 6), R('ch', 'الشحنة الصافية', -3, 3, 1, 0)],
        f(v, t) {
            const h = YQH(cx), X = YQX, T0 = t || performance.now() / 1000, Z = v.Z | 0, N = v.N | 0, ch = v.ch | 0, E = Math.max(0, Z - ch), A = Z + N, NM = ['', 'هيدروجين', 'هيليوم', 'ليثيوم', 'بيريليوم', 'بورون', 'كربون', 'نيتروجين', 'أكسجين', 'فلور', 'نيون', 'صوديوم', 'مغنيسيوم', 'ألمنيوم', 'سيليكون', 'فسفور', 'كبريت', 'كلور', 'أرغون', 'بوتاسيوم', 'كالسيوم'], SY = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'], CN = [0, 0, 2, 4, 5, 6, 6, 7, 8, 10, 10, 12, 12, 14, 14, 16, 16, 18, 22, 20, 20], SUP = { '1': '⁺', '2': '²⁺', '3': '³⁺', '-1': '⁻', '-2': '²⁻', '-3': '³⁻', '0': '' };
            h.bg(W, H, '#0b1424', '#070d19');
            const cxo = 170, cyo = 165, sh = [];
            let r = E;
            [2, 8, 8, 2].forEach(k => { const m = Math.min(r, k); if (m > 0)
                sh.push(m); r -= m; });
            const R0 = [40, 72, 104, 132];
            sh.forEach((m, i) => { cx.strokeStyle = 'rgba(125,211,252,.3)'; cx.setLineDash([4, 5]); cx.beginPath(); cx.arc(cxo, cyo, R0[i], 0, 7); cx.stroke(); cx.setLineDash([]); for (let j = 0; j < m; j++) {
                const a = T0 * (1.4 - i * .28) + j * 6.2832 / m + i;
                X.sphere(cx, cxo + R0[i] * Math.cos(a), cyo + R0[i] * Math.sin(a), 5.5, '#38bdf8', '−');
            } });
            const tot = Z + N, seq = [];
            for (let i = 0, p = 0, n = 0; i < tot; i++) {
                if ((i % 2 == 0 && p < Z) || n >= N) {
                    seq.push('p');
                    p++;
                }
                else {
                    seq.push('n');
                    n++;
                }
            }
            const nr = Math.max(8, 4.6 * Math.sqrt(tot) + 6);
            cx.fillStyle = 'rgba(248,113,113,.14)';
            cx.beginPath();
            cx.arc(cxo, cyo, nr + 5, 0, 7);
            cx.fill();
            seq.forEach((k, i) => { const a = i * 2.39996, rr = 4.7 * Math.sqrt(i + .5); X.sphere(cx, cxo + rr * Math.cos(a), cyo + rr * Math.sin(a), 5.4, k === 'p' ? '#ef4444' : '#94a3b8', k === 'p' ? '+' : ''); });
            h.T('النواة: بروتونات (+) ونيوترونات', cxo, cyo + nr + 22, '#cbd5e1', 10);
            const rx = 360;
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(rx, 18, 272, 300);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(rx, 18, 272, 300);
            cx.fillStyle = '#fde68a';
            cx.font = '800 56px Cairo';
            cx.textAlign = 'center';
            cx.direction = 'ltr';
            cx.fillText(SY[Z] + (SUP[String(ch)] || ''), rx + 150, 92);
            cx.font = '800 18px Cairo';
            cx.textAlign = 'right';
            cx.fillStyle = '#fca5a5';
            cx.fillText(String(A), rx + 70, 52);
            cx.fillStyle = '#86efac';
            cx.fillText(String(Z), rx + 70, 88);
            h.T(`${NM[Z]}${ch ? (ch > 0 ? ' (أيون موجب)' : ' (أيون سالب)') : ' (ذرة متعادلة)'}`, rx + 136, 118, '#e2e8f0', 13);
            h.T(`النظير: ${NM[Z]}-${A}${N === CN[Z] ? ' (الأشيع)' : ' (نظير نادر)'}`, rx + 136, 138, '#bff3ff', 11);
            [['البروتونات (p⁺)', Z, '#fca5a5', 'كتلة 1.673×10⁻²⁷ kg · شحنة +1'], ['النيوترونات (n⁰)', N, '#cbd5e1', 'كتلة 1.675×10⁻²⁷ kg · شحنة 0'], ['الإلكترونات (e⁻)', E, '#7dd3fc', 'كتلة 9.11×10⁻³¹ kg · شحنة −1']].forEach((l, i) => { const y = 168 + i * 44; h.T(l[0], rx + 262, y, l[2], 12, 'right'); h.T(String(l[1]), rx + 22, y + 2, '#fff', 20, 'left'); h.T(l[3], rx + 262, y + 17, '#94a3b8', 9, 'right'); });
            h.T(`العدد الكتلي A = Z + N = ${A}  ·  الشحنة = ${Z} − ${E} = ${ch > 0 ? '+' : ''}${ch}`, rx + 136, 306, '#fde68a', 11);
            h.T(`التوزيع الإلكتروني: ${sh.join(' , ') || '—'}`, rx + 136, 280, '#86efac', 10);
            return `مكونات الذرة: النواة تحوي البروتونات (+1، كتلتها ≈ 1 u) والنيوترونات (0، كتلتها ≈ 1 u)، وتدور حولها الإلكترونات (−1، كتلتها أقل بنحو 1836 مرة) في مستويات طاقة. العدد الذري Z = عدد البروتونات يحدد العنصر (هنا ${NM[Z]} Z=${Z})، والعدد الكتلي A = البروتونات + النيوترونات = ${A}. في الذرة المتعادلة عدد الإلكترونات = عدد البروتونات؛ وعند فقد إلكترونات تصبح أيونًا موجبًا، وعند اكتسابها أيونًا سالبًا: الإلكترونات الآن ${E} والشحنة ${ch > 0 ? '+' : ''}${ch}. النظائر ذرات للعنصر نفسه تختلف في عدد النيوترونات (مثل ${NM[Z]}-${A}).`;
        } },
    vcomp: { c: [R('A', 'مقدار المتجه A', 1, 10, .5, 8), R('th', 'زاوية المتجه θ عن محور x الموجب (°)', 0, 360, 5, 35)],
        f(v, t) {
            const h = YQH, hh = YQH(cx), X = YQX, th = v.th * Math.PI / 180, Ax = v.A * Math.cos(th), Ay = v.A * Math.sin(th), u = 12, ox = 200, oy = 170, q = Ax >= 0 && Ay >= 0 ? 1 : Ax < 0 && Ay >= 0 ? 2 : Ax < 0 ? 3 : 4, QN = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'];
            hh.bg(W, H);
            X.grid(cx, ox, oy, u, 16, 13);
            const hx = ox + Ax * u, hy = oy - Ay * u;
            if (Math.abs(Ax) > .01)
                X.arrow(cx, ox, oy, hx, oy, '#38bdf8', 3);
            if (Math.abs(Ay) > .01)
                X.arrow(cx, hx, oy, hx, hy, '#f472b6', 3);
            cx.strokeStyle = 'rgba(255,255,255,.3)';
            cx.setLineDash([3, 4]);
            cx.beginPath();
            cx.moveTo(hx, hy);
            cx.lineTo(hx, oy);
            cx.moveTo(hx, hy);
            cx.lineTo(ox, hy);
            cx.stroke();
            cx.setLineDash([]);
            X.arrow(cx, ox, oy, hx, hy, '#fbbf24', 3.6);
            cx.strokeStyle = '#fde68a';
            cx.lineWidth = 1.6;
            cx.beginPath();
            cx.arc(ox, oy, 26, 0, -th, true);
            cx.stroke();
            hh.T('θ = ' + v.th + '°', ox + 40, oy - (th > 0 && th < Math.PI ? 12 : -24) * (th > Math.PI ? -1 : 1), '#fde68a', 11);
            hh.T('A = ' + v.A, hx + (Ax >= 0 ? 14 : -14), hy + (Ay >= 0 ? -8 : 14), '#fbbf24', 12, Ax >= 0 ? 'left' : 'right');
            hh.T('Aₓ = ' + Ax.toFixed(2), (ox + hx) / 2, oy + (Ay >= 0 ? 26 : -12), '#7dd3fc', 11);
            hh.T('A_y = ' + Ay.toFixed(2), hx + (Ax >= 0 ? 44 : -44), (oy + hy) / 2, '#f9a8d4', 11);
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(440, 18, 192, 296);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(440, 18, 192, 296);
            hh.T('تحليل المتجه إلى مركّبتين', 536, 38, '#fde68a', 12);
            [['Aₓ = A cosθ', '#7dd3fc'], [`= ${v.A}×cos ${v.th}° = ${Ax.toFixed(2)}`, '#e2e8f0'], ['A_y = A sinθ', '#f9a8d4'], [`= ${v.A}×sin ${v.th}° = ${Ay.toFixed(2)}`, '#e2e8f0'], ['A = √(Aₓ² + A_y²)', '#fbbf24'], [`= √(${Ax.toFixed(2)}² + ${Ay.toFixed(2)}²) = ${Math.hypot(Ax, Ay).toFixed(2)}`, '#e2e8f0'], ['tanθ = A_y / Aₓ', `#fbbf24`], [`= ${Math.abs(Ax) < 1e-9 ? '∞' : (Ay / Ax).toFixed(2)}`, '#e2e8f0']].forEach((l, i) => hh.T(l[0], 536, 66 + i * 24, l[1], 11));
            hh.T(`الربع ${QN[q]}: Aₓ ${Ax >= 0 ? 'موجبة (+)' : 'سالبة (−)'} · A_y ${Ay >= 0 ? 'موجبة (+)' : 'سالبة (−)'}`, 536, 276, '#86efac', 10.5);
            hh.T(Math.abs(Ax) < 1e-9 ? 'المتجه على محور y' : Math.abs(Ay) < 1e-9 ? 'المتجه على محور x' : '', 536, 296, '#94a3b8', 10);
            return `يُحلَّل أي متجه A يصنع الزاوية θ مع محور x الموجب إلى مركّبتين متعامدتين: Aₓ = A cosθ (على محور x) وA_y = A sinθ (على محور y). تتغير إشارة المركّبتين حسب الربع الذي يقع فيه المتجه: الأول (+،+)، الثاني (−،+)، الثالث (−،−)، الرابع (+،−). هنا A = ${v.A} وθ = ${v.th}° (الربع ${QN[q]}) فتكون Aₓ = ${Ax.toFixed(2)} وA_y = ${Ay.toFixed(2)}، ويمكن استرجاع المقدار من A = √(Aₓ² + A_y²) والاتجاه من tanθ = A_y/Aₓ مع مراعاة الربع.`;
        } },
    vadd: { c: [R('A', 'مقدار المتجه A', 1, 10, .5, 8), R('tA', 'زاوية A (°)', 0, 360, 5, 20), R('B', 'مقدار المتجه B', 1, 10, .5, 6), R('tB', 'زاوية B (°)', 0, 360, 5, 110)],
        f(v, t) {
            const hh = YQH(cx), X = YQX, r = d => d * Math.PI / 180, Ax = v.A * Math.cos(r(v.tA)), Ay = v.A * Math.sin(r(v.tA)), Bx = v.B * Math.cos(r(v.tB)), By = v.B * Math.sin(r(v.tB)), Rx = Ax + Bx, Ry = Ay + By, Rm = Math.hypot(Rx, Ry);
            let tR = Math.atan2(Ry, Rx) * 180 / Math.PI;
            if (tR < 0)
                tR += 360;
            const mx = Math.max(v.A, v.B, Rm, Math.abs(Ax) + Math.abs(Bx)), u = Math.min(12, 150 / Math.max(mx, 6)), ox = 200, oy = 170;
            hh.bg(W, H);
            X.grid(cx, ox, oy, u, Math.floor(190 / u), Math.floor(155 / u), u < 8 ? 5 : 2);
            const P = (x, y) => [ox + x * u, oy - y * u];
            const [a1, a2] = P(Ax, Ay), [b1, b2] = P(Bx, By), [r1, r2] = P(Rx, Ry);
            cx.strokeStyle = 'rgba(255,255,255,.28)';
            cx.setLineDash([4, 4]);
            cx.beginPath();
            cx.moveTo(a1, a2);
            cx.lineTo(r1, r2);
            cx.moveTo(b1, b2);
            cx.lineTo(r1, r2);
            cx.stroke();
            cx.setLineDash([]);
            X.arrow(cx, ox, oy, a1, a2, '#38bdf8', 3);
            X.arrow(cx, ox, oy, b1, b2, '#f87171', 3);
            X.arrow(cx, a1, a2, r1, r2, '#f87171', 1.8, true);
            X.arrow(cx, ox, oy, r1, r2, '#4ade80', 4);
            cx.strokeStyle = 'rgba(74,222,128,.7)';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(ox, oy + 6);
            cx.lineTo(r1, oy + 6);
            cx.lineTo(r1, r2);
            cx.stroke();
            hh.T('Rₓ', (ox + r1) / 2, oy + 22, '#86efac', 10);
            hh.T('R_y', r1 + (Rx >= 0 ? 16 : -16), (oy + r2) / 2, '#86efac', 10);
            hh.T('A', a1 + 8, a2 - 6, '#7dd3fc', 12);
            hh.T('B', b1 + 8, b2 - 6, '#fca5a5', 12);
            hh.T('R = A + B', r1 + (Rx >= 0 ? 10 : -10), r2 - 10, '#4ade80', 12, Rx >= 0 ? 'left' : 'right');
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(430, 18, 202, 296);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(430, 18, 202, 296);
            hh.T('الجمع بالمركّبات', 531, 38, '#fde68a', 12);
            [[`Aₓ = ${Ax.toFixed(2)}   A_y = ${Ay.toFixed(2)}`, '#7dd3fc'], [`Bₓ = ${Bx.toFixed(2)}   B_y = ${By.toFixed(2)}`, '#fca5a5'], ['Rₓ = Aₓ + Bₓ = ' + Rx.toFixed(2), '#86efac'], ['R_y = A_y + B_y = ' + Ry.toFixed(2), '#86efac'], ['R = √(Rₓ² + R_y²) = ' + Rm.toFixed(2), '#fde68a'], ['θ_R = tan⁻¹(R_y/Rₓ) = ' + tR.toFixed(1) + '°', '#fde68a']].forEach((l, i) => hh.T(l[0], 531, 70 + i * 30, l[1], 10.5));
            hh.T(`R يقع في الربع ${Rx >= 0 && Ry >= 0 ? 'الأول' : Rx < 0 && Ry >= 0 ? 'الثاني' : Rx < 0 ? 'الثالث' : 'الرابع'}`, 531, 262, '#c4b5fd', 11);
            hh.T(Math.abs(v.tA - v.tB) % 360 === 180 && Math.abs(v.A - v.B) < .01 ? 'متجهان متعاكسان متساويان: R = 0' : Math.abs(v.tA - v.tB) % 360 === 0 ? 'في الاتجاه نفسه: R = A + B' : '', 531, 284, '#94a3b8', 10);
            return `جمع المتجهات بالمركّبات: نحلل كل متجه إلى مركّبتيه ثم نجمع المركّبات المتشابهة: Rₓ = Aₓ + Bₓ = ${Rx.toFixed(2)} وR_y = A_y + B_y = ${Ry.toFixed(2)}، فيكون المقدار R = √(Rₓ² + R_y²) = ${Rm.toFixed(2)} والاتجاه θ = tan⁻¹(R_y/Rₓ) = ${tR.toFixed(1)}° مع مراعاة الربع (نستخدم قيم الإشارات لتحديد الزاوية الصحيحة من 0° إلى 360°). يوضح الرسم طريقتي الجمع الهندسيتين: متوازي الأضلاع، وطريقة الذيل بالرأس (المتجه المنقط). غيّر زاوية كل متجه لترى كيف تتغير المحصلة؛ فإذا كانا في الاتجاه نفسه كانت R = A + B، وإذا كانا متعاكسين كانت R = |A − B|.`;
        } },
    vdot: { c: [R('A', 'مقدار المتجه A', 1, 10, .5, 8), R('B', 'مقدار المتجه B', 1, 10, .5, 6), R('th', 'الزاوية بين المتجهين θ (°)', 0, 180, 5, 50)],
        f(v, t) {
            const hh = YQH(cx), X = YQX, th = v.th * Math.PI / 180, dot = v.A * v.B * Math.cos(th), proj = v.B * Math.cos(th), u = 12, ox = 120, oy = 190;
            hh.bg(W, H);
            {
                const _ft = cx.fillText;
                cx.fillText = function (a, x, y, m) { if (x >= 8 && x <= 372)
                    return m == null ? _ft.call(this, a, x, y) : _ft.call(this, a, x, y, m); };
                cx.save();
                cx.beginPath();
                cx.rect(0, 0, 376, H);
                cx.clip();
                X.grid(cx, ox, oy, u, Math.floor(100 / u * 1.4) + 6, 14, 2);
                cx.restore();
                cx.fillText = _ft;
            }
            const Bx = v.B * Math.cos(th), By = v.B * Math.sin(th), bx = ox + Bx * u, by = oy - By * u, ax = ox + v.A * u;
            cx.strokeStyle = 'rgba(74,222,128,.9)';
            cx.lineWidth = 7;
            cx.lineCap = 'round';
            cx.beginPath();
            cx.moveTo(ox, oy + 0);
            cx.lineTo(ox + proj * u, oy);
            cx.stroke();
            cx.strokeStyle = 'rgba(255,255,255,.4)';
            cx.setLineDash([4, 4]);
            cx.lineWidth = 1.4;
            cx.beginPath();
            cx.moveTo(bx, by);
            cx.lineTo(bx, oy);
            cx.stroke();
            cx.setLineDash([]);
            X.arrow(cx, ox, oy, ax, oy, '#fbbf24', 3.4);
            X.arrow(cx, ox, oy, bx, by, '#38bdf8', 3.4);
            cx.strokeStyle = '#fde68a';
            cx.lineWidth = 1.6;
            cx.beginPath();
            cx.arc(ox, oy, 30, 0, -th, true);
            cx.stroke();
            hh.T('θ = ' + v.th + '°', ox + 48, oy - 16, '#fde68a', 11);
            hh.T('A', ax + 10, oy - 8, '#fbbf24', 13);
            hh.T('B', bx + 10, by - 6, '#7dd3fc', 13);
            hh.T('B cosθ = ' + proj.toFixed(2), ox + proj * u / 2, oy + 26, '#86efac', 11);
            const cx0 = 380;
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(cx0, 18, 252, 296);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(cx0, 18, 252, 296);
            hh.T('الضرب القياسي (النقطي) A · B', cx0 + 126, 38, '#fde68a', 12);
            [['A · B = A B cosθ', '#fde68a'], [`= ${v.A} × ${v.B} × cos ${v.th}°`, '#e2e8f0'], [`= ${dot.toFixed(2)}`, '#4ade80'], ['بالمركّبات: Aₓ Bₓ + A_y B_y', '#7dd3fc'], [`= ${v.A}×${Bx.toFixed(2)} + 0×${By.toFixed(2)} = ${(v.A * Bx).toFixed(2)}`, '#e2e8f0'], ['A · B = A × (مسقط B على A)', '#86efac']].forEach((l, i) => hh.T(l[0], cx0 + 126, 70 + i * 32, l[1], 10.5));
            hh.T(v.th < 90 ? 'θ < 90°: الناتج موجب (قياسي)' : v.th === 90 ? 'θ = 90°: متعامدان، الناتج صفر' : 'θ > 90°: الناتج سالب', cx0 + 126, 268, v.th < 90 ? '#86efac' : v.th === 90 ? '#fde68a' : '#fca5a5', 11);
            hh.T('الناتج كمية قياسية (عدد) وليس متجهًا', cx0 + 126, 290, '#94a3b8', 10);
            return `الضرب القياسي (النقطي): A·B = A B cosθ = ${dot.toFixed(2)}، ويساوي أيضًا Aₓ Bₓ + A_y B_y. هو مسقط أحد المتجهين على الآخر مضروبًا في مقدار الآخر. الناتج كمية قياسية: موجب عندما θ < 90°، وصفر عندما يتعامد المتجهان (θ = 90°)، وسالب عندما θ > 90°، وأكبر قيمة A B عند θ = 0°. من تطبيقاته الشغل W = F·d = F d cosθ؛ فالقوة المتعامدة مع الإزاحة لا تبذل شغلًا. ويصلح لإيجاد الزاوية بين متجهين: cosθ = A·B/(A B).`;
        } },
    vcross: { c: [R('A', 'مقدار المتجه A', 1, 10, .5, 8), R('B', 'مقدار المتجه B', 1, 10, .5, 6), R('th', 'الزاوية بين المتجهين θ (°)', 0, 180, 5, 60), R('o', 'الترتيب (0 A×B، 1 B×A)', 0, 1, 1, 0)],
        f(v, t) {
            const hh = YQH(cx), X = YQX, th = v.th * Math.PI / 180, sn = Math.sin(th), mag = v.A * v.B * sn, sg = v.o === 1 ? -1 : 1, u = 11, ox = 110, oy = 215;
            hh.bg(W, H);
            X.grid(cx, ox, oy, u, 9, 14, 5);
            const Bx = v.B * Math.cos(th), By = v.B * Math.sin(th);
            cx.fillStyle = 'rgba(244,114,182,.28)';
            cx.beginPath();
            cx.moveTo(ox, oy);
            cx.lineTo(ox + v.A * u, oy);
            cx.lineTo(ox + (v.A + Bx) * u, oy - By * u);
            cx.lineTo(ox + Bx * u, oy - By * u);
            cx.closePath();
            cx.fill();
            cx.strokeStyle = 'rgba(244,114,182,.9)';
            cx.lineWidth = 1.4;
            cx.stroke();
            X.arrow(cx, ox, oy, ox + v.A * u, oy, '#fbbf24', 3.2);
            X.arrow(cx, ox, oy, ox + Bx * u, oy - By * u, '#38bdf8', 3.2);
            hh.T('A', ox + v.A * u + 10, oy - 6, '#fbbf24', 13);
            hh.T('B', ox + Bx * u + 10, oy - By * u - 6, '#7dd3fc', 13);
            hh.T('المساحة = A B sinθ = ' + mag.toFixed(1), ox + (v.A + Bx) * u / 2 + 30, oy - By * u * .5 - 8, '#f9a8d4', 10.5);
            cx.strokeStyle = '#fde68a';
            cx.lineWidth = 1.5;
            cx.beginPath();
            cx.arc(ox, oy, 26, 0, -th, true);
            cx.stroke();
            hh.T(v.th + '°', ox + 38, oy - 14, '#fde68a', 10.5);
            const tx = 470, ty = 225, ux = 26, uyx = 14, uyy = -8, uz = Math.min(110, mag * 1.1 + 4);
            cx.fillStyle = 'rgba(255,255,255,.05)';
            cx.fillRect(330, 18, 302, 296);
            hh.T('منظور ثلاثي الأبعاد', 480, 38, '#bff3ff', 11);
            const proj = (x, y, z) => [tx + x * ux * .1 * 1 + y * uyx * .1 * 1, ty - z - 0 + (y * uyy * .1) * 1];
            const sx = (x, y, z) => [tx + x * 7 + y * 3.2, ty - y * 2.2 - z];
            X.arrow(cx, ...sx(0, 0, 0), ...sx(12, 0, 0), '#64748b', 1.4);
            X.arrow(cx, ...sx(0, 0, 0), ...sx(0, 12, 0), '#64748b', 1.4);
            X.arrow(cx, ...sx(0, 0, 0), ...sx(0, 0, 0).map((q, i) => i ? q - 150 : q), '#64748b', 1.4);
            hh.T('x', ...sx(12.8, 0, 0).map((q, i) => i ? q + 4 : q), '#94a3b8', 11);
            hh.T('y', ...sx(0, 13, 0).map((q, i) => i ? q - 4 : q), '#94a3b8', 11);
            hh.T('z', sx(0, 0, 0)[0] + 10, ty - 150, '#94a3b8', 11);
            const A3 = sx(v.A * .9, 0, 0), B3 = sx(v.B * .9 * Math.cos(th), v.B * .9 * Math.sin(th), 0);
            X.arrow(cx, ...sx(0, 0, 0), ...A3, '#fbbf24', 3);
            X.arrow(cx, ...sx(0, 0, 0), ...B3, '#38bdf8', 3);
            if (mag > .01) {
                const Z = sx(0, 0, sg * Math.min(130, mag * 2.2));
                X.arrow(cx, ...sx(0, 0, 0), ...Z, '#4ade80', 4);
                hh.T(v.o === 1 ? 'B × A' : 'A × B', Z[0] + 22, Z[1], '#86efac', 12);
            }
            hh.T(mag < .01 ? 'الناتج = 0 (المتجهان متوازيان)' : sg > 0 ? '⊙ باتجاه +z (خارج الصفحة)' : '⊗ باتجاه −z (داخل الصفحة)', 480, 296, '#fde68a', 11);
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(330, 40, 0, 0);
            hh.T(`|${v.o === 1 ? 'B × A' : 'A × B'}| = A B sinθ = ${mag.toFixed(2)}`, 480, 310, '#4ade80', 11);
            return `الضرب الاتجاهي (الصليبي): A × B متجه مقداره A B sinθ = ${mag.toFixed(2)} (يساوي مساحة متوازي الأضلاع المبني على المتجهين)، واتجاهه عمودي على المستوى الذي يحويهما بحسب قاعدة اليد اليمنى: نلفّ أصابع اليد اليمنى من الأول نحو الثاني عبر الزاوية الصغرى فيشير الإبهام إلى اتجاه الناتج (${sg > 0 ? 'خارج الصفحة +z' : 'داخل الصفحة −z'} هنا). الضرب الاتجاهي ليس إبداليًا: A × B = −(B × A). الناتج صفر عندما يكون المتجهان متوازيين (θ = 0° أو 180°)، وأكبر قيمة عند θ = 90°. من تطبيقاته: العزم τ = r × F، والقوة المغناطيسية F = qv × B.`;
        } },
    float: { c: [R('d', 'كثافة الجسم (kg/m³)', 200, 8000, 50, 900), R('f', 'كثافة السائل (kg/m³)', 700, 1400, 50, 1000)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, rho = v.f || 1000, d = v.d, g = 9.8, Vb = .001, box = 70, bx0 = 130, bx1 = 510, by = 278, base = 182, sub = Math.min(1, d / rho), flo = d < rho * .975, neu = Math.abs(d - rho) <= rho * .025;
            const st = window.__yqF = window.__yqF || { y: 90, vy: 0, tl: T0 }, dt = Math.min(.05, Math.max(0, T0 - st.tl));
            st.tl = T0;
            const rise = box * box * (flo ? sub : 1) / (bx1 - bx0), surf = base - rise, tgt = flo ? surf - (1 - sub) * box + box / 2 : neu ? (surf + by) / 2 : by - box / 2 - 2, inW = st.y + box / 2 > surf;
            if (!inW) {
                st.vy += 520 * dt;
                st.y += st.vy * dt;
            }
            else if (flo || neu) {
                st.vy = 0;
                const dy = tgt - st.y;
                st.y += Math.sign(dy) * Math.min(Math.abs(dy), Math.max(30, Math.abs(dy) * 6) * dt);
            }
            else {
                const vt = Math.min(190, 45 + Math.sqrt((d - rho) / rho) * 95);
                st.vy = Math.min(Math.max(st.vy, 30) + 300 * dt, vt);
                st.y = Math.min(tgt, st.y + st.vy * dt);
            }
            h.bg(W, H);
            const wg = cx.createLinearGradient(0, surf, 0, by);
            wg.addColorStop(0, 'rgba(56,189,248,.6)');
            wg.addColorStop(1, 'rgba(14,116,144,.85)');
            cx.fillStyle = wg;
            cx.beginPath();
            cx.moveTo(bx0, by);
            cx.lineTo(bx0, surf);
            for (let x = bx0; x <= bx1; x += 8)
                cx.lineTo(x, surf + Math.sin(T0 * 2 + x * .05) * 1.4);
            cx.lineTo(bx1, by);
            cx.closePath();
            cx.fill();
            cx.strokeStyle = 'rgba(224,249,255,.85)';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(bx0, 90);
            cx.lineTo(bx0, by);
            cx.lineTo(bx1, by);
            cx.lineTo(bx1, 90);
            cx.stroke();
            const cxm = 320, top = st.y - box / 2, lt = Math.max(28, Math.min(66, 88 - d / 110));
            cx.fillStyle = `hsl(32,${d > 1500 ? 6 : 70}%,${lt}%)`;
            cx.fillRect(cxm - box / 2, top, box, box);
            cx.strokeStyle = 'rgba(255,255,255,.8)';
            cx.lineWidth = 2;
            cx.strokeRect(cxm - box / 2, top, box, box);
            cx.fillStyle = 'rgba(255,255,255,.18)';
            cx.fillRect(cxm - box / 2, top, box, 10);
            h.T(d + ' kg/m³', cxm, st.y + 4, d > 1500 ? '#0f172a' : '#1e293b', 12);
            const Wn = d * Vb * g, Fb = rho * g * Vb * (flo ? sub : 1), arr = (x, y, len, col, l) => { h.L([[x, y], [x, y + len]], col, 4); h.arrow(x, y + len, 0, len > 0 ? 1 : -1, col); h.T(l, x + (x > cxm ? 20 : -20), y + len / 2, col, 12); };
            arr(cxm + 52, st.y, Math.min(40, Wn * 4), '#f87171', 'W');
            arr(cxm - 52, st.y, -Math.min(40, Fb * 4), '#38bdf8', 'F_b');
            h.T(`ρ الجسم = ${d} kg/m³`, W - 24, 28, '#fde68a', 13, 'right');
            h.T(`ρ السائل = ${rho} kg/m³`, W - 24, 48, '#7dd3fc', 13, 'right');
            const stt = neu ? 'الجسم معلّق: كثافته تساوي كثافة السائل تقريبًا' : flo ? `يطفو: الجزء المغمور ${(sub * 100).toFixed(0)}% من حجمه` : 'يغوص حتى القاع: وزنه أكبر من قوة الطفو';
            h.T(stt, W / 2, H - 26, '#f8fafc', 13);
            h.T(`W = ${Wn.toFixed(2)} N · F_b = ${Fb.toFixed(2)} N · القوة المحصلة = ${(Wn - Fb).toFixed(2)} N ${Wn > Fb + .05 ? '↓' : Wn < Fb - .05 ? '↑' : ''}`, W / 2, H - 6, '#cbd5e1', 12);
            return `قوة الطفو F_b = ρ_السائل · g · V_المغمور. وزن الجسم W = ρ_الجسم · g · V (حجم الجسم هنا 1 L = 0.001 m³). إذا كانت ρ_الجسم < ρ_السائل يطفو والجزء المغمور = ρ_الجسم/ρ_السائل؛ وإذا تساوتا يبقى معلّقًا؛ وإذا زادت ρ_الجسم عن ρ_السائل يغوص حتى القاع لأن W أكبر من F_b القصوى (عند الغمر الكامل). الآن: W = ${Wn.toFixed(2)} N وF_b = ${Fb.toFixed(2)} N، فالجسم ${neu ? 'معلّق' : flo ? 'يطفو' : 'يغوص'}. جرّب تغيير كثافة السائل (ماء عذب، ماء مالح 1025، زيت 800) لترى تغيّر الجزء المغمور.`;
        } },
    states: { c: [R('T', 'درجة الحرارة (°س)', -20, 150, 1, 20)],
        f(v, t) { const solid = v.T <= 0, liquid = v.T > 0 && v.T < 100, phase = solid ? 'صلب' : liquid ? 'سائل' : 'غاز', speed = Math.max(.3, Math.sqrt(v.T + 273) / 9); cx.fillStyle = 'rgba(8,24,35,.38)'; cx.fillRect(150, 55, 340, 245); cx.strokeStyle = 'rgba(220,245,250,.78)'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(150, 55); cx.lineTo(150, 290); cx.quadraticCurveTo(150, 302, 165, 302); cx.lineTo(475, 302); cx.quadraticCurveTo(490, 302, 490, 290); cx.lineTo(490, 55); cx.stroke(); cx.lineWidth = 1; cx.fillStyle = 'rgba(56,189,248,.12)'; if (liquid)
            cx.fillRect(153, 178, 334, 121); if (!P.length) {
            for (let i = 0; i < 40; i++)
                P.push({ x: solid ? 190 + (i % 8) * 37 : liquid ? 170 + Math.random() * 300 : 165 + Math.random() * 310, y: solid ? 100 + Math.floor(i / 8) * 34 : liquid ? 185 + Math.random() * 105 : 65 + Math.random() * 225, a: Math.random() * 6.3 });
        } P.forEach((p, i) => { if (solid) {
            p.x = 190 + (i % 8) * 37 + Math.cos(t * 3 + i) * 1.5;
            p.y = 100 + Math.floor(i / 8) * 34 + Math.sin(t * 3 + i) * 1.5;
        }
        else {
            p.x += Math.cos(p.a) * speed * (liquid ? .65 : 1.4);
            p.y += Math.sin(p.a) * speed * (liquid ? .65 : 1.4);
            p.a += Math.sin(t + i) * .012;
            if (liquid) {
                if (p.x < 160 || p.x > 480)
                    p.a = Math.PI - p.a;
                if (p.y < 180 || p.y > 292)
                    p.a = -p.a;
                p.y = Math.max(180, Math.min(292, p.y));
            }
            else {
                if (p.x < 160 || p.x > 480)
                    p.a = Math.PI - p.a;
                if (p.y < 65 || p.y > 292)
                    p.a = -p.a;
            }
        } cx.fillStyle = solid ? '#a5b4fc' : liquid ? '#38bdf8' : '#fb7185'; cx.shadowColor = cx.fillStyle; cx.shadowBlur = solid ? 2 : 5; cx.beginPath(); cx.arc(p.x, p.y, solid ? 5 : 6, 0, 7); cx.fill(); }); cx.shadowBlur = 0; cx.fillStyle = '#eafaff'; cx.font = '12px Cairo'; cx.fillText(`T = ${v.T}°س`, 20, 28); return `الحالة: ${phase} · حركة الجسيمات ${solid ? 'اهتزاز حول مواضع ثابتة' : liquid ? 'تنزلق وتتبادل المواقع' : 'سريعة ومتباعدة'} · عند الضغط الجوي التقريبي: الانصهار 0°س والغليان 100°س`; } },
    photo: { c: [R('d', 'بعد المصباح (سم)', 5, 50, 1, 10)],
        f(v, t) { const intensity = Math.round(100 * Math.pow(5 / v.d, 2)), rate = Math.round(60 / Math.pow(v.d / 5, 2) * 10) / 10; const lamp = cx.createRadialGradient(82, 145, 5, 82, 145, 65); lamp.addColorStop(0, 'rgba(255,250,180,.95)'); lamp.addColorStop(1, 'rgba(255,210,70,0)'); cx.fillStyle = lamp; cx.fillRect(15, 75, 140, 140); cx.fillStyle = '#fff7c2'; cx.beginPath(); cx.arc(82, 145, 17, 0, 7); cx.fill(); cx.strokeStyle = '#e5e7eb'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(82, 163); cx.lineTo(82, 190); cx.stroke(); cx.fillStyle = 'rgba(34,197,94,.12)'; cx.fillRect(420, 135, 40, 125); cx.strokeStyle = '#86efac'; cx.lineWidth = 2; cx.strokeRect(420, 135, 40, 125); cx.fillStyle = '#854d0e'; cx.fillRect(411, 254, 58, 12); cx.strokeStyle = '#22c55e'; cx.lineWidth = 5; cx.beginPath(); cx.moveTo(440, 255); cx.quadraticCurveTo(435, 210, 440, 165); cx.stroke(); cx.fillStyle = '#4ade80'; for (const q of [[-16, -35], [15, -54], [-18, -72], [18, -92]]) {
            cx.beginPath();
            cx.ellipse(440 + q[0], 165 + q[1] * .65, 13, 6, q[0] * .02, 0, 7);
            cx.fill();
        } for (let i = 0; i < Math.min(14, Math.ceil(rate / 5)); i++) {
            const y = 244 - ((t * 45 + i * 31) % 100);
            cx.fillStyle = 'rgba(224,242,254,.95)';
            cx.beginPath();
            cx.arc(440 + (i % 3 - 1) * 10, y, 3 + (i % 3), 0, 7);
            cx.fill();
        } cx.strokeStyle = 'rgba(255,244,180,.20)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(105, 145); cx.lineTo(410, 145); cx.stroke(); return `شدة الضوء النسبية ≈ ${intensity}٪ · معدل الفقاعات النموذجي ≈ ${rate} فقاعة/دقيقة · العلاقة التقريبية: الشدة ∝ 1/المسافة²`; } },
    pend: { c: [R('L', 'الطول (م)', .2, 2, .05, 1), R('g', 'الجاذبية (م/ث²)', 1.6, 24, .1, 9.8)],
        f(v, t) {
            const T = 2 * Math.PI * Math.sqrt(v.L / v.g), a = .5 * Math.cos(2 * Math.PI * t / T), L = v.L * 130, x = 320 + L * Math.sin(a), y = 40 + L * Math.cos(a);
            cx.strokeStyle = '#e2e8f0';
            cx.beginPath();
            cx.moveTo(320, 40);
            cx.lineTo(x, y);
            cx.stroke();
            cx.fillStyle = '#f472b6';
            cx.beginPath();
            cx.arc(x, y, 16, 0, 7);
            cx.fill();
            return `T = 2π√(L/g) = ${T.toFixed(2)} ث`;
        } },
    boyle: { c: [R('V', 'الحجم (مل)', 20, 100, 1, 50)],
        f(v, t) {
            const w = v.V * 5.6;
            if (P.length != 30) {
                P = [];
                for (let i = 0; i < 30; i++)
                    P.push({ x: Math.random() * w, y: Math.random() * 240, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5 });
            }
            cx.strokeStyle = '#94a3b8';
            cx.strokeRect(40, 40, w + 10, 250);
            cx.fillStyle = '#64748b';
            cx.fillRect(40 + w + 10, 40, 16, 250);
            P.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w)
                p.vx *= -1, p.x = Math.max(0, Math.min(w, p.x)); if (p.y < 0 || p.y > 240)
                p.vy *= -1; cx.fillStyle = '#34d399'; cx.beginPath(); cx.arc(48 + p.x, 48 + p.y, 5, 0, 7); cx.fill(); });
            return `P·V = ثابت → P = ${(10000 / v.V).toFixed(0)} كيلوباسكال`;
        } },
    ohm: { c: [R('V', 'الجهد V (V)', 1, 24, .5, 6), R('R', 'المقاومة R (Ω)', 1, 50, 1, 10), R('I', 'التيار I (A)', .1, 10, .1, 1), R('mode', 'المتغير المحسوب (0 التيار I، 1 الجهد V، 2 المقاومة R)', 0, 2, 1, 0)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, md = v.mode | 0;
            let V = v.V, R = v.R, I = v.I;
            if (md == 0)
                I = V / R;
            else if (md == 1)
                V = I * R;
            else
                R = V / I;
            const P = V * I, L = 70, Rr = 410, Tp = 100, Bt = 250, cy = 175, mx = 240, heat = Math.min(1, P / 80);
            h.bg(W, H);
            const pts = [[L, cy - 24], [L, Tp], [Rr, Tp], [Rr, Bt], [L, Bt], [L, cy + 24]];
            h.L([[L, cy - 24], [L, Tp], [mx - 42, Tp]]);
            h.L([[mx + 42, Tp], [Rr, Tp], [Rr, Bt], [mx + 22, Bt]]);
            h.L([[mx - 22, Bt], [L, Bt], [L, cy + 24]]);
            h.L([[mx - 42, Tp], [mx - 42, 50], [mx - 20, 50]], '#93c5fd', 3);
            h.L([[mx + 42, Tp], [mx + 42, 50], [mx + 20, 50]], '#93c5fd', 3);
            [[mx - 42, Tp], [mx + 42, Tp]].forEach(q => { cx.fillStyle = '#e2e8f0'; cx.beginPath(); cx.arc(q[0], q[1], 4.5, 0, 7); cx.fill(); });
            h.dots(pts.slice().reverse(), 22, T0 * (.03 + Math.min(.5, I * .012)), '#38bdf8', 3.2);
            h.cell(L, cy, V.toFixed(1));
            h.res(mx, Tp, heat, 'R = ' + R.toFixed(1) + ' Ω');
            h.meter(mx, Bt, 'A', I.toFixed(2) + ' A', '#34d399');
            h.meter(mx, 50, 'V', null, '#93c5fd');
            h.T(V.toFixed(1) + ' V', mx, 16, '#93c5fd', 12);
            h.arrow(340, Tp, 1, 0);
            h.T('I', 340, Tp - 14, '#fbbf24', 13);
            h.T('التيار الاصطلاحي (+ → −)', 350, Bt + 44, '#fbbf24', 10);
            h.T('● حركة الإلكترونات', 150, Bt + 44, '#7dd3fc', 10);
            const gx = 450, gy = 60, gw = 170, gh = 170;
            cx.fillStyle = 'rgba(255,255,255,.06)';
            cx.fillRect(gx, gy, gw, gh);
            cx.strokeStyle = '#64748b';
            cx.strokeRect(gx, gy, gw, gh);
            const Vm = 24, Im = Math.max(5, Math.ceil(24 / Math.max(R, 1)) + 1);
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(gx, gy + gh);
            cx.lineTo(gx + gw, gy + gh - Math.min(gh, Vm / R / Im * gh));
            cx.stroke();
            cx.fillStyle = '#fde68a';
            cx.beginPath();
            cx.arc(gx + V / Vm * gw, gy + gh - Math.min(gh, I / Im * gh), 5, 0, 7);
            cx.fill();
            h.T('V (V) →', gx + gw - 4, gy + gh + 14, '#94a3b8', 10, 'right');
            h.T('↑ I (A)', gx + 6, gy - 6, '#94a3b8', 10, 'left');
            h.T('ميل الخط = 1/R', gx + gw / 2, gy + 14, '#7dd3fc', 10);
            h.T('علاقة V–I (خط مستقيم)', gx + gw / 2, gy - 18, '#bff3ff', 11);
            h.T(`${['I = V/R', 'V = I·R', 'R = V/I'][md]}  ·  V = ${V.toFixed(1)} V · I = ${I.toFixed(2)} A · R = ${R.toFixed(1)} Ω · P = ${P.toFixed(1)} W`, W / 2, H - 10, '#f8fafc', 12);
            return `قانون أوم: V = I·R. اختر المتغير الذي تريد حسابه: (0) التيار I = V/R، (1) الجهد V = I·R، (2) المقاومة R = V/I، وحرّك المتغيرين الآخرين. الآن V = ${V.toFixed(1)} V وI = ${I.toFixed(2)} A وR = ${R.toFixed(1)} Ω والقدرة P = V·I = ${P.toFixed(1)} W. عند ثبات R يتناسب I طرديًا مع V (خط مستقيم ميله 1/R)، وعند ثبات V يتناسب I عكسيًا مع R. يُوصل الأميتر على التوالي والفولتميتر على التوازي.`;
        } },
    refr: { c: [R('a', 'زاوية السقوط (°)', 0, 85, 1, 30), R('n', 'معامل الانكسار', 1, 2.4, .01, 1.5)],
        f(v) {
            const a = v.a * Math.PI / 180, r = Math.asin(Math.sin(a) / v.n);
            cx.fillStyle = '#38bdf833';
            cx.fillRect(0, 160, W, 160);
            cx.strokeStyle = '#64748b';
            cx.beginPath();
            cx.moveTo(320, 20);
            cx.lineTo(320, 300);
            cx.stroke();
            cx.strokeStyle = '#f87171';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(320 - 150 * Math.sin(a), 160 - 150 * Math.cos(a));
            cx.lineTo(320, 160);
            cx.lineTo(320 + 150 * Math.sin(r), 160 + 150 * Math.cos(r));
            cx.stroke();
            cx.lineWidth = 1;
            return `n₁sinθ₁ = n₂sinθ₂ → θ₂ = ${(r * 180 / Math.PI).toFixed(1)}°`;
        } },
    proj: { c: [R('a', 'زاوية الإطلاق (°)', 5, 85, 1, 45), R('v', 'السرعة (م/ث)', 5, 35, 1, 15)],
        f(v, t) {
            const a = v.a * Math.PI / 180, g = 9.8, T = 2 * v.v * Math.sin(a) / g, Rg = v.v * v.v * Math.sin(2 * a) / g, k = Math.min(60, 560 / Math.max(Rg, 1));
            cx.strokeStyle = '#475569';
            cx.beginPath();
            cx.moveTo(30, 290);
            cx.lineTo(620, 290);
            cx.stroke();
            cx.strokeStyle = '#38bdf8';
            cx.beginPath();
            for (let s = 0; s <= T; s += T / 60) {
                cx.lineTo(30 + v.v * Math.cos(a) * s * k, 290 - (v.v * Math.sin(a) * s - .5 * g * s * s) * k);
            }
            cx.stroke();
            const s = (t % (T + .6)), q = Math.min(s, T);
            cx.fillStyle = '#fbbf24';
            cx.beginPath();
            cx.arc(30 + v.v * Math.cos(a) * q * k, 290 - (v.v * Math.sin(a) * q - .5 * g * q * q) * k, 8, 0, 7);
            cx.fill();
            return `المدى = ${Rg.toFixed(1)} م · زمن التحليق = ${T.toFixed(2)} ث`;
        } },
    ph: { c: [R('Vb', 'حجم NaOH 0.1 M المضاف من السحاحة (mL)', 0, 50, .1, 10), R('ind', 'الكاشف (0 فينولفثالين، 1 ميثيل البرتقال)', 0, 1, 1, 0)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, Vb = v.Vb, fn = x => { const n = 2.5 - .1 * x, V = 25 + x; return Math.abs(n) < 1e-9 ? 7 : n > 0 ? -Math.log10(n / V) : 14 + Math.log10((-n) / V); }, pH = fn(Vb), mo = v.ind === 1;
            const col = mo ? (pH < 3.1 ? [220, 38, 38, .85] : pH < 4.4 ? [251, 146, 60, .85] : [250, 204, 21, .8]) : (pH < 8.2 ? [200, 230, 245, .25] : pH < 10 ? [236, 100, 170, Math.min(.9, .45 + (pH - 8.2) * .25)] : [217, 28, 128, .88]);
            const cn = mo ? (pH < 3.1 ? 'أحمر' : pH < 4.4 ? 'برتقالي' : 'أصفر') : (pH < 8.2 ? 'عديم اللون' : pH < 10 ? 'وردي فاتح' : 'وردي غامق (أرجواني)');
            const S0 = window.__yqT = window.__yqT || { last: Vb, t0: -9 };
            if (Math.abs(Vb - S0.last) > .04) {
                S0.t0 = T0;
                S0.last = Vb;
            }
            h.bg(W, H);
            const bx = 105, y0 = 50, y1 = 178, yl = y0 + Vb / 50 * (y1 - y0);
            cx.fillStyle = 'rgba(160,200,255,.35)';
            cx.fillRect(bx - 10, yl, 20, 184 - yl);
            cx.strokeStyle = '#cfe8ff';
            cx.lineWidth = 2.2;
            cx.strokeRect(bx - 11, 42, 22, 142);
            for (let m = 0; m <= 50; m += 5) {
                const y = y0 + m / 50 * (y1 - y0);
                cx.strokeStyle = '#9fb8cc';
                cx.lineWidth = 1;
                cx.beginPath();
                cx.moveTo(bx - 11, y);
                cx.lineTo(bx - (m % 10 ? 5 : 1), y);
                cx.stroke();
                if (m % 10 == 0)
                    h.T(String(m), bx - 16, y + 4, '#9fb8cc', 9, 'right');
            }
            cx.fillStyle = '#64748b';
            cx.fillRect(bx - 9, 186, 18, 8);
            cx.fillStyle = '#f59e0b';
            cx.fillRect(bx + 9, 188, 16, 4);
            h.L([[bx, 194], [bx, 205]], '#cfe8ff', 3);
            h.T('NaOH 0.1 M', bx + 22, 70, '#93c5fd', 11, 'left');
            h.T('سحاحة', bx + 22, 86, '#94a3b8', 10, 'left');
            const dt = T0 - S0.t0;
            if (dt < 1.1 && dt >= 0)
                for (let i = 0; i < 3; i++) {
                    const y = 205 + ((dt * 130 + i * 22) % 36);
                    cx.fillStyle = 'rgba(147,197,253,.9)';
                    cx.beginPath();
                    cx.arc(bx, y, 2.4, 0, 7);
                    cx.fill();
                }
            const fp = () => { cx.beginPath(); cx.moveTo(bx - 12, 242); cx.lineTo(bx + 12, 242); cx.lineTo(bx + 12, 258); cx.lineTo(bx + 52, 312); cx.lineTo(bx - 52, 312); cx.lineTo(bx - 12, 258); cx.closePath(); };
            cx.save();
            fp();
            cx.clip();
            cx.fillStyle = 'rgba(190,225,245,.3)';
            cx.fillRect(bx - 60, 276, 120, 40);
            cx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${col[3]})`;
            cx.fillRect(bx - 60, 276, 120, 40);
            cx.restore();
            cx.strokeStyle = '#cfe8ff';
            cx.lineWidth = 2.4;
            fp();
            cx.stroke();
            h.T('25 mL HCl 0.1 M + كاشف', bx + 20, H - 1, '#e2e8f0', 9);
            const x0 = 232, wd = 380, top = 36, bt = 236, X = m => x0 + m / 50 * wd, Y = p => bt - p / 14 * (bt - top);
            cx.fillStyle = 'rgba(255,255,255,.04)';
            cx.fillRect(x0, top, wd, bt - top);
            cx.fillStyle = mo ? 'rgba(251,146,60,.2)' : 'rgba(236,72,153,.2)';
            cx.fillRect(x0, Y(mo ? 4.4 : 10), wd, Y(mo ? 3.1 : 8.2) - Y(mo ? 4.4 : 10));
            h.T(mo ? 'مدى تغير لون ميثيل البرتقال (3.1–4.4)' : 'مدى تغير لون الفينولفثالين (8.2–10)', x0 + wd - 4, Y(mo ? 4.4 : 10) - 3, mo ? '#fdba74' : '#f9a8d4', 9, 'right');
            cx.strokeStyle = '#64748b';
            cx.lineWidth = 1.2;
            cx.strokeRect(x0, top, wd, bt - top);
            for (let p = 0; p <= 14; p += 2) {
                cx.beginPath();
                cx.moveTo(x0, Y(p));
                cx.lineTo(x0 - 4, Y(p));
                cx.stroke();
                h.T(String(p), x0 - 8, Y(p) + 3, '#94a3b8', 9, 'right');
            }
            for (let m = 0; m <= 50; m += 10)
                h.T(String(m), X(m), bt + 13, '#94a3b8', 9);
            h.T('pH', x0 - 8, top - 8, '#94a3b8', 10);
            h.T('V(NaOH) (mL)', x0 + wd / 2, bt + 27, '#94a3b8', 10);
            cx.setLineDash([4, 4]);
            cx.strokeStyle = '#a3e635';
            cx.beginPath();
            cx.moveTo(X(25), top);
            cx.lineTo(X(25), bt);
            cx.stroke();
            cx.setLineDash([]);
            h.T('نقطة التكافؤ 25.0 mL (pH = 7)', X(25) + 4, top + 12, '#bef264', 10, 'left');
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 2;
            cx.beginPath();
            for (let m = 0; m <= 50; m += .25) {
                const q = m ? cx.lineTo(X(m), Y(fn(m))) : cx.moveTo(X(m), Y(fn(m)));
            }
            cx.stroke();
            cx.fillStyle = '#fff';
            cx.strokeStyle = '#0ea5e9';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.arc(X(Vb), Y(pH), 6, 0, 7);
            cx.fill();
            cx.stroke();
            const stg = Vb < 24.5 ? 'قبل التكافؤ: الحمض زائد' : Vb <= 25.3 ? 'قرب نقطة التكافؤ: n(NaOH) ≈ n(HCl)' : 'بعد التكافؤ: القاعدة زائدة';
            h.T(`قراءة السحاحة: ${Vb.toFixed(1)} mL · pH = ${pH.toFixed(2)} · اللون: ${cn}`, x0 + wd / 2, bt + 46, '#f8fafc', 12);
            h.T(stg, x0 + wd / 2, bt + 62, '#fde68a', 12);
            return `المعايرة: تُضاف القاعدة NaOH (0.1 M) من السحاحة تدريجيًا إلى 25 mL من الحمض HCl (0.1 M) في الدورق مع الكاشف، ويُحرَّك الدورق باستمرار. نقطة التكافؤ تتحقق عندما n(H⁺) = n(OH⁻) أي عند 25.0 mL (pH = 7 لحمض وقاعدة قويين). ${mo ? 'ميثيل البرتقال يتحول من الأحمر إلى الأصفر عند pH ≈ 3.1–4.4 فيتغير لونه قبل نقطة التكافؤ بقليل.' : 'الفينولفثالين عديم اللون في الحمض ويصبح وردي عند pH ≥ 8.2، فتكون نقطة نهاية المعايرة أول قطرة تعطي لونًا ورديًا يثبت 30 ثانية.'} الآن أضيف ${Vb.toFixed(1)} mL فصار pH = ${pH.toFixed(2)} ولون المحلول ${cn}. لاحظ أن pH يقفز بسرعة قرب نقطة التكافؤ، لذلك حرّك المؤشر بخطوات صغيرة (0.1 mL) عند اقترابك من 25 mL. المعادلة: HCl + NaOH → NaCl + H₂O.`;
        } },
    pun: { c: [R('t', 'الصفة (0 طول الساق، 1 لون الأزهار، 2 لون البذور، 3 ملمس البذور)', 0, 3, 1, 0), R('p', 'الأب (0 نقي سائد، 1 خليط، 2 نقي متنحٍّ)', 0, 2, 1, 1), R('q', 'الأم (0 نقي سائد، 1 خليط، 2 نقي متنحٍّ)', 0, 2, 1, 1), R('di', 'التهجين (0 أحادي، 1 ثنائي مع صفة ثانية)', 0, 1, 1, 0), R('g', 'الجيل (1 = F1 من الأبوين، 2 = F2 من تزاوج أفراد F1)', 1, 2, 1, 1), R('n', 'عدد النسل المحاكى', 8, 200, 8, 48)],
        f(v, t) {
            const h = YQH(cx), TR = [{ A: 'T', n: ['ساق طويلة', 'ساق قصيرة'], g: ['T', 't'] }, { A: 'P', n: ['أزهار بنفسجية', 'أزهار بيضاء'], g: ['P', 'p'] }, { A: 'Y', n: ['بذور صفراء', 'بذور خضراء'], g: ['Y', 'y'] }, { A: 'R', n: ['بذور ملساء (مستديرة)', 'بذور مجعّدة'], g: ['R', 'r'] }], t1 = v.t | 0, t2 = t1 == 3 ? 2 : 3, di = v.di === 1, hs = i => { const q = Math.sin(i * 43.7 + v.p * 7 + v.q * 3.1 + t1 * 5) * 43758.5453; return q - Math.floor(q); };
            const GN = ['TT', 'Tt', 'tt'];
            const gt = (tr, k) => [TR[tr].g[0] + TR[tr].g[0], TR[tr].g[0] + TR[tr].g[1], TR[tr].g[1] + TR[tr].g[1]][k];
            const icon = (tr, dom, x, y, z) => {
                cx.save();
                cx.translate(x, y);
                cx.scale(z, z);
                if (tr == 0) {
                    const L = dom ? 34 : 15;
                    cx.strokeStyle = '#4ade80';
                    cx.lineWidth = 3.5;
                    cx.lineCap = 'round';
                    cx.beginPath();
                    cx.moveTo(0, 16);
                    cx.lineTo(0, 16 - L);
                    cx.stroke();
                    cx.fillStyle = '#22c55e';
                    for (let i = 0; i < (dom ? 3 : 2); i++) {
                        cx.beginPath();
                        cx.ellipse(-7, 12 - i * 11, 7, 3, -.5, 0, 7);
                        cx.ellipse(7, 6 - i * 11, 7, 3, .5, 0, 7);
                        cx.fill();
                    }
                    cx.fillStyle = '#92400e';
                    cx.fillRect(-9, 16, 18, 5);
                }
                else if (tr == 1) {
                    for (let i = 0; i < 5; i++) {
                        const a = i * 1.2566;
                        cx.fillStyle = dom ? '#8b5cf6' : '#f8fafc';
                        cx.strokeStyle = dom ? '#6d28d9' : '#cbd5e1';
                        cx.beginPath();
                        cx.arc(Math.cos(a) * 9, Math.sin(a) * 9 - 2, 7, 0, 7);
                        cx.fill();
                        cx.stroke();
                    }
                    cx.fillStyle = '#fde047';
                    cx.beginPath();
                    cx.arc(0, -2, 4, 0, 7);
                    cx.fill();
                }
                else if (tr == 2) {
                    cx.fillStyle = '#4d7c0f';
                    cx.beginPath();
                    cx.ellipse(0, 0, 22, 8, 0, 0, 7);
                    cx.fill();
                    for (let i = -1; i <= 1; i++) {
                        cx.fillStyle = dom ? '#facc15' : '#4ade80';
                        cx.strokeStyle = '#14532d';
                        cx.beginPath();
                        cx.arc(i * 12, 0, 5.5, 0, 7);
                        cx.fill();
                        cx.stroke();
                    }
                }
                else {
                    cx.fillStyle = '#d6b36b';
                    cx.strokeStyle = '#92400e';
                    cx.lineWidth = 1.5;
                    cx.beginPath();
                    if (dom)
                        cx.arc(0, 0, 12, 0, 7);
                    else {
                        for (let a = 0; a <= 6.28; a += .35) {
                            const r = 11 + 2.6 * Math.sin(a * 5);
                            cx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                        }
                    }
                    cx.closePath();
                    cx.fill();
                    cx.stroke();
                    if (!dom) {
                        cx.beginPath();
                        cx.moveTo(-8, -3);
                        cx.lineTo(6, 1);
                        cx.moveTo(-6, 5);
                        cx.lineTo(8, -5);
                        cx.stroke();
                    }
                    else {
                        cx.fillStyle = 'rgba(255,255,255,.5)';
                        cx.beginPath();
                        cx.arc(-4, -4, 3, 0, 7);
                        cx.fill();
                    }
                }
                cx.restore();
            };
            const gam = (g1, g2) => { const a = g1[0] === g1[1] ? [g1[0]] : [g1[0], g1[1]], b = g2 ? (g2[0] === g2[1] ? [g2[0]] : [g2[0], g2[1]]) : [null]; const o = []; (g1[0] === g1[1] ? [g1[0], g1[0]] : [g1[0], g1[1]]).forEach(x => (g2 ? (g2[0] === g2[1] ? [g2[0], g2[0]] : [g2[0], g2[1]]) : [null]).forEach(y => o.push([x, y]))); return o; };
            let p1 = [gt(t1, v.p | 0), di ? gt(t2, v.p | 0) : null], p2 = [gt(t1, v.q | 0), di ? gt(t2, v.q | 0) : null];
            const cross = (a, b) => { const ga = gam(a[0], a[1]), gb = gam(b[0], b[1]), cells = []; ga.forEach((x, i) => gb.forEach((y, j) => { const mk = (u, w) => [u, w].sort((m, n) => m === m.toUpperCase() ? -1 : 1).join(''); cells.push({ g1: mk(x[0], y[0]), g2: di ? mk(x[1], y[1]) : null, i, j }); })); return { ga, gb, cells }; };
            let C = cross(p1, p2), gen2 = false;
            if (v.g === 2) {
                const cnt = {};
                C.cells.forEach(c => { const k = c.g1 + '|' + c.g2; cnt[k] = (cnt[k] || 0) + 1; });
                const best = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0].split('|');
                p1 = p2 = [best[0], di ? best[1] : null];
                C = cross(p1, p2);
                gen2 = true;
            }
            const dom = g => g[0] === g[0].toUpperCase(), cls = c => (dom(c.g1) ? 0 : 1) + (di ? (dom(c.g2) ? 0 : 2) : 0), NC = di ? 4 : 2, tot = C.cells.length, cnt = [0, 0, 0, 0];
            C.cells.forEach(c => cnt[cls(c)]++);
            h.bg(W, H, '#102a1a', '#09170e');
            h.T(gen2 ? 'الآباء: أفراد F1' : 'الآباء (P)', 160, 22, '#bbf7d0', 12);
            [[p1, 60], [p2, 260]].forEach(([p, x], k) => { const g = p[0] + (di ? p[1] : ''); h.T((k ? '♀ ' : '♂ ') + g, x + 30, 66, '#fcd34d', 12); icon(t1, dom(p[0]), x, 46, .9); if (di)
                icon(t2, dom(p[1]), x + 34, 46, .9); h.T((dom(p[0]) ? TR[t1].n[0] : TR[t1].n[1]) + (di ? ' + ' + (dom(p[1]) ? TR[t2].n[0] : TR[t2].n[1]) : ''), x + (di ? 16 : 0), 86, '#cbd5e1', 9); });
            h.T('×', 210, 56, '#fff', 18);
            const cs = di ? 40 : 62, ox = 48, oy = 122;
            C.ga.forEach((x, i) => h.T(x[0] + (di ? x[1] : ''), ox + cs / 2 + i * cs, oy - 6, '#86efac', di ? 11 : 15));
            C.gb.forEach((y, j) => h.T(y[0] + (di ? y[1] : ''), ox - 20, oy + cs / 2 + j * cs + 4, '#fde68a', di ? 11 : 15));
            C.cells.forEach(c => { const x = ox + c.i * cs, y = oy + c.j * cs, k = cls(c); cx.fillStyle = ['rgba(74,222,128,.26)', 'rgba(250,204,21,.26)', 'rgba(96,165,250,.26)', 'rgba(244,114,182,.26)'][k]; cx.fillRect(x, y, cs, cs); cx.strokeStyle = '#cbd5e1'; cx.strokeRect(x, y, cs, cs); if (di) {
                h.T(c.g1 + c.g2, x + cs / 2, y + 14, '#fff', 10);
                icon(t1, dom(c.g1), x + 11, y + 30, .42);
                icon(t2, dom(c.g2), x + 29, y + 30, .42);
            }
            else {
                h.T(c.g1, x + cs / 2, y + 16, '#fff', 14);
                icon(t1, dom(c.g1), x + cs / 2, y + 38, .6);
            } });
            h.T(gen2 ? 'الجيل الثاني F2' : 'الجيل الأول F1 (النسل)', ox + cs * C.ga.length / 2, oy + cs * C.gb.length + 16, '#bff3ff', 11);
            const names = di ? [`${TR[t1].n[0]} + ${TR[t2].n[0]}`, `${TR[t1].n[0]} + ${TR[t2].n[1]}`, `${TR[t1].n[1]} + ${TR[t2].n[0]}`, `${TR[t1].n[1]} + ${TR[t2].n[1]}`] : [TR[t1].n[0], TR[t1].n[1]], obs = [0, 0, 0, 0];
            for (let i = 0; i < v.n; i++) {
                const c = C.cells[Math.floor(hs(i) * tot) % tot];
                obs[cls(c)]++;
            }
            const rx = 330;
            h.T('الطرز الشكلية للنسل', rx + 150, 22, '#bff3ff', 12);
            for (let k = 0; k < NC; k++) {
                const y = 48 + k * (di ? 46 : 78), col = ['#4ade80', '#facc15', '#60a5fa', '#f472b6'][k];
                cx.fillStyle = 'rgba(255,255,255,.06)';
                cx.fillRect(rx, y - 18, 300, di ? 40 : 70);
                icon(t1, k % 2 == 0, rx + 22, y + (di ? 2 : 10), di ? .7 : 1);
                if (di)
                    icon(t2, k < 2, rx + 54, y + 2, .7);
                h.T(names[k], rx + (di ? 84 : 60), y + (di ? -2 : -2), '#e2e8f0', 10, 'left');
                const e = cnt[k] / tot;
                h.T(`متوقع ${cnt[k]}/${tot} (${(e * 100).toFixed(1)}%)`, rx + (di ? 84 : 60), y + 12, col, 10, 'left');
                cx.fillStyle = '#1e293b';
                cx.fillRect(rx + (di ? 84 : 60), y + (di ? 18 : 22), 200, 6);
                cx.fillStyle = col;
                cx.fillRect(rx + (di ? 84 : 60), y + (di ? 18 : 22), 200 * e, 6);
                cx.fillStyle = '#fff';
                cx.fillRect(rx + (di ? 84 : 60) + 200 * obs[k] / v.n - 1, y + (di ? 15 : 19), 3, 12);
                if (!di)
                    h.T(`في عينة من ${v.n}: ${obs[k]} (${(obs[k] / v.n * 100).toFixed(0)}%)`, rx + 60, y + 42, '#94a3b8', 10, 'left');
            }
            const ratio = cnt.slice(0, NC).filter(x => x > 0).join(' : ');
            h.T(`النسبة المظهرية المتوقعة = ${ratio}`, rx + 150, H - 30, '#fde68a', 13);
            h.T('الخط الأبيض = ما ظهر في العينة العشوائية', rx + 150, H - 12, '#94a3b8', 10);
            const gs = C.cells.reduce((o, c) => { const k = c.g1 + (c.g2 || ''); o[k] = (o[k] || 0) + 1; return o; }, {});
            return `قوانين مندل: لكل صفة أليلان؛ الأليل السائد (${TR[t1].g[0]}: ${TR[t1].n[0]}) يُخفي المتنحي (${TR[t1].g[1]}: ${TR[t1].n[1]}) في الحالة الخليطة، فيظهر المتنحي فقط في النقي المتنحي. تنفصل الأليلات عند تكوين الأمشاج (قانون الفصل) فتنتج أمشاج مختلفة. ${gen2 ? 'تزاوج أفراد الجيل الأول F1 ينتج الجيل الثاني F2.' : 'الجيل الأول F1 ناتج عن تزاوج الأبوين.'} الطرز الجينية المتوقعة: ${Object.entries(gs).map(([k, x]) => k + '×' + x).join('، ')} (من ${tot}). النسبة المظهرية المتوقعة ${ratio}${di ? ' — في التهجين الثنائي لـ AaBb × AaBb تظهر النسبة 9:3:3:1 لأن الصفتين تتوزعان باستقلال (قانون التوزيع المستقل)' : ' — لتزاوج الخليطين Tt × Tt تظهر النسبة 3:1'}. العينة العشوائية قد تنحرف عن النسبة المتوقعة، وتقترب منها كلما زاد عدد النسل.`;
        } }
};
Object.assign(S, {
    circ: { c: [R('n', 'عدد المصابيح', 1, 4, 1, 2), R('m', 'التوصيل (0 تسلسل، 1 توازٍ)', 0, 1, 1, 0)],
        f(v, t) {
            const h = YQH(cx), n = v.n, par = !!v.m, Vb = 6, Rl = 12, Rt = par ? Rl / n : Rl * n, I = Vb / Rt, Il = par ? Vb / Rl : I, b = Math.min(1, Il * Il * Rl / 3), L = 100, Tp = 96, Bt = 250, cy = 173;
            h.bg(W, H);
            if (!par) {
                const xs = [...Array(n)].map((_, i) => 190 + (i + .5) * (300 / n));
                let top = [[L, cy - 24], [L, Tp]];
                xs.forEach((x, i) => { top.push([x - 18, Tp]); h.L(top); top = [[x + 18, Tp]]; });
                top.push([540, Tp], [540, Bt], [342, Bt]);
                h.L(top);
                h.L([[298, Bt], [L, Bt], [L, cy + 24]]);
                xs.forEach(x => h.lamp(x, Tp, b));
                h.dots([[L, cy - 24], [L, Tp], [540, Tp], [540, Bt], [L, Bt], [L, cy + 24]].reverse(), 20, (t || performance.now() / 1000) * (.03 + I * .1), '#38bdf8', 3);
            }
            else {
                const xs = [...Array(n)].map((_, i) => 270 + i * 80), xe = xs[n - 1];
                h.L([[L, cy - 24], [L, Tp], [xe, Tp]]);
                h.L([[xe, Bt], [200, Bt]]);
                h.L([[142, Bt], [L, Bt], [L, cy + 24]]);
                xs.forEach(x => { h.L([[x, Tp], [x, cy - 18]]); h.L([[x, cy + 18], [x, Bt]]); h.lamp(x, cy, b); [[x, Tp], [x, Bt]].forEach(q => { cx.fillStyle = '#e2e8f0'; cx.beginPath(); cx.arc(q[0], q[1], 4, 0, 7); cx.fill(); }); });
                h.dots([[L, cy - 24], [L, Tp], [xe, Tp], [xe, Bt], [L, Bt], [L, cy + 24]].reverse(), 20, (t || performance.now() / 1000) * (.03 + I * .06), '#38bdf8', 3);
            }
            h.cell(L, cy, Vb);
            h.meter(par ? 171 : 320, Bt, 'A', I.toFixed(2) + ' A', '#34d399');
            h.T(`${par ? 'توصيل على التوازي' : 'توصيل على التوالي'} · عدد المصابيح = ${n} · R_total = ${Rt.toFixed(1)} Ω · I = ${I.toFixed(2)} A`, W / 2, H - 14, '#f8fafc', 13);
            return `${par ? 'في التوصيل على التوازي يتساوى الجهد على كل مصباح (6 V) فيبقى سطوعها عاليًا، ويزداد التيار الكلي بزيادة عدد المصابيح لأن المقاومة المكافئة تقل: 1/R = 1/R₁ + 1/R₂ + …' : 'في التوصيل على التوالي يمر التيار نفسه في كل المصابيح ويتوزع الجهد بينها، فيقل سطوع كل مصباح كلما زاد عددها، وتزداد المقاومة الكلية: R = R₁ + R₂ + …'} هنا R_total = ${Rt.toFixed(1)} Ω والتيار I = ${I.toFixed(2)} A (كل مصباح 12 Ω والبطارية 6 V). إذا احترق مصباح في التوالي ينقطع التيار عن الجميع، أما في التوازي فتبقى بقية المصابيح مضيئة.`;
        } },
    lens: { c: [R('u', 'بعد الجسم عن العدسة (سم)', 5, 60, 1, 30), R('f', 'البعد البؤري (سم)', 5, 25, 1, 10), R('kind', 'نوع العدسة (0 محدبة، 1 مقعرة)', 0, 1, 1, 0)],
        f(v) {
            const convex = v.kind === 0, F = convex ? v.f : -v.f, u = v.u, AY = H / 2, x0 = W / 2 + 10, h = 46, den = 1 / F - 1 / u, inf = Math.abs(den) < 1e-6, q = inf ? Infinity : 1 / den, m = inf ? Infinity : -q / u, fa = v.f;
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
        } },
    acid: { c: [R('p', 'قيمة pH', 0, 14, .1, 7)],
        f(v) { const p = v.p, h = p < 7 ? p / 7 * 120 : 120 + (p - 7) / 7 * 150; const color = `hsl(${h},85%,55%)`; const g = cx.createLinearGradient(0, 90, 0, 285); g.addColorStop(0, color.replace(')', ',.82)').replace('hsl', 'hsla')); g.addColorStop(1, color); cx.fillStyle = 'rgba(220,244,250,.12)'; cx.beginPath(); cx.moveTo(265, 62); cx.lineTo(375, 62); cx.lineTo(375, 100); cx.lineTo(435, 265); cx.quadraticCurveTo(440, 282, 420, 286); cx.lineTo(220, 286); cx.quadraticCurveTo(200, 282, 205, 265); cx.lineTo(265, 100); cx.closePath(); cx.fill(); cx.strokeStyle = 'rgba(230,250,255,.85)'; cx.lineWidth = 3; cx.stroke(); cx.fillStyle = color; cx.beginPath(); cx.moveTo(235, 190); cx.quadraticCurveTo(320, 184, 405, 190); cx.lineTo(430, 265); cx.quadraticCurveTo(434, 278, 416, 279); cx.lineTo(224, 279); cx.quadraticCurveTo(207, 278, 212, 263); cx.closePath(); cx.fill(); cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(273, 75); cx.lineTo(273, 115); cx.stroke(); cx.fillStyle = '#eafaff'; cx.font = '700 16px Cairo'; cx.fillText('pH ' + p.toFixed(1), 20, 30); return `[H⁺] = ${sciH(p)} مول/لتر · pOH = ${(14 - p).toFixed(1)} · المحلول ${p < 6.95 ? 'حمضي' : p > 7.05 ? 'قاعدي' : 'متعادل'} · كل وحدة pH تعني تغيّر [H⁺] عشرة أضعاف`; } },
    spring: { c: [R('m', 'الكتلة (جم)', 0, 500, 10, 100), R('k', 'ثابت النابض (N/m)', 5, 100, 1, 20)],
        f(v) {
            const x = v.m / 1000 * 9.8 / v.k, len = 60 + Math.min(x, .6) * 350;
            cx.strokeStyle = '#e2e8f0';
            cx.beginPath();
            cx.moveTo(320, 20);
            for (let i = 1; i <= 14; i++)
                cx.lineTo(320 + (i % 2 ? 18 : -18), 20 + len * i / 14);
            cx.stroke();
            cx.fillStyle = '#f59e0b';
            cx.fillRect(295, 20 + len, 50, 34);
            return `F = k·x → x = mg/k = ${(x * 100).toFixed(1)} سم (قوة الشد ${(v.m / 1000 * 9.8).toFixed(2)} نيوتن)`;
        } },
    wave: { c: [R('fq', 'التردد (هرتز)', 1, 10, .5, 2), R('l', 'الطول الموجي (م)', .5, 5, .1, 2)],
        f(v, t) { cx.strokeStyle = '#38bdf8'; cx.lineWidth = 3; cx.beginPath(); for (let x = 0; x <= 640; x += 4) {
            const y = 160 - 70 * Math.sin(2 * Math.PI * (x / (v.l * 60) - v.fq * t * .15));
            x ? cx.lineTo(x, y) : cx.moveTo(x, y);
        } cx.stroke(); cx.lineWidth = 1; return `v = f·λ = ${v.fq} × ${v.l} = ${(v.fq * v.l).toFixed(2)} م/ث`; } },
    mol: { c: [R('m', 'كتلة NaCl (جم)', 1, 60, 1, 10), R('V', 'حجم المحلول (مل)', 100, 1000, 50, 500)],
        f(v) {
            const M = v.m / 58.5 / (v.V / 1000), h = v.V / 1000 * 200;
            cx.fillStyle = `rgba(56,189,248,${Math.min(.9, .15 + M * .4)})`;
            cx.fillRect(250, 290 - h, 140, h);
            cx.strokeStyle = '#e2e8f0';
            cx.strokeRect(250, 60, 140, 230);
            return `n = m/M = ${(v.m / 58.5).toFixed(3)} مول · التركيز = n/V = ${M.toFixed(3)} مول/لتر`;
        } },
    rate: { c: [R('c', 'التركيز (م)', .1, 2, .1, 1), R('T', 'الحرارة (°س)', 10, 80, 1, 25)],
        f(v, t) {
            const r = v.c * Math.pow(2, (v.T - 25) / 10), n = Math.min(25, Math.ceil(r * 4));
            for (let i = 0; i < n; i++) {
                const y = 280 - ((t * (40 + r * 15) + i * 47) % 230);
                cx.fillStyle = '#bae6fd';
                cx.beginPath();
                cx.arc(200 + (i * 37) % 240, y, 5, 0, 7);
                cx.fill();
            }
            return `سرعة التفاعل النسبية ≈ ${r.toFixed(2)} (تتناسب طردياً مع التركيز، وتتضاعف تقريباً لكل ارتفاع 10°س)`;
        } },
    faraday: { c: [R('N', 'عدد لفات الملف', 10, 1000, 10, 200), R('s', 'سرعة حركة المغناطيس / الدوران', .1, 3, .1, 1), R('B', 'شدة المجال المغناطيسي B (T)', .05, .5, .05, .2), R('m', 'التجربة (0 مغناطيس متحرك، 1 مولد: ملف يدور)', 0, 1, 1, 0)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, st = window.__yqF3 = window.__yqF3 || { b: [], tl: T0, ph: 0 }, dt = Math.min(.05, Math.max(0, T0 - st.tl));
            st.tl = T0;
            const gen = v.m === 1, fr = (gen ? 1 : .5) * v.s, w = 2 * Math.PI * fr;
            st.ph += dt * w;
            const A0 = gen ? .01 : .002, Am = .12, x0 = .04, Rc = v.N * .02, RL = 10;
            const emfAt = ph => { if (gen)
                return v.N * v.B * A0 * w * Math.sin(ph); const x = Am * Math.sin(ph), vx = Am * w * Math.cos(ph), q = 1 + Math.pow(x / x0, 2); return v.N * 3 * v.B * A0 * x / (x0 * x0 * Math.pow(q, 2.5)) * vx; };
            let pk = 0;
            for (let i = 0; i < 72; i++)
                pk = Math.max(pk, Math.abs(emfAt(i / 72 * 2 * Math.PI)));
            const e = emfAt(st.ph), I = e / (Rc + RL), Vt = e - I * Rc;
            st.b.push(Vt);
            if (st.b.length > 240)
                st.b.shift();
            const RG = [.02, .05, .1, .2, .5, 1, 2, 5, 10, 20, 50, 100], rng = RG.find(r => r >= pk * 1.05) || 200, fmt = x => Math.abs(x) < 1 ? (x * 1000).toFixed(1) + ' mV' : x.toFixed(2) + ' V';
            h.bg(W, H);
            const LX = 130, RX = 540, TY = 70, BY = 272, CXc = 260;
            h.L([[CXc - 48, TY], [LX, TY], [LX, BY], [220, BY]]);
            h.L([[300, BY], [395, BY]]);
            h.L([[465, BY], [RX, BY], [RX, TY], [CXc + 48, TY]]);
            h.L([[LX, 205], [312, 205]], '#93c5fd', 3);
            h.L([[RX, 205], [358, 205]], '#93c5fd', 3);
            [[LX, 205], [RX, 205]].forEach(q => { cx.fillStyle = '#e2e8f0'; cx.beginPath(); cx.arc(q[0], q[1], 4.5, 0, 7); cx.fill(); });
            h.dots([[LX, TY], [LX, BY], [RX, BY], [RX, TY]], 14, st.ph * .35 * (e > 0 ? 1 : -1) * Math.min(1, Math.abs(I) * 3 + .1), '#38bdf8', 2.6);
            const loops = Math.min(26, Math.round(v.N / 40) + 4), lw = 70;
            if (!gen) {
                for (let i = 0; i < loops; i++) {
                    const dx = -lw / 2 + i * lw / (loops - 1);
                    cx.strokeStyle = i % 2 ? '#d97706' : '#f59e0b';
                    cx.lineWidth = 2.2;
                    cx.beginPath();
                    cx.ellipse(CXc + dx, TY, 9, 32, 0, 0, 7);
                    cx.stroke();
                }
                h.T(`ملف: ${v.N} لفة`, CXc, TY + 50, '#fcd34d', 11);
                const mx = CXc + Am * Math.sin(st.ph) * 1000 * 1.1;
                cx.fillStyle = '#ef4444';
                cx.fillRect(mx - 48, TY - 12, 48, 24);
                cx.fillStyle = '#3b82f6';
                cx.fillRect(mx, TY - 12, 48, 24);
                h.T('N', mx - 24, TY + 4, '#fff', 13);
                h.T('S', mx + 24, TY + 4, '#fff', 13);
                cx.strokeStyle = 'rgba(148,163,184,.4)';
                cx.lineWidth = 1;
                for (let k = 1; k <= 3; k++) {
                    cx.beginPath();
                    cx.ellipse(mx, TY, 60 + k * 14, 18 + k * 14, 0, -Math.PI / 2.2, Math.PI / 2.2);
                    cx.stroke();
                    cx.beginPath();
                    cx.ellipse(mx, TY, 60 + k * 14, 18 + k * 14, 0, Math.PI - Math.PI / 2.2, Math.PI + Math.PI / 2.2);
                    cx.stroke();
                }
            }
            else {
                cx.fillStyle = '#ef4444';
                cx.fillRect(CXc - 92, TY - 42, 26, 84);
                cx.fillStyle = '#3b82f6';
                cx.fillRect(CXc + 66, TY - 42, 26, 84);
                h.T('N', CXc - 79, TY + 4, '#fff', 14);
                h.T('S', CXc + 79, TY + 4, '#fff', 14);
                cx.strokeStyle = 'rgba(148,163,184,.4)';
                for (let k = -2; k <= 2; k++) {
                    cx.beginPath();
                    cx.moveTo(CXc - 64, TY + k * 14);
                    cx.lineTo(CXc + 64, TY + k * 14);
                    cx.stroke();
                    h.arrow(CXc + 10, TY + k * 14, 1, 0, 'rgba(148,163,184,.6)');
                }
                const wd = Math.abs(Math.cos(st.ph)) * 34, sg = Math.cos(st.ph) >= 0;
                cx.strokeStyle = '#f59e0b';
                cx.lineWidth = 3;
                cx.strokeRect(CXc - wd, TY - 28, 2 * wd, 56);
                cx.fillStyle = 'rgba(245,158,11,.15)';
                cx.fillRect(CXc - wd, TY - 28, 2 * wd, 56);
                h.T(`ملف مستطيل ${v.N} لفة`, CXc, TY + 50, '#fcd34d', 11);
                cx.fillStyle = '#94a3b8';
                cx.fillRect(CXc - 48, TY - 3, 8, 6);
                cx.fillRect(CXc + 40, TY - 3, 8, 6);
            }
            const ga = Math.max(-1, Math.min(1, Vt / rng)), dx = 335, dy = 205;
            cx.fillStyle = '#0b1f2e';
            cx.strokeStyle = '#e2e8f0';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.arc(dx, dy, 24, 0, 7);
            cx.fill();
            cx.stroke();
            cx.save();
            cx.beginPath();
            cx.arc(dx, dy, 22, 0, 7);
            cx.clip();
            for (let k = -5; k <= 5; k++) {
                const a = -Math.PI / 2 + k * .25;
                cx.strokeStyle = '#64748b';
                cx.beginPath();
                cx.moveTo(dx + 14 * Math.cos(a), dy + 14 * Math.sin(a));
                cx.lineTo(dx + 20 * Math.cos(a), dy + 20 * Math.sin(a));
                cx.stroke();
            }
            const na = -Math.PI / 2 + ga * 1.25;
            cx.strokeStyle = '#fb7185';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(dx, dy);
            cx.lineTo(dx + 18 * Math.cos(na), dy + 18 * Math.sin(na));
            cx.stroke();
            cx.restore();
            h.T('V', dx, dy + 38, '#93c5fd', 12);
            h.T(fmt(Vt), dx, dy - 34, '#93c5fd', 12);
            h.T(`المدى ±${rng} V`, dx, dy + 52, '#94a3b8', 9);
            h.meter(310, BY, 'A', null, '#34d399');
            h.T((Math.abs(I) < 1 ? (I * 1000).toFixed(1) + ' mA' : I.toFixed(2) + ' A'), 310, BY + 34, '#34d399', 11);
            h.lamp(430, BY, Math.min(1, I * I * RL / .6));
            h.T('مصباح R = 10 Ω', 430, BY + 34, '#fde68a', 10);
            const sx = 380, sy = 30, sw = 250, sh = 100;
            cx.fillStyle = '#071827';
            cx.fillRect(sx, sy, sw, sh);
            cx.strokeStyle = '#475569';
            cx.strokeRect(sx, sy, sw, sh);
            cx.strokeStyle = '#334155';
            cx.beginPath();
            cx.moveTo(sx, sy + sh / 2);
            cx.lineTo(sx + sw, sy + sh / 2);
            cx.stroke();
            cx.strokeStyle = '#facc15';
            cx.lineWidth = 1.6;
            cx.beginPath();
            st.b.forEach((q, i) => { const X = sx + i * sw / 240, Y = sy + sh / 2 - Math.max(-1, Math.min(1, q / rng)) * sh / 2 * .9; i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); });
            cx.stroke();
            h.T('الجهد على الملف مع الزمن', sx + sw / 2, sy - 4, '#fde68a', 10);
            h.T(`ε = ${fmt(e)} · الجهد الطرفي V = ε − I·r = ${fmt(Vt)} · r = ${Rc.toFixed(1)} Ω`, W / 2, H - 3, '#f8fafc', 11);
            return `قانون فاراداي: ε = −N·ΔΦ/Δt حيث التدفق Φ = B·A·cosθ. ${gen ? 'في المولد يدور الملف في مجال منتظم فيتغير التدفق جيبيًا وتتولد قوة دافعة متناوبة ε = N·B·A·ω·sinωt قيمتها العظمى ' + fmt(pk) + '.' : 'عند اقتراب القطب N من الملف يزداد التدفق فيتولد تيار يعاكس هذا الزيادة (قانون لنز)، وعند الابتعاد ينعكس اتجاه التيار؛ والقيمة العظمى هنا ' + fmt(pk) + '.'} تزداد القوة الدافعة بزيادة عدد اللفات N=${v.N} (بالتناسب)، وبزيادة سرعة الحركة ${v.s}، وبزيادة شدة المجال B=${v.B} T. الدارة مغلقة: الملف مصدر بمقاومة داخلية r = ${Rc.toFixed(1)} Ω (تزداد بزيادة اللفات) موصول بمصباح 10 Ω وأميتر على التوالي، ومقياس الجهد (فولتميتر) موصول على التوازي بين طرفي الملف فيقرأ الجهد الطرفي V = ε − I·r، ويتغير مداه تلقائيًا للحصول على قراءة أدق.`;
        } },
    decay: { c: [R('T', 'عمر النصف (ث)', 1, 20, 1, 5)],
        f(v, t) { const tt = t % 60; cx.strokeStyle = '#38bdf8'; cx.beginPath(); for (let s = 0; s <= 60; s += .5) {
            const X = 40 + s * 9.5, Y = 290 - Math.pow(.5, s / v.T) * 250;
            s ? cx.lineTo(X, Y) : cx.moveTo(X, Y);
        } cx.stroke(); const N = Math.pow(.5, tt / v.T) * 100; cx.fillStyle = '#f472b6'; cx.beginPath(); cx.arc(40 + tt * 9.5, 290 - N * 2.5, 7, 0, 7); cx.fill(); return `N = N₀(½)^(t/T½) → عند t=${tt.toFixed(0)} ث يتبقى ${N.toFixed(1)}٪ من النواة`; } },
    moon: { c: [R('d', 'اليوم من الشهر القمري (day)', 0, 29.5, .5, 7)],
        f(v, t) {
            const h = YQH(cx), d = v.d, th = 2 * Math.PI * d / 29.5, ex = 300, ey = 170, OR = 105, sx = 62, k = Math.cos(th), ill = (1 - k) / 2 * 100;
            h.bg(W, H, '#050d1a', '#0a1a30');
            const sg = cx.createRadialGradient(sx, ey, 4, sx, ey, 40);
            sg.addColorStop(0, '#fff7c2');
            sg.addColorStop(1, '#f59e0b');
            cx.fillStyle = sg;
            cx.beginPath();
            cx.arc(sx, ey, 34, 0, 7);
            cx.fill();
            h.T('الشمس', sx, ey + 56, '#fde68a', 12);
            cx.strokeStyle = 'rgba(253,224,71,.28)';
            cx.lineWidth = 1.5;
            for (let j = -3; j <= 3; j++) {
                const y = ey + j * 30;
                cx.beginPath();
                cx.moveTo(sx + 44, y);
                cx.lineTo(448, y);
                cx.stroke();
                h.arrow(448, y, 1, 0, 'rgba(253,224,71,.5)');
            }
            h.T('أشعة الشمس', 330, 36, '#fde68a', 11);
            cx.setLineDash([4, 6]);
            cx.strokeStyle = 'rgba(148,163,184,.5)';
            cx.beginPath();
            cx.arc(ex, ey, OR, 0, 7);
            cx.stroke();
            cx.setLineDash([]);
            const mx = ex + OR * Math.cos(Math.PI + th), my = ey - OR * Math.sin(Math.PI + th), al = Math.atan2(my - ey, mx - ex), amp = .65 + .35 * Math.cos(2 * th);
            cx.fillStyle = 'rgba(56,189,248,.5)';
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 1.5;
            cx.beginPath();
            for (let a = 0; a <= 6.29; a += .1) {
                const r = 33 + amp * 9 * Math.cos(2 * (a - al));
                cx.lineTo(ex + r * Math.cos(a), ey + r * Math.sin(a));
            }
            cx.closePath();
            cx.fill();
            cx.stroke();
            const eg = cx.createRadialGradient(ex - 8, ey - 8, 3, ex, ey, 26);
            eg.addColorStop(0, '#4ade80');
            eg.addColorStop(1, '#1d4ed8');
            cx.fillStyle = eg;
            cx.beginPath();
            cx.arc(ex, ey, 25, 0, 7);
            cx.fill();
            h.T('الأرض', ex, ey + 4, '#fff', 11);
            cx.fillStyle = '#334155';
            cx.beginPath();
            cx.arc(mx, my, 15, 0, 7);
            cx.fill();
            cx.fillStyle = '#fde68a';
            cx.beginPath();
            cx.arc(mx, my, 15, Math.PI / 2, Math.PI * 1.5);
            cx.fill();
            cx.strokeStyle = '#94a3b8';
            cx.lineWidth = 1;
            cx.beginPath();
            cx.arc(mx, my, 15, 0, 7);
            cx.stroke();
            h.T('القمر', mx + (mx < ex ? -26 : 26) * Math.abs(Math.cos(al)) * 1.1, my + (my < ey ? -22 : 30), '#e2e8f0', 11);
            h.T('النصف المواجه للشمس مضيء دائمًا', ex, H - 14, '#fde68a', 11);
            const vx = 548, vy = 104, r = 46;
            cx.fillStyle = '#1e293b';
            cx.beginPath();
            cx.arc(vx, vy, r, 0, 7);
            cx.fill();
            const wax = d < 14.75;
            cx.fillStyle = '#fde68a';
            cx.beginPath();
            cx.arc(vx, vy, r, wax ? -Math.PI / 2 : Math.PI / 2, wax ? Math.PI / 2 : Math.PI * 1.5);
            cx.fill();
            cx.fillStyle = k > 0 ? '#1e293b' : '#fde68a';
            cx.beginPath();
            cx.ellipse(vx, vy, Math.max(.1, r * Math.abs(k)), r, 0, 0, 7);
            cx.fill();
            cx.strokeStyle = '#64748b';
            cx.beginPath();
            cx.arc(vx, vy, r, 0, 7);
            cx.stroke();
            const nm = d < 1 || d > 28.5 ? 'محاق (قمر جديد)' : d < 6.5 ? 'هلال متزايد' : d < 8.5 ? 'تربيع أول' : d < 13.5 ? 'أحدب متزايد' : d < 16 ? 'بدر' : d < 21 ? 'أحدب متناقص' : d < 23 ? 'تربيع أخير' : 'هلال متناقص', tide = Math.abs(k) > .8 ? 'مد ربيعي (أعلى مد وأدنى جزر)' : Math.abs(k) < .35 ? 'مد ميتي (أضعف مد)' : 'مد متوسط';
            h.T('كما نراه من الأرض', vx, 34, '#7dd3fc', 12);
            h.T(nm, vx, 176, '#fde68a', 14);
            h.T('الإضاءة ' + ill.toFixed(0) + '%', vx, 196, '#e2e8f0', 12);
            h.T('المد: ' + tide, vx, 222, '#7dd3fc', 11);
            h.T('اليوم ' + d.toFixed(1), vx, 244, '#94a3b8', 11);
            return `🌙 القمر لا يضيء بذاته؛ هو جسم معتم يعكس ضوء الشمس، ونصفه المواجه للشمس مضيء دائمًا. أطوار القمر تنتج لأن القمر يدور حول الأرض مرة كل 29.5 يومًا فنرى من هذا النصف المضيء أجزاءً مختلفة: عند المحاق يقع القمر بين الأرض والشمس فنرى نصفه المظلم، وعند البدر تكون الأرض بين الشمس والقمر فنرى نصفه المضيء كاملًا. اليوم ${d.toFixed(1)}: الطور «${nm}» ونسبة الإضاءة ${ill.toFixed(0)}%.\n🌊 المد والجزر: تجذب جاذبية القمر مياه المحيطات فتنتفخ نحو القمر وفي الجهة المقابلة منه (مدّان يوميًا)، وتضيف جاذبية الشمس أثرها. عند المحاق والبدر تكون الشمس والأرض والقمر على استقامة واحدة فيحدث المد الربيعي الأقوى، وعند التربيعين تتعامد جاذبيتا القمر والشمس فيحدث المد الميتي الأضعف. الآن: ${tide}.`;
        } }
});
Object.assign(S, {
    micro: { c: [R('t', 'نوع الخلية (0 حيوانية، 1 نباتية)', 0, 1, 1, 0), R('z', 'قوة العدسة الشيئية (×)', 4, 100, 1, 10)],
        f(v) {
            const plant = !!v.t, scale = .72 + Math.min(v.z, 100) / 100 * .48;
            const grad = (x, y, r1, r2, stops) => { const g = cx.createRadialGradient(x - r1 * .25, y - r1 * .3, r1 * .05, x, y, r2); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; };
            const label = (txt, x, y, tx, ty, color = '#dbeafe') => { cx.strokeStyle = color; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(tx, ty); cx.stroke(); cx.fillStyle = color; cx.beginPath(); cx.arc(x, y, 2, 0, Math.PI * 2); cx.fill(); cx.font = 'bold 10px Tahoma'; cx.textAlign = tx < x ? 'right' : 'left'; cx.fillText(txt, tx + (tx < x ? -4 : 4), ty - 3); };
            const mito = (x, y, rx, ry, rot = 0) => { cx.save(); cx.translate(x, y); cx.rotate(rot); cx.fillStyle = '#f59e0b'; cx.strokeStyle = '#b45309'; cx.lineWidth = 1.5; cx.beginPath(); cx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); cx.fill(); cx.stroke(); cx.strokeStyle = '#fff1b8'; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(-rx * .65, -ry * .15); cx.bezierCurveTo(-rx * .35, -ry * 1.1, rx * .1, ry * 1.1, rx * .35, -ry * .1); cx.bezierCurveTo(rx * .55, -ry * .7, rx * .65, ry * .4, rx * .7, ry * .25); cx.stroke(); cx.restore(); };
            const nucleus = (x, y, r) => { cx.fillStyle = grad(x, y, r * .4, r, [[0, '#c4b5fd'], [.55, '#8b5cf6'], [1, '#5b21b6']]); cx.beginPath(); cx.ellipse(x, y, r * 1.08, r * .92, -.18, 0, Math.PI * 2); cx.fill(); cx.strokeStyle = '#ddd6fe'; cx.lineWidth = 2; cx.stroke(); cx.fillStyle = '#4c1d95'; cx.beginPath(); cx.arc(x + r * .18, y - r * .05, r * .28, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#ddd6fe'; for (let k = 0; k < 18; k++) {
                let a = k * 2.4, rr = r * (.48 + (k % 3) * .09);
                cx.beginPath();
                cx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .7, 1.1, 0, Math.PI * 2);
                cx.fill();
            } };
            // Microscopy field and subtle scale marks
            cx.clearRect(0, 0, W, H);
            cx.fillStyle = '#071525';
            cx.fillRect(0, 0, W, H);
            cx.strokeStyle = '#183349';
            cx.lineWidth = 1;
            for (let x = 20; x < W; x += 20) {
                cx.beginPath();
                cx.moveTo(x, 18);
                cx.lineTo(x, H - 18);
                cx.stroke();
            }
            for (let y = 20; y < H; y += 20) {
                cx.beginPath();
                cx.moveTo(12, y);
                cx.lineTo(W - 12, y);
                cx.stroke();
            }
            cx.fillStyle = '#d8f3ff';
            cx.font = 'bold 12px Tahoma';
            cx.textAlign = 'center';
            cx.fillText(plant ? 'نموذج مجهري توضيحي — خلية نباتية' : 'نموذج مجهري توضيحي — خلية حيوانية', 320, 20);
            cx.save();
            cx.translate(320, 164);
            cx.scale(scale, scale);
            cx.translate(-320, -164);
            if (plant) {
                // Cell wall, membrane, cytoplasm
                cx.fillStyle = '#6b9e63';
                cx.strokeStyle = '#b7e4a5';
                cx.lineWidth = 3;
                cx.beginPath();
                cx.roundRect(205, 48, 230, 220, 17);
                cx.fill();
                cx.stroke();
                cx.fillStyle = '#d9efc5';
                cx.beginPath();
                cx.roundRect(214, 57, 212, 202, 12);
                cx.fill();
                cx.strokeStyle = '#4d9a75';
                cx.lineWidth = 3;
                cx.beginPath();
                cx.roundRect(220, 63, 200, 190, 10);
                cx.stroke();
                cx.fillStyle = grad(320, 160, 20, 135, [[0, '#e4f5d7'], [1, '#a9d8a4']]);
                cx.beginPath();
                cx.roundRect(220, 63, 200, 190, 10);
                cx.fill();
                // Large central vacuole with tonoplast
                cx.fillStyle = grad(320, 155, 30, 95, [[0, '#d9f5ff'], [1, '#78c9e8']]);
                cx.strokeStyle = '#4a9fc2';
                cx.lineWidth = 2;
                cx.beginPath();
                cx.roundRect(274, 91, 125, 137, 16);
                cx.fill();
                cx.stroke();
                // Chloroplasts with internal grana
                [[242, 88], [398, 91], [242, 228], [398, 225], [251, 158]].forEach(([x, y], i) => { cx.save(); cx.translate(x, y); cx.rotate(i % 2 ? .5 : -.35); cx.fillStyle = '#2e9d62'; cx.strokeStyle = '#166534'; cx.lineWidth = 1.5; cx.beginPath(); cx.ellipse(0, 0, 17, 9, 0, 0, Math.PI * 2); cx.fill(); cx.stroke(); for (let k = -2; k <= 2; k++) {
                    cx.strokeStyle = '#a7f3b7';
                    cx.lineWidth = 1.5;
                    cx.beginPath();
                    cx.moveTo(k * 4, -5);
                    cx.lineTo(k * 4, 5);
                    cx.stroke();
                } cx.restore(); });
                // nucleus and organelles
                nucleus(278, 148, 22);
                mito(245, 190, 13, 7, .5);
                mito(390, 180, 12, 6, -.4);
                cx.strokeStyle = '#397caa';
                cx.lineWidth = 2;
                for (let k = 0; k < 4; k++) {
                    cx.beginPath();
                    cx.moveTo(285 + k * 4, 188 + k * 2);
                    cx.bezierCurveTo(300 + k * 3, 177 + k * 2, 306 + k * 3, 201 + k * 2, 320 + k * 3, 190 + k * 2);
                    cx.stroke();
                }
                cx.fillStyle = '#8b5cf6';
                [[298, 181], [307, 185], [315, 179], [322, 184], [329, 179], [335, 185], [342, 181]].forEach(([x, y]) => { cx.beginPath(); cx.arc(x, y, 2, 0, Math.PI * 2); cx.fill(); });
                label('الجدار الخلوي', 218, 66, 153, 48, '#b7e4a5');
                label('الغشاء البلازمي', 222, 112, 130, 105);
                label('الفجوة العصارية', 363, 132, 458, 112);
                label('النواة', 278, 148, 158, 164, '#ddd6fe');
                label('بلاستيدة خضراء', 398, 91, 463, 68, '#86efac');
                label('الميتوكوندريا', 245, 190, 151, 211, '#fcd34d');
            }
            else {
                // Animal cell: flexible irregular membrane and cytoplasm
                cx.fillStyle = '#e6a6a6';
                cx.strokeStyle = '#f8c8c8';
                cx.lineWidth = 4;
                cx.beginPath();
                cx.moveTo(208, 151);
                cx.bezierCurveTo(198, 104, 236, 62, 281, 70);
                cx.bezierCurveTo(315, 42, 364, 69, 383, 81);
                cx.bezierCurveTo(430, 87, 444, 127, 429, 161);
                cx.bezierCurveTo(444, 199, 406, 239, 370, 238);
                cx.bezierCurveTo(332, 266, 290, 243, 269, 239);
                cx.bezierCurveTo(226, 236, 197, 199, 208, 151);
                cx.closePath();
                cx.fill();
                cx.stroke();
                cx.fillStyle = grad(320, 160, 20, 140, [[0, '#f9dfd0'], [1, '#d68f9e']]);
                cx.beginPath();
                cx.moveTo(214, 151);
                cx.bezierCurveTo(205, 108, 241, 71, 282, 78);
                cx.bezierCurveTo(316, 52, 361, 77, 380, 89);
                cx.bezierCurveTo(420, 94, 433, 128, 420, 161);
                cx.bezierCurveTo(434, 196, 401, 229, 368, 229);
                cx.bezierCurveTo(333, 254, 293, 234, 271, 231);
                cx.bezierCurveTo(233, 228, 205, 196, 214, 151);
                cx.closePath();
                cx.fill();
                nucleus(314, 151, 34);
                mito(255, 123, 18, 9, .4);
                mito(370, 130, 16, 8, -.4);
                mito(370, 202, 16, 8, .5);
                mito(263, 207, 14, 7, -.5);
                // Endoplasmic reticulum and Golgi
                cx.strokeStyle = '#397caa';
                cx.lineWidth = 3;
                for (let k = 0; k < 5; k++) {
                    cx.beginPath();
                    cx.moveTo(339, 145 + k * 7);
                    cx.bezierCurveTo(354, 135 + k * 7, 361, 158 + k * 7, 377, 147 + k * 7);
                    cx.stroke();
                }
                cx.strokeStyle = '#fbbf24';
                cx.lineWidth = 4;
                for (let k = 0; k < 4; k++) {
                    cx.beginPath();
                    cx.moveTo(292 + k * 2, 199 + k * 5);
                    cx.quadraticCurveTo(315, 190 + k * 5, 330 + k * 2, 201 + k * 5);
                    cx.stroke();
                }
                cx.fillStyle = '#38bdf8';
                [[286, 103], [300, 101], [346, 105], [397, 169], [294, 224], [340, 224], [391, 191]].forEach(([x, y]) => { cx.beginPath(); cx.arc(x, y, 4, 0, Math.PI * 2); cx.fill(); });
                cx.fillStyle = '#be123c';
                [[235, 166], [248, 180], [393, 112]].forEach(([x, y]) => { cx.beginPath(); cx.arc(x, y, 6, 0, Math.PI * 2); cx.fill(); });
                label('الغشاء البلازمي', 218, 151, 135, 130);
                label('النواة والنوية', 314, 151, 316, 105, '#ddd6fe');
                label('الميتوكوندريا', 370, 202, 452, 215, '#fcd34d');
                label('جهاز جولجي', 315, 209, 348, 249, '#fcd34d');
                label('الشبكة الإندوبلازمية', 369, 151, 455, 151);
                label('حويصلات', 397, 169, 454, 177, '#7dd3fc');
            }
            cx.restore();
            // Scale indicator and microscopy note
            cx.fillStyle = '#dbeafe';
            cx.font = '10px Tahoma';
            cx.textAlign = 'right';
            cx.fillText(`العدسة الشيئية: ${v.z}×  |  التكبير الكلي التقريبي: ${v.z * 10}×`, 625, 294);
            cx.fillStyle = '#9fb8ca';
            cx.font = '9px Tahoma';
            cx.textAlign = 'center';
            cx.fillText('رسم تعليمي توضيحي؛ الألوان والتفاصيل ليست صورة مجهرية فعلية', 320, 309);
            return `التكبير الكلي التقريبي = 10× × ${v.z} = ${v.z * 10}×. ${plant ? 'الخلية النباتية تتميز بجدار خلوي وفجوة عصارية كبيرة وبلاستيدات خضراء؛ وتظهر النواة والميتوكوندريا أيضًا.' : 'الخلية الحيوانية محاطة بغشاء بلازمي مرن ولا تمتلك جدارًا خلويًا أو بلاستيدات خضراء؛ وتظهر النواة والميتوكوندريا والشبكة الإندوبلازمية وجهاز جولجي.'} ملاحظة: المحاكاة رسم علمي وليست صورة مأخوذة من مجهر حقيقي.`;
        } },
    digest: { c: [R('p', 'تقدّم رحلة الطعام (%)', 0, 100, 1, 30), R('m', 'حجم الوجبة (غرام)', 100, 900, 50, 450), R('f', 'نوع الوجبة (0 متوازنة، 1 عالية البروتين، 2 عالية الدهون)', 0, 2, 1, 0)],
        f(v, t) {
            const p = v.p, meal = v.m, kind = v.f;
            const stages = [
                { a: 0, b: 5, name: 'الفم والبلع', time: 'ثوانٍ إلى دقائق', desc: 'المضغ يفتّت الطعام، واللعاب يرطّبه ويبدأ إنزيم الأميلاز هضم النشا.', organ: 0 },
                { a: 5, b: 10, name: 'المريء', time: 'نحو 8–10 ثوانٍ للبلعة غالبًا', desc: 'انقباضات عضلية متتابعة (الحركة الدودية) تدفع البلعة نحو المعدة؛ الجاذبية ليست العامل الوحيد.', organ: 1 },
                { a: 10, b: 35, name: 'المعدة', time: kind === 2 ? 'قد تطول 4–6 ساعات أو أكثر مع الوجبات الدسمة' : 'نحو 2–4 ساعات غالبًا، ويتغيّر ذلك بحسب تركيب الوجبة', desc: 'تخلط المعدة الطعام بالعصارة الحمضية؛ يساعد الحمض والبيبسين في هضم البروتينات، ويخرج الكيموس تدريجيًا عبر البواب.', organ: 2 },
                { a: 35, b: 80, name: 'الأمعاء الدقيقة', time: 'نحو 3–6 ساعات تقريبًا', desc: 'تُكمل إنزيمات البنكرياس والأمعاء الهضم. تساعد الصفراء على استحلاب الدهون، وتمتص الزغابات معظم المغذيات إلى الدم أو اللمف.', organ: 3 },
                { a: 80, b: 100, name: 'الأمعاء الغليظة والمستقيم', time: 'قد يستغرق العبور ساعات طويلة إلى أيام', desc: 'تمتص الأمعاء الغليظة الماء والأملاح، وتساهم الميكروبات المعوية في معالجة بعض البقايا، ثم تتكوّن البرازات وتُخزّن في المستقيم قبل الإخراج.', organ: 4 }
            ];
            let st = stages.find(x => p >= x.a && p < x.b) || stages[4];
            const rr = (x, y, w, h, r) => { cx.beginPath(); cx.roundRect(x, y, w, h, r); };
            const glow = (x, y, r, color, alpha) => { let g = cx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, color.replace('ALPHA', alpha)); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill(); };
            // A dedicated anatomical viewing field, independent of the decorative laboratory backdrop.
            const bg = cx.createLinearGradient(0, 0, 640, 320);
            bg.addColorStop(0, 'rgba(5,17,31,.98)');
            bg.addColorStop(1, 'rgba(12,35,51,.98)');
            cx.fillStyle = bg;
            cx.fillRect(0, 0, 640, 320);
            for (let x = 0; x < 640; x += 32) {
                cx.strokeStyle = 'rgba(125,190,220,.055)';
                cx.beginPath();
                cx.moveTo(x, 0);
                cx.lineTo(x, 320);
                cx.stroke();
            }
            // Body silhouette and neck.
            let skin = cx.createLinearGradient(190, 0, 445, 0);
            skin.addColorStop(0, 'rgba(151,178,190,.08)');
            skin.addColorStop(.5, 'rgba(207,222,225,.19)');
            skin.addColorStop(1, 'rgba(122,159,175,.08)');
            cx.fillStyle = skin;
            cx.strokeStyle = 'rgba(185,216,225,.35)';
            cx.lineWidth = 1.5;
            cx.beginPath();
            cx.moveTo(285, 32);
            cx.quadraticCurveTo(260, 35, 250, 54);
            cx.lineTo(211, 70);
            cx.quadraticCurveTo(193, 80, 204, 113);
            cx.lineTo(226, 151);
            cx.lineTo(231, 221);
            cx.quadraticCurveTo(235, 265, 253, 300);
            cx.lineTo(391, 300);
            cx.quadraticCurveTo(409, 265, 413, 221);
            cx.lineTo(417, 151);
            cx.lineTo(439, 113);
            cx.quadraticCurveTo(450, 80, 432, 70);
            cx.lineTo(393, 54);
            cx.quadraticCurveTo(382, 35, 357, 32);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = 'rgba(190,210,218,.14)';
            cx.fillRect(303, 20, 36, 32);
            cx.strokeStyle = 'rgba(200,225,235,.24)';
            cx.strokeRect(303, 20, 36, 32);
            // Oral cavity, pharynx and oesophagus.
            glow(322, 51, 35, 'rgba(255,80,115,ALPHA)', st.organ === 0 ? '.22' : '.04');
            cx.fillStyle = '#8b3049';
            cx.beginPath();
            cx.ellipse(321, 47, 12, 4, 0, 0, Math.PI * 2);
            cx.fill();
            cx.strokeStyle = '#713c53';
            cx.lineWidth = 17;
            cx.lineCap = 'round';
            cx.beginPath();
            cx.moveTo(321, 51);
            cx.bezierCurveTo(315, 62, 328, 69, 321, 81);
            cx.bezierCurveTo(314, 92, 325, 100, 323, 113);
            cx.stroke();
            cx.strokeStyle = '#e5a3a8';
            cx.lineWidth = 5;
            cx.beginPath();
            cx.moveTo(321, 51);
            cx.bezierCurveTo(315, 62, 328, 69, 321, 81);
            cx.bezierCurveTo(314, 92, 325, 100, 323, 113);
            cx.stroke();
            // Liver and gallbladder.
            glow(272, 133, 70, 'rgba(225,91,75,ALPHA)', st.organ === 2 ? '.25' : '.08');
            let liver = cx.createLinearGradient(230, 108, 310, 158);
            liver.addColorStop(0, '#b64e4d');
            liver.addColorStop(.5, '#8e3540');
            liver.addColorStop(1, '#5f2839');
            cx.fillStyle = liver;
            cx.strokeStyle = '#df8a82';
            cx.lineWidth = 1.4;
            cx.beginPath();
            cx.moveTo(231, 121);
            cx.quadraticCurveTo(249, 103, 278, 112);
            cx.quadraticCurveTo(307, 113, 315, 128);
            cx.quadraticCurveTo(304, 149, 278, 155);
            cx.quadraticCurveTo(252, 158, 235, 145);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = '#4c9b72';
            cx.beginPath();
            cx.ellipse(293, 151, 5, 10, .25, 0, Math.PI * 2);
            cx.fill();
            // Stomach with rugae.
            glow(347, 143, 65, 'rgba(244,126,85,ALPHA)', st.organ === 2 ? '.28' : '.08');
            let stomach = cx.createLinearGradient(322, 111, 382, 177);
            stomach.addColorStop(0, '#f2a07d');
            stomach.addColorStop(.48, '#c65c62');
            stomach.addColorStop(1, '#7e304c');
            cx.fillStyle = stomach;
            cx.strokeStyle = '#f5b7a1';
            cx.lineWidth = 1.5;
            cx.beginPath();
            cx.moveTo(323, 111);
            cx.bezierCurveTo(337, 108, 345, 117, 349, 128);
            cx.bezierCurveTo(355, 137, 375, 127, 382, 142);
            cx.bezierCurveTo(392, 163, 371, 181, 349, 178);
            cx.bezierCurveTo(330, 176, 319, 159, 326, 145);
            cx.bezierCurveTo(333, 132, 317, 122, 323, 111);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.save();
            cx.beginPath();
            cx.ellipse(353, 149, 25, 22, -.25, 0, Math.PI * 2);
            cx.clip();
            cx.strokeStyle = 'rgba(255,210,190,.52)';
            cx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                cx.beginPath();
                cx.moveTo(333, 133 + i * 7);
                cx.bezierCurveTo(345, 127 + i * 7, 358, 145 + i * 5, 374, 136 + i * 7);
                cx.stroke();
            }
            cx.restore();
            // Pancreas and duodenum.
            cx.strokeStyle = '#e7bd7b';
            cx.lineWidth = 9;
            cx.lineCap = 'round';
            cx.beginPath();
            cx.moveTo(300, 171);
            cx.bezierCurveTo(315, 164, 328, 170, 340, 169);
            cx.stroke();
            cx.strokeStyle = '#d99c69';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(300, 171);
            cx.bezierCurveTo(315, 164, 328, 170, 340, 169);
            cx.stroke();
            cx.strokeStyle = '#d98e63';
            cx.lineWidth = 12;
            cx.beginPath();
            cx.moveTo(376, 158);
            cx.bezierCurveTo(402, 158, 398, 184, 378, 184);
            cx.bezierCurveTo(362, 184, 362, 170, 370, 167);
            cx.stroke();
            // Large intestine: broad haustrated colon around the small bowel.
            glow(322, 229, 92, 'rgba(90,191,160,ALPHA)', st.organ === 4 ? '.24' : '.05');
            cx.strokeStyle = '#a56d51';
            cx.lineWidth = 21;
            cx.lineCap = 'round';
            cx.lineJoin = 'round';
            cx.beginPath();
            cx.moveTo(267, 202);
            cx.bezierCurveTo(250, 198, 247, 213, 249, 235);
            cx.lineTo(249, 253);
            cx.quadraticCurveTo(251, 269, 269, 269);
            cx.lineTo(365, 269);
            cx.quadraticCurveTo(386, 267, 386, 249);
            cx.lineTo(386, 214);
            cx.quadraticCurveTo(384, 199, 369, 202);
            cx.stroke();
            cx.strokeStyle = '#e3ae82';
            cx.lineWidth = 13;
            cx.beginPath();
            cx.moveTo(267, 202);
            cx.bezierCurveTo(250, 198, 247, 213, 249, 235);
            cx.lineTo(249, 253);
            cx.quadraticCurveTo(251, 269, 269, 269);
            cx.lineTo(365, 269);
            cx.quadraticCurveTo(386, 267, 386, 249);
            cx.lineTo(386, 214);
            cx.quadraticCurveTo(384, 199, 369, 202);
            cx.stroke();
            for (let y = 218; y < 260; y += 11) {
                cx.strokeStyle = 'rgba(111,59,51,.72)';
                cx.lineWidth = 2;
                cx.beginPath();
                cx.moveTo(243, y);
                cx.lineTo(258, y + 2);
                cx.moveTo(379, y);
                cx.lineTo(393, y + 2);
                cx.stroke();
            }
            for (let x = 275; x < 362; x += 15) {
                cx.beginPath();
                cx.moveTo(x, 262);
                cx.lineTo(x + 1, 276);
                cx.stroke();
            }
            // Small intestine: many individual loops, not a generic coil icon.
            glow(319, 226, 68, 'rgba(245,173,83,ALPHA)', st.organ === 3 ? '.32' : '.07');
            cx.lineCap = 'round';
            cx.lineJoin = 'round';
            cx.strokeStyle = '#7f394a';
            cx.lineWidth = 13;
            const loops = [[[270, 208], [286, 198], [309, 208], [292, 220], [270, 211]], [[305, 211], [327, 199], [350, 210], [331, 223], [305, 211]], [[270, 225], [291, 214], [313, 228], [293, 240], [270, 225]], [[309, 230], [330, 216], [352, 231], [332, 244], [309, 230]], [[272, 244], [291, 234], [311, 246], [292, 258], [272, 244]], [[311, 249], [331, 236], [352, 250], [334, 260], [311, 249]]];
            loops.forEach((l, i) => { cx.beginPath(); cx.moveTo(...l[0]); for (let j = 1; j < l.length; j++)
                cx.quadraticCurveTo(l[j][0] - 4, l[j][1] - 5, l[j][0], l[j][1]); cx.stroke(); });
            cx.strokeStyle = '#efb18b';
            cx.lineWidth = 7;
            loops.forEach(l => { cx.beginPath(); cx.moveTo(...l[0]); for (let j = 1; j < l.length; j++)
                cx.quadraticCurveTo(l[j][0] - 4, l[j][1] - 5, l[j][0], l[j][1]); cx.stroke(); });
            // Rectum.
            cx.strokeStyle = '#a56d51';
            cx.lineWidth = 13;
            cx.beginPath();
            cx.moveTo(320, 268);
            cx.bezierCurveTo(319, 280, 323, 286, 320, 296);
            cx.stroke();
            cx.strokeStyle = '#e3ae82';
            cx.lineWidth = 7;
            cx.stroke();
            // Labels and leader lines.
            const label = (txt, x, y, tx, ty, color) => { cx.strokeStyle = color; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x, y - 4); cx.lineTo(tx, ty); cx.stroke(); cx.fillStyle = color; cx.beginPath(); cx.arc(tx, ty, 2.5, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#eaf4fa'; cx.font = '11px Cairo'; cx.textAlign = 'left'; cx.fillText(txt, x, y); };
            label('المريء', 28, 72, 315, 78, '#e7a5b0');
            label('الكبد', 28, 132, 254, 130, '#d67b76');
            label('المعدة', 430, 130, 369, 146, '#f1a58d');
            label('الأمعاء الدقيقة', 430, 220, 346, 232, '#f6bd72');
            label('الأمعاء الغليظة', 430, 263, 384, 250, '#d8a17c');
            // Food bolus travels through a route that follows the anatomy.
            const paths = [[[321, 48], [321, 60], [321, 72], [323, 85], [323, 100], [323, 113]], [[323, 113], [327, 125], [339, 134], [351, 145], [363, 155], [365, 166]], [[365, 166], [354, 177], [335, 183], [313, 192], [293, 204], [278, 212]], [[278, 212], [293, 220], [314, 224], [333, 230], [347, 240], [334, 250]], [[334, 250], [324, 260], [320, 270], [320, 281], [320, 295]]];
            const routeEnds = [5, 10, 35, 80, 100];
            let idx = routeEnds.findIndex(e => p < e);
            if (idx < 0)
                idx = 4;
            let prev = idx === 0 ? 0 : routeEnds[idx - 1], local = (p - prev) / (routeEnds[idx] - prev);
            local = Math.max(0, Math.min(1, local));
            const pp = paths[idx], seg = local * (pp.length - 1), si = Math.min(pp.length - 2, Math.floor(seg)), u = seg - si;
            const fx = pp[si][0] + (pp[si + 1][0] - pp[si][0]) * u, fy = pp[si][1] + (pp[si + 1][1] - pp[si][1]) * u;
            glow(fx, fy, 28, 'rgba(255,196,75,ALPHA)', '.55');
            cx.fillStyle = '#ffe7a3';
            cx.beginPath();
            cx.arc(fx, fy, 7 + Math.sin(t * 5) * 1.2, 0, Math.PI * 2);
            cx.fill();
            cx.strokeStyle = '#ff9d42';
            cx.lineWidth = 2;
            cx.stroke();
            for (let j = 1; j <= 3; j++) {
                const trail = Math.max(0, local - j * .035), ss = trail * (pp.length - 1), ii = Math.min(pp.length - 2, Math.floor(ss)), uu = ss - ii;
                cx.fillStyle = `rgba(255,175,72,${.42 - j * .1})`;
                cx.beginPath();
                cx.arc(pp[ii][0] + (pp[ii + 1][0] - pp[ii][0]) * uu, pp[ii][1] + (pp[ii + 1][1] - pp[ii][1]) * uu, 4 - j * .7, 0, Math.PI * 2);
                cx.fill();
            }
            // Header and progress rail.
            cx.fillStyle = '#dcebf3';
            cx.font = '700 14px Cairo';
            cx.textAlign = 'right';
            cx.fillText('رحلة الطعام داخل الجهاز الهضمي', 620, 22);
            cx.textAlign = 'left';
            cx.fillStyle = 'rgba(170,207,225,.2)';
            rr(20, 286, 170, 8, 4);
            cx.fill();
            cx.fillStyle = '#f5b44c';
            rr(20, 286, 170 * p / 100, 8, 4);
            cx.fill();
            cx.fillStyle = '#e6f2f7';
            cx.font = '11px Cairo';
            cx.fillText(`${p}%`, 20, 279);
            const fat = kind === 2, protein = kind === 1;
            const extra = meal > 600 ? 'الوجبة كبيرة؛ قد يطول إفراغ المعدة. ' : '';
            const result = `${st.name} — ${st.time}. ${st.desc} ${extra}${fat ? 'الوجبة عالية الدهون؛ وقد يتباطأ إفراغ المعدة. ' : protein ? 'تركيب الوجبة الغني بالبروتين قد يغيّر سرعة الإفراغ والشعور بالشبع. ' : ''}العبور الكلي عبر الجهاز الهضمي غالبًا نحو 24–72 ساعة، مع تفاوت كبير بين الأشخاص والوجبات. المؤشر يوضح مسارًا تعليميًا لا ساعة زمنية دقيقة.`;
            cx.textAlign = 'start';
            return result;
        } },
    heart: { c: [R('a', 'شدة النشاط (0 راحة — 10 مجهود)', 0, 10, 1, 0)],
        f(v, t) {
            const activity = v.a, hr = Math.round(68 + 8.5 * activity), sv = Math.round(70 + 3.5 * activity), co = hr * sv / 1000, beat = Math.sin(t * hr / 60 * Math.PI * 2), squeeze = 1 + 0.035 * beat;
            const bg = cx.createLinearGradient(0, 0, 640, 320);
            bg.addColorStop(0, 'rgba(5,15,29,.99)');
            bg.addColorStop(1, 'rgba(14,33,49,.99)');
            cx.fillStyle = bg;
            cx.fillRect(0, 0, 640, 320);
            for (let x = 0; x < 640; x += 32) {
                cx.strokeStyle = 'rgba(110,177,208,.05)';
                cx.beginPath();
                cx.moveTo(x, 0);
                cx.lineTo(x, 320);
                cx.stroke();
            }
            for (let y = 0; y < 320; y += 32) {
                cx.strokeStyle = 'rgba(110,177,208,.05)';
                cx.beginPath();
                cx.moveTo(0, y);
                cx.lineTo(640, y);
                cx.stroke();
            }
            const grad = (x, y, r, c1, c2) => { let g = cx.createRadialGradient(x - r * .3, y - r * .3, 2, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; };
            const path = (pts, color, width) => { cx.beginPath(); cx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++)
                cx.lineTo(pts[i][0], pts[i][1]); cx.strokeStyle = color; cx.lineWidth = width; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.stroke(); };
            // Great vessels behind the myocardium.
            cx.save();
            cx.lineCap = 'round';
            cx.strokeStyle = '#752d42';
            cx.lineWidth = 28;
            cx.beginPath();
            cx.moveTo(329, 109);
            cx.bezierCurveTo(321, 79, 326, 53, 350, 45);
            cx.bezierCurveTo(379, 34, 403, 51, 401, 72);
            cx.lineTo(399, 111);
            cx.stroke();
            cx.strokeStyle = '#df7777';
            cx.lineWidth = 17;
            cx.beginPath();
            cx.moveTo(329, 109);
            cx.bezierCurveTo(321, 79, 326, 53, 350, 45);
            cx.bezierCurveTo(379, 34, 403, 51, 401, 72);
            cx.lineTo(399, 111);
            cx.stroke();
            cx.strokeStyle = '#174f82';
            cx.lineWidth = 24;
            cx.beginPath();
            cx.moveTo(254, 89);
            cx.bezierCurveTo(243, 61, 249, 42, 271, 39);
            cx.lineTo(286, 39);
            cx.lineTo(286, 111);
            cx.stroke();
            cx.strokeStyle = '#63b9e8';
            cx.lineWidth = 13;
            cx.stroke();
            cx.strokeStyle = '#174f82';
            cx.lineWidth = 20;
            cx.beginPath();
            cx.moveTo(274, 119);
            cx.bezierCurveTo(247, 106, 227, 94, 209, 80);
            cx.bezierCurveTo(199, 72, 188, 78, 190, 90);
            cx.stroke();
            cx.strokeStyle = '#55a9dc';
            cx.lineWidth = 10;
            cx.stroke();
            // Pulmonary veins entering left atrium (oxygenated blood).
            path([[365, 123], [402, 112], [426, 115]], '#a83c53', 15);
            path([[365, 137], [402, 143], [426, 146]], '#d65d68', 12);
            cx.restore();
            // Outer myocardium silhouette, with anatomical apex and broad base.
            cx.save();
            cx.translate(0, 4);
            cx.scale(1, squeeze);
            cx.shadowColor = 'rgba(235,55,82,.35)';
            cx.shadowBlur = 20;
            let myo = cx.createLinearGradient(210, 85, 385, 250);
            myo.addColorStop(0, '#f18b8b');
            myo.addColorStop(.24, '#bb3f58');
            myo.addColorStop(.58, '#84243f');
            myo.addColorStop(1, '#43172f');
            cx.fillStyle = myo;
            cx.strokeStyle = '#f19b9a';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(304, 105);
            cx.bezierCurveTo(282, 77, 245, 83, 228, 110);
            cx.bezierCurveTo(202, 151, 233, 197, 282, 238);
            cx.quadraticCurveTo(301, 256, 316, 270);
            cx.quadraticCurveTo(332, 250, 356, 224);
            cx.bezierCurveTo(394, 182, 410, 140, 386, 108);
            cx.bezierCurveTo(365, 80, 332, 83, 314, 107);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.shadowBlur = 0;
            // Right atrium and ventricle (deoxygenated side), viewer's left.
            cx.fillStyle = grad(260, 142, 53, '#66bce7', '#174b79');
            cx.strokeStyle = '#9cdcf3';
            cx.lineWidth = 1.4;
            cx.beginPath();
            cx.moveTo(246, 112);
            cx.bezierCurveTo(226, 119, 226, 145, 244, 161);
            cx.quadraticCurveTo(256, 174, 274, 163);
            cx.lineTo(293, 145);
            cx.quadraticCurveTo(279, 118, 246, 112);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = grad(270, 197, 67, '#4ba5d6', '#123d6a');
            cx.beginPath();
            cx.moveTo(246, 159);
            cx.bezierCurveTo(224, 181, 251, 219, 300, 256);
            cx.bezierCurveTo(307, 239, 311, 209, 304, 176);
            cx.quadraticCurveTo(282, 155, 246, 159);
            cx.closePath();
            cx.fill();
            cx.stroke();
            // Left atrium and thick-walled left ventricle (viewer right).
            cx.fillStyle = grad(352, 137, 53, '#f6a0a0', '#9e3049');
            cx.beginPath();
            cx.moveTo(323, 112);
            cx.bezierCurveTo(342, 95, 374, 102, 382, 124);
            cx.bezierCurveTo(389, 145, 368, 164, 344, 162);
            cx.quadraticCurveTo(329, 151, 323, 112);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = grad(351, 195, 70, '#e66d78', '#651d3b');
            cx.beginPath();
            cx.moveTo(307, 164);
            cx.quadraticCurveTo(329, 148, 354, 159);
            cx.bezierCurveTo(388, 173, 371, 216, 317, 265);
            cx.bezierCurveTo(306, 236, 301, 194, 307, 164);
            cx.closePath();
            cx.fill();
            cx.stroke();
            // Septum separating the ventricles.
            path([[302, 155], [306, 190], [312, 230], [317, 258]], '#f5b0a4', 5);
            // Valve leaflets at atrioventricular and semilunar openings.
            path([[272, 158], [282, 170], [293, 158]], '#ffd0b8', 3);
            path([[333, 158], [343, 169], [354, 157]], '#ffd0b8', 3);
            path([[316, 111], [327, 122], [338, 111]], '#ffd0b8', 3);
            // Coronary arteries on the surface.
            path([[306, 112], [300, 137], [308, 158], [299, 183], [306, 210], [316, 233]], '#ffb4a4', 4);
            path([[307, 137], [285, 143], [270, 157]], '#ffb4a4', 3);
            path([[309, 160], [333, 173], [347, 194], [357, 212]], '#ffb4a4', 3);
            cx.restore();
            // Animated red/blue blood-flow particles follow the major circulation routes.
            const dots = (pts, color, count, phase) => { for (let i = 0; i < count; i++) {
                const z = (t * .22 + i / count + phase) % 1, seg = z * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(seg)), u = seg - j, x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u;
                cx.fillStyle = color;
                cx.shadowColor = color;
                cx.shadowBlur = 8;
                cx.beginPath();
                cx.arc(x, y, 2.5, 0, Math.PI * 2);
                cx.fill();
            } cx.shadowBlur = 0; };
            dots([[260, 77], [262, 107], [261, 138], [271, 171], [287, 204], [312, 250]], '#72d8ff', 9, 0);
            dots([[351, 239], [372, 202], [383, 163], [374, 130], [360, 92], [355, 48]], '#ff8b91', 9, .25);
            dots([[228, 80], [257, 96], [286, 110], [318, 109], [349, 94], [390, 72]], '#72d8ff', 7, .5);
            // Labels, with leader lines and contrast-safe text.
            const lab = (txt, x, y, tx, ty, col, align = 'left') => { cx.strokeStyle = col; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x, y - 4); cx.lineTo(tx, ty); cx.stroke(); cx.fillStyle = col; cx.beginPath(); cx.arc(tx, ty, 2.5, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#eaf4fa'; cx.font = '11px Cairo'; cx.textAlign = align; cx.fillText(txt, x, y); };
            cx.textAlign = 'right';
            cx.fillStyle = '#eaf4fa';
            cx.font = '700 14px Cairo';
            cx.fillText('القلب البشري — مقطع تعليمي لأربع حجرات', 620, 22);
            lab('الوريد الأجوف', 24, 60, 254, 63, '#6fc8f0');
            lab('الأذين الأيمن', 24, 125, 251, 137, '#6fc8f0');
            lab('البطين الأيمن', 24, 201, 269, 199, '#6fc8f0');
            lab('الأبهر', 424, 53, 384, 54, '#ff9d9f');
            lab('الأذين الأيسر', 433, 120, 359, 133, '#ff9d9f');
            lab('البطين الأيسر', 433, 203, 350, 203, '#ff9d9f');
            // ECG monitor top:educational;right:waveform,;bottom:not;left:a;inset:educational waveform, not a diagnostic trace.
            cx.fillStyle = 'rgba(2,10,20,.8)';
            cx.strokeStyle = 'rgba(118,195,220,.5)';
            cx.lineWidth = 1;
            cx.beginPath();
            cx.roundRect(435, 229, 184, 68, 8);
            cx.fill();
            cx.stroke();
            for (let x = 443; x < 615; x += 10) {
                cx.strokeStyle = 'rgba(100,190,210,.11)';
                cx.beginPath();
                cx.moveTo(x, 236);
                cx.lineTo(x, 290);
                cx.stroke();
            }
            for (let y = 237; y < 291; y += 10) {
                cx.beginPath();
                cx.moveTo(443, y);
                cx.lineTo(613, y);
                cx.stroke();
            }
            cx.strokeStyle = '#5af0b0';
            cx.lineWidth = 1.7;
            cx.beginPath();
            for (let x = 0; x <= 170; x++) {
                const phase = ((x + t * hr * 1.9) % 52) / 52;
                let yy = 263;
                if (phase < .18)
                    yy = 263 - 4 * Math.sin(phase / .18 * Math.PI);
                else if (phase < .35)
                    yy = 263;
                else if (phase < .43)
                    yy = 263 + 7 * (phase - .35) / .08;
                else if (phase < .48)
                    yy = 270 - 34 * (phase - .43) / .05;
                else if (phase < .54)
                    yy = 236 + 42 * (phase - .48) / .06;
                else if (phase < .61)
                    yy = 278 - 15 * (phase - .54) / .07;
                else if (phase < .78)
                    yy = 263 - 8 * Math.sin((phase - .61) / .17 * Math.PI);
                cx.lineTo(444 + x, yy);
            }
            cx.stroke();
            cx.fillStyle = '#9ae6c5';
            cx.font = '10px Cairo';
            cx.textAlign = 'left';
            cx.fillText('ECG تعليمي', 444, 244);
            // Compact live metrics on the left-bottom side.
            cx.fillStyle = 'rgba(4,16,27,.83)';
            cx.strokeStyle = 'rgba(130,195,220,.28)';
            cx.beginPath();
            cx.roundRect(18, 235, 190, 67, 8);
            cx.fill();
            cx.stroke();
            cx.textAlign = 'left';
            cx.fillStyle = '#b9d4e1';
            cx.font = '10px Cairo';
            cx.fillText('مؤشرات النموذج', 29, 250);
            cx.fillStyle = '#fff';
            cx.font = '700 13px Cairo';
            cx.fillText(`HR  ${hr} نبضة/د`, 29, 267);
            cx.fillText(`SV  ${sv} مل/ضربة`, 29, 282);
            cx.fillText(`CO  ${co.toFixed(2)} لتر/د`, 29, 297);
            const level = activity === 0 ? 'راحة' : activity < 4 ? 'نشاط خفيف' : activity < 7 ? 'نشاط متوسط' : 'مجهود مرتفع';
            return `الحالة: ${level}. معدل القلب النموذجي ${hr} نبضة/د، وحجم الضربة المفترض ${sv} مل، لذا النتاج القلبي = HR × SV ÷ 1000 = ${co.toFixed(2)} لتر/دقيقة. هذه معادلة صحيحة حسابيًا لكن قيم HR وSV هنا ناتجة عن نموذج مبسّط تعليمي، وليست توقعًا فرديًا أو قياسًا طبيًا. مسار الدم: الجسم → الأذين الأيمن → البطين الأيمن → الرئتان → الأذين الأيسر → البطين الأيسر → الأبهر والجسم.`;
        } },
    osmo: { c: [R('s', 'تركيز الملح خارج الخلية (%)', 0, 3, .1, .9), R('P', 'ضغط معاكس مطبّق (atm) — الأسموزية المعاكسة', 0, 40, 1, 0)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, s = v.s, ci = .9, diff = ci - s, hs = i => { const q = Math.sin(i * 31.7 + 2.3) * 43758.5453; return q - Math.floor(q); };
            h.bg(W, H, '#0d1f3a', '#07101f');
            const vol = Math.max(.55, Math.min(1.25, 1 + diff * .28)), r = 52 * vol, cxl = 160, cyl = 165, lysis = s < .2;
            cx.fillStyle = `rgba(125,211,252,${.1 + Math.min(.2, s * .06)})`;
            cx.fillRect(20, 70, 280, 200);
            cx.strokeStyle = '#38bdf8';
            cx.strokeRect(20, 70, 280, 200);
            h.T(`محلول الملح الخارجي ${s.toFixed(1)}%`, 160, 62, '#7dd3fc', 12);
            const g = cx.createRadialGradient(cxl - 10, cyl - 10, 5, cxl, cyl, r);
            g.addColorStop(0, '#fca5a5');
            g.addColorStop(1, '#b91c1c');
            cx.fillStyle = g;
            cx.strokeStyle = lysis ? '#fde68a' : '#fecaca';
            cx.lineWidth = lysis ? 1.5 : 3;
            cx.setLineDash(lysis ? [5, 4] : []);
            cx.beginPath();
            if (s > 1.6) {
                for (let a = 0; a <= 6.28; a += .1) {
                    const rr = r * (1 + .1 * Math.sin(a * 9));
                    cx.lineTo(cxl + rr * Math.cos(a), cyl + rr * Math.sin(a));
                }
            }
            else
                cx.arc(cxl, cyl, r, 0, 7);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.setLineDash([]);
            for (let i = 0; i < 26; i++) {
                const out = hs(i) < .5, a = hs(i + 3) * 6.28, rr = out ? r + 10 + hs(i + 6) * (120 - r * .5) : hs(i + 8) * (r - 8);
                cx.fillStyle = out ? '#f8fafc' : '#fde68a';
                cx.beginPath();
                cx.arc(cxl + rr * Math.cos(a), cyl + rr * Math.sin(a), 2.2, 0, 7);
                cx.fill();
            }
            const nw = Math.min(10, Math.round(Math.abs(diff) * 7));
            for (let i = 0; i < nw; i++) {
                const a = i * 6.28 / Math.max(nw, 1), ph = (T0 * .9 + i * .31) % 1, d = diff > 0 ? 1 - ph : ph, rr = r + 34 * d;
                cx.fillStyle = '#38bdf8';
                cx.beginPath();
                cx.arc(cxl + rr * Math.cos(a), cyl + rr * Math.sin(a), 3.6, 0, 7);
                cx.fill();
                h.arrow(cxl + (r + 16) * Math.cos(a), cyl + (r + 16) * Math.sin(a), (diff > 0 ? -1 : 1) * Math.cos(a), (diff > 0 ? -1 : 1) * Math.sin(a), '#38bdf8');
            }
            h.T(Math.abs(diff) < .05 ? 'محلول متساوي التوتر: لا صافي حركة للماء' : diff > 0 ? 'الخارج مخفّف (ناقص التوتر): يدخل الماء فتنتفخ' + (lysis ? ' وتنفجر' : '') : 'الخارج مركّز (زائد التوتر): يخرج الماء فتنكمش', 160, 292, diff > 0 ? '#7dd3fc' : '#fca5a5', 12);
            const pi = (c) => c * 10 / 58.5 * 2 * .0821 * 310, pin = pi(ci), pout = pi(s);
            h.T(`الضغط الأسموزي: داخل الخلية ≈ ${pin.toFixed(1)} atm · خارجها ≈ ${pout.toFixed(1)} atm`, 160, 310, '#fde68a', 11);
            const ux = 380, PA = v.P, pisw = 27, net = pisw - PA;
            h.T('الأسموزية المعاكسة (تحلية)', 500, 62, '#bff3ff', 12);
            cx.strokeStyle = '#cfe8ff';
            cx.lineWidth = 3;
            cx.strokeRect(ux, 90, 230, 170);
            cx.fillStyle = 'rgba(30,64,175,.4)';
            const lvL = 170 - (net < 0 ? (PA - pisw) * .9 : -net * .5) * .3 + 0, lvR = 170 + (net < 0 ? (PA - pisw) * .9 : -net * .5) * .3;
            cx.fillRect(ux + 3, Math.max(100, Math.min(240, lvL)), 107, 260 - Math.max(100, Math.min(240, lvL)));
            cx.fillStyle = 'rgba(56,189,248,.45)';
            cx.fillRect(ux + 120, Math.max(100, Math.min(240, lvR)), 107, 260 - Math.max(100, Math.min(240, lvR)));
            cx.strokeStyle = '#fde68a';
            cx.setLineDash([4, 3]);
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(ux + 115, 100);
            cx.lineTo(ux + 115, 260);
            cx.stroke();
            cx.setLineDash([]);
            h.T('غشاء شبه منفذ', ux + 115, 84, '#fde68a', 10);
            h.T('ماء البحر 3.5%', ux + 56, 246, '#bfdbfe', 11);
            h.T('ماء عذب', ux + 172, 246, '#bae6fd', 11);
            {
                const pyL = Math.max(96, Math.min(240, lvL)) - 12;
                cx.fillStyle = '#94a3b8';
                cx.fillRect(ux + 6, pyL, 101, 8);
                cx.strokeStyle = '#94a3b8';
                cx.lineWidth = 3;
                cx.beginPath();
                cx.moveTo(ux + 56, pyL);
                cx.lineTo(ux + 56, 76);
                cx.stroke();
                h.T('مكبس: ' + PA + ' atm', ux + 56, 72, '#e2e8f0', 10);
            }
            const flow = net > 0 ? 'يتجه الماء العذب نحو ماء البحر (أسموزية طبيعية)' : 'الماء يعبر من ماء البحر إلى العذب: تحلية!';
            h.T(flow, 500, 282, net > 0 ? '#fca5a5' : '#86efac', 11);
            for (let i = 0; i < 5; i++) {
                const y = 130 + i * 22, ph = (T0 * .8 + i * .2) % 1, dir = net < 0 ? 1 : -1, x = ux + 115 - dir * (-35 + ph * 70) * -1;
                if (Math.abs(net) > 1) {
                    cx.fillStyle = '#38bdf8';
                    cx.beginPath();
                    cx.arc(ux + 115 + dir * (ph * 60 - 30), y, 3.4, 0, 7);
                    cx.fill();
                }
            }
            h.T(`الضغط الأسموزي لماء البحر ≈ ${pisw} atm`, 500, 306, '#fde68a', 10);
            return `الأسموزية انتشار الماء عبر غشاء شبه منفذ من المحلول الأقل تركيزًا إلى الأعلى تركيزًا. الخلايا الحمراء في ${s.toFixed(1)}% ملح: ${Math.abs(diff) < .05 ? 'متساوية التوتر فلا يتغير حجمها' : diff > 0 ? 'ناقصة التوتر فينتفخ حجمها وقد تنفجر (انحلال)' : 'زائدة التوتر فتنكمش وتتجعد'}. الضغط الأسموزي π = i·C·R·T هو الضغط اللازم لمنع دخول الماء (نحو 7.8 atm داخل الخلية). الأسموزية المعاكسة: إذا طُبّق على ماء البحر ضغط أكبر من ضغطه الأسموزي (≈ ${pisw} atm) انعكس اتجاه الماء فيعبر الماء النقي ويبقى الملح، وهذه هي تقنية تحلية المياه.`;
        } },
    growth: { c: [R('w', 'الماء (%)', 0, 100, 5, 60), R('l', 'الضوء (%)', 0, 100, 5, 60)],
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
        } },
    soil: { c: [R('k', 'نوع التربة (0 حصى،1 رمل،2 طمي،3 طين)', 0, 3, 1, 1)],
        f(v, t) {
            const por = [25, 35, 45, 50][v.k], sp = [8, 4, 1.2, .15][v.k], nm = ['حصى', 'رمل', 'طمي', 'طين'][v.k], lv = Math.max(0, 1 - (t % 12) * sp / 10);
            cx.fillStyle = ['#a8a29e', '#fbbf24', '#a16207', '#7c2d12'][v.k];
            cx.fillRect(230, 120, 180, 170);
            cx.fillStyle = '#38bdf8';
            cx.fillRect(230, 50 + (1 - lv) * 70, 180, 70 * lv + 1);
            return `${nm}: المسامية ≈ ${por}٪ · النفاذية ${v.k < 2 ? 'عالية' : v.k == 2 ? 'متوسطة' : 'ضعيفة جداً'} (الطين مسامي لكنه ضعيف النفاذية)`;
        } },
    layers: { c: [R('d', 'العمق (كم)', 0, 6371, 50, 0)],
        f(v) {
            const L = [[35, 'القشرة (صلبة)', '#a16207'], [2900, 'الستار (صخور شبه لدنة)', '#ea580c'], [5150, 'اللب الخارجي (سائل)', '#facc15'], [6372, 'اللب الداخلي (صلب)', '#fef9c3']], c = [[150, '#facc15', 0], [100, '#facc15', 0]];
            let s;
            for (const q of L) {
                if (v.d < q[0]) {
                    s = q;
                    break;
                }
            }
            [[150, '#a16207'], [148, '#ea580c'], [85, '#facc15'], [40, '#fef9c3']].forEach(q => { cx.fillStyle = q[1]; cx.beginPath(); cx.arc(320, 160, q[0], 0, 7); cx.fill(); });
            cx.fillStyle = '#fff';
            cx.beginPath();
            cx.arc(320, 160 - 150 * (1 - v.d / 6371), 7, 0, 7);
            cx.fill();
            return `على عمق ${v.d} كم: ${s[1]} · تزداد الحرارة والضغط مع العمق`;
        } },
    quake: { c: [R('d', 'المسافة عن البؤرة (km)', 50, 2000, 50, 500)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, d = v.d, vp = 6, vs = 3.5, vl = 3, tp = d / vp, ts = d / vs, tl = d / vl, tmax = tl + 40, tau = (T0 * 14) % (tmax + 25), sc = 420 / 2000, hs = i => { const q = Math.sin(i * 12.9898) * 43758.5453; return q - Math.floor(q); };
            h.bg(W, H, '#1a1410', '#0e0a07');
            cx.fillStyle = '#2a1f16';
            cx.fillRect(10, 40, 620, 120);
            cx.strokeStyle = '#5b4632';
            cx.strokeRect(10, 40, 620, 120);
            const ex = 60, ey = 100, sx = ex + d * sc, sy = ey;
            h.T('خريطة: انتشار الموجات', 320, 32, '#e7d4bb', 11);
            [[vp, '#38bdf8', 'P'], [vs, '#f97316', 'S']].forEach(([vv, c, l]) => { const r = Math.max(0, vv * tau * sc); cx.strokeStyle = c; cx.lineWidth = 2; cx.beginPath(); cx.arc(ex, ey, r, -1.2, 1.2); cx.stroke(); });
            cx.fillStyle = '#ef4444';
            cx.beginPath();
            cx.arc(ex, ey, 6, 0, 7);
            cx.fill();
            h.T('البؤرة', ex, ey + 20, '#fca5a5', 10);
            cx.fillStyle = '#22c55e';
            cx.fillRect(sx - 5, sy - 5, 10, 10);
            h.T('المحطة', sx, sy + 20, '#86efac', 10);
            cx.strokeStyle = '#e7d4bb';
            cx.setLineDash([3, 3]);
            cx.beginPath();
            cx.moveTo(ex, ey + 34);
            cx.lineTo(sx, ey + 34);
            cx.stroke();
            cx.setLineDash([]);
            h.T(d + ' km', (ex + sx) / 2, ey + 30, '#e7d4bb', 11);
            cx.fillStyle = '#1b140e';
            cx.fillRect(10, 176, 620, 134);
            cx.strokeStyle = '#5b4632';
            cx.strokeRect(10, 176, 620, 134);
            const tx = tt => 26 + tt / tmax * 590, ya = 243;
            cx.strokeStyle = '#6b543d';
            cx.beginPath();
            cx.moveTo(26, ya);
            cx.lineTo(616, ya);
            cx.stroke();
            cx.strokeStyle = '#e5e7eb';
            cx.lineWidth = 1.2;
            cx.beginPath();
            for (let x = 26; x <= tx(Math.min(tau, tmax)); x += 1) {
                const tt = (x - 26) / 590 * tmax;
                let a = (hs(x) - .5) * 3;
                if (tt > tp)
                    a += Math.sin(tt * 5) * 13 * Math.exp(-(tt - tp) / 9) * (hs(x * 3) + .5);
                if (tt > ts)
                    a += Math.sin(tt * 2.6) * 26 * Math.exp(-(tt - ts) / 14) * (hs(x * 7) + .5);
                if (tt > tl)
                    a += Math.sin(tt * 1.3) * 40 * Math.exp(-(tt - tl) / 22);
                x == 26 ? cx.moveTo(x, ya + a) : cx.lineTo(x, ya + a);
            }
            cx.stroke();
            [[tp, 'P', '#38bdf8'], [ts, 'S', '#f97316'], [tl, 'سطحية', '#a3e635']].forEach(([tt, l, c]) => { const x = tx(tt); cx.strokeStyle = c; cx.setLineDash([3, 4]); cx.beginPath(); cx.moveTo(x, 182); cx.lineTo(x, 304); cx.stroke(); cx.setLineDash([]); h.T(l + ' ' + tt.toFixed(0) + ' s', x, 194, c, 11); });
            h.T('زمن التسجيل (s)', 320, 306, '#94a3b8', 10);
            const dt = ts - tp;
            h.T(`فارق الوصول S−P = ${dt.toFixed(0)} s ⟹ المسافة ≈ ${(dt / (1 / vs - 1 / vp)).toFixed(0)} km`, W / 2, 168, '#fde68a', 12);
            return `الموجة P (ابتدائية، سرعتها نحو 6 km/s) طولية تضغط وتخلخل المادة وتصل أولًا وتمر عبر الصلب والسائل؛ والموجة S (ثانوية، نحو 3.5 km/s) مستعرضة تهز المادة عموديًا على اتجاه الانتشار وتصل بعدها ولا تمر في السوائل؛ ثم الموجات السطحية الأبطأ والأشد تدميرًا. على بعد ${d} km تصل P بعد ${tp.toFixed(0)} s وS بعد ${ts.toFixed(0)} s. فارق الزمن بينهما يحدد بعد البؤرة (≈ ${(dt / (1 / vs - 1 / vp)).toFixed(0)} km)، ولتحديد موقع البؤرة نحتاج 3 محطات على الأقل: تتقاطع دوائر أنصاف أقطارها المسافات الثلاث عند البؤرة (التثليث).`;
        } },
    react: { c: [R('r', 'التفاعل (0–4)', 0, 4, 1, 0)],
        f(v, t) { const D = [['NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑', 'صودا الخبز + الخل: فوران وغاز CO₂', 5], ['Mg + 2HCl → MgCl₂ + H₂↑', 'المغنيسيوم + HCl: تفاعل سريع وغاز H₂', 9], ['Zn + 2HCl → ZnCl₂ + H₂↑', 'الخارصين + HCl: تفاعل أبطأ وغاز H₂', 4], ['Cu + HCl ← لا يحدث تفاعل', 'النحاس أقل نشاطاً من الهيدروجين', 0], ['NaOH + HCl → NaCl + H₂O', 'تعادل: ينتج ملح وماء وحرارة (بلا غاز)', 0]][v.r]; const liquid = cx.createLinearGradient(0, 145, 0, 290); liquid.addColorStop(0, 'rgba(125,211,252,.65)'); liquid.addColorStop(1, 'rgba(14,116,144,.92)'); cx.fillStyle = 'rgba(226,248,255,.10)'; cx.fillRect(225, 65, 190, 230); cx.fillStyle = liquid; cx.fillRect(235, 150, 170, 135); cx.strokeStyle = 'rgba(226,248,255,.88)'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(225, 65); cx.lineTo(225, 282); cx.quadraticCurveTo(225, 295, 240, 295); cx.lineTo(400, 295); cx.quadraticCurveTo(415, 295, 415, 282); cx.lineTo(415, 65); cx.stroke(); cx.lineWidth = 1; cx.strokeStyle = 'rgba(255,255,255,.42)'; cx.beginPath(); cx.moveTo(240, 160); cx.quadraticCurveTo(320, 154 + Math.sin(t * 2) * 3, 400, 160); cx.stroke(); for (let i = 0; i < D[2] * 3; i++) {
            const y = 280 - ((t * (30 + D[2] * 7) + i * 31) % 130), x = 250 + (i * 29) % 130;
            cx.fillStyle = 'rgba(239,250,255,.88)';
            cx.beginPath();
            cx.arc(x, y, 2 + (i % 4), 0, 7);
            cx.fill();
            cx.strokeStyle = 'rgba(255,255,255,.35)';
            cx.stroke();
        } cx.fillStyle = 'rgba(245,250,252,.12)'; cx.fillRect(240, 75, 8, 70); cx.fillStyle = '#eafaff'; cx.font = '12px Cairo'; cx.fillText('وعاء تفاعل', 275, 48); return D[0] + ' · ' + D[1]; } },
    magnet: { c: [R('d', 'المسافة (سم)', 1, 15, .5, 5)],
        f(v) {
            const n = Math.max(0, Math.min(8, Math.round(14 / (v.d * v.d))));
            cx.fillStyle = '#ef4444';
            cx.fillRect(100, 130, 50, 40);
            cx.fillStyle = '#3b82f6';
            cx.fillRect(150, 130, 50, 40);
            for (let i = 0; i < 8; i++) {
                const x = 218 + v.d * 22 + i * 17, y = 145 + (i % 2) * 8;
                cx.save();
                cx.strokeStyle = i < n ? '#dbeafe' : '#64748b';
                cx.lineWidth = 3;
                cx.beginPath();
                cx.moveTo(x, y - 9);
                cx.lineTo(x, y + 7);
                cx.bezierCurveTo(x, y + 14, x + 13, y + 14, x + 13, y + 5);
                cx.lineTo(x + 13, y - 8);
                cx.bezierCurveTo(x + 13, y - 15, x + 4, y - 15, x + 4, y - 7);
                cx.lineTo(x + 4, y + 5);
                cx.stroke();
                cx.restore();
            }
            return `عدد مشابك الورق المنجذبة ≈ ${n} · تضعف القوة المغناطيسية بزيادة المسافة`;
        } },
    shadow: { c: [R('o', 'بعد الجسم عن المصدر (cm)', 10, 90, 5, 30), R('s', 'حجم المصدر (cm، 0 = نقطي)', 0, 8, .5, 0)],
        f(v, t) {
            const h = YQH(cx), D = 100, ho = 10, o = v.o, s = v.s, sc = 4.2, x0 = 40, ox = x0 + o * sc, sx = x0 + D * sc, yc = 170, k = 2.2;
            h.bg(W, H);
            const um = Math.max(0, (ho * D - s * (D - o)) / o), pen = (ho * D + s * (D - o)) / o;
            const tri = (ya, yb, col) => { cx.fillStyle = col; cx.beginPath(); cx.moveTo(x0, yc - s * k / 2); cx.lineTo(sx, yc - ya); cx.lineTo(sx, yc + yb); cx.lineTo(x0, yc + s * k / 2); cx.closePath(); cx.fill(); };
            const clamp = v2 => Math.max(-150, Math.min(150, v2));
            cx.fillStyle = 'rgba(253,230,138,.10)';
            cx.beginPath();
            cx.moveTo(x0, yc - s * k / 2);
            cx.lineTo(sx, yc - clamp(pen / 2 * k));
            cx.lineTo(sx, yc + clamp(pen / 2 * k));
            cx.lineTo(x0, yc + s * k / 2);
            cx.fill();
            cx.fillStyle = 'rgba(2,6,23,.55)';
            cx.beginPath();
            cx.moveTo(ox, yc - ho / 2 * k);
            cx.lineTo(sx, yc - clamp(pen / 2 * k));
            cx.lineTo(sx, yc + clamp(pen / 2 * k));
            cx.lineTo(ox, yc + ho / 2 * k);
            cx.fill();
            if (um > 0) {
                cx.fillStyle = 'rgba(0,0,0,.65)';
                cx.beginPath();
                cx.moveTo(ox, yc - ho / 2 * k);
                cx.lineTo(sx, yc - clamp(um / 2 * k));
                cx.lineTo(sx, yc + clamp(um / 2 * k));
                cx.lineTo(ox, yc + ho / 2 * k);
                cx.fill();
            }
            cx.strokeStyle = 'rgba(253,224,71,.8)';
            cx.lineWidth = 1.2;
            [[-1, -1], [1, 1], [-1, 1], [1, -1]].forEach(([a, b]) => { if (s == 0 && a !== b)
                return; cx.beginPath(); cx.moveTo(x0, yc + a * s * k / 2); cx.lineTo(ox, yc + b * ho / 2 * k); cx.lineTo(sx, yc + b * (ho / 2 * k + (ho / 2 * k + a * s * k / 2 * (a == b ? 0 : 1) * 0) * 0) * 0 + b * clamp((a == b ? (ho * D - (a == b ? 0 : 0)) / (2 * o) : 0) * k)); cx.stroke(); });
            cx.fillStyle = '#fde047';
            cx.beginPath();
            if (s == 0)
                cx.arc(x0, yc, 6, 0, 7);
            else
                cx.ellipse(x0, yc, 6, Math.max(4, s * k / 2), 0, 0, 7);
            cx.fill();
            h.T('المصدر', x0, yc + 38, '#fde68a', 11);
            cx.fillStyle = '#64748b';
            cx.fillRect(ox - 4, yc - ho / 2 * k, 8, ho * k);
            h.T('الجسم 10 cm', ox, yc + ho / 2 * k + 16, '#cbd5e1', 11);
            cx.fillStyle = '#e5e7eb';
            cx.fillRect(sx, 20, 6, 290);
            const a1 = clamp(um / 2 * k), a2 = clamp(pen / 2 * k);
            cx.fillStyle = 'rgba(253,230,138,.35)';
            cx.fillRect(sx, yc - a2, 6, 2 * a2);
            cx.fillStyle = '#000';
            cx.fillRect(sx, yc - a1, 6, 2 * a1);
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 1.5;
            cx.beginPath();
            cx.moveTo(sx + 14, yc - a1);
            cx.lineTo(sx + 14, yc + a1);
            cx.moveTo(sx + 9, yc - a1);
            cx.lineTo(sx + 19, yc - a1);
            cx.moveTo(sx + 9, yc + a1);
            cx.lineTo(sx + 19, yc + a1);
            cx.stroke();
            h.T(um.toFixed(0) + ' cm', sx + 26, yc + 4, '#7dd3fc', 12, 'left');
            h.T('الحاجز', sx + 3, 310, '#cbd5e1', 11);
            cx.strokeStyle = '#64748b';
            cx.beginPath();
            cx.moveTo(x0, 294);
            cx.lineTo(sx, 294);
            cx.stroke();
            h.T(`المصدر–الجسم = ${o} cm`, (x0 + ox) / 2, 288, '#fde68a', 11);
            h.T(`المصدر–الحاجز = ${D} cm`, (x0 + sx) / 2, 308, '#94a3b8', 11);
            h.T(`حجم الظل = ${um.toFixed(1)} cm${s > 0 ? ` · شبه الظل ${pen.toFixed(1)} cm` : ''}`, W / 2, 24, '#f8fafc', 13);
            return `بالتشابه بين المثلثات: حجم الظل ÷ حجم الجسم = بعد الحاجز ÷ بعد الجسم عن المصدر، أي ${um.toFixed(1)} = 10 × ${D} ÷ ${o} لمصدر نقطي. كلما اقترب الجسم من المصدر كبر ظله، وكلما ابتعد صغر. المصدر الممتد (غير النقطي) يعطي ظلًا كاملًا (umbra) محاطًا بشبه ظل (penumbra) أقل عتمة؛ زد حجم المصدر لتراه يتسع.`;
        } },
    ramp: { c: [R('a', 'زاوية السطح (°)', 0, 60, 1, 20), R('u', 'معامل الاحتكاك μ', 0, 1, .05, .3)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, g = 9.8, m = 1, th = v.a * Math.PI / 180, Wt = m * g, Fp = Wt * Math.sin(th), N = Wt * Math.cos(th), fmax = v.u * N, slide = Fp > fmax + 1e-9, acc = slide ? g * (Math.sin(th) - v.u * Math.cos(th)) : 0, cs = Math.cos(th), sn = Math.sin(th);
            h.bg(W, H);
            const bx = 60, by = 290, L = 360, ex = bx + L * cs, ey = by - L * sn;
            cx.fillStyle = '#475569';
            cx.beginPath();
            cx.moveTo(bx, by);
            cx.lineTo(ex, ey);
            cx.lineTo(ex, by);
            cx.closePath();
            cx.fill();
            cx.strokeStyle = '#cbd5e1';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(bx, by);
            cx.lineTo(ex, ey);
            cx.stroke();
            cx.strokeStyle = '#64748b';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(bx - 10, by);
            cx.lineTo(ex + 16, by);
            cx.stroke();
            cx.strokeStyle = '#fde68a';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.arc(bx, by, 46, -th, 0);
            cx.stroke();
            h.T('θ = ' + v.a + '°', bx + 68, by - 8, '#fde68a', 12);
            const per = 2.6, sp = 40 + (slide ? Math.min(.5 * acc * Math.pow(T0 % per, 2) * 16, L - 130) : 0), px = ex - sp * cs, py = ey + sp * sn, ccx = px - 17 * sn, ccy = py - 17 * cs;
            cx.save();
            cx.translate(px, py);
            cx.rotate(-th);
            cx.fillStyle = '#f59e0b';
            cx.fillRect(-26, -34, 52, 34);
            cx.strokeStyle = '#fff';
            cx.lineWidth = 2;
            cx.strokeRect(-26, -34, 52, 34);
            cx.restore();
            h.T('1 kg', ccx, ccy + 4, '#1f1300', 11);
            const ar = (dx, dy, len, col, l, dash) => { const x2 = ccx + dx * len, y2 = ccy + dy * len; cx.strokeStyle = col; cx.lineWidth = dash ? 2 : 3.2; cx.setLineDash(dash ? [4, 3] : []); cx.beginPath(); cx.moveTo(ccx, ccy); cx.lineTo(x2, y2); cx.stroke(); cx.setLineDash([]); if (!dash)
                h.arrow(x2, y2, dx, dy, col); h.T(l, x2 + dx * 14, y2 + dy * 14 + 4, col, 11); };
            ar(0, 1, Wt * 4.6, '#f87171', 'W');
            ar(-sn, -cs, N * 4.6, '#38bdf8', 'N');
            if (fmax > .02)
                ar(cs, -sn, Math.min(Fp, fmax) * 4.6, '#fb923c', 'f');
            ar(-cs, sn, Fp * 4.6, '#fca5a5', 'mg sinθ', 1);
            cx.fillStyle = 'rgba(255,255,255,.07)';
            cx.fillRect(452, 24, 178, 242);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(452, 24, 178, 242);
            [['W = mg = ' + Wt.toFixed(1) + ' N', '#f87171'], ['mg·sinθ = ' + Fp.toFixed(2) + ' N (المحرّكة)', '#fca5a5'], ['N = mg·cosθ = ' + N.toFixed(2) + ' N', '#38bdf8'], ['f_max = μN = ' + fmax.toFixed(2) + ' N', '#fb923c'], [slide ? 'a = g(sinθ − μcosθ) = ' + acc.toFixed(2) + ' m/s²' : 'ساكن: f = mg·sinθ', '#86efac'], ['tanθ = ' + Math.tan(th).toFixed(2) + (Math.tan(th) > v.u ? ' > μ' : ' ≤ μ'), '#fde68a']].forEach((l, i) => h.T(l[0], 541, 52 + i * 38, l[1], 11));
            h.T(slide ? 'ينزلق: القوة المحرّكة أكبر من الاحتكاك' : 'لا ينزلق: الاحتكاك يعادل المركّبة المحرّكة', W / 2, H - 10, slide ? '#fca5a5' : '#86efac', 13);
            return `على سطح مائل بزاوية θ: يتحلل الوزن إلى مركّبة موازية للسطح mg·sinθ تحرّك الجسم وأخرى عمودية mg·cosθ توازنها قوة رد الفعل N. الاحتكاك الأقصى f = μN يعاكس الحركة. ينزلق الجسم فقط إذا كان mg·sinθ > μ·mg·cosθ أي tanθ > μ (الزاوية الحرجة θ = tan⁻¹μ = ${(Math.atan(v.u) * 57.3).toFixed(1)}°). الآن θ = ${v.a}° وμ = ${v.u}، فالجسم ${slide ? 'ينزلق بتسارع ' + acc.toFixed(2) + ' m/s²' : 'ساكن'}. زيادة الزاوية تزيد التسارع، وزيادة μ تقلّله.`;
        } }
});
Object.assign(S, {
    pred: { c: [R('a', 'معدل تكاثر الفرائس', .2, 1.2, .05, .6), R('b', 'معدل الافتراس', .01, .1, .005, .04)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, e = .5, mm = .4, dtS = .02, tr = [];
            let R0 = 40, F0 = 9;
            const T = 40;
            for (let i = 0; i <= T / dtS; i++) {
                if (i % 10 == 0)
                    tr.push([i * dtS, R0, F0]);
                const k = (r, f) => [v.a * r - v.b * r * f, e * v.b * r * f - mm * f], k1 = k(R0, F0), k2 = k(R0 + dtS / 2 * k1[0], F0 + dtS / 2 * k1[1]), k3 = k(R0 + dtS / 2 * k2[0], F0 + dtS / 2 * k2[1]), k4 = k(R0 + dtS * k3[0], F0 + dtS * k3[1]);
                R0 += dtS / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
                F0 += dtS / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
                if (!(R0 > 0 && F0 > 0) || R0 > 1e4 || F0 > 1e4)
                    break;
            }
            const mxR = Math.max(...tr.map(p => p[1]), 1), mxF = Math.max(...tr.map(p => p[2]), 1), mx = Math.max(mxR, mxF), cur0 = Math.floor(((T0 * 3) % T) / T * tr.length), cur = Math.max(0, Math.min(tr.length - 1, isFinite(cur0) ? cur0 : 0)), c = tr[cur] || tr[tr.length - 1] || [0, 40, 9], Req = mm / (e * v.b), Feq = v.a / v.b;
            h.bg(W, H, '#102a1c', '#0a170f');
            const gx = 24, gy = 48, gw = 360, gh = 170;
            cx.strokeStyle = '#475569';
            cx.strokeRect(gx, gy, gw, gh);
            [[1, '#f8fafc'], [2, '#f97316']].forEach(([k, col]) => { cx.strokeStyle = col; cx.lineWidth = 2; cx.beginPath(); tr.forEach((p, i) => { const X = gx + p[0] / T * gw, Y = gy + gh - Math.min(1, p[k] / mx) * (gh - 6); i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); }); cx.stroke(); });
            cx.strokeStyle = 'rgba(253,224,71,.5)';
            cx.beginPath();
            cx.moveTo(gx + c[0] / T * gw, gy);
            cx.lineTo(gx + c[0] / T * gw, gy + gh);
            cx.stroke();
            h.T('عدد الأفراد مع الزمن', gx + gw / 2, gy - 8, '#bff3ff', 11);
            h.T('● الفرائس (أرانب)', gx + 80, gy + gh + 16, '#f8fafc', 11);
            h.T('● المفترسات (ثعالب)', gx + 250, gy + gh + 16, '#f97316', 11);
            const px0 = 410, py0 = 48, pw = 210, ph = 170;
            cx.strokeStyle = '#475569';
            cx.strokeRect(px0, py0, pw, ph);
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 1.6;
            cx.beginPath();
            tr.forEach((p, i) => { const X = px0 + Math.min(1, p[1] / mxR) * pw, Y = py0 + ph - Math.min(1, p[2] / mxF) * (ph - 4); i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); });
            cx.stroke();
            cx.fillStyle = '#fde68a';
            cx.beginPath();
            cx.arc(px0 + Math.min(1, c[1] / mxR) * pw, py0 + ph - Math.min(1, c[2] / mxF) * (ph - 4), 5, 0, 7);
            cx.fill();
            cx.fillStyle = '#86efac';
            cx.beginPath();
            cx.arc(px0 + Math.min(1, Req / mxR) * pw, py0 + ph - Math.min(1, Feq / mxF) * (ph - 4), 4, 0, 7);
            cx.fill();
            h.T('مستوى الطور: مفترس مقابل فريسة', px0 + pw / 2, py0 - 8, '#bff3ff', 11);
            h.T('نقطة الاتزان', px0 + pw / 2, py0 + ph + 16, '#86efac', 10);
            cx.font = '15px serif';
            for (let i = 0; i < Math.min(28, Math.round(c[1] / mxR * 28)); i++)
                cx.fillText('🐇', 24 + (i % 14) * 24, 256 + Math.floor(i / 14) * 24);
            for (let i = 0; i < Math.min(14, Math.round(c[2] / mxF * 14)); i++)
                cx.fillText('🦊', 400 + (i % 7) * 30, 256 + Math.floor(i / 7) * 28);
            return `نموذج لوتكا–فولتيرا للمفترس والفريسة: dR/dt = aR − bRF وdF/dt = e·bRF − mF. تتذبذب أعداد الفرائس والمفترسات دوريًا: تزداد الفرائس فيزداد الغذاء للمفترسات، فتزداد المفترسات وتأكل الفرائس فتقل، ثم تجوع المفترسات فتقل، فتتعافى الفرائس. قمة المفترسات تتأخر عن قمة الفرائس. نقطة الاتزان R = ${Req.toFixed(0)} وF = ${Feq.toFixed(0)} (النقطة الخضراء) يدور حولها المسار. زيادة معدل تكاثر الفرائس a ترفع عدد المفترسات المتوازن، وزيادة معدل الافتراس b تخفض الفرائس المتوازنة.`;
        } },
    yeast: { c: [R('T', 'درجة الحرارة (°C)', 0, 70, 1, 37)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, Tm = v.T, act = Tm > 58 ? 0 : Math.exp(-Math.pow((Tm - 37) / 13, 2)), st = window.__yqY = window.__yqY || { g: 0, tl: T0 }, dt = Math.min(.05, Math.max(0, T0 - st.tl));
            st.tl = T0;
            st.g = Math.min(60, st.g + act * dt * 4.5);
            h.bg(W, H, '#12202e', '#0a141d');
            cx.fillStyle = '#e9c46a';
            cx.globalAlpha = .55;
            cx.beginPath();
            cx.moveTo(130, 150);
            cx.lineTo(175, 150);
            cx.lineTo(220, 285);
            cx.lineTo(85, 285);
            cx.closePath();
            cx.fill();
            cx.globalAlpha = 1;
            cx.strokeStyle = '#cfe8ff';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(128, 110);
            cx.lineTo(128, 150);
            cx.lineTo(80, 285);
            cx.lineTo(225, 285);
            cx.lineTo(177, 150);
            cx.lineTo(177, 110);
            cx.stroke();
            const br = 12 + st.g * 1.45;
            cx.fillStyle = 'rgba(248,113,113,.8)';
            cx.beginPath();
            cx.ellipse(152, 92 - br * .2, br, br * 1.25, 0, 0, 7);
            cx.fill();
            cx.strokeStyle = '#fecaca';
            cx.stroke();
            h.T('بالون CO₂', 152, 60 - br * .7, '#fecaca', 10);
            const nb = Math.round(act * 10);
            for (let i = 0; i < nb; i++) {
                const y = 280 - ((T0 * 40 * act + i * 37) % 125), x = 100 + ((i * 29) % 80) + Math.sin(T0 * 3 + i) * 3;
                cx.strokeStyle = 'rgba(255,255,255,.85)';
                cx.beginPath();
                cx.arc(x, y, 2 + (i % 3), 0, 7);
                cx.stroke();
            }
            cx.fillStyle = '#fef3c7';
            for (let i = 0; i < 14; i++) {
                cx.beginPath();
                cx.arc(100 + ((i * 37) % 100), 255 + ((i * 13) % 25), 3.2, 0, 7);
                cx.fill();
            }
            h.T('محلول سكر + خميرة', 152, 302, '#fde68a', 11);
            const th = cx;
            cx.fillStyle = '#e5e7eb';
            cx.fillRect(250, 110, 10, 150);
            cx.fillStyle = '#ef4444';
            cx.fillRect(252, 260 - Tm * 2, 6, Tm * 2);
            cx.beginPath();
            cx.arc(255, 266, 10, 0, 7);
            cx.fill();
            h.T(Tm + ' °C', 255, 100, '#fca5a5', 12);
            const gx = 300, gy = 60, gw = 320, gh = 130;
            cx.strokeStyle = '#475569';
            cx.strokeRect(gx, gy, gw, gh);
            cx.strokeStyle = '#4ade80';
            cx.lineWidth = 2;
            cx.beginPath();
            for (let T = 0; T <= 70; T += 2) {
                const a = T > 58 ? 0 : Math.exp(-Math.pow((T - 37) / 13, 2)), x = gx + T / 70 * gw, y = gy + gh - a * (gh - 10);
                T ? cx.lineTo(x, y) : cx.moveTo(x, y);
            }
            cx.stroke();
            cx.fillStyle = '#fde68a';
            cx.beginPath();
            cx.arc(gx + Tm / 70 * gw, gy + gh - act * (gh - 10), 6, 0, 7);
            cx.fill();
            h.T('درجة الحرارة (°C)', gx + gw / 2, gy + gh + 14, '#94a3b8', 10);
            h.T('معدل النشاط الإنزيمي', gx + gw / 2, gy - 6, '#bff3ff', 11);
            h.T('الأمثل ≈ 37', gx + 37 / 70 * gw, gy + gh + 28, '#86efac', 10);
            h.T('C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + 2 ATP (لاهوائي)', 470, 244, '#fde68a', 11);
            h.T('C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36–38 ATP (هوائي)', 470, 264, '#bef264', 11);
            h.T(`حجم CO₂ المتجمّع ≈ ${(st.g * 1.2).toFixed(0)} mL`, 470, 292, '#fca5a5', 12);
            return `التنفس الخلوي يحرر الطاقة من الغلوكوز. الخميرة تتنفس لاهوائيًا (تخمّر) في المحلول المغلق فتنتج CO₂ وإيثانولًا وATP قليلًا (2 ATP)، بينما التنفس الهوائي في الميتوكوندريا ينتج 36–38 ATP. معدل التفاعل تتحكم فيه إنزيمات: يزداد مع ارتفاع الحرارة حتى المثلى (نحو 37 °C) ثم يهبط بسرعة لأن الإنزيمات تتمسخ (فوق ≈ 55 °C)، ويقلّ في البرد. الآن ${Tm} °C فالنشاط ${(act * 100).toFixed(0)}% من أقصاه.`;
        } },
    heat: { c: [R('m', 'الكتلة (كجم)', .1, 5, .1, 1), R('s', 'المادة (0 ماء، 1 ألمنيوم، 2 نحاس)', 0, 2, 1, 0), R('dT', 'التغير في الحرارة (°س)', 1, 80, 1, 20)],
        f(v) {
            const mats = [['الماء', 4186, '#38bdf8'], ['الألمنيوم', 900, '#cbd5e1'], ['النحاس', 385, '#f59e0b']], mat = mats[v.s], Q = v.m * mat[1] * v.dT, maxQ = 5 * 4186 * 80, bar = (q) => Math.max(3, q / maxQ * 170);
            cx.fillStyle = '#071827';
            cx.fillRect(0, 0, W, H);
            // Laboratory bench, hot plate, beaker and thermometer.
            cx.fillStyle = '#253746';
            cx.fillRect(35, 272, 570, 20);
            cx.fillStyle = '#64748b';
            cx.fillRect(80, 248, 150, 22);
            cx.fillStyle = '#1e293b';
            cx.fillRect(95, 242, 120, 7);
            cx.fillStyle = 'rgba(56,189,248,.18)';
            cx.fillRect(120, 138, 72, 104);
            cx.strokeStyle = '#d7e7f0';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(115, 130);
            cx.lineTo(115, 228);
            cx.quadraticCurveTo(115, 242, 130, 242);
            cx.lineTo(182, 242);
            cx.quadraticCurveTo(197, 242, 197, 228);
            cx.lineTo(197, 130);
            cx.stroke();
            cx.fillStyle = mat[2] + '99';
            cx.fillRect(118, 178, 76, 62);
            cx.fillStyle = '#e2e8f0';
            cx.font = '12px Cairo';
            cx.fillText(mat[0], 120, 120);
            cx.fillStyle = '#f87171';
            cx.fillRect(250, 92, 12, 150);
            cx.fillStyle = '#fb7185';
            cx.beginPath();
            cx.arc(256, 247, 13, 0, Math.PI * 2);
            cx.fill();
            cx.fillStyle = '#e2e8f0';
            cx.font = '11px Cairo';
            cx.fillText(`ΔT ${v.dT}°س`, 272, 105);
            cx.fillStyle = '#e2e8f0';
            cx.font = 'bold 14px Cairo';
            cx.fillText('الطاقة الحرارية المطلوبة للمادة المختارة', 300, 45);
            mats.forEach((m, i) => { const q = v.m * m[1] * v.dT, y = 88 + i * 63; cx.fillStyle = '#203546'; cx.fillRect(300, y, 280, 25); cx.fillStyle = m[2]; cx.fillRect(300, y, bar(q), 25); cx.fillStyle = '#f8fafc'; cx.font = '11px Cairo'; cx.fillText(`${m[0]} · ${(q / 1000).toFixed(2)} kJ`, 300, y - 7); });
            return `Q = mcΔT = ${v.m} × ${mat[1]} × ${v.dT} = ${Q.toFixed(0)} J (${(Q / 1000).toFixed(2)} kJ). عند ثبات الكتلة والتغير الحراري، تحتاج المادة ذات الحرارة النوعية الأعلى طاقة أكبر. قيم c: الماء 4186، الألمنيوم 900، النحاس 385 J/(kg·°C).`;
        } },
    charles: { c: [R('T', 'درجة الحرارة (°س)', -100, 200, 5, 25)],
        f(v) { const V = 50 * (v.T + 273.15) / 298.15; cx.fillStyle = '#fb7185aa'; cx.beginPath(); cx.arc(320, 160, 18 + Math.cbrt(V) * 14, 0, 7); cx.fill(); return `V ∝ T (كلفن، P ثابت) → V ≈ ${V.toFixed(1)} مل عند ${v.T}°س (${(v.T + 273.15).toFixed(0)} K)`; } }
});
const Cl = (x, a, b) => Math.max(a, Math.min(b, x)), PH = p => p < 7 ? p / 7 * 120 : 120 + (p - 7) / 7 * 150, T_ = (s, x, y, c) => { cx.fillStyle = c || '#e2e8f0'; cx.font = '700 16px Cairo'; cx.fillText(s, x, y); };
Object.assign(S, {
    lever: { c: [R('m1', 'كتلة القوة (g)', 20, 300, 10, 50), R('m2', 'كتلة المقاومة (g)', 20, 300, 10, 100), R('d1', 'ذراع القوة (cm)', 5, 50, 1, 20), R('d2', 'ذراع المقاومة (cm)', 5, 50, 1, 10)],
        f(v, t) {
            const h = YQH(cx), g = 9.8e-3, t1 = v.m1 * v.d1, t2 = v.m2 * v.d2, net = t1 - t2, tgt = Math.max(-.32, Math.min(.32, net / Math.max(t1, t2) * .6)), st = window.__yqLv = window.__yqLv || { a: 0, tl: t || 0 };
            const dt = Math.min(.05, Math.max(0, (t || 0) - st.tl));
            st.tl = t || 0;
            st.a += (tgt - st.a) * Math.min(1, dt * 3);
            const a = st.a, CX = 320, CY = 165, pc = 3.4;
            h.bg(W, H);
            cx.fillStyle = '#475569';
            cx.beginPath();
            cx.moveTo(CX, CY);
            cx.lineTo(CX - 34, CY + 90);
            cx.lineTo(CX + 34, CY + 90);
            cx.closePath();
            cx.fill();
            cx.fillStyle = '#334155';
            cx.fillRect(CX - 120, CY + 88, 240, 8);
            cx.save();
            cx.translate(CX, CY);
            cx.rotate(a);
            cx.fillStyle = '#d6a35c';
            cx.fillRect(-55 * pc, -6, 110 * pc, 12);
            cx.strokeStyle = '#7c4a1d';
            cx.strokeRect(-55 * pc, -6, 110 * pc, 12);
            for (let d = -50; d <= 50; d += 10) {
                cx.fillStyle = '#78350f';
                cx.fillRect(d * pc - 1, -6, 2, d % 50 ? 7 : 12);
            }
            cx.restore();
            const wt = (side, d, m, col, lab) => { const u = side * d * pc, px = CX + u * Math.cos(a), py = CY + u * Math.sin(a), w = 14 + m / 12, hh = 12 + m / 14; cx.strokeStyle = '#cbd5e1'; cx.beginPath(); cx.moveTo(px, py + 6); cx.lineTo(px, py + 30); cx.stroke(); cx.fillStyle = col; cx.fillRect(px - w / 2, py + 30, w, hh); cx.strokeStyle = '#fff'; cx.strokeRect(px - w / 2, py + 30, w, hh); h.T(m + ' g', px, py + 30 + hh / 2 + 4, '#06202f', 11); const F = m * g; cx.strokeStyle = col; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(px, py + 30 + hh); cx.lineTo(px, py + 30 + hh + Math.min(40, F * 40)); cx.stroke(); h.arrow(px, py + 30 + hh + Math.min(40, F * 40), 0, 1, col); h.T(lab, px, py - 12, col, 12); };
            wt(1, v.d1, v.m1, '#fca5a5', 'القوة F₁');
            wt(-1, v.d2, v.m2, '#93c5fd', 'المقاومة F₂');
            h.T(`عزم القوة = F₁·d₁ = ${(v.m1 * g).toFixed(2)} × ${v.d1} = ${(t1 * g).toFixed(1)} N·cm`, W - 14, 26, '#fca5a5', 12, 'right');
            h.T(`عزم المقاومة = F₂·d₂ = ${(v.m2 * g).toFixed(2)} × ${v.d2} = ${(t2 * g).toFixed(1)} N·cm`, W - 14, 46, '#93c5fd', 12, 'right');
            h.T(Math.abs(net) < 1e-6 ? '⚖ متزنة: F₁·d₁ = F₂·d₂' : net > 0 ? 'الرافعة تميل نحو جهة القوة (عزم القوة أكبر)' : 'الرافعة تميل نحو جهة المقاومة', W / 2, H - 30, '#fde68a', 13);
            h.T(`الفائدة الآلية MA = d₁/d₂ = ${(v.d1 / v.d2).toFixed(2)}`, W / 2, H - 10, '#86efac', 13);
            return `قانون الرافعة: تتزن عندما يتساوى عزم القوة مع عزم المقاومة: F₁ × d₁ = F₂ × d₂. هنا ${(t1 * g).toFixed(1)} N·cm مقابل ${(t2 * g).toFixed(1)} N·cm، فـ${Math.abs(net) < 1e-6 ? 'هي متزنة' : net > 0 ? 'تميل جهة القوة' : 'تميل جهة المقاومة'}. الفائدة الآلية = ذراع القوة ÷ ذراع المقاومة = ${(v.d1 / v.d2).toFixed(2)}: كلما طال ذراع القوة قلّت القوة اللازمة لرفع المقاومة، لكن المسافة التي تتحركها القوة تزداد (الشغل لا يُوفَّر).`;
        } },
    wepend: { c: [R('h', 'ارتفاع الكرة (سم)', 5, 40, 1, 20), R('m', 'كتلة الكرة (جم)', 20, 200, 10, 50), R('M', 'كتلة الصندوق (جم)', 50, 500, 10, 200), R('u', 'احتكاك الطاولة μ', .1, .8, .05, .3)],
        f(v, t) {
            const E = v.m / 1000 * 9.8 * v.h / 100, d = v.m * v.h / (v.u * v.M), k = (t % 4) / 4, x = Math.max(0, Math.min(d, 200) * Math.min(1, k * 2) * 1.5);
            cx.fillStyle = '#64748b';
            cx.fillRect(40, 260, 560, 6);
            cx.fillStyle = '#f59e0b';
            cx.fillRect(300 + x, 222, 50, 38);
            cx.strokeStyle = '#e2e8f0';
            cx.beginPath();
            cx.moveTo(160, 40);
            const bx = k < .15 ? 160 - v.h * 3.2 * (1 - k / .15) : 300 - 12, by = k < .15 ? 40 + (240 - 40) * 0 + Math.min(200, 60 + v.h * 2) * (1 - Math.sin(Math.PI / 2 * k / .15) * 0) : 220;
            cx.lineTo(bx, k < .15 ? 60 + v.h : 240);
            cx.stroke();
            cx.fillStyle = '#38bdf8';
            cx.beginPath();
            cx.arc(bx, k < .15 ? 60 + v.h : 240, 14, 0, 7);
            cx.fill();
            return `الطاقة E = mgh = ${(E * 1000).toFixed(1)} مللي جول · المسافة التي يقطعها الصندوق ≈ ${d.toFixed(1)} سم`;
        } },
    incl: { c: [R('a', 'زاوية المستوى (°)', 10, 50, 1, 25), R('m', 'كتلة العربة (g)', 100, 1000, 50, 500), R('u', 'معامل الاحتكاك', 0, .5, .01, .1), R('L', 'طول المستوى (m)', .3, 1.5, .1, .8)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, g = 9.8, th = v.a * Math.PI / 180, m = v.m / 1000, Wt = m * g, F = Wt * (Math.sin(th) + v.u * Math.cos(th)), hh = v.L * Math.sin(th), Win = F * v.L, Wout = Wt * hh, eta = Wout / Win * 100, MA = Wt / F;
            h.bg(W, H);
            const bx = 50, by = 280, sc = 330 / 1.5, Lp = v.L * sc, ex = bx + Lp * Math.cos(th), ey = by - Lp * Math.sin(th);
            cx.fillStyle = '#475569';
            cx.beginPath();
            cx.moveTo(bx, by);
            cx.lineTo(ex, ey);
            cx.lineTo(ex, by);
            cx.closePath();
            cx.fill();
            cx.strokeStyle = '#94a3b8';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(bx, by);
            cx.lineTo(ex, ey);
            cx.stroke();
            cx.strokeStyle = '#38bdf8';
            cx.setLineDash([4, 4]);
            cx.beginPath();
            cx.moveTo(ex, ey);
            cx.lineTo(ex, by);
            cx.stroke();
            cx.setLineDash([]);
            h.T('h = ' + hh.toFixed(2) + ' m', ex + 34, (ey + by) / 2, '#7dd3fc', 11);
            h.T('L = ' + v.L + ' m', (bx + ex) / 2 - 26, (by + ey) / 2 - 14, '#fde68a', 11);
            const u = (T0 % 3) / 3, px = bx + (ex - bx) * u, py = by - (by - ey) * u;
            cx.save();
            cx.translate(px, py);
            cx.rotate(-th);
            cx.fillStyle = '#22d3ee';
            cx.fillRect(-18, -22, 36, 18);
            cx.fillStyle = '#0f172a';
            cx.beginPath();
            cx.arc(-10, -3, 4, 0, 7);
            cx.arc(10, -3, 4, 0, 7);
            cx.fill();
            cx.restore();
            const fx = px + Math.cos(th) * 60, fy = py - Math.sin(th) * 60;
            cx.strokeStyle = '#fb923c';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(px + Math.cos(th) * 8, py - Math.sin(th) * 8 - 14);
            cx.lineTo(fx, fy - 14);
            cx.stroke();
            h.arrow(fx, fy - 14, Math.cos(th), -Math.sin(th), '#fb923c');
            h.T('F = ' + F.toFixed(2) + ' N', fx + 8, fy - 24, '#fdba74', 11);
            const bars = [['الشغل المبذول W_in = F·L', Win, '#fb923c'], ['الشغل المفيد W_out = mgh', Wout, '#4ade80'], ['المفقود (احتكاك)', Win - Wout, '#f87171']], mx = Math.max(Win, .01);
            bars.forEach((b, i) => { const y = 70 + i * 52; h.T(b[0], W - 14, y, '#e2e8f0', 11, 'right'); cx.fillStyle = '#1e293b'; cx.fillRect(W - 200, y + 6, 186, 12); cx.fillStyle = b[2]; cx.fillRect(W - 200, y + 6, 186 * b[1] / mx, 12); h.T(b[1].toFixed(2) + ' J', W - 206, y + 16, '#fde68a', 10, 'right'); });
            h.T(`الكفاءة η = W_out/W_in = ${eta.toFixed(0)}%   ·   الفائدة الآلية MA = ${MA.toFixed(2)}`, W / 2, H - 12, '#f8fafc', 13);
            return `المستوى المائل آلة بسيطة تقلّل القوة اللازمة لرفع الجسم على حساب المسافة. القوة اللازمة لسحب العربة بسرعة ثابتة F = mg(sinθ + μcosθ) = ${F.toFixed(2)} N بدلًا من الوزن ${Wt.toFixed(2)} N، فالفائدة الآلية MA = ${MA.toFixed(2)}. الشغل المبذول = F·L = ${Win.toFixed(2)} J والشغل المفيد = mgh = ${Wout.toFixed(2)} J، فتكون الكفاءة η = ${eta.toFixed(0)}% (الباقي يضيع احتكاكًا). تقلّ الكفاءة بزيادة الاحتكاك، وتقلّ القوة اللازمة بتقليل الزاوية.`;
        } },
    stair: { c: [R('m', 'الكتلة (kg)', 20, 90, 1, 50), R('n', 'عدد الدرجات', 5, 40, 1, 20), R('t', 'الزمن (s)', 3, 30, 1, 10)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, g = 9.8, n = v.n | 0, sh = .18, sw = .28, hh = n * sh, Wk = v.m * g * hh, P = Wk / v.t, pxm = Math.min(70, 262 / (hh + 1.9), 380 / (n * sw)), ps = sh * pxm, pw = sw * pxm, x0 = 34, y0 = 292;
            h.bg(W, H);
            cx.fillStyle = '#5b6b7d';
            for (let i = 1; i <= n; i++) {
                cx.fillRect(x0 + (i - 1) * pw, y0 - i * ps, pw + 1, i * ps);
            }
            cx.strokeStyle = '#9fb3c8';
            cx.lineWidth = 1.2;
            cx.beginPath();
            cx.moveTo(x0 - 30, y0);
            cx.lineTo(x0 + n * pw + 30, y0);
            for (let i = 1; i <= n; i++) {
                cx.moveTo(x0 + (i - 1) * pw, y0 - i * ps);
                cx.lineTo(x0 + i * pw, y0 - i * ps);
                cx.lineTo(x0 + i * pw, y0 - (i + 1) * ps);
            }
            cx.stroke();
            for (let i = 5; i <= n; i += 5) {
                h.T(String(i), x0 + (i - .5) * pw, y0 - i * ps - 5, '#fde68a', Math.max(8, Math.min(11, pw * .9)));
            }
            h.T('الدرجة 1', x0 + pw * .5, y0 + 14, '#94a3b8', 9);
            const cyc = Math.max(3, Math.min(v.t, 12)), ph = T0 % (cyc + 1.6), pr = Math.min(1, ph / cyc), phi = pr * n, el = pr * v.t;
            const Hh = 1.7 * pxm, Lu = Hh * .245, Lt = Hh * .30, lw = Math.max(3.4, Hh * .058);
            const ft = q => { const u = (phi + 1 - q) / 2, k = Math.floor(u), f = u - k; let s = q + 2 * k, lift = 0; if (f > .5) {
                const w = (f - .5) * 2;
                s = q + 2 * k + 2 * w;
                lift = Math.sin(Math.PI * w) * (ps * 1.4 + Hh * .05);
            } s = Math.max(0, Math.min(n, s)); return [x0 + (s - .5) * pw, y0 - s * ps - lift]; };
            const F0 = ft(0), F1 = ft(1), low = Math.max(F0[1], F1[1]), bob = Math.abs(Math.sin(phi * Math.PI)) * Hh * .02, hipX = (F0[0] + F1[0]) / 2 - pw * .1, hipY = low - Lu * 1.9 + bob;
            const knee = (hx, hy, fx, fy) => { const dx = fx - hx, dy = fy - hy, d = Math.min(Math.hypot(dx, dy), 2 * Lu - .01) || 1, a = Math.sqrt(Math.max(0, Lu * Lu - d * d / 4)), L2 = Math.hypot(dx, dy) || 1; return [hx + dx / 2 + dy / L2 * a, hy + dy / 2 - dx / L2 * a]; };
            const limb = (p, col, w) => { cx.strokeStyle = col; cx.lineWidth = w; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.beginPath(); p.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.stroke(); };
            const lean = .2, shx = hipX + Math.sin(lean) * Lt, shy = hipY - Math.cos(lean) * Lt, swing = Math.sin(phi * Math.PI) * .75, ua = Hh * .17, fa = Hh * .15;
            const arm = (th, bend, col) => { const ex = shx + Math.sin(th) * ua, ey = shy + Math.cos(th) * ua, hx = ex + Math.sin(th + bend) * fa, hy = ey + Math.cos(th + bend) * fa; limb([[shx, shy], [ex, ey], [hx, hy]], col, lw * .8); };
            const leg = (F, col) => { const k = knee(hipX, hipY, F[0], F[1]); limb([[hipX, hipY], k, [F[0], F[1]]], col, lw); limb([[F[0], F[1]], [F[0] + Hh * .07, F[1]]], col, lw * .8); };
            const back = F0[1] > F1[1] ? F1 : F0, front = F0[1] > F1[1] ? F0 : F1;
            arm(-swing, .5, '#64748b');
            leg(front === F0 ? F1 : F0, '#64748b');
            limb([[hipX, hipY], [shx, shy]], '#f59e0b', lw * 1.55);
            cx.fillStyle = '#fcd9b6';
            cx.beginPath();
            cx.arc(shx + Math.sin(lean) * Hh * .085, shy - Hh * .105, Hh * .062, 0, 7);
            cx.fill();
            leg(front === F0 ? F0 : F1, '#cbd5e1');
            arm(swing, .9, '#fbbf24');
            const rx = 470;
            cx.fillStyle = 'rgba(255,255,255,.07)';
            cx.fillRect(rx, 24, 160, 238);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(rx, 24, 160, 238);
            [['عدد الدرجات n = ' + n, '#fde68a'], ['الارتفاع h = n × 0.18 = ' + hh.toFixed(2) + ' m', '#7dd3fc'], ['الوزن mg = ' + (v.m * g).toFixed(0) + ' N', '#fca5a5'], ['الشغل W = mgh = ' + Wk.toFixed(0) + ' J', '#86efac'], ['القدرة P = W/t = ' + P.toFixed(0) + ' W', '#fdba74'], ['الزمن: ' + el.toFixed(1) + ' / ' + v.t + ' s', '#cbd5e1'], ['الدرجات المقطوعة: ' + Math.floor(phi) + ' / ' + n, '#cbd5e1']].forEach((l, i) => h.T(l[0], rx + 80, 52 + i * 33, l[1], 11));
            h.T('يتكرر المشهد كل دورة: ارتفاع الشخص يزيد بزيادة عدد الدرجات', W / 2 - 70, H - 10, '#94a3b8', 10);
            return `عند صعود الدرج يبذل الشخص شغلًا ضد الجاذبية W = m·g·h، حيث h = عدد الدرجات × ارتفاع الدرجة الواحدة (0.18 m تقريبًا). الدرجات في الرسم (${n} درجة) تطابق قيمة التجربة. هنا W = ${v.m} × 9.8 × ${hh.toFixed(2)} = ${Wk.toFixed(0)} J. القدرة P = W/t = ${P.toFixed(0)} W عند زمن ${v.t} s: كلما قلّ الزمن لنفس الشغل ازدادت القدرة، فالركض يتطلب قدرة أكبر من المشي رغم أن الشغل واحد.`;
        } },
    dens: { c: [R('m', 'الكتلة (g)', 20, 200, 1, 80), R('r', 'نصف القطر (cm)', 1, 4, .1, 2), R('l', 'الطول (cm)', 3, 15, .5, 8)],
        f(v, t) {
            const h = YQH(cx), V = Math.PI * v.r * v.r * v.l, rho = v.m / V, flo = rho < 1, sub = Math.min(1, rho), sc = Math.min(6, 110 / v.l, 46 / v.r), cw = 2 * v.r * sc, ch = v.l * sc;
            h.bg(W, H);
            const cyl = (x, yb, col) => { const g = cx.createLinearGradient(x - cw / 2, 0, x + cw / 2, 0); g.addColorStop(0, col[0]); g.addColorStop(.5, col[1]); g.addColorStop(1, col[0]); cx.fillStyle = g; cx.fillRect(x - cw / 2, yb - ch, cw, ch); cx.beginPath(); cx.ellipse(x, yb, cw / 2, 5, 0, 0, 7); cx.fill(); cx.fillStyle = col[1]; cx.beginPath(); cx.ellipse(x, yb - ch, cw / 2, 5, 0, 0, 7); cx.fill(); };
            const col = rho < 1 ? ['#a16207', '#d6a25b'] : rho < 4 ? ['#94a3b8', '#e2e8f0'] : ['#a85a2a', '#e8935b'];
            cx.fillStyle = '#334155';
            cx.fillRect(30, 248, 140, 22);
            cx.fillStyle = '#64748b';
            cx.fillRect(48, 238, 104, 10);
            cx.fillStyle = '#052e1c';
            cx.fillRect(66, 252, 68, 14);
            h.T(v.m.toFixed(0) + ' g', 100, 263, '#4ade80', 11);
            cyl(100, 238, col);
            h.T('الميزان: الكتلة m', 100, 286, '#93c5fd', 11);
            const bx0 = 215, bx1 = 385, by = 268, w0 = 170, lvl0 = 185, rise = Math.min(42, V * .08), lvl = lvl0 - rise;
            cx.fillStyle = 'rgba(56,189,248,.5)';
            cx.fillRect(bx0 + 2, lvl, w0 - 4, by - lvl);
            cx.strokeStyle = '#cfe8ff';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(bx0, 110);
            cx.lineTo(bx0, by);
            cx.lineTo(bx1, by);
            cx.lineTo(bx1, 110);
            cx.stroke();
            const oy = flo ? lvl - (1 - sub) * ch + ch : by - 2;
            cyl(300, oy, col);
            cx.strokeStyle = 'rgba(255,255,255,.7)';
            cx.setLineDash([4, 4]);
            cx.beginPath();
            cx.moveTo(bx0, lvl0);
            cx.lineTo(bx1, lvl0);
            cx.stroke();
            cx.setLineDash([]);
            h.T('مستوى الماء قبل الغمر', bx1 + 4, lvl0 + 4, '#93c5fd', 9, 'left');
            h.T('الماء المزاح = ' + V.toFixed(0) + ' cm³', 300, by + 16, '#7dd3fc', 11);
            const M = [['خشب الصنوبر', .55], ['الجليد', .92], ['الألمنيوم', 2.7], ['الحديد', 7.87], ['النحاس', 8.96], ['الرصاص', 11.3]], near = M.reduce((a, b) => Math.abs(b[1] - rho) < Math.abs(a[1] - rho) ? b : a);
            cx.fillStyle = 'rgba(255,255,255,.07)';
            cx.fillRect(412, 40, 216, 240);
            cx.strokeStyle = 'rgba(125,211,252,.4)';
            cx.strokeRect(412, 40, 216, 240);
            h.T('V = π r² l', 520, 64, '#bff3ff', 13);
            h.T(`= 3.14 × ${v.r.toFixed(1)}² × ${v.l} = ${V.toFixed(1)} cm³`, 520, 84, '#e2e8f0', 12);
            h.T('ρ = m / V', 520, 114, '#bff3ff', 13);
            h.T(`= ${v.m} / ${V.toFixed(1)} = ${rho.toFixed(2)} g/cm³`, 520, 134, '#fde68a', 14);
            h.T(rho < .99 ? 'ρ < 1: يطفو على الماء' : rho > 1.01 ? 'ρ > 1: يغوص في الماء' : 'ρ ≈ 1: معلّق في الماء', 520, 162, rho < 1 ? '#86efac' : '#fca5a5', 12);
            h.T('أقرب مادة: ' + near[0] + ' (' + near[1] + ' g/cm³)', 520, 186, '#93c5fd', 11);
            M.forEach((m, i) => { const y = 206 + i * 12; h.T(m[0], 424, y + 8, '#94a3b8', 9, 'left'); cx.fillStyle = Math.abs(m[1] - near[1]) < .01 ? '#facc15' : '#475569'; cx.fillRect(500, y, Math.min(120, m[1] * 10.5), 8); });
            return `الكثافة ρ = الكتلة m ÷ الحجم V. نقيس الكتلة بالميزان (${v.m} g) ونحسب حجم الأسطوانة V = π r² l = ${V.toFixed(1)} cm³ (أو نقيسه من الماء المزاح). فتكون الكثافة ${rho.toFixed(2)} g/cm³، وأقرب مادة معروفة ${near[0]}. إذا كانت الكثافة أقل من كثافة الماء (1 g/cm³) يطفو الجسم، وإلا يغوص. الكثافة صفة مميزة للمادة لا تتغير بتغير الكتلة أو الحجم معًا.`;
        } },
    mineral: { c: [R('i', 'المعدن (0 غالينا،1 بيريت،2 كوارتز،3 كالسيت،4 جبس،5 ملاكيت،6 كبريت)', 0, 6, 1, 0), R('k', 'أداة الخدش (0 ظفر،1 عملة،2 زجاج،3 سكين)', 0, 3, 1, 2)],
        f(v) { const M = [['غالينا', 2.5, 'معدني رصاصي', 'أسود رصاصي', '#64748b'], ['بيريت', 6, 'معدني ذهبي', 'أسود مخضر', '#ca8a04'], ['كوارتز', 7, 'زجاجي', 'أبيض', '#e2e8f0'], ['كالسيت', 3, 'زجاجي', 'أبيض', '#fde68a'], ['جبس', 2, 'لؤلؤي', 'أبيض', '#f1f5f9'], ['ملاكيت', 3.75, 'حريري', 'أخضر فاتح', '#16a34a'], ['كبريت', 2, 'راتنجي', 'أصفر باهت', '#facc15']][v.i], H = [2.5, 3.5, 5.5, 5.5][v.k], col = M[4]; cx.fillStyle = '#071827'; cx.fillRect(0, 0, W, H); cx.fillStyle = '#132c3e'; cx.fillRect(35, 55, 285, 235); cx.fillStyle = '#dce8ef'; cx.font = 'bold 15px Cairo'; cx.save(); cx.textAlign = 'right'; cx.fillText('عينة معدنية — شكل بلوري توضيحي', 312, 40); cx.restore(); const poly = (pts, color) => { cx.fillStyle = color; cx.beginPath(); pts.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])); cx.closePath(); cx.fill(); cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 1.5; cx.stroke(); }; poly([[90, 225], [112, 126], [178, 84], [250, 120], [269, 205], [220, 258], [130, 260]], col); poly([[112, 126], [178, 84], [168, 165], [90, 225]], 'rgba(255,255,255,.30)'); poly([[178, 84], [250, 120], [216, 175], [168, 165]], 'rgba(255,255,255,.12)'); poly([[168, 165], [216, 175], [269, 205], [220, 258], [130, 260], [90, 225]], 'rgba(0,0,0,.18)'); cx.fillStyle = '#f8fafc'; cx.font = '12px Cairo'; cx.fillText(`المعدن: ${M[0]}`, 350, 80); cx.fillText(`القساوة: ${M[1]} على مقياس موس`, 350, 112); cx.fillText(`البريق: ${M[2]}`, 350, 144); cx.fillText(`لون المخدش: ${M[3]}`, 350, 176); cx.fillStyle = '#203546'; cx.fillRect(350, 200, 235, 38); cx.fillStyle = H > M[1] ? '#86efac' : '#fca5a5'; cx.font = 'bold 12px Cairo'; cx.fillText(`أداة الخدش: ${H} موس — ${H > M[1] ? 'تخدش العينة' : 'لا تخدش العينة'}`, 360, 223); return `${M[0]}: القساوة ${M[1]} (مقياس موس) · البريق ${M[2]} · لون المخدش ${M[3]}. صلادة الأداة المختارة ${H}؛ ${H > M[1] ? 'يمكنها خدش المعدن' : 'لا تخدش المعدن وفق هذا النموذج'}. الشكل البلوري توضيحي وليس نموذجًا بلوريًا تشخيصيًا دقيقًا.`; } },
    cathode: { c: [R('V', 'الجهد V (kV)', 1, 15, 1, 8), R('P', 'الضغط داخل الأنبوب (نسبي)', 1, 10, 1, 2), R('B', 'المجال المغناطيسي B (0 لا يوجد)', -5, 5, 1, 0)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, x0 = 120, x1 = 470, yc = 165, glow = Math.max(0, 1 - v.P / 9) * Math.min(1, v.V / 8), k = v.B * .0016, yAt = x => yc + k * (x - x0) * (x - x0) * (v.B > 0 ? -1 : -1) * (-1) * (v.B > 0 ? 1 : 1) * (-1);
            h.bg(W, H, '#0b1c30', '#050c18');
            cx.strokeStyle = '#a5d8f5';
            cx.lineWidth = 3;
            cx.fillStyle = 'rgba(120,170,220,.08)';
            cx.beginPath();
            cx.rect(80, 95, 430, 140);
            cx.fill();
            cx.stroke();
            cx.fillStyle = '#94a3b8';
            cx.fillRect(100, 135, 14, 60);
            h.T('المهبط (−)', 107, 125, '#7dd3fc', 11);
            cx.fillRect(440, 120, 12, 90);
            h.T('المصعد (+)', 446, 112, '#fca5a5', 11);
            h.L([[40, 165], [100, 165]], '#93c5fd', 3);
            h.L([[452, 205], [452, 262], [40, 262], [40, 165]], '#fca5a5', 3);
            h.cell(40, 214, null);
            h.T(v.V + ' kV', 40, 260, '#fde68a', 12);
            const path = [];
            for (let i = 0; i <= 40; i++) {
                const x = x0 + (x1 - x0) * i / 40, y = yc + (v.B * .0011) * (x - x0) * (x - x0) * -1;
                path.push([x, y]);
            }
            cx.save();
            cx.lineWidth = 7 + glow * 8;
            cx.strokeStyle = `rgba(120,240,170,${.12 + .4 * glow})`;
            cx.lineCap = 'round';
            cx.beginPath();
            path.forEach((q, i) => i ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1]));
            cx.stroke();
            cx.restore();
            h.dots(path, Math.round(8 + v.V * 2 * (1 - v.P / 12)), T0 * (.1 + v.V * .03), '#bef264', 2.8);
            const ey = path[path.length - 1][1];
            cx.fillStyle = `rgba(190,255,150,${.25 + .6 * glow})`;
            cx.beginPath();
            cx.arc(505, Math.max(100, Math.min(230, ey)), 10, 0, 7);
            cx.fill();
            if (v.B != 0) {
                h.T('B ' + (v.B > 0 ? '⊗ (داخل الصفحة)' : '⊙ (خارج الصفحة)'), 300, 84, '#fde68a', 12);
            }
            h.T(v.P > 6 ? 'ضغط مرتفع: تصطدم الإلكترونات بالغاز فلا يظهر توهج واضح' : 'ضغط منخفض: تنطلق الأشعة المهبطية بحرية فيظهر التوهج', W / 2, H - 12, '#f8fafc', 12);
            return `الأشعة المهبطية: عند تطبيق جهد عالٍ بين مهبط ومصعد داخل أنبوب مفرغ تنطلق من المهبط حزمة إلكترونات. كلما قل الضغط ازداد وضوح التوهج لقلة تصادمات الإلكترونات مع جزيئات الغاز، وتتسارع الإلكترونات أكثر بزيادة الجهد. تنحرف الحزمة في مجال مغناطيسي (القوة F = qv×B) نحو اتجاه يدل على أن شحنتها سالبة، وهذا ما قاد طومسون لاكتشاف الإلكترون. الجهد ${v.V} kV والضغط ${v.P} (نسبي) والمجال B = ${v.B}.`;
        } },
    elec: { c: [R('V', 'الجهد V (V)', 1, 12, 1, 6), R('c', 'تركيز المحلول (نسبي)', 1, 10, 1, 5), R('t', 'زمن التحليل (min)', 1, 30, 1, 10)], f(v, t) { return YQ_ELECF(cx, W, H, { v: v.V, c: v.c, t: v.t }, t, 1); } },
    strength: { c: [R('s', 'المحلول (0 HCl حمض قوي، 1 CH₃COOH حمض ضعيف، 2 NaOH قاعدة قوية، 3 NH₃ قاعدة ضعيفة)', 0, 3, 1, 0), R('c', 'التركيز (M)', .01, 1, .01, .1)],
        f(v, t) {
            const h = YQH(cx), T0 = t || performance.now() / 1000, s = v.s, c = v.c, acid = s < 2, strong = s == 0 || s == 2, x = strong ? c : Math.min(c, Math.sqrt(1.8e-5 * c)), al = x / c, pH = acid ? -Math.log10(x) : 14 + Math.log10(x), b = Math.min(1, x / .3), nm = ['HCl', 'CH₃COOH', 'NaOH', 'NH₃'][s], hs = i => { const q = Math.sin(i * 61.3 + 9.1) * 43758.5453; return q - Math.floor(q); };
            h.bg(W, H);
            const bkx = 225, bky = 160, bw = 160;
            cx.fillStyle = `hsla(${Math.max(0, Math.min(280, pH * 20))},80%,52%,.55)`;
            cx.fillRect(bkx + 3, bky + 22, bw - 6, 103);
            cx.strokeStyle = '#a5d8f5';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(bkx, bky);
            cx.lineTo(bkx + 4, bky + 127);
            cx.lineTo(bkx + bw - 4, bky + 127);
            cx.lineTo(bkx + bw, bky);
            cx.stroke();
            cx.fillStyle = '#cbd5e1';
            cx.fillRect(262, 150, 10, 100);
            cx.fillRect(338, 150, 10, 100);
            const loop = [[70, 166], [70, 95], [267, 95], [267, 150]], lp = [[343, 150], [343, 95], [462, 95]], rt = [[498, 95], [560, 95], [560, 300], [70, 300], [70, 214]];
            h.L(loop);
            h.L(lp);
            h.L(rt);
            const spd = T0 * (.02 + b * .35);
            h.dots([[70, 214], [70, 300], [560, 300], [560, 95], [498, 95]], 6, spd, '#38bdf8', 3);
            h.dots([[462, 95], [343, 95], [343, 150]], 3, spd, '#38bdf8', 3);
            h.dots([[267, 150], [267, 95], [70, 95], [70, 166]], 5, spd, '#38bdf8', 3);
            h.cell(70, 190, 6);
            h.lamp(480, 95, b);
            h.T('المصباح', 480, 134, '#fde68a', 11);
            const N = 16, k = Math.max(1, Math.round(al * N)), ix = 470, iy = 232, R0 = 56;
            h.T('مكبّر: الجسيمات في المحلول', ix, iy - R0 - 8, '#7dd3fc', 10);
            cx.fillStyle = '#071827';
            cx.strokeStyle = '#7dd3fc';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.arc(ix, iy, R0, 0, 7);
            cx.fill();
            cx.stroke();
            cx.save();
            cx.beginPath();
            cx.arc(ix, iy, R0 - 2, 0, 7);
            cx.clip();
            for (let i = 0; i < N; i++) {
                const px = ix - 38 + hs(i) * 76 + Math.sin(T0 * 1.5 + i) * 3, py = iy - 38 + hs(i + 20) * 76 + Math.cos(T0 * 1.3 + i * 2) * 3;
                if (i < k) {
                    const p1 = acid ? ['H⁺', '#f87171'] : [s == 2 ? 'Na⁺' : 'NH₄⁺', '#f87171'], p2 = acid ? [s == 0 ? 'Cl⁻' : 'A⁻', '#60a5fa'] : ['OH⁻', '#60a5fa'];
                    cx.fillStyle = p1[1];
                    cx.beginPath();
                    cx.arc(px - 6, py, 5, 0, 7);
                    cx.fill();
                    cx.fillStyle = p2[1];
                    cx.beginPath();
                    cx.arc(px + 6, py + 3, 5, 0, 7);
                    cx.fill();
                    h.T(p1[0], px - 6, py + 3, '#fff', 6);
                    h.T(p2[0], px + 6, py + 6, '#fff', 6);
                }
                else {
                    cx.fillStyle = '#94a3b8';
                    cx.beginPath();
                    cx.arc(px, py, 6.5, 0, 7);
                    cx.fill();
                    h.T(acid ? 'HA' : s == 3 ? 'NH₃' : 'MOH', px, py + 3, '#0f172a', 6);
                }
            }
            cx.restore();
            h.T(`${k * 2} أيون من ${N} وحدات مرسومة`, ix, iy + R0 + 16, '#fde68a', 10);
            h.T(`${nm} · ${c.toFixed(2)} M`, 306, bky - 34, '#bff3ff', 12);
            h.T('● أيون موجب  ● أيون سالب  ● جزيء غير متأين', W / 2, H - 2, '#94a3b8', 10);
            const cd = b > .6 ? 'جيد' : b > .1 ? 'متوسط' : 'ضعيف';
            return `${nm} ${strong ? (acid ? 'حمض قوي' : 'قاعدة قوية') + ' يتأين كليًا تقريبًا في الماء، فتكثر أيوناته (كل الوحدات في الرسم متأينة) ويضيء المصباح بقوة.' : (acid ? 'حمض ضعيف' : 'قاعدة ضعيفة') + ' يتأين جزئيًا فقط (نحو ' + (al * 100).toFixed(1) + '% عند هذا التركيز)، فتبقى معظم جسيماته جزيئات غير متأينة وعدد أيوناته قليل، فيكون المصباح خافتًا.'} عند التركيز ${c.toFixed(2)} M: ${acid ? '[H⁺]' : '[OH⁻]'} = ${x.toExponential(2)} M وpH = ${pH.toFixed(2)}، والتوصيل الكهربائي ${cd}. القوة تعتمد على نسبة التأين وليس على التركيز؛ فحمض ضعيف مركّز قد يحتوي أيونات أكثر من حمض قوي مخفف جدًا. ${acid ? 'يتفاعل Zn مع الحمض القوي أسرع منه مع الضعيف المساوي له في التركيز لأن [H⁺] أكبر.' : ''}`;
        } },
    salt: { c: [R('s', 'الملح (0 NH₄Cl،1 NaCl،2 CH₃COONa)', 0, 2, 1, 0), R('c', 'التركيز (م)', .01, 1, .01, .1)],
        f(v) {
            const p = [-Math.log10(Math.sqrt(5.6e-10 * v.c)), 7, 14 + Math.log10(Math.sqrt(5.6e-10 * v.c))][v.s];
            cx.fillStyle = `hsl(${PH(p)},80%,55%)`;
            cx.fillRect(240, 100, 160, 150);
            cx.strokeStyle = '#e2e8f0';
            cx.strokeRect(240, 100, 160, 150);
            return `pH = ${p.toFixed(2)} · محلول ${p < 6.95 ? 'حمضي (ملح حمضي)' : p > 7.05 ? 'قاعدي (ملح قاعدي)' : 'متعادل'}`;
        } },
    mold: { c: [R('T', 'الحرارة (°س)', 0, 40, 1, 25), R('h', 'الرطوبة (%)', 0, 100, 5, 70), R('l', 'الإضاءة (%)', 0, 100, 5, 10), R('d', 'عدد الأيام', 1, 10, 1, 5)],
        f(v) {
            const r = Math.exp(-Math.pow((v.T - 27) / 10, 2)) * (v.h / 100) * (1 - .5 * v.l / 100), n = Math.round(r * v.d * 14);
            cx.fillStyle = '#fcd34d';
            cx.fillRect(220, 90, 200, 170);
            for (let i = 0; i < n; i++) {
                cx.fillStyle = i % 2 ? '#14532d' : '#4d7c0f';
                cx.beginPath();
                cx.arc(230 + (i * 73) % 180, 100 + (i * 47) % 150, 4 + (i % 4), 0, 7);
                cx.fill();
            }
            return `عدد بقع العفن ≈ ${n} · أفضل نمو في دفء ورطوبة وظلام`;
        } },
    photot: { c: [R('a', 'زاوية الضوء (°، موجبة = من اليمين)', -80, 80, 5, 45), R('i', 'شدة الضوء (%)', 10, 100, 5, 60), R('d', 'الأيام', 1, 10, 1, 4)],
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
        } },
    diffuse: { c: [R('T', 'درجة الحرارة (°س)', 10, 95, 1, 25), R('t', 'الزمن (دقيقة)', 1, 10, 1, 5)],
        f(v, t) {
            const r = Math.min(130, 22 * Math.sqrt(DR(v.T) * v.t) * (1 + Math.sin(t) * .01));
            cx.fillStyle = '#38bdf833';
            cx.fillRect(60, 60, 520, 200);
            const g = cx.createRadialGradient(320, 160, 2, 320, 160, r);
            g.addColorStop(0, '#ec4899');
            g.addColorStop(1, '#ec489900');
            cx.fillStyle = g;
            cx.beginPath();
            cx.arc(320, 160, r, 0, 7);
            cx.fill();
            return `سرعة الانتشار ≈ ${(DR(v.T) * 100).toFixed(0)}٪ من سرعتها عند 25°س · يزداد الانتشار بارتفاع الحرارة لزيادة طاقة الجسيمات ونقص لزوجة الماء`;
        } },
    starch: { c: [R('f', 'الغذاء (0 خبز،1 بطاطا،2 تفاح،3 بيضة،4 أرز)', 0, 4, 1, 0), R('d', 'قطرات اليود', 1, 10, 1, 3)],
        f(v) {
            const s = [.6, .7, .05, 0, .8][v.f], k = Cl(s * v.d / 4, 0, 1);
            cx.fillStyle = `rgb(${Math.round(200 - 190 * k)},${Math.round(120 - 100 * k)},${Math.round(30 + 10 * k)})`;
            cx.beginPath();
            cx.arc(320, 160, 90, 0, 7);
            cx.fill();
            return s > .3 ? `اللون أزرق مسود: النشا موجود (${['خبز', 'بطاطا', '', '', 'أرز'][v.f]})` : 'يبقى اللون بني محمراً: لا يوجد نشا';
        } },
    oxy: { c: [R('m', 'كتلة البذور (جم)', 5, 50, 1, 20), R('t', 'الزمن (دقيقة)', 1, 20, 1, 10), R('T', 'الحرارة (°س)', 5, 40, 1, 25)],
        f(v) {
            const d = .0016 * v.m * v.t * Math.pow(2, (v.T - 25) / 10);
            cx.fillStyle = '#a16207';
            for (let i = 0; i < 20; i++) {
                cx.beginPath();
                cx.arc(160 + (i * 13) % 60, 230 + (i * 7) % 20, 6, 0, 7);
                cx.fill();
            }
            cx.strokeStyle = '#e2e8f0';
            cx.strokeRect(150, 100, 80, 150);
            cx.strokeRect(380, 70, 30, 200);
            cx.fillStyle = '#38bdf8';
            cx.fillRect(381, 150 + d * 60, 28, 120 - d * 60);
            return `استهلاك O₂ ≈ ${d.toFixed(2)} سم³ (يمتص KOH غاز CO₂ فيرتفع الماء في الأنبوب)`;
        } }
});
const pl = (m, x, y, k, vt) => { for (let i = 0; i < m; i++) {
    const o = (i - (m - 1) / 2) * 16, px = vt ? x : x + o, py = vt ? y + o : y;
    cx.strokeStyle = ['#f87171', '#38bdf8'][i % 2];
    cx.lineWidth = 5;
    cx.beginPath();
    if (k) {
        cx.moveTo(px - 3, py - 9);
        cx.lineTo(px + 3, py + 9);
        cx.moveTo(px + 3, py - 9);
        cx.lineTo(px - 3, py + 9);
    }
    else {
        cx.moveTo(px, py - 9);
        cx.lineTo(px, py + 9);
    }
    cx.stroke();
} cx.lineWidth = 1; }, ce = (x, y, a, b) => { cx.strokeStyle = '#cbd5e1'; cx.beginPath(); cx.ellipse(x, y, a, b, 0, 0, 7); cx.stroke(); }, dot = (x, y, r, c) => { cx.fillStyle = c; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); };
Object.assign(S, {
    blood: { c: [R('d', 'فصيلة المتبرع (0 A،1 B،2 AB،3 O)', 0, 3, 1, 3), R('r', 'فصيلة المستقبل', 0, 3, 1, 0), R('x', 'Rh المتبرع (0 سالب،1 موجب)', 0, 1, 1, 0), R('y', 'Rh المستقبل', 0, 1, 1, 1)],
        f(v) {
            const G = [[1, 0], [0, 1], [1, 1], [0, 0]], a = G[v.d], b = G[v.r], bad = (a[0] && !b[0]) || (a[1] && !b[1]), rh = v.x && !v.y, N = ['A', 'B', 'AB', 'O'];
            for (let i = 0; i < 36; i++) {
                const c = bad ? [[250, 110], [320, 200], [400, 120]][i % 3] : [0, 0], px = bad ? c[0] + (i * 7) % 34 - 17 : 60 + (i * 53) % 520, py = bad ? c[1] + (i * 11) % 30 - 15 : 60 + (i * 37) % 200;
                dot(px, py, bad ? 9 : 7, '#dc2626');
            }
            return `${N[v.d]}${v.x ? '+' : '−'} ← ${N[v.r]}${v.y ? '+' : '−'}: ${bad ? 'غير متوافق — تلازن بسبب الأجسام المضادة' : 'متوافق في نظام ABO — خلايا منفصلة'}${rh ? ' · تحذير: Rh⁺ إلى Rh⁻ يحفز تكوين أجسام مضادة' : ''}`;
        } },
    ps: { c: [R('L', 'شدة الضوء (%)', 0, 100, 5, 60), R('C', 'تركيز CO₂ (%)', 0, 100, 5, 50), R('T', 'الحرارة (°س)', 5, 45, 1, 25)],
        f(v, t) {
            const P = Math.min(v.L, v.C) / 100 * Math.exp(-Math.pow((v.T - 30) / 12, 2)) * 10, Rr = 1.2 * Math.pow(2, (v.T - 25) / 10), n = P - Rr;
            cx.fillStyle = '#16a34a';
            cx.beginPath();
            cx.ellipse(150, 150, 95, 60, 0, 0, 7);
            cx.fill();
            cx.fillStyle = '#fb923c';
            cx.beginPath();
            cx.ellipse(500, 150, 80, 45, 0, 0, 7);
            cx.fill();
            T_('بلاستيدة: ضوء+CO₂+H₂O → جلوكوز+O₂', 40, 250);
            T_('ميتوكوندريا: جلوكوز+O₂ → CO₂+H₂O+ATP', 330, 250);
            for (let i = 0; i < Math.ceil(P); i++) {
                const k = ((t * .5 + i * .13) % 1);
                dot(250 + k * 160, 150 - k * 30, 4, '#bef264');
            }
            for (let i = 0; i < Math.ceil(Rr); i++) {
                const k = ((t * .4 + i * .17) % 1);
                dot(420 - k * 160, 170, 4, '#fde68a');
            }
            return `البناء الضوئي ≈ ${P.toFixed(1)} · التنفس ≈ ${Rr.toFixed(1)} · الصافي ${n > 0 ? '+' : ''}${n.toFixed(1)} — ${n > 0 ? 'يطلق النبات O₂ ويخزّن غذاء' : 'يستهلك غذاءه المخزّن'}`;
        } },
    imm: { c: [R('p', 'الممرض (0 بكتيريا،1 خلية مصابة بفيروس)', 0, 1, 1, 0), R('s', 'المرحلة', 0, 4, 1, 0), R('h', 'وجود T المساعدة', 0, 1, 1, 1)],
        f(v, t) {
            const B = ['مستقبل خلية B يرتبط بالمستضد على البكتيريا', 'ابتلاع المستضد وعرضه على T المساعدة', 'تنشيط B بإشارات T المساعدة', 'تكاثر B وتحوّلها إلى خلايا بلازمية وخلايا ذاكرة', 'إفراز أجسام مضادة تلتصق بالمستضدات وتحيّدها'], T = ['الخلية المصابة تعرض مستضداً فيروسياً على MHC-I', 'مستقبل TCR في T القاتلة يرتبط بالمستضد', 'تنشيط T القاتلة (بمساعدة T المساعدة)', 'إفراز البيرفورين والجرانزايم', 'موت الخلية المصابة المبرمج (apoptosis)'], x = 120 + Math.min(v.s, 1) * 150;
            dot(500, 160, v.p && v.s == 4 ? 40 : 55, v.p ? '#a78bfa' : '#84cc16');
            cx.fillStyle = '#f97316';
            cx.beginPath();
            cx.moveTo(440, 150);
            cx.lineTo(425, 170);
            cx.lineTo(455, 170);
            cx.fill();
            dot(x, 160, 48, v.p ? '#38bdf8' : '#f472b6');
            cx.fillStyle = '#facc15';
            cx.beginPath();
            cx.moveTo(x + 48, 150);
            cx.lineTo(x + 62, 170);
            cx.lineTo(x + 34, 170);
            cx.fill();
            T_(v.p ? 'خلية T القاتلة' : 'خلية B', x - 40, 235);
            T_(v.p ? 'خلية مصابة بفيروس' : 'بكتيريا', 455, 235);
            if (!v.p && v.s >= 4)
                for (let i = 0; i < 8; i++)
                    T_('Y', 300 + (i * 13) % 140, 100 + (i * 29) % 110, '#facc15');
            if (v.p && v.s >= 3)
                for (let i = 0; i < 8; i++)
                    dot(300 + i * 20, 150 + Math.sin(t * 3 + i) * 10, 3, '#fb7185');
            return `مرحلة ${v.s + 1}/5: ${(v.p ? T : B)[v.s]}${!v.h && v.s >= 1 && v.s <= 2 ? ' · غياب T المساعدة يضعف التنشيط' : ''}`;
        } },
    neph: { c: [R('bp', 'ضغط الدم (mmHg)', 40, 200, 5, 100), R('adh', 'هرمون ADH (%)', 0, 100, 5, 50), R('g', 'سكر الدم (mg/dL)', 70, 400, 10, 100)],
        f(v) {
            const F = v.bp < 60 ? 0 : v.bp < 80 ? 125 * (v.bp - 60) / 20 : 125, fe = .12 * Math.pow(.0125, v.adh / 100), U = F * fe;
            dot(110, 160, 38, '#fda4af');
            dot(110, 160, 22, '#dc2626');
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 14;
            cx.beginPath();
            cx.moveTo(150, 160);
            cx.bezierCurveTo(230, 60, 300, 60, 330, 160);
            cx.lineTo(330, 250);
            cx.lineTo(430, 250);
            cx.lineTo(430, 150);
            cx.lineTo(520, 150);
            cx.stroke();
            cx.lineWidth = 1;
            T_('كبيبة بومان + كبة', 50, 225);
            T_('الأنبوب القريب: يُمتص الجلوكوز', 160, 50);
            T_('القناة الجامعة: ADH', 360, 235);
            T_('البول ' + U.toFixed(1) + ' مل/د', 500, 135, '#facc15');
            return `الترشيح ≈ ${F.toFixed(0)} مل/د · البول ≈ ${U.toFixed(1)} مل/د (يُعاد امتصاص ${(100 - fe * 100).toFixed(1)}٪ من الماء) · الجلوكوز: ${v.g > 180 ? 'يتجاوز العتبة (~180) فيظهر في البول' : 'يُعاد امتصاصه كاملاً'}`;
        } },
    anat: { c: [R('o', 'العضو (0 الدماغ، 1 الرئة اليمنى، 2 الرئة اليسرى، 3 القلب، 4 الكبد، 5 المعدة، 6 الكلية اليمنى، 7 الكلية اليسرى، 8 الأمعاء)', 0, 8, 1, 3), R('a', 'زاوية التدوير (°)', 0, 360, 5, 30), R('z', 'التكبير', .6, 1.6, .1, 1), R('sk', 'خريطة الموضع في الجسم (0 مخفية، 1 ظاهرة)', 0, 1, 1, 1), R('auto', 'تدوير تلقائي (0 إيقاف، 1 تشغيل)', 0, 1, 1, 0)],
        f(v, t) {
            const h = YQH(cx), o = Math.max(0, Math.min(8, v.o | 0)), C = window.YQ_ORGC || (window.YQ_ORGC = {}), M = C[o] || (C[o] = window.YQ_ORGB[o]()), I = window.YQ_ORGI[o];
            h.bg(W, H, '#0a1a2c', '#050d18');
            const sc = Math.min(380 / I[7][0], 225 / I[7][1]) * v.z, x0 = v.sk ? 395 : W / 2, y0 = 152;
            const gl = cx.createRadialGradient(x0, y0, 10, x0, y0, 210);
            gl.addColorStop(0, 'rgba(56,189,248,.15)');
            gl.addColorStop(1, 'rgba(56,189,248,0)');
            cx.fillStyle = gl;
            cx.fillRect(0, 0, W, H);
            const st = window.__yqA = window.__yqA || { t: 0, c: 60, oc: null, k: '' }, now = performance.now(), key = o + '|' + v.a + '|' + v.z + '|' + v.sk + '|' + (v.auto ? 1 : 0), iv = Math.max(120, st.c * 4);
            if (!st.oc || st.oc.width !== cx.canvas.width || st.oc.height !== cx.canvas.height) {
                st.oc = document.createElement('canvas');
                st.oc.width = cx.canvas.width;
                st.oc.height = cx.canvas.height;
                st.t = 0;
            }
            if ((v.auto && now - st.t > iv) || (st.k !== key && now - st.t > 45)) {
                const t0 = performance.now(), oc = st.oc.getContext('2d');
                oc.setTransform(1, 0, 0, 1, 0, 0);
                oc.clearRect(0, 0, st.oc.width, st.oc.height);
                oc.setTransform(cx.getTransform());
                YQ3D.render(oc, M.F, { x0, y0, sc, ay: (v.a + (v.auto ? t * 7 : 0)) * Math.PI / 180, ax: -.28 });
                st.c = st.c * .6 + (performance.now() - t0) * .4;
                st.t = now;
                st.k = key;
            }
            cx.drawImage(st.oc, 0, 0, W, H);
            cx.strokeStyle = '#e2e8f0';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(W - 24 - 5 * sc, 282);
            cx.lineTo(W - 24, 282);
            cx.moveTo(W - 24 - 5 * sc, 278);
            cx.lineTo(W - 24 - 5 * sc, 286);
            cx.moveTo(W - 24, 278);
            cx.lineTo(W - 24, 286);
            cx.stroke();
            h.T('5 cm', W - 24 - 2.5 * sc, 272, '#e2e8f0', 11);
            if (v.sk) {
                const s = 2.05, ox = 64, oy = 96, X = x => ox + x * s, Y = y => oy - y * s;
                cx.fillStyle = 'rgba(201,177,153,.13)';
                cx.strokeStyle = 'rgba(235,220,205,.6)';
                cx.lineWidth = 1.5;
                cx.beginPath();
                cx.ellipse(X(0), Y(19), 8.2 * s, 11 * s, 0, 0, 7);
                cx.fill();
                cx.stroke();
                const hf = [[4.5, 8], [4.5, 0], [20, -2], [18, -8], [16.5, -18], [15, -30], [14, -40], [15.5, -50], [17, -60]];
                cx.beginPath();
                hf.forEach((p, i) => i ? cx.lineTo(X(p[0]), Y(p[1])) : cx.moveTo(X(p[0]), Y(p[1])));
                hf.slice().reverse().forEach(p => cx.lineTo(X(-p[0]), Y(p[1])));
                cx.closePath();
                cx.fill();
                cx.stroke();
                cx.fillStyle = I[5];
                cx.globalAlpha = .9;
                cx.beginPath();
                cx.ellipse(X(I[4][0]), Y(I[4][1]), I[6][0] / 2 * s, I[6][1] / 2 * s, 0, 0, 7);
                cx.fill();
                cx.globalAlpha = 1;
                cx.strokeStyle = '#fff';
                cx.setLineDash([3, 3]);
                cx.stroke();
                cx.setLineDash([]);
                h.T('الموضع والحجم الحقيقيان', 64, Y(-66) + 10, '#94a3b8', 9);
            }
            h.T(`${I[0]} · ${I[2]} · ${I[3]}`, x0, 306, '#f1f5f9', 12);
            return `${I[0]}: ${I[1]} الأبعاد التقريبية لشخص بالغ: ${I[2]}، والكتلة: ${I[3]}. النموذج ثلاثي الأبعاد مبني بنسب حقيقية تقريبية (المسطرة 5 cm)، وتبيّن الخريطة اليسرى موضع العضو وحجمه بالنسبة للجسم. تختلف الأعضاء قليلًا بين الأشخاص.`;
        } },
    div: { c: [R('t', 'النوع (0 انقسام متساوٍ، 1 منصّف)', 0, 1, 1, 0), R('s', 'المرحلة', 0, 5, 1, 0), R('k', 'أزواج الصبغيات (n)', 1, 4, 1, 2)],
        f(v, t) {
            const h = YQH(cx), n = v.k, s = v.s, mei = v.t === 1, hs = i => { const q = Math.sin(i * 57.3 + 11.7) * 43758.5453; return q - Math.floor(q); };
            h.bg(W, H, '#12102a', '#0a0a1c');
            const cell = (x, y, w, hh, a) => { const g = cx.createRadialGradient(x, y, 10, x, y, Math.max(w, hh)); g.addColorStop(0, 'rgba(120,200,160,.30)'); g.addColorStop(1, 'rgba(60,140,110,.10)'); cx.fillStyle = g; cx.strokeStyle = a || '#86efac'; cx.lineWidth = 2.5; cx.beginPath(); cx.ellipse(x, y, w, hh, 0, 0, 7); cx.fill(); cx.stroke(); };
            const ch = (x, y, ang, col, dbl, sz) => { cx.save(); cx.translate(x, y); cx.rotate(ang); cx.strokeStyle = col; cx.lineWidth = 4; cx.lineCap = 'round'; const L = sz || 13; if (dbl) {
                cx.beginPath();
                cx.moveTo(-L, -L * .9);
                cx.quadraticCurveTo(0, -1, L, L * .9);
                cx.moveTo(L, -L * .9);
                cx.quadraticCurveTo(0, 1, -L, L * .9);
                cx.stroke();
            }
            else {
                cx.beginPath();
                cx.moveTo(0, -L);
                cx.lineTo(0, L);
                cx.stroke();
            } cx.fillStyle = '#fde68a'; cx.beginPath(); cx.arc(0, 0, 2.4, 0, 7); cx.fill(); cx.restore(); };
            const col = i => i % 2 ? '#60a5fa' : '#f87171', N = 2 * n, rowY = (i, m, gap) => 165 + (i - (m - 1) / 2) * gap;
            const cent = (x, y) => { cx.fillStyle = '#fbbf24'; cx.fillRect(x - 3, y - 3, 6, 6); };
            const fiber = (a, b) => { cx.strokeStyle = 'rgba(250,204,21,.35)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.stroke(); };
            let lab = '', dna = '';
            if (!mei) {
                if (s == 0) {
                    cell(320, 165, 170, 120);
                    cx.setLineDash([]);
                    cx.strokeStyle = '#c4b5fd';
                    cx.lineWidth = 2;
                    cx.beginPath();
                    cx.arc(320, 165, 62, 0, 7);
                    cx.stroke();
                    for (let i = 0; i < N * 5; i++) {
                        const a = hs(i) * 6.28, r = hs(i + 9) * 52;
                        cx.fillStyle = i % 2 ? 'rgba(96,165,250,.55)' : 'rgba(248,113,113,.55)';
                        cx.beginPath();
                        cx.arc(320 + r * Math.cos(a), 165 + r * Math.sin(a), 2, 0, 7);
                        cx.fill();
                    }
                    dna = 'DNA: 2C → 4C (يتضاعف)';
                }
                if (s == 1) {
                    cell(320, 165, 170, 120);
                    cx.setLineDash([5, 5]);
                    cx.strokeStyle = '#c4b5fd';
                    cx.beginPath();
                    cx.arc(320, 165, 64, 0, 7);
                    cx.stroke();
                    cx.setLineDash([]);
                    for (let i = 0; i < N; i++)
                        ch(280 + hs(i) * 80, 130 + hs(i + 5) * 70, hs(i + 3) * 3, col(i), 1);
                    cent(180, 165);
                    cent(460, 165);
                    dna = 'DNA: 4C';
                }
                if (s == 2) {
                    cell(320, 165, 170, 120);
                    for (let i = 0; i < N; i++) {
                        const y = rowY(i, N, 22);
                        fiber([190, 165], [320, y]);
                        fiber([450, 165], [320, y]);
                        ch(320, y, 1.57, col(i), 1);
                    }
                    cent(190, 165);
                    cent(450, 165);
                    dna = 'DNA: 4C';
                }
                if (s == 3) {
                    cell(320, 165, 215, 115);
                    for (let i = 0; i < N; i++) {
                        const y = rowY(i, N, 22);
                        fiber([150, 165], [250, y]);
                        fiber([490, 165], [390, y]);
                        ch(250, y, 0, col(i), 0);
                        ch(390, y, 0, col(i), 0);
                    }
                    cent(150, 165);
                    cent(490, 165);
                    dna = 'DNA: 4C → 2C لكل قطب';
                }
                if (s == 4) {
                    cell(215, 165, 100, 110);
                    cell(425, 165, 100, 110);
                    cx.strokeStyle = '#fde68a';
                    cx.setLineDash([4, 4]);
                    cx.beginPath();
                    cx.moveTo(320, 70);
                    cx.lineTo(320, 260);
                    cx.stroke();
                    cx.setLineDash([]);
                    for (let i = 0; i < N; i++) {
                        const y = rowY(i, N, 17);
                        ch(200 + hs(i) * 30, y, 0, col(i), 0, 9);
                        ch(410 + hs(i + 2) * 30, y, 0, col(i), 0, 9);
                    }
                    dna = 'DNA: 2C لكل نواة';
                }
                if (s == 5) {
                    cell(210, 165, 85, 100);
                    cell(430, 165, 85, 100);
                    cx.strokeStyle = '#c4b5fd';
                    cx.lineWidth = 2;
                    [[210], [430]].forEach(p => { cx.beginPath(); cx.arc(p[0], 165, 46, 0, 7); cx.stroke(); });
                    for (let i = 0; i < N; i++) {
                        const y = rowY(i, N, 17);
                        ch(195 + hs(i) * 28, y, 0, col(i), 0, 9);
                        ch(415 + hs(i + 2) * 28, y, 0, col(i), 0, 9);
                    }
                    dna = 'خليتان بنتان، كل منهما 2n = ' + N;
                }
                lab = ['الطور البيني: تضاعف DNA', 'الطور التمهيدي: تكثّف الصبغيات واختفاء الغلاف النووي', 'الطور الاستوائي: اصطفاف الصبغيات على خط الاستواء', 'الطور الانفصالي: انفصال الكروماتيدات الشقيقة نحو القطبين', 'الطور النهائي وانقسام السيتوبلازم', 'خليتان بنتان متطابقتان وراثيًا'][s];
            }
            else {
                const pair = (x, y, i, cross) => { ch(x - 8, y, 0, '#f87171', 1, 12); ch(x + 8, y, 0, '#60a5fa', 1, 12); if (cross) {
                    cx.strokeStyle = '#fde68a';
                    cx.lineWidth = 2;
                    cx.beginPath();
                    cx.moveTo(x - 8, y - 2);
                    cx.lineTo(x + 8, y + 2);
                    cx.stroke();
                } };
                if (s == 0) {
                    cell(320, 165, 170, 120);
                    cx.setLineDash([5, 5]);
                    cx.strokeStyle = '#c4b5fd';
                    cx.beginPath();
                    cx.arc(320, 165, 64, 0, 7);
                    cx.stroke();
                    cx.setLineDash([]);
                    for (let i = 0; i < n; i++)
                        pair(285 + hs(i) * 70, 125 + hs(i + 4) * 80, i, 1);
                    h.T('العبور (تبادل أجزاء بين الكروماتيدات)', 320, 262, '#fde68a', 11);
                    dna = '4C: أزواج متماثلة متقاربة';
                }
                if (s == 1) {
                    cell(320, 165, 170, 120);
                    for (let i = 0; i < n; i++) {
                        const y = rowY(i, n, 34);
                        fiber([190, 165], [312, y]);
                        fiber([450, 165], [328, y]);
                        pair(320, y, i, 0);
                    }
                    cent(190, 165);
                    cent(450, 165);
                    dna = '4C';
                }
                if (s == 2) {
                    cell(320, 165, 215, 115);
                    for (let i = 0; i < n; i++) {
                        const y = rowY(i, n, 34);
                        fiber([150, 165], [250, y]);
                        fiber([490, 165], [390, y]);
                        ch(250, y, 0, '#f87171', 1, 12);
                        ch(390, y, 0, '#60a5fa', 1, 12);
                    }
                    cent(150, 165);
                    cent(490, 165);
                    dna = 'انفصال الصبغيات المتماثلة (لا الكروماتيدات)';
                }
                if (s == 3) {
                    cell(215, 165, 100, 110);
                    cell(425, 165, 100, 110);
                    for (let i = 0; i < n; i++) {
                        const y = rowY(i, n, 34);
                        ch(215, y, 0, '#f87171', 1, 12);
                        ch(425, y, 0, '#60a5fa', 1, 12);
                    }
                    dna = 'خليتان أحاديتا المجموعة n، كل صبغي مضاعف (2C)';
                }
                if (s == 4) {
                    cell(215, 165, 100, 110);
                    cell(425, 165, 100, 110);
                    for (let i = 0; i < n; i++) {
                        const x = 215, y = rowY(i, n, 34);
                        ch(x - 0, y - 18, 0, '#f87171', 0, 9);
                        ch(x, y + 18, 0, '#f87171', 0, 9);
                        ch(425, y - 18, 0, '#60a5fa', 0, 9);
                        ch(425, y + 18, 0, '#60a5fa', 0, 9);
                    }
                    dna = 'انفصال الكروماتيدات الشقيقة في كل خلية';
                }
                if (s == 5) {
                    [[150, 95], [490, 95], [150, 235], [490, 235]].forEach((p, j) => { cell(p[0], p[1], 72, 62); for (let i = 0; i < n; i++)
                        ch(p[0] - 14 + i * 10, p[1], 0, j % 2 ? '#60a5fa' : '#f87171', 0, 10); });
                    dna = '4 خلايا أحادية n، لكل منها تركيب وراثي مختلف';
                }
                lab = ['الطور التمهيدي I: تزاوج الصبغيات المتماثلة والعبور', 'الطور الاستوائي I: الأزواج على خط الاستواء', 'الطور الانفصالي I: انفصال الصبغيات المتماثلة', 'الطور النهائي I: خليتان n', 'الطور الانفصالي II: انفصال الكروماتيدات', '4 خلايا أحادية n'][s];
            }
            h.T(lab, W - 14, 24, '#bff3ff', 13, 'right');
            h.T(`${mei ? 'الانقسام المنصّف' : 'الانقسام المتساوي'} · 2n = ${N} · ${dna}`, 320, H - 10, '#fde68a', 12);
            h.T('● أحمر: صبغي من الأم · ● أزرق: صبغي من الأب · ▪ سنترومير', 320, H - 28, '#94a3b8', 10);
            return mei ? 'الانقسام المنصّف يختزل عدد الصبغيات إلى النصف (2n → n) عبر انقسامين متتاليين، وينتج 4 خلايا مختلفة وراثيًا بفضل العبور والتوزيع العشوائي للصبغيات المتماثلة؛ وهو أساس تكوين الأمشاج. ' + lab + '.' : 'الانقسام المتساوي ينتج خليتين بنتين متطابقتين لهما العدد نفسه من الصبغيات (2n)، ويُستخدم في النمو وتعويض الخلايا التالفة. المراحل: بيني ← تمهيدي ← استوائي ← انفصالي ← نهائي. المرحلة الآن: ' + lab + '.';
        } },
    orgn: { c: [R('t', 'الخلية (0 حيوانية،1 نباتية)', 0, 1, 1, 0), R('o', 'العضي (0–8)', 0, 8, 1, 0)],
        f(v) {
            const D = [['النواة', 'تحتوي DNA وتتحكم بأنشطة الخلية', 320, 150, 40, '#a78bfa', 3], ['الميتوكوندريا', 'إنتاج الطاقة (ATP) بالتنفس الخلوي', 450, 110, 22, '#fb923c', 3], ['الشبكة الإندوبلازمية', 'تصنيع ونقل البروتينات والدهون', 250, 205, 26, '#38bdf8', 3], ['جهاز جولجي', 'تعديل وتعبئة وإفراز المواد', 400, 215, 22, '#f472b6', 3], ['الريبوسومات', 'بناء البروتينات', 200, 130, 10, '#facc15', 3], ['الليسوسوم', 'هضم النفايات داخل الخلية (حيوانية فقط)', 480, 200, 14, '#ef4444', 0], ['البلاستيدات الخضراء', 'البناء الضوئي (نباتية فقط)', 430, 185, 24, '#16a34a', 1], ['الفجوة العصارية', 'تخزين الماء والمواد (نباتية كبيرة)', 210, 160, 55, '#38bdf866', 1], ['الجدار الخلوي', 'دعم وحماية الخلية (نباتية فقط)', 320, 160, 0, '#16a34a', 1]];
            cx.strokeStyle = v.t ? '#16a34a' : '#f9a8d4';
            cx.lineWidth = v.t ? 8 : 4;
            cx.fillStyle = '#fde68a22';
            if (v.t) {
                cx.fillRect(70, 40, 500, 240);
                cx.strokeRect(70, 40, 500, 240);
            }
            else {
                cx.beginPath();
                cx.ellipse(320, 160, 250, 130, 0, 0, 7);
                cx.fill();
                cx.stroke();
            }
            cx.lineWidth = 1;
            D.forEach((d, i) => { if (d[6] == 0 && v.t || d[6] == 1 && !v.t || d[4] == 0)
                return; dot(d[2], d[3], d[4], d[5]); if (v.o == i) {
                cx.strokeStyle = '#fff';
                cx.lineWidth = 3;
                cx.beginPath();
                cx.arc(d[2], d[3], d[4] + 6, 0, 7);
                cx.stroke();
                cx.lineWidth = 1;
            } });
            const d = D[v.o], ok = !(d[6] == 0 && v.t || d[6] == 1 && !v.t);
            return `${d[0]}: ${d[1]}${ok ? '' : ' — غير موجود في هذا النوع من الخلايا'}`;
        } },
    nat: { c: [R('e', 'سواد البيئة (%)', 0, 100, 5, 80), R('p', 'شدة الافتراس (%)', 0, 100, 5, 60), R('i', 'الفراشات الداكنة الأولية (%)', 1, 50, 1, 10), R('g', 'الجيل', 0, 30, 1, 0)],
        f(v) {
            const F = [], s = v.p / 100 * .6;
            let q = v.i / 100;
            for (let g = 0; g <= 30; g++) {
                F.push(q);
                const wd = 1 - s * (1 - v.e / 100), wl = 1 - s * v.e / 100;
                q = q * wd / (q * wd + (1 - q) * wl);
            }
            cx.fillStyle = 'rgb(' + Math.round(230 - v.e * 1.8) + ',' + Math.round(220 - v.e * 1.8) + ',' + Math.round(200 - v.e * 1.7) + ')';
            cx.fillRect(30, 30, 270, 260);
            for (let i = 0; i < 40; i++)
                dot(55 + (i % 8) * 32, 60 + Math.floor(i / 8) * 45, 10, i / 40 < F[v.g] ? '#1e293b' : '#f1f5f9');
            cx.strokeStyle = '#38bdf8';
            cx.beginPath();
            F.forEach((q, i) => { const X = 340 + i * 9, Y = 290 - q * 250; i ? cx.lineTo(X, Y) : cx.moveTo(X, Y); });
            cx.stroke();
            dot(340 + v.g * 9, 290 - F[v.g] * 250, 6, '#f472b6');
            return `الجيل ${v.g}: الداكنة ${(F[v.g] * 100).toFixed(0)}٪ — تباين + وراثة + بقاء الأصلح → تكيّف النوع`;
        } },
    fiss: { c: [R('T', 'الحرارة (°س)', 5, 45, 1, 37), R('n', 'المغذيات (%)', 10, 100, 5, 80), R('t', 'الزمن (دقيقة)', 0, 240, 10, 60), R('N', 'العدد الأولي', 1, 10, 1, 1)],
        f(v, t) {
            const fr = Math.exp(-Math.pow((v.T - 37) / 9, 2)) * v.n / 100, tau = fr < .05 ? 1e9 : 20 / fr, gn = v.t / tau, N = v.N * Math.pow(2, gn), k = (t % 4) / 4, L = 60 + Math.min(k, .4) / .4 * 50, gap = k > .7 ? (k - .7) / .3 * 30 : 0;
            cx.fillStyle = '#84cc16';
            [[-1], [1]].forEach(q => { const x = 320 + (k > .7 ? q[0] * (L / 4 + gap / 2) : 0); if (k > .7 || q[0] < 0) {
                cx.beginPath();
                cx.roundRect(x - (k > .7 ? L / 4 : L / 2), 130, k > .7 ? L / 2 : L, 60, 28);
                cx.fill();
            } });
            if (k > .4 && k <= .7) {
                cx.fillStyle = '#365314';
                cx.fillRect(316, 130, 8, 60);
            }
            dot(320 - (k > .1 ? L / 4 : 0), 160, 8, '#fff');
            if (k > .1)
                dot(320 + L / 4, 160, 8, '#fff');
            return `زمن الجيل ≈ ${tau > 1e8 ? 'لا نمو' : tau.toFixed(0) + ' دقيقة'} · عدد الأجيال n = ${gn.toFixed(1)} · N = N₀×2ⁿ = ${N < 1e6 ? N.toFixed(0) : N.toExponential(2)}`;
        } }
});
Object.assign(S, { digest: { c: [R('p', 'موضع الغذاء في الجهاز (%)', 0, 100, 1, 0), R('a', 'زاوية التدوير (°)', 0, 360, 5, 20), R('z', 'التكبير', .7, 1.5, .1, 1.1), R('r', 'دوران تلقائي (0 إيقاف، 1 تشغيل)', 0, 1, 1, 1), R('l', 'أسماء الأعضاء (0 إخفاء، 1 إظهار)', 0, 1, 1, 1)],
        f(v, t) {
            cx.shadowBlur = 0;
            const G = [[15, 'الفم', 'أميليز اللعاب يبدأ هضم النشا'], [35, 'المريء', 'حركة تمعجية تدفع الغذاء نحو المعدة'], [55, 'المعدة', 'حمض HCl (pH≈2) وإنزيم الببسين يهضم البروتين'], [85, 'الأمعاء الدقيقة', 'عصارة الصفراء والبنكرياس ثم امتصاص الغذاء الذائب'], [101, 'الأمعاء الغليظة', 'امتصاص الماء وتكوين الفضلات']], W = [[0, 15, 13, '#f9a8d4', [[0, -150, 0], [0, -143, 5]]], [15, 35, 6, '#fdba74', [[0, -143, 0], [0, -112, 0], [0, -80, 0]]], [35, 55, 17, '#fb923c', [[-5, -80, 2], [-18, -65, 8], [-20, -45, 10], [-5, -30, 10], [18, -28, 8], [32, -34, 5]]], [55, 85, 7, '#f9a8a8', [[32, -34, 5], [-30, -20, 12], [30, -8, -10], [-30, 6, 12], [30, 20, -10], [-30, 32, 12], [-28, 46, 4]]], [85, 100, 10, '#a8a29e', [[-46, 50, 0], [-48, 15, 0], [-46, -8, 0], [0, -6, -6], [46, -8, 0], [48, 20, 0], [44, 50, 0], [20, 62, 0], [0, 72, 0]]]], cur = G.findIndex(g => v.p < g[0]), a = (v.a + (v.r ? t * 18 : 0)) * Math.PI / 180, co = Math.cos(a), si = Math.sin(a), L = [], add = (x, y, z, r, c, s, rx, ry, rot) => L.push({ x, y, z, r, c, s, rx, ry, rot });
            W.forEach((w, i) => { const P = w[4]; for (let j = 0; j < P.length - 1; j++) {
                const A = P[j], B = P[j + 1], d = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]), n = Math.max(1, Math.ceil(d / (w[2] * .6)));
                for (let k = 0; k < n; k++) {
                    const u = k / n;
                    add(A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u, w[2], w[3], i);
                }
            } });
            add(0, -146, 9, 6, '#ef4444', 0);
            add(-32, -48, 10, 0, '#92400e', 9, 40, 20, 0);
            add(14, -20, -14, 0, '#fde047', 9, 34, 9, -.15);
            const fp = W.find(w => v.p <= w[1]) || W[4], ix = (v.p - fp[0]) / (fp[1] - fp[0]) * (fp[4].length - 1), i0 = Math.min(Math.floor(ix), fp[4].length - 2), u = ix - i0, A = fp[4][i0], B = fp[4][i0 + 1];
            add(A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u + 14, 9, '#fbbf24', -1);
            L.forEach(o => { o.X = o.x * co + o.z * si; o.Z = -o.x * si + o.z * co; });
            L.sort((p, q) => q.Z - p.Z);
            cx.save();
            cx.translate(320, 190);
            cx.scale(v.z, v.z);
            L.forEach(o => { const sc = 1 + o.Z / 600, x = o.X, y = o.y, d = Math.max(0, Math.min(1, (o.Z + 150) / 300)), sh = () => { cx.beginPath(); o.rx ? cx.ellipse(x, y, o.rx * sc, o.ry * sc, o.rot, 0, 7) : cx.arc(x, y, o.r * sc, 0, 7); }; cx.fillStyle = o.c; if (o.s == -1) {
                cx.shadowColor = '#fbbf24';
                cx.shadowBlur = 20;
            } sh(); cx.fill(); cx.shadowBlur = 0; cx.fillStyle = '#ffffff40'; cx.beginPath(); cx.arc(x - (o.rx || o.r) * .3 * sc, y - (o.ry || o.r) * .3 * sc, (o.ry || o.r) * .4 * sc, 0, 7); cx.fill(); cx.fillStyle = `rgba(0,0,0,${(1 - d) * .4})`; sh(); cx.fill(); if (o.s == cur) {
                cx.fillStyle = '#ffffff26';
                sh();
                cx.fill();
            } });
            cx.restore();
            const LB = [['الفم', 0, -150, 0, 0, 0], ['المريء', 0, -112, 0, 1, 1], ['الكبد', -32, -48, 10, 0, 9], ['المعدة', -8, -45, 10, 1, 2], ['البنكرياس', 14, -20, -14, 1, 9], ['الأمعاء الغليظة', -48, 10, 0, 0, 4], ['الأمعاء الدقيقة', 20, 20, -10, 1, 3]];
            if (v.l)
                LB.forEach(b => { const X = b[1] * co + b[3] * si, Z = -b[1] * si + b[3] * co, sc = 1 + Z / 600, px = 320 + X * sc * v.z, py = 190 + b[2] * sc * v.z, x2 = b[4] ? 600 : 40; cx.strokeStyle = b[5] == cur ? '#fbbf24' : '#ffffff88'; cx.beginPath(); cx.moveTo(px, py); cx.lineTo(x2, py); cx.stroke(); cx.fillStyle = b[5] == cur ? '#fbbf24' : '#e2e8f0'; cx.font = '700 14px Cairo'; cx.textAlign = b[4] ? 'right' : 'left'; cx.fillText(b[0], x2, py - 4); });
            cx.textAlign = 'start';
            return `${G[cur][1]}: ${G[cur][2]} — مجسّم 3D دوّار، حرّك موضع الغذاء لتتبّع رحلته`;
        } } });
Object.assign(S, { digest: { c: [R('p', 'تقدّم رحلة الطعام (%)', 0, 100, 1, 30), R('m', 'حجم الوجبة (غرام)', 100, 900, 50, 450), R('f', 'نوع الوجبة (0 متوازنة، 1 عالية البروتين، 2 عالية الدهون)', 0, 2, 1, 0)],
        f(v, t) {
            const p = v.p, meal = v.m, kind = v.f;
            const stages = [
                { a: 0, b: 5, name: 'الفم والبلع', time: 'ثوانٍ إلى دقائق', desc: 'المضغ يفتّت الطعام، واللعاب يرطّبه ويبدأ إنزيم الأميلاز هضم النشا.', organ: 0 },
                { a: 5, b: 10, name: 'المريء', time: 'نحو 8–10 ثوانٍ للبلعة غالبًا', desc: 'انقباضات عضلية متتابعة (الحركة الدودية) تدفع البلعة نحو المعدة؛ الجاذبية ليست العامل الوحيد.', organ: 1 },
                { a: 10, b: 35, name: 'المعدة', time: kind === 2 ? 'قد تطول 4–6 ساعات أو أكثر مع الوجبات الدسمة' : 'نحو 2–4 ساعات غالبًا، ويتغيّر ذلك بحسب تركيب الوجبة', desc: 'تخلط المعدة الطعام بالعصارة الحمضية؛ يساعد الحمض والبيبسين في هضم البروتينات، ويخرج الكيموس تدريجيًا عبر البواب.', organ: 2 },
                { a: 35, b: 80, name: 'الأمعاء الدقيقة', time: 'نحو 3–6 ساعات تقريبًا', desc: 'تُكمل إنزيمات البنكرياس والأمعاء الهضم. تساعد الصفراء على استحلاب الدهون، وتمتص الزغابات معظم المغذيات إلى الدم أو اللمف.', organ: 3 },
                { a: 80, b: 100, name: 'الأمعاء الغليظة والمستقيم', time: 'قد يستغرق العبور ساعات طويلة إلى أيام', desc: 'تمتص الأمعاء الغليظة الماء والأملاح، وتساهم الميكروبات المعوية في معالجة بعض البقايا، ثم تتكوّن البرازات وتُخزّن في المستقيم قبل الإخراج.', organ: 4 }
            ];
            let st = stages.find(x => p >= x.a && p < x.b) || stages[4];
            const rr = (x, y, w, h, r) => { cx.beginPath(); cx.roundRect(x, y, w, h, r); };
            const glow = (x, y, r, color, alpha) => { let g = cx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, color.replace('ALPHA', alpha)); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill(); };
            // A dedicated anatomical viewing field, independent of the decorative laboratory backdrop.
            const bg = cx.createLinearGradient(0, 0, 640, 320);
            bg.addColorStop(0, 'rgba(5,17,31,.98)');
            bg.addColorStop(1, 'rgba(12,35,51,.98)');
            cx.fillStyle = bg;
            cx.fillRect(0, 0, 640, 320);
            for (let x = 0; x < 640; x += 32) {
                cx.strokeStyle = 'rgba(125,190,220,.055)';
                cx.beginPath();
                cx.moveTo(x, 0);
                cx.lineTo(x, 320);
                cx.stroke();
            }
            // Body silhouette and neck.
            let skin = cx.createLinearGradient(190, 0, 445, 0);
            skin.addColorStop(0, 'rgba(151,178,190,.08)');
            skin.addColorStop(.5, 'rgba(207,222,225,.19)');
            skin.addColorStop(1, 'rgba(122,159,175,.08)');
            cx.fillStyle = skin;
            cx.strokeStyle = 'rgba(185,216,225,.35)';
            cx.lineWidth = 1.5;
            cx.beginPath();
            cx.moveTo(285, 32);
            cx.quadraticCurveTo(260, 35, 250, 54);
            cx.lineTo(211, 70);
            cx.quadraticCurveTo(193, 80, 204, 113);
            cx.lineTo(226, 151);
            cx.lineTo(231, 221);
            cx.quadraticCurveTo(235, 265, 253, 300);
            cx.lineTo(391, 300);
            cx.quadraticCurveTo(409, 265, 413, 221);
            cx.lineTo(417, 151);
            cx.lineTo(439, 113);
            cx.quadraticCurveTo(450, 80, 432, 70);
            cx.lineTo(393, 54);
            cx.quadraticCurveTo(382, 35, 357, 32);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = 'rgba(190,210,218,.14)';
            cx.fillRect(303, 20, 36, 32);
            cx.strokeStyle = 'rgba(200,225,235,.24)';
            cx.strokeRect(303, 20, 36, 32);
            // Oral cavity, pharynx and oesophagus.
            glow(322, 51, 35, 'rgba(255,80,115,ALPHA)', st.organ === 0 ? '.22' : '.04');
            cx.fillStyle = '#8b3049';
            cx.beginPath();
            cx.ellipse(321, 47, 12, 4, 0, 0, Math.PI * 2);
            cx.fill();
            cx.strokeStyle = '#713c53';
            cx.lineWidth = 17;
            cx.lineCap = 'round';
            cx.beginPath();
            cx.moveTo(321, 51);
            cx.bezierCurveTo(315, 62, 328, 69, 321, 81);
            cx.bezierCurveTo(314, 92, 325, 100, 323, 113);
            cx.stroke();
            cx.strokeStyle = '#e5a3a8';
            cx.lineWidth = 5;
            cx.beginPath();
            cx.moveTo(321, 51);
            cx.bezierCurveTo(315, 62, 328, 69, 321, 81);
            cx.bezierCurveTo(314, 92, 325, 100, 323, 113);
            cx.stroke();
            // Liver and gallbladder.
            glow(272, 133, 70, 'rgba(225,91,75,ALPHA)', st.organ === 2 ? '.25' : '.08');
            let liver = cx.createLinearGradient(230, 108, 310, 158);
            liver.addColorStop(0, '#b64e4d');
            liver.addColorStop(.5, '#8e3540');
            liver.addColorStop(1, '#5f2839');
            cx.fillStyle = liver;
            cx.strokeStyle = '#df8a82';
            cx.lineWidth = 1.4;
            cx.beginPath();
            cx.moveTo(231, 121);
            cx.quadraticCurveTo(249, 103, 278, 112);
            cx.quadraticCurveTo(307, 113, 315, 128);
            cx.quadraticCurveTo(304, 149, 278, 155);
            cx.quadraticCurveTo(252, 158, 235, 145);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = '#4c9b72';
            cx.beginPath();
            cx.ellipse(293, 151, 5, 10, .25, 0, Math.PI * 2);
            cx.fill();
            // Stomach with rugae.
            glow(347, 143, 65, 'rgba(244,126,85,ALPHA)', st.organ === 2 ? '.28' : '.08');
            let stomach = cx.createLinearGradient(322, 111, 382, 177);
            stomach.addColorStop(0, '#f2a07d');
            stomach.addColorStop(.48, '#c65c62');
            stomach.addColorStop(1, '#7e304c');
            cx.fillStyle = stomach;
            cx.strokeStyle = '#f5b7a1';
            cx.lineWidth = 1.5;
            cx.beginPath();
            cx.moveTo(323, 111);
            cx.bezierCurveTo(337, 108, 345, 117, 349, 128);
            cx.bezierCurveTo(355, 137, 375, 127, 382, 142);
            cx.bezierCurveTo(392, 163, 371, 181, 349, 178);
            cx.bezierCurveTo(330, 176, 319, 159, 326, 145);
            cx.bezierCurveTo(333, 132, 317, 122, 323, 111);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.save();
            cx.beginPath();
            cx.ellipse(353, 149, 25, 22, -.25, 0, Math.PI * 2);
            cx.clip();
            cx.strokeStyle = 'rgba(255,210,190,.52)';
            cx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                cx.beginPath();
                cx.moveTo(333, 133 + i * 7);
                cx.bezierCurveTo(345, 127 + i * 7, 358, 145 + i * 5, 374, 136 + i * 7);
                cx.stroke();
            }
            cx.restore();
            // Pancreas and duodenum.
            cx.strokeStyle = '#e7bd7b';
            cx.lineWidth = 9;
            cx.lineCap = 'round';
            cx.beginPath();
            cx.moveTo(300, 171);
            cx.bezierCurveTo(315, 164, 328, 170, 340, 169);
            cx.stroke();
            cx.strokeStyle = '#d99c69';
            cx.lineWidth = 3;
            cx.beginPath();
            cx.moveTo(300, 171);
            cx.bezierCurveTo(315, 164, 328, 170, 340, 169);
            cx.stroke();
            cx.strokeStyle = '#d98e63';
            cx.lineWidth = 12;
            cx.beginPath();
            cx.moveTo(376, 158);
            cx.bezierCurveTo(402, 158, 398, 184, 378, 184);
            cx.bezierCurveTo(362, 184, 362, 170, 370, 167);
            cx.stroke();
            // Large intestine: broad haustrated colon around the small bowel.
            glow(322, 229, 92, 'rgba(90,191,160,ALPHA)', st.organ === 4 ? '.24' : '.05');
            cx.strokeStyle = '#a56d51';
            cx.lineWidth = 21;
            cx.lineCap = 'round';
            cx.lineJoin = 'round';
            cx.beginPath();
            cx.moveTo(267, 202);
            cx.bezierCurveTo(250, 198, 247, 213, 249, 235);
            cx.lineTo(249, 253);
            cx.quadraticCurveTo(251, 269, 269, 269);
            cx.lineTo(365, 269);
            cx.quadraticCurveTo(386, 267, 386, 249);
            cx.lineTo(386, 214);
            cx.quadraticCurveTo(384, 199, 369, 202);
            cx.stroke();
            cx.strokeStyle = '#e3ae82';
            cx.lineWidth = 13;
            cx.beginPath();
            cx.moveTo(267, 202);
            cx.bezierCurveTo(250, 198, 247, 213, 249, 235);
            cx.lineTo(249, 253);
            cx.quadraticCurveTo(251, 269, 269, 269);
            cx.lineTo(365, 269);
            cx.quadraticCurveTo(386, 267, 386, 249);
            cx.lineTo(386, 214);
            cx.quadraticCurveTo(384, 199, 369, 202);
            cx.stroke();
            for (let y = 218; y < 260; y += 11) {
                cx.strokeStyle = 'rgba(111,59,51,.72)';
                cx.lineWidth = 2;
                cx.beginPath();
                cx.moveTo(243, y);
                cx.lineTo(258, y + 2);
                cx.moveTo(379, y);
                cx.lineTo(393, y + 2);
                cx.stroke();
            }
            for (let x = 275; x < 362; x += 15) {
                cx.beginPath();
                cx.moveTo(x, 262);
                cx.lineTo(x + 1, 276);
                cx.stroke();
            }
            // Small intestine: many individual loops, not a generic coil icon.
            glow(319, 226, 68, 'rgba(245,173,83,ALPHA)', st.organ === 3 ? '.32' : '.07');
            cx.lineCap = 'round';
            cx.lineJoin = 'round';
            cx.strokeStyle = '#7f394a';
            cx.lineWidth = 13;
            const loops = [[[270, 208], [286, 198], [309, 208], [292, 220], [270, 211]], [[305, 211], [327, 199], [350, 210], [331, 223], [305, 211]], [[270, 225], [291, 214], [313, 228], [293, 240], [270, 225]], [[309, 230], [330, 216], [352, 231], [332, 244], [309, 230]], [[272, 244], [291, 234], [311, 246], [292, 258], [272, 244]], [[311, 249], [331, 236], [352, 250], [334, 260], [311, 249]]];
            loops.forEach((l, i) => { cx.beginPath(); cx.moveTo(...l[0]); for (let j = 1; j < l.length; j++)
                cx.quadraticCurveTo(l[j][0] - 4, l[j][1] - 5, l[j][0], l[j][1]); cx.stroke(); });
            cx.strokeStyle = '#efb18b';
            cx.lineWidth = 7;
            loops.forEach(l => { cx.beginPath(); cx.moveTo(...l[0]); for (let j = 1; j < l.length; j++)
                cx.quadraticCurveTo(l[j][0] - 4, l[j][1] - 5, l[j][0], l[j][1]); cx.stroke(); });
            // Rectum.
            cx.strokeStyle = '#a56d51';
            cx.lineWidth = 13;
            cx.beginPath();
            cx.moveTo(320, 268);
            cx.bezierCurveTo(319, 280, 323, 286, 320, 296);
            cx.stroke();
            cx.strokeStyle = '#e3ae82';
            cx.lineWidth = 7;
            cx.stroke();
            // Labels and leader lines.
            const label = (txt, x, y, tx, ty, color) => { cx.strokeStyle = color; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x, y - 4); cx.lineTo(tx, ty); cx.stroke(); cx.fillStyle = color; cx.beginPath(); cx.arc(tx, ty, 2.5, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#eaf4fa'; cx.font = '11px Cairo'; cx.textAlign = 'left'; cx.fillText(txt, x, y); };
            label('المريء', 28, 72, 315, 78, '#e7a5b0');
            label('الكبد', 28, 132, 254, 130, '#d67b76');
            label('المعدة', 430, 130, 369, 146, '#f1a58d');
            label('الأمعاء الدقيقة', 430, 220, 346, 232, '#f6bd72');
            label('الأمعاء الغليظة', 430, 263, 384, 250, '#d8a17c');
            // Food bolus travels through a route that follows the anatomy.
            const paths = [[[321, 48], [321, 60], [321, 72], [323, 85], [323, 100], [323, 113]], [[323, 113], [327, 125], [339, 134], [351, 145], [363, 155], [365, 166]], [[365, 166], [354, 177], [335, 183], [313, 192], [293, 204], [278, 212]], [[278, 212], [293, 220], [314, 224], [333, 230], [347, 240], [334, 250]], [[334, 250], [324, 260], [320, 270], [320, 281], [320, 295]]];
            const routeEnds = [5, 10, 35, 80, 100];
            let idx = routeEnds.findIndex(e => p < e);
            if (idx < 0)
                idx = 4;
            let prev = idx === 0 ? 0 : routeEnds[idx - 1], local = (p - prev) / (routeEnds[idx] - prev);
            local = Math.max(0, Math.min(1, local));
            const pp = paths[idx], seg = local * (pp.length - 1), si = Math.min(pp.length - 2, Math.floor(seg)), u = seg - si;
            const fx = pp[si][0] + (pp[si + 1][0] - pp[si][0]) * u, fy = pp[si][1] + (pp[si + 1][1] - pp[si][1]) * u;
            glow(fx, fy, 28, 'rgba(255,196,75,ALPHA)', '.55');
            cx.fillStyle = '#ffe7a3';
            cx.beginPath();
            cx.arc(fx, fy, 7 + Math.sin(t * 5) * 1.2, 0, Math.PI * 2);
            cx.fill();
            cx.strokeStyle = '#ff9d42';
            cx.lineWidth = 2;
            cx.stroke();
            for (let j = 1; j <= 3; j++) {
                const trail = Math.max(0, local - j * .035), ss = trail * (pp.length - 1), ii = Math.min(pp.length - 2, Math.floor(ss)), uu = ss - ii;
                cx.fillStyle = `rgba(255,175,72,${.42 - j * .1})`;
                cx.beginPath();
                cx.arc(pp[ii][0] + (pp[ii + 1][0] - pp[ii][0]) * uu, pp[ii][1] + (pp[ii + 1][1] - pp[ii][1]) * uu, 4 - j * .7, 0, Math.PI * 2);
                cx.fill();
            }
            // Header and progress rail.
            cx.fillStyle = '#dcebf3';
            cx.font = '700 14px Cairo';
            cx.textAlign = 'right';
            cx.fillText('رحلة الطعام داخل الجهاز الهضمي', 620, 22);
            cx.textAlign = 'left';
            cx.fillStyle = 'rgba(170,207,225,.2)';
            rr(20, 286, 170, 8, 4);
            cx.fill();
            cx.fillStyle = '#f5b44c';
            rr(20, 286, 170 * p / 100, 8, 4);
            cx.fill();
            cx.fillStyle = '#e6f2f7';
            cx.font = '11px Cairo';
            cx.fillText(`${p}%`, 20, 279);
            const fat = kind === 2, protein = kind === 1;
            const extra = meal > 600 ? 'الوجبة كبيرة؛ قد يطول إفراغ المعدة. ' : '';
            const result = `${st.name} — ${st.time}. ${st.desc} ${extra}${fat ? 'الوجبة عالية الدهون؛ وقد يتباطأ إفراغ المعدة. ' : protein ? 'تركيب الوجبة الغني بالبروتين قد يغيّر سرعة الإفراغ والشعور بالشبع. ' : ''}العبور الكلي عبر الجهاز الهضمي غالبًا نحو 24–72 ساعة، مع تفاوت كبير بين الأشخاص والوجبات. المؤشر يوضح مسارًا تعليميًا لا ساعة زمنية دقيقة.`;
            cx.textAlign = 'start';
            return result;
        } } });
Object.assign(S, {
    heart: { c: [R('a', 'شدة النشاط (0 راحة — 10 مجهود)', 0, 10, 1, 0)],
        f(v, t) {
            const activity = v.a, hr = Math.round(68 + 8.5 * activity), sv = Math.round(70 + 3.5 * activity), co = hr * sv / 1000, beat = Math.sin(t * hr / 60 * Math.PI * 2), squeeze = 1 + 0.035 * beat;
            const bg = cx.createLinearGradient(0, 0, 640, 320);
            bg.addColorStop(0, 'rgba(5,15,29,.99)');
            bg.addColorStop(1, 'rgba(14,33,49,.99)');
            cx.fillStyle = bg;
            cx.fillRect(0, 0, 640, 320);
            for (let x = 0; x < 640; x += 32) {
                cx.strokeStyle = 'rgba(110,177,208,.05)';
                cx.beginPath();
                cx.moveTo(x, 0);
                cx.lineTo(x, 320);
                cx.stroke();
            }
            for (let y = 0; y < 320; y += 32) {
                cx.strokeStyle = 'rgba(110,177,208,.05)';
                cx.beginPath();
                cx.moveTo(0, y);
                cx.lineTo(640, y);
                cx.stroke();
            }
            const grad = (x, y, r, c1, c2) => { let g = cx.createRadialGradient(x - r * .3, y - r * .3, 2, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; };
            const path = (pts, color, width) => { cx.beginPath(); cx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++)
                cx.lineTo(pts[i][0], pts[i][1]); cx.strokeStyle = color; cx.lineWidth = width; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.stroke(); };
            // Great vessels behind the myocardium.
            cx.save();
            cx.lineCap = 'round';
            cx.strokeStyle = '#752d42';
            cx.lineWidth = 28;
            cx.beginPath();
            cx.moveTo(329, 109);
            cx.bezierCurveTo(321, 79, 326, 53, 350, 45);
            cx.bezierCurveTo(379, 34, 403, 51, 401, 72);
            cx.lineTo(399, 111);
            cx.stroke();
            cx.strokeStyle = '#df7777';
            cx.lineWidth = 17;
            cx.beginPath();
            cx.moveTo(329, 109);
            cx.bezierCurveTo(321, 79, 326, 53, 350, 45);
            cx.bezierCurveTo(379, 34, 403, 51, 401, 72);
            cx.lineTo(399, 111);
            cx.stroke();
            cx.strokeStyle = '#174f82';
            cx.lineWidth = 24;
            cx.beginPath();
            cx.moveTo(254, 89);
            cx.bezierCurveTo(243, 61, 249, 42, 271, 39);
            cx.lineTo(286, 39);
            cx.lineTo(286, 111);
            cx.stroke();
            cx.strokeStyle = '#63b9e8';
            cx.lineWidth = 13;
            cx.stroke();
            cx.strokeStyle = '#174f82';
            cx.lineWidth = 20;
            cx.beginPath();
            cx.moveTo(274, 119);
            cx.bezierCurveTo(247, 106, 227, 94, 209, 80);
            cx.bezierCurveTo(199, 72, 188, 78, 190, 90);
            cx.stroke();
            cx.strokeStyle = '#55a9dc';
            cx.lineWidth = 10;
            cx.stroke();
            // Pulmonary veins entering left atrium (oxygenated blood).
            path([[365, 123], [402, 112], [426, 115]], '#a83c53', 15);
            path([[365, 137], [402, 143], [426, 146]], '#d65d68', 12);
            cx.restore();
            // Outer myocardium silhouette, with anatomical apex and broad base.
            cx.save();
            cx.translate(0, 4);
            cx.scale(1, squeeze);
            cx.shadowColor = 'rgba(235,55,82,.35)';
            cx.shadowBlur = 20;
            let myo = cx.createLinearGradient(210, 85, 385, 250);
            myo.addColorStop(0, '#f18b8b');
            myo.addColorStop(.24, '#bb3f58');
            myo.addColorStop(.58, '#84243f');
            myo.addColorStop(1, '#43172f');
            cx.fillStyle = myo;
            cx.strokeStyle = '#f19b9a';
            cx.lineWidth = 2;
            cx.beginPath();
            cx.moveTo(304, 105);
            cx.bezierCurveTo(282, 77, 245, 83, 228, 110);
            cx.bezierCurveTo(202, 151, 233, 197, 282, 238);
            cx.quadraticCurveTo(301, 256, 316, 270);
            cx.quadraticCurveTo(332, 250, 356, 224);
            cx.bezierCurveTo(394, 182, 410, 140, 386, 108);
            cx.bezierCurveTo(365, 80, 332, 83, 314, 107);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.shadowBlur = 0;
            // Right atrium and ventricle (deoxygenated side), viewer's left.
            cx.fillStyle = grad(260, 142, 53, '#66bce7', '#174b79');
            cx.strokeStyle = '#9cdcf3';
            cx.lineWidth = 1.4;
            cx.beginPath();
            cx.moveTo(246, 112);
            cx.bezierCurveTo(226, 119, 226, 145, 244, 161);
            cx.quadraticCurveTo(256, 174, 274, 163);
            cx.lineTo(293, 145);
            cx.quadraticCurveTo(279, 118, 246, 112);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = grad(270, 197, 67, '#4ba5d6', '#123d6a');
            cx.beginPath();
            cx.moveTo(246, 159);
            cx.bezierCurveTo(224, 181, 251, 219, 300, 256);
            cx.bezierCurveTo(307, 239, 311, 209, 304, 176);
            cx.quadraticCurveTo(282, 155, 246, 159);
            cx.closePath();
            cx.fill();
            cx.stroke();
            // Left atrium and thick-walled left ventricle (viewer right).
            cx.fillStyle = grad(352, 137, 53, '#f6a0a0', '#9e3049');
            cx.beginPath();
            cx.moveTo(323, 112);
            cx.bezierCurveTo(342, 95, 374, 102, 382, 124);
            cx.bezierCurveTo(389, 145, 368, 164, 344, 162);
            cx.quadraticCurveTo(329, 151, 323, 112);
            cx.closePath();
            cx.fill();
            cx.stroke();
            cx.fillStyle = grad(351, 195, 70, '#e66d78', '#651d3b');
            cx.beginPath();
            cx.moveTo(307, 164);
            cx.quadraticCurveTo(329, 148, 354, 159);
            cx.bezierCurveTo(388, 173, 371, 216, 317, 265);
            cx.bezierCurveTo(306, 236, 301, 194, 307, 164);
            cx.closePath();
            cx.fill();
            cx.stroke();
            // Septum separating the ventricles.
            path([[302, 155], [306, 190], [312, 230], [317, 258]], '#f5b0a4', 5);
            // Valve leaflets at atrioventricular and semilunar openings.
            path([[272, 158], [282, 170], [293, 158]], '#ffd0b8', 3);
            path([[333, 158], [343, 169], [354, 157]], '#ffd0b8', 3);
            path([[316, 111], [327, 122], [338, 111]], '#ffd0b8', 3);
            // Coronary arteries on the surface.
            path([[306, 112], [300, 137], [308, 158], [299, 183], [306, 210], [316, 233]], '#ffb4a4', 4);
            path([[307, 137], [285, 143], [270, 157]], '#ffb4a4', 3);
            path([[309, 160], [333, 173], [347, 194], [357, 212]], '#ffb4a4', 3);
            cx.restore();
            // Animated red/blue blood-flow particles follow the major circulation routes.
            const dots = (pts, color, count, phase) => { for (let i = 0; i < count; i++) {
                const z = (t * .22 + i / count + phase) % 1, seg = z * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(seg)), u = seg - j, x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, y = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u;
                cx.fillStyle = color;
                cx.shadowColor = color;
                cx.shadowBlur = 8;
                cx.beginPath();
                cx.arc(x, y, 2.5, 0, Math.PI * 2);
                cx.fill();
            } cx.shadowBlur = 0; };
            dots([[260, 77], [262, 107], [261, 138], [271, 171], [287, 204], [312, 250]], '#72d8ff', 9, 0);
            dots([[351, 239], [372, 202], [383, 163], [374, 130], [360, 92], [355, 48]], '#ff8b91', 9, .25);
            dots([[228, 80], [257, 96], [286, 110], [318, 109], [349, 94], [390, 72]], '#72d8ff', 7, .5);
            // Labels, with leader lines and contrast-safe text.
            const lab = (txt, x, y, tx, ty, col, align = 'left') => { cx.strokeStyle = col; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x, y - 4); cx.lineTo(tx, ty); cx.stroke(); cx.fillStyle = col; cx.beginPath(); cx.arc(tx, ty, 2.5, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#eaf4fa'; cx.font = '11px Cairo'; cx.textAlign = align; cx.fillText(txt, x, y); };
            cx.textAlign = 'right';
            cx.fillStyle = '#eaf4fa';
            cx.font = '700 14px Cairo';
            cx.fillText('القلب البشري — مقطع تعليمي لأربع حجرات', 620, 22);
            lab('الوريد الأجوف', 24, 60, 254, 63, '#6fc8f0');
            lab('الأذين الأيمن', 24, 125, 251, 137, '#6fc8f0');
            lab('البطين الأيمن', 24, 201, 269, 199, '#6fc8f0');
            lab('الأبهر', 424, 53, 384, 54, '#ff9d9f');
            lab('الأذين الأيسر', 433, 120, 359, 133, '#ff9d9f');
            lab('البطين الأيسر', 433, 203, 350, 203, '#ff9d9f');
            // ECG monitor top:educational;right:waveform,;bottom:not;left:a;inset:educational waveform, not a diagnostic trace.
            cx.fillStyle = 'rgba(2,10,20,.8)';
            cx.strokeStyle = 'rgba(118,195,220,.5)';
            cx.lineWidth = 1;
            cx.beginPath();
            cx.roundRect(435, 229, 184, 68, 8);
            cx.fill();
            cx.stroke();
            for (let x = 443; x < 615; x += 10) {
                cx.strokeStyle = 'rgba(100,190,210,.11)';
                cx.beginPath();
                cx.moveTo(x, 236);
                cx.lineTo(x, 290);
                cx.stroke();
            }
            for (let y = 237; y < 291; y += 10) {
                cx.beginPath();
                cx.moveTo(443, y);
                cx.lineTo(613, y);
                cx.stroke();
            }
            cx.strokeStyle = '#5af0b0';
            cx.lineWidth = 1.7;
            cx.beginPath();
            for (let x = 0; x <= 170; x++) {
                const phase = ((x + t * hr * 1.9) % 52) / 52;
                let yy = 263;
                if (phase < .18)
                    yy = 263 - 4 * Math.sin(phase / .18 * Math.PI);
                else if (phase < .35)
                    yy = 263;
                else if (phase < .43)
                    yy = 263 + 7 * (phase - .35) / .08;
                else if (phase < .48)
                    yy = 270 - 34 * (phase - .43) / .05;
                else if (phase < .54)
                    yy = 236 + 42 * (phase - .48) / .06;
                else if (phase < .61)
                    yy = 278 - 15 * (phase - .54) / .07;
                else if (phase < .78)
                    yy = 263 - 8 * Math.sin((phase - .61) / .17 * Math.PI);
                cx.lineTo(444 + x, yy);
            }
            cx.stroke();
            cx.fillStyle = '#9ae6c5';
            cx.font = '10px Cairo';
            cx.textAlign = 'left';
            cx.fillText('ECG تعليمي', 444, 244);
            // Compact live metrics on the left-bottom side.
            cx.fillStyle = 'rgba(4,16,27,.83)';
            cx.strokeStyle = 'rgba(130,195,220,.28)';
            cx.beginPath();
            cx.roundRect(18, 235, 190, 67, 8);
            cx.fill();
            cx.stroke();
            cx.textAlign = 'left';
            cx.fillStyle = '#b9d4e1';
            cx.font = '10px Cairo';
            cx.fillText('مؤشرات النموذج', 29, 250);
            cx.fillStyle = '#fff';
            cx.font = '700 13px Cairo';
            cx.fillText(`HR  ${hr} نبضة/د`, 29, 267);
            cx.fillText(`SV  ${sv} مل/ضربة`, 29, 282);
            cx.fillText(`CO  ${co.toFixed(2)} لتر/د`, 29, 297);
            const level = activity === 0 ? 'راحة' : activity < 4 ? 'نشاط خفيف' : activity < 7 ? 'نشاط متوسط' : 'مجهود مرتفع';
            return `الحالة: ${level}. معدل القلب النموذجي ${hr} نبضة/د، وحجم الضربة المفترض ${sv} مل، لذا النتاج القلبي = HR × SV ÷ 1000 = ${co.toFixed(2)} لتر/دقيقة. هذه معادلة صحيحة حسابيًا لكن قيم HR وSV هنا ناتجة عن نموذج مبسّط تعليمي، وليست توقعًا فرديًا أو قياسًا طبيًا. مسار الدم: الجسم → الأذين الأيمن → البطين الأيمن → الرئتان → الأذين الأيسر → البطين الأيسر → الأبهر والجسم.`;
        } },
    proj: { c: [R('a', 'زاوية الإطلاق (°)', 5, 85, 1, 45), R('v', 'السرعة (م/ث)', 5, 35, 1, 15), R('g', 'الجاذبية (م/ث²)', 1.6, 24, .1, 9.8), R('h', 'ارتفاع الإطلاق (م)', 0, 20, 1, 0)],
        f(v, t) {
            const a = v.a * Math.PI / 180, g = v.g, vy = v.v * Math.sin(a), vx = v.v * Math.cos(a), T = (vy + Math.sqrt(vy * vy + 2 * g * v.h)) / g, Rg = vx * T, hm = v.h + vy * vy / (2 * g), sc = Math.min(4, 560 / Math.max(Rg, 1), 215 / Math.max(hm, 1)), X = m => 40 + m * sc, Y = m => 290 - m * sc, st = [1, 2, 5, 10, 20, 50, 100, 200, 500].find(s => s * sc >= 45) || 500;
            cx.strokeStyle = '#ffffff22';
            cx.fillStyle = '#94a3b8';
            cx.font = '11px Cairo';
            for (let m = 0; m <= 600 / sc; m += st) {
                cx.beginPath();
                cx.moveTo(X(m), 60);
                cx.lineTo(X(m), 296);
                cx.stroke();
                cx.fillText(m + 'م', X(m) - 8, 309);
            }
            cx.fillStyle = '#14532d';
            cx.fillRect(0, 290, 640, 30);
            cx.fillStyle = '#78716c';
            cx.fillRect(18, Y(v.h), 24, v.h * sc + 2);
            cx.setLineDash([6, 5]);
            cx.strokeStyle = '#38bdf8';
            cx.lineWidth = 2.5;
            cx.beginPath();
            for (let s = 0; s <= T; s += T / 80) {
                const x = X(vx * s), y = Y(v.h + vy * s - .5 * g * s * s);
                s ? cx.lineTo(x, y) : cx.moveTo(x, y);
            }
            cx.stroke();
            cx.setLineDash([]);
            cx.lineWidth = 1;
            dot(X(Rg), 290, 6, '#f87171');
            T_(Rg.toFixed(1) + ' م', Math.max(10, X(Rg) - 20), 280, '#fca5a5');
            const tp = vy / g;
            cx.strokeStyle = '#fbbf2488';
            cx.setLineDash([3, 4]);
            cx.beginPath();
            cx.moveTo(X(vx * tp), Y(hm));
            cx.lineTo(X(vx * tp), 290);
            cx.stroke();
            cx.setLineDash([]);
            T_('أقصى ارتفاع ' + hm.toFixed(1) + ' م', X(vx * tp) + 6, Math.min(Y(hm) - 6, 262), '#fde68a');
            const s = t % (T + .8), q = Math.min(s, T);
            dot(X(vx * q), Y(v.h + vy * q - .5 * g * q * q), 8, '#fbbf24');
            return `المدى الأفقي = ${Rg.toFixed(1)} م · أقصى ارتفاع = ${hm.toFixed(1)} م · زمن التحليق = ${T.toFixed(2)} ث · المقياس ثابت فتتغيّر المسافة مع الزاوية والسرعة`;
        } }
});
const DEF = { digest: 'huge', anat: 'huge', heart: 'huge', proj: 'huge', div: 'huge', quake: 'big', layers: 'big', pred: 'big', orgn: 'big', neph: 'big', nat: 'big', imm: 'big', micro: 'big', ps: 'big', blood: 'big', elec: 'big', cathode: 'big', lever: 'big', incl: 'big', pend: 'big', fiss: 'big', mold: 'big', photot: 'big' }, SZ = ['mid', 'big', 'huge'];
function setSz(s) { $('rw').className = 'row ' + s; }
function szCycle() { const c = $('rw').className.split(' ')[1]; setSz(SZ[(SZ.indexOf(c) + 1) % 3]); tone(500, .05, 'triangle', .05); }
function fsT() { const e = $('lab'), pf = e.classList.contains('pfs'); if (pf) {
    e.classList.remove('pfs');
    document.body.style.overflow = '';
    return;
} if (document.fullscreenElement || document.webkitFullscreenElement) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    return;
} const rq = e.requestFullscreen || e.webkitRequestFullscreen; if (rq) {
    try {
        const r = rq.call(e);
        if (r && r.catch)
            r.catch(() => { e.classList.add('pfs'); document.body.style.overflow = 'hidden'; });
    }
    catch (_) {
        e.classList.add('pfs');
        document.body.style.overflow = 'hidden';
    }
}
else {
    e.classList.add('pfs');
    document.body.style.overflow = 'hidden';
} }
const o0 = open_;
open_ = function (i) { o0(i); setSz(DEF[E[i][3]] || 'mid'); };
Object.assign(S, { orgn: { c: [R('t', 'نوع الخلية (0 حيوانية، 1 نباتية)', 0, 1, 1, 0), R('o', 'العضي (0–13)', 0, 13, 1, 0), R('im', 'العرض (0 رسم تفاعلي،1 الصورة المرجعية)', 0, 1, 1, 1), R('l', 'أسماء العضيات (0 إخفاء، 1 إظهار)', 0, 1, 1, 1)],
        f(v, t) {
            const pl = v.t, N = ['نواة', 'نوية', 'ميتوكوندريا', 'شبكة خشنة', 'شبكة ملساء', 'جهاز جولجي', 'ريبوسومات', 'ليسوسوم', 'جسم مركزي', 'بلاستيدة خضراء', 'فجوة عصارية', 'جدار خلوي', 'غشاء بلازمي', 'سيتوبلازم'], D = [['النواة', 'تحتوي DNA وتتحكم بأنشطة الخلية، ويحيط بها غشاء نووي مزدوج'], ['النوية', 'تصنّع وحدات الريبوسومات'], ['الميتوكوندريا', 'التنفس الخلوي وإنتاج الطاقة ATP'], ['الشبكة الإندوبلازمية الخشنة', 'تحمل ريبوسومات وتصنّع البروتينات وتنقلها'], ['الشبكة الإندوبلازمية الملساء', 'تصنيع الدهون وتحييد السموم وتخزين الكالسيوم'], ['جهاز جولجي', 'تعديل البروتينات وتعبئتها وإفرازها'], ['الريبوسومات', 'بناء البروتينات'], ['الجسيمات الحالّة (ليسوسوم)', 'هضم النفايات والعضيات التالفة (خلية حيوانية)'], ['الجسم المركزي', 'ينظّم الخيوط المغزلية أثناء الانقسام (خلية حيوانية)'], ['البلاستيدات الخضراء', 'البناء الضوئي (خلية نباتية)'], ['الفجوة العصارية', 'تخزين الماء والأملاح وحفظ ضغط الامتلاء (خلية نباتية)'], ['الجدار الخلوي', 'دعم وحماية من السيللوز (خلية نباتية)'], ['الغشاء البلازمي', 'ينظّم دخول المواد وخروجها (نفاذية اختيارية)'], ['السيتوبلازم', 'وسط التفاعلات الحيوية وتعلّق العضيات']];
            const AA = { 0: [350, 148, 1, 130], 1: [322, 165, 1, 165], 2: [215, 95, 0, 70], 3: [235, 135, 0, 115], 4: [295, 238, 0, 250], 5: [458, 140, 1, 90], 6: [262, 126, 0, 155], 7: [400, 265, 1, 245], 8: [395, 145, 1, 50], 12: [523, 190, 1, 285], 13: [360, 215, 1, 205] }, PP = { 0: [440, 95, 1, 60], 1: [440, 92, 1, 90], 2: [390, 150, 1, 130], 3: [375, 52, 1, 30], 4: [300, 236, 0, 200], 5: [330, 262, 0, 270], 6: [470, 190, 1, 165], 9: [440, 225, 1, 205], 10: [240, 160, 0, 150], 11: [150, 31, 0, 40], 12: [125, 100, 0, 75], 13: [470, 262, 1, 245] };
            const mito = (x, y, r, s, c) => { cx.fillStyle = c; cx.beginPath(); cx.ellipse(x, y, 34 * s, 16 * s, r, 0, 7); cx.fill(); cx.strokeStyle = '#f9a8d4'; cx.lineWidth = 2; cx.stroke(); cx.save(); cx.translate(x, y); cx.rotate(r); cx.strokeStyle = '#fbcfe8'; cx.lineWidth = 1.5; cx.beginPath(); for (let i = -3; i <= 3; i++) {
                cx.moveTo(i * 8 * s, -10 * s);
                cx.lineTo(i * 8 * s + 3, -3 * s);
                cx.lineTo(i * 8 * s - 3, 3 * s);
                cx.lineTo(i * 8 * s, 10 * s);
            } cx.stroke(); cx.restore(); }, wav = (x, y, w, n, c, d) => { cx.strokeStyle = c; cx.lineWidth = 3; for (let k = 0; k < n; k++) {
                cx.beginPath();
                for (let i = 0; i <= w; i += 4) {
                    const yy = y + k * 9 + 3 * Math.sin(i / 6 + k);
                    i ? cx.lineTo(x + i, yy) : cx.moveTo(x + i, yy);
                }
                cx.stroke();
                if (d)
                    for (let i = 0; i <= w; i += 11)
                        dot(x + i, y + k * 9 + 3 * Math.sin(i / 6 + k) - 4, 1.8, '#111');
            } }, golgi = (x, y, s, c) => { cx.strokeStyle = c; cx.lineWidth = 4; for (let k = 0; k < 4; k++) {
                cx.beginPath();
                cx.arc(x, y + k * 10 * s, (30 - k * 3) * s, Math.PI * 1.1, Math.PI * 1.9);
                cx.stroke();
            } }, cen = (x, y, r) => { cx.save(); cx.translate(x, y); cx.rotate(r); cx.fillStyle = '#7c2d12'; cx.fillRect(-14, -6, 28, 12); cx.fillStyle = '#fdba74'; for (let i = -12; i <= 12; i += 6)
                cx.fillRect(i, -1, 2, 2); cx.restore(); }, ch = (x, y, r) => { cx.save(); cx.translate(x, y); cx.rotate(r); cx.fillStyle = '#15803d'; cx.beginPath(); cx.ellipse(0, 0, 30, 15, 0, 0, 7); cx.fill(); cx.strokeStyle = '#052e16'; cx.lineWidth = 2; cx.stroke(); cx.fillStyle = '#86efac'; for (let i = -18; i <= 18; i += 9)
                cx.fillRect(i - 2, -7, 4, 14); cx.restore(); };
            if (!pl) {
                const g = cx.createRadialGradient(320, 150, 20, 320, 165, 220);
                g.addColorStop(0, '#fbbf24');
                g.addColorStop(1, '#ea580c');
                cx.fillStyle = g;
                cx.beginPath();
                cx.ellipse(320, 165, 205, 135, -.08, 0, 7);
                cx.fill();
                cx.strokeStyle = '#9a3412';
                cx.lineWidth = 5;
                cx.stroke();
                for (let i = 0; i < 24; i++) {
                    const x = 150 + (i * 47) % 340, y = 60 + (i * 61) % 210;
                    if (Math.pow((x - 320) / 195, 2) + Math.pow((y - 165) / 125, 2) < 1)
                        dot(x, y, 2, '#1c1917');
                }
                dot(320, 170, 50, '#bae6fd');
                cx.strokeStyle = '#0ea5e9';
                cx.lineWidth = 3;
                cx.stroke();
                cx.beginPath();
                cx.arc(320, 170, 43, 0, 7);
                cx.stroke();
                dot(322, 165, 11, '#ec4899');
                mito(410, 85, .3, 1, '#be185d');
                mito(215, 95, -.5, 1, '#be185d');
                mito(205, 220, -.7, 1, '#be185d');
                mito(430, 225, .5, 1, '#be185d');
                wav(215, 128, 80, 4, '#d9f99d', 1);
                wav(250, 232, 90, 3, '#fef08a', 0);
                golgi(455, 150, 1, '#ef4444');
                cen(385, 140, .3);
                cen(395, 155, -1.2);
                dot(180, 160, 9, '#2563eb');
                dot(400, 265, 9, '#2563eb');
                dot(300, 95, 9, '#2563eb');
            }
            else {
                cx.fillStyle = '#4ade80';
                cx.fillRect(110, 30, 420, 260);
                cx.strokeStyle = '#15803d';
                cx.lineWidth = 10;
                cx.strokeRect(110, 30, 420, 260);
                cx.strokeStyle = '#bbf7d0';
                cx.lineWidth = 2;
                cx.strokeRect(120, 40, 400, 240);
                for (let i = 0; i < 22; i++)
                    dot(135 + (i * 53) % 380, 55 + (i * 67) % 210, 2, '#14532d');
                cx.fillStyle = '#93c5fd';
                cx.beginPath();
                cx.ellipse(240, 160, 95, 100, 0, 0, 7);
                cx.fill();
                cx.strokeStyle = '#2563eb';
                cx.lineWidth = 3;
                cx.stroke();
                dot(440, 95, 38, '#c4b5fd');
                cx.strokeStyle = '#7c3aed';
                cx.lineWidth = 3;
                cx.stroke();
                dot(440, 92, 9, '#6d28d9');
                ch(150, 70, .3);
                ch(165, 245, -.4);
                ch(440, 225, .2);
                ch(490, 150, 1.1);
                mito(390, 150, .4, .6, '#ea580c');
                mito(300, 262, 0, .6, '#ea580c');
                wav(345, 45, 70, 2, '#fef08a', 1);
                wav(270, 232, 70, 2, '#fef08a', 0);
                golgi(330, 252, .7, '#f97316');
            }
            const A = pl ? PP : AA, s = A[v.o];
            Object.keys(A).forEach(k => { const a = A[k], x2 = a[2] ? 536 : 104, se = k == v.o; if (!v.l && !se)
                return; cx.strokeStyle = se ? '#fde047' : '#ffffffcc'; cx.lineWidth = se ? 2.5 : 1.2; cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(x2, a[3]); cx.stroke(); dot(a[0], a[1], 3, '#fff'); cx.font = `700 ${se ? 14 : 12}px Cairo`; cx.textAlign = a[2] ? 'left' : 'right'; cx.lineWidth = 3; cx.strokeStyle = '#000b'; const tx = x2 + (a[2] ? 4 : -4); cx.strokeText(N[k], tx, a[3] + 4); cx.fillStyle = se ? '#fde047' : '#fff'; cx.fillText(N[k], tx, a[3] + 4); });
            cx.textAlign = 'start';
            if (s) {
                cx.strokeStyle = '#fde047';
                cx.lineWidth = 3;
                cx.beginPath();
                cx.arc(s[0], s[1], 14 + 4 * Math.sin(t * 5), 0, 7);
                cx.stroke();
            }
            IMD(v, pl);
            return `${D[v.o][0]}: ${D[v.o][1]}${s ? '' : ' — غير موجود في هذا النوع من الخلايا'}`;
        } } });
const IM = [new Image(), new Image()];
IM[0].src = 'data:image/jpeg;base64,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';
IM[1].src = 'data:image/jpeg;base64,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';
function IMD(v, pl) { const i = IM[pl]; if (!v.im || !i.complete || !i.naturalWidth)
    return; cx.shadowBlur = 0; cx.fillStyle = '#0b3a6b'; cx.fillRect(0, 0, 640, 320); const sc = Math.min(640 / i.naturalWidth, 320 / i.naturalHeight), w = i.naturalWidth * sc, hh = i.naturalHeight * sc; cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high'; cx.drawImage(i, (640 - w) / 2, (320 - hh) / 2, w, hh); }
Object.assign(S, { lech: { c: [R('rx', 'التفاعل (0 N₂O₄⇌2NO₂،1 هابر NH₃،2 H₂+I₂⇌2HI)', 0, 2, 1, 0), R('dT', 'تغيّر الحرارة عن المرجع (°س)', -100, 100, 5, 0), R('P', 'الضغط الكلي (ضعف)', 1, 8, .5, 1), R('aR', 'إضافة متفاعل (مول)', 0, 2, .1, 0), R('aP', 'إضافة ناتج (مول)', 0, 2, .1, 0)],
        f(v, t) {
            const X = [{ e: 'N₂O₄ ⇌ 2NO₂', s: ['N₂O₄', 'NO₂'], nu: [-1, 2], n0: [1, 0], dH: 57, K0: .0059, T0: 298, Tr: 25, c: ['#d1d5db', '#b45309'] }, { e: 'N₂ + 3H₂ ⇌ 2NH₃', s: ['N₂', 'H₂', 'NH₃'], nu: [-1, -3, 2], n0: [1, 3, 0], dH: -92, K0: .5, T0: 673, Tr: 400, c: ['#60a5fa', '#f9a8d4', '#34d399'] }, { e: 'H₂ + I₂ ⇌ 2HI', s: ['H₂', 'I₂', 'HI'], nu: [-1, -1, 2], n0: [1, 1, 0], dH: -9.6, K0: 50, T0: 721, Tr: 448, c: ['#e2e8f0', '#a855f7', '#fb7185'] }][v.rx], Kf = T => X.K0 * Math.exp(-X.dH * 1000 / 8.314 * (1 / T - 1 / X.T0)), lnQ = (n, V) => n.reduce((a, x, i) => a + X.nu[i] * Math.log(Math.max(x, 1e-12) / V), 0), eq = (n, V, K) => { let lo = -1e9, hi = 1e9; n.forEach((x, i) => { if (X.nu[i] > 0)
                lo = Math.max(lo, -x / X.nu[i]);
            else
                hi = Math.min(hi, x / -X.nu[i]); }); lo += 1e-12; hi -= 1e-12; const lk = Math.log(K); for (let k = 0; k < 80; k++) {
                const m = (lo + hi) / 2;
                if (lnQ(n.map((x, i) => x + X.nu[i] * m), V) < lk)
                    lo = m;
                else
                    hi = m;
            } return (lo + hi) / 2; }, V0 = 10, nb = X.n0.map((x, i) => x + X.nu[i] * eq(X.n0, V0, Kf(X.Tr + 273.15))), T = X.Tr + v.dT + 273.15, K = Kf(T), V = V0 / v.P, n1 = nb.slice(), L = X.s.length - 1;
            n1[0] += v.aR;
            n1[L] += v.aP;
            const lq = lnQ(n1, V), lk = Math.log(K), sh = lq < lk - .02 ? 1 : lq > lk + .02 ? -1 : 0, n2 = n1.map((x, i) => x + X.nu[i] * eq(n1, V, K));
            const md = (a, m) => ((a % m) + m) % m, fr = Cl(V / V0, .12, 1), bt = 275, ht = 210 * fr, top = bt - ht;
            cx.fillStyle = `rgba(180,83,9,${v.rx == 0 ? Cl(n2[1] / V * .9, 0, .75) : 0})`;
            cx.fillRect(40, top, 250, ht);
            cx.strokeStyle = '#cbd5e1';
            cx.lineWidth = 3;
            cx.strokeRect(40, top, 250, ht);
            cx.fillStyle = '#94a3b8';
            cx.fillRect(36, top - 12, 258, 12);
            cx.fillRect(160, top - 48, 10, 38);
            n2.forEach((x, i) => { const cnt = Math.min(45, Math.round(x * 9)), sp = (1 + (T - 273) / 400) * 40, hh = Math.max(ht - 16, 10); for (let k = 0; k < cnt; k++)
                dot(50 + md((k * 53 + i * 17) * 7 + t * sp * (k % 2 ? 1 : -1) + 300 * Math.sin(k + i), 230), top + 8 + md((k * 37 + i * 29) * 5 + t * sp * .8 * (k % 3 ? 1 : -1), hh), 4.5, X.c[i]); });
            const th = Cl((T - 273) / 600, 0, 1) * 190;
            cx.strokeStyle = '#e2e8f0';
            cx.lineWidth = 2;
            cx.strokeRect(318, 80, 16, 200);
            cx.fillStyle = `hsl(${240 - th * 1.2},85%,55%)`;
            cx.fillRect(320, 278 - th, 12, th);
            T_(Math.round(T - 273) + '°س', 304, 72);
            const mx = Math.max(...n2.map(x => x / V), ...nb.map(x => x / V0), .01);
            X.s.forEach((s, i) => { const bx = 385 + i * 72, h2 = n2[i] / V / mx * 150, hb = nb[i] / V0 / mx * 150; cx.fillStyle = X.c[i]; cx.fillRect(bx, 275 - h2, 44, h2); cx.strokeStyle = '#fff'; cx.lineWidth = 2; cx.setLineDash([4, 3]); cx.beginPath(); cx.moveTo(bx - 4, 275 - hb); cx.lineTo(bx + 48, 275 - hb); cx.stroke(); cx.setLineDash([]); T_(s, bx + 4, 295); T_((n2[i] / V).toFixed(2), bx + 2, 268 - h2); });
            T_('التركيز (M) — المنقط: قبل المؤثر', 330, 60, '#93c5fd');
            const fx = [v.aR > 0 && 'زيادة تركيز المتفاعل', v.aP > 0 && 'زيادة تركيز الناتج', v.P > 1 && 'زيادة الضغط', v.dT > 0 && 'رفع الحرارة', v.dT < 0 && 'خفض الحرارة'].filter(Boolean).join(' + ') || 'لا مؤثر (اتزان مرجعي)', dn = X.nu.reduce((a, b) => a + b, 0);
            return `${X.e} (ΔH ${X.dH > 0 ? '+' : ''}${X.dH} kJ — ${X.dH > 0 ? 'ماص' : 'طارد'}) · Kc = ${K < .01 || K > 1e4 ? K.toExponential(2) : K.toFixed(3)} · المؤثر: ${fx} · النتيجة: ${sh > 0 ? 'ينزاح الاتزان نحو النواتج (الأمام)' : sh < 0 ? 'ينزاح الاتزان نحو المتفاعلات (العكس)' : 'لا ينزاح الاتزان'} · Δn (مولات الغاز) = ${dn}${dn == 0 ? ' (الضغط لا يؤثر)' : ''}`;
        } } });
DEF.lech = 'big';
function mk() {
    const gs = $('gr'), sb = $('sb');
    gs.innerHTML = '';
    [0, ...Array(12).keys()].forEach(i => { if (i == 0) { } });
    for (let i = 0; i <= 12; i++) {
        const b = document.createElement('button');
        b.className = 'chip' + (G == i ? ' on' : '');
        b.textContent = i ? 'الصف ' + gl[i] : 'الكل';
        b.onclick = () => { G = i; mk(); };
        gs.appendChild(b);
    }
    sb.innerHTML = '';
    for (const k in SUB) {
        const b = document.createElement('button');
        b.className = 'chip' + (SB == k ? ' on' : '');
        b.textContent = SUB[k];
        b.onclick = () => { SB = k; mk(); };
        sb.appendChild(b);
    }
    const c = $('cards');
    c.innerHTML = '';
    E.map((e, i) => [e, i]).filter(([e]) => (!G || e[0] == G || (e[0] == 910 && (G == 9 || G == 10))) && (SB == 'all' || e[1] == SB)).forEach(([e, i]) => {
        const d = document.createElement('div');
        d.className = 'card';
        d.innerHTML = `<span class="tag"></span><h3></h3>`;
        d.children[0].textContent = SUB[e[1]] + ' · ' + (e[0] > 12 ? 'الصف التاسع والعاشر (مشتركة)' : 'الصف ' + gl[e[0]]);
        d.children[1].textContent = e[2];
        d.dataset.s = e[1];
        d.onclick = () => open_(i);
        c.appendChild(d);
    });
    if (!c.children.length)
        c.innerHTML = '<p style="color:var(--mu)">لا توجد تجارب مطابقة لهذا الاختيار.</p>';
}
function open_(i) {
    cur = E[i];
    P = [];
    vals = {};
    const s = S[cur[3]];
    s.c.forEach(c => { var _a; return vals[c.k] = (_a = cur[4][c.k]) !== null && _a !== void 0 ? _a : c.d; });
    $('home').style.display = 'none';
    $('lab').style.display = 'block';
    $('lt').textContent = cur[2];
    $('gd').textContent = 'اضبط المتغيرات وراقب النموذج والقراءات لحظيًا. الرسوم توضيحية تعليمية ولا تغني عن التجربة الحقيقية بإشراف المعلم.';
    $('ctls').innerHTML = '';
    s.c.forEach(c => {
        const d = document.createElement('div');
        d.className = 'ctl';
        d.innerHTML = `<label><span>${c.l}</span><b id="v_${c.k}"></b></label><input type="range" min="${c.a}" max="${c.b}" step="${c.s}" value="${vals[c.k]}">`;
        const r = d.querySelector('input'), o = d.querySelector('b');
        o.textContent = vals[c.k];
        r.oninput = () => { vals[c.k] = +r.value; o.textContent = r.value; if (cur[3] == 'boyle')
            P = []; lastLoopSig = ''; startLabLoop(); tone(400 + r.value % 50 * 8, .04, 'triangle', .05); };
        $('ctls').appendChild(d);
    });
    scrollTo(0, 0);
    t0 = performance.now();
    lastLoopSig = '';
    startLabLoop();
    tone(523, .12, 'sine', .08);
    setTimeout(() => tone(784, .18, 'sine', .08), 110);
}
function back() { $('lab').style.display = 'none'; $('home').style.display = 'block'; cur = null; stopLabLoop(); }
function labBackground(now) {
    cx.save();
    cx.clearRect(0, 0, W, H);
    if (window.YQART) {
        YQART.labScene(cx, W, H, { dpr: 2 });
        const t = (now || 0) / 1000;
        cx.fillStyle = 'rgba(220,240,255,.35)';
        for (let i = 0; i < 14; i++) {
            const px = (i * 97 + t * 6 * (1 + i % 3)) % W, py = 40 + ((i * 53 + t * 4 * (1 + i % 2)) % 180);
            cx.globalAlpha = .25 + .25 * Math.sin(t + i);
            cx.beginPath();
            cx.arc(px, py, .9 + (i % 3) * .4, 0, 6.283);
            cx.fill();
        }
        cx.globalAlpha = 1;
    }
    cx.restore();
}
let labRaf = 0, lastLoopSig = '', lastFrameAt = 0;
const STATIC_LABS = new Set(['micro', 'phet']);
function loop(now) {
    labRaf = 0;
    if (!cur || document.hidden)
        return;
    const sig = cur[3] + '|' + JSON.stringify(vals);
    if (STATIC_LABS.has(cur[3]) && sig === lastLoopSig)
        return;
    const frameMs = cur[3] === 'micro' ? 1000 / 30 : 1000 / 30;
    if (now - lastFrameAt < frameMs) {
        labRaf = requestAnimationFrame(loop);
        return;
    }
    cx.shadowBlur = 0;
    labBackground(now);
    cx.shadowColor = 'rgba(0,0,0,.45)';
    cx.shadowBlur = 7;
    cx.shadowOffsetY = 2;
    const result = S[cur[3]].f(vals, (now - t0) / 1000);
    cx.shadowBlur = 0;
    cx.shadowOffsetY = 0;
    const bw = Math.min(310, Math.max(190, (window.__yqT && window.__yqT[0] === cur ? window.__yqT[1] : cur[2]).length * 10));
    cx.fillStyle = 'rgba(5,17,25,.74)';
    cx.fillRect(12, 12, bw, 27);
    cx.strokeStyle = 'rgba(179,224,235,.24)';
    cx.strokeRect(12, 12, bw, 27);
    cx.fillStyle = '#e8f7fb';
    cx.font = '600 12px Cairo, sans-serif';
    cx.textAlign = 'right';
    cx.fillText('مختبر تفاعلي  •  ' + (window.__yqT && window.__yqT[0] === cur ? window.__yqT[1] : cur[2]), bw + 5, 30);
    cx.textAlign = 'start';
    renderOut(result);
    sfx(cur[3], vals, now);
    lastLoopSig = sig;
    lastFrameAt = now;
    if (!STATIC_LABS.has(cur[3]))
        labRaf = requestAnimationFrame(loop);
}
function startLabLoop() { if (cur && !document.hidden && !labRaf)
    labRaf = requestAnimationFrame(loop); }
function stopLabLoop() { if (labRaf) {
    cancelAnimationFrame(labRaf);
    labRaf = 0;
} }
document.addEventListener('visibilitychange', () => document.hidden ? stopLabLoop() : startLabLoop());
function tg() { $('chat').classList.toggle('open'); }
function askAbout() { $('chat').classList.add('open'); $('q').value = 'اشرح لي الفكرة العلمية وراء تجربة: ' + cur[2] + ' (الصف ' + (cur[0] > 12 ? 'التاسع والعاشر' : gl[cur[0]]) + ')'; $('q').focus(); }
let hist = [];
async function send() {
    const q = $('q').value.trim();
    if (!q)
        return;
    $('q').value = '';
    const m = $('msgs');
    const u = document.createElement('div');
    u.className = 'm u';
    u.textContent = q;
    m.appendChild(u);
    const a = document.createElement('div');
    a.className = 'm a';
    a.textContent = '…';
    m.appendChild(a);
    m.scrollTop = m.scrollHeight;
    try {
        const sample = await claude.use('sample');
        if (!sample) {
            a.textContent = 'المساعد غير متاح في هذا العرض.';
            return;
        }
        hist.push({ role: 'user', content: q });
        const sys = 'أنت معلم علوم خبير بالمنهاج الأردني للصفوف 1-12 (فيزياء، كيمياء، أحياء، علوم أرض). أجب بالعربية الفصحى وبدقة علمية. اذكر القانون والوحدات وحل المسائل خطوة بخطوة. صحّح أي مفهوم خاطئ في السؤال. إذا لم تكن متأكداً من معلومة فاذكر ذلك صراحة ولا تخمّن. اجعل الجواب موجزاً ومناسباً لمستوى الطالب.';
        const r = await sample([{ role: 'user', content: sys + '\n\n' + hist.map(h => (h.role == 'user' ? 'الطالب: ' : 'المعلم: ') + h.content).join('\n') + '\nالمعلم:' }], { cache: false, modelTier: 'complex', onText: ({ text }) => { a.textContent = text; m.scrollTop = m.scrollHeight; } });
        a.textContent = r.text;
        hist.push({ role: 'assistant', content: r.text });
        hist = hist.slice(-8);
    }
    catch (e) {
        a.textContent = 'تعذّر الحصول على إجابة (' + (e.code || 'خطأ') + '). حاول مجدداً.';
    }
}
const SL = [['👨‍🏫', 'المعلم المبدع', 'الأستاذ يوسف القاق - مدرّس مادة الكيمياء', '#4f46e5,#0ea5e9'], ['⚗️', 'تفاعل كيميائي', 'محاكاة الحموض والقواعد وسرعة التفاعل', '#7c3aed,#ec4899'], ['🧬', 'أحياء وعلوم الأرض', 'الخلية والمجهر والجهاز الهضمي والدوري والتربة والزلازل', '#059669,#0ea5e9'], ['⚡', 'فيزياء', 'الدوائر الكهربائية والحث الكهرومغناطيسي والضوء', '#d97706,#ef4444']];
let si = 0;
$('car').innerHTML = SL.map((s, i) => `<div class="sl${i ? '' : ' on'}" style="background:linear-gradient(135deg,${s[3]})"><span>${s[0]}</span><div><b style="background:#fff3;padding:2px 10px;border-radius:99px;font-size:11px">${s[1]}</b><h3>${s[2].split(' - ')[0]}</h3><p>${s[2]}</p></div></div>`).join('');
setInterval(() => { const a = document.querySelectorAll('.sl'); a[si].classList.remove('on'); si = (si + 1) % a.length; a[si].classList.add('on'); }, 3500);
let AC = null, mute = false, nx = 0;
function A() { if (!AC)
    try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
    }
    catch (e) { } if (AC && AC.state == 'suspended')
    AC.resume(); return AC; }
function tone(f, d, ty, v) { const c = A(); if (!c || mute)
    return; const o = c.createOscillator(), g = c.createGain(); o.type = ty || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(v || .08, c.currentTime); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + d); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); }
function noise(d, v, hp) { const c = A(); if (!c || mute)
    return; const b = c.createBuffer(1, c.sampleRate * d, c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < a.length; i++)
    a[i] = (Math.random() * 2 - 1) * (1 - i / a.length); const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'highpass'; f.frequency.value = hp || 2000; g.gain.value = v || .05; s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); }
function sfx(s, v, now) {
    if (mute || now < nx || !AC)
        return;
    let d = 0;
    if (s == 'heart') {
        const hr = 70 + v.a * 10;
        tone(55, .18, 'sine', .35);
        setTimeout(() => tone(45, .14, 'sine', .25), 170);
        d = 60000 / hr;
    }
    else if (s == 'pend') {
        tone(900, .04, 'square', .03);
        d = Math.PI * Math.sqrt(v.L / v.g) * 1000;
    }
    else if (s == 'decay') {
        noise(.012, .18, 3000);
        d = 30 + Math.random() * 600 * Math.pow(.5, ((now - t0) / 1000 % 60) / v.T);
    }
    else if (s == 'react') {
        const n = [5, 9, 4, 0, 0][v.r];
        if (n) {
            noise(.05, .05, 3500);
            d = 260 / n;
        }
    }
    else if (s == 'rate' || s == 'yeast') {
        const n = s == 'rate' ? v.c * Math.pow(2, (v.T - 25) / 10) : Math.exp(-Math.pow((v.T - 37) / 12, 2)) * 4;
        if (n > .1) {
            noise(.05, .04, 3500);
            d = Math.min(900, 240 / n);
        }
    }
    else if (s == 'ohm' || s == 'circ') {
        tone(90 + (v.V || 6) * 8, .16, 'sawtooth', .015);
        d = 150;
    }
    else if (s == 'wave') {
        tone(150 + v.fq * 70 + 40 / v.l, .14, 'sine', .06);
        d = 130;
    }
    else if (s == 'faraday') {
        tone(300 + v.N, .03, 'square', .02);
        d = Math.max(80, 600 / v.s);
    }
    else if (s == 'cathode') {
        tone(900 + v.V * 40, .05, 'sawtooth', .012);
        d = 90;
    }
    else if (s == 'elec') {
        noise(.05, .04, 3000);
        d = 220;
    }
    else if (s == 'strength' && v.s < 2) {
        noise(.05, .05, 3500);
        d = Math.max(60, 350 / (v.c * 8));
    }
    nx = now + d;
}
{
    const cv = $('cv');
    const cvDpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
    cv.width = Math.round(W * cvDpr);
    cv.height = Math.round(H * cvDpr);
    cx.setTransform(cvDpr, 0, 0, cvDpr, 0, 0);
    cx.imageSmoothingEnabled = true;
}
const EL = (() => { const S = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' '), N = 'هيدروجين هيليوم ليثيوم بريليوم بورون كربون نيتروجين أكسجين فلور نيون صوديوم مغنيسيوم ألومنيوم سيليكون فوسفور كبريت كلور أرغون بوتاسيوم كالسيوم سكانديوم تيتانيوم فاناديوم كروم منغنيز حديد كوبالت نيكل نحاس خارصين غاليوم جرمانيوم زرنيخ سيلينيوم بروم كريبتون روبيديوم سترونتيوم إتريوم زركونيوم نيوبيوم موليبدنوم تكنيشيوم روثينيوم روديوم بلاديوم فضة كادميوم إنديوم قصدير أنتيمون تيلوريوم يود زينون سيزيوم باريوم لانثانوم سيريوم براسيوديميوم نيوديميوم بروميثيوم ساماريوم يوروبيوم غادولينيوم تيربيوم ديسبروسيوم هولميوم إربيوم ثوليوم إتربيوم لوتيتيوم هافنيوم تنتالوم تنغستن رينيوم أوزميوم إيريديوم بلاتين ذهب زئبق ثاليوم رصاص بزموت بولونيوم أستاتين رادون فرانسيوم راديوم أكتينيوم ثوريوم بروتأكتينيوم يورانيوم نبتونيوم بلوتونيوم أمريسيوم كوريوم بيركيليوم كاليفورنيوم أينشتاينيوم فيرميوم مندليفيوم نوبليوم لورنسيوم رذرفورديوم دوبنيوم سيبورغيوم بوهريوم هاسيوم مايتنيريوم دارمشتاتيوم رونتجينيوم كوبرنيسيوم نيهونيوم فليروفيوم موسكوفيوم ليفرموريوم تينيسين أوغانيسون'.split(' '), M = '1.008 4.0026 6.94 9.0122 10.81 12.011 14.007 15.999 18.998 20.18 22.99 24.305 26.982 28.085 30.974 32.06 35.45 39.948 39.098 40.078 44.956 47.867 50.942 51.996 54.938 55.845 58.933 58.693 63.546 65.38 69.723 72.63 74.922 78.971 79.904 83.798 85.468 87.62 88.906 91.224 92.906 95.95 98 101.07 102.91 106.42 107.87 112.41 114.82 118.71 121.76 127.6 126.9 131.29 132.91 137.33 138.91 140.12 140.91 144.24 145 150.36 151.96 157.25 158.93 162.5 164.93 167.26 168.93 173.05 174.97 178.49 180.95 183.84 186.21 190.23 192.22 195.08 196.97 200.59 204.38 207.2 208.98 209 210 222 223 226 227 232.04 231.04 238.03 237 244 243 247 247 251 252 257 258 259 266 267 268 269 270 277 278 281 282 285 286 289 290 293 294 294'.split(' '); return S.map((s, i) => ({ z: i + 1, s, n: N[i], m: +M[i] })); })();
const ORD = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'], CAP = { s: 2, p: 6, d: 10, f: 14 }, LV = { s: 0, p: 1, d: 2, f: 3 };
const EX = { 24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 }, 41: { '5s': 1, '4d': 4 }, 42: { '5s': 1, '4d': 5 }, 44: { '5s': 1, '4d': 7 }, 45: { '5s': 1, '4d': 8 }, 46: { '5s': 0, '4d': 10 }, 47: { '5s': 1, '4d': 10 }, 57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 }, 78: { '6s': 1, '5d': 9 }, 79: { '6s': 1, '5d': 10 }, 89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 } };
function cfg(z) { let r = z; const o = {}; for (const k of ORD) {
    const c = Math.min(r, CAP[k[1]]);
    if (c > 0) {
        o[k] = c;
        r -= c;
    }
} Object.assign(o, EX[z] || {}); return o; }
const has = (a, z) => a.includes(z);
function cat(z) { if (has([2, 10, 18, 36, 54, 86, 118], z))
    return 5; if (has([3, 11, 19, 37, 55, 87], z))
    return 0; if (has([4, 12, 20, 38, 56, 88], z))
    return 1; if (has([9, 17, 35, 53, 85, 117], z))
    return 4; if (has([5, 14, 32, 33, 51, 52], z))
    return 3; if (has([1, 6, 7, 8, 15, 16, 34], z))
    return 2; if (z >= 57 && z <= 71)
    return 6; if (z >= 89 && z <= 103)
    return 7; if ((z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 72 && z <= 80) || (z >= 104 && z <= 112))
    return 8; return 9; }
const CN = ['فلز قلوي', 'فلز قلوي ترابي', 'لافلز', 'شبه فلز', 'هالوجين', 'غاز نبيل', 'لانثانيدات', 'أكتينيدات', 'فلز انتقالي', 'فلز ما بعد الانتقالية'], CC = ['#ef4444', '#f97316', '#16a34a', '#0d9488', '#ca8a04', '#9333ea', '#db2777', '#e11d48', '#2563eb', '#64748b'];
function pos(z) { if (z == 1)
    return [1, 1]; if (z == 2)
    return [1, 18]; if (z <= 4)
    return [2, z - 2]; if (z <= 10)
    return [2, z + 8]; if (z <= 12)
    return [3, z - 10]; if (z <= 18)
    return [3, z]; if (z <= 36)
    return [4, z - 18]; if (z <= 54)
    return [5, z - 36]; if (z <= 56)
    return [6, z - 54]; if (z <= 71)
    return [9, z - 54]; if (z <= 86)
    return [6, z - 68]; if (z <= 88)
    return [7, z - 86]; if (z <= 103)
    return [10, z - 86]; return [7, z - 100]; }
let AE = 0;
function buildPT() { const g = $('ptg'); EL.forEach(e => { const p = pos(e.z), b = document.createElement('button'); b.className = 'el'; b.style.cssText = `grid-row:${p[0]};grid-column:${p[1]};background:${CC[cat(e.z)]}`; b.innerHTML = `<small>${e.z}</small><b>${e.s}</b>`; b.onclick = () => showEl(e.z); g.appendChild(b); }); $('lg').innerHTML = CN.map((n, i) => `<span class='tag' style='background:${CC[i]};color:#fff'>${n}</span>`).join(''); }
function showEl(z) {
    AE = z;
    const e = EL[z - 1], A = Math.round(e.m), o = cfg(z), sh = [];
    for (const k in o)
        sh[k[0] - 1] = (sh[k[0] - 1] || 0) + o[k];
    const f = Object.entries(o).filter(c => c[1] > 0).sort((a, b) => a[0][0] - b[0][0] || LV[a[0][1]] - LV[b[0][1]]).map(c => `${c[0]}<sup>${c[1]}</sup>`).join(' '), st = has([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86], z) ? 'غاز' : has([35, 80], z) ? 'سائل' : z >= 104 ? 'غير معروفة' : 'صلب', p = pos(z), K = 'KLMNOPQ';
    $('pi').innerHTML = `<h2 style='margin:6px 0;text-align:center;color:${CC[cat(z)]}'>${e.n} (${e.s})</h2>` + [['العدد الذري (Z)', z], ['العدد الكتلي (A)', A], ['البروتونات', z], ['النيوترونات', A - z], ['الإلكترونات (ذرة متعادلة)', z], ['الكتلة الذرية', e.m], ['التصنيف', CN[cat(z)]], ['الحالة (25°س)', st], ['الدورة / المجموعة', p[0] > 7 ? (p[0] == 9 ? 'لانثانيدات' : 'أكتينيدات') : p[0] + ' / ' + p[1]], ['توزيع المستويات', sh.map((n, i) => K[i] + ':' + n).join(' · ')]].map(r => `<div class='row2'><span>${r[0]}</span><b>${r[1]}</b></div>`).join('') + `<div class='out' style='direction:ltr;text-align:left;line-height:2'>${f}</div>`;
    $('pp').style.display = 'block';
    tone(300 + z * 6, .12, 'sine', .07);
}
function bohr(t) { if (!AE)
    return; const x = $('bc').getContext('2d'), o = cfg(AE), sh = []; x.clearRect(0, 0, 240, 240); for (const k in o)
    sh[k[0] - 1] = (sh[k[0] - 1] || 0) + o[k]; const c = CC[cat(AE)]; x.fillStyle = c; x.shadowColor = c; x.shadowBlur = 18; x.beginPath(); x.arc(120, 120, 10 + Math.min(10, AE / 12), 0, 7); x.fill(); x.shadowBlur = 0; x.strokeStyle = '#ffffff30'; sh.forEach((n, i) => { if (!n)
    return; const r = 26 + i * 13; x.beginPath(); x.arc(120, 120, r, 0, 7); x.stroke(); for (let j = 0; j < n; j++) {
    const a = j / n * 6.283 + t / 1000 * (1.3 - i * .15);
    x.fillStyle = '#38bdf8';
    x.beginPath();
    x.arc(120 + r * Math.cos(a), 120 + r * Math.sin(a), 3, 0, 7);
    x.fill();
} }); }
(function L(t) { bohr(t); requestAnimationFrame(L); })(0);
const V_ = ['home', 'lab', 'pt', 'gm', 'qz', 'ab'];
function show(v) { V_.forEach(i => $(i).style.display = i == v ? 'block' : 'none'); document.querySelectorAll('#tabs .chip').forEach(b => b.classList.toggle('on', b.dataset.v == v)); }
function go(v) { show(v); scrollTo(0, 0); tone(600, .05, 'triangle', .05); if (v == 'qz')
    genQuiz(); }
$('tabs').innerHTML = [['home', '🧪 التجارب'], ['pt', '⚛️ الجدول الدوري'], ['gm', '🎮 الألعاب'], ['qz', '📝 اختبار'], ['ab', 'ℹ️ من نحن']].map(t => `<button class='chip${t[0] == 'home' ? ' on' : ''}' data-v='${t[0]}' onclick='go(this.dataset.v)'>${t[1]}</button>`).join('');
buildPT();
const rnd = a => a[Math.floor(Math.random() * a.length)], shf = a => a.sort(() => Math.random() - .5);
function mq(q, c, u, d) { const f = x => (+x).toFixed(d) + (u ? ' ' + u : ''), ds = new Set([f(c)]); for (const k of [.5, 2, 1.5, .75, 3, 1.25]) {
    if (ds.size >= 4)
        break;
    ds.add(f(c * k));
} const o = shf([...ds]); return { q, o, a: o.indexOf(f(c)) }; }
const TQ = { ohm: () => { const V = rnd([6, 12, 24]), R = rnd([2, 3, 4, 6, 8]); return mq(`مقاومة ${R} Ω موصولة بجهد ${V} V. ما شدة التيار؟`, V / R, 'A', 2); }, pend: () => { const L = rnd([.25, .5, 1, 2]); return mq(`ما الزمن الدوري لبندول طوله ${L} م عند g = 9.8 م/ث²؟`, 2 * Math.PI * Math.sqrt(L / 9.8), 'ث', 2); }, proj: () => { const v = rnd([10, 20, 30]), a = rnd([30, 45, 60]); return mq(`مقذوف بسرعة ${v} م/ث وزاوية ${a}°. ما مداه الأفقي؟`, v * v * Math.sin(2 * a * Math.PI / 180) / 9.8, 'م', 1); }, lever: () => { const m = rnd([50, 100, 200]), d = rnd([10, 20, 40]), e = rnd([10, 20, 25]); return mq(`ثقل ${m} جم على بعد ${d} سم من نقطة الارتكاز. ما الثقل المتزن على بعد ${e} سم في الجهة الأخرى؟`, m * d / e, 'جم', 1); }, dens: () => { const m = rnd([60, 120, 240]), V = rnd([20, 30, 40]); return mq(`كتلة جسم ${m} جم وحجمه ${V} سم³. ما كثافته؟`, m / V, 'جم/سم³', 2); }, spring: () => { const m = rnd([100, 200, 300]), k = rnd([10, 20, 50]); return mq(`نابض ثابته ${k} N/m علّقت به كتلة ${m} جم. ما استطالته؟`, m * 9.8 / 1000 / k * 100, 'سم', 1); }, heat: () => { const m = rnd([1, 2, 5]), T = rnd([10, 20, 40]); return mq(`ما الطاقة اللازمة لرفع حرارة ${m} كجم ماء ${T}°س؟ (c = 4186)`, m * 4186 * T / 1000, 'kJ', 1); }, mol: () => { const m = rnd([29.25, 58.5, 117]), V = rnd([250, 500, 1000]); return mq(`أُذيب ${m} جم NaCl (الكتلة المولية 58.5) في ${V} مل محلول. ما التركيز؟`, m / 58.5 / (V / 1000), 'M', 2); } };
const CB = [['شرط اتزان الرافعة:', ['F₁·d₁ = F₂·d₂', 'F₁ + d₁ = F₂ + d₂', 'F₁ / d₁ = F₂ · d₂'], 0], ['لون ورقة تبّاع الشمس الزرقاء في محلول حمضي:', ['أحمر', 'أزرق', 'أخضر'], 0], ['الأشعة المهبطية هي تيار من:', ['الإلكترونات', 'البروتونات', 'النيوترونات'], 0], ['عند المصعد في تحليل CuCl₂ كهربائياً يتصاعد غاز:', ['الكلور', 'الهيدروجين', 'الأكسجين'], 0], ['يطفو الجسم في سائل إذا كانت كثافته:', ['أقل من كثافة السائل', 'أكبر من كثافة السائل', 'تساوي صفراً'], 0], ['الرقم الهيدروجيني للمحلول المتعادل عند 25°س:', ['7', '1', '14'], 0], ['يتحول لون اليود مع النشا إلى:', ['أزرق مسود', 'أحمر', 'أخضر'], 0], ['كلما ارتفعت درجة الحرارة فإن سرعة الانتشار:', ['تزداد', 'تقل', 'تبقى ثابتة'], 0], ['أي الموجات الزلزالية تصل أولاً؟', ['P', 'S', 'السطحية'], 0], ['تربة عالية المسامية ضعيفة النفاذية:', ['الطين', 'الحصى', 'الرمل'], 0], ['كفاءة الآلة البسيطة الحقيقية:', ['أقل من 100%', 'تساوي 100%', 'أكبر من 100%'], 0], ['ينمو عفن الخبز أفضل في:', ['دفء ورطوبة وظلام', 'برودة وجفاف وضوء', 'برودة وإضاءة'], 0]].map(c => () => { const o = shf(c[1].map((t, i) => ({ t, i }))); return { q: c[0], o: o.map(x => x.t), a: o.findIndex(x => x.i == c[2]) }; });
const EQ = () => { const e = rnd(EL.slice(0, 36)), w = shf(EL.slice(0, 36).filter(x => x != e)).slice(0, 3), o = shf([e, ...w]), t = Math.random() * 3 | 0; return t == 0 ? { q: `ما رمز عنصر ${e.n}؟`, o: o.map(x => x.s), a: o.indexOf(e) } : t == 1 ? { q: `ما العدد الذري لعنصر ${e.n}؟`, o: o.map(x => x.z + ''), a: o.indexOf(e) } : { q: `أي عنصر فيه ${e.z} بروتوناً؟`, o: o.map(x => x.n), a: o.indexOf(e) }; };
let QS = {};
function startQ(list, title) { QS = { l: list, i: 0, s: 0, t: title }; show('qz'); nextQ(); }
function nextQ() { const b = $('qb'); if (QS.i >= QS.l.length) {
    const p = QS.s / QS.l.length;
    b.innerHTML = `<h2>${p >= .8 ? '🏆 ممتاز!' : p >= .5 ? '👍 جيد' : '📚 حاول مجدداً'}</h2><p>نتيجتك: ${QS.s} من ${QS.l.length}</p><button class='btn' onclick='go("qz")'>اختبار جديد</button>`;
    fin(p >= .6);
    return;
} const q = QS.l[QS.i]; b.innerHTML = `<small>${QS.t} · سؤال ${QS.i + 1}/${QS.l.length}</small><h3>${q.q}</h3>` + q.o.map((t, i) => `<button class='op' onclick='ans(${i},this)'>${t}</button>`).join(''); }
function ans(i, el) { const q = QS.l[QS.i]; document.querySelectorAll('#qb .op').forEach((b, k) => { b.disabled = true; if (k == q.a)
    b.classList.add('ok'); }); if (i == q.a) {
    QS.s++;
    tone(880, .15, 'sine', .1);
}
else {
    el.classList.add('no');
    tone(140, .3, 'sawtooth', .06);
} QS.i++; setTimeout(nextQ, 1100); }
function genQuiz() { const k = Object.keys(TQ), l = [...shf([...CB]).slice(0, 3).map(f => f()), ...[1, 2, 3].map(EQ), ...[1, 2].map(() => TQ[rnd(k)]())]; startQ(shf(l), 'اختبار عام'); }
function labQuiz() { const l = []; if (TQ[cur[3]])
    for (let i = 0; i < 3; i++)
        l.push(TQ[cur[3]]()); shf([...CB]).slice(0, 5 - l.length).forEach(f => l.push(f())); startQ(l, cur[2]); }
function clap() { if (!A() || mute)
    return; for (let i = 0; i < 28; i++)
    setTimeout(() => noise(.06, .09, 1200 + Math.random() * 1500), i * 70 + Math.random() * 60); [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .25, 'triangle', .1), i * 140)); }
function sad() { [392, 370, 349, 294].forEach((f, i) => setTimeout(() => tone(f, .4, 'sawtooth', .06), i * 280)); }
function fin(w) { w ? clap() : sad(); }
document.addEventListener('click', e => { if (e.target.closest('button'))
    noise(.03, .05, 2500); });
const prs = s => s.split(';').map(x => x.split(':')), cls_ = s => prs(s).map(x => [x[0], +x[1]]);
function pg(P, rev) { return () => { const a = rnd(P), o = shf([a, ...shf(P.filter(x => x != a)).slice(0, 3)]); return { q: rev ? a[1] : a[0], o: o.map(x => rev ? x[0] : x[1]), a: o.indexOf(a) }; }; }
const E54 = EL.slice(0, 54), eg = f => () => { const e = rnd(E54), w = shf(E54.filter(x => x != e)).slice(0, 3), o = shf([e, ...w]); return f(e, o); };
mk();
