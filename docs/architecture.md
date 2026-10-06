# Architektur


## Ziel

Die eigentliche Dateikonvertierung soll nicht in React-Komponenten oder Next.js-API-Routen stattfinden, sondern in eigenständigen TypeScript-Komponenten.

Neue Konvertierungsarten sollen ergänzt werden können,
ohne bestehende Konvertierungslogik wesentlich zu verändern.



## Komponenten

### UI

Verantwortlich für:

- Datei auswählen
- Zielformat auswählen
- Konvertierung starten
- Ergebnis darstellen


### API Route

Verantwortlich für:

- HTTP Request (`multipart/form-data`) entgegennehmen (siehe D009)
- Eingaben validieren: Datei vorhanden, Zielformat bekannt
- Dateiinhalt als Text lesen und Quellformat ermitteln
- ConversionService aufrufen
- HTTP Response erzeugen
- fachliche Fehler auf HTTP-Statuscodes abbilden (siehe D008)


### ConversionService

Koordiniert eine Konvertierung.

Der Service kennt nicht die konkrete Implementierung einer Konvertierung.

### ConversionStrategy

Definiert die gemeinsame Schnittstelle für Konvertierungsalgorithmen.

Mögliche Implementierungen:

- CsvToJsonStrategy
- JsonToCsvStrategy

Später beispielsweise:

- XmlToJsonStrategy
- JsonToXmlStrategy

### ConversionStrategyFactory

Wählt abhängig von Quell- und Zielformat
eine geeignete ConversionStrategy aus.

Die Factory erhält ihre Strategies per Constructor Injection und kennt
keine konkreten Strategy-Klassen. Jede Strategy nennt ihr Quell- und
Zielformat selbst (siehe D004).