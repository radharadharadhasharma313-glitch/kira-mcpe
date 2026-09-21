export interface Player {
  name: string;
  xuid: string;
  ping: number;
  joinedAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'COMMAND';
  message: string;
}

export interface ServerData {
  status: 'online' | 'offline' | 'starting' | 'stopping';
  serverName: string;
  version: string;
  bedrockPort: number;
  uptimeSeconds: number;
  tps: number;
  cpuPercent: number;
  ramUsageMb: number;
  maxRamMb: number;
  playerCount: number;
  maxPlayers: number;
  players: Player[];
  gamemode: 'survival' | 'creative' | 'adventure';
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  allowCheats: boolean;
  onlineMode: boolean;
  whitelistEnabled: boolean;
  viewDistance?: number;
  tickDistance?: number;
  playerIdleTimeout?: number;
  currentWorld: {
    name: string;
    seed: string;
    sizeMb: number;
    lastSaved: string;
    dimensionCount: number;
  };
  playit: {
    claimStatus: 'waiting_claim' | 'claimed';
    claimCode: string;
    claimUrl: string;
    tunnelAddress: string;
    tunnelPort: number;
    protocol: string;
    pingMs: number;
    lastUpdated: string;
  };
  desktopUrl: string;
  railwayDomain: string;
}

export interface ServerProperties {
  serverName: string;
  gamemode: string;
  difficulty: string;
  allowCheats: boolean;
  maxPlayers: number;
  onlineMode: boolean;
  whitelistEnabled: boolean;
  viewDistance: number;
  tickDistance: number;
  playerIdleTimeout: number;
  bedrockPort: number;
}
