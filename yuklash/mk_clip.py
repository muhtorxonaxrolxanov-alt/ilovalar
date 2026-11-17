# iPhone uchun haqiqiy o'rnatish fayli (Web Clip profili, .mobileconfig) — har ilova papkasiga ilova.mobileconfig
# Safari'da tugma bosilsa: «Profil yuklandi» → Sozlamalar → O'rnatish → ekranda ilova belgisi. (2026-11-17)
import sys, os, json, uuid, base64, plistlib

SITE = sys.argv[1]
BASE = 'https://muhtorxonaxrolxanov-alt.github.io/ilovalar/'
for d in sys.argv[2:]:
    p = os.path.join(SITE, d)
    mf = os.path.join(p, 'manifest.webmanifest')
    if not os.path.exists(mf):
        continue
    m = json.load(open(mf, encoding='utf-8'))
    url = BASE + d.replace('\\', '/').strip('/') + '/'
    ic = None
    for n in ('icon-512.png', 'icon-192.png'):
        if os.path.exists(os.path.join(p, n)):
            ic = open(os.path.join(p, n), 'rb').read()
            break
    label = m.get('short_name') or m.get('name') or 'Ilova'
    clip = {
        'PayloadType': 'com.apple.webClip.managed', 'PayloadVersion': 1,
        'PayloadIdentifier': 'uz.ilovalar.clip.' + d.replace('\\', '.'),
        'PayloadUUID': str(uuid.uuid5(uuid.NAMESPACE_URL, url + '#clip')).upper(),
        'PayloadDisplayName': label, 'Label': label, 'URL': url,
        'FullScreen': True, 'IsRemovable': True, 'Precomposed': True,
    }
    if ic:
        clip['Icon'] = ic
    prof = {
        'PayloadType': 'Configuration', 'PayloadVersion': 1,
        'PayloadIdentifier': 'uz.ilovalar.' + d.replace('\\', '.'),
        'PayloadUUID': str(uuid.uuid5(uuid.NAMESPACE_URL, url)).upper(),
        'PayloadDisplayName': label, 'PayloadOrganization': label,
        'PayloadDescription': label + ' ilovasini telefon ekraniga qo\'shadi.',
        'PayloadRemovalDisallowed': False, 'PayloadContent': [clip],
    }
    open(os.path.join(p, 'ilova.mobileconfig'), 'wb').write(plistlib.dumps(prof))
    print('clip:', d, url)
