import React, { useState } from 'react';
import {
  Monitor,
  Maximize2,
  ExternalLink,
  Terminal,
  FolderOpen,
  Settings,
  ShieldCheck,
  RefreshCw,
  Power
} from 'lucide-react';

interface DesktopViewProps {
  desktopUrl?: string;
  isOnline: boolean;
}

export const DesktopView: React.FC<DesktopViewProps> = ({
  desktopUrl = '/desktop',
  isOnline
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [desktopReady, setDesktopReady] = useState(true);

  return (
    <div className="space-y-3.5 pb-6">
      {/* Desktop Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ubuntu GUI Desktop (noVNC)
              </h2>
              <p className="text-[11px] text-slate-500">
                Xvfb Display :1 • Openbox & Tint2 Panel
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active :1</span>
          </span>
        </div>

        {/* Desktop Screen Simulation / Viewer */}
        <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-300 bg-slate-950 aspect-video flex flex-col shadow-inner">
          {/* Virtual Desktop Window Bar */}
          <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-mono text-[10px] text-slate-400 pl-1">
                Ubuntu 22.04 LTS Desktop [Openbox/Tint2]
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFullscreen(!fullscreen)}
                title="Toggle View Mode"
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Canvas / Workspace */}
          <div className="flex-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 relative flex flex-col justify-between select-none">
            {/* Desktop Icons */}
            <div className="grid grid-cols-2 gap-3 w-40">
              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer text-center group transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-700/80 text-white flex items-center justify-center font-bold mb-1 shadow-sm">
                  ⛏️
                </div>
                <span className="text-[10px] text-slate-200 font-medium leading-tight">
                  Bedrock Server
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer text-center group transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold mb-1 border border-slate-700">
                  &gt;_
                </div>
                <span className="text-[10px] text-slate-200 font-medium leading-tight">
                  Bash Terminal
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer text-center group transition-colors">
                <div className="w-8 h-8 rounded-lg bg-sky-600/80 text-white flex items-center justify-center mb-1">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-200 font-medium leading-tight">
                  Worlds Folder
                </span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer text-center group transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-600/80 text-white flex items-center justify-center mb-1">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-200 font-medium leading-tight">
                  Properties
                </span>
              </div>
            </div>

            {/* Active Bedrock Process Banner on Desktop */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-2.5 backdrop-blur-xs max-w-xs">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Bedrock Process Running</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">
                PID: 142 • Port 19132 UDP • Memory: 412 MB
              </p>
            </div>

            {/* Bottom Tint2 Panel Simulation */}
            <div className="bg-slate-950/95 -mx-4 -mb-4 px-3 py-1 flex items-center justify-between border-t border-slate-800 text-[10px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Applications</span>
                <span>|</span>
                <span className="text-emerald-400">Desktop 1</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span>Playit: Active</span>
                <span>•</span>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for noVNC */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a
            href="http://localhost:6080/vnc.html"
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Desktop in Tab</span>
          </a>

          <button
            onClick={() => alert('VNC Password: No password required (shared session).')}
            className="bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>VNC Credentials</span>
          </button>
        </div>
      </div>

      {/* Desktop Tech Specs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
        <h3 className="font-bold text-slate-900 text-xs">
          Ubuntu GUI Desktop Architecture:
        </h3>
        <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
          <li>
            <strong>Xvfb Display :1:</strong> Virtual frame-buffer for zero-overhead GUI rendering.
          </li>
          <li>
            <strong>Openbox + Tint2:</strong> Ultra lightweight window manager tailored for low RAM usage on Railway.
          </li>
          <li>
            <strong>noVNC (Port 6080):</strong> HTML5 web-based VNC client for browser access without installing VNC software.
          </li>
          <li>
            <strong>Minecraft BDS:</strong> Bedrock Dedicated Server daemon running alongside in Docker container.
          </li>
        </ul>
      </div>
    </div>
  );
};
