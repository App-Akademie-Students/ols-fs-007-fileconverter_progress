# Requirements

## Ziel

Die Anwendung ermöglicht die Konvertierung strukturierter Dateien zwischen verschiedenen 
Formaten

## MVP

Ein Benutzer kann:

1. eine Datei auswählen,
2. das erkannte Quellformat sehen,
3. ein Zielformat auswählen,
4. die Konvertierung starten,
5. das Ergebnis anzeigen oder herunterladen.


## Unterstützte Formate
- CSV
- JSON

Später:
- XML

## Fachliche Regeln

- Das Quellformat wird anhand der Dateiendung erkannt.
- Quell- und Zielformat dürfen nicht identisch sein.
- JSON wird nur nach CSV konvertiert, wenn es ein Array flacher Objekte ist.
  Verschachtelte Strukturen führen zu einer verständlichen Fehlermeldung.
- JSON-Objekte mit uneinheitlichen Schlüsseln werden nicht nach CSV konvertiert
  (verständliche Fehlermeldung).
- Dateien werden als UTF-8 gelesen. Ein UTF-8-BOM am Dateianfang wird
  stillschweigend entfernt.
- Dateien dürfen höchstens 1 MiB groß sein. Größere Dateien führen zu einer
  eigenen, verständlichen Fehlermeldung.
- Ein leeres JSON-Array wird nicht nach CSV konvertiert (verständliche Fehlermeldung).
- JSON-Ausgaben werden mit 2 Leerzeichen eingerückt.
- Ungültige Eingabedateien führen zu einer verständlichen Fehlermeldung.
- Die Konvertierungslogik befindet sich nicht in der UI.
- Die Konvertierungslogik befindet sich nicht direkt in der API-Route.

## Nicht Teil des MVP

- Datenbank
- Benutzerkonten
- Speicherung hochgeladener Dateien
- Historie
- Cloud Storage