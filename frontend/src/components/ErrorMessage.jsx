import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function ErrorMessage({ title = 'Error', message, onRetry }) {
  return (
    <div className="bg-canvas-card border border-accent-sunset/40 rounded-sm p-4 my-4 flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-accent-sunset flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <span className="eyebrow-mono text-[10px] text-accent-sunset block mb-1">
          // SYSTEM FAULT: {title}
        </span>
        <p className="text-xs text-body leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 btn-outline-sm"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[10px]">Retry Operation</span>
          </button>
        )}
      </div>
    </div>
  );
}
