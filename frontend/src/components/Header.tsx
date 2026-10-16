import React from 'react';
import { Sparkles, Settings, Github, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, hasApiKey }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">SnapToStack</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" />
                Gemma 4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Snap a mockup. Ship the full stack.</p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
              hasApiKey 
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white' 
                : 'bg-brand-500/10 border-brand-500/30 text-brand-300 hover:bg-brand-500/20 animate-pulse'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{hasApiKey ? 'Settings' : 'Set API Key'}</span>
          </button>

          <a
            href="https://github.com/amanmaurya92/SnapToStack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
