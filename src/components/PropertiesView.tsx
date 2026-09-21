import React, { useState, useEffect } from 'react';
import { FileCode, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { ServerData } from '../types';

interface PropertiesViewProps {
  serverData: ServerData | null;
  onSaveProperties: (props: any) => Promise<void>;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  serverData,
  onSaveProperties
}) => {
  const [config, setConfig] = useState({
    serverName: serverData?.serverName || 'My Bedrock Server',
    bedrockPort: serverData?.bedrockPort || 19132,
    gamemode: serverData?.gamemode || 'survival',
    difficulty: serverData?.difficulty || 'normal',
    maxPlayers: serverData?.maxPlayers || 10,
    onlineMode: serverData?.onlineMode ?? false,
    allowCheats: serverData?.allowCheats ?? true,
    whitelistEnabled: serverData?.whitelistEnabled ?? false,
    viewDistance: serverData?.viewDistance || 32,
    tickDistance: serverData?.tickDistance || 4,
    playerIdleTimeout: serverData?.playerIdleTimeout || 30
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (serverData) {
      setConfig({
        serverName: serverData.serverName,
        bedrockPort: serverData.bedrockPort,
        gamemode: serverData.gamemode,
        difficulty: serverData.difficulty,
        maxPlayers: serverData.maxPlayers,
        onlineMode: serverData.onlineMode,
        allowCheats: serverData.allowCheats,
        whitelistEnabled: serverData.whitelistEnabled,
        viewDistance: serverData.viewDistance || 32,
        tickDistance: serverData.tickDistance || 4,
        playerIdleTimeout: serverData.playerIdleTimeout || 30
      });
    }
  }, [serverData]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveProperties(config);
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              server.properties Direct Config
            </h3>
            <p className="text-xs text-slate-500">
              Directly modifies and persists settings to the server configuration file.
            </p>
          </div>
        </div>

        {savedToast && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Settings saved and written to server.properties!</span>
          </div>
        )}
      </div>

      {/* Properties Table & Editor */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            server-name
          </label>
          <input
            type="text"
            value={config.serverName}
            onChange={(e) => setConfig({ ...config, serverName: e.target.value })}
            className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              gamemode
            </label>
            <select
              value={config.gamemode}
              onChange={(e) => setConfig({ ...config, gamemode: e.target.value as any })}
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="survival">survival</option>
              <option value="creative">creative</option>
              <option value="adventure">adventure</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              difficulty
            </label>
            <select
              value={config.difficulty}
              onChange={(e) => setConfig({ ...config, difficulty: e.target.value as any })}
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="peaceful">peaceful</option>
              <option value="easy">easy</option>
              <option value="normal">normal</option>
              <option value="hard">hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              server-port (IPv4 UDP)
            </label>
            <input
              type="number"
              value={config.bedrockPort}
              onChange={(e) =>
                setConfig({ ...config, bedrockPort: parseInt(e.target.value, 10) || 19132 })
              }
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              max-players
            </label>
            <input
              type="number"
              value={config.maxPlayers}
              onChange={(e) =>
                setConfig({ ...config, maxPlayers: parseInt(e.target.value, 10) || 10 })
              }
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">online-mode</p>
              <p className="text-[11px] text-slate-500">
                Disabled allows cracked and offline Bedrock clients.
              </p>
            </div>
            <input
              type="checkbox"
              checked={config.onlineMode}
              onChange={(e) => setConfig({ ...config, onlineMode: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">allow-cheats</p>
              <p className="text-[11px] text-slate-500">Enables in-game commands like /gamemode.</p>
            </div>
            <input
              type="checkbox"
              checked={config.allowCheats}
              onChange={(e) => setConfig({ ...config, allowCheats: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">white-list</p>
              <p className="text-[11px] text-slate-500">Only listed players can join.</p>
            </div>
            <input
              type="checkbox"
              checked={config.whitelistEnabled}
              onChange={(e) => setConfig({ ...config, whitelistEnabled: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Writing to Disk...' : 'Save server.properties'}</span>
        </button>
      </div>
    </div>
  );
};
