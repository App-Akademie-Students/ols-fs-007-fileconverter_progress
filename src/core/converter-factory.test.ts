import { describe, expect, it } from "vitest";
import { ConverterFactory } from "./converter-factory";
import type { ConversionStrategy } from "./conversion-strategy";
import { UnsupportedConversionError } from "./errors";

const fakeStrategy: ConversionStrategy = { convert: (input) => input };

describe("ConverterFactory", () => {
  it("erzeugt die Strategy für ein registriertes Paar", () => {
    const factory = new ConverterFactory();
    factory.register("csv", "json", () => fakeStrategy);
    expect(factory.create("csv", "json")).toBe(fakeStrategy);
  });

  it("ruft den Erzeuger bei jedem create erneut auf", () => {
    const factory = new ConverterFactory();
    let calls = 0;
    factory.register("csv", "json", () => {
      calls++;
      return { convert: (input) => input };
    });
    factory.create("csv", "json");
    factory.create("csv", "json");
    expect(calls).toBe(2);
  });

  it("wirft bei unbekanntem Paar", () => {
    const factory = new ConverterFactory();
    factory.register("csv", "json", () => fakeStrategy);
    expect(() => factory.create("json", "csv")).toThrow(UnsupportedConversionError);
  });

  it("unterscheidet die Richtung", () => {
    const factory = new ConverterFactory();
    const other: ConversionStrategy = { convert: () => "x" };
    factory.register("csv", "json", () => fakeStrategy);
    factory.register("json", "csv", () => other);
    expect(factory.create("json", "csv")).toBe(other);
  });

  it("liefert die Zielformate zu einer Quelle", () => {
    const factory = new ConverterFactory();
    factory.register("csv", "json", () => fakeStrategy);
    expect(factory.getTargetsFor("csv")).toEqual(["json"]);
    expect(factory.getTargetsFor("json")).toEqual([]);
  });
});
