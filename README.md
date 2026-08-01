# asbou45115.github.io

Linux-style desktop hub with a live ASCII ocean wallpaper (pirate ship on moving water). Desktop icons and a small terminal open project windows that link out to GitHub Pages apps.

Live: [https://asbou45115.github.io/](https://asbou45115.github.io/)

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000` (ES modules require HTTP, not `file://`).

## What’s on the desktop

- **Wallpaper** — interactive ASCII ocean + pirate ship (`ocean.js`); mouse stirs the water and the ship rides the waves
- **Icons / dock** — Black Hole, Particles, Plinko, ASCII, Terminal, GitHub
- **Terminal** — `help`, `ls`, `open <project>`, `github`, `neofetch`, …

## Deploy

Push to the default branch; GitHub Pages serves the static files.
