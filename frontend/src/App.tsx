import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { CodePreview } from './components/CodePreview';
import { SettingsDialog } from './components/SettingsDialog';
import { AppSettings } from './types';
import { WS_BACKEND_URL, HTTP_BACKEND_URL, DEFAULT_MODEL } from './config';
import { Sparkles, ArrowRight, Zap, Award } from 'lucide-react';

export function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('snaptostack_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fall through
      }
    }
    return {
      geminiApiKey: '',
      model: DEFAULT_MODEL,
      selectedStack: 'react-tailwind',
    };
  });

  const wsRef = useRef<WebSocket | null>(null);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('snaptostack_settings', JSON.stringify(newSettings));
  };

  const handleStartGeneration = () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setGeneratedCode('');
    setStatusMessage('Connecting to Gemma 4 visual compiler...');

    // Attempt WebSocket streaming
    try {
      const ws = new WebSocket(WS_BACKEND_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            image: selectedImage,
            stack: settings.selectedStack,
            apiKey: settings.geminiApiKey || null,
            model: settings.model,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'status') {
            setStatusMessage(msg.value);
          } else if (msg.type === 'chunk') {
            setGeneratedCode((prev) => prev + msg.value);
          } else if (msg.type === 'setCode') {
            setGeneratedCode(msg.value);
          } else if (msg.type === 'error') {
            console.error('Generation error:', msg.value);
            setStatusMessage(`Error: ${msg.value}`);
            setIsGenerating(false);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message', err);
        }
      };

      ws.onclose = () => {
        setIsGenerating(false);
        setStatusMessage('Compilation complete!');
      };

      ws.onerror = (err) => {
        console.warn('WebSocket unavailable, falling back to HTTP:', err);
        fallbackHttpGeneration();
      };
    } catch (e) {
      fallbackHttpGeneration();
    }
  };

  const fallbackHttpGeneration = async () => {
    try {
      setStatusMessage('Compiling via HTTP endpoint...');
      const res = await fetch(HTTP_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          stack: settings.selectedStack,
          apiKey: settings.geminiApiKey || null,
          model: settings.model,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGeneratedCode(data.code);
      setStatusMessage('Compilation complete!');
    } catch (err: any) {
      console.error('HTTP generation failed:', err);
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={Boolean(settings.geminiApiKey)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hackathon banner badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/50 border border-brand-500/20 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
              <Award className="h-3.5 w-3.5" />
            </span>
            <span className="text-slate-200 font-medium">
              Hacktoberfest 2026 · ITM University Gwalior
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>🏆 Best Use of Gemma 4</span>
            <span className="text-slate-600">•</span>
            <span>💎 Best Open-Source AI Project</span>
          </div>
        </div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Mockup & Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-400" />
                  1. Input Mockup or Sketch
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload any design screenshot, napkin sketch, or pick a demo preset.
                </p>
              </div>

              <ImageUpload
                onImageSelected={(uri) => setSelectedImage(uri)}
                selectedImage={selectedImage}
                onClearImage={() => {
                  setSelectedImage(null);
                  setGeneratedCode('');
                }}
                isGenerating={isGenerating}
              />

              {/* Action Button */}
              <button
                disabled={!selectedImage || isGenerating}
                onClick={handleStartGeneration}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  selectedImage && !isGenerating
                    ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-brand-500/25 cursor-pointer transform hover:-translate-y-0.5'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isGenerating
                    ? 'Compiling Component...'
                    : selectedImage
                    ? 'Compile to Stack with Gemma 4'
                    : 'Select or Drop Mockup Above'}
                </span>
                {selectedImage && !isGenerating && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Right Column: Code & Preview Output */}
          <div className="lg:col-span-7">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  2. Generated Stack & Live Sandbox
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  Target: <strong className="text-slate-200">{settings.selectedStack}</strong>
                </span>
              </div>

              <CodePreview
                code={generatedCode}
                isGenerating={isGenerating}
                statusMessage={statusMessage}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;
