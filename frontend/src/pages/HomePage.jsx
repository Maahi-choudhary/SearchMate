import React from 'react';
import { ArrowRight, BookOpen, Layers, GitCompare, Sparkles, ShieldCheck, CheckCircle2, FileSearch } from 'lucide-react';

export function HomePage({ onStart, onTryDemo }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-20 border-b border-[#282b54]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e2353]/80 border border-[#282b54] text-white/90 text-xs font-semibold tracking-wide mb-6 shadow-discord-sm">
          <span className="w-2 h-2 rounded-full bg-[#35ed7e] inline-block animate-pulse shadow-[0_0_8px_#35ed7e]"></span>
          <span>FRONTIER AI RESEARCH SYNTHESIS // V1.0</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          Understand How Research Papers Connect.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed font-normal">
          SearchMate ingests research PDFs, maps cross-paper relationships, identifies recurring limitations, and derives grounded project directions. Designed for students and researchers.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="btn-primary w-full sm:w-auto px-7 py-3 text-sm flex items-center justify-center gap-2 shadow-discord-glow font-semibold"
          >
            <span>Start Research Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryDemo}
            className="btn-outline w-full sm:w-auto px-7 py-3 text-sm flex items-center justify-center font-semibold"
          >
            <span>Explore Live Demo</span>
          </button>
        </div>
      </div>

      {/* Guided 4-Step Protocol */}
      <div className="py-16 border-b border-[#282b54]">
        <div className="mb-12 text-center sm:text-left">
          <span className="text-xs font-semibold tracking-wider text-[#00b0f4] uppercase block mb-2">
            // EXECUTION PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Grounded 4-Step Synthesis Pipeline
          </h2>
          <p className="text-xs text-white/60 mt-1.5 font-mono uppercase">
            From raw PDF documents to actionable literature insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="card-discord p-5 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
                01_INGEST
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Document Upload
              </h3>
              <p className="text-xs text-white/70 mt-2.5 leading-relaxed font-normal">
                Upload 2 to 5 text-based research PDFs. Automatic section-aware parsing and page indexing.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#282b54]">
              <span className="font-mono uppercase text-[10px] tracking-wide text-white/50">10 MB LIMIT · PYMUPDF</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card-discord p-5 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
                02_DECONSTRUCT
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Plain Breakdown
              </h3>
              <p className="text-xs text-white/70 mt-2.5 leading-relaxed font-normal">
                Objectives, methodologies, datasets, findings, and author-stated limitations in clear language.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#282b54]">
              <span className="font-mono uppercase text-[10px] tracking-wide text-white/50">UNBIASED EXTRACTION</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="card-discord p-5 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
                03_CORRELATE
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Compare & Map
              </h3>
              <p className="text-xs text-white/70 mt-2.5 leading-relaxed font-normal">
                Side-by-side methodology comparison and an interactive research relationship graph.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#282b54]">
              <span className="font-mono uppercase text-[10px] tracking-wide text-white/50">GRAPH + LIST PARITY</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="card-discord p-5 flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
                04_SYNTHESIZE
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Gaps & Ideas
              </h3>
              <p className="text-xs text-white/70 mt-2.5 leading-relaxed font-normal">
                Recurring limitation clusters, potential research gaps, and validated project directions.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#282b54]">
              <span className="font-mono uppercase text-[10px] tracking-wide text-white/50">GROUNDED IN EVIDENCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Integrity Safeguards */}
      <div className="py-16">
        <span className="text-xs font-semibold tracking-wider text-[#ec48bd] uppercase block mb-2">
          // ACADEMIC INTEGRITY SAFEGUARDS
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-6">
          Engineered for Factual Grounding
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-discord p-5 hover:border-[#00b0f4]/60">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00b0f4]/15 text-[#00b0f4] border border-[#00b0f4]/30 text-[10px] font-mono uppercase tracking-wider font-semibold mb-3">
              [TRACEABILITY]
            </span>
            <h4 className="text-sm font-bold text-white mb-1.5">Page-Level Citations</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Every extracted claim and comparison links directly to original page numbers in your source PDFs.
            </p>
          </div>

          <div className="card-discord p-5 hover:border-[#35ed7e]/60">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#35ed7e]/15 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] font-mono uppercase tracking-wider font-semibold mb-3">
              [TRUTHFULNESS]
            </span>
            <h4 className="text-sm font-bold text-white mb-1.5">No Fabricated Metadata</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Missing fields are explicitly labeled "Not found in paper" rather than hallucinating details.
            </p>
          </div>

          <div className="card-discord p-5 hover:border-[#ec48bd]/60">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ec48bd]/15 text-[#ec48bd] border border-[#ec48bd]/30 text-[10px] font-mono uppercase tracking-wider font-semibold mb-3">
              [HUMILITY]
            </span>
            <h4 className="text-sm font-bold text-white mb-1.5">Collection-Scope Limits</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Potential gaps reflect patterns in your collection and require external literature verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
