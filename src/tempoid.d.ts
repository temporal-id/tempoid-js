export declare const Alphabet: {
  readonly numbers: string;
  readonly hexadecimalLowercase: string;
  readonly hexadecimalUppercase: string;
  readonly lowercase: string;
  readonly uppercase: string;
  readonly alphanumeric: string;
  readonly url: string;
  readonly base64: string;
  readonly noDoppelganger: string;
};

export interface TempoIdOptions {
  /**
   * Length of the time part. Defaults to 8.
   */
  timeLength?: number;

  /**
   * Length of the random part. Defaults to 13.
   */
  randomLength?: number;

  /**
   * Custom time value in milliseconds.
   */
  time?: number;

  /**
   * Custom start time.
   */
  startTime?: Date;

  /**
   * Whether to pad the time part on the left. Defaults to true.
   */
  padLeft?: boolean;

  /**
   * Custom alphabet to use.
   */
  alphabet?: string;
}

/**
 * Generates a new TempoId with a time part and a random part.
 * The total length of the ID will be the sum of `timeLength`
 * and `randomLength`. Both default to 8 for `timeLength` and 13 for `randomLength`.
 *
 * @param options - The options for generating the TempoId.
 * @returns The generated TempoId.
 */
export declare function tempoId(options?: TempoIdOptions): string;
