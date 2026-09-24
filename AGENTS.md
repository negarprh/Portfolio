<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Book: agent entrypoint

This file is intentionally short. It routes work to focused sources so routine changes do not load the whole project history. The context set was reconciled with the working code on 2026-09-24.

## Start every task

1. Confirm the branch and working tree with `git branch --show-current` and `git status --short`.
2. Work on `makeover`. Do not edit, reset, or merge `main` unless the user explicitly asks.
3. Preserve unrelated user changes. The working tree may already be dirty.
4. Read only the context required by the task:

| Task                                                                               | Required context                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Career facts, biography, roles, projects, skills, education, links, or resume copy | [`docs/context/CAREER.md`](docs/context/CAREER.md)                                           |
| Layout, styling, covers, chapters, motion, accessibility, or visual direction      | [`docs/context/BOOK.md`](docs/context/BOOK.md)                                               |
| Components, data flow, Next.js, tests, assets, or deployment                       | [`docs/context/ENGINEERING.md`](docs/context/ENGINEERING.md) plus the relevant Next.js guide |
| Performance claims, motion regressions, or interpreting prior browser traces       | [`docs/context/VALIDATION.md`](docs/context/VALIDATION.md)                                   |
| Adding new career information or turning notes into portfolio updates              | [`docs/UPDATE_PLAYBOOK.md`](docs/UPDATE_PLAYBOOK.md)                                         |
| Revisiting an accepted/rejected direction or understanding why something exists    | [`DECISIONS.md`](DECISIONS.md)                                                               |

For a cross-cutting redesign, read `CAREER.md`, `BOOK.md`, and `ENGINEERING.md`; add `VALIDATION.md` only when evaluating performance evidence. Do not read `DECISIONS.md` by default; it is history, not current-state documentation.

## Rules that apply to all changes

- Treat current code and the focused context files as the source of truth. If they disagree, stop inventing: identify the mismatch, preserve verified facts, and reconcile both in the same change.
- Never invent career facts, dates, metrics, credentials, links, employers, product details, or outcomes. Mark missing information as `TBD` or keep the existing honest fallback.
- Keep “Currently Building” deliberately nonspecific until Negar explicitly approves public details.
- When a user supplies a durable fact, update the relevant implementation, `docs/context/CAREER.md`, and any affected test expectations together. Record a decision only when behavior or direction changes—not for ordinary fact edits.
- Keep authoritative context tracked in Git. Put private notes, resume drafts, and generated context exports in the ignored local paths documented in `.gitignore`.
- Use `rg`/`rg --files` for discovery. Use `apply_patch` for manual edits.
- For code changes, run the smallest relevant checks during iteration, then `npm run typecheck`, `npm run build`, and `npm test` when the scope warrants the full suite. Do not claim physical-device testing from simulated browser input.

## Definition of done

A change is complete when the implementation, focused context, and tests agree; unsupported claims are absent; no-JS and reduced-motion behavior remain valid where relevant; and the handoff names checks run plus any remaining uncertainty.
