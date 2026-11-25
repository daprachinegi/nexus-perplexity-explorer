export interface TokenResult {
  index: number;
  tokenId: number;
  displayToken: string;
  prob: number;
  surprise: number;
}

export interface NextTokenPrediction {
  rank: number;
  id: number;
  displayToken: string;
  prob: number;
  percent: string;
  isTop: boolean;
}

export interface PerplexityResult {
  N: number;
  product: number;
  perplexity: number;
  isOverflow: boolean;
  multString: string;
}

export interface ManualToken {
  id: string;
  name: string;
  prob: number;
}

export type ModelStatusState = 'idle' | 'loading' | 'ready' | 'error';

