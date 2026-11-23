import React from 'react';
import { ArrowUpRight, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export function PaperCard({ paper, onOpen, onDelete }) {
  const authorsText = paper.authors && paper.authors.length > 0 
    ? paper.authors.slice(0, 2).join(', ') + (paper.authors.length > 2 ? ' et al.' : '')
    : 'Authors not specified';

  return (
    <div className="bg-canvas-card border border-hairline rounded-sm p-5 hover:border-white/30 transition-colors duration-150 flex flex-col justify-between group">
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
              className="text-mute hover:text-white p-1 transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Metadata Eyebrow */}
        <div className="eyebrow-mono text-[10px] mb-1.5 truncate">
          // {paper.publication_year || 'YEAR NOT FOUND'} · {authorsText}
        </div>

        {/* Title */}
        <h3 
          onClick={onOpen}
          className="text-base font-normal tracking-[-0.4px] text-ink hover:text-white cursor-pointer line-clamp-2 transition-colors"
        >
          {paper.title || paper.filename}
        </h3>

        {/* Beginner summary or abstract excerpt */}
        <p className="text-xs text-body/80 mt-3 line-clamp-3 leading-relaxed font-normal">
          {paper.analysis?.beginner_explanation || paper.abstract || 'Document ingestion complete. Initializing analysis...'}
        </p>
      </div>

      {/* Footer Open Action */}
      <div className="mt-5 pt-3.5 border-t border-hairline flex items-center justify-between">
        <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
          // {paper.page_count ? `${paper.page_count} PAGES` : 'PDF SOURCE'}
        </span>
        <button
          onClick={onOpen}
          className="btn-outline-sm group-hover:border-white/60"
        >
          <span className="font-mono uppercase tracking-caption-mono-sm text-[10px]">Read Analysis</span>
          <ArrowUpRight className="w-3 h-3 text-mute group-hover:text-ink transition-colors" />
        </button>
      </div>
    </div>
  );
}
