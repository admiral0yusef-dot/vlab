
/* ==========================================================================
   وكيل المعلم VLab — وكيل يعمل داخل الموقع بحلقة OODA (ملاحظة، توجيه، قرار، تنفيذ)
   الطالب: يقرأ نشاطه الحقيقي (التجارب التي فتحها، إجاباته، بنك الأسئلة، لعبة 3D)، يقدّر إتقانه
   لكل وحدة، ثم يقرر وينفّذ: سؤال تشخيصي، أو يفتح التجربة المناسبة، أو تدريب، أو ينقله لتحدٍّ.
   المعلم: يستورد تقارير طلابه، يكتشف الوحدة الأضعف والمجموعات، ويجهز خطة واختباراً وتقريراً.
   الأستاذ يوسف القاق · VLab
   ========================================================================== */
(function(){
var $=function(i){return document.getElementById(i)},KEY='yq_agent_v1',GN={1:'الأول',2:'الثاني',3:'الثالث',4:'الرابع',5:'الخامس',6:'السادس',7:'السابع',8:'الثامن',9:'التاسع',10:'العاشر',11:'الحادي عشر',12:'الثاني عشر'};
var SUB={bio:'الأحياء',chem:'الكيمياء',phys:'الفيزياء',earth:'علوم الأرض'},SUBX={sci:'العلوم'};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var ST={name:'',g:0,s:'',ev:[],m:{},vis:{},pend:null,log:[],sess:0,t0:Date.now()};
try{Object.assign(ST,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
ST.use=ST.use||{first:Date.now(),days:{},exp:0,ans:0,dec:0,plans:0};
function bump(k){ST.use[k]=(ST.use[k]||0)+1;var d=new Date().toISOString().slice(0,10);ST.use.days[d]=1;track(k)}
/* ربط اختياري بأداة إحصاءات: ضع رمز GoatCounter في YQ_ANALYTICS_GC داخل الصفحة لتجميع أرقام كل الطلاب */
function track(k){try{var gc=window.YQ_ANALYTICS_GC;if(!gc)return;if(!window.goatcounter||!window.goatcounter.count){if(!document.getElementById('yqGC')){var sc=document.createElement('script');sc.id='yqGC';sc.async=1;sc.src='https://gc.zgo.at/count.js';sc.setAttribute('data-goatcounter','https://'+gc+'.goatcounter.com/count');sc.setAttribute('data-goatcounter-settings','{"no_onload":true}');document.head.appendChild(sc)}return}window.goatcounter.count({path:'agent-'+k,title:'VLab agent '+k,event:true})}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}
function gEx(){try{return E}catch(e){return []}}
function gOk(eg,g){eg=+eg;return eg===g||(eg===910&&(g===9||g===10))}
function ukey(u){u=String(u||'');var m=u.match(/الوحدة\s*(\d+)/);if(m)return m[1];return /إثرائية|إضافية/.test(u)?'x':'0'}
function ulabel(u,g,k){u=String(u||'').replace(/^[^؀-ۿ\w]+/,'').replace(/^.*?—\s*/,'');if(k==='x')return 'موضوعات إثرائية';if(k==='0')return 'موضوعات عامة';return u}
/* الوحدات وتجاربها للصف والمادة */
function units(g,s){var U=window.YQ_UNITS||[],X=gEx(),m={},o=[];for(var i=0;i<X.length;i++){var e=X[i];if(!gOk(e[0],g)||(g>8&&s&&e[1]!==s))continue;var sb=g<=8?'sci':e[1],k=sb+'|'+ukey(U[i]);if(!m[k]){m[k]={k:k,g:g,s:sb,u:ukey(U[i]),l:ulabel(U[i],g,ukey(U[i])),ex:[]};o.push(m[k])}m[k].ex.push({sig:e[0]+'|'+e[2],n:e[2],i:i})}
 return o.filter(function(x){return x.ex.length})}
var QC={};function qpool(g,s,u){var k=g+'|'+s+'|'+u;if(QC[k])return QC[k];var A=window.YQ_UNITQUIZ,out=[];try{var r=A.pool(g,g<=8?null:s,u);(r.all||[]).forEach(function(x){if(!x||!x.o||x.o.length<2)return;var c=x.o[x.a];if(c==null)return;out.push([x.q,c].concat(x.o.filter(function(o,i){return i!==x.a})))})}catch(e){}if(out.length)QC[k]=out;return out}
function mk(key){return ST.m[key]||(ST.m[key]={n:0,ok:0})}
function pOf(key){var x=ST.m[key];return x?(x.ok+1)/(x.n+2):.5}
function band(p,n){return n===0?'un':p<.5?'lo':p<.75?'mi':'hi'}
function pct(p){return Math.round(p*100)}
function mkey(u){return u.g+'|'+u.k}
function log(ph,t){if(ph==='D')bump('dec');ST.log.unshift({ph:ph,t:t,at:Date.now()});if(ST.log.length>80)ST.log.length=80;save();renderLog()}
function expUrl(sig){var M=window.YQ_EXPSLUG||{};return M[sig]?'/exp/'+encodeURIComponent(M[sig])+'/':'/?exp='+encodeURIComponent(sig)}
function openExp(sig){var cs=document.querySelectorAll('#cards > .card');for(var i=0;i<cs.length;i++){if(cs[i].getAttribute('data-sig')===sig){cs[i].click();try{scrollTo(0,0)}catch(e){}return true}}location.href=expUrl(sig);return false}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
/* ---------- مراقبة النشاط الحقيقي: زيارات التجارب ---------- */
var curVis=null;
setInterval(function(){var l=$('lab'),vis=!!(l&&l.style.display!=='none'&&l.offsetParent!==null),sig=null;try{sig=cur?cur[0]+'|'+cur[2]:null}catch(e){}
 if(vis&&sig){if(!curVis||curVis.sig!==sig){endVisit();curVis={sig:sig,t:Date.now()}}}else if(curVis){endVisit()}},1000);
function endVisit(){if(!curVis)return;var d=Math.round((Date.now()-curVis.t)/1000),sig=curVis.sig;curVis=null;if(d<5)return;
 var v=ST.vis[sig]||(ST.vis[sig]={n:0,sec:0});v.n++;v.sec+=d;bump('exp');ST.ev.push({k:'exp',sig:sig,sec:d,at:Date.now()});if(ST.ev.length>600)ST.ev=ST.ev.slice(-600);
 var g=+sig.split('|')[0],X=gEx(),U=window.YQ_UNITS||[],ui=-1;for(var i=0;i<X.length;i++){if(X[i][0]+'|'+X[i][2]===sig){ui=i;break}}
 if(ui>=0&&d>=25){var sb=g<=8?'sci':X[ui][1];if(g===910)g=ST.g===10?10:9;var u={g:g,s:sb,u:ukey(U[ui]),k:sb+'|'+ukey(U[ui]),l:ulabel(U[ui],g,ukey(U[ui]))};if(qpool(g,u.s,u.u).length){ST.pend={u:u,from:sig.split('|')[1],at:Date.now()};
  log('O','أنهى الطالب تجربة «'+sig.split('|')[1]+'» بعد '+d+' ثانية.');log('D','سؤالا تحقّق من وحدة «'+u.l+'» للتأكد من فهم التجربة.');save();toast(u,sig.split('|')[1])}}save()}
function toast(u,exName){var o=document.querySelector('.ag-toast');if(o)o.remove();var t=document.createElement('div');t.className='ag-toast';
 t.innerHTML='<span>🤖 <b>وكيل المعلم:</b> لنتحقّق ممّا تعلّمته في «'+esc(exName)+'» بسؤالين سريعين.</span><button style="background:#4ade80;color:#052e16" id="agTgo">ابدأ</button><button style="background:#ffffff22;color:#fff" id="agTx">لاحقاً</button>';
 document.body.appendChild(t);$('agTgo').onclick=function(){t.remove();go('ag');setTab('stu');setTimeout(function(){step()},150)};$('agTx').onclick=function(){t.remove()};setTimeout(function(){if(t.parentNode)t.remove()},14000)}
/* ---------- قراءة مصادر أخرى: بنك أسئلة التوجيهي ولعبة 3D ---------- */
function extSignals(){var out=[];try{var r=JSON.parse(localStorage.getItem('yq_qb_records')||'[]');r.forEach(function(x){out.push('امتحان بنك الأسئلة: '+x.pct+'%')})}catch(e){}
 try{var j=JSON.parse(localStorage.getItem('jg_save_v1')||'null');if(j&&j.save&&j.save.log)out.push('لعبة مختبر الأردن 3D: '+j.save.log.length+' تحدياً كيميائياً')}catch(e){}return out}
/* ---------- سياسة القرار (الوكيل) ---------- */
var QS=null;
function choose(){var U=units(ST.g,ST.s);if(!U.length)return null;var best=null,bs=9;U.forEach(function(u){var x=ST.m[mkey(u)]||{n:0},p=pOf(mkey(u)),sc=p-.45*Math.sqrt(1/(x.n+1));if(!qpool(ST.g,u.s,u.u).length)sc+=2;if(sc<bs){bs=sc;best=u}});return best}
function step(){
 if(!ST.g){render();return}
 var u,why;
 if(ST.pend&&Date.now()-ST.pend.at<36e5){u=ST.pend.u;ST.pend=null;why='تحقّق بعد التجربة';u=units(ST.g,ST.s).find(function(x){return x.k===u.k})||u;startQ(u,2,why);return}
 log('O','قرأ الوكيل سجل الطالب: '+ST.ev.filter(function(e){return e.k==='q'}).length+' إجابة و'+Object.keys(ST.vis).length+' تجربة مفتوحة'+(extSignals().length?' + '+extSignals().join('، '):'')+'.');
 u=choose();if(!u){log('R','لا توجد وحدات بأسئلة لهذا الصف والمادة بعد.');render();return}
 var key=mkey(u),x=ST.m[key]||{n:0,ok:0},p=pOf(key);
 log('R','الوحدة الأولى بالاهتمام: «'+u.l+'» (إتقان تقديري '+pct(p)+'% من '+x.n+' إجابة).');
 if(x.n<2){log('D','سؤالان تشخيصيان لأن الأدلة في هذه الوحدة غير كافية.');startQ(u,2,'تشخيص');return}
 if(p<.6){var ex=u.ex.slice().sort(function(a,b){return((ST.vis[a.sig]||{n:0}).n)-((ST.vis[b.sig]||{n:0}).n)})[0];
  log('D','تجربة «'+ex.n+'» لأن الإتقان منخفض وأفضل علاج هو التجريب، ثم أسئلة تحقّق بعدها.');log('A','فتح الوكيل التجربة للطالب.');save();QS=null;renderStu('<div class="ag-fb">🔬 قرّر الوكيل أن تجرّب أولاً: <b>'+esc(ex.n)+'</b>. ستفتح الآن، وعند إنهائها سيسألك سؤالين للتحقّق.</div>');setTimeout(function(){openExp(ex.sig)},900);return}
 if(p<.8){log('D','تدريب بثلاثة أسئلة في «'+u.l+'» لرفع الإتقان فوق 80%.');startQ(u,3,'تدريب');return}
 log('D','«'+u.l+'» متقنة. ينتقل الطالب إلى تحدٍّ.');startQ(u,2,'تحدٍّ')}
function startQ(u,n,why){var pool=shuf(qpool(u.g||ST.g,u.s,u.u));if(!pool.length){renderStu('<div class="ag-fb">لا توجد أسئلة لهذه الوحدة بعد.</div>');return}
 QS={u:u,list:pool.slice(0,n),i:0,ok:0,why:why,ans:-1,ops:null};log('A','عرض الوكيل '+QS.list.length+' سؤال ('+why+') من «'+u.l+'».');showQ()}
function showQ(){var q=QS.list[QS.i];QS.ops=shuf(q.slice(1).map(function(o,k){return{o:o,c:k===0}}));QS.ans=-1;renderStu()}
function answer(k){if(QS.ans>=0)return;QS.ans=k;var ok=QS.ops[k].c,key=mkey(QS.u),m=mk(key),b=pOf(key);m.n++;if(ok){m.ok++;QS.ok++}
 ST.ev.push({k:'q',key:key,ok:ok,at:Date.now()});bump('ans');log('O','إجابة '+(ok?'صحيحة':'خاطئة')+' في «'+QS.u.l+'».');log('R','تحديث الإتقان: '+pct(b)+'% ← '+pct(pOf(key))+'%.');save();renderStu()}
function nextQ(){QS.i++;if(QS.i<QS.list.length){showQ();return}var u=QS.u,p=pOf(mkey(u));log('A','انتهت المجموعة: '+QS.ok+'/'+QS.list.length+'. الإتقان الآن '+pct(p)+'%.');
 var msg=p>=.8?'ممتاز! أتقنت هذه الوحدة. اضغط «القرار التالي» لينقلك الوكيل إلى الوحدة التالية.':(p<.6?'سيقترح عليك الوكيل تجربة في هذه الوحدة لتثبيت الفهم.':'أنت تتقدّم. استمر مع الوكيل.');QS=null;renderStu('<div class="ag-fb">'+msg+'</div>')}
/* ---------- خطة أسبوعية تلقائية ---------- */
function weekPlan(){var U=units(ST.g,ST.s).filter(function(u){return qpool(ST.g,u.s,u.u).length||u.ex.length}).sort(function(a,b){return pOf(mkey(a))-pOf(mkey(b))}).slice(0,5),D=['اليوم 1','اليوم 2','اليوم 3','اليوم 4','اليوم 5'];
 return U.map(function(u,i){var ex=u.ex.slice().sort(function(a,b){return((ST.vis[a.sig]||{n:0}).n)-((ST.vis[b.sig]||{n:0}).n)}).slice(0,2),p=pOf(mkey(u)),x=ST.m[mkey(u)]||{n:0};
  return '<div class="ag-day"><b>'+D[i]+' · <span class="ag-chip '+band(p,x.n)+'">'+(x.n?pct(p)+'%':'جديد')+'</span></b>'+esc(u.l)+'<br>'+ex.map(function(e){return '🔬 <a href="'+expUrl(e.sig)+'" data-sig="'+esc(e.sig)+'" class="ag-ex">'+esc(e.n)+'</a>'}).join('<br>')+'<br>📝 '+(x.n<2?'سؤالان تشخيصيان':p<.8?'3 أسئلة تدريب':'سؤالا تحدٍّ')+' (~'+Math.round(8+(1-p)*14)+' دقيقة)</div>'}).join('')}
/* ---------- العرض: الطالب ---------- */
var TAB='stu';
function setTab(t){TAB=t;render()}
function render(){var r=$('agRoot');if(!r)return;
 r.innerHTML='<div class="ag-hero"><svg class="ag-ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="#ffffff33" stroke-width="5"/><path d="M22 4A18 18 0 0 1 40 22" fill="none" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round"/><path d="M40 22A18 18 0 0 1 22 40" fill="none" stroke="#fde047" stroke-width="5" stroke-linecap="round"/><path d="M22 40A18 18 0 0 1 4 22" fill="none" stroke="#fca5a5" stroke-width="5" stroke-linecap="round"/><path d="M4 22A18 18 0 0 1 22 4" fill="none" stroke="#86efac" stroke-width="5" stroke-linecap="round"/></svg><div style="flex:1;min-width:220px"><h2>🤖 وكيل المعلم</h2><p>وكيل ذكي يعمل داخل المختبر: يلاحظ نشاط الطالب الحقيقي، يقدّر إتقانه لكل وحدة، ثم يقرّر وينفّذ بنفسه: سؤال تشخيصي، أو يفتح التجربة المناسبة، أو تدريب، أو تحدٍّ. وللمعلم: يحلّل تقارير الصف ويجهّز الخطة والاختبار والتقرير.</p></div></div>'+
 '<div class="ag-tabs"><button data-t="stu" class="'+(TAB==='stu'?'on':'')+'">👩‍🎓 وكيل الطالب</button><button data-t="tch" class="'+(TAB==='tch'?'on':'')+'">👨‍🏫 لوحة المعلم</button></div><div id="agBody"></div>';
 r.querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){setTab(b.dataset.t)}});
 if(TAB==='stu')renderStu();else renderTch()}
function renderStu(msg){var b=$('agBody');if(!b||TAB!=='stu')return;
 var gs=[1,2,3,4,5,6,7,8,9,10,11,12],U=ST.g?units(ST.g,ST.s):[];
 var h='<div class="ag-grid"><div><div class="ag-box"><h3>ملف الطالب</h3><div class="ag-row"><input type="text" id="agName" placeholder="اسم الطالب" value="'+esc(ST.name)+'"><select id="agG"><option value="0">اختر الصف</option>'+gs.map(function(g){return '<option value="'+g+'"'+(ST.g===g?' selected':'')+'>الصف '+GN[g]+'</option>'}).join('')+'</select><select id="agS"><option value="">كل المواد</option>'+Object.keys(SUB).map(function(s){return '<option value="'+s+'"'+(ST.s===s?' selected':'')+'>'+SUB[s]+'</option>'}).join('')+'</select></div>'+
  '<div class="ag-row" style="margin-top:10px"><button class="ag-btn" id="agStep"'+(ST.g?'':' disabled')+'>▶ '+(ST.log.length?'القرار التالي':'ابدأ جلسة مع الوكيل')+'</button><button class="ag-btn alt" id="agExp">⬇ أرسل تقريري للمعلم</button><button class="ag-btn alt" id="agReset">↺ صفّر بياناتي</button></div>'+
  '<p class="ag-note">يعمل الوكيل على نشاطك الحقيقي في هذا الجهاز: '+Object.keys(ST.vis).length+' تجربة فتحتها، '+ST.ev.filter(function(e){return e.k==='q'}).length+' إجابة'+(extSignals().length?'، و'+extSignals().join('، '):'')+'. لا تُرسل بياناتك لأي جهة.</p></div>';
 if(msg)h+='<div class="ag-box">'+msg+'</div>';
 if(QS){var q=QS.list[QS.i];h+='<div class="ag-box"><div class="ag-row"><span class="ag-chip">'+esc(QS.why)+'</span><span class="ag-chip">'+esc(QS.u.l)+'</span><span class="ag-note">السؤال '+(QS.i+1)+' من '+QS.list.length+'</span></div><div class="ag-q">'+esc(q[0])+'</div><div class="ag-ops">'+QS.ops.map(function(o,k){var c='ag-op';if(QS.ans>=0){if(o.c)c+=' ok';else if(k===QS.ans)c+=' no'}return '<button class="'+c+'" data-k="'+k+'"'+(QS.ans>=0?' disabled':'')+'>'+esc(o.o)+'</button>'}).join('')+'</div>'+
  (QS.ans>=0?'<div class="ag-fb">'+(QS.ops[QS.ans].c?'✔ إجابة صحيحة.':'✖ الإجابة الصحيحة: <b>'+esc(q[1])+'</b>.')+'</div><div style="margin-top:10px"><button class="ag-btn" id="agNext">'+(QS.i+1<QS.list.length?'السؤال التالي ←':'إنهاء المجموعة')+'</button></div>':'')+'</div>'}
 if(ST.g){h+='<div class="ag-box"><h3>خريطة الإتقان — الصف '+GN[ST.g]+(ST.s&&ST.g>8?' · '+SUB[ST.s]:'')+'</h3><div class="ag-bars">'+U.map(function(u){var x=ST.m[mkey(u)]||{n:0},p=pOf(mkey(u));return '<div class="ag-bar"><span class="t">'+(ST.s&&ST.g>8?'':'<small style="color:#587069">'+(SUB[u.s]||SUBX[u.s])+' · </small>')+esc(u.l)+'</span><span class="b '+band(p,x.n)+'"><i style="width:'+(x.n?pct(p):4)+'%"></i></span><span class="n">'+(x.n?pct(p)+'%':'—')+'</span></div>'}).join('')+'</div><p class="ag-note">«—» تعني أن الوكيل لم يجمع أدلة بعد في هذه الوحدة.</p></div>'+
  '<div class="ag-box"><h3>خطة الوكيل لك هذا الأسبوع</h3><p class="ag-note">تتغيّر الخطة تلقائياً بعد كل إجابة وكل تجربة.</p><div class="ag-plan">'+weekPlan()+'</div></div>'}
 h+='</div><aside class="ag-box ag-log"><h3>سجل قرارات الوكيل</h3><p class="ag-note">حلقة العمل: ملاحظة ← توجيه ← قرار ← تنفيذ</p><ol id="agLog"></ol></aside></div>';
 b.innerHTML=h;renderLog();
 $('agName').onchange=function(){ST.name=this.value.trim();save()};$('agG').onchange=function(){ST.g=+this.value;QS=null;save();log('O','حدّد الطالب صفه: '+(GN[ST.g]||''));renderStu()};$('agS').onchange=function(){ST.s=this.value;QS=null;save();renderStu()};
 $('agStep').onclick=function(){step()};$('agExp').onclick=exportMe;
 $('agReset').onclick=function(){if(this.dataset.c){ST.ev=[];ST.m={};ST.vis={};ST.log=[];ST.pend=null;QS=null;save();renderStu()}else{this.dataset.c=1;this.textContent='اضغط مرة أخرى للتأكيد'}};
 b.querySelectorAll('.ag-op').forEach(function(x){x.onclick=function(){answer(+x.dataset.k)}});if($('agNext'))$('agNext').onclick=nextQ;
 b.querySelectorAll('.ag-ex').forEach(function(a){a.onclick=function(e){e.preventDefault();log('A','فتح الطالب تجربة من خطة الوكيل: «'+a.textContent+'».');openExp(a.dataset.sig)}})}
function renderLog(){var o=$('agLog');if(!o)return;var N={O:'ملاحظة',R:'توجيه',D:'قرار',A:'تنفيذ'};o.innerHTML=ST.log.slice(0,40).map(function(e){return '<li><span class="ag-ph ph-'+e.ph+'">'+N[e.ph]+'</span><span>'+esc(e.t)+'</span></li>'}).join('')||'<li><span></span><span class="ag-note">اضغط «ابدأ جلسة مع الوكيل».</span></li>'}
function dl(name,text,type){try{var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:type||'text/plain;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500)}catch(e){}}
function exportMe(){var U=ST.g?units(ST.g,ST.s):[];var rep={format:'VLab-Agent-Student-1',name:ST.name||'طالب',grade:ST.g,subject:ST.s,date:new Date().toISOString(),
  units:U.map(function(u){var x=ST.m[mkey(u)]||{n:0,ok:0};return{key:mkey(u),label:u.l,subject:u.s,answered:x.n,correct:x.ok,mastery:x.n?pct(pOf(mkey(u))):null}}),
  experiments:Object.keys(ST.vis).map(function(s){return{name:s.split('|')[1],grade:+s.split('|')[0],visits:ST.vis[s].n,seconds:ST.vis[s].sec}}),answers:ST.ev.filter(function(e){return e.k==='q'}).length,decisions:ST.log.length,usage:ST.use};
 dl('VLab-agent-'+(ST.name||'student').replace(/[^\w؀-ۿ]+/g,'_')+'.json',JSON.stringify(rep,null,1),'application/json');log('A','صدّر الوكيل تقرير الطالب ليرسله إلى المعلم.')}
/* ---------- لوحة المعلم ---------- */
var CL={g:0,s:'',stu:[],demo:false,out:''};
function demoClass(g,s){var U=units(g,s).filter(function(u){return qpool(g,u.s,u.u).length}),N=['ليث','سارة','عمر','لين','يزن','ريم','حمزة','جود','طارق','مها','آدم','دانة'];
 function h(i,j){var x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x)}
 return N.map(function(n,i){var m={};U.forEach(function(u,j){m[mkey(u)]=Math.max(8,Math.min(97,Math.round(40+(j%3)*12+(h(i,j)-.5)*60)))});return{name:n+' (تجريبي)',m:m}})}
function cModel(){var U=units(CL.g,CL.s).filter(function(u){return CL.stu.some(function(st){return st.m[mkey(u)]!=null})});var av=U.map(function(u){var v=CL.stu.map(function(st){return st.m[mkey(u)]}).filter(function(x){return x!=null});return{u:u,v:v.reduce(function(a,b){return a+b},0)/Math.max(1,v.length)}}).sort(function(a,b){return a.v-b.v});
 var w=av[0];var risk=w?CL.stu.filter(function(st){return st.m[mkey(w.u)]!=null&&st.m[mkey(w.u)]<45}):[];var strong=w?CL.stu.filter(function(st){return st.m[mkey(w.u)]>=75}):[];
 var all=[];CL.stu.forEach(function(st){Object.keys(st.m).forEach(function(k){if(st.m[k]!=null)all.push(st.m[k])})});return{U:U,av:av,w:w,risk:risk,strong:strong,overall:all.length?all.reduce(function(a,b){return a+b},0)/all.length:0}}
function renderTch(){var b=$('agBody');if(!b)return;var gs=[1,2,3,4,5,6,7,8,9,10,11,12];
 var h='<div class="ag-grid"><div><div class="ag-box"><h3>بيانات الصف</h3><div class="ag-row"><select id="tcG"><option value="0">اختر الصف</option>'+gs.map(function(g){return '<option value="'+g+'"'+(CL.g===g?' selected':'')+'>الصف '+GN[g]+'</option>'}).join('')+'</select><select id="tcS"><option value="">كل المواد</option>'+Object.keys(SUB).map(function(s){return '<option value="'+s+'"'+(CL.s===s?' selected':'')+'>'+SUB[s]+'</option>'}).join('')+'</select></div>'+
  '<div class="ag-row" style="margin-top:10px"><label class="ag-btn alt" style="display:inline-block">⬆ استيراد تقارير الطلاب<input type="file" id="tcF" accept=".json,.txt" multiple hidden></label><button class="ag-btn alt" id="tcDemo"'+(CL.g?'':' disabled')+'>صف تجريبي</button><button class="ag-btn" id="tcRun"'+(CL.stu.length?'':' disabled')+'>▶ شغّل الوكيل على الصف</button></div>'+
  '<p class="ag-note">كل طالب يضغط «أرسل تقريري للمعلم» في وكيل الطالب ويرسل الملف، ثم تستورد ملفات الصف كلها هنا دفعة واحدة. '+(CL.stu.length?'<b>'+CL.stu.length+' طالباً محمّلاً'+(CL.demo?' (بيانات تجريبية للعرض)':'')+'.</b>':'')+'</p></div>';
 if(CL.ran&&CL.stu.length){var M=cModel();
  h+='<div class="ag-box"><div class="ag-kpis"><div class="ag-kpi"><small>متوسط الصف</small><b>'+Math.round(M.overall)+'%</b></div><div class="ag-kpi"><small>أضعف وحدة</small><b style="font-size:15px;line-height:1.5">'+(M.w?esc(M.w.u.l)+' · '+Math.round(M.w.v)+'%':'—')+'</b></div><div class="ag-kpi"><small>يحتاجون دعماً</small><b>'+M.risk.length+' / '+CL.stu.length+'</b></div><div class="ag-kpi"><small>جاهزون للإثراء</small><b>'+M.strong.length+' / '+CL.stu.length+'</b></div></div></div>'+
  '<div class="ag-box"><h3>خريطة إتقان الصف (%)</h3><div class="ag-heat"><table><thead><tr><th>الطالب</th>'+M.U.map(function(u){return '<th>'+esc(u.l)+'</th>'}).join('')+'</tr></thead><tbody>'+CL.stu.map(function(st){return '<tr><td>'+esc(st.name)+'</td>'+M.U.map(function(u){var v=st.m[mkey(u)];return v==null?'<td>—</td>':'<td class="'+(v<45?'lo':v<70?'mi':'hi')+'">'+v+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div></div>'+
  '<div class="ag-box"><h3>ما قرّره الوكيل</h3>'+(M.w?'<p style="margin:0 0 6px;line-height:1.9">أضعف وحدة في الصف <b>'+esc(M.w.u.l)+'</b> بمتوسط '+Math.round(M.w.v)+'%. قرّر الوكيل حصة علاجية عليها مع مجموعتي دعم وإثراء، واقترح التجارب: '+M.w.u.ex.slice(0,3).map(function(e){return '<a class="ag-link" href="'+expUrl(e.sig)+'" target="_blank">'+esc(e.n)+'</a>'}).join('، ')+'.</p><p style="margin:0"><span class="ag-chip lo">مجموعة الدعم</span> '+(M.risk.map(function(s){return esc(s.name)}).join('، ')||'لا أحد')+'</p><p style="margin:6px 0 0"><span class="ag-chip hi">مجموعة الإثراء</span> '+(M.strong.map(function(s){return esc(s.name)}).join('، ')||'لا أحد')+'</p>':'لا بيانات كافية.')+'</div>'+
  '<div class="ag-box"><h3>ما يجهّزه الوكيل للمعلم</h3><div class="ag-row"><button class="ag-btn alt" data-o="plan">📘 خطة حصة علاجية</button><button class="ag-btn alt" data-o="test">📝 اختبار قصير</button><button class="ag-btn alt" data-o="rep">📊 تقرير للإدارة</button></div>'+(CL.out?'<pre class="ag-out" id="tcOut">'+esc(CL.out)+'</pre><div class="ag-row" style="margin-top:8px"><button class="ag-btn alt" id="tcCopy">نسخ</button><button class="ag-btn alt" id="tcDl">⬇ تنزيل</button><span class="ag-note" id="tcMsg"></span></div>':'')+'</div>'}
 var U2=ST.use;h+='<div class="ag-box"><h3>أرقام الاستخدام على هذا الجهاز</h3><div class="ag-kpis"><div class="ag-kpi"><small>أيام الاستخدام</small><b>'+Object.keys(U2.days).length+'</b></div><div class="ag-kpi"><small>زيارات تجارب مسجّلة</small><b>'+U2.exp+'</b></div><div class="ag-kpi"><small>إجابات مع الوكيل</small><b>'+U2.ans+'</b></div><div class="ag-kpi"><small>قرارات اتخذها الوكيل</small><b>'+U2.dec+'</b></div><div class="ag-kpi"><small>خطط واختبارات وتقارير</small><b>'+U2.plans+'</b></div></div><p class="ag-note">'+(window.YQ_ANALYTICS_GC?'الإحصاءات المجمّعة لكل الطلاب مفعّلة.':(function(){var R=CL.stu.filter(function(x){return x.ans!=null});if(!R.length)return '';var A=R.reduce(function(a,x){return a+x.ans},0),X=R.reduce(function(a,x){return a+x.exs},0),T=R.reduce(function(a,x){return a+x.sec},0);return '<b>من تقارير الطلاب المستوردة ('+R.length+' طالباً):</b> '+X+' زيارة تجربة، '+Math.round(T/60)+' دقيقة تجريب، '+A+' إجابة مع الوكيل.<br>'})()+'هذه أرقام هذا الجهاز فقط. لتجميع أرقام كل الطلاب على الموقع (مجهولة الهوية) يُفعَّل عدّاد إحصاءات برمز حساب.')+'</p></div>';
 h+='</div><aside class="ag-box ag-log"><h3>سجل قرارات الوكيل</h3><p class="ag-note">حلقة العمل: ملاحظة ← توجيه ← قرار ← تنفيذ</p><ol id="agLog"></ol></aside></div>';b.innerHTML=h;renderLog();
 $('tcG').onchange=function(){CL.g=+this.value;if(CL.demo)CL.stu=[];CL.ran=false;CL.out='';renderTch()};$('tcS').onchange=function(){CL.s=this.value;CL.ran=false;CL.out='';renderTch()};
 $('tcDemo').onclick=function(){CL.stu=demoClass(CL.g,CL.s);CL.demo=true;CL.ran=false;CL.out='';log('O','حمّل المعلم صفاً تجريبياً من 12 طالباً للعرض.');renderTch()};
 $('tcF').onchange=function(){var fs=[].slice.call(this.files),done=0,got=[];fs.forEach(function(f){var r=new FileReader();r.onload=function(){try{var t=String(r.result).trim();if(t.indexOf('VL1.')===0)got.push(parseStuCode(t));else{var j=JSON.parse(t);if(j.format==='VLab-Agent-Student-1')got.push(repToStu(j))}}catch(e){}if(++done===fs.length){ingest(got);renderTch()}};r.readAsText(f)})};
 $('tcRun').onclick=function(){var M;CL.ran=true;M=cModel();log('O','قرأ الوكيل '+CL.stu.length+' طالباً × '+M.U.length+' وحدات.');if(M.w){log('R','أقل متوسط في «'+M.w.u.l+'» ('+Math.round(M.w.v)+'%)، وتحت 45% فيها: '+M.risk.length+' طلاب.');log('D','حصة علاجية على «'+M.w.u.l+'» مع مجموعتي دعم وإثراء.');log('A','جهّز الوكيل الخطة والاختبار والتقرير.')}renderTch()};
 b.querySelectorAll('[data-o]').forEach(function(x){x.onclick=function(){CL.out=({plan:buildPlan,test:buildTest,rep:buildRep})[x.dataset.o]();CL.kind=x.dataset.o;bump('plans');log('A','أنشأ الوكيل '+x.textContent.replace(/^\S+\s/,'')+'.');renderTch()}});
 if($('tcCopy'))$('tcCopy').onclick=function(){var t=CL.out;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){$('tcMsg').textContent='تم النسخ.'},function(){$('tcMsg').textContent='حدّد النص وانسخه يدوياً.'})};
 if($('tcDl'))$('tcDl').onclick=function(){dl('VLab-'+(CL.kind||'out')+'.txt',CL.out)}}
function qtext(q,i,ops){return (i?i+') ':'')+q[0]+'\n'+ops.map(function(o,k){return '   '+'أبجد'[k]+'. '+o}).join('\n')}
function mixQ(q){var ops=shuf(q.slice(1));return{ops:ops,a:ops.indexOf(q[1])}}
function buildPlan(){var M=cModel(),u=M.w.u,P=shuf(qpool(CL.g,u.s,u.u)),hook=P[0],ex=P.slice(1,3).map(mixQ),list=function(a){return a.map(function(s){return s.name}).join('، ')||'لا أحد'};
 return 'خطة حصة علاجية — '+u.l+' (الصف '+GN[CL.g]+')\nالمدة: 45 دقيقة · الهدف: رفع إتقان الصف من '+Math.round(M.w.v)+'% إلى 70% على الأقل.\n\n1) تمهيد (5 د): اطرح السؤال دون إعطاء الجواب:\n'+(hook?qtext(hook,0,shuf(hook.slice(1))):'')+
  '\n\n2) التجربة الافتراضية (15 د) في المختبر VLab، أزواجاً مع تسجيل الملاحظات:\n'+u.ex.slice(0,2).map(function(e){return '   • '+e.n+': https://www.vlabjo.com'+expUrl(e.sig)}).join('\n')+
  '\n\n3) نقاش موجّه (10 د): يشرح كل زوج ما تغيّر في التجربة ولماذا، ويصحّح المعلم المفاهيم الخاطئة.\n\n4) مجموعات (10 د):\n   مجموعة الدعم: '+list(M.risk)+' — تعيد التجربة مع بطاقات إرشاد ووكيل الطالب.\n   مجموعة الإثراء: '+list(M.strong)+' — تصمّم تجربة بمتغيّر جديد.\n\n5) تذكرة خروج (5 د):\n'+ex.map(function(x,i){return qtext([P[i+1][0]],i+1,x.ops)}).join('\n')+'\n\nمفتاح الإجابات: '+ex.map(function(x,i){return (i+1)+'-'+'أبجد'[x.a]}).join('  ')}
function buildTest(){var M=cModel(),us=M.av.slice(0,2).map(function(a){return a.u}),qs=[];us.forEach(function(u){shuf(qpool(CL.g,u.s,u.u)).slice(0,5).forEach(function(q){qs.push(q)})});var mx=qs.map(mixQ);
 return 'اختبار قصير — '+us.map(function(u){return u.l}).join(' + ')+'\nعدد الأسئلة: '+qs.length+' · الزمن: '+Math.max(10,qs.length*1.5)+' دقيقة\nالاسم: ____________  الشعبة: ______\n\n'+qs.map(function(q,i){return qtext(q,i+1,mx[i].ops)}).join('\n\n')+'\n\nمفتاح الإجابات: '+mx.map(function(x,i){return (i+1)+'-'+'أبجد'[x.a]}).join('  ')}
function buildRep(){var M=cModel(),list=function(a){return a.map(function(s){return s.name}).join('، ')||'لا أحد'};
 return 'تقرير أداء الصف '+GN[CL.g]+(CL.s?' — '+SUB[CL.s]:'')+'\nالتاريخ: '+new Date().toLocaleDateString('ar-JO')+'\nعدد الطلاب: '+CL.stu.length+(CL.demo?' (بيانات تجريبية للعرض)':'')+'\nمتوسط الصف العام: '+Math.round(M.overall)+'%\n\nالإتقان حسب الوحدة (من الأضعف):\n'+M.av.map(function(a){return '- '+a.u.l+': '+Math.round(a.v)+'%'}).join('\n')+
  '\n\nالوحدة الأولى بالمعالجة: '+M.w.u.l+' ('+Math.round(M.w.v)+'%).\nطلاب يحتاجون دعماً: '+list(M.risk)+'.\nطلاب جاهزون للإثراء: '+list(M.strong)+'.\n\nالإجراء المقرّر: حصة علاجية 45 دقيقة على تجارب «'+M.w.u.ex.slice(0,2).map(function(e){return e.n}).join('» و«')+'»، ثم اختبار قصير لقياس التحسّن، ومتابعة فردية عبر وكيل الطالب.\n\nأُعدّ هذا التقرير آلياً بواسطة وكيل المعلم في المختبر الافتراضي VLab — www.vlabjo.com'}
/* ---------- الحسابات: محلية (رمز صف + رمز حفظ) أو سحابية (Supabase) ---------- */
var CF=window.YQ_CLOUD||{},CLOUD=!!(CF.url&&CF.key),AKEY='yq_acct_v1',AC={};
try{AC=JSON.parse(localStorage.getItem(AKEY)||'{}')}catch(e){}
function asave(){try{localStorage.setItem(AKEY,JSON.stringify(AC))}catch(e){}}
function b64e(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function b64d(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
function repObj(){var U=ST.g?units(ST.g,ST.s):[];return{format:'VLab-Agent-Student-1',name:ST.name||AC.name||'طالب',cls:AC.cls||'',grade:ST.g,subject:ST.s,date:new Date().toISOString(),
 units:U.map(function(u){var x=ST.m[mkey(u)]||{n:0,ok:0};return{key:mkey(u),label:u.l,subject:u.s,answered:x.n,correct:x.ok,mastery:x.n?pct(pOf(mkey(u))):null}}),
 experiments:Object.keys(ST.vis).map(function(s){return{name:s.split('|')[1],grade:+s.split('|')[0],visits:ST.vis[s].n,seconds:ST.vis[s].sec}}),answers:ST.ev.filter(function(e){return e.k==='q'}).length,decisions:ST.log.length,usage:ST.use}}
/* رمز قصير للمعلم: الإتقان لكل وحدة + أرقام النشاط */
function stuCode(){var r=repObj(),m={};r.units.forEach(function(u){if(u.mastery!=null)m[u.key.split('|').slice(1).join('|')]=u.mastery});
 return 'VL1.'+b64e(JSON.stringify({n:r.name,c:r.cls,g:r.grade,s:r.subject,m:m,a:r.answers,x:r.experiments.reduce(function(a,e){return a+e.visits},0),t:r.experiments.reduce(function(a,e){return a+e.seconds},0),d:r.date.slice(0,10)}))}
function parseStuCode(c){var j=JSON.parse(b64d(c.slice(4))),m={};Object.keys(j.m||{}).forEach(function(k){m[(j.g||CL.g)+'|'+k]=j.m[k]});return{name:j.n||'طالب',cls:j.c||'',g:j.g,m:m,ans:j.a||0,exs:j.x||0,sec:j.t||0,date:j.d}}
function repToStu(j){var m={};(j.units||[]).forEach(function(u){if(u.mastery!=null)m[(j.grade||CL.g)+'|'+u.key.split('|').slice(1).join('|')]=u.mastery});return{name:j.name||'طالب',cls:j.cls||'',g:j.grade,m:m,ans:j.answers||0,exs:(j.experiments||[]).reduce(function(a,e){return a+(e.visits||0)},0),sec:(j.experiments||[]).reduce(function(a,e){return a+(e.seconds||0)},0)}}
/* نسخة احتياطية كاملة لاستعادة التقدم على أي جهاز */
function backupCode(){var o={cls:AC.cls||'',name:ST.name,g:ST.g,s:ST.s,ev:ST.ev.slice(-200),m:ST.m,vis:ST.vis,log:ST.log.slice(0,20),use:ST.use};return 'VLB1.'+b64e(JSON.stringify(o))}
function restoreFrom(o){['name','g','s','ev','m','vis','log','use'].forEach(function(k){if(o[k]!=null)ST[k]=o[k]});save()}
function ingest(list){var added=0,seen={};list.forEach(function(st){if(!st)return;if(!CL.g&&st.g)CL.g=st.g;var i=CL.stu.findIndex(function(x){return x.name===st.name&&!x.demo});if(CL.demo){CL.stu=[];CL.demo=false}if(i>=0)CL.stu[i]=st;else CL.stu.push(st);if(!seen[st.name]){seen[st.name]=1;added++}});CL.ran=false;CL.out='';if(added)log('O','استلم المعلم بيانات '+added+' طالب.');return added}
/* ---- Supabase عبر REST ---- */
function api(path,o,retry){o=o||{};var h={apikey:CF.key,'Content-Type':'application/json'};if(AC.tok)h.Authorization='Bearer '+AC.tok;if(o.prefer)h.Prefer=o.prefer;
 return fetch(CF.url.replace(/\/$/,'')+path,{method:o.method||'GET',headers:h,body:o.body?JSON.stringify(o.body):undefined}).then(function(r){
  if(r.status===401&&!retry&&AC.rt)return refresh().then(function(){return api(path,o,1)});
  return r.text().then(function(t){var j=null;try{j=t?JSON.parse(t):null}catch(e){}if(!r.ok)throw new Error((j&&(j.msg||j.message||j.error_description||j.error))||('HTTP '+r.status));return j})})}
function setSess(j){AC.tok=j.access_token;AC.rt=j.refresh_token;AC.uid=j.user&&j.user.id;asave()}
function refresh(){return fetch(CF.url.replace(/\/$/,'')+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:CF.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:AC.rt})}).then(function(r){return r.json()}).then(function(j){if(!j.access_token){AC.tok=null;AC.rt=null;asave();throw new Error('انتهت الجلسة، سجّل الدخول مرة أخرى')}setSess(j)})}
function emailOf(u){u=String(u).trim();return u.indexOf('@')>0?u.toLowerCase():u.toLowerCase().replace(/[^a-z0-9._-]/g,'')+'@students.vlabjo.com'}
function auth(kind,user,pw,name,role){var path=kind==='up'?'/auth/v1/signup':'/auth/v1/token?grant_type=password',body={email:emailOf(user),password:pw};if(kind==='up')body.data={name:name,role:role};AC.tok=null;
 return api(path,{method:'POST',body:body}).then(function(j){if(!j.access_token)throw new Error('فعّل خيار الدخول دون تأكيد البريد في إعدادات Supabase');setSess(j);AC.mode='cloud';AC.role=role;AC.name=name||(j.user&&j.user.user_metadata&&j.user.user_metadata.name)||user;AC.user=user;asave()})}
var pushT=null;
function cloudPush(){if(!(CLOUD&&AC.mode==='cloud'&&AC.role==='stu'&&AC.tok))return;clearTimeout(pushT);pushT=setTimeout(function(){
 api('/rest/v1/progress?on_conflict=student',{method:'POST',prefer:'resolution=merge-duplicates,return=minimal',body:{student:AC.uid,name:AC.name,grade:ST.g||null,data:{rep:repObj(),st:JSON.parse(b64d(backupCode().slice(5)))},updated_at:new Date().toISOString()}}).then(function(){AC.sync=Date.now();asave();var s=$('acSync');if(s)s.textContent='☁️ حُفظ في حسابك '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}).catch(function(e){var s=$('acSync');if(s)s.textContent='⚠️ لم تُحفظ السحابة: '+e.message})},3000)}
function cloudPull(){return api('/rest/v1/progress?select=data,updated_at&student=eq.'+AC.uid).then(function(r){if(r&&r[0]&&r[0].data&&r[0].data.st){var lt=ST.ev.length?ST.ev[ST.ev.length-1].at:0,rt=Date.parse(r[0].updated_at)||0;if(rt>lt||!ST.ev.length){restoreFrom(r[0].data.st);log('O','استعاد الوكيل تقدّم الطالب من حسابه.')}}})}
var _save=save;save=function(){_save();cloudPush()};
/* ---- واجهة الحساب ---- */
function msg(t,bad){var e=$('acMsg');if(e){e.textContent=t;e.style.color=bad?'#b91c1c':'#15803d'}}
function copyT(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){msg('تم النسخ. أرسله عبر واتساب أو البريد.')},function(){var a=$('acOut');if(a){a.value=t;a.hidden=false;a.select();msg('حدّد النص وانسخه يدوياً.')}})}
function acctBox(){var h='<div class="ag-box" id="agAcct"><h3>👤 الحساب'+(CLOUD?' <span class="ag-chip hi">سحابي</span>':' <span class="ag-chip">على هذا الجهاز</span>')+'</h3>';
 var who=TAB==='tch'?'tch':'stu';
 if(AC.role&&AC.role!==who){h+='<p class="ag-note">أنت مسجّل '+(AC.role==='tch'?'كمعلم':'كطالب')+' باسم <b>'+esc(AC.name||'')+'</b>. <span class="ag-link" id="acOut1">تسجيل الخروج</span> لتغيير الدور.</p><p id="acMsg" class="ag-note"></p></div>';return h}
 if(!AC.role){
  if(who==='stu'){h+='<div class="ag-row"><input type="text" id="acName" placeholder="اسمك الثلاثي" value="'+esc(ST.name||'')+'"><input type="text" id="acCls" placeholder="رمز الصف من معلمك" style="width:150px;text-transform:uppercase">'+(CLOUD?'<input type="text" id="acUser" placeholder="اسم مستخدم بالإنجليزية" dir="ltr" style="width:170px"><input type="password" id="acPw" placeholder="رمز سري (6 أحرف+)" dir="ltr" style="width:150px">':'')+'</div><div class="ag-row" style="margin-top:8px">'+(CLOUD?'<button class="ag-btn" id="acUp">إنشاء حساب</button><button class="ag-btn alt" id="acIn">دخول</button>':'<button class="ag-btn" id="acJoin">حفظ والانضمام للصف</button>')+'<button class="ag-btn alt" id="acRest">↩ استعادة تقدّمي من رمز</button></div>'+
   '<p class="ag-note">'+(CLOUD?'حسابك يحفظ تقدّمك على أي جهاز، ومعلمك يرى نتائجك تلقائياً بعد انضمامك لصفه.':'يُحفظ تقدّمك على هذا الجهاز تلقائياً. أرسل «رمز المعلم» لمعلمك، واحتفظ بـ«رمز الحفظ» لتستعيد تقدّمك على جهاز آخر.')+'</p>'}
  else{h+=(CLOUD?'<div class="ag-row"><input type="text" id="acName" placeholder="اسم المعلم"><input type="text" id="acUser" placeholder="البريد الإلكتروني" dir="ltr" style="width:200px"><input type="password" id="acPw" placeholder="كلمة المرور" dir="ltr" style="width:150px"></div><div class="ag-row" style="margin-top:8px"><button class="ag-btn" id="acUp">إنشاء حساب معلم</button><button class="ag-btn alt" id="acIn">دخول</button></div>':'<div class="ag-row"><input type="text" id="acName" placeholder="اسم المعلم"><button class="ag-btn" id="acTch">متابعة كمعلم</button></div>')+
   '<p class="ag-note">'+(CLOUD?'تنشئ صفاً فيحصل على رمز، ويدخله طلابك عند التسجيل، ثم تسحب بياناتهم بضغطة.':'تنشئ صفاً فيحصل على رمز تعطيه لطلابك، ثم يرسلون لك «رمز المعلم» وتلصق الرموز كلها هنا.')+'</p>'}
  h+='<textarea id="acIn2" hidden rows="3" style="width:100%;margin-top:8px;font:600 13px monospace;border-radius:10px;border:1px solid #d6e0da;padding:8px" dir="ltr" placeholder="الصق رمز الحفظ هنا"></textarea><p id="acMsg" class="ag-note"></p></div>';return h}
 if(who==='stu'){h+='<p style="margin:0 0 8px;line-height:1.9">مرحباً <b>'+esc(AC.name)+'</b>'+(AC.cls?' · الصف: <b dir="ltr">'+esc(AC.cls)+'</b>'+(AC.clsName?' ('+esc(AC.clsName)+')':''):' · لم تنضم لصف بعد')+'</p>'+
  (AC.cls?'':'<div class="ag-row" style="margin-bottom:8px"><input type="text" id="acCls" placeholder="رمز الصف من معلمك" style="width:150px;text-transform:uppercase"><button class="ag-btn alt" id="acJ2">انضمام</button></div>')+
  '<div class="ag-row">'+(AC.mode==='cloud'?'<span class="ag-note" id="acSync">'+(AC.sync?'☁️ آخر حفظ في حسابك '+new Date(AC.sync).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):'☁️ يُحفظ تقدّمك في حسابك تلقائياً')+'</span>':'<button class="ag-btn" id="acCode">📋 نسخ رمز المعلم</button><button class="ag-btn alt" id="acBak">💾 نسخ رمز الحفظ</button><button class="ag-btn alt" id="acBakF">⬇ ملف الحفظ</button><button class="ag-btn alt" id="acRest">↩ استعادة</button>')+'<button class="ag-btn alt" id="acOut1">خروج</button></div>'}
 else{var cl=AC.classes||[];h+='<p style="margin:0 0 8px">المعلم: <b>'+esc(AC.name)+'</b></p><div class="ag-row"><input type="text" id="acCN" placeholder="اسم الصف، مثل: 12 علمي - شعبة أ" style="flex:1;min-width:180px"><button class="ag-btn" id="acNew">➕ إنشاء صف</button></div>'+
  (cl.length?'<div class="ag-row" style="margin-top:10px">'+cl.map(function(c){return '<span class="ag-chip" style="font-size:13px;padding:5px 10px">'+esc(c.name)+' · <b dir="ltr" style="letter-spacing:1px">'+esc(c.code)+'</b>'+(AC.mode==='cloud'?' <button class="ag-btn blue" data-pull="'+esc(c.code)+'" style="padding:4px 10px;font-size:12px">⬇ اسحب بيانات الصف</button>':'')+'</span>'}).join('')+'</div>':'')+
  (AC.mode==='cloud'?'':'<textarea id="acPaste" rows="3" style="width:100%;margin-top:10px;font:600 13px monospace;border-radius:10px;border:1px solid #d6e0da;padding:8px" dir="ltr" placeholder="الصق هنا «رموز المعلم» التي أرسلها طلابك (رمز أو أكثر، كل واحد في سطر)"></textarea><div class="ag-row" style="margin-top:6px"><button class="ag-btn blue" id="acAdd">➕ أضف الطلاب من الرموز</button></div>')+
  '<div class="ag-row" style="margin-top:8px"><button class="ag-btn alt" id="acOut1">خروج</button></div>'}
 h+='<textarea id="acIn2" hidden rows="3" style="width:100%;margin-top:8px;font:600 13px monospace;border-radius:10px;border:1px solid #d6e0da;padding:8px" dir="ltr" placeholder="الصق رمز الحفظ هنا"></textarea><textarea id="acOut" hidden rows="3" readonly style="width:100%;margin-top:8px;font:600 12px monospace" dir="ltr"></textarea><p id="acMsg" class="ag-note"></p></div>';return h}
function joinCls(code){code=String(code||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(!code)return Promise.resolve();
 if(AC.mode==='cloud')return api('/rest/v1/rpc/join_class',{method:'POST',body:{p_code:code,p_name:AC.name}}).then(function(j){AC.cls=j.code;AC.clsName=j.name;if(j.grade&&!ST.g){ST.g=j.grade;save()}asave();log('A','انضم الطالب إلى صف '+(j.name||j.code)+'.')});
 AC.cls=code;asave();return Promise.resolve()}
function bindAcct(){var g=function(i){return $(i)},val=function(i){var e=$(i);return e?e.value.trim():''},re=function(){render()},fail=function(e){msg(e.message||String(e),true)};
 if(g('acOut1'))g('acOut1').onclick=function(){AC={};asave();re()};
 if(g('acJoin'))g('acJoin').onclick=function(){var n=val('acName');if(n.split(/\s+/).length<2){msg('اكتب اسمك الثنائي على الأقل.',true);return}AC={mode:'local',role:'stu',name:n};ST.name=n;save();joinCls(val('acCls')).then(re)};
 if(g('acTch'))g('acTch').onclick=function(){var n=val('acName');if(!n){msg('اكتب اسمك.',true);return}AC={mode:'local',role:'tch',name:n,classes:[]};asave();re()};
 if(g('acUp'))g('acUp').onclick=function(){var n=val('acName'),u=val('acUser'),p=val('acPw'),role=TAB==='tch'?'tch':'stu';if(!n||!u||p.length<6){msg('أكمل الاسم واسم المستخدم ورمزاً سرياً من 6 أحرف على الأقل.',true);return}msg('جارٍ إنشاء الحساب…');auth('up',u,p,n,role).then(function(){ST.name=n;save();return role==='stu'?joinCls(val('acCls')):null}).then(re,fail)};
 if(g('acIn'))g('acIn').onclick=function(){var u=val('acUser'),p=val('acPw'),role=TAB==='tch'?'tch':'stu';msg('جارٍ الدخول…');auth('in',u,p,val('acName'),role).then(function(){if(role==='stu')return cloudPull().then(function(){return joinCls(val('acCls'))});return api('/rest/v1/classes?select=code,name,grade,subject&order=created_at').then(function(r){AC.classes=r||[];asave()})}).then(re,fail)};
 if(g('acJ2'))g('acJ2').onclick=function(){joinCls(val('acCls')).then(re,fail)};
 if(g('acCode'))g('acCode').onclick=function(){if(!ST.g){msg('اختر صفك أولاً من ملف الطالب.',true);return}copyT(stuCode());log('A','أنشأ الطالب رمز المعلم لإرسال نتائجه.')};
 if(g('acBak'))g('acBak').onclick=function(){copyT(backupCode())};
 if(g('acBakF'))g('acBakF').onclick=function(){dl('VLab-حفظ-'+(ST.name||'طالب').replace(/\s+/g,'_')+'.txt',backupCode())};
 if(g('acRest'))g('acRest').onclick=function(){var t=g('acIn2');if(t.hidden){t.hidden=false;t.focus();this.textContent='✔ استعادة الآن';return}var v=t.value.trim();try{if(v.indexOf('VLB1.')!==0)throw 0;restoreFrom(JSON.parse(b64d(v.slice(5))));var oo=JSON.parse(b64d(v.slice(5)));if(!AC.role&&ST.name){AC={mode:'local',role:'stu',name:ST.name}}if(oo.cls&&!AC.cls)AC.cls=oo.cls;asave();log('O','استعاد الطالب تقدّمه من رمز الحفظ.');re()}catch(e){msg('الرمز غير صحيح. انسخ رمز الحفظ كاملاً (يبدأ بـ VLB1.)',true)}};
 if(g('acNew'))g('acNew').onclick=function(){var n=val('acCN')||'صفي';var A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',c='';for(var i=0;i<6;i++)c+=A[Math.floor(Math.random()*A.length)];var row={code:c,name:n,grade:CL.g||null,subject:CL.s||null};
  (AC.mode==='cloud'?api('/rest/v1/classes',{method:'POST',prefer:'return=minimal',body:row}):Promise.resolve()).then(function(){AC.classes=(AC.classes||[]).concat([row]);asave();log('A','أنشأ المعلم صف «'+n+'» برمز '+c+'.');re();msg('أعطِ طلابك الرمز '+c+' ليدخلوه في وكيل الطالب.')},fail)};
 if(g('acAdd'))g('acAdd').onclick=function(){var t=val('acPaste'),ms=t.match(/VL1\.[A-Za-z0-9_-]+/g)||[],L=[],bad=0;ms.forEach(function(c){try{L.push(parseStuCode(c))}catch(e){bad++}});if(!L.length){msg('لم أجد رموزاً صحيحة (تبدأ بـ VL1.)',true);return}var n=ingest(L);renderTch();msg('أُضيف '+n+' طالب'+(bad?'، وتعذّر قراءة '+bad:'')+'. اضغط «شغّل الوكيل على الصف».')};
 document.querySelectorAll('[data-pull]').forEach(function(b){b.onclick=function(){var code=b.dataset.pull;msg('جارٍ سحب بيانات الصف…');api('/rest/v1/members?select=student,name&class_code=eq.'+code).then(function(ms){if(!ms||!ms.length)throw new Error('لا يوجد طلاب في هذا الصف بعد');return api('/rest/v1/progress?select=student,name,data,updated_at&student=in.('+ms.map(function(m){return m.student}).join(',')+')').then(function(ps){CL.stu=[];CL.demo=false;var n=ingest((ps||[]).filter(function(p){return p.data&&p.data.rep}).map(function(p){var s=repToStu(p.data.rep);s.name=p.name||s.name;return s}));var c=(AC.classes||[]).find(function(x){return x.code===code});if(c&&c.grade)CL.g=c.grade;renderTch();msg('سُحبت بيانات '+n+' من '+ms.length+' طالب.')})}).catch(fail)}})}
var _rs=renderStu,_rt=renderTch;
renderStu=function(m){_rs(m);var b=$('agBody');if(b&&TAB==='stu'&&!$('agAcct')){var d=document.createElement('div');d.innerHTML=acctBox();b.insertBefore(d.firstChild,b.firstChild);bindAcct()}};
renderTch=function(){_rt();var b=$('agBody');if(b&&!$('agAcct')){var d=document.createElement('div');d.innerHTML=acctBox();b.insertBefore(d.firstChild,b.firstChild);bindAcct()}};

/* ---------- التركيب في الموقع ---------- */
function mount(){try{if(typeof V_!=='undefined'&&V_.indexOf('ag')<0)V_.push('ag')}catch(e){}var tw=$('tw'),ag=$('ag');if(tw&&ag&&ag.previousElementSibling!==tw&&tw.parentNode)tw.parentNode.insertBefore(ag,tw.nextSibling);
 var tabs=$('tabs');if(tabs&&!tabs.querySelector('[data-v="ag"]')){var b=document.createElement('button');b.className='chip';b.dataset.v='ag';b.textContent='🤖 وكيل المعلم';b.setAttribute('data-yqi','🤖');b.setAttribute('data-yqs','وكيل المعلم');b.setAttribute('onclick','go(this.dataset.v)');var ref=tabs.querySelector('[data-v="jl"]')||tabs.querySelector('[data-v="tw"]');tabs.insertBefore(b,ref||null)}}
mount();setTimeout(mount,200);setTimeout(mount,1200);setTimeout(mount,3000);
var og=window.go;if(typeof og==='function')window.go=function(v){if(v==='ag'){try{var L=$('lab');if(L&&L.offsetParent!==null&&typeof back==='function')back()}catch(e){}}var r=og.apply(this,arguments);var p=$('ag');if(p)p.style.display=v==='ag'?'block':'none';if(v==='ag'){mount();render()}return r};
window.yqAgent={step:step,state:function(){return ST},render:render};
})();
