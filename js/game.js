// ============================================================
//  JEU — état, tours, combat, objets, compétences
// ============================================================
const SAVE_KEY = 'cendres_aldaran_save_v1';
let S = null; // état global
const rand = Math.random;
const RI = (a,b)=>a+Math.floor(rand()*(b-a+1));
const cheb = (a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
let UIDN = 1; const uid = ()=> 'u'+(Date.now()%1e7).toString(36)+(UIDN++);

// ---------------- OBJETS ----------------
const SUFFIX = {atk:'de Puissance', def:'de Garde', hp:'de Vigueur', mp:"d'Arcane", crit:'de Précision', dodge:'du Vent',
  ls:'du Vampire', regen:'de Régénération', mpr:'de Clarté', burn:'de Braise', thorns:'des Ronces', xp:'du Sage', gold:'du Pillard'};
const Items = {
  rollConsumable(r=rand){
    const t=[['pot_hp',40],['pot_mp',24],['bomb',14],['sc_tele',8],['sc_map',9],['elixir',5]];
    let x=r()*100; for(const [id,w] of t){ if((x-=w)<=0) return {kind:'cons', id, qty:1}; } return {kind:'cons', id:'pot_hp', qty:1};
  },
  rollRarity(boost=0, ilvl=1){
    const w=[55,28,12,4.2,ilvl>=3?0.9:0].map((v,i)=>v*Math.pow(1+boost,i));
    let x=rand()*w.reduce((a,b)=>a+b); for(let i=0;i<w.length;i++){ if((x-=w[i])<=0) return i; } return 0;
  },
  rollGear(ilvl, boost=0, slot=null){
    let r = this.rollRarity(boost, ilvl);
    if(r===4){ const ks=Object.keys(DATA.legendaries).filter(k=>k!=='oath'); return this.makeLegend(ks[RI(0,ks.length-1)], ilvl); }
    const bases = Object.keys(DATA.bases).filter(k=>(!slot||DATA.bases[k].slot===slot) && (DATA.bases[k].min||1)<=ilvl);
    const b = bases[RI(0,bases.length-1)];
    if((DATA.bases[b].slot==='ring'||DATA.bases[b].slot==='amulet') && r===0) r=1;
    return this.makeGear(b, ilvl, r);
  },
  makeGear(baseId, ilvl, rarity){
    const b=DATA.bases[baseId], st={};
    for(const k in b.stats) st[k]=b.stats[k];
    for(const k in b.scale) st[k]=(st[k]||0)+b.scale[k]*(ilvl-1);
    const nAff = DATA.rarities[rarity].aff, used=new Set(); let first=null;
    for(let i=0;i<nAff;i++){
      const pool=DATA.affixes.filter(a=>!used.has(a.stat)); const tot=pool.reduce((s,a)=>s+a.w,0);
      let x=rand()*tot, a=pool[0]; for(const p of pool){ if((x-=p.w)<=0){ a=p; break; } }
      used.add(a.stat); if(!first) first=a.stat;
      let v=(a.a+a.b*ilvl)*(0.8+rand()*0.4); if(a.cap) v=Math.min(a.cap,v);
      st[a.stat]=(st[a.stat]||0)+v;
    }
    for(const k in st) st[k] = (k==='regen'||k==='mpr') ? Math.round(st[k]*10)/10 : Math.round(st[k]);
    for(const k in st) if(st[k]===0) delete st[k];
    let name=b.name;
    if(rarity===1) name=b.name+' '+SUFFIX[first];
    if(rarity>=2) name=b.name+' « '+DATA.rareNames[RI(0,DATA.rareNames.length-1)]+' »';
    return {uid:uid(), kind:'gear', slot:b.slot, base:baseId, spr:b.spr, ilvl, rarity, plus:0, stats:st, range:b.range||0, name};
  },
  makeLegend(id, ilvl){
    const L=DATA.legendaries[id]; const it=this.makeGear(L.base, ilvl, 2);
    for(const k in L.stats){ const v=L.stats[k]; const sc = ['atk','def','hp','mp'].includes(k) && v>0 ? 1+ilvl*0.12 : 1;
      it.stats[k]=Math.round((it.stats[k]||0)+v*sc); if(it.stats[k]===0) delete it.stats[k]; }
    it.rarity=4; it.name=L.name; it.legend=id; it.lore=L.lore; if(L.pierce) it.pierce=true;
    return it;
  },
  stats(it){
    const out={}; const m=1+0.12*(it.plus||0);
    for(const k in it.stats) out[k] = ['atk','def','hp','mp'].includes(k) && it.stats[k]>0 ? Math.round(it.stats[k]*m) : it.stats[k];
    return out;
  },
  value(it){
    if(it.kind==='cons') return DATA.consumables[it.id].price;
    return Math.round((12+it.ilvl*7)*DATA.rarities[it.rarity].mult*(1+0.25*(it.plus||0)));
  },
  name(it){ return it.kind==='cons' ? DATA.consumables[it.id].name : it.name+(it.plus?` +${it.plus}`:''); },
  spr(it){ return it.kind==='cons' ? DATA.consumables[it.id].spr : it.kind==='gold' ? 'i_gold' : it.spr; },
  color(it){ return it.kind==='gear' ? DATA.rarities[it.rarity].color : it.kind==='gold' ? '#f7d44a' : '#e8e2d6'; }
};

// ---------------- MONSTRES ----------------
const Monsters = {
  create(id, lvl, x, y, elite){
    const d=DATA.monsters[id];
    const hm=1+0.32*(lvl-1), am=1+0.26*(lvl-1), dm=1+0.16*(lvl-1);
    const hp=Math.round(d.hp*hm*1.35*(elite?1.9:1));
    return { uid:uid(), id, name:(elite?'Élite · ':'')+d.name, spr:d.spr, lvl, x, y, hp, maxHp:hp,
      atk:d.atk*am*1.45*(elite?1.3:1), def:(d.def||0)*dm, dodge:d.dodge||0, crit:5, spd:d.spd||100, energy:RI(0,90),
      ai:d.ai||'melee', range:d.range||1, awake:false, elite:!!elite, statuses:[], dormant:!!d.dormant,
      xp:Math.round(d.xp*(1+0.4*(lvl-1))*(elite?2.5:1)) };
  },
  createBoss(id, x, y){
    const d=DATA.bosses[id];
    const bh=Math.round(d.hp*1.4);
    return { uid:uid(), id, boss:true, name:d.name, spr:d.spr, lvl:d.lvl, x, y, hp:bh, maxHp:bh, atk:d.atk*1.2, def:d.def,
      dodge:0, crit:8, spd:d.spd||100, energy:0, ai:'boss', range:1, awake:false, statuses:[], big:d.big,
      cds:d.abilities.map(a=>a.cd? Math.ceil(a.cd/2):0), used:{}, xp:d.xp, stationary:!!d.stationary };
  }
};

// ---------------- JEU ----------------
const Game = {
  // ----- statut des entités -----
  has(e,t){ return e.statuses && e.statuses.some(s=>s.t===t); },
  get(e,t){ return e.statuses && e.statuses.find(s=>s.t===t); },
  addStatus(e,t,turns,pow=0){
    const s=this.get(e,t); if(s){ s.n=Math.max(s.n,turns); s.p=Math.max(s.p,pow); } else e.statuses.push({t,n:turns,p:pow});
  },
  rmStatus(e,t){ e.statuses=e.statuses.filter(s=>s.t!==t); },

  pstats(){
    const p=S.player, c=DATA.classes[S.cls], L=p.lvl-1;
    const st={ maxHp:c.base.hp+c.grow.hp*L+(p.bonus.hp||0), maxMp:c.base.mp+c.grow.mp*L+(p.bonus.mp||0),
      atk:c.base.atk+c.grow.atk*L+(p.bonus.atk||0), def:c.base.def+c.grow.def*L+(p.bonus.def||0),
      crit:c.base.crit+c.grow.crit*L+(p.bonus.crit||0), dodge:c.base.dodge+c.grow.dodge*L,
      ls:0, regen:0, mpr:0, burn:0, poison:0, freeze:0, thorns:0, xp:0, gold:0, light:0, dmg:0, cost:0, range:0, pierce:false };
    for(const s of DATA.slots){ const it=p.equip[s]; if(!it) continue;
      const is=Items.stats(it);
      for(const k in is){ if(k==='hp') st.maxHp+=is[k]; else if(k==='mp') st.maxMp+=is[k]; else st[k]=(st[k]||0)+is[k]; }
      if(s==='weapon') st.range=it.range||0; if(it.pierce) st.pierce=true; }
    const up=this.get(p,'atkUp'); if(up) st.atk*=1+up.p;
    st.dmgMult = 1+st.dmg/100;
    st.maxHp=Math.max(1,Math.round(st.maxHp)); st.maxMp=Math.round(st.maxMp);
    st.atk=Math.round(st.atk*10)/10; st.def=Math.round(st.def*10)/10;
    st.crit=Math.min(60,Math.round(st.crit)); st.dodge=Math.max(0,Math.min(50,Math.round(st.dodge)));
    return st;
  },
  log(msg, color){ UI.log(msg, color); },

  // ----- nouvelle partie / sauvegarde -----
  newGame(name, cls, mode){
    const c=DATA.classes[cls];
    S = { v:1, name:name||'Porte-Cendre', cls, mode, act:0, fi:0, turn:0, gold:40, flags:{}, lore:[], kills:0, deaths:0,
      seed: (Math.random()*1e9)|0, inCamp:false, shop:null, complete:false,
      player:{ x:0,y:0, hp:1, mp:1, lvl:1, xp:0, sp:0, skills:{}, cds:{}, statuses:[], bonus:{},
        equip:{weapon:null,helm:null,armor:null,boots:null,ring:null,amulet:null}, bag:[], uid:'player' } };
    const p=S.player;
    p.skills[c.skills[0]]=1; p.skills[c.skills[1]]=1;
    p.equip.weapon=Items.makeGear(c.startWeapon,1,0);
    p.equip.armor=Items.makeGear(c.startArmor,1,0);
    p.bag.push({uid:uid(),kind:'cons',id:'pot_hp',qty:3},{uid:uid(),kind:'cons',id:'pot_mp',qty:1});
    const st=this.pstats(); p.hp=st.maxHp; p.mp=st.maxMp;
    UI.scene(STORY.intro, ()=>this.enterFloor(true));
  },
  save(){
    if(!S || S.dead) return;
    try{
      const f=S.floor; const copy={...S};
      if(f) copy.floor={...f, visible:null};
      localStorage.setItem(SAVE_KEY, JSON.stringify(copy));
    }catch(e){ console.warn('save failed', e); }
  },
  hasSave(){ try{ const s=localStorage.getItem(SAVE_KEY); if(!s) return null; const o=JSON.parse(s); return o.complete?null:o; }catch(e){ return null; } },
  deleteSave(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} },
  load(){
    const o=this.hasSave(); if(!o) return false; S=o;
    if(S.floor){ S.floor.visible=new Uint8Array(S.floor.w*S.floor.h); }
    if(S.inCamp){ UI.showCamp(); return true; }
    UI.enterGame(); this.updateFov(); R.snapAll(); UI.refresh();
    this.log('Partie reprise. Ta braise rougeoie.', '#f7d44a');
    return true;
  },

  // ----- étages -----
  floorNum(){ return S.act*4+S.fi+1; },
  enterFloor(fresh){
    const act=STORY.acts[S.act], fl=act.floors[S.fi];
    S.floor = Dungeon.generate(S.act, S.fi, S.seed + S.act*1000 + S.fi*37 + S.deaths*7919);
    const p=S.player; p.x=S.floor.start.x; p.y=S.floor.start.y; p.statuses=p.statuses.filter(s=>s.t==='bless');
    UI.enterGame(); this.updateFov(); R.snapAll();
    UI.banner(`Acte ${act.num} · ${act.title}`, fl.title);
    Sfx.play('stairs');
    this.log(`— ${fl.title} —`, '#f7d44a');
    const key='seen_'+S.act+'_'+S.fi;
    if(!S.flags[key] && fl.arrival){ S.flags[key]=1; setTimeout(()=>UI.scene(fl.arrival), 900); }
    UI.refresh(); this.save();
  },
  descend(){
    const f=S.floor, p=S.player;
    if(Dungeon.tile(f,p.x,p.y)!==T.STAIRS){ this.log("Il n'y a pas d'escalier ici.", '#8a8796'); return false; }
    if(f.isBoss){ return this.toCamp(); }
    S.fi++; this.enterFloor(true); return false;
  },
  toCamp(){
    const act=STORY.acts[S.act];
    if(S.act>=4) return false;
    S.inCamp=true; S.shop=this.makeShop(S.act+1);
    const st=this.pstats(); S.player.hp=st.maxHp; S.player.mp=st.maxMp; S.player.statuses=[];
    this.save();
    UI.scene(act.camp, ()=>UI.showCamp());
    return false;
  },
  leaveCamp(){
    S.inCamp=false; S.act++; S.fi=0; S.shop=null;
    this.enterFloor(true);
  },
  makeShop(actIdx){
    const ilvl=actIdx*4+1; const gear=[];
    for(let i=0;i<7;i++) gear.push(Items.rollGear(ilvl+RI(0,2), 0.6));
    return {gear};
  },

  // ----- vision -----
  updateFov(){
    const f=S.floor, p=S.player;
    const r = this.has(p,'dark') ? 3 : 8;
    Dungeon.fov(f, p.x, p.y, r);
    for(const m of f.mons){
      if(f.visible[m.y*f.w+m.x] && !m.seen){ m.seen=true; }
      if(m.boss && f.visible[m.y*f.w+m.x] && !m.awake && !f.bossSeen && f.isBoss){
        f.bossSeen=true; m.awake=true; UI.bossBar(m);
        const act=STORY.acts[S.act]; Sfx.play('boss'); R.shake(8);
        if(act.bossIntro) setTimeout(()=>{ if(!m.dead) UI.scene(act.bossIntro); },300);
      }
    }
  },
  monAt(x,y){ return S.floor.mons.find(m=>m.x===x&&m.y===y&&!m.dead); },
  occupied(x,y){ return (S.player.x===x&&S.player.y===y) || !!this.monAt(x,y) || Dungeon.propBlocks(S.floor,x,y); },
  visibleHostiles(){ const f=S.floor; return f.mons.filter(m=>!m.friendly&&!m.dead&&f.visible[m.y*f.w+m.x]); },

  // ----- actions joueur -----
  playerLocked(){ const p=S.player; return this.has(p,'freeze')||this.has(p,'stun'); },
  move(dx,dy){
    const p=S.player, f=S.floor; const nx=p.x+dx, ny=p.y+dy;
    const m=this.monAt(nx,ny);
    if(m){ if(m.friendly){ this.talk(m); return false; } this.meleeAttack(m); return true; }
    const t=Dungeon.tile(f,nx,ny);
    if(t===T.WALL) return false;
    if(dx&&dy && Dungeon.tile(f,p.x+dx,p.y)===T.WALL && Dungeon.tile(f,p.x,p.y+dy)===T.WALL) return false;
    if(t===T.DOOR){ Dungeon.set(f,nx,ny,T.DOOR_OPEN); Sfx.play('door'); this.log('La porte grince.','#8a8796'); return true; }
    const prop=Dungeon.propAt(f,nx,ny);
    if(prop && BLOCKING_PROPS[prop.type]) return this.interact(prop);
    if(this.has(p,'root')){ this.log('Tu es entravé !','#c8c2b8'); R.float(p.x,p.y,'Entravé','#ffffff'); return true; }
    p.x=nx; p.y=ny; p.face = dx<0?-1:dx>0?1:p.face;
    this.onStep();
    return true;
  },
  onStep(){
    const p=S.player, f=S.floor; const t=Dungeon.tile(f,p.x,p.y);
    if(t===T.WATER){ R.burst(p.x,p.y,'#7fc8f0',5,{up:1}); Sfx.play('splash'); }
    if(t===T.LAVA){ this.addStatus(p,'burn',3,Math.ceil(this.pstats().maxHp*0.04)); this.log('La lave te brûle !','#ff7a2a'); }
    if(t===T.STAIRS) this.log(f.isBoss?"Un passage vers le sanctuaire. [E] pour descendre.":"Un escalier descend dans le noir. [E] pour descendre.",'#f7d44a');
    // objets
    const here=f.items.filter(i=>i.x===p.x&&i.y===p.y);
    for(const g of here){
      if(this.pickup(g.item)) f.items.splice(f.items.indexOf(g),1); else g.dropped=true;
    }
    // piège
    const tr=f.props.find(q=>q.type==='trap'&&q.x===p.x&&q.y===p.y);
    if(tr){ tr.type='trap_used'; const d=Math.round(6+this.floorNum()*2.5);
      R.burst(p.x,p.y,'#b7c4d4',10); Sfx.play('hit');
      this.damagePlayer(d,null,false,{src:'Piège'}); this.log(`Un piège à pointes ! -${d} PV`,'#e05040');
      if(f.biome==='abyss') this.addStatus(p,'burn',3,Math.ceil(d/4)); }
  },
  pickup(item){
    const p=S.player;
    if(item.kind==='gold'){ const st=this.pstats(); const q=Math.round(item.qty*(1+st.gold/100)); S.gold+=q;
      this.log(`+${q} or`,'#f7d44a'); R.float(p.x,p.y,`+${q} or`,'#f7d44a'); Sfx.play('gold'); return true; }
    if(item.kind==='cons'){ const s=p.bag.find(b=>b.kind==='cons'&&b.id===item.id);
      if(s) s.qty+=item.qty; else { if(p.bag.length>=24){ this.log('Sac plein !','#e05040'); return false; } p.bag.push({...item, uid:uid()}); }
      this.log(`Ramassé : ${Items.name(item)}`,'#e8e2d6'); Sfx.play('pickup'); return true; }
    if(p.bag.length>=24){ this.log('Sac plein ! (I pour gérer)','#e05040'); return false; }
    p.bag.push(item); this.log(`Ramassé : ${Items.name(item)}`, Items.color(item));
    R.float(p.x,p.y,Items.name(item),Items.color(item),{small:true}); Sfx.play(item.rarity>=3?'rare':'pickup');
    return true;
  },
  interact(prop){
    const p=S.player, f=S.floor, st=this.pstats();
    if(prop.type==='chest'){
      prop.type='chest_open'; Sfx.play('chest'); R.burst(prop.x,prop.y,'#f7d44a',14,{up:1});
      const drops=[Items.rollGear(this.floorNum(), 0.7)];
      if(rand()<0.6) drops.push({kind:'gold', qty:RI(10,25)+this.floorNum()*6});
      if(rand()<0.5) drops.push(Items.rollConsumable());
      for(const d of drops) this.dropNear(prop.x,prop.y,d);
      this.log('Le coffre s\'ouvre…','#f7d44a'); return true;
    }
    if(prop.type==='fountain'){
      if(prop.used){ this.log('La fontaine est tarie.','#8a8796'); return false; }
      prop.used=true; p.hp=st.maxHp; p.mp=st.maxMp; p.statuses=p.statuses.filter(s=>!['poison','burn'].includes(s.t));
      R.burst(p.x,p.y,'#7fe6f2',20,{up:1}); Sfx.play('heal'); this.log("L'eau claire te rend toutes tes forces.",'#7fe6f2');
      S.floor.lights=S.floor.lights.filter(l=>!(l.x===prop.x&&l.y===prop.y)); return true;
    }
    if(prop.type==='shrine'){
      if(prop.used){ this.log('Le sanctuaire est éteint.','#8a8796'); return false; }
      prop.used=true;
      const b=[ ['hp',8,'Bénédiction de Vigueur : +8 PV max (permanent)'], ['atk',1.5,'Bénédiction de Force : +1.5 Puissance (permanent)'],
                ['def',1,'Bénédiction de Pierre : +1 Défense (permanent)'], ['mp',6,'Bénédiction de Clarté : +6 Mana max (permanent)'],
                ['crit',2,'Bénédiction du Faucon : +2% Critique (permanent)'] ][RI(0,4)];
      p.bonus[b[0]]=(p.bonus[b[0]]||0)+b[1];
      const s2=this.pstats(); p.mp=s2.maxMp; p.hp=Math.min(s2.maxHp,p.hp+b[1]);
      R.burst(prop.x,prop.y,'#c06af0',24,{up:1}); Sfx.play('levelup'); this.log(b[2],'#c06af0'); UI.toast(b[2]);
      S.floor.lights=S.floor.lights.filter(l=>!(l.x===prop.x&&l.y===prop.y)); return true;
    }
    if(prop.type==='lectern'){
      if(!S.lore.includes(prop.lore)){ S.lore.push(prop.lore); Sfx.play('lore'); this.log(`Fragment découvert : « ${STORY.lore[prop.lore].t} »`,'#9fe8f0'); }
      prop.read=true; UI.showLore(prop.lore); return false;
    }
    if(prop.type==='brazier'){ this.log('Les flammes dansent. Elles ne réchauffent plus grand-chose.','#8a8796'); return false; }
    if(prop.type==='chest_open'){ return false; }
    return false;
  },
  dropNear(x,y,item){
    const f=S.floor; const spots=[];
    for(const [dx,dy] of [[0,0],...DIR8]){ const nx=x+dx, ny=y+dy; const t=Dungeon.tile(f,nx,ny);
      if((t===T.FLOOR||t===T.DOOR_OPEN||t===T.WATER) && !Dungeon.propBlocks(f,nx,ny)) spots.push([nx,ny]); }
    const s = spots.length? spots[RI(0,spots.length-1)] : [x,y];
    f.items.push({x:s[0],y:s[1],item});
  },
  talk(m){
    if(m.npc && !S.flags['talk_'+m.npc]){
      S.flags['talk_'+m.npc]=1;
      UI.scene(STORY.npc[m.npc](S), ()=>{ if(S.floor.mons.includes(m)) this.removeNpc(m); }, m);
    } else {
      const lines={kaelith1:"« Avance, tombe-sur-pattes. On se reverra. »", kaelith2:"« Va. Je me débrouillerai. »", kaelith3:"« Le Foyer. N'oublie pas. »"};
      this.log(`Kaelith : ${lines[m.npc]||'…'}`,'#ff6a4a');
    }
  },
  removeNpc(m){ R.burst(m.x,m.y,'#ff6a4a',16,{up:1}); S.floor.mons=S.floor.mons.filter(x=>x!==m); },
  applyFx(fx, npc){
    const p=S.player;
    if(fx.take){ const s=p.bag.find(b=>b.kind==='cons'&&b.id===fx.take); if(s){ s.qty--; if(s.qty<=0) p.bag.splice(p.bag.indexOf(s),1); } }
    if(fx.trust) S.flags.k_trust=(S.flags.k_trust||0)+fx.trust;
    if(fx.gold){ S.gold+=fx.gold; this.log(`+${fx.gold} or`,'#f7d44a'); }
    if(fx.flag) S.flags[fx.flag]=1;
    if(fx.legend){ const it=Items.makeLegend(fx.legend, this.floorNum()+1); this.pickup(it) || this.dropNear(p.x,p.y,it); UI.toast(`Reçu : ${it.name}`); }
    if(fx.fight && npc){
      S.flags.fightKaelith=1;
      const b=Monsters.createBoss(fx.fight, npc.x, npc.y); b.awake=true; b.rx=npc.x; b.ry=npc.y;
      S.floor.mons=S.floor.mons.filter(x=>x!==npc); S.floor.mons.push(b); UI.bossBar(b); R.shake(6); Sfx.play('boss');
    }
    if(fx.ending){ UI.showEnding(fx.ending); }
    UI.refresh();
  },

  // ----- combat -----
  meleeAttack(m){
    const p=S.player; p.face = m.x<p.x?-1:m.x>p.x?1:p.face;
    R.lunge(p, m.x-p.x, m.y-p.y);
    this.hit(p, m, 1, {});
  },
  rangedAttack(m){
    const st=this.pstats(), p=S.player;
    if(!st.range){ this.log("Ton arme n'a pas de portée.", '#8a8796'); return false; }
    if(cheb(p,m)>st.range || !Dungeon.los(S.floor,p.x,p.y,m.x,m.y)){ this.log('Hors de portée.','#8a8796'); return false; }
    const w=p.equip.weapon; const staff = w && w.base.includes('staff');
    const d=R.proj(p.x,p.y,m.x,m.y, staff?'#c99af0':'#e8d8b0', staff?'orb':'arrow');
    Sfx.play(staff?'magic':'bow');
    if(st.pierce && !staff){
      const ln=Dungeon.line(p.x,p.y,m.x,m.y,st.range);
      for(const [x,y] of ln){ if(Dungeon.blocksSight(S.floor,x,y)) break; const t=this.monAt(x,y); if(t&&!t.friendly) this.hit(p,t,0.9,{delay:d}); }
    } else this.hit(p, m, 0.9, {delay:d});
    return true;
  },
  hit(att, tgt, mult=1, o={}){
    const isP = att===S.player; const toP = tgt===S.player;
    const pst = this.pstats();
    const A = isP? pst : att, D = toP? pst : tgt;
    if(tgt.dead) return 0;
    if(!o.noDodge && rand()*100 < Math.min(60, D.dodge||0)){
      R.float(tgt.x,tgt.y,'Esquive','#c8c2b8',{delay:o.delay}); Sfx.play('miss'); return 0; }
    let atk = A.atk * (isP? pst.dmgMult : 1);
    if(!isP && att.enraged) atk*=1.2;
    let crit = o.crit || rand()*100 < (A.crit||0);
    if(isP){ const nd=this.get(S.player,'nextDouble'); if(nd){ mult*=2; this.rmStatus(S.player,'nextDouble'); this.rmStatus(S.player,'invis'); crit=true; } }
    const raw = atk*mult*(0.85+rand()*0.3)*(crit?1.75:1);
    let dmg = Math.max(1, Math.round(raw*30/(30+Math.max(0,D.def||0))));
    if(toP) dmg=this.damagePlayer(dmg, att, crit, o);
    else this.damageMonster(tgt, dmg, crit, o);
    if(isP && dmg>0){
      if(pst.ls) this.healPlayer(Math.round(dmg*pst.ls/100), true);
      if(!tgt.dead){
        if(pst.burn && rand()*100<pst.burn) this.addStatus(tgt,'burn',3,Math.ceil(pst.atk*0.25));
        if(pst.poison && rand()*100<pst.poison) this.addStatus(tgt,'poison',4,Math.ceil(pst.atk*0.3));
        if(pst.freeze && rand()*100<pst.freeze && !tgt.boss) this.addStatus(tgt,'freeze',1);
      }
    }
    if(!isP && toP && dmg>0){
      const oh = att.boss ? DATA.bosses[att.id].onHit : DATA.monsters[att.id] && DATA.monsters[att.id].onHit;
      if(oh){
        if(oh.poison && rand()*100<oh.poison){ this.addStatus(S.player,'poison',4,Math.ceil(att.atk*0.3)); this.log('Tu es empoisonné.','#7cc94a'); }
        if(oh.burn && rand()*100<oh.burn){ this.addStatus(S.player,'burn',3,Math.ceil(att.atk*0.3)); this.log('Tu prends feu !','#ff7a2a'); }
        if(oh.freeze && rand()*100<oh.freeze){ this.addStatus(S.player,'freeze',1); this.log('Tu es gelé !','#7fe6f2'); }
        if(oh.drain){ S.player.mp=Math.max(0,S.player.mp-3); att.hp=Math.min(att.maxHp,att.hp+Math.ceil(dmg/2)); }
      }
      if(pst.thorns && !o.ranged) this.damageMonster(att, Math.round(pst.thorns), false, {thorns:true});
    }
    return dmg;
  },
  damageMonster(m, dmg, crit, o={}){
    if(m.dead) return;
    m.hp-=dmg; m.awake=true; m.dormant=false; m.flash=performance.now()+(o.delay||0);
    R.float(m.x,m.y,(crit?'':'')+dmg, crit?'#ffe86a':(o.thorns?'#7cc94a':'#ffffff'),{crit, delay:o.delay});
    R.burst(m.x,m.y, m.ghost?'#bff2ff': (m.spr==='skeleton'||m.spr==='skel_royal'||m.spr==='skel_archer')?'#e8e0c8':'#a01c28', crit?10:5,{delay:o.delay});
    if(crit){ R.shake(3); Sfx.play('crit'); } else Sfx.play('hit');
    if(m.hp<=0) this.killMonster(m, o.delay);
  },
  killMonster(m, delay=0){
    m.dead=true; const f=S.floor; const p=S.player;
    f.mons=f.mons.filter(x=>x!==m);
    R.death(m, delay);
    S.kills++;
    if(m.id==='kaelith_foe'){ S.flags.k_dead=1; UI.bossBar(null); this.dropNear(m.x,m.y,Items.makeLegend('oath',this.floorNum()));
      this.gainXp(m.xp); setTimeout(()=>UI.scene(STORY.npc.kaelithDefeat),600); return; }
    if(m.boss){ this.bossDefeated(m); return; }
    this.gainXp(m.xp);
    // butin
    const fn=this.floorNum();
    if(rand()< (m.elite?0.9:0.16)) this.dropNear(m.x,m.y, Items.rollGear(fn, m.elite?0.8:0));
    if(rand()<0.12) this.dropNear(m.x,m.y, Items.rollConsumable());
    if(rand()<0.35) this.dropNear(m.x,m.y, {kind:'gold', qty:RI(2,6)+fn*2});
    if(DATA.monsters[m.id].split && !DATA.monsters[m.id].small){
      for(let i=0;i<2;i++){ const spot=this.freeAdj(m.x,m.y); if(spot){ const s=Monsters.create('slimelet',m.lvl,spot[0],spot[1],false); s.awake=true; s.rx=m.x; s.ry=m.y; f.mons.push(s);} }
      this.log('Le limon se divise !','#a88a6a');
    }
  },
  bossDefeated(m){
    const f=S.floor, d=DATA.bosses[m.id];
    UI.bossBar(null); R.shake(14); Sfx.play('bossdie');
    this.gainXp(m.xp);
    this.log(`${d.name} est vaincu !`,'#ff8a2a');
    const loreId=S.act*4+3; if(!S.lore.includes(loreId)){ S.lore.push(loreId); }
    if(d.legend){ this.dropNear(m.x,m.y, Items.makeLegend(d.legend, this.floorNum()+1)); }
    this.dropNear(m.x,m.y,{kind:'gold', qty:80+S.act*90});
    this.dropNear(m.x,m.y, Items.rollGear(this.floorNum()+1, 1.5));
    // tous les sbires fuient en cendres
    for(const o of [...f.mons]) if(!o.friendly){ R.death(o,200); }
    f.mons=f.mons.filter(o=>o.friendly);
    const act=STORY.acts[S.act];
    const after=()=>{
      if(S.act===4){ UI.scene(STORY.finale(S)); return; }
      Dungeon.set(f,m.x,m.y,T.STAIRS); f.stairs={x:m.x,y:m.y};
      f.items=f.items.filter(i=>!(i.x===m.x&&i.y===m.y)).concat(f.items.filter(i=>i.x===m.x&&i.y===m.y).map(i=>{ const s=this.freeAdj(m.x,m.y)||[m.x,m.y]; return {...i,x:s[0],y:s[1]}; }));
      this.log('Un passage s\'ouvre là où le gardien est tombé.','#f7d44a');
      UI.toast(`Fragment de mémoire récupéré : « ${STORY.lore[S.act*4+3].t} »`);
      this.save();
    };
    setTimeout(()=>{ if(act.bossOutro) UI.scene(act.bossOutro, after); else after(); }, 900);
  },
  freeAdj(x,y){
    const f=S.floor; const c=[];
    for(const [dx,dy] of DIR8){ const nx=x+dx, ny=y+dy; const t=Dungeon.tile(f,nx,ny);
      if(t!==T.WALL && t!==T.DOOR && !this.occupied(nx,ny)) c.push([nx,ny]); }
    return c.length? c[RI(0,c.length-1)] : null;
  },
  damagePlayer(dmg, src, crit, o={}){
    const p=S.player;
    const b=this.get(p,'bastion'); if(b) dmg=Math.max(1,Math.round(dmg*(1-b.p)));
    const sh=this.get(p,'shield');
    if(sh){ const a=Math.min(sh.p,dmg); sh.p-=a; dmg-=a; R.float(p.x,p.y,`(${a})`,'#4a8fe0',{delay:o.delay}); if(sh.p<=0) this.rmStatus(p,'shield'); }
    if(dmg<=0) return 0;
    p.hp-=dmg; p.flash=performance.now()+(o.delay||0);
    R.float(p.x,p.y,'-'+dmg, crit?'#ff6a6a':'#ff3b3b',{crit, delay:o.delay});
    R.burst(p.x,p.y,'#a01c28',crit?10:6,{delay:o.delay});
    R.hurt(Math.min(1, dmg/this.pstats().maxHp*3));
    if(crit) R.shake(4);
    Sfx.play('hurt');
    if(p.hp<=0 && !S.dead){ setTimeout(()=>this.die(), 250+(o.delay||0)); S.dead='pending'; }
    return dmg;
  },
  healPlayer(n, quiet){
    const p=S.player, st=this.pstats(); const before=p.hp; p.hp=Math.min(st.maxHp,p.hp+n);
    const g=p.hp-before; if(g>0 && !quiet) R.float(p.x,p.y,'+'+g,'#7cc94a'); return g;
  },
  gainXp(n){
    const p=S.player, st=this.pstats(); n=Math.round(n*(1+st.xp/100)); p.xp+=n;
    while(p.xp>=this.xpNeed(p.lvl)){
      p.xp-=this.xpNeed(p.lvl); p.lvl++; p.sp++;
      const s2=this.pstats(); p.hp=Math.min(s2.maxHp, p.hp+Math.round(s2.maxHp*0.35)); p.mp=s2.maxMp;
      R.levelUp(p); Sfx.play('levelup');
      this.log(`NIVEAU ${p.lvl} ! +1 point de compétence (K)`,'#f7d44a'); UI.toast(`Niveau ${p.lvl} — +1 point de compétence`);
    }
  },
  xpNeed(l){ return Math.round(16*Math.pow(l,1.55)); },

  // ----- consommables / équipement -----
  useItem(uidv, target){
    const p=S.player, it=p.bag.find(b=>b.uid===uidv); if(!it) return false;
    if(it.kind==='gear'){ this.equip(uidv); return false; }
    const st=this.pstats(); let ok=true;
    switch(it.id){
      case 'pot_hp': { const g=this.healPlayer(Math.round(st.maxHp*0.4+20)); R.burst(p.x,p.y,'#e05040',12,{up:1}); Sfx.play('drink'); this.log(`Potion de soin : +${g} PV`,'#7cc94a'); break; }
      case 'pot_mp': { const g=Math.min(st.maxMp-p.mp, Math.round(st.maxMp*0.5)); p.mp+=g; R.burst(p.x,p.y,'#4a8fe0',12,{up:1}); Sfx.play('drink'); this.log(`Potion de mana : +${g} mana`,'#5aa0ff'); break; }
      case 'elixir': p.hp=st.maxHp; p.mp=st.maxMp; p.statuses=p.statuses.filter(s=>!['poison','burn','freeze','root'].includes(s.t)); R.burst(p.x,p.y,'#c06af0',22,{up:1}); Sfx.play('heal'); this.log('Élixir de Braise : tu es comme neuf.','#c06af0'); break;
      case 'sc_tele': { const f=S.floor; for(let i=0;i<500;i++){ const x=RI(1,f.w-2), y=RI(1,f.h-2);
          if(Dungeon.tile(f,x,y)===T.FLOOR && !this.occupied(x,y) && cheb({x,y},p)>8){ R.burst(p.x,p.y,'#c99af0',16); p.x=x; p.y=y; p.snap=true; R.burst(x,y,'#c99af0',16); break; } }
        Sfx.play('blink'); this.log('Le parchemin se consume. Tu es ailleurs.','#c99af0'); break; }
      case 'sc_map': { const f=S.floor; for(let i=0;i<f.w*f.h;i++){ if(f.tiles[i]!==T.WALL) f.explored[i]=1;
          else { const x=i%f.w, y=(i/f.w)|0; if(DIR8.some(([dx,dy])=>Dungeon.tile(f,x+dx,y+dy)!==T.WALL)) f.explored[i]=1; } }
        Sfx.play('lore'); this.log("La carte de l'étage se dessine dans ton esprit.",'#9fe8f0'); break; }
      case 'bomb': {
        if(!target){ UI.startTargeting({kind:'item', uid:uidv, range:6, radius:1, target:'tile'}); return false; }
        const d=R.proj(p.x,p.y,target.x,target.y,'#555','bomb');
        setTimeout(()=>{ R.explode(target.x,target.y,1,'#f08a2c'); Sfx.play('boom'); R.shake(6); }, d);
        for(const m of [...S.floor.mons]) if(!m.friendly && cheb(m,target)<=1) this.damageMonster(m, Math.round(18+this.floorNum()*7), false, {delay:d});
        this.log('BOUM !','#f08a2c'); break; }
      default: ok=false;
    }
    if(ok){ it.qty--; if(it.qty<=0) p.bag.splice(p.bag.indexOf(it),1); }
    return ok;
  },
  quickPotion(id){
    const it=S.player.bag.find(b=>b.kind==='cons'&&b.id===id);
    if(!it){ this.log(`Plus de ${DATA.consumables[id].name.toLowerCase()} !`,'#e05040'); return false; }
    return this.useItem(it.uid);
  },
  equip(uidv){
    const p=S.player, i=p.bag.findIndex(b=>b.uid===uidv); if(i<0) return;
    const it=p.bag[i]; if(it.kind!=='gear') return;
    const old=p.equip[it.slot]; p.equip[it.slot]=it; p.bag.splice(i,1); if(old) p.bag.splice(i,0,old);
    const st=this.pstats(); p.hp=Math.min(p.hp,st.maxHp); p.mp=Math.min(p.mp,st.maxMp);
    Sfx.play('equip'); this.log(`Équipé : ${Items.name(it)}`, Items.color(it));
  },
  unequip(slot){
    const p=S.player, it=p.equip[slot]; if(!it) return;
    if(p.bag.length>=24){ this.log('Sac plein !','#e05040'); return; }
    p.equip[slot]=null; p.bag.push(it);
    const st=this.pstats(); p.hp=Math.min(p.hp,st.maxHp); p.mp=Math.min(p.mp,st.maxMp); Sfx.play('equip');
  },
  drop(uidv){
    const p=S.player, i=p.bag.findIndex(b=>b.uid===uidv); if(i<0) return;
    const it=p.bag.splice(i,1)[0]; if(S.floor && !S.inCamp) S.floor.items.push({x:p.x,y:p.y,item:it, dropped:true});
  },
  sell(uidv){
    const p=S.player, i=p.bag.findIndex(b=>b.uid===uidv); if(i<0) return;
    const it=p.bag[i]; let v=Math.round(Items.value(it)*0.3);
    if(it.kind==='cons'){ it.qty--; if(it.qty<=0) p.bag.splice(i,1); } else p.bag.splice(i,1);
    S.gold+=v; Sfx.play('gold'); return v;
  },
  buy(kind, ref){
    const p=S.player;
    if(kind==='gear'){ const i=S.shop.gear.findIndex(g=>g.uid===ref); const it=S.shop.gear[i]; const price=Items.value(it);
      if(S.gold<price) return 'Pas assez d\'or.'; if(p.bag.length>=24) return 'Sac plein.';
      S.gold-=price; S.shop.gear.splice(i,1); p.bag.push(it); Sfx.play('gold'); return null; }
    const price=Math.round(DATA.consumables[ref].price*(1+S.act*0.35));
    if(S.gold<price) return 'Pas assez d\'or.';
    const s=p.bag.find(b=>b.kind==='cons'&&b.id===ref);
    if(!s && p.bag.length>=24) return 'Sac plein.';
    S.gold-=price; if(s) s.qty++; else p.bag.push({uid:uid(),kind:'cons',id:ref,qty:1}); Sfx.play('gold'); return null;
  },
  upgradeCost(it){ return Math.round((it.plus+1)*(25+it.ilvl*9)*(it.rarity>=3?1.5:1)); },
  upgrade(it){
    if(it.plus>=5) return 'Déjà au maximum (+5).';
    const c=this.upgradeCost(it); if(S.gold<c) return 'Pas assez d\'or.';
    S.gold-=c; it.plus++; Sfx.play('anvil'); return null;
  },

  // ----- compétences -----
  skillRank(id){ return S.player.skills[id]||0; },
  canUnlock(id){ const sk=DATA.skills[id], r=this.skillRank(id); return S.player.sp>0 && r<3 && S.player.lvl>=sk.lvl + (r>0? r*3:0); },
  learn(id){ if(!this.canUnlock(id)) return; S.player.sp--; S.player.skills[id]=this.skillRank(id)+1; Sfx.play('levelup'); },
  skillCost(id){ const st=this.pstats(); return Math.max(0,Math.round(DATA.skills[id].mp*(1+st.cost/100))); },
  skillReady(id){ const p=S.player; return this.skillRank(id)>0 && !(p.cds[id]>0) && p.mp>=this.skillCost(id); },
  skillRange(id){ const sk=DATA.skills[id], r=this.skillRank(id); return id==='m_blink' ? [0,6,7,8][r] : sk.range||1; },
  useSkill(id, tgt){
    const p=S.player, sk=DATA.skills[id], r=this.skillRank(id), st=this.pstats(), f=S.floor;
    if(!r) return false;
    if(p.cds[id]>0){ this.log(`${sk.name} : recharge (${p.cds[id]})`,'#8a8796'); return false; }
    const cost=this.skillCost(id); if(p.mp<cost){ this.log('Pas assez de mana.','#5aa0ff'); return false; }
    const mons=()=>f.mons.filter(m=>!m.friendly&&!m.dead);
    const adj = ()=>mons().filter(m=>cheb(m,p)<=1);
    let used=true;
    switch(id){
      case 'k_strike': { const m=tgt; if(!m||cheb(m,p)>1) return false; R.lunge(p,m.x-p.x,m.y-p.y);
        R.slash(m.x,m.y,sk.color); this.hit(p,m,[0,1.8,2.2,2.7][r],{skill:1}); if(r>=3&&!m.dead) this.addStatus(m,'stun',1); break; }
      case 'k_bastion': this.addStatus(p,'bastion',4,[0,.5,.6,.7][r]); R.ring(p.x,p.y,1,'#b7c4d4'); Sfx.play('shield'); break;
      case 'k_whirl': { const a=adj(); R.ring(p.x,p.y,1,sk.color); Sfx.play('whirl'); for(const m of a) this.hit(p,m,[0,1.3,1.65,2][r],{skill:1}); break; }
      case 'k_charge': { const m=tgt; if(!m) return false;
        const ln=Dungeon.line(p.x,p.y,m.x,m.y,8); let last=[p.x,p.y];
        for(const [x,y] of ln){ if(x===m.x&&y===m.y) break; if(Dungeon.tile(f,x,y)===T.WALL||Dungeon.tile(f,x,y)===T.DOOR||this.occupied(x,y)) break; last=[x,y]; }
        R.trail(p.x,p.y,last[0],last[1],sk.color); p.x=last[0]; p.y=last[1];
        if(cheb(p,m)<=1){ this.hit(p,m,[0,1.2,1.5,1.8][r],{skill:1}); if(!m.dead) this.addStatus(m,'stun',[0,1,2,2][r]); R.shake(5); }
        Sfx.play('charge'); break; }
      case 'k_cry': this.addStatus(p,'atkUp',6,[0,.3,.4,.55][r]); this.healPlayer(Math.round(st.maxHp*[0,.1,.15,.2][r]));
        R.ring(p.x,p.y,3,sk.color); Sfx.play('cry'); R.shake(4); break;
      case 'k_judg': { R.explode(p.x,p.y,2,sk.color); R.shake(10); Sfx.play('boom');
        for(const m of mons()) if(cheb(m,p)<=2){ this.hit(p,m,[0,2.5,3.2,4][r],{skill:1,noDodge:1}); if(!m.dead) this.addStatus(m,'burn',3,Math.ceil(st.atk*0.4)); } break; }
      case 'r_shot': { if(!tgt) return false; const ln=Dungeon.line(p.x,p.y,tgt.x,tgt.y,7); let end=[p.x,p.y];
        for(const [x,y] of ln){ if(Dungeon.blocksSight(f,x,y)) break; end=[x,y]; }
        const d=R.proj(p.x,p.y,end[0],end[1],sk.color,'arrow'); Sfx.play('bow');
        for(const [x,y] of ln){ if(Dungeon.blocksSight(f,x,y)) break; const m=this.monAt(x,y); if(m&&!m.friendly) this.hit(p,m,[0,1.4,1.75,2.1][r],{skill:1,delay:d*cheb(p,m)/Math.max(1,cheb(p,{x:end[0],y:end[1]}))}); }
        break; }
      case 'r_poison': { const m=tgt; if(!m||cheb(m,p)>1) return false; R.lunge(p,m.x-p.x,m.y-p.y); R.slash(m.x,m.y,sk.color);
        const dmg=this.hit(p,m,[0,1.1,1.3,1.5][r],{skill:1}); if(!m.dead) this.addStatus(m,'poison',5,Math.ceil(st.atk*[0,.4,.55,.7][r])); break; }
      case 'r_shadow': { const m=tgt; if(!m) return false;
        const opts=DIR8.map(([dx,dy])=>[m.x+dx,m.y+dy]).filter(([x,y])=>{ const t=Dungeon.tile(f,x,y); return t!==T.WALL&&t!==T.DOOR&&!this.occupied(x,y); });
        if(!opts.length){ this.log('Aucune ombre où surgir.','#8a8796'); return false; }
        opts.sort((a,b)=>Math.hypot(b[0]-p.x,b[1]-p.y)-Math.hypot(a[0]-p.x,a[1]-p.y));
        R.burst(p.x,p.y,'#a35ee0',14); p.x=opts[0][0]; p.y=opts[0][1]; p.snap=true; R.burst(p.x,p.y,'#a35ee0',14); Sfx.play('blink');
        this.hit(p,m,[0,1.5,1.8,2.2][r],{skill:1,crit:true}); break; }
      case 'r_rain': { if(!tgt) return false; const d=500; R.rain(tgt.x,tgt.y,1,sk.color); Sfx.play('bow');
        for(const m of mons()) if(cheb(m,tgt)<=1) this.hit(p,m,[0,1.2,1.5,1.85][r],{skill:1,delay:d}); break; }
      case 'r_smoke': this.addStatus(p,'invis',[0,3,4,5][r]); this.addStatus(p,'nextDouble',12); R.smoke(p.x,p.y); Sfx.play('smoke');
        for(const m of mons()) if(!m.boss) m.lost=true; break;
      case 'r_dance': { const ts=mons().filter(m=>cheb(m,p)<=4 && f.visible[m.y*f.w+m.x]); if(!ts.length){ this.log('Personne à danser avec.','#8a8796'); return false; }
        Sfx.play('whirl'); let k=0; for(const m of ts){ for(let j=0;j<2;j++){ R.slash(m.x,m.y,sk.color,k*90); this.hit(p,m,[0,1.1,1.4,1.7][r],{skill:1,delay:k*90}); k++; } } break; }
      case 'm_fire': { const m=tgt; if(!m) return false; const d=R.proj(p.x,p.y,m.x,m.y,sk.color,'fire'); Sfx.play('fire');
        this.hit(p,m,[0,1.6,2,2.45][r],{skill:1,delay:d}); if(!m.dead && rand()<0.35) this.addStatus(m,'burn',3,Math.ceil(st.atk*0.35)); break; }
      case 'm_frost': { R.ring(p.x,p.y,2,sk.color); Sfx.play('frost');
        for(const m of mons()) if(cheb(m,p)<=2){ this.hit(p,m,[0,.9,1.15,1.4][r],{skill:1,noDodge:1}); if(!m.dead) this.addStatus(m,'freeze', m.boss?1:[0,2,2,3][r]); } break; }
      case 'm_blink': { if(!tgt) return false; const t=Dungeon.tile(f,tgt.x,tgt.y);
        if(t===T.WALL||t===T.DOOR||this.occupied(tgt.x,tgt.y)) return false;
        R.burst(p.x,p.y,sk.color,16); p.x=tgt.x; p.y=tgt.y; p.snap=true; R.burst(p.x,p.y,sk.color,16); Sfx.play('blink'); this.onStep(); break; }
      case 'm_chain': { let cur=tgt; if(!cur) return false; const hitL=[]; let from={x:p.x,y:p.y}; let d=0;
        for(let i=0;i<[0,3,4,5][r] && cur;i++){ hitL.push(cur); R.bolt(from.x,from.y,cur.x,cur.y,sk.color,d);
          this.hit(p,cur,[0,1.3,1.55,1.8][r],{skill:1,delay:d+60}); from=cur; d+=110;
          cur=mons().filter(m=>!hitL.includes(m)&&!m.dead&&cheb(m,from)<=4).sort((a,b)=>cheb(a,from)-cheb(b,from))[0]; }
        Sfx.play('zap'); break; }
      case 'm_shield': this.addStatus(p,'shield',8,Math.round(st.atk*[0,3,4.5,6][r])); R.ring(p.x,p.y,1,sk.color); Sfx.play('shield'); break;
      case 'm_meteor': { if(!tgt) return false; const d=R.meteor(p.x,p.y,tgt.x,tgt.y);
        setTimeout(()=>{ R.explode(tgt.x,tgt.y,2,'#ff5a1a'); R.shake(12); Sfx.play('boom'); }, d);
        for(const m of mons()) if(cheb(m,tgt)<=2) this.hit(p,m,[0,3,3.8,4.7][r],{skill:1,noDodge:1,delay:d}); break; }
      default: used=false;
    }
    if(used){ p.mp-=cost; p.cds[id]=sk.cd; }
    return used;
  },

  // ----- tour du monde -----
  endTurn(){
    if(!S || S.dead===true) return;
    const p=S.player, f=S.floor; S.turn++;
    this.tickStatuses(p, true);
    const st=this.pstats();
    p.mpAcc=(p.mpAcc||0)+DATA.classes[S.cls].mpRegen+(st.mpr||0);
    while(p.mpAcc>=1){ p.mpAcc--; p.mp=Math.min(st.maxMp,p.mp+1); }
    p.hpAcc=(p.hpAcc||0)+0.25+(st.regen||0);
    while(p.hpAcc>=1){ p.hpAcc--; if(p.hp>0) p.hp=Math.min(st.maxHp,p.hp+1); }
    for(const k in p.cds) if(p.cds[k]>0) p.cds[k]--;
    if(Dungeon.tile(f,p.x,p.y)===T.LAVA) this.addStatus(p,'burn',2,Math.ceil(st.maxHp*0.04));
    this.monstersAct();
    this.resolveTelegraphs();
    this.updateFov();
    if(S.turn%40===0) this.save();
    UI.refresh();
    if(!S.dead && this.playerLocked()){ UI.lockedTurn(); }
  },
  tickStatuses(e, isP){
    for(const s of e.statuses){
      if(s.t==='poison' || s.t==='burn'){
        const d=Math.max(1,Math.round(s.p));
        if(isP){ S.player.hp-=d; R.float(e.x,e.y,'-'+d, s.t==='poison'?'#7cc94a':'#ff7a2a',{small:true});
          if(S.player.hp<=0 && !S.dead){ S.dead='pending'; setTimeout(()=>this.die(),250); } }
        else { e.hp-=d; R.float(e.x,e.y,''+d, s.t==='poison'?'#7cc94a':'#ff7a2a',{small:true}); if(e.hp<=0 && !e.dead) this.killMonster(e); }
        if(rand()<0.5) R.burst(e.x,e.y, s.t==='poison'?'#7cc94a':'#ff7a2a',2,{up:1});
      }
      s.n--;
    }
    e.statuses=e.statuses.filter(s=>s.n>0 && !(s.t==='shield'&&s.p<=0));
  },
  monstersAct(){
    const f=S.floor;
    for(const m of [...f.mons]){
      if(m.dead || m.friendly) continue;
      if(m.statuses.length) this.tickStatuses(m,false);
      if(m.dead) continue;
      m.energy+=m.spd;
      while(m.energy>=100 && !m.dead && S.dead!==true){ m.energy-=100; this.monsterTurn(m); }
    }
  },
  stepToward(m, tx, ty){
    const f=S.floor;
    const path=Dungeon.path(f,m.x,m.y,tx,ty,{max:900, avoidLava:true, blockMons:(x,y)=>!!this.monAt(x,y)});
    if(path && path.length){ const [nx,ny]=path[0];
      if(nx===S.player.x && ny===S.player.y) return false;
      if(this.monAt(nx,ny)) return false;
      if(Dungeon.tile(f,nx,ny)===T.DOOR) { Dungeon.set(f,nx,ny,T.DOOR_OPEN); return true; }
      m.face = nx<m.x?-1:nx>m.x?1:m.face; m.x=nx; m.y=ny; return true; }
    // pas de chemin : pas glouton
    const dx=Math.sign(tx-m.x), dy=Math.sign(ty-m.y);
    for(const [ax,ay] of [[dx,dy],[dx,0],[0,dy]]){ const nx=m.x+ax, ny=m.y+ay;
      if((ax||ay) && Dungeon.walkable(f,nx,ny) && Dungeon.tile(f,nx,ny)!==T.DOOR && !this.occupied(nx,ny)){ m.x=nx; m.y=ny; return true; } }
    return false;
  },
  stepAway(m){
    const f=S.floor, p=S.player; let best=null, bd=cheb(m,p);
    for(const [dx,dy] of DIR8){ const nx=m.x+dx, ny=m.y+dy; const t=Dungeon.tile(f,nx,ny);
      if(t===T.WALL||t===T.DOOR||t===T.LAVA||this.occupied(nx,ny)) continue;
      const d=Math.max(Math.abs(nx-p.x),Math.abs(ny-p.y)); if(d>bd){ bd=d; best=[nx,ny]; } }
    if(best){ m.x=best[0]; m.y=best[1]; return true; } return false;
  },
  randomStep(m){
    const f=S.floor; const [dx,dy]=DIR8[RI(0,7)]; const nx=m.x+dx, ny=m.y+dy; const t=Dungeon.tile(f,nx,ny);
    if(t!==T.WALL && t!==T.DOOR && t!==T.LAVA && !this.occupied(nx,ny)){ m.x=nx; m.y=ny; m.face=dx<0?-1:dx>0?1:m.face; }
  },
  monsterTurn(m){
    const f=S.floor, p=S.player;
    if(this.has(m,'freeze')||this.has(m,'stun')) return;
    const d=cheb(m,p); const seen=f.visible[m.y*f.w+m.x];
    const invis=this.has(p,'invis');
    if(m.dormant){ if(d<=1){ m.dormant=false; m.awake=true; R.float(m.x,m.y,'!','#ffe86a'); this.log('Une gargouille s\'éveille !','#c8c2b8'); Sfx.play('stone'); } return; }
    if(!m.awake){
      if(seen && d<=9 && !invis){ m.awake=true; R.float(m.x,m.y,'!','#ff3b3b',{small:true}); }
      else { if(rand()<0.15) this.randomStep(m); return; }
    }
    if(invis || (m.lost && !seen)){ if(rand()<0.5) this.randomStep(m); return; }
    m.lost=false;
    if(m.boss) return this.bossTurn(m);
    const canSee = seen && Dungeon.los(f,m.x,m.y,p.x,p.y);
    if(m.ai==='erratic' && rand()<0.45){ this.randomStep(m); return; }
    if(m.ai==='ranged' || m.ai==='caster'){
      const dm=DATA.monsters[m.id];
      if(dm.heals && rand()<0.5){ const ally=f.mons.find(o=>o!==m&&!o.friendly&&!o.dead&&o.hp<o.maxHp*0.6&&cheb(o,m)<=6);
        if(ally){ const h=Math.round(ally.maxHp*0.25); ally.hp=Math.min(ally.maxHp,ally.hp+h); R.float(ally.x,ally.y,'+'+h,'#7cc94a'); R.burst(ally.x,ally.y,'#7cc94a',8,{up:1}); return; } }
      if(d<=1 && rand()<0.6 && this.stepAway(m)) return;
      if(d<=m.range && canSee && d>1){
        const dl=R.proj(m.x,m.y,p.x,p.y,dm.proj||'#fff', m.ai==='caster'?'orb':'arrow');
        this.hit(m,p,0.95,{delay:dl, ranged:true}); return; }
      if(d<=1){ R.lunge(m,p.x-m.x,p.y-m.y); this.hit(m,p,1,{}); return; }
      this.stepToward(m,p.x,p.y); return;
    }
    if(d<=1){
      if(Math.abs(p.x-m.x)&&Math.abs(p.y-m.y) && Dungeon.tile(f,p.x,m.y)===T.WALL && Dungeon.tile(f,m.x,p.y)===T.WALL){ this.stepToward(m,p.x,p.y); return; }
      R.lunge(m,p.x-m.x,p.y-m.y); this.hit(m,p,1,{}); return; }
    this.stepToward(m,p.x,p.y);
  },
  // ----- boss -----
  bossTurn(m){
    const f=S.floor, p=S.player, d=DATA.bosses[m.id], dist=cheb(m,p); const pct=m.hp/m.maxHp;
    for(let i=0;i<d.abilities.length;i++){ const ab=d.abilities[i];
      if(ab.at && !m.used[i] && pct<=ab.at){ m.used[i]=1; this.bossAbility(m,ab); return; } }
    if(pct<=0.5 && !m.enraged){ m.enraged=true; this.log(`${d.name} entre en rage !`,'#ff3b3b'); R.float(m.x,m.y,'RAGE','#ff3b3b'); R.shake(6); Sfx.play('boss'); }
    const ready=[];
    for(let i=0;i<d.abilities.length;i++){ const ab=d.abilities[i]; if(!ab.cd) continue;
      m.cds[i]--; if(m.cds[i]<=0 && dist<=(ab.range||8)) ready.push(i); }
    if(ready.length && rand()<0.8){
      const i=ready[RI(0,ready.length-1)]; const ab=d.abilities[i];
      if(this.bossAbility(m,ab)){ m.cds[i]=Math.max(2, ab.cd-(m.enraged?1:0)); return; }
    }
    if(dist<=1){ R.lunge(m,p.x-m.x,p.y-m.y); this.hit(m,p,1,{}); return; }
    if(!m.stationary) this.stepToward(m,p.x,p.y);
  },
  tgTiles(list){ const f=S.floor; return list.filter(([x,y])=>{ const t=Dungeon.tile(f,x,y); return t!==T.WALL&&t!==T.DOOR; }); },
  telegraph(m, tiles, ab){
    const f=S.floor; tiles=this.tgTiles(tiles);
    f.tg.push({tiles, at:S.turn+1, dmg:m.atk*(ab.mult||1)*(m.enraged?1.2:1), effect:ab.effect, color:DATA.bosses[m.id].color});
  },
  bossAbility(m, ab){
    const f=S.floor, p=S.player; const name=ab.name;
    const announce=()=>{ this.log(`${m.name.split(',')[0]} : ${name} !`,'#ff8a2a'); R.float(m.x,m.y-0.6,name,'#ffb060',{small:true}); };
    switch(ab.type){
      case 'slam': { const t=[]; for(let dy=-ab.r;dy<=ab.r;dy++) for(let dx=-ab.r;dx<=ab.r;dx++) if(dx||dy) t.push([m.x+dx,m.y+dy]);
        this.telegraph(m,t,ab); announce(); return true; }
      case 'target': { const t=[]; for(let dy=-ab.r;dy<=ab.r;dy++) for(let dx=-ab.r;dx<=ab.r;dx++) t.push([p.x+dx,p.y+dy]);
        this.telegraph(m,t,ab); announce(); return true; }
      case 'ring': { const t=[]; for(let dy=-ab.r2;dy<=ab.r2;dy++) for(let dx=-ab.r2;dx<=ab.r2;dx++){ const c=Math.max(Math.abs(dx),Math.abs(dy)); if(c>=ab.r1&&c<=ab.r2) t.push([m.x+dx,m.y+dy]); }
        this.telegraph(m,t,ab); announce(); return true; }
      case 'cross': { const t=[]; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) for(let k=1;k<=ab.len;k++){ const x=m.x+dx*k,y=m.y+dy*k; if(Dungeon.tile(f,x,y)===T.WALL) break; t.push([x,y]); }
        this.telegraph(m,t,ab); announce(); return true; }
      case 'lines': { const t=[]; for(let k=-12;k<=12;k++){ t.push([p.x+k,p.y]); t.push([p.x,p.y+k]); }
        if(m.enraged) for(let k=-8;k<=8;k++){ t.push([p.x+k,p.y+k]); t.push([p.x+k,p.y-k]); }
        this.telegraph(m,t,ab); announce(); return true; }
      case 'summon': { let n=0; for(let i=0;i<ab.n;i++){ const s=this.freeAdj(m.x,m.y)||this.freeAdj(p.x,p.y); if(!s) continue;
          const mm=Monsters.create(ab.mon, Math.max(1,m.lvl-1), s[0], s[1], false); mm.awake=true; mm.rx=m.x; mm.ry=m.y; f.mons.push(mm); R.burst(s[0],s[1],DATA.bosses[m.id].color,10,{up:1}); n++; }
        announce(); return n>0; }
      case 'heal': { const h=Math.round(m.maxHp*ab.pct); m.hp=Math.min(m.maxHp,m.hp+h); R.float(m.x,m.y,'+'+h,'#7cc94a'); R.burst(m.x,m.y,'#7cc94a',20,{up:1}); announce(); return true; }
      case 'bolt': { if(!Dungeon.los(f,m.x,m.y,p.x,p.y)) return false; const dl=R.proj(m.x,m.y,p.x,p.y,ab.proj||'#fff','orb');
        const dmg=this.hit(m,p,ab.mult||1,{delay:dl,ranged:true}); if(dmg>0 && ab.effect==='root'){ this.addStatus(p,'root',2); this.log('Une toile t\'entrave !','#ffffff'); }
        announce(); return true; }
      case 'charge': { if(cheb(m,p)<3 || !Dungeon.los(f,m.x,m.y,p.x,p.y)) return false;
        const ln=Dungeon.line(m.x,m.y,p.x,p.y,10); let last=[m.x,m.y];
        for(const [x,y] of ln){ if(x===p.x&&y===p.y) break; if(Dungeon.tile(f,x,y)===T.WALL||this.occupied(x,y)) break; last=[x,y]; }
        R.trail(m.x,m.y,last[0],last[1],DATA.bosses[m.id].color); m.x=last[0]; m.y=last[1]; announce();
        if(cheb(m,p)<=1){ this.hit(m,p,ab.mult||1.5,{}); R.shake(6); } return true; }
      case 'dark': { this.addStatus(p,'dark',14); announce(); R.flash('#000000'); this.log('Les ténèbres t\'enveloppent…','#a35ee0'); return true; }
    }
    return false;
  },
  resolveTelegraphs(){
    const f=S.floor, p=S.player; if(!f.tg.length) return;
    const keep=[];
    for(const tg of f.tg){
      if(tg.at> S.turn){ keep.push(tg); continue; }
      for(const [x,y] of tg.tiles) if(rand()<0.6) R.burst(x,y,tg.color,3,{up:1});
      Sfx.play('boom'); R.shake(5);
      if(tg.tiles.some(([x,y])=>x===p.x&&y===p.y)){
        const st=this.pstats(); const dmg=Math.max(1,Math.round(tg.dmg*(0.9+rand()*0.2)*30/(30+st.def)));
        this.damagePlayer(dmg,null,false,{});
        if(tg.effect==='freeze') this.addStatus(p,'freeze',1);
        if(tg.effect==='burn') this.addStatus(p,'burn',3,Math.ceil(dmg/5));
      }
    }
    f.tg=keep;
  },
  die(){
    if(S.dead===true) return;
    S.dead=true; S.deaths++; Sfx.play('death'); R.shake(10);
    if(S.mode==='hardcore'){ this.deleteSave(); }
    UI.showDeath();
  },
  retry(){
    S.dead=false; S.gold=Math.floor(S.gold*0.75);
    const st=this.pstats(); S.player.hp=st.maxHp; S.player.mp=st.maxMp; S.player.statuses=[]; S.player.cds={};
    if(S.floor && S.floor.isBoss){ /* le boss revient */ }
    this.enterFloor(true);
  },

  // ----- exploration automatique -----
  autoExploreStep(){
    const f=S.floor, p=S.player, W=f.w;
    const prev=new Int32Array(W*f.h).fill(-1), seen=new Uint8Array(W*f.h); const q=[p.y*W+p.x]; seen[q[0]]=1; let h=0, goal=-1;
    const itemAt=new Set(f.items.filter(i=>!i.dropped).map(i=>i.y*W+i.x));
    const props=new Set(f.props.filter(o=>(o.type==='chest'||(o.type==='lectern'&&!o.read))).map(o=>o.y*W+o.x));
    while(h<q.length){ const c=q[h++]; const x=c%W, y=(c/W)|0;
      if(c!==q[0] && (itemAt.has(c) || props.has(c))){ goal=c; break; }
      if(c!==q[0] && DIR8.some(([dx,dy])=>Dungeon.inb(f,x+dx,y+dy) && !f.explored[(y+dy)*W+x+dx])){ goal=c; break; }
      for(const [dx,dy] of DIR8){ const nx=x+dx, ny=y+dy; if(!Dungeon.inb(f,nx,ny)) continue; const i=ny*W+nx;
        if(seen[i] || !f.explored[i]) continue; const t=f.tiles[i];
        if(t===T.WALL || t===T.LAVA) continue; if(dx&&dy&&(f.tiles[y*W+nx]===T.WALL||f.tiles[ny*W+x]===T.WALL)) continue;
        if(Dungeon.propBlocks(f,nx,ny) && !props.has(i)) continue;
        if(f.props.some(o=>o.type==='trap'&&o.x===nx&&o.y===ny)) continue;
        seen[i]=1; prev[i]=c; q.push(i); } }
    if(goal<0) return null;
    let c=goal; while(prev[c]!==q[0] && prev[c]>=0) c=prev[c];
    return [c%W-p.x, ((c/W)|0)-p.y];
  }
};
