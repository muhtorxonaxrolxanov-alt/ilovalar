package uz.elektrdokon.sotuvchi;

import android.Manifest;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Insets;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.util.Base64;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Elektr Do'kon — Sotuvchi (v1.1).
 * Ekranlar assets/index.html ichida. Bu klass: server bilan aloqa, bildirishnoma, rasm/video tanlash,
 * videoni to'liq ekranda ko'rish, qo'ng'iroq/xarita, Bluetooth chek printeri, oddiy printer,
 * bosh ekranga belgi qo'shish.
 */
public class MainActivity extends Activity {
    static final String NV_START = "https://muhtorxonaxrolxanov-alt.github.io/ilovalar/dokon/sotuvchi/", NV_HOST = "muhtorxonaxrolxanov-alt.github.io", NV_OFF = "<html><head><meta name=viewport content='width=device-width,initial-scale=1'></head><body style='font-family:sans-serif;text-align:center;padding:60px 20px;background:#F6EFE3;color:#3b2414'><div style='font-size:56px'>&#128246;</div><h2>Internet yo'q</h2><p>Birinchi ochish uchun internet kerak. Keyin internetsiz ham ochiladi.</p><button onclick=\"location.href='https://muhtorxonaxrolxanov-alt.github.io/ilovalar/dokon/sotuvchi/'\" style='font-size:18px;padding:14px 28px;border-radius:12px;border:0;background:#7c2d12;color:#fff'>Qayta urinish</button></body></html>";


    private static final int FILE_REQ = 11;
    private static final int PERM_REQ = 12;
    private static final String CHANNEL = "buyurtmalar";
    private static final UUID SPP = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    private WebView web;
    private FrameLayout root;
    private WebChromeClient chrome;
    private ValueCallback<Uri[]> fileCallback;
    private View customView;
    private WebChromeClient.CustomViewCallback customCallback;
    private WebView printView;
    private int notifyId = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        root = new FrameLayout(this);
        root.setBackgroundColor(0xFFFFFFFF);
        root.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        // Android 15+ ilovani butun ekranga yoyadi: soat va pastki tugmalar ostida joy qoldiramiz
        if (Build.VERSION.SDK_INT >= 30) {
            root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                    Insets b = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime() | WindowInsets.Type.displayCutout());
                    v.setPadding(b.left, b.top, b.right, b.bottom);
                    return WindowInsets.CONSUMED;
                }
            });
        }
        // Android 13+ "orqaga" tugmasi
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, new OnBackInvokedCallback() {
                @Override
                public void onBackInvoked() {
                    handleBack();
                }
            });
        }

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        web.addJavascriptInterface(new Bridge(), "Android");

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

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file:")) return false;
                openExternal(url);
                return true;
            }
        });

        chrome = new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent pick;
                try {
                    pick = params.createIntent();
                } catch (Exception e) {
                    pick = new Intent(Intent.ACTION_GET_CONTENT);
                    pick.setType("*/*");
                }
                pick.addCategory(Intent.CATEGORY_OPENABLE);
                if (params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) pick.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try {
                    startActivityForResult(Intent.createChooser(pick, "Fayl tanlang"), FILE_REQ);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                askPermission(Manifest.permission.ACCESS_FINE_LOCATION);
                callback.invoke(origin, true, false);
            }

            // Videoni to'liq ekranda ko'rish
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                if (customView != null) {
                    callback.onCustomViewHidden();
                    return;
                }
                customView = view;
                customCallback = callback;
                root.addView(view, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                web.setVisibility(View.GONE);
            }

            @Override
            public void onHideCustomView() {
                if (customView == null) return;
                root.removeView(customView);
                customView = null;
                web.setVisibility(View.VISIBLE);
                if (customCallback != null) customCallback.onCustomViewHidden();
                customCallback = null;
            }
        };
        web.setWebChromeClient(chrome);

        createChannel();
        if (Build.VERSION.SDK_INT >= 33) askPermission("android.permission.POST_NOTIFICATIONS");

        web.loadUrl(NV_START);
    }

    private void askPermission(String perm) {
        if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(perm) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{perm}, PERM_REQ);
        }
    }

    private void openExternal(String url) {
        try {
            startActivity(new Intent(url.startsWith("tel:") ? Intent.ACTION_DIAL : Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (Exception e) {
            // mos ilova topilmadi
        }
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Buyurtmalar", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Yangi buyurtmalar haqida xabar");
            ch.enableVibration(true);
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.createNotificationChannel(ch);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_REQ && fileCallback != null) {
            Uri[] result = null;
            if (resultCode == RESULT_OK && data != null) {
                ClipData clip = data.getClipData();
                if (clip != null && clip.getItemCount() > 0) {
                    result = new Uri[clip.getItemCount()];
                    for (int i = 0; i < clip.getItemCount(); i++) result[i] = clip.getItemAt(i).getUri();
                } else if (data.getData() != null) {
                    result = new Uri[]{data.getData()};
                }
            }
            fileCallback.onReceiveValue(result);
            fileCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        handleBack();
    }

    /** Avval video/oyna yopiladi, keyin bosh sahifaga qaytadi, oxirida ilovadan chiqadi. */
    private void handleBack() {
        if (customView != null) {
            chrome.onHideCustomView();
            return;
        }
        web.evaluateJavascript("(window.onBack&&window.onBack())?'1':'0'", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String v) {
                if (v == null || !v.contains("1")) finish();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onPause() {
        if (web != null) web.onPause();
        super.onPause();
    }

    private void runJs(final String js) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                web.evaluateJavascript(js, null);
            }
        });
    }

    private void sendToJs(String id, boolean ok, String text) {
        runJs("window.__resp(" + JSONObject.quote(id) + "," + ok + "," + JSONObject.quote(text == null ? "" : text) + ")");
    }

    private void sendEvent(String name, String value) {
        runJs("window.__evt&&window.__evt(" + JSONObject.quote(name) + "," + JSONObject.quote(value) + ")");
    }

    /** HTTP so'rov: Google Apps Script yo'naltirishlarini (302) o'zi kuzatadi. */
    private static byte[] http(String address, String body) throws Exception {
        String url = address;
        String method = body == null ? "GET" : "POST";
        for (int hop = 0; hop < 6; hop++) {
            HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
            c.setInstanceFollowRedirects(false);
            c.setConnectTimeout(20000);
            c.setReadTimeout(120000);
            c.setRequestMethod(method);
            if ("POST".equals(method)) {
                c.setDoOutput(true);
                c.setRequestProperty("Content-Type", "text/plain;charset=utf-8");
                OutputStream os = c.getOutputStream();
                os.write(body.getBytes("UTF-8"));
                os.close();
            }
            int code = c.getResponseCode();
            if (code == 301 || code == 302 || code == 303 || code == 307 || code == 308) {
                String loc = c.getHeaderField("Location");
                c.disconnect();
                if (loc == null) throw new Exception("Yo'naltirish manzili yo'q");
                url = new URL(new URL(url), loc).toString();
                if (code != 307 && code != 308) method = "GET";
                continue;
            }
            InputStream in = code >= 400 ? c.getErrorStream() : c.getInputStream();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            if (in != null) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                in.close();
            }
            c.disconnect();
            if (code >= 400) throw new Exception("Server xatosi " + code);
            return out.toByteArray();
        }
        throw new Exception("Juda ko'p yo'naltirish");
    }

    /** Belgi uchun rasm: data:... yoki https havola. Moslashuvchan belgi uchun markazga joylaymiz. */
    private Bitmap iconBitmap(String image) throws Exception {
        Bitmap src = null;
        if (image != null && image.length() > 0) {
            byte[] bytes;
            if (image.startsWith("data:")) bytes = Base64.decode(image.substring(image.indexOf(',') + 1), Base64.DEFAULT);
            else bytes = http(image, null);
            src = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        }
        int size = 216;
        Bitmap out = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(out);
        if (src == null) {
            cv.drawColor(0xFFF2A900);
            return out;
        }
        int corner = src.getPixel(1, 1);
        cv.drawColor((corner >>> 24) < 128 ? 0xFFFFFFFF : (corner | 0xFF000000));
        int inner = 150, off = (size - inner) / 2;
        cv.drawBitmap(src, null, new Rect(off, off, off + inner, off + inner), new Paint(Paint.FILTER_BITMAP_FLAG));
        return out;
    }

    /** JavaScript'dan chaqiriladigan funksiyalar: window.Android.* */
    public class Bridge {
        @JavascriptInterface
        public void post(final String id, final String url, final String body) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        sendToJs(id, true, new String(http(url, body), "UTF-8"));
                    } catch (Exception e) {
                        sendToJs(id, false, "Internet yo'q yoki server javob bermadi");
                    }
                }
            }).start();
        }

        @JavascriptInterface
        public void notify(final String title, final String text) {
            Intent open = new Intent(MainActivity.this, MainActivity.class);
            open.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent pi = PendingIntent.getActivity(MainActivity.this, 0, open, PendingIntent.FLAG_IMMUTABLE);
            Notification.Builder b = new Notification.Builder(MainActivity.this, CHANNEL);
            b.setSmallIcon(android.R.drawable.stat_notify_chat)
                    .setContentTitle(title)
                    .setContentText(text)
                    .setAutoCancel(true)
                    .setContentIntent(pi);
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(notifyId++, b.build());
            vibrate(400);
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            try {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null) v.vibrate(ms);
            } catch (Exception e) {
                // tebranish yo'q
            }
        }

        @JavascriptInterface
        public String version() {
            return "1.1";
        }

        /** Bosh ekranga belgi qo'shish yoki mavjud belgining rasmi/nomini yangilash. mode: "pin" yoki "update". */
        @JavascriptInterface
        public void pinShortcut(final String label, final String image, final String mode) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        ShortcutManager sm = getSystemService(ShortcutManager.class);
                        if (sm == null) {
                            sendEvent("shortcut", "unsupported");
                            return;
                        }
                        Icon icon = Icon.createWithAdaptiveBitmap(iconBitmap(image));
                        Intent open = new Intent(Intent.ACTION_MAIN, null, MainActivity.this, MainActivity.class);
                        String name = label == null || label.length() == 0 ? "Do'kon" : label;
                        ShortcutInfo info = new ShortcutInfo.Builder(MainActivity.this, "brand")
                                .setShortLabel(name).setLongLabel(name).setIcon(icon).setIntent(open).build();
                        boolean pinned = false;
                        for (ShortcutInfo si : sm.getPinnedShortcuts()) if ("brand".equals(si.getId())) pinned = true;
                        if (pinned) {
                            sm.updateShortcuts(Collections.singletonList(info));
                            sendEvent("shortcut", "updated");
                        } else if ("update".equals(mode)) {
                            sendEvent("shortcut", "skip");
                        } else if (sm.isRequestPinShortcutSupported()) {
                            sm.requestPinShortcut(info, null);
                            sendEvent("shortcut", "requested");
                        } else {
                            sendEvent("shortcut", "unsupported");
                        }
                    } catch (Exception e) {
                        sendEvent("shortcut", "error");
                    }
                }
            }).start();
        }

        /** Telefonga ulangan (paired) Bluetooth qurilmalar ro'yxati. */
        @JavascriptInterface
        public String btDevices() {
            try {
                if (Build.VERSION.SDK_INT >= 31 && checkSelfPermission("android.permission.BLUETOOTH_CONNECT") != PackageManager.PERMISSION_GRANTED) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            requestPermissions(new String[]{"android.permission.BLUETOOTH_CONNECT"}, PERM_REQ);
                        }
                    });
                    return "{\"perm\":false}";
                }
                BluetoothAdapter a = BluetoothAdapter.getDefaultAdapter();
                if (a == null) return "{\"error\":\"Bu telefonda Bluetooth yo'q\"}";
                if (!a.isEnabled()) return "{\"off\":true}";
                JSONArray arr = new JSONArray();
                Set<BluetoothDevice> set = a.getBondedDevices();
                if (set != null) for (BluetoothDevice d : set) {
                    JSONObject o = new JSONObject();
                    o.put("name", d.getName() == null ? "Printer" : d.getName());
                    o.put("address", d.getAddress());
                    arr.put(o);
                }
                return arr.toString();
            } catch (Exception e) {
                return "{\"error\":\"Bluetooth bilan ishlab bo'lmadi\"}";
            }
        }

        /** 58 mm chek printeriga ESC/POS buyruqlarini yuborish (base64). */
        @JavascriptInterface
        public void btPrint(final String id, final String address, final String b64) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    BluetoothSocket sock = null;
                    try {
                        BluetoothAdapter a = BluetoothAdapter.getDefaultAdapter();
                        BluetoothDevice d = a.getRemoteDevice(address);
                        try {
                            a.cancelDiscovery();
                        } catch (Exception ignore) {
                            // ruxsat yo'q bo'lsa ham davom etamiz
                        }
                        try {
                            sock = d.createRfcommSocketToServiceRecord(SPP);
                            sock.connect();
                        } catch (IOException first) {
                            try {
                                if (sock != null) sock.close();
                            } catch (IOException ignore) {
                                // yopilmadi
                            }
                            sock = d.createInsecureRfcommSocketToServiceRecord(SPP);
                            sock.connect();
                        }
                        OutputStream os = sock.getOutputStream();
                        os.write(Base64.decode(b64, Base64.DEFAULT));
                        os.flush();
                        Thread.sleep(700);
                        sock.close();
                        sendToJs(id, true, "{\"ok\":true}");
                    } catch (Exception e) {
                        try {
                            if (sock != null) sock.close();
                        } catch (Exception ignore) {
                            // yopilmadi
                        }
                        sendToJs(id, false, "Printerga ulanib bo'lmadi");
                    }
                }
            }).start();
        }

        /** Telefonning oddiy chop etish oynasi: Wi-Fi printer, PDF saqlash va h.k. */
        @JavascriptInterface
        public void printHtml(final String html, final String job) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    printView = new WebView(MainActivity.this);
                    printView.setWebViewClient(new WebViewClient() {
                        @Override
                        public void onPageFinished(WebView view, String url) {
                            PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                            if (pm != null) pm.print(job, view.createPrintDocumentAdapter(job), new PrintAttributes.Builder().build());
                        }
                    });
                    printView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
                }
            });
        }

        /** Matnni Telegram va boshqa ilovalar orqali yuborish. */
        @JavascriptInterface
        public void shareText(final String text) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent send = new Intent(Intent.ACTION_SEND);
                    send.setType("text/plain");
                    send.putExtra(Intent.EXTRA_TEXT, text);
                    try {
                        startActivity(Intent.createChooser(send, "Chekni yuborish"));
                    } catch (Exception e) {
                        // ilova topilmadi
                    }
                }
            });
        }
    }
}
