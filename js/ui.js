// ============================================================
//  INTERFACE — écrans, panneaux, dialogues, entrées
// ============================================================
const $ = s=>document.querySelector(s);
const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const SKILL_ICONS = {
 slash:["..........##",".........##+","........##+.",".......##+..","......##+...",".....##+....","....##+.....","...##+......","..##+.......",".##+........","##+.........","#+.........."],
 shield:["..########..",".#++++++++#.","#+########+#","#+###++###+#","#+###++###+#","#+########+#",".#+######+#.",".#+######+#.","..#+####+#..","...#+##+#...","....#++#....",".....##....."],
 whirl:["....####....","..##....##..",".#...##...#.","#...#..#...#","#..#....#..#","#..#..#.#..#","#..#..#....#","#...#..#...#",".#...##...#.","..##.....#..","....#####...","............"],
 arrow:["............","........#...","........##..","........###.","############","++++++++++##","############","........###.","........##..","........#...","............","............"],
 star:[".....##.....",".....##.....","....#++#....","#####++#####",".##++++++##.","..##++++##..","...#++++#...","..#++##++#..","..#+#..#+#..",".##......##.",".#........#.","............"],
 flame:[".....#......","....##......","....###..#..","...####.##..","..#####.###.","..##+######.",".##++#####..",".##+++####..",".###++###...","..###+###...","...######...","....####...."],
 drop:[".....##.....",".....##.....","....####....","....####....","...######...","..####+###..","..###+++##..",".####++####.",".##########.",".##########.","..########..","...######..."],
 eye:["............","............","...######...","..#......#..",".#..####..#.","#..##++##..#","#..##++##..#",".#..####..#.","..#......#..","...######...","............","............"],
 rain:["..#...#...#.","..#...#...#.","..#...#...#.","..#...#...#.","..#...#...#.","..#...#...#.",".###.###.###","..#...#...#.","............","+..+..+..+..",".++.++.++.++","............"],
 cloud:["............","....###.....","...#+++#....","..#+++++###.",".##++++#+++#","#++++++++++#","#++++++++++#",".##########.","............","..#..#..#...",".#..#..#....","............"],
 snow:[".....##.....","..#..##..#..","...#.##.#...","....####....","#..#+##+#..#","############","############","#..#+##+#..#","....####....","...#.##.#...","..#..##..#..",".....##....."],
 bolt:["......####..",".....####...","....####....","...####.....","..########..","....#####...","....####....","...####.....","..####......","..###.......",".##.........",".#.........."]
};
const SKICON = {};
const SLOT_ICON = {weapon:'i_sword',helm:'i_helm',armor:'i_armor',boots:'i_boots',ring:'i_ring',amulet:'i_amulet'};
function skillIcon(id){
  if(SKICON[id]) return SKICON[id];
  const sk=DATA.skills[id], rows=SKILL_ICONS[sk.icon]; const c=document.createElement('canvas'); c.width=c.height=48; const x=c.getContext('2d');
  const g=x.createRadialGradient(24,24,2,24,24,30); g.addColorStop(0,R.rgba(sk.color,0.35)); g.addColorStop(1,'#0b0a0f'); x.fillStyle=g; x.fillRect(0,0,48,48);
  for(let j=0;j<12;j++) for(let i=0;i<12;i++){ const ch=rows[j][i]; if(ch==='.') continue;
    x.fillStyle='#0b0a0f'; x.fillRect(i*3+6+1,j*3+6+1,3,3); }
  for(let j=0;j<12;j++) for(let i=0;i<12;i++){ const ch=rows[j][i]; if(ch==='.') continue;
    x.fillStyle= ch==='+' ? '#ffffff' : sk.color; x.fillRect(i*3+6,j*3+6,3,3); }
  return SKICON[id]=c.toDataURL();
}

const UI = {
  mode:'title', dialog:null, modalOpen:null, targeting:null, auto:null, autoTimer:null, logLines:[], toasts:[],
  init(){
    document.addEventListener('keydown',e=>this.key(e));
    const cv=$('#game');
    cv.addEventListener('mousemove',e=>this.mouseMove(e));
    cv.addEventListener('mouseleave',()=>{ R.mouse=null; this.hideTip(); });
    cv.addEventListener('click',e=>this.click(e));
    cv.addEventListener('contextmenu',e=>{ e.preventDefault(); this.cancelAll(); });
    document.addEventListener('pointerdown',()=>Sfx.ensure(),{once:true});
    this.showTitle();
  },
  // ================= ÉCRANS =================
  setScreen(html){ const s=$('#screen'); s.innerHTML=html; s.classList.remove('hidden'); $('#app').classList.add('hidden'); },
  enterGame(){ this.mode='game'; $('#screen').classList.add('hidden'); $('#screen').innerHTML=''; $('#app').classList.remove('hidden'); R.resize(); this.buildSide(); this.refresh(); this.stopTitleBg(); },
  showTitle(){
    this.mode='title'; this.closeModal(); const sv=Game.hasSave();
    const svTxt = sv ? `${esc(sv.name)} · ${DATA.classes[sv.cls].name} niv. ${sv.player.lvl} · Acte ${STORY.acts[sv.act].num}${sv.mode==='hardcore'?' · Hardcore':''}` : '';
    this.setScreen(`<canvas id="titlebg"></canvas>
      <div class="title-wrap">
        <div class="title-kicker">MEO STUDIO présente</div>
        <h1 class="game-title">Les Cendres<br>d'Aldaran</h1>
        <div class="title-sub">Un roguelike sombre, au tour par tour</div>
        <div class="title-menu">
          ${sv?`<button class="btn big gold" id="bContinue">Continuer<small>${svTxt}</small></button>`:''}
          <button class="btn big" id="bNew">Nouvelle partie</button>
          <button class="btn" id="bSound">Son : ${Sfx.on?'activé':'coupé'}</button>
          <button class="btn" id="bCredits">Crédits</button>
        </div>
        <div class="title-foot">ZQSD / WASD / flèches pour se déplacer · H pour l'aide</div>
      </div>`);
    if(sv) $('#bContinue').onclick=()=>{ Sfx.play('click'); Game.load(); };
    $('#bNew').onclick=()=>{ Sfx.play('click'); if(sv && !confirm('Commencer une nouvelle partie écrasera la sauvegarde actuelle. Continuer ?')) return; this.showClassSelect(); };
    $('#bSound').onclick=()=>{ Sfx.toggle(); this.showTitle(); };
    $('#bCredits').onclick=()=>this.modal(`<h2>Crédits</h2><p class="center">Conception & développement<br><b class="gold">MEO STUDIO</b></p><p class="center dim">Pixel art, musique et effets entièrement générés en code.<br>Aucune image, aucun fichier son.</p><p class="center"><button class="btn" onclick="UI.closeModal()">Fermer</button></p>`);
    this.startTitleBg();
  },
  startTitleBg(){
    const cv=$('#titlebg'); if(!cv) return; const c=cv.getContext('2d'); let parts=[];
    const rs=()=>{ cv.width=innerWidth; cv.height=innerHeight; }; rs(); this._rs=rs; addEventListener('resize',rs);
    const loop=()=>{ if(!$('#titlebg')) return; this.titleRaf=requestAnimationFrame(loop);
      const W=cv.width,H=cv.height, t=performance.now()/1000; c.fillStyle='#07060a'; c.fillRect(0,0,W,H);
      const g=c.createRadialGradient(W/2,H*1.05,0,W/2,H*1.05,H*0.9); g.addColorStop(0,'rgba(255,110,40,0.35)'); g.addColorStop(0.5,'rgba(120,30,20,0.12)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,W,H);
      // silhouettes de ruines
      c.fillStyle='#0d0a10'; c.beginPath(); c.moveTo(0,H);
      for(let x=0;x<=W;x+=W/24){ const k=x/W; const h=H*(0.72-0.12*Math.sin(k*9)-((Math.floor(k*24)%5===2)?0.18:0)-((Math.floor(k*24)%7===4)?0.1:0)); c.lineTo(x,h); c.lineTo(x+W/48,h); }
      c.lineTo(W,H); c.fill();
      if(parts.length<160) parts.push({x:Math.random()*W,y:H+5,vy:0.4+Math.random()*1.4,vx:(Math.random()-0.5)*0.4,s:1+Math.floor(Math.random()*3),l:1});
      c.globalCompositeOperation='lighter';
      parts=parts.filter(p=>{ p.y-=p.vy; p.x+=p.vx+Math.sin(t+p.y*0.01)*0.3; p.l-=0.0025; c.globalAlpha=Math.max(0,p.l); c.fillStyle=p.s>2?'#ffcf6a':'#ff7a2a'; c.fillRect(Math.round(p.x),Math.round(p.y),p.s*2,p.s*2); return p.l>0&&p.y>-10; });
      c.globalAlpha=1; c.globalCompositeOperation='source-over';
    }; loop();
  },
  stopTitleBg(){ cancelAnimationFrame(this.titleRaf); if(this._rs) removeEventListener('resize',this._rs); },
  showClassSelect(){
    this.mode='class'; let cls='knight', mode='story';
    const card=(k)=>{ const c=DATA.classes[k]; const b=c.base;
      const bar=(v,m)=>`<span class="sbar"><i style="width:${Math.min(100,v/m*100)}%"></i></span>`;
      return `<div class="ccard ${k===cls?'sel':''}" data-c="${k}" style="--cc:${c.color}">
        <canvas class="cspr" data-s="${c.spr}" width="96" height="96"></canvas>
        <h3>${c.name}</h3><div class="ctitle">${c.title}</div><p>${c.desc}</p>
        <div class="cstats"><div>PV ${bar(b.hp,62)}</div><div>Mana ${bar(b.mp,52)}</div><div>Puissance ${bar(b.atk,7)}</div><div>Défense ${bar(b.def+1,4)}</div><div>Critique ${bar(b.crit,12)}</div></div>
        <div class="cskills">${c.skills.slice(0,2).map(s=>`<span><img src="${skillIcon(s)}">${DATA.skills[s].name}</span>`).join('')}</div>
      </div>`; };
    const render=()=>{
      this.setScreen(`<canvas id="titlebg"></canvas><div class="class-wrap">
        <h2 class="screen-title">Qui se relève des cendres ?</h2>
        <div class="ccards">${['knight','rogue','mage'].map(card).join('')}</div>
        <div class="cfoot">
          <label>Nom <input id="hname" maxlength="16" value="${esc(this._name||'Porte-Cendre')}"></label>
          <div class="modesel"><button class="btn ${mode==='story'?'gold':''}" data-m="story">Histoire<small>Tu te relèves à la mort (−25% d'or)</small></button>
          <button class="btn ${mode==='hardcore'?'red':''}" data-m="hardcore">Hardcore<small>Une seule vie. Sauvegarde effacée.</small></button></div>
          <div><button class="btn" id="bBack">Retour</button> <button class="btn big gold" id="bStart">Commencer</button></div>
        </div></div>`);
      this.startTitleBg();
      document.querySelectorAll('.ccard').forEach(el=>el.onclick=()=>{ this._name=$('#hname').value; cls=el.dataset.c; Sfx.play('click'); render(); });
      document.querySelectorAll('[data-m]').forEach(el=>el.onclick=()=>{ this._name=$('#hname').value; mode=el.dataset.m; Sfx.play('click'); render(); });
      $('#bBack').onclick=()=>this.showTitle();
      $('#bStart').onclick=()=>{ Sfx.ensure(); Sfx.play('levelup'); const n=$('#hname').value.trim()||'Porte-Cendre'; this.stopTitleBg(); Game.newGame(n,cls,mode); };
      const anim=()=>{ const els=document.querySelectorAll('.cspr'); if(!els.length) return; const t=performance.now()/1000;
        els.forEach(cv=>{ const x=cv.getContext('2d'); x.imageSmoothingEnabled=false; x.clearRect(0,0,96,96); const b=Math.floor(t*2)%2*3;
          x.fillStyle='rgba(0,0,0,0.4)'; x.beginPath(); x.ellipse(48,90,26,5,0,0,6.28); x.fill(); x.drawImage(SPR[cv.dataset.s],0,-b+2,96,96); });
        requestAnimationFrame(anim); }; anim();
    };
    render();
  },
  showDeath(){
    this.cancelAll(); this.closeModal();
    setTimeout(()=>{
      this.mode='death'; const hc=S.mode==='hardcore';
      this.setScreen(`<div class="death-wrap"><h1 class="death-title">Ta braise s'éteint</h1>
        <p class="dim">${esc(S.name)} · ${DATA.classes[S.cls].name} niv. ${S.player.lvl} · ${STORY.acts[S.act].floors[S.fi].title}</p>
        <div class="dstats"><div><b>${S.kills}</b>ennemis</div><div><b>${S.turn}</b>tours</div><div><b>${S.lore.length}/20</b>fragments</div><div><b>${S.deaths}</b>morts</div></div>
        ${hc?`<p>Ta légende s'arrête ici. Le mode Hardcore ne pardonne pas.</p><button class="btn big" id="bT">Retour au titre</button>`
            :`<p class="dim">« Pas encore. La Flamme a encore besoin de toi. » — Ysolde</p><button class="btn big gold" id="bR">Se relever (−25% d'or)</button> <button class="btn" id="bT">Titre</button>`}
      </div>`);
      if($('#bR')) $('#bR').onclick=()=>{ Sfx.play('heal'); Game.retry(); };
      $('#bT').onclick=()=>{ if(!hc) Game.save(); S=null; this.showTitle(); };
    }, 900);
  },
  showEnding(key){
    const E=STORY.endings[key];
    this.scene(E.lines, ()=>{
      S.complete=true; S.ending=key; Game.save(); this.mode='ending'; Sfx.play('levelup');
      this.setScreen(`<canvas id="titlebg"></canvas><div class="end-wrap"><div class="title-kicker">${key==='dawn'?'Fin véritable':'Fin'}</div>
        <h1 class="game-title">${E.title}</h1>
        <p class="dim">${esc(S.name)} · ${DATA.classes[S.cls].name} niv. ${S.player.lvl}</p>
        <div class="dstats"><div><b>${S.kills}</b>ennemis</div><div><b>${S.turn}</b>tours</div><div><b>${S.lore.length}/20</b>fragments</div><div><b>${S.deaths}</b>morts</div></div>
        ${key!=='dawn'?`<p class="dim">Il existe d'autres fins… peut-être faut-il ne pas descendre seul, et se souvenir de tout.</p>`:`<p class="gold">Tu as brisé le cycle. Merci d'avoir joué.</p>`}
        <p class="dim small">Les Cendres d'Aldaran — MEO STUDIO</p>
        <button class="btn big" id="bT">Retour au titre</button></div>`);
      this.startTitleBg(); $('#bT').onclick=()=>{ S=null; this.showTitle(); };
    });
  },
  // ================= CAMP =================
  showCamp(){
    this.mode='camp'; this.cancelAll(); this.closeModal(); let tab='shop';
    const next=STORY.acts[S.act+1];
    const render=()=>{
      this.setScreen(`<div class="camp">
        <div class="camp-scene"><canvas id="campcv"></canvas><div class="camp-title"><div class="title-kicker">Sanctuaire</div><h2>La Forge de Brannoc</h2></div></div>
        <div class="camp-panel">
          <div class="camp-head"><div class="tabs"><button class="tab ${tab==='shop'?'on':''}" data-t="shop">Marchand</button><button class="tab ${tab==='forge'?'on':''}" data-t="forge">Forge</button><button class="tab ${tab==='sell'?'on':''}" data-t="sell">Vendre</button><button class="tab" data-t="inv">Sac & équipement</button><button class="tab" data-t="skills">Compétences${S.player.sp?` <span class="badge">${S.player.sp}</span>`:''}</button></div>
          <div class="goldline"><img src="${iconURL('i_gold',24)}"> <b>${S.gold}</b> or</div></div>
          <div class="camp-body" id="campBody"></div>
          <div class="camp-foot"><button class="btn big gold" id="bNext">Descendre : Acte ${next.num} — ${next.title} ▸</button></div>
        </div></div>`);
      document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{ const t=b.dataset.t; Sfx.play('click'); if(t==='inv') return this.openInventory(()=>render()); if(t==='skills') return this.openSkills(()=>render()); tab=t; render(); });
      $('#bNext').onclick=()=>{ Sfx.play('stairs'); this.stopCamp(); Game.leaveCamp(); };
      const body=$('#campBody');
      if(tab==='shop'){
        const cons=['pot_hp','pot_mp','elixir','bomb','sc_tele','sc_map'];
        body.innerHTML=`<h4>Potions & parchemins</h4><div class="shopcons">${cons.map(id=>{ const c=DATA.consumables[id]; const pr=Math.round(c.price*(1+S.act*0.35));
          return `<button class="shopitem" data-c="${id}"><img src="${iconURL(c.spr,32)}"><span>${c.name}<small>${c.desc}</small></span><b>${pr}</b></button>`; }).join('')}</div>
          <h4>Équipement forgé par Brannoc</h4><div class="shopgear">${S.shop.gear.length?S.shop.gear.map(it=>`<button class="shopitem gear" data-g="${it.uid}" style="--rc:${Items.color(it)}"><img src="${iconURL(it.spr,32)}"><span style="color:${Items.color(it)}">${esc(Items.name(it))}<small>${DATA.slotNames[it.slot]} · niv. ${it.ilvl}</small></span><b>${Items.value(it)}</b></button>`).join(''):'<p class="dim">« T\'as tout pris, gamin. »</p>'}</div>`;
        body.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ const e=Game.buy('cons',b.dataset.c); if(e) this.toast(e); render(); });
        body.querySelectorAll('[data-g]').forEach(b=>{ const it=S.shop.gear.find(g=>g.uid===b.dataset.g);
          b.onclick=()=>{ const e=Game.buy('gear',it.uid); if(e) this.toast(e); else this.toast(`Acheté : ${Items.name(it)}`); render(); };
          this.bindTip(b,()=>this.itemHTML(it,true)); });
      } else if(tab==='forge'){
        const list=[...DATA.slots.map(s=>S.player.equip[s]).filter(Boolean), ...S.player.bag.filter(b=>b.kind==='gear')];
        body.innerHTML=`<p class="dim">« Chaque niveau ajoute 12% aux stats principales. Jusqu'à +5, après ça le métal pleure. »</p><div class="forge">${list.map(it=>{
          const eq=DATA.slots.some(s=>S.player.equip[s]===it);
          return `<div class="forgerow" data-u="${it.uid}"><img src="${iconURL(it.spr,32)}"><span style="color:${Items.color(it)}">${esc(Items.name(it))}${eq?' <em class="dim">(équipé)</em>':''}<small>${this.statLine(Items.stats(it))}</small></span>
          ${it.plus>=5?'<b class="dim">MAX</b>':`<button class="btn small" data-up="${it.uid}">+${it.plus+1} · ${Game.upgradeCost(it)} or</button>`}</div>`; }).join('')}</div>`;
        body.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{ const it=list.find(x=>x.uid===b.dataset.up); const e=Game.upgrade(it); if(e) this.toast(e); else { this.toast(`${Items.name(it)} !`); campFx.anvil=performance.now(); } render(); });
        body.querySelectorAll('.forgerow').forEach(r=>{ const it=list.find(x=>x.uid===r.dataset.u); this.bindTip(r,()=>this.itemHTML(it,false)); });
      } else if(tab==='sell'){
        const items=S.player.bag;
        body.innerHTML=items.length?`<p class="dim">Prix de rachat : 30% de la valeur.</p><div class="shopgear">${items.map(it=>`<button class="shopitem" data-s="${it.uid}"><img src="${iconURL(Items.spr(it),32)}"><span style="color:${Items.color(it)}">${esc(Items.name(it))}${it.qty>1?' ×'+it.qty:''}</span><b>+${Math.round(Items.value(it)*0.3)}</b></button>`).join('')}</div>`:'<p class="dim">Ton sac est vide.</p>';
        body.querySelectorAll('[data-s]').forEach(b=>{ const it=items.find(x=>x.uid===b.dataset.s);
          if(it.kind==='gear') this.bindTip(b,()=>this.itemHTML(it,true));
          b.onclick=()=>{ if(it.kind==='gear' && it.rarity>=3 && !confirm(`Vendre ${Items.name(it)} ?`)) return; const v=Game.sell(it.uid); this.toast(`+${v} or`); this.hideTip(); render(); }; });
      }
      this.startCamp();
    };
    const campFx={anvil:0};
    this._campRender=render;
    render();
    this._campFx=campFx;
  },
  startCamp(){
    const cv=$('#campcv'); if(!cv) return; if(this.campRaf) cancelAnimationFrame(this.campRaf);
    const c=cv.getContext('2d'); let parts=[];
    const loop=()=>{ const cvv=$('#campcv'); if(!cvv) return; this.campRaf=requestAnimationFrame(loop);
      const r=cvv.getBoundingClientRect(); if(cvv.width!==Math.floor(r.width)){ cvv.width=Math.floor(r.width); cvv.height=Math.floor(r.height); }
      const W=cvv.width,H=cvv.height,t=performance.now()/1000; c.imageSmoothingEnabled=false;
      c.fillStyle='#0a0709'; c.fillRect(0,0,W,H);
      const s=Math.max(3,Math.floor(Math.min(W/80,H/50)));
      const gy=H*0.72;
      // sol
      c.fillStyle='#1a1214'; c.fillRect(0,gy,W,H-gy);
      for(let x=0;x<W;x+=s*4){ c.fillStyle=(x/s/4)%2?'#20171a':'#1c1416'; c.fillRect(x,gy,s*4,s); }
      // lueur
      const fl=0.85+0.15*Math.sin(t*8)+0.05*Math.sin(t*21);
      const g=c.createRadialGradient(W/2,gy,0,W/2,gy,W*0.5*fl); g.addColorStop(0,'rgba(255,130,50,0.45)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,W,H);
      // enclume & forge
      c.drawImage(SPR.brazier,W*0.78,gy-s*16,s*16,s*16); R.flame(c,W*0.78+s*8,gy-s*9,s*1.8,'#ff7a2a',3);
      // personnages
      const bob=Math.floor(t*2)%2*s;
      c.drawImage(SPR.brannoc,W*0.62,gy-s*16-bob,s*16,s*16);
      c.save(); c.translate(W*0.3+s*16,gy-s*16-bob); c.scale(-1,1); c.drawImage(SPR[DATA.classes[S.cls].spr],0,0,s*16,s*16); c.restore();
      c.globalAlpha=0.55+0.15*Math.sin(t*2); c.drawImage(SPR.ysolde,W*0.14,gy-s*18+Math.sin(t*1.5)*s*2,s*16,s*16); c.globalAlpha=1;
      // feu de camp
      const fx=W/2, fy=gy;
      c.fillStyle='#4e3020'; c.fillRect(fx-s*6,fy-s*2,s*12,s*2); c.fillStyle='#6e4626'; c.fillRect(fx-s*5,fy-s*3,s*4,s); c.fillRect(fx+s*1,fy-s*3,s*4,s);
      for(let i=0;i<5;i++){ const h=(6+Math.sin(t*9+i*1.7)*2.5)*s; const x=fx+(i-2)*s*2;
        c.fillStyle='#d8391c'; c.fillRect(x-s,fy-s*2-h,s*2,h); c.fillStyle='#f08a2c'; c.fillRect(x-s*0.5,fy-s*2-h*0.75,s,h*0.75); c.fillStyle='#ffe08a'; c.fillRect(x-s*0.5,fy-s*2-h*0.4,s,h*0.4); }
      if(Math.random()<0.6) parts.push({x:fx+(Math.random()-0.5)*s*8,y:fy-s*6,vx:(Math.random()-0.5)*0.6,vy:-0.6-Math.random()*1.4,l:1});
      if(this._campFx && performance.now()-this._campFx.anvil<300) for(let i=0;i<6;i++) parts.push({x:W*0.78+s*8,y:gy-s*10,vx:(Math.random()-0.5)*4,vy:-Math.random()*3,l:0.6});
      c.globalCompositeOperation='lighter';
      parts=parts.filter(p=>{ p.x+=p.vx; p.y+=p.vy; p.l-=0.012; c.globalAlpha=Math.max(0,p.l); c.fillStyle=p.l>0.5?'#ffcf6a':'#ff6a2a'; c.fillRect(Math.round(p.x/s)*s,Math.round(p.y/s)*s,s,s); return p.l>0; });
      c.globalAlpha=1; c.globalCompositeOperation='source-over';
    }; loop();
  },
  stopCamp(){ cancelAnimationFrame(this.campRaf); },

  // ================= PANNEAU LATÉRAL =================
  buildSide(){
    $('#side').innerHTML=`
      <div class="hero"><canvas id="portrait" width="64" height="64"></canvas><div><div class="hname" id="hName"></div><div class="hcls" id="hCls"></div></div></div>
      <div class="bars">
        <div class="bar hp"><i id="bHp"></i><span id="tHp"></span></div>
        <div class="bar mp"><i id="bMp"></i><span id="tMp"></span></div>
        <div class="bar xp"><i id="bXp"></i><span id="tXp"></span></div>
      </div>
      <div class="statgrid" id="sGrid"></div>
      <div class="statuses" id="sStat"></div>
      <div class="eqrow" id="eqRow"></div>
      <div class="minibox"><canvas id="minimap"></canvas></div>
      <div class="loc" id="loc"></div>
      <div class="sidebtns">
        <button class="btn small" data-k="i">Sac <kbd>I</kbd></button>
        <button class="btn small" data-k="k">Compétences <kbd>K</kbd><span class="badge hidden" id="spBadge"></span></button>
        <button class="btn small" data-k="j">Journal <kbd>J</kbd></button>
        <button class="btn small" data-k="h">Aide <kbd>H</kbd></button>
        <button class="btn small wide" data-k="escape">Menu <kbd>Échap</kbd></button>
      </div>`;
    R.mini=$('#minimap');
    document.querySelectorAll('.sidebtns [data-k]').forEach(b=>b.onclick=()=>{ Sfx.play('click'); this.hotkey(b.dataset.k); });
  },
  refresh(){
    if(!S || this.mode!=='game') return;
    const p=S.player, st=Game.pstats(), c=DATA.classes[S.cls];
    const pc=$('#portrait'); if(pc){ const x=pc.getContext('2d'); x.imageSmoothingEnabled=false; x.clearRect(0,0,64,64); x.drawImage(SPR[c.spr],0,0,64,64); }
    $('#hName').textContent=S.name; $('#hCls').innerHTML=`${c.name} · niv. <b>${p.lvl}</b>${S.mode==='hardcore'?' · <span class="red">HC</span>':''}`;
    const set=(id,v,max,t)=>{ $('#b'+id).style.width=Math.max(0,Math.min(100,v/max*100))+'%'; $('#t'+id).textContent=t; };
    set('Hp',p.hp,st.maxHp,`PV ${Math.max(0,Math.ceil(p.hp))} / ${st.maxHp}`);
    set('Mp',p.mp,st.maxMp,`Mana ${Math.floor(p.mp)} / ${st.maxMp}`);
    set('Xp',p.xp,Game.xpNeed(p.lvl),`XP ${p.xp} / ${Game.xpNeed(p.lvl)}`);
    $('#sGrid').innerHTML=`<div><span>Puissance</span><b>${Math.round(st.atk)}</b></div><div><span>Défense</span><b>${Math.round(st.def)}</b></div>
      <div><span>Critique</span><b>${st.crit}%</b></div><div><span>Esquive</span><b>${st.dodge}%</b></div>
      <div class="goldc"><span>Or</span><b>${S.gold}</b></div><div><span>Fragments</span><b>${S.lore.length}/20</b></div>`;
    const SN={poison:['Poison','#7cc94a'],burn:['Brûlure','#ff7a2a'],freeze:['Gelé','#7fe6f2'],stun:['Étourdi','#f7d44a'],root:['Entravé','#ffffff'],bastion:['Bastion','#b7c4d4'],
      atkUp:['Fureur','#ff7a3a'],shield:['Bouclier','#4a8fe0'],invis:['Invisible','#a35ee0'],nextDouble:['Coup fatal','#ff3bd0'],dark:['Ténèbres','#a35ee0']};
    $('#sStat').innerHTML=p.statuses.map(s=>SN[s.t]?`<span style="--sc:${SN[s.t][1]}">${SN[s.t][0]} ${s.n}</span>`:'').join('');
    $('#eqRow').innerHTML=DATA.slots.map(s=>{ const it=p.equip[s]; return `<div class="eqs" data-s="${s}" style="--rc:${it?Items.color(it):'#2a2230'}">${it?`<img src="${iconURL(it.spr,32)}">`:`<img class="ph" src="${iconURL(SLOT_ICON[s],32)}">`}${it&&it.plus?`<b>+${it.plus}</b>`:''}</div>`; }).join('');
    document.querySelectorAll('#eqRow .eqs').forEach(el=>{ const it=p.equip[el.dataset.s]; el.onclick=()=>this.openInventory(); if(it) this.bindTip(el,()=>this.itemHTML(it,false)); });
    const act=STORY.acts[S.act];
    $('#loc').innerHTML=`<div class="gold">Acte ${act.num} · ${act.title}</div><div>${act.floors[S.fi].title} <span class="dim">(${S.fi+1}/4)</span></div><div class="dim">Tour ${S.turn}</div>`;
    const b=$('#spBadge'); b.textContent=p.sp; b.classList.toggle('hidden',!p.sp);
    this.renderHotbar();
  },
  renderHotbar(){
    const p=S.player, c=DATA.classes[S.cls], st=Game.pstats();
    const pots=id=>{ const s=p.bag.find(b=>b.kind==='cons'&&b.id===id); return s?s.qty:0; };
    let h=c.skills.map((id,i)=>{ const r=Game.skillRank(id), sk=DATA.skills[id];
      if(!r) return `<div class="hk locked" title="${sk.name} (niv. ${sk.lvl})"><kbd>${i+1}</kbd><span class="lock">🔒</span></div>`;
      const cd=p.cds[id]||0, cost=Game.skillCost(id), nomp=p.mp<cost;
      return `<div class="hk ${cd||nomp?'off':''}" data-sk="${i}"><img src="${skillIcon(id)}"><kbd>${i+1}</kbd>${cd?`<span class="cd">${cd}</span>`:''}<span class="mpc ${nomp?'red':''}">${cost}</span></div>`; }).join('');
    h+=`<div class="hsep"></div>`;
    h+=`<div class="hk ${st.range?'':'off'}" data-act="f"><img src="${iconURL(p.equip.weapon?p.equip.weapon.spr:'i_bow',48)}"><kbd>F</kbd><span class="mpc">${st.range?'tir':'—'}</span></div>`;
    h+=`<div class="hk ${pots('pot_hp')?'':'off'}" data-act="v"><img src="${iconURL('i_potion',48)}"><kbd>V</kbd><span class="qty">${pots('pot_hp')}</span></div>`;
    h+=`<div class="hk ${pots('pot_mp')?'':'off'}" data-act="b"><img src="${iconURL('potion_mp',48)}"><kbd>B</kbd><span class="qty">${pots('pot_mp')}</span></div>`;
    const hb=$('#hotbar'); hb.innerHTML=h;
    hb.querySelectorAll('[data-sk]').forEach(el=>{ const i=+el.dataset.sk, id=c.skills[i]; el.onclick=()=>this.trySkill(i);
      this.bindTip(el,()=>{ const sk=DATA.skills[id], r=Game.skillRank(id); return `<div class="tt-name" style="color:${sk.color}">${sk.name} <span class="dim">rang ${r}/3</span></div><div>${sk.desc(r)}</div><div class="dim">Mana ${Game.skillCost(id)} · Recharge ${sk.cd} tours</div>`; }); });
    hb.querySelectorAll('[data-act]').forEach(el=>el.onclick=()=>this.hotkey(el.dataset.act));
  },
  log(msg,color){
    this.logLines.push({msg,color,t:Date.now()}); if(this.logLines.length>40) this.logLines.shift();
    const el=$('#log'); if(!el) return;
    el.innerHTML=this.logLines.slice(-6).map((l,i,a)=>`<div style="color:${l.color||'#c8c2b8'};opacity:${0.45+0.55*(i+1)/a.length}">${esc(l.msg)}</div>`).join('');
  },
  toast(msg){
    const el=document.createElement('div'); el.className='toast'; el.textContent=msg; $('#toasts').appendChild(el);
    setTimeout(()=>el.classList.add('out'),2600); setTimeout(()=>el.remove(),3200);
  },
  banner(a,b){
    const el=$('#banner'); el.innerHTML=`<div class="b1">${esc(a)}</div><div class="b2">${esc(b)}</div>`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  },
  bossBar(m){
    this._boss=m; const el=$('#bossbar'); if(!m){ el.classList.add('hidden'); return; }
    el.classList.remove('hidden'); el.style.setProperty('--bc', m.boss&&DATA.bosses[m.id]?DATA.bosses[m.id].color:'#ff3b3b');
    const upd=()=>{ if(this._boss!==m) return; el.innerHTML=`<div class="bn">${esc(m.name)}</div><div class="bb"><i style="width:${Math.max(0,m.hp/m.maxHp*100)}%"></i></div>`;
      if(!m.dead) requestAnimationFrame(()=>setTimeout(upd,100)); else el.classList.add('hidden'); }; upd();
  },
  // ================= DIALOGUES =================
  scene(lines, done, npc){
    if(!lines || !lines.length){ done&&done(); return; }
    if(this.dialog){ (this.sceneQueue=this.sceneQueue||[]).push([lines,done,npc]); return; }
    this.cancelAll(); lines=[...lines];
    const box=$('#dialog'); let i=0, typing=null, full='';
    this.dialog={advance:null, choose:null};
    const finish=()=>{ clearInterval(typing); box.classList.add('hidden'); box.innerHTML=''; this.dialog=null; this.refresh(); done&&done();
      if(!this.dialog && this.sceneQueue && this.sceneQueue.length){ const q=this.sceneQueue.shift(); this.scene(q[0],q[1],q[2]); } };
    const reqOk=ch=> ch.reqFn ? ch.reqFn(S) : ch.req ? S.player.bag.some(b=>b.kind==='cons'&&b.id===ch.req) : true;
    const renderChoices=(L)=>{
      if(!box.querySelector('.dchoices')){ box.className='dialog narr'; box.innerHTML=`<div class="dbody"><div class="dtext"></div><div class="dchoices"></div><div class="dmore">▼</div></div>`; box.classList.remove('hidden'); }
      const opts=L.choices.map(ch=>({ch, ok:reqOk(ch)}));
      box.querySelector('.dchoices').innerHTML=opts.map((o,k)=>`<button class="btn choice ${o.ok?'':'locked'}" data-k="${k}" ${o.ok?'':'disabled'}>${k+1}. ${esc(o.ch.t)}${!o.ok?`<small>${esc(o.ch.lockText||('Il te faut : '+((DATA.consumables[o.ch.req]||{}).name||'')))}</small>`:''}</button>`).join('');
      box.querySelector('.dmore').classList.add('hidden');
      const pick=(k)=>{ const o=opts[k]; if(!o||!o.ok) return; Sfx.play('click');
        if(o.ch.fx && o.ch.fx.ending){ clearInterval(typing); box.classList.add('hidden'); this.dialog=null; Game.applyFx(o.ch.fx,npc); return; }
        if(o.ch.fx) Game.applyFx(o.ch.fx,npc);
        lines.splice(i+1,0,...(o.ch.then||[])); i++; show(); };
      box.querySelectorAll('.choice').forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); pick(+b.dataset.k); });
      this.dialog.choose=pick; this.dialog.advance=null;
    };
    const show=()=>{
      if(!this.dialog) return;
      if(i>=lines.length) return finish();
      const L=lines[i];
      if(!Array.isArray(L)){
        if(L.choices) return renderChoices(L);
        if(L.fx && L.fx.ending){ box.classList.add('hidden'); this.dialog=null; Game.applyFx(L.fx,npc); return; }
        if(L.fx) Game.applyFx(L.fx,npc);
        i++; return show();
      }
      const [who,text]=L; const sp=SPEAKERS[who]||SPEAKERS.narr;
      const name = who==='hero'? S.name : sp.name;
      const spr = who==='hero'? DATA.classes[S.cls].spr : sp.spr;
      box.className = 'dialog' + (who==='narr'?' narr':'') + (who==='ysolde'?' ghost':'');
      box.innerHTML=`${spr?`<div class="dport" style="--pc:${(who==='hero'?DATA.classes[S.cls].color:sp.color)||'#c9a35a'}"><canvas width="96" height="96"></canvas></div>`:''}
        <div class="dbody">${name?`<div class="dname" style="color:${sp.color}">${esc(name)}${sp.title&&who!=='hero'?` <span>${esc(sp.title)}</span>`:''}</div>`:''}
        <div class="dtext"></div><div class="dchoices"></div><div class="dmore">▼</div></div>`;
      if(spr){ const x=box.querySelector('canvas').getContext('2d'); x.imageSmoothingEnabled=false; x.drawImage(SPR[spr],0,0,96,96); }
      box.classList.remove('hidden');
      const tEl=box.querySelector('.dtext'); full=text; let n=0; clearInterval(typing);
      const typed=()=>{ clearInterval(typing); typing=null; tEl.textContent=full;
        const nx=lines[i+1]; if(nx && !Array.isArray(nx) && nx.choices){ i++; renderChoices(nx); } };
      typing=setInterval(()=>{ n+=2; tEl.textContent=full.slice(0,n); if(n%6===0) Sfx.play('type'); if(n>=full.length) typed(); },18);
      this.dialog.choose=null;
      this.dialog.advance=()=>{ if(typing){ typed(); return; } i++; show(); };
    };
    box.onclick=(e)=>{ if(e.target.closest('.choice')) return; if(this.dialog&&this.dialog.advance) this.dialog.advance(); };
    show();
  },
  // ================= MODALES =================
  modal(html, onClose, cls=''){
    const o=$('#overlay'); o.className='overlay '+cls; $('#modal').innerHTML=html; this.modalOpen={onClose};
    o.onclick=(e)=>{ if(e.target===o) this.closeModal(); };
  },
  closeModal(){ const o=$('#overlay'); if(!o) return; o.className='overlay hidden'; $('#modal').innerHTML=''; const m=this.modalOpen; this.modalOpen=null; this.hideTip(); if(m&&m.onClose) m.onClose(); if(this.mode==='game') this.refresh(); },
  statLine(st){ return Object.entries(st).map(([k,v])=>`${v>0?'+':''}${v}${['crit','dodge','ls','burn','poison','freeze','xp','gold','dmg','cost'].includes(k)?'%':''} ${(DATA.statNames[k]||k).replace(' %','')}`).join(' · '); },
  itemHTML(it, compare){
    if(it.kind==='cons'){ const c=DATA.consumables[it.id]; return `<div class="tt-name">${c.name}${it.qty>1?' ×'+it.qty:''}</div><div>${c.desc}</div><div class="dim">Valeur ${c.price} or</div>`; }
    const st=Items.stats(it); const eq=S.player.equip[it.slot]; const est=eq&&eq!==it?Items.stats(eq):null;
    const keys=new Set([...Object.keys(st), ...(compare&&est?Object.keys(est):[])]);
    let rows='';
    for(const k of keys){ const v=st[k]||0; const pct=['crit','dodge','ls','burn','poison','freeze','xp','gold','dmg','cost'].includes(k)?'%':'';
      let diff=''; if(compare&&est){ const d=Math.round((v-(est[k]||0))*10)/10; if(d) diff=`<em class="${(d>0)!==(k==='cost')?'up':'down'}">${d>0?'▲':'▼'}${Math.abs(d)}</em>`; }
      if(!v && !diff) continue;
      rows+=`<div class="tt-stat"><span>${DATA.statNames[k]||k}</span><b>${v>0?'+':''}${v}${pct}</b>${diff}</div>`; }
    return `<div class="tt-name" style="color:${Items.color(it)}">${esc(Items.name(it))}</div>
      <div class="tt-type">${DATA.rarities[it.rarity].name} · ${DATA.slotNames[it.slot]} · niv. ${it.ilvl}${it.range?` · portée ${it.range}`:''}${it.pierce?' · perforant':''}</div>
      ${rows}${it.lore?`<div class="tt-lore">« ${esc(it.lore)} »</div>`:''}
      ${compare&&est?`<div class="dim small">Comparé à : ${esc(Items.name(eq))}</div>`:''}
      <div class="dim small">Valeur ${Items.value(it)} or</div>`;
  },
  bindTip(el, fn){
    el.addEventListener('mouseenter',e=>{ this.showTip(fn(),e); });
    el.addEventListener('mousemove',e=>this.moveTip(e));
    el.addEventListener('mouseleave',()=>this.hideTip());
  },
  showTip(html,e){ const t=$('#tooltip'); t.innerHTML=html; t.classList.remove('hidden'); this.moveTip(e); },
  moveTip(e){ const t=$('#tooltip'); const w=t.offsetWidth, h=t.offsetHeight; let x=e.clientX+16, y=e.clientY+16;
    if(x+w>innerWidth-8) x=e.clientX-w-16; if(y+h>innerHeight-8) y=innerHeight-h-8; t.style.left=x+'px'; t.style.top=y+'px'; },
  hideTip(){ const t=$('#tooltip'); if(t) t.classList.add('hidden'); },

  openInventory(onClose){
    let sel=null;
    const render=()=>{
      const p=S.player, st=Game.pstats();
      const slot=s=>{ const it=p.equip[s]; return `<div class="islot ${sel&&sel.where==='eq'&&sel.slot===s?'sel':''}" data-eq="${s}" style="--rc:${it?Items.color(it):'#2a2230'}">${it?`<img src="${iconURL(it.spr,48)}">${it.plus?`<b>+${it.plus}</b>`:''}`:`<img class="ph" src="${iconURL(SLOT_ICON[s],48)}" title="${DATA.slotNames[s]}">`}</div>`; };
      const cells=[]; for(let i=0;i<24;i++){ const it=p.bag[i];
        cells.push(`<div class="icell ${it&&sel&&sel.uid===it.uid?'sel':''}" ${it?`data-u="${it.uid}"`:''} style="--rc:${it?Items.color(it):'#1d1a24'}">${it?`<img src="${iconURL(Items.spr(it),48)}">${it.qty>1?`<span>${it.qty}</span>`:''}${it.kind==='gear'&&it.plus?`<b>+${it.plus}</b>`:''}`:''}</div>`); }
      let det='<p class="dim center">Clique un objet pour l\'examiner.<br>Double-clic : équiper / utiliser.</p>';
      const selIt = sel ? (sel.where==='eq'? p.equip[sel.slot] : p.bag.find(b=>b.uid===sel.uid)) : null;
      if(selIt){ det=this.itemHTML(selIt, sel.where!=='eq')+`<div class="detbtns">`+
        (sel.where==='eq'? `<button class="btn small" id="iUn">Retirer</button>` :
          (selIt.kind==='gear'?`<button class="btn small gold" id="iEq">Équiper</button>`:`<button class="btn small gold" id="iUse">Utiliser</button>`)+
          (this.mode==='game'?`<button class="btn small" id="iDrop">Jeter</button>`:''))+`</div>`; }
      this.modal(`<h2>Sac & équipement</h2><div class="inv">
        <div class="doll">
          <div class="dollgrid">${slot('helm')}<canvas id="dollspr" width="96" height="96"></canvas>${slot('amulet')}${slot('weapon')}${slot('armor')}${slot('ring')}<div></div>${slot('boots')}<div></div></div>
          <div class="fullstats">
            <div><span>PV max</span><b>${st.maxHp}</b></div><div><span>Mana max</span><b>${st.maxMp}</b></div>
            <div><span>Puissance</span><b>${Math.round(st.atk)}</b></div><div><span>Défense</span><b>${Math.round(st.def)}</b></div>
            <div><span>Critique</span><b>${st.crit}%</b></div><div><span>Esquive</span><b>${st.dodge}%</b></div>
            ${st.ls?`<div><span>Vol de vie</span><b>${st.ls}%</b></div>`:''}${st.regen?`<div><span>Régén. PV</span><b>${st.regen}</b></div>`:''}
            ${st.mpr?`<div><span>Régén. mana</span><b>${st.mpr}</b></div>`:''}${st.burn?`<div><span>Brûlure</span><b>${st.burn}%</b></div>`:''}
            ${st.poison?`<div><span>Poison</span><b>${st.poison}%</b></div>`:''}${st.freeze?`<div><span>Gel</span><b>${st.freeze}%</b></div>`:''}
            ${st.thorns?`<div><span>Épines</span><b>${st.thorns}</b></div>`:''}${st.dmg?`<div><span>Dégâts</span><b>+${st.dmg}%</b></div>`:''}
            ${st.range?`<div><span>Portée (F)</span><b>${st.range}</b></div>`:''}<div class="goldc"><span>Or</span><b>${S.gold}</b></div>
          </div></div>
        <div class="bagside"><div class="bag">${cells.join('')}</div><div class="det">${det}</div></div>
      </div><p class="center"><button class="btn" id="iClose">Fermer [I]</button></p>`, onClose, 'wide');
      const dc=$('#dollspr').getContext('2d'); dc.imageSmoothingEnabled=false; dc.drawImage(SPR[DATA.classes[S.cls].spr],0,0,96,96);
      document.querySelectorAll('[data-eq]').forEach(el=>{ const s=el.dataset.eq; const it=p.equip[s];
        el.onclick=()=>{ sel={where:'eq',slot:s}; Sfx.play('click'); render(); };
        el.ondblclick=()=>{ Game.unequip(s); sel=null; render(); };
        if(it) this.bindTip(el,()=>this.itemHTML(it,false)); });
      document.querySelectorAll('[data-u]').forEach(el=>{ const it=p.bag.find(b=>b.uid===el.dataset.u);
        el.onclick=()=>{ sel={where:'bag',uid:it.uid}; Sfx.play('click'); render(); };
        el.ondblclick=()=>{ this.hideTip(); if(it.kind==='gear'){ Game.equip(it.uid); sel=null; render(); } else this.useFromBag(it); };
        this.bindTip(el,()=>this.itemHTML(it,true)); });
      if($('#iEq')) $('#iEq').onclick=()=>{ Game.equip(selIt.uid); sel=null; render(); };
      if($('#iUn')) $('#iUn').onclick=()=>{ Game.unequip(sel.slot); sel=null; render(); };
      if($('#iUse')) $('#iUse').onclick=()=>this.useFromBag(selIt);
      if($('#iDrop')) $('#iDrop').onclick=()=>{ if(selIt.kind==='gear'&&selIt.rarity>=3&&!confirm(`Jeter ${Items.name(selIt)} ?`)) return; Game.drop(selIt.uid); sel=null; render(); };
      $('#iClose').onclick=()=>this.closeModal();
      this._invRender=render;
    };
    render();
  },
  useFromBag(it){
    if(this.mode!=='game'){ if(['pot_hp','pot_mp','elixir'].includes(it.id)){ Game.useItem(it.uid); this._invRender&&this._invRender(); } else this.toast('Utilisable seulement dans le donjon.'); return; }
    if(it.id==='bomb'){ this.closeModal(); Game.useItem(it.uid); return; }
    this.closeModal(); this.act(()=>Game.useItem(it.uid));
  },
  openSkills(onClose){
    const render=()=>{
      const p=S.player, c=DATA.classes[S.cls];
      this.modal(`<h2>Compétences — ${c.name}</h2><p class="center">Points disponibles : <b class="gold big">${p.sp}</b> <span class="dim">· 1 point par niveau. Rangs 2 et 3 : niveau requis +3 / +6.</span></p>
        <div class="skills">${c.skills.map((id,i)=>{ const sk=DATA.skills[id], r=Game.skillRank(id), can=Game.canUnlock(id);
          const need = sk.lvl + (r>0? r*3:0);
          return `<div class="skc ${r?'':'unl'}" style="--sc:${sk.color}"><img src="${skillIcon(id)}"><div class="skb">
            <div class="skn">${i+1}. ${sk.name} <span class="pips">${[1,2,3].map(k=>`<i class="${k<=r?'on':''}"></i>`).join('')}</span></div>
            <div class="skd">${sk.desc(Math.max(1,r))}</div>
            <div class="dim small">Mana ${sk.mp} · Recharge ${sk.cd} · ${({self:'Sur soi',adj:'Au contact',enemy:'Ennemi à distance',tile:'Zone ciblée',line:'En ligne'})[sk.target]}${sk.range>1?' · portée '+sk.range:''}</div>
            ${r<3?(r<3&&r>0? `<div class="dim small">Rang ${r+1} : ${sk.desc(r+1)}</div>`:''):''}
            </div><div class="skact">${r>=3?'<b class="gold">MAX</b>':`<button class="btn small ${can?'gold':''}" data-l="${id}" ${can?'':'disabled'}>${r?'Améliorer':'Apprendre'}</button><small class="dim">niv. ${need}</small>`}</div></div>`; }).join('')}</div>
        <p class="center"><button class="btn" id="kClose">Fermer [K]</button></p>`, onClose, 'wide');
      document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ Game.learn(b.dataset.l); render(); });
      $('#kClose').onclick=()=>this.closeModal();
    };
    render();
  },
  openJournal(){
    let tab='frag', sel=null;
    const render=()=>{
      let body='';
      if(tab==='frag'){
        body=`<div class="journal"><div class="jlist">${STORY.lore.map((l,i)=>{ const has=S.lore.includes(i); return `<button class="jl ${has?'':'lock'} ${sel===i?'sel':''}" ${has?`data-l="${i}"`:''}>${has?esc(l.t):'— fragment perdu —'}<small>${['I','II','III','IV','V'][i>>2]}</small></button>`; }).join('')}</div>
          <div class="jtext">${sel!==null?`<h3>${esc(STORY.lore[sel].t)}</h3><p>${esc(STORY.lore[sel].x).replace(/\n/g,'<br>')}</p>`:`<p class="dim center">${S.lore.length} / 20 fragments retrouvés.<br><br>Les pupitres des étages et les gardiens vaincus en gardent la trace.</p>`}</div></div>`;
      } else {
        const t=S.flags.k_trust||0;
        body=`<div class="jstats">
          <div><span>Personnage</span><b>${esc(S.name)} — ${DATA.classes[S.cls].name} niv. ${S.player.lvl}</b></div>
          <div><span>Mode</span><b>${S.mode==='hardcore'?'Hardcore':'Histoire'}</b></div>
          <div><span>Progression</span><b>Acte ${STORY.acts[S.act].num} · ${STORY.acts[S.act].floors[S.fi].title}</b></div>
          <div><span>Ennemis vaincus</span><b>${S.kills}</b></div><div><span>Morts</span><b>${S.deaths}</b></div><div><span>Tours</span><b>${S.turn}</b></div>
          ${S.flags.talk_kaelith1?`<div><span>Kaelith</span><b>${S.flags.k_dead?'Tombée de ta main':S.flags.k_ally?'Alliée':t>=1?'Méfiante, mais reconnaissante':'Rivale'}</b></div>`:''}
        </div>`;
      }
      this.modal(`<h2>Journal</h2><div class="tabs center"><button class="tab ${tab==='frag'?'on':''}" data-t="frag">Fragments</button><button class="tab ${tab==='stats'?'on':''}" data-t="stats">Chronique</button></div>${body}<p class="center"><button class="btn" id="jClose">Fermer [J]</button></p>`,null,'wide');
      document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{ tab=b.dataset.t; render(); });
      document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ sel=+b.dataset.l; Sfx.play('click'); render(); });
      $('#jClose').onclick=()=>this.closeModal();
    };
    render();
  },
  showLore(i){
    const l=STORY.lore[i];
    this.modal(`<div class="parch"><div class="title-kicker">Fragment ${i+1} / 20</div><h2>${esc(l.t)}</h2><p>${esc(l.x).replace(/\n/g,'<br>')}</p><p class="center"><button class="btn" onclick="UI.closeModal()">Refermer</button></p></div>`,null,'lore');
  },
  openHelp(){
    this.modal(`<h2>Comment jouer</h2><div class="help">
      <div><h4>Déplacements</h4><p><kbd>Z Q S D</kbd> / <kbd>W A S D</kbd> / <kbd>Flèches</kbd> — se déplacer (foncer dans un ennemi = attaquer)<br><kbd>Pavé num.</kbd> — 8 directions (7 9 1 3 en diagonale)<br><kbd>Clic</kbd> — marcher jusqu'à la case / attaquer<br><kbd>Espace</kbd> ou <kbd>.</kbd> — attendre un tour</p></div>
      <div><h4>Actions</h4><p><kbd>1</kbd>–<kbd>6</kbd> — compétences<br><kbd>F</kbd> — tir à distance (arc / bâton)<br><kbd>V</kbd> — potion de soin · <kbd>B</kbd> — potion de mana<br><kbd>E</kbd> / <kbd>Entrée</kbd> — descendre l'escalier</p></div>
      <div><h4>Confort</h4><p><kbd>X</kbd> — exploration automatique<br><kbd>R</kbd> — se reposer jusqu'à guérison<br><kbd>Clic droit</kbd> / <kbd>Échap</kbd> — annuler</p></div>
      <div><h4>Menus</h4><p><kbd>I</kbd> — sac & équipement<br><kbd>K</kbd> — compétences<br><kbd>J</kbd> — journal & fragments<br><kbd>Échap</kbd> — menu</p></div>
      <div class="full"><h4>Ciblage</h4><p>Les compétences à distance ouvrent un viseur : déplace-le avec la souris ou les flèches, <kbd>Tab</kbd> pour changer de cible, <kbd>Entrée</kbd> ou clic pour valider.</p></div>
      <div class="full"><h4>Conseils</h4><p>${STORY.tips.map(t=>esc(t.replace('Astuce : ',''))).join('<br>')}</p></div>
    </div><p class="center"><button class="btn" onclick="UI.closeModal()">Compris</button></p>`,null,'wide');
  },
  openMenu(){
    this.modal(`<h2>Pause</h2><div class="menu">
      <button class="btn big" id="mRes">Reprendre</button>
      <button class="btn" id="mSave">Sauvegarder</button>
      <button class="btn" id="mSnd">Son : ${Sfx.on?'activé':'coupé'}</button>
      <button class="btn" id="mMus">Musique : ${Sfx.music?'activée':'coupée'}</button>
      <button class="btn" id="mHelp">Aide</button>
      <button class="btn red" id="mQuit">Retour au titre</button></div>`);
    $('#mRes').onclick=()=>this.closeModal();
    $('#mSave').onclick=()=>{ Game.save(); this.toast('Partie sauvegardée.'); this.closeModal(); };
    $('#mSnd').onclick=()=>{ Sfx.toggle(); this.openMenu(); };
    $('#mMus').onclick=()=>{ Sfx.toggleMusic(); this.openMenu(); };
    $('#mHelp').onclick=()=>this.openHelp();
    $('#mQuit').onclick=()=>{ Game.save(); this.closeModal(); S=null; this.showTitle(); };
  },

  // ================= ENTRÉES =================
  busy(){ return this.mode!=='game' || !!this.dialog || !!this.modalOpen || !S || S.dead || Game.playerLocked(); },
  act(fn){
    if(!S||S.dead) return;
    const used=fn();
    if(used) Game.endTurn(); else this.refresh();
  },
  lockedTurn(){
    const p=S.player; R.float(p.x,p.y,Game.has(p,'freeze')?'Gelé…':'Étourdi…','#7fe6f2',{small:true});
    setTimeout(()=>{ if(S && !S.dead && this.mode==='game' && !this.dialog && !this.modalOpen && Game.playerLocked()) Game.endTurn(); else if(S&&Game.playerLocked()&&this.mode==='game') this.lockedTurn(); }, 380);
  },
  cancelAll(){ this.targeting=null; this.stopAuto(); },
  stopAuto(){ if(this.autoTimer){ clearInterval(this.autoTimer); this.autoTimer=null; } this.auto=null; },
  startAuto(kind, path){
    this.stopAuto();
    if(kind==='explore' && Game.visibleHostiles().length){ Game.log('Impossible : un ennemi est en vue.','#e05040'); return; }
    this.auto={kind,path};
    const hp0={v:S.player.hp};
    this.autoTimer=setInterval(()=>{
      if(this.busy()){ this.stopAuto(); return; }
      let d;
      if(this.auto.kind==='explore'){ d=Game.autoExploreStep(); if(!d){ Game.log(S.floor.stairs&&S.floor.explored[S.floor.stairs.y*S.floor.w+S.floor.stairs.x]?"Tout est exploré. L'escalier t'attend.":'Plus rien à explorer.','#8a8796'); this.stopAuto(); return; } }
      else { const nx=this.auto.path.shift(); if(!nx){ this.stopAuto(); return; } d=[nx[0]-S.player.x, nx[1]-S.player.y];
        if(Math.abs(d[0])>1||Math.abs(d[1])>1){ this.stopAuto(); return; }
        const m=Game.monAt(nx[0],nx[1]); if(m && !this.auto.path.length){ this.stopAuto(); this.act(()=>Game.move(d[0],d[1])); return; } if(m){ this.stopAuto(); return; } }
      const before=Game.visibleHostiles().length;
      this.act(()=>Game.move(d[0],d[1]));
      if(!S||S.dead){ this.stopAuto(); return; }
      if(Game.visibleHostiles().length>before || S.player.hp<hp0.v){ if(Game.visibleHostiles().length) Game.log('Un ennemi est en vue !','#e05040'); this.stopAuto(); }
      hp0.v=S.player.hp;
    }, 60);
  },
  rest(){
    if(Game.visibleHostiles().length){ Game.log('Impossible de se reposer : ennemi en vue.','#e05040'); return; }
    const p=S.player; let n=0;
    while(n<250 && !S.dead){ const st=Game.pstats(); if(p.hp>=st.maxHp && p.mp>=st.maxMp) break; Game.endTurn(); n++; if(Game.visibleHostiles().length){ Game.log('Ton repos est interrompu !','#e05040'); break; } }
    if(n) Game.log(`Tu te reposes ${n} tours.`,'#8a8796');
    this.refresh();
  },
  hotkey(k){
    if(this.mode==='camp'){ if(k==='i') this.openInventory(()=>this._campRender&&this._campRender()); if(k==='k') this.openSkills(()=>this._campRender&&this._campRender()); return; }
    if(this.mode!=='game') return;
    if(this.modalOpen){ this.closeModal(); return; }
    if(k==='i'||k==='c') return this.openInventory();
    if(k==='k') return this.openSkills();
    if(k==='j') return this.openJournal();
    if(k==='h') return this.openHelp();
    if(k==='escape') return this.openMenu();
    if(this.busy()) return;
    if(k==='f') return this.startRanged();
    if(k==='v') return this.act(()=>Game.quickPotion('pot_hp'));
    if(k==='b') return this.act(()=>Game.quickPotion('pot_mp'));
  },
  key(e){
    const k=e.key.toLowerCase(), code=e.code;
    if(e.target.tagName==='INPUT') return;
    Sfx.ensure();
    if(this.dialog){
      if(this.dialog.choose && /^Digit[1-4]$/.test(code)){ this.dialog.choose(+code[5]-1); e.preventDefault(); return; }
      if([' ','enter','escape','e'].includes(k) && this.dialog.advance){ this.dialog.advance(); e.preventDefault(); }
      return;
    }
    if(this.mode==='camp'){ if(this.modalOpen && (k==='escape'||k==='i'||k==='k')){ this.closeModal(); return; } if(k==='i'||k==='k') this.hotkey(k); return; }
    if(this.mode!=='game'){ return; }
    if(this.modalOpen){ if(['escape','i','k','j','h','c'].includes(k)){ this.closeModal(); e.preventDefault(); } return; }
    if(this.auto){ this.stopAuto(); e.preventDefault(); return; }
    // ciblage
    if(this.targeting){
      const tg=this.targeting; e.preventDefault();
      const mv={arrowup:[0,-1],arrowdown:[0,1],arrowleft:[-1,0],arrowright:[1,0],z:[0,-1],w:[0,-1],s:[0,1],q:[-1,0],a:[-1,0],d:[1,0]}[k];
      if(mv){ tg.cursor={x:tg.cursor.x+mv[0],y:tg.cursor.y+mv[1]}; return; }
      if(k==='tab'){ const list=this.targetCandidates(); if(list.length){ const i=list.findIndex(m=>m.x===tg.cursor.x&&m.y===tg.cursor.y); const n=list[(i+1)%list.length]; tg.cursor={x:n.x,y:n.y}; } return; }
      if(k==='enter'||k===' '||k==='e'||(code===tg.key)) return this.confirmTarget();
      if(k==='escape'){ this.targeting=null; return; }
      return;
    }
    if(this.busy()) return;
    const dirs={arrowup:[0,-1],arrowdown:[0,1],arrowleft:[-1,0],arrowright:[1,0],z:[0,-1],w:[0,-1],s:[0,1],q:[-1,0],a:[-1,0],d:[1,0]};
    const np={Numpad8:[0,-1],Numpad2:[0,1],Numpad4:[-1,0],Numpad6:[1,0],Numpad7:[-1,-1],Numpad9:[1,-1],Numpad1:[-1,1],Numpad3:[1,1]};
    let d=np[code]||dirs[k];
    if(d){ e.preventDefault(); this.act(()=>Game.move(d[0],d[1])); return; }
    if(k===' '||k==='.'||code==='Numpad5'){ e.preventDefault(); this.act(()=>true); return; }
    if(/^Digit[1-6]$/.test(code)){ e.preventDefault(); this.trySkill(+code[5]-1, code); return; }
    if(k==='e'||k==='enter'||k==='>'){ e.preventDefault(); this.act(()=>Game.descend()); return; }
    if(k==='x'){ this.startAuto('explore'); return; }
    if(k==='r'){ this.rest(); return; }
    if(k==='tab'){ e.preventDefault(); return; }
    if(['i','c','k','j','h','escape','f','v','b'].includes(k)){ e.preventDefault(); this.hotkey(k); }
  },
  // ----- ciblage -----
  trySkill(i, code){
    if(this.busy()) return;
    const id=DATA.classes[S.cls].skills[i]; if(!id) return;
    const sk=DATA.skills[id], r=Game.skillRank(id), p=S.player;
    if(!r){ Game.log(`${sk.name} n'est pas encore apprise (K).`,'#8a8796'); return; }
    if(p.cds[id]>0){ Game.log(`${sk.name} : encore ${p.cds[id]} tour(s).`,'#8a8796'); return; }
    if(p.mp<Game.skillCost(id)){ Game.log('Pas assez de mana.','#5aa0ff'); return; }
    if(sk.target==='self') return this.act(()=>Game.useSkill(id));
    if(sk.target==='adj'){ const a=S.floor.mons.filter(m=>!m.friendly&&cheb(m,p)<=1);
      if(!a.length){ Game.log('Aucun ennemi au contact.','#8a8796'); return; }
      if(a.length===1) return this.act(()=>Game.useSkill(id,a[0])); }
    this.startTargeting({kind:'skill', id, target:sk.target, range:Game.skillRange(id), radius:sk.radius||0, key:code});
  },
  startRanged(){
    const st=Game.pstats(); if(!st.range){ Game.log("Ton arme n'a pas de portée (arc ou bâton requis).",'#8a8796'); return; }
    this.startTargeting({kind:'ranged', target:'enemy', range:st.range, key:'KeyF'});
  },
  targetCandidates(){ const tg=this.targeting, p=S.player, f=S.floor;
    return f.mons.filter(m=>!m.friendly&&!m.dead&&f.visible[m.y*f.w+m.x]&&cheb(m,p)<=tg.range).sort((a,b)=>cheb(a,p)-cheb(b,p)); },
  startTargeting(o){
    this.targeting=o; const list=this.targetCandidates();
    o.cursor = list.length? {x:list[0].x,y:list[0].y} : {x:S.player.x,y:S.player.y};
    Game.log('Ciblage : Entrée / clic pour valider, Échap pour annuler, Tab pour changer.','#8a8796');
  },
  targetValid(t){
    const tg=this.targeting, p=S.player, f=S.floor; if(!tg||!t) return false;
    if(!Dungeon.inb(f,t.x,t.y) || !f.visible[t.y*f.w+t.x]) return false;
    if(cheb(t,p)>tg.range) return false;
    if(tg.target==='enemy'||tg.target==='adj'){ const m=Game.monAt(t.x,t.y); return !!m && !m.friendly && Dungeon.los(f,p.x,p.y,t.x,t.y); }
    if(tg.target==='line') return !(t.x===p.x&&t.y===p.y);
    if(tg.kind==='skill' && tg.id==='m_blink'){ const tt=Dungeon.tile(f,t.x,t.y); return tt!==T.WALL && tt!==T.DOOR && !Game.occupied(t.x,t.y); }
    return Dungeon.tile(f,t.x,t.y)!==T.WALL;
  },
  confirmTarget(){
    const tg=this.targeting; if(!tg) return; const t=tg.cursor;
    if(!this.targetValid(t)){ Game.log('Cible invalide.','#e05040'); return; }
    this.targeting=null;
    const m=Game.monAt(t.x,t.y);
    if(tg.kind==='skill') this.act(()=>Game.useSkill(tg.id, (tg.target==='enemy'||tg.target==='adj')? m : {x:t.x,y:t.y}));
    else if(tg.kind==='ranged') this.act(()=>Game.rangedAttack(m));
    else if(tg.kind==='item') this.act(()=>Game.useItem(tg.uid,{x:t.x,y:t.y}));
  },
  // ----- souris -----
  tileAt(e){ const r=$('#game').getBoundingClientRect(); const x=(e.clientX-r.left)*R.dpr+R.cam.x, y=(e.clientY-r.top)*R.dpr+R.cam.y;
    return {x:Math.floor(x/R.ts), y:Math.floor(y/R.ts)}; },
  mouseMove(e){
    if(this.mode!=='game'||!S||!S.floor) return; const t=this.tileAt(e); R.mouse=t;
    if(this.targeting){ this.targeting.cursor=t; this.hideTip(); return; }
    const f=S.floor; if(!Dungeon.inb(f,t.x,t.y)||!f.visible[t.y*f.w+t.x]){ this.hideTip(); return; }
    const m=Game.monAt(t.x,t.y);
    if(m){ const sts=m.statuses.map(s=>({poison:'empoisonné',burn:'en feu',freeze:'gelé',stun:'étourdi'})[s.t]).filter(Boolean).join(', ');
      this.showTip(m.friendly?`<div class="tt-name" style="color:#ff6a4a">${esc(m.name)}</div><div class="dim">Clique ou fonce dessus pour parler.</div>`
        :`<div class="tt-name" style="color:${m.boss?'#ff8a2a':m.elite?'#f7d44a':'#e8e2d6'}">${esc(m.name)}</div><div class="dim">Niveau ${m.lvl}${m.dormant?' · endormie':(!m.awake?' · ne t\'a pas vu':'')}</div><div>PV ${Math.max(0,Math.ceil(m.hp))} / ${m.maxHp}</div>${sts?`<div class="dim">${sts}</div>`:''}`,e); return; }
    const items=f.items.filter(g=>g.x===t.x&&g.y===t.y);
    if(items.length){ this.showTip(items.map(g=>g.item.kind==='gold'?`<div class="tt-name gold">${g.item.qty} pièces d'or</div>`:this.itemHTML(g.item,true)).join('<hr>'),e); return; }
    const pr=Dungeon.propAt(f,t.x,t.y);
    if(pr){ const n={chest:'Coffre',chest_open:'Coffre ouvert',fountain:pr.used?'Fontaine tarie':'Fontaine de vie',shrine:pr.used?'Sanctuaire éteint':'Sanctuaire',lectern:'Pupitre — fragment de lore',brazier:'Brasero',trap:'Piège à pointes',trap_used:'Piège déclenché'}[pr.type];
      if(n){ this.showTip(`<div class="tt-name">${n}</div>`,e); return; } }
    if(Dungeon.tile(f,t.x,t.y)===T.STAIRS){ this.showTip(`<div class="tt-name gold">Escalier</div><div class="dim">[E] pour descendre</div>`,e); return; }
    this.hideTip();
  },
  click(e){
    if(this.mode!=='game'||!S) return; Sfx.ensure();
    const t=this.tileAt(e);
    if(this.targeting){ this.targeting.cursor=t; this.confirmTarget(); return; }
    if(this.auto){ this.stopAuto(); return; }
    if(this.busy()) return;
    const p=S.player, f=S.floor;
    if(t.x===p.x&&t.y===p.y){ if(Dungeon.tile(f,p.x,p.y)===T.STAIRS) this.act(()=>Game.descend()); else this.act(()=>true); return; }
    if(!Dungeon.inb(f,t.x,t.y) || !f.explored[t.y*f.w+t.x]) return;
    const m=Game.monAt(t.x,t.y);
    if(m && cheb(m,p)<=1){ this.act(()=>Game.move(m.x-p.x,m.y-p.y)); return; }
    if(m && !m.friendly && f.visible[m.y*f.w+m.x]){ const st=Game.pstats();
      if(st.range && cheb(m,p)<=st.range && Dungeon.los(f,p.x,p.y,m.x,m.y)){ this.act(()=>Game.rangedAttack(m)); return; } }
    if(cheb(t,p)===1 && !m){ this.act(()=>Game.move(t.x-p.x,t.y-p.y)); return; }
    const path=Dungeon.path(f,p.x,p.y,t.x,t.y,{max:3000,avoidLava:true,blockMons:(x,y)=>{ const mm=Game.monAt(x,y); return mm&&!(x===t.x&&y===t.y); }});
    if(path && path.length) this.startAuto('path', path.filter((_,i)=>true));
  }
};
