export interface FereAgentHolding {
  id: string;
  bought_at: string;
  agent_id: string;
  base_address: string;
  pool_address: string;
  pool_name: string;
  token_name: string;
  decimals: number;
  tokens_bought: number;
  buying_price_usd: number;
  buying_price_native: number;
  curr_price_usd: number;
  curr_price_native: number;
  profit_abs_usd: number;
  profit_abs_native: number;
  profit_per_usd: number;
  profit_per_native: number;
  is_active: boolean;
  dry_run: boolean;
}
