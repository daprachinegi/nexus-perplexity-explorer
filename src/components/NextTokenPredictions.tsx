import React from 'react';
import { NextTokenPrediction } from '../types';
import { Award } from 'lucide-react';

interface NextTokenPredictionsProps {
  predictions: NextTokenPrediction[];
  hasRun: boolean;
}

export const NextTokenPredictions: React.FC<NextTokenPredictionsProps> = ({
  predictions,
  hasRun,
}) => {
  return (
    <section id="section-3" className="p-6 sm:p-8 rounded-lg bg-nexus-charcoal border border-nexus-border transition-all duration-200 hover:border-nexus-border-light shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-nexus-border mb-6">
        <div>
          <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider mb-1">
            Section 03 // Generative Distribution
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            What does the model predict next?
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-nexus-surface text-nexus-amber border border-nexus-border rounded">
          Top 8 Next Candidates
        </span>
      </div>

      <p className="text-sm text-nexus-subtle mb-6">
        Using the output logits at the final token position of the input sequence, here are the top 8 continuation tokens predicted by the model's vocabulary distribution:
      </p>

      {/* Predictions list */}
      <div className="space-y-3">
        {!hasRun || predictions.length === 0 ? (
          <div className="py-12 rounded border border-nexus-border/60 bg-nexus-surface/30 text-center text-nexus-muted text-xs font-mono">
            Run the model in Section 01 to generate predictions for the next token.
          </div>
        ) : (
          predictions.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md border transition-all duration-150 grid grid-cols-12 items-center gap-3 font-mono text-xs ${
                item.isTop
                  ? 'bg-nexus-amber/10 border-nexus-amber/40 shadow-sm'
                  : 'bg-nexus-surface/50 border-nexus-border/70 hover:bg-nexus-surface'
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 text-center font-bold text-nexus-muted">
                #{item.rank}
              </div>

              {/* Token representation */}
              <div className="col-span-4 sm:col-span-3 flex items-center gap-2 overflow-hidden">
                <code className={item.isTop ? 'token-badge-amber' : 'token-badge'}>
                  {item.displayToken}
                </code>
                {item.isTop && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-nexus-black bg-nexus-amber px-1.5 py-0.5 rounded uppercase tracking-wider">
                    <Award className="w-2.5 h-2.5" /> Top Pick
                  </span>
                )}
              </div>

              {/* Animated Probability Bar */}
              <div className="col-span-5 sm:col-span-6">
                <div className="w-full bg-nexus-black/60 h-4 rounded-full overflow-hidden p-0.5 border border-nexus-border/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.isTop
                        ? 'bg-gradient-to-r from-nexus-amber to-nexus-deep'
                        : 'bg-nexus-muted/40 hover:bg-nexus-amber/50'
                    }`}
                    style={{ width: `${Math.max(2, Math.min(100, item.prob * 100))}%` }}
                  />
                </div>
              </div>

              {/* Percentage */}
              <div className="col-span-2 text-right font-bold text-white text-xs">
                {item.percent}%
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
