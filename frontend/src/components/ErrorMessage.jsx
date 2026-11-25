import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function ErrorMessage({ title = 'Error', message, onRetry }) {
  return (
    <div className="bg-[#23272a] border border-[#ec48bd]/40 rounded-xl p-4 my-4 flex items-start gap-3 shadow-discord-card">
      <AlertTriangle className="w-5 h-5 text-[#ec48bd] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <span className="text-[10px] font-semibold text-[#ec48bd] uppercase tracking-wider block mb-1">
          // SYSTEM FAULT: {title}
        </span>
        <p className="text-xs text-white/80 leading-relaxed font-normal">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 btn-outline-sm flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ec48bd]" />
            <span className="text-xs font-medium">Retry Operation</span>
          </button>
        )}
      </div>
    </div>
  );
}
