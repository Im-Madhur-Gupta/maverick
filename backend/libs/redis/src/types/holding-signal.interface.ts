export interface HoldingSignal {
  agentId: string;
  holdingId: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  confidence: number;
  timestamp: number;
  metadata?: {
    originalSignalId?: string;
    reason?: string;
  };
}
