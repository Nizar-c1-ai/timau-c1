/* FVNWS Matchcenter scraper for AS Timau C1.
   Same code runs in the browser (DOMParser) and in Node (linkedom).
   scrape(fetchDoc, cfg) -> live data object used by the website. */
(function (root) {
  const BASE = 'https://matchcenter.fvnws.ch/default.aspx?oid=8&lng=1';
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const stripCat = s => clean(s).replace(/\s*\((Jun|Junioren)[^)]*\)\s*$/i, '');
  const isTimau = s => /Timau/i.test(s || '');
  const isNum = s => /^\d{1,3}$/.test(s || '');
  const minVal = m => { const a = String(m).match(/(\d+)(?:'?\+(\d+))?/); return a ? (+a[1] + (a[2] ? +a[2] / 100 : 0)) : 0; };
  const minTxt = m => String(m).replace(/'/g, '').replace(/\+/, '+');
  const qp = (href, k) => { const m = (href || '').match(new RegExp('[?&]' + k + '=(\\d+)')); return m ? m[1] : null; };
  const lines = doc => {
    doc.querySelectorAll('script,style,noscript').forEach(e => e.remove());
    return (doc.body ? doc.body.textContent : doc.textContent).split('\n').map(clean).filter(Boolean);
  };
  const isoDate = s => { const m = (s || '').match(/(\d\d)\.(\d\d)\.(\d{4})/); return m ? `${m[3]}-${m[2]}-${m[1]}` : null; };

  /* ---------- ranking table ---------- */
  function parseTable(doc) {
    const t = doc.querySelector('table.nisRanglisteRD');
    if (!t) return null;
    const rows = [...t.querySelectorAll('tr')].map(tr => {
      const c = cls => { const td = tr.querySelector('.' + cls); return td ? clean(td.textContent) : ''; };
      if (!c('ranCteam')) return null;
      return [c('ranCteam'), +c('ranCsp'), +c('ranCs'), +c('ranCu'), +c('ranCn'), `${c('ranCtg')}:${c('ranCte')}`, +(c('ranCtdf') || '0').replace('+', ''), +c('ranCpt')];
    }).filter(Boolean);
    const txt = clean(doc.body.textContent);
    const all = txt.match(/Junioren [A-Z][^-]{0,40}-\s*(?:Herbst|Frühjahrs|Frühlings|Rückrunde|Vorrunde)[a-z]*\s*-\s*Gruppe\s*\d+/g);
    return { label: all ? clean(all[all.length - 1]) : '', rows };
  }

  /* ---------- schedule lists (team + group) ---------- */
  function parseSchedule(doc) {
    const out = []; let section = '';
    doc.querySelectorAll('.list-group-item').forEach(item => {
      if (item.classList.contains('sppTitel')) { section = clean(item.textContent); return; }
      const row = item.querySelector('.row.spiel'); if (!row) return;
      const dateEl = row.querySelector('.date');
      const dtxt = dateEl ? clean(dateEl.textContent) : '';
      const time = (dtxt.match(/(\d\d:\d\d)/) || [])[1] || '';
      const A = row.querySelector('.teamA'), B = row.querySelector('.teamB');
      const ta = row.querySelector('.torA'), tb = row.querySelector('.torB');
      const ga = ta ? clean(ta.textContent) : '', gb = tb ? clean(tb.textContent) : '';
      const link = row.querySelector('a[href*="tg="]');
      const nr = (clean(row.textContent).match(/Spielnummer\s*(\d+)/) || [])[1] || '';
      out.push({
        section, d: isoDate(dtxt), t: time,
        home: A ? stripCat(A.textContent) : '', away: B ? stripCat(B.textContent) : '',
        sh: /^\d+$/.test(ga) ? +ga : null, sa: /^\d+$/.test(gb) ? +gb : null,
        tg: link ? qp(link.getAttribute('href'), 'tg') : null, nr
      });
    });
    return out;
  }

  /* ---------- match report ---------- */
  function parseReport(doc) {
    const L = lines(doc);
    const hi = L.findIndex(l => /Spielnummer:\s*\d+/.test(l) && /\d\d\.\d\d\.\d{4}/.test(l));
    if (hi < 0) return null;
    const head = L[hi];
    const dm = head.match(/(\d\d)\.(\d\d)\.(\d{4})\s+(\d\d:\d\d)/);
    const nr = head.match(/Spielnummer:\s*(\d+)/)[1];
    const place = clean(head.split(/Spielnummer:\s*\d+\s*-\s*/)[1] || '').replace(/\s*-\s*[^-]*$/, '') || '';
    const k = /^Meisterschaft/i.test(head) ? 'M' : /Cup/i.test(head) ? 'C' : 'T';
    const r = { k, head, d: `${dm[3]}-${dm[2]}-${dm[1]}`, t: dm[4], nr, pl: place, goals: [] };
    let i = hi + 1;
    r.home = L[i++];
    const readGoals = side => {
      while (i < L.length && /^\d+'(\+\d+'?)?$/.test(L[i])) {
        const min = L[i]; let who = L[i + 1] || ''; i += 2; let kind = 'g';
        if (L[i] === '(Penalty)') { kind = 'p'; i++; }
        const og = who.match(/^Eigentor\s*\((.*)\)$/);
        if (og) { kind = 'og'; who = 'Eigentor (' + og[1] + ')'; }
        r.goals.push({ min, side, who, kind });
      }
    };
    readGoals('h');
    const sc = (L[i] || '').match(/^(\d+):(\d+)$/);
    if (!sc) return r; // not played yet
    r.s = [+sc[1], +sc[2]]; i++;
    const ht = (L[i] || '').match(/^\((\d+):(\d+)\)$/); if (ht) { r.ht = [+ht[1], +ht[2]]; i++; }
    r.away = L[i++];
    readGoals('a');
    // yellow cards from Verlauf text
    r.cards = [];
    const verlauf = L.slice(i, i + 40).join(' ');
    (verlauf.match(/(\d+'(?:\+\d+')?)\s*Verwarnung\s+([^(]+?)\s*\(([^)]+)\)/g) || []).forEach(x => {
      const m = x.match(/(\d+'(?:\+\d+')?)\s*Verwarnung\s+([^(]+?)\s*\(([^)]+)\)/);
      r.cards.push({ min: m[1], who: clean(m[2]), team: m[3] });
    });
    // lineups
    const block = (name, stop) => {
      let j = L.indexOf(name, i);
      if (j < 0) return null;
      j++;
      const res = { L: [], B: [], coach: [], A: null };
      const first = L[j];
      // short list: nr, shortname pairs until first nr repeats
      let guard = 0;
      while (isNum(L[j]) && guard++ < 30) { j += 2; if (L[j] === first) break; }
      // full list: nr, full name, position
      while (isNum(L[j]) && L[j + 1] && L[j + 2] && !isNum(L[j + 2]) && L[j + 2] !== 'Ersatzspieler/in') {
        let n = L[j + 1], cap = 0;
        if (/\(C\)$/.test(n)) { cap = 1; n = n.replace(/\s*\(C\)$/, ''); }
        res.L.push([+L[j], n, L[j + 2], cap]); j += 3;
      }
      if (L[j] === 'Ersatzspieler/in') { j++; while (isNum(L[j])) { res.B.push(L[j + 1]); j += 2; } }
      if (L[j] === '= Kein Einsatz') j++;
      if (L[j] === 'Trainer/in') { j++; while (L[j] && L[j] !== 'Abwesend' && L[j] !== stop && !/©/.test(L[j]) && !isNum(L[j])) res.coach.push(L[j++]); }
      if (L[j] === 'Abwesend') { res.A = []; j++; while (L[j] && L[j] !== stop && !/©/.test(L[j]) && !isNum(L[j])) res.A.push(L[j++]); }
      return res;
    };
    r.lineHome = block(r.home, r.away);
    r.lineAway = block(r.away, '__none__');
    return r;
  }

  /* ---------- convert report -> website match object (Timau view) ---------- */
  function toMatch(r, id) {
    const th = isTimau(r.home);
    const opp = stripCat(th ? r.away : r.home);
    const mine = th ? r.lineHome : r.lineAway, theirs = th ? r.lineAway : r.lineHome;
    let h = 0, a = 0;
    const goals = r.goals.slice().sort((x, y) => minVal(x.min) - minVal(y.min));
    const E = goals.map(g => {
      g.side === 'h' ? h++ : a++;
      const timauSide = (g.side === 'h') === th;
      return [minTxt(g.min), timauSide ? 't' : 'o', g.kind, g.who, `${h}:${a}`];
    });
    (r.cards || []).forEach(c => E.push([minTxt(c.min), isTimau(c.team) ? 't' : 'o', 'y', c.who, '']));
    E.sort((x, y) => minVal(x[0]) - minVal(y[0]));
    const s = th ? r.s : [r.s[1], r.s[0]];
    const ht = r.ht ? (th ? r.ht : [r.ht[1], r.ht[0]]) : [0, 0];
    return {
      id, k: r.k, d: r.d, t: r.t, o: opp, h: th, s, ht, nr: r.nr, pl: r.pl, E,
      L: mine ? mine.L : [], B: mine ? mine.B : [], A: mine ? mine.A : null,
      coach: mine ? mine.coach : [],
      oppCoach: theirs ? theirs.coach : []
    };
  }

  /* ---------- main ---------- */
  async function scrape(fetchDoc, cfg) {
    cfg = Object.assign({ club: 477, team: 75396, teamName: 'Junioren C 1. Stärkeklasse a' }, cfg || {});
    const log = [];
    // find current team id via club page (handles a new season)
    let team = cfg.team;
    try {
      const club = await fetchDoc(`${BASE}&v=${cfg.club}`);
      const a = [...club.querySelectorAll('a')].find(x => clean(x.textContent) === cfg.teamName && /[?&]t=\d+/.test(x.getAttribute('href') || ''));
      if (a) team = +qp(a.getAttribute('href'), 't');
    } catch (e) { log.push('club page: ' + e.message); }
    const tbase = `${BASE}&v=${cfg.club}&t=${team}`;
    const trr = await fetchDoc(tbase + '&a=trr');
    const ptLink = [...trr.querySelectorAll('a')].find(x => /a=pt\b/.test(x.getAttribute('href') || ''));
    const ls = ptLink ? qp(ptLink.getAttribute('href'), 'ls') : null, sg = ptLink ? qp(ptLink.getAttribute('href'), 'sg') : null;
    const table = parseTable(trr);
    const ext = (ls ? `&ls=${ls}` : '') + (sg ? `&sg=${sg}` : '');
    const teamSched = parseSchedule(await fetchDoc(tbase + ext + '&a=pt'));
    const groupSched = sg ? parseSchedule(await fetchDoc(tbase + ext + '&a=sp')) : [];
    const matches = []; let id = 0;
    for (const g of teamSched.filter(x => x.tg && x.sh !== null)) {
      try {
        const rep = parseReport(await fetchDoc(`${tbase}${ext}&tg=${g.tg}`));
        if (rep && rep.s) matches.push(toMatch(rep, ++id));
      } catch (e) { log.push('report ' + g.tg + ': ' + e.message); }
    }
    matches.sort((x, y) => (x.d + x.t).localeCompare(y.d + y.t)).forEach((m, i) => m.id = i + 1);
    const today = cfg.today || new Date().toISOString().slice(0, 10);
    const upcoming = teamSched.filter(x => x.sh === null && x.d && x.d >= today).map(x => ({
      d: x.d, t: x.t, what: /Training/i.test(x.section) ? 'Trainingsspiel' : /Cup/i.test(x.section) ? 'Cup' : 'Meisterschaft',
      o: isTimau(x.home) ? x.away : x.home, where: isTimau(x.home) ? 'Heimspiel · Spielnr. ' + x.nr : 'Auswärts · Spielnr. ' + x.nr, tag: 'blue', official: true
    }));
    const results = groupSched.filter(x => x.sh !== null).map(x => [x.home, x.away, x.sh, x.sa]);
    return { updated: new Date().toISOString(), team, ls, sg, group: table ? table.label : '', table: table ? table.rows : [], results, matches, upcoming, log };
  }

  const api = { scrape, parseReport, parseSchedule, parseTable, toMatch };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FVNWS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
