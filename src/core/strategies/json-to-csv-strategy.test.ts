import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors";
import { JsonToCsvStrategy } from "./json-to-csv-strategy";

describe("JsonToCsvStrategy", () => {
  const strategy = new JsonToCsvStrategy();

  it("konvertiert ein Array flacher Objekte", () => {
    const output = strategy.convert(
      '[{"name":"Anna","age":30},{"name":"Ben","age":25}]',
    );
    expect(output).toBe("name,age\r\nAnna,30\r\nBen,25");
  });

  it("behandelt Komma und Anführungszeichen im Wert", () => {
    const output = strategy.convert(
      '[{"name":"Meier, Anna","note":"sagt \\"Hallo\\""}]',
    );
    expect(output).toBe('name,note\r\n"Meier, Anna","sagt ""Hallo"""');
  });

  it("behandelt Umlaute", () => {
    expect(strategy.convert('[{"stadt":"München"}]')).toBe("stadt\r\nMünchen");
  });

  it("akzeptiert gleiche Schlüssel in anderer Reihenfolge", () => {
    const output = strategy.convert('[{"a":1,"b":2},{"b":4,"a":3}]');
    expect(output).toBe("a,b\r\n1,2\r\n3,4");
  });

  it("schreibt null als leeres Feld", () => {
    expect(strategy.convert('[{"a":null,"b":1}]')).toBe("a,b\r\n,1");
  });

  it("wirft bei verschachteltem Objekt oder Array", () => {
    expect(() => strategy.convert('[{"a":{"b":1}}]')).toThrow(InvalidInputError);
    expect(() => strategy.convert('[{"a":[1,2]}]')).toThrow(InvalidInputError);
  });

  it("wirft bei uneinheitlichen Schlüsseln", () => {
    expect(() => strategy.convert('[{"a":1},{"b":2}]')).toThrow(InvalidInputError);
    expect(() => strategy.convert('[{"a":1,"b":2},{"a":3}]')).toThrow(
      InvalidInputError,
    );
  });

  it("wirft, wenn kein Array vorliegt", () => {
    expect(() => strategy.convert('{"a":1}')).toThrow(InvalidInputError);
    expect(() => strategy.convert("42")).toThrow(InvalidInputError);
  });

  it("wirft, wenn Array-Einträge keine Objekte sind", () => {
    expect(() => strategy.convert("[1,2]")).toThrow(InvalidInputError);
    expect(() => strategy.convert("[null]")).toThrow(InvalidInputError);
  });

  it("wirft bei leerem Array", () => {
    expect(() => strategy.convert("[]")).toThrow(InvalidInputError);
  });

  it("wirft bei ungültigem JSON", () => {
    expect(() => strategy.convert("{kaputt")).toThrow(InvalidInputError);
    expect(() => strategy.convert("")).toThrow(InvalidInputError);
  });
});
