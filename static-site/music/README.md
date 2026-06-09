# Background Music

Place an audio file here named **`background.mp3`** and it will play when
visitors tap the music button on the invitation.

## How to customize

1. Pick any audio file (nasheed, instrumental, recitation, etc.).
2. Rename it to `background.mp3` (or convert it to MP3).
3. Drop it into this `music/` folder, replacing the existing file.
4. Commit & push — GitHub Actions will redeploy automatically.

## Different filename or format

Edit one line in `static-site/index.html`:

```html
<audio id="bgAudio" src="music/background.mp3" loop preload="none"></audio>
```

Change `music/background.mp3` to e.g. `music/nasheed.m4a`.

## Tips

- Keep under ~5 MB for fast mobile loading.
- Browsers block autoplay — playback starts after the visitor taps the button.
- MP3 is recommended for cross-device support.