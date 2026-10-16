import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, X, Wand2 } from 'lucide-react';
import { PresetSample } from '../types';

interface ImageUploadProps {
  onImageSelected: (dataUri: string) => void;
  selectedImage: string | null;
  onClearImage: () => void;
  isGenerating: boolean;
}

// Built-in presets with SVGs as data URIs so they work 100% offline
const PRESETS: PresetSample[] = [
  {
    id: 'dashboard',
    title: 'SaaS Analytics Dashboard',
    category: 'Full Application',
    description: 'Header, revenue trajectory, metrics cards, and transaction list.',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240" fill="%230f172a"><rect width="400" height="240" rx="12" fill="%23020617"/><rect x="20" y="20" width="360" height="40" rx="6" fill="%231e293b"/><rect x="20" y="70" width="80" height="50" rx="6" fill="%231e293b"/><rect x="110" y="70" width="80" height="50" rx="6" fill="%231e293b"/><rect x="200" y="70" width="80" height="50" rx="6" fill="%231e293b"/><rect x="290" y="70" width="90" height="50" rx="6" fill="%231e293b"/><rect x="20" y="130" width="240" height="90" rx="8" fill="%231e293b"/><rect x="270" y="130" width="110" height="90" rx="8" fill="%231e293b"/></svg>'
  },
  {
    id: 'landing',
    title: 'Modern AI Landing Hero',
    category: 'Marketing',
    description: 'Hero headline, gradient accents, CTA group, and modern navbar.',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240" fill="%23020617"><rect width="400" height="240" rx="12" fill="%23020617"/><circle cx="200" cy="80" r="120" fill="%237c3aed" opacity="0.2"/><rect x="40" y="20" width="320" height="30" rx="6" fill="%231e293b"/><rect x="80" y="80" width="240" height="24" rx="4" fill="%2338bdf8"/><rect x="120" y="115" width="160" height="14" rx="4" fill="%2364748b"/><rect x="140" y="145" width="120" height="32" rx="8" fill="%238b5cf6"/></svg>'
  }
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  selectedImage,
  onClearImage,
  isGenerating
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener (Ctrl+V anywhere in window!)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Upload Zone or Preview */}
      {!selectedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
            }}
          />
          <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-brand-400 mb-4 shadow-inner">
            <UploadCloud className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-white">
            Drop screenshot or sketch here
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Drag & drop, browse files, or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">Ctrl+V</kbd> to paste from clipboard.
          </p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 group">
          <img
            src={selectedImage}
            alt="Uploaded Mockup"
            className="w-full h-56 object-contain bg-slate-950 p-2"
          />
          {!isGenerating && (
            <button
              onClick={onClearImage}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/90 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition border border-slate-700 shadow-md"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-brand-400" />
              Source Mockup Loaded
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Ready for Gemma 4</span>
          </div>
        </div>
      )}

      {/* Preset Samples */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-brand-400" />
            Or Pick a Hackathon Demo Preset
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              disabled={isGenerating}
              onClick={() => onImageSelected(preset.previewUrl)}
              className="text-left p-3 rounded-xl border border-slate-800 hover:border-brand-500/50 bg-slate-900/60 hover:bg-slate-900 transition flex flex-col justify-between group disabled:opacity-50"
            >
              <div>
                <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider block mb-1">
                  {preset.category}
                </span>
                <p className="text-xs font-semibold text-white group-hover:text-brand-300 transition">
                  {preset.title}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {preset.description}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-slate-500 group-hover:text-slate-300">
                <Wand2 className="h-3 w-3" />
                <span>Compile with Gemma 4</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
