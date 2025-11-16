export abstract class HashStrategy {
  abstract hash(value: string): Promise<string>;
  abstract compare(value: string, encrypted: string): Promise<boolean>;
}
