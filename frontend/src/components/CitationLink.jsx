import React from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';

export function CitationLink({ paperTitle, pageNumber, excerpt, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#23272a] hover:bg-[#5865f2]/20 border border-[#282b54] hover:border-[#5865f2] text-xs font-medium text-white/80 hover:text-white transition-all duration-150 group text-left shadow-discord-sm"
      title={excerpt || `Source: ${paperTitle}`}
    >
      <BookOpen className="w-3 h-3 text-[#5865f2] flex-shrink-0" />
      <span className="truncate max-w-[200px]">{paperTitle}</span>
      {pageNumber && (
        <span className="text-[#00b0f4] font-mono text-[10px] font-semibold">
          P.{pageNumber}
        </span>
      )}
      <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
    </button>
  );
}
