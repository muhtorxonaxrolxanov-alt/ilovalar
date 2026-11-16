/* Yordam: o'ng tepada doimiy sozlamalar va ? tugmasi; ? har bir ekrandagi joylarni birma-bir ko'rsatib tushuntiradi.
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
  /* Har ilova: sozlamalar qanday ochiladi, kirilganmi, ilovaning o'z ⚙ tugmasi (yashiriladi) */
  function gS() { try { return S; } catch (e) { return null; } }
  function clk(sel) { return function () { var e = document.querySelector(sel); if (e) e.click(); }; }
  function vis0(sel) { var e = document.querySelector(sel); return !!(e && e.getBoundingClientRect().width > 0); }
  var CFG = {
    tr: { hide: '#gear', on: function () { var s = gS(); return !!(s && s.tok); }, set: function () { go('set'); }, gd: 'Nonvoyxona nomi, filiallar, bildirishnomalar, yangi versiya va boshqa sozlamalar. Har ekranda shu yerda turadi.' },
    th: { hide: '#gear', on: function () { var s = gS(); return !!(s && s.tok); }, set: function () { go('yub'); }, gd: 'Akaunt, ovoz, til va boshqa sozlamalar. Har ekranda shu yerda turadi.' },
    'hk-i': { on: function () { return vis0('#prof'); }, set: clk('#prof'), gd: 'Profil: sohangiz, parolni o\'zgartirish va ilovadan chiqish.' },
    'hk-h': { hide: '.top .gear', pad: '.top{padding-right:50px}', on: function () { return true; }, set: clk('[data-a="gear"]'), gd: 'Profil, ilova nomi va belgisi, ko\'rinish, zaxira nusxa. Har ekranda shu yerda turadi.' },
    'hk-sg': { hide: '#tS', on: function () { return !!document.querySelector('#tabs') && vis0('#tO'); }, set: clk('#tS'), gd: 'Yangilash va ilovadan chiqish.' },
    em: { pad: '#topActions{margin-right:46px}', on: function () { var s = gS(); return !!(s && s.token); }, set: function () { var s = gS(); s.tab = 'profile'; s.view = null; render(); scrollTo(0, 0); }, gd: 'Profilingiz: ism, manzil, xaritadagi joyingiz, parol.' },
    es: { hide: '#topActions [data-k="settings"]', pad: '#topActions{margin-right:46px}', on: function () { var s = gS(); return !!(s && s.token); }, set: clk('#topActions [data-k="settings"]'), gd: 'Do\'kon nomi, logo, karta raqami, printer, Telegram xabar.' }
  };
  function key() {
    var a = window.YAPP || '';
    if (a === 'nr') return 'tr'; if (a === 'nh') return 'th';
    if (a === 'hk') { var p = location.pathname; if (/shogird/.test(p)) return 'hk-sg'; if (/gate/.test(p)) return 'gate'; if (/hisob\.html/.test(p)) return 'hk-h'; if (/(\/|index\.html)$/.test(p)) return 'hk-i'; return 'hk-x'; }
    return a;
  }
  var K = key(), A = D[K] || { t: '❓ ' + (document.title || 'Yordam'), i: '', s: [] }, C = CFG[K] || {};
  var OWN = '#yrdb,#yrdg,#yrd';
  function shown(e) { if (!e || e.closest(OWN)) return false; var r = e.getBoundingClientRect(); if (r.width < 6 || r.height < 6) return false;
    var s = getComputedStyle(e); if (s.visibility === 'hidden' || s.opacity === '0') return false;
    for (var p = e; p && p !== document.body; p = p.parentElement) { var q = getComputedStyle(p); if (q.display === 'none') return false; } return true; }
  function txt(e) { return (e.getAttribute('aria-label') || e.textContent || e.placeholder || e.title || e.value || '').replace(/\s+/g, ' ').trim(); }
  /* Ma'lum tugmalar (aniq tushuntirish) */
  function known() { var out = [];
    A.s.forEach(function (st) { var hit = null;
      if (st.sel) { var L = document.querySelectorAll(st.sel); for (var i = 0; i < L.length; i++) if (shown(L[i])) { hit = L[i]; break; } }
      else { var Q = document.querySelectorAll('button,a,[role=button],[data-act],[data-a],[onclick],.tile,label');
        for (var j = 0; j < Q.length; j++) { var e = Q[j]; if (!shown(e)) continue; var t = txt(e); if (t.indexOf(st.x) >= 0 && t.length < 90 && (!hit || t.length < txt(hit).length)) hit = e; } }
      if (hit) { out.push({ e: hit, h: st.h, d: st.d }); if (st.sel) [].forEach.call(document.querySelectorAll(st.sel), function (z) { if (z !== hit) out.push({ e: z, skip: 1 }); }); } }); return out; }
  /* Qolgan hamma joy: yozuvi va turiga qarab o'zi tushuntiradi */
  var KW = [
    [/saqla|^✓|^ok$|tasdiq/i, 'Yozganlaringizni saqlaydi.'], [/o'chir|o‘chir|🗑|^✕|^×/i, 'O\'chiradi. Oldin «Rostdan o\'chirasizmi?» deb so\'raladi.'],
    [/orqaga|^‹|^←|^⬅|^❮/i, 'Oldingi ekranga qaytaradi.'], [/qo'sh|qo‘sh|➕|^\+/i, 'Yangi yozuv qo\'shadi. Ochilgan oynani to\'ldirib, saqlaysiz.'],
    [/yubor|📤/i, 'Ma\'lumotni yuboradi.'], [/bekor|yopish/i, 'Hech narsani o\'zgartirmay yopadi.'], [/^kirish|kirish$/i, 'Ilovaga kiradi.'], [/chiqish/i, 'Ilovadan chiqadi.'],
    [/^(bugun|kecha|hafta|oy|o'tgan oy|yil|hammasi|davr)$/i, 'Qaysi kunlar hisobini ko\'rishni tanlaysiz. Pastdagi raqamlar shu davr bo\'yicha o\'zgaradi.'],
    [/nasiya|qarz/i, 'Qarzga berilgan, hali to\'lanmagan summa.'], [/to'l|to‘l|pul|so'm|kassa/i, 'Pul bilan bog\'liq: olingan, berilgan yoki to\'langan summa.'],
    [/excel|fayl|📎|yukla/i, 'Fayl tanlab yuklaysiz.'], [/tahrir|✏|o'zgartir/i, 'Yozuvni o\'zgartirasiz.'], [/qidir|🔍/i, 'Nom bo\'yicha tez topadi.'],
    [/ulash|telegram/i, 'Boshqalarga yuboradi (Telegram va boshqalar).'], [/chek|🧾/i, 'Chek chiqaradi yoki ko\'rsatadi.'], [/yangila|🔄|↻/i, 'Ma\'lumotni serverdan qayta oladi.'],
    [/ovoz|🎤|mikrofon/i, 'Ovoz bilan buyruq berasiz.'], [/hisobot|📊/i, 'Jami raqamlar: kun, hafta, oy bo\'yicha.'], [/sozlama|⚙/i, 'Sozlamalar.'],
    [/berildi|berish/i, 'Berilgan narsani belgilaysiz yoki yozasiz.'], [/qaytdi|qaytar/i, 'Qaytib kelgan narsani yozasiz.'], [/narx/i, 'Narxni ko\'rsatadi yoki o\'zgartiradi.'],
    [/📞|qo'ng'iroq/i, 'Qo\'ng\'iroq qiladi.'], [/yordamchi|🤖/i, 'Sun\'iy intellekt yordamchisi: yozing yoki gapiring, u ilovadagi ishni bajarib beradi (oldin so\'raydi).']];
  function nameOf(e) {
    if (e.labels && e.labels[0]) return txt(e.labels[0]);
    var p = e.previousElementSibling; if (p && /LABEL|SPAN|B|DIV|SMALL/.test(p.tagName) && txt(p).length < 50 && txt(p)) return txt(p);
    var par = e.parentElement; if (par && par.tagName === 'LABEL') { var t = (par.textContent || '').replace(/\s+/g, ' ').trim(); if (t && t.length < 60) return t; }
    return e.placeholder || e.getAttribute('aria-label') || e.title || e.name || '';
  }
  function describe(e) {
    var tg = e.tagName, ty = (e.type || '').toLowerCase();
    if (tg === 'SELECT') { var n = nameOf(e) || 'Tanlash'; return { h: '🔽 ' + n, d: 'Ro\'yxatdan birini tanlaysiz' + (e.options && e.options.length ? ': ' + [].slice.call(e.options, 0, 4).map(function (o) { return '«' + o.text.trim() + '»'; }).join(', ') + (e.options.length > 4 ? '…' : '') : '') + '.' }; }
    if (tg === 'TEXTAREA' || tg === 'INPUT') {
      var n2 = nameOf(e) || 'Katak';
      if (ty === 'checkbox' || ty === 'radio') return { h: '☑ ' + n2, d: 'Bossangiz belgilanadi (yoqiladi), yana bossangiz olib tashlanadi.' };
      if (ty === 'file') return { h: '📎 ' + n2, d: 'Telefoningizdan fayl yoki rasm tanlaysiz.' };
      if (ty === 'date' || ty === 'month') return { h: '📅 ' + n2, d: 'Sanani tanlaysiz.' };
      var ex = e.placeholder && e.placeholder !== n2 ? ' Masalan: «' + e.placeholder + '».' : '';
      var num = (ty === 'number' || ty === 'tel' || e.inputMode === 'numeric' || e.inputMode === 'decimal') ? ' Faqat raqam yoziladi.' : '';
      return { h: '✏️ ' + n2, d: 'Bu katakka «' + n2 + '» yoziladi.' + num + ex };
    }
    var t = txt(e), short = t.length > 40 ? t.slice(0, 40) + '…' : t, d = '';
    for (var i = 0; i < KW.length; i++) if (KW[i][0].test(t)) { d = KW[i][1]; break; }
    if (e.closest('nav,.nav,#nav,#navIn,.tabs,[role=tablist]')) d = 'Bo\'lim: «' + short + '». Bossangiz shu bo\'limga o\'tadi.' + (d ? ' ' + d : '');
    else if (!d) d = t.length > 40 ? 'Bu qator ma\'lumoti. Bossangiz batafsili ochiladi.' : 'Bossangiz «' + short + '» ochiladi yoki bajariladi.';
    return { h: short || '•', d: d };
  }
  function auto(skip) {
    var Q = document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,[data-act],[data-a],[onclick],[role=button],[role=tab]');
    var out = [], seen = {}, grp = {};
    for (var i = 0; i < Q.length && out.length < 40; i++) { var e = Q[i]; if (!shown(e)) continue;
      if (skip.some(function (k) { return k === e || k.contains(e) || e.contains(k); })) continue;
      if (out.some(function (o) { return o.e.contains(e) || e.contains(o.e); })) continue;
      if (!/INPUT|SELECT|TEXTAREA/.test(e.tagName) && !txt(e)) continue;
      var x = describe(e), sig = x.h.slice(0, 30); if (seen[sig]) continue; seen[sig] = 1;
      var g = (e.parentElement ? e.parentElement.tagName + e.parentElement.className : '') + '|' + e.tagName + e.className;
      grp[g] = (grp[g] || 0) + 1; if (grp[g] > 3 && !/INPUT|SELECT|TEXTAREA/.test(e.tagName)) continue;
      out.push({ e: e, h: x.h, d: x.d }); }
    return out;
  }
  function steps() {
    var K1 = known(), S1 = K1.filter(function (x) { return !x.skip; }), all = S1.concat(auto(K1.map(function (x) { return x.e; })));
    var g = document.getElementById('yrdg'); if (g && g.style.display !== 'none') all.push({ e: g, h: '⚙ Sozlamalar', d: C.gd || 'Sozlamalar.' });
    all.forEach(function (x) { var r = x.e.getBoundingClientRect(); x.y = x.e === g ? -1 : r.top + scrollY; x.x = r.left; });
    all.sort(function (a, b) { return Math.abs(a.y - b.y) < 8 ? a.x - b.x : a.y - b.y; });
    return all.slice(0, 18);
  }
  function screenName() { var H = document.querySelectorAll('h1,h2,h3,.title,.ttl'); for (var i = 0; i < H.length; i++) { var e = H[i]; if (shown(e) && txt(e) && txt(e).length < 50 && e.getBoundingClientRect().top < innerHeight * 0.5) return txt(e); } return ''; }
  var css = '#yrdg,#yrdb{position:fixed;right:8px;z-index:2147482000;width:38px;height:38px;border-radius:50%;border:1px solid rgba(127,127,127,.25);padding:0;line-height:36px;text-align:center;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '#yrdg{top:calc(8px + env(safe-area-inset-top,0px));background:rgba(255,255,255,.82);color:#333;font-size:20px;box-shadow:0 1px 4px rgba(0,0,0,.18)}' +
    '#yrdb{top:calc(50px + env(safe-area-inset-top,0px));right:12px;width:30px;height:30px;line-height:28px;background:rgba(127,127,127,.12);color:rgba(110,110,110,.75);font-size:15px;font-weight:700;opacity:.5;box-shadow:none}' +
    '@media(prefers-color-scheme:dark){#yrdg{background:rgba(40,44,52,.85);color:#ddd}#yrdb{color:rgba(200,200,200,.7)}}' +
    '#yrd{position:fixed;inset:0;z-index:2147483001}#yrd .sh{position:fixed;inset:0;background:rgba(0,0,0,.55)}#yrd .sp{position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(0,0,0,.55);transition:all .3s;border:3px solid #fbbf24;animation:yglow 1.2s ease-in-out infinite}@keyframes yglow{50%{border-color:#fff}}' +
    '#yrd .bb{position:fixed;left:12px;right:12px;max-width:460px;margin:0 auto;background:#fff;color:#14171f;border-radius:16px;padding:14px 14px 10px;box-shadow:0 10px 30px rgba(0,0,0,.4);font:16px/1.45 system-ui,sans-serif;transition:top .3s}' +
    '#yrd .bb b{display:block;font-size:18px;margin-bottom:4px}#yrd .bb .nv{display:flex;gap:8px;margin-top:10px}#yrd .bb button{flex:1;padding:11px 6px;border-radius:12px;border:0;font-size:15px;font-weight:700;background:#e5e7eb;color:#111}#yrd .bb button.p{background:#2563eb;color:#fff}#yrd .bb small{color:#6b7280}';
  var O = null;
  function close() { if (O) { O.remove(); O = null; } }
  function start() {
    close();
    var L = steps(), o = document.createElement('div'); O = o; o.id = 'yrd';
    o.innerHTML = '<div class="sh"></div><div class="sp" hidden></div><div class="bb" role="dialog"></div>'; document.body.appendChild(o);
    var sh = o.querySelector('.sh'), sp = o.querySelector('.sp'), bb = o.querySelector('.bb'), k = -1, nm = screenName();
    function nav(last) { return '<div class="nv"><button data-y="b">‹ Orqaga</button><button data-y="x">Yopish</button><button class="p" data-y="n">' + (last ? 'Tushundim' : 'Keyingi ›') + '</button></div>'; }
    function draw() {
      if (k < 0) { sh.hidden = false; sp.hidden = true; bb.style.top = '22%';
        bb.innerHTML = '<b>' + (nm ? '📍 ' + nm : A.t) + '</b>' + (nm ? A.t + '. ' : '') + (A.i || '') + '<br><br>' + (L.length ? 'Shu ekrandagi ' + L.length + ' ta joyni birma-bir ko\'rsatib, nima qilishini aytaman.' : 'Bu ekranda tugma yo\'q.') +
          '<div class="nv"><button data-y="x">Yopish</button>' + (L.length ? '<button class="p" data-y="n">Ko\'rsatish ›</button>' : '') + '</div>'; return; }
      var it = L[k]; sh.hidden = true; if (it.e !== document.getElementById('yrdg')) { var r0 = it.e.getBoundingClientRect(); if (r0.top < 60 || r0.bottom > innerHeight - 60) it.e.scrollIntoView({ block: 'center' }); }
      bb.innerHTML = '<b>' + it.h + '</b>' + it.d + nav(k >= L.length - 1) + '<small>' + (k + 1) + ' / ' + L.length + '</small>';
      setTimeout(function () { if (!O) return;
        var r = it.e.getBoundingClientRect(), pad = 5; sp.hidden = false;
        sp.style.left = (r.left - pad) + 'px'; sp.style.top = (r.top - pad) + 'px'; sp.style.width = (r.width + pad * 2) + 'px'; sp.style.height = (r.height + pad * 2) + 'px';
        var bh = bb.offsetHeight + 14, below = r.bottom + 12; bb.style.top = (below + bh < innerHeight ? below : Math.max(8, r.top - bh)) + 'px'; }, 60);
    }
    /* Ilovaning o'z tugma tutqichlariga (o'chirish tasdig'i va h.k.) bosish yetib bormasin */
    function h(ev) { ev.stopPropagation(); var b = ev.target.closest && ev.target.closest('[data-y]'); if (ev.type !== 'click') return; ev.preventDefault();
      if (!b) return; var y = b.getAttribute('data-y');
      if (y === 'x') return close(); if (y === 'b') k = Math.max(-1, k - 1); if (y === 'n') { if (k >= L.length - 1) return close(); k++; } draw(); }
    ['click', 'pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(function (t) { o.addEventListener(t, h, true); });
    draw();
  }
  function tick() {
    var g = document.getElementById('yrdg'), b = document.getElementById('yrdb'), on = false;
    if (C.set) { try { on = !!C.on(); } catch (e) { on = false; } }
    if (g) g.style.display = on ? '' : 'none';
    if (b) b.style.top = on ? '' : 'calc(8px + env(safe-area-inset-top,0px))';
  }
  function init() {
    if (document.getElementById('yrdb')) return;
    var st = document.createElement('style'); st.textContent = css + (C.hide ? C.hide + '{display:none!important}' : '') + (C.pad || ''); document.head.appendChild(st);
    var g = document.createElement('button'); g.id = 'yrdg'; g.type = 'button'; g.textContent = '⚙'; g.setAttribute('aria-label', 'Sozlamalar'); g.style.display = 'none';
    g.addEventListener('click', function (ev) { ev.stopPropagation(); try { C.set(); } catch (e) {} }, true);
    var b = document.createElement('button'); b.id = 'yrdb'; b.type = 'button'; b.textContent = '?'; b.setAttribute('aria-label', 'Yordam: bu ekran qanday ishlaydi');
    b.addEventListener('click', function (ev) { ev.stopPropagation(); start(); }, true);
    document.body.appendChild(g); document.body.appendChild(b);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && O) close(); });
    tick(); setInterval(tick, 800);
  }
  window.yordamStart = function () { start(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); }); else setTimeout(init, 300);
})();
