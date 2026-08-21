'use client';

import React from 'react';
import { Activity, Stethoscope, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string | null;
}

export function LoadingOverlay({ isVisible, message }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 animate-in fade-in"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-slate-800/60 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl max-w-sm w-full mx-4 space-y-5 text-center">
        
        {/* Glowing Animated Custom Blue Medical Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 opacity-30 blur-xl animate-pulse" />
          
          {/* Outer spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-blue-600 border-b-cyan-400 animate-spin duration-1000" />
          
          {/* Inner pulse ring */}
          <div className="absolute inset-2 rounded-full border border-cyan-400/30 dark:border-cyan-500/20 animate-ping opacity-40" />

          {/* Central Blue Gradient Icon Box */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-transform duration-300">
            <Activity className="w-8 h-8 animate-pulse text-cyan-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>

          {/* Floating sparkle dot */}
          <div className="absolute -top-1 -right-1 p-1 bg-cyan-400 text-slate-950 rounded-full shadow-md shadow-cyan-400/50 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700 dark:from-white dark:via-slate-100 dark:to-cyan-400 bg-clip-text text-transparent">
            {message || 'جاري التحميل...'}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            يرجى الانتظار لحظات...
          </p>
        </div>

        {/* Bottom Progress Bar Glow */}
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite] w-full" />
        </div>
      </div>
    </div>
  );
}
