import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';

export function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="bg-[#1e2353]/60 backdrop-blur-sm border border-[#282b54] rounded-2xl p-10 text-center max-w-lg mx-auto my-8 shadow-discord-card">
      <div className="w-12 h-12 rounded-2xl bg-[#5865f2]/20 border border-[#5865f2]/30 flex items-center justify-center text-[#5865f2] mx-auto mb-3">
        <Compass className="w-6 h-6" />
      </div>
      <span className="block text-[11px] font-semibold text-white/40 tracking-wider uppercase mb-1">
        // NO RECORDS FOUND
      </span>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-xs text-white/70 mt-2 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
