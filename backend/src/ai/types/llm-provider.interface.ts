import { z } from 'zod';

/**
 * Base interface for LLM implementations
 */
export interface LlmProvider {
  /**
   * Get a structured response from the LLM.
   * T must match the schema's inferred type
   * @param prompt - The prompt to send to the LLM
   * @param schema - Zod schema that validates and types the response
   * @returns Promise of the validated and typed response
   * @throws {z.ZodError} When validation fails
   */
  getStructuredResponse<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T>;
}
