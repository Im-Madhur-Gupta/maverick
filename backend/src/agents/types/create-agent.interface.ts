import { SafeAgent } from './safe-agent.interface';

export interface CreateAgentResponse extends SafeAgent {
  solPvtKey: string;
  evmPvtKey: string;
  mnemonic: string;
}
