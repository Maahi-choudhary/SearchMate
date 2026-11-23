import React from 'react';
import { ArrowRight, BookOpen, Layers, GitCompare, Sparkles, ShieldCheck } from 'lucide-react';

export function HomePage({ onStart, onTryDemo }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-20 border-b border-hairline">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-canvas-soft border border-white/20 text-ink text-[11px] font-mono uppercase tracking-caption-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sunset inline-block animate-pulse"></span>
          FRONTIER AI RESEARCH SYNTHESIS // V1.0
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-[-2px] text-ink leading-[1.05] max-w-4xl mx-auto">
          Understand How Research Papers Connect.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed font-normal">
          SearchMate ingests research PDFs, maps cross-paper relationships, identifies recurring limitations, and derives grounded project directions. Designed for students and researchers.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="btn-primary w-full sm:w-auto px-6 py-2.5"
          >
            <span className="font-mono uppercase tracking-caption-mono-sm text-xs">Start Research Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryDemo}
            className="btn-outline w-full sm:w-auto px-6 py-2.5"
          >
            <span className="font-mono uppercase tracking-caption-mono-sm text-xs">Explore Live Demo</span>
          </button>
        </div>
      </div>

      {/* Guided 4-Step Protocol */}
      <div className="py-16 border-b border-hairline">
        <div className="mb-12">
          <span className="eyebrow-mono block mb-2">
            // EXECUTION PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-[-1px] text-ink">
            Grounded 4-Step Synthesis Pipeline
          </h2>
          <p className="text-xs text-mute mt-1.5 font-mono uppercase tracking-caption-mono-sm">
            From raw PDF documents to actionable literature insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="card-xai hover:border-white/30 transition-colors flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-mute block mb-4">// 01_INGEST</span>
              <h3 className="text-base font-normal tracking-[-0.4px] text-ink">
                Document Upload
              </h3>
              <p className="text-xs text-body/80 mt-2.5 leading-relaxed font-normal">
                Upload 2 to 5 text-based research PDFs. Automatic section-aware parsing and page indexing.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-hairline">
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">10 MB LIMIT · PYMUPDF</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card-xai hover:border-white/30 transition-colors flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-mute block mb-4">// 02_DECONSTRUCT</span>
              <h3 className="text-base font-normal tracking-[-0.4px] text-ink">
                Plain Breakdown
              </h3>
              <p className="text-xs text-body/80 mt-2.5 leading-relaxed font-normal">
                Objectives, methodologies, datasets, findings, and author-stated limitations in clear language.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-hairline">
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">UNBIASED EXTRACTION</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card-xai hover:border-white/30 transition-colors flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-mute block mb-4">// 03_CORRELATE</span>
              <h3 className="text-base font-normal tracking-[-0.4px] text-ink">
                Compare & Map
              </h3>
              <p className="text-xs text-body/80 mt-2.5 leading-relaxed font-normal">
                Side-by-side methodology comparison and an interactive research relationship graph.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-hairline">
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">GRAPH + LIST PARITY</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="card-xai hover:border-white/30 transition-colors flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-mute block mb-4">// 04_SYNTHESIZE</span>
              <h3 className="text-base font-normal tracking-[-0.4px] text-ink">
                Gaps & Ideas
              </h3>
              <p className="text-xs text-body/80 mt-2.5 leading-relaxed font-normal">
                Recurring limitation clusters, potential research gaps, and validated project directions.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-hairline">
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">GROUNDED IN EVIDENCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Integrity Safeguards */}
      <div className="py-16">
        <span className="eyebrow-mono block mb-2 text-accent-sunset">
          // ACADEMIC INTEGRITY SAFEGUARDS
        </span>
        <h3 className="text-xl sm:text-2xl font-normal tracking-[-0.8px] text-ink mb-6">
          Engineered for Factual Grounding
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-xai">
            <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-breeze block mb-2">
              [TRACEABILITY]
            </span>
            <h4 className="text-sm font-normal text-ink mb-1">Page-Level Citations</h4>
            <p className="text-xs text-body/80 leading-relaxed">
              Every extracted claim and comparison links directly to original page numbers in your source PDFs.
            </p>
          </div>

          <div className="card-xai">
            <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-twilight block mb-2">
              [TRUTHFULNESS]
            </span>
            <h4 className="text-sm font-normal text-ink mb-1">No Fabricated Metadata</h4>
            <p className="text-xs text-body/80 leading-relaxed">
              Missing fields are explicitly labeled "Not found in paper" rather than hallucinating details.
            </p>
          </div>

          <div className="card-xai">
            <span className="font-mono uppercase text-[10px] tracking-caption-mono text-accent-sunset block mb-2">
              [HUMILITY]
            </span>
            <h4 className="text-sm font-normal text-ink mb-1">Collection-Scope Limits</h4>
            <p className="text-xs text-body/80 leading-relaxed">
              Potential gaps reflect patterns in your collection and require external literature verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
