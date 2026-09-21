import React from 'react';
import { ArrowLeft, RefreshCw, Activity, Sparkles } from 'lucide-react';
import { ServerData } from '../types';

interface NavbarProps {
  serverData: ServerData | null;
  onRefresh: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  serverData,
  onRefresh,
  activeTab,
  setActiveTab
}) => {
  const status = serverData?.status || 'offline';
  const isHome = activeTab === 'dashboard' || activeTab === 'server';

  // Map subpage titles
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    console: { title: 'Live Console', subtitle: 'Bedrock log stream & commands' },
    playit: { title: 'Playit Tunnel', subtitle: 'Public Bedrock address & claim' },
    options: { title: 'Server Options', subtitle: 'Gamemode, difficulty & cheats' },
    worlds: { title: 'World Manager', subtitle: 'Upload, generate & seeds' },
    players: { title: 'Players & Permissions', subtitle: 'OPs, whitelist & bans' },
    desktop: { title: 'Ubuntu GUI Desktop', subtitle: 'noVNC web display (Port 6080)' },
    properties: { title: 'Raw Configuration', subtitle: 'Direct server.properties' },
    deploy: { title: 'Railway Deployment', subtitle: 'Cloud container setup guide' }
  };

  const currentPage = pageTitles[activeTab];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3.5 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {isHome ? (
          /* HOME DASHBOARD HEADER (UPI App Header Style) */
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              ⛏️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                  {serverData?.serverName || 'Bedrock PE Panel'}
                </h1>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  MCPE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Ubuntu GUI</span>
                <span>•</span>
                <span>Playit.gg</span>
              </p>
            </div>
          </div>
        ) : (
          /* SUBPAGE HEADER WITH BACK BUTTON TO DASHBOARD */
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-slate-800" />
              <span>Back</span>
            </button>
            <div className="border-l border-slate-200 pl-2 min-w-0">
              <h2 className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentPage?.title || 'Control Page'}
              </h2>
              <p className="text-[10px] text-slate-500 truncate">
                {currentPage?.subtitle || 'Bedrock Server Settings'}
              </p>
            </div>
          </div>
        )}

        {/* Server Status Badge & Quick Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
              status === 'online'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : status === 'starting' || status === 'stopping'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'online'
                  ? 'bg-emerald-500 animate-pulse'
                  : status === 'starting' || status === 'stopping'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span className="capitalize text-[11px]">{status}</span>
          </div>

          <button
            onClick={onRefresh}
            title="Refresh status"
            className="p-1.5 text-slate-500 hover:text-slate-700 active:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
