import Papa from "papaparse";
import { InvalidInputError } from "../errors";
import type { ConversionStrategy } from "../conversion-strategy";

export class CsvToJsonStrategy implements ConversionStrategy {
  convert(input: string): string {
    if (input.trim() === "") {
      throw new InvalidInputError("Die CSV-Datei ist leer.");
    }

    const result = Papa.parse<Record<string, string>>(input, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
    });

    const firstError = result.errors[0];
    if (firstError !== undefined) {
      const location =
        firstError.row !== undefined ? ` (Zeile ${firstError.row + 2})` : "";
      throw new InvalidInputError(
        `Die CSV-Datei ist fehlerhaft${location}: ${firstError.message}`,
      );
    }

    return JSON.stringify(result.data, null, 2);
  }
}
