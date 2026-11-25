import React from 'react';
import { TokenResult, PerplexityResult } from '../types';
import { formatPerplexity, formatProduct } from '../utils/math';
import { Calculator } from 'lucide-react';

interface TokenProbabilityTableProps {
  tokenResults: TokenResult[];
  perplexityMath: PerplexityResult | null;
  hasRun: boolean;
}

export const TokenProbabilityTable: React.FC<TokenProbabilityTableProps> = ({
  tokenResults,
  perplexityMath,
  hasRun,
}) => {
  return (
    <section id="section-2" className="p-6 sm:p-8 rounded-lg bg-nexus-charcoal border border-nexus-border transition-all duration-200 hover:border-nexus-border-light shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-nexus-border mb-6">
        <div>
          <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider mb-1">
            Section 02 // Mathematical Decomposition
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Probability of each token → Perplexity
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-nexus-surface text-nexus-amber border border-nexus-border rounded">
          Real Model Output
        </span>
      </div>

      <p className="text-sm text-nexus-subtle mb-6 leading-relaxed">
        Every token's conditional probability <span className="font-mono text-nexus-amber">P(w_i | w_&lt;i)</span> is computed via numerically stable softmax on the model's logits at the preceding position. Surprise is defined as <span className="font-mono text-nexus-amber">1 / P</span>.
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-nexus-border bg-nexus-surface/50">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-nexus-border bg-nexus-surface text-nexus-muted text-xs font-mono uppercase tracking-wider">
              <th className="py-3 px-4 w-16">#</th>
              <th className="py-3 px-4">Token</th>
              <th className="py-3 px-4">Probability P</th>
              <th className="py-3 px-4">Surprise (1/P)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nexus-border/60 font-mono text-xs">
            {!hasRun || tokenResults.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-nexus-muted">
                  Click "Calculate Perplexity" in Section 01 to generate real model probabilities.
                </td>
              </tr>
            ) : (
              tokenResults.map((item) => (
                <tr key={item.index} className="hover:bg-nexus-surface/90 transition-colors">
                  <td className="py-3 px-4 text-nexus-muted">{item.index}</td>
                  <td className="py-3 px-4">
                    <code className="token-badge">{item.displayToken}</code>
                  </td>
                  <td className="py-3 px-4 text-nexus-warm">
                    <span className="text-white font-medium">{item.prob.toFixed(4)}</span>{' '}
                    <span className="text-nexus-muted text-[11px]">
                      ({(item.prob * 100).toFixed(2)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <strong className="text-nexus-amber font-semibold text-sm">
                      {item.surprise.toFixed(2)}
                    </strong>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3-Step Perplexity Breakdown */}
      <div className="mt-8 pt-6 border-t border-nexus-border/80">
        <div className="flex items-center gap-2 text-xs font-mono text-nexus-muted uppercase tracking-wider mb-4">
          <Calculator className="w-3.5 h-3.5 text-nexus-amber" />
          <span>Three-Step Perplexity Calculation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-lg bg-nexus-surface border border-nexus-border flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider font-semibold mb-1">
                Step 1 · Multiply 1/P Values
              </div>
              <div className="text-xs text-nexus-muted mb-3">Product of all surprise values:</div>
              <div className="font-mono text-xs text-nexus-subtle max-h-24 overflow-y-auto p-2 rounded bg-nexus-black/60 border border-nexus-border/50">
                {perplexityMath ? perplexityMath.multString : '—'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-nexus-border/50 flex items-baseline justify-between font-mono">
              <span className="text-xs text-nexus-muted">Result:</span>
              <span className="text-sm font-bold text-white">
                = {perplexityMath ? formatProduct(perplexityMath.product, perplexityMath.isOverflow) : '—'}
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-lg bg-nexus-surface border border-nexus-border flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider font-semibold mb-1">
                Step 2 · Sequence Length
              </div>
              <div className="text-xs text-nexus-muted mb-3">Number of evaluated tokens (N):</div>
              <div className="text-3xl font-heading font-bold text-white mt-2">
                N = {perplexityMath ? perplexityMath.N : '—'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-nexus-border/50 text-[11px] font-mono text-nexus-muted">
              Evaluated sequence length
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-lg bg-nexus-surface border border-nexus-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-amber/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider font-semibold mb-1">
                Step 3 · Perplexity
              </div>
              <div className="text-xs text-nexus-muted mb-2">Geometric mean = (product)<sup>1/N</sup>:</div>
              <div className="text-4xl font-heading font-extrabold text-nexus-amber my-1">
                {perplexityMath ? formatPerplexity(perplexityMath.perplexity) : '—'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-nexus-border/50 font-mono text-[11px] text-nexus-muted space-y-0.5">
              <div>exp( average of −ln P ) = {perplexityMath ? formatPerplexity(perplexityMath.perplexity) : '—'}</div>
              <div className="text-nexus-subtle">Lower perplexity indicates higher model confidence.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
