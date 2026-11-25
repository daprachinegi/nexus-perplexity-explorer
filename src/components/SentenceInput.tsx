import React from 'react';
import { ModelStatusState } from '../types';
import { Play, AlertCircle, RefreshCw } from 'lucide-react';

interface SentenceInputProps {
  sentence: string;
  setSentence: (s: string) => void;
  onCalculate: (overrideSentence?: string) => void;
  isLoading: boolean;
  modelStatus: ModelStatusState;
  statusMessage: string;
  errorMessage: string | null;
  downloadProgress?: number;
}

export const SentenceInput: React.FC<SentenceInputProps> = ({
  sentence,
  setSentence,
  onCalculate,
  isLoading,
  modelStatus,
  statusMessage,
  errorMessage,
  downloadProgress,
}) => {
  const sampleSentences = [
    'I love Python',
    'Python love I',
    'The capital of France is Paris',
  ];

  const handleSampleClick = (sample: string) => {
    setSentence(sample);
    onCalculate(sample);
  };

  return (
    <section id="section-1" className="p-6 sm:p-8 rounded-lg bg-nexus-charcoal border border-nexus-border relative overflow-hidden transition-all duration-200 hover:border-nexus-border-light shadow-card">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-nexus-border mb-6">
        <div>
          <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-wider mb-1">
            Section 01 // Interactive Evaluation
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Type a sentence &amp; calculate perplexity
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-nexus-surface text-nexus-amber border border-nexus-border rounded">
            In-Browser LLM
          </span>
        </div>
      </div>

      <p className="text-sm text-nexus-subtle mb-5">
        Input any text sequence. On initial run, DistilGPT-2 model weights will automatically be downloaded and cached in your browser for client-side evaluation.
      </p>

      {/* Input Field */}
      <div className="space-y-3">
        <label htmlFor="sentence-input" className="block text-xs font-mono uppercase tracking-wider text-nexus-muted">
          Sentence to evaluate:
        </label>
        <div className="relative">
          <textarea
            id="sentence-input"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            disabled={isLoading}
            placeholder="Type a sentence here (e.g. I love Python)"
            rows={3}
            className="w-full bg-nexus-surface/90 text-white placeholder-nexus-muted border border-nexus-border rounded-md px-4 py-3 text-base font-sans focus:outline-none focus:border-nexus-amber focus:ring-1 focus:ring-nexus-amber transition-all duration-150 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Sample Sentences */}
      <div className="mt-4">
        <div className="text-xs font-mono text-nexus-muted uppercase tracking-wider mb-2">
          Sample Sentences:
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleSentences.map((sample) => (
            <button
              key={sample}
              type="button"
              disabled={isLoading}
              onClick={() => handleSampleClick(sample)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all duration-150 ${
                sentence === sample
                  ? 'bg-nexus-amber/15 text-nexus-amber border-nexus-amber/50 font-medium'
                  : 'bg-nexus-surface text-nexus-warm border-nexus-border hover:border-nexus-amber/40 hover:text-white'
              } disabled:opacity-50`}
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Action Button & Status Line */}
      <div className="mt-6 pt-5 border-t border-nexus-border/60 flex flex-wrap items-center gap-4">
        <button
          type="button"
          id="calc-btn"
          onClick={() => onCalculate()}
          disabled={isLoading || !sentence.trim()}
          className="px-6 py-3 rounded bg-nexus-amber hover:bg-nexus-deep text-nexus-black font-semibold text-sm tracking-wide uppercase transition-all duration-200 flex items-center gap-2 shadow-amber-glow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-amber-glow-lg active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Evaluating…</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Calculate Perplexity</span>
            </>
          )}
        </button>

        {/* Status Line */}
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                modelStatus === 'ready'
                  ? 'bg-nexus-amber shadow-[0_0_8px_#FFAC2F]'
                  : modelStatus === 'loading'
                  ? 'bg-nexus-amber animate-ping'
                  : modelStatus === 'error'
                  ? 'bg-red-500'
                  : 'bg-nexus-muted'
              }`}
            />
            <span className="text-nexus-subtle">{statusMessage}</span>
          </div>

          {/* Progress Bar (visible during download) */}
          {isLoading && downloadProgress !== undefined && (
            <div className="mt-2 w-full bg-nexus-surface h-1.5 rounded-full overflow-hidden border border-nexus-border">
              <div
                className="bg-gradient-to-r from-nexus-amber to-nexus-deep h-full transition-all duration-200"
                style={{ width: `${Math.max(5, Math.min(100, downloadProgress))}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-5 p-4 rounded bg-red-950/40 border border-red-800/80 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs font-mono space-y-1">
            <div className="font-bold uppercase tracking-wider text-red-300">Model Runtime Notification</div>
            <div className="text-red-200">{errorMessage}</div>
            <div className="text-nexus-muted text-[11px] pt-1">
              Note: Model execution requires WebAssembly and network access to HuggingFace / CDN model repositories.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
