import React, { useState } from 'react';
import {
  Terminal,
  Radio,
  Sliders,
  Globe,
  Users,
  Monitor,
  Rocket,
  FileCode,
  Play,
  Square,
  RotateCw,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  HardDrive,
  Activity,
  ChevronRight
} from 'lucide-react';
import { ServerData, LogEntry } from '../types';

interface DashboardGridProps {
  serverData: ServerData | null;
  logs: LogEntry[];
  onNavigate: (tabId: string) => void;
  onServerAction: (action: 'start' | 'stop' | 'restart' | 'kill') => void;
  loading: boolean;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  serverData,
  logs,
  onNavigate,
  onServerAction,
  loading
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!serverData) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Connecting to Bedrock Server Engine...
      </div>
    );
  }

  const isOnline = serverData.status === 'online';
  const isStarting = serverData.status === 'starting';
  const isStopping = serverData.status === 'stopping';

  const connectionAddress =
    serverData.playit.claimStatus === 'claimed'
      ? `${serverData.playit.tunnelAddress}:${serverData.playit.tunnelPort}`
      : `0.0.0.0:${serverData.bedrockPort}`;

  const copyConnection = () => {
    navigator.clipboard.writeText(connectionAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  // 8 UPI-Style Square Action Tiles
  const actionTiles = [
    {
      id: 'console',
      title: 'Live Console',
      subtitle: `${logs.length} logs · Send commands`,
      badge: isOnline ? 'Active' : 'Offline',
      badgeColor: isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600',
      icon: Terminal,
      iconBg: 'bg-indigo-600',
      iconColor: 'text-white'
    },
    {
      id: 'playit',
      title: 'Playit Tunnel',
      subtitle:
        serverData.playit.claimStatus === 'claimed'
          ? 'Connected & Public'
          : 'Claim link ready',
      badge:
        serverData.playit.claimStatus === 'claimed' ? 'Claimed' : 'Action Required',
      badgeColor:
        serverData.playit.claimStatus === 'claimed'
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-amber-100 text-amber-800 animate-pulse',
      icon: Radio,
      iconBg: 'bg-emerald-600',
      iconColor: 'text-white'
    },
    {
      id: 'options',
      title: 'Server Options',
      subtitle: `${serverData.gamemode} · ${serverData.difficulty}`,
      badge: serverData.allowCheats ? 'Cheats ON' : 'Vanilla',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Sliders,
      iconBg: 'bg-amber-500',
      iconColor: 'text-white'
    },
    {
      id: 'worlds',
      title: 'World Manager',
      subtitle: `${serverData.currentWorld.name} · ${serverData.currentWorld.sizeMb || 0} MB`,
      badge: 'Seed & Upload',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: Globe,
      iconBg: 'bg-sky-600',
      iconColor: 'text-white'
    },
    {
      id: 'players',
      title: 'Players & OP',
      subtitle: `${serverData.playerCount}/${serverData.maxPlayers} online`,
      badge: 'Whitelist & Bans',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: Users,
      iconBg: 'bg-purple-600',
      iconColor: 'text-white'
    },
    {
      id: 'desktop',
      title: 'Ubuntu GUI',
      subtitle: 'noVNC Linux display',
      badge: 'Port 6080',
      badgeColor: 'bg-rose-100 text-rose-800',
      icon: Monitor,
      iconBg: 'bg-rose-600',
      iconColor: 'text-white'
    },
    {
      id: 'properties',
      title: 'Raw Config',
      subtitle: 'server.properties editor',
      badge: 'Disk Sync',
      badgeColor: 'bg-teal-100 text-teal-800',
      icon: FileCode,
      iconBg: 'bg-teal-600',
      iconColor: 'text-white'
    },
    {
      id: 'deploy',
      title: 'Railway Deploy',
      subtitle: '1-click deploy to cloud',
      badge: 'Production',
      badgeColor: 'bg-slate-100 text-slate-800',
      icon: Rocket,
      iconBg: 'bg-slate-800',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* 1. UPI-STYLE HERO BALANCE CARD (Server Status & Primary Action) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        {/* Top Header Row of Hero Card */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Minecraft Bedrock Server
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {serverData.serverName}
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                PE Bedrock
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isStarting || isStopping
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline
                  ? 'bg-emerald-500 animate-pulse'
                  : isStarting || isStopping
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span className="capitalize text-[11px]">{serverData.status}</span>
          </div>
        </div>

        {/* IP Address & Port Chip (Like UPI ID) */}
        <div className="mt-3.5 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              Bedrock Server Address (IP:Port)
            </p>
            <p className="text-xs font-mono font-bold text-slate-800 truncate mt-0.5">
              {connectionAddress}
            </p>
          </div>
          <button
            onClick={copyConnection}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
          >
            {copiedAddress ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Primary Start / Stop Controls (Big UPI Button Style) */}
        <div className="mt-3.5 flex items-center gap-2">
          {!isOnline && !isStarting ? (
            <button
              onClick={() => onServerAction('start')}
              disabled={loading || isStopping}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all text-sm disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'Starting...' : 'Start Bedrock Server'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onServerAction('stop')}
                disabled={loading || isStopping}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all text-sm disabled:opacity-50"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{isStopping ? 'Stopping...' : 'Stop Server'}</span>
              </button>

              <button
                onClick={() => onServerAction('restart')}
                disabled={loading || isStopping}
                title="Restart Server"
                className="p-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl font-bold transition-all"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Real Resource Usage Indicators (RAM & CPU) */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <HardDrive className="w-3 h-3 text-slate-400" />
                RAM Memory
              </span>
              <span className="font-semibold text-slate-700">
                {serverData.ramUsageMb} / {serverData.maxRamMb} MB
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    (serverData.ramUsageMb / serverData.maxRamMb) * 100
                  )}%`
                }}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Cpu className="w-3 h-3 text-slate-400" />
                CPU & TPS
              </span>
              <span className="font-semibold text-slate-700">
                {serverData.cpuPercent}% · {isOnline ? '20 TPS' : '0 TPS'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, serverData.cpuPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playit Claim Notice Banner if waiting for claim */}
      {serverData.playit.claimStatus === 'waiting_claim' && (
        <div
          onClick={() => onNavigate('playit')}
          className="bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer shadow-xs transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Playit Tunnel Claim Link Ready
              </h4>
              <p className="text-[11px] text-amber-800">
                Tap here to claim tunnel & connect players worldwide
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-600 shrink-0" />
        </div>
      )}

      {/* 2. THE 2-COLUMN SQUARE GRIDVIEW DASHBOARD (UPI APP STYLE) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Server Services & Controls
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">
            8 Features
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actionTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                onClick={() => onNavigate(tile.id)}
                className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs hover:border-emerald-300 hover:shadow-sm active:scale-[0.97] transition-all flex flex-col justify-between text-left h-36 relative overflow-hidden group"
              >
                {/* Top Row: Icon Container + Mini Status Pill */}
                <div className="flex items-start justify-between w-full">
                  <div
                    className={`w-10 h-10 rounded-xl ${tile.iconBg} ${tile.iconColor} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${tile.badgeColor} max-w-[80px] truncate`}
                  >
                    {tile.badge}
                  </span>
                </div>

                {/* Bottom Row: Title + Subtitle + Subtle Chevron */}
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {tile.title}
                    </h4>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {tile.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Server Info Footer */}
      <div className="bg-slate-100/80 rounded-xl p-3 text-[11px] text-slate-500 flex items-center justify-between border border-slate-200/60">
        <span>Engine: {serverData.version}</span>
        <span className="font-mono">Bedrock UDP 19132</span>
      </div>
    </div>
  );
};
