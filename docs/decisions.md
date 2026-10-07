# Architecture Decisions

* dokumentiert konkrete Architekturentscheidungen, die wir für dieses Projekt getroffen haben


## ADR-001: Strategy pro Formatpaar

- **Entscheidung:** Je Konvertierungsrichtung eine eigene Strategy (`CsvToJsonStrategy`, `JsonToCsvStrategy`, später XML).
- **Begründung:** Einfachste Lösung, die Erweiterbarkeit und Standards erfüllt; Richtungen können eigene Regeln haben (z. B. Flach-Prüfung nur bei JSON→CSV).
- **Verworfen:** (B) Parser/Serializer mit Zwischenmodell – für 2 Formate spekulativ; (C) `switch` im Service – verletzt Erweiterbarkeitsziel.
- **Umstiegskriterium:** Bei Hinzunahme von XML prüfen, ob die quadratisch wachsende Zahl an Strategies oder doppelter Parsing-Code zum Problem wird. Dann Wechsel auf Variante B; Service, Factory und Interface bleiben dabei weitgehend gleich.


## ADR-002: Factory mit registrierten Erzeuger-Funktionen

- **Entscheidung:** `ConverterFactory` hält eine Map von (Quellformat, Zielformat) auf eine Erzeuger-Funktion und erzeugt daraus die Strategy. Die Composition Root registriert die Erzeuger. Unbekannte Paare führen zu `UnsupportedConversionError`. Die Factory liefert auch die unterstützten Zielformate zu einer Quelle.
- **Begründung:** Service kennt keine konkreten Strategies; die Factory erzeugt wirklich (kein reiner Lookup fertiger Instanzen). Zuständigkeit klar getrennt: Composition Root verdrahtet, Factory wählt und erzeugt. Keine Klassenhierarchie, um Komplexität gering zu halten.


## ADR-003: Dependency Injection per Constructor Injection

- **Entscheidung:** Abhängigkeiten werden per Konstruktor übergeben und in einer Composition Root verdrahtet. Kein DI-Container.
- **Begründung:** Testbarkeit ohne Next.js; für diese Projektgröße genügt manuelle Verdrahtung.


## ADR-004: Schnittstelle string → string

- **Entscheidung:** `ConversionStrategy.convert(input: string): string`.
- **Begründung:** CSV, JSON und XML sind Textformate; einfachste Schnittstelle für den MVP.
- **Konsequenz:** Keine Stream-/Buffer-Verarbeitung; große Dateien sind nicht Ziel des MVP.


## ADR-005: Fehlerbehandlung per Exceptions

- **Entscheidung:** Domain-Fehlertypen (`InvalidInputError`, `UnsupportedConversionError`, ...) werden geworfen; die API-Route bildet sie auf HTTP-Status und verständliche Meldungen ab.
- **Begründung:** Einfacher als ein `Result`-Objekt; hält Services frei von HTTP-Typen.


## ADR-006: XML nicht im MVP

- **Entscheidung:** Der MVP unterstützt ausschließlich CSV und JSON. XML wird erst später umgesetzt.
- **Begründung:** Scope klein halten; entspricht `requirements.md` („Später“). Das `Format`-Modell enthält XML vorerst nicht.
- **Konsequenz:** Das Umstiegskriterium aus ADR-001 wird erst bei Aufnahme von XML geprüft. Das README nennt XML weiterhin als geplantes Format („später“).


## ADR-007: Quellformat-Erkennung über die Dateiendung, auch in der UI

- **Entscheidung:** `FormatDetector` ist eine reine TypeScript-Komponente ohne Framework-Bezug. Die UI nutzt sie direkt, um das erkannte Quellformat anzuzeigen. Der `ConversionService` erkennt das Format beim Konvertieren erneut auf dem Server.
- **Begründung:** Kein zusätzlicher Endpunkt nötig, Erkennungslogik bleibt an einer Stelle. Die Erkennung ist keine Konvertierungslogik und verletzt die Standards nicht. Der Server vertraut dem Client nicht.


## ADR-008: Domain-Fehlertypen

- **Entscheidung:** `UnsupportedFormatError` (Endung fehlt/unbekannt), `UnsupportedConversionError` (Quelle = Ziel oder Paar nicht registriert), `InvalidInputError` (Syntax, Struktur, uneinheitliche Schlüssel), ergänzt durch `FileTooLargeError` (ADR-012). Details siehe `architecture.md`.
- **Begründung:** Trennt Fehlerursachen, damit die API-Route sie sauber auf Status und Meldung abbilden kann. Ergänzt ADR-005.


## ADR-009: CSV/JSON-Regeln

- **Entscheidung:**
  - CSV wird mit PapaParse gelesen und geschrieben.
  - Encoding ist UTF-8.
  - Trennzeichen Komma, Kopfzeile Pflicht, alle Werte als Strings.
  - JSON→CSV: Array flacher Objekte mit einheitlichen Schlüsseln; sonst `InvalidInputError` mit verständlicher Meldung.
- **Begründung:** CSV-Parsing (Anführungszeichen, Escaping) selbst zu schreiben ist fehleranfällig und kein Lernziel. Strenge Regeln halten den MVP klein.
- **Leeres JSON-Array:** `InvalidInputError`, da keine Spalten für eine Kopfzeile vorhanden sind.
- **JSON-Ausgabe:** mit 2 Leerzeichen eingerückt.


## ADR-010: Ordnerstruktur `src/core/` parallel zu `app/`

- **Entscheidung:** Fachlogik liegt in `src/core/` (ohne Next.js-Bezug), Strategies in `src/core/strategies/`. Der bestehende Ordner `app/` bleibt im Wurzelverzeichnis unverändert. Tests liegen neben dem Code (`*.test.ts`). Imports sind relativ, `tsconfig.json` bleibt unverändert.
- **Begründung:** Klare, sichtbare Grenze zwischen Fachlogik und Framework-Code (Lernziel, Standards). Kein Umzug und keine Änderung am bestehenden Next.js-Aufbau nötig.
- **Konsequenz:** In `src/` liegt nur `core/`. Ein zusätzliches `src/app/` würde von Next.js ignoriert, solange `app/` im Wurzelverzeichnis existiert.


## ADR-011: Teststrategie mit Vitest

- **Entscheidung:** Vitest für Unit Tests in `src/core/`. Jede Strategy hat eigene Tests inklusive Fehlerfällen; Service wird mit Fakes getestet; ein Integrationstest prüft die echte Verdrahtung. API-Route und UI werden manuell geprüft, dafür gibt es Hinweise statt aufwändiger Tests.
- **Begründung:** Geringe Konfiguration mit TypeScript, kein Next.js nötig; entspricht den Standards (Strategies unabhängig von Next.js testbar).
- **Details:** siehe `implementation-plan.md`.


## ADR-012: Zentrale Vorverarbeitung im Service, Größenlimit

- **Entscheidung:** Der `ConversionService` prüft die Größe (max. 1 MiB, sonst `FileTooLargeError`, HTTP 413) und entfernt einen UTF-8-BOM am Dateianfang, bevor die Strategy ausgeführt wird.
- **Begründung:** Gilt für alle Strategies gleich, daher einmal zentral statt in jeder Strategy. Das Limit hält den MVP einfach, da die Verarbeitung vollständig im Speicher geschieht (ADR-004). Excel-Exporte enthalten oft einen BOM.
- **Konsequenz:** Ergänzt ADR-008 um `FileTooLargeError`. Neue Anforderungen stehen in `requirements.md`.
