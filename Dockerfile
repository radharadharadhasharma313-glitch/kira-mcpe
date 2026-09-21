# ====================================================================
# Ubuntu GUI Desktop + Minecraft Bedrock (PE) Server + Playit.gg + Aternos-style Panel
# Designed for 1-Click Railway Deployment & GitHub Sync
# ====================================================================
FROM ubuntu:22.04

LABEL maintainer="Bedrock Server Panel"
LABEL description="Ubuntu Desktop GUI with noVNC, Minecraft Bedrock Server, Playit.gg, and Aternos Web Panel"

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Etc/UTC \
    DISPLAY=:1 \
    VNC_PORT=5901 \
    NOVNC_PORT=6080 \
    PORT=3000 \
    BEDROCK_PORT=19132 \
    PLAYIT_CONFIG_DIR=/root/.config/playit

WORKDIR /app

# 1. Install Base Tools, X11, Lightweight Desktop (Openbox + Tint2), noVNC, and Bedrock dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    unzip \
    tar \
    git \
    jq \
    nano \
    sudo \
    procps \
    net-tools \
    libssl3 \
    libcurl4 \
    libcap2-bin \
    libc6 \
    xvfb \
    x11vnc \
    openbox \
    tint2 \
    xterm \
    novnc \
    websockify \
    python3 \
    python3-numpy \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Node.js 20 LTS for the Control Panel
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 3. Install Playit.gg CLI Agent
RUN curl -SsL -o /usr/local/bin/playit https://github.com/playit-cloud/playit-agent/releases/download/v0.15.26/playit-linux-amd64 \
    && chmod +x /usr/local/bin/playit

# 4. Prepare Minecraft Bedrock Dedicated Server Directory
RUN mkdir -p /minecraft-bedrock /minecraft-bedrock/worlds /minecraft-bedrock/backups
WORKDIR /minecraft-bedrock

# Download official Bedrock Server for Linux
RUN (curl -H "User-Agent: Mozilla/5.0" -fsSL https://www.minecraft.net/bedrockdedicatedserver/bin-linux/bedrock-server-1.21.51.02.zip -o bedrock.zip \
    || curl -fsSL https://raw.githubusercontent.com/TheRemote/MinecraftBedrockServer/master/bedrock-server-1.21.50.07.zip -o bedrock.zip \
    || true) \
    && if [ -f bedrock.zip ]; then unzip -q bedrock.zip && rm -f bedrock.zip && chmod +x bedrock_server || true; fi

# Create default server.properties safely
RUN printf "server-name=My Bedrock Server\ngamemode=survival\ndifficulty=normal\nallow-cheats=true\nmax-players=10\nonline-mode=false\nwhite-list=false\nserver-port=19132\nserver-portv6=19133\nview-distance=32\ntick-distance=4\nplayer-idle-timeout=30\nmax-threads=8\nlevel-name=BedrockLevel\nlevel-seed=\ndefault-player-permission-level=member\ntexturepack-required=false\ncontent-log-file-enabled=true\nserver-authoritative-movement=server-auth\nplayer-movement-score-threshold=20\nserver-authoritative-block-breaking=true\n" > /minecraft-bedrock/server.properties

# 5. Build and Setup Web Control Panel
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 6. Setup startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose Web Panel ($PORT) and Bedrock UDP (19132)
EXPOSE 3000 19132/udp 6080

CMD ["/bin/bash", "/start.sh"]
