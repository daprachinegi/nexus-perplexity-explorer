import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SentenceInput } from './components/SentenceInput';
import { TokenProbabilityTable } from './components/TokenProbabilityTable';
import { NextTokenPredictions } from './components/NextTokenPredictions';
import { ManualSimulator } from './components/ManualSimulator';
import { Footer } from './components/Footer';
import { TokenResult, NextTokenPrediction, PerplexityResult, ModelStatusState } from './types';
import { runSentenceInference } from './utils/modelRunner';

export const App: React.FC = () => {
  const [sentence, setSentence] = useState('I love Python');
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatusState>('idle');
  const [statusMessage, setStatusMessage] = useState('Click "Calculate Perplexity" to download & run DistilGPT-2.');
  const [downloadProgress, setDownloadProgress] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tokenResults, setTokenResults] = useState<TokenResult[]>([]);
  const [perplexityMath, setPerplexityMath] = useState<PerplexityResult | null>(null);
  const [nextTokens, setNextTokens] = useState<NextTokenPrediction[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const [activeSection, setActiveSection] = useState('section-1');

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['section-1', 'section-2', 'section-3', 'section-4'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { threshold: 0.3 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleCalculate = async (overrideSentence?: string) => {
    const textToEvaluate = (overrideSentence ?? sentence).trim();
    if (!textToEvaluate) return;

    setIsLoading(true);
    setModelStatus('loading');
    setErrorMessage(null);

    try {
      const result = await runSentenceInference(textToEvaluate, (msg, prog) => {
        setStatusMessage(msg);
        setDownloadProgress(prog);
      });

      setTokenResults(result.tokenResults);
      setPerplexityMath(result.perplexityMath);
      setNextTokens(result.nextTokens);
      setHasRun(true);
      setModelStatus('ready');
      setStatusMessage('DistilGPT-2 neural inference complete');

      // Subtle scroll to Section 2 if user is still on Section 1
      setTimeout(() => {
        const sec2 = document.getElementById('section-2');
        if (sec2) {
          const rect = sec2.getBoundingClientRect();
          if (rect.top > window.innerHeight * 0.8) {
            sec2.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 300);
    } catch (err: any) {
      console.error('Calculation error:', err);
      setModelStatus('error');
      const errText = err?.message || String(err);
      setErrorMessage(errText);
      setStatusMessage('Error executing model');
    } finally {
      setIsLoading(false);
      setDownloadProgress(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-black text-nexus-warm flex flex-col font-sans relative">
      {/* Background Subtle Tech Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Navigation */}
      <Navbar
        activeSection={activeSection}
        modelStatus={modelStatus}
        statusMessage={statusMessage}
      />

      {/* Content wrapper */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* 4 Main Interactive Educational Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Section 1: Type a sentence & calculate perplexity */}
          <SentenceInput
            sentence={sentence}
            setSentence={setSentence}
            onCalculate={handleCalculate}
            isLoading={isLoading}
            modelStatus={modelStatus}
            statusMessage={statusMessage}
            errorMessage={errorMessage}
            downloadProgress={downloadProgress}
          />

          {/* Section 2: Token probabilities and 3-step perplexity */}
          <TokenProbabilityTable
            tokenResults={tokenResults}
            perplexityMath={perplexityMath}
            hasRun={hasRun}
          />

          {/* Section 3: Next token predictions */}
          <NextTokenPredictions
            predictions={nextTokens}
            hasRun={hasRun}
          />

          {/* Section 4: Manual simulator */}
          <ManualSimulator />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
