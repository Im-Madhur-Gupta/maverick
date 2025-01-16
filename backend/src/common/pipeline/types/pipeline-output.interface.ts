import { PipelineStepOutput } from './pipeline-step-output.interface';

/**
 * Output of executing a complete pipeline
 * Contains execution metadata and output of each step
 */
export interface PipelineOutput {
  /** Unique identifier for the pipeline execution */
  id: string;
  /** Whether all steps executed successfully */
  success: boolean;
  /** Execution output for each step */
  stepOutputs: PipelineStepOutput<unknown>[];
  /** Whether the pipeline was stopped */
  stopped?: boolean;
  /** Reason for stopping the pipeline */
  stopReason?: string;
}
