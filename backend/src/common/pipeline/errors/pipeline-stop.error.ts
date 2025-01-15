export class PipelineStopError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PipelineStopError';
  }
}
