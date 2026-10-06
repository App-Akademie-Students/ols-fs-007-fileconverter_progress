# Requirements

## Ziel

Die Anwendung ermöglicht die Konventierung strukturierter Dateien zwischen verschiedenen 
Formaten

## MVP

Ein Benutzer kann:

1. eine Datei auswählen,
2. das erkannte Quellformat sehen,
3. ein Zielformat auswählen,
4. die Konvertierung starten,
5. das Ergebnis anzeigen oder herunterladen.


## Untersütze Formate
- CSV
- JSON

Später:
- XML

## Fachliche Regeln

- Das Quellformat wird anhand der Dateiendung erkannt.
- Quell- und Zielformat dürfen nicht identisch sein.
- JSON wird nur nach CSV konvertiert, wenn es ein Array flacher Objekte ist.
  Verschachtelte Strukturen führen zu einer verständlichen Fehlermeldung.
- Ungültige Eingabedateien führen zu einer verständlichen Fehlermeldung.
- Die Konvertierungslogik befindet sich nicht in der UI.
- Die Konvertierungslogik befindet sich nicht direkt in der API-Route.

## Nicht Teil des MVP

- Datenbank
- Benutzerkonten
- Speicherung hochgeladener Dateien
- Historie
- Cloud Storage