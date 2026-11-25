import React from 'react';
import { ArrowLeft, ExternalLink, Lightbulb, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export function PaperDetailPage({ paper, onBack }) {
  if (!paper) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-xs font-semibold tracking-wider text-[#ec48bd] uppercase block mb-2">// ERROR: 404</span>
        <p className="text-sm text-white/70">Paper record not found.</p>
        <button onClick={onBack} className="btn-primary mt-4 text-xs">
          Return to Workspace
        </button>
      </div>
    );
  }

  const analysis = paper.analysis || {};
  const authorsText = paper.authors && paper.authors.length > 0 
    ? paper.authors.join(', ')
    : 'Authors not specified';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="btn-outline-sm flex items-center gap-2 hover:border-[#5865f2]"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
          <span className="text-xs font-medium">Return to Collection</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="card-discord p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <StatusBadge status={paper.status} errorCode={paper.error_code} />
          <span className="font-mono text-xs text-white/50">
            {paper.filename}
          </span>
          {paper.page_count > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#0a0d3a]/70 text-[#00b0f4] text-[10px] font-mono border border-[#282b54]">
              {paper.page_count} PAGES PARSED
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          {paper.title || paper.filename}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/60 font-mono">
          <span>{authorsText}</span>
          <span className="text-white/30">•</span>
          <span>PUBLISHED: {paper.publication_year || 'NOT FOUND'}</span>
        </div>
      </div>

      {/* Beginner Explanation Highlight Box */}
      <div className="bg-[#23272a] border-l-4 border-l-[#5865f2] border-t border-r border-b border-[#282b54] rounded-xl p-5 mb-6 shadow-discord-card">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-[#35ed7e]" />
          <span className="text-xs font-semibold text-[#35ed7e] uppercase tracking-wider">
            // PLAIN-ENGLISH BREAKDOWN
          </span>
        </div>
        <p className="text-sm text-white/90 leading-relaxed font-normal">
          {analysis.beginner_explanation || 'Detailed plain-English analysis is being synthesized for this document.'}
        </p>
      </div>

      {/* Structured Sections */}
      <div className="space-y-6">
        {/* Abstract */}
        {paper.abstract && (
          <div className="card-discord p-5">
            <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
              ABSTRACT
            </span>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              {paper.abstract}
            </p>
          </div>
        )}

        {/* Objective & Methodology (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-discord p-5">
            <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
              01_RESEARCH OBJECTIVE
            </span>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              {analysis.objective || 'Not found in paper'}
            </p>
          </div>

          <div className="card-discord p-5">
            <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
              02_METHODOLOGY
            </span>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              {analysis.methodology || 'Not found in paper'}
            </p>
          </div>
        </div>

        {/* Dataset */}
        <div className="card-discord p-5">
          <span className="px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
            03_DATASET & BENCHMARKS
          </span>
          <p className="text-xs text-white/80 leading-relaxed font-normal">
            {analysis.dataset || 'Not found in paper'}
          </p>
        </div>

        {/* Main Findings */}
        <div className="card-discord p-5">
          <span className="px-2 py-0.5 rounded-full bg-[#35ed7e]/20 text-[#35ed7e] border border-[#35ed7e]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
            04_MAIN FINDINGS & METRICS
          </span>
          {analysis.main_findings && analysis.main_findings.length > 0 ? (
            <ul className="space-y-2">
              {analysis.main_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                  <span className="text-[#35ed7e] font-mono text-[11px] font-bold mt-0.5">[{idx + 1}]</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-white/50 font-mono italic">
              No explicit findings extracted.
            </p>
          )}
        </div>

        {/* Author-Stated Limitations */}
        <div className="card-discord p-5 border-[#ec48bd]/40 hover:border-[#ec48bd]/70">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-full bg-[#ec48bd]/20 text-[#ec48bd] border border-[#ec48bd]/30 text-[10px] font-bold font-mono uppercase inline-block">
              05_AUTHOR-STATED LIMITATIONS
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
              EXPLICITLY ACKNOWLEDGED
            </span>
          </div>
          <p className="text-xs text-white/60 mb-3">
            Boundary conditions and constraints explicitly stated by the authors:
          </p>
          {analysis.limitations && analysis.limitations.length > 0 ? (
            <ul className="space-y-2">
              {analysis.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90 bg-[#23272a] border border-[#282b54] p-3.5 rounded-xl leading-relaxed">
                  <span className="text-[#ec48bd] font-mono text-[11px] font-bold mt-0.5">//</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-white/50 font-mono italic">
              Not found in paper
            </p>
          )}
        </div>

        {/* Future Work */}
        {analysis.future_work && analysis.future_work.length > 0 && (
          <div className="card-discord p-5">
            <span className="px-2 py-0.5 rounded-full bg-[#00b0f4]/20 text-[#00b0f4] border border-[#00b0f4]/30 text-[10px] font-bold font-mono uppercase inline-block mb-3">
              06_PROPOSED FUTURE WORK
            </span>
            <ul className="space-y-2">
              {analysis.future_work.map((fw, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
                  <span className="text-[#00b0f4] font-mono text-[11px] font-bold mt-0.5">→</span>
                  <span>{fw}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
