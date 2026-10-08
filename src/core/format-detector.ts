import { UnsupportedFormatError } from "./errors";
import type { Format } from "./format";

const FORMAT_BY_EXTENSION: Record<string, Format> = {
  csv: "csv",
  json: "json",
};

export class FormatDetector {
  detect(fileName: string): Format {
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex <= 0) {
      throw new UnsupportedFormatError(
        `Die Datei "${fileName}" hat keine Dateiendung.`,
      );
    }

    const extension = fileName.slice(dotIndex + 1).toLowerCase();
    const format = FORMAT_BY_EXTENSION[extension];
    if (format === undefined) {
      throw new UnsupportedFormatError(
        `Die Dateiendung ".${extension}" wird nicht unterstützt.`,
      );
    }
    return format;
  }
}
