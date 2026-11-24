# Hamma ilova: darhol ochilsin (2026-11-24). saygta.ps1 oxirida ishlaydi: python tez.py <sayt papkasi>
# 1) sw.js — sahifa AVVAL telefondagi nusxadan ochiladi (internet kutilmaydi), yangisi orqada yuklanadi. 2) ilova belgisi bilan ochilish ekrani.
# 3) sekin tashqi fayllar (telegram-web-app.js, Google Fonts) ochilishni to'xtatib turmaydi.
import sys, os, re, io, json, hashlib, base64
from PIL import Image
SITE = sys.argv[1]
APPS = {'hisob': 'hk-', 'shogird': 'hs-', 'hamyon': 'hamyon-', 'jarvis': 'jarvis-', 'dokon/mijoz': 'ed-mijoz-', 'dokon/sotuvchi': 'ed-sotuvchi-',
        'nonvoyxona/toshkent-rahbar': 'nv-tr-', 'nonvoyxona/toshkent-hodim': 'nv-th-', 'nonvoyxona/namangan-rahbar': 'nv-nr-', 'nonvoyxona/namangan-hodim': 'nv-nh-'}
MAIN = {'index.html', 'hisob.html', 'shogird.html'}
SKIP = {'o.html', 'sw.js', 'ilova.mobileconfig'}
SW = r"""/* tez.py: avval saqlangan nusxa, yangisi orqada. Versiya — fayllar mazmuni xeshi. */
const P='__P__',C=P+'__V__',FILES=__F__;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:'reload'})).then(r=>{if(!r.ok)throw 0;return c.put(new Request(new URL(f,self.registration.scope).href),r)})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(P)&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
 if(/\/(sw\.js|o\.html|ilova\.mobileconfig)$/.test(u.pathname))return;
 const key=u.origin+u.pathname.replace(/\/index\.html$/,'/');
 e.respondWith(caches.open(C).then(c=>c.match(key)).then(m=>m||fetch(r).catch(x=>{if(r.mode==='navigate')return caches.match(self.registration.scope).then(z=>{if(z)return z;throw x});throw x})))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=e.notification.data&&e.notification.data.url;e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{if(url)return self.clients.openWindow(url);if(cs[0])return cs[0].focus();return self.clients.openWindow('./')}))});
"""
UPD = r"""<script id="ytez">(function(){var N=navigator.serviceWorker;if(!N||!(location.protocol=='https:'||location.hostname=='localhost'))return;var had=!!N.controller,tc=0,t0=Date.now(),up=0,hid=0,done=0;
['pointerdown','keydown','touchstart'].forEach(function(e){addEventListener(e,function(){tc=1},{capture:true,passive:true})});
function safe(){var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return false;return !document.querySelector('dialog[open],#di_o,#w_o,#wk_o,#ed_o,.sh-bg,.sheet:not([hidden])')}
function go(){if(done||!safe())return;done=1;location.reload()}
N.register('sw.js',{updateViaCache:'none'}).then(function(r){var f=function(){if(!document.hidden)r.update().catch(function(){})};document.addEventListener('visibilitychange',f);setInterval(f,1800000)}).catch(function(){});
N.addEventListener('controllerchange',function(){if(!had)return had=true;up=1;if(!tc&&Date.now()-t0<9000)go()});
document.addEventListener('visibilitychange',function(){if(document.hidden)hid=Date.now();else if(up&&Date.now()-hid>60000)go()})})();</script>"""
TG = '<script src="https://telegram.org/js/telegram-web-app.js"></script>'
TG2 = '<script>(function(){var t=false;try{t=/tgWebApp/.test(location.hash+location.search)||!!window.TelegramWebviewProxy||!!sessionStorage.getItem("__telegram__initParams")}catch(e){}if(t)document.write(\'<script src="https://telegram.org/js/telegram-web-app.js"><\\/script>\')})();</script>'
def splash(d, man):
    im = Image.open(os.path.join(d, 'icon-192.png')).convert('RGBA').resize((112, 112), Image.LANCZOS); b = io.BytesIO(); im.save(b, 'WEBP', quality=82)
    bg = man.get('background_color') or '#ffffff'
    return ('<div id="ysp" style="position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:%s"><style>@media(prefers-color-scheme:dark){#ysp{background:#14110f!important}}</style>'
            '<img alt="" width="112" height="112" style="border-radius:26px" src="data:image/webp;base64,%s"></div>'
            '<script>(function(){var d=0,r=function(){if(d)return;d=1;requestAnimationFrame(function(){requestAnimationFrame(function(){var e=document.getElementById("ysp");if(e)e.remove()})})};document.addEventListener("DOMContentLoaded",function(){setTimeout(r,0)});setTimeout(r,6000)})()</script>') % (bg, base64.b64encode(b.getvalue()).decode())
for app, pre in APPS.items():
    d = os.path.join(SITE, *app.split('/'))
    if not os.path.isdir(d): print('tez: yo\'q', app); continue
    man = json.load(open(os.path.join(d, 'manifest.webmanifest'), encoding='utf-8'))
    sp = splash(d, man); files = []; hsh = hashlib.sha1(SW.encode())
    for fn in sorted(os.listdir(d)):
        p = os.path.join(d, fn)
        if fn in SKIP or not os.path.isfile(p): continue
        raw = open(p, 'rb').read()
        if fn.endswith('.html'):
            h = raw.decode('utf-8')
            if 'id="ytez"' not in h:
                h = h.replace(TG, TG2)
                h = re.sub(r'<link rel="stylesheet" href="(https://fonts\.googleapis\.com[^"]+)">', r'''<link rel="stylesheet" href="\1" media="print" onload="this.media='all'">''', h)
                if fn in MAIN and not (fn == 'index.html' and len(h) < 3000):
                    m = re.search(r'<body[^>]*>', h)
                    if m: h = h[:m.end()] + sp + h[m.end():]
                    else:
                        m = re.search(r'</style>\s*(?:</head>\s*)?(?=<(?:div|header|main|nav|section))', h)
                        if m: h = h[:m.end()] + sp + h[m.end():]
                        else: print('tez: splash joyi topilmadi', app, fn)
                i = h.rfind('</body>'); h = h[:i] + UPD + h[i:] if i >= 0 else h + UPD
                raw = h.encode('utf-8'); open(p, 'wb').write(raw)
        files.append('./' if fn == 'index.html' else './' + fn)
        hsh.update(fn.encode()); hsh.update(re.sub(rb'\b1[789]\d{8}(\d{3})?\b', b'T', raw))
    open(os.path.join(d, 'sw.js'), 'w', encoding='utf-8', newline='\n').write(SW.replace('__P__', pre).replace('__V__', hsh.hexdigest()[:12]).replace('__F__', json.dumps(files)))
print('tez: hamma ilova sw.js + ochilish ekrani tayyor')
