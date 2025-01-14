import { HoldingInfo } from './holding-info.interface';

export interface CoinSignalPipelineSharedData {
  coinId: number;
  coinName: string;
  holdings: HoldingInfo[];
}
