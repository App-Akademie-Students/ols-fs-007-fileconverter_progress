# Architektur


## Ziel

Die eigentliche Dateikonvertierung soll nicht in React-Komponenten oder Next.js-API-Routen stattfinden, sondern in eigenständigen TypeScript-Komponenten.

Neue Konvertierungsarten sollen ergänzt werden können,
ohne bestehende Konvertierungslogik wesentlich zu verändern.


## Komponenten und Verantwortlichkeiten

| Komponente | Verantwortung | Kennt Next.js/HTTP? |
|---|---|---|
| UI (React) | Datei wählen, erkanntes Quellformat anzeigen (über `FormatDetector`), Zielformat wählen, Ergebnis anzeigen/herunterladen | ja |
| API-Route | Dünner Adapter: Upload lesen, Service aufrufen, Domain-Fehler auf HTTP-Status abbilden | ja |
| `ConversionService` | Ablauf: Format erkennen, Regeln prüfen (Quelle ≠ Ziel), Strategy holen, ausführen | nein |
| `FormatDetector` | Dateiendung → `Format`; reine Funktion ohne Framework-Bezug, von UI und Service nutzbar | nein |
| `ConverterFactory` | Erzeugt zu (Quellformat, Zielformat) die passende Strategy über registrierte Erzeuger-Funktionen; liefert auch die unterstützten Zielformate zu einer Quelle | nein |
| `ConversionStrategy` (Interface) | `convert(input: string): string` | nein |
| `CsvToJsonStrategy`, `JsonToCsvStrategy` | Konkrete Konvertierung inkl. Validierung (z. B. JSON muss Array flacher Objekte mit einheitlichen Schlüsseln sein) | nein |
| Domain-Fehler | `UnsupportedFormatError`, `UnsupportedConversionError`, `InvalidInputError`, `FileTooLargeError`, ohne HTTP-Bezug | nein |
| Composition Root | Einziger Ort, an dem Objekte verdrahtet werden: registriert die Erzeuger der Strategies in der Factory und baut den Service | nein |

Abhängigkeitsrichtung: UI → API-Route → `ConversionService` → (`FormatDetector`, `ConverterFactory`) → Strategies.
Der Service hängt von Abstraktionen ab, nicht von konkreten Strategies.
Die Composition Root kennt als einzige alle konkreten Klassen.


## Einsatz der Patterns

### Strategy
- **Problem:** Pro Formatpaar gibt es eigene Logik und eigene Regeln.
- **Warum nicht einfacher:** Ein `switch` im Service müsste bei jedem neuen Format geändert werden.
- **Verbesserung:** Jede Strategy ist isoliert testbar und austauschbar; neue Paare erfordern keine Änderung bestehender Strategies.
- **Komplexität:** Ein Interface und eine Klasse pro Richtung.

### Factory
- **Problem:** Der Service soll die konkreten Strategies weder kennen noch selbst erzeugen.
- **Warum nicht einfacher:** Direktes `new` im Service koppelt ihn an alle konkreten Klassen.
- **Verbesserung:** Auswahl und Erzeugung an einer Stelle; neues Paar = neue Registrierung in der Composition Root.
- **Komplexität:** Eine zusätzliche Klasse mit einer Map von Schlüssel (z. B. `csv->json`) auf Erzeuger-Funktion. Keine Klassenhierarchie.

### Dependency Injection
- **Problem:** Service braucht Detector und Factory; fest verdrahtet wären sie schwer testbar.
- **Warum nicht einfacher:** Ohne DI lassen sich im Test keine Fakes einsetzen.
- **Verbesserung:** Service ist ohne Next.js testbar, Abhängigkeiten sind mockbar.
- **Komplexität:** Eine Verdrahtungsstelle (Composition Root). Constructor Injection per Hand, kein DI-Container.


## Fehlerbehandlung

Fachliche Fehler werden als Exceptions mit Domain-Fehlertypen geworfen. Die API-Route übersetzt sie in verständliche Meldungen und HTTP-Status. Services und Strategies kennen keine HTTP-Typen.

| Fehlertyp | Auslöser |
|---|---|
| `UnsupportedFormatError` | Dateiendung fehlt oder ist unbekannt |
| `UnsupportedConversionError` | Quell- und Zielformat identisch oder kein Strategy-Eintrag für das Paar |
| `InvalidInputError` | Inhalt ungültig: Syntaxfehler, JSON nicht Array flacher Objekte, leeres Array, uneinheitliche Schlüssel |
| `FileTooLargeError` | Datei größer als 1 MiB |

Größenprüfung und Entfernen eines UTF-8-BOM geschehen zentral im `ConversionService`, vor der Strategy.


## Erweiterung (Beispiel XML – nicht Teil des MVP, erst später)

Der MVP umfasst nur CSV und JSON. XML wird erst später ergänzt und ist aktuell weder im Code noch in der Factory vorgesehen. Vorgehen dann:

1. Neues `Format` und Endungs-Zuordnung im `FormatDetector`.
2. Neue Strategies je Richtung.
3. Registrierung der Erzeuger in der Composition Root.

Bestehende Strategies und der Service bleiben unverändert.
