// Holt die aktuellen Daten vom FVNWS-Matchcenter und schreibt live.json.
// Läuft automatisch über GitHub Actions (.github/workflows/update.yml).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parseHTML } from 'linkedom';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const F = require('./fvnws.cjs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function fetchDoc(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'de-CH,de;q=0.9' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const html = await r.text();
      await sleep(400); // freundlich zum Server
      return parseHTML(html).document;
    } catch (e) { if (i === 2) throw e; await sleep(2000 * (i + 1)); }
  }
}

const data = await F.scrape(fetchDoc, {});
if (!data.table.length || !data.matches.length) {
  console.error('Keine Daten gefunden – live.json bleibt unverändert.', data.log);
  process.exit(0);
}
const strip = d => JSON.stringify({ ...d, updated: null, log: null });
const old = existsSync('live.json') ? JSON.parse(readFileSync('live.json', 'utf8')) : null;
if (old && strip(old) === strip(data)) { console.log('Keine Änderungen.'); process.exit(0); }
writeFileSync('live.json', JSON.stringify(data));
console.log(`live.json aktualisiert: ${data.matches.length} Spiele, ${data.upcoming.length} Termine, Gruppe: ${data.group}`);
