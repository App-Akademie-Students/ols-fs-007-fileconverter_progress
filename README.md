# File-Converter

Eine Full-Stack-Anwendung zum Konvertieren strukturierter Dateien.

Benutzer können eine Datei hochladen und ein Zielformat auswählen.
Die Konvertierung erfolgt serverseitig.

## Geplante Formate

- CSV
- JSON
- XML

## Tech Stack

- Next.js
- TypeScript
- React
- Node.js


## Lernziele

Das Projekt dient der Entwicklung einer kleinen Anwendung nach einem
Design-First-Ansatz mit AI-Unterstützung.

Dabei werden insbesondere folgende Konzepte untersucht:

- Strategy Pattern
- Factory Pattern
- Dependency Injection
- Trennung von Fachlogik und Framework-Code


## Entwicklungsansatz

Wir arbeiten nicht direkt vom Prompt zum Code.

Vor der Implementierung werden:

1. Anforderungen geklärt
2. Architekturvarianten diskutiert
3. Designentscheidungen dokumentiert
4. Teamstandards festgelegt
5. erst danach Quellcode erzeugt


## Info
* Die Dateien haben dabei bewusst unterschiedliche Aufgaben:

| Datei | Zweck | Fowler-Pattern |
|---|---|---|
| `README.md` | Was ist das Projekt, was soll es können? | Knowledge Priming |
| `CLAUDE.md` | Arbeitsanweisung für Claude | Knowledge Priming / Design-First |
| `requirements.md` | Fachliche Anforderungen und Scope | Design-First |
| `architecture.md` | Komponenten, Verantwortlichkeiten, Patterns | Design-First |
| `standards.md` | Coding- und Architekturregeln | Encoding Team Standards |
| `decisions.md` | getroffene Entscheidungen mit Begründung | Context Anchoring |
| `learnings.md` | Was hat mit AI gut/schlecht funktioniert? | Feedback Flywheel |


## Files
ols-fs-007-fileconverter/
│
├── README.md
├── CLAUDE.md
│
└── docs/
    ├── requirements.md
    ├── architecture.md
    ├── decisions.md
    ├── standards.md
    └── learnings.md


## Info
* Die Dateien haben dabei bewusst unterschiedliche Aufgaben:

| Datei | Zweck | Fowler-Pattern |
|---|---|---|
| `README.md` | Was ist das Projekt, was soll es können? | Knowledge Priming |
| `CLAUDE.md` | Arbeitsanweisung für Claude | Knowledge Priming / Design-First |
| `requirements.md` | Fachliche Anforderungen und Scope | Design-First |
| `architecture.md` | Komponenten, Verantwortlichkeiten, Patterns | Design-First |
| `standards.md` | Coding- und Architekturregeln | Encoding Team Standards |
| `decisions.md` | getroffene Entscheidungen mit Begründung | Context Anchoring |
| `learnings.md` | Was hat mit AI gut/schlecht funktioniert? | Feedback Flywheel |



## Docs

- [Anforderungen](docs/requirements.md)
- [Architektur](docs/architecture.md)
- [Entscheidungen](docs/decisions.md)
- [Standards](docs/standards.md)
- [Learnings](docs/learnings.md)
