# Deploying to GitHub Pages

The wedding invitation is published as a fully static site from the
`static-site/` folder. No server or database required — perfect for free
GitHub Pages hosting.

## One-time setup

1. **Connect this project to GitHub** (Lovable → + menu → GitHub → Connect).
2. On GitHub, open your repository → **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push any change to `main` (or click "Run workflow" on the Actions tab).

The workflow at `.github/workflows/deploy.yml` builds and publishes
`static-site/` automatically. Your invitation will be live at:

```
https://<your-username>.github.io/<your-repo-name>/
```

## Customizing

| What | Where |
|---|---|
| Names, date, venue, parents | `static-site/index.html` |
| Colors (cream / emerald / gold) | `:root` block in `static-site/index.html` |
| Background music | drop `background.mp3` into `static-site/music/` (see its README) |
| Phone number | search for `9846881469` in `static-site/index.html` |
| Map location | search for the `google.com/maps` link |

Commit & push — the site redeploys in ~1 minute.

## Custom domain

After your first deploy, add a `CNAME` file in `static-site/` containing
your domain (e.g. `nasrin-amal.com`) and configure DNS at your registrar.