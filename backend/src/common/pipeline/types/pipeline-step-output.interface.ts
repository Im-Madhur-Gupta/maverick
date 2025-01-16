/**
 * Output of a pipeline step along with execution metadata
 * Used for tracking, monitoring, and debugging pipeline execution
 * @template TStepOutput - Type of output data produced by the step
 */
export interface PipelineStepOutput<TStepOutput> {
  /** Name of the executed step */
  stepName: string;
  /** Whether the step executed successfully */
  success: boolean;
  /** Error if step failed */
  error?: Error;
  /** Output data if step succeeded (for debugging/auditing) */
  output?: TStepOutput;
}
