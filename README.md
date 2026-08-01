# asbou45115.github.io

Linux-style desktop hub with an Odyssey-themed ASCII wallpaper (Greek galley on a live multi-sine sea). A Projects folder and terminal open windows that link out to GitHub Pages apps.

Live: [https://asbou45115.github.io/](https://asbou45115.github.io/)

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000` (ES modules require HTTP, not `file://`).

## What’s on the desktop

- **Wallpaper** — ASCII Odyssean galley; mouse stirs `η(x,t)` (`ocean.js`)
- **Wave HUD** — live `η(x,t)` readout + sliders for A, k, ω, amp, speed
- **Projects/** — folder that auto-fetches public repos with GitHub Pages enabled
- **Terminal / GitHub** — shell + profile link

## Deploy

Push to the default branch; GitHub Pages serves the static files.
