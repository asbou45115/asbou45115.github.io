# asbou45115.github.io

Ghost in the Shell–inspired portfolio. The shell-assembly clip is **precomputed** to ASCII (green / black / white) with the same algorithm as [`ascii_renderer`](https://github.com/asbou45115/ascii_renderer), then the browser only plays those frames — no live Sobel work.

## Run locally

```bash
python -m http.server 8000
```

Open `http://127.0.0.1:8000`.

## Interaction

- Plays **once** forward
- **Click** reverses; click again plays forward
- Frames come from `assets/ascii/` (must be generated first)

## Precompute ASCII frames (uv)

Requires [uv](https://github.com/astral-sh/uv). Do **not** pip-install into the system Python.

```bash
cd tools/precompute_ascii
uv sync
uv run python main.py
```

This upscales each frame of `assets/shell.mp4` toward 4K, runs the ASCII renderer, and writes:

- `assets/ascii/frames/frame_XXXX.webp`
- `assets/ascii/manifest.json`

## Deploy

Commit the precomputed `assets/ascii/` frames with the site (or regenerate in CI), then push to `main` for GitHub Pages.
