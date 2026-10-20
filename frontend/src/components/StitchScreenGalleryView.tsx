import React, { useState } from 'react';
import { STITCH_PROJECT_METADATA, STITCH_SCREENS } from '../data/lifepathData';
import { StitchScreenInfo, ActiveTab } from '../types/lifepath';

interface StitchScreenGalleryViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const StitchScreenGalleryView: React.FC<StitchScreenGalleryViewProps> = ({
  onNavigateTab,
}) => {
  const [selectedScreen, setSelectedScreen] = useState<StitchScreenInfo | null>(null);
  const [htmlPreviewScreen, setHtmlPreviewScreen] = useState<StitchScreenInfo | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Google Stitch Design System
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            {STITCH_PROJECT_METADATA.title}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Downloaded high-resolution Stitch screenshots, generated HTML source code, and live
            interactive implementations for Project ID{' '}
            <strong className="text-on-surface font-mono">{STITCH_PROJECT_METADATA.id}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs flex flex-col gap-1.5 border border-outline-variant/30">
            <div className="flex items-center justify-between gap-3 font-semibold text-on-surface">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">folder</span>
                <span>Project ID:</span>
              </span>
              <button
                onClick={() =>
                  handleCopy(STITCH_PROJECT_METADATA.id, `proj-${STITCH_PROJECT_METADATA.id}`)
                }
                className="font-mono text-primary hover:underline"
              >
                {copiedId === `proj-${STITCH_PROJECT_METADATA.id}`
                  ? 'Copied!'
                  : STITCH_PROJECT_METADATA.id}
              </button>
            </div>
            <span className="text-on-surface-variant font-mono">
              Palette: Electric Violet (#532cd8) • Emerald (#006c4e)
            </span>
          </div>
        </div>
      </div>

      {/* Screen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STITCH_SCREENS.map((screen) => {
          return (
            <div
              key={screen.id}
              className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all group"
            >
              <div>
                {/* Screenshot Preview Image */}
                <div
                  onClick={() => setSelectedScreen(screen)}
                  className="relative w-full h-72 bg-surface-container-low cursor-pointer overflow-hidden border-b border-outline-variant/30 group-hover:opacity-95 transition-opacity"
                >
                  <img
                    src={screen.screenshotFile}
                    alt={screen.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = screen.screenshotHostedUrl;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">zoom_in</span>
                      <span>Click to inspect high-resolution Stitch screenshot</span>
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm font-bold shadow-sm">
                    Screen #{screen.number}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      {screen.title}
                    </h3>
                  </div>

                  <p className="font-body-sm text-sm text-on-surface-variant line-clamp-2">
                    {screen.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-surface-container-low font-mono text-xs text-on-surface-variant flex items-center justify-between border border-outline-variant/20">
                    <span className="truncate max-w-[240px]">ID: {screen.id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(screen.id, `id-${screen.id}`)}
                      className="text-primary hover:underline font-bold text-xs shrink-0"
                    >
                      {copiedId === `id-${screen.id}` ? 'Copied!' : 'Copy ID'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-2 border-t border-outline-variant/20 mt-2">
                <button
                  type="button"
                  onClick={() => onNavigateTab(screen.routeTab)}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-primary text-on-primary hover:bg-primary-container font-headline-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Launch Live Interactive View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHtmlPreviewScreen(screen)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">code</span>
                  <span>View HTML</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screenshot Modal */}
      {selectedScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-surface-container-lowest rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-outline-variant/30">
            <div className="p-4 px-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  {selectedScreen.title} — High-Res Stitch Screenshot
                </h3>
                <span className="font-label-sm text-xs text-on-surface-variant font-mono">
                  ID: {selectedScreen.id} ({selectedScreen.deviceType})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedScreen.screenshotHostedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>Hosted URL</span>
                </a>
                <button
                  onClick={() => setSelectedScreen(null)}
                  className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-surface-container-low/40 flex justify-center">
              <img
                src={selectedScreen.screenshotFile}
                alt={selectedScreen.title}
                className="max-w-full h-auto rounded-xl shadow-lg border border-outline-variant/30"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = selectedScreen.screenshotHostedUrl;
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* HTML Source / Live Frame Modal */}
      {htmlPreviewScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-surface-container-lowest rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-outline-variant/30">
            <div className="p-4 px-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  {htmlPreviewScreen.title} — Stitch Generated HTML Preview
                </h3>
                <span className="font-label-sm text-xs text-on-surface-variant font-mono">
                  File: {htmlPreviewScreen.htmlFile}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={htmlPreviewScreen.htmlHostedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Hosted HTML Download</span>
                </a>
                <button
                  onClick={() => setHtmlPreviewScreen(null)}
                  className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>

            <div className="flex-1 w-full h-full bg-white">
              <iframe
                title="Stitch HTML Preview"
                src={htmlPreviewScreen.htmlFile}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
