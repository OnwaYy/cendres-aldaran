// ============================================================
//  HISTOIRE — Les Cendres d'Aldaran
// ============================================================
const SPEAKERS = {
  narr:{name:'', spr:null},
  ysolde:{name:'Ysolde', title:'la Veilleuse', spr:'ysolde', color:'#9fe8f0'},
  brannoc:{name:'Brannoc', title:'forgeron', spr:'brannoc', color:'#f08a2c'},
  kaelith:{name:'Kaelith', title:'Porte-Cendre', spr:'kaelith', color:'#ff6a4a'},
  morvhal:{name:'Morvhal', title:'Gardien des Tombes', spr:'morvhal', color:'#f4efe6'},
  vexhra:{name:'Vexhra', title:'la Mère-Tisseuse', spr:'vexhra', color:'#c06af0'},
  orrimor:{name:'Orrimor', title:'le Roi Sylvestre', spr:'orrimor', color:'#7cc94a'},
  aldric:{name:'Aldric', title:'le Couronné de Givre', spr:'aldric', color:'#9fe8ff'},
  nhalzir:{name:"Nhal'Zir", title:"Dévoreur d'Étoiles", spr:'nhalzir', color:'#ff3bd0'},
  hero:{name:'@', spr:'@', color:'#f7d44a'}
};

const STORY = {};

STORY.intro = [
  ['narr',"Il fut un temps où Aldaran ne connaissait pas la nuit."],
  ['narr',"Sous la Citadelle brûlait la Flamme Primordiale. Tant qu'elle brûlait, le soleil se levait, les morts dormaient, et les étoiles restaient à leur place."],
  ['narr',"Puis, il y a cent ans, la Flamme s'est éteinte."],
  ['narr',"Le soleil ne s'est plus jamais levé. Les morts se sont relevés. Les rois sont devenus glace, les forêts sont devenues pierre."],
  ['narr',"Et dans une crypte oubliée, sous des tonnes de cendre, quelque chose s'est remis à battre."],
  ['ysolde',"…Réveille-toi. Doucement. Tes poumons ont oublié l'air, tes yeux ont oublié la lumière. C'est normal."],
  ['ysolde',"Je suis Ysolde, la dernière Veilleuse de la Flamme. Ou ce qu'il en reste. Ne cherche pas mon corps : il est poussière depuis longtemps."],
  ['ysolde',"Toi, tu es un Porte-Cendre. Regarde ta poitrine, cette lueur sous ta peau. C'est une braise de la Flamme Primordiale. La dernière."],
  ['hero',"…Je ne me souviens de rien."],
  ['ysolde',"Je sais. La mort efface, et tu es resté mort très longtemps. Les souvenirs reviendront. Ou pas. Ce qui compte, c'est la descente."],
  ['ysolde',"Tout en bas, sous les cryptes, sous les mines, sous la forêt et la citadelle, s'ouvre l'Abîme. C'est là que dort le Foyer. C'est là que tu dois porter ta braise pour rallumer la Flamme."],
  ['ysolde',"Le chemin est long, et tout ce qui vit encore là-dessous a faim de ta lumière. Prends cette arme. Et ne meurs pas trop vite."]
];

STORY.acts = [
 { num:'I', title:'Les Cryptes de Cendre', biome:'crypt', boss:'morvhal',
   floors:[
    {title:'Le Tombeau Sans Nom', arrival:[['ysolde',"Ces cryptes accueillaient les héros d'Aldaran. Aujourd'hui, les héros sont debout, et ils ont oublié qui ils étaient. Comme toi."]]},
    {title:"L'Ossuaire des Mille", arrival:[['narr',"Sur les murs, des milliers de noms gravés. Certains ont été effacés à coups de ciseau."],['ysolde',"Écoute… les os chuchotent. Ils sentent ta braise. Pour eux, tu es une fenêtre ouverte sur le monde d'avant."]]},
    {title:'La Chapelle des Veilleuses', arrival:[['ysolde',"Ma chapelle. C'est ici que nous choisissions les Porte-Cendres… Ne regarde pas les autels. Avance."],['hero',"Pourquoi ta voix tremble ?"],['ysolde',"Les fantômes ne tremblent pas. Avance."]]},
    {title:'La Salle du Gardien', boss:true, arrival:[['ysolde',"Au-delà de cette salle veille Morvhal. Il gardait les tombes de son vivant. La mort ne lui a pas donné de raison d'arrêter."]]}
   ],
   bossIntro:[['morvhal',"UN PORTE-CENDRE."],['morvhal',"Trois cents ans j'ai veillé. Aucun ne devait sortir. AUCUN."],['morvhal',"La Veilleuse t'a réveillé ? Alors elle n'a rien appris. Retourne dans ta tombe, braise. Je vais t'y aider."]],
   bossOutro:[['morvhal',"…Tu ne sais pas… ce qu'elle veut de toi…"],['morvhal',"Demande-lui… pourquoi tu dormais… dans une tombe… sans nom…"],['ysolde',"Il délire. Les morts disent beaucoup de choses. Viens : il y a un sanctuaire plus bas, un feu pour te reposer."]],
   camp:[['narr',"Une forge creusée dans la roche. Un feu de charbon. Et un nain, très vieux, très sale, et très surpris."],
     ['brannoc',"Par ma barbe ! Un vivant ! Un vrai, qui respire de travers et qui saigne partout !"],
     ['brannoc',"Brannoc, forgeron des Mines Englouties. Enfin, des mines, quand elles étaient pas englouties. J'ai fermé boutique y a cent ans, faute de clients pas morts."],
     ['brannoc',"T'as de l'or ? J'ai du matos. T'as du matos pourri ? Je le rends moins pourri. C'est ça, le commerce."],
     ['ysolde',"Brannoc est… un survivant. Il ne me voit pas. Les nains n'ont jamais cru aux fantômes."],
     ['brannoc',"À qui tu parles, gamin ? … Bon. Chacun ses folies. Les miennes sont en fer."]]
 },
 { num:'II', title:'Les Mines Englouties', biome:'mines', boss:'vexhra',
   floors:[
    {title:'Les Puits Noyés', arrival:[['ysolde',"Les nains ont creusé trop profond, trop vite. Quand la Flamme s'est éteinte, l'eau noire est montée. Et avec elle, ce qui vivait dessous."]]},
    {title:'La Galerie des Lanternes', npc:'kaelith1', arrival:[['narr',"Une odeur de cendre chaude. Quelqu'un d'autre est passé ici, récemment."],['ysolde',"…Impossible."]]},
    {title:'Les Forges Englouties', arrival:[['narr',"Des enclumes renversées. Des toiles épaisses comme des voiles. Et partout, des cocons de la taille d'un homme."],['ysolde',"Ici, les nains forgeaient les lames de la Garde. Ton ami Brannoc devait y travailler."]]},
    {title:'Le Nid de Vexhra', boss:true, arrival:[['ysolde',"La Mère-Tisseuse. Elle était déjà vieille quand les nains sont arrivés. Ils ont creusé dans son nid. Elle s'en souvient."]]}
   ],
   bossIntro:[['vexhra',"Petite chose chaude…"],['vexhra',"Tes semblables ont noyé mes enfants dans leur eau noire. Je vais t'envelopper doucement, et te garder au chaud. Longtemps. Longtemps…"]],
   bossOutro:[['vexhra',"La… Veilleuse… elle a fait la même promesse… à l'autre… celui d'avant…"],['hero',"Celui d'avant ?"],['ysolde',"Elle parle de l'ancien temps. Il y a toujours eu des Porte-Cendres. Viens."]],
   camp:[['brannoc',"T'as tué la Tisseuse ?! Elle a mangé mon apprenti en l'an… bah, y a longtemps. Je t'offre une bière. J'ai pas de bière. Je t'offre une réduc'."],
     ['brannoc',"Dis donc, j'ai croisé une rouquine avec la même lueur que toi dans le poitrail. Elle a payé en jurant. Elle jure bien."],
     ['ysolde',"La forêt, ensuite. Elle n'était pas pétrifiée, autrefois. Elle chantait."],
     ['hero',"Ysolde. Qui était le Porte-Cendre d'avant ?"],
     ['ysolde',"…Quelqu'un qui a eu peur. Dors. Tu en auras besoin."]]
 },
 { num:'III', title:'La Forêt Pétrifiée', biome:'forest', boss:'orrimor',
   floors:[
    {title:'La Lisière de Pierre', arrival:[['ysolde',"Une forêt sous la terre… les racines du monde, disait-on. Quand la Flamme s'est éteinte, la sève a gelé, puis les arbres sont devenus pierre. Les bêtes, elles, sont devenues autre chose."]]},
    {title:'Le Cercle des Dryades', arrival:[['narr',"Des statues de femmes aux bras-branches forment un cercle parfait. L'une d'elles a les yeux ouverts."],['ysolde',"Les dryades servaient le Roi Sylvestre. Elles le servent encore. Elles ne savent plus pourquoi."]]},
    {title:'La Clairière des Loups', npc:'kaelith2', arrival:[['narr',"Des hurlements. Puis le bruit d'une lame contre des crocs. Puis plus rien."]]},
    {title:'Le Trône de Racines', boss:true, arrival:[['ysolde',"Orrimor, le Roi Sylvestre. Il a tenté de nourrir la Flamme de sa propre sève quand elle faiblissait. Elle l'a pris tout entier, puis l'a recraché ainsi."]]}
   ],
   bossIntro:[['orrimor',"…Encore un…"],['orrimor',"La Veilleuse en envoie un à chaque siècle. Une braise qui marche. Un fagot qui parle."],['orrimor',"Je ne laisserai pas un autre bûcher s'allumer dans mes racines. Deviens pierre, petit fagot."]],
   bossOutro:[['orrimor',"Elle… ne t'a pas dit… La Flamme… ne brûle pas du bois…"],['orrimor',"Elle brûle… des Porte-Cendres…"],['hero',"Ysolde. Est-ce que c'est vrai ?"],['ysolde',"Plus bas. Je te dirai tout, plus bas. Je te le promets."]],
   camp:[['brannoc',"T'as une sale tête. Plus sale que d'habitude."],
     ['brannoc',"Écoute, gamin. Les nains ont un proverbe : « Si ton marteau te parle, arrête de boire. » Mais si ton fantôme te ment… change de fantôme."],
     ['hero',"Tu l'entends ?"],
     ['brannoc',"Non. Mais je te vois lui parler depuis trois étages. Et ta tête, quand elle te répond… c'est pas la tête de quelqu'un qui écoute une amie."],
     ['ysolde',"La Citadelle. Le cœur d'Aldaran. Là-bas, tout te sera rendu. Tes souvenirs aussi."]]
 },
 { num:'IV', title:'La Citadelle de Verre', biome:'citadel', boss:'aldric',
   floors:[
    {title:'Les Remparts de Verre', arrival:[['ysolde',"La Citadelle. Mes sœurs chantaient sur ces remparts à l'aube… La glace a tout figé au moment de la chute. Même la lumière."]]},
    {title:'La Salle des Miroirs', arrival:[['narr',"Dans chaque reflet, ton visage. Mais pas toujours le même âge, pas toujours le même regard."],['hero',"…Je me souviens d'ici. Je courais. Quelqu'un criait mon nom."],['ysolde',"Ne t'arrête pas devant les miroirs."]]},
    {title:'Le Pont des Inquisiteurs', npc:'kaelith3', arrival:[['narr',"Une silhouette attend au milieu du pont, lame plantée dans le verre. Cheveux roux. Braise au cœur."]]},
    {title:'La Salle du Trône Gelé', boss:true, arrival:[['ysolde',"Aldric. Mon roi. Quand la Flamme a faibli, il a voulu la nourrir avec toute sa cour. Le froid les a pris avant le feu."]]}
   ],
   bossIntro:[['aldric',"Qui ose… Ah. Toi."],['aldric',"Je te reconnais, Porte-Cendre. Tu as fui l'autel. Mon royaume est mort de ta peur."],['aldric',"J'ai offert ma cour, mes enfants, ma propre chaleur. Tout ce que tu as refusé de donner. Et ce n'était pas assez."],['aldric',"Viens. Que je prenne ce que tu nous dois."]],
   bossOutro:[['aldric',"Le froid… s'en va…"],['aldric',"Porte-Cendre… la Flamme n'est pas un soleil… c'est une serrure…"],['aldric',"Et ce qu'elle enferme… a faim…"],['ysolde',"Il est temps que tu saches. Repose-toi d'abord. Ensuite, l'Abîme."]],
   camp:[['ysolde',"Oui. Tu étais le Porte-Cendre d'il y a cent ans. Je t'ai choisi. Tu as refusé. Tu as couru."],
     ['ysolde',"La Flamme Primordiale ne réchauffe pas le monde par bonté. Elle tient fermé l'œil de Nhal'Zir, le Dévoreur d'Étoiles, qui dort sous Aldaran depuis l'aube des temps."],
     ['ysolde',"Chaque siècle, un Porte-Cendre se donne à la Flamme, et elle brûle cent ans de plus. C'est le prix du soleil."],
     ['ysolde',"Je ne t'ai pas menti. Je ne t'ai simplement… pas tout dit."],
     ['hero',"Tu m'as enfermé dans une tombe."],
     ['ysolde',"Je t'ai gardé en vie. À ma façon."],
     ['brannoc',"Je l'entends pas, ton fantôme. Mais je vois ta tête, gamin. Descends. Et fais ce que toi, tu trouves juste. Les nains disent… bah. Les nains disent rien d'utile. Bonne chance."]]
 },
 { num:'V', title:"L'Abîme", biome:'abyss', boss:'nhalzir',
   floors:[
    {title:'La Gorge du Monde', arrival:[['ysolde',"L'Abîme. Ici, la nuit a une texture. Respire lentement : l'air est fait de cendres d'étoiles."]]},
    {title:'Le Marché des Âmes', arrival:[['narr',"Des chaînes pendent du vide. À leurs extrémités, des lanternes. Dans chaque lanterne, un murmure."],['ysolde',"Ce sont les Porte-Cendres d'avant. Ce qu'il en reste quand la Flamme les relâche."]]},
    {title:'Le Seuil du Foyer', arrival:[['ysolde',"Le Foyer est juste là. Je sens sa chaleur… la tienne, bientôt."],['hero',"Et toi, Ysolde ? Que deviens-tu, quand ce sera fini ?"],['ysolde',"…Personne ne m'a jamais posé la question."]]},
    {title:'Le Foyer Éteint', boss:true, arrival:[['ysolde',"Il s'éveille. La Flamme éteinte ne le retient plus. Il faut l'affaiblir avant de rallumer quoi que ce soit."]]}
   ],
   bossIntro:[['nhalzir',"PETITE BRAISE."],['nhalzir',"J'AI MANGÉ MILLE SOLEILS AVANT QUE TON MONDE N'AIT UN NOM."],['nhalzir',"CHAQUE SIÈCLE, ON M'ENVOIE UNE ÉTINCELLE POUR ME FERMER LES YEUX. CHAQUE SIÈCLE, JE ME RÉVEILLE UN PEU PLUS."],['nhalzir',"CETTE FOIS, JE NE DORMIRAI PAS."]],
   bossOutro:null, camp:null
 }
];

// ---------------- Rencontres de Kaelith ----------------
STORY.npc = {
  kaelith1:(S)=>[
    ['kaelith',"Pas un pas de plus. … Une braise ? Toi aussi ?"],
    ['hero',"Qui es-tu ?"],
    ['kaelith',"Kaelith. Porte-Cendre de l'Inquisition. La seule, normalement. On m'a élevée pour ça depuis le berceau : descendre, rallumer la Flamme, sauver le monde. Tu vois le genre."],
    ['kaelith',"Et toi, tu sors d'où ? D'une tombe ? … Sérieusement ?"],
    ['ysolde',"Ne lui fais pas confiance. L'Inquisition a brûlé mes sœurs."],
    ['kaelith',"Je suis blessée. Rien de grave. Mais si tu as une potion… je ne la demanderai pas deux fois."],
    {choices:[
      {t:'Lui donner une potion de soin', req:'pot_hp', fx:{take:'pot_hp', trust:1, gold:60},
        then:[['kaelith',"…Merci. C'est rare, ici, quelqu'un qui donne sans compter. Tiens, cet or ne me sert à rien. Je m'en souviendrai, tombe-sur-pattes."]]},
      {t:'Garder tes potions', then:[['kaelith',"Prudent. Ou radin. On verra lequel des deux, en bas."]]},
      {t:'« Pars avant que je change d\'avis. »', then:[['kaelith',"Charmant. Un conseil, tombe-sur-pattes : les araignées d'en bas adorent les gens charmants."]]}
    ]}
  ],
  kaelith2:(S)=>[
    ['kaelith',"Ha… Tombe-sur-pattes. Tu tombes bien. Ou mal. Les loups m'ont eue à la jambe."],
    ['kaelith',"Écoute. Ma vieille préceptrice, à l'Inquisition, me racontait une histoire quand j'étais petite. Elle disait que la Flamme ne s'allume pas avec une braise."],
    ['kaelith',"Elle s'allume avec un Porte-Cendre. Tout entier."],
    ['ysolde',"Mensonges d'inquisiteurs !"],
    ['kaelith',"…Ton ombre a l'air nerveuse. Je ne la vois pas, mais je la sens. Bref. Tu m'aides, ou tu me laisses aux loups ?"],
    {choices:[
      {t:'Panser sa blessure (1 potion de soin)', req:'pot_hp', fx:{take:'pot_hp', trust:1},
        then:[['kaelith',"Deux fois que tu me tires d'affaire… Bon. Si on doit se battre un jour, toi et moi, je ne frapperai pas la première."]]},
      {t:'La laisser là', fx:{flag:'k_left'}, then:[['kaelith',"Bien sûr. On est des braises, pas des amis. … J'espère que tu sais ce que tu fais, tombe-sur-pattes."]]}
    ]}
  ],
  kaelith3:(S)=>{
    const t = S.flags.k_trust||0;
    if(t>=2) return [
      ['kaelith',"Tombe-sur-pattes. J'ai fouillé les archives de l'Inquisition. Tout est vrai."],
      ['kaelith',"Il y a cent ans, la Veilleuse a choisi un Porte-Cendre pour le sacrifice. Il a refusé. Il a fui. La Flamme s'est éteinte."],
      ['kaelith',"Ce Porte-Cendre, c'était toi."],
      ['ysolde',"…"],
      ['kaelith',"Elle t'a gardé dans une tombe sans nom, braise au chaud, en attendant que tu sois assez docile pour finir le travail. Et moi, on m'a élevée pour te remplacer si tu refusais encore."],
      ['kaelith',"Prends ma lame. Tu iras plus loin que moi. Et quand tu seras en bas… choisis toi-même. Pas elle. Pas l'Inquisition. Toi."],
      ['kaelith',"Je te retrouverai au Foyer. Promis."],
      {fx:{legend:'oath', flag:'k_ally'}}
    ];
    if(t===1) return [
      ['kaelith',"Tombe-sur-pattes. J'ai lu les archives. C'est toi, le lâche d'il y a cent ans. Celui à cause de qui le soleil est mort."],
      ['kaelith',"Une seule braise peut descendre jusqu'au Foyer. Donne-moi une bonne raison de ne pas te jeter de ce pont."],
      {choices:[
        {t:"« Je n'ai pas fui par lâcheté. J'ai entendu les voix dans le Foyer. »", fx:{flag:'k_ally'},
          then:[['kaelith',"…Les voix. Ma préceptrice en parlait aussi, avant qu'on la fasse taire."],['kaelith',"D'accord. Je te crois. À moitié. Descends. Je te retrouverai au Foyer."]]},
        {t:'Dégainer', fx:{fight:'kaelith_foe'}, then:[['kaelith',"Comme tu voudras."]]}
      ]}
    ];
    return [
      ['kaelith',"Tombe-sur-pattes. Tu m'as laissée aux loups."],
      ['kaelith',"J'ai lu les archives. C'est toi, le lâche d'il y a cent ans. Celui qui a refusé. Celui à cause de qui le soleil est mort."],
      ['kaelith',"Une seule braise peut descendre jusqu'au Foyer. Ce sera la mienne."],
      {fx:{fight:'kaelith_foe'}}
    ];
  },
  kaelithDefeat:[['kaelith',"…Pas mal… pour un mort…"],['kaelith',"Ne la laisse pas… choisir pour toi…"]]
};

// ---------------- Fin ----------------
STORY.finale = (S)=>[
  ['nhalzir',"…TU ME TIENS… POUR L'INSTANT…"],
  ['ysolde',"Maintenant. Le Foyer est devant toi. Pose ta main sur la pierre, et laisse ta braise devenir Flamme. Le soleil se lèvera demain matin. Pour cent ans."],
  ['nhalzir',"OU PRENDS-MOI. BOIS-MOI. TU SERAS LA NUIT, ET LA NUIT NE MEURT JAMAIS."],
  {choices:[
    {t:'Raviver la Flamme (te sacrifier)', fx:{ending:'flame'}},
    {t:'Embrasser la Nuit (dévorer le Dévoreur)', fx:{ending:'night'}},
    {t:'Briser le cycle', reqFn:(S)=>S.flags.k_ally && S.lore.length>=12,
      lockText:"Il te manque quelqu'un… et des souvenirs.", fx:{ending:'dawn'}}
  ]}
];

STORY.endings = {
  flame:{ title:'La Flamme Ravivée', lines:[
    ['narr',"Tu poses la main sur la pierre froide. La braise quitte ta poitrine comme un oiseau qui s'envole."],
    ['narr',"La Flamme Primordiale rugit. L'œil se referme. Très loin au-dessus, pour la première fois en cent ans, le ciel pâlit."],
    ['ysolde',"Merci. Pardon. Les deux à la fois."],
    ['narr',"Aldaran a eu son aube. Elle durera un siècle. Puis une Veilleuse ira chercher un autre Porte-Cendre, dans une autre tombe sans nom."]]},
  night:{ title:'Le Souverain de la Nuit', lines:[
    ['narr',"Tu tends la main vers l'œil. Il ne recule pas. Il t'attendait."],
    ['narr',"Le froid entre en toi, puis la faim, puis mille soleils morts qui chantent ensemble."],
    ['ysolde',"Non… non, pas toi, pas comme ça…"],
    ['narr',"Aldaran ne verra jamais l'aube. Mais les morts se recouchent et les monstres se taisent : la nuit a un roi, désormais, et il est le seul à avoir faim."]]},
  dawn:{ title:"L'Aube Libre", lines:[
    ['kaelith',"Pas si vite, tombe-sur-pattes. Je t'avais promis."],
    ['kaelith',"Une braise ne suffit pas : c'est ça, le piège. Chaque siècle une seule braise, et la Flamme ne tient que cent ans. Mais deux…"],
    ['narr',"Tu te souviens alors de tous les fragments, de toutes les voix des lanternes. Les Porte-Cendres d'avant ne voulaient pas être brûlés. Ils voulaient être libérés."],
    ['ysolde',"…Et il faut une Veilleuse pour ouvrir le Foyer de l'intérieur. Je l'ai toujours su. Je n'ai jamais eu le courage."],
    ['ysolde',"Cent ans de retard. Pardon, Porte-Cendre. Cette fois, c'est mon tour."],
    ['narr',"Trois lumières entrent dans le Foyer : une Veilleuse, et deux braises qui refusent de s'éteindre. L'œil de Nhal'Zir ne se ferme pas : il brûle, se consume, et devient soleil."],
    ['narr',"Le matin se lève sur Aldaran. Un vrai matin. Sans prix. Sans fin."]]}
};

// ---------------- Fragments de lore (1 par étage) ----------------
STORY.lore = [
  {t:'Épitaphe effacée', x:"« Ci-gît ███████, Porte-Cendre de l'an 812. Il a vu la Flamme et il a couru. Que son nom soit oublié comme il a oublié son devoir. »\n\nLe nom a été gratté avec rage. Quelqu'un est revenu, plusieurs fois, pour s'assurer qu'il ne se lise plus."},
  {t:'Registre des Veilleuses', x:"Chaque siècle, la Veilleuse choisit. Chaque siècle, l'élu marche vers le Foyer en chantant. Ainsi le veut le Pacte de l'Aube.\n\nEn marge, d'une écriture plus fine : « Ils ne chantent pas. Ils hurlent. Nous chantons plus fort pour ne pas entendre. »"},
  {t:'Prière à la Flamme', x:"« Flamme qui nous gardes, mange notre peur.\nFlamme qui nous gardes, ne nous mange pas. »\n\nPrière d'enfant, gravée maladroitement sur un banc de la chapelle."},
  {t:'Mémoire : la tombe', x:"Un souvenir revient : des mains froides qui referment un couvercle de pierre. Une voix douce, brisée :\n\n« Dors. Tu seras plus courageux à ton réveil. »"},
  {t:"Journal d'un mineur", x:"Jour 3 après l'Extinction. L'eau monte. Les lampes ne tiennent pas. Brannoc refuse de quitter sa forge, il dit que le fer, lui, ne trahit personne.\n\nLes araignées chantent dans les puits. Je ne savais pas que les araignées chantaient."},
  {t:"Ordre de l'Inquisition", x:"« Si l'élu de la Veilleuse refuse le Pacte, une braise de réserve sera élevée dans nos murs. Elle ne connaîtra que son devoir. Elle ne posera pas de questions. »\n\nQuelqu'un a ajouté au charbon : « Raté. »"},
  {t:'Gravure naine', x:"Les nains ne creusent jamais vers le bas sans laisser un chemin vers le haut.\n\nIci, quelqu'un a creusé un chemin vers le bas… et l'a rebouché derrière lui."},
  {t:'Mémoire : la fuite', x:"Un souvenir : courir dans les couloirs de la Citadelle. Derrière, des chants. Devant, une porte. Dans ta poitrine, la braise qui supplie de rester.\n\nTu n'as pas ralenti."},
  {t:'Chant des dryades', x:"« Le Roi a donné sa sève.\nLa sève a donné ses feuilles.\nLes feuilles ont donné leur chant.\nIl ne reste plus rien à donner. »"},
  {t:'Carnet de chasse', x:"Les loups cendrés ne chassent pas pour manger. Ils chassent ce qui brille.\n\nCache ta braise. Ou cours plus vite qu'eux."},
  {t:'Racine gravée', x:"Gravé dans la pierre-bois, d'une main tremblante :\n\n« La Flamme ne veut pas notre bois. Elle veut nos noms. »\n— O."},
  {t:'Mémoire : la Veilleuse', x:"Un souvenir : Ysolde, vivante, jeune, qui pleure dans la chapelle.\n« Je ne peux pas te choisir. Pas toi. »\n\nLe lendemain, elle t'a choisi quand même."},
  {t:'Décret royal', x:"« Par ordre d'Aldric, toute la cour se rendra au Foyer à l'aube. Nous donnerons ce que le lâche a refusé. Que la Flamme nous prenne tous, s'il le faut. »\n\nLe sceau royal est fendu par le gel."},
  {t:'Lettre jamais envoyée', x:"Mon amour,\nsi tu lis ceci, la Flamme n'a pas voulu de nous. Le froid vient de la salle du trône. Je t'écris avec la dernière encre qui ne gèle pas.\n\nNe descends jamais. Promets-le."},
  {t:"Archives de l'Inquisition", x:"« Sujet K. — braise de réserve. Docile. Obstinée. Pose trop de questions sur le Pacte.\nRecommandation : ne jamais lui dire ce qu'il y a dans le Foyer. »"},
  {t:'Mémoire : le Pacte', x:"Le souvenir complet, enfin. Tu n'as pas fui par peur de mourir.\n\nTu as fui parce que, la main sur la pierre du Foyer, tu as entendu toutes les voix des Porte-Cendres d'avant. Elles ne chantaient pas. Elles demandaient qu'on les libère."},
  {t:"Lanterne d'âme", x:"Une voix, dans la lanterne :\n\n« Une braise seule ferme l'œil. Deux braises et une gardienne pourraient le brûler. Personne n'a jamais essayé. Personne n'a jamais été deux. »"},
  {t:"Graffiti d'étoile", x:"Les étoiles qu'il a mangées n'ont pas disparu. Elles sont en lui.\n\nElles attendent qu'on leur ouvre la porte."},
  {t:'Dernier mot de Veilleuse', x:"« À celle qui viendra après moi : le Pacte est un mensonge que nous nous racontons pour ne pas avoir à être braves.\nJ'ai manqué de courage. Ne m'imite pas. »\n— Ysolde, an 812"},
  {t:'Mémoire : le nom', x:"Ton nom te revient. Tu le prononces à voix basse.\n\nPour la première fois depuis cent ans, il est à toi."}
];

STORY.tips = [
  "Astuce : les attaques télégraphiées des boss s'affichent en rouge. Sors de la zone !",
  "Astuce : X explore automatiquement, R te repose jusqu'à être soigné.",
  "Astuce : les fontaines soignent complètement, les sanctuaires donnent des bénédictions.",
  "Astuce : Brannoc améliore ton équipement entre les actes (+1 à +5).",
  "Astuce : les monstres « Élite » brillent, frappent fort, et lâchent du meilleur butin.",
  "Astuce : lis les fragments sur les pupitres. Ils comptent pour la fin…"
];
