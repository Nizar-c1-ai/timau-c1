/* AS Timau C1 – Team Hub · app logic */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem('timau_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('timau_'+k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtD=(d,o)=>new Date(d+'T12:00').toLocaleDateString('de-CH',o||{weekday:'short',day:'2-digit',month:'2-digit'});
const res=m=>m.s[0]>m.s[1]?'W':m.s[0]<m.s[1]?'L':'D';
const RL={W:'S',D:'U',L:'N'};
const mn=x=>parseInt(x);
const shortName=n=>{const p=SQUAD.find(x=>x.n===n);if(p&&p.short)return p.short;const parts=n.split(' ');return parts[0]==='Hüseyin'?parts[parts.length-1]:parts[0]};
const NAV=[['spiele','Spiele'],['kader','Kader'],['aufstellung','Aufstellung'],['gegner','Gegner'],['termine','Termine'],['training','Training'],['taktik','Taktik'],['rankhof','Rankhof'],['team','Team']];


/* ---------- live data (auto-update from FVNWS via GitHub Action) ---------- */
const EXCLUDE=['Murat Savut','Metehan Kagan','Furkan Tutumlu','Nayher Gebreyesus','Aras Inekci','Alexander Michaele','Alexander Vornicel','Yavuz Selim Aytekin','Nikoloz Metreveli','Bljin Mustafi'];
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();
const findP=n=>SQUAD.find(p=>norm(p.n)===norm(n));
let LIVE=null;
const posFull=pk=>PK[pk]||pk;
const ABR_FULL={'Tor':'TW','Verteidigung rechtsaussen':'RV','Verteidigung rechts':'RV','Verteidigung linksaussen':'LV','Verteidigung links':'LV','Innenverteidigung rechts':'IV','Innenverteidigung links':'IV','Verteidigung mitte':'IV','Libero':'LIB','Mittelfeld defensiv':'DM','Mittelfeld defensiv rechts':'DM','Mittelfeld defensiv links':'DM','Mittelfeld':'ZM','Mittelfeld rechtsinnen':'ZM','Mittelfeld linksinnen':'ZM','Mittelfeld rechtsaussen':'RM','Mittelfeld linksaussen':'LM','Mittelfeld links':'LM','Mittelfeld rechts':'RM','Flügel rechts':'RF','Flügel links':'LF','Flügel':'F','Mittelsturm':'ST','Sturmspitze':'ST','Sturmspitze rechts':'ST','Sturmspitze links':'ST','Hängende Spitze':'HS'};
const abbr=pk=>ABBR[pk]||ABR_FULL[posFull(pk)]||'';
function autoNote(m){
  const sc={};m.E.filter(e=>e[1]==='t'&&(e[2]==='g'||e[2]==='p')).forEach(e=>sc[e[3]]=(sc[e[3]]||0)+1);
  const list=Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([n,c])=>shortName(n)+(c>1?' ('+c+')':''));
  const r=res(m);const head=r==='W'?'Sieg':r==='L'?'Niederlage':'Unentschieden';
  return `${head} ${m.s[0]}:${m.s[1]} ${m.h?'zu Hause':'auswärts'}. `+(list.length?'Tore Timau: '+list.join(', ')+'.':'Keine Timau-Torschützen im Spielbericht.')+' (automatisch aktualisiert)';
}
async function loadLive(){
  try{
    const r=await fetch('live.json',{cache:'no-store'});if(!r.ok)return;
    const L=await r.json();if(!L||!L.matches||!L.matches.length||!L.table||!L.table.length)return;
    LIVE=L;
    const notes={};M.forEach(m=>notes[m.nr]=m.note);
    const nm=L.matches.map(m=>Object.assign({},m,{note:notes[m.nr]||null}));
    nm.forEach(m=>{if(!m.note)m.note=autoNote(m)});
    M.splice(0,M.length,...nm);
    TABLE.splice(0,TABLE.length,...L.table);
    if(L.results&&L.results.length)GR.splice(0,GR.length,...L.results);
    const today=new Date().toISOString().slice(0,10);
    const extra=UP.filter(u=>!u.official&&u.tag==='amber'&&u.d>=today);
    UP.splice(0,UP.length,...(L.upcoming||[]),...extra);UP.sort((a,b)=>(a.d+a.t).localeCompare(b.d+b.t));
    // new opponents get an automatic profile
    TABLE.forEach((t,i)=>{if(isTimauName(t[0])||OPP[t[0]])return;const rank=i+1;
      const sc={};M.filter(m=>m.o===t[0]).forEach(m=>m.E.filter(e=>e[1]==='o'&&(e[2]==='g'||e[2]==='p')).forEach(e=>sc[e[3]]=(sc[e[3]]||0)+1));
      OPP[t[0]]={th:rank<=2?5:rank<=3?4:rank<=5?3:rank<=7?2:1,coach:'–',keys:Object.keys(sc).length?Object.entries(sc).sort((a,b)=>b[1]-a[1]).map(([n,c])=>`${n}: ${c} Tor${c>1?'e':''} gegen uns`):['Noch kein direktes Duell'],
        how:`${rank}. Platz mit ${t[7]} Punkten, ${t[5]} Tore (${t[2]}S ${t[3]}U ${t[4]}N).`,plan:'Automatisch erstelltes Profil, der Trainer ergänzt die Details.'}});
    // players that appear in recent official lineups but are not in the squad list
    M.filter(m=>m.k!=='T').slice(-3).forEach(m=>{m.L.forEach(([nr,n,pk])=>{if(!findP(n)&&!EXCLUDE.some(x=>norm(x)===norm(n)))SQUAD.push({n,nr,l:posFull(pk)==='Tor'?'TOR':'ROT',pos:posFull(pk),role:'Neu im Kader (automatisch erkannt)'})});
      (m.B||[]).forEach(n=>{if(!findP(n)&&!EXCLUDE.some(x=>norm(x)===norm(n)))SQUAD.push({n,nr:'–',l:'ROT',pos:'offen',role:'Neu im Kader (automatisch erkannt)'})})});
  }catch(e){}
}
const isTimauName=s=>/Timau/i.test(s);

async function boot(){
await loadLive();
/* ---------- stats per player ---------- */
const ST={};SQUAD.forEach(p=>ST[p.n]={st:0,bench:0,g:0,cap:0});
M.filter(m=>m.k!=='T').forEach(m=>{
  const get=n=>{const p=n==='André'?findP("André D'alessandro Altamirano Alvarez"):findP(n);return p?ST[p.n]:null};
  m.L.forEach(([nr,n,pk,c])=>{const s=get(n);if(s){s.st++;if(c)s.cap++}});
  (m.B||[]).forEach(n=>{const s=get(n);if(s)s.bench++});
  m.E.filter(e=>e[1]==='t'&&(e[2]==='g'||e[2]==='p')).forEach(e=>{const s=get(e[3]);if(s)s.g++});
});
const league=M.filter(m=>m.k==='M');
// Positionen automatisch aus den offiziellen Matchblättern
const PLBL=f=>({'Tor':'Tor','Innenverteidigung rechts':'IV','Innenverteidigung links':'IV','Verteidigung mitte':'IV','Libero':'Libero','Verteidigung rechtsaussen':'RV','Verteidigung rechts':'RV','Verteidigung linksaussen':'LV','Verteidigung links':'LV','Mittelfeld defensiv':'DM','Mittelfeld defensiv rechts':'DM','Mittelfeld defensiv links':'DM','Mittelfeld':'ZM','Mittelfeld rechtsinnen':'ZM','Mittelfeld linksinnen':'ZM','Mittelfeld rechtsaussen':'RM','Mittelfeld rechts':'RM','Mittelfeld linksaussen':'LM','Mittelfeld links':'LM','Flügel rechts':'Flügel rechts','Flügel links':'Flügel links','Mittelsturm':'Sturm','Sturmspitze':'Sturm','Sturmspitze rechts':'Sturm','Sturmspitze links':'Sturm','Hängende Spitze':'Hängende Spitze'})[f]||f;
(function(){const cnt={};M.filter(m=>m.k!=='T').forEach(m=>m.L.forEach(([nr,n,pk])=>{const p=findP(n);if(!p)return;const l=PLBL(posFull(pk));(cnt[p.n]=cnt[p.n]||{})[l]=(cnt[p.n][l]||0)+1;p._nr=nr}));
  SQUAD.forEach(p=>{const c=cnt[p.n];if(!c)return;p.pos=Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]).join(' · ');if(p.nr==='–'&&p._nr)p.nr=p._nr})})();
if(LIVE){const d=new Date(LIVE.updated);$('#stand').textContent='Automatisch aktualisiert: '+d.toLocaleDateString('de-CH')+' '+d.toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'});if(LIVE.group)$('#tabLabel').textContent='Tabelle · '+LIVE.group}

/* ---------- nav ---------- */
$('#navlinks').innerHTML=NAV.map(([k,l])=>`<li><a href="#${k}" data-k="${k}">${l}</a></li>`).join('');
$('#mmenu').innerHTML=NAV.map(([k,l],i)=>`<a href="#${k}" style="--i:${i}">${l}</a>`).join('');
$('#burger').onclick=()=>document.body.classList.toggle('menu-open');
$$('#mmenu a').forEach(a=>a.onclick=()=>document.body.classList.remove('menu-open'));

/* ---------- hero chip + stats ---------- */
(function(){
  const u=UP.find(x=>x.tag!=='amber')||{d:new Date().toISOString().slice(0,10),t:'',o:'Noch kein Termin',what:'Spielplan folgt'},dt=new Date(u.d+'T12:00');
  $('#nextchip').innerHTML=`<div class="d"><b>${dt.getDate()}</b><span>${dt.toLocaleDateString('de-CH',{month:'short'}).toUpperCase()}</span></div><div><span class="mono">Nächstes Spiel · ${u.t}</span><strong>vs ${esc(u.o)}</strong><span class="small muted">${u.what}${/Heim/.test(u.where||'')?' · Rankhof':''}</span></div>`;
  const me=TABLE.find(t=>isTimauName(t[0]))||['',0,0,0,0,'0:0',0,0];const rank=TABLE.indexOf(me)+1;
  const scorers=new Set();league.forEach(m=>m.E.filter(e=>e[1]==='t'&&(e[2]==='g'||e[2]==='p')).forEach(e=>scorers.add(e[3])));
  $('#stats').innerHTML=[
    [String(rank),'.','Tabellenplatz'],[String(me[7]),'','Punkte'],[me[5].split(':')[0],'','Tore erzielt'],[String(scorers.size),'','Verschiedene Torschützen'],
  ].map((s,i)=>`<div class="rv" style="--i:${i}"><b><span data-count="${s[0]}">0</span>${s[1]}</b><span class="mono">${s[2]}</span></div>`).join('')+
  `<div class="rv" style="--i:4"><span class="mono">Form · letzte 5</span><div class="form" style="margin-top:12px">${league.slice(-5).map(m=>`<div class="fd ${res(m)}">${RL[res(m)]}</div>`).join('')}</div></div>`;
  const ins=[
    ['5','#6ee7a0','Fester Kern = stabil','Seit dem 6.9. mit Baran, Nizar, Arvanit oder Leo, Anastacio, Marko oder Edson und Seker: 7:0, 5:4, 14:3, 3:3, 4:4.'],
    ['3','#ff9aa5','Hohe Niederlagen mit Lücken','0:7, 0:10 und 4:6 kamen jeweils mit 7–9 Abwesenden oder Spielern, die nicht im Kader standen.'],
    ['16','var(--gold)','Späte Gegentore','16 von 37 Gegentoren nach der 60. Minute. Gegen Möhlin stand es in der 49. Minute 3:3, am Ende 4:6.'],
    ['1','var(--blue3)','Den Leader geärgert','Ausser Oberdorf hat nur Timau Kaiseraugst Punkte abgenommen. Die Top 3 sind schlagbar.']
  ];
  $('#insights').innerHTML=ins.map((x,i)=>`<div class="rv" style="--i:${i}"><b class="n" style="color:${x[1]}" data-count="${x[0]}">0</b><h4>${x[2]}</h4><p class="small muted">${x[3]}</p></div>`).join('');
})();

/* ---------- pitch svgs ---------- */
const LINES=`<svg class="lines" viewBox="0 0 68 100" preserveAspectRatio="none" fill="none" stroke="rgba(255,255,255,.4)" stroke-width=".3"><rect x="2" y="2" width="64" height="96" rx="1"/><line x1="2" y1="50" x2="66" y2="50"/><circle cx="34" cy="50" r="8"/><rect x="15" y="2" width="38" height="15"/><rect x="25" y="2" width="18" height="5.5"/><rect x="15" y="83" width="38" height="15"/><rect x="25" y="92.5" width="18" height="5.5"/></svg>`;
const HLINES=`<svg class="lines" viewBox="0 0 20 36" preserveAspectRatio="none" fill="none" stroke="rgba(255,255,255,.5)" stroke-width=".12"><rect x=".6" y=".6" width="18.8" height="34.8"/><line x1=".6" y1="18" x2="19.4" y2="18"/><circle cx="10" cy="18" r="2.6"/><path d="M4 .6 a6 6 0 0 0 12 0"/><path d="M4 35.4 a6 6 0 0 1 12 0"/></svg>`;

/* ---------- matches ---------- */
const IMGS=['img/rankhof-stand.webp','img/rankhof-river.webp','img/rankhof-aerial.webp'];
let mFilter='all',mSel=10;
function renderMatches(){
  const list=M.filter(m=>mFilter==='all'||m.k===mFilter).slice().reverse();
  $('#mcar').innerHTML=list.map((m,i)=>{const r=res(m);
    return `<article class="mcard ${m.id===mSel?'on':''}" data-id="${m.id}" style="--mbg:url(${m.h?IMGS[0]:IMGS[1+(m.id%2)]})">
      <div class="top"><span class="mono">${fmtD(m.d)} · ${{M:'Liga',C:'Cup',T:'Test'}[m.k]}</span><span class="res ${r}">${RL[r]}</span></div>
      <h3>${m.h?'vs':'@'} ${esc(m.o)}</h3>
      <div class="sc ${r}">${m.s[0]}:${m.s[1]}</div>
      <div class="meta"><span class="small muted">${m.h?'Heim · Rankhof':'Auswärts'} · HZ ${m.ht[0]}:${m.ht[1]}</span><span class="mono" style="color:#fff">Details ↗</span></div></article>`}).join('');
  $$('.mcard').forEach(el=>el.onclick=()=>{mSel=+el.dataset.id;$$('.mcard').forEach(x=>x.classList.toggle('on',x===el));renderDetail(true)});
}
function renderDetail(scroll){
  const m=M.find(x=>x.id===mSel),r=res(m);
  const chips=m.L.map(([nr,n,pk,c])=>{const [x,y]=POS[posFull(pk)]||[50,50];return `<div class="chip ${posFull(pk)==='Tor'?'gk':''}" style="left:${x}%;top:${y}%"><div class="dot">${nr}</div><div class="nm">${esc(shortName(n))}${c?' ©':''}</div><div class="ps">${abbr(pk)}</div></div>`}).join('');
  const ev=m.E.length?m.E.map(e=>{const cls=e[2]==='y'?'y':e[1];const lbl=e[2]==='y'?'Gelbe Karte':e[2]==='og'?'Eigentor':e[2]==='p'?'Penalty':'Tor';
    return `<div class="tl ${cls}"><span class="min">${e[0]}'</span><span><b>${esc(e[3])}</b><br><small>${lbl} · ${e[1]==='t'?'Timau':esc(m.o)}</small></span><span class="sc">${e[4]}</span></div>`}).join(''):'<p class="small muted">Keine Torschützen im Spielbericht.</p>';
  $('#mdetail').innerHTML=`
   <div class="md-head"><div><div class="mono">${{M:'Meisterschaft · Gruppe 3',C:'Junioren C Cup · Runde 1',T:'Trainingsspiel'}[m.k]} · ${fmtD(m.d,{weekday:'long',day:'numeric',month:'long'})} · ${m.t}</div>
     <h3>${m.h?'AS Timau – '+esc(m.o):esc(m.o)+' – AS Timau'}</h3><div class="small muted">${esc(m.pl)} · Spielnr. ${m.nr}</div></div>
     <div class="bigsc" style="color:${r==='W'?'#6ee7a0':r==='L'?'#ff8a96':'#fff'}">${m.h?m.s[0]+':'+m.s[1]:m.s[1]+':'+m.s[0]}</div></div>
   <div class="note">${esc(m.note)}</div>
   <div class="md">
     <div><div class="mono kicker">Startelf Timau</div><div class="pitch" style="max-width:420px">${LINES}${chips}</div></div>
     <div><div class="mono kicker">Spielverlauf</div><div class="timeline">${ev}</div>
       <div class="mono kicker" style="margin-top:22px">Ersatzbank</div><div class="pills">${(m.B||[]).map(n=>`<span class="tag">${esc(n)}</span>`).join('')||'–'}</div>
       <div class="mono kicker" style="margin-top:18px">Abwesend</div><div class="pills">${m.A===null?'<span class="small muted">Nicht im Spielbericht erfasst</span>':m.A.length?m.A.map(n=>`<span class="tag loss">${esc(n)}</span>`).join(''):'<span class="small muted">Niemand eingetragen</span>'}</div>
       <p class="small muted" style="margin-top:18px">Trainer: Ali Baki, Salman Yarasir · Quelle: offizieller Spielbericht FVNWS</p></div>
   </div>`;
  if(scroll)$('#mdetail').scrollIntoView({behavior:'smooth',block:'start'});
}
$$('#mfilter button').forEach(b=>b.onclick=()=>{$$('#mfilter button').forEach(x=>x.classList.remove('on'));b.classList.add('on');mFilter=b.dataset.f;renderMatches()});
$$('[data-car]').forEach(b=>b.onclick=()=>{const c=document.getElementById(b.dataset.car);const w=c.firstElementChild?c.firstElementChild.getBoundingClientRect().width+14:300;c.scrollBy({left:w*+b.dataset.d,behavior:'smooth'})});

$('#table').innerHTML='<tr><th>#</th><th>Team</th><th class="n">Sp</th><th class="n">S</th><th class="n">U</th><th class="n">N</th><th class="n">Tore</th><th class="n">Pkt</th></tr>'+
 TABLE.map((t,i)=>`<tr class="${t[0].includes('Timau')?'me':''}"><td>${i+1}</td><td>${esc(t[0])}</td><td class="n">${t[1]}</td><td class="n">${t[2]}</td><td class="n">${t[3]}</td><td class="n">${t[4]}</td><td class="n">${t[5]}</td><td class="n"><b>${t[7]}</b></td></tr>`).join('');
(function(){
  const bins=[0,0,0,0,0,0].map(()=>({f:0,a:0}));
  league.forEach(m=>m.E.forEach(e=>{if(!['g','p','og'].includes(e[2]))return;const i=Math.min(5,Math.floor((mn(e[0])-1)/15));bins[i][e[1]==='t'?'f':'a']++}));
  const mx=Math.max(...bins.map(b=>Math.max(b.f,b.a)));const lab=['1–15','16–30','31–45','46–60','61–75','76–90+'];
  $('#minChart').innerHTML=bins.map((b,i)=>`<div class="mcol"><div class="pair"><div class="b" style="--h:${b.f/mx*100}%;--i:${i};background:var(--win)"><em>${b.f}</em></div><div class="b" style="--h:${b.a/mx*100}%;--i:${i};background:var(--loss)"><em>${b.a}</em></div></div><span>${lab[i]}</span></div>`).join('');
  const sc=SQUAD.map(p=>({n:p.n,g:ST[p.n].g})).filter(x=>x.g).sort((a,b)=>b.g-a.g);const max=sc[0].g;
  $('#topScorers').innerHTML=sc.map(x=>`<div class="hbar"><span>${esc(shortName(x.n))}</span><div class="bar"><i style="--w:${x.g/max*100}%"></i></div><b style="text-align:right;font-family:var(--mono)">${x.g}</b></div>`).join('');
})();

/* ---------- kader ---------- */
function renderKader(f){
  $('#players').innerHTML=SQUAD.filter(p=>f==='all'||p.l===f).map((p,i)=>{const s=ST[p.n];
    return `<article class="pc rv ${p.l==='TOR'?'gk':''}" style="--i:${i%4}"><div class="bignr">${p.nr}</div><img class="crestbg" src="img/logo.webp" alt="">
      <span class="mono pos">${esc(p.pos)}</span>
      <h3>${esc(p.n)}<small>${esc(p.role)}</small></h3>
      <div class="st"><div><b>${s.st}</b><span>Starts</span></div><div><b>${s.g}</b><span>Tore</span></div><div><b>${s.bench}</b><span>Bank</span></div>${s.cap?`<div><b>${s.cap}×</b><span>Captain</span></div>`:''}</div></article>`}).join('');
  observe($$('#players .rv'));
}
$$('#kfilter button').forEach(b=>b.onclick=()=>{$$('#kfilter button').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderKader(b.dataset.f)});

/* ---------- lineup builder ---------- */
const FORMS={
 out:{
  '4-3-3':{slots:[['TW',50,90],['RV',84,71],['IV',63,77],['IV',37,77],['LV',16,71],['DM',50,61],['ZM',68,46],['ZM',32,46],['RF',83,23],['ST',50,14],['LF',17,23]],
   def:['Baran Bakar','Leo Ljekaj','Arvanit Dermaku','Nizar Garrab','Marko Michael Anello','Hüseyin Seker',"André D'alessandro Altamirano Alvarez",'Deniz Yarasir','Robert Faraone','Hüseyin Can Enhas','Miran Kabakci'],
   t:'4-3-3 · Grundordnung',x:'Das System, das ihr am meisten gespielt habt. Seker sichert vor der Abwehr ab, André und Deniz verbinden. Enhas spielt zentral für Murat, Robert und Miran kommen über die Flügel. Die Aussenverteidiger schieben nie beide gleichzeitig nach vorne.'},
  '4-1-4-1':{slots:[['TW',50,90],['RV',84,72],['IV',63,77],['IV',37,77],['LV',16,72],['DM',50,62],['RM',84,42],['ZM',63,45],['ZM',37,45],['LM',16,42],['ST',50,14]],
   def:['Baran Bakar','Leo Ljekaj','Arvanit Dermaku','Nizar Garrab','Marko Michael Anello','Hüseyin Seker','Robert Faraone',"André D'alessandro Altamirano Alvarez",'Deniz Yarasir','Miran Kabakci','Hüseyin Can Enhas'],
   t:'4-1-4-1 · Gegen die Top 3',x:'Gegen den Ball zwei Viererketten mit Seker dazwischen, so bleibt das Zentrum dicht. Gut gegen Kaiseraugst, Oberdorf und Wallbach, und um eine Führung ab der 60. Minute zu halten.'},
  '4-2-3-1':{slots:[['TW',50,90],['RV',84,72],['IV',63,77],['IV',37,77],['LV',16,72],['DM',63,61],['DM',37,61],['ZOM',50,40],['RF',83,30],['LF',17,30],['ST',50,13]],
   def:['Baran Bakar','Edson Samba Mango Baldé','Arvanit Dermaku','Nizar Garrab','Marko Michael Anello','Hüseyin Seker','Deniz Yarasir','Miran Kabakci','Robert Faraone','Hüseyin Can Enhas',"André D'alessandro Altamirano Alvarez"],
   t:'4-2-3-1 · Doppelsechs',x:'Seker und Deniz geben Stabilität. Miran ist die Nummer 10 zwischen den Linien. André läuft als Spitze und presst früh.'},
  '4-4-2':{slots:[['TW',50,90],['RV',84,72],['IV',63,77],['IV',37,77],['LV',16,72],['RM',85,45],['ZM',62,50],['ZM',38,50],['LM',15,45],['ST',63,16],['ST',37,16]],
   def:['Baran Bakar','Leo Ljekaj','Arvanit Dermaku','Anastacio Antonio Cuenda','Marko Michael Anello','Edson Samba Mango Baldé','Hüseyin Seker','Deniz Yarasir','Miran Kabakci','Robert Faraone','Hüseyin Can Enhas'],
   t:'4-4-2 · Zwei Spitzen',x:'Robert und Enhas zusammen vorne, gut bei einem Rückstand. Anastacio spielt innen gegen kopfballstarke Gegner und bei Standards.'}
 },
 hall:{
  '1-2-1':{slots:[['TW',50,88],['Fixo',50,66],['Ala',80,43],['Ala',20,43],['Pivot',50,18]],def:['Baran Bakar','Nizar Garrab','Robert Faraone','Miran Kabakci','Hüseyin Can Enhas'],
   t:'1-2-1 Raute · Standard',x:'Der Fixo (Nizar) sichert ab, die Alas geben Breite, der Pivot (Enhas) behauptet und legt ab. Block B als Vorschlag: Arvanit Fixo, André und Deniz Alas, Lamik Pivot.'},
  '2-2':{slots:[['TW',50,88],['Abwehr',70,64],['Abwehr',30,64],['Angriff',70,27],['Angriff',30,27]],def:['Baran Bakar','Nizar Garrab','Arvanit Dermaku','Robert Faraone','Hüseyin Can Enhas'],
   t:'2-2 Box · Sicher aufbauen',x:'Zwei bauen hinten auf, zwei bleiben vorne. Einfach und stabil, gut gegen Pressing.'},
  '3-1':{slots:[['TW',50,88],['Rechts',78,56],['Fixo',50,64],['Links',22,56],['Pivot',50,20]],def:['Baran Bakar','Leo Ljekaj','Nizar Garrab','Marko Michael Anello','Hüseyin Can Enhas'],
   t:'3-1 · Führung halten',x:'Drei hinten machen das Zentrum dicht. In der Schlussphase den Ball laufen lassen, der Pivot hält Bälle fest.'}
 }
};
let lMode=store.get('lmode','out'),lForm=store.get('lform_'+lMode,lMode==='out'?'4-3-3':'1-2-1');
if(!FORMS[lMode][lForm])lForm=Object.keys(FORMS[lMode])[0];
const getLineup=()=>store.get('lu_'+lMode+'_'+lForm,FORMS[lMode][lForm].def.slice());
function renderLineup(){
  $$('#modeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.m===lMode));
  const F=FORMS[lMode];
  $('#formSeg').innerHTML=Object.keys(F).map(k=>`<button data-f="${k}" class="${k===lForm?'on':''}">${k}</button>`).join('');
  $$('#formSeg button').forEach(b=>b.onclick=()=>{lForm=b.dataset.f;store.set('lform_'+lMode,lForm);renderLineup()});
  const f=F[lForm],lu=getLineup();
  const opts=sel=>`<option value="">–</option>`+SQUAD.map(p=>`<option ${p.n===sel?'selected':''} value="${esc(p.n)}">${p.nr} ${esc(shortName(p.n))}</option>`).join('');
  const p=$('#lpitch');p.className='pitch'+(lMode==='hall'?' hall':'');p.style.maxWidth=lMode==='hall'?'400px':'560px';
  p.innerHTML=(lMode==='hall'?HLINES:LINES)+f.slots.map(([lab,x,y],i)=>`<div class="chip ${lab==='TW'?'gk':''}" style="left:${x}%;top:${y}%"><div class="dot">${(SQUAD.find(q=>q.n===lu[i])||{}).nr||'?'}</div><select data-i="${i}" aria-label="${lab}">${opts(lu[i])}</select><div class="ps">${lab}</div></div>`).join('');
  $$('#lpitch select').forEach(s=>s.onchange=()=>{const l=getLineup();l[+s.dataset.i]=s.value;store.set('lu_'+lMode+'_'+lForm,l);renderLineup()});
  $('#fKick').textContent=lMode==='out'?'System · 11 gegen 11':'System · Halle 4+1';
  $('#fTitle').textContent=f.t;$('#fText').textContent=f.x;
  const used=new Set(lu);
  $('#lbench').innerHTML=SQUAD.filter(q=>!used.has(q.n)).map(q=>`<span class="tag">${q.nr} ${esc(shortName(q.n))}</span>`).join('');
  const dup=lu.filter((n,i)=>n&&lu.indexOf(n)!==i);$('#lmsg').textContent=dup.length?'⚠ Doppelt: '+dup.map(shortName).join(', '):'';
}
$$('#modeSeg button').forEach(b=>b.onclick=()=>{lMode=b.dataset.m;store.set('lmode',lMode);lForm=store.get('lform_'+lMode,lMode==='out'?'4-3-3':'1-2-1');renderLineup()});
$('#lreset').onclick=()=>{store.set('lu_'+lMode+'_'+lForm,FORMS[lMode][lForm].def.slice());renderLineup()};
$('#lcopy').onclick=async()=>{const f=FORMS[lMode][lForm],lu=getLineup();const txt=`AS Timau C1 – ${lForm}\n`+f.slots.map((s,i)=>`${s[0]}: ${lu[i]||'–'}`).join('\n');
  try{await navigator.clipboard.writeText(txt);$('#lmsg').textContent='Kopiert ✓'}catch(e){$('#lmsg').textContent='Kopieren nicht möglich'}};

/* ---------- opponents ---------- */
function oppResults(team){return GR.filter(g=>g[0]===team||g[1]===team).map(g=>{const home=g[0]===team,us=home?g[2]:g[3],them=home?g[3]:g[2];return{vs:home?g[1]:g[0],home,us,them,r:us>them?'W':us<them?'L':'D'}})}
(function(){
  const teams=TABLE.filter(t=>!t[0].includes('Timau'));
  $('#ocar').innerHTML=teams.map(t=>{const o=OPP[t[0]],rank=TABLE.indexOf(t)+1,h2h=M.filter(m=>m.o===t[0]&&m.k!=='T');
    return `<article class="oc"><div class="rk">${rank}</div>
      <div style="display:flex;gap:10px;align-items:center"><span class="mono">${rank}. Platz · ${t[7]} Pkt</span><div class="threat" title="Gefahr">${[1,2,3,4,5].map(i=>`<i class="${i<=o.th?'f':''}"></i>`).join('')}</div></div>
      <h3>${esc(t[0])}</h3><p>${esc(o.how)}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div class="pills">${h2h.map(m=>`<span class="rrow" style="border:0;padding:0"><span class="s ${res(m)}">${m.k==='C'?'Cup ':''}${m.s[0]}:${m.s[1]}</span></span>`).join('')}</div>
        <button class="btn" data-opp="${esc(t[0])}">Details <span class="ar">↗</span></button></div></article>`}).join('');
  $$('[data-opp]').forEach(b=>b.onclick=()=>openOpp(b.dataset.opp));
})();
function openOpp(name){
  const o=OPP[name],rs=oppResults(name),t=TABLE.find(x=>x[0]===name);
  $('#dcontent').innerHTML=`<div class="mono kicker">Gegnerprofil · ${TABLE.indexOf(t)+1}. Platz</div><h2 style="font-size:clamp(30px,5vw,46px);font-weight:400">${esc(name)}</h2>
   <p class="small muted" style="margin-top:6px">Trainer: ${esc(o.coach)} · ${t[5]} Tore · ${t[2]}S ${t[3]}U ${t[4]}N · ${t[7]} Punkte</p>
   <div class="mono kicker" style="margin-top:28px">Wie sie spielen</div><p style="color:#d2d8e4">${esc(o.how)}</p>
   <div class="mono kicker" style="margin-top:22px">Unser Plan</div><p style="color:#d2d8e4">${esc(o.plan)}</p>
   <div class="mono kicker" style="margin-top:22px">Aufpassen auf</div><ul class="dots small">${o.keys.map(k=>`<li>${esc(k)}</li>`).join('')}</ul>
   <div class="mono kicker" style="margin-top:22px">Alle Resultate · Herbst 2026</div>
   ${rs.map(x=>`<div class="rrow" style="${x.vs.includes('Timau')?'font-weight:700;color:#fff':''}"><span>${x.home?'vs':'@'} ${esc(x.vs.replace('AS Timau Basel a','AS Timau'))}</span><span class="s ${x.r}">${x.us}:${x.them}</span></div>`).join('')}
   <p class="small muted" style="margin-top:18px">Nur belegte Fakten aus den offiziellen Spielberichten.</p>`;
  $('#drawer').classList.add('open');document.body.style.overflow='hidden';
}
const closeDrawer=()=>{$('#drawer').classList.remove('open');document.body.style.overflow=''};
$('#drawer .bk').onclick=closeDrawer;$('#drawer .x').onclick=closeDrawer;
addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

/* ---------- events ---------- */
(function(){
  const today=new Date(new Date().toDateString());
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const tr=[];(typeof TRAININGS!=='undefined'?TRAININGS:[]).forEach(T=>{let d=new Date(Math.max(today,new Date(T.from+'T00:00')));
    while(d.getDay()!==T.wd)d.setDate(d.getDate()+1);for(let k=0;k<2;k++){tr.push({d:iso(d),t:T.t,what:T.what,o:T.o,where:T.where,tag:'win'});d.setDate(d.getDate()+7)}});
  const sure=[...UP.filter(u=>u.tag!=='amber'),...tr].sort((a,b)=>(a.d+(a.t||'')).localeCompare(b.d+(b.t||'')));
  const maybe=UP.filter(u=>u.tag==='amber');
  const list=[...sure,...maybe];
  $('#events').innerHTML=list.map((u,i)=>{const dt=new Date(u.d+'T12:00'),days=Math.round((dt-today)/864e5);
    const lbl=dt.toLocaleDateString('de-CH',{weekday:'short'}).replace('.','')+' · '+dt.toLocaleDateString('de-CH',{month:'long'})+(u.t?' · '+u.t:'');
    const cls=u.tag==='amber'?'amber':u.tag==='win'?'win':'blue';
    return `<article class="ev rv" style="--i:${i%4}${u.tag==='amber'?';opacity:.75':''}"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div class="dt">${dt.getDate()}<span class="mono" style="display:block;margin-top:6px">${lbl}</span></div><span class="tag ${cls}">${days<=0?'heute':'in '+days+' T.'}</span></div>
      <h4>${esc(u.o)}</h4><span class="small muted">${u.what===u.o?'':u.what+'<br>'}${esc(u.where)}</span></article>`}).join('');
})();

/* ---------- training ---------- */
let dSel='solo';
function renderDrills(){
  const g=DR[dSel];$('#dIntro').innerHTML=g.intro;
  $('#dgrid').innerHTML=g.items.map((it,i)=>`<article class="card drill rv" style="--i:${i%3}"><div class="pills"><span class="tag blue">${esc(it.f)}</span><span class="tag">${it.d}</span><span class="tag">${it.lv}</span></div><h3>${esc(it.t)}</h3><ol>${it.s.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><a class="vlink" href="${yt(it.q)}" target="_blank" rel="noopener"><i></i>Videos auf YouTube</a></article>`).join('');
  observe($$('#dgrid .rv'));
}
$$('#dSeg button').forEach(b=>b.onclick=()=>{$$('#dSeg button').forEach(x=>x.classList.remove('on'));b.classList.add('on');dSel=b.dataset.d;renderDrills()});
(function(){const days=['Mo','Di','Mi','Do','Fr','Sa','So'];const w=store.get('week',{});
  $('#week').innerHTML=days.map(d=>`<div class="d"><span class="mono">${d}</span><textarea data-d="${d}" placeholder="z. B. 18:00 Rankhof">${esc(w[d]!==undefined?w[d]:(d==='Do'?'Hallentraining (ab 19.11.)':''))}</textarea></div>`).join('');
  $$('#week textarea').forEach(t=>t.oninput=()=>{const w=store.get('week',{});w[t.dataset.d]=t.value;store.set('week',w)});})();

/* ---------- taktik ---------- */
$$('#tSeg button').forEach(b=>b.onclick=()=>{$$('#tSeg button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const c=$('#tcontent');c.style.opacity=0;setTimeout(()=>{c.innerHTML=TAK[b.dataset.t];c.style.opacity=1},200)});
$('#tcontent').innerHTML=TAK.out;$('#tcontent').style.transition='opacity .3s';

/* ---------- team ---------- */
const Q=['90 Minuten. Nicht 70.','Der nächste Pass ist wichtiger als der letzte Fehler.','Wer da ist, spielt. Wer spielt, gewinnt.','Führen ist gut. Führung halten ist besser.','Einer macht einen Fehler, zwei helfen.','Wir haben den Leader geärgert. Wir können jeden ärgern.'];
let qi=0;$('#quote').textContent=Q[0];$('#nextQuote').onclick=()=>{qi=(qi+1)%Q.length;$('#quote').textContent=Q[qi]};
const mqTxt=['One Team','One Timau','90 Minuten','Basel','Rankhof','Seit 1965'];
$('#mq').innerHTML=[...mqTxt,...mqTxt,...mqTxt,...mqTxt].map(t=>`<span>${t}</span>`).join('');

/* ---------- animations ---------- */
// split headline words
$$('[data-words]').forEach(h=>{let i=0;const out=[];
  h.childNodes.forEach(n=>{if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(w=>{if(!w.trim()){out.push(w);return}out.push(`<span class="w"><span style="--i:${i++}">${esc(w)}</span></span>`)})}
    else out.push(`<span class="w"><span style="--i:${i++}">${n.outerHTML}</span></span>`)});
  h.innerHTML=out.join('')});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function countUp(el){const to=+el.dataset.count;if(el._done)return;el._done=1;if(reduce){el.textContent=to;return}
  const t0=performance.now(),d=1400;const step=t=>{const p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,4);el.textContent=Math.round(to*e).toLocaleString('de-CH');if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');e.target.querySelectorAll('[data-count]').forEach(countUp);if(e.target.dataset.count)countUp(e.target);io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
function observe(els){els.forEach(el=>io.observe(el))}
observe($$('.rv,.rv-clip,[data-words],.facts,[data-count]'));

// nav state, progress, parallax
const nav=$('#nav'),prog=$('#progress'),heroBg=$('#heroBg'),pars=$$('[data-par]');let lastY=0,ticking=false;
function onScroll(){
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  prog.style.transform=`scaleX(${h>0?y/h:0})`;
  nav.classList.toggle('solid',y>40);
  nav.classList.toggle('hide',y>lastY&&y>500&&!document.body.classList.contains('menu-open'));lastY=y;
  if(!reduce){
    if(y<innerHeight*1.2)heroBg.style.translate=`0 ${y*.35}px`;
    pars.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const c=(r.top+r.height/2-innerHeight/2);el.style.translate=`0 ${-c*(+el.dataset.par)}px`});
  }
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});
addEventListener('resize',onScroll);
// active nav link
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('#navlinks a').forEach(a=>a.classList.toggle('on',a.dataset.k===e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
NAV.forEach(([k])=>{const s=document.getElementById(k);if(s)secIO.observe(s)});

/* ---------- init ---------- */
mSel=M.length?M[M.length-1].id:0;renderMatches();renderDetail(false);renderKader('all');renderLineup();renderDrills();onScroll();
}
boot();
