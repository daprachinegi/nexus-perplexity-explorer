import { PerplexityResult } from '../types';

/**
 * Numerically stable softmax for a single target token:
 * Subtract the maximum logit before computing exponentials.
 * P(token) = exp(logit[token] - maxLogit) / sum(exp(logit[j] - maxLogit))
 */
export function computeStableTokenProbability(logitsSlice: Float32Array | number[], tokenId: number): number {
  let maxLogit = -Infinity;
  const len = logitsSlice.length;
  for (let i = 0; i < len; i++) {
    if (logitsSlice[i] > maxLogit) {
      maxLogit = logitsSlice[i];
    }
  }

  let sumExp = 0;
  for (let i = 0; i < len; i++) {
    sumExp += Math.exp(logitsSlice[i] - maxLogit);
  }

  const targetLogit = logitsSlice[tokenId];
  return Math.exp(targetLogit - maxLogit) / sumExp;
}

/**
 * Compute perplexity using logarithms to prevent floating-point overflow:
 * Perplexity = exp( (1/N) * sum( -ln(P_i) ) )
 * Which is mathematically identical to ( Product of 1/P_i )^(1/N)
 */
export function calculatePerplexityFromProbabilities(probabilities: number[]): PerplexityResult {
  const N = probabilities.length;
  if (N === 0) {
    return {
      N: 0,
      product: 0,
      perplexity: 0,
      isOverflow: false,
      multString: '—',
    };
  }

  let sumNegLog = 0;
  let product = 1;
  let isOverflow = false;

  for (const p of probabilities) {
    const clampedP = Math.max(p, 1e-15);
    sumNegLog += -Math.log(clampedP);

    if (!isOverflow) {
      product *= (1 / clampedP);
      if (!isFinite(product) || product > 1e14) {
        isOverflow = true;
      }
    }
  }

  const avgNegLog = sumNegLog / N;
  const perplexity = Math.exp(avgNegLog);
  const multString = probabilities.map(p => (1 / Math.max(p, 1e-15)).toFixed(2)).join(' × ');

  return {
    N,
    product,
    perplexity,
    isOverflow,
    multString,
  };
}

/**
 * Format perplexity cleanly:
 * If close to integer (like 8 for uniform 8-token), displays "8".
 * Otherwise 2 decimal places (e.g. 2.32).
 */
export function formatPerplexity(val: number): string {
  if (isNaN(val) || !isFinite(val) || val <= 0) return '—';
  const rounded = Math.round(val * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-5) {
    return String(Math.round(rounded));
  }
  return rounded.toFixed(2);
}

/**
 * Format product of surprise values with scientific notation if very large
 */
export function formatProduct(val: number, isOverflow: boolean): string {
  if (isOverflow || !isFinite(val)) {
    return val > 0 ? val.toExponential(3) : '∞';
  }
  if (val < 10000) {
    return val.toFixed(2);
  }
  return val.toExponential(3);
}

/**
 * Safely format token display string (replaces spaces with ␣)
 */
export function formatTokenDisplay(str: string): string {
  return str.replace(/ /g, '␣');
}

