import { Agent } from '@prisma/client';

export interface CreateAgentResponse extends Omit<Agent, 'externalId'> {
  solPvtKey: string;
  evmPvtKey: string;
  mnemonic: string;
}
