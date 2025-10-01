/**
 * Parses the environment variable type based on the provided generic type.
 * @template T - The type of the environment variable, which can be 'string', 'number', or 'boolean'.
 * @returns The parsed type corresponding to the generic type T.
 */
type ParseEnvType<T extends string | number | boolean> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : 'boolean';

export class EnvUtils {
  /**
   * Retrieves an environment variable and parses it to the specified type.
   * @param name - The name of the environment variable.
   * @param options - Optional configuration options.
   * @param options.defaultValue - The default value to return if the environment variable is not defined.
   * @param options.type - The type to parse the environment variable as ('string', 'number', or 'boolean').
   * @returns The parsed value of the environment variable.
   * @throws Will throw an error if the environment variable is not defined and no default value is provided.
   */
  static getEnvVariable<T extends string | number | boolean = string>(
    name: string,
    options?: {
      defaultValue?: T;
      type?: ParseEnvType<T>;
    },
  ): T {
    const { defaultValue, type = 'string' as T } = options || {};

    const value: string | undefined = process.env[name];

    if (!value) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`${name} is not defined in environment variables`);
    }

    switch (type) {
      case 'number':
        return Number(value) as T;
      case 'boolean':
        return (value.toLowerCase() === 'true') as T;
      case 'string':
      default:
        return value as T;
    }
  }
}
