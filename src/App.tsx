import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardGrid } from './components/DashboardGrid';
import { BottomNav } from './components/BottomNav';
import { ConsoleView } from './components/ConsoleView';
import { PlayitTunnelView } from './components/PlayitTunnelView';
import { WorldsView } from './components/WorldsView';
import { OptionsView } from './components/OptionsView';
import { PlayersView } from './components/PlayersView';
import { DesktopView } from './components/DesktopView';
import { RailwayDeployView } from './components/RailwayDeployView';
import { PropertiesView } from './components/PropertiesView';
import { ServerData, LogEntry } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch status and logs from real backend
  const fetchStatus = useCallback(async () => {
    try {
      const [resStatus, resLogs] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/logs')
      ]);

      if (resStatus.ok) {
        const data = await resStatus.json();
        setServerData(data);
        setFetchError(null);
      }

      if (resLogs.ok) {
        const dataLogs = await resLogs.json();
        setLogs(dataLogs.logs || []);
      }
    } catch (err: any) {
      console.warn('Could not fetch server status:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Server Actions (Start, Stop, Restart, Kill)
  const handleServerAction = async (action: 'start' | 'stop' | 'restart' | 'kill') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/server/${action}`, { method: 'POST' });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error(`Failed to ${action} server:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Console Command
  const handleSendCommand = async (command: string) => {
    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to send command:', err);
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    try {
      const res = await fetch('/api/logs/clear', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  // Playit Claim Done
  const handleDoneClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/playit/claim/done', { method: 'POST' });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to confirm claim:', err);
    } finally {
      setLoading(false);
    }
  };

  // Playit Claim Change (Re-generate fresh token)
  const handleChangeClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/playit/claim/change', { method: 'POST' });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to change claim link:', err);
    } finally {
      setLoading(false);
    }
  };

  // World Actions
  const handleGenerateWorld = async (params: any) => {
    try {
      const res = await fetch('/api/worlds/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to generate world:', err);
    }
  };

  const handleUploadWorld = async (filename: string) => {
    try {
      const res = await fetch('/api/worlds/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to upload world:', err);
    }
  };

  const handleResetWorld = async () => {
    try {
      const res = await fetch('/api/worlds/reset', { method: 'POST' });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to reset world:', err);
    }
  };

  // Server Properties Save
  const handleSaveProperties = async (props: any) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props)
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed to save properties:', err);
    }
  };

  // Player Action
  const handlePlayerAction = async (
    type: 'operator' | 'whitelist' | 'ban',
    action: 'add' | 'remove',
    player: string
  ) => {
    try {
      const res = await fetch('/api/players/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action, player })
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Failed player action:', err);
    }
  };

  const isHome = activeTab === 'dashboard' || activeTab === 'server';

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-slate-900 font-sans antialiased selection:bg-emerald-200">
      {/* Mobile-Constrained UPI App Layout */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen flex flex-col border-x border-slate-200/80 shadow-md pb-16 relative">
        {/* Sticky Header with UPI-Style Back Button when in subpage */}
        <Navbar
          serverData={serverData}
          onRefresh={fetchStatus}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab / Page Content Body */}
        <main className="flex-1 p-3.5">
          {fetchError && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Syncing with server process...</span>
              </div>
              <button
                onClick={fetchStatus}
                className="p-1 hover:bg-amber-100 rounded text-amber-900"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 1. UPI-STYLE 2-COLUMN GRIDVIEW DASHBOARD (MAIN VIEW) */}
          {isHome && (
            <DashboardGrid
              serverData={serverData}
              logs={logs}
              onNavigate={(tabId) => setActiveTab(tabId)}
              onServerAction={handleServerAction}
              loading={loading}
            />
          )}

          {/* 2. DEDICATED SUBPAGES (OPENED UPON TAPPING CORRESPONDING SQUARE BOX) */}
          {activeTab === 'console' && (
            <ConsoleView
              logs={logs}
              onSendCommand={handleSendCommand}
              onClearLogs={handleClearLogs}
              isOnline={serverData?.status === 'online'}
            />
          )}

          {activeTab === 'playit' && (
            <PlayitTunnelView
              serverData={serverData}
              onDoneClaim={handleDoneClaim}
              onChangeClaim={handleChangeClaim}
              loading={loading}
            />
          )}

          {activeTab === 'options' && (
            <OptionsView
              serverData={serverData}
              onSaveProperties={handleSaveProperties}
            />
          )}

          {activeTab === 'worlds' && (
            <WorldsView
              serverData={serverData}
              onGenerateWorld={handleGenerateWorld}
              onUploadWorld={handleUploadWorld}
              onResetWorld={handleResetWorld}
            />
          )}

          {activeTab === 'players' && (
            <PlayersView onPlayerAction={handlePlayerAction} />
          )}

          {activeTab === 'desktop' && (
            <DesktopView
              desktopUrl={serverData?.desktopUrl}
              isOnline={serverData?.status === 'online'}
            />
          )}

          {activeTab === 'properties' && (
            <PropertiesView
              serverData={serverData}
              onSaveProperties={handleSaveProperties}
            />
          )}

          {activeTab === 'deploy' && <RailwayDeployView />}
        </main>

        {/* Persistent UPI-style Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          playitClaimStatus={serverData?.playit?.claimStatus}
        />
      </div>
    </div>
  );
}
