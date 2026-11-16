package com.example.myhisobot;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.Icon;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

public class MainActivity extends Activity {
    static final String NV_START = "https://muhtorxonaxrolxanov-alt.github.io/ilovalar/hisob/", NV_HOST = "muhtorxonaxrolxanov-alt.github.io", NV_OFF = "<html><head><meta name=viewport content='width=device-width,initial-scale=1'></head><body style='font-family:sans-serif;text-align:center;padding:60px 20px;background:#F6EFE3;color:#3b2414'><div style='font-size:56px'>&#128246;</div><h2>Internet yo'q</h2><p>Birinchi ochish uchun internet kerak. Keyin internetsiz ham ochiladi.</p><button onclick=\"location.href='https://muhtorxonaxrolxanov-alt.github.io/ilovalar/hisob/'\" style='font-size:18px;padding:14px 28px;border-radius:12px;border:0;background:#7c2d12;color:#fff'>Qayta urinish</button></body></html>";

    private WebView web;
    private FrameLayout root;

    /** JavaScript'dan chaqiriladi: nusxalash, ulashish va fon rangini o'zgartirish. */
    public static class Bridge {
        private final MainActivity a;
        Bridge(MainActivity a) { this.a = a; }

        @JavascriptInterface
        public void copy(final String text) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    ClipboardManager cm = (ClipboardManager) a.getSystemService(Context.CLIPBOARD_SERVICE);
                    cm.setPrimaryClip(ClipData.newPlainText("hisob", text));
                }
            });
        }

        @JavascriptInterface
        public void share(final String text) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType("text/plain");
                    i.putExtra(Intent.EXTRA_TEXT, text);
                    a.startActivity(Intent.createChooser(i, "Yuborish"));
                }
            });
        }

        /** Telegram, SMS va boshqa havolalarni telefon ilovasida ochadi. */
        @JavascriptInterface
        public void open(final String url) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        a.startActivity(i);
                    } catch (Exception e) {
                        Toast.makeText(a, "Bu havolani ochadigan ilova topilmadi", Toast.LENGTH_LONG).show();
                    }
                }
            });
        }

        /** PNG rasmni (base64) Galereyaga saqlab, yuborish oynasini ochadi. */
        @JavascriptInterface
        public void shareImage(final String b64, final String name) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        if (Build.VERSION.SDK_INT < 29) {
                            Toast.makeText(a, "Bu telefonda rasm yuborish ishlamaydi. Matnni ulashing", Toast.LENGTH_LONG).show();
                            return;
                        }
                        byte[] data = Base64.decode(b64, Base64.DEFAULT);
                        ContentValues v = new ContentValues();
                        v.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                        v.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
                        v.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Hisob");
                        Uri u = a.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
                        if (u == null) throw new Exception("uri yo'q");
                        OutputStream os = a.getContentResolver().openOutputStream(u);
                        os.write(data);
                        os.close();
                        Intent i = new Intent(Intent.ACTION_SEND);
                        i.setType("image/png");
                        i.putExtra(Intent.EXTRA_STREAM, u);
                        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        a.startActivity(Intent.createChooser(i, "Yuborish"));
                    } catch (Exception e) {
                        Toast.makeText(a, "Rasmni yuborib bo'lmadi", Toast.LENGTH_LONG).show();
                    }
                }
            });
        }

        /** Hisob rasmini Galereyaga saqlaydi va mijozning aynan shu raqamidagi Telegram chatini ochadi. */
        @JavascriptInterface
        public void sendTg(final String phone, final String b64, final String name) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    boolean saved = false;
                    Uri savedUri = null;
                    try {
                        if (Build.VERSION.SDK_INT >= 29) {
                            byte[] data = Base64.decode(b64, Base64.DEFAULT);
                            ContentValues v = new ContentValues();
                            v.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                            v.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
                            v.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Hisob");
                            Uri u = a.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
                            if (u != null) {
                                OutputStream os = a.getContentResolver().openOutputStream(u);
                                os.write(data);
                                os.close();
                                saved = true;
                                savedUri = u;
                                try {
                                    ClipboardManager cm = (ClipboardManager) a.getSystemService(Context.CLIPBOARD_SERVICE);
                                    cm.setPrimaryClip(ClipData.newUri(a.getContentResolver(), "hisob", u));
                                } catch (Exception ignored) { }
                            }
                        }
                    } catch (Exception ignored) { }
                    if (saved && savedUri != null) {
                        String[] pk = new String[]{"org.telegram.messenger", "org.telegram.messenger.web", "org.thunderdog.challegram"};
                        for (String pkg : pk) {
                            try {
                                Intent si = new Intent(Intent.ACTION_SEND);
                                si.setType("image/png");
                                si.setPackage(pkg);
                                si.putExtra(Intent.EXTRA_STREAM, savedUri);
                                si.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                                a.startActivity(si);
                                Toast.makeText(a, "Rasm tayyor. Telegramda mijozni tanlang va yuboring", Toast.LENGTH_LONG).show();
                                return;
                            } catch (Exception ignored) { }
                        }
                    }
                    boolean opened = false;
                    String[] links = new String[]{"tg://resolve?phone=" + phone, "https://t.me/+" + phone};
                    for (String l : links) {
                        try {
                            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(l));
                            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            a.startActivity(i);
                            opened = true;
                            break;
                        } catch (Exception ignored) { }
                    }
                    String msg = !opened ? "Telegram topilmadi"
                            : saved ? "Rasm tayyor. Chatda 📎 bosing, Galereyadan eng birinchi rasmni tanlang"
                            : "Telegram ochildi. Rasm saqlanmadi: matnni ulashing";
                    Toast.makeText(a, msg, Toast.LENGTH_LONG).show();
                    Toast.makeText(a, msg, Toast.LENGTH_LONG).show();
                }
            });
        }

        /** Tanlangan rasm va nom bilan bosh ekranga yangi belgi (yorliq) qo'yadi. */
        @JavascriptInterface
        public void pinShortcut(final String label, final String b64) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        ShortcutManager sm = (ShortcutManager) a.getSystemService(Context.SHORTCUT_SERVICE);
                        if (sm == null || !sm.isRequestPinShortcutSupported()) {
                            Toast.makeText(a, "Bu telefon bosh ekranga belgi qo'yishni qo'llamaydi", Toast.LENGTH_LONG).show();
                            return;
                        }
                        byte[] data = Base64.decode(b64, Base64.DEFAULT);
                        Bitmap bmp = BitmapFactory.decodeByteArray(data, 0, data.length);
                        Intent li = new Intent(a, MainActivity.class);
                        li.setAction(Intent.ACTION_MAIN);
                        ShortcutInfo info = new ShortcutInfo.Builder(a, "hisob-" + System.currentTimeMillis())
                                .setShortLabel(label)
                                .setLongLabel(label)
                                .setIcon(Icon.createWithBitmap(bmp))
                                .setIntent(li)
                                .build();
                        sm.requestPinShortcut(info, null);
                    } catch (Exception e) {
                        Toast.makeText(a, "Belgi yaratib bo'lmadi", Toast.LENGTH_LONG).show();
                    }
                }
            });
        }

        /** Zaxirani Yuklanmalar/Hisob/hisob-zaxira.txt fayliga yozadi (har safar ustidan yozadi). */
        @JavascriptInterface
        public void saveBackup(final String text) {
            try {
                if (Build.VERSION.SDK_INT < 29) return;
                ContentResolver cr = a.getContentResolver();
                Uri u = a.findBackup();
                if (u == null) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, BK_NAME);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, "text/plain");
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, "Download/Hisob");
                    u = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                }
                if (u == null) return;
                OutputStream os = cr.openOutputStream(u, "wt");
                os.write(text.getBytes("UTF-8"));
                os.close();
            } catch (Exception ignored) { }
        }

        /** Oxirgi zaxira matnini qaytaradi (bo'lmasa bo'sh qator). */
        @JavascriptInterface
        public String readBackup() {
            try {
                if (Build.VERSION.SDK_INT < 29) return "";
                Uri u = a.findBackup();
                if (u == null) return "";
                InputStream in = a.getContentResolver().openInputStream(u);
                ByteArrayOutputStream bo = new ByteArrayOutputStream();
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
                in.close();
                return bo.toString("UTF-8");
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public void bg(final String hex) {
            a.runOnUiThread(new Runnable() {
                @Override public void run() {
                    try { a.setBg(Color.parseColor(hex.trim())); } catch (Exception ignored) { }
                }
            });
        }
    }

    private static final String BK_NAME = "hisob-zaxira.txt";
    private ValueCallback<Uri[]> fileCb;

    Uri findBackup() {
        try {
            Uri coll = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
            Cursor c = getContentResolver().query(coll, new String[]{MediaStore.MediaColumns._ID},
                    MediaStore.MediaColumns.DISPLAY_NAME + "=? AND " + MediaStore.MediaColumns.RELATIVE_PATH + "=?",
                    new String[]{BK_NAME, "Download/Hisob/"}, null);
            if (c == null) return null;
            try {
                if (c.moveToFirst()) return ContentUris.withAppendedId(coll, c.getLong(0));
            } finally { c.close(); }
        } catch (Exception ignored) { }
        return null;
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        if (req == 77) {
            if (fileCb != null) {
                fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data));
                fileCb = null;
            }
            return;
        }
        super.onActivityResult(req, res, data);
    }

    void setBg(int color) {
        root.setBackgroundColor(color);
        if (Build.VERSION.SDK_INT >= 23) {
            View decor = getWindow().getDecorView();
            int flags = decor.getSystemUiVisibility();
            if (Color.luminance(color) > 0.5f) flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            else flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            decor.setSystemUiVisibility(flags);
        }
    }

    /** Orqaga: avval ilova ichida bir qadam, keyin oldingi sahifa, oxirida chiqish. */
    private void handleBack() {
        if (web == null) { finish(); return; }
        web.evaluateJavascript("(function(){return window.__back?window.__back():false})()", new ValueCallback<String>() {
            @Override public void onReceiveValue(String v) {
                if ("true".equals(v)) return;
                if (web.canGoBack()) web.goBack(); else finish();
            }
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView v, android.webkit.WebResourceRequest r) {
                android.net.Uri u = r.getUrl();
                if ("https".equals(u.getScheme()) && NV_HOST.equals(u.getHost())) return false;
                try { startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, u)); } catch (Exception e) {}
                return true;
            }
            @Override public void onReceivedError(WebView v, android.webkit.WebResourceRequest r, android.webkit.WebResourceError e) {
                if (r.isForMainFrame()) v.loadDataWithBaseURL(null, NV_OFF, "text/html", "utf-8", null);
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView w, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                try {
                    startActivityForResult(p.createIntent(), 77);
                } catch (Exception e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }
        });
        web.addJavascriptInterface(new Bridge(this), "AndroidBridge");

        root = new FrameLayout(this);
        root.setBackgroundColor(0xFFF4F5F9);
        root.addView(web, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        setContentView(root);

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, new OnBackInvokedCallback() {
                        @Override public void onBackInvoked() { handleBack(); }
                    });
        }

        web.loadUrl(NV_START);
    }

    @Override
    public void onBackPressed() {
        handleBack();
    }
}
