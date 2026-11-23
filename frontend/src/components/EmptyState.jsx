import React from 'react';
import { ArrowRight } from 'lucide-react';

export function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="bg-canvas-card border border-hairline rounded-sm p-10 text-center max-w-lg mx-auto my-8">
      <span className="eyebrow-mono block mb-2 text-mute">
        // NO RECORDS FOUND
      </span>
      <h3 className="text-base font-normal tracking-[-0.4px] text-ink">{title}</h3>
      <p className="text-xs text-body/80 mt-2 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <button
            onClick={onAction}
            className="btn-outline-sm"
          >
            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
