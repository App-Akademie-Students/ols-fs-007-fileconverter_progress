import { describe, expect, it } from "vitest";
import type { ConversionStrategy } from "./conversion-strategy";
import { ConversionService, MAX_FILE_SIZE_BYTES } from "./conversion-service";
import {
  FileTooLargeError,
  InvalidInputError,
  UnsupportedConversionError,
  UnsupportedFormatError,
} from "./errors";
import type { Format } from "./format";

function createService(strategy: ConversionStrategy, source: Format = "csv") {
  return new ConversionService(
    { detect: () => source },
    { create: () => strategy },
  );
}

const echo: ConversionStrategy = { convert: (input) => `out:${input}` };

describe("ConversionService", () => {
  it("konvertiert im Erfolgsfall und liefert das Zielformat", () => {
    const result = createService(echo).convert("a.csv", "x", "json");
    expect(result).toEqual({ content: "out:x", targetFormat: "json" });
  });

  it("wirft, wenn Quell- und Zielformat identisch sind", () => {
    expect(() => createService(echo).convert("a.csv", "x", "csv")).toThrow(
      UnsupportedConversionError,
    );
  });

  it("wirft bei Dateien über 1 MiB", () => {
    const big = "a".repeat(MAX_FILE_SIZE_BYTES + 1);
    expect(() => createService(echo).convert("a.csv", big, "json")).toThrow(
      FileTooLargeError,
    );
  });

  it("akzeptiert genau 1 MiB", () => {
    const exact = "a".repeat(MAX_FILE_SIZE_BYTES);
    expect(() => createService(echo).convert("a.csv", exact, "json")).not.toThrow();
  });

  it("zählt Bytes, nicht Zeichen", () => {
    const umlauts = "ä".repeat(MAX_FILE_SIZE_BYTES / 2 + 1);
    expect(() => createService(echo).convert("a.csv", umlauts, "json")).toThrow(
      FileTooLargeError,
    );
  });

  it("entfernt einen UTF-8-BOM vor der Strategy", () => {
    const result = createService(echo).convert("a.csv", "﻿x", "json");
    expect(result.content).toBe("out:x");
  });

  it("reicht Fehler der Strategy durch", () => {
    const failing: ConversionStrategy = {
      convert: () => {
        throw new InvalidInputError("kaputt");
      },
    };
    expect(() => createService(failing).convert("a.csv", "x", "json")).toThrow(
      InvalidInputError,
    );
  });

  it("reicht Fehler des Detectors durch", () => {
    const service = new ConversionService(
      {
        detect: () => {
          throw new UnsupportedFormatError("unbekannt");
        },
      },
      { create: () => echo },
    );
    expect(() => service.convert("a.xyz", "x", "json")).toThrow(
      UnsupportedFormatError,
    );
  });
});
