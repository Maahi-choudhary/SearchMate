import React from 'react';
import { ArrowUpRight, Hash } from 'lucide-react';

export function ThemeCard({ theme, onViewInGraph }) {
  const paperCount = theme.paper_ids ? theme.paper_ids.length : 1;

  return (
    <div className="bg-[#1e2353]/70 backdrop-blur-sm border border-[#282b54] rounded-xl p-5 hover:border-[#5865f2]/70 hover:shadow-discord-glow transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 text-[10px] font-semibold tracking-wide uppercase">
            <Hash className="w-3 h-3" />
            RECURRING THEME
          </span>
          <span className="text-white/50 text-xs font-mono">
            {paperCount} {paperCount === 1 ? 'PAPER' : 'PAPERS'}
          </span>
        </div>

        <h4 className="text-base font-bold text-white mt-2 leading-snug">
          {theme.name}
        </h4>

        <p className="text-xs text-white/70 mt-2 leading-relaxed">
          {theme.description}
        </p>

        {theme.keywords && theme.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {theme.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#23272a] text-[#00b0f4] border border-[#282b54] hover:border-[#00b0f4]/50 transition-colors"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {onViewInGraph && (
        <div className="mt-5 pt-3.5 border-t border-[#282b54]">
          <button
            onClick={() => onViewInGraph(theme.id)}
            className="btn-outline-sm w-full group-hover:border-[#5865f2] flex items-center justify-center gap-1.5"
          >
            <span className="text-xs font-medium">Inspect In Graph</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-[#5865f2] transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}
