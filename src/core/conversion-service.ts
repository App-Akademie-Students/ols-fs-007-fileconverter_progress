import type { ConverterFactory } from "./converter-factory";
import { FileTooLargeError, UnsupportedConversionError } from "./errors";
import type { FormatDetector } from "./format-detector";
import type { Format } from "./format";

export const MAX_FILE_SIZE_BYTES = 1024 * 1024;

const UTF8_BOM = "﻿";

export interface ConversionResult {
  content: string;
  targetFormat: Format;
}

// Pick: Der Service braucht nur diese Methoden, so lassen sich Fakes einfach einsetzen.
type Detector = Pick<FormatDetector, "detect">;
type StrategyFactory = Pick<ConverterFactory, "create">;

export class ConversionService {
  constructor(
    private readonly detector: Detector,
    private readonly factory: StrategyFactory,
  ) {}

  convert(
    fileName: string,
    content: string,
    targetFormat: Format,
  ): ConversionResult {
    if (new TextEncoder().encode(content).length > MAX_FILE_SIZE_BYTES) {
      throw new FileTooLargeError(
        "Die Datei ist größer als 1 MiB und kann nicht konvertiert werden.",
      );
    }

    const text = content.startsWith(UTF8_BOM) ? content.slice(1) : content;

    const sourceFormat = this.detector.detect(fileName);
    if (sourceFormat === targetFormat) {
      throw new UnsupportedConversionError(
        `Quell- und Zielformat sind identisch (${sourceFormat}).`,
      );
    }

    const strategy = this.factory.create(sourceFormat, targetFormat);
    return { content: strategy.convert(text), targetFormat };
  }
}
