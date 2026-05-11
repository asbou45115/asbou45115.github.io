# asbou45115.github.io

Personal entry-point website for published GitHub Pages endpoints.

## Run locally (Python, port 8000)

From the project directory:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## What this site does

- Loads public repositories for `asbou45115` from the GitHub API
- Filters repos with GitHub Pages enabled (`has_pages = true`)
- Displays endpoint links in a minimal dark UI

## Deploy

Push changes to the default branch for this repository and GitHub Pages will serve the updated static files.
