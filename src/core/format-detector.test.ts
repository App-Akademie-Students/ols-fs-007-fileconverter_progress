import { describe, expect, it } from "vitest";
import { UnsupportedFormatError } from "./errors";
import { FormatDetector } from "./format-detector";

describe("FormatDetector", () => {
  const detector = new FormatDetector();

  it("erkennt .csv", () => {
    expect(detector.detect("data.csv")).toBe("csv");
  });

  it("erkennt .json", () => {
    expect(detector.detect("data.json")).toBe("json");
  });

  it("ignoriert Groß-/Kleinschreibung der Endung", () => {
    expect(detector.detect("DATA.CSV")).toBe("csv");
    expect(detector.detect("data.Json")).toBe("json");
  });

  it("nutzt bei mehreren Punkten die letzte Endung", () => {
    expect(detector.detect("export.2024.01.csv")).toBe("csv");
    expect(detector.detect("data.csv.json")).toBe("json");
  });

  it("wirft bei fehlender Endung", () => {
    expect(() => detector.detect("data")).toThrow(UnsupportedFormatError);
    expect(() => detector.detect("data.")).toThrow(UnsupportedFormatError);
    expect(() => detector.detect(".csv")).toThrow(UnsupportedFormatError);
  });

  it("wirft bei unbekannter Endung", () => {
    expect(() => detector.detect("data.xml")).toThrow(UnsupportedFormatError);
  });
});
