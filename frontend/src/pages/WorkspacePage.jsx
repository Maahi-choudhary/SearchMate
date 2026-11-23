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
  isUploading
}) {
  const papers = overview?.papers || [];
  const themes = overview?.themes || [];
  const insights = overview?.insights || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Workspace Header Band */}
      <div className="card-xai mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="eyebrow-mono block mb-1">
              // ACTIVE RESEARCH WORKSPACE
            </span>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-[-0.8px] text-ink">
              {collection?.name || 'Research Workspace'}
            </h1>
            <p className="text-xs text-body/80 mt-1.5 font-normal">
              Cross-paper relationship synthesis, methodology comparison, and grounded gap discovery.
            </p>
          </div>

          {/* Metric Counters (xAI Mono Eyebrows) */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="bg-canvas-soft border border-hairline rounded-sm px-3.5 py-2 text-center min-w-[80px]">
              <span className="block text-lg font-normal text-ink leading-tight">{papers.length}</span>
              <span className="text-[10px] uppercase tracking-caption-mono text-mute">Papers</span>
            </div>
            <div className="bg-canvas-soft border border-hairline rounded-sm px-3.5 py-2 text-center min-w-[80px]">
              <span className="block text-lg font-normal text-accent-breeze leading-tight">{themes.length}</span>
              <span className="text-[10px] uppercase tracking-caption-mono text-mute">Themes</span>
            </div>
            <div className="bg-canvas-soft border border-hairline rounded-sm px-3.5 py-2 text-center min-w-[80px]">
              <span className="block text-lg font-normal text-accent-twilight leading-tight">{insights.length}</span>
              <span className="text-[10px] uppercase tracking-caption-mono text-mute">Gaps</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Action Pills */}
        <div className="mt-6 pt-5 border-t border-hairline flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('compare')}
            className="btn-outline-sm"
          >
            <GitCompare className="w-3.5 h-3.5 text-mute" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Compare ({papers.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab('graph')}
            className="btn-outline-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-mute" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Relationship Graph</span>
          </button>

          <button
            onClick={() => onNavigateTab('discover')}
            className="btn-outline-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-mute" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Gaps & Ideas ({insights.length})</span>
          </button>

          <button
            onClick={() => onNavigateTab('qa')}
            className="btn-outline-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-mute" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Ask Collection</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Uploader & Uploaded Papers (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Uploader Box */}
          <div className="card-xai">
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow-mono">
                // DOCUMENT INGESTION
              </span>
              <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
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
              <span className="eyebrow-mono">
                // ACTIVE CORPUS ({papers.length}/5)
              </span>
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
          <div className="card-xai">
            <span className="eyebrow-mono block mb-1">
              // RECURRING THEMES
            </span>
            <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm mb-4">
              Synthesized concept clusters
            </p>

            {themes.length === 0 ? (
              <p className="text-xs text-mute font-mono uppercase tracking-caption-mono-sm py-4 text-center">
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
          <div className="card-xai bg-canvas-soft border-hairline">
            <span className="eyebrow-mono text-accent-breeze block mb-2">
              // RESEARCH READING PROTOCOL
            </span>
            <p className="text-xs text-body/90 leading-relaxed font-normal">
              Focus on the <strong>Objective</strong> (what problem they set out to solve) and the <strong>Stated Limitations</strong> (where the method broke down). SearchMate grounds every insight directly in source paragraphs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
