package com.example.namangannonvoyxonaishchi;

import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import java.util.ArrayList;

public class Wake {
    public interface Cb { void hit(String rest); }

    private final Context c;
    private final Cb cb;
    private final Handler h = new Handler(Looper.getMainLooper());
    private SpeechRecognizer sr;
    private boolean on = false;
    private boolean mute = false;
    private boolean muted = false;
    private String name = "nonvoy";

    public Wake(Context c, Cb cb) { this.c = c; this.cb = cb; }

    public static String phrase(Context c) { return c.getSharedPreferences("nvwake", 0).getString("w", "Hey Nonvoy"); }

    public boolean running() { return on; }

    public void setMute(boolean m) {
        mute = m;
        if (!m) doMute(false);
        else if (on) doMute(true);
    }

    public void start() {
        if (on) return;
        if (!SpeechRecognizer.isRecognitionAvailable(c)) return;
        name = token(phrase(c));
        on = true;
        if (mute) doMute(true);
        cycle();
    }

    public void stop() {
        on = false;
        h.removeCallbacksAndMessages(null);
        kill();
        doMute(false);
    }

    private void kill() {
        if (sr != null) {
            try { sr.cancel(); } catch (Exception e) {}
            try { sr.destroy(); } catch (Exception e) {}
            sr = null;
        }
    }

    private void doMute(boolean m) {
        if (m == muted) return;
        muted = m;
        AudioManager am = null;
        try { am = (AudioManager) c.getSystemService(Context.AUDIO_SERVICE); } catch (Exception e) {}
        if (am == null) return;
        int[] ss = {AudioManager.STREAM_MUSIC, AudioManager.STREAM_NOTIFICATION, AudioManager.STREAM_SYSTEM};
        for (int s : ss) {
            try { am.adjustStreamVolume(s, m ? AudioManager.ADJUST_MUTE : AudioManager.ADJUST_UNMUTE, 0); } catch (Exception e) {}
        }
    }

    private void later(long ms) {
        h.removeCallbacksAndMessages(null);
        h.postDelayed(new Runnable() { public void run() { cycle(); } }, ms);
    }

    private void cycle() {
        if (!on) return;
        try {
            if (sr == null) {
                sr = SpeechRecognizer.createSpeechRecognizer(c);
                sr.setRecognitionListener(new RecognitionListener() {
                    public void onReadyForSpeech(Bundle b) {}
                    public void onBeginningOfSpeech() {}
                    public void onRmsChanged(float v) {}
                    public void onBufferReceived(byte[] b) {}
                    public void onEndOfSpeech() {}
                    public void onEvent(int i, Bundle b) {}
                    public void onPartialResults(Bundle b) {}
                    public void onResults(Bundle b) {
                        if (check(b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION), false)) return;
                        later(120);
                    }
                    public void onError(int e) {
                        if (!on) return;
                        if (e == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS) { stop(); return; }
                        if (e == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || e == SpeechRecognizer.ERROR_CLIENT || e == 11 || e == 13) { kill(); later(900); return; }
                        later(200);
                    }
                });
            }
            Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "uz-UZ");
            i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "uz-UZ");
            i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
            i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
            i.putExtra("android.speech.extras.SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS", 1500L);
            i.putExtra("android.speech.extras.SPEECH_INPUT_MINIMUM_LENGTH_MILLIS", 15000L);
            sr.startListening(i);
        } catch (Exception e) {
            kill();
            later(1500);
        }
    }

    private boolean check(ArrayList<String> r, boolean partial) {
        if (!on || r == null) return false;
        for (String s : r) {
            String[] w = norm(s).split(" ");
            for (int k = 0; k < w.length; k++) {
                if (!like(w[k], name)) continue;
                boolean pre = k == 0 || isHey(w[k - 1]);
                if (!pre) continue;
                StringBuilder rest = new StringBuilder();
                for (int j = k + 1; j < w.length; j++) { if (rest.length() > 0) rest.append(' '); rest.append(w[j]); }
                final String out = rest.toString();
                on = false;
                h.removeCallbacksAndMessages(null);
                kill();
                doMute(false);
                h.post(new Runnable() { public void run() { cb.hit(out); } });
                return true;
            }
        }
        return false;
    }

    static boolean isHey(String w) {
        return w.equals("hey") || w.equals("xey") || w.equals("ey") || w.equals("hay") || w.equals("xay") || w.equals("hoy") || w.equals("he") || w.equals("hei") || w.equals("hej") || w.equals("ok") || w.equals("okey");
    }

    static String token(String p) {
        String best = "";
        for (String w : norm(p).split(" ")) if (!isHey(w) && w.length() > best.length()) best = w;
        return best.length() > 0 ? best : "nonvoy";
    }

    static boolean like(String w, String n) {
        if (w.length() == 0) return false;
        if (w.equals(n)) return true;
        if (Math.abs(w.length() - n.length()) > 2) return false;
        int lim = n.length() >= 5 ? 2 : 1;
        return lev(w, n) <= lim;
    }

    static int lev(String a, String b) {
        int[] p = new int[b.length() + 1], q = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) p[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            q[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int c = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                q[j] = Math.min(Math.min(q[j - 1] + 1, p[j] + 1), p[j - 1] + c);
            }
            int[] t = p; p = q; q = t;
        }
        return p[b.length()];
    }

    static String norm(String s) {
        String cy = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяўқғҳ";
        String[] la = {"a","b","v","g","d","e","yo","j","z","i","y","k","l","m","n","o","p","r","s","t","u","f","x","ts","ch","sh","sh","","i","","e","yu","ya","o","q","g","h"};
        StringBuilder o = new StringBuilder();
        for (char ch : s.toLowerCase().toCharArray()) {
            int ix = cy.indexOf(ch);
            if (ix >= 0) o.append(la[ix]);
            else if (Character.isLetterOrDigit(ch)) o.append(ch);
            else if (ch == '\'' || ch == '‘' || ch == '’' || ch == '`' || ch == 'ʻ' || ch == 'ʼ') {}
            else o.append(' ');
        }
        return o.toString().replaceAll("\\s+", " ").trim();
    }
}
