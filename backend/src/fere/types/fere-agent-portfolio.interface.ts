export interface FereAgentPortfolio {
  id: string;
  agent_id: string;
  start_time: string;
  start_usd: number;
  curr_realised_usd: number;
  curr_unrealised_usd: number;
  dry_run: boolean;
}
