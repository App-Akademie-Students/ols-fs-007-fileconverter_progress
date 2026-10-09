# CLAUDE.md

# Claude Project Instructions

Lies vor jeder größeren Änderung zuerst:

1. README.md
2. docs/requirements.md
3. docs/architecture.md
4. docs/decisions.md
5. docs/standards.md
6. docs/learnings.md



## Arbeitsweise

Dieses Projekt folgt einem Design-First-Ansatz

1. analysiere die Anforderungen
2. identifiziere betroffene Komponenten
3. beschreibe mögliche Designalternativen
4. nenne Vor-und Nachteile
5. empfehle eine Lösung

Erzeuge erst Code, wenn die Designentscheidung getroffen wurde


## Architektur

Die Anwendung soll insbesondere folgende Patterns demonstrieren

- Strategy Pattern
- Factory Pattern
- Dependency Injection

Begründe immer, welches Problem mit dem Pattern gelöst wurde


## Ändern

Bestehende Architekturentscheidungen nicht stillschweigend verändern

## Qualität

Halte dich an die Regeln in:
docs/standards.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
