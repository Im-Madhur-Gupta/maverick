import { FereAgentPortfolio } from 'src/fere/types/fere-agent-portfolio.interface';

export const getPortfolioResponseExample: FereAgentPortfolio = {
  id: 'portfolio_123456',
  agent_id: 'agent_123456',
  start_time: '2024-01-01T00:00:00Z',
  start_usd: 1000,
  curr_realised_usd: 1000,
  curr_unrealised_usd: 1000,
  dry_run: false,
};
