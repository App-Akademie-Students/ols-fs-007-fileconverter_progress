import { describe, expect, it } from "vitest";
import { InvalidInputError } from "../errors";
import { CsvToJsonStrategy } from "./csv-to-json-strategy";

describe("CsvToJsonStrategy", () => {
  const strategy = new CsvToJsonStrategy();

  it("konvertiert gültiges CSV, alle Werte bleiben Strings", () => {
    const output = strategy.convert("name,age\nAnna,30\nBen,25\n");
    expect(JSON.parse(output)).toEqual([
      { name: "Anna", age: "30" },
      { name: "Ben", age: "25" },
    ]);
  });

  it("rückt die Ausgabe mit 2 Leerzeichen ein", () => {
    expect(strategy.convert("a\n1")).toBe('[\n  {\n    "a": "1"\n  }\n]');
  });

  it("behandelt Komma und Anführungszeichen im Wert", () => {
    const output = strategy.convert('name,note\n"Meier, Anna","sagt ""Hallo"""');
    expect(JSON.parse(output)).toEqual([
      { name: "Meier, Anna", note: 'sagt "Hallo"' },
    ]);
  });

  it("behandelt Umlaute", () => {
    const output = strategy.convert("stadt\nMünchen\nKöln");
    expect(JSON.parse(output)).toEqual([{ stadt: "München" }, { stadt: "Köln" }]);
  });

  it("liefert bei nur einer Kopfzeile ein leeres Array", () => {
    expect(JSON.parse(strategy.convert("name,age\n"))).toEqual([]);
  });

  it("wirft bei leerer Eingabe", () => {
    expect(() => strategy.convert("")).toThrow(InvalidInputError);
    expect(() => strategy.convert("  \n ")).toThrow(InvalidInputError);
  });

  it("wirft bei Zeilen mit falscher Spaltenzahl", () => {
    expect(() => strategy.convert("a,b\n1,2,3")).toThrow(InvalidInputError);
    expect(() => strategy.convert("a,b\n1")).toThrow(InvalidInputError);
  });

  it("wirft bei nicht geschlossenem Anführungszeichen", () => {
    expect(() => strategy.convert('a,b\n"1,2')).toThrow(InvalidInputError);
  });
});
