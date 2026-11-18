// ============================================================
//  DONNÉES — biomes, classes, compétences, objets, monstres
// ============================================================
const DATA = {};

DATA.biomes = {
  crypt:  { name:'Cryptes de Cendre', floor:['#3a3436','#332e31','#3d3639'], floorStyle:'flag',
            wallTop:'#2a2433', wallFace:'#4a4256', wallStyle:'bricks', fog:'#07060b',
            ember:'#ff9a4a', deco:['bones','bones'], torch:'#ff9a4a', monsters:['rat','bat','skeleton','skel_archer','ghoul','spectre'] },
  mines:  { name:'Mines Englouties', floor:['#3b3026','#352a21','#40342a'], floorStyle:'dirt',
            wallTop:'#241c16', wallFace:'#5a4636', wallStyle:'rock', ore:'#7fe6f2', fog:'#06070a',
            ember:'#7fe6f2', deco:['crystal'], torch:'#ffb060', water:true, monsters:['goblin','gob_thrower','spider','mud_slime','deep_bat','miner'] },
  forest: { name:'Forêt Pétrifiée', floor:['#3a4236','#343c31','#3f473a'], floorStyle:'moss',
            wallTop:'#1e261c', wallFace:'#5c6656', wallStyle:'bark', fog:'#050806',
            ember:'#b8f07a', deco:['mushdeco','bones'], torch:'#d0ff9a', pillars:true, monsters:['ash_wolf','spore','dryad','forest_spider','wood_wraith'] },
  citadel:{ name:'Citadelle de Verre', floor:['#7d8aa0','#5a6680'], floorStyle:'marble',
            wallTop:'#22304a', wallFace:'#5a8ab0', wallStyle:'glass', fog:'#05070c',
            ember:'#bfefff', deco:['bones'], banners:true, torch:'#9fe8ff', pillars:true, monsters:['hknight','glass_mage','gargoyle','skel_royal','inquisitor'] },
  abyss:  { name:"L'Abîme", floor:['#1a1418','#161115','#1d161a'], floorStyle:'obsidian',
            wallTop:'#120a12', wallFace:'#3a1a2e', wallStyle:'flesh', fog:'#040205',
            ember:'#ff4a2a', deco:['bones'], torch:'#ff5a2a', lava:true, monsters:['imp','horror','shade','demon','dknight','void_mage'] }
};

// ---------------- CLASSES ----------------
DATA.classes = {
  knight:{ name:'Chevalier', title:'Le Rempart', spr:'knight', color:'#c9393c',
    desc:"Ancien serment de la Garde d'Aldaran. Encaisse les coups, protège, écrase. Idéal pour débuter.",
    base:{hp:62,mp:22,atk:6,def:3,crit:5,dodge:3}, grow:{hp:10,mp:2,atk:1.5,def:0.9,crit:0.1,dodge:0.1},
    mpRegen:0.4, startWeapon:'longsword', startArmor:'mail',
    skills:['k_strike','k_bastion','k_whirl','k_charge','k_cry','k_judg'] },
  rogue:{ name:'Rôdeuse', title:"L'Ombre", spr:'rogue', color:'#6aa040',
    desc:"Chasseuse des marges. Coups critiques, esquive, tirs à distance et poisons.",
    base:{hp:46,mp:26,atk:6,def:1,crit:12,dodge:10}, grow:{hp:7,mp:3,atk:1.7,def:0.5,crit:0.4,dodge:0.3},
    mpRegen:0.5, startWeapon:'shortbow', startArmor:'leather',
    skills:['r_shot','r_poison','r_shadow','r_rain','r_smoke','r_dance'] },
  mage:{ name:'Occultiste', title:'La Flamme Noire', spr:'mage', color:'#a35ee0',
    desc:"Lettré interdit. Fragile, mais ses sorts brûlent, gèlent et foudroient des salles entières.",
    base:{hp:38,mp:52,atk:7,def:0,crit:6,dodge:4}, grow:{hp:5,mp:6,atk:1.9,def:0.35,crit:0.15,dodge:0.15},
    mpRegen:1.1, startWeapon:'oakstaff', startArmor:'robe',
    skills:['m_fire','m_frost','m_blink','m_chain','m_shield','m_meteor'] }
};

// ---------------- COMPÉTENCES ----------------
// target: self | adj (ennemi adjacent) | enemy (ennemi visible à portée) | tile (case visible) | line
DATA.skills = {
  // Chevalier
  k_strike:{ name:'Frappe Brutale', icon:'slash', color:'#e05040', target:'adj', range:1, mp:4, cd:3, lvl:1,
    desc:r=>`Coup dévastateur : ${[0,180,220,270][r]}% de dégâts, étourdit 1 tour (rang 3).` },
  k_bastion:{ name:'Bastion', icon:'shield', color:'#b7c4d4', target:'self', mp:6, cd:9, lvl:1,
    desc:r=>`Lève le bouclier : -${[0,50,60,70][r]}% de dégâts subis pendant 4 tours.` },
  k_whirl:{ name:'Tourbillon', icon:'whirl', color:'#f0a040', target:'self', mp:8, cd:5, lvl:3,
    desc:r=>`Frappe tous les ennemis adjacents : ${[0,130,165,200][r]}%.` },
  k_charge:{ name:'Charge', icon:'arrow', color:'#f7d44a', target:'enemy', range:5, mp:8, cd:7, lvl:5,
    desc:r=>`Fonce sur un ennemi (portée 5), ${[0,120,150,180][r]}% et étourdit ${[0,1,2,2][r]} tour(s).` },
  k_cry:{ name:'Cri de Guerre', icon:'star', color:'#ff7a3a', target:'self', mp:10, cd:15, lvl:8,
    desc:r=>`+${[0,30,40,55][r]}% de Puissance pendant 6 tours et soigne ${[0,10,15,20][r]}% des PV.` },
  k_judg:{ name:'Jugement de Cendre', icon:'flame', color:'#ff5a1a', target:'self', mp:20, cd:18, lvl:12,
    desc:r=>`Explosion sacrée (rayon 2) : ${[0,250,320,400][r]}% et brûlure.` },
  // Rôdeuse
  r_shot:{ name:'Tir Perçant', icon:'arrow', color:'#9ad06a', target:'line', range:7, mp:4, cd:2, lvl:1,
    desc:r=>`Flèche qui traverse tous les ennemis en ligne : ${[0,140,175,210][r]}%.` },
  r_poison:{ name:'Lame Empoisonnée', icon:'drop', color:'#7cc94a', target:'adj', range:1, mp:5, cd:4, lvl:1,
    desc:r=>`${[0,110,130,150][r]}% + poison violent pendant 5 tours.` },
  r_shadow:{ name:"Pas de l'Ombre", icon:'eye', color:'#a35ee0', target:'enemy', range:6, mp:7, cd:6, lvl:3,
    desc:r=>`Se téléporte au contact d'un ennemi, frappe à ${[0,150,180,220][r]}% (critique garanti).` },
  r_rain:{ name:'Pluie de Flèches', icon:'rain', color:'#c0e080', target:'tile', range:7, radius:1, mp:10, cd:6, lvl:5,
    desc:r=>`Zone 3x3 à distance : ${[0,120,150,185][r]}% à chaque ennemi.` },
  r_smoke:{ name:'Fumigène', icon:'cloud', color:'#8a8796', target:'self', mp:10, cd:15, lvl:8,
    desc:r=>`Invisible ${[0,3,4,5][r]} tours ; la prochaine attaque inflige +100%.` },
  r_dance:{ name:'Danse des Lames', icon:'whirl', color:'#ff3bd0', target:'self', mp:20, cd:18, lvl:12,
    desc:r=>`Frappe deux fois chaque ennemi visible à 4 cases : ${[0,110,140,170][r]}% x2.` },
  // Occultiste
  m_fire:{ name:'Trait de Feu', icon:'flame', color:'#ff7a2a', target:'enemy', range:7, mp:5, cd:1, lvl:1,
    desc:r=>`Projectile : ${[0,160,200,245][r]}%, 35% de chance d'enflammer.` },
  m_frost:{ name:'Nova de Givre', icon:'snow', color:'#7fe6f2', target:'self', mp:8, cd:6, lvl:1,
    desc:r=>`Onde glaciale (rayon 2) : ${[0,90,115,140][r]}% et gèle ${[0,2,2,3][r]} tours.` },
  m_blink:{ name:'Clignement', icon:'eye', color:'#c99af0', target:'tile', range:6, mp:6, cd:6, lvl:3,
    desc:r=>`Téléportation sur une case visible (portée ${[0,6,7,8][r]}).` },
  m_chain:{ name:"Chaîne d'Éclairs", icon:'bolt', color:'#ffe86a', target:'enemy', range:7, mp:10, cd:4, lvl:5,
    desc:r=>`Éclair rebondissant sur ${[0,3,4,5][r]} cibles : ${[0,130,155,180][r]}%.` },
  m_shield:{ name:"Bouclier d'Arcane", icon:'shield', color:'#4a8fe0', target:'self', mp:12, cd:14, lvl:8,
    desc:r=>`Absorbe ${[0,3,4.5,6][r]}x ta Puissance de dégâts pendant 8 tours.` },
  m_meteor:{ name:'Météore', icon:'star', color:'#ff3b3b', target:'tile', range:8, radius:2, mp:25, cd:16, lvl:12,
    desc:r=>`Un astre s'écrase (rayon 2) : ${[0,300,380,470][r]}%.` }
};

// ---------------- OBJETS ----------------
DATA.slots = ['weapon','helm','armor','boots','ring','amulet'];
DATA.slotNames = {weapon:'Arme', helm:'Casque', armor:'Armure', boots:'Bottes', ring:'Anneau', amulet:'Amulette'};
DATA.rarities = [
  {name:'Commun', color:'#c8c2b8', aff:0, mult:1},
  {name:'Magique', color:'#5aa0ff', aff:1, mult:2},
  {name:'Rare', color:'#f7d44a', aff:2, mult:4},
  {name:'Épique', color:'#c06af0', aff:3, mult:8},
  {name:'Légendaire', color:'#ff8a2a', aff:3, mult:16}
];
DATA.statNames = { atk:'Puissance', def:'Défense', hp:'PV max', mp:'Mana max', crit:'Critique %', dodge:'Esquive %',
  ls:'Vol de vie %', regen:'Régén. PV/tour', mpr:'Régén. mana/tour', burn:'Brûlure %', poison:'Poison %',
  freeze:'Gel %', thorns:'Épines', xp:'XP %', gold:'Or %', light:'Rayon de lumière', dmg:'Dégâts %', cost:'Coût mana %' };

// base: stats à ilvl 1 ; scale: gain par niveau d'objet
DATA.bases = {
  // armes
  shortsword:{slot:'weapon', name:'Épée courte', spr:'i_sword', stats:{atk:4}, scale:{atk:1.15}},
  longsword:{slot:'weapon', name:'Épée longue', spr:'i_sword', stats:{atk:5}, scale:{atk:1.35}, min:3},
  axe:{slot:'weapon', name:'Hache de guerre', spr:'i_axe', stats:{atk:6, crit:-2}, scale:{atk:1.5}, min:4},
  mace:{slot:'weapon', name:'Masse d\'armes', spr:'i_mace', stats:{atk:5, def:1}, scale:{atk:1.3, def:0.2}, min:2},
  dagger:{slot:'weapon', name:'Dague', spr:'i_dagger', stats:{atk:3, crit:8}, scale:{atk:1.05}},
  shortbow:{slot:'weapon', name:'Arc court', spr:'i_bow', stats:{atk:3}, scale:{atk:1.05}, range:5},
  longbow:{slot:'weapon', name:'Arc long', spr:'i_bow', stats:{atk:4}, scale:{atk:1.25}, range:7, min:5},
  oakstaff:{slot:'weapon', name:'Bâton de chêne', spr:'i_staff', stats:{atk:4, mp:6}, scale:{atk:1.15, mp:1.5}, range:4},
  runestaff:{slot:'weapon', name:'Bâton runique', spr:'i_staff', stats:{atk:5, mp:10}, scale:{atk:1.35, mp:2}, range:5, min:6},
  // casques
  cap:{slot:'helm', name:'Coiffe de cuir', spr:'i_helm', stats:{def:1, hp:4}, scale:{def:0.35, hp:1.5}},
  helm:{slot:'helm', name:'Heaume', spr:'i_helm', stats:{def:2, hp:6}, scale:{def:0.5, hp:2}, min:4},
  // armures
  robe:{slot:'armor', name:'Robe de lettré', spr:'i_armor', stats:{def:1, mp:8}, scale:{def:0.4, mp:2}},
  leather:{slot:'armor', name:'Armure de cuir', spr:'i_armor', stats:{def:2, dodge:2}, scale:{def:0.6}},
  mail:{slot:'armor', name:'Cotte de mailles', spr:'i_armor', stats:{def:3, hp:6}, scale:{def:0.8, hp:2}},
  plate:{slot:'armor', name:'Harnois', spr:'i_armor', stats:{def:5, hp:10, dodge:-3}, scale:{def:1.1, hp:3}, min:6},
  // bottes
  boots:{slot:'boots', name:'Bottes de voyage', spr:'i_boots', stats:{def:1, dodge:2}, scale:{def:0.3}},
  greaves:{slot:'boots', name:'Grèves', spr:'i_boots', stats:{def:2, hp:4}, scale:{def:0.45, hp:1.5}, min:5},
  // bijoux
  ring:{slot:'ring', name:'Anneau', spr:'i_ring', stats:{}, scale:{}},
  amulet:{slot:'amulet', name:'Amulette', spr:'i_amulet', stats:{}, scale:{}}
};

// affixes : valeur = a + b*ilvl (arrondie)
DATA.affixes = [
  {stat:'atk', a:1, b:0.55, w:10},
  {stat:'def', a:1, b:0.45, w:9},
  {stat:'hp', a:5, b:3, w:10},
  {stat:'mp', a:4, b:2, w:6},
  {stat:'crit', a:2, b:0.2, w:6, cap:15},
  {stat:'dodge', a:2, b:0.15, w:5, cap:12},
  {stat:'ls', a:2, b:0.12, w:3, cap:8},
  {stat:'regen', a:0.3, b:0.05, w:3, dec:1},
  {stat:'mpr', a:0.2, b:0.04, w:3, dec:1},
  {stat:'burn', a:8, b:0.5, w:2, cap:25},
  {stat:'thorns', a:2, b:1, w:2},
  {stat:'xp', a:5, b:0.5, w:2, cap:20},
  {stat:'gold', a:10, b:1, w:2, cap:40}
];
DATA.rareNames = ['Croc-de-Cendre','Dernier-Soupir','Veille-Morte','Larme-de-Givre','Brise-Os','Cœur-Noir',
  'Aube-Rouge','Chant-Funèbre','Sombre-Écho','Tisse-Nuit','Ronce-de-Fer','Fièvre-Grise','Mord-Lune','Sang-de-Braise',
  'Glas-Lointain','Cendre-Vive','Voile-Pâle','Pas-de-Loup','Serre-Ardente','Murmure-Creux'];

DATA.legendaries = {
  dawnbreaker:{base:'longsword', name:'Brise-Aube', stats:{atk:6, burn:30, light:2}, lore:"Forgée dans le dernier rayon du dernier matin."},
  vexfang:{base:'dagger', name:'Croc de Vexhra', stats:{atk:4, crit:10, poison:35}, lore:"Le venin goutte encore de la lame."},
  frostheart:{base:'amulet', name:'Cœur de Givre', stats:{def:4, freeze:15, mp:20}, lore:"Il bat. Lentement. Très froid."},
  madcrown:{base:'helm', name:'Couronne du Roi Fou', stats:{dmg:20, hp:-15, crit:6}, lore:"Aldric l'a portée jusqu'au bout. Jusqu'au gel."},
  wanderer:{base:'boots', name:'Bottes du Vagabond', stats:{dodge:15, regen:1}, lore:"Elles connaissent le chemin mieux que toi."},
  emberring:{base:'ring', name:'Anneau de la Braise', stats:{regen:2, burn:10, hp:20}, lore:"Une étincelle de la Flamme, prisonnière d'un cercle d'or."},
  eclipse:{base:'longbow', name:"Arc de l'Éclipse", stats:{atk:6, crit:8}, pierce:true, lore:"Ses flèches ne s'arrêtent jamais vraiment."},
  aldaran:{base:'runestaff', name:"Sceptre d'Aldaran", stats:{atk:7, mp:30, cost:-30}, lore:"Le sceptre des premiers rois-mages."},
  aegis:{base:'plate', name:'Égide de Morvhal', stats:{def:8, thorns:25, hp:30}, lore:"Le gardien l'a portée trois cents ans sans dormir."},
  oath:{base:'longsword', name:'Serment de Kaelith', stats:{atk:8, ls:10, crit:5}, lore:"« Si je tombe, que ma lame continue. »"}
};

DATA.consumables = {
  pot_hp:{name:'Potion de soin', spr:'i_potion', desc:'Rend 40% des PV (+20).', price:25},
  pot_mp:{name:'Potion de mana', spr:'potion_mp', desc:'Rend 50% du mana.', price:22},
  elixir:{name:'Élixir de Braise', spr:'potion_elixir', desc:'Rend tous les PV et le mana.', price:90},
  sc_tele:{name:'Parchemin de fuite', spr:'i_scroll', desc:"Te téléporte au hasard sur l'étage.", price:40},
  sc_map:{name:'Parchemin de cartographie', spr:'i_scroll', desc:"Révèle la carte de l'étage.", price:50},
  bomb:{name:'Bombe de poix', spr:'i_bomb', desc:'Lancée (portée 6) : explose en zone 3x3.', price:35}
};

// ---------------- MONSTRES ----------------
// stats de base (niveau 1), multipliées selon le niveau
DATA.monsters = {
  rat:{name:'Rat des cryptes', spr:'rat', hp:7, atk:3, def:0, xp:3, spd:110},
  bat:{name:'Chauve-souris', spr:'bat', hp:6, atk:3, def:0, dodge:20, xp:3, spd:140, ai:'erratic'},
  skeleton:{name:'Squelette', spr:'skeleton', hp:13, atk:4, def:2, xp:6},
  skel_archer:{name:'Squelette archer', spr:'skel_archer', hp:10, atk:4, def:1, xp:7, ai:'ranged', range:5, proj:'#e8d8b0'},
  ghoul:{name:'Goule', spr:'ghoul', hp:19, atk:5, def:1, xp:8, spd:85, onHit:{poison:25}},
  spectre:{name:'Spectre', spr:'spectre', hp:13, atk:5, def:0, dodge:30, xp:9, ghost:true, onHit:{drain:true}},
  goblin:{name:'Gobelin', spr:'goblin', hp:15, atk:5, def:2, xp:7},
  gob_thrower:{name:'Gobelin lanceur', spr:'gob_thrower', hp:12, atk:5, def:1, xp:8, ai:'ranged', range:5, proj:'#9a7a5a'},
  spider:{name:'Araignée des puits', spr:'spider', hp:13, atk:5, def:1, xp:7, spd:125, onHit:{poison:30}},
  mud_slime:{name:'Limon de fond', spr:'mud_slime', hp:24, atk:4, def:3, xp:8, spd:75, split:true},
  deep_bat:{name:'Chiroptère abyssal', spr:'deep_bat', hp:9, atk:5, def:0, dodge:25, xp:6, spd:150, ai:'erratic'},
  miner:{name:'Mineur maudit', spr:'miner', hp:22, atk:6, def:3, xp:9, spd:90},
  ash_wolf:{name:'Loup cendré', spr:'ash_wolf', hp:18, atk:6, def:1, xp:8, spd:130, pack:true},
  spore:{name:'Champignon spore', spr:'spore', hp:18, atk:4, def:2, xp:8, spd:60, onHit:{poison:60}},
  dryad:{name:'Dryade corrompue', spr:'dryad', hp:16, atk:6, def:1, xp:11, ai:'caster', range:6, proj:'#7cc94a', heals:true},
  forest_spider:{name:'Tisseuse sylvestre', spr:'forest_spider', hp:15, atk:6, def:1, xp:8, spd:125, onHit:{poison:35}},
  wood_wraith:{name:'Spectre sylvain', spr:'wood_wraith', hp:15, atk:6, dodge:30, xp:10, ghost:true, onHit:{drain:true}},
  hknight:{name:'Chevalier creux', spr:'hknight', hp:30, atk:7, def:6, xp:13, spd:90},
  glass_mage:{name:'Mage de verre', spr:'glass_mage', hp:17, atk:7, def:2, xp:13, ai:'caster', range:6, proj:'#a0e8f0', onHit:{freeze:20}},
  gargoyle:{name:'Gargouille', spr:'gargoyle', hp:28, atk:8, def:8, xp:14, dormant:true},
  skel_royal:{name:'Garde royal squelette', spr:'skel_royal', hp:22, atk:7, def:4, xp:11},
  inquisitor:{name:'Inquisiteur', spr:'inquisitor', hp:26, atk:8, def:5, xp:14, spd:105, onHit:{burn:25}},
  imp:{name:'Diablotin', spr:'imp', hp:14, atk:7, def:1, xp:11, spd:135, ai:'ranged', range:5, proj:'#ff7a2a', onHit:{burn:30}},
  horror:{name:'Horreur oculaire', spr:'horror', hp:22, atk:8, def:2, xp:15, ai:'caster', range:6, proj:'#ff3bd0', onHit:{drain:true}},
  shade:{name:'Ombre', spr:'shade', hp:18, atk:8, dodge:35, xp:13, ghost:true, spd:115},
  demon:{name:'Démon de suie', spr:'demon', hp:32, atk:10, def:6, xp:18, onHit:{burn:30}},
  dknight:{name:'Chevalier damné', spr:'dknight', hp:34, atk:9, def:7, xp:17, spd:95},
  void_mage:{name:'Prêtre du Vide', spr:'void_mage', hp:20, atk:9, def:2, xp:16, ai:'caster', range:6, proj:'#a35ee0', heals:true},
  spiderling:{name:'Araignéeau', spr:'spiderling', hp:6, atk:4, def:0, xp:2, spd:130},
  slimelet:{name:'Petit limon', spr:'mud_slime', hp:8, atk:3, def:1, xp:2, spd:90, small:true}
};

// ---------------- BOSS ----------------
DATA.bosses = {
  morvhal:{ name:'Morvhal, Gardien des Tombes', spr:'morvhal', hp:150, atk:8, def:4, lvl:4, xp:120, spd:90, big:true,
    color:'#f4efe6', legend:'aegis',
    abilities:[ {type:'slam', cd:4, r:1, mult:1.6, name:'Faux de la Tombe'},
                {type:'target', cd:5, r:1, mult:1.3, name:'Os Éclatés', range:8},
                {type:'summon', at:0.6, mon:'skeleton', n:2, name:'Lève-toi, garde !'},
                {type:'summon', at:0.3, mon:'skel_archer', n:2, name:'Archers, en position !'} ] },
  vexhra:{ name:'Vexhra, la Mère-Tisseuse', spr:'vexhra', hp:270, atk:11, def:5, lvl:8, xp:260, spd:110, big:true,
    color:'#c06af0', legend:'vexfang', onHit:{poison:40},
    abilities:[ {type:'bolt', cd:4, effect:'root', mult:0.8, range:7, name:'Toile Gluante', proj:'#ffffff'},
                {type:'summon', cd:7, mon:'spiderling', n:3, name:'Ponte'},
                {type:'ring', cd:6, r1:2, r2:3, mult:1.4, name:'Fils Tranchants'} ] },
  orrimor:{ name:'Orrimor, le Roi Sylvestre Déchu', spr:'orrimor', hp:430, atk:15, def:9, lvl:12, xp:420, spd:80, big:true,
    color:'#7cc94a', legend:'wanderer',
    abilities:[ {type:'cross', cd:4, len:7, mult:1.5, name:'Racines Lances'},
                {type:'target', cd:5, r:1, mult:1.4, range:9, name:'Chute de Pétrification'},
                {type:'summon', cd:9, mon:'ash_wolf', n:2, name:'La Meute répond'},
                {type:'heal', at:0.4, pct:0.2, name:'Sève Ancienne'} ] },
  aldric:{ name:'Aldric, le Couronné de Givre', spr:'aldric', hp:600, atk:20, def:12, lvl:16, xp:650, spd:100, big:true,
    color:'#9fe8ff', legend:'madcrown', onHit:{freeze:12},
    abilities:[ {type:'slam', cd:5, r:2, mult:1.5, effect:'freeze', name:'Hiver Royal'},
                {type:'lines', cd:4, mult:1.4, name:'Lances de Givre'},
                {type:'summon', at:0.5, mon:'hknight', n:3, name:'Ma Garde, à moi !'},
                {type:'charge', cd:6, mult:1.6, name:'Charge du Roi'} ] },
  kaelith_foe:{ name:'Kaelith, la Porte-Cendre', spr:'kaelith_foe', hp:420, atk:18, def:9, lvl:15, xp:500, spd:115, big:false,
    color:'#ff6a4a', legend:'oath',
    abilities:[ {type:'charge', cd:4, mult:1.5, name:'Élan Ardent'},
                {type:'slam', cd:5, r:1, mult:1.7, effect:'burn', name:'Braise Tournoyante'} ] },
  nhalzir:{ name:"Nhal'Zir, Dévoreur d'Étoiles", spr:'nhalzir', hp:950, atk:26, def:12, lvl:20, xp:0, spd:100, big:true,
    color:'#ff3bd0', legend:null, stationary:true,
    abilities:[ {type:'lines', cd:3, mult:1.5, name:'Regard du Néant'},
                {type:'ring', cd:5, r1:1, r2:3, mult:1.6, name:'Pulsation'},
                {type:'target', cd:4, r:1, mult:1.5, range:12, name:'Chute d\'Étoile'},
                {type:'summon', cd:8, mon:'shade', n:2, name:'Les Ombres affamées'},
                {type:'dark', at:0.5, name:'Éclipse'},
                {type:'summon', at:0.25, mon:'demon', n:2, name:'Mes enfants…'} ] }
};
