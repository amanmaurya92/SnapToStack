import React, { useState } from 'react';
import { X, Key, Cpu, Code, Check } from 'lucide-react';
import { AppSettings, StackType } from '../types';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [model, setModel] = useState(settings.model);
  const [stack, setStack] = useState<StackType>(settings.selectedStack);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      geminiApiKey: apiKey.trim(),
      model,
      selectedStack: stack,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Compiler Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-brand-400" />
            Google AI Studio / Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono"
          />
          <p className="text-[11px] text-slate-500">
            Leave blank to run in offline high-fidelity simulation mode.
          </p>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            Selected Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="gemma-4">gemma-4 (Google DeepMind - Recommended)</option>
            <option value="gemini-2.5-flash">gemini-2.5-flash (Ultra Fast Multimodal)</option>
            <option value="gemini-2.0-flash">gemini-2.0-flash (General Purpose)</option>
          </select>
        </div>

        {/* Target Stack */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5 text-indigo-400" />
            Target Framework
          </label>
          <select
            value={stack}
            onChange={(e) => setStack(e.target.value as StackType)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="react-tailwind">React + Tailwind CSS</option>
            <option value="html-tailwind">HTML5 + Tailwind CSS</option>
            <option value="vue-tailwind">Vue 3 + Tailwind CSS</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25 transition"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
