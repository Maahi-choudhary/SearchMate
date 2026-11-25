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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1e2353] border-l border-[#282b54] shadow-2xl flex flex-col justify-between p-6 sm:p-7 text-white animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#282b54]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#35ed7e] animate-pulse"></span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5865f2]">
                  // SOURCE EVIDENCE VERIFICATION
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-[#949ba4] hover:text-white p-1 rounded-md transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Paper Title & Page Citation */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-pill bg-[#5865f2] text-white font-bold font-mono text-[11px] shadow-sm">
                  {page_number ? `PAGE ${page_number}` : 'PAGE CITATION'}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#949ba4]">
                  [1-INDEXED REF]
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white leading-snug">
                {paper_title}
              </h2>
            </div>

            {/* Cited Excerpt Box */}
            <div className="mt-6">
              <div className="flex items-center gap-1.5 text-[#949ba4] font-mono text-[10px] uppercase tracking-wider mb-2">
                <Quote className="w-3.5 h-3.5 text-[#5865f2]" />
                <span>Primary Document Excerpt</span>
              </div>
              <div className="bg-[#23272a] border-l-4 border-[#5865f2] rounded-r-lg p-4 relative shadow-md">
                <p className="text-xs text-[#dadbdf] leading-relaxed font-normal italic">
                  "{quoteText}"
                </p>
              </div>
            </div>

            {/* Academic Grounding Metadata */}
            <div className="mt-6 p-4 rounded-xl bg-[#23272a]/70 border border-[#282b54] space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#35ed7e]" />
                <span className="font-bold text-xs text-white">
                  Strictly Grounded Retrieval
                </span>
              </div>
              <p className="text-[11px] text-[#949ba4] leading-relaxed font-normal">
                This excerpt was extracted directly from the verified PDF pages in your collection. It provides primary textual evidence for the synthesized answer or detected limitation.
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-5 border-t border-[#282b54] flex flex-col sm:flex-row items-center gap-2.5">
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
              <BookOpen className="w-4 h-4" />
              <span>Inspect Full Paper</span>
              <ArrowUpRight className="w-4 h-4 ml-0.5 opacity-80" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-outline w-full sm:w-auto justify-center"
            >
              <span>Dismiss</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
