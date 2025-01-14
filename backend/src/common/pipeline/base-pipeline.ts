import { Injectable } from '@nestjs/common';
import { LoggerService } from 'libs/logger/src/logger.service';
import { PipelineContext } from './types/pipeline-context.interface';
import { PipelineStep } from './types/pipeline-step.interface';
import { PipelineOutput } from './types/pipeline-output.interface';
import { PipelineStepOutput } from './types/pipeline-step-output.interface';

/**
 * Base pipeline implementation that processes data through a sequence of steps
 * @template TContext - Common context available to all steps
 */
@Injectable()
export abstract class BasePipeline<TContext extends PipelineContext> {
  private readonly steps: PipelineStep<TContext, any, any>[] = [];

  constructor(private readonly logger: LoggerService) {}

  /**
   * Add multiple steps to the pipeline in sequence
   * Validates type compatibility between consecutive steps and ensures:
   * - First step accepts undefined input
   * - Intermediate steps' input/output types match
   * - Last step produces `TFinalOutput` ie the output type of the pipeline
   */
  protected addSteps(steps: PipelineStep<TContext, any, any>[]) {
    // Validate all steps before adding any
    steps.forEach((step, index) => {
      if (index === 0 && this.steps.length === 0) {
        this.validateFirstStep(step);
      } else {
        const previousStep =
          index === 0 ? this.steps[this.steps.length - 1] : steps[index - 1];
        this.validateStepCompatibility(previousStep, step);
      }
    });

    this.steps.push(...steps);
  }

  /**
   * Validates first step can accept undefined input
   */
  private validateFirstStep(_step: PipelineStep<TContext, any, any>): void {
    type FirstStepInput = Parameters<typeof _step.execute>[1];
    void (undefined as FirstStepInput);
  }

  /**
   * Validates output type of previous step matches input type of next step
   */
  private validateStepCompatibility(
    _prevStep: PipelineStep<TContext, any, any>,
    _nextStep: PipelineStep<TContext, any, any>,
  ): void {
    type PrevOutput = Awaited<ReturnType<typeof _prevStep.execute>>;
    type NextInput = Parameters<typeof _nextStep.execute>[1];
    void ({} as PrevOutput as NextInput);
  }

  /**
   * Executes the pipeline with given context
   * Processes data through each step sequentially, passing output as input to next step
   * Stops on first error and collects execution results
   */
  async _execute(context: TContext): Promise<PipelineOutput> {
    const result: PipelineOutput = {
      id: context.id,
      success: true,
      stepOutputs: [],
    };

    let stepInput: unknown;

    for (const step of this.steps) {
      const stepOutput: PipelineStepOutput<unknown> = {
        stepName: step.name,
        success: true,
      };

      try {
        this.logger.info(`Executing step ${step.name}`);

        const output = await step.execute(context, stepInput);
        this.logger.info(
          `Step ${step.name} executed successfully. Output: ${output}`,
        );

        stepOutput.output = output;
        stepInput = output;
        result.stepOutputs.push(stepOutput);
      } catch (error) {
        result.success = false;
        result.stepOutputs.push({
          stepName: step.name,
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });

        this.logger.error(`Pipeline step ${step.name} failed:`, error);
        break;
      }
    }

    this.logger.info(`Pipeline execution completed. Result: ${result}`);

    return result;
  }
}
