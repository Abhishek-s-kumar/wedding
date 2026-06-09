## Add Google Map + background music

### 1. Embed venue map
Add a Google Maps iframe (no API key needed) for **Hayath Convention Centre, Thali, Thrissur** inside the event card, above the action buttons. Same embed goes into the static `static-site/index.html` for the GitHub Pages build.

```html
<iframe src="https://www.google.com/maps?q=Hayath+Convention+Centre+Thali+Thrissur&output=embed" />
```

Styled to match: rounded, gold hairline border, ~280px tall on mobile / ~340px desktop.

### 2. Background music — add a real track
The `music/` folder is empty, so the audio button does nothing. I'll fetch a short royalty-free instrumental (CC0 / public domain), upload it through Lovable Assets so it's CDN-hosted, and wire it into both the React route and the static HTML.

- React (`src/routes/index.tsx`): swap `BG_MUSIC_SRC` to the CDN URL from the asset pointer.
- Static (`static-site/index.html`): point `<audio src="…">` to the same CDN URL, and keep `static-site/music/README.md` instructions so the user can later swap to their own track.

### 3. Fix small hydration warning (quiet)
The countdown numbers render different values on server vs first client paint, causing a hydration mismatch. I'll initialize the countdown state to zeros and only compute real values after mount — purely cosmetic, no UX change.

### Files touched
- `src/routes/index.tsx` — map iframe + music URL + countdown init
- `static-site/index.html` — map iframe + music URL
- `src/assets/background-music.mp3.asset.json` — new asset pointer