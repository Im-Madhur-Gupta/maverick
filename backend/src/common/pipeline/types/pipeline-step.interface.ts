import { PipelineContext } from './pipeline-context.interface';

/**
 * Represents a single step in a pipeline
 * @template TContext - Common context available to all steps
 * @template TStepInput - Additional input specific to this step
 * @template TStepOutput - Output produced by this step
 */
export interface PipelineStep<
  TContext extends PipelineContext,
  TStepInput = void,
  TStepOutput = void,
> {
  /** Name of the step */
  readonly name: string;

  /**
   * Executes the pipeline step
   * @param context - Common context available throughout the pipeline
   * @param input - Step-specific input data
   */
  execute(context: TContext, input?: TStepInput): Promise<TStepOutput>;
}
