import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function CitationLink({ paperTitle, pageNumber, excerpt, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-canvas-soft hover:bg-canvas-card border border-white/20 hover:border-white/50 text-[11px] font-mono uppercase tracking-caption-mono-sm text-body hover:text-ink transition-colors duration-150 group text-left"
      title={excerpt || `Source: ${paperTitle}`}
    >
      <span className="truncate max-w-[200px]">{paperTitle}</span>
      {pageNumber && (
        <span className="text-mute group-hover:text-ink">
          // P.{pageNumber}
        </span>
      )}
      <ArrowUpRight className="w-3 h-3 text-mute opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}
