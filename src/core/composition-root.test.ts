import { describe, expect, it } from "vitest";
import { createApplication } from "./composition-root";

describe("createApplication (Integration)", () => {
  const { conversionService } = createApplication();

  it("konvertiert CSV nach JSON", () => {
    const result = conversionService.convert("a.csv", "name\nAnna", "json");
    expect(result.targetFormat).toBe("json");
    expect(JSON.parse(result.content)).toEqual([{ name: "Anna" }]);
  });

  it("konvertiert JSON nach CSV", () => {
    const result = conversionService.convert("a.json", '[{"name":"Anna"}]', "csv");
    expect(result.content).toBe("name\r\nAnna");
  });

  it("verarbeitet CSV mit BOM", () => {
    const result = conversionService.convert("a.csv", "﻿name\nAnna", "json");
    expect(JSON.parse(result.content)).toEqual([{ name: "Anna" }]);
  });
});
