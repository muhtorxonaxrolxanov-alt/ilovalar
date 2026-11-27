// node render.js scene.html out.mp4 [--w 1920 --h 1080 --fps 30 --workers 3] | --preview t1,t2,... prefix
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs'), os = require('os');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const html = args[0], out = args[1];
const W = +opt('w', 1920), H = +opt('h', 1080), FPS = +opt('fps', 30), WK = +opt('workers', 3);
const preview = opt('preview', null);
const LAUNCH = { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] };
async function openPage(browser) {
  const pg = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.resolve(html));
  try { await pg.waitForFunction('window.__ready===true', null, { timeout: 120000 }); } catch (e) { throw new Error('tayyor emas: ' + errs.join('; ')); }
  if (errs.length) console.log('JS:', errs);
  return pg;
}
(async () => {
  const browser = await chromium.launch(LAUNCH);
  if (preview) {
    const pg = await openPage(browser);
    for (const t of preview.split(',')) { await pg.evaluate(`window.renderFrame(${t})`); await pg.screenshot({ path: `${out}_${t}.png` }); console.log('png', t); }
    await browser.close(); return;
  }
  const p0 = await openPage(browser); const dur = await p0.evaluate('window.DURATION'); await p0.close();
  const n = Math.round(dur * FPS), step = Math.ceil(n / WK), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'r')); const segs = [];
  let done = 0; const t0 = Date.now();
  await Promise.all([...Array(WK).keys()].map(async k => {
    const i0 = k * step, i1 = Math.min(n, (k + 1) * step); if (i0 >= i1) return;
    const seg = path.join(tmp, `s${k}.mp4`); segs[k] = seg;
    const pg = await openPage(browser);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = i0; i < i1; i++) {
      await pg.evaluate(`window.renderFrame(${i / FPS})`);
      const buf = await pg.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 60 === 0) console.log(`${done}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await pg.close();
  }));
  fs.writeFileSync(path.join(tmp, 'l.txt'), segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
  await new Promise((r, j) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'l.txt'), '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', c => c ? j(c) : r()));
  await browser.close(); console.log('OK', out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
})().catch(e => { console.error(e); process.exit(1); });
