import { Chain } from 'src/common/enums/chain.enum';
export interface CreateFereAgentResponse {
  id: string;
  user_id: string;
  name: string;
  description: string;
  persona: string;
  data_source: string;
  decision_prompt_pool: string;
  decision_prompt_portfolio: string;
  chain: Chain;
  twitter_username?: string;
  fc_username?: string;
  dry_run: boolean;
  dry_run_initial_usd: number;
  max_investment_per_session: number;
  stop_loss: number;
  trailing_stop_loss: number;
  take_profit: number;
  is_active: boolean;
  wallet: {
    address: string;
    pvt_key: string;
  };
}
