# Portfolio update playbook

Use this when new career information arrives. The goal is one clean pass from rough notes to verified site copy, tests, and durable context—without loading unrelated design history.

## Fastest workflow

1. Put confidential or messy source notes in `.context-local/` or a file ending `.context.local.md`; both are ignored by Git.
2. Start a prompt with one of the templates below and attach/paste the source facts.
3. The agent reads `AGENTS.md`, `docs/context/CAREER.md`, the relevant implementation, and only other context required by the requested scope.
4. The agent separates verified facts from missing, conflicting, private, or ambiguous details.
5. It updates the rendered content, canonical career context, and affected tests together; searches for superseded values; then runs proportional checks.
6. Review the factual diff before approving publication. Design changes are separate unless explicitly requested.

## Universal prompt

```text
Update my portfolio from the information below.

Treat my supplied facts as authoritative, but do not invent or inflate anything. Read AGENTS.md and docs/context/CAREER.md, then inspect the relevant current code. Reconcile every changed fact across the rendered site, tests, and career context. Search for stale versions of superseded dates, metrics, names, links, and technologies. Preserve the current book design and interactions unless I explicitly request a design change. Keep private/unreleased details out of public copy. If a real conflict cannot be resolved from my source, list it clearly instead of guessing. Run the relevant checks and summarize the public changes, private facts deliberately omitted, and any unresolved items.

New information:
[paste notes, bullets, resume excerpt, or links here]
```

## Add a new role

```text
Add this role to my portfolio and canonical career context. Keep the copy concise, first-person, backend-focused where accurate, and based only on the facts I provide. Place it in correct reverse-chronological order. Update technology chips and tests only for explicitly verified technologies. Do not infer business outcomes.

Company:
Title:
Location (only if public):
Start and end dates:
What I built:
My specific contribution:
Verified scope or metrics, including units and baseline:
Technologies I directly used:
Links or evidence:
Details that must remain private:
```

## Update an existing role or metric

```text
Replace the old portfolio facts for [company/project] with the verified facts below. Identify which old statements are superseded, search the repository for every stale value, and update docs/context/CAREER.md, rendered copy, visual metric labels/ratios, and tests together. Keep any still-valid facts. Do not combine metrics with different baselines.

Old fact, if known:
New verified fact:
Measurement period / denominator:
Evidence or source:
Public wording preference:
Anything private:
```

## Add or update a project

```text
Add/update this project using only the supplied facts. Keep the existing Selected Work structure unless I ask for a redesign. Verify the repository/link and image metadata, write honest alt text, and do not invent usage, impact, awards, or deployment status.

Project name:
One-sentence purpose:
What I personally built:
Verified outcome or scope:
Stack I directly used:
Repository/demo URL:
Date or event:
Screenshot path and what it shows:
Private/unreleased details:
```

## Update skills

```text
Update my public skills from the facts below. Add only technologies I have actually used and place each in the existing taxonomy. Do not infer proficiency levels from dependencies or a single mention. Remove a skill only if I explicitly say it should no longer be public. Reuse an existing local icon when possible; if an icon is missing, report it rather than inventing a brand asset.

Add:
Remove from public display:
Evidence/context for each addition:
Preferred category, if any:
```

## Update education, contact, resume, or availability

```text
Update the portfolio and career context with the verified identity/contact facts below. Do not infer degree equivalence or study dates. Keep environment-backed contact values out of tracked files unless I explicitly provide a public value and ask for it to be committed. Preserve honest placeholders for anything unconfigured.

Field to update:
Exact public value:
Effective date, if relevant:
Source/evidence:
Should the old value be removed everywhere? yes/no
```

## Request a design or behavior change

```text
Change this aspect of The Book: [request]. Read AGENTS.md, docs/context/BOOK.md, docs/context/ENGINEERING.md, and only the relevant entries in DECISIONS.md. Inspect the current implementation and tests before editing. Preserve the no-JS document, live reduced-motion behavior, native scrolling, bidirectional reversal, and existing material constraints unless I explicitly supersede one. If my request conflicts with a current contract, name the conflict and treat my latest explicit instruction as the new decision. Update the current-state context and decision record, then run the appropriate visual and browser checks.
```

## What a good handoff must say

- Which facts became public and where.
- Which previous facts were superseded or removed.
- Which supplied details stayed private and why.
- Any unresolved conflicts or missing evidence.
- Files changed and checks run.
- Whether screenshots/browser input were simulated or reviewed on physical hardware.

Do not paste secrets into prompts or tracked Markdown. Use `.env.local` for environment values and `.context-local/` for private source notes.
