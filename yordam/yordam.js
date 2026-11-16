/* ❓ Yordam: har bir ekrandagi tugmalarni birma-bir ko'rsatib tushuntiradi (video ko'rgandek).
 * Ilova yig'ilganda: window.YAPP="tr" + shu fayl. Tugmalar matni yoki selektori bo'yicha topiladi;
 * ekranda yo'q tugma o'tkazib yuboriladi. */
(function () {
  if (window.__yordam) return; window.__yordam = 1;
  var D = {
    /* ---------- Nonvoyxona: rahbar ---------- */
    tr: { t: '🥖 Nonvoyxona — rahbar', i: 'Nonvoyxonaning hamma hisob-kitobi: do\'konlarga berilgan non, pul, nasiya, mashina, kassa, hodimlar va hisobot.', s: [
      { x: 'Do\'konlar', h: '🏪 Do\'konlar', d: 'Har bir do\'konga qancha non berildi, qancha qaytdi, qancha pul olindi yoki nasiya qoldi — shu yerda yoziladi. Do\'konni bossangiz, uning to\'liq hisobi chiqadi.' },
      { x: 'Olma', h: '🍏 Olma do\'koni', d: 'Xalq Retail (Olma) buyurtmalari. Excel faylni tashlaysiz — ilova o\'zi «berish kerak / berildi / qoldi» deb hisoblaydi.' },
      { x: 'Mashina', h: '🚚 Mashina', d: 'Mashinaga nechta non yuklandi, do\'konlarga nechtasi berildi va mashinada nechtasi qoldi. Yetmasa ogohlantiradi.' },
      { x: 'Kassa', h: '💵 Kassa', d: 'Kun davomida kassadan olingan pullarni yozasiz. Kechqurun ilova kassa to\'g\'ri, kam yoki ortiqchaligini o\'zi hisoblaydi.' },
      { x: 'Hodimlar', h: '👷 Hodimlar', d: 'Hodimlar, ularning qop haqi, kunlik va oylik maoshi, avansi. «Xodimlar va kodlar» bo\'limida har hodimga kirish kodi berasiz — hodim Sizning raqamingiz va shu kod bilan kiradi.' },
      { x: 'Xarajat', h: '🧾 Xarajat', d: 'Kunlik xarajatlar: un, gaz, svet va boshqalar. Hisobotda foydadan ayriladi.' },
      { x: 'Non turlari', h: '🍞 Non turlari', d: 'Qanday nonlar yopilishi, narxi va retsepti (1 qop un uchun nima kerak).' },
      { x: 'Hisobot', h: '📊 Hisobot', d: 'Kun, hafta, oy bo\'yicha jami: berilgan non, olingan pul, nasiya, xarajat va foyda.' },
      { sel: '.pxl', h: '🎬 Jonli sahna', d: 'Nonvoyxonaning bugungi holati: omborga nima kirdi, hamirchi necha qop qildi, tandirda necha non yopildi, do\'konlarga qancha ketdi. Hodimlar yozgan zahoti shu yer o\'zgaradi.' },
      { sel: '#fab', h: '🎤 Ovozli yordamchi', d: 'Bosing va gapiring: «Anorga 15 ta patir berildi». Yordamchi nima qilishini ko\'rsatadi, «Ha» desangiz bajaradi.' },
      { sel: '#gear', h: '⚙ Sozlamalar', d: 'Nonvoyxona nomi, bildirishnomalar, yangi versiya va boshqa sozlamalar.' }] },
    /* ---------- Nonvoyxona: hodim ---------- */
    th: { t: '🥖 Nonvoyxona — hodim', i: 'Hodim ilovasi: hamirchi, yopuvchi yoki sotuvchi ishini yozadi. Yozganlaringiz rahbarga o\'zi boradi.', s: [
      { sel: '#ph', h: '📱 Rahbar raqami', d: 'Birinchi marta: rahbaringizning telefon raqamini yozing (o\'zingiznikini emas).' },
      { sel: '#cd2', h: '🔑 Kod', d: 'Rahbar Sizga bergan shaxsiy kodni yozing va «Kirish» ni bosing.' },
      { x: 'Hamir', h: '🥣 Hamir', d: 'Hamirchi: nechta qop hamir qilganingizni yozasiz. Vazifa bajarilsa salyut chiqadi.' },
      { x: 'tandir', h: '🔥 Tandirlar', d: 'Yopuvchi: har tandirda nechta non yopilganini yozasiz (1-tandir, 2-tandir…).' },
      { x: 'Kassa', h: '💵 Kassa', d: 'Kun oxirida kassadagi pulni yozasiz. Kassadan pul olinsa, shu yerda belgilaysiz.' },
      { x: 'Yuborish', h: '📤 Yuborish', d: 'Internet bo\'lmasa yozuvlar telefonda saqlanadi. Internet kelganda o\'zi yoki shu tugma bilan rahbarga ketadi.' }] },
    /* ---------- Hisob-kitob ---------- */
    'hk-i': { t: '⚡ Hisob-kitob', i: 'Usta uchun: obyektlar, qilingan ishlar, olingan pul, shogirtlar va hisobot.', s: [
      { x: 'Shit sxemasi', h: '📐 Shit sxemasi', d: 'Shitni haqiqiy avtomatlar bilan yig\'ib, narxini hisoblaydi.' },
      { x: 'Santexnika', h: '🚿 Santexnika sxemasi', d: 'Qozonxona, kollektor va quvurlar bilan sxema va narx.' },
      { x: 'Hisob-kitob', h: '🧾 Hisob-kitob', d: 'Asosiy bo\'lim: obyektlar, ishlar, pullar, shogirtlar.' },
      { sel: '#payb', h: '💳 To\'lov', d: 'Obunani uzaytirish: tarifni tanlab, kartaga o\'tkazasiz va chek rasmini yuborasiz.' },
      { sel: '#prof', h: '👤 Profil', d: 'Sohangiz, parolni o\'zgartirish va ilovadan chiqish.' }] },
    'hk-h': { t: '🧾 Hisob-kitob', i: 'Obyektlar, shogirtlar va hisobot. Hamma yozuv bulutga o\'zi saqlanadi.', s: [
      { sel: '#t1', h: '🏗 Obyektlar', d: 'Ish qilayotgan joylaringiz. Obyektni bossangiz: qilingan ishlar va olingan pullar.' },
      { sel: '#oq', h: '🔍 Qidiruv', d: 'Obyektni nomi, mijoz ismi yoki raqami bo\'yicha tez topish.' },
      { sel: '#addBtn', h: '➕ Qo\'shish', d: 'Yangi obyekt (yoki Shogirtlar bo\'limida — yangi shogird) qo\'shish.' },
      { sel: '[data-a="additem"]', h: '➕ Ish / tochka', d: 'Qilingan ish: nima ish, nechta, bittasi necha pul.' },
      { sel: '[data-a="addrecv"]', h: '💵 Olingan pul', d: 'Mijozdan olingan pulni yozasiz. Keyin mijozga chek yuborish taklif qilinadi.' },
      { sel: '#t2', h: '👷 Shogirtlar', d: 'Shogirtlar: kunlik haqi, ishlagan kunlari, berilgan pul va qarz. «📤 Ilovaga taklif» bilan shogirdga havola yuborasiz.' },
      { sel: '[data-cinv]', h: '📤 Ilovaga taklif', d: 'Shogirdga havola yuboradi. U havolani ochib, parol qo\'yadi va obyektlaringizda «ishladim» deb yoza oladi.' },
      { sel: '#t3', h: '📊 Hisobot', d: 'Jami olingan pul, mijozlardan qolgan qarz, shogirtlarga berilgan pul va qarz, obyektlar bo\'yicha shogirdlar.' },
      { sel: '[data-a="gear"]', h: '⚙ Sozlamalar', d: 'Profil, ilova nomi va belgisi, ko\'rinish, zaxira nusxa.' }] },
    'hk-sg': { t: '👷 Shogird', i: 'Ustangizning obyektlarida ishlagan kunlaringizni yozasiz. Ustangiz ham ko\'radi.', s: [
      { sel: '.obj', h: '🏗 Obyekt', d: 'Qaysi obyektda ishlagan bo\'lsangiz, shuni bosing → necha kun → «Yozish».' },
      { sel: '#tM', h: '💰 Hisobim', d: 'Kunlik haqingiz, ishlagan kunlaringiz, olgan va olishingiz kerak bo\'lgan pul.' },
      { sel: '#tS', h: '⚙ Sozlamalar', d: 'Yangilash va ilovadan chiqish.' }] },
    gate: { t: '🔐 Kirish', i: 'Birinchi marta «Ro\'yxatdan o\'tish», keyingi safar «Kirish» (raqam va parol).', s: [
      { sel: '#tL', h: 'Kirish', d: 'Oldin ro\'yxatdan o\'tgan bo\'lsangiz: telefon raqam va parol.' },
      { sel: '#tR', h: 'Ro\'yxatdan o\'tish', d: 'Birinchi marta shu yerni bosing.' },
      { sel: '#forgot', h: 'Parolni unutdim', d: 'Telegramga kod keladi, u bilan yangi parol qo\'yasiz.' },
      { sel: '#toJoin', h: '🤝 Taklif kodi', d: 'Ustangiz taklif qilgan bo\'lsa, shu yerga taklif kodini yozasiz.' }] },
    /* ---------- Elektr Do'kon ---------- */
    em: { t: '💡 Elektr Do\'kon', i: 'Tovarlarni ko\'rib, savatchaga solib, buyurtma berasiz. Do\'kon manzilingizga olib boradi.', s: [
      { x: 'Ro\'yxatdan o\'tish', h: 'Ro\'yxatdan o\'tish', d: 'Birinchi marta: raqam va parol. Bepul.' },
      { x: 'Kirish', h: 'Kirish', d: 'Keyingi safar: raqam va parol. Parolni unutsangiz — kod bilan tiklanadi.' },
      { sel: 'input[type=search],input[placeholder*="idir"]', h: '🔍 Qidiruv', d: 'Tovar nomini yozing (masalan «kabel»). Xato yozsangiz ham topadi.' },
      { sel: '.add', h: '➕ Savatga', d: 'Tovar yonidagi shu tugma uni savatchaga soladi. Yana bossangiz soni ko\'payadi.' },
      { sel: '[data-act="openCart"]', h: '🛒 Savatcha', d: 'Tanlangan tovarlar. To\'lov turini tanlab, «Buyurtma berish» ni bosasiz.' },
      { x: 'Buyurtmalarim', h: '📦 Buyurtmalarim', d: 'Buyurtmangiz qayerdaligi: qabul qilindi → yo\'lda → yetib keldi.' },
      { x: 'Hisobim', h: '💳 Hisobim', d: 'Qarzingiz va to\'lovlaringiz.' },
      { x: 'Profil', h: '👤 Profil', d: 'Manzilingiz, xaritadagi joyingiz, parol.' }] },
    es: { t: '🧾 Do\'kon Sotuvchi', i: 'Buyurtmalarni qabul qilish, yetkazish, mijozlar, tovarlar va hisobot.', s: [
      { x: 'Buyurtmalar', h: '📦 Buyurtmalar', d: 'Yangi buyurtmalar. Ketma-ket: Qabul qilish → Yo\'lga chiqdim → Yetkazildi → Chek.' },
      { x: 'Mijozlar', h: '👥 Mijozlar', d: 'Mijozlar ro\'yxati, qarzlari, to\'lovlari. Mijozni bossangiz — to\'liq hisobi.' },
      { x: 'Tovarlar', h: '📦 Tovarlar', d: 'Tovar qo\'shish va tahrirlash: narx, rasm, video, aksiya.' },
      { x: 'Hisobot', h: '📊 Hisobot', d: 'Savdo, foyda, xarajat, eng ko\'p sotilganlar.' },
      { x: 'Yangi', h: '🆕 Buyurtma holatlari', d: 'Yangi → Qabul qilingan → Yo\'lda → Yetkazilgan. Bosib, shu holatdagi buyurtmalarni ko\'rasiz.' },
      { sel: '[data-act*="set"],[aria-label*="ozlama"]', h: '⚙ Sozlamalar', d: 'Do\'kon nomi, logo, karta raqami, printer, Telegram xabar.' }] }
  };
  function key() {
    var a = window.YAPP || '';
    if (a === 'nr') return 'tr'; if (a === 'nh') return 'th';
    if (a === 'hk') { var p = location.pathname; if (/shogird/.test(p)) return 'hk-sg'; if (/gate/.test(p)) return 'gate'; if (/hisob\.html/.test(p)) return 'hk-h'; if (/(\/|index\.html)$/.test(p)) return 'hk-i'; return ''; }
    return a;
  }
  function vis(e) { if (!e) return false; var r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('#yrd'); }
  function find(st) {
    if (st.sel) { var L = document.querySelectorAll(st.sel); for (var i = 0; i < L.length; i++) if (vis(L[i])) return L[i]; return null; }
    var best = null, A = document.querySelectorAll('button,a,[role=button],[data-act],[data-a],[onclick],.tile,.c,label,h2,h3');
    for (var j = 0; j < A.length; j++) { var e = A[j]; if (!vis(e)) continue; var tx = (e.textContent || '').replace(/\s+/g, ' ');
      if (tx.indexOf(st.x) >= 0 && tx.length < 160) { if (!best || tx.length < (best.textContent || '').length) best = e; } }
    return best;
  }
  var css = '#yrdb{position:fixed;left:10px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:44px;height:44px;border-radius:50%;border:0;background:#f59e0b;color:#111;font-size:22px;font-weight:900;box-shadow:0 4px 14px rgba(0,0,0,.35);opacity:.92}' +
    '#yrdb.pul{animation:ypul 1.4s ease-in-out 4}@keyframes ypul{50%{transform:scale(1.25)}}' +
    '#yrd{position:fixed;inset:0;z-index:2147483001}#yrd .sp{position:fixed;border-radius:14px;box-shadow:0 0 0 9999px rgba(0,0,0,.62);transition:all .35s;border:3px solid #fbbf24;animation:yglow 1.2s ease-in-out infinite}@keyframes yglow{50%{border-color:#fff}}' +
    '#yrd .bb{position:fixed;left:12px;right:12px;max-width:460px;margin:0 auto;background:#fff;color:#14171f;border-radius:16px;padding:14px 14px 10px;box-shadow:0 10px 30px rgba(0,0,0,.4);font:16px/1.45 system-ui,sans-serif;transition:top .35s}' +
    '#yrd .bb b{display:block;font-size:18px;margin-bottom:4px}#yrd .bb .nv{display:flex;gap:8px;margin-top:10px;align-items:center}#yrd .bb button{flex:1;padding:11px;border-radius:12px;border:0;font-size:16px;font-weight:700;background:#e5e7eb;color:#111}#yrd .bb button.p{background:#2563eb;color:#fff}#yrd .bb small{color:#6b7280}';
  function start() {
    var A = D[key()]; if (!A) return;
    var S = A.s.map(function (s) { return { s: s, e: find(s) }; }).filter(function (x) { return x.e; });
    var o = document.createElement('div'); o.id = 'yrd'; o.innerHTML = '<div class="sp" hidden></div><div class="bb"></div>'; document.body.appendChild(o);
    var sp = o.querySelector('.sp'), bb = o.querySelector('.bb'), k = -1;
    function close() { o.remove(); }
    function draw() {
      if (k < 0) { sp.hidden = true; bb.style.top = '30%'; bb.innerHTML = '<b>' + A.t + '</b>' + A.i + '<div class="nv"><button data-y="x">Yopish</button>' + (S.length ? '<button class="p" data-y="n">Ko\'rsatish ›</button>' : '') + '</div><small>' + (S.length ? S.length + ' ta joyni birma-bir ko\'rsataman' : '') + '</small>'; return; }
      var it = S[k]; it.e.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(function () {
        var r = it.e.getBoundingClientRect(), pad = 6; sp.hidden = false;
        sp.style.left = (r.left - pad) + 'px'; sp.style.top = (r.top - pad) + 'px'; sp.style.width = (r.width + pad * 2) + 'px'; sp.style.height = (r.height + pad * 2) + 'px';
        var below = r.bottom + 14, hh = innerHeight; bb.style.top = (below + 170 < hh ? below : Math.max(10, r.top - 190)) + 'px';
        bb.innerHTML = '<b>' + it.s.h + '</b>' + it.s.d + '<div class="nv"><button data-y="b">‹</button><button data-y="x">✕</button><button class="p" data-y="n">' + (k < S.length - 1 ? 'Keyingi ›' : 'Tushundim ✓') + '</button></div><small>' + (k + 1) + ' / ' + S.length + '</small>';
      }, 320);
    }
    o.addEventListener('click', function (ev) { var b = ev.target.closest('[data-y]'); if (!b) return; var y = b.dataset.y;
      if (y === 'x') return close(); if (y === 'b') k = Math.max(-1, k - 1); if (y === 'n') { if (k >= S.length - 1) return close(); k++; } draw(); });
    draw();
  }
  function init() {
    if (!D[key()] || document.getElementById('yrdb')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var b = document.createElement('button'); b.id = 'yrdb'; b.type = 'button'; b.textContent = '?'; b.setAttribute('aria-label', 'Yordam: bu ekran qanday ishlaydi'); b.onclick = start;
    document.body.appendChild(b);
    try { var f = 'yrd_seen_' + key(); if (!window.localStorage.getItem(f)) { b.classList.add('pul'); window.localStorage.setItem(f, '1'); } } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 400); }); else setTimeout(init, 400);
})();
