# Ikkala ilovani yig'ib, GitHub Pages'ga yuboradi: https://muhtorxonaxrolxanov-alt.github.io/ilovalar/
# Ishlatish: powershell -ExecutionPolicy Bypass -File deploy.ps1 "nima o'zgardi"
param([string]$msg = "Yangilanish")
$ErrorActionPreference = 'Stop'
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;$env:Path"
$site = $PSScriptRoot
# 1) Yig'ish
Push-Location C:\Loyihalar\nonvoyxona\src; python build_web.py; Pop-Location
Push-Location C:\Users\user\Downloads\loyiha\web; python build_web.py; Pop-Location
$env:PYTHONUTF8 = '1'; python C:\Loyihalar\premium-xizmat\apps\web\build_web.py "$site\dokon"
# 2) Nusxalash
foreach ($d in 'nonvoyxona', 'hisob') { if (Test-Path "$site\$d") { Remove-Item "$site\$d" -Recurse -Force } }
Copy-Item C:\Loyihalar\nonvoyxona\web "$site\nonvoyxona" -Recurse
Copy-Item C:\Users\user\Downloads\loyiha\web\out "$site\hisob" -Recurse
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
