# Umsetzungsplan (MVP)

Ergänzt [architecture.md](architecture.md), [decisions.md](decisions.md) und [class-diagram.md](class-diagram.md). Es ist noch kein Code vorhanden. Grundlage sind ADR-010 bis ADR-012.


## Ordnerstruktur

Die Kernlogik liegt in `src/core/` ohne Next.js-Bezug. Der bestehende Ordner `app/` bleibt im Wurzelverzeichnis unverändert und liegt parallel zu `src/`.

```
src/
└── core/
    ├── format.ts                      Format-Typ ("csv" | "json")
    ├── errors.ts                      Domain-Fehler
    ├── conversion-strategy.ts         Interface
    ├── format-detector.ts
    ├── converter-factory.ts
    ├── conversion-service.ts
    ├── composition-root.ts            verdrahtet alles
    └── strategies/
        ├── csv-to-json-strategy.ts
        └── json-to-csv-strategy.ts
app/
├── api/convert/route.ts               dünner Adapter
├── components/FileConverterForm.tsx   Client-Komponente
├── layout.tsx
└── page.tsx
vitest.config.ts
```

Hinweis: Legt man später zusätzlich `src/app/` an, würde Next.js es ignorieren, solange `app/` im Wurzelverzeichnis existiert. Deshalb liegt in `src/` nur `core/`.

Tests liegen neben dem Code (`*.test.ts` in `src/core/`).
Neue Abhängigkeiten: `papaparse`, `@types/papaparse`, `vitest` (Dev). Neues Script `test` in `package.json`.


## Schnittstellen

- **`FormatDetector`:** `detect(fileName)` liefert ein `Format` oder wirft `UnsupportedFormatError`.
- **`ConverterFactory`:** `register(source, target, creator)`, `create(source, target)`, `getTargetsFor(source)`.
- **`ConversionService`:** `convert(fileName, content, targetFormat)` liefert Ergebnistext und Zielformat. Ablauf:
  1. Größe prüfen (max. 1 MiB, sonst `FileTooLargeError`)
  2. UTF-8-BOM am Anfang entfernen
  3. Quellformat erkennen
  4. Quelle ≠ Ziel prüfen
  5. Strategy über Factory holen und ausführen
- **API-Route:** nimmt `multipart/form-data` (Datei, Zielformat) an und bildet Fehler auf HTTP-Status ab:

| Fehler | Status |
|---|---|
| `UnsupportedFormatError` | 415 |
| `FileTooLargeError` | 413 |
| `UnsupportedConversionError` | 400 |
| `InvalidInputError` | 422 |
| alles andere | 500 |

Fehlerantworten sind JSON mit verständlicher Meldung.


## Umsetzungsreihenfolge

Jeder Schritt endet mit grünen Tests und einem Review gegen die Checkliste „AI-generierter Code“ aus den Standards. Nach jedem Schritt wird bei Bedarf `decisions.md` ergänzt.

| # | Schritt | Dateien |
|---|---|---|
| 0 | Setup: Vitest und PapaParse installieren, Test-Script | `package.json`, `vitest.config.ts` |
| 1 | Typen und Fehler | `format.ts`, `errors.ts`, `conversion-strategy.ts` |
| 2 | Format-Erkennung | `format-detector.ts` + Test |
| 3 | CSV→JSON | `strategies/csv-to-json-strategy.ts` + Test |
| 4 | JSON→CSV | `strategies/json-to-csv-strategy.ts` + Test |
| 5 | Factory | `converter-factory.ts` + Test |
| 6 | Service und Composition Root | `conversion-service.ts`, `composition-root.ts` + Test |
| 7 | API-Route | `app/api/convert/route.ts` |
| 8 | UI | `FileConverterForm.tsx`, `page.tsx` |
| 9 | Abschluss | manueller Ende-zu-Ende-Test, `learnings.md` füllen |


## Teststrategie

Framework: Vitest. Alle Tests in `src/core/` laufen ohne Next.js.

| Komponente | Testfälle |
|---|---|
| `FormatDetector` | `.csv`, `.json`, Großschreibung, keine Endung, unbekannte Endung, mehrere Punkte im Namen |
| `CsvToJsonStrategy` | gültiges CSV, Komma/Anführungszeichen im Wert, Umlaute, nur Kopfzeile, leere Eingabe (Fehler), fehlerhaftes CSV; Ausgabe mit 2 Leerzeichen eingerückt |
| `JsonToCsvStrategy` | Array flacher Objekte, Wert mit Komma/Anführungszeichen, verschachteltes Objekt (Fehler), uneinheitliche Schlüssel (Fehler), kein Array (Fehler), leeres Array (Fehler), ungültiges JSON (Fehler) |
| `ConverterFactory` | registriertes Paar, unbekanntes Paar → `UnsupportedConversionError`, `getTargetsFor` |
| `ConversionService` | mit Fake-Detector und Fake-Factory: Quelle = Ziel, Datei über 1 MiB, BOM wird entfernt, Fehler der Strategy werden durchgereicht, Erfolgsfall |
| Composition Root | ein Integrationstest mit echter Verdrahtung: CSV→JSON und JSON→CSV |

**Hinweise statt aufwändiger Tests** (laut Standards):
- **API-Route:** Sie ist bewusst so dünn, dass sie manuell getestet wird (z. B. mit `curl`). Der Upload-Parser hängt am Next.js-Request.
- **UI:** Dateiauswahl, Download und Anzeige werden manuell geprüft. Browser-APIs sind in Vitest nicht ohne Zusatzaufwand testbar.
