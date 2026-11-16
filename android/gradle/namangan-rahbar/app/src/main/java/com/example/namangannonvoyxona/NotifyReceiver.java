package com.example.namangannonvoyxona;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import java.util.Calendar;

public class NotifyReceiver extends BroadcastReceiver {
    public static void schedule(Context c) {
        try {
            SharedPreferences p = c.getSharedPreferences("nvrem", 0);
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            Intent i = new Intent(c, NotifyReceiver.class);
            i.setAction("nv.remind");
            PendingIntent pi = PendingIntent.getBroadcast(c, 77, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            am.cancel(pi);
            if (!p.getBoolean("on", false)) return;
            long iv = Math.max(15, p.getInt("iv", 120)) * 60000L;
            am.setInexactRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + iv, iv, pi);
        } catch (Exception e) {}
    }

    public static void showNow(Context c, String title, String text, String url) {
        try {
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= 26) {
                nm.createNotificationChannel(new NotificationChannel("nv_upd", "Yangilanishlar", NotificationManager.IMPORTANCE_HIGH));
            }
            Intent o;
            if (url != null && url.length() > 0) { o = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url)); o.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); }
            else o = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
            PendingIntent pi = PendingIntent.getActivity(c, 79, o, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, "nv_upd") : new Notification.Builder(c);
            b.setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setContentTitle(title)
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setContentIntent(pi)
                .setAutoCancel(true);
            nm.notify(1002, b.build());
        } catch (Exception e) {}
    }

    @Override
    public void onReceive(Context c, Intent in) {
        try {
            String a = in.getAction();
            if (Intent.ACTION_BOOT_COMPLETED.equals(a)) {
                schedule(c);
                return;
            }
            SharedPreferences p = c.getSharedPreferences("nvrem", 0);
            if (!p.getBoolean("on", false)) return;
            int h = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
            if (h < p.getInt("s", 8) || h > p.getInt("e", 20)) return;
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= 26) {
                nm.createNotificationChannel(new NotificationChannel("nv_rem", "Eslatmalar", NotificationManager.IMPORTANCE_HIGH));
            }
            Intent o = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
            PendingIntent pi = PendingIntent.getActivity(c, 78, o, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, "nv_rem") : new Notification.Builder(c);
            b.setSmallIcon(android.R.drawable.ic_popup_reminder)
                .setContentTitle(p.getString("t", "Eslatma"))
                .setContentText(p.getString("x", ""))
                .setStyle(new Notification.BigTextStyle().bigText(p.getString("x", "")))
                .setContentIntent(pi)
                .setAutoCancel(true);
            nm.notify(1001, b.build());
        } catch (Exception e) {}
    }
}
