import React from 'react';
import { Layers, GitCompare, Share2, Sparkles, HelpCircle } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { PaperCard } from '../components/PaperCard';
import { ThemeCard } from '../components/ThemeCard';
import { EmptyState } from '../components/EmptyState';

export function WorkspacePage({
  collection,
  overview,
  onUpload,
  onOpenPaper,
  onDeletePaper,
  onNavigateTab,
  isUploading,
  onNotify
}) {
  const papers = overview?.papers || [];
  const themes = overview?.themes || [];
  const insights = overview?.insights || [];
  const inProgressCount = papers.filter(
    (p) => p.status && !['completed', 'failed'].includes(p.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Workspace Header Band */}
      <div className="card-discord p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#00b0f4] uppercase block mb-1">
              // ACTIVE RESEARCH WORKSPACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {collection?.name || 'Research Workspace'}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1.5 font-normal max-w-2xl">
              Cross-paper relationship synthesis, methodology comparison, and grounded gap discovery.
            </p>
            {inProgressCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#5865f2]/20 border border-[#5865f2]/40 rounded-full text-xs font-medium text-white shadow-discord-sm">
                <span className="w-2 h-2 rounded-full bg-[#35ed7e] animate-pulse"></span>
                <span>{inProgressCount} {inProgressCount === 1 ? 'Paper' : 'Papers'} Ingesting & Analyzing...</span>
              </div>
            )}
          </div>

          {/* Metric Counters (Discord Stat Boxes) */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-[#23272a] border border-[#282b54] rounded-xl px-4 py-2.5 text-center min-w-[85px] shadow-discord-sm">
              <span className="block text-xl font-bold text-white leading-tight">{papers.length}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/50">Papers</span>
            </div>
            <div className="bg-[#23272a] border border-[#282b54] rounded-xl px-4 py-2.5 text-center min-w-[85px] shadow-discord-sm">
              <span className="block text-xl font-bold text-[#00b0f4] leading-tight">{themes.length}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/50">Themes</span>
            </div>
            <div className="bg-[#23272a] border border-[#282b54] rounded-xl px-4 py-2.5 text-center min-w-[85px] shadow-discord-sm">
              <span className="block text-xl font-bold text-[#ec48bd] leading-tight">{insights.length}</span>
              <span className="text-[10px] uppercase tracking-wide text-white/50">Gaps</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Action Pills */}
        <div className="mt-6 pt-5 border-t border-[#282b54] flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('compare')}
            className="btn-outline-sm flex items-center gap-2 hover:border-[#5865f2]"
          >
            <GitCompare className="w-4 h-4 text-[#5865f2]" />
            <span className="text-xs font-medium">Compare ({papers.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab('graph')}
            className="btn-outline-sm flex items-center gap-2 hover:border-[#5865f2]"
          >
            <Share2 className="w-4 h-4 text-[#35ed7e]" />
            <span className="text-xs font-medium">Relationship Graph</span>
          </button>

          <button
            onClick={() => onNavigateTab('discover')}
            className="btn-outline-sm flex items-center gap-2 hover:border-[#5865f2]"
          >
            <Sparkles className="w-4 h-4 text-[#ec48bd]" />
            <span className="text-xs font-medium">Gaps & Ideas ({insights.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab('qa')}
            className="btn-outline-sm flex items-center gap-2 hover:border-[#5865f2]"
          >
            <HelpCircle className="w-4 h-4 text-[#00b0f4]" />
            <span className="text-xs font-medium">Ask Collection</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Uploader & Uploaded Papers (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Uploader Box */}
          <div className="card-discord p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider text-[#00b0f4] uppercase">
                // DOCUMENT INGESTION
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">
                [MAX 5 PDFS]
              </span>
            </div>
            <FileUploader
              onUpload={onUpload}
              currentPaperCount={papers.length}
              maxPapers={5}
              isUploading={isUploading}
            />
          </div>

          {/* Papers Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                // ACTIVE CORPUS ({papers.length}/5)
              </span>
              {inProgressCount > 0 && (
                <span className="text-xs font-medium text-[#5865f2] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5865f2] animate-ping"></span>
                  Processing {inProgressCount} active...
                </span>
              )}
            </div>

            {papers.length === 0 ? (
              <EmptyState
                title="No papers ingested yet"
                description="Upload 2 to 5 research paper PDFs above to initialize section parsing, theme clustering, and cross-paper comparison."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {papers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    onOpen={() => onOpenPaper(paper.id)}
                    onDelete={onDeletePaper}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Themes & Guidance (1 col) */}
        <div className="space-y-6">
          <div className="card-discord p-5">
            <span className="text-xs font-semibold tracking-wider text-[#5865f2] uppercase block mb-1">
              // RECURRING THEMES
            </span>
            <p className="text-xs text-white/50 font-mono uppercase mb-4">
              Synthesized concept clusters
            </p>

            {themes.length === 0 ? (
              <p className="text-xs text-white/50 font-mono uppercase py-6 text-center">
                Upload papers to discover cross-paper themes.
              </p>
            ) : (
              <div className="space-y-3">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    onViewInGraph={() => onNavigateTab('graph')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Academic Synthesis Note */}
          <div className="bg-[#23272a] border-l-4 border-l-[#5865f2] border-t border-r border-b border-[#282b54] rounded-xl p-5 shadow-discord-card">
            <span className="text-xs font-semibold text-[#00b0f4] uppercase tracking-wider block mb-2">
              // RESEARCH READING PROTOCOL
            </span>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              Focus on the <strong className="text-white font-semibold">Objective</strong> (what problem they set out to solve) and the <strong className="text-white font-semibold">Stated Limitations</strong> (where the method broke down). SearchMate grounds every insight directly in source paragraphs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
