// Holt die aktuellen Daten vom FVNWS-Matchcenter und schreibt live.json.
// Läuft automatisch über GitHub Actions (.github/workflows/update.yml).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parseHTML } from 'linkedom';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const F = require('./fvnws.cjs');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Referer': 'https://matchcenter.fvnws.ch/',
  'Sec-Ch-Ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1'
};
let COOKIE = '';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function fetchDoc(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: COOKIE ? { ...HEADERS, Cookie: COOKIE } : HEADERS });
      const sc = r.headers.getSetCookie ? r.headers.getSetCookie() : [];
      if (sc.length) COOKIE = sc.map(c => c.split(';')[0]).join('; ');
      if (!r.ok) throw new Error('HTTP ' + r.status + ' bei ' + url);
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
