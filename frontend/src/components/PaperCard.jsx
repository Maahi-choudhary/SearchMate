import React from 'react';
import { ArrowUpRight, Trash2, FileText } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function PaperCard({ paper, onOpen, onDelete }) {
  const authorsText = paper.authors && paper.authors.length > 0 
    ? paper.authors.slice(0, 2).join(', ') + (paper.authors.length > 2 ? ' et al.' : '')
    : 'Authors not specified';

  return (
    <div className="bg-[#1e2353]/70 backdrop-blur-sm border border-[#282b54] rounded-xl p-5 hover:border-[#5865f2]/70 hover:shadow-discord-glow transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Status & Delete */}
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={paper.status} errorCode={paper.error_code} />
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Remove '${paper.title || paper.filename}' from this collection?`)) {
                  onDelete(paper.id);
                }
              }}
              className="text-white/40 hover:text-[#ec48bd] p-1.5 rounded-lg hover:bg-[#ec48bd]/10 transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Metadata Eyebrow */}
        <div className="text-[11px] font-medium text-[#00b0f4] mb-1.5 truncate flex items-center gap-1.5">
          <span className="opacity-70">#{paper.publication_year || 'YEAR-N/A'}</span>
          <span className="text-white/30">•</span>
          <span className="text-white/60 truncate">{authorsText}</span>
        </div>

        {/* Title */}
        <h3 
          onClick={onOpen}
          className="text-base font-semibold text-white group-hover:text-[#5865f2] cursor-pointer line-clamp-2 transition-colors duration-150 leading-snug"
        >
          {paper.title || paper.filename}
        </h3>

        {/* Beginner summary or abstract excerpt */}
        <p className="text-xs text-white/70 mt-3 line-clamp-3 leading-relaxed font-normal">
          {paper.analysis?.beginner_explanation || paper.abstract || 'Document ingestion complete. Initializing analysis...'}
        </p>
      </div>

      {/* Footer Open Action */}
      <div className="mt-5 pt-3.5 border-t border-[#282b54] flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0a0d3a]/70 text-white/50 text-[10px] font-mono border border-[#282b54]">
          <FileText className="w-3 h-3 text-[#5865f2]" />
          {paper.page_count ? `${paper.page_count} PAGES` : 'PDF'}
        </span>
        <button
          onClick={onOpen}
          className="btn-outline-sm group-hover:border-[#5865f2] group-hover:text-white"
        >
          <span className="text-xs font-medium">Read Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-[#5865f2] transition-colors" />
        </button>
      </div>
    </div>
  );
}
