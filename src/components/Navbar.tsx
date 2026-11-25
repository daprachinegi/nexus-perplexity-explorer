import React from 'react';
import { NexusLogo } from './NexusLogo';
import { ModelStatusState } from '../types';
import { Cpu, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  modelStatus: ModelStatusState;
  statusMessage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, modelStatus, statusMessage }) => {
  const navItems = [
    { id: 'section-1', label: '01 · Sentence Input' },
    { id: 'section-2', label: '02 · Token Probabilities' },
    { id: 'section-3', label: '03 · Next Predictions' },
    { id: 'section-4', label: '04 · Manual Simulator' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-nexus-black/85 backdrop-blur-md border-b border-nexus-border/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <NexusLogo size="md" variant="amber" />
          </a>
          <div className="hidden sm:block h-4 w-[1px] bg-nexus-border" />
          <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-nexus-muted uppercase">
            Perplexity Explorer // v2.0
          </span>
        </div>

        {/* Section Navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-150 rounded ${isActive
                  ? 'text-nexus-amber bg-nexus-amber/10 border border-nexus-amber/30'
                  : 'text-nexus-muted hover:text-nexus-warm hover:bg-nexus-surface/50 border border-transparent'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Neural Runtime indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-nexus-surface/80 border border-nexus-border text-[11px] font-mono">
            {modelStatus === 'loading' && (
              <Loader2 className="w-3.5 h-3.5 text-nexus-amber animate-spin" />
            )}
            {modelStatus === 'ready' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-nexus-amber" />
            )}
            {modelStatus === 'error' && (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            )}
            {modelStatus === 'idle' && (
              <Cpu className="w-3.5 h-3.5 text-nexus-muted" />
            )}
            <span className="hidden lg:inline text-nexus-subtle max-w-[180px] truncate">
              {statusMessage}
            </span>
            <span className="lg:hidden text-nexus-subtle capitalize">
              {modelStatus}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

