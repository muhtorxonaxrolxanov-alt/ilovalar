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
- Misol: 1-do'kon — 50 ta non, 2-do'kon — 20 ta non. Robot ichida esa 80 ta non bo'lishi mumkin. *(Keyinchalik aniqlandi: sig'im 64 ta non, 9-bo'limga qarang.)*
- **Non katalogi** ilova ichida saqlanadi: har bir nonning **nomi, turi, grammi (og'irligi) va o'lchami**.

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
  - 🗣 Muallif qarori: do'konchini **3–5 daqiqa** kutadi. Bu vaqt **rahbar ilovasida sozlanadi**.
  - 💡 Rahbar qo'ng'iroq qilgandan keyin ham do'konchi chiqmasa, robot nima qilishi aniq bo'lsin: yana kutadimi yoki keyingi do'konga o'tadimi. Buni rahbar ilovadan tanlasa bo'ladi.
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
- **Sig'im**: nonlar qirrasi bilan tik terilganda bitta qutiga **2 qator**, jami **32 ta non** sig'adi. 2 ta qutiga **64 ta non** sig'adi.
- **Nima uchun savat**: do'konchi nonni qo'lda ko'tarib kirmaydi. U **savatni oladi**, do'koniga kirib nonni tushiradi, keyin **savatni olib chiqib joyiga qo'yadi**. Robot shundan keyin hisoblaydi.
- Har bir savat ichida **alohida tarozi shart emas**.

💡 Claude fikri:
- **Banan qutisining odatiy o'lchami taxminan 50 × 40 × 24 sm.** Haqiqiy qutini o'lchab tasdiqlash kerak, chunki ba'zilari 52 × 39 sm bo'ladi.
- Yuk bo'limining ichki o'lchami (taklif): **~54 × 44 × 56 sm** (U × E × B). Bu ikki quti ustma-ust (48 sm), tepada ~5 sm zapas va savatcha dastalari uchun joy degani.
- Robotning taxminiy tashqi o'lchami:
  - uzunligi **~95–100 sm**: yuk bo'limi + old qism (ekran va batareya) ~30 sm;
  - eni **~60 sm**: tor trotuar va eshiklardan o'tishi uchun 65 sm dan oshmasin;
  - balandligi **~90 sm**: g'ildirak va yerdan masofa ~15 sm + yuk bo'limi + qopqoq. Ekran do'konchiga qulay balandlikda bo'ladi.
- **Sig'im 64 ta non** (2 × 32). Ilova bir reysga 64 tadan ortiq buyurtma berishga yo'l qo'ymasin. Ortig'i keyingi reysga o'tkazilsin.
- **Bitta umumiy tarozi** yuk bo'limi tagida bo'ladi. Hisoblash tartibi:
  1. savat olib ketilganda tarozi "savat yo'q" holatini ko'radi va kutadi;
  2. savat qaytib joyiga qo'yilgach, og'irlikni o'lchaydi;
  3. `olingan non = (avvalgi og'irlik − hozirgi og'irlik) ÷ bitta non og'irligi`;
  4. bo'sh savat og'irligi (tara) oldindan ilovada saqlanadi.
- Savat joyiga qo'yilganini **sensor** (konsevik) tekshirsin. Savat qaytarilmaguncha qopqoq yopilmasin. Belgilangan vaqtda qaytarilmasa, rahbarga xabar borsin.
- ⚠️ **Ustma-ust joylashuvning muammosi**: pastki savatni olish uchun avval ustidagisini olish kerak. Do'konchi bitta savatni ichkariga olib kirganda, ikkinchisi ochiq qopqoq ostida, ko'chada qarovsiz qoladi.
  - **Taklif: savatlarni uzunasiga yonma-yon** joylashtirish va **har biriga alohida qopqoq** qilish. Shunda faqat shu do'konga tegishli savat ochiladi, ikkinchisi qulflangan holda qoladi.
  - Yuk bo'limi pastroq bo'ladi (~30 sm) va robot ag'darilishga chidamliroq bo'ladi. Uzunligi esa ~130 sm gacha uzayadi, eni ~55–60 sm qoladi.
  - Ustma-ust joylashuv qolsa: **birinchi boradigan do'konning savati tepaga** qo'yilsin va qopqoq ochiq paytda kamera kuzatib tursin.
- Bir xil reysda **turli xil non** bo'lsa, faqat og'irlik bo'yicha sanash chalkashadi. Taklif: **har bir savatga bir tur non** solinsin yoki kamera turini aniqlasin.
- Savatlar robotga mahkam o'rnashsin, yo'lda silkinib ketmasin.

---

## 10. Ish tartibi, batareya va zaryad

🗣 Muallif:
- Masofalar har xil: **200 m, 300 m, 500 m, ~1 km** gacha.
- Robot **ertalabdan kechgacha** qatnaydi. Orada to'xtaydi ham: **non tandirdan chiqquncha kutiladi**, shu paytda zaryad oladi.
- Savol: har borib kelgandan keyin zaryadga qo'ygan yaxshimi yoki zaryad tugagandan keyinmi? Zaryad tugamasa bo'ldi, qolgani farqi yo'q.
- Hozircha **bitta robot**, keyinchalik robotlar ko'paytiriladi.

💡 Claude fikri — javob: **har reysdan keyin stansiyaga kirib zaryad olgani yaxshi.**
- Litiy batareyalar to'liq tugatilsa tez eskiradi. Ular uchun eng yaxshisi **20–80% oralig'ida** ishlash va tez-tez qisqa zaryad olish.
- **LiFePO4** turidagi batareyani tavsiya qilaman: xavfsiz, yonmaydi, 2000+ sikl chidaydi.
- Taxminiy hisob: yuklangan robot ~60–80 kg, 1 km lik do'konga borib kelish 2 km. Bunga ~0,1 kVt·soat sarflanadi. **24 V 30–40 Ah** (~0,7–1 kVt·soat) batareya bir zaryadda bir necha reysga yetadi. Har reysdan keyin zaryad olsa, batareya hech qachon tugamaydi.
- Batareya 20% dan kam qolsa, robot yangi reysni boshlamasin.
- Kelajakda robotlar ko'payishini hisobga olib, ilova va server **bir nechta robotni** boshqarishga mo'ljallab yoziladi.

---

## 11. To'lov va kassa

🗣 Muallif:
- To'lov **naqd yoki karta** orqali, asosan **naqd**.
- Do'konchi nonni olgach, ekranda **"Nasiya"** yoki **"Naqd"** tugmasini bosadi.
  - **Nasiya** bo'lsa, qarz yozib qo'yiladi.
  - **Naqd** bo'lsa, do'konchi pulni **maxsus joyga** qo'yadi va robot uni **sanab oladi**.
- Sanalgan pul robotning **seyfiga** tushadi. Seyfni **faqat rahbar** ochadi.
- Pul **hisoboti rahbar ilovasiga** yuborilib turadi.

💡 Claude fikri:
- Pulni sanash uchun **kupyura qabul qilgich** (bill acceptor) kerak. Bu to'lov terminallaridagi qurilma: pulni bittalab oladi, haqiqiyligini tekshiradi va **qulflanadigan kassetaga** (seyf) soladi. O'zbekistonda bunday terminallar ko'p, shuning uchun so'm kupyuralarini taniydigan qabul qilgichni topsa bo'ladi.
- ⚠️ **Robot qaytim bera olmaydi.** Taklif:
  - ortiqcha berilgan pul do'konning **avansi** (keyingi safarga oldindan to'lov) deb yoziladi;
  - kam berilgan pul **nasiya** deb yoziladi;
  - bitta to'lovda **bir qismi naqd, bir qismi nasiya** bo'lishi mumkin.
- **Karta** uchun eng oddiy va arzon yo'l: ekranda **QR kod** chiqadi (Click, Payme yoki Uzum orqali to'lov) va to'lov ilovaga avtomatik tushadi. Alohida karta terminali keyinroq qo'shilishi mumkin.
- Ilovada har bir do'kon uchun **qarz/avans balansi** va kunlik hisobot yuritiladi.
- Nasiyani do'konchi yuz yoki parol bilan tasdiqlaydi. Shunda keyin "men olmaganman" degan bahs chiqmaydi.
- ⚠️ **Pul tashiydigan robot o'g'rilar uchun nishonga aylanadi.** Shuning uchun:
  - seyf korpusga ichkaridan murvat bilan mahkamlansin;
  - robotni ko'tarish, ag'darish yoki buzishga urinilsa, **sirena** chalinsin va rahbarga xabar borsin;
  - GPS doim kuzatib tursin;
  - kamera hammasini yozib olsin.

---

## 12. Taxminiy byudjet (minimal prototip)

🗣 Muallif: mablag' hali aniq emas, Claude minimal hisob qilsin. **Korpus avval oddiy yasaladi** (taxta yoki boshqa arzon materialdan), keyin yaxshirog'iga almashtiriladi.

💡 Claude hisobi. Narxlar taxminiy va o'zgarib turadi. Ishlatilgan (b/u) qismlar bilan arzonlashadi.

| Qism | Nima | Taxminiy narx ($) |
|---|---|---|
| G'ildirak va motorlar | 1–2 ta b/u giroskuter (hoverboard): motor-g'ildiraklar va kontroller | 80–150 |
| Batareya | LiFePO4 24 V 30 Ah + zaryadlovchi | 180–280 |
| "Miya" | Raspberry Pi 5 (8 GB) + ESP32 mikrokontroller | 100–120 |
| Kameralar | 3 ta oddiy kamera (oldi, ichki, yuz uchun) | 60–120 |
| LiDAR | RPLIDAR C1 yoki A1 | 70–100 |
| Yaqin sensorlar | 6–8 ta ultratovush + 4 ta pastga qaragan masofa sensori | 40–60 |
| Navigatsiya | GPS moduli + IMU | 30–60 |
| Aloqa | 4G modem + SIM karta | 40–80 |
| Ekran | 7–10" sensorli ekran | 60–100 |
| Tarozi | 4 ta tenzodatchik + HX711 | 20–30 |
| Qopqoq | elektr qulf + qopqoqni ochadigan aktuator | 50–90 |
| Xavfsizlik | bamper, avariya tugmasi, chiroqlar, karnay, sirena | 30–50 |
| Simlar va boshqalar | sug'urtagichlar, DC-DC, ulagichlar | 60–100 |
| Korpus | fanera yoki taxta, ramka, bo'yoq, suvdan himoya | 50–120 |
| Zaryad stansiyasi | oddiy ramka, kontaktlar, qulf | 50–120 |
| **Jami (kassasiz)** | | **~$1 000 – 1 600** |
| Kassa | kupyura qabul qilgich (b/u yoki yangi) + seyf | 150–400 |
| **Jami (kassa bilan)** | | **~$1 200 – 2 000** |

- So'mda taxminan **15–25 mln so'm** (dollar kursiga qarab).
- Zaxira uchun yana **~15%** qo'shib qo'yish kerak: biror qism kuyishi, almashtirilishi yoki yetkazib berish narxi bo'lishi mumkin.
- **Yaxshiroq variant (~$2 500 – 3 500)**: kuchli sun'iy intellekt plata (Jetson Orin Nano), chuqurlik kamerasi, santimetr aniqlikdagi RTK GPS. Avtonom yurish va svetoforni tanish ancha ishonchli bo'ladi.
- Doimiy xarajatlar: SIM internet, server yoki hosting (oyiga taxminan $5–15), elektr.
- Dasturiy qism (robot dasturi, rahbar ilovasi, do'konchi ekrani) Claude bilan birga yoziladi.

---

## 13. Bosqichlar (taklif)

💡 Claude fikri. Hammasini birdaniga emas, bosqichma-bosqich qilamiz. Har bosqich oxirida ishlaydigan narsa bo'ladi.

1. **Shassi** (~$400–500): giroskuter g'ildiraklari, batareya va fanera ramka. Robot telefondan pult kabi boshqariladi. *Natija: robot yuradi.*
2. **Yuk bo'limi**: savatlar, tarozi, ekran va qopqoq qulfi. Non solish va topshirish stolda sinab ko'riladi. *Natija: non sanaladi va topshiriladi.*
3. **Rahbar ilovasi**: xarita, holatlar, buyurtma, non katalogi va jonli kamera. *Natija: hammasi ilovada ko'rinadi.*
4. **Yo'l o'rgatish va o'zi yurish**: o'rgatilgan yo'ldan yuradi, to'siqda to'xtaydi yoki aylanib o'tadi, qiyin joyda rahbarni chaqiradi. *Natija: robot o'zi qatnaydi.*
5. **Svetofor va xavfsizlik**: svetoforni tanish, odamlardan qochish, avariya to'xtashi.
6. **Kassa va yuz tanish**: kupyura qabul qilgich, seyf, nasiya va avans hisobi, yuz yoki parol bilan ochish.
7. **Mustahkam korpus**: metall yoki plastik, suvdan himoyalangan.
8. **Ko'paytirish**: ikkinchi robot va ko'p robotni boshqarish.

---

## 14. Hozircha aniqlanmagan masalalar

❓ Ochiq savollar:
1. ~~Zaryad stansiyasi qayerda?~~ **Hal bo'ldi: nonvoyxona oldida.**
2. ~~Sig'im~~ **Hal bo'ldi: 64 ta non (2 × 32). Non turlari, grammi va o'lchami ilovada saqlanadi.**
3. Nonni issiq saqlash kerakmi (isitgich, termoizolyatsiya)?
4. ~~Ob-havo~~ **Hal bo'ldi: yomg'ir, qor, har qanday sharoitda yuradi.**
5. ~~Masofa~~ **Hal bo'ldi: 200 m – 1 km, kun bo'yi qatnaydi, har reysdan keyin zaryad oladi (10-bo'lim).**
6. ~~Pul hisobi~~ **Hal bo'ldi: naqd/karta, nasiya, seyf (11-bo'lim).**
7. ~~Robotlar soni~~ **Hal bo'ldi: hozircha bitta, keyin ko'payadi.**
8. Rahbar ilovasi mavjud `nonvoyxona`/`dokon` ilovalariga qo'shiladimi yoki alohida bo'ladimi?
9. Robot ko'chada yurishi uchun qonuniy ruxsat kerakmi? Mahalliy qoidalarni aniqlash kerak.
10. ~~Byudjet~~ **Qisman: korpus avval oddiy yasaladi; taxminiy hisob 12-bo'limda.** Bosqichlar rejasini (13-bo'lim) tasdiqlash kerak.
11. Savatlar ustma-ustmi yoki yonma-yon (alohida qopqoq bilan)? (9-bo'lim)
12. Nonni issiq saqlash kerakmi?
13. Robot qorong'ida (erta tong, kechqurun) ham yuradimi?
14. Ortiqcha to'langan pul avans, kam to'langani nasiya deb yozilsinmi? (11-bo'lim)
