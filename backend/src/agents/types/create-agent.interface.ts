import { SafeAgent } from './safe-agent.interface';

export interface CreateAgentResponse extends SafeAgent {
  solanaPvtKey: string;
}

