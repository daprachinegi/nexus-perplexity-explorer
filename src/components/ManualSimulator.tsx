import React, { useState, useMemo } from 'react';
import { ManualToken } from '../types';
import { calculatePerplexityFromProbabilities, formatPerplexity, formatProduct } from '../utils/math';
import { Plus, Trash2, Sliders, AlertTriangle } from 'lucide-react';

export const ManualSimulator: React.FC = () => {
  // Initial state: "I love Python" preset (0.5, 0.8, 0.2)
  const [tokens, setTokens] = useState<ManualToken[]>([
    { id: '1', name: 'I', prob: 0.5 },
    { id: '2', name: 'love', prob: 0.8 },
    { id: '3', name: 'Python', prob: 0.2 },
  ]);

  // Compute 3-step breakdown with validation
  const { validProbs, invalidCount, math } = useMemo(() => {
    const valid: number[] = [];
    let invalid = 0;

    for (const t of tokens) {
      if (typeof t.prob === 'number' && !isNaN(t.prob) && t.prob > 0 && t.prob <= 1) {
        valid.push(t.prob);
      } else {
        invalid++;
      }
    }

    const m = calculatePerplexityFromProbabilities(valid);
    return { validProbs: valid, invalidCount: invalid, math: m };
  }, [tokens]);

  // Handlers for tokens
  const handleNameChange = (id: string, newName: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: newName } : t))
    );
  };

  const handleProbChange = (id: string, rawVal: string) => {
    const parsed = parseFloat(rawVal);
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, prob: isNaN(parsed) ? 0 : parsed } : t))
    );
  };

  const handleAddToken = () => {
    const nextIdx = tokens.length + 1;
    const newId = Math.random().toString(36).substring(2, 9);
    setTokens((prev) => [...prev, { id: newId, name: `token_${nextIdx}`, prob: 0.5 }]);
  };

  const handleRemoveToken = (id: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  };

  // Presets
  const applyPreset1 = () => {
    setTokens([
      { id: 'p1_1', name: 'I', prob: 0.5 },
      { id: 'p1_2', name: 'love', prob: 0.8 },
      { id: 'p1_3', name: 'Python', prob: 0.2 },
    ]);
  };

  const applyPreset2 = () => {
    const uniform: ManualToken[] = Array.from({ length: 8 }, (_, i) => ({
      id: `p2_${i + 1}`,
      name: `token_${i + 1}`,
      prob: 0.125,
    }));
    setTokens(uniform);
  };

  const applyPreset3 = () => {
    setTokens([
      { id: 'p3_1', name: 'The', prob: 0.9 },
      { id: 'p3_2', name: 'grass', prob: 0.9 },
      { id: 'p3_3', name: 'is', prob: 0.9 },
      { id: 'p3_4', name: 'blue', prob: 0.01 },
    ]);
  };

  return (
    <section id="section-4" className="p-6 sm:p-8 rounded-lg bg-nexus-charcoal border border-nexus-border transition-all duration-200 hover:border-nexus-border-light shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-nexus-border mb-6">
        <div>
          <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider mb-1">
            Section 04 // Interactive Simulation
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Try it by hand · Custom Simulator
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-nexus-amber/15 text-nexus-amber border border-nexus-amber/40 rounded">
          Simulated, Not From Model
        </span>
      </div>

      <p className="text-sm text-nexus-subtle mb-6 leading-relaxed">
        Experiment with arbitrary token strings and custom probabilities <span className="font-mono text-nexus-amber">0 &lt; P ≤ 1</span> to observe how individual surprise values multiply into sequence perplexity. All calculations update live in real time.
      </p>

      {/* Preset Buttons */}
      <div className="mb-6">
        <div className="text-xs font-mono text-nexus-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-nexus-amber" />
          <span>Curated Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            id="preset-python"
            onClick={applyPreset1}
            className="px-3 py-1.5 text-xs font-mono rounded bg-nexus-surface hover:bg-nexus-surface/80 text-nexus-warm hover:text-white border border-nexus-border hover:border-nexus-amber/40 transition-all"
          >
            "I love Python" <span className="text-nexus-amber">(0.5, 0.8, 0.2)</span>
          </button>
          <button
            type="button"
            id="preset-uniform"
            onClick={applyPreset2}
            className="px-3 py-1.5 text-xs font-mono rounded bg-nexus-surface hover:bg-nexus-surface/80 text-nexus-warm hover:text-white border border-nexus-border hover:border-nexus-amber/40 transition-all"
          >
            "All 1/8" <span className="text-nexus-amber">(8 tokens at 0.125)</span>
          </button>
          <button
            type="button"
            id="preset-surprise"
            onClick={applyPreset3}
            className="px-3 py-1.5 text-xs font-mono rounded bg-nexus-surface hover:bg-nexus-surface/80 text-nexus-warm hover:text-white border border-nexus-border hover:border-nexus-amber/40 transition-all"
          >
            "One surprising word" <span className="text-nexus-amber">(0.9, 0.9, 0.9, 0.01)</span>
          </button>
        </div>
      </div>

      {/* Editable Table */}
      <div className="overflow-x-auto rounded border border-nexus-border bg-nexus-surface/50 mb-4">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-nexus-border bg-nexus-surface text-nexus-muted text-xs font-mono uppercase tracking-wider">
              <th className="py-3 px-4 w-14">#</th>
              <th className="py-3 px-4">Token Name</th>
              <th className="py-3 px-4 w-48">Probability P (0 &lt; P ≤ 1)</th>
              <th className="py-3 px-4 w-36">Surprise (1/P)</th>
              <th className="py-3 px-4 w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nexus-border/60 font-mono text-xs">
            {tokens.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-nexus-muted">
                  No tokens present. Click "+ Add Token" below or choose a preset.
                </td>
              </tr>
            ) : (
              tokens.map((token, index) => {
                const isValid = typeof token.prob === 'number' && token.prob > 0 && token.prob <= 1;
                const surpriseText = isValid ? (1 / token.prob).toFixed(2) : '—';

                return (
                  <tr key={token.id} className="hover:bg-nexus-surface/80 transition-colors">
                    <td className="py-3 px-4 text-nexus-muted">{index + 1}</td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={token.name}
                        onChange={(e) => handleNameChange(token.id, e.target.value)}
                        placeholder="Token"
                        className="w-full bg-nexus-surface text-white px-2.5 py-1.5 rounded border border-nexus-border focus:border-nexus-amber focus:outline-none transition-colors"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0.0001"
                        max="1"
                        step="0.05"
                        value={token.prob}
                        onChange={(e) => handleProbChange(token.id, e.target.value)}
                        placeholder="0.05"
                        className={`w-full bg-nexus-surface px-2.5 py-1.5 rounded border transition-colors focus:outline-none ${
                          isValid
                            ? 'text-white border-nexus-border focus:border-nexus-amber'
                            : 'text-red-400 border-red-500/80 bg-red-950/20'
                        }`}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <strong className={isValid ? 'text-nexus-amber font-semibold text-sm' : 'text-red-400 text-sm'}>
                        {surpriseText}
                      </strong>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveToken(token.id)}
                        title="Remove token"
                        className="p-1.5 rounded text-nexus-muted hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Token Button & Validation Warnings */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          id="add-token-row-btn"
          onClick={handleAddToken}
          className="px-4 py-2 rounded bg-nexus-surface hover:bg-nexus-surface/80 text-nexus-warm hover:text-white border border-nexus-border hover:border-nexus-amber/50 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-nexus-amber" />
          <span>Add Token</span>
        </button>

        {invalidCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{invalidCount} token(s) have invalid probabilities (must be &gt; 0 and ≤ 1).</span>
          </div>
        )}
      </div>

      {/* 3 Steps Live Calculation */}
      <div className="pt-6 border-t border-nexus-border/80">
        <div className="text-xs font-mono text-nexus-muted uppercase tracking-wider mb-4">
          Simulated Three-Step Calculation
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-lg bg-nexus-surface border border-nexus-border flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider font-semibold mb-1">
                Step 1 · Multiply 1/P Values
              </div>
              <div className="text-xs text-nexus-muted mb-3">Product of all valid surprise values:</div>
              <div className="font-mono text-xs text-nexus-subtle max-h-24 overflow-y-auto p-2 rounded bg-nexus-black/60 border border-nexus-border/50">
                {validProbs.length > 0 ? math.multString : '—'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-nexus-border/50 flex items-baseline justify-between font-mono">
              <span className="text-xs text-nexus-muted">Result:</span>
              <span className="text-sm font-bold text-white">
                = {validProbs.length > 0 ? formatProduct(math.product, math.isOverflow) : '—'}
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-lg bg-nexus-surface border border-nexus-border flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider font-semibold mb-1">
                Step 2 · Sequence Length
              </div>
              <div className="text-xs text-nexus-muted mb-3">Number of simulated tokens (N):</div>
              <div className="text-3xl font-heading font-bold text-white mt-2">
                N = {validProbs.length}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-nexus-border/50 text-[11px] font-mono text-nexus-muted">
              Simulated sequence tokens
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
                {validProbs.length > 0 ? formatPerplexity(math.perplexity) : '—'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-nexus-border/50 font-mono text-[11px] text-nexus-muted space-y-0.5">
              <div>exp( avg(−ln P) ) = {validProbs.length > 0 ? formatPerplexity(math.perplexity) : '—'}</div>
              <div className="text-nexus-subtle">Calculated using numerically stable log-sums.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
