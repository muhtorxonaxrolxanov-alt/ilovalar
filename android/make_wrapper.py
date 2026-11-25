# -*- coding: utf-8 -*-
"""O'zi yangilanadigan Android ilovalar: ichidagi HTML o'rniga internetdagi versiyani ochadi.
Telefon imkoniyatlari (ovoz, bildirishnoma, Excel ulashish, fayl tanlash) eski Java kodida qoladi.
python make_wrapper.py  -> out/*.apk"""
import os, re, shutil, subprocess, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, r'C:\Loyihalar\nonvoyxona\src')
import caproj2gradle  # noqa: E402

SITE = 'https://muhtorxonaxrolxanov-alt.github.io/ilovalar/'
HOST = 'muhtorxonaxrolxanov-alt.github.io'
ND = r'C:\Loyihalar\nonvoyxona\dist'
APPS = [
    # nomi (apk), manba, internetdagi manzil, versionCode, versionName, Android ko'prigi nomi
    ('toshkent-rahbar', ND + r'\premium-nonvoyxona.caproj', 'nonvoyxona/toshkent-rahbar/', 31, '4.1', 'Android'),
    ('toshkent-hodim', ND + r'\premium-nonvoyxona-ishchi.caproj', 'nonvoyxona/toshkent-hodim/', 30, '4.0', 'Android'),
    ('namangan-rahbar', ND + r'\namangan-nonvoyxona.caproj', 'nonvoyxona/namangan-rahbar/', 31, '4.1', 'Android'),
    ('namangan-hodim', ND + r'\namangan-nonvoyxona-ishchi.caproj', 'nonvoyxona/namangan-hodim/', 30, '4.0', 'Android'),
    ('hisob-kitob', r'C:\Users\user\Downloads\loyiha\cap', 'hisob/', 30, '30', 'AndroidBridge'),
    ('dokon-mijoz', r'C:\Loyihalar\premium-xizmat\caproj\tayyor\Elektr-Dokon-Mijoz.caproj', 'dokon/mijoz/', 32, '2.2', 'none'),
    ('dokon-sotuvchi', r'C:\Loyihalar\premium-xizmat\caproj\tayyor\Dokon-Sotuvchi.caproj', 'dokon/sotuvchi/', 32, '2.2', 'none'),
    # Hamyon: ovozni telefonning o'zi taniydi (Android.listen) — shuning uchun nonvoyxona Java kodi asosida
    ('hamyon', ND + r'\premium-nonvoyxona.caproj', 'hamyon/', 2, '1.1', 'Android'),
    # Shogird (2026-11-18): Hisob-kitob Java kodi, lekin shogird/ sahifasini ochadi — alohida ilova
    ('shogird', r'C:\Users\user\Downloads\loyiha\cap', 'shogird/', 1, '1.0', 'AndroidBridge'),
]
# Telefondagi nomi va belgisi (bo'lmasa — asl nomi + " (yangi)", asl belgi)
LABEL = {'dokon-mijoz': '222 Aksessuar', 'dokon-sotuvchi': '222 Aksessuar Sotuvchi', 'hamyon': 'Hamyon', 'shogird': 'Shogird'}
ICON = {'dokon-mijoz': os.path.join(HERE, '..', 'dokon', 'mijoz', 'icon-512.png'),
        'dokon-sotuvchi': os.path.join(HERE, '..', 'dokon', 'sotuvchi', 'icon-512.png'),
        'hamyon': os.path.join(HERE, '..', 'hamyon', 'icon-512.png'),
        'shogird': os.path.join(HERE, '..', 'shogird', 'icon-512.png')}
APPID = {'hamyon': 'uz.hamyon.xarajat', 'shogird': 'uz.hisobkitob.shogird'}  # boshqa ilova Java kodidan foydalansa ham, alohida ilova bo'lib o'rnatilsin


def set_icon(gdir, png):
    from PIL import Image
    res = os.path.join(gdir, 'app', 'src', 'main', 'res')
    for d in ('mipmap', 'mipmap-anydpi-v26'):
        for f in ('ic_launcher.xml', 'ic_launcher_round.xml'):
            p = os.path.join(res, d, f)
            if os.path.exists(p): os.remove(p)
    im = Image.open(png).convert('RGB')
    for d, n in (('mipmap-mdpi', 48), ('mipmap-hdpi', 72), ('mipmap-xhdpi', 96), ('mipmap-xxhdpi', 144), ('mipmap-xxxhdpi', 192)):
        os.makedirs(os.path.join(res, d), exist_ok=True)
        r = im.resize((n, n), Image.LANCZOS)
        r.save(os.path.join(res, d, 'ic_launcher.png')); r.save(os.path.join(res, d, 'ic_launcher_round.png'))
OFF = ("<html><head><meta name=viewport content='width=device-width,initial-scale=1'></head>"
       "<body style='font-family:sans-serif;text-align:center;padding:60px 20px;background:#F6EFE3;color:#3b2414'>"
       "<div style='font-size:56px'>&#128246;</div><h2>Internet yo'q</h2><p>Birinchi ochish uchun internet kerak. Keyin internetsiz ham ochiladi.</p>"
       "<button onclick=\"location.href='%s'\" style='font-size:18px;padding:14px 28px;border-radius:12px;border:0;background:#7c2d12;color:#fff'>Qayta urinish</button></body></html>")
CLIENT = r'''
            @Override public boolean shouldOverrideUrlLoading(WebView v, android.webkit.WebResourceRequest r) {
                android.net.Uri u = r.getUrl();
                if ("https".equals(u.getScheme()) && NV_HOST.equals(u.getHost())) return false;
                try { startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, u)); } catch (Exception e) {}
                return true;
            }
            @Override public void onReceivedError(WebView v, android.webkit.WebResourceRequest r, android.webkit.WebResourceError e) {
                if (r.isForMainFrame()) v.loadDataWithBaseURL(null, NV_OFF, "text/html", "utf-8", null);
            }
'''


def jstr(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def zip_dir(src_dir, dst_zip):
    with zipfile.ZipFile(dst_zip, 'w') as z:
        for r, _, fs in os.walk(os.path.join(src_dir, 'project')):
            for f in fs:
                p = os.path.join(r, f)
                z.write(p, os.path.relpath(p, src_dir).replace('\\', '/'))


def patch(gdir, url, bridge, label_suffix=' (yangi)'):
    main = [os.path.join(r, f) for r, _, fs in os.walk(os.path.join(gdir, 'app', 'src', 'main', 'java')) for f in fs if f == 'MainActivity.java'][0]
    j = open(main, encoding='utf-8').read()
    start = SITE + url
    j = re.sub(r'(public class MainActivity[^{]*\{)', r'\1\n    static final String NV_START = %s, NV_HOST = %s, NV_OFF = %s;\n'
               % (jstr(start).replace('\\', '\\\\'), jstr(HOST), jstr(OFF % start).replace('\\', '\\\\')), j, count=1)
    li = j.index('web.loadUrl("file:///android_asset/index.html");')
    j = j[:li] + 'web.loadUrl(NV_START);' + j[li + len('web.loadUrl("file:///android_asset/index.html");'):]
    # loadUrl dan oldingi oxirgi WebViewClient ga tashqi havolalar va internet yo'qligini qo'shamiz
    ci = j.rfind('setWebViewClient(new WebViewClient()', 0, li)
    after = ci + len('setWebViewClient(new WebViewClient()')
    if j[after:].lstrip().startswith('{'):
        b = j.index('{', after) + 1
        j = j[:b] + CLIENT + j[b:]
    else:
        j = j[:after] + ' {' + CLIENT + '        }' + j[after:]
    if bridge == 'Android':
        k = j.index('}, "Android");')
        j = j[:k] + '    @JavascriptInterface\n            public boolean wrap() { return true; }\n        ' + j[k:]
    open(main, 'w', encoding='utf-8').write(j)
    # Yangi ilova eski ilova yonida o'rnatiladi (imzo boshqa): applicationId + ".web"
    bg = os.path.join(gdir, 'app', 'build.gradle')
    g = open(bg, encoding='utf-8').read()
    g = g.replace("defaultConfig {", "defaultConfig { applicationIdSuffix '.web';", 1)
    g = g.replace("buildTypes { release { minifyEnabled false } }",
                  "signingConfigs { rel { storeFile file('C:/Loyihalar/keys/ilovalar.jks'); storePassword new File('C:/Loyihalar/keys/parol.txt').text.trim(); keyAlias 'ilovalar'; keyPassword new File('C:/Loyihalar/keys/parol.txt').text.trim() } }\n"
                  "    buildTypes { release { minifyEnabled false; signingConfig signingConfigs.rel } }")
    open(bg, 'w', encoding='utf-8').write(g)
    sx = os.path.join(gdir, 'app', 'src', 'main', 'res', 'values', 'strings.xml')
    s = open(sx, encoding='utf-8').read()
    s = re.sub(r'(<string name="app_name">)([^<]*)(</string>)', lambda m: m.group(1) + m.group(2) + label_suffix + m.group(3), s, count=1)
    open(sx, 'w', encoding='utf-8').write(s)


GEO_FIELDS = r"""
    private android.webkit.GeolocationPermissions.Callback geoCb; private String geoOr;
    private boolean has(String p) { return checkSelfPermission(p) == PackageManager.PERMISSION_GRANTED; }
    private boolean hasGeo() { return has("android.permission.ACCESS_FINE_LOCATION") || has("android.permission.ACCESS_COARSE_LOCATION"); }
    private void askPerms(String k, int code) {
        ArrayList<String> a = new ArrayList<String>();
        boolean all = k == null || k.length() == 0;
        if ((all || k.equals("geo")) && !hasGeo()) { a.add("android.permission.ACCESS_FINE_LOCATION"); a.add("android.permission.ACCESS_COARSE_LOCATION"); }
        if ((all || k.equals("mic")) && !has(Manifest.permission.RECORD_AUDIO)) a.add(Manifest.permission.RECORD_AUDIO);
        if ((all || k.equals("ntf")) && Build.VERSION.SDK_INT >= 33 && !has("android.permission.POST_NOTIFICATIONS")) a.add("android.permission.POST_NOTIFICATIONS");
        if (a.size() > 0) requestPermissions(a.toArray(new String[0]), code); else js("window.onPerm&&onPerm()");
    }
    private void openAppSet() {
        try { startActivity(new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getPackageName()))); } catch (Exception e) {}
    }
"""
GEO_CHROME = r"""
            @Override public void onGeolocationPermissionsShowPrompt(String origin, android.webkit.GeolocationPermissions.Callback cb) {
                String h = Uri.parse(origin).getHost();
                if (!NV_HOST.equals(h)) { cb.invoke(origin, false, false); return; }
                if (hasGeo()) { cb.invoke(origin, true, false); return; }
                geoCb = cb; geoOr = origin; askPerms("geo", 21);
            }
"""
GEO_BRIDGE = r"""    @JavascriptInterface
            public String permState() { return "{\"geo\":" + hasGeo() + ",\"mic\":" + has(Manifest.permission.RECORD_AUDIO) + ",\"ntf\":" + (Build.VERSION.SDK_INT < 33 || has("android.permission.POST_NOTIFICATIONS")) + "}"; }
            @JavascriptInterface
            public void permAsk(final String k) {
                runOnUiThread(new Runnable() { @Override public void run() {
                    // "Boshqa so'ralmasin" bo'lsa oyna chiqmaydi — telefon sozlamalari ochiladi
                    String p = "geo".equals(k) ? "android.permission.ACCESS_FINE_LOCATION" : "mic".equals(k) ? Manifest.permission.RECORD_AUDIO : "android.permission.POST_NOTIFICATIONS";
                    android.content.SharedPreferences sp = getSharedPreferences("nvperm", 0);
                    if (k != null && k.length() > 0 && !has(p) && sp.getBoolean(k, false) && !shouldShowRequestPermissionRationale(p)) { openAppSet(); return; }
                    if (k != null && k.length() > 0) sp.edit().putBoolean(k, true).apply();
                    askPerms(k, 20);
                } });
            }
            @JavascriptInterface
            public void permSet() { runOnUiThread(new Runnable() { @Override public void run() { openAppSet(); } }); }
        """


def patch_geo(gdir):
    """Joylashuv ruxsati + birinchi ochilishda hamma ruxsatlarni so'rash (2026-11-25)"""
    main = [os.path.join(r, f) for r, _, fs in os.walk(os.path.join(gdir, 'app', 'src', 'main', 'java')) for f in fs if f == 'MainActivity.java'][0]
    j = open(main, encoding='utf-8').read()

    def one(a, b):
        nonlocal j
        assert a in j, a
        j = j.replace(a, b, 1)
    one('    private WebView web;', '    private WebView web;' + GEO_FIELDS)
    one('web.setWebChromeClient(new WebChromeClient() {', 'web.setWebChromeClient(new WebChromeClient() {' + GEO_CHROME)
    one('s.setDomStorageEnabled(true);', 's.setDomStorageEnabled(true);\n        s.setGeolocationEnabled(true);')
    k = j.index('}, "Android");')
    j = j[:k] + GEO_BRIDGE + j[k:]
    one('super.onRequestPermissionsResult(code, p, g);', """super.onRequestPermissionsResult(code, p, g);
        if (geoCb != null && (code == 20 || code == 21)) { try { geoCb.invoke(geoOr, hasGeo(), false); } catch (Exception e) {} geoCb = null; }
        if (code == 20 || code == 21) { js("window.onPerm&&onPerm()"); return; }""")
    one('web.loadUrl(NV_START);', 'web.loadUrl(NV_START);\n        web.postDelayed(new Runnable() { @Override public void run() { try { if (!hasGeo() || !has(Manifest.permission.RECORD_AUDIO) || (Build.VERSION.SDK_INT >= 33 && !has("android.permission.POST_NOTIFICATIONS"))) askPerms("", 20); } catch (Exception e) {} } }, 1500);')
    open(main, 'w', encoding='utf-8').write(j)
    mf = os.path.join(gdir, 'app', 'src', 'main', 'AndroidManifest.xml')
    m = open(mf, encoding='utf-8').read()
    m = m.replace('<uses-permission android:name="android.permission.INTERNET"/>', '<uses-permission android:name="android.permission.INTERNET"/>\n    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>\n    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>\n    <uses-feature android:name="android.hardware.location.gps" android:required="false"/>\n    <uses-feature android:name="android.hardware.microphone" android:required="false"/>', 1)
    open(mf, 'w', encoding='utf-8').write(m)


def build(only=None):
    out = os.path.join(HERE, 'out'); os.makedirs(out, exist_ok=True)
    env = dict(os.environ)
    jdk = [os.path.join(r'C:\Program Files\Microsoft', d) for d in os.listdir(r'C:\Program Files\Microsoft') if d.startswith('jdk-17')][0]
    env['JAVA_HOME'] = jdk; env['ANDROID_HOME'] = r'C:\Android'; env['GRADLE_OPTS'] = '-Djavax.net.ssl.trustStoreType=Windows-ROOT'
    env['Path'] = jdk + r'\bin;C:\Android\gradle\bin;' + env.get('Path', '')
    for name, src, url, vc, vn, bridge in APPS:
        if only and name not in only: continue
        gdir = os.path.join(HERE, 'gradle', name)
        cap = src
        if os.path.isdir(src):
            cap = os.path.join(HERE, name + '.zip'); zip_dir(src, cap)
        caproj2gradle.convert(cap, gdir)
        bg = os.path.join(gdir, 'app', 'build.gradle')
        g = open(bg, encoding='utf-8').read()
        g = re.sub(r'versionCode \d+', 'versionCode %d' % vc, g); g = re.sub(r"versionName '[^']*'", "versionName '%s'" % vn, g)
        if name in APPID: g = re.sub(r"applicationId\s+'[^']*'", "applicationId '%s'" % APPID[name], g)
        open(bg, 'w', encoding='utf-8').write(g)
        patch(gdir, url, bridge)
        if name in ('toshkent-rahbar', 'namangan-rahbar'): patch_geo(gdir)
        if name in LABEL:
            sx = os.path.join(gdir, 'app', 'src', 'main', 'res', 'values', 'strings.xml')
            s = open(sx, encoding='utf-8').read()
            s = re.sub(r'(<string name="app_name">)[^<]*(</string>)', lambda m: m.group(1) + LABEL[name] + m.group(2), s, count=1)
            open(sx, 'w', encoding='utf-8').write(s)
        if name in ICON: set_icon(gdir, ICON[name])
        r = subprocess.run('gradle assembleRelease --no-daemon -q', cwd=gdir, env=env, shell=True, capture_output=True, text=True)
        apk = os.path.join(gdir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
        if r.returncode or not os.path.exists(apk):
            print('XATO', name, (r.stdout + r.stderr)[-2500:]); sys.exit(1)
        dst = os.path.join(out, '%s-%s.apk' % (name, vn)); shutil.copy(apk, dst)
        print('OK', name, os.path.getsize(dst) // 1024, 'KB ->', dst)


if __name__ == '__main__':
    build(sys.argv[1:] or None)
