# Ikkala ilovani yig'ib, GitHub Pages'ga yuboradi: https://muhtorxonaxrolxanov-alt.github.io/ilovalar/
# Ishlatish: powershell -ExecutionPolicy Bypass -File deploy.ps1 "nima o'zgardi"
param([string]$msg = "Yangilanish")
$ErrorActionPreference = 'Stop'
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;$env:Path"
$site = 'C:\Loyihalar\ilovalar-sayt'
# 0) Kodda sintaksis xatosi bo'lsa — saytga CHIQARMAYMIZ (2026-11-17: bitta tirnoq xatosi 222 Sotuvchini «Yuklanmoqda» da qotirgan edi)
$node = 'C:\Program Files\nodejs\node.exe'
foreach ($f in Get-ChildItem C:\Loyihalar\premium-xizmat\apps\src\*.js, C:\Loyihalar\nonvoyxona\src\*.js, C:\Loyihalar\ilovalar-sayt\yordam\yordam.js) {
  & $node --check $f.FullName 2>$null; if ($LASTEXITCODE -ne 0) { "XATO: $($f.Name) da sintaksis xatosi — yuborilmadi"; & $node --check $f.FullName; exit 1 } }
# 1) Yig'ish
Push-Location C:\Loyihalar\nonvoyxona\src; python build_web.py; Pop-Location
Push-Location C:\Users\user\Downloads\loyiha\web; python build_web.py; Pop-Location
$env:PYTHONUTF8 = '1'; python C:\Loyihalar\premium-xizmat\apps\web\build_web.py "$site\dokon"
# 2) Nusxalash
foreach ($d in 'nonvoyxona', 'hisob') { if (Test-Path "$site\$d") { Remove-Item "$site\$d" -Recurse -Force } }
Copy-Item C:\Loyihalar\nonvoyxona\web "$site\nonvoyxona" -Recurse
Copy-Item C:\Users\user\Downloads\loyiha\web\out "$site\hisob" -Recurse
# 2a) Har ilova papkasiga o'rnatish sahifasi (o.html) — Chrome aynan shu ilovani telefonga o'rnatadi
foreach ($d in 'hisob', 'hamyon', 'dokon\mijoz', 'dokon\sotuvchi', 'nonvoyxona\toshkent-rahbar', 'nonvoyxona\toshkent-hodim', 'nonvoyxona\namangan-rahbar', 'nonvoyxona\namangan-hodim') {
  if (Test-Path "$site\$d\manifest.webmanifest") { Copy-Item "$site\yuklash\o.html" "$site\$d\o.html" -Force } }
# 2b) Yuklab olish sahifasi uchun eng yangi APK lar (doimiy nom bilan)
New-Item -ItemType Directory -Force "$site\yuklash\apk" | Out-Null
Get-ChildItem "$site\android\out\*.apk" | Group-Object { $_.Name -replace '-[\d.]+\.apk$', '' } | ForEach-Object {
  $f = $_.Group | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  Copy-Item $f.FullName "$site\yuklash\apk\$($_.Name).apk" -Force }
# 3) Yuborish
Set-Location $site
git add -A
$ch = git status --porcelain
if (-not $ch) { "O'zgarish yo'q"; exit 0 }
git commit -q -m $msg
git push -q origin main
"Yuborildi: $msg"
