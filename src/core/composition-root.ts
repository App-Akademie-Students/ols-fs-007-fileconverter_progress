import { ConversionService } from "./conversion-service";
import { ConverterFactory } from "./converter-factory";
import { FormatDetector } from "./format-detector";
import { CsvToJsonStrategy } from "./strategies/csv-to-json-strategy";
import { JsonToCsvStrategy } from "./strategies/json-to-csv-strategy";

export interface Application {
  conversionService: ConversionService;
  converterFactory: ConverterFactory;
  formatDetector: FormatDetector;
}

// Einziger Ort, der alle konkreten Klassen kennt und verdrahtet.
export function createApplication(): Application {
  const formatDetector = new FormatDetector();

  const converterFactory = new ConverterFactory();
  converterFactory.register("csv", "json", () => new CsvToJsonStrategy());
  converterFactory.register("json", "csv", () => new JsonToCsvStrategy());

  const conversionService = new ConversionService(
    formatDetector,
    converterFactory,
  );
  return { conversionService, converterFactory, formatDetector };
}
