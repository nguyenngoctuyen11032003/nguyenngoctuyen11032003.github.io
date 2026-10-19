// Builds the two-page A4 CV in Vietnamese and English through headless Chrome:
//   node scripts/cv/make_cv.mjs [--preview <dir>]
// -> public/cv-vi.pdf, public/cv-en.pdf and public/cv.pdf (a copy of the English one, for old links).
// --preview also writes a PNG of every page to <dir>. Needs network access for Google Fonts.
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { cv, links } from './content.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const PUBLIC = join(ROOT, 'public');
const PHOTO = join(
  PUBLIC,
  'image trail effect',
  '1791432222021_2227102149098789049_5900718242819447986_7075d0462932c4dd47f91dd581b6daf0.jpg',
);
const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const previewIdx = process.argv.indexOf('--preview');
const previewDir = previewIdx > -1 ? resolve(process.argv[previewIdx + 1]) : null;

// Head-and-shoulders portrait crop (4:5) of the 800×800 photo, centred on the face (x ≈ 456).
const avatar = await sharp(PHOTO)
  .extract({ left: 236, top: 0, width: 440, height: 550 })
  .resize(480)
  .modulate({ saturation: 1.04 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toBuffer();
const avatarUri = `data:image/jpeg;base64,${avatar.toString('base64')}`;

const icon = {
  mail: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
  pin: '<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  github:
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
  phone:
    '<path d="M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 5.9 5.9l1.5-2.3 4.6 1.8V18a3 3 0 0 1-3 3A16 16 0 0 1 3 6a3 3 0 0 1 2-3z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
};
const svg = (name) =>
  `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icon[name]}</svg>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const side = (title, body) => `<section class="s-block"><h3 class="s-h">${title}</h3>${body}</section>`;
const main = (title, body, cls = '') => `<section class="m-block ${cls}"><h2 class="m-h"><span>${title}</span></h2>${body}</section>`;

const project = (p) => `
  <article class="proj">
    <div class="proj-top"><h4>${esc(p.name)}</h4><span class="proj-meta">${p.meta}</span></div>
    <p class="proj-tech">${p.tech}</p>
    <p class="proj-text">${p.text}</p>
  </article>`;

// Words that must not split at their hyphen at the end of a line.
const keepWhole = (html) => html.replace(/\be-learning\b/g, '<span style="display:inline-block">e-learning</span>');

function render(c) {
  return keepWhole(page(c));
}

function page(c) {
  const contactList = `
    <ul class="contact">
      <li>${svg('phone')}<a href="tel:${links.phone}">${c.phone}</a></li>
      <li>${svg('mail')}<a href="${links.email.href}">${links.email.label}</a></li>
      <li class="wrap">${svg('pin')}<span>${c.address}</span></li>
      <li>${svg('globe')}<a href="${links.portfolio.href}">${links.portfolio.label}</a></li>
      <li>${svg('github')}<a href="${links.github.href}">${links.github.label}</a></li>
      <li>${svg('linkedin')}<a href="${links.linkedin.href}">${links.linkedin.label}</a></li>
    </ul>`;

  const stack = c.stackGroups
    .map(([label, items]) => `<div class="stack"><p class="stack-l">${label}</p><p class="chips">${items.map((i) => `<span>${esc(i)}</span>`).join('')}</p></div>`)
    .join('');

  const certs = c.certs
    .map((x) => `<li><p class="item-t">${x.href ? `<a href="${x.href}">${x.name}</a>` : x.name}</p>${x.meta ? `<p class="item-m">${x.meta}</p>` : ''}</li>`)
    .join('');

  const langs = c.languages
    .map(([name, level, dots]) => `<li><div class="lang-row"><p class="item-t">${name}</p><span class="dots">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= dots ? 'on' : ''}"></i>`).join('')}</span></div><p class="item-m">${level}</p></li>`)
    .join('');

  const strengths = c.strengths.map(([t, d]) => `<li><p class="item-t">${t}</p><p class="item-m">${d}</p></li>`).join('');

  const jobs = c.jobs
    .map(
      (j) => `
    <article class="job">
      <div class="job-top">
        <h4>${j.role}</h4>
        <span class="job-dates">${j.dates}</span>
      </div>
      <p class="job-org">${j.org}<span> · ${j.where}</span></p>
      <ul class="bullets">${j.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
    </article>`,
    )
    .join('');

  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8" />
<title>${c.docTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=block" rel="stylesheet" />
<style>
  @page { size: A4; margin: 0; }
  :root {
    --navy: #0f1d33; --navy-2: #182a47; --gold: #c8a15a; --gold-soft: #e6d3a8;
    --ink: #172030; --body: #323c4b; --muted: #687384; --line: #e2e5ea; --tint: #f5f6f8;
    --accent: #1d4f91;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #fff; }
  body {
    font-family: 'Be Vietnam Pro', system-ui, sans-serif; color: var(--body);
    font-size: 8.55pt; line-height: 1.42; -webkit-print-color-adjust: exact; print-color-adjust: exact;
    font-feature-settings: 'kern', 'liga';
  }
  a { color: inherit; text-decoration: none; }
  b { font-weight: 600; color: var(--ink); }
  .page {
    width: 210mm; height: 297mm; overflow: hidden; display: grid; grid-template-columns: 63mm 1fr;
    page-break-after: always; break-after: page; position: relative;
  }
  .page:last-child { page-break-after: auto; break-after: auto; }

  /* Sidebar */
  .side { background: var(--navy); color: #c9d1de; padding: 12mm 7mm 12mm 7mm; position: relative; }
  .side::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 2.2mm; background: var(--gold); }
  .photo {
    width: 42mm; height: 52.5mm; margin: 0 auto 6mm; border-radius: 3mm; overflow: hidden;
    box-shadow: 0 0 0 0.6mm var(--navy), 0 0 0 0.95mm var(--gold);
  }
  .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .s-block { margin-bottom: 6.2mm; }
  .s-h {
    font-size: 7.4pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold);
    padding-bottom: 1.6mm; margin-bottom: 2.6mm; border-bottom: 0.25mm solid rgba(200, 161, 90, 0.35);
  }
  .contact { list-style: none; display: grid; gap: 2.3mm; font-size: 6.75pt; letter-spacing: -0.01em; }
  .contact li { display: grid; grid-template-columns: 4.2mm 1fr; align-items: center; gap: 1.4mm; color: #e7ecf3; white-space: nowrap; }
  .contact li.wrap { white-space: normal; align-items: start; line-height: 1.4; }
  .contact li.wrap .ic { margin-top: 0.2mm; }
  .url { display: block; font-size: 6.8pt; color: var(--gold-soft); margin-top: 0.4mm; }
  .ic { width: 3.6mm; height: 3.6mm; color: var(--gold); }
  .stack { margin-bottom: 2.5mm; }
  .stack-l { font-size: 7pt; font-weight: 600; color: #fff; margin-bottom: 1.1mm; letter-spacing: 0.02em; }
  .chips { display: flex; flex-wrap: wrap; gap: 1.1mm; }
  .chips span {
    font-size: 6.8pt; line-height: 1; padding: 1.15mm 1.7mm; border-radius: 1mm; color: #dfe5ee;
    background: rgba(255, 255, 255, 0.07); border: 0.2mm solid rgba(255, 255, 255, 0.12);
  }
  .s-list { list-style: none; display: grid; gap: 2.6mm; }
  .item-t { font-size: 7.9pt; font-weight: 600; color: #fff; line-height: 1.32; }
  .item-t a { border-bottom: 0.2mm solid rgba(200, 161, 90, 0.55); }
  .item-m { font-size: 7.2pt; color: #9faabb; line-height: 1.38; margin-top: 0.5mm; }
  .edu-school { font-size: 7.6pt; color: #dfe5ee; margin-top: 0.6mm; }
  .lang-row { display: flex; justify-content: space-between; align-items: center; }
  .dots { display: flex; gap: 0.9mm; }
  .dots i { width: 1.7mm; height: 1.7mm; border-radius: 50%; background: rgba(255, 255, 255, 0.16); }
  .dots i.on { background: var(--gold); }

  /* Main column */
  .main { padding: 12mm 11mm 12mm 9mm; position: relative; }
  .hdr { padding-bottom: 4.2mm; margin-bottom: 4.2mm; border-bottom: 0.3mm solid var(--line); }
  .name { font-size: 25.5pt; font-weight: 700; color: var(--navy); letter-spacing: -0.022em; line-height: 1.08; }
  .role { margin-top: 2mm; font-size: 10.6pt; font-weight: 600; color: var(--accent); letter-spacing: 0.01em; }
  .tagline { margin-top: 0.8mm; font-size: 8.2pt; color: var(--muted); letter-spacing: 0.02em; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.4mm; margin-top: 4mm; }
  .stat { border-top: 0.6mm solid var(--gold); padding-top: 1.6mm; }
  .stat b { display: block; font-size: 15pt; font-weight: 700; color: var(--navy); line-height: 1; letter-spacing: -0.02em; }
  .stat span { display: block; font-size: 6.9pt; color: var(--muted); margin-top: 1mm; line-height: 1.25; }

  .m-block { margin-bottom: 4.2mm; }
  .m-h {
    display: flex; align-items: center; gap: 2.4mm; margin-bottom: 2.6mm;
    font-size: 8.4pt; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--navy);
  }
  .m-h::before { content: ''; width: 1.2mm; height: 3.4mm; background: var(--gold); border-radius: 0.3mm; }
  .m-h::after { content: ''; flex: 1; height: 0.25mm; background: var(--line); }
  .summary { text-align: left; }
  .comp { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 1.3mm 4mm; }
  .comp li { display: grid; grid-template-columns: 3.4mm 1fr; gap: 1.2mm; font-size: 8pt; line-height: 1.35; }
  .comp .ic { width: 3.2mm; height: 3.2mm; color: var(--accent); margin-top: 0.15mm; }

  .job { margin-bottom: 4mm; }
  .job:last-child { margin-bottom: 0; }
  .job-top { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm; }
  .job-top h4 { font-size: 9.6pt; font-weight: 700; color: var(--ink); }
  .job-dates {
    flex: none; font-size: 7.3pt; font-weight: 600; color: var(--accent); background: #edf2fa;
    padding: 0.7mm 1.8mm; border-radius: 1mm; letter-spacing: 0.02em;
  }
  .job-org { font-size: 8.3pt; font-weight: 500; color: var(--accent); margin: 0.6mm 0 1.6mm; }
  .job-org span { color: var(--muted); font-weight: 400; }
  .bullets { list-style: none; display: grid; gap: 1.1mm; }
  .bullets li { position: relative; padding-left: 3.6mm; }
  .bullets li::before {
    content: ''; position: absolute; left: 0.6mm; top: 1.75mm; width: 1.25mm; height: 1.25mm;
    background: var(--gold); transform: rotate(45deg);
  }

  .group-h {
    font-size: 7.3pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
    margin: 0.5mm 0 2mm;
  }
  .projs { display: grid; gap: 2.5mm; margin-bottom: 3.6mm; }
  .proj { padding-left: 3mm; border-left: 0.5mm solid var(--line); }
  .proj-top { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm; }
  .proj-top h4 { font-size: 8.9pt; font-weight: 700; color: var(--ink); }
  .proj-meta { flex: none; font-size: 7pt; color: var(--muted); font-weight: 500; }
  .proj-tech { font-size: 7.25pt; font-weight: 600; color: var(--accent); margin: 0.35mm 0 0.6mm; letter-spacing: 0.01em; }
  .proj-text { font-size: 8.15pt; line-height: 1.42; }
  .p2-hdr { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 3mm; margin-bottom: 4.4mm; border-bottom: 0.3mm solid var(--line); }
  .p2-hdr .n { font-size: 12.5pt; font-weight: 700; color: var(--navy); letter-spacing: -0.01em; }
  .p2-hdr .r { font-size: 7.6pt; color: var(--muted); }
  .note { font-size: 7.6pt; color: var(--muted); }
  .note a { color: var(--accent); font-weight: 600; }
</style>
</head>
<body>
  <div class="page">
    <aside class="side">
      <div class="photo"><img src="${avatarUri}" alt="${c.name}" /></div>
      ${side(c.h.contact, contactList)}
      ${side(c.h.stack, stack)}
    </aside>
    <main class="main">
      <header class="hdr">
        <h1 class="name">${c.name}</h1>
        <p class="role">${c.title}</p>
        <p class="tagline">${c.tagline}</p>
        <div class="stats">${c.stats.map((s) => `<div class="stat"><b>${s.value}</b><span>${s.label}</span></div>`).join('')}</div>
      </header>
      ${main(c.h.summary, `<p class="summary">${c.summary}</p>`)}
      ${main(c.h.competencies, `<ul class="comp">${c.competencies.map((x) => `<li>${svg('check')}<span>${x}</span></li>`).join('')}</ul>`)}
      ${main(c.h.experience, jobs)}
    </main>
  </div>

  <div class="page">
    <aside class="side">
      ${side(c.h.certs, `<ul class="s-list">${certs}</ul>`)}
      ${side(c.h.education, `<p class="item-t">${c.education.degree}</p><p class="edu-school">${c.education.school}</p><p class="item-m">${c.education.meta}</p>`)}
      ${side(c.h.languages, `<ul class="s-list">${langs}</ul>`)}
      ${side(c.h.strengths, `<ul class="s-list">${strengths}</ul>`)}
      ${side(c.h.online, `<ul class="s-list">${c.online.map(([t, l]) => `<li><p class="item-t">${t}</p><a class="url" href="${l.href}">${l.label.replace('/', '/<wbr>')}</a></li>`).join('')}</ul>`)}
    </aside>
    <main class="main">
      <div class="p2-hdr"><span class="n">${c.name}</span><span class="r">${c.title} · ${c.h.page}</span></div>
      ${main(
        c.h.projects,
        `<p class="group-h">${c.h.enterprise}</p><div class="projs">${c.enterprise.map(project).join('')}</div>
         <p class="group-h">${c.h.personal}</p><div class="projs">${c.personal.map(project).join('')}</div>`,
      )}
    </main>
  </div>
</body>
</html>`;
}

// --- headless Chrome over the DevTools protocol ---
const work = join(tmpdir(), `tuyen-cv-${Date.now()}`);
mkdirSync(work, { recursive: true });
const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${join(work, 'profile')}`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250);
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === 'page');
  } catch {}
}
if (!target) {
  chrome.kill();
  throw new Error(`Chrome did not start (${CHROME}); set CHROME to its path.`);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0;
const pending = new Map();
const waiters = new Map();
const once = (method) => new Promise((r) => waiters.set(method, r));
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.method && waiters.has(m.method)) {
    waiters.get(m.method)(m.params);
    waiters.delete(m.method);
  }
  if (m.id && pending.has(m.id)) {
    const { ok, fail } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? fail(new Error(m.error.message)) : ok(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((ok, fail) => {
    const id = ++seq;
    pending.set(id, { ok, fail });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;

let failed = false;
// A PDF open in a Windows viewer is locked: report it and carry on with the other files.
const write = (file, data, note = '') => {
  try {
    writeFileSync(join(PUBLIC, file), data);
    console.log(`✓ public/${file}${note}`);
  } catch (e) {
    if (e.code !== 'EBUSY' && e.code !== 'EPERM') throw e;
    failed = true;
    console.error(`✗ public/${file} is open in another program: close it and run again`);
  }
};
try {
  await send('Page.enable');
  for (const c of Object.values(cv)) {
    const htmlPath = join(work, `cv-${c.lang}.html`);
    writeFileSync(htmlPath, render(c));
    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url: pathToFileURL(htmlPath).href });
    await loaded;
    await evaluate(`document.fonts.ready.then(() => new Promise(r => setTimeout(r, 200)))`);
    const fonts = await evaluate(`document.fonts.load("400 10pt 'Be Vietnam Pro'", "Tuyền").then(f => f.length > 0)`);
    if (!fonts) throw new Error('Be Vietnam Pro did not load (no network?)');
    // Every column has to fit its A4 page: nothing may spill past the bottom margin.
    const overflow = await evaluate(`[...document.querySelectorAll('.page')].flatMap((p, i) =>
      [...p.children].map(col => {
        const last = [...col.children].filter(e => getComputedStyle(e).position !== 'absolute').at(-1);
        // Measured against the A4 page, not the column: a grid column grows with its content.
        const room = p.getBoundingClientRect().bottom - parseFloat(getComputedStyle(col).paddingBottom) - last.getBoundingClientRect().bottom;
        return { page: i + 1, col: col.className, room: Math.round(room) };
      }))`);
    for (const o of overflow) console.log(`  ${c.lang} p${o.page} ${o.col.padEnd(5)} free ${o.room}px`);
    if (overflow.some((o) => o.room < 0)) {
      failed = true;
      console.error(`✗ ${c.lang}: content overflows the page`);
    }
    const { data } = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, generateTaggedPDF: true });
    write(c.file, Buffer.from(data, 'base64'));

    if (previewDir) {
      mkdirSync(previewDir, { recursive: true });
      await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 2, mobile: false });
      const pages = await evaluate(`document.querySelectorAll('.page').length`);
      for (let i = 0; i < pages; i++) {
        const shot = await send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true,
          clip: { x: 0, y: i * 1122.52, width: 793.7, height: 1122.52, scale: 1 },
        });
        writeFileSync(join(previewDir, `cv-${c.lang}-p${i + 1}.png`), Buffer.from(shot.data, 'base64'));
      }
      await send('Emulation.clearDeviceMetricsOverride');
    }
  }
  write('cv.pdf', readFileSync(join(PUBLIC, cv.en.file)), ' (copy of the English CV)');
} finally {
  ws.close();
  chrome.kill();
  await sleep(300);
  rmSync(work, { recursive: true, force: true, maxRetries: 5 });
}
if (failed) process.exit(1);
