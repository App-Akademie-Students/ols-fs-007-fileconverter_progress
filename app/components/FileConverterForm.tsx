"use client";

import { useState, type FormEvent } from "react";

type TargetFormat = "csv" | "json";

interface ConvertedFile {
  content: string;
  targetFormat: TargetFormat;
  downloadName: string;
}

// Reine Darstellung: Die Konvertierung passiert vollständig im Backend (/api/convert).
function toDownloadName(originalName: string, targetFormat: TargetFormat): string {
  const dot = originalName.lastIndexOf(".");
  const baseName = dot > 0 ? originalName.slice(0, dot) : originalName;
  return `${baseName}.${targetFormat}`;
}

export default function FileConverterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("json");
  const [result, setResult] = useState<ConvertedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = new FormData();
      body.set("file", file);
      body.set("targetFormat", targetFormat);

      const response = await fetch("/api/convert", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Die Konvertierung ist fehlgeschlagen.");
        return;
      }
      setResult({
        content: data.content,
        targetFormat: data.targetFormat,
        downloadName: toDownloadName(file.name, data.targetFormat),
      });
    } catch {
      setError("Der Server ist nicht erreichbar.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const mimeType = result.targetFormat === "json" ? "application/json" : "text/csv";
    const url = URL.createObjectURL(
      new Blob([result.content], { type: `${mimeType};charset=utf-8` }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = result.downloadName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>
          Datei (CSV oder JSON, max. 1 MiB){" "}
          <input
            type="file"
            accept=".csv,.json"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </p>
      <p>
        <label>
          Zielformat{" "}
          <select
            value={targetFormat}
            onChange={(e) => setTargetFormat(e.target.value as TargetFormat)}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </label>
      </p>
      <button type="submit" disabled={!file || isLoading}>
        {isLoading ? "Konvertiere …" : "Konvertieren"}
      </button>

      {error && <p role="alert">Fehler: {error}</p>}

      {result && (
        <section>
          <h2>Ergebnis</h2>
          <button type="button" onClick={handleDownload}>
            {result.downloadName} herunterladen
          </button>
          <pre>{result.content}</pre>
        </section>
      )}
    </form>
  );
}
