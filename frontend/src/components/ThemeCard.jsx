import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function ThemeCard({ theme, onViewInGraph }) {
  const paperCount = theme.paper_ids ? theme.paper_ids.length : 1;

  return (
    <div className="bg-canvas-card border border-hairline rounded-sm p-5 hover:border-white/30 transition-colors duration-150 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="eyebrow-mono text-[10px] text-accent-twilight">
            // RECURRING THEME
          </span>
          <span className="font-mono uppercase text-[10px] tracking-caption-mono text-mute">
            [{paperCount} {paperCount === 1 ? 'PAPER' : 'PAPERS'}]
          </span>
        </div>

        <h4 className="text-base font-normal tracking-[-0.4px] text-ink mt-1">
          {theme.name}
        </h4>

        <p className="text-xs text-body/80 mt-2 leading-relaxed">
          {theme.description}
        </p>

        {theme.keywords && theme.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {theme.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-pill text-[10px] font-mono uppercase tracking-caption-mono-sm bg-canvas-soft text-mute border border-hairline"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {onViewInGraph && (
        <div className="mt-5 pt-3.5 border-t border-hairline">
          <button
            onClick={() => onViewInGraph(theme.id)}
            className="btn-outline-sm w-full group-hover:border-white/50"
          >
            <span className="font-mono uppercase tracking-caption-mono-sm text-[10px]">Inspect In Graph</span>
            <ArrowUpRight className="w-3 h-3 text-mute group-hover:text-ink transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}
