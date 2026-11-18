// ============================================================
//  RENDU — caméra, tuiles, lumière, effets
// ============================================================
const R = {
  cv:null, ctx:null, ts:48, sc:3, cam:{x:0,y:0}, W:0, H:0, dpr:1,
  parts:[], texts:[], projs:[], rings:[], slashes:[], bolts:[], deaths:[], arrows:[],
  shakeAmt:0, hurtAmt:0, flashC:null, flashA:0, t:0, last:0, mini:null, miniT:0, mouse:null,

  init(){
    this.cv=document.getElementById('game'); this.ctx=this.cv.getContext('2d');
    this.light=document.createElement('canvas'); this.lctx=this.light.getContext('2d');
    this.mini=document.getElementById('minimap');
    addEventListener('resize',()=>this.resize()); this.resize();
    requestAnimationFrame(t=>this.loop(t));
  },
  resize(){
    const r=this.cv.parentElement.getBoundingClientRect(); this.dpr=Math.min(2,window.devicePixelRatio||1);
    this.cv.width=Math.max(320,Math.floor(r.width*this.dpr)); this.cv.height=Math.max(240,Math.floor(r.height*this.dpr));
    this.cv.style.width=r.width+'px'; this.cv.style.height=r.height+'px';
    this.W=this.cv.width; this.H=this.cv.height;
    this.sc=Math.max(2,Math.round(Math.min(this.W/(TILE*19), this.H/(TILE*12))));
    this.ts=TILE*this.sc;
  },
  now(){ return performance.now(); },
  // ---------- API effets ----------
  float(x,y,text,color,o={}){ this.texts.push({x:x+0.5,y:y,text:String(text),color,born:this.now()+(o.delay||0),life:o.small?800:1000,crit:o.crit,small:o.small,dx:(Math.random()-0.5)*0.3}); },
  burst(x,y,color,n,o={}){ const b=this.now()+(o.delay||0);
    for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, s=0.5+Math.random()*2.2;
      this.parts.push({x:x+0.5,y:y+0.55,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(o.up?2:1),g:o.up?-0.5:6,life:400+Math.random()*450,born:b,color,size:Math.random()<0.3?2:1,glow:!!o.up}); } },
  proj(x0,y0,x1,y1,color,kind){ const d=Math.hypot(x1-x0,y1-y0); const dur=Math.max(90, d*42+40);
    this.projs.push({x0:x0+0.5,y0:y0+0.5,x1:x1+0.5,y1:y1+0.5,color,kind,born:this.now(),dur}); return dur; },
  shake(n){ this.shakeAmt=Math.max(this.shakeAmt,n); },
  hurt(a){ this.hurtAmt=Math.max(this.hurtAmt,0.35+a*0.65); },
  flash(c){ this.flashC=c; this.flashA=0.6; },
  lunge(e,dx,dy){ e.lunge={dx:Math.sign(dx),dy:Math.sign(dy),t:this.now()}; },
  death(m,delay=0){ this.deaths.push({spr:m.spr,x:m.x,y:m.y,face:m.face||1,big:m.big,born:this.now()+delay});
    this.burst(m.x,m.y,'#2a1a20',8,{delay}); this.burst(m.x,m.y,DATA.biomes[S.floor.biome].ember,6,{up:1,delay}); },
  levelUp(p){ this.ring(p.x,p.y,2,'#f7d44a'); for(let i=0;i<30;i++) this.parts.push({x:p.x+0.2+Math.random()*0.6,y:p.y+1,vx:(Math.random()-0.5)*0.4,vy:-2-Math.random()*3,g:-0.3,life:900+Math.random()*500,born:this.now()+i*15,color:i%2?'#f7d44a':'#fff3b0',size:2,glow:true});
    this.float(p.x,p.y-0.4,'NIVEAU !','#f7d44a',{crit:true}); this.flash('#f7d44a'); },
  ring(x,y,r,color,delay=0){ this.rings.push({x:x+0.5,y:y+0.5,r,color,born:this.now()+delay,dur:450}); },
  slash(x,y,color,delay=0){ this.slashes.push({x:x+0.5,y:y+0.5,color,born:this.now()+delay,dur:220,a:Math.random()*Math.PI}); },
  trail(x0,y0,x1,y1,color){ const n=Math.max(1,Math.hypot(x1-x0,y1-y0)*4); for(let i=0;i<n;i++){ const k=i/n;
      this.parts.push({x:x0+0.5+(x1-x0)*k,y:y0+0.6+(y1-y0)*k,vx:0,vy:-0.5,g:0,life:350,born:this.now()+i*8,color,size:2,glow:true}); } },
  explode(x,y,r,color){ this.ring(x,y,r+0.5,color); this.ring(x,y,r,'#ffffff',60);
    for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++) this.burst(x+dx,y+dy,Math.random()<0.5?color:'#ffcf6a',4,{up:1}); },
  rain(x,y,r,color){ for(let i=0;i<14;i++){ const tx=x+0.5+(Math.random()*2-1)*(r+0.4), ty=y+0.5+(Math.random()*2-1)*(r+0.4);
      this.arrows.push({x:tx,y:ty,born:this.now()+i*30,dur:260,color}); } },
  smoke(x,y){ for(let i=0;i<30;i++){ const a=Math.random()*6.28; this.parts.push({x:x+0.5,y:y+0.5,vx:Math.cos(a)*1.2,vy:Math.sin(a)*1.2-0.3,g:-0.2,life:900+Math.random()*600,born:this.now(),color:Math.random()<0.5?'#6a6670':'#3a3640',size:3}); } },
  bolt(x0,y0,x1,y1,color,delay=0){ this.bolts.push({x0:x0+0.5,y0:y0+0.5,x1:x1+0.5,y1:y1+0.5,color,born:this.now()+delay,dur:220}); },
  meteor(x0,y0,x1,y1){ const dur=650; this.projs.push({x0:x1-3.5,y0:y1-6.5,x1:x1+0.5,y1:y1+0.5,color:'#ff5a1a',kind:'meteor',born:this.now(),dur}); return dur; },
  snapAll(){ const p=S.player; p.rx=p.x; p.ry=p.y; for(const m of S.floor.mons){ m.rx=m.x; m.ry=m.y; }
    this.cam.x=(p.x+0.5)*this.ts-this.W/2; this.cam.y=(p.y+0.5)*this.ts-this.H/2; },

  // ---------- boucle ----------
  loop(t){
    const dt=Math.min(0.05,(t-this.last)/1000||0); this.last=t; this.t=t/1000;
    try{ if(S && S.floor && UI.mode==='game') this.draw(dt); }catch(e){ console.error(e); }
    requestAnimationFrame(tt=>this.loop(tt));
  },
  hash(x,y){ let h=x*374761393+y*668265263; h=(h^(h>>13))*1274126177; return (h^(h>>16))>>>0; },
  draw(dt){
    const c=this.ctx, ts=this.ts, f=S.floor, p=S.player, now=this.now(), B=DATA.biomes[f.biome];
    const set=genTileset(f.biome);
    // positions lissées
    const lerp=(e)=>{ if(e.rx===undefined||e.snap){ e.rx=e.x; e.ry=e.y; e.snap=false; }
      const k=Math.min(1,dt*16); e.rx+=(e.x-e.rx)*k; e.ry+=(e.y-e.ry)*k; };
    lerp(p); for(const m of f.mons) lerp(m);
    const tx=(p.rx+0.5)*ts-this.W/2, ty=(p.ry+0.5)*ts-this.H/2;
    this.cam.x+=(tx-this.cam.x)*Math.min(1,dt*9); this.cam.y+=(ty-this.cam.y)*Math.min(1,dt*9);
    let sx=0, sy=0; if(this.shakeAmt>0.1){ sx=(Math.random()-0.5)*this.shakeAmt*this.dpr; sy=(Math.random()-0.5)*this.shakeAmt*this.dpr; this.shakeAmt*=Math.pow(0.004,dt); } else this.shakeAmt=0;
    const cx=Math.round(this.cam.x+sx), cy=Math.round(this.cam.y+sy);
    c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false;
    c.fillStyle=B.fog; c.fillRect(0,0,this.W,this.H);
    c.setTransform(1,0,0,1,-cx,-cy);
    const x0=Math.max(0,Math.floor(cx/ts)-1), y0=Math.max(0,Math.floor(cy/ts)-1);
    const x1=Math.min(f.w-1,Math.ceil((cx+this.W)/ts)+1), y1=Math.min(f.h-1,Math.ceil((cy+this.H)/ts)+1);
    const vis=(x,y)=>f.visible[y*f.w+x], exp=(x,y)=>f.explored[y*f.w+x];
    // ----- tuiles -----
    for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++){
      if(!exp(x,y)) continue;
      const t=f.tiles[y*f.w+x], h=this.hash(x,y), X=x*ts, Y=y*ts;
      if(t===T.WALL){
        const below=Dungeon.tile(f,x,y+1);
        const img = (below!==T.WALL && y+1<f.h) ? set.wallFace[h%set.wallFace.length] : set.wallTop[h%set.wallTop.length];
        c.drawImage(img,X,Y,ts,ts);
        continue;
      }
      if(t===T.DOOR){ c.drawImage(set.door,X,Y,ts,ts); continue; }
      if(t===T.DOOR_OPEN){ c.drawImage(set.doorOpen,X,Y,ts,ts); continue; }
      if(t===T.WATER){ c.drawImage(set.water[(Math.floor(this.t*3)+h)%3],X,Y,ts,ts); }
      else if(t===T.LAVA){ c.drawImage(set.lava[(Math.floor(this.t*4)+h)%3],X,Y,ts,ts); }
      else if(t===T.STAIRS){ c.drawImage(set.stairs,X,Y,ts,ts); }
      else c.drawImage(set.floor[h%set.floor.length],X,Y,ts,ts);
      // occlusion ambiante
      if(Dungeon.tile(f,x,y-1)===T.WALL){ c.fillStyle='rgba(0,0,0,0.38)'; c.fillRect(X,Y,ts,ts*0.22); c.fillStyle='rgba(0,0,0,0.18)'; c.fillRect(X,Y+ts*0.22,ts,ts*0.12); }
      if(Dungeon.tile(f,x-1,y)===T.WALL){ c.fillStyle='rgba(0,0,0,0.22)'; c.fillRect(X,Y,ts*0.12,ts); }
      if(Dungeon.tile(f,x+1,y)===T.WALL){ c.fillStyle='rgba(0,0,0,0.22)'; c.fillRect(X+ts*0.88,Y,ts*0.12,ts); }
    }
    // ----- décor mural -----
    const sc=this.sc;
    for(const d of f.wallDeco){ if(d.x<x0||d.x>x1||d.y<y0||d.y>y1||!exp(d.x,d.y)) continue;
      const X=d.x*ts, Y=d.y*ts;
      if(d.type==='banner'){ c.drawImage(SPR.banner,X,Y+2*sc,ts,ts); }
      else { c.fillStyle='#2a2a2a'; c.fillRect(X+7*sc,Y+8*sc,2*sc,4*sc); c.fillStyle='#4e3020'; c.fillRect(X+6*sc,Y+7*sc,4*sc,2*sc);
        this.flame(c, X+8*sc, Y+7*sc, sc, B.torch, d.x*7+d.y); }
    }
    // ----- props -----
    for(const pr of f.props){ if(pr.x<x0||pr.x>x1||pr.y<y0||pr.y>y1||!exp(pr.x,pr.y)) continue;
      const X=pr.x*ts, Y=pr.y*ts; let spr=SPR[pr.type==='trap_used'?'trap':pr.type]; if(!spr) continue;
      if(pr.type==='trap_used'){ c.globalAlpha=0.4; }
      if(BLOCKING_PROPS[pr.type]){ c.fillStyle='rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(X+ts/2,Y+ts*0.9,ts*0.38,ts*0.1,0,0,6.28); c.fill(); }
      if((pr.type==='fountain'||pr.type==='shrine') && pr.used){ c.globalAlpha=0.55; c.drawImage(SPR_FLASH[pr.type],X,Y,ts,ts); c.globalAlpha=0.5; }
      c.drawImage(spr,X,Y,ts,ts); c.globalAlpha=1;
      if(pr.type==='brazier') this.flame(c,X+8*sc,Y+7*sc,sc*1.6,B.torch,pr.x*3+pr.y);
      if(pr.type==='lectern' && !pr.read && vis(pr.x,pr.y)){ c.globalAlpha=0.5+0.4*Math.sin(this.t*3); c.fillStyle='#9fe8f0'; c.fillRect(X+7*sc,Y-1*sc-Math.sin(this.t*3)*sc,2*sc,2*sc); c.globalAlpha=1; }
    }
    // ----- objets au sol -----
    for(const g of f.items){ if(g.x<x0||g.x>x1||g.y<y0||g.y>y1||!exp(g.x,g.y)) continue;
      const it=g.item, spr=SPR[Items.spr(it)]; if(!spr) continue;
      const bob=Math.round(Math.sin(this.t*3+g.x+g.y)*1.2)*sc, X=g.x*ts+ts*0.15, Y=g.y*ts+ts*0.12+bob, s=ts*0.7;
      if(it.kind==='gear' && it.rarity>=2){ c.globalAlpha=0.35+0.2*Math.sin(this.t*4); c.drawImage(tinted(Items.spr(it),DATA.rarities[it.rarity].color),X-sc,Y,s,s); c.drawImage(tinted(Items.spr(it),DATA.rarities[it.rarity].color),X+sc,Y,s,s); c.drawImage(tinted(Items.spr(it),DATA.rarities[it.rarity].color),X,Y-sc,s,s); c.drawImage(tinted(Items.spr(it),DATA.rarities[it.rarity].color),X,Y+sc,s,s); c.globalAlpha=1; }
      c.drawImage(spr,X,Y,s,s);
    }
    // ----- entités -----
    const ents=f.mons.filter(m=>vis(m.x,m.y)||(m.friendly&&exp(m.x,m.y))).concat([p]).sort((a,b)=>a.ry-b.ry);
    for(const e of ents) this.drawEnt(c,e,now);
    // morts
    this.deaths=this.deaths.filter(d=>{ const k=(now-d.born)/450; if(k>1) return false; if(k<0){ this.drawSprite(c,d.spr,d.x,d.y,d.face,d.big,0,1,null); return true; }
      const s=SPR_FLASH[d.spr]; const size=d.big?ts*1.5:ts; c.globalAlpha=1-k;
      const X=(d.x+0.5)*ts-size/2*(1-k*0.5), Y=(d.y+1)*ts-size*(1-k*0.5);
      c.drawImage(k<0.3?s:SPR[d.spr],X,Y+k*ts*0.3,size*(1-k*0.5),size*(1-k*0.5)); c.globalAlpha=1; return true; });

    // ----- lumière -----
    const lw=x1-x0+1, lh=y1-y0+1;
    if(this.light.width!==lw||this.light.height!==lh){ this.light.width=lw; this.light.height=lh; }
    const img=this.lctx.createImageData(lw,lh), D=img.data; const [fr,fg,fb]=hexToRgb(B.fog);
    const st=Game.pstats(); const tr=(Game.has(p,'dark')?3:6.8)+st.light;
    const flick=0.94+0.06*Math.sin(this.t*9)+0.03*Math.sin(this.t*23);
    const lights=f.lights.filter(l=>l.x>=x0-6&&l.x<=x1+6&&l.y>=y0-6&&l.y<=y1+6);
    for(let y=y0;y<=y1;y++) for(let x=x0;x<=x1;x++){
      const i=((y-y0)*lw+(x-x0))*4; let a;
      if(!exp(x,y)) a=1; else if(!vis(x,y)) a=0.8;
      else { const d=Math.hypot(x-p.rx,y-p.ry); let L=Math.max(0,1-Math.pow(d/tr,2))*flick;
        for(const l of lights){ const dd=Math.hypot(x-l.x,y-l.y); if(dd<l.r) L=Math.max(L,(1-Math.pow(dd/l.r,2))*0.85); }
        a=Math.max(0.0,Math.min(0.72,0.86*(1-L))); }
      D[i]=fr; D[i+1]=fg; D[i+2]=fb; D[i+3]=a*255; }
    this.lctx.putImageData(img,0,0);
    c.imageSmoothingEnabled=true; c.drawImage(this.light,x0*ts,y0*ts,lw*ts,lh*ts); c.imageSmoothingEnabled=false;
    // halos colorés
    c.globalCompositeOperation='lighter';
    for(const l of lights){ if(!vis(l.x,l.y)) continue; const fl=0.8+0.2*Math.sin(this.t*7+l.x*3+l.y);
      const g=c.createRadialGradient((l.x+0.5)*ts,(l.y+0.5)*ts,0,(l.x+0.5)*ts,(l.y+0.5)*ts,l.r*ts*0.7);
      g.addColorStop(0,this.rgba(l.color,0.22*fl)); g.addColorStop(1,this.rgba(l.color,0));
      c.fillStyle=g; c.fillRect((l.x-l.r)*ts,(l.y-l.r)*ts,l.r*2*ts,l.r*2*ts); }
    { const g=c.createRadialGradient((p.rx+0.5)*ts,(p.ry+0.5)*ts,0,(p.rx+0.5)*ts,(p.ry+0.5)*ts,tr*ts*0.8);
      g.addColorStop(0,`rgba(255,150,70,${0.13*flick})`); g.addColorStop(1,'rgba(255,150,70,0)'); c.fillStyle=g;
      c.fillRect((p.rx-tr)*ts,(p.ry-tr)*ts,tr*2*ts,tr*2*ts); }
    c.globalCompositeOperation='source-over';

    // ----- télégraphes -----
    for(const tg of f.tg){ const pulse=0.25+0.18*Math.sin(this.t*10);
      for(const [x,y] of tg.tiles){ if(!exp(x,y)) continue; c.fillStyle=`rgba(255,40,30,${pulse})`; c.fillRect(x*ts,y*ts,ts,ts);
        c.strokeStyle='rgba(255,120,80,0.8)'; c.lineWidth=sc; c.strokeRect(x*ts+sc,y*ts+sc,ts-2*sc,ts-2*sc); } }
    // ----- ciblage -----
    this.drawTargeting(c,ts);
    // ----- barres de vie / états -----
    for(const m of f.mons){ if(!vis(m.x,m.y)||m.friendly) continue;
      const X=m.rx*ts, Y=m.ry*ts - (m.big?ts*0.55:0);
      if(m.hp<m.maxHp && !m.boss){ c.fillStyle='#000'; c.fillRect(X+ts*0.12,Y-sc*2,ts*0.76,sc*2);
        c.fillStyle=m.elite?'#f7d44a':'#d8393c'; c.fillRect(X+ts*0.12,Y-sc*2,ts*0.76*Math.max(0,m.hp/m.maxHp),sc*2); }
      let k=0; for(const s of m.statuses){ const col={poison:'#7cc94a',burn:'#ff7a2a',freeze:'#7fe6f2',stun:'#f7d44a'}[s.t]; if(!col) continue;
        c.fillStyle='#000'; c.fillRect(X+ts*0.12+k*sc*4,Y-sc*5,sc*3,sc*3); c.fillStyle=col; c.fillRect(X+ts*0.12+k*sc*4+sc*0.5,Y-sc*4.5,sc*2,sc*2); k++; }
      if(!m.awake && !m.dormant){ c.fillStyle='#c8c2b8'; c.font=`${Math.round(ts*0.3)}px "Pixelify Sans",monospace`; c.fillText('z',X+ts*0.75,Y+ts*0.1-Math.sin(this.t*2)*sc*2); }
    }
    // ----- particules & projectiles -----
    this.drawFx(c,dt,now,ts);
    // ambiance : braises
    if(Math.random()<0.5){ this.parts.push({x:cx/ts+Math.random()*this.W/ts, y:cy/ts+this.H/ts+0.5, vx:(Math.random()-0.5)*0.3, vy:-0.6-Math.random()*0.8, g:0, life:4000+Math.random()*3000, born:now, color:B.ember, size:1, glow:true, amb:true}); }
    // ----- textes flottants -----
    c.textAlign='center';
    this.texts=this.texts.filter(t=>{ const k=(now-t.born)/t.life; if(k>1) return false; if(k<0) return true;
      const sz=Math.round(ts*(t.crit?0.52:t.small?0.3:0.4)*(t.crit&&k<0.15?1+(0.15-k)*3:1));
      c.font=`600 ${sz}px "Pixelify Sans",monospace`; const X=(t.x+t.dx*k)*ts, Y=(t.y-0.1-k*0.9)*ts;
      c.globalAlpha=k>0.7?(1-k)/0.3:1; c.lineWidth=Math.max(2,sc*1.2); c.strokeStyle='#0b0a0f'; c.strokeText(t.text,X,Y); c.fillStyle=t.color; c.fillText(t.text,X,Y); c.globalAlpha=1; return true; });
    c.textAlign='left';
    // ----- écran -----
    c.setTransform(1,0,0,1,0,0);
    if(this.hurtAmt>0.01){ const g=c.createRadialGradient(this.W/2,this.H/2,this.H*0.25,this.W/2,this.H/2,this.H*0.85);
      g.addColorStop(0,'rgba(160,0,0,0)'); g.addColorStop(1,`rgba(170,0,10,${this.hurtAmt*0.55})`); c.fillStyle=g; c.fillRect(0,0,this.W,this.H); this.hurtAmt*=Math.pow(0.02,dt); }
    if(p.hp>0 && p.hp/st.maxHp<0.3){ const a=0.15+0.1*Math.sin(this.t*5); const g=c.createRadialGradient(this.W/2,this.H/2,this.H*0.35,this.W/2,this.H/2,this.H*0.9);
      g.addColorStop(0,'rgba(120,0,0,0)'); g.addColorStop(1,`rgba(140,0,0,${a})`); c.fillStyle=g; c.fillRect(0,0,this.W,this.H); }
    if(this.flashA>0.01){ c.globalAlpha=this.flashA; c.fillStyle=this.flashC; c.fillRect(0,0,this.W,this.H); c.globalAlpha=1; this.flashA*=Math.pow(0.01,dt); }
    if(now-this.miniT>250){ this.miniT=now; this.drawMini(); }
  },
  rgba(hex,a){ const [r,g,b]=hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; },
  flame(c,x,y,sc,color,seed){
    const t=this.t*10+seed; const h=3+Math.sin(t)*0.8+Math.sin(t*2.3)*0.5;
    c.fillStyle=color; c.fillRect(x-1.5*sc,y-h*sc*0.8,3*sc,h*sc*0.8);
    c.fillStyle='#ffe8a0'; c.fillRect(x-0.5*sc,y-h*sc*0.55,1*sc,h*sc*0.55);
    c.fillStyle=color; c.fillRect(x-0.5*sc+Math.round(Math.sin(t*1.7))*sc,y-h*sc-sc,1*sc,sc);
  },
  drawSprite(c,name,x,y,face,big,ox,alpha,over){
    const ts=this.ts, spr=SPR[name]; if(!spr) return;
    const size=big?ts*1.5:ts; const X=(x+0.5)*ts-size/2+ox, Y=(y+1)*ts-size;
    c.globalAlpha=alpha;
    if(face<0){ c.save(); c.translate(X+size,Y); c.scale(-1,1); c.drawImage(over||spr,0,0,size,size); c.restore(); }
    else c.drawImage(over||spr,X,Y,size,size);
    c.globalAlpha=1;
  },
  drawEnt(c,e,now){
    const ts=this.ts, sc=this.sc, isP=e===S.player;
    const spr = isP? DATA.classes[S.cls].spr : e.spr;
    let ox=0, oy=0;
    if(e.lunge){ const k=(now-e.lunge.t)/160; if(k<1){ const a=Math.sin(k*Math.PI)*ts*0.3; ox=e.lunge.dx*a; oy=e.lunge.dy*a; } else e.lunge=null; }
    const bob = (Math.floor(this.t*2.2+(e.uid?e.uid.length:0)+(e.x*7))%2)*sc*0.5;
    const size=e.big?ts*1.5:ts;
    // ombre
    c.fillStyle='rgba(0,0,0,0.4)'; c.beginPath(); c.ellipse((e.rx+0.5)*ts+ox,(e.ry+0.93)*ts+oy,size*0.32,size*0.08,0,0,6.28); c.fill();
    const X=(e.rx+0.5)*ts-size/2+ox, Y=(e.ry+1)*ts-size+oy-bob;
    const face=e.face||1;
    const draw=(img,alpha)=>{ c.globalAlpha=alpha; if(face<0){ c.save(); c.translate(X+size,Y); c.scale(-1,1); c.drawImage(img,0,0,size,size); c.restore(); } else c.drawImage(img,X,Y,size,size); c.globalAlpha=1; };
    // auras
    if(e.elite||e.boss){ const col=e.boss?DATA.bosses[e.id].color:'#f7d44a'; const a=0.35+0.25*Math.sin(this.t*4); const tt=tinted(spr,col);
      c.globalAlpha=a; for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) c.drawImage(tt,X+dx*sc,Y+dy*sc,size,size); c.globalAlpha=1; }
    if(isP){ const tt=tinted(spr,'#ff9a4a'); c.globalAlpha=0.18+0.08*Math.sin(this.t*3); for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) c.drawImage(tt,X+dx*sc,Y+dy*sc,size,size); c.globalAlpha=1; }
    let alpha=1; if(isP && Game.has(e,'invis')) alpha=0.35; if(e.spr==='spectre'||e.spr==='shade'||e.spr==='wood_wraith'||e.spr==='ysolde') alpha=0.8;
    draw(SPR[spr], alpha);
    if(Game.has(e,'freeze')) draw(tinted(spr,'#7fe6f2'),0.5);
    if(e.dormant) draw(tinted(spr,'#8a8796'),0.6);
    if(e.flash && now<e.flash+110 && now>=e.flash) draw(SPR_FLASH[spr],0.9);
    if(isP){ const sh=Game.get(e,'shield'), bs=Game.get(e,'bastion');
      if(sh||bs){ c.strokeStyle=sh?'rgba(90,160,255,0.7)':'rgba(220,230,240,0.6)'; c.lineWidth=sc; c.beginPath(); c.arc((e.rx+0.5)*ts+ox,(e.ry+0.5)*ts+oy,ts*0.55+Math.sin(this.t*4)*sc,0,6.28); c.stroke(); } }
    if(e.friendly){ c.fillStyle='#ffe86a'; c.font=`600 ${Math.round(ts*0.35)}px "Pixelify Sans",monospace`; c.textAlign='center'; c.fillText('…',(e.rx+0.5)*ts,(e.ry)*ts-sc*2+Math.sin(this.t*3)*sc*2); c.textAlign='left'; }
  },
  drawTargeting(c,ts){
    const tg=UI.targeting; if(!tg) return; const p=S.player, f=S.floor, sc=this.sc;
    c.fillStyle='rgba(247,212,74,0.08)';
    for(let y=p.y-tg.range;y<=p.y+tg.range;y++) for(let x=p.x-tg.range;x<=p.x+tg.range;x++)
      if(Dungeon.inb(f,x,y) && f.visible[y*f.w+x] && Dungeon.tile(f,x,y)!==T.WALL) c.fillRect(x*ts,y*ts,ts,ts);
    const t=tg.cursor; if(!t) return;
    const ok=UI.targetValid(t);
    const col=ok?'#f7d44a':'#e05040';
    const r=tg.radius||0;
    if(tg.target==='line'){ const ln=Dungeon.line(p.x,p.y,t.x,t.y,tg.range); c.fillStyle='rgba(247,212,74,0.25)';
      for(const [x,y] of ln){ if(Dungeon.blocksSight(f,x,y)) break; c.fillRect(x*ts,y*ts,ts,ts); } }
    if(tg.aoeSelf){ c.fillStyle='rgba(247,212,74,0.18)'; for(let dy=-tg.aoeSelf;dy<=tg.aoeSelf;dy++) for(let dx=-tg.aoeSelf;dx<=tg.aoeSelf;dx++) c.fillRect((p.x+dx)*ts,(p.y+dy)*ts,ts,ts); }
    c.fillStyle=ok?'rgba(247,212,74,0.25)':'rgba(224,80,64,0.25)';
    for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++) c.fillRect((t.x+dx)*ts,(t.y+dy)*ts,ts,ts);
    c.strokeStyle=col; c.lineWidth=sc; const pul=Math.sin(this.t*8)*sc;
    const X=t.x*ts, Y=t.y*ts, L=ts*0.3;
    c.beginPath();
    c.moveTo(X-pul,Y+L); c.lineTo(X-pul,Y-pul); c.lineTo(X+L,Y-pul);
    c.moveTo(X+ts-L,Y-pul); c.lineTo(X+ts+pul,Y-pul); c.lineTo(X+ts+pul,Y+L);
    c.moveTo(X+ts+pul,Y+ts-L); c.lineTo(X+ts+pul,Y+ts+pul); c.lineTo(X+ts-L,Y+ts+pul);
    c.moveTo(X+L,Y+ts+pul); c.lineTo(X-pul,Y+ts+pul); c.lineTo(X-pul,Y+ts-L);
    c.stroke();
  },
  drawFx(c,dt,now,ts){
    const sc=this.sc;
    // projectiles
    this.projs=this.projs.filter(pr=>{ const k=(now-pr.born)/pr.dur; if(k>=1){ if(pr.kind!=='bomb') this.burst(pr.x1-0.5,pr.y1-0.5,pr.color,6); return false; }
      const x=pr.x0+(pr.x1-pr.x0)*k, y=pr.y0+(pr.y1-pr.y0)*k - (pr.kind==='bomb'?Math.sin(k*Math.PI)*1.5:0);
      if(pr.kind==='arrow'){ const a=Math.atan2(pr.y1-pr.y0,pr.x1-pr.x0); c.save(); c.translate(x*ts,y*ts); c.rotate(a);
        c.fillStyle='#4e3020'; c.fillRect(-ts*0.35,-sc*0.5,ts*0.55,sc); c.fillStyle=pr.color; c.fillRect(ts*0.18,-sc,sc*3,sc*2); c.fillStyle='#e8e2d6'; c.fillRect(-ts*0.38,-sc*1.5,sc*2,sc*3); c.restore(); }
      else if(pr.kind==='bomb'){ c.drawImage(SPR.i_bomb,x*ts-ts*0.3,y*ts-ts*0.3,ts*0.6,ts*0.6); }
      else { const r=pr.kind==='meteor'?ts*0.45:ts*0.16; c.globalCompositeOperation='lighter';
        const g=c.createRadialGradient(x*ts,y*ts,0,x*ts,y*ts,r*2.4); g.addColorStop(0,'#ffffff'); g.addColorStop(0.3,pr.color); g.addColorStop(1,this.rgba(pr.color,0));
        c.fillStyle=g; c.fillRect(x*ts-r*2.4,y*ts-r*2.4,r*4.8,r*4.8); c.globalCompositeOperation='source-over';
        if(Math.random()<0.8) this.parts.push({x,y,vx:(Math.random()-0.5),vy:(Math.random()-0.5),g:0,life:300,born:now,color:pr.color,size:pr.kind==='meteor'?3:1,glow:true}); }
      return true; });
    // flèches de pluie
    this.arrows=this.arrows.filter(a=>{ const k=(now-a.born)/a.dur; if(k>=1){ this.burst(a.x-0.5,a.y-0.5,a.color,2); return false; } if(k<0) return true;
      const y=a.y-(1-k)*3; c.fillStyle='#4e3020'; c.fillRect(a.x*ts-sc*0.5,y*ts-ts*0.4,sc,ts*0.4); c.fillStyle=a.color; c.fillRect(a.x*ts-sc,y*ts,sc*2,sc*2); return true; });
    // anneaux
    this.rings=this.rings.filter(r=>{ const k=(now-r.born)/r.dur; if(k>=1) return false; if(k<0) return true;
      c.strokeStyle=this.rgba(r.color,1-k); c.lineWidth=sc*2*(1-k)+sc; c.beginPath(); c.arc(r.x*ts,r.y*ts,(r.r+0.5)*ts*(0.2+0.8*k),0,6.28); c.stroke(); return true; });
    // entailles
    this.slashes=this.slashes.filter(s=>{ const k=(now-s.born)/s.dur; if(k>=1) return false; if(k<0) return true;
      c.strokeStyle=this.rgba(s.color,1-k); c.lineWidth=sc*2.5*(1-k)+sc; c.beginPath(); c.arc(s.x*ts,s.y*ts,ts*0.45,s.a+k*2,s.a+k*2+1.6); c.stroke();
      c.strokeStyle=`rgba(255,255,255,${1-k})`; c.lineWidth=sc; c.beginPath(); c.arc(s.x*ts,s.y*ts,ts*0.45,s.a+k*2+0.3,s.a+k*2+1.3); c.stroke(); return true; });
    // éclairs
    this.bolts=this.bolts.filter(b=>{ const k=(now-b.born)/b.dur; if(k>=1) return false; if(k<0) return true;
      c.strokeStyle=this.rgba(b.color,1-k); c.lineWidth=sc*1.5; c.beginPath(); c.moveTo(b.x0*ts,b.y0*ts);
      for(let i=1;i<8;i++){ const q=i/8; c.lineTo((b.x0+(b.x1-b.x0)*q)*ts+(Math.random()-0.5)*ts*0.5,(b.y0+(b.y1-b.y0)*q)*ts+(Math.random()-0.5)*ts*0.5); }
      c.lineTo(b.x1*ts,b.y1*ts); c.stroke(); return true; });
    // particules
    c.globalCompositeOperation='source-over';
    this.parts=this.parts.filter(q=>{ const age=now-q.born; if(age>q.life) return false; if(age<0) return true;
      q.vy+=q.g*dt; q.x+=q.vx*dt; q.y+=q.vy*dt; if(q.amb) q.vx+=Math.sin(this.t*2+q.y)*0.01;
      const k=age/q.life; c.globalAlpha=q.amb? Math.min(1,(1-k)*1.5)*0.7 : 1-k*k;
      if(q.glow) c.globalCompositeOperation='lighter';
      c.fillStyle=q.color; const s=q.size*sc; c.fillRect(Math.round(q.x*ts/sc)*sc-s/2,Math.round(q.y*ts/sc)*sc-s/2,s,s);
      c.globalCompositeOperation='source-over'; return true; });
    c.globalAlpha=1;
    if(this.parts.length>900) this.parts.splice(0,this.parts.length-900);
  },
  drawMini(){
    const m=this.mini; if(!m||!S||!S.floor) return; const f=S.floor; const s=3;
    if(m.width!==f.w*s){ m.width=f.w*s; m.height=f.h*s; }
    const c=m.getContext('2d'); c.fillStyle='#07060a'; c.fillRect(0,0,m.width,m.height);
    for(let y=0;y<f.h;y++) for(let x=0;x<f.w;x++){ const i=y*f.w+x; if(!f.explored[i]) continue; const t=f.tiles[i];
      c.fillStyle = t===T.WALL?'#3a3446': t===T.STAIRS?'#f7d44a': t===T.WATER?'#24467a': t===T.LAVA?'#a0300a': t===T.DOOR||t===T.DOOR_OPEN?'#8a5a36' : (f.visible[i]?'#8a8098':'#5a5266');
      c.fillRect(x*s,y*s,s,s); }
    for(const pr of f.props){ if(!f.explored[pr.y*f.w+pr.x]) continue; const col={chest:'#f7d44a',fountain:'#7fe6f2',shrine:'#c06af0',lectern:'#9fe8f0'}[pr.type]; if(col){ c.fillStyle=col; c.fillRect(pr.x*s,pr.y*s,s,s);} }
    for(const mo of f.mons){ if(!f.visible[mo.y*f.w+mo.x]) continue; c.fillStyle=mo.friendly?'#ff6a4a':mo.boss?'#ff3bd0':'#e05040'; c.fillRect(mo.x*s-1,mo.y*s-1,s+1,s+1); }
    c.fillStyle='#ffffff'; c.fillRect(S.player.x*s-1,S.player.y*s-1,s+2,s+2);
  }
};
