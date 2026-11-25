import React from 'react';
import { Loader2 } from 'lucide-react';

export function StatusBadge({ status, errorCode }) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-bold font-mono uppercase tracking-wider bg-[#35ed7e]/15 border border-[#35ed7e]/40 text-[#35ed7e] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#35ed7e] inline-block shadow-[0_0_8px_#35ed7e]"></span>
          Completed
        </span>
      );
    case 'validating':
    case 'extracting':
    case 'analysing':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-bold font-mono uppercase tracking-wider bg-[#5865f2]/20 border border-[#5865f2]/50 text-white animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5865f2]" />
          {status}...
        </span>
      );
    case 'failed':
      return (
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-bold font-mono uppercase tracking-wider bg-[#ec48bd]/20 border border-[#ec48bd]/50 text-[#ec48bd]"
          title={errorCode || 'Failed'}
        >
          <span className="w-2 h-2 rounded-full bg-[#ec48bd] inline-block shadow-[0_0_8px_#ec48bd]"></span>
          Failed {errorCode ? `[${errorCode}]` : ''}
        </span>
      );
    case 'uploaded':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-[11px] font-medium font-mono uppercase tracking-wider bg-[#23272a] border border-[#282b54] text-[#949ba4]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#949ba4] inline-block"></span>
          Queued
        </span>
      );
  }
}
