export interface CreateFereAgentResponse {
  user_id: string;
  name: string;
  description: string;
  persona: string;
  data_source: string;
  decision_prompt_pool: string;
  decision_prompt_portfolio: string;
  twitter_username?: string;
  fc_username?: string;
  dry_run: boolean;
  dry_run_initial_usd: number;
  max_investment_per_session: number;
  stop_loss: number;
  trailing_stop_loss: number;
  take_profit: number;
  id: string;
  sol_address: string;
  evm_address: string;
  sol_pvt_key: string;
  evm_pvt_key: string;
  is_active: boolean;
  mnemonic: string;
}
