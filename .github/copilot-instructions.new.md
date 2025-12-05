## Copilot instructions for the "Dark-Details-Form" workspace

Purpose: help an AI agent make small, safe edits across many single-file static demos. The repo is a collection of independent demo pages (one folder ≈ one page), so prefer minimal, local changes.

Big picture

- The repo contains many small static pages organized by folders named like `Day1`, `Day2`, ... plus a `Splitter APP` folder. Each folder normally has one HTML entry (e.g., `index.html`, `home.html`), one JS file (`script.js`, `scripr.js`, `sketch.js`), and one stylesheet (`style.css`, `styles.css`, `Home.css`).
- There is no centralized build, tests, or server. Treat folders as isolated demos unless the user asks for cross-folder work.

Where to edit (rules)

- Make edits only inside the target folder the user mentions. Do not refactor across many folders without explicit permission.
- Preserve filename casing when editing (Windows is forgiving; Linux viewers/hosting can break on case).
- When fixing typos (for example `Day23/scripr.js` or `Day25/Index.html`), propose the rename and show a single-folder diff; do not rename files silently across the repo.

Conventions discovered in this codebase

- Styles and scripts are linked with relative paths and loaded directly in the HTML (styles in the head, scripts near the end of body).
- Some folders contain duplicate or overlapping style files (e.g., `Splitter APP/Home.html` references both `Style.css` and `styles.css`). Consolidation is allowed only with user approval.
- Filenames vary in case and spelling (`Home.css`, `Style.css`, `styles.css`); search and update references in the same folder when changing a name.

Common patterns and concrete examples

- Template pattern: `Day3/index.html` and `Day5/index.html` show the typical structure (CSS link in head, JS at body end). Use them as lightweight templates.
- Watch for nonstandard script names: `Day8/aketch.js`, `Day9/sketch.js`, `Day23/scripr.js`.
- Examples to inspect when onboarding: `Day3/index.html`, `Day11/index.html` + `Day11/script.js`, `Splitter APP/Home.html`.

Developer workflows (practical commands)

- Quick local preview (PowerShell). From the repo root, run either:

```powershell
py -3 -m http.server 8000
# or, if python is on PATH
python -m http.server 8000
```

- If Node is available and you prefer an npm one-off server:

```powershell
npx http-server . -p 8000
```

- Live-editing recommendation: suggest the VS Code Live Server extension to the user rather than adding tooling to the repo.

Search & verification tips

- When changing behavior, search for DOM IDs / class names across the repo (many demos attach handlers by id). Useful search patterns: `document.getElementById\(|querySelector\(|addEventListener\(`.
- Before renaming files, grep for the filename (e.g., search for `scripr.js` or `Style.css`) and update all references in that folder.

When to avoid big changes

- Don’t add package.json, bundlers, or test frameworks unless the user explicitly requests a conversion to a modern web project. These are learning/demo pages — users typically expect tiny edits.

Integration and external dependencies

- There are no external service integrations visible in the repo. Images are stored under `Images/`. If a change requires a library, ask permission first and propose minimal, pinned changes.

Files worth inspecting

- `Day3/index.html`, `Day11/index.html` and `Day11/script.js` — representative interactive demo
- `Day23/scripr.js`, `Day24/scripts.js`, `Day25/Index.html` — examples of inconsistent naming
- `Splitter APP/Home.html` — multi-style example and a slightly larger page

If anything here is unclear or you'd like the file to emphasize other folders, tell me which folder(s) to expand and I will iterate.
