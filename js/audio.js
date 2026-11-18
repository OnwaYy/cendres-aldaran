// ============================================================
//  SON — effets synthétisés + ambiance (WebAudio, sans fichiers)
// ============================================================
const Sfx = {
  ac:null, master:null, on:true, music:true, drone:null, last:{},
  init(){
    try{ const o=JSON.parse(localStorage.getItem('cendres_opts')||'{}'); if(o.on===false) this.on=false; if(o.music===false) this.music=false; }catch(e){}
  },
  saveOpts(){ try{ localStorage.setItem('cendres_opts',JSON.stringify({on:this.on,music:this.music})); }catch(e){} },
  ensure(){
    if(this.ac) { if(this.ac.state==='suspended') this.ac.resume(); return true; }
    try{ this.ac=new (window.AudioContext||window.webkitAudioContext)(); this.master=this.ac.createGain(); this.master.gain.value=0.5; this.master.connect(this.ac.destination); }
    catch(e){ return false; }
    if(this.music) this.startMusic();
    return true;
  },
  tone(freq, dur, type='square', vol=0.2, slide=0, delay=0){
    const a=this.ac, t=a.currentTime+delay; const o=a.createOscillator(), g=a.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide),t+dur);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t+dur+0.02);
  },
  noise(dur, vol=0.2, freq=1200, delay=0, q=1){
    const a=this.ac, t=a.currentTime+delay; const n=a.sampleRate*dur, b=a.createBuffer(1,n,a.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
    const s=a.createBufferSource(); s.buffer=b; const f=a.createBiquadFilter(); f.type='lowpass'; f.frequency.value=freq; f.Q.value=q;
    const g=a.createGain(); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t);
  },
  play(name){
    if(!this.on || !this.ensure()) return;
    const now=performance.now(); if(this.last[name] && now-this.last[name]<40) return; this.last[name]=now;
    switch(name){
      case 'hit': this.noise(0.08,0.25,1800); this.tone(140,0.08,'square',0.08,0.5); break;
      case 'crit': this.noise(0.12,0.35,3000); this.tone(220,0.15,'sawtooth',0.12,0.4); break;
      case 'miss': this.noise(0.1,0.08,4000); break;
      case 'hurt': this.tone(180,0.18,'sawtooth',0.15,0.5); this.noise(0.1,0.15,900); break;
      case 'door': this.tone(90,0.25,'sawtooth',0.07,1.6); this.noise(0.2,0.06,600); break;
      case 'stairs': for(let i=0;i<4;i++) this.noise(0.08,0.12,500,i*0.12); break;
      case 'pickup': this.tone(660,0.06,'square',0.08); this.tone(990,0.08,'square',0.08,1,0.05); break;
      case 'rare': [523,659,784,1046].forEach((f,i)=>this.tone(f,0.25,'triangle',0.12,1,i*0.07)); break;
      case 'gold': this.tone(1300,0.05,'square',0.06); this.tone(1700,0.08,'square',0.06,1,0.04); break;
      case 'chest': this.tone(200,0.15,'sawtooth',0.08,1.5); [523,784,1046].forEach((f,i)=>this.tone(f,0.2,'triangle',0.1,1,0.12+i*0.06)); break;
      case 'heal': [392,523,659,784].forEach((f,i)=>this.tone(f,0.3,'sine',0.12,1,i*0.06)); break;
      case 'drink': this.tone(400,0.15,'sine',0.12,1.8); this.tone(500,0.12,'sine',0.08,1.6,0.1); break;
      case 'levelup': [392,494,587,784,988].forEach((f,i)=>this.tone(f,0.35,'triangle',0.13,1,i*0.08)); break;
      case 'lore': [880,660,990].forEach((f,i)=>this.tone(f,0.6,'sine',0.07,1,i*0.15)); break;
      case 'equip': this.noise(0.06,0.15,2500); this.tone(500,0.06,'square',0.05); break;
      case 'bow': this.noise(0.12,0.12,2400); this.tone(700,0.1,'triangle',0.06,0.5); break;
      case 'magic': this.tone(600,0.2,'sine',0.1,2); break;
      case 'fire': this.noise(0.3,0.22,900); this.tone(300,0.25,'sawtooth',0.06,0.4); break;
      case 'frost': this.tone(1500,0.4,'sine',0.08,0.4); this.noise(0.35,0.12,5000); break;
      case 'zap': for(let i=0;i<4;i++) this.tone(800+Math.random()*900,0.06,'square',0.07,0.5,i*0.05); break;
      case 'blink': this.tone(300,0.25,'sine',0.1,4); break;
      case 'shield': this.tone(260,0.4,'triangle',0.1,1.5); break;
      case 'whirl': this.noise(0.3,0.2,1500,0,4); break;
      case 'charge': this.noise(0.25,0.25,700); this.tone(120,0.3,'sawtooth',0.1,0.5); break;
      case 'cry': this.tone(160,0.5,'sawtooth',0.14,1.4); this.tone(240,0.5,'sawtooth',0.1,1.3); break;
      case 'smoke': this.noise(0.6,0.15,600); break;
      case 'boom': this.noise(0.5,0.4,400); this.tone(60,0.5,'sine',0.25,0.4); break;
      case 'splash': this.noise(0.12,0.08,1800); break;
      case 'stone': this.noise(0.4,0.2,300); break;
      case 'anvil': this.tone(1800,0.4,'triangle',0.12,0.98); this.tone(2400,0.3,'triangle',0.06,0.98); this.noise(0.05,0.2,6000); break;
      case 'boss': this.tone(55,1.2,'sawtooth',0.2,0.8); this.tone(82,1.2,'sawtooth',0.12,0.8); this.noise(1,0.15,300); break;
      case 'bossdie': [196,165,131,98,65].forEach((f,i)=>this.tone(f,0.6,'sawtooth',0.14,0.7,i*0.15)); this.noise(1.2,0.3,500); break;
      case 'death': [330,262,196,131].forEach((f,i)=>this.tone(f,0.6,'triangle',0.15,0.9,i*0.25)); break;
      case 'click': this.tone(900,0.03,'square',0.04); break;
      case 'type': this.tone(500+Math.random()*80,0.02,'square',0.02); break;
    }
  },
  startMusic(){
    if(!this.ac || this.drone) return;
    const a=this.ac; const g=a.createGain(); g.gain.value=0.0; g.connect(this.master);
    g.gain.linearRampToValueAtTime(0.09,a.currentTime+4);
    const f=a.createBiquadFilter(); f.type='lowpass'; f.frequency.value=420; f.connect(g);
    const oscs=[55,82.4,110.2].map((fr,i)=>{ const o=a.createOscillator(); o.type=i?'sawtooth':'triangle'; o.frequency.value=fr; o.detune.value=(i-1)*7;
      const og=a.createGain(); og.gain.value=i?0.18:0.5; o.connect(og); og.connect(f); o.start(); return o; });
    const lfo=a.createOscillator(); lfo.frequency.value=0.07; const lg=a.createGain(); lg.gain.value=180; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    this.drone={g,oscs,lfo};
    const scale=[220,261.6,293.7,329.6,392,440,523.3];
    const bell=()=>{ if(!this.drone) return; if(this.on && this.music){ const fr=scale[Math.floor(Math.random()*scale.length)]*(Math.random()<0.3?0.5:1);
        const t=a.currentTime; const o=a.createOscillator(), og=a.createGain(); o.type='sine'; o.frequency.value=fr; og.gain.setValueAtTime(0.0,t); og.gain.linearRampToValueAtTime(0.05,t+0.05); og.gain.exponentialRampToValueAtTime(0.001,t+3.5);
        o.connect(og); og.connect(this.master); o.start(t); o.stop(t+3.6); }
      this.bellT=setTimeout(bell, 2500+Math.random()*5000); };
    bell();
  },
  stopMusic(){ if(!this.drone) return; const d=this.drone; d.g.gain.linearRampToValueAtTime(0,this.ac.currentTime+1); setTimeout(()=>{ d.oscs.forEach(o=>o.stop()); d.lfo.stop(); },1100); this.drone=null; clearTimeout(this.bellT); },
  toggle(){ this.on=!this.on; if(!this.on) this.stopMusic(); else if(this.music){ this.ensure(); this.startMusic(); } this.saveOpts(); },
  toggleMusic(){ this.music=!this.music; if(!this.music) this.stopMusic(); else if(this.on){ this.ensure(); this.startMusic(); } this.saveOpts(); }
};
