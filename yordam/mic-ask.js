/* Ilova ochilganda (oddiy ilovalardagidek) bir marta «🎤 Mikrofonga ruxsat berasizmi?» deb so'raydi (2026-11-18).
   «Ruxsat berish» → brauzerning o'z oynasi → ruxsat saqlanadi, keyin 🎤 darhol yozadi.
   Faqat ruxsat hali so'ralmagan (prompt) bo'lsa chiqadi; «Keyinroq» bosilsa 2 kundan keyin yana so'raydi. */
(function () {
  if (window.micAskOn) return; window.micAskOn = 1;
  var md = navigator.mediaDevices, K = 'micAskT';
  if (!md || !md.getUserMedia || !navigator.permissions || !navigator.permissions.query) return;
  function lsg() { try { return +localStorage.getItem(K) || 0; } catch (e) { return 0; } }
  function lss() { try { localStorage.setItem(K, String(Date.now())); } catch (e) {} }
  function show() {
    if (!document.body) return setTimeout(show, 300);
    var bg = document.createElement('div'); bg.id = 'micask';
    bg.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px;font:16px/1.45 system-ui,sans-serif';
    var dk = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
    bg.innerHTML = '<div style="background:' + (dk ? '#1f2937;color:#f9fafb' : '#fff;color:#111') + ';border-radius:20px;padding:22px 18px;max-width:360px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.35)">' +
      '<div style="font-size:46px">🎤</div><div style="font-size:19px;font-weight:800;margin:6px 0">Mikrofonga ruxsat berasizmi?</div>' +
      '<div style="opacity:.8">Gapirib yozish uchun kerak. «Ruxsat berish»ni bosing, keyin chiqqan oynada yana <b>«Ruxsat berish»</b> (Разрешить) ni tanlang.</div>' +
      '<button type="button" id="micaok" style="margin-top:14px;width:100%;padding:14px;border:0;border-radius:14px;background:#16a34a;color:#fff;font-weight:800;font-size:17px">✅ Ruxsat berish</button>' +
      '<button type="button" id="micano" style="margin-top:8px;width:100%;padding:11px;border:0;border-radius:14px;background:transparent;color:inherit;opacity:.7;font-size:15px">Keyinroq</button></div>';
    document.body.appendChild(bg);
    var close = function () { if (bg.parentNode) bg.parentNode.removeChild(bg); };
    bg.querySelector('#micano').onclick = function () { lss(); close(); };
    bg.querySelector('#micaok').onclick = function () {
      lss(); this.textContent = 'Ruxsat so‘ralyapti…'; this.disabled = true;
      md.getUserMedia({ audio: true }).then(function (s) {
        s.getTracks().forEach(function (t) { t.stop(); });
        bg.firstChild.innerHTML = '<div style="font-size:46px">✅</div><div style="font-size:18px;font-weight:800">Mikrofon yoqildi</div><div style="opacity:.8">Endi 🎤 ni bosib gapiravering.</div>';
        setTimeout(close, 1600);
      }, function () { close(); });
    };
  }
  function check() {
    if (Date.now() - lsg() < 2 * 864e5) return;
    navigator.permissions.query({ name: 'microphone' }).then(function (r) { if (r.state === 'prompt' && !document.getElementById('micask')) show(); }, function () {});
  }
  setTimeout(check, 1500);
})();
