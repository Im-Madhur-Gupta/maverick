export interface HoldingInfo {
  /** External ID of the agent who owns this holding */
  agentExternalId: string;
  /** External ID of the specific holding */
  holdingExternalId: string;
  /** Amount of coins bought in this holding */
  amountBought: number;
}
