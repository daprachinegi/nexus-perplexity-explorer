import React from 'react';
import { NexusLogo } from './NexusLogo';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-24 border-t border-nexus-border bg-nexus-black relative overflow-hidden">
      {/* Top Banner with Brand Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-lg bg-nexus-charcoal border border-nexus-border relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="text-[11px] font-mono text-nexus-amber uppercase tracking-widest mb-2">
                Brand Statement
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-white leading-snug">
                "NEXUS is the operational bridge between frontier technology and human understanding."
              </h3>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end items-center gap-4">
              <NexusLogo size="lg" variant="amber" />
            </div>
          </div>
        </div>

        {/* Footer Navigation & Meta */}
        <div className="mt-12 pt-8 border-t border-nexus-border/60 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-nexus-muted">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} NEXUS BRANDWORKS. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#section-1"
              className="hover:text-nexus-amber transition-colors"
            >
              Model Input
            </a>
            <a
              href="#section-2"
              className="hover:text-nexus-amber transition-colors"
            >
              Probabilities
            </a>
            <a
              href="#section-3"
              className="hover:text-nexus-amber transition-colors"
            >
              Predictions
            </a>
            <a
              href="#section-4"
              className="hover:text-nexus-amber transition-colors"
            >
              Simulator
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-nexus-amber transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
