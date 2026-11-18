/* مكتبة الرسوم الواقعية — المختبر الافتراضي للعلوم (الأستاذ يوسف القاق)
   رسوم متجهية متحركة بالكامل: بطة برية (مالارد) طائرة، غيوم ركامية حجمية، تضاريس، ماء، طبقات أرضية. */
(function(G){'use strict';
var ART={};var TAU=Math.PI*2;
function rng(seed){var s=(seed|0)||1;return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
function lerp(a,b,t){return a+(b-a)*t}
function mixc(c1,c2,t){return 'rgb('+Math.round(lerp(c1[0],c2[0],t))+','+Math.round(lerp(c1[1],c2[1],t))+','+Math.round(lerp(c1[2],c2[2],t))+')'}
ART.rng=rng;
/* ======================= البطة البرية (Mallard) ======================= */
/* ترسم البطة متجهة لليمين حول نقطة الأصل، طولها نحو 130 وحدة. phase: طور ضربة الجناح (راديان). */
function drawWing(c,o,far,female){
 var L=o.len,lift=Math.sin(o.ph);
 /* اتجاه الجناح: للأعلى مع ميل للخلف في الضربة الصاعدة، وللأسفل في الهابطة */
 var ang=lift>=0?lerp(-0.35,-1.85,lift):lerp(-0.35,1.25,-lift);
 var ux=Math.cos(ang),uy=Math.sin(ang);var Le=L*(0.42+0.58*Math.abs(lift));
 var bx=uy,by=-ux;if(bx>0){bx=-bx;by=-by}
 var chord=L*.36;
 var pr=far?'#2e2a27':'#3c3834',sec=far?'#6b665f':'#8e887f',cov=far?'#7d776f':'#aaa59c';
 if(female){pr=far?'#33281f':'#45372a';sec=far?'#6a5642':'#8a7155';cov=far?'#7a6650':'#a38a6c'}
 function P(s,k){return [ux*Le*s+bx*chord*k,uy*Le*s+by*chord*k]}
 c.save();
 /* الريش الأولي على شكل مروحة عند الطرف */
 for(var i=7;i>=0;i--){var s0=.5+i*.015,k0=.1+i*.05;var st=P(s0,k0);var en=P(1.0-i*.055,.05+i*.17);var w=chord*.13;
  c.beginPath();c.moveTo(st[0],st[1]);c.lineTo(en[0]+ux*4,en[1]+uy*4);
  c.quadraticCurveTo(en[0]+bx*w*1.2,en[1]+by*w*1.2,en[0]+bx*w-ux*6,en[1]+by*w-uy*6);c.lineTo(st[0]+bx*w*1.5,st[1]+by*w*1.5);c.closePath();
  c.fillStyle=i%2?pr:(female?'#3a2e23':'#34302c');c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=.6;c.stroke()}
 /* الريش الثانوي */
 var A=P(0,0),Wr=P(.52,0),t1=P(.6,1.05),t2=P(.3,1.15),t3=P(0,1.2);
 c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo(P(.26,-.12)[0],P(.26,-.12)[1],Wr[0],Wr[1]);c.lineTo(t1[0],t1[1]);
 for(var j=0;j<=6;j++){var q=P(.6-j*.1,1.05+Math.sin(j)*.05+.05*(j%2));c.lineTo(q[0],q[1])}c.lineTo(t3[0],t3[1]);c.closePath();
 c.fillStyle=sec;c.fill();
 c.save();c.clip();
 /* المرآة الزرقاء البنفسجية بين حدّين أبيضين */
 var m1=P(.05,.78),m2=P(.58,.72);c.lineCap='butt';
 c.strokeStyle='#f8fafc';c.lineWidth=chord*.27;c.beginPath();c.moveTo(m1[0],m1[1]);c.lineTo(m2[0],m2[1]);c.stroke();
 var sg=c.createLinearGradient(m1[0],m1[1],m2[0],m2[1]);sg.addColorStop(0,'#1e3a8a');sg.addColorStop(.5,'#4f46e5');sg.addColorStop(1,'#2563eb');
 c.strokeStyle=sg;c.lineWidth=chord*.17;c.beginPath();c.moveTo(m1[0],m1[1]);c.lineTo(m2[0],m2[1]);c.stroke();
 c.strokeStyle='rgba(20,18,16,.35)';c.lineWidth=.8;for(var k=0;k<=8;k++){var a1=P(k*.07,.35),a2=P(k*.07-.02,1.2);c.beginPath();c.moveTo(a1[0],a1[1]);c.lineTo(a2[0],a2[1]);c.stroke()}
 c.restore();
 /* الريش الغطائي */
 var cv1=P(.55,.05),cv2=P(.42,.5),cv3=P(0,.62);
 c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo(P(.26,-.12)[0],P(.26,-.12)[1],cv1[0],cv1[1]);c.quadraticCurveTo(cv2[0]+bx*4,cv2[1]+by*4,cv3[0],cv3[1]);c.closePath();
 var cg=c.createLinearGradient(A[0],A[1],cv2[0],cv2[1]);cg.addColorStop(0,cov);cg.addColorStop(1,sec);c.fillStyle=cg;c.fill();
 /* حافة أمامية مضيئة */
 c.strokeStyle=far?'rgba(255,255,255,.06)':'rgba(255,255,255,.28)';c.lineWidth=1.8;c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo(P(.26,-.12)[0],P(.26,-.12)[1],Wr[0],Wr[1]);c.lineTo(P(.98,.05)[0],P(.98,.05)[1]);c.stroke();
 c.restore()}
ART.mallard=function(c,o){o=o||{};var ph=o.ph||0,fem=!!o.female,hit=!!o.hit,L=130;
 c.save();if(o.rot)c.rotate(o.rot);
 var bob=Math.sin(ph)*2.5;c.translate(0,-bob);
 /* الجناح البعيد */
 c.save();c.translate(10,-12);drawWing(c,{len:hit?70:88,ph:hit?1.3:ph+.25},true,fem);c.restore();
 /* الأرجل مطوية للخلف */
 c.strokeStyle='#ea7a1c';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(-28,10);c.lineTo(-46,14);c.stroke();c.fillStyle='#f08a24';c.beginPath();c.moveTo(-46,10);c.lineTo(-58,13);c.lineTo(-46,18);c.closePath();c.fill();
 /* الذيل */
 c.beginPath();c.moveTo(-40,-6);c.quadraticCurveTo(-62,-8,-70,-3);c.quadraticCurveTo(-62,6,-40,8);c.closePath();c.fillStyle=fem?'#5b4632':'#e5e7eb';c.fill();
 if(!fem){c.strokeStyle='#111';c.lineWidth=2.4;c.beginPath();c.moveTo(-44,-6);c.bezierCurveTo(-52,-16,-44,-20,-40,-14);c.stroke()}
 /* الجسم */
 var bp=new Path2D('M-46,-8 C-30,-18 0,-19 22,-14 C34,-11 42,-4 44,4 C40,15 20,18 -6,17 C-26,16 -42,12 -48,4 Z');
 var bg=c.createLinearGradient(0,-19,0,18);
 if(fem){bg.addColorStop(0,'#6b5137');bg.addColorStop(.5,'#9a7a56');bg.addColorStop(1,'#c4a57d')}else{bg.addColorStop(0,'#6f6a63');bg.addColorStop(.45,'#bfc2c4');bg.addColorStop(1,'#e2e4e5')}
 c.fillStyle=bg;c.fill(bp);
 c.save();c.clip(bp);
 if(!fem){/* الصدر الكستنائي */var cg=c.createRadialGradient(36,4,2,30,4,30);cg.addColorStop(0,'#8a4b2c');cg.addColorStop(.7,'#5e2f1b');cg.addColorStop(1,'rgba(94,47,27,0)');c.fillStyle=cg;c.beginPath();c.ellipse(32,3,24,20,0,0,TAU);c.fill();
  /* الردف الأسود */c.fillStyle='#1b1b1b';c.beginPath();c.ellipse(-46,-1,12,13,0,0,TAU);c.fill();
  /* تموجات رمادية دقيقة */c.strokeStyle='rgba(60,60,60,.18)';c.lineWidth=.8;for(var i=-36;i<18;i+=3.2){c.beginPath();c.moveTo(i,-4);c.quadraticCurveTo(i+2,4,i,14);c.stroke()}}
 else{/* نقوش الأنثى المتدرجة */var r=rng(7);c.strokeStyle='rgba(50,34,20,.55)';c.lineWidth=1.4;for(var j=0;j<46;j++){var x=-44+r()*86,y=-14+r()*30;c.beginPath();c.arc(x,y,3+r()*3,Math.PI*.1,Math.PI*.9);c.stroke()}}
 /* ظل سفلي وإضاءة علوية */var sh=c.createLinearGradient(0,-19,0,18);sh.addColorStop(0,'rgba(255,255,255,.18)');sh.addColorStop(.3,'rgba(255,255,255,0)');sh.addColorStop(.75,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.28)');c.fillStyle=sh;c.fillRect(-60,-25,120,50);
 c.restore();
 /* العنق والرأس */
 var neck=new Path2D('M26,-12 C36,-18 42,-24 50,-27 C56,-29 60,-24 58,-18 C52,-10 44,-2 38,4 Z');
 c.fillStyle=fem?'#8a6a49':'#5e2f1b';c.fill(neck);
 if(!fem){c.strokeStyle='#f8fafc';c.lineWidth=3.2;c.beginPath();c.moveTo(43,-18);c.quadraticCurveTo(47,-12,52,-14);c.stroke()}
 var hx=58,hy=-28;var hg=c.createRadialGradient(hx-3,hy-6,1,hx,hy,15);
 if(fem){hg.addColorStop(0,'#a3835f');hg.addColorStop(1,'#6b5137')}else{hg.addColorStop(0,'#3ccf7a');hg.addColorStop(.35,'#138a4a');hg.addColorStop(.75,'#0b4a2c');hg.addColorStop(1,'#1e1b4b')}
 c.fillStyle=hg;c.beginPath();c.ellipse(hx,hy,13,11,-.15,0,TAU);c.fill();
 if(fem){c.strokeStyle='rgba(40,28,16,.8)';c.lineWidth=2;c.beginPath();c.moveTo(hx-9,hy-2);c.lineTo(hx+11,hy-1);c.stroke()}
 /* اللمعة القزحية */
 if(!fem){c.fillStyle='rgba(167,243,208,.45)';c.beginPath();c.ellipse(hx-2,hy-6,6,2.5,-.3,0,TAU);c.fill();c.fillStyle='rgba(129,140,248,.25)';c.beginPath();c.ellipse(hx+3,hy+4,7,3,.2,0,TAU);c.fill()}
 /* العين */
 c.fillStyle='#0a0a0a';c.beginPath();c.arc(hx+4,hy-2,2.3,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.arc(hx+4.8,hy-2.8,.8,0,TAU);c.fill();
 if(hit){c.strokeStyle='#111';c.lineWidth=1.6;c.beginPath();c.moveTo(hx+1.5,hy-4.5);c.lineTo(hx+6.5,hy+.5);c.moveTo(hx+6.5,hy-4.5);c.lineTo(hx+1.5,hy+.5);c.stroke()}
 /* المنقار */
 c.beginPath();c.moveTo(hx+10,hy-4);c.quadraticCurveTo(hx+24,hy-4,hx+27,hy+1);c.quadraticCurveTo(hx+22,hy+5,hx+10,hy+3);c.closePath();
 var bk=c.createLinearGradient(hx+10,hy-4,hx+27,hy+4);bk.addColorStop(0,fem?'#c2410c':'#d9c24a');bk.addColorStop(1,fem?'#9a3412':'#b9a12f');c.fillStyle=bk;c.fill();
 c.fillStyle='#1f2937';c.beginPath();c.ellipse(hx+25,hy,2,1.6,0,0,TAU);c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.8;c.beginPath();c.moveTo(hx+11,hy);c.lineTo(hx+25,hy+1);c.stroke();
 /* الجناح القريب */
 c.save();c.translate(4,-9);drawWing(c,{len:hit?80:100,ph:hit?1.5:ph},false,fem);c.restore();
 c.restore()};
/* ريشة متطايرة */
ART.feather=function(c,x,y,rot,s,col){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.beginPath();c.moveTo(0,-10);c.quadraticCurveTo(5,-2,0,10);c.quadraticCurveTo(-5,-2,0,-10);c.fillStyle=col||'rgba(235,235,235,.9)';c.fill();c.strokeStyle='rgba(120,120,120,.6)';c.lineWidth=.7;c.beginPath();c.moveTo(0,-10);c.lineTo(0,12);c.stroke();c.restore()};
/* ======================= الغيوم الركامية الحجمية ======================= */
var CC={};
function buildCloud(seed,w,dark,tint){var key=seed+'|'+w+'|'+Math.round(dark*10)+'|'+(tint||'');if(CC[key])return CC[key];
 var r=rng(seed*31+7),pad=w*.35,cw=Math.ceil(w+pad*2),ch=Math.ceil(w*.75+pad*1.2);var cv=document.createElement('canvas');cv.width=cw;cv.height=ch;var c=cv.getContext('2d');
 var base=ch-pad*.6,cx=cw/2,puffs=[];var n=9+Math.floor(r()*6);
 for(var i=0;i<n;i++){var f=i/(n-1);var x=cx+(f-.5)*w*.92+(r()-.5)*w*.08;var hump=Math.sin(f*Math.PI);var rad=w*(.1+.13*hump+r()*.06);var y=base-rad*.55-hump*w*.16*(.7+r()*.6);puffs.push([x,y,rad])}
 for(var j=0;j<5;j++){var x2=cx+(r()-.5)*w*.5,rad2=w*(.12+r()*.08);puffs.push([x2,base-w*.28-r()*w*.1,rad2])}
 puffs.sort(function(a,b){return a[1]-b[1]});
 var top=tint==='sunset'?[255,214,186]:tint==='night'?[150,160,190]:[255,255,255];var mid=tint==='sunset'?[226,156,150]:tint==='night'?[70,80,112]:[226,232,240];var bot=tint==='sunset'?[120,84,120]:tint==='night'?[30,36,60]:[148,163,184];
 var dk=Math.min(1,dark);top=[lerp(top[0],120,dk*.75),lerp(top[1],128,dk*.75),lerp(top[2],140,dk*.7)];mid=[lerp(mid[0],80,dk*.8),lerp(mid[1],88,dk*.8),lerp(mid[2],104,dk*.75)];bot=[lerp(bot[0],40,dk*.85),lerp(bot[1],46,dk*.85),lerp(bot[2],60,dk*.8)];
 /* طبقة الظل الأساسية */
 puffs.forEach(function(p){var g=c.createRadialGradient(p[0],p[1]+p[2]*.35,p[2]*.1,p[0],p[1],p[2]*1.05);g.addColorStop(0,mixc(mid,bot,.5));g.addColorStop(1,mixc(mid,bot,.9));c.fillStyle=g;c.beginPath();c.arc(p[0],p[1],p[2],0,TAU);c.fill()});
 /* الإضاءة من أعلى اليسار */
 puffs.forEach(function(p){var g=c.createRadialGradient(p[0]-p[2]*.35,p[1]-p[2]*.45,p[2]*.05,p[0],p[1],p[2]);g.addColorStop(0,mixc(top,top,0));g.addColorStop(.55,mixc(top,mid,.45));g.addColorStop(1,'rgba('+mid.map(Math.round).join(',')+',0)');c.fillStyle=g;c.beginPath();c.arc(p[0],p[1],p[2]*.97,0,TAU);c.fill()});
 /* قاعدة مسطحة داكنة */
 var bg=c.createLinearGradient(0,base-w*.16,0,base+4);bg.addColorStop(0,'rgba('+bot.map(Math.round).join(',')+',0)');bg.addColorStop(1,'rgba('+bot.map(Math.round).join(',')+','+(.55+dk*.35)+')');c.globalCompositeOperation='source-atop';c.fillStyle=bg;c.fillRect(0,base-w*.16,cw,w*.2);
 c.globalCompositeOperation='destination-out';var cut=c.createLinearGradient(0,base-2,0,base+10);cut.addColorStop(0,'rgba(0,0,0,0)');cut.addColorStop(1,'rgba(0,0,0,1)');c.fillStyle=cut;c.fillRect(0,base-2,cw,ch);
 c.globalCompositeOperation='source-over';
 var out={cv:cv,ox:cw/2,oy:base};CC[key]=out;return out}
/* x,y: منتصف قاعدة الغيمة. w: العرض. dark: 0 أبيض ناصع ... 1 غيمة ممطرة */
ART.cloud=function(c,x,y,w,o){o=o||{};var wb=Math.max(20,Math.round(w/10)*10),C=buildCloud(o.seed||1,wb,o.dark||0,o.tint),s=w/wb;c.save();c.globalAlpha*=o.a==null?1:o.a;c.translate(x,y);c.scale(s,s);c.drawImage(C.cv,-C.ox,-C.oy);c.restore()};
/* المطر من قاعدة الغيمة */
ART.rain=function(c,x,y,w,len,t,o){o=o||{};var n=o.n||Math.round(w/6),r=rng(o.seed||3);c.save();c.lineCap='round';
 for(var i=0;i<n;i++){var px=x-w/2+r()*w,sp=.7+r()*.6,off=((t*900*sp+r()*len)%len);var py=y+off,a=Math.max(0,1-off/len);c.strokeStyle='rgba('+(o.col||'186,214,255')+','+(.25+.55*a)+')';c.lineWidth=1.2+r()*1.2;c.beginPath();c.moveTo(px,py);c.lineTo(px-3*(o.wind||0)-1.5,py+10+r()*8);c.stroke()}
 /* ستارة المطر */var g=c.createLinearGradient(0,y,0,y+len);g.addColorStop(0,'rgba(120,140,170,.28)');g.addColorStop(1,'rgba(120,140,170,0)');c.fillStyle=g;c.beginPath();c.moveTo(x-w*.45,y);c.lineTo(x+w*.45,y);c.lineTo(x+w*.4-(o.wind||0)*20,y+len);c.lineTo(x-w*.5-(o.wind||0)*20,y+len);c.closePath();c.fill();c.restore()};
/* ======================= السماء والشمس ======================= */
ART.sky=function(c,W,H,stops){var g=c.createLinearGradient(0,0,0,H);stops.forEach(function(s,i){g.addColorStop(i/(stops.length-1),s)});c.fillStyle=g;c.fillRect(0,0,W,H)};
ART.sun=function(c,x,y,r,heat,t){heat=heat==null?.5:heat;t=t||0;var hr=r*(2.6+heat*2.2);var g=c.createRadialGradient(x,y,r*.2,x,y,hr);g.addColorStop(0,'rgba(255,253,230,'+(.65+heat*.3)+')');g.addColorStop(.25,'rgba(255,214,102,'+(.35+heat*.35)+')');g.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,hr,0,TAU);c.fill();
 c.save();c.translate(x,y);c.rotate(t*.15);c.globalAlpha=.18+heat*.25;for(var i=0;i<12;i++){c.rotate(TAU/12);var gg=c.createLinearGradient(0,0,0,-hr*1.1);gg.addColorStop(0,'rgba(255,240,180,.9)');gg.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=gg;c.beginPath();c.moveTo(-r*.18,0);c.lineTo(0,-hr*1.1);c.lineTo(r*.18,0);c.fill()}c.restore();
 var d=c.createRadialGradient(x-r*.25,y-r*.25,r*.1,x,y,r);d.addColorStop(0,'#fffef5');d.addColorStop(.6,heat>.7?'#ffd166':'#fff3b0');d.addColorStop(1,heat>.7?'#ff9f43':'#ffe08a');c.fillStyle=d;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()};
/* ======================= التضاريس ======================= */
ART.ridge=function(c,W,yBase,amp,seed,colTop,colBot,yBottom){var r=rng(seed),pts=[],n=26;var f1=.5+r()*2,f2=2+r()*3,p1=r()*6,p2=r()*6;for(var i=0;i<=n;i++){var x=i/n*W;pts.push([x,yBase-amp*(.55*Math.sin(i/n*Math.PI*f1+p1)+.3*Math.sin(i/n*Math.PI*f2+p2)+.15*(r()-.5))])}
 var g=c.createLinearGradient(0,yBase-amp,0,yBottom);g.addColorStop(0,colTop);g.addColorStop(1,colBot);c.fillStyle=g;c.beginPath();c.moveTo(0,yBottom);pts.forEach(function(p){c.lineTo(p[0],p[1])});c.lineTo(W,yBottom);c.closePath();c.fill();return pts};
ART.mountain=function(c,x0,x1,yb,peakX,peakY,o){o=o||{};var r=rng(o.seed||5);var L=[],R=[];var nL=9,nR=9;for(var i=0;i<=nL;i++){var f=i/nL;L.push([lerp(x0,peakX,f),lerp(yb,peakY,Math.pow(f,.9))+(i&&i<nL?(r()-.5)*18:0)])}for(var j=1;j<=nR;j++){var f2=j/nR;R.push([lerp(peakX,x1,f2),lerp(peakY,yb,Math.pow(f2,1.1))+(j<nR?(r()-.5)*18:0)])}
 var pts=L.concat(R);var g=c.createLinearGradient(x0,peakY,x1,yb);g.addColorStop(0,o.light||'#9ca3af');g.addColorStop(.55,o.mid||'#6b7280');g.addColorStop(1,o.dark||'#374151');c.fillStyle=g;c.beginPath();c.moveTo(x0,yb);pts.forEach(function(p){c.lineTo(p[0],p[1])});c.lineTo(x1,yb);c.closePath();c.fill();
 /* جانب الظل */c.save();c.beginPath();c.moveTo(peakX,peakY);R.forEach(function(p){c.lineTo(p[0],p[1])});c.lineTo(peakX+ (x1-peakX)*.15,yb);c.closePath();c.fillStyle='rgba(15,23,42,.28)';c.fill();c.restore();
 /* شقوق صخرية */c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1.5;for(var k=0;k<10;k++){var px=lerp(x0+30,x1-30,r()),py=lerp(peakY+30,yb-10,r());c.beginPath();c.moveTo(px,py);c.lineTo(px+(r()-.5)*30,py+12+r()*18);c.stroke()}
 if(o.snow){var sh=(yb-peakY)*o.snow;c.save();c.beginPath();c.moveTo(x0,yb);pts.forEach(function(p){c.lineTo(p[0],p[1])});c.lineTo(x1,yb);c.closePath();c.clip();var sg=c.createLinearGradient(0,peakY,0,peakY+sh);sg.addColorStop(0,'#ffffff');sg.addColorStop(.8,'#e2e8f0');sg.addColorStop(1,'rgba(226,232,240,0)');c.fillStyle=sg;c.beginPath();c.moveTo(peakX-sh*.9,peakY+sh);for(var q=0;q<=8;q++)c.lineTo(lerp(peakX-sh*.9,peakX+sh*.9,q/8),peakY+sh*(.75+.25*Math.sin(q*1.7)));c.lineTo(peakX,peakY-2);c.closePath();c.fill();c.restore()}
 return pts};
/* أشجار بعيدة */
ART.treeLine=function(c,x0,x1,y,h,col,seed){var r=rng(seed||9);c.fillStyle=col;for(var x=x0;x<x1;x+=6+r()*8){var hh=h*(.5+r()*.6);c.beginPath();c.ellipse(x,y-hh*.55,hh*.32,hh*.55,0,0,TAU);c.fill()}c.fillRect(x0,y-2,x1-x0,6)};
/* قصب البردي */
ART.cattail=function(c,x,y,h,sway,col){var tx=x+sway,ty=y-h;c.strokeStyle=col||'#3f6b2f';c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+sway*.3,y-h*.5,tx,ty);c.stroke();
 c.fillStyle='#5b3a1e';c.save();c.translate(tx-sway*.12,ty+h*.16);c.rotate(sway*.01);c.beginPath();c.ellipse(0,0,3.6,h*.11,0,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.ellipse(-1,-h*.03,1.2,h*.07,0,0,TAU);c.fill();c.restore();
 c.strokeStyle='#4d7c3a';c.lineWidth=1.6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-6,y-h*.4,x-10+sway*.5,y-h*.75);c.stroke()};
/* ماء ومويجات وانعكاس */
ART.water=function(c,W,y0,H,cols,t,o){o=o||{};var g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,cols[0]);g.addColorStop(.5,cols[1]);g.addColorStop(1,cols[2]);c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
 var r=rng(o.seed||11);c.lineCap='round';for(var i=0;i<o.n||i<40;i++){var yy=y0+Math.pow(r(),1.6)*(H-y0),sp=.4+(yy-y0)/(H-y0);var x=((r()*W+t*20*sp)%(W+60))-30,len=8+sp*26;c.strokeStyle='rgba(255,255,255,'+(.08+.18*r())+')';c.lineWidth=1+sp;c.beginPath();c.moveTo(x,yy);c.quadraticCurveTo(x+len/2,yy-1.5*sp,x+len,yy);c.stroke()}
 if(o.sunX!=null){var sg=c.createLinearGradient(0,y0,0,H);sg.addColorStop(0,'rgba(255,240,200,.45)');sg.addColorStop(1,'rgba(255,240,200,0)');c.fillStyle=sg;for(var k=0;k<16;k++){var yy2=y0+k*(H-y0)/16,ww=10+k*4+Math.sin(t*3+k)*5;c.fillRect(o.sunX-ww/2,yy2,ww,2)}}};
/* مقطع أرضي: تربة، صخور مسامية، خزان جوفي */
ART.groundSection=function(c,x,y,w,h,fill,t,o){o=o||{};var r=rng(o.seed||21);
 var g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#6b4f35');g.addColorStop(.18,'#7c5a3a');g.addColorStop(.19,'#a0815c');g.addColorStop(.55,'#8f7350');g.addColorStop(.56,'#6b6460');g.addColorStop(1,'#4b4643');c.fillStyle=g;c.fillRect(x,y,w,h);
 /* حبيبات */for(var i=0;i<w*h/90;i++){var px=x+r()*w,py=y+r()*h,f=(py-y)/h;c.fillStyle=f<.18?'rgba(40,26,14,.35)':f<.55?'rgba(255,240,210,.18)':'rgba(30,30,30,.35)';c.beginPath();c.arc(px,py,f<.55?.9+r()*1.4:1.5+r()*2.5,0,TAU);c.fill()}
 /* حصى في الطبقة المسامية */for(var j=0;j<w/9;j++){var gx=x+r()*w,gy=y+h*(.24+r()*.3);c.fillStyle='rgba(120,98,74,.9)';c.beginPath();c.ellipse(gx,gy,2+r()*4,1.5+r()*3,r()*3,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.15)';c.beginPath();c.arc(gx-1,gy-1,1,0,TAU);c.fill()}
 /* الماء الجوفي داخل المسام */var wl=y+h*.55-(h*.3)*fill;c.save();c.beginPath();c.rect(x,wl,w,y+h*.55-wl);c.clip();var wg=c.createLinearGradient(0,wl,0,y+h*.55);wg.addColorStop(0,'rgba(56,189,248,.55)');wg.addColorStop(1,'rgba(14,116,144,.75)');c.fillStyle=wg;c.fillRect(x,wl,w,y+h*.55-wl);
 c.strokeStyle='rgba(186,230,253,.6)';c.lineWidth=1.2;c.beginPath();for(var k=0;k<=w;k+=6)c.lineTo(x+k,wl+Math.sin(k*.08+t*3)*1.5);c.stroke();c.restore();
 /* طبقة صخرية كتيمة */c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;for(var q=0;q<6;q++){var yy=y+h*(.6+q*.07);c.beginPath();for(var s=0;s<=w;s+=12)c.lineTo(x+s,yy+Math.sin(s*.05+q)*2);c.stroke()}
 return wl};
G.YQART=ART;
})(typeof window!=='undefined'?window:this);
/* ======================= مشهد المختبر الواقعي (خلفية كل التجارب) ======================= */
(function(G){var ART=G.YQART,TAU=Math.PI*2,rng=ART.rng;
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
ART.rr=rr;
/* زجاجيات واقعية: نوع: beaker | flask | bottle | tube | cyl ؛ liq: لون السائل ؛ lv: مستوى 0..1 */
ART.glass=function(c,type,x,y,s,o){o=o||{};c.save();c.translate(x,y);c.scale(s,s);var liq=o.liq||'rgba(56,189,248,.55)',lv=o.lv==null?.5:o.lv;var p=new Path2D();
 if(type==='flask'){p.moveTo(-7,-48);p.lineTo(-7,-20);p.lineTo(-26,12);p.quadraticCurveTo(-32,26,-18,28);p.lineTo(18,28);p.quadraticCurveTo(32,26,26,12);p.lineTo(7,-20);p.lineTo(7,-48);p.closePath()}
 else if(type==='bottle'){p.moveTo(-6,-46);p.lineTo(-6,-36);p.quadraticCurveTo(-18,-32,-18,-20);p.lineTo(-18,24);p.quadraticCurveTo(-18,28,-14,28);p.lineTo(14,28);p.quadraticCurveTo(18,28,18,24);p.lineTo(18,-20);p.quadraticCurveTo(18,-32,6,-36);p.lineTo(6,-46);p.closePath()}
 else if(type==='tube'){p.moveTo(-6,-46);p.lineTo(-6,20);p.arc(0,20,6,Math.PI,0,true);p.lineTo(6,-46);p.closePath()}
 else if(type==='cyl'){p.moveTo(-7,-50);p.lineTo(-7,22);p.lineTo(-14,24);p.lineTo(-14,28);p.lineTo(14,28);p.lineTo(14,24);p.lineTo(7,22);p.lineTo(7,-50);p.closePath()}
 else {p.moveTo(-24,-30);p.lineTo(-22,24);p.quadraticCurveTo(-22,28,-18,28);p.lineTo(18,28);p.quadraticCurveTo(22,28,22,24);p.lineTo(24,-30);p.lineTo(27,-33);p.lineTo(-27,-33);p.closePath()}
 /* ظل على الطاولة */
 if(o.shadow!==false){c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(3,29,type==='tube'?8:24,3.5,0,0,TAU);c.fill()}
 /* جسم زجاجي */
 var g=c.createLinearGradient(-30,0,30,0);g.addColorStop(0,'rgba(200,235,245,.22)');g.addColorStop(.25,'rgba(255,255,255,.05)');g.addColorStop(.7,'rgba(255,255,255,.03)');g.addColorStop(1,'rgba(200,235,245,.2)');c.fillStyle=o.tint||g;c.fill(p);
 /* السائل */
 if(lv>0){c.save();c.clip(p);var top=28-(type==='tube'||type==='cyl'?74:type==='bottle'?60:58)*lv;var lg=c.createLinearGradient(0,top,0,30);lg.addColorStop(0,liq);lg.addColorStop(1,liq);c.fillStyle=lg;c.fillRect(-40,top,80,60);
  c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-40,top,80,1.6);var sh=c.createLinearGradient(-30,0,30,0);sh.addColorStop(0,'rgba(0,0,0,.25)');sh.addColorStop(.35,'rgba(0,0,0,0)');sh.addColorStop(.75,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.3)');c.fillStyle=sh;c.fillRect(-40,top,80,60);c.restore()}
 /* حواف وانعكاسات */
 c.strokeStyle='rgba(220,245,255,.75)';c.lineWidth=1.6;c.stroke(p);
 c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2.2;c.lineCap='round';c.beginPath();if(type==='beaker'||!type){c.moveTo(-17,-24);c.lineTo(-16,20)}else if(type==='flask'){c.moveTo(-3,-44);c.lineTo(-3,-20);c.moveTo(-18,12);c.lineTo(-22,20)}else{c.moveTo(-3,-42);c.lineTo(-3,16)}c.stroke();
 c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=4;c.beginPath();c.moveTo(type==='tube'?3:14,-20);c.lineTo(type==='tube'?3:13,18);c.stroke();
 if(o.marks){c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=.8;for(var i=0;i<6;i++){var yy=20-i*9;c.beginPath();c.moveTo(type==='cyl'?-7:-22,yy);c.lineTo(type==='cyl'?-2:-14,yy);c.stroke()}}
 if(o.label){c.fillStyle='rgba(245,240,225,.92)';rr(c,-13,-6,26,18,2);c.fill();c.fillStyle='#7c2d12';c.font='700 7px Cairo,Tahoma,sans-serif';c.textAlign='center';c.fillText(o.label,0,6)}
 c.restore()};
/* موقد بنزن واقعي */
ART.burner=function(c,x,y,s,flame,t){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(0,2,26,4,0,0,TAU);c.fill();
 var bg=c.createLinearGradient(-22,0,22,0);bg.addColorStop(0,'#1f2937');bg.addColorStop(.5,'#6b7280');bg.addColorStop(1,'#111827');c.fillStyle=bg;rr(c,-22,-8,44,9,3);c.fill();
 var tg=c.createLinearGradient(-6,0,6,0);tg.addColorStop(0,'#78716c');tg.addColorStop(.45,'#e7e5e4');tg.addColorStop(1,'#57534e');c.fillStyle=tg;c.fillRect(-5,-58,10,52);c.fillStyle='#44403c';c.fillRect(-7,-30,14,7);
 if(flame>0){t=t||0;var h=(30+flame*30)*(1+.06*Math.sin(t*23)),fl=c.createLinearGradient(0,-58-h,0,-58);fl.addColorStop(0,'rgba(96,165,250,0)');fl.addColorStop(.35,'rgba(96,165,250,.55)');fl.addColorStop(1,'rgba(30,64,175,.9)');c.fillStyle=fl;c.beginPath();c.moveTo(-6,-58);c.quadraticCurveTo(-9-Math.sin(t*17)*2,-58-h*.5,Math.sin(t*11)*2,-58-h);c.quadraticCurveTo(9,-58-h*.5,6,-58);c.closePath();c.fill();
  c.fillStyle='rgba(165,243,252,.85)';c.beginPath();c.moveTo(-3.5,-58);c.quadraticCurveTo(-4,-58-h*.25,0,-58-h*.38);c.quadraticCurveTo(4,-58-h*.25,3.5,-58);c.fill();
  var gl=c.createRadialGradient(0,-58-h*.4,2,0,-58-h*.4,h);gl.addColorStop(0,'rgba(147,197,253,.25)');gl.addColorStop(1,'rgba(147,197,253,0)');c.fillStyle=gl;c.beginPath();c.arc(0,-58-h*.4,h,0,TAU);c.fill()}
 c.restore()};
var LAB={};
ART.labScene=function(c,W,H,o){o=o||{};var k=W+'x'+H+(o.dpr||1);var cv=LAB[k];
 if(!cv){cv=document.createElement('canvas');var d=o.dpr||1;cv.width=W*d;cv.height=H*d;var g=cv.getContext('2d');g.scale(d,d);var r=rng(17),BY=Math.round(H*.77),SY=Math.round(H*.47);
  /* جدار بلاط داكن مع فواصل */
  var wg=g.createLinearGradient(0,0,0,BY);wg.addColorStop(0,'#10232f');wg.addColorStop(1,'#1d3a47');g.fillStyle=wg;g.fillRect(0,0,W,BY);
  var tw=38,th=19;for(var yy=0,row=0;yy<BY;yy+=th,row++){for(var xx=(row%2)*-tw/2;xx<W;xx+=tw){var v=r()*.05;g.fillStyle='rgba(255,255,255,'+(.025+v)+')';rr(g,xx+1,yy+1,tw-2,th-2,2);g.fill();var hg=g.createLinearGradient(xx,yy,xx,yy+th);hg.addColorStop(0,'rgba(255,255,255,.06)');hg.addColorStop(1,'rgba(0,0,0,.08)');g.fillStyle=hg;g.fill()}}
  g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;for(var y2=0;y2<BY;y2+=th){g.beginPath();g.moveTo(0,y2+.5);g.lineTo(W,y2+.5);g.stroke()}
  /* نافذة ضوء علوية */
  var lx=W/2,lg=g.createRadialGradient(lx,-20,10,lx,40,W*.55);lg.addColorStop(0,'rgba(190,230,255,.32)');lg.addColorStop(.5,'rgba(150,200,235,.08)');lg.addColorStop(1,'rgba(150,200,235,0)');g.fillStyle=lg;g.fillRect(0,0,W,BY);
  g.fillStyle='rgba(225,245,255,.5)';rr(g,lx-120,6,240,6,3);g.fill();var lb=g.createLinearGradient(0,12,0,90);lb.addColorStop(0,'rgba(220,240,255,.16)');lb.addColorStop(1,'rgba(220,240,255,0)');g.fillStyle=lb;g.beginPath();g.moveTo(lx-120,12);g.lineTo(lx+120,12);g.lineTo(lx+200,120);g.lineTo(lx-200,120);g.closePath();g.fill();
  /* رف خشبي بزجاجيات */
  function shelf(x0,x1,y){var sg=g.createLinearGradient(0,y,0,y+8);sg.addColorStop(0,'#8b5e3c');sg.addColorStop(1,'#4a2f1d');g.fillStyle=sg;g.fillRect(x0,y,x1-x0,8);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0,y+8,x1-x0,6);g.fillStyle='#2b2b2b';g.fillRect(x0+10,y+8,4,10);g.fillRect(x1-14,y+8,4,10)}
  shelf(8,150,SY);shelf(W-150,W-8,SY);
  g.globalAlpha=.8;ART.glass(g,'bottle',30,SY-29,.55,{liq:'rgba(180,83,9,.85)',lv:.8,label:'HCl'});ART.glass(g,'flask',62,SY-29,.55,{liq:'rgba(34,197,94,.6)',lv:.4});ART.glass(g,'cyl',92,SY-29,.55,{liq:'rgba(59,130,246,.55)',lv:.6,marks:1});ART.glass(g,'beaker',124,SY-29,.5,{liq:'rgba(244,114,182,.5)',lv:.45});
  ART.glass(g,'beaker',W-128,SY-29,.5,{liq:'rgba(250,204,21,.55)',lv:.5,marks:1});ART.glass(g,'bottle',W-96,SY-29,.55,{liq:'rgba(120,53,15,.9)',lv:.85,label:'NaOH'});ART.glass(g,'tube',W-70,SY-32,.5,{liq:'rgba(168,85,247,.6)',lv:.5});ART.glass(g,'tube',W-58,SY-32,.5,{liq:'rgba(239,68,68,.6)',lv:.65});ART.glass(g,'flask',W-32,SY-29,.55,{liq:'rgba(14,165,233,.5)',lv:.35});g.globalAlpha=1;
  /* سطح طاولة إيبوكسي أسود لامع */
  var bg=g.createLinearGradient(0,BY,0,H);bg.addColorStop(0,'#2a3439');bg.addColorStop(.06,'#141a1d');bg.addColorStop(1,'#0a0e10');g.fillStyle=bg;g.fillRect(0,BY,W,H-BY);
  g.fillStyle='rgba(230,245,250,.28)';g.fillRect(0,BY,W,1.5);
  var rf=g.createLinearGradient(0,BY,0,BY+40);rf.addColorStop(0,'rgba(140,190,215,.12)');rf.addColorStop(1,'rgba(140,190,215,0)');g.fillStyle=rf;g.fillRect(0,BY+2,W,40);
  var sp=g.createRadialGradient(W/2,BY+20,4,W/2,BY+20,W*.45);sp.addColorStop(0,'rgba(200,230,245,.10)');sp.addColorStop(1,'rgba(200,230,245,0)');g.fillStyle=sp;g.fillRect(0,BY,W,H-BY);
  /* حبيبات دقيقة على السطح */for(var i=0;i<380;i++){g.fillStyle='rgba(255,255,255,'+(r()*.05)+')';g.fillRect(r()*W,BY+r()*(H-BY),1,1)}
  /* تظليل الأطراف */
  var vg=g.createRadialGradient(W/2,H*.45,W*.2,W/2,H*.45,W*.72);vg.addColorStop(.5,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,6,10,.42)');g.fillStyle=vg;g.fillRect(0,0,W,H);
  LAB[k]=cv}
 c.drawImage(cv,0,0,W,H)};
})(typeof window!=='undefined'?window:this);
/* ======================= عناصر واقعية عامة للتجارب ======================= */
(function(G){var ART=G.YQART,TAU=Math.PI*2,rng=ART.rng,rr=ART.rr;
function lerp(a,b,t){return a+(b-a)*t}
/* كرة معدنية/ملونة ثلاثية الأبعاد */
ART.ball=function(c,x,y,r,col,o){o=o||{};col=col||'#94a3b8';c.save();if(o.shadow!==false){c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x+r*.2,y+r*1.02,r*.9,r*.22,0,0,TAU);c.fill()}
 var g=c.createRadialGradient(x-r*.38,y-r*.42,r*.06,x,y,r*1.05);g.addColorStop(0,'#ffffff');g.addColorStop(.18,col);g.addColorStop(.8,ART.shade(col,-.45));g.addColorStop(1,ART.shade(col,-.65));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
 c.globalAlpha=.35;c.strokeStyle='#fff';c.lineWidth=r*.08;c.beginPath();c.arc(x,y,r*.82,Math.PI*.15,Math.PI*.55);c.stroke();c.restore()};
ART.shade=function(hex,a){var m=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex);if(!m)return hex;var r=parseInt(m[1],16),g=parseInt(m[2],16),b=parseInt(m[3],16);function f(v){return Math.round(a<0?v*(1+a):v+(255-v)*a)}return 'rgb('+f(r)+','+f(g)+','+f(b)+')'};
/* مكعب خشبي بنسيج حبيبات */
ART.wood=function(c,x,y,w,h,o){o=o||{};c.save();var g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,o.c1||'#c08a55');g.addColorStop(1,o.c2||'#8a5a32');c.fillStyle=g;rr(c,x,y,w,h,Math.min(4,h/5));c.fill();c.clip();var r=rng(o.seed||3);c.strokeStyle='rgba(70,40,20,.35)';c.lineWidth=1;for(var i=0;i<Math.max(4,h/4);i++){var yy=y+r()*h;c.beginPath();c.moveTo(x,yy);for(var k=0;k<=w;k+=8)c.lineTo(x+k,yy+Math.sin(k*.08+i)*1.6);c.stroke()}
 var hl=c.createLinearGradient(x,y,x,y+h);hl.addColorStop(0,'rgba(255,255,255,.25)');hl.addColorStop(.15,'rgba(255,255,255,0)');hl.addColorStop(.85,'rgba(0,0,0,0)');hl.addColorStop(1,'rgba(0,0,0,.3)');c.fillStyle=hl;c.fillRect(x,y,w,h);c.restore()};
/* معدن مصقول (قضيب/صفيحة) */
ART.metal=function(c,x,y,w,h,col,o){o=o||{};col=col||'#9ca3af';c.save();var vert=h>w;var g=vert?c.createLinearGradient(x,0,x+w,0):c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,ART.shade(col,-.4));g.addColorStop(.3,ART.shade(col,.55));g.addColorStop(.55,col);g.addColorStop(1,ART.shade(col,-.55));c.fillStyle=g;rr(c,x,y,w,h,o.r||2);c.fill();c.restore()};
/* بطارية واقعية */
ART.battery=function(c,x,y,w,h,o){o=o||{};c.save();c.translate(x,y);ART.metal(c,-w/2,-h/2,w*.82,h,'#1f2937');var g=c.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,'#b45309');g.addColorStop(.35,'#fbbf24');g.addColorStop(1,'#92400e');c.fillStyle=g;rr(c,w*.12,-h/2,w*.2,h,2);c.fill();ART.metal(c,w*.32,-h*.18,w*.12,h*.36,'#d1d5db');c.fillStyle='#fff';c.font='800 '+Math.round(h*.45)+'px Cairo,Tahoma,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(o.label||'1.5V',-w*.12,1);c.restore()};
/* مصباح زجاجي مع فتيل متوهج */
ART.bulb=function(c,x,y,r,glow){glow=Math.max(0,Math.min(1,glow||0));c.save();if(glow>0){var gg=c.createRadialGradient(x,y,r*.2,x,y,r*(3+glow*3));gg.addColorStop(0,'rgba(255,236,150,'+(.7*glow)+')');gg.addColorStop(1,'rgba(255,200,80,0)');c.fillStyle=gg;c.beginPath();c.arc(x,y,r*(3+glow*3),0,TAU);c.fill()}
 var b=c.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);b.addColorStop(0,glow>0?'rgba(255,255,230,'+(.5+.5*glow)+')':'rgba(255,255,255,.35)');b.addColorStop(1,glow>0?'rgba(255,214,102,'+(.35+.5*glow)+')':'rgba(200,225,235,.12)');c.fillStyle=b;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle='rgba(230,245,255,.7)';c.lineWidth=1.2;c.stroke();
 c.strokeStyle=glow>0?'rgb(255,'+Math.round(180+60*glow)+',120)':'#78716c';c.lineWidth=1.4;c.beginPath();c.moveTo(x-r*.35,y+r*.6);c.lineTo(x-r*.25,y-r*.1);for(var i=0;i<5;i++)c.lineTo(x-r*.2+i*r*.1,y-r*.1+(i%2?-r*.12:0));c.lineTo(x+r*.35,y+r*.6);c.stroke();
 ART.metal(c,x-r*.45,y+r*.8,r*.9,r*.55,'#a8a29e');c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=.8;for(var k=1;k<4;k++){c.beginPath();c.moveTo(x-r*.45,y+r*.8+k*r*.13);c.lineTo(x+r*.45,y+r*.8+k*r*.13);c.stroke()}
 c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(x-r*.4,y-r*.35,r*.14,r*.28,-.5,0,TAU);c.fill();c.restore()};
/* سلك نحاسي */
ART.wire=function(c,pts,o){o=o||{};c.save();c.lineCap='round';c.lineJoin='round';function path(){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1])}
 path();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=(o.w||4)+2;c.stroke();path();c.strokeStyle=o.col||'#b91c1c';c.lineWidth=o.w||4;c.stroke();path();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.stroke();c.restore()};
/* مغناطيس قضيبي */
ART.magnet=function(c,x,y,w,h,rot){c.save();c.translate(x,y);if(rot)c.rotate(rot);[['#dc2626','N',-w/2],['#2563eb','S',0]].forEach(function(a){var g=c.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,ART.shade(a[0],.35));g.addColorStop(.5,a[0]);g.addColorStop(1,ART.shade(a[0],-.45));c.fillStyle=g;c.fillRect(a[2],-h/2,w/2,h);c.fillStyle='#fff';c.font='900 '+Math.round(h*.55)+'px Cairo,Tahoma,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(a[1],a[2]+w/4,1)});c.strokeStyle='rgba(0,0,0,.4)';c.strokeRect(-w/2,-h/2,w,h);c.restore()};
/* نابض معدني */
ART.spring=function(c,x1,y1,x2,y2,coils,r){coils=coils||12;r=r||8;var dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;c.save();c.lineCap='round';
 for(var pass=0;pass<2;pass++){c.beginPath();for(var i=0;i<=coils*16;i++){var t=i/(coils*16),a=t*coils*TAU,px=x1+ux*L*t+nx*Math.sin(a)*r,py=y1+uy*L*t+ny*Math.sin(a)*r,front=Math.cos(a)>0;if(i==0)c.moveTo(px,py);else c.lineTo(px,py)}c.strokeStyle=pass?'rgba(255,255,255,.45)':'#64748b';c.lineWidth=pass?1:3;c.stroke()}c.restore()};
/* نبتة واقعية في أصيص */
ART.plant=function(c,x,y,h,o){o=o||{};var t=o.t||0,health=o.health==null?1:o.health,r=rng(o.seed||4);c.save();
 if(o.pot!==false){var pg=c.createLinearGradient(x-24,0,x+24,0);pg.addColorStop(0,'#7c2d12');pg.addColorStop(.4,'#c2410c');pg.addColorStop(1,'#7c2d12');c.fillStyle=pg;c.beginPath();c.moveTo(x-24,y-30);c.lineTo(x+24,y-30);c.lineTo(x+18,y);c.lineTo(x-18,y);c.closePath();c.fill();c.fillStyle='#9a3412';c.fillRect(x-27,y-34,54,8);c.fillStyle='#3f2a1d';c.beginPath();c.ellipse(x,y-33,23,3.5,0,0,TAU);c.fill();y-=33}
 var green=health>.5?[34,120,40]:[lerp(140,34,health*2),lerp(120,120,health*2),lerp(40,40,health)];var gc='rgb('+green.map(Math.round).join(',')+')';
 var sway=Math.sin(t*1.3)*h*.02;c.strokeStyle='#4d7c0f';c.lineWidth=Math.max(2,h*.04);c.lineCap='round';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+sway*2,y-h*.5,x+sway*3,y-h);c.stroke();
 var n=Math.max(2,Math.round(h/16));for(var i=1;i<=n;i++){var f=i/(n+.5),py=y-h*f,px=x+sway*3*f,side=i%2?1:-1,len=h*.22*(1-f*.4)+6,ang=side*(.6+r()*.3)-sway*.02;
  c.save();c.translate(px,py);c.rotate(ang-Math.PI/2*side*0+(side>0?-.9:.9));var lg=c.createLinearGradient(0,0,len,0);lg.addColorStop(0,ART.shade('#15803d',-.2));lg.addColorStop(1,health>.5?'#4ade80':'#a3a32a');c.fillStyle=lg;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*.5,-len*.35,len,0);c.quadraticCurveTo(len*.5,len*.35,0,0);c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.8;c.beginPath();c.moveTo(0,0);c.lineTo(len*.92,0);c.stroke();c.restore()}
 if(o.flower){c.fillStyle='#facc15';for(var k=0;k<6;k++){c.beginPath();c.ellipse(x+sway*3+Math.cos(k)*6,y-h-2+Math.sin(k)*6,5,3,k,0,TAU);c.fill()}c.fillStyle='#78350f';c.beginPath();c.arc(x+sway*3,y-h-2,3.5,0,TAU);c.fill()}
 c.restore()};
/* كرة أرضية واقعية */
ART.earth=function(c,x,y,r,t){t=t||0;c.save();var ag=c.createRadialGradient(x,y,r*.95,x,y,r*1.18);ag.addColorStop(0,'rgba(125,211,252,.5)');ag.addColorStop(1,'rgba(125,211,252,0)');c.fillStyle=ag;c.beginPath();c.arc(x,y,r*1.18,0,TAU);c.fill();
 c.beginPath();c.arc(x,y,r,0,TAU);c.save();c.clip();var og=c.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);og.addColorStop(0,'#3b82f6');og.addColorStop(1,'#0c2d6b');c.fillStyle=og;c.fillRect(x-r,y-r,2*r,2*r);
 var land=[[-.5,-.35,.32,.22],[-.25,.05,.18,.35],[.25,-.3,.35,.2],[.35,.15,.22,.3],[.1,-.05,.12,.12],[-.65,.4,.15,.1]],off=(t*.05)%2;
 land.forEach(function(L,i){var lx=x+((L[0]+off+1)%2-1)*r*1.2,ly=y+L[1]*r;var lg=c.createRadialGradient(lx,ly,1,lx,ly,r*L[2]);lg.addColorStop(0,'#a3b86c');lg.addColorStop(.6,'#4d7c3a');lg.addColorStop(1,'#3f6b2f');c.fillStyle=lg;c.beginPath();for(var k=0;k<=12;k++){var a=k/12*TAU,rad=1+.25*Math.sin(a*3+i)+.15*Math.cos(a*5+i*2);c.lineTo(lx+Math.cos(a)*r*L[2]*rad,ly+Math.sin(a)*r*L[3]*rad)}c.fill()});
 c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.ellipse(x,y-r*.95,r*.55,r*.12,0,0,TAU);c.fill();c.beginPath();c.ellipse(x,y+r*.96,r*.5,r*.1,0,0,TAU);c.fill();
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=r*.05;c.lineCap='round';for(var j=0;j<6;j++){var cx2=x+((j*.37+t*.03)%1.6-.8)*r,cy2=y+(j*.29%1-.5)*r*1.4;c.beginPath();c.arc(cx2,cy2,r*.25,-.6,.8);c.stroke()}
 var sh=c.createLinearGradient(x-r,y-r,x+r,y+r);sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(.55,'rgba(0,0,0,.05)');sh.addColorStop(1,'rgba(0,0,10,.6)');c.fillStyle=sh;c.fillRect(x-r,y-r,2*r,2*r);c.restore();c.restore()};
/* أرنب وثعلب واقعيان (منظر جانبي) */
ART.rabbit=function(c,x,y,s,t,dir){t=t||0;c.save();c.translate(x,y);c.scale(s*(dir<0?-1:1),s);var hop=Math.abs(Math.sin(t*6))*4;c.translate(0,-hop);
 c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,10+hop,12,2.5,0,0,TAU);c.fill();
 var g=c.createRadialGradient(-3,-4,2,0,0,14);g.addColorStop(0,'#d6c3a5');g.addColorStop(1,'#8a6f50');c.fillStyle=g;c.beginPath();c.ellipse(-2,0,12,9,0,0,TAU);c.fill();c.beginPath();c.ellipse(9,-6,6,5,.2,0,TAU);c.fill();
 c.fillStyle='#a08463';c.beginPath();c.ellipse(8,-15,2.2,7,-.25,0,TAU);c.fill();c.beginPath();c.ellipse(11,-14,2,6.5,.15,0,TAU);c.fill();c.fillStyle='#e8b4a8';c.beginPath();c.ellipse(8,-15,1,5,-.25,0,TAU);c.fill();
 c.fillStyle='#fff';c.beginPath();c.arc(-13,-2,3.5,0,TAU);c.fill();c.fillStyle='#111';c.beginPath();c.arc(11,-7,1.2,0,TAU);c.fill();c.fillStyle='#8a6f50';c.beginPath();c.ellipse(-6,8,6,3,0,0,TAU);c.fill();c.restore()};
ART.fox=function(c,x,y,s,t,dir){t=t||0;c.save();c.translate(x,y);c.scale(s*(dir<0?-1:1),s);var st=Math.sin(t*8);
 c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,14,20,3,0,0,TAU);c.fill();
 c.strokeStyle='#3b2416';c.lineWidth=2.6;c.lineCap='round';[[-10,st],[-6,-st],[8,-st],[12,st]].forEach(function(l){c.beginPath();c.moveTo(l[0],2);c.lineTo(l[0]+l[1]*3,13);c.stroke()});
 var g=c.createLinearGradient(0,-10,0,8);g.addColorStop(0,'#e0702a');g.addColorStop(1,'#a3461a');c.fillStyle=g;c.beginPath();c.ellipse(0,-1,16,7.5,0,0,TAU);c.fill();
 c.beginPath();c.moveTo(-14,-2);c.quadraticCurveTo(-30,-8+st*2,-34,2);c.quadraticCurveTo(-26,6,-14,3);c.fill();c.fillStyle='#fff';c.beginPath();c.moveTo(-30,-2+st);c.quadraticCurveTo(-34,0,-34,2);c.quadraticCurveTo(-31,3,-29,2);c.fill();
 c.fillStyle='#e0702a';c.beginPath();c.moveTo(12,-6);c.lineTo(24,-4);c.lineTo(17,3);c.closePath();c.fill();c.beginPath();c.ellipse(15,-6,6,5,0,0,TAU);c.fill();
 c.beginPath();c.moveTo(13,-10);c.lineTo(14,-17);c.lineTo(17,-10);c.fill();c.beginPath();c.moveTo(17,-10);c.lineTo(19,-16);c.lineTo(20,-9);c.fill();
 c.fillStyle='#f5f5f4';c.beginPath();c.moveTo(14,-2);c.lineTo(23,-3);c.lineTo(16,2);c.fill();c.fillStyle='#111';c.beginPath();c.arc(24,-4,1.2,0,TAU);c.fill();c.beginPath();c.arc(17,-7,1,0,TAU);c.fill();c.restore()};
/* عشب واقعي على خط */
ART.grass=function(c,x0,x1,y,h,t,col,seed){var r=rng(seed||6);c.save();c.lineCap='round';for(var x=x0;x<x1;x+=2.2){var hh=h*(.5+r()*.7),sw=Math.sin(t*1.5+x*.05)*hh*.15;c.strokeStyle=col||('rgba('+(40+r()*40|0)+','+(110+r()*60|0)+','+(30+r()*30|0)+',.9)');c.lineWidth=1+r();c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+sw*.5,y-hh*.5,x+sw,y-hh);c.stroke()}c.restore()};
})(typeof window!=='undefined'?window:this);
