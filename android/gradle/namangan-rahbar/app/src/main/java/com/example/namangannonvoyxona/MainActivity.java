package com.example.namangannonvoyxona;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Insets;
import android.net.Uri;
import android.graphics.Bitmap;
import java.io.File;
import java.io.FileOutputStream;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import java.util.ArrayList;
import org.json.JSONObject;

public class MainActivity extends Activity {
    static final String NV_START = "https://muhtorxonaxrolxanov-alt.github.io/ilovalar/nonvoyxona/namangan-rahbar/", NV_HOST = "muhtorxonaxrolxanov-alt.github.io", NV_OFF = "<html><head><meta name=viewport content='width=device-width,initial-scale=1'></head><body style='font-family:sans-serif;text-align:center;padding:60px 20px;background:#F6EFE3;color:#3b2414'><div style='font-size:56px'>&#128246;</div><h2>Internet yo'q</h2><p>Birinchi ochish uchun internet kerak. Keyin internetsiz ham ochiladi.</p><button onclick=\"location.href='https://muhtorxonaxrolxanov-alt.github.io/ilovalar/nonvoyxona/namangan-rahbar/'\" style='font-size:18px;padding:14px 28px;border-radius:12px;border:0;background:#7c2d12;color:#fff'>Qayta urinish</button></body></html>";

    private WebView web;
    private SpeechRecognizer sr;
    static MainActivity ACT;
    static boolean RES = false;
    static boolean BUSY = false;
    private Wake fw;
    private android.speech.tts.TextToSpeech tts;
    private boolean ttsOk = false, speaking = false, lis = false, pageOk = false;
    private String pendWake = null;
    private String tVoice = "";
    private float tRate = 1f, tPitch = 1f;

    private void applyTts(String lang) {
        try {
            tts.setSpeechRate(tRate > 0.3f ? tRate : 1f);
            tts.setPitch(tPitch > 0.3f ? tPitch : 1f);
            String L = lang == null ? "" : lang;
            if (tVoice.length() > 0) {
                for (android.speech.tts.Voice v : tts.getVoices()) {
                    if (v.getName().equals(tVoice) && (L.length() == 0 || v.getLocale().getLanguage().equals(L) || (L.equals("uz") && v.getLocale().getLanguage().equals("tr")))) { tts.setVoice(v); return; }
                }
            }
            String[] chain = L.equals("ru") ? new String[]{"ru-RU"} : L.equals("en") ? new String[]{"en-US", "en-GB"} : new String[]{"uz-UZ", "tr-TR", "ru-RU"};
            for (String c : chain) {
                String[] p = c.split("-");
                if (tts.setLanguage(new java.util.Locale(p[0], p[1])) >= 0) return;
            }
        } catch (Exception e) {}
    }
    private long lastAct = 0;
    private final android.os.Handler wh = new android.os.Handler(android.os.Looper.getMainLooper());
    private ValueCallback<Uri[]> fcb;
    private String shName = "";
    private String shB64 = null;
    private final java.util.ArrayList<String[]> shQ = new java.util.ArrayList<>();

    private void readShare(Uri u) {
        try {
            java.io.InputStream is = getContentResolver().openInputStream(u);
            java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream();
            byte[] buf = new byte[16384];
            int n;
            while ((n = is.read(buf)) > 0) bo.write(buf, 0, n);
            is.close();
            String nm = "zakaz.xlsx";
            try {
                android.database.Cursor c = getContentResolver().query(u, null, null, null, null);
                if (c != null) {
                    int ix = c.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
                    if (ix >= 0 && c.moveToFirst()) nm = c.getString(ix);
                    c.close();
                }
            } catch (Exception e) {}
            synchronized (shQ) { shQ.add(new String[]{nm, android.util.Base64.encodeToString(bo.toByteArray(), android.util.Base64.NO_WRAP)}); }
        } catch (Exception e) {}
    }

    private void takeShare(Intent in) {
        try {
            if (in == null) return;
            String ac = in.getAction();
            if (Intent.ACTION_SEND.equals(ac)) {
                Uri u = (Uri) in.getParcelableExtra(Intent.EXTRA_STREAM);
                if (u != null) readShare(u);
            } else if (Intent.ACTION_SEND_MULTIPLE.equals(ac)) {
                java.util.ArrayList<Uri> L = in.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
                if (L != null) for (Uri u : L) if (u != null) readShare(u);
            } else return;
            in.setAction("");
            js("try{window.zkShared&&zkShared()}catch(e){}");
        } catch (Exception e) {}
    }

    @Override
    protected void onNewIntent(Intent in) {
        super.onNewIntent(in);
        setIntent(in);
        takeShare(in);
        takeWake(in);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFFF6EFE3);
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View v, WindowInsets i) {
                int l, t, r, b;
                if (Build.VERSION.SDK_INT >= 30) {
                    Insets x = i.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime());
                    l = x.left; t = x.top; r = x.right; b = x.bottom;
                } else {
                    l = i.getSystemWindowInsetLeft(); t = i.getSystemWindowInsetTop();
                    r = i.getSystemWindowInsetRight(); b = i.getSystemWindowInsetBottom();
                }
                v.setPadding(l, t, r, b);
                return i;
            }
        });
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView w, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fcb != null) fcb.onReceiveValue(null);
                fcb = cb;
                boolean cap = false;
                try { cap = p.isCaptureEnabled(); } catch (Throwable e) {}
                try {
                    if (cap) {
                        startActivityForResult(new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE), 8);
                    } else {
                        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                        i.addCategory(Intent.CATEGORY_OPENABLE);
                        boolean img = false;
                        try { String[] at = p.getAcceptTypes(); if (at != null) for (String t : at) if (t != null && t.startsWith("image")) img = true; } catch (Throwable e) {}
                        i.setType(img ? "image/*" : "*/*");
                        try { if (p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true); } catch (Throwable e) {}
                        startActivityForResult(i, 7);
                    }
                } catch (Exception e) {
                    fcb.onReceiveValue(null);
                    fcb = null;
                }
                return true;
            }
        });
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void open(final String url) {
                runOnUiThread(new Runnable() {
                    public void run() {
                        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception e) {}
                    }
                });
            }

            @JavascriptInterface
            public boolean hasShared() { synchronized (shQ) { return !shQ.isEmpty(); } }

            @JavascriptInterface
            public String sharedName() { synchronized (shQ) { return shQ.isEmpty() ? "" : shQ.get(0)[0]; } }

            @JavascriptInterface
            public String takeShared() { synchronized (shQ) { return shQ.isEmpty() ? "" : shQ.remove(0)[1]; } }

            @JavascriptInterface
            public void remind(final String title, final String text, final int iv, final int s, final int e) {
                runOnUiThread(new Runnable() {
                    public void run() {
                        android.content.SharedPreferences sp = getSharedPreferences("nvrem", 0);
                        boolean same = sp.getBoolean("on", false) && title.equals(sp.getString("t", "")) && text.equals(sp.getString("x", "")) && iv == sp.getInt("iv", 0) && s == sp.getInt("s", 0) && e == sp.getInt("e", 0);
                        sp.edit().putBoolean("on", true).putString("t", title).putString("x", text).putInt("iv", iv).putInt("s", s).putInt("e", e).apply();
                        try {
                            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
                                requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 9);
                            }
                        } catch (Exception x) {}
                        if (!same) NotifyReceiver.schedule(MainActivity.this);
                    }
                });
            }

            @JavascriptInterface
            public void remindOff() {
                runOnUiThread(new Runnable() {
                    public void run() {
                        android.content.SharedPreferences sp = getSharedPreferences("nvrem", 0);
                        if (sp.getBoolean("on", false)) {
                            sp.edit().putBoolean("on", false).apply();
                            NotifyReceiver.schedule(MainActivity.this);
                        }
                    }
                });
            }

            @JavascriptInterface
            public void notifyNow(final String title, final String text, final String url) {
                runOnUiThread(new Runnable() {
                    public void run() {
                        try {
                            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
                                requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 12);
                            }
                        } catch (Exception x) {}
                        NotifyReceiver.showNow(MainActivity.this, title, text, url);
                    }
                });
            }

            @JavascriptInterface
            public String ver() {
                try {
                    return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
                } catch (Exception e) {
                    return "1.0";
                }
            }

            @JavascriptInterface
            public void wakeSet(final boolean on, final boolean bg, final String w) {
                runOnUiThread(new Runnable() { public void run() {
                    getSharedPreferences("nvwake", 0).edit().putBoolean("on", on).putBoolean("bg", bg).putString("w", w == null || w.trim().length() == 0 ? "Hey Nonvoy" : w.trim()).apply();
                    if (on && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) { requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 10); return; }
                    try { if (on && bg && Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 11); } catch (Exception x) {}
                    
                    if (fw != null) fw.stop();
                    wakeSync();
                } });
            }

            @JavascriptInterface
            public String wakeGet() {
                android.content.SharedPreferences p = getSharedPreferences("nvwake", 0);
                boolean ov = true;
                
                try {
                    JSONObject o = new JSONObject();
                    o.put("on", p.getBoolean("on", false)); o.put("bg", p.getBoolean("bg", false)); o.put("w", p.getString("w", "Hey Nonvoy")); o.put("ovl", ov);
                    o.put("run", (fw != null && fw.running()) || (WakeService.I != null && WakeService.I.w != null && WakeService.I.w.running()));
                    return o.toString();
                } catch (Exception e) { return "{}"; }
            }

            @JavascriptInterface
            public void wakeResume() {
                runOnUiThread(new Runnable() { public void run() { if (lis || speaking) return; BUSY = false; wakeSync(); } });
            }

            @JavascriptInterface
            public void overlayPerm() {
                runOnUiThread(new Runnable() { public void run() {

                } });
            }

            @JavascriptInterface
            public boolean hasTts() { return ttsOk; }

            @JavascriptInterface
            public void setLang(final String l) { getSharedPreferences("nvwake", 0).edit().putString("lang", l == null ? "" : l).apply(); }

            @JavascriptInterface
            public String ttsVoices() {
                org.json.JSONArray a = new org.json.JSONArray();
                try {
                    for (android.speech.tts.Voice v : tts.getVoices()) {
                        JSONObject o = new JSONObject();
                        o.put("n", v.getName()); o.put("l", v.getLocale().toLanguageTag()); o.put("q", v.getQuality()); o.put("net", v.isNetworkConnectionRequired());
                        a.put(o);
                    }
                } catch (Exception e) {}
                return a.toString();
            }

            @JavascriptInterface
            public void ttsCfg(final String voice, final float rate, final float pitch) {
                tVoice = voice == null ? "" : voice; tRate = rate; tPitch = pitch;
            }

            @JavascriptInterface
            public void speakL(final String t, final String lang) {
                runOnUiThread(new Runnable() { public void run() {
                    lastAct = System.currentTimeMillis();
                    if (!ttsOk || tts == null) { js("window.onSpeakDone&&onSpeakDone()"); return; }
                    BUSY = true; speaking = true; pauseAll();
                    applyTts(lang);
                    tts.speak(t, android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, "nv" + System.currentTimeMillis());
                } });
            }

            @JavascriptInterface
            public void speak(final String t) {
                runOnUiThread(new Runnable() { public void run() {
                    lastAct = System.currentTimeMillis();
                    if (!ttsOk || tts == null) { js("window.onSpeakDone&&onSpeakDone()"); return; }
                    BUSY = true; speaking = true; pauseAll();
                    tts.speak(t, android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, "nv" + System.currentTimeMillis());
                } });
            }

            @JavascriptInterface
            public void ttsStop() {
                runOnUiThread(new Runnable() { public void run() { try { if (tts != null) tts.stop(); } catch (Exception e) {} speaking = false; } });
            }

            @JavascriptInterface
            public void listen() {
                runOnUiThread(new Runnable() {
                    public void run() { startListen(); }
                });
            }
            @JavascriptInterface
            public boolean wrap() { return true; }
        }, "Android");
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
            public void onPageFinished(WebView v, String url) {
                pageOk = true;
                if (pendWake != null) { String r = pendWake; pendWake = null; onWake(r); }
                if (!shQ.isEmpty()) js("try{window.zkShared&&zkShared()}catch(e){}");
            }
        });
        web.loadUrl(NV_START);
        ACT = this;
        fw = new Wake(this, new Wake.Cb() { public void hit(String rest) { onWake(rest); } });
        try {
            tts = new android.speech.tts.TextToSpeech(this, new android.speech.tts.TextToSpeech.OnInitListener() {
                public void onInit(int st) {
                    if (st != android.speech.tts.TextToSpeech.SUCCESS) return;
                    int r = tts.setLanguage(new java.util.Locale("uz", "UZ"));
                    if (r < 0) r = tts.setLanguage(new java.util.Locale("tr", "TR"));
                    if (r < 0) r = tts.setLanguage(new java.util.Locale("ru", "RU"));
                    ttsOk = r >= 0;
                    tts.setOnUtteranceProgressListener(new android.speech.tts.UtteranceProgressListener() {
                        public void onStart(String id) { speaking = true; }
                        public void onDone(String id) { speaking = false; lastAct = System.currentTimeMillis(); js("window.onSpeakDone&&onSpeakDone()"); }
                        public void onError(String id) { speaking = false; js("window.onSpeakDone&&onSpeakDone()"); }
                    });
                }
            });
        } catch (Exception e) {}
        takeWake(getIntent());
        wh.postDelayed(new Runnable() { public void run() {
            if (BUSY && !lis && !speaking && System.currentTimeMillis() - lastAct > 120000) { BUSY = false; wakeSync(); }
            wh.postDelayed(this, 10000);
        } }, 10000);
        takeShare(getIntent());
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                OnBackInvokedDispatcher.PRIORITY_DEFAULT, new OnBackInvokedCallback() {
                    @Override
                    public void onBackInvoked() { handleBack(); }
                });
        }
    }

    private void handleBack() {
        web.evaluateJavascript("(function(){try{return window.onBack?onBack():false}catch(e){return false}})()", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String v) {
                if (!"true".equals(v)) finish();
            }
        });
    }

    @Override
    public void onBackPressed() {
        handleBack();
    }

    private void js(final String code) {
        runOnUiThread(new Runnable() {
            public void run() { web.evaluateJavascript(code, null); }
        });
    }

    private void takeWake(Intent in) {
        try {
            if (in != null && in.hasExtra("wake")) {
                String r = in.getStringExtra("wake");
                in.removeExtra("wake");
                try { ((android.app.NotificationManager) getSystemService(NOTIFICATION_SERVICE)).cancel(5006); } catch (Exception e) {}
                onWake(r == null ? "" : r);
            }
        } catch (Exception e) {}
    }

    void onWake(String rest) {
        BUSY = true;
        lastAct = System.currentTimeMillis();
        pauseAll();
        if (!pageOk) { pendWake = rest; return; }
        js("window.onWake&&onWake(" + JSONObject.quote(rest) + ")");
    }

    private void pauseAll() {
        if (fw != null) fw.stop();
        WakeService.pause();
    }

    void wakeSync() {
        android.content.SharedPreferences p = getSharedPreferences("nvwake", 0);
        boolean on = p.getBoolean("on", false), bg = false;
        boolean mic = checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
        if (!on || !mic) {
            if (fw != null) fw.stop();
            
            return;
        }
        if (bg) {
            if (fw != null) fw.stop();
            if (WakeService.I == null) {

            } else {
                WakeService.mute(RES);
                if (!BUSY) WakeService.resume();
            }
        } else {
            
            if (RES && !BUSY) { fw.setMute(true); fw.start(); } else fw.stop();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        RES = true;
        wakeSync();
    }

    @Override
    protected void onPause() {
        RES = false;
        if (fw != null) fw.stop();
        WakeService.mute(false);
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (ACT == this) ACT = null;
        if (fw != null) fw.stop();
        try { if (tts != null) tts.shutdown(); } catch (Exception e) {}
        super.onDestroy();
    }

    private void startListen() {
        BUSY = true; lis = true; lastAct = System.currentTimeMillis();
        pauseAll();
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            lis = false;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 8);
            return;
        }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            js("onVoiceErr('Telefonda ovoz xizmati topilmadi')");
            return;
        }
        if (sr != null) sr.destroy();
        sr = SpeechRecognizer.createSpeechRecognizer(this);
        sr.setRecognitionListener(new RecognitionListener() {
            public void onReadyForSpeech(Bundle b) {}
            public void onBeginningOfSpeech() {}
            public void onRmsChanged(float v) {}
            public void onBufferReceived(byte[] b) {}
            public void onEndOfSpeech() {}
            public void onPartialResults(Bundle b) {}
            public void onEvent(int i, Bundle b) {}
            public void onError(int e) { lis = false; lastAct = System.currentTimeMillis(); js("onVoiceErr('Eshitilmadi, qayta urinib ko\\'ring')"); }
            public void onResults(Bundle b) {
                lis = false; lastAct = System.currentTimeMillis();
                ArrayList<String> r = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                if (r != null && r.size() > 0) {
                    org.json.JSONArray arr = new org.json.JSONArray();
                    for (String x : r) arr.put(x);
                    js("onVoice(" + arr.toString() + ")");
                }
                else js("onVoiceErr('Eshitilmadi')");
            }
        });
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        String rl = getSharedPreferences("nvwake", 0).getString("lang", "");
        String rt = rl.equals("ru") ? "ru-RU" : rl.equals("en") ? "en-US" : "uz-UZ";
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, rt);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, rt);
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        i.putExtra("android.speech.extras.SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS", 2000L);
        i.putExtra("android.speech.extras.SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS", 2000L);
        sr.startListening(i);
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] p, int[] g) {
        super.onRequestPermissionsResult(code, p, g);
        if (code == 10) { wakeSync(); return; }
        if (code == 8 && g.length > 0 && g[0] == PackageManager.PERMISSION_GRANTED) startListen();
        else if (code == 8) js("onVoiceErr('Mikrofon ruxsati berilmadi')");
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req == 8 && fcb != null) {
            Uri[] r = null;
            try {
                if (res == RESULT_OK && data != null && data.getExtras() != null) {
                    Bitmap bm = (Bitmap) data.getExtras().get("data");
                    if (bm != null) {
                        File f = new File(getCacheDir(), "cam" + System.currentTimeMillis() + ".jpg");
                        FileOutputStream o = new FileOutputStream(f);
                        bm.compress(Bitmap.CompressFormat.JPEG, 90, o);
                        o.close();
                        r = new Uri[]{Uri.fromFile(f)};
                    }
                }
            } catch (Exception e) {}
            fcb.onReceiveValue(r);
            fcb = null;
        }
        if (req == 7 && fcb != null) {
            Uri[] r = null;
            if (res == RESULT_OK && data != null) {
                if (data.getClipData() != null && data.getClipData().getItemCount() > 0) {
                    int c = data.getClipData().getItemCount();
                    r = new Uri[c];
                    for (int k = 0; k < c; k++) r[k] = data.getClipData().getItemAt(k).getUri();
                } else if (data.getData() != null) r = new Uri[]{data.getData()};
            }
            fcb.onReceiveValue(r);
            fcb = null;
        }
    }
}
