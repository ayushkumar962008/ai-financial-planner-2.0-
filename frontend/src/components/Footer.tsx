import React from 'react';
import { ActiveTab } from '../types/lifepath';
import { STITCH_PROJECT_METADATA } from '../data/lifepathData';

interface FooterProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-8 mt-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img
              alt="Lumo Brand"
              className="h-6 w-auto object-contain"
              src="/lumo-logo.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://lh3.googleusercontent.com/aida/AEtjO1WXbE-S-wugxw1daMgV8vD3jTdSznBdILuFIwlgV8CkaRqQG1jq_gYbj3VBy_hFvMrgV1pg90_oRn_HYmH9Sp8B1xXpWQHXFVwe12vtBsaud1UFqvEGNDrKNikHQUy9FlEyFTlOz0X4kZYcnbkjVwd6UWzhGjBkp8vvOAH_cgIbQaHmW6IJWIuxbpZc7e4INCJrThnKM6CEubVm9HSmt_xFwCuOFePB2nXwbIEKoSGViI3LA3jArnX0tQ';
              }}
            />
            <span className="font-headline-sm text-sm font-bold text-on-surface">
              Lumo AI Financial Planner
            </span>
          </div>
          <span className="hidden sm:inline text-on-surface-variant text-xs">—</span>
          <span className="font-body-sm text-xs text-on-surface-variant">
            Autonomous Multi-Decadal Wealth Architecture
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('goals')}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Goals Manager
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('simulator')}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Monte Carlo Engine
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('roadmap')}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Roadmap 2025–2052
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('advisor')}
            className="text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Lumo AI</span>
          </button>
        </div>

        <div className="text-[11px] text-on-surface-variant text-center md:text-right">
          © 2026 Lumo Financial Intelligence. Autonomous wealth velocity.
        </div>
      </div>
    </footer>
  );
};
