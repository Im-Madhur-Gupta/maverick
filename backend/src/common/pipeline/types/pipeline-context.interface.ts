/**
 * Base context passed to all pipeline steps
 * @template TSharedData - Type of shared data available to all steps
 */
export interface PipelineContext<TSharedData = unknown> {
  /** Unique identifier for the pipeline execution */
  id: string;
  /** Optional data shared across all pipeline steps */
  sharedData?: TSharedData;
}
