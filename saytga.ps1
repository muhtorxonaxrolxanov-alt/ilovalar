# Ikkala ilovani yig'ib, GitHub Pages'ga yuboradi: https://muhtorxonaxrolxanov-alt.github.io/ilovalar/
# Ishlatish: powershell -ExecutionPolicy Bypass -File deploy.ps1 "nima o'zgardi"
param([string]$msg = "Yangilanish")
$ErrorActionPreference = 'Stop'
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;$env:Path"
$site = 'C:\Loyihalar\ilovalar-sayt'
# 0) Kodda sintaksis xatosi bo'lsa — saytga CHIQARMAYMIZ (2026-11-17: bitta tirnoq xatosi 222 Sotuvchini «Yuklanmoqda» da qotirgan edi)
$node = 'C:\Program Files\nodejs\node.exe'
foreach ($f in Get-ChildItem C:\Loyihalar\premium-xizmat\apps\src\*.js, C:\Loyihalar\nonvoyxona\src\*.js, C:\Loyihalar\ilovalar-sayt\yordam\yordam.js, C:\Loyihalar\jarvis\jv-api.js, C:\Loyihalar\jarvis\server.js) {
  & $node --check $f.FullName 2>$null; if ($LASTEXITCODE -ne 0) { "XATO: $($f.Name) da sintaksis xatosi — yuborilmadi"; & $node --check $f.FullName; exit 1 } }
# 1) Yig'ish
Push-Location C:\Loyihalar\nonvoyxona\src; python build_web.py; Pop-Location
Push-Location C:\Users\user\Downloads\loyiha\web; python build_web.py; Pop-Location
$env:PYTHONUTF8 = '1'; python C:\Loyihalar\premium-xizmat\apps\web\build_web.py "$site\dokon"
Push-Location C:\Loyihalar\hamyon; python build.py; Pop-Location
Push-Location C:\Loyihalar\jarvis; python build_web.py; Pop-Location
# 2) Nusxalash
foreach ($d in 'nonvoyxona', 'hisob') { if (Test-Path "$site\$d") { Remove-Item "$site\$d" -Recurse -Force } }
Copy-Item C:\Loyihalar\nonvoyxona\web "$site\nonvoyxona" -Recurse
Copy-Item C:\Users\user\Downloads\loyiha\web\out "$site\hisob" -Recurse
# 2-) Shogird — alohida manzilda (…/ilovalar/shogird/): hisob/ ichida tursa, telefonda Hisob-kitob o'rnatilgan bo'lsa o'sha ilova ichida ochilib, o'rnatish chiqmasdi (2026-11-17)
if (Test-Path "$site\shogird") { Remove-Item "$site\shogird" -Recurse -Force }
Move-Item "$site\hisob\shogird" "$site\shogird"
New-Item -ItemType Directory -Force "$site\hisob\shogird" | Out-Null
'<!doctype html><meta charset="utf-8"><script>location.replace("../../shogird/"+location.search)</script>' | Out-File "$site\hisob\shogird\index.html" -Encoding utf8
Copy-Item "$site\hisob\shogird\index.html" "$site\hisob\shogird\o.html"
# 2a) Har ilova papkasiga o'rnatish sahifasi (o.html) — Chrome aynan shu ilovani telefonga o'rnatadi
foreach ($d in 'hisob', 'shogird', 'hamyon', 'jarvis', 'dokon\mijoz', 'dokon\sotuvchi', 'nonvoyxona\toshkent-rahbar', 'nonvoyxona\toshkent-hodim', 'nonvoyxona\namangan-rahbar', 'nonvoyxona\namangan-hodim') {
  if (Test-Path "$site\$d\manifest.webmanifest") { Copy-Item "$site\yuklash\o.html" "$site\$d\o.html" -Force } }
# 2a2) iPhone uchun o'rnatish fayli (ilova.mobileconfig) har ilova papkasiga
python "$site\yuklash\mk_clip.py" $site 'hisob' 'shogird' 'hamyon' 'dokon\mijoz' 'dokon\sotuvchi' 'nonvoyxona\toshkent-rahbar' 'nonvoyxona\toshkent-hodim' 'nonvoyxona\namangan-rahbar' 'nonvoyxona\namangan-hodim'
# 2a3) Faqat yuklab olish havolalari: …/ilovalar/y/<ilova>/ (sayt ochilmaydi — APK yoki iPhone profili darhol)
python "$site\yuklash\mk_dl.py" $site
# 2b) Yuklab olish sahifasi uchun eng yangi APK lar (doimiy nom bilan)
New-Item -ItemType Directory -Force "$site\yuklash\apk" | Out-Null
Get-ChildItem "$site\android\out\*.apk" | Group-Object { $_.Name -replace '-[\d.]+\.apk$', '' } | ForEach-Object {
  $f = $_.Group | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  Copy-Item $f.FullName "$site\yuklash\apk\$($_.Name).apk" -Force }
# 2c) Hamma ilova darhol ochilsin: avval telefondagi nusxa, ochilish ekrani (2026-11-24)
python "$site\yordam\tez.py" $site
# 3) Yuborish
Set-Location $site
git add -A
$ch = git status --porcelain
if (-not $ch) { "O'zgarish yo'q"; exit 0 }
git commit -q -m $msg
git push -q origin main
"Yuborildi: $msg"
