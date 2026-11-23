import React from 'react';
import { Loader2 } from 'lucide-react';

export function StatusBadge({ status, errorCode }) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[11px] font-mono uppercase tracking-caption-mono-sm bg-canvas-soft border border-white/20 text-ink">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
          Completed
        </span>
      );
    case 'validating':
    case 'extracting':
    case 'analysing':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[11px] font-mono uppercase tracking-caption-mono-sm bg-canvas-soft border border-white/30 text-ink">
          <Loader2 className="w-3 h-3 animate-spin text-accent-breeze" />
          {status}...
        </span>
      );
    case 'failed':
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[11px] font-mono uppercase tracking-caption-mono-sm bg-canvas-soft border border-accent-sunset/50 text-accent-sunset-soft"
          title={errorCode || 'Failed'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sunset inline-block"></span>
          Failed {errorCode ? `[${errorCode}]` : ''}
        </span>
      );
    case 'uploaded':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[11px] font-mono uppercase tracking-caption-mono-sm bg-canvas-soft border border-hairline text-mute">
          <span className="w-1.5 h-1.5 rounded-full bg-mute inline-block"></span>
          Queued
        </span>
      );
  }
}
