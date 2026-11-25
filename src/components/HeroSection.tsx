import React from 'react';
import { NexusSymbol } from './NexusLogo';
import { ArrowDown, Cpu, Sparkles, Binary } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-16 border-b border-nexus-border overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-[0.03]">
        <NexusSymbol className="w-[700px] h-[700px]" color="#FFFFFF" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Sub-header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-surface border border-nexus-border text-[11px] font-mono text-nexus-amber tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-nexus-amber animate-pulse" />
          NEXUS OPERATIONAL INTELLIGENCE // AI ARCHITECTURE
        </div>

        {/* Main Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white leading-[1.08] mb-4">
              PERPLEXITY <span className="text-nexus-amber">EXPLORER</span>
            </h1>
            <p className="text-lg sm:text-xl text-nexus-subtle max-w-2xl font-light leading-relaxed">
              How language models evaluate uncertainty, token probabilities, and compounding surprise — powered by DistilGPT-2 running entirely in your browser.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end gap-3">
            <div className="p-4 rounded bg-nexus-surface/60 border border-nexus-border backdrop-blur-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-nexus-muted mb-2 flex items-center justify-between">
                <span>Runtime Specification</span>
                <span className="text-nexus-amber">CLIENT-SIDE</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-nexus-warm">
                <div className="flex justify-between py-1 border-b border-nexus-border/50">
                  <span className="text-nexus-muted">Architecture:</span>
                  <span className="text-white">DistilGPT-2 (6 layers)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-nexus-border/50">
                  <span className="text-nexus-muted">Precision:</span>
                  <span className="text-nexus-amber">8-Bit Quantized (Q8)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-nexus-muted">Metric Formula:</span>
                  <span className="text-white">Perplexity = exp(avg(-ln P))</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-10 pt-6 border-t border-nexus-border/50 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-nexus-surface flex items-center justify-center border border-nexus-border text-nexus-amber">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">In-Browser LLM</div>
              <div className="text-[11px] text-nexus-muted">Zero API keys or servers</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-nexus-surface flex items-center justify-center border border-nexus-border text-nexus-amber">
              <Binary className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Stable Softmax</div>
              <div className="text-[11px] text-nexus-muted">Logit normalization</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-nexus-surface flex items-center justify-center border border-nexus-border text-nexus-amber">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Real Inference</div>
              <div className="text-[11px] text-nexus-muted">Actual causal LM outputs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-nexus-surface flex items-center justify-center border border-nexus-border text-nexus-amber">
              <ArrowDown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Simulate By Hand</div>
              <div className="text-[11px] text-nexus-muted">Experiment with custom inputs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

