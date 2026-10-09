import Papa from "papaparse";
import { InvalidInputError } from "../errors";
import type { ConversionStrategy } from "../conversion-strategy";

type FlatValue = string | number | boolean | null;
type FlatRecord = Record<string, FlatValue>;

export class JsonToCsvStrategy implements ConversionStrategy {
  convert(input: string): string {
    const records = this.parseRecords(input);
    const columns = Object.keys(records[0]);

    records.forEach((record, index) => this.assertConsistent(record, columns, index));

    return Papa.unparse({
      fields: columns,
      data: records.map((record) => columns.map((column) => record[column] ?? "")),
    });
  }

  private parseRecords(input: string): [FlatRecord, ...FlatRecord[]] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      throw new InvalidInputError("Die JSON-Datei ist kein gültiges JSON.");
    }

    if (!Array.isArray(parsed)) {
      throw new InvalidInputError(
        "Die JSON-Datei muss ein Array von Objekten enthalten.",
      );
    }
    if (parsed.length === 0) {
      throw new InvalidInputError(
        "Das JSON-Array ist leer und kann nicht nach CSV konvertiert werden.",
      );
    }

    parsed.forEach((item, index) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new InvalidInputError(
          `Eintrag ${index + 1} ist kein Objekt. Erwartet wird ein Array von Objekten.`,
        );
      }
    });

    return parsed as [FlatRecord, ...FlatRecord[]];
  }

  private assertConsistent(
    record: FlatRecord,
    columns: string[],
    index: number,
  ): void {
    const keys = Object.keys(record);
    const sameKeys =
      keys.length === columns.length && columns.every((c) => c in record);
    if (!sameKeys) {
      throw new InvalidInputError(
        `Eintrag ${index + 1} hat andere Schlüssel als der erste Eintrag. Alle Objekte müssen dieselben Schlüssel haben.`,
      );
    }

    for (const key of keys) {
      const value: unknown = record[key];
      if (typeof value === "object" && value !== null) {
        throw new InvalidInputError(
          `Eintrag ${index + 1}: Der Wert von "${key}" ist verschachtelt. Nur flache Objekte werden unterstützt.`,
        );
      }
    }
  }
}
