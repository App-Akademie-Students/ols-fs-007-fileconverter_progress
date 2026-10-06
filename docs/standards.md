# Team Standards

* beschreibt allgemeine Regeln, die dauerhaft für das Projekt gelten.



## TypeScript

- TypeScript strict mode verwenden.
- `any` vermeiden.
- Öffentliche Schnittstellen explizit typisieren.
- Aussagekräftige Namen verwenden.



## Architektur

- Keine Konvertierungslogik in React-Komponenten.
- Keine Konvertierungslogik in API Routes.
- Services kennen keine HTTP-spezifischen Typen.
- Strategies kennen Next.js nicht.
- Konkrete Strategies implementieren eine gemeinsame Schnittstelle.
- Objekterzeugung wird von fachlicher Logik getrennt.


## Design Patterns

Patterns werden nur eingesetzt, wenn sie ein konkretes Designproblem lösen.

Für jedes eingesetzte Pattern muss beantwortet werden:

1. Welches Problem haben wir?
2. Warum reicht eine einfachere Lösung nicht?
3. Was verbessert das Pattern?
4. Welche zusätzliche Komplexität entsteht?


## Tests

- Konvertierungsstrategien sollen unabhängig von Next.js testbar sein.
- Jede Strategy erhält eigene Unit Tests.
- Fehlerfälle werden ebenfalls getestet.
- sehr aufwändige Tests nicht testen, nur Hinweise
- nicht testbarer Code - Hinweise geben


## AI-generierter Code

AI-generierter Code wird nicht ungeprüft übernommen.

Vor Übernahme prüfen:

- passt er zur Architektur?
- hält er die Standards ein?
- führt er unnötige Abstraktionen ein?
- verändert er bestehende Entscheidungen?