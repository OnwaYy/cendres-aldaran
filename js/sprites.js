// ============================================================
//  SPRITES — pixel art défini en code + textures procédurales
// ============================================================
const TILE = 16;

const PAL = {
  k:'#0b0a0f', K:'#1d1a24', w:'#f4efe6', W:'#c9c1b0', g:'#8a8796', G:'#55525f',
  s:'#e8b796', S:'#b97e5f', r:'#d8393c', R:'#8e1f2a', o:'#f08a2c', y:'#f7d44a',
  Y:'#b8902a', b:'#4a8fe0', B:'#24467a', c:'#7fe6f2', C:'#3aa0b8', v:'#a35ee0',
  V:'#5a2d86', l:'#7cc94a', L:'#3c7a2c', n:'#8a5a36', N:'#4e3020', p:'#f28fc4',
  e:'#ff3b3b', E:'#ffe86a', m:'#b7c4d4', M:'#6b7a8f'
};

const SPR_SRC = {
// ---------- HÉROS ----------
knight:[
"................",
"......kkkk......",
".....kmmmmk.....",
"....kmmmmmmk....",
"....kMkkkkMk....",
"....kmmmmmmk.k..",
".....kMMMMk.kmk.",
"..kk.kRmmRk.kmk.",
".kRRkmmRRmmkkmk.",
".kRykmmRRmmk.kmk",
".kRRkMmmmmMkkyk.",
"..kk.kMMMMk..k..",
".....kmk.kmk....",
".....kMk.kMk....",
"....kNNk.kNNk...",
"....kkk...kkk..."],
rogue:[
"................",
"......kkkk......",
".....kLLLLk..k..",
"....kLLlLLLk.kn.",
"....kLkKKKkk.k.n",
"....kLKsksKk.k.n",
".....kKsssk..k.n",
"....kkLLLLkk.k.n",
"...kLLnLLLLLkkkn",
"...kLskLLLkskk.n",
"...kLkLLnLLk.k.n",
"....kkLLLLLk.k.n",
".....kNk.kNk.kn.",
".....kNk.kNk..k.",
"....kNNk.kNNk...",
"....kkk...kkk..."],
mage:[
".......kk.......",
"......kVvk....k.",
".....kVvvk...kck",
"....kVvvvvk..kck",
"...kkkkkkkkk.kk.",
"....kssssk...kn.",
"....kskskk...kn.",
"....kssssk...kn.",
"...kVVvvVVk.kn..",
"..kVvvyvvvVkksk.",
"..kVvvyvvvVk.n..",
"...kkvyvvvk..n..",
"...kVvvvvvVk.n..",
"..kVvvvvvvvVkn..",
"..kVVVVVVVVVkk..",
"...kkkkkkkkk...."],
// ---------- MONSTRES ----------
rat:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"......kkkkk.....",
"....kkGgggggk.k.",
"...kGgggggggkgk.",
"..kGgggggggggggk",
"k.kGggggggggkegk",
"kk.kGgggggggggpk",
".kk.kGGGGGGGGkk.",
"..kkkkpk.kpkk...",
"......kk..kk...."],
bat:[
"................",
"................",
"................",
"................",
"k..............k",
"kk....k..k....kk",
"kVk...kkkk...kVk",
"kVVk.kVVVVk.kVVk",
"kVVVkVeVVeVkVVVk",
".kVVVVVVVVVVVVk.",
"..kVVkVwwVkVVk..",
"...kk.kVVk.kk...",
".......kk.......",
"................",
"................",
"................"],
skeleton:[
"................",
"......kkkk......",
".....kwwwwk.....",
"....kwwwwwwk....",
"....kwkwwkwk....",
"....kwwwwwwk....",
".....kwkwkk..k..",
"......kkkk..kmk.",
"....kkwwwwk.kmk.",
"...kwkWwWkwkkmk.",
"...kwkwwwkwkkmk.",
"...kWkWwWkkwkyk.",
"....k.kwk..kkNk.",
".....kwkwk...k..",
".....kwk.kwk....",
"....kWWk.kWWk..."],
ghoul:[
"................",
"......kkkk......",
".....kllLlk.....",
"....kllllLLk....",
"....klekkelk....",
"....kllllllk....",
".....kLRRLk.....",
"...kkkLllLkkk...",
"..klkNNnnNNklk..",
"..klkNnnnnNklk..",
"..kLkNnNnnNkLk..",
"..kkkkNNNNkkkk..",
"....kllk.kllk...",
"....kLk...kLk...",
"...kLLk...kLLk..",
"...kkk.....kkk.."],
spectre:[
"................",
".....kkkkkk.....",
"....kwwwwwwk....",
"...kwwwwwwwck...",
"...kwkkwwkkck...",
"...kwkEwwkEck...",
"...kwwwwwwwck...",
"..kwwwwkkwwwck..",
"..kwwwwwwwwwck..",
".kcwwwwwwwwccck.",
".kcwwwwwwwwwcck.",
"..kcwwwwwwwwck..",
"..kccwcwwcwcck..",
"...kckckckckk...",
"....k.k.k.k.....",
"................"],
goblin:[
"................",
"................",
"..kk........kk..",
"..kLkkkkkkkkLk..",
"...kLllllllLk...",
"....kllllllk....",
"....klyklykk....",
"....kllllllk....",
".....klwwlk.....",
"...kkkNnnNkkk...",
"..klkNnnnnNklk..",
"..kLkNnYnnNkmk..",
"...kkNNNNNNkmk..",
"....kllk.kllkk..",
"....kLLk.kLLk...",
"....kkk...kkk..."],
spider:[
"................",
"................",
"................",
"................",
"..k..........k..",
"...k..kkkk..k...",
"k...kkVVVVkk...k",
".k.kVVVVVVVVk.k.",
"..kVVvVVVVvVVk..",
"kkkVVVVVVVVVVkkk",
"...kVeVeeVeVk...",
"..kkkVVVVVVkkk..",
".k..kkVVVVkk..k.",
"k..k..kkkk..k..k",
"..k..........k..",
"................"],
slime:[
"................",
"................",
"................",
"................",
"................",
"......kkkk......",
"....kkllllkk....",
"...klllwwlllk...",
"..kllllwlllllk..",
"..kllkllllkllk..",
".kllkkllllkkllk.",
".kllllllllllllk.",
".kLlllllllllLLk.",
".kLLLLLLLLLLLLk.",
"..kkkkkkkkkkkk..",
"................"],
wolf:[
"................",
"................",
"................",
"...........kk.k.",
"..........kgGkgk",
".........kgggggk",
"k........kgekggk",
"kgk......kgggggk",
".kgkkkkkkkgggkkk",
"..kgggggggggggk.",
"..kggggggggggGk.",
"..kGgggggggggGk.",
"...kGGkkkkkGGk..",
"...kgk.....kgk..",
"...kGk.....kGk..",
"...kk......kk..."],
shroom:[
"................",
"................",
".....kkkkkk.....",
"...kkrrwrrrkk...",
"..krrrrrrwrrrk..",
".krwrrrrrrrrwrk.",
".krrrrwrrrrrrrk.",
".kRRRRRRRRRRRRk.",
"..kkkkwwwwkkkk..",
".....kwkkwk.....",
".....kwwwwk.....",
"....kwkwwkwk....",
"....kwwwwwwk....",
".....kWwwWk.....",
"....kWk..kWk....",
"....kk....kk...."],
dryad:[
"................",
"...k..k..k..k...",
"..kLk.kLkkLk.k..",
"...kLkLLLLLkLk..",
"....kLLlLLLLk...",
"....kLnnnnLk....",
"....knenneNk....",
"....knnnnnnk....",
".....knRRnk.....",
"...kkLLnnLLkk...",
"..knkLlnnlLknk..",
"..knkLLnnLLknk..",
"...kkLLLLLLkk...",
"...kLLLnnLLLk...",
"..kLLLnnnnLLLk..",
"..kkkkkkkkkkkk.."],
hknight:[
"................",
"......kkkk......",
".....kMmmMk.....",
"....kMmmmmMk....",
"....kMkkkkMk....",
"....kMkekeMk....",
"....kMmmmmMk.k..",
"...kkkMMMMkkkmk.",
"..kMmkmmmmkMkmk.",
"..kmMkmMMmkmkmk.",
"..kMmkmmmmkMkmk.",
"...kkkMMMMkkkyk.",
"....kMk..kMk.k..",
"....kmk..kmk....",
"...kMMk..kMMk...",
"...kkk....kkk..."],
caster:[
"................",
"......kkkk....k.",
".....kBBBBk..kck",
"....kBBBBBBk.kck",
"....kBkkkkBk..k.",
"....kBkckckk..n.",
"....kBkkkkBk..n.",
"...kBBBBBBBBk.n.",
"..kBBbBBBBbBBkn.",
"..kBkbBBBBbkBkn.",
"...kkbBccBbkknk.",
"...kBbBBBBbBk.n.",
"..kBBbBBBBbBBkn.",
"..kBBBBBBBBBBk..",
"..kkkkkkkkkkkk..",
"................"],
gargoyle:[
"................",
"k..............k",
"kk....kkkk....kk",
"kGk..kggggk..kGk",
"kGGk.kgeegk.kGGk",
"kGGGkkggggkkGGGk",
".kGGGkgwwgkGGGk.",
"..kGGkggggkGGk..",
"...kkGggggGkk...",
"....kGggggGk....",
"....kGgGGgGk....",
"....kgGkkGgk....",
"....kgk..kgk....",
"...kGGk..kGGk...",
"...kkkk..kkkk...",
"................"],
imp:[
"................",
"....k......k....",
"...kRk....kRk...",
"...kRrkkkkrRk...",
"....krrrrrrk....",
"....kryrryrk....",
"....krrrrrrk....",
".....krwwrk.....",
"..k..kkrrkk..k..",
".kRk.krrrrk.kRk.",
".kRRkrrrrrrkRRk.",
"..kRkkrrrrkkRk..",
"...k.krrrrk.k...",
".....krkkrk..kk.",
"....kRk..kRkkrk.",
"....kk....kkkk.."],
horror:[
"................",
".....kkkkkk.....",
"...kkVVVVVVkk...",
"..kVVvvvvvvVVk..",
".kVvvkkkkkkvvVk.",
".kVvkwwwwwwkvVk.",
"kVvkwwwRRwwwkvVk",
"kVvkwwRkkRwwkvVk",
"kVvkwwRkkRwwkvVk",
"kVvkwwwRRwwwkvVk",
".kVvkwwwwwwkvVk.",
".kVvvkkkkkkvvVk.",
"..kVVvvvvvvVVk..",
"..kVkkVVVVkkVk..",
".kVk.kVkkVk.kVk.",
".kk..kk..kk..kk."],
// ---------- PNJ ----------
ysolde:[
"................",
"......kkkk......",
".....kwwwwk.....",
"....kwwccwwk....",
"....kwcsscwk....",
"....kwskkswk....",
"....kwsssswk....",
"....kwwsswwk....",
"...kwwwccwwwk...",
"..kwcwwccwwcwk..",
"..kwckwccwkcwk..",
"...kk.wccw.kk...",
"....kwwccwwk....",
"...kwwwccwwwk...",
"..kcwwwwwwwwck..",
"..kkkkkkkkkkkk.."],
brannoc:[
"................",
"................",
".....kkkkkk.....",
"....kMmmmmMk....",
"....kssssssk....",
"....kskssksk....",
"...kosssSssok...",
"...kooooooook...",
"..kskooooooksk..",
"..kskNooooNksk..",
"..kskNNooNNksk..",
"...kkNNNNNNkk...",
"....kNNNNNNk....",
"....kNNkkNNk....",
"...kGGk..kGGk...",
"...kkk....kkk..."],
kaelith:[
"................",
".....kkkkk......",
"....krrrrrk.....",
"...krrrrrrrk....",
"...krksssskk....",
"...krskssksk....",
"...krsssssk.....",
"...krrksSk......",
"....kkMMMMkk.k..",
"...kMkmMMmkMkmk.",
"...kskMmmMkskmk.",
"...kkkmMMmkk.mk.",
"....kRRRRRRk.yk.",
".....kMk.kMk.k..",
"....kNNk.kNNk...",
"....kkk...kkk..."],
// ---------- BOSS (24x24) ----------
morvhal:[
"........................",
".........y.y.y..........",
"........kyykyyk.........",
"........kYYYYYk.........",
".......kwwwwwwwk........",
"......kwwwwwwwwwk.......",
"......kwkkwwwkkwk.......",
"......kwkekwkekwk.......",
"......kwwwwkwwwwk.......",
".......kwkwkwkwk....kkk.",
"........kwwwwwk....kmmmk",
".....kkkkkwwwkkkkkkmk.k.",
"....kwwkVVVVVVVkwwkk....",
"...kwwkVVwWwWwVVkwwk....",
"...kwkkVVwwwwwVVkkwk....",
"...kwk.kVwWwWwVk.kwn....",
"...kWk.kVVwwwVVk.kwn....",
"...kwk.kVVVVVVVk..kn....",
"....k..kVVVVVVVVk.kn....",
"......kVVVVVVVVVVkkn....",
".....kVVVkwwkwwkVVkn....",
".....kVVk.kwk.kwkVkn....",
"......kk.kWWk.kWWkkn....",
".........kkk...kkk.k...."],
vexhra:[
"........................",
"....k..............k....",
".....k............k.....",
"..k...k..kkkkkk..k...k..",
"...k...kkVVVVVVkk...k...",
"....k.kVVVVVVVVVVk.k....",
".....kVVVvVVVVvVVVk.....",
"kkk.kVVVVVRRRRVVVVVk.kkk",
"...kVVVVVRVVVVRVVVVVk...",
"..kkVVVVVVRRRRVVVVVVkk..",
".k..kVVVVVVRRVVVVVVk..k.",
"k....kVVVVVVVVVVVVk....k",
".....kkVVVVVVVVVVkk.....",
"...kkk.kkVVVVVVkk.kkk...",
"..k...kVVkkkkkkVVk...k..",
".k...kVVeVVVVVVeVVk...k.",
"k...kVVVVeVVVVeVVVVk...k",
"...k.kVVVVVVVVVVVVk.k...",
"..k...kVVkwkkwkVVk...k..",
".k.....kkVwkkwVkk.....k.",
"k.......kkkkkkkk.......k",
"........................",
"........................",
"........................"],
orrimor:[
"..k..k............k..k..",
"..kn.kn..........nk.nk..",
"...knnk..........knnk...",
"....kNnk.kkkkkk.knNk....",
".....kNnkLLLLLLknNk.....",
"......kkLLlLLlLLkk......",
".....kLLLLLLLLLLLLk.....",
".....kLnnnnnnnnnnLk.....",
".....knNkknnnnkkNnk.....",
".....knNkEknnkEkNnk.....",
".....knnnnnnnnnnnnk.....",
"......knnNkkkkNnnk......",
"..kk..knnkRRRRknnk..kk..",
".kLLk.kknnkkkknnkk.kLLk.",
"kLlLLkknnnnnnnnnnkkLLlLk",
".kLLnnnnNnnnnnnNnnnnLLk.",
"..kknkknnnnNNnnnnkknkk..",
".....kknnnnnnnnnnkk.....",
"......knnNnnnnNnnk......",
"......knnnnkknnnnk......",
".....knnnNk..kNnnnk.....",
"....kNnnnk....knnnNk....",
"...kNNNNk......kNNNNk...",
"...kkkkk........kkkkk..."],
aldric:[
"........................",
"........y..y..y.........",
".......kykkykkyk........",
".......kcYYYYYck........",
"......kmmmmmmmmmk.......",
"......kmMMMMMMMmk.......",
"......kmkkkkkkkmk.......",
"......kmkckkkckmk.......",
"......kmmmmmmmmmk.......",
".......kMmmmmmMk....kk..",
"....kkkkkMMMMMkkkk.kcck.",
"...kBkmmkmmmmmkmmkkcck..",
"..kBBkmMkmcccmkMmkkck...",
"..kBBkmmkmcccmkmmk.kk...",
"..kBBkMmkmmmmmkmMk.kmk..",
"..kBBkkkkMMMMMkkkk.kmk..",
"..kBBBkmmmmmmmmmkk.kmk..",
"..kBBBkmMmmmmmMmk..kmk..",
"..kBBBBkmmmmmmmk...kyk..",
"...kBBBkMmkkkmMk...kNk..",
"...kBBkkmmk.kmmk....k...",
"....kk.kmmk.kmmk........",
".......kMMk.kMMk........",
".......kkkk.kkkk........"],
nhalzir:[
"........................",
"...k...kkkkkkkkkk...k...",
"..kVk.kVVVVVVVVVVk.kVk..",
"..kVkkVVvvvvvvvvVVkkVk..",
"...kVVvvvkkkkkkvvvVVk...",
"..kVVvvkkwwwwwwkkvvVVk..",
".kVVvvkwwwwwwwwwwkvvVVk.",
".kVvvkwwwwrrrrwwwwkvvVk.",
"kVVvkwwwwrRRRRrwwwwkvVVk",
"kVvvkwwwrRRkkRRrwwwkvvVk",
"kVvvkwwwrRkkkkRrwwwkvvVk",
"kVvvkwwwrRkkkkRrwwwkvvVk",
"kVvvkwwwrRRkkRRrwwwkvvVk",
"kVVvkwwwwrRRRRrwwwwkvVVk",
".kVvvkwwwwrrrrwwwwkvvVk.",
".kVVvvkwwwwwwwwwwkvvVVk.",
"..kVVvvkkwwwwwwkkvvVVk..",
"...kVVvvvkkkkkkvvvVVk...",
"..kVkVVVvvvvvvvvVVVkVk..",
".kVk.kVkVVkVVkVVkVk.kVk.",
".kVk.kVk.kVkkVk.kVk.kVk.",
"kVk..kVk..kVVk..kVk..kVk",
"kk...kk....kk....kk...kk",
"........................"],
// ---------- OBJETS (icônes) ----------
i_sword:[
"..............kk",
".............kmk",
"............kmmk",
"...........kmmk.",
"..........kmmk..",
".........kmmk...",
"........kmmk....",
".......kmmk.....",
"..kk..kmmk......",
"..kYkkmmk.......",
"...kYkmk........",
"....kYYk........",
"...kNkYYk.......",
"..kNk.kkYk......",
".kNk....kk......",
".kk............."],
i_axe:[
"................",
"......kkk.......",
".....kmmmk......",
"....kmmmmmkk....",
"...kmmmmmkNk....",
"...kmmmmkNk.....",
"...kMmmkNk......",
"....kMkNmk......",
".....kNkMmk.....",
"....kNk.kMk.....",
"...kNk...k......",
"..kNk...........",
".kNk............",
"kNk.............",
"kk..............",
"................"],
i_mace:[
"................",
"..........kkk...",
".........kmmmk..",
"........kmMmMmk.",
"........kmmmmmk.",
"........kMmMmMk.",
".........kmmmk..",
"........kNkkk...",
".......kNk......",
"......kNk.......",
".....kNk........",
"....kNk.........",
"...kYk..........",
"..kNk...........",
"..kk............",
"................"],
i_dagger:[
"................",
"................",
"...........kk...",
"..........kmk...",
".........kmmk...",
"........kmmk....",
".......kmmk.....",
"......kmmk......",
"....kkkmk.......",
"....kYYkk.......",
".....kNkYk......",
"....kNk.kk......",
"...kNk..........",
"...kk...........",
"................",
"................"],
i_bow:[
"................",
"..kkkk..........",
"..knnNkk........",
"..kk..kNk.......",
"..kw...kNk......",
"...kw...kNk.....",
"....kw...knk....",
".....kw...knk...",
"......kw..knk...",
".......kw..knk..",
"........kw.knk..",
".........kwkNk..",
"..........kNNk..",
"...........kk...",
"................",
"................"],
i_staff:[
".........kkk....",
"........kcckk...",
".......kcwcck...",
".......kcccck...",
"........kcck....",
".......kYkk.....",
"......kNk.......",
".....kNk........",
"....kNk.........",
"...kNk..........",
"..kNk...........",
".kNk............",
"kNk.............",
"kk..............",
"................",
"................"],
i_armor:[
"................",
"..kkk......kkk..",
".kmmmkkkkkkmmmk.",
".kmMmmmmmmmmMmk.",
".kmMmmmYYmmmMmk.",
".kkMmmmYYmmmMkk.",
"..kMmmmmmmmmMk..",
"..kmmMmmmmMmmk..",
"..kmmmMmmMmmmk..",
"..kmmmmMMmmmmk..",
"..kMmmmmmmmmMk..",
"..kMMMMMMMMMMk..",
"..kNYNNNNNNYNk..",
"...kkkkkkkkkk...",
"................",
"................"],
i_helm:[
"................",
"................",
".......kk.......",
"......kRRk......",
".....kkRRkk.....",
"....kmmmmmmk....",
"...kmmmmmmmmk...",
"...kmMmmmmmMk...",
"...kmkkkkkkmk...",
"...kmkKkkKkmk...",
"...kmmmkkmmmk...",
"...kMmmkkmmMk...",
"....kMmkkmMk....",
".....kkkkkk.....",
"................",
"................"],
i_boots:[
"................",
"................",
"....kkkk........",
"....knnk........",
"....knNk........",
"....knnk..kkkk..",
"....knNk..knnk..",
"....kYYk..knNk..",
"....knnk..knnk..",
"...knnnk..knNk..",
"..knnnNk..kYYk..",
".kNNNNNk..knnk..",
".kkkkkkk.knnnk..",
"........knnnNk..",
".......kNNNNNk..",
".......kkkkkkk.."],
i_ring:[
"................",
"................",
"......kkkk......",
".....kcwcck.....",
".....kcccck.....",
"......kcck......",
".....kkYYkk.....",
"....kYkkkkYk....",
"...kYk....kYk...",
"...kYk....kYk...",
"...kYk....kYk...",
"....kYkkkkYk....",
".....kYYYYk.....",
"......kkkk......",
"................",
"................"],
i_amulet:[
"................",
"..kk........kk..",
"..kYk......kYk..",
"...kYk....kYk...",
"....kYk..kYk....",
".....kYkkYk.....",
"......kYYk......",
".....kkYYkk.....",
"....krrrrrrk....",
"...krrwrrrrRk...",
"...krwrrrrrRk...",
"...krrrrrrRRk...",
"....kRrrrRRk....",
".....kRRRRk.....",
"......kkkk......",
"................"],
i_potion:[
"................",
"......kkkk......",
"......kNNk......",
".......kk.......",
"......kwwk......",
".....kw..wk.....",
"....kw....wk....",
"...kwrrrrrrwk...",
"...krrwrrrrrk...",
"...krwrrrrrRk...",
"...krrrrrrrRk...",
"...krrrrrrRRk...",
"....kRrrrRRk....",
".....kkkkkk.....",
"................",
"................"],
i_scroll:[
"................",
"................",
"..kkkkkkkkkkk...",
".kWwwwwwwwwwWk..",
".kWkkkkkkkkkWk..",
"..kwwwwwwwwwk...",
"..kwgggggggwk...",
"..kwwwwwwwwwk...",
"..kwgggggwwwk...",
"..kwwwwwwwwwk...",
"..kwggggggwwk...",
".kWkkkkkkkkkWk..",
".kWwwwwrwwwwWk..",
"..kkkkkRkkkkk...",
"................",
"................"],
i_bomb:[
"................",
"...........y....",
"..........yoy...",
"........kk.y....",
".......kNk......",
"......kkkk......",
"....kkGGGGkk....",
"...kGgGGGGGGk...",
"...kGgGGGGGGk...",
"..kGgGGGGGGGGk..",
"..kGGGGGGGGGGk..",
"..kGGGGGGGGGKk..",
"...kGGGGGGGKk...",
"...kKGGGGGKKk...",
"....kkkkkkkk....",
"................"],
i_gold:[
"................",
"................",
"................",
"................",
"................",
".......kkkk.....",
"......kyyyyk....",
"....kkkYyyYk....",
"...kyyyykkkk....",
"...kYyyYkyyyk...",
"..kkkkkkyyyyYk..",
".kyyyyk.kYyyYk..",
".kYyyYkkkkkkk...",
"kkkkkkyyyyk.....",
"kyyyyyYyyYk.....",
"kkkkkkkkkkk....."],
// ---------- DÉCOR ----------
chest:[
"................",
"................",
"................",
"...kkkkkkkkkk...",
"..knnnnnnnnnnk..",
".knNnnnnnnnnNnk.",
".kYYYYYYYYYYYYk.",
".knnnnnkknnnnnk.",
".kNNNNkyykNNNNk.",
".kYYYYkYYkYYYYk.",
".knnnnnkknnnnnk.",
".knNnnnnnnnnNnk.",
".knnnnnnnnnnnnk.",
".kYYYYYYYYYYYYk.",
".kkkkkkkkkkkkkk.",
"................"],
chest_open:[
"................",
"...kkkkkkkkkk...",
"..knnnnnnnnnnk..",
"..kNNNNNNNNNNk..",
".kYYYYYYYYYYYYk.",
".kKKKKKKKKKKKKk.",
".kKyKKyKKKyKKKk.",
".kYYYYYYYYYYYYk.",
".knnnnnnnnnnnnk.",
".kNNNNNNNNNNNNk.",
".kYYYYYYYYYYYYk.",
".knnnnnnnnnnnnk.",
".knNnnnnnnnnNnk.",
".kYYYYYYYYYYYYk.",
".kkkkkkkkkkkkkk.",
"................"],
fountain:[
"................",
".......kk.......",
"......kcck......",
".......kk.......",
"......kggk......",
"......kgGk......",
".....kggGGk.....",
"..kkkkkggkkkkk..",
".kgggggggggggGk.",
".kgccccccccccGk.",
".kgcbcccbcccbGk.",
".kGgggggggggGGk.",
"..kGGGGGGGGGGk..",
"...kGGGGGGGGk...",
"....kkkkkkkk....",
"................"],
shrine:[
"................",
".......kk.......",
"......kvvk......",
".....kvccvk.....",
"......kvvk......",
".......kk.......",
".....kggggk.....",
"....kgvggvgk....",
"....kgggggGk....",
"....kgvcgvGk....",
"....kgggggGk....",
"...kggggggGGk...",
"..kgggggggGGGk..",
"..kGGGGGGGGGGk..",
"..kkkkkkkkkkkk..",
"................"],
lectern:[
"................",
"................",
"...kkkkkkkkkk...",
"..kwwwwkkwwwwk..",
".kwgwgwkkwgwgwk.",
".kwwwwwkkwwwwwk.",
".kkkkkkkkkkkkkk.",
"......kNNk......",
"......knNk......",
"......knNk......",
"......knNk......",
"......knNk......",
".....knnNNk.....",
"....knnnNNNk....",
"....kkkkkkkk....",
"................"],
brazier:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"..kkkkkkkkkkkk..",
"..kMmmmmmmmmMk..",
"...kMMMMMMMMk...",
"....kkMMMMkk....",
"......kMMk......",
"......kmMk......",
".....kMmMMk.....",
"....kMMMMMMk....",
"....kkkkkkkk...."],
trap:[
"................",
"................",
"................",
"................",
"...k...k...k....",
"..kmk.kmk.kmk...",
"..kmk.kmk.kmk...",
"..kMk.kMk.kMk...",
".kGGGGGGGGGGGk..",
"................",
"......k...k.....",
".....kmk.kmk....",
".....kmk.kmk....",
".....kMk.kMk....",
"....kGGGGGGGk...",
"................"],
bones:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"..kk......kkk...",
".kwwk....kwwwk..",
"..kwWk..kwkwk...",
"...kWwkkkWWk....",
"....kkwwWk.kk...",
"...kwk.kkkkwk...",
"....k......k...."],
crystal:[
"................",
"................",
".........k......",
"........kck.....",
"...k...kcwck....",
"..kck..kcwck....",
"..kcwk.kccck.k..",
"..kcck.kcccCkck.",
"..kcCk.kcccCkcCk",
"...kCkkccCCkkCk.",
"....kCCkcCCkCk..",
"....kkkkkkkkkk..",
"................",
"................",
"................",
"................"],
mushdeco:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
".........kkk....",
"..kkk...kvvvk...",
".kvvvk.kvvwvvk..",
"kvwvvvkkkkkkk...",
"kkkkkkk..kwk....",
"...kwk...kwk....",
"...kwk...kwk....",
"................"],
banner:[
"....kkkkkkkk....",
"....kYYYYYYk....",
"....kRRRRRRk....",
"....kRRyyRRk....",
"....kRyRRyRk....",
"....kRRyyRRk....",
"....kRRRRRRk....",
"....kRRRRRRk....",
"....kRRkkRRk....",
"....kRk..kRk....",
"....kk....kk....",
"................",
"................",
"................",
"................",
"................"]
};

// Variantes de couleurs (palette swaps)
const SPR_VARIANTS = {
  skel_archer:['skeleton',{m:'#a0763a',y:'#5a3a1a'}],
  skel_royal:['skeleton',{w:'#eadcae',W:'#a8925a',m:'#f7d44a'}],
  ash_wolf:['wolf',{g:'#6d6670',G:'#3c3740',e:'#ff7a2a'}],
  deep_bat:['bat',{V:'#24405e',v:'#3d6a9a',e:'#7fe6f2'}],
  forest_spider:['spider',{V:'#33602a',v:'#6aa040',e:'#ffe86a'}],
  wood_wraith:['spectre',{w:'#bff2a8',c:'#5fae4f',E:'#ffe86a'}],
  shade:['spectre',{w:'#3a2a4a',c:'#6a3a8a',E:'#ff3bd0'}],
  inquisitor:['hknight',{M:'#7a1f2a',m:'#c9393c',e:'#ffe86a'}],
  dknight:['hknight',{M:'#2a1a2a',m:'#5a2a4a',e:'#ff3b3b'}],
  demon:['gargoyle',{G:'#6e1a1a',g:'#c0392b',e:'#ffe86a',w:'#f7d44a'}],
  gob_thrower:['goblin',{L:'#5a6a2c',l:'#9ab040',n:'#5a3a5a',N:'#3a2040'}],
  glass_mage:['caster',{B:'#3a8aa8',b:'#a0e8f0',c:'#ffffff'}],
  void_mage:['caster',{B:'#2a1a3a',b:'#6a3a8a',c:'#ff3bd0'}],
  mud_slime:['slime',{l:'#7a5a3a',L:'#4e3a26',w:'#a88a6a'}],
  miner:['ghoul',{l:'#a88a6a',L:'#6e5236',n:'#5a5a6a',N:'#3a3a4a'}],
  spore:['shroom',{r:'#6aa040',R:'#33602a',w:'#e8e0a0'}],
  spiderling:['spider',{V:'#7a3a9a',v:'#b06ad0'}],
  kaelith_foe:['kaelith',{e:'#ff3b3b'}],
  potion_mp:['i_potion',{r:'#4a8fe0',R:'#24467a'}],
  potion_elixir:['i_potion',{r:'#a35ee0',R:'#5a2d86'}],
  amulet_b:['i_amulet',{r:'#4a8fe0',R:'#24467a'}],
  ring_r:['i_ring',{c:'#ff6a6a',C:'#a02020'}]
};

const SPR = {};      // canvases
const SPR_FLASH = {}; // silhouettes blanches
const SPR_TINT = {};  // silhouettes colorées (auras)

function buildSprite(rows, over){
  const h = rows.length, w = rows[0].length;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  for(let j=0;j<h;j++) for(let i=0;i<w;i++){
    const ch = rows[j][i];
    if(ch==='.' ) continue;
    x.fillStyle = (over && over[ch]) || PAL[ch] || '#ff00ff';
    x.fillRect(i,j,1,1);
  }
  return c;
}
function silhouette(src, color){
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const x = c.getContext('2d');
  x.drawImage(src,0,0); x.globalCompositeOperation='source-in';
  x.fillStyle=color; x.fillRect(0,0,c.width,c.height);
  return c;
}
function tinted(name, color){
  const k = name+color;
  if(!SPR_TINT[k]) SPR_TINT[k] = silhouette(SPR[name], color);
  return SPR_TINT[k];
}

const ICON_URL = {};
function iconURL(name, size){
  const k = name+'@'+(size||48);
  if(ICON_URL[k]) return ICON_URL[k];
  const s = SPR[name]; if(!s) return '';
  const c = document.createElement('canvas'); const z = size||48; c.width=z; c.height=z;
  const x = c.getContext('2d'); x.imageSmoothingEnabled=false;
  const sc = Math.floor(z/Math.max(s.width,s.height));
  x.drawImage(s, (z-s.width*sc)/2, (z-s.height*sc)/2, s.width*sc, s.height*sc);
  return ICON_URL[k] = c.toDataURL();
}

// ---------- Génération procédurale des tuiles ----------
function mulberry(seed){
  return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed);
    t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
}
function hexToRgb(h){ const n=parseInt(h.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function shade(hex, f){ const [r,g,b]=hexToRgb(hex); const cl=v=>Math.max(0,Math.min(255,Math.round(v)));
  return `rgb(${cl(r*f)},${cl(g*f)},${cl(b*f)})`; }

const TILESETS = {};
function makeCanvas(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }

function genTileset(biomeId){
  if(TILESETS[biomeId]) return TILESETS[biomeId];
  const B = DATA.biomes[biomeId];
  const rnd = mulberry(biomeId.length*977+13);
  const set = {floor:[], wallTop:[], wallFace:[], water:[], lava:[]};
  const px=(x,c,i,j,col)=>{ x.fillStyle=col; x.fillRect(i,j,1,1); };

  // --- sols ---
  for(let v=0; v<5; v++){
    const c = makeCanvas(TILE,TILE), x = c.getContext('2d');
    const base = B.floor[v%B.floor.length];
    for(let j=0;j<16;j++) for(let i=0;i<16;i++){
      px(x,c,i,j, shade(base, 0.9+rnd()*0.2));
    }
    if(B.floorStyle==='flag'){
      x.fillStyle=shade(base,0.6);
      x.fillRect(0,0,16,1); x.fillRect(0,0,1,16);
      const sx = 4+Math.floor(rnd()*8); x.fillRect(sx,0,1,8);
      const sy = 6+Math.floor(rnd()*6); x.fillRect(0,sy,16,1);
      x.fillStyle=shade(base,1.18); x.fillRect(1,1,15,1); x.fillRect(1,sy+1,15,1);
      if(rnd()<0.5){ x.fillStyle=shade(base,0.55); let cx=2+Math.floor(rnd()*12), cy=2+Math.floor(rnd()*12);
        for(let k=0;k<5;k++){ x.fillRect(cx,cy,1,1); cx+=rnd()<0.5?1:0; cy+=1; } }
    } else if(B.floorStyle==='dirt'){
      for(let k=0;k<7;k++){ const i=Math.floor(rnd()*15), j=Math.floor(rnd()*15);
        x.fillStyle=shade(base,1.35); x.fillRect(i,j,2,1); x.fillStyle=shade(base,0.6); x.fillRect(i,j+1,2,1); }
    } else if(B.floorStyle==='moss'){
      for(let k=0;k<6;k++){ const i=Math.floor(rnd()*14), j=Math.floor(rnd()*14);
        x.fillStyle=rnd()<0.5?'#4f7a3a':'#3b5e2e'; x.fillRect(i,j,2+Math.floor(rnd()*2),1+Math.floor(rnd()*2)); }
      if(v%2===0){ x.fillStyle='#6aa040'; const i=Math.floor(rnd()*13)+1, j=Math.floor(rnd()*10)+4;
        x.fillRect(i,j,1,2); x.fillRect(i+1,j-1,1,3); x.fillRect(i+2,j,1,2); }
      x.fillStyle=shade(base,0.65); x.fillRect(0,0,16,1); x.fillRect(0,0,1,16);
    } else if(B.floorStyle==='marble'){
      for(let j=0;j<16;j++) for(let i=0;i<16;i++){
        const chk = ((i>>3)+(j>>3))%2===0;
        px(x,c,i,j, shade(chk?B.floor[0]:B.floor[1], 0.94+rnd()*0.1));
      }
      x.fillStyle='rgba(255,255,255,0.18)'; let cx=Math.floor(rnd()*16), cy=0;
      for(let k=0;k<16;k++){ x.fillRect(cx,cy,1,1); cx=(cx+(rnd()<0.5?1:-1)+16)%16; cy++; }
      x.fillStyle='rgba(0,0,0,0.35)'; x.fillRect(0,0,16,1); x.fillRect(0,0,1,16);
    } else if(B.floorStyle==='obsidian'){
      x.fillStyle='#ff5a1a'; let cx=Math.floor(rnd()*16), cy=Math.floor(rnd()*16);
      if(v<3) for(let k=0;k<9;k++){ x.globalAlpha=0.5+rnd()*0.5; x.fillRect(cx,cy,1,1);
        cx=(cx+(rnd()<0.5?1:0)+16)%16; cy=(cy+(rnd()<0.6?1:0))%16; }
      x.globalAlpha=1; x.fillStyle=shade(base,0.5); x.fillRect(0,0,16,1); x.fillRect(0,0,1,16);
    }
    set.floor.push(c);
  }
  // --- dessus des murs ---
  for(let v=0; v<3; v++){
    const c = makeCanvas(TILE,TILE), x = c.getContext('2d');
    for(let j=0;j<16;j++) for(let i=0;i<16;i++) px(x,c,i,j, shade(B.wallTop, 0.88+rnd()*0.22));
    x.fillStyle=shade(B.wallTop,1.25); x.fillRect(0,0,16,1);
    x.fillStyle=shade(B.wallTop,0.7); for(let k=0;k<3;k++) x.fillRect(Math.floor(rnd()*14),Math.floor(rnd()*14),2,1);
    set.wallTop.push(c);
  }
  // --- faces des murs ---
  for(let v=0; v<4; v++){
    const c = makeCanvas(TILE,TILE), x = c.getContext('2d');
    const f = B.wallFace;
    for(let j=0;j<16;j++) for(let i=0;i<16;i++) px(x,c,i,j, shade(f, 0.88+rnd()*0.2));
    if(B.wallStyle==='bricks'){
      x.fillStyle=shade(f,0.5);
      for(let row=0; row<4; row++){
        const y=row*4; x.fillRect(0,y,16,1);
        const off = row%2? 4:0;
        for(let bx=off; bx<16; bx+=8) x.fillRect(bx,y,1,4);
        x.fillStyle=shade(f,1.2); x.fillRect(0,y+1,16,1); x.fillStyle=shade(f,0.5);
      }
    } else if(B.wallStyle==='rock'){
      for(let k=0;k<7;k++){ const i=Math.floor(rnd()*13), j=Math.floor(rnd()*13), w=2+Math.floor(rnd()*3);
        x.fillStyle=shade(f,1.25); x.fillRect(i,j,w,1); x.fillStyle=shade(f,0.55); x.fillRect(i,j+2,w,1); }
      if(B.ore && rnd()<0.6){ x.fillStyle=B.ore; const i=2+Math.floor(rnd()*11), j=2+Math.floor(rnd()*11);
        x.fillRect(i,j,2,1); x.fillRect(i+1,j+1,1,1); }
    } else if(B.wallStyle==='bark'){
      for(let i=0;i<16;i+=3+Math.floor(rnd()*2)){ x.fillStyle=shade(f,0.55); x.fillRect(i,0,1,16);
        x.fillStyle=shade(f,1.2); x.fillRect(i+1,0,1,16); }
      x.fillStyle='#4f7a3a'; for(let k=0;k<4;k++) x.fillRect(Math.floor(rnd()*15),Math.floor(rnd()*6)+10,2,1);
    } else if(B.wallStyle==='glass'){
      x.fillStyle=shade(f,0.55); x.fillRect(0,0,1,16); x.fillRect(8,0,1,16); x.fillRect(0,8,16,1);
      x.fillStyle='rgba(255,255,255,0.45)'; for(let k=0;k<6;k++) x.fillRect(2+k,1+k,1,1);
      x.fillRect(10,9,1,1); x.fillRect(11,10,1,1); x.fillRect(12,11,1,1);
    } else if(B.wallStyle==='flesh'){
      for(let k=0;k<5;k++){ x.fillStyle=shade(f,0.55); const i=Math.floor(rnd()*14), j=Math.floor(rnd()*14);
        x.fillRect(i,j,3,2); x.fillStyle='#ff5a1a'; if(rnd()<0.35) x.fillRect(i+1,j,1,1); }
      x.fillStyle=shade(f,0.45); let cx=Math.floor(rnd()*16); for(let j=0;j<16;j++){ x.fillRect(cx,j,1,1); cx=(cx+(rnd()<0.5?1:-1)+16)%16; }
    }
    // ombre au pied du mur
    x.fillStyle='rgba(0,0,0,0.45)'; x.fillRect(0,15,16,1);
    x.fillStyle='rgba(0,0,0,0.2)'; x.fillRect(0,14,16,1);
    // arête supérieure (lien avec le dessus)
    x.fillStyle=shade(B.wallTop,1.1); x.fillRect(0,0,16,2);
    x.fillStyle=shade(B.wallTop,0.6); x.fillRect(0,2,16,1);
    set.wallFace.push(c);
  }
  // --- eau / lave (3 frames) ---
  for(let fr=0; fr<3; fr++){
    const c = makeCanvas(TILE,TILE), x=c.getContext('2d');
    x.fillStyle='#14304a'; x.fillRect(0,0,16,16);
    x.fillStyle='#1f4a6e'; for(let j=0;j<16;j+=4) x.fillRect(0,j+((fr+j/4)%2),16,2);
    x.fillStyle='rgba(160,220,255,0.55)'; for(let k=0;k<3;k++) x.fillRect((k*6+fr*2)%14, (k*5+fr)%15, 3,1);
    set.water.push(c);
    const l = makeCanvas(TILE,TILE), y=l.getContext('2d');
    y.fillStyle='#8e1f0a'; y.fillRect(0,0,16,16);
    y.fillStyle='#e0480f'; for(let j=0;j<16;j+=3) y.fillRect(((fr*3+j)%5)-2, j, 12, 2);
    y.fillStyle='#ffc23a'; for(let k=0;k<4;k++) y.fillRect((k*5+fr*3)%15, (k*4+fr*2)%15, 2,1);
    set.lava.push(l);
  }
  // --- porte ---
  const door = makeCanvas(TILE,TILE), dx=door.getContext('2d');
  dx.drawImage(set.wallFace[0],0,0);
  dx.fillStyle='#0b0a0f'; dx.fillRect(2,2,12,14);
  dx.fillStyle='#6e4626'; dx.fillRect(3,3,10,13);
  dx.fillStyle='#4e3020'; dx.fillRect(6,3,1,13); dx.fillRect(9,3,1,13);
  dx.fillStyle='#6b7a8f'; dx.fillRect(3,5,10,1); dx.fillRect(3,12,10,1);
  dx.fillStyle='#f7d44a'; dx.fillRect(11,9,1,1);
  set.door = door;
  const dop = makeCanvas(TILE,TILE), ox=dop.getContext('2d');
  ox.drawImage(set.floor[0],0,0);
  ox.fillStyle='#0b0a0f'; ox.fillRect(0,0,2,16); ox.fillRect(14,0,2,16);
  ox.fillStyle='#6e4626'; ox.fillRect(0,1,2,15);
  set.doorOpen = dop;
  // --- escalier ---
  const st = makeCanvas(TILE,TILE), sx=st.getContext('2d');
  sx.drawImage(set.floor[0],0,0);
  const steps=[ [1,2,14,'#6b6470'], [2,5,12,'#4a4452'], [3,8,10,'#2e2a36'], [4,11,8,'#18151e'] ];
  for(const [o,y,w,col] of steps){ sx.fillStyle='#0b0a0f'; sx.fillRect(o,y,w,4); sx.fillStyle=col; sx.fillRect(o+1,y+1,w-2,2); }
  sx.fillStyle='#000'; sx.fillRect(5,14,6,2);
  set.stairs = st;
  return TILESETS[biomeId] = set;
}

function initSprites(){
  for(const k in SPR_SRC) SPR[k] = buildSprite(SPR_SRC[k]);
  for(const k in SPR_VARIANTS){ const [b,o]=SPR_VARIANTS[k]; SPR[k]=buildSprite(SPR_SRC[b],o); }
  for(const k in SPR) SPR_FLASH[k] = silhouette(SPR[k], '#ffffff');
}
