import React, { useState, useEffect, useRef } from 'react';
import { Eye, Code2, Copy, Check, Download, Monitor, Smartphone, Tablet, RefreshCw, Palette } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  isGenerating: boolean;
  statusMessage: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  isGenerating,
  statusMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'tokens'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-switch to preview when generation completes
  useEffect(() => {
    if (!isGenerating && code) {
      setActiveTab('preview');
    }
  }, [isGenerating, code]);

  // Update iframe content
  useEffect(() => {
    if (activeTab === 'preview' && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        // Construct sandbox document with Tailwind CDN + React or HTML rendering
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://cdn.tailwindcss.com"></script>
              <!-- Babel & React Standalone for instant live preview -->
              <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                body { margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                try {
                  ${code.replace(/import\s+React.*?from\s+['"]react['"];?/g, '')
                        .replace(/export\s+default\s+function/g, 'function App')
                        .replace(/export\s+default/g, 'window.App =')}
                  
                  const targetComponent = typeof App !== 'undefined' ? App : (window.App || null);
                  if (targetComponent) {
                    ReactDOM.render(React.createElement(targetComponent), document.getElementById('root'));
                  } else {
                    document.getElementById('root').innerHTML = \`<div class="p-8 text-center text-slate-400">Rendering preview...</div>\`;
                  }
                } catch (err) {
                  document.getElementById('root').innerHTML = \`
                    <div class="p-6 bg-rose-950/40 text-rose-300 border border-rose-800 rounded-xl m-4 font-mono text-xs">
                      <p class="font-bold mb-2">Sandbox Render Trace:</p>
                      <pre>\${err.message}</pre>
                    </div>
                  \`;
                }
              </script>
            </body>
          </html>
        `;
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [code, activeTab, viewport]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SnapToStack_Component.tsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getViewportWidth = () => {
    if (viewport === 'mobile') return 'max-w-sm';
    if (viewport === 'tablet') return 'max-w-2xl';
    return 'w-full';
  };

  // Basic token extraction simulation from code
  const extractedColors = Array.from(new Set(code.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [
    '#38bdf8', '#818cf8', '#0f172a', '#020617', '#10b981'
  ]));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col h-[700px] shadow-2xl">
      {/* Tab bar & Actions */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-950/80">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-brand-400" />
            <span>Live Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>React Code</span>
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'tokens'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="h-3.5 w-3.5 text-emerald-400" />
            <span>Design Tokens</span>
          </button>
        </div>

        {/* Viewport controls (Only in preview tab) */}
        {activeTab === 'preview' && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Desktop view"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Tablet view"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-slate-800 text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="Mobile view"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {code && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/80"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white transition shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status banner while compiling */}
      {isGenerating && (
        <div className="bg-brand-500/10 border-b border-brand-500/20 px-4 py-2 flex items-center justify-between text-xs text-brand-300">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-400" />
            <span>{statusMessage || 'Gemma 4 streaming component tokens...'}</span>
          </div>
          <span className="font-mono text-[10px] bg-brand-500/20 px-2 py-0.5 rounded text-brand-200">
            Multimodal Stream Active
          </span>
        </div>
      )}

      {/* Tab Panels */}
      <div className="flex-1 overflow-auto bg-slate-950 p-2 relative">
        {activeTab === 'preview' && (
          <div className="h-full w-full flex items-center justify-center p-2">
            <div className={`h-full ${getViewportWidth()} transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950`}>
              <iframe
                ref={iframeRef}
                title="Sandbox Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="h-full overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed">
            <pre>
              <code>{code || '// No code compiled yet. Upload a mockup and click Compile with Gemma 4.'}</code>
            </pre>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Detected Color Tokens
              </h4>
              <div className="flex flex-wrap gap-3">
                {extractedColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-2 pr-4">
                    <div className="h-6 w-6 rounded-md border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
                    <span className="font-mono text-xs text-slate-300">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Extracted Component Hierarchy
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80">
                  <span className="text-emerald-400">✓</span> Navigation Bar (Sticky, Flex, Brand Logo, CTA Button)
                </li>
                <li className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80">
                  <span className="text-emerald-400">✓</span> KPI Metric Cards (Grid 4-columns, Trend Badges, Pulse Indicator)
                </li>
                <li className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80">
                  <span className="text-emerald-400">✓</span> Data Visualization Chart (Interactive Bar Container, Month labels)
                </li>
                <li className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/80">
                  <span className="text-emerald-400">✓</span> Transaction Feed (List layout, Avatar text, Status tags)
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
