// ============================================================
//  DONJON — génération, champ de vision, chemins
// ============================================================
const T = { WALL:0, FLOOR:1, DOOR:2, DOOR_OPEN:3, STAIRS:4, WATER:5, LAVA:6 };
const BLOCKING_PROPS = { chest:1, chest_open:1, fountain:1, shrine:1, lectern:1, brazier:1 };

const Dungeon = {
  idx(f,x,y){ return y*f.w+x; },
  inb(f,x,y){ return x>=0&&y>=0&&x<f.w&&y<f.h; },
  tile(f,x,y){ return this.inb(f,x,y) ? f.tiles[y*f.w+x] : T.WALL; },
  set(f,x,y,t){ if(this.inb(f,x,y)) f.tiles[y*f.w+x]=t; },
  blocksSight(f,x,y){ const t=this.tile(f,x,y); return t===T.WALL||t===T.DOOR; },
  walkable(f,x,y){ const t=this.tile(f,x,y); return t!==T.WALL; }, // portes : on les ouvre en marchant
  propAt(f,x,y){ return f.props.find(p=>p.x===x&&p.y===y); },
  propBlocks(f,x,y){ const p=this.propAt(f,x,y); return p && BLOCKING_PROPS[p.type]; },

  // ---------------------------------------------------------
  generate(actIdx, fi, seed){
    const rnd = mulberry(seed);
    const R = (a,b)=>a+Math.floor(rnd()*(b-a+1));
    const act = STORY.acts[actIdx], B = DATA.biomes[act.biome];
    const isBoss = !!act.floors[fi].boss;
    const W = isBoss? 52:58, H = isBoss? 36:42;
    const f = { w:W, h:H, tiles:new Array(W*H).fill(T.WALL), explored:new Array(W*H).fill(0),
      visible:new Uint8Array(W*H), rooms:[], props:[], items:[], mons:[], wallDeco:[], lights:[],
      biome:act.biome, act:actIdx, fi, isBoss, seed, start:null, stairs:null, tg:[] };
    const carve=(r)=>{ for(let y=r.y;y<r.y+r.h;y++) for(let x=r.x;x<r.x+r.w;x++) this.set(f,x,y,T.FLOOR); };
    const hC=(x1,x2,y)=>{ for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) this.set(f,x,y,T.FLOOR); };
    const vC=(y1,y2,x)=>{ for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++) this.set(f,x,y,T.FLOOR); };
    const ctr=r=>({x:r.x+(r.w>>1), y:r.y+(r.h>>1)});
    const connect=(a,b)=>{ const A=ctr(a),Bc=ctr(b);
      if(rnd()<0.5){ hC(A.x,Bc.x,A.y); vC(A.y,Bc.y,Bc.x); } else { vC(A.y,Bc.y,A.x); hC(A.x,Bc.x,Bc.y); } };

    if(!isBoss){
      for(let i=0;i<260 && f.rooms.length<14;i++){
        const w=R(5,11), h=R(4,8), x=R(2,W-w-3), y=R(3,H-h-3);
        if(f.rooms.some(o=> x<o.x+o.w+2 && x+w+2>o.x && y<o.y+o.h+2 && y+h+2>o.y)) continue;
        f.rooms.push({x,y,w,h});
      }
      f.rooms.sort((a,b)=>a.x-b.x);
      f.rooms.forEach(carve);
      for(let i=0;i<f.rooms.length-1;i++) connect(f.rooms[i], f.rooms[i+1]);
      for(let k=0;k<3;k++){ const a=f.rooms[R(0,f.rooms.length-1)], b=f.rooms[R(0,f.rooms.length-1)]; if(a!==b) connect(a,b); }
    } else {
      const s={x:3,y:(H>>1)-3,w:8,h:7}, a={x:19,y:5,w:28,h:H-11};
      f.rooms.push(s,a); carve(s); carve(a);
      hC(s.x+s.w, a.x, H>>1); hC(s.x+s.w, a.x, (H>>1)+1);
      // piliers de l'arène
      const cx=a.x+(a.w>>1), cy=a.y+(a.h>>1);
      for(const [dx,dy] of [[-8,-5],[8,-5],[-8,5],[8,5],[-4,-8],[4,-8],[-4,8],[4,8]])
        if(this.tile(f,cx+dx,cy+dy)===T.FLOOR && Math.abs(dy)<a.h/2-1) this.set(f,cx+dx,cy+dy,T.WALL);
    }

    // portes
    for(const r of f.rooms){
      const cand=[];
      for(let x=r.x;x<r.x+r.w;x++){ cand.push([x,r.y-1,'h']); cand.push([x,r.y+r.h,'h']); }
      for(let y=r.y;y<r.y+r.h;y++){ cand.push([r.x-1,y,'v']); cand.push([r.x+r.w,y,'v']); }
      for(const [x,y,o] of cand){
        if(this.tile(f,x,y)!==T.FLOOR) continue;
        const ok = o==='h' ? (this.tile(f,x-1,y)===T.WALL && this.tile(f,x+1,y)===T.WALL)
                           : (this.tile(f,x,y-1)===T.WALL && this.tile(f,x,y+1)===T.WALL);
        if(ok && rnd()<(isBoss?1:0.4)) this.set(f,x,y,T.DOOR);
      }
    }

    // piliers / eau / lave selon biome
    const inner = r=>{ const out=[]; for(let y=r.y+1;y<r.y+r.h-1;y++) for(let x=r.x+1;x<r.x+r.w-1;x++) out.push([x,y]); return out; };
    if(!isBoss){
      f.rooms.forEach((r,i)=>{
        if(i===0) return;
        if(B.pillars && r.w>=7 && r.h>=6 && rnd()<0.6){
          for(let y=r.y+2;y<r.y+r.h-2;y+=3) for(let x=r.x+2;x<r.x+r.w-2;x+=3) if(rnd()<0.75) this.set(f,x,y,T.WALL);
        }
        const liquid = B.water?T.WATER : B.lava?T.LAVA : null;
        if(liquid!==null && rnd()<0.4){
          let [x,y] = inner(r)[R(0,inner(r).length-1)]||[r.x+1,r.y+1];
          for(let k=0;k<R(6,16);k++){ if(this.tile(f,x,y)===T.FLOOR) this.set(f,x,y,liquid);
            x=Math.max(r.x+1,Math.min(r.x+r.w-2,x+R(-1,1))); y=Math.max(r.y+1,Math.min(r.y+r.h-2,y+R(-1,1))); }
        }
      });
    }

    // départ & escalier
    const startRoom = f.rooms[0];
    f.start = ctr(startRoom);
    if(this.tile(f,f.start.x,f.start.y)!==T.FLOOR) this.set(f,f.start.x,f.start.y,T.FLOOR);
    const dist = this.bfs(f, f.start.x, f.start.y);
    if(!isBoss){
      let best=null, bd=-1;
      for(const r of f.rooms){ const c=ctr(r); const d=dist[c.y*W+c.x]; if(d>bd && this.tile(f,c.x,c.y)===T.FLOOR){ bd=d; best=c; } }
      f.stairs = best; this.set(f,best.x,best.y,T.STAIRS);
    }

    // occupation
    const occ = new Set([f.start.x+','+f.start.y]); if(f.stairs) occ.add(f.stairs.x+','+f.stairs.y);
    const freeIn = (r, tries=40)=>{
      for(let i=0;i<tries;i++){ const x=R(r.x,r.x+r.w-1), y=R(r.y,r.y+r.h-1);
        if(this.tile(f,x,y)===T.FLOOR && !occ.has(x+','+y)){ occ.add(x+','+y); return {x,y}; } }
      return null; };
    const nearWall = (p)=> [[0,-1],[0,1],[-1,0],[1,0]].some(([dx,dy])=>this.tile(f,p.x+dx,p.y+dy)===T.WALL);
    const others = f.rooms.slice(1);
    const pickRoom = ()=> others[R(0,others.length-1)];

    // décor & lumières
    for(const r of f.rooms){
      for(let k=0;k<R(0,2);k++){ const p=freeIn(r); if(p && nearWall(p)) f.props.push({type:'brazier',x:p.x,y:p.y}); else if(p) occ.delete(p.x+','+p.y); }
      for(let k=0;k<R(1,3);k++){ const p=freeIn(r); if(p) f.props.push({type:B.deco[R(0,B.deco.length-1)], x:p.x, y:p.y, deco:true}); }
    }
    // déco murales (torches / bannières)
    for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++){
      if(this.tile(f,x,y)===T.WALL && this.tile(f,x,y+1)===T.FLOOR && rnd()<0.05){
        if(B.banners && rnd()<0.5) f.wallDeco.push({type:'banner',x,y});
        else f.wallDeco.push({type:'torch',x,y});
      }
    }

    if(!isBoss){
      // coffres
      for(let k=0;k<R(2,3);k++){ const p=freeIn(pickRoom()); if(p) f.props.push({type:'chest',x:p.x,y:p.y}); }
      // pupitre de lore
      { const p=freeIn(pickRoom()); if(p) f.props.push({type:'lectern',x:p.x,y:p.y, lore:actIdx*4+fi}); }
      if(rnd()<0.4){ const p=freeIn(pickRoom()); if(p) f.props.push({type:'fountain',x:p.x,y:p.y}); }
      if(rnd()<0.4){ const p=freeIn(pickRoom()); if(p) f.props.push({type:'shrine',x:p.x,y:p.y}); }
      // pièges dans les couloirs
      let traps = 2+actIdx, guard=0;
      while(traps>0 && guard++<400){ const x=R(1,W-2), y=R(1,H-2);
        if(this.tile(f,x,y)===T.FLOOR && !occ.has(x+','+y) && !f.rooms.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h)){
          occ.add(x+','+y); f.props.push({type:'trap',x,y}); traps--; } }
      // objets au sol
      for(let k=0;k<R(2,4);k++){ const p=freeIn(pickRoom()); if(p) f.items.push({x:p.x,y:p.y, item: rnd()<0.5? {kind:'gold', qty:R(5,15)+actIdx*12+fi*4} : Items.rollConsumable(rnd)}); }
      // monstres
      const lvl = actIdx*4+fi+1;
      const n = 6 + actIdx*2 + fi*2;
      const pool = B.monsters;
      for(let k=0;k<n;k++){
        const r = pickRoom(); const p=freeIn(r); if(!p) continue;
        const pi = Math.min(pool.length-1, Math.floor(rnd()*Math.min(pool.length, 3+fi+ (actIdx>0?2:0))));
        const id = pool[pi];
        f.mons.push(Monsters.create(id, lvl+(rnd()<0.3?1:0), p.x, p.y, rnd()<0.1));
        if(DATA.monsters[id].pack){ for(let j=0;j<R(1,2);j++){ const q=freeIn(r); if(q) f.mons.push(Monsters.create(id,lvl,q.x,q.y,false)); } }
      }
      // PNJ
      const fl = act.floors[fi];
      if(fl.npc){ const r=f.rooms[1]||startRoom; const p=freeIn(r)||freeIn(startRoom);
        if(p) f.mons.push({id:'npc', npc:fl.npc, name:'Kaelith', spr:'kaelith', x:p.x, y:p.y, hp:1, maxHp:1, friendly:true, statuses:[]}); }
    } else {
      // arène de boss
      const a=f.rooms[1]; const cx=a.x+(a.w>>1), cy=a.y+(a.h>>1);
      for(const [dx,dy] of [[-12,-8],[12,-8],[-12,8],[12,8],[0,-9],[0,9]]) {
        const x=cx+dx,y=cy+dy; if(this.tile(f,x,y)===T.FLOOR){ f.props.push({type:'brazier',x,y}); occ.add(x+','+y); } }
      const sr=f.rooms[0]; const p=freeIn(sr); if(p) f.props.push({type:'fountain',x:p.x,y:p.y});
      const bossId = act.boss;
      const boss = Monsters.createBoss(bossId, cx, cy);
      f.mons.push(boss); f.arena = {x:a.x,y:a.y,w:a.w,h:a.h};
    }
    // connexité : aucun objet bloquant ne doit couper le donjon
    this.fixConnectivity(f);
    // lumières
    for(const p of f.props) if(p.type==='brazier') f.lights.push({x:p.x,y:p.y,r:5.5,color:B.torch});
      else if(p.type==='shrine') f.lights.push({x:p.x,y:p.y,r:3,color:'#c06af0'});
      else if(p.type==='crystal') f.lights.push({x:p.x,y:p.y,r:3,color:'#7fe6f2'});
      else if(p.type==='fountain') f.lights.push({x:p.x,y:p.y,r:3,color:'#7fe6f2'});
    for(const d of f.wallDeco) if(d.type==='torch') f.lights.push({x:d.x,y:d.y+1,r:4.5,color:B.torch});
    if(B.lava) for(let i=0;i<W*H;i++) if(f.tiles[i]===T.LAVA && rnd()<0.25) f.lights.push({x:i%W,y:(i/W)|0,r:2.5,color:'#ff5a1a'});
    return f;
  },

  reachCount(f, skip){
    const W=f.w, seen=new Uint8Array(W*f.h), block=new Set(f.props.filter(p=>BLOCKING_PROPS[p.type]&&p!==skip).map(p=>p.y*W+p.x));
    const q=[f.start.y*W+f.start.x]; seen[q[0]]=1; let n=0;
    while(q.length){ const c=q.pop(); n++; const x=c%W, y=(c/W)|0;
      for(const [dx,dy] of DIR8){ const nx=x+dx, ny=y+dy; if(!this.inb(f,nx,ny)) continue; const i=ny*W+nx;
        if(seen[i]||f.tiles[i]===T.WALL||block.has(i)) continue;
        if(dx&&dy&&(f.tiles[y*W+nx]===T.WALL||f.tiles[ny*W+x]===T.WALL)) continue;
        seen[i]=1; q.push(i); } }
    return n;
  },
  fixConnectivity(f){
    const base=()=>this.reachCount(f,null);
    let cur=base();
    for(const p of [...f.props]){ if(!BLOCKING_PROPS[p.type]) continue;
      const without=this.reachCount(f,p);
      if(without>cur+1){ f.props.splice(f.props.indexOf(p),1); cur=base(); } }
  },
  bfs(f,sx,sy){
    const d=new Int32Array(f.w*f.h).fill(-1); const q=[sx,sy]; d[sy*f.w+sx]=0; let h=0;
    while(h<q.length){ const x=q[h++], y=q[h++]; const cd=d[y*f.w+x];
      for(const [dx,dy] of DIR8){ const nx=x+dx, ny=y+dy; if(!this.inb(f,nx,ny)) continue; const i=ny*f.w+nx;
        if(d[i]<0 && this.walkable(f,nx,ny)){ d[i]=cd+1; q.push(nx,ny);} } }
    return d;
  },

  // ---------- FOV (shadowcasting récursif) ----------
  fov(f, px, py, radius){
    f.visible.fill(0);
    const vis=(x,y)=>{ if(this.inb(f,x,y)){ const i=y*f.w+x; f.visible[i]=1; f.explored[i]=1; } };
    vis(px,py);
    const M=[[1,0,0,-1,-1,0,0,1],[0,1,-1,0,0,-1,1,0],[0,1,1,0,0,-1,-1,0],[1,0,0,1,-1,0,0,-1]];
    const cast=(row,start,end,xx,xy,yx,yy)=>{
      if(start<end) return; const r2=radius*radius; let newStart=0;
      for(let j=row;j<=radius;j++){
        let dx=-j-1, dy=-j, blocked=false;
        while(dx<=0){
          dx++;
          const X=px+dx*xx+dy*xy, Y=py+dx*yx+dy*yy;
          const l=(dx-0.5)/(dy+0.5), r=(dx+0.5)/(dy-0.5);
          if(start<r) continue; else if(end>l) break;
          if(dx*dx+dy*dy<r2) vis(X,Y);
          const b=this.blocksSight(f,X,Y);
          if(blocked){ if(b){ newStart=r; continue; } else { blocked=false; start=newStart; } }
          else if(b && j<radius){ blocked=true; cast(j+1,start,l,xx,xy,yx,yy); newStart=r; }
        }
        if(blocked) break;
      }
    };
    for(let o=0;o<8;o++) cast(1,1.0,0.0,M[0][o],M[1][o],M[2][o],M[3][o]);
  },

  los(f,x0,y0,x1,y1){
    let dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx=x0<x1?1:-1, sy=y0<y1?1:-1, err=dx+dy;
    let x=x0,y=y0;
    while(true){
      if(x===x1&&y===y1) return true;
      if(!(x===x0&&y===y0) && this.blocksSight(f,x,y)) return false;
      const e2=2*err; if(e2>=dy){ err+=dy; x+=sx; } if(e2<=dx){ err+=dx; y+=sy; }
    }
  },
  line(x0,y0,x1,y1,maxLen){
    const out=[]; let dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx=x0<x1?1:-1, sy=y0<y1?1:-1, err=dx+dy, x=x0,y=y0;
    for(let i=0;i<200;i++){ if(!(x===x0&&y===y0)) out.push([x,y]); if(out.length>=maxLen) break;
      if(x===x1&&y===y1 && !maxLen) break;
      const e2=2*err; if(e2>=dy){ err+=dy; x+=sx; } if(e2<=dx){ err+=dx; y+=sy; } }
    return out;
  },

  // ---------- A* ----------
  path(f, sx,sy, tx,ty, opts={}){
    const W=f.w, N=W*f.h, g=new Float32Array(N).fill(1e9), from=new Int32Array(N).fill(-1), closed=new Uint8Array(N);
    const heap=[]; const push=(i,p)=>{ heap.push([p,i]); let k=heap.length-1;
      while(k>0){ const pa=(k-1)>>1; if(heap[pa][0]<=heap[k][0]) break; [heap[pa],heap[k]]=[heap[k],heap[pa]]; k=pa; } };
    const pop=()=>{ const top=heap[0], last=heap.pop(); if(heap.length){ heap[0]=last; let k=0;
      while(true){ const l=2*k+1, r=l+1; let m=k; if(l<heap.length&&heap[l][0]<heap[m][0]) m=l; if(r<heap.length&&heap[r][0]<heap[m][0]) m=r;
        if(m===k) break; [heap[m],heap[k]]=[heap[k],heap[m]]; k=m; } } return top[1]; };
    const s=sy*W+sx, t=ty*W+tx; g[s]=0; push(s,0); let n=0; const max=opts.max||2500;
    while(heap.length && n++<max){
      const c=pop(); if(c===t) break; if(closed[c]) continue; closed[c]=1;
      const cx=c%W, cy=(c/W)|0;
      for(const [dx,dy] of DIR8){
        const nx=cx+dx, ny=cy+dy; if(!this.inb(f,nx,ny)) continue;
        const ni=ny*W+nx; if(closed[ni]) continue;
        const tt=f.tiles[ni];
        if(tt===T.WALL) continue;
        if(dx&&dy && (f.tiles[cy*W+nx]===T.WALL || f.tiles[ny*W+cx]===T.WALL)) continue;
        if(ni!==t){
          if(opts.blockMons && opts.blockMons(nx,ny)) continue;
          if(this.propBlocks(f,nx,ny)) continue;
        }
        let cost = (dx&&dy)?1.41:1;
        if(tt===T.LAVA) cost += opts.avoidLava?40:2;
        if(tt===T.DOOR) cost += 0.5;
        if(opts.unknown && !f.explored[ni] && ni!==t) cost += 0; // autorisé
        const ng=g[c]+cost;
        if(ng<g[ni]){ g[ni]=ng; from[ni]=c; push(ni, ng+Math.max(Math.abs(tx-nx),Math.abs(ty-ny))); }
      }
    }
    if(from[t]<0 && s!==t) return null;
    const out=[]; let c=t; while(c!==s && c>=0){ out.push([c%W,(c/W)|0]); c=from[c]; }
    return out.reverse();
  }
};
const DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
