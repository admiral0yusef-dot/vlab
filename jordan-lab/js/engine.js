/* ============================================================
   JG Engine — محرك WebGL خفيف لمختبر الأردن الذكي
   (بديل محلي لـ Three.js: لا يحتاج إنترنت، WebGL1 متوافق مع الأجهزة الضعيفة)
   الأستاذ يوسف القاق · VLab
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {};

  /* ---------- رياضيات المصفوفات (column-major) ---------- */
  var M4 = {
    id: function () { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
    mul: function (a, b, o) {
      o = o || new Float32Array(16);
      var a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15];
      for (var j = 0; j < 4; j++) {
        var b0=b[j*4],b1=b[j*4+1],b2=b[j*4+2],b3=b[j*4+3];
        o[j*4]=a00*b0+a10*b1+a20*b2+a30*b3; o[j*4+1]=a01*b0+a11*b1+a21*b2+a31*b3;
        o[j*4+2]=a02*b0+a12*b1+a22*b2+a32*b3; o[j*4+3]=a03*b0+a13*b1+a23*b2+a33*b3;
      }
      return o;
    },
    persp: function (fovy, asp, n, f) {
      var t = 1 / Math.tan(fovy / 2), nf = 1 / (n - f);
      return new Float32Array([t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)*nf,-1, 0,0,2*f*n*nf,0]);
    },
    lookAt: function (e, c, u) {
      var zx=e[0]-c[0],zy=e[1]-c[1],zz=e[2]-c[2],l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;
      var xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;
      var yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
      return new Float32Array([xx,yx,zx,0, xy,yy,zy,0, xz,yz,zz,0, -(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1]);
    },
    /* T * Ry * Rx * Rz * S */
    trs: function (px, py, pz, rx, ry, rz, sx, sy, sz, o) {
      o = o || new Float32Array(16);
      var cx=Math.cos(rx||0),sxr=Math.sin(rx||0),cy=Math.cos(ry||0),syr=Math.sin(ry||0),cz=Math.cos(rz||0),szr=Math.sin(rz||0);
      if (sy === undefined) { sy = sx; sz = sx; } if (sx === undefined) { sx = sy = sz = 1; }
      // R = Ry*Rx*Rz
      var r00=cy*cz+syr*sxr*szr, r01=cx*szr, r02=-syr*cz+cy*sxr*szr;
      var r10=-cy*szr+syr*sxr*cz, r11=cx*cz, r12=syr*szr+cy*sxr*cz;
      var r20=syr*cx, r21=-sxr, r22=cy*cx;
      o[0]=r00*sx;o[1]=r01*sx;o[2]=r02*sx;o[3]=0;
      o[4]=r10*sy;o[5]=r11*sy;o[6]=r12*sy;o[7]=0;
      o[8]=r20*sz;o[9]=r21*sz;o[10]=r22*sz;o[11]=0;
      o[12]=px;o[13]=py;o[14]=pz;o[15]=1;
      return o;
    },
    xform: function (m, x, y, z) { return [m[0]*x+m[4]*y+m[8]*z+m[12], m[1]*x+m[5]*y+m[9]*z+m[13], m[2]*x+m[6]*y+m[10]*z+m[14]]; },
    xdir: function (m, x, y, z) { return [m[0]*x+m[4]*y+m[8]*z, m[1]*x+m[5]*y+m[9]*z, m[2]*x+m[6]*y+m[10]*z]; }
  };
  JG.M4 = M4;

  /* ---------- لون HEX → rgb[0..1] ---------- */
  function C(h) {
    if (Array.isArray(h)) return h;
    h = String(h).replace('#', ''); if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n = parseInt(h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }
  JG.C = C;

  /* ---------- باني الهندسة (مثلثات بألوان رؤوس) ---------- */
  function GB() { this.p = []; this.n = []; this.c = []; }
  GB.prototype.tri = function (a, b, c, col, m) {
    if (m) { a = M4.xform(m, a[0], a[1], a[2]); b = M4.xform(m, b[0], b[1], b[2]); c = M4.xform(m, c[0], c[1], c[2]); }
    var ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
    var nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
    this.p.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]);
    for (var i = 0; i < 3; i++) { this.n.push(nx, ny, nz); this.c.push(col[0], col[1], col[2]); }
    return this;
  };
  GB.prototype.triN = function (a, b, c, na, nb, nc, col, m) {
    if (m) { a=M4.xform(m,a[0],a[1],a[2]);b=M4.xform(m,b[0],b[1],b[2]);c=M4.xform(m,c[0],c[1],c[2]);na=M4.xdir(m,na[0],na[1],na[2]);nb=M4.xdir(m,nb[0],nb[1],nb[2]);nc=M4.xdir(m,nc[0],nc[1],nc[2]); }
    this.p.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]);
    this.n.push(na[0],na[1],na[2],nb[0],nb[1],nb[2],nc[0],nc[1],nc[2]);
    for (var i = 0; i < 3; i++) this.c.push(col[0], col[1], col[2]);
    return this;
  };
  GB.prototype.quad = function (a, b, c, d, col, m) { this.tri(a, b, c, col, m); this.tri(a, c, d, col, m); return this; };
  /* صندوق مركزه (x,y,z) وأبعاده (w,h,d)، اختياري: دوران حول Y */
  GB.prototype.box = function (x, y, z, w, h, d, col, ry, top) {
    col = C(col); var m = M4.trs(x, y, z, 0, ry || 0, 0, 1, 1, 1); var X=w/2,Y=h/2,Z=d/2;
    var tc = top ? C(top) : col; var sh = [col[0]*.82, col[1]*.82, col[2]*.82];
    var P = [[-X,-Y,-Z],[X,-Y,-Z],[X,Y,-Z],[-X,Y,-Z],[-X,-Y,Z],[X,-Y,Z],[X,Y,Z],[-X,Y,Z]];
    this.quad(P[4],P[5],P[6],P[7],col,m); // +z
    this.quad(P[1],P[0],P[3],P[2],sh,m);  // -z
    this.quad(P[5],P[1],P[2],P[6],col,m); // +x
    this.quad(P[0],P[4],P[7],P[3],sh,m);  // -x
    this.quad(P[7],P[6],P[2],P[3],tc,m);  // top
    this.quad(P[0],P[1],P[5],P[4],sh,m);  // bottom
    return this;
  };
  GB.prototype.boxM = function (m, w, h, d, col) {
    col = C(col); var X=w/2,Y=h/2,Z=d/2; var sh=[col[0]*.85,col[1]*.85,col[2]*.85];
    var P = [[-X,-Y,-Z],[X,-Y,-Z],[X,Y,-Z],[-X,Y,-Z],[-X,-Y,Z],[X,-Y,Z],[X,Y,Z],[-X,Y,Z]];
    this.quad(P[4],P[5],P[6],P[7],col,m);this.quad(P[1],P[0],P[3],P[2],sh,m);this.quad(P[5],P[1],P[2],P[6],col,m);
    this.quad(P[0],P[4],P[7],P[3],sh,m);this.quad(P[7],P[6],P[2],P[3],col,m);this.quad(P[0],P[1],P[5],P[4],sh,m);return this;
  };
  /* أسطوانة/مخروط: قاعدة عند y، ارتفاع h */
  GB.prototype.cyl = function (x, y, z, r, h, col, seg, rt, caps, m0) {
    col = C(col); seg = seg || 12; rt = (rt === undefined) ? r : rt; var m = m0 || null;
    for (var i = 0; i < seg; i++) {
      var a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2;
      var c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      var A=[x+c0*r,y,z+s0*r],B=[x+c1*r,y,z+s1*r],Cc=[x+c1*rt,y+h,z+s1*rt],D=[x+c0*rt,y+h,z+s0*rt];
      var ny=(r-rt)/h; var n0=[c0,ny,s0],n1=[c1,ny,s1];
      this.triN(A,Cc,B,n0,n1,n1,col,m); this.triN(A,D,Cc,n0,n0,n1,col,m);
      if (caps !== false) {
        if (rt > 0) this.triN([x,y+h,z],Cc,D,[0,1,0],[0,1,0],[0,1,0],col,m);
        this.triN([x,y,z],A,B,[0,-1,0],[0,-1,0],[0,-1,0],[col[0]*.7,col[1]*.7,col[2]*.7],m);
      }
    }
    return this;
  };
  GB.prototype.sphere = function (x, y, z, r, col, seg, m, sy) {
    col = C(col); seg = seg || 10; var rows = Math.max(4, Math.round(seg * .6)); sy = sy || 1;
    for (var i = 0; i < rows; i++) {
      var t0 = i / rows * Math.PI, t1 = (i + 1) / rows * Math.PI;
      for (var j = 0; j < seg; j++) {
        var p0 = j / seg * Math.PI * 2, p1 = (j + 1) / seg * Math.PI * 2;
        var f = function (t, p) { return [Math.sin(t) * Math.cos(p), Math.cos(t), Math.sin(t) * Math.sin(p)]; };
        var a=f(t0,p0),b=f(t0,p1),c=f(t1,p1),d=f(t1,p0);
        var P = function (v) { return [x + v[0] * r, y + v[1] * r * sy, z + v[2] * r]; };
        if (i > 0) this.triN(P(a), P(b), P(c), a, b, c, col, m);
        if (i < rows - 1) this.triN(P(a), P(c), P(d), a, c, d, col, m);
      }
    }
    return this;
  };
  /* حلقة (torus) أفقية */
  GB.prototype.ring = function (x, y, z, R, r, col, seg, m) {
    col = C(col); seg = seg || 16; var sg2 = 6;
    for (var i = 0; i < seg; i++) for (var j = 0; j < sg2; j++) {
      var u0=i/seg*6.2832,u1=(i+1)/seg*6.2832,v0=j/sg2*6.2832,v1=(j+1)/sg2*6.2832;
      var F=function(u,v){return [x+(R+r*Math.cos(v))*Math.cos(u), y+r*Math.sin(v), z+(R+r*Math.cos(v))*Math.sin(u)];};
      var N=function(u,v){return [Math.cos(v)*Math.cos(u),Math.sin(v),Math.cos(v)*Math.sin(u)];};
      this.triN(F(u0,v0),F(u1,v0),F(u1,v1),N(u0,v0),N(u1,v0),N(u1,v1),col,m);
      this.triN(F(u0,v0),F(u1,v1),F(u0,v1),N(u0,v0),N(u1,v1),N(u0,v1),col,m);
    }
    return this;
  };
  GB.prototype.count = function () { return this.p.length / 3; };
  JG.GB = GB;

  /* ---------- المُصيِّر ---------- */
  var VS = 'attribute vec3 aP;attribute vec3 aN;attribute vec3 aC;uniform mat4 uM,uVP;uniform vec3 uTint;varying vec3 vW,vN,vC;' +
    'void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vN=(uM*vec4(aN,0.)).xyz;vC=aC*uTint;gl_Position=uVP*w;}';
  var FS = 'precision mediump float;varying vec3 vW,vN,vC;uniform vec3 uCam,uSun,uSunC,uSky,uGnd,uFogC,uEmC;uniform vec2 uFog;uniform float uEm,uA,uSpec;' +
    'uniform vec3 uLP[4];uniform vec4 uLC[4];' +
    'void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;vec3 v=normalize(uCam-vW);vec3 col=mix(uGnd,uSky,n.y*.5+.5);float d=max(dot(n,-uSun),0.);col+=uSunC*d;' +
    'vec3 h=normalize(v-uSun);float sp=pow(max(dot(n,h),0.),40.)*d*uSpec;' +
    'for(int i=0;i<4;i++){vec3 L=uLP[i]-vW;float ds=length(L);float at=clamp(1.-ds/uLC[i].a,0.,1.);at*=at;L/=max(ds,.001);col+=uLC[i].rgb*max(dot(n,L),0.)*at;sp+=pow(max(dot(n,normalize(L+v)),0.),28.)*at*uSpec*.8;}' +
    'float rim=pow(1.-max(dot(n,v),0.),3.)*.18;vec3 c=vC*col+vec3(sp)+rim*uSky*.6;c=mix(c,vC+uEmC,uEm);' +
    'float f=clamp((length(uCam-vW)-uFog.x)/(uFog.y-uFog.x),0.,1.);c=mix(c,uFogC,f);gl_FragColor=vec4(c,uA);}';
  var VS2 = 'attribute vec3 aP;attribute vec2 aU;uniform mat4 uM,uVP;varying vec2 vU;void main(){vU=aU;gl_Position=uVP*uM*vec4(aP,1.);}';
  var FS2 = 'precision mediump float;varying vec2 vU;uniform sampler2D uT;uniform vec4 uCol;void main(){vec4 t=texture2D(uT,vU)*uCol;if(t.a<.01)discard;gl_FragColor=t;}';
  var VS3 = 'attribute vec3 aP;attribute vec4 aC;attribute float aS;uniform mat4 uVP;uniform float uH;varying vec4 vC;void main(){vec4 p=uVP*vec4(aP,1.);gl_Position=p;gl_PointSize=clamp(aS*uH/max(p.w,.1),1.,96.);vC=aC;}';
  var FS3 = 'precision mediump float;varying vec4 vC;void main(){vec2 d=gl_PointCoord-.5;float a=smoothstep(.5,.15,length(d));gl_FragColor=vec4(vC.rgb*vC.a*a,vC.a*a);}';

  function Renderer(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl', { antialias: opts.aa !== false, alpha: false, preserveDrawingBuffer: !!opts.keep, powerPreference: 'high-performance' }) ||
             canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL غير مدعوم في هذا المتصفح');
    this.gl = gl; this.cv = canvas; this.dpr = 1;
    this.p1 = this._prog(VS, FS, ['aP', 'aN', 'aC'], ['uM','uVP','uTint','uCam','uSun','uSunC','uSky','uGnd','uFogC','uFog','uEm','uEmC','uA','uSpec','uLP','uLC']);
    this.p2 = this._prog(VS2, FS2, ['aP', 'aU'], ['uM', 'uVP', 'uT', 'uCol']);
    this.p3 = this._prog(VS3, FS3, ['aP', 'aC', 'aS'], ['uVP', 'uH']);
    this.quadBuf = this._buf(new Float32Array([-.5,-.5,0,0,1, .5,-.5,0,1,1, .5,.5,0,1,0, -.5,-.5,0,0,1, .5,.5,0,1,0, -.5,.5,0,0,0]));
    this.flatBuf = this._buf(new Float32Array([-.5,0,-.5,0,0, .5,0,.5,1,1, .5,0,-.5,1,0, -.5,0,-.5,0,0, -.5,0,.5,0,1, .5,0,.5,1,1]));
    this.partBuf = gl.createBuffer(); this.partData = new Float32Array(8 * 1200);
    this.lights = []; this.view = M4.id(); this.proj = M4.id(); this.vp = M4.id();
    this.cam = [0, 10, 10]; this.camR = [1, 0, 0]; this.camU = [0, 1, 0];
    this.env = { sun: [-.35, -1, -.25], sunC: [.55, .52, .5], sky: [.42, .46, .58], gnd: [.16, .15, .2], fog: [.05, .07, .12], fogR: [28, 70] };
    this.stats = { draws: 0, tris: 0 };
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
    var n = Math.hypot.apply(null, this.env.sun); this.env.sun = this.env.sun.map(function (v) { return v / n; });
  }
  Renderer.prototype._sh = function (t, src) { var gl = this.gl, s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  Renderer.prototype._prog = function (vs, fs, at, un) {
    var gl = this.gl, p = gl.createProgram(); gl.attachShader(p, this._sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, this._sh(gl.FRAGMENT_SHADER, fs));
    at.forEach(function (a, i) { gl.bindAttribLocation(p, i, a); }); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var o = { p: p, u: {} }; un.forEach(function (u) { o.u[u] = gl.getUniformLocation(p, u) || gl.getUniformLocation(p, u + '[0]'); }); return o;
  };
  Renderer.prototype._buf = function (d) { var gl = this.gl, b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW); return b; };
  /* GB → Mesh */
  Renderer.prototype.mesh = function (gb) {
    var n = gb.count(), d = new Float32Array(n * 9);
    for (var i = 0; i < n; i++) { d[i*9]=gb.p[i*3];d[i*9+1]=gb.p[i*3+1];d[i*9+2]=gb.p[i*3+2];d[i*9+3]=gb.n[i*3];d[i*9+4]=gb.n[i*3+1];d[i*9+5]=gb.n[i*3+2];d[i*9+6]=gb.c[i*3];d[i*9+7]=gb.c[i*3+1];d[i*9+8]=gb.c[i*3+2]; }
    return { b: this._buf(d), n: n };
  };
  Renderer.prototype.resize = function (w, h, dpr) {
    this.dpr = dpr; var W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
    if (this.cv.width !== W || this.cv.height !== H) { this.cv.width = W; this.cv.height = H; }
    this.gl.viewport(0, 0, W, H); this.W = W; this.H = H;
  };
  Renderer.prototype.setCamera = function (eye, target, fov) {
    this.cam = eye; this.view = M4.lookAt(eye, target, [0, 1, 0]);
    this.proj = M4.persp(fov || 0.95, this.W / this.H, 0.1, 140); M4.mul(this.proj, this.view, this.vp);
    var v = this.view; this.camR = [v[0], v[4], v[8]]; this.camU = [v[1], v[5], v[9]];
  };
  Renderer.prototype.begin = function (clear) {
    var gl = this.gl, f = this.env.fog; gl.clearColor(clear ? clear[0] : f[0], clear ? clear[1] : f[1], clear ? clear[2] : f[2], 1);
    gl.depthMask(true); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); this.stats.draws = 0; this.stats.tris = 0; this._cur = null;
  };
  Renderer.prototype._use1 = function () {
    var gl = this.gl, P = this.p1, e = this.env; if (this._cur === 1) return; this._cur = 1; gl.useProgram(P.p);
    gl.uniformMatrix4fv(P.u.uVP, false, this.vp); gl.uniform3fv(P.u.uCam, this.cam); gl.uniform3fv(P.u.uSun, e.sun); gl.uniform3fv(P.u.uSunC, e.sunC);
    gl.uniform3fv(P.u.uSky, e.sky); gl.uniform3fv(P.u.uGnd, e.gnd); gl.uniform3fv(P.u.uFogC, e.fog); gl.uniform2fv(P.u.uFog, e.fogR);
    var lp = new Float32Array(12), lc = new Float32Array(16);
    for (var i = 0; i < 4; i++) { var L = this.lights[i]; if (L) { lp[i*3]=L.p[0];lp[i*3+1]=L.p[1];lp[i*3+2]=L.p[2];lc[i*4]=L.c[0]*L.i;lc[i*4+1]=L.c[1]*L.i;lc[i*4+2]=L.c[2]*L.i;lc[i*4+3]=L.r; } else lc[i*4+3] = 1; }
    gl.uniform3fv(P.u.uLP, lp); gl.uniform4fv(P.u.uLC, lc);
    gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1); gl.enableVertexAttribArray(2);
  };
  /* رسم Mesh بمصفوفة نموذج */
  Renderer.prototype.draw = function (mesh, m, o) {
    if (!mesh || !mesh.n) return; o = o || {}; var gl = this.gl, P = this.p1; this._use1();
    gl.uniformMatrix4fv(P.u.uM, false, m || IDM); gl.uniform3fv(P.u.uTint, o.tint || ONE); gl.uniform1f(P.u.uEm, o.em || 0);
    gl.uniform3fv(P.u.uEmC, o.emc || ZERO); gl.uniform1f(P.u.uA, o.a === undefined ? 1 : o.a); gl.uniform1f(P.u.uSpec, o.spec === undefined ? .35 : o.spec);
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.b);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 36, 12); gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 36, 24);
    if (o.a !== undefined && o.a < 1) { gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); }
    if (o.nocull) gl.disable(gl.CULL_FACE);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.n); this.stats.draws++; this.stats.tris += mesh.n / 3;
    if (o.nocull) gl.enable(gl.CULL_FACE);
    if (o.a !== undefined && o.a < 1) { gl.disable(gl.BLEND); gl.depthMask(true); }
  };
  var IDM = M4.id(), ONE = new Float32Array([1, 1, 1]), ZERO = new Float32Array([0, 0, 0]);
  /* خامات: نص عربي/صور مرسومة على Canvas */
  Renderer.prototype.texture = function (canvas, old) {
    var gl = this.gl, t = old || gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  Renderer.prototype._use2 = function (buf) {
    var gl = this.gl, P = this.p2; if (this._cur !== 2) { this._cur = 2; gl.useProgram(P.p); gl.uniformMatrix4fv(P.u.uVP, false, this.vp); gl.disableVertexAttribArray(2); gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1); }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
  };
  /* لوحة تواجه الكاميرا (billboard) */
  Renderer.prototype.sprite = function (tex, x, y, z, w, h, col, add) {
    var gl = this.gl, P = this.p2; this._use2(this.quadBuf); var r = this.camR, u = this.camU;
    var m = new Float32Array([r[0]*w,r[1]*w,r[2]*w,0, u[0]*h,u[1]*h,u[2]*h,0, 0,0,1,0, x,y,z,1]);
    gl.uniformMatrix4fv(P.u.uM, false, m); gl.uniform4fv(P.u.uCol, col || [1, 1, 1, 1]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(P.u.uT, 0);
    gl.enable(gl.BLEND); if (add) gl.blendFunc(gl.SRC_ALPHA, gl.ONE); else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false); gl.disable(gl.CULL_FACE); gl.drawArrays(gl.TRIANGLES, 0, 6); gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.disable(gl.BLEND); this.stats.draws++;
  };
  /* لوحة مسطحة بمصفوفة (أرضية/لافتة ثابتة) */
  Renderer.prototype.plane = function (tex, m, col, flat, add, noDepth) {
    var gl = this.gl, P = this.p2; this._use2(flat ? this.flatBuf : this.quadBuf);
    gl.uniformMatrix4fv(P.u.uM, false, m); gl.uniform4fv(P.u.uCol, col || [1, 1, 1, 1]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(P.u.uT, 0);
    gl.enable(gl.BLEND); if (add) gl.blendFunc(gl.SRC_ALPHA, gl.ONE); else gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false); if (noDepth) gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.enable(gl.CULL_FACE); gl.depthMask(true); if (noDepth) gl.enable(gl.DEPTH_TEST); gl.disable(gl.BLEND); this.stats.draws++;
  };
  /* جسيمات (نقاط مضيئة جمعية) */
  Renderer.prototype.particles = function (list) {
    var n = Math.min(list.length, 1200); if (!n) return; var gl = this.gl, P = this.p3, d = this.partData;
    for (var i = 0; i < n; i++) { var q = list[i], k = i * 8; d[k]=q.x;d[k+1]=q.y;d[k+2]=q.z;d[k+3]=q.c[0];d[k+4]=q.c[1];d[k+5]=q.c[2];d[k+6]=q.a;d[k+7]=q.s; }
    this._cur = 3; gl.useProgram(P.p); gl.uniformMatrix4fv(P.u.uVP, false, this.vp); gl.uniform1f(P.u.uH, this.H * 0.9);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf); gl.bufferData(gl.ARRAY_BUFFER, d.subarray(0, n * 8), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1); gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 12); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 32, 28);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.depthMask(false); gl.drawArrays(gl.POINTS, 0, n); gl.depthMask(true); gl.disable(gl.BLEND);
    gl.disableVertexAttribArray(2); this._cur = null; this.stats.draws++;
  };
  /* إسقاط نقطة عالمية إلى إحداثيات الشاشة (CSS px) */
  Renderer.prototype.project = function (x, y, z) {
    var m = this.vp, X = m[0]*x+m[4]*y+m[8]*z+m[12], Y = m[1]*x+m[5]*y+m[9]*z+m[13], W = m[3]*x+m[7]*y+m[11]*z+m[15];
    if (W <= 0.01) return null; return [(X / W * .5 + .5) * this.W / this.dpr, (1 - (Y / W * .5 + .5)) * this.H / this.dpr, W];
  };
  JG.Renderer = Renderer;

  /* ---------- خامات مرسومة ---------- */
  JG.makeCanvas = function (w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  JG.FONT = '"beIN","Cairo","Segoe UI",Tahoma,"Noto Sans Arabic",sans-serif';
  /* خط beIN لا يدعم الحركات: تُحذف من نصوص اللوحات */
  JG.ND = function (s) { return String(s).replace(/[\u064B-\u0652\u0670]/g, ''); };
  /* لافتة نص عربي بخلفية مستديرة */
  JG.labelCanvas = function (text, o) {
    o = o || {}; text = JG.ND(text); var fs = o.fs || 44, pad = o.pad || 18, c = JG.makeCanvas(8, 8), x = c.getContext('2d');
    x.font = (o.w || 800) + ' ' + fs + 'px ' + JG.FONT; var lines = String(text).split('\n'), tw = 0;
    lines.forEach(function (l) { tw = Math.max(tw, x.measureText(l).width); });
    var W = Math.ceil(tw + pad * 2), H = Math.ceil(lines.length * fs * 1.3 + pad * 1.4);
    c.width = Math.min(2048, W); c.height = H; x = c.getContext('2d'); x.font = (o.w || 800) + ' ' + fs + 'px ' + JG.FONT;
    if (o.bg !== null) { x.fillStyle = o.bg || 'rgba(10,14,30,.82)'; var r = Math.min(26, H / 2); x.beginPath(); x.moveTo(r, 0); x.arcTo(W, 0, W, H, r); x.arcTo(W, H, 0, H, r); x.arcTo(0, H, 0, 0, r); x.arcTo(0, 0, W, 0, r); x.fill();
      if (o.bd) { x.strokeStyle = o.bd; x.lineWidth = 5; x.stroke(); } }
    x.fillStyle = o.col || '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    lines.forEach(function (l, i) { x.direction = /[\u0600-\u06FF]/.test(l) ? 'rtl' : 'ltr'; x.fillText(l, W / 2, pad * .7 + fs * .68 + i * fs * 1.3); });
    return c;
  };
  JG.radialCanvas = function (inner, outer, size) {
    size = size || 64; var c = JG.makeCanvas(size, size), x = c.getContext('2d'), g = x.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    g.addColorStop(0, inner); g.addColorStop(1, outer); x.fillStyle = g; x.fillRect(0, 0, size, size); return c;
  };
})();
