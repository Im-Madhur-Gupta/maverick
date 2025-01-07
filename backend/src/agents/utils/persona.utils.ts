import { PERSONA_PROMPTS } from '../constants';
import { AgentPersona } from '../types/agent-persona.enum';

export function getPersonaStrings(selectedPersona: AgentPersona): {
  personaPrompt: string;
  decisionPromptPool: string;
  decisionPromptPortfolio: string;
} {
  const personaPrompts = PERSONA_PROMPTS[selectedPersona];

  const personaPrompt = `A loyal and trusted disciple of ${personaPrompts.personaPrompt}`;

  const decisionPromptPool = `You will use these instructions to take decisions on a token. The decisions can be buy, sell, hold, or pass. It's like you are given with token info; assume name, price, volatility, 24hr volume, etc. Based on these, give the required signals. ${personaPrompts.poolDecisionPrompt}`;

  const decisionPromptPortfolio = `You will use these instructions to revise the decisions you made on a token. ${personaPrompts.portfolioDecisionPrompt}`;

  return {
    personaPrompt,
    decisionPromptPool,
    decisionPromptPortfolio,
  };
}
