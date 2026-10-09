import { createApplication } from "../../../src/core/composition-root";
import {
  FileTooLargeError,
  InvalidInputError,
  UnsupportedConversionError,
  UnsupportedFormatError,
} from "../../../src/core/errors";
import type { Format } from "../../../src/core/format";

const { conversionService } = createApplication();

const FORMATS: readonly string[] = ["csv", "json"] satisfies Format[];

// Dünner Adapter: Request lesen, Service aufrufen, Fehler auf HTTP-Status abbilden.
function statusFor(error: unknown): number {
  if (error instanceof UnsupportedFormatError) return 415;
  if (error instanceof FileTooLargeError) return 413;
  if (error instanceof UnsupportedConversionError) return 400;
  if (error instanceof InvalidInputError) return 422;
  return 500;
}

function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const targetFormat = formData.get("targetFormat");

    if (!(file instanceof File)) {
      return errorResponse("Es wurde keine Datei hochgeladen.", 400);
    }
    if (typeof targetFormat !== "string" || !FORMATS.includes(targetFormat)) {
      return errorResponse("Das Zielformat fehlt oder ist unbekannt.", 400);
    }

    const result = conversionService.convert(
      file.name,
      await file.text(),
      targetFormat as Format,
    );
    return Response.json(result);
  } catch (error) {
    const status = statusFor(error);
    if (status === 500) {
      console.error(error);
      return errorResponse("Interner Fehler bei der Konvertierung.", 500);
    }
    return errorResponse((error as Error).message, status);
  }
}
