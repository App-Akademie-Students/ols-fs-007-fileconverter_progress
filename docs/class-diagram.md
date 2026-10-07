# Klassendiagramm (MVP, minimal)

Nur die Kernstruktur. Siehe [architecture.md](architecture.md) und [decisions.md](decisions.md).

```mermaid
%%{init: {"theme": "base", "themeVariables": {"lineColor": "#e11d48", "primaryColor": "#e0f2fe", "primaryTextColor": "#0f172a", "primaryBorderColor": "#0369a1"}}}%%
classDiagram
    direction TB

    class CompositionRoot
    class ConversionService
    class ConverterFactory
    class ConversionStrategy {
        <<interface>>
        convert(input) string
    }
    class CsvToJsonStrategy
    class JsonToCsvStrategy

    CompositionRoot --> ConversionService : erzeugt, injiziert Factory
    CompositionRoot --> ConverterFactory : registriert Erzeuger
    ConversionService --> ConverterFactory : nutzt
    ConverterFactory --> ConversionStrategy : erzeugt
    ConversionStrategy <|-- CsvToJsonStrategy
    ConversionStrategy <|-- JsonToCsvStrategy
```

- **Strategy:** `ConversionStrategy` mit zwei konkreten Richtungen.
- **Factory:** `ConverterFactory` erzeugt die Strategy für (Quelle, Ziel) aus registrierten Erzeugern.
- **DI:** Die `CompositionRoot` verdrahtet alles; `ConversionService` bekommt die Factory per Konstruktor.

Weggelassen: API-Route, `FormatDetector`, `Format`, Domain-Fehler.
