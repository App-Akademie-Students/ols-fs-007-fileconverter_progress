import type { ConversionStrategy } from "./conversion-strategy";
import { UnsupportedConversionError } from "./errors";
import type { Format } from "./format";

export type StrategyCreator = () => ConversionStrategy;

export class ConverterFactory {
  private readonly creators = new Map<string, StrategyCreator>();

  register(source: Format, target: Format, creator: StrategyCreator): void {
    this.creators.set(this.keyOf(source, target), creator);
  }

  create(source: Format, target: Format): ConversionStrategy {
    const creator = this.creators.get(this.keyOf(source, target));
    if (creator === undefined) {
      throw new UnsupportedConversionError(
        `Die Konvertierung von ${source} nach ${target} wird nicht unterstützt.`,
      );
    }
    return creator();
  }

  getTargetsFor(source: Format): Format[] {
    const targets: Format[] = [];
    for (const key of this.creators.keys()) {
      const [keySource, keyTarget] = key.split("->");
      if (keySource === source) {
        targets.push(keyTarget as Format);
      }
    }
    return targets;
  }

  private keyOf(source: Format, target: Format): string {
    return `${source}->${target}`;
  }
}
