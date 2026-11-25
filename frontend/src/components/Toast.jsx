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
      className={`pointer-events-auto bg-[#23272a]/95 backdrop-blur-md border rounded-xl p-4 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
        isError
          ? 'border-[#ec48bd]/50 text-white shadow-[#ec48bd]/10'
          : isSuccess
          ? 'border-[#35ed7e]/50 text-white shadow-[#35ed7e]/10'
          : 'border-[#5865f2]/40 text-white shadow-discord-blurple/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-[#ec48bd] mt-0.5 flex-shrink-0" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-[#35ed7e] mt-0.5 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#5865f2] mt-0.5 flex-shrink-0" />
          )}

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                isError ? 'text-[#ec48bd]' : isSuccess ? 'text-[#35ed7e]' : 'text-[#5865f2]'
              }`}>
                {title || (isError ? '// SYSTEM ERROR' : isSuccess ? '// SUCCESS' : '// NOTICE')}
              </span>
              {timestamp && (
                <span className="font-mono text-[9px] text-mute">
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
          className="text-mute hover:text-white p-1 rounded-md transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
