import React, { useState } from 'react';
import {
  Globe,
  Upload,
  Download,
  RotateCcw,
  PlusCircle,
  HardDrive,
  Calendar,
  CheckCircle2,
  FileArchive,
  Layers
} from 'lucide-react';
import { ServerData } from '../types';

interface WorldsViewProps {
  serverData: ServerData | null;
  onGenerateWorld: (params: {
    name: string;
    seed: string;
    gamemode: string;
    difficulty: string;
  }) => Promise<void>;
  onUploadWorld: (filename: string) => Promise<void>;
  onResetWorld: () => Promise<void>;
}

export const WorldsView: React.FC<WorldsViewProps> = ({
  serverData,
  onGenerateWorld,
  onUploadWorld,
  onResetWorld
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSeed, setNewSeed] = useState('');
  const [newGamemode, setNewGamemode] = useState('survival');
  const [newDifficulty, setNewDifficulty] = useState('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!serverData) return null;
  const world = serverData.currentWorld;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onGenerateWorld({
      name: newName || 'BedrockWorld_' + Math.floor(Math.random() * 900 + 100),
      seed: newSeed,
      gamemode: newGamemode,
      difficulty: newDifficulty
    });
    setIsSubmitting(false);
    setShowGenerateModal(false);
    setSuccessToast('New world generated and loaded into Bedrock server!');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSubmitting(true);
    await onUploadWorld(file.name);
    setIsSubmitting(false);
    setSuccessToast(`World "${file.name}" uploaded and set as active!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleReset = async () => {
    if (
      confirm(
        'Are you sure you want to reset this world? Current chunks and builds will be cleared and replaced with a fresh seed.'
      )
    ) {
      setIsSubmitting(true);
      await onResetWorld();
      setIsSubmitting(false);
      setSuccessToast('World reset to fresh Bedrock seed!');
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const handleBackupDownload = () => {
    setSuccessToast(`Backup of "${world.name}.zip" downloaded!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-3.5 pb-6">
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Active World Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {world.name}
              </h2>
              <span className="text-[11px] text-slate-500">Active Bedrock Level</span>
            </div>
          </div>

          <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
            Loaded
          </span>
        </div>

        {/* World Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">World Seed:</span>
            <span className="font-mono font-semibold text-slate-800 text-[11px] break-all">
              {world.seed || 'Random'}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Disk Size:</span>
            <span className="font-semibold text-slate-800 text-[11px]">
              {world.sizeMb} MB
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Last Saved:</span>
            <span className="font-semibold text-slate-800 text-[11px]">
              {world.lastSaved}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Dimensions:</span>
            <span className="font-semibold text-slate-800 text-[11px]">
              Overworld, Nether, End
            </span>
          </div>
        </div>

        {/* Primary World Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          {/* Upload World */}
          <label className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload (.mcworld)</span>
            <input
              type="file"
              accept=".zip,.mcworld"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>

          {/* Backup / Download */}
          <button
            onClick={handleBackupDownload}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download World</span>
          </button>

          {/* Generate New */}
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>

          {/* Reset World */}
          <button
            onClick={handleReset}
            disabled={isSubmitting}
            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset World</span>
          </button>
        </div>
      </div>

      {/* Generate New World Form / Modal */}
      {showGenerateModal && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">
              Generate New Minecraft World
            </h3>
            <button
              onClick={() => setShowGenerateModal(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-2.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                World Name
              </label>
              <input
                type="text"
                placeholder="e.g. MySurvivalWorld"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Seed (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank for random seed"
                value={newSeed}
                onChange={(e) => setNewSeed(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Gamemode
                </label>
                <select
                  value={newGamemode}
                  onChange={(e) => setNewGamemode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-600 capitalize"
                >
                  <option value="survival">Survival</option>
                  <option value="creative">Creative</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-600 capitalize"
                >
                  <option value="peaceful">Peaceful</option>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Generating...' : 'Create & Apply World'}
            </button>
          </form>
        </div>
      )}

      {/* World Backups List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <FileArchive className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-900">
              World Backups
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Automatic daily sync</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="font-semibold text-slate-800 block">
                {world.name}_backup_today.zip
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Today, 2 hours ago • {world.sizeMb} MB
              </span>
            </div>
            <button
              onClick={handleBackupDownload}
              className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
