## Copilot instructions for the "Dark-Details-Form" workspace

These instructions help an AI coding agent understand the repository layout, development workflows, and project-specific conventions so it can make safe, useful code changes.

### Big picture

- This workspace contains many small static web pages organized by folders named `Day1`, `Day2`, ..., plus a `Splitter APP` folder. Each folder typically contains an `index.html` or `home.html`, a JavaScript file (`script.js`, `scripr.js`, `aketch.js`, etc.), and a stylesheet (`style.css`, `styles.css`, `Home.css`).
- There is no single build system: these are plain HTML/CSS/JS projects. Changes should avoid introducing server-side or build tooling unless requested.

### What to change and how

- Prefer minimal, local edits to the files inside a single day folder unless the user requests cross-folder refactors.
- Keep naming and casing consistent with the folder: many files use `home.html`, `Home.html`, `index.html` (case-sensitive on Linux but not Windows). Respect existing capitalization when editing.
- When adding new assets, place them with the page that uses them (e.g., add `new-component.js` beside `Day3/index.html`).

### Conventions found in this repo

- Stylesheets are referenced with relative paths like `<link rel="stylesheet" href="style.css">`. JavaScript is loaded via `<script src="script.js"></script>` placed near the end of the HTML file.
- Some folders contain typos in filenames (`scripr.js`, `Style.css`). If renaming files to fix typos, update all references in the same folder and ask the user before cross-folder renames.
- Keep edits small and well-scoped: these appear to be learning exercises or demos — avoid large API additions or dependency installs.

### Patterns and examples

- Typical page structure: open `Day3/index.html` or `Day5/index.html` to see the common pattern (styles at top, script at end). Use these as templates for new pages.
- `Splitter APP/Home.html` references `Style.css` and `styles.css` concurrently — prefer consolidating styles only when the user asks.

### Testing and verification

- Because this is static HTML/CSS/JS, a quick validation is to open the HTML file in a browser. For automated checks, run a local simple HTTP server if needed (not added by default).
- Do not add test frameworks or complex CI steps without user approval.

### Safety & best practices for the agent

- Do not create or modify files outside the folder(s) the user mentioned in a request without explicit permission.
- When a filename seems misspelled, propose a change and show a diff rather than renaming silently.
- Avoid adding third-party dependencies. If needed, explain why and request permission.

### Useful files to inspect when editing

- `Day*/index.html` or `Day*/home.html` — representative page markup
- `Day*/script.js` — client-side logic patterns
- `Splitter APP/Home.html` — an app-like page with multiple styles referenced

### If you need to scaffold or refactor

- Ask the user before introducing a build system (npm, webpack, etc.). If asked, propose minimal scaffolding in a new branch and include a README explaining commands.

If anything in these instructions is unclear or you'd like more detail about a specific folder, tell me which folder and I'll update this file.
