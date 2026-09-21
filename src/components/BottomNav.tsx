import React from 'react';
import { LayoutGrid, Terminal, Radio, Sliders } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  playitClaimStatus?: 'waiting_claim' | 'claimed';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  playitClaimStatus
}) => {
  const isHome = activeTab === 'dashboard' || activeTab === 'server';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'console', label: 'Console', icon: Terminal },
    {
      id: 'playit',
      label: 'Tunnel',
      icon: Radio,
      badge: playitClaimStatus === 'waiting_claim' ? 'Claim' : null
    },
    { id: 'options', label: 'Options', icon: Sliders }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-4 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'dashboard' ? isHome : activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>

              {item.badge && (
                <span className="absolute top-0.5 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
