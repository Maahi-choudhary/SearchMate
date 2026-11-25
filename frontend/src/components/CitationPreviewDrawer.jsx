import React, { useEffect } from 'react';
import { X, ArrowUpRight, BookOpen, Quote, ShieldCheck } from 'lucide-react';

export function CitationPreviewDrawer({ citation, isOpen, onClose, onOpenPaper }) {
  // Listen for Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !citation) return null;

  const {
    paper_id,
    paper_title = 'Research Paper',
    page_number,
    text_snippet,
    excerpt
  } = citation;

  const quoteText = text_snippet || excerpt || 'Detailed cited passage extracted from original PDF document.';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#161616] border-l border-hairline shadow-2xl flex flex-col justify-between p-6 sm:p-7 text-ink animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-breeze"></span>
                <span className="font-mono text-[10px] uppercase tracking-caption-mono text-mute">
                  // SOURCE EVIDENCE VERIFICATION
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-mute hover:text-ink p-1 rounded-sm transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Paper Title & Page Citation */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-pill bg-canvas-soft border border-white/20 text-accent-breeze font-mono text-[11px] uppercase tracking-caption-mono-sm">
                  {page_number ? `PAGE ${page_number}` : 'PAGE CITATION'}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-caption-mono text-mute">
                  [1-INDEXED REF]
                </span>
              </div>
              <h2 className="text-base font-normal tracking-[-0.3px] text-ink leading-snug">
                {paper_title}
              </h2>
            </div>

            {/* Cited Excerpt Box */}
            <div className="mt-6">
              <div className="flex items-center gap-1.5 text-mute font-mono text-[10px] uppercase tracking-caption-mono mb-2">
                <Quote className="w-3.5 h-3.5 text-accent-breeze opacity-80" />
                <span>Primary Document Excerpt</span>
              </div>
              <div className="bg-canvas-card border border-hairline rounded-sm p-4 relative">
                <p className="text-xs text-body/95 leading-relaxed font-normal italic">
                  "{quoteText}"
                </p>
              </div>
            </div>

            {/* Academic Grounding Metadata */}
            <div className="mt-6 p-3.5 rounded-sm bg-canvas-soft border border-hairline space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-breeze" />
                <span className="font-mono text-[10px] uppercase tracking-caption-mono text-ink">
                  Strictly Grounded Retrieval
                </span>
              </div>
              <p className="text-[11px] text-mute leading-relaxed font-normal">
                This excerpt was extracted directly from the verified PDF pages in your collection. It provides primary textual evidence for the synthesized answer or detected limitation.
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-5 border-t border-hairline flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (paper_id && onOpenPaper) {
                  onOpenPaper(paper_id);
                }
              }}
              className="btn-primary w-full sm:flex-1 justify-center"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">
                Inspect Full Paper
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-outline-sm w-full sm:w-auto justify-center"
            >
              <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">
                Dismiss
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
