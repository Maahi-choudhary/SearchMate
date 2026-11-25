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
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-[#35ed7e] bg-[#35ed7e]/10 shadow-discord-glow'
            : 'border-[#3c4270] hover:border-[#5865f2] bg-[#1e2353]/50 hover:bg-[#1e2353]/80 shadow-discord-card'
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

        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#5865f2]/20 border border-[#5865f2]/40 flex items-center justify-center text-[#5865f2] mb-3 shadow-discord-sm transition-transform group-hover:scale-105">
          <Upload className="w-6 h-6" />
        </div>

        <span className="inline-block text-[11px] font-semibold tracking-wider text-[#00b0f4] uppercase mb-1">
          // INGESTION PROTOCOL
        </span>

        <h3 className="text-base md:text-lg font-bold text-white tracking-tight">
          {isUploading ? 'Extracting & Parsing PDF Document...' : 'Drop Research Paper PDF Here'}
        </h3>
        
        <p className="text-xs text-white/60 font-mono mt-1">
          TEXT-BASED PDFS · 10 MB MAX · [{currentPaperCount}/{maxPapers} SLOTS FILLED]
        </p>

        <div className="mt-5 flex items-center justify-center">
          <button
            type="button"
            disabled={isUploading || currentPaperCount >= maxPapers}
            className="btn-primary flex items-center gap-2 text-xs"
          >
            <FileUp className="w-4 h-4" />
            <span>Select Document</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3.5 bg-[#23272a] border border-[#ec48bd]/40 rounded-xl flex items-center gap-2.5 text-xs text-[#ec48bd] font-medium shadow-discord-card">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#ec48bd]" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
