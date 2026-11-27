# Non tarqatuvchi robot — loyiha hujjati

Nonvoyxonadan do'konlarga non tarqatadigan to'rt burchak (quti shaklidagi) robot.

Belgilar:
- **🗣 Muallif** — loyiha egasining talablari (aytilgan gaplar asosida, ma'nosi o'zgartirilmagan).
- **💡 Claude fikri** — Claudening taklif va izohlari. Bular hali tasdiqlanmagan.
- **❓ Ochiq savol** — hal qilinishi kerak bo'lgan masalalar.

---

## 1. Zaryad stansiyasi

🗣 Muallif:
- Zaryad stansiyasi **nonvoyxona oldida, tashqarida** turadi. *(Tuzatish: avval "do'kon yonida" deyilgan edi, muallif adashganini aytdi.)*
- Stansiya bir joyga **qattiq qotirilgan** bo'ladi.
- Robot stansiyaga kirganda **avtomatik qulflanadi**. Uni hech kim olib keta olmaydigan darajada mahkam bo'lishi kerak.
- Robot stansiyada turadi va **faqat rahbar ilovasidan buyruq berilgandagina** yo'lga chiqadi.

💡 Claude fikri:
- Qulf: elektromagnit qulf + mexanik ilmoq (zasov) birga bo'lsin. Tok o'chsa ham qulf ochilib ketmasligi kerak (fail-secure).
- Zaryadlash kontaktlari (pogo-pin yoki kontakt plastinalar) robot pastida bo'lsa, yomg'ir va qordan himoyalangan bo'ladi.
- Stansiyaga soyabon yoki tom qo'yish kerak, robot quyosh va yomg'irdan saqlanadi.
- Stansiyada kamera bo'lsa, buzishga urinish bo'lganda rahbarga xabar boradi.

---

## 2. Buyurtma berish (rahbar ilovasi)

🗣 Muallif:
- Rahbar ilovasida **do'konlar joylashuvi belgilanadi**.
- Rahbar har bir do'kon uchun **nechta non** kerakligini kiritadi va **"Non soling"** tugmasini bosadi.
- Misol: 1-do'kon — 50 ta non, 2-do'kon — 20 ta non. Robot ichida esa 80 ta non bo'lishi mumkin.

💡 Claude fikri:
- Ilova robot sig'imidan ortiq non buyurtma qilishga ruxsat bermasin (masalan, sig'im 80 ta bo'lsa, ogohlantirish chiqarsin).
- Ortiqcha non (masalan, 80 − 70 = 10 ta) qaytib keladi. Ilova buni "qaytgan non" deb hisobga olsin.

---

## 3. Non solish (nonvoyxonada)

🗣 Muallif:
- Nonvoy yoki ichkaridagi sotuvchi nonni **robot ichiga soladi**.
- Robotda **ekran** bo'ladi. Ekranda **nechta non solingani** yozilib turadi.
- Rahbar ilovasiga ham **"shuncha non solindi"** degan xabar keladi va ilovada ko'rinib turadi.
- Shundan keyin robot **yo'lga chiqadi**.

💡 Claude fikri:
- Nonlar sonini **tarozi** orqali hisoblash mumkin: umumiy og'irlik ÷ bitta non o'rtacha og'irligi. Bu 4-bo'limdagi tarozi bilan bir xil tizim.
- Robot nonni solish tugagach o'zi ketmasin. Nonvoy ekranda **"Tayyor"** tugmasini bossin, keyin rahbarga "yo'lga chiqdi" deb xabar borsin.

---

## 4. Yo'lda harakatlanish

🗣 Muallif:
- Robot **faqat trotuar** (piyodalar yo'lakchasi) bo'ylab yuradi.
- Yo'lda **to'siqlar, chuqurlar, sun'iy to'siqlar, bordyurlarni** sensorlar orqali o'zi ko'rib, **aylanib o'tadi** yoki qandaydir yo'l bilan o'tadi.
- Yo'lni kesib o'tish kerak bo'lganda **piyodalar o'tish joyidan** o'tadi.
- **Svetoforni ko'radi**: **yashil** chiroqda o'tadi, **qizil** chiroqda to'xtab kutadi.
- **Odamlar va mashinalar**: yo'lda odam chiqsa, robot uni **hech qachon urib yubormasligi** kerak. Odam yoki mashina o'tguncha **to'xtab turadi** yoki **aylanib o'tadi**.
- **Svetofordan o'ta olmasa**:
  - Robot avvalo **o'zi o'tishga harakat qiladi**. Rahbarni keraksiz bezovta qilmasligi kerak.
  - Agar baribir o'ta olmasa, rahbar ilovasiga **bildirishnoma yoki qo'ng'iroq** keladi.
  - Rahbar uni bosib, robotni **real vaqt rejimida o'zi boshqaradi** va svetofordan o'tkazib qo'yadi.
  - Keyin **"Yo'lni davom ettirish"** tugmasini bosadi va robot qolgan yo'lni yana o'zi yuradi.
- **Faqat svetoforda emas**: yo'lda o'ta olmaydigan to'siq bo'lsa yoki **yo'l yopilgan** bo'lsa ham, robot rahbarga xabar beradi va rahbar uni boshqaradi.
- **Ob-havo**: yomg'ir, qor, har qanday sharoitda yurishi kerak.

💡 Claude fikri:
- Sensorlar to'plami (taklif):
  - **Kameralar** (oldi va yonlarda): svetofor chirog'ini tanish, odamlarni va to'siqlarni ko'rish uchun.
  - **LiDAR yoki chuqurlik kamerasi**: to'siq masofasini aniq o'lchaydi.
  - **Ultratovush sensorlari**: yaqin masofadagi to'siqlar uchun arzon zaxira.
  - **Pastga qaragan sensorlar**: chuqur va bordyur chetini sezib, yiqilib tushishdan saqlaydi.
  - **GPS (RTK) + IMU + g'ildirak enkoderlari**: aniq joylashuv uchun.
- Svetoforni faqat kamera bilan tanish xavfli: quyosh nuri, tuman, singan chiroq bo'lishi mumkin. Shuning uchun:
  - yashilni ko'rgandan keyin ham **yo'lda mashina yo'qligini tekshirib** o'tsin;
  - yashil yonib turganiga ancha bo'lgan bo'lsa (tez orada qizil yonadi), **keyingi yashilni kutsin**;
  - svetoforni aniqlay olmasa, to'xtab **rahbarga signal** bersin.
- Notekis yo'l va bordyurlar uchun **6 g'ildirakli** shassi tavsiya qilaman.
- Piyodalar orasida tezlik past bo'lsin: taxminan 4–6 km/soat, odam yurishi tezligida.
- **Har qanday ob-havo uchun**:
  - korpus va elektronika **suv va changdan himoyalangan** bo'lsin (kamida IP65);
  - qishda **litiy batareya 0°C dan past haroratda zaryadlanmaydi**. Batareya isitgichi kerak, stansiya ham isitiladigan bo'lsa yaxshi;
  - kamera oynalari qor va bug'dan to'silmasligi uchun **isitiladigan** bo'lsin;
  - g'ildiraklar chuqur protektorli bo'lsin.
  - Ochig'ini aytsam, **chuqur qor va muz** kichik robotlar uchun eng og'ir sharoit. Bunday kunlarda robot rahbarni ko'proq chaqiradi.
- **Odam xavfsizligi** (eng muhim qoida: robot doim yo'l beradi):
  - odamdan kamida ~1 m masofa saqlasin, yaqinlashsa sekinlashsin va to'xtasin;
  - korpus atrofida **yumshoq bamper va tegish sensori** bo'lsin: tegsa, darhol to'xtaydi;
  - korpusda qizil **avariya to'xtatish tugmasi** bo'lsin;
  - bola yoki hayvon kutilmaganda chiqib qolishi mumkin, shuning uchun tormoz masofasi qisqa bo'lsin.
- **Rahbar boshqaruvi uchun**:
  - robotda **4G/5G modem** va jonli video kerak, kechikish kam bo'lishi shart;
  - aloqa uzilib qolsa, robot **darhol joyida to'xtaydi**, boshqaruvsiz yurmaydi;
  - rahbarni qachon chaqirishni aniq qoida bilan belgilash kerak. Masalan: 2 ta to'liq svetofor siklida o'ta olmasa yoki svetoforni umuman taniy olmasa;
  - rahbar boshqargan har bir holat yozib olinsin. Keyinchalik robotni shu joylardan o'zi o'tishga o'rgatish uchun kerak bo'ladi.

---

## 5. Kuzatuv — har bir harakat rahbar ilovasida ko'rinadi

🗣 Muallif:
- Robotning **har bir harakati** rahbar ilovasida ko'rinib turishi kerak:
  - **qayerda** (xaritada joylashuvi);
  - **nima qilyapti**: svetoforda turibdimi, do'kon oldidami, nonvoyxona oldidami va hokazo.

💡 Claude fikri — ilovada ko'rinadigan holatlar ro'yxati (taklif):

| Holat | Izoh |
|---|---|
| Stansiyada, zaryadlanmoqda | Batareya foizi bilan |
| Non solinmoqda | Nonvoyxonada |
| Yo'lda | Qaysi do'konga ketayotgani |
| Svetoforda kutmoqda | |
| To'siqni aylanib o'tmoqda | |
| Do'kon oldida, do'konchini kutmoqda | |
| Non topshirilmoqda | |
| Qaytmoqda | |
| Muammo / yordam kerak | Masalan, yo'l to'silgan yoki qopqoq buzilgan |

- Qo'shimcha: batareya foizi, robotdagi non soni va **jonli kamera** ko'rinishi.

---

## 6. Do'konga yetib kelish va non topshirish

🗣 Muallif:
- Robot do'kon oldiga kelganda do'konchiga **signal beradi**. Do'konchi chiqadi.
- Ekranda **"Siz uchun ajratilgan non: N ta"** deb ko'rsatadi.
- Do'konchi rozi bo'lsa, **ptichkani (✓)** bosadi va **qopqoq ochiladi**.
- **Kim ochishi mumkin**: qopqoq faqat shu do'konchi tasdiqlangandan keyin ochiladi.
  - Robot do'konchini **yuzidan tanisa, avtomatik ochiladi**.
  - Yuzini taniy olmasa, do'konchi **parol** teradi, keyin ochiladi.
- Agar do'konchiga **kamroq non** kerak bo'lsa, ekranga kerakli sonni yozadi (masalan, "menga 30 ta kerak"), tasdiqlaydi va qopqoq ochiladi.
- Do'konchi nonni oladi, keyin **qopqoq yopiladi va yana qulflanadi**.
- **Tarozi** bo'lsa yaxshi bo'ladi. Nonlarning grammi deyarli bir xil, oz-moz farq qilishi mumkin. Robot nechta non olinganini **ham ko'rib, ham tarozida o'lchab** bilishi kerak.
  - Misol: do'konchi 30 ta olmoqchi edi va 30 ta oldi. Tarozi o'lchaydi: "30 ta non olindi, to'g'ri." Qopqoq yopiladi va qulflanadi.

💡 Claude fikri:
- **Signal**: ovozli signal va chiroq. Bundan tashqari do'konchi telefoniga **SMS yoki Telegram xabar** ("Robot keldi") borsin, shunda do'konchi ichkarida bo'lsa ham bilib oladi.
  - 🗣 Muallif qarori: robot yetib borgach, **do'konchining telefoniga qo'ng'iroq boradi**.
  - 🗣 Muallif qarori: do'konchi **chiqmasa**, robot rahbar ilovasiga xabar beradi va **rahbar do'konchiga telefon qiladi**.
  - 💡 Avtomatik qo'ng'iroq uchun telefon xizmati (SIM-modem yoki internet orqali qo'ng'iroq xizmati) kerak bo'ladi.
  - 💡 Rahbarga xabar berishdan oldin necha daqiqa kutishni belgilash kerak, masalan 3–5 daqiqa. Shu vaqt ichida rahbar qo'ng'iroq qilmasa, robot nima qilishi ham aniq bo'lsin: kutishda davom etadimi yoki keyingi do'konga o'tadimi.
- **Yuz tanish bo'yicha**:
  - har bir do'konga **bir nechta odamning yuzi** ro'yxatga olinsin (do'konchi, sotuvchilar). Rahbar ularni ilovadan qo'shadi va o'chiradi;
  - **rasm yoki telefondagi suratni ko'rsatib aldash** mumkin. Shuning uchun "tirik odam" tekshiruvi (liveness, chuqurlik kamerasi) kerak;
  - kechqurun, quyosh qarshisida yoki qishda (sharf, shapka bilan) yuzni tanish qiyinlashadi. Shuning uchun parol zaxirasi to'g'ri qaror;
  - yuz shaxsiy biometrik ma'lumot hisoblanadi. Do'konchilardan **rozilik** olish va ma'lumotni xavfsiz saqlash kerak;
  - parol bir necha marta xato terilsa, vaqtincha bloklansin va rahbarga xabar borsin.
- **Tarozi bilan hisoblash**: bitta non og'irligi, masalan, 250 g ± 15 g. Hisob: `olingan non = (oldingi og'irlik − hozirgi og'irlik) ÷ o'rtacha og'irlik`, eng yaqin butun songa yaxlitlanadi. 80 ta nongacha bu usul ishonchli ishlaydi. Har kuni birinchi partiyada o'rtacha og'irlikni qayta o'lchab, kalibrlash mumkin.
- **Kamera** ichki bo'limda bo'lsa, tarozini tekshirib turadi (ikki usul solishtiriladi).
- **Farq chiqsa**: masalan, 30 ta deyilgan, 32 ta olingan. Ekranda ogohlantirish chiqsin, rahbarga xabar borsin. Do'konchi tasdiqlagandan keyin haqiqiy son yozilsin.
- **Qopqoq ochiq qolib ketsa**: masalan, 2 daqiqadan keyin signal bersin, rahbarga xabar ketsin.
- Do'kon kamroq olsa, qolgan non **keyingi do'konlarga yoki qaytib nonvoyxonaga** boradi. Ilova buni hisobga oladi.

---

## 7. Keyingi do'kon va qaytish

🗣 Muallif:
- Birinchi do'kondan keyin **ikkinchi do'konga** boradi va u yerda ham xuddi shunday non beradi.
- Keyin **qaytadi**: kelgan yo'lidan yoki **yaqinroq yo'ldan**.
- Yana **zaryad stansiyasiga kiradi va qulflanadi**.
- Keyingi safar **faqat rahbar buyruq berganda** chiqadi.

💡 Claude fikri:
- Batareya kam qolsa (masalan, 20% dan past), qolgan do'konlarni bekor qilib, stansiyaga qaytsin va rahbarga xabar bersin.
- Do'konlar tartibini ilova o'zi eng qisqa yo'l bo'yicha tuzib bersin, rahbar xohlasa o'zgartira olsin.

---

## 8. Do'kon joylashuvini aniqlash va yo'l o'rgatish

🗣 Muallif — ikki variant, ikkalasi ham ma'qul:
1. **Avtomatik**: rahbar ilovada joylashuvni belgilaydi, robot o'zi yo'l topib boradi.
2. **Bir marta o'rgatish**: robotni bir marta yo'l bo'ylab olib borib-kelib, yo'l ko'rsatiladi. Keyin robot shu yo'ldan yuradi.
   - Misol: bitta yo'l bo'ylab **3 ta do'kon** ko'rsatildi. Keyinchalik **faqat 3-do'konga** borish kerak bo'lsa, robot shu yo'l orqali **faqat 3-do'konga** boradi (1- va 2-do'konlarda to'xtamaydi).

💡 Claude fikri:
- **Boshida 2-variantni (o'rgatish) tavsiya qilaman.** U ancha ishonchli: robot oldindan tekshirilgan, xavfsiz trotuar va o'tish joylaridan yuradi. Xaritalardagi (Google, Yandex) trotuar ma'lumotlari ko'pincha noaniq bo'ladi.
- O'rgatish usuli: robotni telefondan pult kabi boshqarib olib boriladi. Robot yo'lni, svetoforlar va o'tish joylarini, do'kon nuqtalarini yozib oladi.
- O'rgatilgan yo'llar **tarmoq** (graf) kabi saqlansin: nuqtalar — do'konlar, svetoforlar, burilishlar. Shunda robot istalgan do'konlar to'plamiga eng qisqa yo'lni o'zi tuza oladi va 3-do'konga borishda 1- va 2-do'konlarda to'xtamaydi.
- Keyinchalik, tizim ishonchli bo'lgach, 1-variantni (avtomatik) qo'shamiz.

---

## 9. Robot tuzilishi va o'lchami

🗣 Muallif:
- Robot ichida **1 yoki 2 ta konteyner** bo'ladi: **ustma-ust** yoki **yonma-yon**.
- Konteynerlar tepasida **ko'tarish uchun dastasi** bo'ladi, xuddi do'konlardagi **savatcha (korzinka)** kabi.
- Tuzilishi:
  - **old tomonda ekran**;
  - **ekran tagida akkumulyator va "miya"** (boshqaruv elektronikasi);
  - **orqa tomonda yuk mashinasidek bagaj** (yuk bo'limi).
- O'lcham: yuk bo'limiga **2 ta banan qutisi ustma-ust** sig'ishi va **tepasida ozgina zapas** qolishi kerak.

💡 Claude fikri:
- **Banan qutisining odatiy o'lchami taxminan 50 × 40 × 24 sm.** Haqiqiy qutini o'lchab tasdiqlash kerak, chunki ba'zilari 52 × 39 sm bo'ladi.
- Yuk bo'limining ichki o'lchami (taklif): **~54 × 44 × 56 sm** (U × E × B). Bu ikki quti ustma-ust (48 sm), tepada ~5 sm zapas va savatcha dastalari uchun joy degani.
- Robotning taxminiy tashqi o'lchami:
  - uzunligi **~95–100 sm**: yuk bo'limi + old qism (ekran va batareya) ~30 sm;
  - eni **~60 sm**: tor trotuar va eshiklardan o'tishi uchun 65 sm dan oshmasin;
  - balandligi **~90 sm**: g'ildirak va yerdan masofa ~15 sm + yuk bo'limi + qopqoq. Ekran do'konchiga qulay balandlikda bo'ladi.
- ⚠️ **Sig'im bo'yicha muhim hisob.** Obi non diametri ~20–22 sm, qalinligi ~4–5 sm bo'lsa:
  - yotqizib solinganda bitta qutiga ~10–12 ta sig'adi;
  - qirrasi bilan tik terib qo'yilganda bitta qutiga ~20–24 ta sig'adi.
  - Demak 2 ta qutiga **taxminan 20–45 ta non** sig'adi, avvalgi misoldagi 80 ta emas. 80 ta non kerak bo'lsa, quti kattaroq bo'lishi yoki robot 2 marta borishi kerak. Nonning aniq o'lchamini bilib, qayta hisoblaymiz.
- **Tarozi**: har bir konteyner tagida **alohida tarozi** bo'lsin. Shunda qaysi savatdan nechta non olingani ham ma'lum bo'ladi.
- **Savat butunlay ko'tarib olinsa**, tarozi buni "hamma non olindi" deb tushunishi mumkin. Shuning uchun:
  - savatda **joyida turgani sensori** (konsevik) bo'lsin;
  - qopqoq yopilishidan oldin savat joyiga qaytarilganini tekshirsin;
  - savat qaytarilmasa, rahbarga xabar borsin.
- Savatlar robotga mahkam o'rnashsin, yo'lda silkinib ketmasin.

---

## 10. Hozircha aniqlanmagan masalalar

❓ Ochiq savollar:
1. ~~Zaryad stansiyasi qayerda?~~ **Hal bo'ldi: nonvoyxona oldida.**
2. ~~Sig'im~~ **Qisman hal bo'ldi: 2 ta banan qutisi hajmi (9-bo'lim).** Hali kerak: nonning aniq diametri, qalinligi va og'irligi, qanday turlari bor.
3. Nonni issiq saqlash kerakmi (isitgich, termoizolyatsiya)?
4. ~~Ob-havo~~ **Hal bo'ldi: yomg'ir, qor, har qanday sharoitda yuradi.**
5. Eng uzoq do'kon qancha masofada? Bir zaryadda necha marta borib kelishi kerak?
6. Pul hisobi ham bo'ladimi? Masalan, do'konchi non uchun qarzdor bo'lib qolsa, ilovada yozilib boradimi?
7. Bir nechta robot bo'ladimi yoki bitta?
8. Rahbar ilovasi mavjud `nonvoyxona`/`dokon` ilovalariga qo'shiladimi yoki alohida bo'ladimi?
9. Robot ko'chada yurishi uchun qonuniy ruxsat kerakmi? Mahalliy qoidalarni aniqlash kerak.
10. Byudjet va bosqich: avval kichik prototip qilamizmi?
