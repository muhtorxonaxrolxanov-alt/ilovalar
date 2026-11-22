/* Jarvis va Agentlar — bitta API: kompyuterda (127.0.0.1:7777) to'g'ridan-to'g'ri serverga,
   telefonda (sayt) Google ko'prigi orqali kompyuterga; kompyuter o'chiq bo'lsa — bulutdagi AI (Gemini). 2026-11-22 */
window.JV = (function () {
  var LOCAL = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
  var URL = 'https://script.google.com/macros/s/AKfycbwup1N4Wcnm55MNxYe4VHIEr873WDwRkND9XG4UFci1-9F2qhCdJMtpagsbseszsNs/exec?jv=1';
  var LS = { g: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, s: function (k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* */ } } };
  // ulanish havolasi: …/jarvis/#k=KALIT — kalit saqlanadi, manzil satridan olib tashlanadi
  var m = location.hash.match(/k=([A-Za-z0-9_-]{24,})/);
  if (m) { LS.s('jv_key', m[1]); try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* */ } }
  addEventListener('hashchange', function () { if (/k=[A-Za-z0-9_-]{24,}/.test(location.hash)) location.reload(); }); // sahifa ochiq turganda havola bosilsa
  var KEY = function () { return LS.g('jv_key'); };
  var AGENTS = [
    { id: 'direktor', n: 'Direktor', e: '🧭', r: 'Jamoa boshlig\'i: vazifani tahlil qiladi, kimga nima qilishni bo\'lib beradi, oxirida yakuniy xulosa yozadi.' },
    { id: 'marketolog', n: 'AI Marketolog', e: '📈', r: 'Strategiya: maqsadli auditoriya, raqobatchilar, taklif (offer), reja.' },
    { id: 'kopirayter', n: 'AI Kopirayter', e: '✍️', r: 'Matnlar: post, reklama matni, sarlavhalar (o\'zbek tilida, 2-3 variant).' },
    { id: 'smm', n: 'AI SMM menejer', e: '📅', r: 'Kontent-reja: 7 kunlik jadval, har kuni qaysi post/reels, soati, hashtaglar.' },
    { id: 'dizayner', n: 'AI Dizayner', e: '🎨', r: 'Vizual: rasm va banner uchun batafsil promptlar (AI rasm generatorlari uchun), rang va kompozitsiya.' },
    { id: 'montajchi', n: 'AI Montajchi', e: '🎬', r: 'Video: Reels/Shorts ssenariysi kadrma-kadr (0-3 s xuk, sahnalar, subtitr matni, musiqa tavsiyasi).' },
    { id: 'targetolog', n: 'AI Targetolog', e: '🎯', r: 'Reklama: auditoriya sozlamalari, byudjet taqsimoti, 3 ta reklama varianti va kutiladigan natija.' }];
  function rq(o, ms) {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, ms || 45000); o.key = KEY();
    return fetch(URL, { method: 'POST', body: JSON.stringify(o), signal: c.signal }).then(function (r) { return r.json(); }).finally(function () { clearTimeout(t); })
      .then(function (j) { if (j && j.err === 'kalit') { LS.s('jv_key', null); if (window.JV_ULASH) window.JV_ULASH(); } return j; });
  }
  var get = function (u) { return fetch(u, { cache: 'no-store' }).then(function (r) { return r.json(); }); };
  var post = function (u, b) { return fetch(u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then(function (r) { return r.json(); }); };
  var sleep = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };
  // kompyuter natijasini kutish (uzoq kutish: har so'rov 20 s gacha)
  async function natijaKut(id, ms) { var end = Date.now() + (ms || 15 * 60000); while (Date.now() < end) { var j = await rq({ jv: 'res', id: id, wait: 20 }, 60000).catch(function () { return null; }); if (j && j.r) return j.r; if (!j) await sleep(2000); } return { javob: 'Kompyuter javob bermadi.' }; }
  var BUL = []; try { BUL = JSON.parse(LS.g('jv_bul') || '[]'); } catch (e) { /* */ } // telefonda bajarilayotgan/saqlanmagan bulut vazifalar
  var saveBul = function () { LS.s('jv_bul', JSON.stringify(BUL.slice(-5))); };
  async function ai(prompt, system, json) { for (var i = 0; i < 2; i++) { var j = await rq({ jv: 'ai', prompt: prompt, system: system, json: !!json }, 60000).catch(function () { return null; }); if (j && j.ok) return j; } return { ok: false, text: 'AI javob bermadi.' }; }
  // kompyuter o'chiq: agentlar jamoasi bulutda (xuddi kompyuterdagidek: Direktor → agentlar 3 tadan → xulosa)
  async function bulutJamoa(matn, upd) {
    var v = { id: 'b' + Date.now().toString(36), matn: matn, t: Date.now(), t0: Date.now(), holat: 'ishlayapti', agentlar: {}, matnlar: {}, bulut: true }; BUL.push(v); saveBul();
    var setA = function (id, h, x) { v.agentlar[id] = Object.assign(v.agentlar[id] || {}, { holat: h }, x || {}); saveBul(); upd && upd(); };
    var A = function (id) { return AGENTS.filter(function (a) { return a.id === id; })[0]; };
    setA('direktor', 'ishlayapti', { t0: Date.now() });
    var list = AGENTS.slice(1).map(function (a) { return a.id + ' — ' + a.r; }).join('\n');
    var p = await ai('Vazifa: «' + matn + '»\n\nJamoa:\n' + list + '\n\nHar bir agentga shu vazifa bo\'yicha aniq topshiriq yoz. FAQAT JSON qaytar: {"tahlil":"1-2 gap","topshiriqlar":{"marketolog":"...","kopirayter":"...", ...}}. Kerak bo\'lmagan agentni qo\'shma.', 'Sen marketing jamoasining Direktorisan. O\'zbek tilida yoz.', true);
    if (!p.ok) { setA('direktor', 'xato'); v.holat = 'xato'; saveBul(); upd && upd(); return v; }
    var P = null; try { P = JSON.parse(p.text.slice(p.text.indexOf('{'), p.text.lastIndexOf('}') + 1)); } catch (e) { /* */ }
    if (!P || !P.topshiriqlar) { P = { tahlil: '', topshiriqlar: {} }; AGENTS.slice(1).forEach(function (a) { P.topshiriqlar[a.id] = matn; }); }
    v.tahlil = P.tahlil || ''; setA('direktor', 'kutyapti', { ms: Date.now() - v.agentlar.direktor.t0 });
    var ids = Object.keys(P.topshiriqlar).filter(function (id) { return A(id) && id !== 'direktor'; });
    ids.forEach(function (id) { setA(id, 'navbatda', { topshiriq: P.topshiriqlar[id] }); });
    var one = async function (id) { var a = A(id), t0 = Date.now(); setA(id, 'ishlayapti', { t0: t0 });
      var r = await ai('Umumiy vazifa: «' + matn + '»\nSenga topshiriq: ' + P.topshiriqlar[id] + '\n\nNatijani to\'liq, tayyor holda yoz (Markdown).', 'Sen ' + a.n + 'san. Vazifang: ' + a.r + ' O\'zbek tilida (lotin), amaliy va aniq yoz.');
      var f = v.id + '/' + id + '.md'; if (r.ok) v.matnlar[f] = '# ' + a.e + ' ' + a.n + '\n\n**Topshiriq:** ' + P.topshiriqlar[id] + '\n\n' + r.text;
      setA(id, r.ok ? 'tayyor' : 'xato', { ms: Date.now() - t0, fayl: r.ok ? f : '' }); };
    var q = ids.slice(); await Promise.all([0, 1, 2].map(async function () { while (q.length) await one(q.shift()); }));
    setA('direktor', 'ishlayapti', { t0: Date.now() });
    var parts = ids.map(function (id) { return (v.matnlar[v.id + '/' + id + '.md'] || '').slice(0, 2500); }).join('\n\n---\n\n');
    var x = await ai('Vazifa: «' + matn + '»\nJamoa natijalari:\n\n' + parts + '\n\nQisqa yakuniy xulosa va keyingi 5 ta aniq qadam yoz (Markdown).', 'Sen jamoa Direktorisan. O\'zbek tilida.');
    if (x.ok) v.matnlar[v.id + '/direktor.md'] = '# 🧭 Direktor — yakuniy xulosa\n\n' + x.text;
    setA('direktor', x.ok ? 'tayyor' : 'xato', { fayl: x.ok ? v.id + '/direktor.md' : '' }); v.holat = 'tayyor'; saveBul();
    var s = await rq({ jv: 'bulutsaqla', v: v }).catch(function () { return null; }); if (s && s.ok) { v.saqlandi = 1; saveBul(); }
    upd && upd(); return v;
  }
  var LAST = { matnlar: {} };
  return {
    LOCAL: LOCAL, AGENTS: AGENTS, key: KEY, ulangan: function () { return LOCAL || !!KEY(); }, uzish: function () { LS.s('jv_key', null); },
    jarvisUrl: LOCAL ? '/' : './', jamoaUrl: LOCAL ? '/jamoa' : 'jamoa.html',
    holat: function () { return LOCAL ? get('/api/holat').then(function (j) { return { pc: true, kirgan: j.kirgan }; }) : rq({ jv: 'holat' }, 30000); },
    // rejim: 'avto' | 'pc' | 'tel'
    buyruq: async function (text, rejim, hist) {
      if (LOCAL) return post('/api/buyruq', { text: text });
      var id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      var j = await rq({ jv: 'cmd', id: id, text: text, rejim: rejim === 'avto' ? '' : rejim, hist: hist || [] }, 60000);
      if (!j || !j.ok) return { javob: 'Aloqa yo\'q. Internetni tekshiring.' };
      if (j.via === 'pc') { var r = await natijaKut(id); r.via = 'pc'; return r; }
      return { javob: j.javob, via: j.via };
    },
    jamoa: async function () {
      if (LOCAL) { var d = await get('/api/jamoa'); d.pc = true; return d; }
      var j = await rq({ jv: 'jamoa' }, 40000); if (!j || !j.ok) throw new Error('aloqa');
      var s = j.snap || {}, mat = Object.assign({}, s.matnlar || {}), seen = {};
      var vz = (s.vazifalar || []).map(function (v) { seen[v.id] = 1; return v; });
      (j.cloud || []).concat(BUL).forEach(function (v) { Object.assign(mat, v.matnlar || {}); if (!seen[v.id]) { seen[v.id] = 1; vz.push(v); } });
      BUL = BUL.filter(function (v) { return !(v.saqlandi && (j.cloud || []).some(function (c) { return c.id === v.id; })); }); saveBul();
      vz.sort(function (a, b) { return (b.t0 || b.t) - (a.t0 || a.t); });
      var stat = Object.assign({}, s.stat || {});
      LAST = { matnlar: mat };
      return { agents: s.agents || AGENTS, stat: stat, vazifalar: vz.slice(0, 20), pc: j.pc, kirgan: s.kirgan };
    },
    vazifa: async function (matn, upd) {
      if (LOCAL) return post('/api/vazifa', { matn: matn });
      var j = await rq({ jv: 'vazifa', matn: matn, id: 'v' + Date.now().toString(36) }, 40000);
      if (j && j.via === 'pc') return { ok: true, via: 'pc' };
      bulutJamoa(matn, upd); return { ok: true, via: 'ai' };
    },
    natija: function (f) { return LOCAL ? fetch('/natija/' + f).then(function (r) { return r.text(); }) : Promise.resolve(LAST.matnlar[f] || 'Natija topilmadi (kompyuter o\'chiq bo\'lsa, uning natijalari 6 soatgacha saqlanadi).'); },
    kirish: function () { return LOCAL ? post('/api/kirish') : this.buyruq('__kirish', 'pc'); }
  };
})();
