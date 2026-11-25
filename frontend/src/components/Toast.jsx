import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { type = 'info', title, message, timestamp } = toast;

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <div
      className={`pointer-events-auto card-xai bg-[#191919]/95 backdrop-blur-md border rounded-sm p-4 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
        isError
          ? 'border-red-500/40 text-red-200'
          : isSuccess
          ? 'border-white/30 text-ink'
          : 'border-hairline text-ink'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {isError ? (
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-accent-breeze mt-0.5 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-mute mt-0.5 flex-shrink-0" />
          )}

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[10px] uppercase tracking-caption-mono text-mute">
                {title || (isError ? '// SYSTEM ERROR' : isSuccess ? '// OPERATION OK' : '// NOTICE')}
              </span>
              {timestamp && (
                <span className="font-mono text-[9px] text-mute/70">
                  [{timestamp}]
                </span>
              )}
            </div>
            <p className="text-xs text-body font-normal leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-mute hover:text-ink p-0.5 transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
