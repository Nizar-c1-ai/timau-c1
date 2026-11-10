/* ===================== DATA ===================== */

// current squad: name, nr, line, positions, role
const SQUAD=[
 {n:'Baran Bakar',nr:1,l:'TOR',pos:'Tor',role:'Stammtorhüter, alle 10 Spiele gestartet'},
 {n:'Leo Ljekaj',nr:2,l:'ABW',pos:'IV rechts · RV',role:'Flexibel in der Viererkette'},
 {n:'Nizar Garrab',nr:4,l:'ABW',pos:'IV rechts/links',role:'Abwehrchef, Spielaufbau, mehrmals Captain'},
 {n:'Arvanit Dermaku',nr:6,l:'ABW',pos:'RV · IV rechts',role:'Technisch stark, erfahren, Captain gegen Oberdorf'},
 {n:'Anastacio Antonio Cuenda',nr:99,l:'ABW',pos:'IV links · LV',role:'Gross, stark in der Luft, bei Standards'},
 {n:'Marko Michael Anello',nr:5,l:'ABW',pos:'LV · IV links',role:'Linke Seite, defensiv und offensiv'},
 {n:'Edson Samba Mango Baldé',nr:77,l:'ABW',pos:'RV · LV · MF rechts',role:'Vielseitig auf beiden Seiten'},
 {n:'Hüseyin Seker',nr:17,l:'MF',pos:'Defensives Mittelfeld',role:'Sechser, Organisator, Captain'},
 {n:"André D'alessandro Altamirano Alvarez",short:'André',nr:7,l:'MF',pos:'ZM · DM',role:'Box-to-Box, torgefährlich aus der 2. Reihe'},
 {n:'Deniz Yarasir',nr:10,l:'MF',pos:'ZM links',role:'Dauerbrenner im Zentrum (7 Starts)'},
 {n:'Miran Kabakci',nr:62,l:'MF',pos:'ZM rechts · Flügel',role:'Kreativ, trifft auch als Joker'},
 {n:'Robert Faraone',nr:97,l:'ANG',pos:'Flügel rechts · Sturm',role:'Zwei Hattricks (Cup + Pratteln)'},
 {n:'Hüseyin Can Enhas',nr:11,l:'ANG',pos:'Flügel links · Sturm',role:'Bester Torschütze im Kader'},
 {n:'Lamik Tesfay',nr:8,l:'ROT',pos:'Mittelfeld',role:'Joker, 2 Tore als Einwechselspieler'},
 {n:'Timot Horvat',nr:23,l:'ROT',pos:'offen',role:'Rotation, Position mit Trainer klären'},
 {n:'Maximo Angelo Anello',nr:17,l:'ROT',pos:'offen',role:'Fast immer im Kader, Chance im Training holen'},
 {n:'Agan Ibraimi',nr:55,l:'ROT',pos:'offen',role:'Rotation'},
 {n:'Noé Achard',nr:22,l:'ROT',pos:'offen',role:'Im Kader gegen Möhlin, Rheinfelden und Pratteln'}
];

// position coords on vertical pitch (attack upwards)
const POS={
 'Tor':[50,93],'Verteidigung rechtsaussen':[85,72],'Innenverteidigung rechts':[64,76],'Innenverteidigung links':[36,76],'Verteidigung linksaussen':[15,72],
 'Mittelfeld defensiv':[50,63],'Mittelfeld defensiv rechts':[64,62],'Mittelfeld defensiv links':[36,62],'Mittelfeld':[50,47],
 'Mittelfeld rechtsinnen':[67,48],'Mittelfeld linksinnen':[33,48],'Mittelfeld rechtsaussen':[85,44],'Mittelfeld linksaussen':[15,44],'Mittelfeld links':[18,50],
 'Flügel rechts':[83,24],'Flügel':[83,24],'Sturmspitze rechts':[62,16],'Sturmspitze links':[38,16],'Hängende Spitze':[50,30],'Verteidigung rechts':[80,74],'Verteidigung links':[20,74],'Verteidigung mitte':[50,78],'Libero':[50,84],'Mittelfeld rechts':[82,50],'Flügel links':[17,24],'Mittelsturm':[50,15],'Sturmspitze':[50,15]
};
const PK={Tor:'Tor',RV:'Verteidigung rechtsaussen',IVR:'Innenverteidigung rechts',IVL:'Innenverteidigung links',LV:'Verteidigung linksaussen',DM:'Mittelfeld defensiv',DMR:'Mittelfeld defensiv rechts',DML:'Mittelfeld defensiv links',M:'Mittelfeld',MRI:'Mittelfeld rechtsinnen',MLI:'Mittelfeld linksinnen',MRA:'Mittelfeld rechtsaussen',MLA:'Mittelfeld linksaussen',ML:'Mittelfeld links',FR:'Flügel rechts',FL:'Flügel links',ST:'Mittelsturm'};
const ABBR={Tor:'TW',RV:'RV',IVR:'IV',IVL:'IV',LV:'LV',DM:'DM',DMR:'DM',DML:'DM',M:'ZM',MRI:'ZM',MLI:'ZM',MRA:'RM',MLA:'LM',ML:'LM',FR:'RF',FL:'LF',ST:'ST'};

// matches: k=M/C/T, h=home?(Timau), s=[timau,opp], ht=[t,o], L=lineup [nr,name,posKey,cap], B=bench, A=absent, E=events [min,side t/o,kind g/p/og/y,name,score(home:away)]
const M=[
 {id:1,k:'T',d:'2026-08-09',t:'11:00',o:'FC Amicitia Riehen a',h:false,s:[3,16],ht:[1,5],nr:'707309',pl:'Grendelmatte, Riehen',
  L:[[1,'Baran Bakar','Tor'],[5,'Marko Michael Anello','RV'],[6,'Arvanit Dermaku','IVR'],[77,'Nikoloz Metreveli','IVL'],[79,'Bljin Mustafi','LV'],[7,'Metehan Kagan','DM'],[21,'Robert Faraone','MRA'],[62,'Miran Kabakci','MRI'],[10,'Deniz Yarasir','MLI'],[25,'Furkan Tutumlu','MLA'],[11,'Hüseyin Can Enhas','ST',1]],
  B:['Maximo Angelo Anello','Alexander Michaele','Nayher Gebreyesus','Enver Yasar'],A:null,E:[],
  note:'Vorbereitungsspiel. Torschützen sind nicht im Spielbericht. 5 der 11 Starter spielen heute nicht mehr bei C1 a.'},
 {id:2,k:'C',d:'2026-08-12',t:'19:30',o:'FC Kaiseraugst',h:false,s:[5,8],ht:[2,5],nr:'510229',pl:'Im Liner, Kaiseraugst',
  L:[[1,'Baran Bakar','Tor'],[2,'Aras Inekci','RV'],[6,'Arvanit Dermaku','IVR'],[5,'Leo Ljekaj','IVL'],[25,'Furkan Tutumlu','LV'],[8,'Nayher Gebreyesus','DM'],[7,'Metehan Kagan','MRI',1],[10,'Deniz Yarasir','MLI'],[11,'Hüseyin Can Enhas','FR'],[17,'Alexander Michaele','FL'],[21,'Robert Faraone','ST']],
  B:['Nikoloz Metreveli','Miran Kabakci','Bertan Kaman','Abeel Ahmed Mirza'],A:null,
  E:[['5','o','g','Abdullah Yildiz Selim','1:0'],['10','o','g','Endrit Emini','2:0'],['11','t','y','Deniz Yarasir',''],['16','t','g','Furkan Tutumlu','2:1'],['21','o','g','Robin Menek','3:1'],['23','o','g','Robin Menek','4:1'],['31','o','g','Robin Menek','5:1'],['34','t','g','Robert Faraone','5:2'],['58','t','g','Robert Faraone','5:3'],['60','o','g','Ryan Garder','6:3'],['70','o','g','Eren Yazicioglu','7:3'],['79','o','g','Eren Yazicioglu','8:3'],['83','t','g','Hüseyin Can Enhas','8:4'],['86','t','g','Robert Faraone','8:5']],
  note:'Junioren C Cup, Runde 1. Robert mit Hattrick als Sturmspitze.'},
 {id:3,k:'M',d:'2026-08-19',t:'19:30',o:'FC Wallbach-Zeiningen',h:false,s:[0,7],ht:[0,3],nr:'144586',pl:'Unter Reben, Zeiningen',
  L:[[1,'Baran Bakar','Tor'],[2,'Aras Inekci','RV'],[6,'Arvanit Dermaku','IVR'],[8,'Marko Michael Anello','IVL'],[5,'Yavuz Selim Aytekin','LV'],[55,'Alexander Vornicel','DM'],[7,'Nayher Gebreyesus','MRI'],[10,'Deniz Yarasir','MLI',1],[4,'Nizar Garrab','FR'],[17,'Alexander Michaele','FL'],[11,'Hüseyin Can Enhas','ST']],
  B:['Nikoloz Metreveli','Miran Kabakci','Maximo Angelo Anello','Enver Yasar'],
  A:['Hassan Saleh','Robert Faraone','Leo Ljekaj','Deniz Khan Yangin','Furkan Tutumlu','Hüseyin Seker','Murat Savut'],
  E:[['17','o','g','Norik Dürr','1:0'],['27','o','g','Brajan Drwal','2:0'],['29','t','y','Baran Bakar',''],['39','o','g','Brajan Drwal','3:0'],['72','o','og','Eigentor','4:0'],['80','o','g','Elia Gian Reiniger','5:0'],['82','o','g','Elia Gian Reiniger','6:0'],['90+3','o','g','Mara Hasler','7:0']],
  note:'Erster Spieltag mit vielen Abwesenden. Nizar musste auf dem Flügel spielen.'},
 {id:4,k:'M',d:'2026-08-22',t:'13:00',o:'FC Oberdorf',h:true,s:[0,10],ht:[0,5],nr:'144590',pl:'Rankhof, Basel',
  L:[[1,'Baran Bakar','Tor'],[55,'Alexander Vornicel','RV'],[6,'Arvanit Dermaku','IVR',1],[5,'Yavuz Selim Aytekin','IVL'],[8,'Marko Michael Anello','LV'],[77,'Nikoloz Metreveli','DM'],[17,'Alexander Michaele','ML'],[62,'Miran Kabakci','MRI'],[10,'Deniz Yarasir','MLI'],[11,'Hüseyin Can Enhas','FR'],[9,'Murat Savut','ST']],
  B:['Aras Inekci','Furkan Tutumlu','Maximo Angelo Anello','Bljin Mustafi','Soheil Nazari'],A:['Enver Yasar','Nizar Garrab'],
  E:[['2','o','g','Emanuele Pompili','0:1'],['10','o','g','Silvio Apostolo','0:2'],['28','o','g','Leon Kohler','0:3'],['35','o','g','Leon Kohler','0:4'],['42','o','g','Emanuele Pompili','0:5'],['55','o','g','Levin Eberle','0:6'],['65','o','g','Silvio Apostolo','0:7'],['81','o','g','Silvio Apostolo','0:8'],['84','o','g','Timon David Hess','0:9'],['87','o','g','Silvio Apostolo','0:10']],
  note:'Seker, Robert, Leo und Anastacio standen nicht im Kader, Nizar fehlte. Fast die ganze Stammabwehr war weg.'},
 {id:5,k:'M',d:'2026-08-30',t:'13:00',o:'FC Möhlin-Riburg/ACLI b',h:false,s:[4,6],ht:[1,2],nr:'144595',pl:'Sportzentrum Steinli, Möhlin',
  L:[[1,'Baran Bakar','Tor'],[8,'Edson Samba Mango Baldé','RV'],[4,'Nizar Garrab','IVR',1],[99,'Anastacio Antonio Cuenda','IVL'],[11,'Hüseyin Seker','DM'],[6,'Lamik Tesfay','MRI'],[10,'Deniz Yarasir','MLI'],[17,'Alexander Michaele','MLA'],[7,'Miran Kabakci','FR'],[9,'Murat Savut','ST']],
  B:['Nikoloz Metreveli','Alexander Vornicel','Agan Ibraimi','Noé Achard'],
  A:['Maximo Angelo Anello','Marko Michael Anello','Furkan Tutumlu','Robert Faraone','Aras Inekci','Leo Ljekaj','Deniz Khan Yangin','Hüseyin Can Enhas','Arvanit Dermaku'],
  E:[['2','t','g','Murat Savut','0:1'],['3','o','g','Mateo Birk Lopez','1:1'],['41','o','g','Jamy Imbrogiano','2:1'],['46','o','og','Eigentor','3:1'],['47','t','g','Murat Savut','3:2'],['49','t','g','Alexander Michaele','3:3'],['70','o','g','Lion Kiesewetter','4:3'],['73','o','g','Mateo Birk Lopez','5:3'],['79','o','g','Florian Rexhepi','6:3'],['90+2','t','g','Anastacio Antonio Cuenda','6:4']],
  note:'Das Matchblatt listet nur 10 Starter. 9 Spieler fehlten. Bis zur 49. Minute stand es 3:3, dann kamen 3 Gegentore in 9 Minuten.'},
 {id:6,k:'M',d:'2026-09-06',t:'13:00',o:'BCO Alemannia Basel',h:true,s:[7,0],ht:[4,0],nr:'144597',pl:'Rankhof, Basel',
  L:[[1,'Baran Bakar','Tor'],[6,'Arvanit Dermaku','RV'],[4,'Nizar Garrab','IVR'],[99,'Anastacio Antonio Cuenda','IVL'],[5,'Marko Michael Anello','LV'],[17,'Hüseyin Seker','DM'],[77,'Edson Samba Mango Baldé','MRA'],[62,'Miran Kabakci','MRI',1],[10,'Deniz Yarasir','MLI'],[11,'Hüseyin Can Enhas','FL'],[9,'Murat Savut','ST']],
  B:['Deniz Khan Yangin','Lamik Tesfay','Maximo Angelo Anello','Leo Ljekaj'],A:[],
  E:[['12','t','g','Hüseyin Seker','1:0'],['26','t','g','Murat Savut','2:0'],['27','t','g','Murat Savut','3:0'],['32','t','g','Edson Samba Mango Baldé','4:0'],['46','t','og','Eigentor Alemannia','5:0'],['49','t','g','Hüseyin Can Enhas','6:0'],['90+1','t','g','Miran Kabakci','7:0']],
  note:'Die Stammabwehr steht zum ersten Mal: Arvanit, Nizar, Anastacio, Marko, Seker. Kein Gegentor.'},
 {id:7,k:'M',d:'2026-09-13',t:'13:00',o:'FC Rheinfelden 1909',h:false,s:[5,4],ht:[3,2],nr:'144604',pl:'Im Schiffacker, Rheinfelden',
  L:[[1,'Baran Bakar','Tor'],[6,'Arvanit Dermaku','RV'],[4,'Nizar Garrab','IVR'],[99,'Anastacio Antonio Cuenda','IVL'],[5,'Marko Michael Anello','LV'],[17,'Hüseyin Seker','DMR',1],[10,'Deniz Yarasir','DML'],[7,"André D'alessandro Altamirano Alvarez",'M'],[77,'Edson Samba Mango Baldé','MRA'],[21,'Robert Faraone','FL'],[9,'Murat Savut','ST']],
  B:['Noé Achard','Miran Kabakci','Lamik Tesfay','Hüseyin Can Enhas','Maximo Angelo Anello'],A:[],
  E:[['9','t','g','Hüseyin Seker','0:1'],['15','t','g','André','0:2'],['21','o','p','Pierran Mambueni (Penalty)','1:2'],['26','t','g','André','1:3'],['30','o','g','Pierran Mambueni','2:3'],['67','t','g','Hüseyin Can Enhas','2:4'],['78','o','p','Pierran Mambueni (Penalty)','3:4'],['82','t','g','Hüseyin Can Enhas','3:5'],['90+2','o','g','Pierran Mambueni','4:5']],
  note:'Enhas kommt von der Bank und trifft doppelt. 2 Penaltys gegen uns, ihr Captain Mambueni macht alle 4 Tore.'},
 {id:8,k:'M',d:'2026-10-11',t:'13:00',o:'AC Rossoneri',h:true,s:[14,3],ht:[10,3],nr:'144612',pl:'Rankhof, Basel',
  L:[[1,'Baran Bakar','Tor'],[6,'Arvanit Dermaku','RV'],[2,'Leo Ljekaj','IVR'],[4,'Nizar Garrab','IVL'],[77,'Edson Samba Mango Baldé','LV'],[10,'Hüseyin Seker','DM'],[62,'Miran Kabakci','MRI'],[7,"André D'alessandro Altamirano Alvarez",'MLI',1],[21,'Robert Faraone','FR'],[11,'Hüseyin Can Enhas','FL'],[9,'Murat Savut','ST']],
  B:['Alexander Vornicel','Timot Horvat','Anastacio Antonio Cuenda','Marko Michael Anello','Lamik Tesfay','Maximo Angelo Anello'],A:[],
  E:[['5','o','g','Alvaro Gasic','0:1'],['10','t','g','Miran Kabakci','1:1'],['12','t','g','Murat Savut','2:1'],['16','t','g','Murat Savut','3:1'],['18','t','g','Murat Savut','4:1'],['21','t','g','Arvanit Dermaku','5:1'],['24','o','g','Loris Michel','5:2'],['28','t','g','Murat Savut','6:2'],['31','t','g','Arvanit Dermaku','7:2'],['33','t','g','Murat Savut','8:2'],['35','t','g','Nizar Garrab','9:2'],['45','t','g','Murat Savut','10:2'],['45','o','g','Diego Lionel Fluri','10:3'],['47','t','g','Hüseyin Can Enhas','11:3'],['53','t','g','Marko Michael Anello','12:3'],['76','t','g','Lamik Tesfay','13:3'],['86','t','g','Lamik Tesfay','14:3']],
  note:'Höchster Saisonsieg. Murat mit 6 Toren, Arvanit trifft als RV doppelt, Lamik als Joker doppelt.'},
 {id:9,k:'M',d:'2026-10-24',t:'13:00',o:'FC Pratteln C2',h:true,s:[3,3],ht:[3,3],nr:'144619',pl:'Rankhof, Basel',
  L:[[1,'Baran Bakar','Tor'],[77,'Edson Samba Mango Baldé','RV'],[2,'Leo Ljekaj','IVR'],[4,'Nizar Garrab','IVL',1],[99,'Anastacio Antonio Cuenda','LV'],[7,"André D'alessandro Altamirano Alvarez",'DM'],[62,'Miran Kabakci','MRI'],[10,'Deniz Yarasir','MLI'],[97,'Robert Faraone','FR'],[11,'Hüseyin Can Enhas','FL'],[9,'Murat Savut','ST']],
  B:['Noé Achard','Marko Michael Anello','Alexander Vornicel','Timot Horvat','Arvanit Dermaku','Lamik Tesfay','Maximo Angelo Anello'],A:[],
  E:[['27','o','g','Luan Osmani','0:1'],['29','t','g','Robert Faraone','1:1'],['37','o','g','Luan Osmani','1:2'],['39','t','g','Robert Faraone','2:2'],['42','o','g','Luan Osmani','2:3'],['44','t','g','Robert Faraone','3:3']],
  note:'Hattrick-Duell: Robert gegen Luan Osmani. Alle 6 Tore fielen zwischen der 27. und 44. Minute, die 2. Halbzeit blieb torlos.'},
 {id:10,k:'M',d:'2026-10-31',t:'13:00',o:'FC Kaiseraugst',h:false,s:[4,4],ht:[1,1],nr:'144613',pl:'Im Liner, Kaiseraugst',
  L:[[1,'Baran Bakar','Tor'],[2,'Leo Ljekaj','RV'],[23,'Nizar Garrab','IVR'],[99,'Anastacio Antonio Cuenda','IVL'],[5,'Marko Michael Anello','LV'],[17,'Hüseyin Seker','DM',1],[7,"André D'alessandro Altamirano Alvarez",'MRI'],[10,'Deniz Yarasir','MLI'],[97,'Robert Faraone','FR'],[11,'Hüseyin Can Enhas','FL'],[9,'Murat Savut','ST']],
  B:['Arvanit Dermaku','Timot Horvat','Edson Samba Mango Baldé','Lamik Tesfay','Miran Kabakci','Maximo Angelo Anello','Agan Ibraimi'],A:[],
  E:[['7','t','g','Hüseyin Can Enhas','0:1'],['42','o','g','Burhan Azizi','1:1'],['47','t','g','Hüseyin Can Enhas','1:2'],['49','t','g','Nizar Garrab','1:3'],['61','o','g','Eren Yazicioglu','2:3'],['68','t','g','Miran Kabakci','2:4'],['70','o','g','Burhan Azizi','3:4'],['87','o','g','Aleksandar Jovic','4:4']],
  note:'Auswärts beim Tabellenführer 4:2 geführt (68.), dann noch 2 Gegentore. Miran trifft als Einwechselspieler.'}
];
const UP=[
 {d:'2026-11-14',t:'15:00',what:'Trainingsspiel',o:'FC Amicitia Riehen a',where:'Heimspiel (Spielnr. 714828)',tag:'blue'},
 {d:'2026-11-28',t:'15:00',what:'Trainingsspiel',o:'FC Telegraph BS 2',where:'Heimspiel (Spielnr. 714346)',tag:'blue'},
 {d:'2026-11-28',t:'18:00',what:'Hallenturnier (nicht bestätigt)',o:'FC Menzo Reinach',where:'Turnhalle Pfrundmatt, Reinach AG',tag:'amber'},
 {d:'2026-12-05',t:'',what:'Weihnachtsturnier (nicht bestätigt)',o:'FC Reinach BL',where:'Reinach BL',tag:'amber'}
];
const TABLE=[
 ['FC Kaiseraugst',8,6,1,1,'58:27',31,19],['FC Oberdorf',8,6,0,2,'58:17',41,18],['FC Wallbach-Zeiningen',8,6,0,2,'38:20',18,18],
 ['FC Möhlin-Riburg/ACLI b',8,4,1,3,'49:41',8,13],['FC Pratteln C2',8,4,1,3,'40:28',12,13],['AS Timau Basel a',8,3,2,3,'37:37',0,11],
 ['BCO Alemannia Basel',8,2,1,5,'24:48',-24,7],['AC Rossoneri',8,1,0,7,'22:84',-62,3],['FC Rheinfelden 1909',8,0,2,6,'27:51',-24,2]
];
// all group results home-away
const GR=[
 ['FC Oberdorf','FC Rheinfelden 1909',5,0],['FC Pratteln C2','AC Rossoneri',11,3],['FC Möhlin-Riburg/ACLI b','BCO Alemannia Basel',11,1],
 ['FC Wallbach-Zeiningen','AS Timau Basel a',7,0],['AS Timau Basel a','FC Oberdorf',0,10],['FC Rheinfelden 1909','FC Möhlin-Riburg/ACLI b',8,8],
 ['FC Kaiseraugst','FC Pratteln C2',8,1],['BCO Alemannia Basel','FC Rheinfelden 1909',3,3],['FC Wallbach-Zeiningen','FC Kaiseraugst',2,3],
 ['FC Möhlin-Riburg/ACLI b','AS Timau Basel a',6,4],['FC Oberdorf','AC Rossoneri',21,0],['AC Rossoneri','FC Wallbach-Zeiningen',1,8],
 ['AC Rossoneri','FC Möhlin-Riburg/ACLI b',3,9],['FC Pratteln C2','FC Wallbach-Zeiningen',2,4],['AS Timau Basel a','BCO Alemannia Basel',7,0],
 ['FC Kaiseraugst','FC Oberdorf',4,9],['BCO Alemannia Basel','AC Rossoneri',8,3],['FC Möhlin-Riburg/ACLI b','FC Kaiseraugst',4,11],
 ['FC Rheinfelden 1909','AS Timau Basel a',4,5],['FC Oberdorf','FC Pratteln C2',1,2],['FC Wallbach-Zeiningen','FC Oberdorf',5,4],
 ['AC Rossoneri','FC Rheinfelden 1909',9,3],['FC Pratteln C2','FC Möhlin-Riburg/ACLI b',7,3],['FC Kaiseraugst','BCO Alemannia Basel',10,1],
 ['BCO Alemannia Basel','FC Pratteln C2',6,5],['FC Möhlin-Riburg/ACLI b','FC Wallbach-Zeiningen',5,3],['FC Rheinfelden 1909','FC Kaiseraugst',6,8],
 ['AS Timau Basel a','AC Rossoneri',14,3],['FC Pratteln C2','FC Rheinfelden 1909',9,0],['FC Möhlin-Riburg/ACLI b','FC Oberdorf',3,4],
 ['AS Timau Basel a','FC Pratteln C2',3,3],['AC Rossoneri','FC Kaiseraugst',0,10],['BCO Alemannia Basel','FC Oberdorf',3,4],
 ['FC Rheinfelden 1909','FC Wallbach-Zeiningen',3,4],['FC Kaiseraugst','AS Timau Basel a',4,4],['FC Wallbach-Zeiningen','BCO Alemannia Basel',5,2]
];
const OPP={
 'FC Kaiseraugst':{th:5,coach:'Marcello Bonaduce',keys:['Robin Menek: 3 Tore gegen uns im Cup','Eren Yazicioglu: 3 Tore gegen uns (2 Cup, 1 Meisterschaft)','Burhan Azizi: 2 Tore am 31.10.','Endrit Emini (Captain, DM), Abdullah Yildiz Selim'],
  how:'Bester Angriff der Gruppe zusammen mit Oberdorf (58 Tore). Ein Spiel verloren, 4:9 gegen Oberdorf. Sie geben auch Tore her (27), 4 davon gegen uns.',
  plan:'Kompakt im 4-1-4-1, den Sechser Emini zustellen. Gegen sie haben wir 4 Tore gemacht, also mutig umschalten. Mit Führung ab der 60. Minute Ruhe reinbringen.'},
 'FC Oberdorf':{th:5,coach:'Nelson Cruz Oliveira Falletta',keys:['Silvio Apostolo (Captain, ZM): 4 Tore gegen uns','Emanuele Pompili: 2 Tore','Leon Kohler: 2 Tore','Sehr viele Spieler im Kader (10 Abwesende, trotzdem volle Bank)'],
  how:'Beste Abwehr der Gruppe (17 Gegentore) und +41 Tordifferenz. Aber auch schlagbar: 1:2 gegen Pratteln, 4:5 bei Wallbach.',
  plan:'Unser 0:10 war mit halber Mannschaft. Mit dem vollen Kern: tief und kompakt, Apostolo im Zentrum eng markieren, Konter über Robert und Enhas.'},
 'FC Wallbach-Zeiningen':{th:4,coach:'Daniel Musielinsky',keys:['Brajan Drwal (Sturmspitze): 2 Tore','Elia Gian Reiniger: 2 Tore','Mara Hasler (Captain, Flügel rechts), Norik Dürr'],
  how:'Effizient: 38:20 Tore, schlägt Oberdorf 5:4, verliert aber 3:5 in Möhlin und 2:3 gegen Kaiseraugst.',
  plan:'Unser 0:7 war ohne Seker, Robert, Leo und Murat. Die Flügel doppeln (Hasler, Dürr). Ab der 70. Minute nachlegen, da kamen 4 Tore.'},
 'FC Möhlin-Riburg/ACLI b':{th:3,coach:'Nico Birrer',keys:['Mateo Birk Lopez (Mittelsturm): 2 Tore','Lion Kiesewetter (Captain, Flügel)','Florian Rexhepi (IV), trifft bei Standards'],
  how:'Starker Angriff (49 Tore), wackelige Abwehr (41 Gegentore). Das a-Team spielt in der Promotion, der Verein ist breit aufgestellt.',
  plan:'Hier sind Tore möglich, 4 gegen sie trotz 9 Abwesenden. Die Abwehr muss bis zum Schluss konzentriert bleiben.'},
 'FC Pratteln C2':{th:3,coach:'Stefan Krljar',keys:['Luan Osmani (Sturmspitze): Hattrick gegen uns','Haris Frmic (Captain, Abwehrchef)','Wechseln sehr viel (7 Einwechselspieler)'],
  how:'Hat Oberdorf geschlagen (2:1). Torreich: 11:3 gegen Rossoneri, 9:0 gegen Rheinfelden. Hat aber 5:6 gegen Alemannia verloren.',
  plan:'Osmani mit zwei Spielern absichern. Gegen ihre vielen Wechsel helfen eigene Wechsel und Kondition.'},
 'BCO Alemannia Basel':{th:2,coach:'Dominik Ansmann',keys:['Tauhid Tahiri (Captain, IV)','Schlägt Pratteln 6:5'],
  how:'24:48 Tore. Kann gegen Teams auf Augenhöhe punkten, verliert aber hoch gegen die Spitze.',
  plan:'Wir haben 7:0 gewonnen. Früh pressen, geduldig bleiben und nicht nachlassen.'},
 'AC Rossoneri':{th:1,coach:'Beat Tschudin',keys:['Alvaro Gasic, Loris Michel (Sturm)','Spielen mit Libero','Schlagen Rheinfelden 9:3'],
  how:'84 Gegentore, aber vorne können sie treffen (3 gegen uns).',
  plan:'Pflichtsieg. Gute Gelegenheit, Rotationsspieler und neue Positionen zu testen.'},
 'FC Rheinfelden 1909':{th:2,coach:'Björn Bauer',keys:['Pierran Mambueni (Captain, Flügel): 4 Tore gegen uns, davon 2 Penaltys'],
  how:'Letzter, aber knapp an guten Teams dran: 6:8 gegen Kaiseraugst, 3:4 gegen Wallbach, 8:8 gegen Möhlin.',
  plan:'Mambueni nie 1-gegen-1 im Strafraum, keine Fouls. Gegen ihn gab es 2 Penaltys.'}
};


const yt=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);
const DR={
 solo:{intro:'<b>Allein trainieren:</b> Du brauchst nur einen Ball, ein paar Hütchen (oder Flaschen) und eine Wand. 15–25 Minuten, 2–3 Mal pro Woche.',items:[
  {t:'Ball Mastery Basics',f:'Ballkontrolle',d:'10 Min',lv:'Alle',s:['Toe Taps: 30 Sek','Sohle rollen links/rechts: 30 Sek','Innen–Aussen mit einem Fuss: 30 Sek pro Fuss','V-Pull und La Croqueta: je 30 Sek','3 Runden, immer schneller'],q:'ball mastery football drills u14'},
  {t:'Wandpässe 1 und 2 Kontakte',f:'Passen, erster Kontakt',d:'10 Min',lv:'Alle',s:['3–5 m vor eine Wand','50 Pässe direkt, links und rechts abwechseln','Dann annehmen mit dem hinteren Fuss, offen drehen, zurückpassen','Abstand vergrössern auf 8–10 m'],q:'wall passing drills football solo'},
  {t:'Slalom und Abschluss',f:'Dribbling, Abschluss',d:'12 Min',lv:'Mittel',s:['6 Hütchen im Abstand von 1 m','Durch dribbeln: nur innen, nur aussen, nur Sohle','Am Ende Schuss auf ein Tor oder Ziel','10 Durchgänge, die Zeit stoppen'],q:'cone dribbling drills football solo'},
  {t:'Erster Kontakt aus der Luft',f:'Annahme',d:'8 Min',lv:'Mittel',s:['Ball hochwerfen','Mit Spann, Oberschenkel oder Brust annehmen','Ball muss danach innerhalb von 1 m liegen','Mit dem schwachen Fuss wiederholen'],q:'first touch training alone football'},
  {t:'Jonglier-Leiter',f:'Ballgefühl',d:'8 Min',lv:'Alle',s:['Ziel: 10, dann 20, dann 50','Abwechselnd links und rechts','Profi-Level: Fuss–Oberschenkel–Kopf'],q:'juggling progression football'},
  {t:'Schnelligkeit 5-10-5',f:'Antritt, Wendigkeit',d:'10 Min',lv:'Alle',s:['3 Hütchen im Abstand von 5 m','5 m Sprint, Wende, 10 m Sprint, Wende, 5 m','6 Wiederholungen, 60 Sek Pause','Variante mit Ball'],q:'5-10-5 agility drill soccer'}]},
 duo:{intro:'<b>Zu zweit:</b> Ideal mit einem Teamkollegen vor oder nach der Schule. Immer beide Füsse benutzen.',items:[
  {t:'Pass and Move',f:'Passen, Bewegung',d:'10 Min',lv:'Alle',s:['Abstand 10 m, je 1 Hütchen','Pass spielen, danach seitlich ein neues Hütchen anlaufen','Annahme in Laufrichtung','Nach 2 Min auf direkte Pässe wechseln'],q:'pass and move drill 2 players football'},
  {t:'1 gegen 1 im Kanal',f:'Dribbling, Verteidigen',d:'12 Min',lv:'Mittel',s:['Feld 8×15 m, Ziel ist die gegnerische Linie','Angreifer: Tempo und Täuschung','Verteidiger: seitlich stehen, nicht reinspringen','6 Mal pro Rolle'],q:'1v1 channel drill football'},
  {t:'Doppelpass und Abschluss',f:'Kombination',d:'10 Min',lv:'Mittel',s:['Spieler A passt zu B','B legt direkt in den Lauf von A','A schliesst nach 1 Kontakt ab','Rollen tauschen, beide Seiten'],q:'one two passing finishing drill'},
  {t:'Torwart und Schütze',f:'Abschluss, Torwart',d:'15 Min',lv:'Alle',s:['Aus 11–16 m schiessen, flach und in die Ecken','10 Schüsse, dann tauschen','Variante: nach Dribbling schiessen','Baran: Fangen, Fausten, schnell abwerfen'],q:'goalkeeper and striker training 2 players'},
  {t:'Kopfball und Volley',f:'Technik in der Luft',d:'8 Min',lv:'Mittel',s:['Partner wirft aus 5 m zu','10 Kopfbälle (Augen offen, Stirn)','10 Volleys mit Innenseite','Gut für Anastacio, Nizar, Arvanit (Standards)'],q:'heading volley drill youth football'}]},
 trio:{intro:'<b>Zu dritt:</b> Dreiecke sind die Basis vom Kombinationsspiel, draussen und in der Halle.',items:[
  {t:'Passdreieck mit Wechsel',f:'Passen, Laufwege',d:'10 Min',lv:'Alle',s:['Dreieck mit 8 m Seitenlänge','Pass spielen, dem Ball nachlaufen','Nach 2 Min: 2 Kontakte, dann direkt','Offene Körperhaltung bei der Annahme'],q:'triangle passing drill football'},
  {t:'Dritter Mann (Y-Passing)',f:'Kombination',d:'12 Min',lv:'Mittel',s:['A spielt B an, B legt auf C ab','C spielt tief zu A, der startet','Genau so habt ihr gegen Rossoneri getroffen','Beide Richtungen'],q:'third man run passing drill'},
  {t:'2 gegen 1',f:'Überzahl ausspielen',d:'12 Min',lv:'Alle',s:['2 Angreifer gegen 1 Verteidiger auf ein Tor','Verteidiger binden, dann querlegen','Abschluss in 6 Sekunden','Rollen rotieren'],q:'2v1 attacking drill football'},
  {t:'Flanke und Abschluss',f:'Flügelspiel',d:'12 Min',lv:'Mittel',s:['A dribbelt auf dem Flügel','B läuft kurzer Pfosten, Torwart C','Flach oder hoch flanken','Gut für Robert und Enhas'],q:'crossing and finishing drill 3 players'}]},
 squad:{intro:'<b>4 bis 8 Spieler:</b> Spielformen machen Spass und trainieren Entscheidungen unter Druck.',items:[
  {t:'Rondo 4 gegen 1 / 5 gegen 2',f:'Ballbesitz',d:'10 Min',lv:'Alle',s:['Quadrat 8×8 m (5v2: 10×10)','Maximal 2 Kontakte','Wer den Ball verliert, geht in die Mitte','Ziel: 10 Pässe hintereinander'],q:'rondo 5v2 football drill'},
  {t:'2 gegen 2 auf Minitore',f:'Zusammenspiel, Umschalten',d:'12 Min',lv:'Alle',s:['Feld 15×20 m','90 Sek pro Runde, dann Pause','Tor zählt doppelt nach Doppelpass','Super für die Kondition'],q:'2v2 small sided game minigoals'},
  {t:'3 gegen 2 Konterwelle',f:'Konter, Rückwärtslaufen',d:'15 Min',lv:'Mittel',s:['3 greifen 2 Verteidiger an','Nach Abschluss werden die 2 Verteidiger zu Angreifern gegen 1','Endlos-Welle','Trainiert schnelles Umschalten'],q:'3v2 counter attack drill waves'},
  {t:'4 gegen 4 + 2 Neutrale',f:'Ballbesitz, Pressing',d:'15 Min',lv:'Mittel',s:['Feld 25×25 m','Neutrale spielen immer mit dem ballführenden Team','8 Pässe gibt einen Punkt','Nach Ballverlust 5 Sek Gegenpressing'],q:'4v4 plus 2 neutrals possession drill'}]},
 team:{intro:'<b>Für den Trainer:</b> Gezielt gegen die Schwächen aus der Saison: späte Gegentore, Führung halten, Strafraumverteidigung und Umschalten.',items:[
  {t:'Führung verteidigen (Spielform)',f:'Matchmanagement',d:'20 Min',lv:'Team',s:['8v8 auf 2 Tore','Ein Team startet mit 1:0 Führung, 8 Minuten halten','Führendes Team: kompakt, Ball halten, keine Fouls','Das andere Team wird mit +1 Spieler belohnt','Rollen tauschen'],q:'game management drill protecting lead football'},
  {t:'Kompakt verschieben (Schattenspiel)',f:'Defensive Ordnung',d:'15 Min',lv:'Team',s:['Abwehr + Mittelfeld (4+3) gegen Trainerball','Trainer zeigt Ballposition an, alle verschieben','Abstände: max. 10–12 m zwischen den Linien','Dann mit Gegnern 7v6'],q:'defensive shape shifting drill 4-3-3'},
  {t:'Strafraum 1v1 ohne Foul',f:'Zweikampf',d:'12 Min',lv:'Team',s:['Angreifer startet an der Strafraumgrenze','Verteidiger: stehen bleiben, abdrängen, nicht grätschen','Foul gibt sofort Penalty im Training','2 Penaltys gegen Rheinfelden: das muss weg'],q:'1v1 defending in the box without fouling'},
  {t:'Umschalten 6 gegen 4 auf Minitore',f:'Konter, Gegenpressing',d:'15 Min',lv:'Team',s:['6 in Ballbesitz gegen 4','Die 4 gewinnen den Ball: Konter auf 2 Minitore','Die 6: sofort 5 Sek Gegenpressing','Punkte für beide Teams'],q:'transition 6v4 counter attack drill'},
  {t:'Intervall-Spielform 4×4 Min',f:'Kondition mit Ball',d:'24 Min',lv:'Team',s:['5v5 auf kleinem Feld','4 Min Vollgas, 2 Min aktive Pause','4 Durchgänge','Gegen die Gegentore nach der 60. Minute'],q:'small sided games interval training youth'},
  {t:'Standards: Ecken defensiv',f:'Standards',d:'15 Min',lv:'Team',s:['Raumdeckung: 4 in der Zone (Anastacio, Nizar, Arvanit, Seker)','2 Manndecker für die gefährlichsten Kopfballspieler','1 Spieler am kurzen Pfosten','Klarer Ruf von Baran: „Keeper!“'],q:'defending corners zonal mixed youth football'},
  {t:'Spielaufbau gegen Pressing',f:'Aufbau',d:'15 Min',lv:'Team',s:['Torwart + 4 Verteidiger + Seker gegen 4 Pressingspieler','Ziel: über die Mittellinie dribbeln','Seker bietet sich zwischen den IVs an','Ruhe am Ball, kein langer Ball ohne Not'],q:'build up play against press drill 4-3-3'}]},
 halle:{intro:'<b>Halle / Futsal:</b> Kleiner Raum, schnelle Entscheidungen. Wechsel alle 2–3 Minuten, immer in Dreiecken spielen.',items:[
  {t:'Futsal-Rondo 3 gegen 1',f:'Ballbesitz auf engem Raum',d:'8 Min',lv:'Alle',s:['Quadrat 6×6 m','Pass mit der Sohle annehmen','Max. 2 Kontakte','Torwart passt mit'],q:'futsal rondo drill'},
  {t:'Rotation im 1-2-1',f:'Positionswechsel',d:'15 Min',lv:'Mittel',s:['Fixo passt zum Ala und läuft diagonal nach vorne','Ala zieht nach innen, Pivot bietet sich an','Ohne Gegner, dann gegen 2','Nie zwei Spieler auf einer Linie'],q:'futsal 1-2-1 rotation drill'},
  {t:'Pivot-Spiel',f:'Ball halten und ablegen',d:'12 Min',lv:'Mittel',s:['Pivot (Enhas oder Lamik) mit Rücken zum Tor','Abschirmen, ablegen auf nachrückenden Ala','Ala schiesst direkt','Auch Drehen und selbst schiessen'],q:'futsal pivot drill'},
  {t:'Schnelles Umschalten nach Torwartabwurf',f:'Konter',d:'10 Min',lv:'Alle',s:['Torwart fängt und wirft sofort auf den freien Ala','2v1 auf das andere Tor','Unter 5 Sek abschliessen','Baran: Abwurf flach und präzise'],q:'futsal goalkeeper distribution counter attack'},
  {t:'Fliegende Wechsel üben',f:'Organisation',d:'10 Min',lv:'Team',s:['Wechselzone festlegen','Block A und B, Wechsel auf Zuruf','Wer rauskommt, klatscht ab','Fehler beim Wechsel kosten im Turnier Tore'],q:'futsal flying substitutions'}]}
};

const TAK={
 out:`<div class="grid g2">
  <div class="card"><h3>Mit Ball</h3><ul class="dots small">
   <li><b>Aufbau flach:</b> Baran spielt auf Nizar oder Arvanit, Seker kommt zwischen die IVs („Salida“).</li>
   <li><b>Breite:</b> Die Flügel (Robert, Enhas oder Miran) bleiben an der Seitenlinie, bis der Ball kommt.</li>
   <li><b>Dreiecke:</b> Immer zwei Anspielstationen in der Nähe vom Ball.</li>
   <li><b>Tiefe:</b> Der Stürmer läuft hinter die Abwehr und zieht sie auseinander.</li>
   <li><b>Abschluss:</b> Der ballferne Flügel kommt an den zweiten Pfosten. So kamen viele Tore gegen Rossoneri.</li></ul></div>
  <div class="card"><h3>Gegen den Ball</h3><ul class="dots small">
   <li><b>Kompakt:</b> Maximal 10–12 m zwischen Abwehr und Mittelfeld.</li>
   <li><b>Pressing-Signal:</b> Rückpass oder schlechte Annahme, dann rücken alle zusammen nach vorne.</li>
   <li><b>Gegenpressing:</b> 5 Sekunden nach Ballverlust sofort drauf. Danach fallen lassen.</li>
   <li><b>Aussenverteidiger:</b> Nie beide gleichzeitig vorne, einer sichert ab.</li>
   <li><b>Gegen Top-Teams:</b> 4-1-4-1, das Zentrum zu, über aussen anlaufen lassen.</li></ul></div>
  <div class="card"><h3>Umschalten</h3><ul class="dots small">
   <li>Nach Ballgewinn der erste Blick nach vorne: Ist ein Konter möglich?</li>
   <li>Wenn nicht: Ball sichern, Seker oder Deniz anspielen, neu aufbauen.</li>
   <li>Nach Ballverlust: der nächste Spieler attackiert, die anderen schliessen die Mitte.</li></ul></div>
  <div class="card"><h3>Standards</h3><ul class="dots small">
   <li><b>Ecken offensiv:</b> Anastacio, Nizar und Arvanit gehen in den Strafraum, Seker sichert an der Strafraumgrenze ab.</li>
   <li><b>Ecken defensiv:</b> 4 in der Raumdeckung plus 2 Manndecker, einer am kurzen Pfosten.</li>
   <li><b>Freistösse:</b> 2 feste Schützen bestimmen (Trainer). Mauer stellt Baran.</li>
   <li><b>Penaltys:</b> Fester Schütze und Ersatzschütze vor dem Spiel festlegen.</li></ul></div>
 </div>`,
 hall:`<div class="grid g2">
  <div class="card"><h3>Grundregeln Halle</h3><ul class="dots small">
   <li>Meistens 4 Feldspieler + Torwart, kleiner Ball (Grösse 4). Reglement vor jedem Turnier lesen.</li>
   <li>Ball mit der Sohle annehmen und stoppen, das gibt Kontrolle.</li>
   <li>Nie zwei Spieler auf einer Linie. Immer Dreiecke oder eine Raute.</li>
   <li>Spiele sind kurz (oft 8–12 Min). Wer zuerst trifft, hat einen grossen Vorteil. Konzentriert starten!</li>
   <li>Fliegende Wechsel alle 2–3 Minuten. Zwei feste Blöcke.</li></ul></div>
  <div class="card"><h3>Systeme</h3><ul class="dots small">
   <li><b>1-2-1 (Raute):</b> Standard. Fixo hinten, zwei Alas, Pivot vorne.</li>
   <li><b>2-2 (Box):</b> Sicher und einfach, gut gegen Pressing.</li>
   <li><b>3-1:</b> Wenn ihr führt und die Zeit runterlaufen lassen wollt.</li>
   <li>Alles im <a href="#aufstellung">Lineup-Builder</a> unter „Halle 4+1“ testen.</li></ul></div>
  <div class="card"><h3>Vorschlag Blöcke</h3>
   <p class="small"><b>Block A:</b> Nizar (Fixo), Robert, Miran (Alas), Enhas (Pivot)</p>
   <p class="small" style="margin-top:6px"><b>Block B:</b> Arvanit (Fixo), André, Deniz (Alas), Lamik (Pivot)</p>
   <p class="small" style="margin-top:6px"><b>Joker:</b> Seker (Fixo/Ala), Leo, Marko, Edson</p>
   <p class="small muted" style="margin-top:8px">Torwart: Baran. Der Trainer entscheidet nach Trainingsleistung und Zusagen.</p></div>
  <div class="card"><h3>Typische Fehler vermeiden</h3><ul class="dots small">
   <li>Querpass vor dem eigenen Tor: das ist der häufigste Grund für Gegentore in der Halle.</li>
   <li>Alle laufen dem Ball nach: Der Fixo bleibt immer hinten.</li>
   <li>Zu spät wechseln: Müde Spieler kassieren Tore.</li>
   <li>Fouls sammeln: In vielen Turnieren gibt es Strafstösse nach mehreren Fouls.</li></ul></div>
 </div>`,
 lessons:`<div class="grid g2">
  <div class="card"><h3>1 · Die letzten 30 Minuten</h3><p class="small">16 von 37 Gegentoren nach der 60. Minute. Gegen Kaiseraugst wurde aus 4:2 ein 4:4, gegen Möhlin aus 3:3 ein 3:6.</p><ul class="dots small" style="margin-top:8px"><li>Ab der 60. Minute frische Beine bringen</li><li>Mit Führung: 4-1-4-1, Ball halten, keine Risikopässe</li><li>Intervall-Spielformen im Training</li></ul></div>
  <div class="card"><h3>2 · Wer da ist, gewinnt</h3><p class="small">0:7, 0:10 und 4:6 kamen mit 7–9 Abwesenden. Mit dem festen Kern: 5 Spiele ohne Niederlage.</p><ul class="dots small" style="margin-top:8px"><li>Früh zu- oder absagen</li><li>Rotationsspieler im Training auf ihre Positionen vorbereiten</li></ul></div>
  <div class="card"><h3>3 · Strafraum-Disziplin</h3><p class="small">2 Penaltys gegen Rheinfelden und 2 Eigentore in der Saison. Ruhe im eigenen Strafraum, klar klären, keine Grätschen von hinten.</p></div>
  <div class="card"><h3>4 · Offensiv sind wir stark</h3><p class="small">37 Tore, verteilt auf 13 verschiedene Torschützen. Auch die Verteidiger treffen (Nizar, Arvanit, Marko, Anastacio, Edson). Das ist eine echte Stärke. Ohne Murat müssen die Tore noch breiter verteilt werden.</p></div>
 </div>`
};
