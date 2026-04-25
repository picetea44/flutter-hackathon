export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GrowthRate {
  percentageValue: number;
}

export type MarketIndex =
  | 'STANDARD_AND_POORS_500'
  | 'NASDAQ_100'
  | 'DOW_JONES';

export interface PredictionHistory {
  identifier: number;
  growthRate: GrowthRate;
  targetMarketIndex: MarketIndex;
  predictedAt: string;
  createdAt: string;
}

export interface IndexValue {
  value: number;
}

export interface SourceUrl {
  url: string;
}

export interface Statement {
  identifier: number;
  content: string;
  sourceUrl: SourceUrl;
  aggressionIndex: IndexValue | null;
  transactionalismIndex: IndexValue | null;
  publishedAt: string;
  createdAt: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
}
