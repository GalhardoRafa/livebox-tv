package br.livebox.tv;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * LiveBox para Android TV: uma WebView em tela cheia que carrega a mesma interface do Windows
 * (assets/www) e oferece ao JavaScript o objeto "Native" para guardar arquivos e gravações.
 */
public class MainActivity extends Activity {
    private static final String TAG = "LiveBox";
    private WebView web;
    private final Map<Integer, FileOutputStream> recs = new HashMap<>();
    private final Map<Integer, String> recFiles = new HashMap<>();
    private int recSeq = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        web = new WebView(this);
        web.setBackgroundColor(0xFF08090D);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        // Equivalente ao webSecurity:false do Windows: os canais vêm de servidores sem CORS.
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);

        web.setFocusable(true);
        web.setFocusableInTouchMode(true);
        web.addJavascriptInterface(new Bridge(), "Native");
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                Log.d(TAG, m.message() + " (" + m.sourceId() + ":" + m.lineNumber() + ")");
                return true;
            }

            @Override
            public Bitmap getDefaultVideoPoster() {
                return Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
            }
        });
        web.loadUrl("file:///android_asset/www/index.html");
        web.requestFocus();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (web != null) {
            // sai do app = para o som
            web.evaluateJavascript("(function(){var v=document.getElementById('video');if(v&&!v.paused)v.pause();})()", null);
            web.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onDestroy() {
        for (FileOutputStream f : recs.values()) {
            try {
                f.close();
            } catch (IOException ignored) {
            }
        }
        recs.clear();
        if (web != null) {
            web.removeJavascriptInterface("Native");
            web.destroy();
        }
        super.onDestroy();
    }

    private void js(String code) {
        if (web != null) web.evaluateJavascript(code, null);
    }

    private void sendKey(String key) {
        js("document.dispatchEvent(new KeyboardEvent('keydown',{key:'" + key + "',bubbles:true,cancelable:true}))");
    }

    /** Botões do controle remoto que a página não recebe sozinha. */
    @Override
    public boolean dispatchKeyEvent(KeyEvent e) {
        int code = e.getKeyCode();
        boolean down = e.getAction() == KeyEvent.ACTION_DOWN;
        switch (code) {
            case KeyEvent.KEYCODE_BACK:
                if (e.getAction() == KeyEvent.ACTION_UP) js("window.__back&&window.__back()");
                return true;
            case KeyEvent.KEYCODE_MENU:
            case KeyEvent.KEYCODE_INFO:
            case KeyEvent.KEYCODE_BOOKMARK:
                if (down && e.getRepeatCount() == 0) js("window.__menu&&window.__menu()");
                return true;
            case KeyEvent.KEYCODE_CHANNEL_UP:
            case KeyEvent.KEYCODE_PAGE_UP:
                if (down) sendKey("PageUp");
                return true;
            case KeyEvent.KEYCODE_CHANNEL_DOWN:
            case KeyEvent.KEYCODE_PAGE_DOWN:
                if (down) sendKey("PageDown");
                return true;
            case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
            case KeyEvent.KEYCODE_MEDIA_PLAY:
            case KeyEvent.KEYCODE_MEDIA_PAUSE:
                if (down && e.getRepeatCount() == 0) sendKey(" ");
                return true;
            default:
                return super.dispatchKeyEvent(e);
        }
    }

    private File dataFile(String name) {
        String safe = name.replaceAll("[^A-Za-z0-9._-]", "_");
        return new File(getFilesDir(), safe);
    }

    private File recDirectory() {
        File base = getExternalFilesDir(Environment.DIRECTORY_MOVIES);
        if (base == null) base = new File(getFilesDir(), "Movies");
        File d = new File(base, "LiveBox");
        //noinspection ResultOfMethodCallIgnored
        d.mkdirs();
        return d;
    }

    private File backupFile() {
        File base = getExternalFilesDir(null);
        if (base == null) base = getFilesDir();
        return new File(base, "livebox-backup.json");
    }

    private static String readAll(File f) throws IOException {
        InputStream in = new FileInputStream(f);
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        } finally {
            in.close();
        }
    }

    private static void writeAll(File f, String text) throws IOException {
        FileOutputStream out = new FileOutputStream(f);
        try {
            out.write(text.getBytes("UTF-8"));
        } finally {
            out.close();
        }
    }

    /** Métodos que o JavaScript chama (window.Native.*). */
    public class Bridge {
        @JavascriptInterface
        public String readFile(String name) {
            try {
                File f = dataFile(name);
                return f.exists() ? readAll(f) : null;
            } catch (Exception e) {
                Log.w(TAG, "readFile " + name, e);
                return null;
            }
        }

        @JavascriptInterface
        public void writeFile(String name, String text) {
            try {
                writeAll(dataFile(name), text);
            } catch (Exception e) {
                Log.w(TAG, "writeFile " + name, e);
            }
        }

        @JavascriptInterface
        public synchronized String recOpen(String name) {
            try {
                String safe = name.replaceAll("[^\\p{L}\\p{N} -]", "").trim();
                if (safe.length() > 90) safe = safe.substring(0, 90);
                if (safe.isEmpty()) safe = "canal";
                String stamp = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss", Locale.US).format(new Date());
                File f = new File(recDirectory(), safe + " " + stamp + ".webm");
                int id = ++recSeq;
                recs.put(id, new FileOutputStream(f));
                recFiles.put(id, f.getAbsolutePath());
                return "{\"id\":" + id + ",\"file\":\"" + f.getAbsolutePath().replace("\\", "\\\\").replace("\"", "\\\"") + "\"}";
            } catch (Exception e) {
                Log.w(TAG, "recOpen", e);
                return "{\"id\":0,\"file\":\"\"}";
            }
        }

        @JavascriptInterface
        public synchronized void recChunk(int id, String base64) {
            FileOutputStream f = recs.get(id);
            if (f == null) return;
            try {
                f.write(Base64.decode(base64, Base64.DEFAULT));
            } catch (Exception e) {
                Log.w(TAG, "recChunk", e);
            }
        }

        @JavascriptInterface
        public synchronized String recClose(int id) {
            FileOutputStream f = recs.remove(id);
            String path = recFiles.remove(id);
            if (f == null) return null;
            try {
                f.close();
            } catch (IOException ignored) {
            }
            return path;
        }

        @JavascriptInterface
        public String recDir() {
            return recDirectory().getAbsolutePath();
        }

        @JavascriptInterface
        public String saveBackup(String json) {
            try {
                File f = backupFile();
                writeAll(f, json);
                return f.getAbsolutePath();
            } catch (Exception e) {
                Log.w(TAG, "saveBackup", e);
                return null;
            }
        }

        @JavascriptInterface
        public String readBackup() {
            try {
                File f = backupFile();
                return f.exists() ? readAll(f) : null;
            } catch (Exception e) {
                return null;
            }
        }

        @JavascriptInterface
        public String backupDir() {
            return backupFile().getParent();
        }

        @JavascriptInterface
        public void log(String msg) {
            Log.d(TAG, msg);
        }

        @JavascriptInterface
        public void exit() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    finish();
                }
            });
        }
    }
}
