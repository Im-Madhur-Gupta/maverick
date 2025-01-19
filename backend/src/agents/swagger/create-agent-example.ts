import { AgentPersona } from '../enums/agent-persona.enum';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { CreateAgentResponse } from '../types/create-agent.interface';

export const createAgentDtoExample: CreateAgentDto = {
  name: 'MoonBot',
  description: 'A bot that chases moon shots',
  persona: AgentPersona.MOON_CHASER,
};

export const createAgentResponseExample: CreateAgentResponse = {
  id: 'agent_123456',
  name: 'MoonBot',
  description: 'A bot that chases moon shots',
  persona: AgentPersona.MOON_CHASER,
  owner: {
    solanaAddress: 'JAJMHzapWE55Gk2oQ1wgn3GLuZnMsDsJ4Wrwt4jbYR1p',
    createdAt: new Date(),
  },
  solanaAddress: 'JAJMHzapWE55Gk2oQ1wgn3GLuZnMsDsJ4Wrwt4jbYR1p',
  solanaPvtKey: 'abc123...',
  isActive: true,
  createdAt: new Date(),
};
