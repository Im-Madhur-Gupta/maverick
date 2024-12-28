import { Agent } from '@prisma/client';

export interface CreateAgentResponse extends Agent {
  solPvtKey: string;
  evmPvtKey: string;
  mnemonic: string;
}
