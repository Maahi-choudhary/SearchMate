import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertTriangle } from 'lucide-react';

export function FileUploader({ onUpload, currentPaperCount = 0, maxPapers = 5, isUploading = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    setErrorMsg('');
    if (!files || files.length === 0) return;

    if (currentPaperCount >= maxPapers) {
      setErrorMsg(`Collection limit reached. Maximum ${maxPapers} papers allowed.`);
      return;
    }

    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Invalid file format. Upload text-based PDF documents only.');
      return;
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 10) {
      setErrorMsg(`PDF exceeds limit (${sizeMb.toFixed(1)} MB / 10 MB limit).`);
      return;
    }

    onUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border rounded-sm p-8 text-center cursor-pointer transition-colors duration-150 ${
          isDragOver
            ? 'border-white/60 bg-canvas-soft'
            : 'border-hairline hover:border-white/30 bg-canvas-card'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          accept=".pdf,application/pdf"
          className="hidden"
          disabled={isUploading || currentPaperCount >= maxPapers}
        />

        <div className="mx-auto w-10 h-10 rounded-pill border border-white/20 bg-canvas-soft flex items-center justify-center text-ink mb-3">
          <Upload className="w-4 h-4 opacity-80" />
        </div>

        <span className="eyebrow-mono block mb-1.5">
          // INGESTION PROTOCOL
        </span>

        <h3 className="text-base font-normal tracking-[-0.4px] text-ink">
          {isUploading ? 'Extracting & Parsing PDF Document...' : 'Drop Research Paper PDF Here'}
        </h3>
        
        <p className="text-[11px] font-mono uppercase tracking-caption-mono-sm text-mute mt-2">
          TEXT-BASED PDFS · 10 MB MAX · [{currentPaperCount}/{maxPapers} SLOTS FILLED]
        </p>

        <div className="mt-5 flex items-center justify-center">
          <button
            type="button"
            disabled={isUploading || currentPaperCount >= maxPapers}
            className="btn-outline-sm"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span className="font-mono uppercase tracking-caption-mono-sm text-[11px]">Select Document</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 bg-canvas-card border border-accent-sunset/40 rounded-sm flex items-center gap-2.5 text-xs text-accent-sunset-soft font-mono">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-accent-sunset" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
