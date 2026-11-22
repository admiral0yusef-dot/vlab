(function(){'use strict';
const $=id=>document.getElementById(id);
const QB=window.YQ_QB,META=QB.meta,Q=QB.q;// [id,lesson,diff,q,opts,ans,expl]
const LT=['أ','ب','ج','د'],COL=['#2563eb','#0891b2','#7c3aed','#db2777','#ea580c','#059669','#4f46e5'];
const UNITS=Object.keys(META);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RK='yq_qb_records';
const recs=()=>{try{return JSON.parse(localStorage.getItem(RK)||'[]')||[]}catch(e){return[]}};
const saveRecs=r=>{try{localStorage.setItem(RK,JSON.stringify(r.slice(-400)))}catch(e){}};
const lessonName=l=>META[l.slice(0,2)].l[l];
const cnt={};Q.forEach(x=>{cnt[x[1]]=(cnt[x[1]]||0)+1});
const ucnt=u=>Object.keys(META[u].l).reduce((a,l)=>a+(cnt[l]||0),0);
// تلوين العبارات المهمة
const KW=['تأكسد','اختزال','التأكسد','الاختزال','المصعد','المهبط','مصعد','مهبط','حمضي','قاعدي','متعادل','حمضيًا','قاعديًا','طارد','ماص','طاردة','ماصة','تلقائي','تلقائيًا','غير تلقائي','اليمين','اليسار','النواتج','المتفاعلات','طرديًا','عكسيًا','طردية','عكسية','تزداد','تقل','يزداد','يقل','لا تتغير','لا يتغير','ثابتة','ثابت','قوي','ضعيف','القوي','الضعيف','الأقوى','الأضعف','الأعلى','الأقل','الأكبر','أولي','ثانوي','ثالثي','ماركوفنيكوف','إضافة','حذف','استبدال','الأسترة','التصبن','لوتشاتلييه','كهرلي','لا كهرلي','عامل مؤكسد','عامل مختزل','العامل المؤكسد','العامل المختزل','مشبع','غير مشبع','روابط هيدروجينية','قوى لندن','ثنائية القطب','طاقة التنشيط','المعقد المنشط','العامل المساعد','عامل مساعد'];
const NEG=['ما عدا','عدا','باستثناء','لا يمكن','لا يُعد','لا تُعد','ليس','غير الصحيحة','الخطأ','لا يمثل','لا يتأثر','لا يتأكسد','لا يتفاعل','لا يتميه','لا تدخل','لا يكوِّن'];
const KWR=new RegExp('('+KW.sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\u0621-\\u064A])','g');
const NEGR=new RegExp('('+NEG.join('|')+')','g');
const TOK=/((?:kJ|kPa|mmHg|mL|nm)(?![A-Za-z])|(?:pOH|pH|pKa|pKb)(?![A-Za-z])|[A-Z][A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻()\[\]]*(?:\([a-z]+\))?|\[[^\]]{1,30}\][¹²³⁴]?|-?\d+(?:\.\d+)?[⁰-⁹¹²³⁻]*(?:\s?×\s?10[⁰-⁹¹²³⁻]+)?(?:\s?(?:M\/s|M|mL|L|atm|K|°C|g\/mol|g\/L|kJ|mol|mmHg|V|g|%|s|nm|e⁻))?(?![A-Za-z]))/g;
const RUN=/[A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻\[(°√Δ][A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻\[\]()°%.,=+\-×÷/→⇌·:'^ √Δ<>]*[A-Za-z0-9₀-₉⁰-⁹¹²³⁺⁻\])°%]|[A-Za-z0-9₀-₉⁰-⁹¹²³]/g;
function colorRun(r){let out='',last=0,m;TOK.lastIndex=0;while((m=TOK.exec(r))){out+=esc(r.slice(last,m.index));const t=m[0];const isNum=(/^-?\d/.test(t)&&!/^\d+[A-Z]/.test(t))||/^(kJ|kPa|mmHg|mL|nm)$/.test(t);out+='<span class="'+(isNum?'qb-n':'qb-f')+'">'+esc(t)+'</span>';last=m.index+t.length}return out+esc(r.slice(last))}
function hl(s,mode){s=String(s||'');let out='',last=0,m;RUN.lastIndex=0;
 const txt=t=>{let h=esc(t);if(mode==='e')h=h.replace(KWR,'<span class="qb-k">$1</span>');else h=h.replace(NEGR,'<span class="qb-x">$1</span>');return h};
 while((m=RUN.exec(s))){out+=txt(s.slice(last,m.index));out+='<span class="qb-l">'+colorRun(m[0])+'</span>';last=m.index+m[0].length}
 out+=txt(s.slice(last));if(mode==='e')out=out.replace(/⇐([^⇐]*)$/,'⇐<span class="qb-r">$1</span>');return out}
let S={view:'setup',name:'',cls:'',scope:'lesson',u:'u1',l:'u1l1',units:{},n:20,min:48,minAuto:true};let PREV='home';
let EX=null,timerId=null;
function pool(){let ls=[];if(S.scope==='lesson')ls=[S.l];else if(S.scope==='unit')ls=Object.keys(META[S.u].l);else if(S.scope==='units')UNITS.forEach(u=>{if(S.units[u])ls=ls.concat(Object.keys(META[u].l))});else ls=UNITS.flatMap(u=>Object.keys(META[u].l));return ls}
function scopeLabel(){if(S.scope==='lesson')return 'درس: '+lessonName(S.l);if(S.scope==='unit')return META[S.u].n+': '+META[S.u].t;if(S.scope==='units'){const us=UNITS.filter(u=>S.units[u]);return 'الوحدات: '+us.map(u=>META[u].t).join('، ')}return 'المادة كاملة'}
function shuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const KI=x=>x[7];
// مخطط الامتحان الوزاري 2026 (50 فقرة بالترتيب): [الدرس، نمط السؤال، المستوى]
const BP=[['u1l1','kmt_ex',1],['u1l1','gas_graph',2],['u1l1','gas_mix',2],['u1l2','xyz_order',3],['u1l2','cond_energy',1],['u1l3','solid_tbl',3],['u2l1','mix_tbl',3],['u2l2','colig_tbl',3],['u2l2','dtb_dtf',2],['u2l1','vitamin',1],['u2l1','cryst',2],['u3l1','eq_desc',1],['u3l1','eq_particles',3],['u3l1','',2],['u3l2','Kc_calc',2],['u3l2','K_meaning',2],['u4l1','arr_ex',1],['u4l1','conj_AB',3],['u4l2','pOH_strong',2],['u4l2','',1],['u4l3','acid_clues',3],['u4l3','base_moles',2],['u4l4','',1],['u4l3','base_tbl',3],['u4l3','acid_dir',3],['u4l4','',2],['u5l1','rate_eq',3],['u5l1','ct_avg',3],['u5l1','ct_inst',3],['u5l2','k_table',2],['u5l2','k_units',2],['u5l3','energy_fig',3],['u5l3','mb_fig',3],['u6l1','',1],['u6l1','H_count',2],['u6l1','e_ox',2],['u6l1','needs_agent',2],['u6l2','ion_order',3],['u6l2','gal_tbl',3],['u6l2','cell_nota',2],['u6l3','molten_ex',2],['u7l1','rx_type',1],['u7l1','grig_rev',3],['u7l1','elim_prod',2],['u7l1','ether',2],['u7l1','',1],['u7l1','',2],['u7l1','tubes',3],['u7l1','tubes',3],['u7l1','tubes',3]];
const KIDX={};(QB.K||[]).forEach((k,i)=>KIDX[k]=i);const BPK=new Set(BP.filter(b=>b[1]).map(b=>KIDX[b[1]]));
function pickBP(){const used=new Set(),usedK=new Set(),out=[];let tubeG=null;
 BP.forEach(([l,k,d])=>{let c=[];const ki=k?KIDX[k]:-1;
  if(k==='tubes'){if(!tubeG){const T=shuf(Q.filter(x=>x[1]===l&&KI(x)===ki));if(T.length){const f=JSON.stringify(T[0][8]);tubeG=T.filter(x=>JSON.stringify(x[8])===f)}}
   if(tubeG)c=tubeG.filter(x=>!used.has(x[0]))}
  else if(k)c=Q.filter(x=>x[1]===l&&KI(x)===ki&&!used.has(x[0]));
  if(!c.length)c=Q.filter(x=>x[1]===l&&x[2]===d&&!used.has(x[0])&&!usedK.has(KI(x))&&!BPK.has(KI(x)));
  if(!c.length)c=Q.filter(x=>x[1]===l&&x[2]===d&&!used.has(x[0])&&!usedK.has(KI(x)));
  if(!c.length)c=Q.filter(x=>x[1]===l&&!used.has(x[0])&&!usedK.has(KI(x)));
  if(!c.length)c=Q.filter(x=>x[1]===l&&!used.has(x[0]));
  const q=k==='tubes'?c[0]:c[Math.floor(Math.random()*c.length)];if(q){used.add(q[0]);usedK.add(KI(q));out.push(q)}});return out}
function pick(ls,n){const ord=UNITS.flatMap(u=>Object.keys(META[u].l));const P=Q.filter(x=>ls.includes(x[1]));
 const want={1:Math.round(n*.2),2:Math.round(n*.4)};want[3]=n-want[1]-want[2];
 const used=new Set(),usedK=new Set();let out=[];
 [3,2,1].forEach(d=>{const per={};ls.forEach(l=>per[l]=shuf(P.filter(x=>x[1]===l&&x[2]===d)));let i=0,guard=0;
  while(out.filter(x=>x._d===d).length<want[d]&&guard<5000){guard++;const l=ls[i%ls.length];i++;const arr=per[l];if(!arr.length){if(ls.every(z=>!per[z].length))break;continue}
   let j=arr.findIndex(x=>!usedK.has(KI(x))&&!used.has(x[0]));if(j<0)j=arr.findIndex(x=>!used.has(x[0]));if(j<0){per[l]=[];continue}const q=arr.splice(j,1)[0];used.add(q[0]);usedK.add(KI(q));out.push(Object.assign([],q,{_d:d}))}});
 if(out.length<n){const rest=shuf(P.filter(x=>!used.has(x[0])));rest.sort((a,b)=>(usedK.has(KI(a))?1:0)-(usedK.has(KI(b))?1:0));out=out.concat(rest.slice(0,n-out.length))}
 out=shuf(out).sort((a,b)=>ord.indexOf(a[1])-ord.indexOf(b[1]));return out.slice(0,n)}
// ===== الرسوم =====
const SV=(w,h,b)=>'<svg viewBox="0 0 '+w+' '+h+'" width="100%" style="max-width:'+w+'px" xmlns="http://www.w3.org/2000/svg" direction="ltr" font-family="Cairo,Tahoma,sans-serif">'+b+'</svg>';
function mini(x,y,c){const W=150,H=110,ox=26,oy=88,ax=W-12,ay=10;let pth='';
 if(c==='inv'){let d='';for(let t=0;t<=1.0001;t+=.05){const X=ox+8+t*(ax-ox-12),Y=oy-6-(1/(t*4+.32)-0.2)*20;d+=(d?'L':'M')+X.toFixed(1)+' '+Math.max(ay+4,Y).toFixed(1)}pth=d}
 else if(c==='lin0')pth='M'+ox+' '+oy+' L'+(ax-8)+' '+(ay+8);else if(c==='linb')pth='M'+ox+' '+(oy-26)+' L'+(ax-8)+' '+(ay+8);else if(c==='dec')pth='M'+(ox+4)+' '+(ay+10)+' L'+(ax-8)+' '+(oy-4);else pth='M'+ox+' '+(oy-38)+' L'+(ax-6)+' '+(oy-38);
 return SV(W,H,'<path d="M'+ox+' '+ay+' L'+ox+' '+oy+' L'+ax+' '+oy+'" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="'+pth+'" stroke="#1d4ed8" stroke-width="2.4" fill="none"/><text x="'+(ox-4)+'" y="'+(ay+4)+'" font-size="12" text-anchor="end" fill="currentColor" direction="ltr">'+esc(y)+'</text><text x="'+ax+'" y="'+(oy+16)+'" font-size="12" text-anchor="end" fill="currentColor" direction="ltr">'+esc(x)+'</text>')}
function optHTML(o){if(typeof o==='string'&&o[0]==='§'){const a=o.split('|');return '<span class="qb-mini">'+mini(a[1],a[2],a[3])+'</span>'}return hl(o,'o')}
function fig(f){if(!f)return '';let h='';
 if(f.t==='tbl'){h='<div class="qb-wrapx"><table class="qb-ftbl"><tr>'+f.h.map(x=>'<th>'+hl(x,'o')+'</th>').join('')+'</tr>'+f.r.map(r=>'<tr>'+r.map(c=>'<td>'+hl(String(c),'o')+'</td>').join('')+'</tr>').join('')+'</table></div>';return '<div class="qb-fig">'+h+'</div>'}
 if(f.t==='en'){const W=380,H=240,x0=46,y0=210,top=20,mx=Math.max(f.H,f.P,f.R)*1.12,Y=v=>y0-(v/mx)*(y0-top);const R=Y(f.R),P=Y(f.P),Hc=Y(f.H),C=Y(f.c);
  const curve=(pk)=>'M'+x0+' '+R+' L120 '+R+' C150 '+R+' 165 '+pk+' 200 '+pk+' C235 '+pk+' 250 '+P+' 285 '+P+' L'+(W-10)+' '+P;
  const arr=(x,a,b,lab,side)=>{const ya=Y(a),yb=Y(b);return '<line x1="'+x+'" y1="'+ya+'" x2="'+x+'" y2="'+yb+'" stroke="#334155" stroke-width="1.3" marker-end="url(#ah)" marker-start="url(#ah)"/><text x="'+(x+(side||6))+'" y="'+((ya+yb)/2+4)+'" font-size="12" fill="#c2410c" font-weight="800" text-anchor="'+((side||6)<0?'end':'start')+'" direction="ltr">'+lab+' kJ</text>'};
  let b='<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#334155"/></marker></defs>';
  b+='<path d="M'+x0+' '+top+' L'+x0+' '+y0+' L'+(W-6)+' '+y0+'" stroke="currentColor" stroke-width="1.5" fill="none"/><text x="14" y="'+(top+60)+'" font-size="11" fill="currentColor" transform="rotate(-90 14 '+(top+60)+')">الطاقة (kJ)</text><text x="'+(W/2)+'" y="'+(y0+20)+'" font-size="11" fill="currentColor" text-anchor="middle">سير التفاعل</text>';
  b+='<path d="'+curve(Hc)+'" stroke="#1d4ed8" stroke-width="2.4" fill="none"/><path d="'+curve(C)+'" stroke="#0e7490" stroke-width="2" stroke-dasharray="6 5" fill="none"/>';
  [[Hc,'#94a3b8'],[R,'#94a3b8'],[P,'#94a3b8']].forEach(([yy,c])=>b+='<line x1="'+x0+'" y1="'+yy+'" x2="'+(W-10)+'" y2="'+yy+'" stroke="'+c+'" stroke-dasharray="3 4" stroke-width="1"/>');
  const sh=f.show||[];if(sh.includes('R'))b+=arr(80,0,f.R,f.R);if(sh.includes('H'))b+=arr(196,0,f.H,f.H,-6);if(sh.includes('P'))b+=arr(340,0,f.P,f.P,-6);
  if(sh.includes('Ea'))b+=arr(140,f.R,f.H,f.H-f.R,-6);if(sh.includes('Ear'))b+=arr(268,f.P,f.H,f.H-f.P);if(sh.includes('dc'))b+=arr(222,f.c,f.H,f.H-f.c);
  return '<div class="qb-fig">'+SV(W,H,b)+'</div>'}
 if(f.t==='mb'){const W=360,H=220,x0=40,y0=190;let b='<path d="M'+x0+' 14 L'+x0+' '+y0+' L'+(W-8)+' '+y0+'" stroke="currentColor" stroke-width="1.5" fill="none"/>';
  const cur=(k,amp)=>{let d='';for(let e=0;e<=1;e+=.02){const X=x0+e*(W-x0-14),v=amp*(e/k)*Math.exp(1-e/k);d+=(d?'L':'M')+X.toFixed(1)+' '+(y0-v).toFixed(1)}return d};
  const hotK=.34,coldK=.2;const cH=cur(hotK,105),cC=cur(coldK,160);const ea=x0+.72*(W-x0-14);
  let sd='M'+ea+' '+y0;for(let e=.72;e<=1;e+=.02){const X=x0+e*(W-x0-14),v=105*(e/hotK)*Math.exp(1-e/hotK);sd+=' L'+X.toFixed(1)+' '+(y0-v).toFixed(1)}sd+=' L'+(W-14)+' '+y0+'Z';
  b+='<path d="'+sd+'" fill="#64748b55"/><path d="'+cC+'" stroke="#1d4ed8" stroke-width="2.2" fill="none"/><path d="'+cH+'" stroke="#c2410c" stroke-width="2.2" fill="none"/>';
  const cold=f.hot==='T1'?'T2':'T1';b+='<text x="'+(x0+.2*(W-x0-14)-6)+'" y="'+(y0-166)+'" font-size="13" font-weight="800" fill="#1d4ed8" direction="ltr">'+cold+'</text><text x="'+(x0+.34*(W-x0-14)+6)+'" y="'+(y0-112)+'" font-size="13" font-weight="800" fill="#c2410c" direction="ltr">'+f.hot+'</text>';
  b+='<line x1="'+ea+'" y1="'+(y0-90)+'" x2="'+ea+'" y2="'+y0+'" stroke="#334155" stroke-dasharray="4 3"/><text x="'+ea+'" y="'+(y0+14)+'" font-size="12" text-anchor="middle" fill="currentColor" direction="ltr">Ea</text><text x="'+(W/2)+'" y="'+(H-2)+'" font-size="11" text-anchor="middle" fill="currentColor">الطاقة الحركية</text><text x="12" y="120" font-size="11" fill="currentColor" transform="rotate(-90 12 120)">عدد الجسيمات</text>';
  return '<div class="qb-fig">'+SV(W,H,b)+'</div>'}
 if(f.t==='ct'){const W=380,H=250,x0=56,y0=210,x1=W-14,y1=18,pts=f.p,cm=Math.max(...pts.map(p=>p[1])),ym=Math.ceil(cm*100+.0001)/100,X=t=>x0+t/60*(x1-x0),Y=c=>y0-c/ym*(y0-y1);let b='';
  for(let t=0;t<=60;t+=10)b+='<line x1="'+X(t)+'" y1="'+y1+'" x2="'+X(t)+'" y2="'+y0+'" stroke="#cbd5e1" stroke-width="1"/><text x="'+X(t)+'" y="'+(y0+14)+'" font-size="11" text-anchor="middle" fill="currentColor">'+t+'</text>';
  for(let c=0;c<=ym+1e-9;c+=.01)b+='<line x1="'+x0+'" y1="'+Y(c)+'" x2="'+x1+'" y2="'+Y(c)+'" stroke="#cbd5e1" stroke-width="1"/><text x="'+(x0-4)+'" y="'+(Y(c)+4)+'" font-size="10.5" text-anchor="end" fill="currentColor">'+c.toFixed(2)+'</text>';
  b+='<path d="M'+x0+' '+y1+' L'+x0+' '+y0+' L'+x1+' '+y0+'" stroke="currentColor" stroke-width="1.5" fill="none"/>';
  let d='';for(let t=0;t<=60;t+=1){let c;const k=pts.findIndex(p=>p[0]>=t);if(k<=0)c=pts[0][1];else{const a=pts[k-1],bb=pts[k];c=a[1]+(bb[1]-a[1])*(t-a[0])/(bb[0]-a[0])}}
  pts.forEach((p,i)=>{d+=(i?' L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)});b+='<path d="'+d+'" stroke="#1d4ed8" stroke-width="2.3" fill="none" stroke-linejoin="round"/>';pts.forEach(p=>b+='<circle cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="3.2" fill="#1d4ed8"/>');
  if(f.tan){const [tt,ct,sl]=f.tan;const ta=0,tb=Math.min(60,tt+ (ym-ct)/sl);b+='<line x1="'+X(ta)+'" y1="'+Y(ct-sl*(tt-ta))+'" x2="'+X(tb)+'" y2="'+Y(ct+sl*(tb-tt))+'" stroke="#c2410c" stroke-width="1.8" stroke-dasharray="6 4"/><circle cx="'+X(tt)+'" cy="'+Y(ct)+'" r="4.5" fill="#c2410c"/>'}
  b+='<text x="14" y="'+(y0-70)+'" font-size="11" fill="currentColor" transform="rotate(-90 14 '+(y0-70)+')" direction="ltr">'+esc(f.y||'[A] M')+'</text><text x="'+((x0+x1)/2)+'" y="'+(H-4)+'" font-size="11" text-anchor="middle" fill="currentColor">الزمن (s)</text>';
  return '<div class="qb-fig">'+SV(W,H,b)+'</div>'}
 if(f.t==='pt'){const W=420,H=170;let b='';const bx=f.b;let seed=7;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  const no2=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="5.2" fill="#111827"/><circle cx="'+(x-6)+'" cy="'+(y-5)+'" r="4.3" fill="#cbd5e1" stroke="#64748b" stroke-width=".8"/><circle cx="'+(x+6)+'" cy="'+(y-5)+'" r="4.3" fill="#cbd5e1" stroke="#64748b" stroke-width=".8"/>';
  const cx0=[70,200,330];bx.forEach((m,i)=>{const cx=cx0[i]||70+i*130,cy=78;b+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="56" ry="64" fill="none" stroke="currentColor" stroke-width="1.4"/>';
   const spots=[];for(let a=0;a<40&&spots.length<m[0]+m[1];a++){const x=cx-34+rnd()*68,y=cy-44+rnd()*88;if(spots.every(s=>Math.hypot(s[0]-x,s[1]-y)>22))spots.push([x,y])}
   spots.forEach((s,j)=>{if(j<m[0])b+=no2(s[0]-7,s[1]+2)+no2(s[0]+7,s[1]+2).replace(/fill="#111827"/,'fill="#111827"')+'<line x1="'+(s[0]-2)+'" y1="'+(s[1]+2)+'" x2="'+(s[0]+2)+'" y2="'+(s[1]+2)+'" stroke="#111827" stroke-width="2"/>';else b+=no2(s[0],s[1])})});
  b+='<line x1="20" y1="156" x2="400" y2="156" stroke="currentColor" stroke-width="1.2" marker-end="url(#ah2)"/><defs><marker id="ah2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs><text x="210" y="168" font-size="11" text-anchor="middle" fill="currentColor">الزمن (s)</text>';
  b='<g>'+b+'</g>';const leg='<div class="qb-note" style="margin-top:4px">● ذرة N &nbsp; ○ ذرة O &nbsp;·&nbsp; جزيء NO₂ = ذرة N مع ذرتي O، وجزيء N₂O₄ = جزيئا NO₂ مرتبطان</div>';
  return '<div class="qb-fig">'+SV(W,H,b)+leg+'</div>'}
 if(f.t==='tb'){const W=360,H=230;let b='';f.tubes.forEach((t,i)=>{const x=60+i*110;b+='<text x="'+x+'" y="16" font-size="12" text-anchor="middle" fill="currentColor" direction="ltr">'+esc(t[1])+'</text><line x1="'+x+'" y1="22" x2="'+x+'" y2="40" stroke="#64748b"/>';
   b+='<path d="M'+(x-18)+' 40 L'+(x-18)+' 190 Q'+x+' 214 '+(x+18)+' 190 L'+(x+18)+' 40" fill="none" stroke="currentColor" stroke-width="1.6"/>';
   if(t[2]==='clear')b+='<path d="M'+(x-16)+' 110 L'+(x-16)+' 190 Q'+x+' 210 '+(x+16)+' 190 L'+(x+16)+' 110Z" fill="#dbeafe88"/><text x="'+(x+24)+'" y="140" font-size="10.5" fill="currentColor">محلول شفاف</text>';
   else if(t[2]==='bub'){b+='<path d="M'+(x-16)+' 90 L'+(x-16)+' 190 Q'+x+' 210 '+(x+16)+' 190 L'+(x+16)+' 90Z" fill="#e0f2fe88"/>';for(let k=0;k<14;k++)b+='<circle cx="'+(x-12+((k*37)%24))+'" cy="'+(96+((k*53)%90))+'" r="'+(2+(k%3))+'" fill="none" stroke="#475569" stroke-width=".9"/>';b+='<text x="'+(x+24)+'" y="120" font-size="10.5" fill="currentColor">فقاعات غاز</text>'}
   else{b+='<path d="M'+(x-16)+' 100 L'+(x-16)+' 190 Q'+x+' 210 '+(x+16)+' 190 L'+(x+16)+' 100Z" fill="#bfdbfe88"/><path d="M'+(x-16)+' 168 L'+(x-16)+' 190 Q'+x+' 210 '+(x+16)+' 190 L'+(x+16)+' 168Z" fill="#9a3412"/><text x="'+(x-24)+'" y="176" font-size="10.5" text-anchor="end" fill="currentColor">راسب بنّي</text>'}
   b+='<text x="'+x+'" y="226" font-size="14" font-weight="800" text-anchor="middle" fill="currentColor">'+t[0]+'</text>'});
  return '<div class="qb-fig">'+SV(W,H,b)+'</div>'}
 return ''}
function qHTML(q){return '<div class="tx">'+hl(q[3],'q')+'</div>'+fig(q[8])}
function render(){const p=$('twp');if(!p)return;if(S.view==='setup')setup(p);else if(S.view==='exam')exam(p);else result(p)}
function hero(){return '<div class="qb-hero"><h2 class="qb-h">🎓 بنك أسئلة الكيمياء — الثاني الثانوي (التوجيهي)</h2><p>'+Q.length.toLocaleString('en')+' سؤالًا على نمط الامتحان الوزاري 2026، مرتبة حسب الكتاب المدرسي ومعتمدة على مكثف اللوبيتال، وفيها جداول ورسوم بيانية للتحليل والاستنتاج. اختر امتحانك بالدرس أو الوحدة أو وحدات مختارة أو المادة كاملة (50 فقرة بتوزيع الوزاري)، وكل امتحان مدرّج: 20% سهل، 40% متوسط، 40% قدرات عليا؛ وعند الانتهاء تظهر علامتك وتصحيح مفصّل مع شرح لكل سؤال، وتُمنح شهادة تقدير للمتميزين.</p><div class="qb-badges"><span>'+Q.length.toLocaleString('en')+' سؤال</span><span>7 وحدات · 18 درسًا</span><span>مخطط الوزاري 2026 (50 فقرة)</span><span>جداول ورسوم للتحليل</span><span>مؤقت للامتحان</span><span>إعداد الأستاذ يوسف القاق</span></div></div>'}
function setup(p){const nAvail=Q.filter(x=>pool().includes(x[1])).length;
 let h='<div class="qb-top"><button class="qb-btn" id="qbHome">→ رجوع إلى القائمة السابقة</button></div>'+hero()+'<div class="qb-card"><h3 class="qb-h">① بيانات الطالب</h3><div class="qb-row"><input id="qbName" class="qb-in" maxlength="60" placeholder="اسم الطالب الرباعي (يظهر على النتيجة والشهادة)" value="'+esc(S.name)+'"><input id="qbCls" class="qb-in" style="max-width:260px" maxlength="40" placeholder="المدرسة أو الشعبة (اختياري)" value="'+esc(S.cls)+'"></div><div class="qb-err" id="qbErr"></div></div>';
 h+='<div class="qb-card"><h3 class="qb-h">② نطاق الامتحان</h3><div class="qb-seg" id="qbScope">'+[['lesson','بالدرس'],['unit','بالوحدة'],['units','وحدات مختارة'],['all','المادة كاملة']].map(a=>'<button data-s="'+a[0]+'" class="'+(S.scope===a[0]?'on':'')+'">'+a[1]+'</button>').join('')+'</div>';
 if(S.scope==='lesson'||S.scope==='unit'){h+='<div class="qb-row" style="margin-top:12px"><select id="qbU" class="qb-sel">'+UNITS.map(u=>'<option value="'+u+'"'+(S.u===u?' selected':'')+'>'+META[u].n+': '+META[u].t+' ('+ucnt(u)+' سؤال)</option>').join('')+'</select>';
  if(S.scope==='lesson')h+='<select id="qbL" class="qb-sel">'+Object.keys(META[S.u].l).map(l=>'<option value="'+l+'"'+(S.l===l?' selected':'')+'>'+META[S.u].l[l]+' ('+(cnt[l]||0)+' سؤال)</option>').join('')+'</select>';h+='</div>'}
 else if(S.scope==='units'){h+='<div class="qb-units">'+UNITS.map((u,i)=>'<div class="qb-u'+(S.units[u]?' on':'')+'" data-u="'+u+'"><span class="k" style="background:'+COL[i]+'">'+(i+1)+'</span><div><b>'+META[u].t+'</b><small>'+Object.values(META[u].l).join('، ')+' · '+ucnt(u)+' سؤال</small></div></div>').join('')+'</div>'}
 else h+='<p class="qb-note" style="margin:10px 0 0">جميع الوحدات السبع ('+Q.length.toLocaleString('en')+' سؤال) — يُسحب الامتحان موزعًا على الدروس بالترتيب.</p>';
 if(S.scope!=='all')h+='<div class="qb-lbl">عدد الأسئلة</div><div class="qb-seg" id="qbN">'+[10,20,30,50].map(n=>'<button data-n="'+n+'" class="'+(S.n===n?'on':'')+'">'+n+'</button>').join('')+'</div>';
 else h+='<div class="qb-ex" style="margin-top:12px">📋 امتحان المادة كاملة يُبنى على مخطط الامتحان الوزاري 2026: <b>50 فقرة</b> بالترتيب نفسه وبعدد الأسئلة نفسه لكل موضوع، وبالأنماط نفسها (جداول ورسوم وأسئلة تحليل). الفقرتان المتعلقتان بالمعايرة والمحلول المنظم وتحضير المركبات العضوية استُبدلت بفقرات من الدرس نفسه لاستثنائها.</div>';
 h+='<div class="qb-lbl">مستويات الصعوبة في كل امتحان</div><div class="qb-row"><span class="lv lv1" style="border-radius:999px;padding:4px 12px;font-weight:800;font-size:12.5px">20% سهل ومباشر</span><span class="lv lv2" style="border-radius:999px;padding:4px 12px;font-weight:800;font-size:12.5px">40% متوسط وتحليل واستنتاج</span><span class="lv lv3" style="border-radius:999px;padding:4px 12px;font-weight:800;font-size:12.5px">40% قدرات عليا</span></div>';
 h+='<div class="qb-lbl">مدة الامتحان (دقيقة)</div><div class="qb-row"><input id="qbMin" class="qb-in" type="number" min="5" max="240" style="max-width:140px" value="'+S.min+'"><span class="qb-note">تُحسب تلقائيًا كما في الامتحان الوزاري (50 فقرة في ساعتين)، ويمكنك تعديلها.</span></div>';
 h+='<div class="qb-row" style="margin-top:16px"><button class="qb-go" id="qbStart">▶ ابدأ الامتحان</button><span class="qb-note">الأسئلة المتاحة في هذا النطاق: <b>'+nAvail+'</b></span></div></div>';
 const R=recs();const best={};R.filter(r=>r.pct>=85).forEach(r=>{const k=r.name.trim();if(!best[k]||best[k].pct<r.pct)best[k]=r});const top=Object.values(best).sort((a,b)=>b.pct-a.pct);
 h+='<div class="qb-card"><h3 class="qb-h">🏅 سجل المتميزين وشهادات التقدير</h3><p class="qb-note" style="margin:0 0 8px">تُمنح شهادة التقدير لمن يحقق 85% فأكثر. يُحفظ السجل على هذا الجهاز فقط، فيمكن للمعلم إجراء الامتحانات لطلابه على الجهاز نفسه ثم إصدار شهادات المتميزين دفعة واحدة.</p>';
 if(top.length){h+='<div class="qb-wrapx"><table class="qb-tbl"><tr><th>الطالب</th><th>الامتحان</th><th>العلامة</th><th>التاريخ</th></tr>'+top.map(r=>'<tr><td><b>'+esc(r.name)+'</b>'+(r.cls?'<br><small>'+esc(r.cls)+'</small>':'')+'</td><td>'+esc(r.scope)+'</td><td><b>'+r.score+'/'+r.total+'</b> ('+r.pct+'%)</td><td>'+esc(r.date)+'</td></tr>').join('')+'</table></div><div class="qb-row" style="margin-top:10px"><button class="qb-go" id="qbAllCert">📄 شهادات المتميزين PDF ('+top.length+')</button><button class="qb-btn" id="qbClr">مسح السجل</button></div>'}
 else h+='<p class="qb-note">لا يوجد متميزون في السجل بعد.</p>';
 h+='</div>';p.innerHTML=h;
 $('qbName').oninput=e=>{S.name=e.target.value};$('qbCls').oninput=e=>{S.cls=e.target.value};
 $('qbScope').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.scope=b.dataset.s;if(S.minAuto)S.min=S.scope==='all'?120:Math.round(S.n*2.4);render()};
 $('qbHome').onclick=()=>{try{go(PREV&&PREV!=='tw'?PREV:'home')}catch(e){go('home')}};
 if($('qbU'))$('qbU').onchange=e=>{S.u=e.target.value;S.l=Object.keys(META[S.u].l)[0];render()};
 if($('qbL'))$('qbL').onchange=e=>{S.l=e.target.value;render()};
 p.querySelectorAll('.qb-u').forEach(d=>d.onclick=()=>{const u=d.dataset.u;S.units[u]=!S.units[u];render()});
 if($('qbN'))$('qbN').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;S.n=+b.dataset.n;if(S.minAuto)S.min=Math.round(S.n*2.4);render()};
 $('qbMin').oninput=e=>{S.min=Math.max(5,Math.min(240,+e.target.value||0));S.minAuto=false};
 $('qbStart').onclick=start;
 if($('qbAllCert'))$('qbAllCert').onclick=()=>makePDF(top,'VLab-Certificates-'+Date.now().toString(36)+'.pdf');
 if($('qbClr'))$('qbClr').onclick=function(){if(this.dataset.c){saveRecs([]);render()}else{this.dataset.c=1;this.textContent='اضغط مرة أخرى للتأكيد'}};}
function start(){const nm=(S.name||'').trim();if(nm.split(/\s+/).length<2||nm.length<5){$('qbErr').textContent='اكتب اسم الطالب (الاسم الأول واسم العائلة على الأقل).';$('qbName').focus();return}
 const ls=pool();if(!ls.length){$('qbErr').textContent='اختر وحدة واحدة على الأقل.';return}
 const qs=S.scope==='all'?pickBP():pick(ls,S.n);if(!qs.length){$('qbErr').textContent='لا توجد أسئلة في هذا النطاق.';return}
 EX={qs,ans:{},t0:Date.now(),dur:Math.round(S.min*60),scope:scopeLabel(),name:nm,cls:(S.cls||'').trim()};S.view='exam';render();window.scrollTo({top:($('tw').offsetTop||0)-10,behavior:'smooth'});tick();clearInterval(timerId);timerId=setInterval(tick,1000)}
function left(){return Math.max(0,EX.dur-Math.floor((Date.now()-EX.t0)/1000))}
const mmss=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
function tick(){const ft=$('qbFT');if(!EX||S.view!=='exam'){clearInterval(timerId);if(ft)ft.remove();return}const l=left();const t=$('qbT');if(t){t.textContent='⏱ '+mmss(l);t.classList.toggle('low',l<=120)}
 let f=ft;if(!f){f=document.createElement('div');f.id='qbFT';f.className='qb-ftimer';document.body.appendChild(f)}f.textContent='⏱ '+mmss(l);f.classList.toggle('low',l<=120);const tw=$('tw');f.style.display=(tw&&tw.style.display!=='none')?'':'none';if(l<=0){clearInterval(timerId);submit(true)}}
function exam(p){const n=EX.qs.length;let h='<div class="qb-bar"><div><div class="nm">👤 '+esc(EX.name)+'</div><div class="sc">'+esc(EX.scope)+' · '+n+' سؤالًا</div></div><button class="qb-btn" id="qbQuit" style="padding:7px 12px">↩ خروج</button><div class="qb-timer" id="qbT">⏱ '+mmss(left())+'</div><div class="qb-prog"><i id="qbPr"></i></div></div>';
 h+='<div class="qb-nav" id="qbNav">'+EX.qs.map((q,i)=>'<a href="#qbq'+i+'" data-i="'+i+'">'+(i+1)+'</a>').join('')+'</div>';
 h+=EX.qs.map((q,i)=>'<div class="qb-q" id="qbq'+i+'"><div class="hd"><span class="num">السؤال '+(i+1)+'</span><span class="lv lv'+q[2]+'">'+['','سهل ومباشر','متوسط/تحليل','قدرات عليا'][q[2]]+'</span><span>'+esc(lessonName(q[1]))+'</span></div>'+qHTML(q)+'<div class="qb-ops">'+q[4].map((o,j)=>'<button class="qb-op" data-q="'+i+'" data-o="'+j+'"><span class="lt">'+LT[j]+'</span><span>'+optHTML(o)+'</span></button>').join('')+'</div></div>').join('');
 h+='<div class="qb-card" style="text-align:center"><div class="qb-err" id="qbSubErr"></div><button class="qb-go" id="qbSub">✔ إنهاء الامتحان وعرض النتيجة</button></div>';p.innerHTML=h;
 p.querySelectorAll('.qb-op').forEach(b=>b.onclick=()=>{const i=+b.dataset.q,j=+b.dataset.o;EX.ans[i]=j;b.parentNode.querySelectorAll('.qb-op').forEach(x=>x.classList.toggle('sel',x===b));upd()});
 $('qbNav').onclick=e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();const el=$('qbq'+a.dataset.i);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})};
 $('qbQuit').onclick=function(){if(!this.dataset.c){this.dataset.c=1;this.textContent='اضغط مرة أخرى للخروج دون تسليم';return}clearInterval(timerId);const ft=$('qbFT');if(ft)ft.remove();EX=null;S.view='setup';render()};
 $('qbSub').onclick=function(){const un=EX.qs.length-Object.keys(EX.ans).length;if(un>0&&!this.dataset.c){this.dataset.c=1;$('qbSubErr').textContent='بقي '+un+' سؤالًا دون إجابة. اضغط الزر مرة أخرى لتسليم الامتحان.';this.textContent='تسليم الامتحان رغم ذلك';return}submit(false)};upd()}
function upd(){const n=EX.qs.length,d=Object.keys(EX.ans).length;const pr=$('qbPr');if(pr)pr.style.width=(d/n*100)+'%';const nav=$('qbNav');if(nav)nav.querySelectorAll('a').forEach(a=>a.classList.toggle('d',EX.ans[a.dataset.i]!==undefined))}
function grade(p){return p>=95?'ممتاز — أداء متميز جدًا':p>=85?'ممتاز':p>=75?'جيد جدًا':p>=65?'جيد':p>=50?'مقبول':'يحتاج إلى مراجعة'}
function submit(auto){clearInterval(timerId);const ft=$('qbFT');if(ft)ft.remove();const n=EX.qs.length;let sc=0;EX.qs.forEach((q,i)=>{if(EX.ans[i]===q[5])sc++});EX.score=sc;EX.pct=Math.round(sc/n*100);EX.used=Math.min(EX.dur,Math.floor((Date.now()-EX.t0)/1000));EX.auto=auto;
 const d=new Date();EX.date=d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();
 const R=recs();R.push({name:EX.name,cls:EX.cls,score:sc,total:n,pct:EX.pct,scope:EX.scope,date:EX.date});saveRecs(R);
 S.view='result';S.filter='bad';render();window.scrollTo({top:($('tw').offsetTop||0)-10,behavior:'smooth'})}
function result(p){const n=EX.qs.length,ok=EX.score,un=EX.qs.filter((q,i)=>EX.ans[i]===undefined).length,bad=n-ok-un,pc=EX.pct;
 const col=pc>=85?'#0f9d6b':pc>=65?'#3b4fd8':pc>=50?'#c27a06':'#d43c4f';
 let h='<div class="qb-card"><div class="qb-res"><div class="qb-ring" style="background:conic-gradient('+col+' '+(pc*3.6)+'deg,#e6eaf3 0)"><div style="position:absolute;top:12px;right:12px;bottom:12px;left:12px;inset:12px;border-radius:50%;background:var(--qb-card)"></div><b style="position:relative;color:'+col+'">'+pc+'%</b></div><div><div class="qb-h" style="font-size:22px">'+esc(EX.name)+'</div><div class="qb-note">'+esc(EX.scope)+(EX.cls?' · '+esc(EX.cls):'')+' · '+EX.date+'</div><div style="font-size:18px;font-weight:900;margin-top:6px">العلامة: <span style="color:'+col+';direction:ltr;unicode-bidi:isolate">'+ok+' / '+n+'</span> — '+grade(pc)+'</div>'+(EX.auto?'<div class="qb-err">انتهى الوقت وسُلّم الامتحان تلقائيًا.</div>':'')+'<div class="qb-stats"><span style="background:#e3f6ee;color:#0b7a53">✔ صحيحة: '+ok+'</span><span style="background:#fde7ea;color:#b02a3e">✖ خاطئة: '+bad+'</span><span style="background:#eef0f5;color:#55607a">○ دون إجابة: '+un+'</span><span style="background:#e9edfb;color:#24308f">⏱ الوقت: '+mmss(EX.used)+'</span></div></div></div>';
 h+='<div class="qb-row" style="margin-top:14px">'+(pc>=85?'<button class="qb-go" id="qbCert">🏅 شهادة التقدير PDF</button><button class="qb-btn" id="qbCertImg">🖼️ الشهادة كصورة</button>':'<span class="qb-note">تُمنح شهادة التقدير عند تحقيق 85% فأكثر — راجع الأخطاء وحاول مرة أخرى.</span>')+'<button class="qb-btn" id="qbAgain">↻ امتحان جديد بالإعدادات نفسها</button><button class="qb-btn" id="qbBack">↩ رجوع إلى إعدادات الامتحان</button><button class="qb-btn" id="qbHome2">🏠 القائمة الرئيسية</button></div></div>';
 h+='<div class="qb-card"><h3 class="qb-h">مراجعة الإجابات مع الشرح</h3><div class="qb-seg" id="qbF">'+[['bad','الخاطئة ودون إجابة ('+(bad+un)+')'],['ok','الصحيحة ('+ok+')'],['all','الكل ('+n+')']].map(a=>'<button data-f="'+a[0]+'" class="'+(S.filter===a[0]?'on':'')+'">'+a[1]+'</button>').join('')+'</div><div class="qb-nav" style="margin-top:12px">'+EX.qs.map((q,i)=>{const a=EX.ans[i];return '<a href="#qbr'+i+'" class="'+(a===undefined?'na':a===q[5]?'ok':'bad')+'">'+(i+1)+'</a>'}).join('')+'</div>';
 EX.qs.forEach((q,i)=>{const a=EX.ans[i],st=a===undefined?'na':a===q[5]?'ok':'bad';if(S.filter==='bad'&&st==='ok')return;if(S.filter==='ok'&&st!=='ok')return;
  h+='<div class="qb-q" id="qbr'+i+'"><div class="hd"><span class="num" style="background:'+(st==='ok'?'var(--qb-ok)':st==='bad'?'var(--qb-bad)':'#7a8499')+'">السؤال '+(i+1)+'</span><span>'+(st==='ok'?'✔ إجابة صحيحة':st==='bad'?'✖ إجابة خاطئة':'○ لم تُجب')+'</span><span>· '+esc(lessonName(q[1]))+'</span></div>'+qHTML(q)+'<div class="qb-ops">'+q[4].map((o,j)=>'<div class="qb-op '+(j===q[5]?'ok':(j===a?'bad':''))+'"><span class="lt">'+LT[j]+'</span><span>'+optHTML(o)+'</span></div>').join('')+'</div><div class="qb-ex"><b class="t">💡 الإجابة الصحيحة ('+LT[q[5]]+'):</b> '+(String(q[4][q[5]])[0]==='§'?'الشكل ('+LT[q[5]]+')':hl(q[4][q[5]],'o'))+(q[6]?'<br>'+hl(q[6],'e'):'')+'</div></div>'});
 h+='</div>';p.innerHTML=h;
 $('qbF').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;S.filter=b.dataset.f;render()};
 $('qbAgain').onclick=()=>{S.name=EX.name;start()};$('qbBack').onclick=()=>{S.view='setup';render()};$('qbHome2').onclick=()=>{S.view='setup';go('home')};
 if($('qbCert'))$('qbCert').onclick=()=>makePDF([{name:EX.name,cls:EX.cls,score:EX.score,total:n,pct:pc,scope:EX.scope,date:EX.date}],'VLab-Certificate-'+EX.date.replace(/\//g,'-')+'.pdf');
 if($('qbCertImg'))$('qbCertImg').onclick=()=>{const c=certCanvas({name:EX.name,cls:EX.cls,score:EX.score,total:n,pct:pc,scope:EX.scope,date:EX.date});dl(c.toDataURL('image/png'),'VLab-Certificate.png')}}
// ===== شهادة التقدير =====
function certCanvas(r){const W=1754,H=1240,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const HF='"QBHead",Cairo,Tahoma,sans-serif',BF='Cairo,Tahoma,"Segoe UI",sans-serif';
 x.fillStyle='#fbf8f1';x.fillRect(0,0,W,H);
 const g=x.createRadialGradient(W/2,H/2,100,W/2,H/2,W*.7);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(212,190,140,.18)');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.strokeStyle='#1f2a6b';x.lineWidth=14;x.strokeRect(40,40,W-80,H-80);x.strokeStyle='#b8913f';x.lineWidth=3;x.strokeRect(66,66,W-132,H-132);x.strokeRect(78,78,W-156,H-156);
 // زخارف الزوايا
 [[78,78,1,1],[W-78,78,-1,1],[78,H-78,1,-1],[W-78,H-78,-1,-1]].forEach(([cx,cy,sx,sy])=>{x.save();x.translate(cx,cy);x.scale(sx,sy);x.strokeStyle='#b8913f';x.lineWidth=3;for(let k=0;k<3;k++){x.beginPath();x.arc(0,0,40+k*16,0,Math.PI/2);x.stroke()}x.fillStyle='#1f2a6b';x.beginPath();x.arc(0,0,14,0,7);x.fill();x.restore()});
 // علامة مائية
 x.save();x.globalAlpha=.05;x.fillStyle='#1f2a6b';x.font='900 150px '+HF;x.textAlign='center';x.direction='rtl';x.translate(W/2,H/2+40);x.rotate(-.12);x.fillText('الأستاذ يوسف القاق',0,0);x.restore();
 x.direction='rtl';x.textAlign='center';
 x.fillStyle='#1f2a6b';x.font='800 34px '+BF;x.fillText('المختبر الافتراضي للعلوم · VLab',W/2,165);
 x.fillStyle='#8a6a26';x.font='700 26px '+BF;x.fillText('بنك أسئلة الكيمياء — الثاني الثانوي (التوجيهي)',W/2,210);
 x.fillStyle='#1f2a6b';x.font='900 118px '+HF;x.fillText('شهادة تقدير',W/2,345);
 x.strokeStyle='#b8913f';x.lineWidth=3;x.beginPath();x.moveTo(W/2-260,385);x.lineTo(W/2+260,385);x.stroke();x.fillStyle='#b8913f';x.beginPath();x.arc(W/2,385,8,0,7);x.fill();
 x.fillStyle='#2b3550';x.font='600 36px '+BF;x.fillText('يتقدّم الأستاذ يوسف القاق بخالص التهنئة والتقدير إلى الطالب/ة',W/2,470);
 let fs=96;x.font='900 '+fs+'px '+HF;while(x.measureText(r.name).width>W-420&&fs>50){fs-=4;x.font='900 '+fs+'px '+HF}
 x.fillStyle='#0e7490';x.fillText(r.name,W/2,600);
 if(r.cls){x.fillStyle='#5b6b85';x.font='600 28px '+BF;x.fillText(r.cls,W/2,648)}
 x.fillStyle='#2b3550';x.font='600 34px '+BF;x.fillText('تقديرًا لتميّزه في امتحان الكيمياء الإلكتروني',W/2,720);
 let sc=r.scope;x.font='700 32px '+BF;while(x.measureText(sc).width>W-360&&sc.length>10)sc=sc.slice(0,-2);if(sc!==r.scope)sc+='…';x.fillStyle='#1f2a6b';x.fillText('('+sc+')',W/2,770);
 x.fillStyle='#2b3550';x.font='700 38px '+BF;x.fillText('وحصوله على علامة '+r.score+' من '+r.total+' بنسبة '+r.pct+'%',W/2,840);
 x.font='600 30px '+BF;x.fillStyle='#5b6b85';x.fillText('متمنّين له دوام التفوق والنجاح',W/2,892);
 // الختم
 const sx=330,sy=1000;x.save();x.translate(sx,sy);x.strokeStyle='#b8913f';x.lineWidth=5;x.beginPath();x.arc(0,0,105,0,7);x.stroke();x.lineWidth=2;x.beginPath();x.arc(0,0,88,0,7);x.stroke();
 for(let k=0;k<24;k++){x.save();x.rotate(k*Math.PI/12);x.fillStyle='#b8913f';x.beginPath();x.moveTo(0,-112);x.lineTo(6,-122);x.lineTo(-6,-122);x.fill();x.restore()}
 x.fillStyle='#1f2a6b';x.font='900 46px '+HF;x.fillText('متميز',0,10);x.font='700 22px '+BF;x.fillText(r.pct+'%',0,48);x.fillText('VLab',0,-40);x.restore();
 // التاريخ
 x.fillStyle='#2b3550';x.font='600 28px '+BF;x.fillText('التاريخ: '+r.date,W/2,1060);
 // التوقيع
 const qx=W-360;x.fillStyle='#2b3550';x.font='700 28px '+BF;x.fillText('معلم المادة',qx,965);
 x.save();x.strokeStyle='#1d2b7a';x.lineWidth=4;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(qx+150,1035);x.bezierCurveTo(qx+110,985,qx+70,1050,qx+40,1012);x.bezierCurveTo(qx+15,985,qx-10,1045,qx-40,1018);x.bezierCurveTo(qx-70,990,qx-90,1040,qx-120,1022);x.bezierCurveTo(qx-140,1010,qx-150,1030,qx-170,1040);x.stroke();
 x.lineWidth=2.5;x.beginPath();x.moveTo(qx-160,1052);x.bezierCurveTo(qx-60,1062,qx+60,1046,qx+170,1058);x.stroke();x.restore();
 x.fillStyle='#1f2a6b';x.font='900 40px '+HF;x.fillText('الأستاذ يوسف القاق',qx,1110);
 x.strokeStyle='#b8913f';x.lineWidth=2;x.beginPath();x.moveTo(qx-190,1072);x.lineTo(qx+190,1072);x.stroke();
 x.fillStyle='#8a94a8';x.font='600 20px '+BF;x.fillText('www.vlabjo.com',W/2,H-100);return c}
function dl(url,name){const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove()},500)}
// مولد PDF بسيط (صفحة لكل شهادة بصيغة JPEG)
function makePDF(list,fname){const doFonts=(document.fonts&&document.fonts.load)?Promise.all([document.fonts.load('900 40px "QBHead"'),document.fonts.load('700 30px Cairo')]).catch(()=>{}):Promise.resolve();
 doFonts.then(()=>{const pages=list.map(r=>{const c=certCanvas(r);const b64=c.toDataURL('image/jpeg',.92).split(',')[1];const bin=atob(b64);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return {u,w:c.width,h:c.height}});
  const enc=new TextEncoder(),parts=[],offs=[];let len=0;const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');const N=pages.length;const obj=(id,body)=>{offs[id]=len;push(id+' 0 obj\n');if(Array.isArray(body))body.forEach(push);else push(body);push('\nendobj\n')};
  const kids=pages.map((p,i)=>(3+i*3)+' 0 R').join(' ');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids ['+kids+'] /Count '+N+' >>');
  const PW=842,PH=595;pages.forEach((p,i)=>{const pid=3+i*3,cid=pid+1,iid=pid+2;obj(pid,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+PW+' '+PH+'] /Resources << /XObject << /Im'+i+' '+iid+' 0 R >> >> /Contents '+cid+' 0 R >>');
   const cs='q '+PW+' 0 0 '+PH+' 0 0 cm /Im'+i+' Do Q';obj(cid,'<< /Length '+cs.length+' >>\nstream\n'+cs+'\nendstream');
   obj(iid,['<< /Type /XObject /Subtype /Image /Width '+p.w+' /Height '+p.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+p.u.length+' >>\nstream\n',p.u,'\nendstream'])});
  const total=3+N*3;const xo=len;let xr='xref\n0 '+total+'\n0000000000 65535 f \n';for(let i=1;i<total;i++)xr+=String(offs[i]).padStart(10,'0')+' 00000 n \n';push(xr+'trailer\n<< /Size '+total+' /Root 1 0 R >>\nstartxref\n'+xo+'\n%%EOF');
  const blob=new Blob(parts,{type:'application/pdf'});const url=URL.createObjectURL(blob);dl(url,fname);setTimeout(()=>URL.revokeObjectURL(url),60000)})}
// تسجيل القائمة والتبويب
try{if(typeof V_!=='undefined'&&Array.isArray(V_)&&!V_.includes('tw'))V_.push('tw')}catch(e){}
const TABTXT='🎓 بنك أسئلة كيمياء التوجيهي';
function addTab(){const tabs=$('tabs');if(!tabs)return;let b=tabs.querySelector('[data-v="tw"]');if(b){if(b.textContent!==TABTXT)b.textContent=TABTXT;return}b=document.createElement('button');b.className='chip tw-chip';b.dataset.v='tw';b.textContent=TABTXT;b.title='بنك أسئلة الكيمياء للتوجيهي — امتحانات إلكترونية بالنمط الوزاري';b.setAttribute('onclick','go(this.dataset.v)');b.style.cssText='background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border-color:transparent;font-weight:900';const ab=tabs.querySelector('[data-v="ab"]');tabs.insertBefore(b,ab||null)}
addTab();setTimeout(addTab,100);setTimeout(addTab,700);setTimeout(addTab,2500);
let LASTV='home';const og=window.go;if(typeof og==='function')window.go=function(v){if(v==='tw'&&LASTV!=='tw')PREV=LASTV;LASTV=v;const r=og.apply(this,arguments);const tw=$('tw');if(v==='tw'){if(S.view!=='exam')render();if(tw)tw.style.display='block'}else if(tw&&v)tw.style.display='none';return r};
render();window.yqTW={render,S:()=>S,ex:()=>EX,bank:QB};
})();