# Ikkala ilovani yig'ib, GitHub Pages'ga yuboradi: https://muhtorxonaxrolxanov-alt.github.io/ilovalar/
# Ishlatish: powershell -ExecutionPolicy Bypass -File deploy.ps1 "nima o'zgardi"
param([string]$msg = "Yangilanish")
$ErrorActionPreference = 'Stop'
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;$env:Path"
$site = $PSScriptRoot
# 1) Yig'ish
Push-Location C:\Loyihalar\nonvoyxona\src; python build_web.py; Pop-Location
Push-Location C:\Users\user\Downloads\loyiha\web; python build_web.py; Pop-Location
# 2) Nusxalash
foreach ($d in 'nonvoyxona', 'hisob') { if (Test-Path "$site\$d") { Remove-Item "$site\$d" -Recurse -Force } }
Copy-Item C:\Loyihalar\nonvoyxona\web "$site\nonvoyxona" -Recurse
Copy-Item C:\Users\user\Downloads\loyiha\web\out "$site\hisob" -Recurse
# 3) Yuborish
Set-Location $site
git add -A
$ch = git status --porcelain
if (-not $ch) { "O'zgarish yo'q"; exit 0 }
git commit -q -m $msg
git push -q origin main
"Yuborildi: $msg"
