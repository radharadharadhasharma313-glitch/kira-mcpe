#!/usr/bin/env bash

echo "=========================================================="
echo "🚀 Starting Bedrock Server Panel + Ubuntu XFCE4 GUI + Playit (Ultra-Lightweight)"
echo "=========================================================="

# Export critical environment variables for TigerVNC and Node Production
export NODE_ENV=production
export USER=root
export HOME=/root
export DISPLAY="${DISPLAY:-:1}"
export PORT="${PORT:-3000}"
export NOVNC_PORT="${NOVNC_PORT:-6080}"

mkdir -p /minecraft-bedrock/worlds /minecraft-bedrock/backups /root/.config/playit /app/data /tmp/.X11-unix /root/.vnc
chmod 1777 /tmp/.X11-unix
touch /root/.Xauthority

# Setup Lightweight VNC xstartup for XFCE4 Desktop (compositing disabled to save RAM)
cat << 'EOF' > /root/.vnc/xstartup
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey
xfconf-query -c xfwm4 -p /general/use_compositing -s false 2>/dev/null || true
vncconfig -iconic &
startxfce4 &
EOF
chmod +x /root/.vnc/xstartup

# 1. Start TigerVNC Server (1024x768, 16-bit depth saves 60% RAM vs 24/32-bit)
echo "[GUI] Starting TigerVNC server on ${DISPLAY} (1024x768, depth 16)..."
vncserver -kill "${DISPLAY}" >/dev/null 2>&1 || true
vncserver "${DISPLAY}" -localhost no -SecurityTypes None -geometry 1024x768 -depth 16 --I-KNOW-THIS-IS-INSECURE || echo "[WARN] TigerVNC started"

# 2. Generate SSL certificate for websockify HTTPS support (takahashi-akari template)
if [ ! -f /self.pem ]; then
  echo "[GUI] Generating SSL certificate for noVNC websockify..."
  openssl req -new -subj "/C=US/ST=State/L=City/O=Bedrock/CN=localhost" -x509 -days 365 -nodes -out /self.pem -keyout /self.pem >/dev/null 2>&1 || true
fi

# 3. Start noVNC Websockify Bridge (Port 6080)
echo "[GUI] Starting noVNC on port ${NOVNC_PORT}..."
if [ -f /self.pem ]; then
  websockify -D --web=/usr/share/novnc/ --cert=/self.pem "${NOVNC_PORT}" localhost:5901 || websockify -D --web=/usr/share/novnc/ "${NOVNC_PORT}" localhost:5901 || true
else
  websockify -D --web=/usr/share/novnc/ "${NOVNC_PORT}" localhost:5901 || true
fi

# 4. Initialize Playit.gg tunnel agent in background
echo "[TUNNEL] Initializing Playit.gg CLI..."
if [ ! -f /root/.config/playit/playit.toml ]; then
  echo "[TUNNEL] Starting playit agent to generate claim token..."
  playit --secret_path /root/.config/playit/playit.toml > /app/data/playit.log 2>&1 &
else
  echo "[TUNNEL] Existing playit configuration found. Connecting..."
  playit --secret_path /root/.config/playit/playit.toml >> /app/data/playit.log 2>&1 &
fi

# 5. Tune Bedrock server.properties to lightweight profile (prevents Railway OOM)
if [ -f /minecraft-bedrock/server.properties ]; then
  sed -i 's/view-distance=.*/view-distance=10/' /minecraft-bedrock/server.properties
  sed -i 's/max-threads=.*/max-threads=2/' /minecraft-bedrock/server.properties
  sed -i 's/max-players=.*/max-players=8/' /minecraft-bedrock/server.properties
  sed -i 's/player-idle-timeout=.*/player-idle-timeout=15/' /minecraft-bedrock/server.properties
fi

# 6. Ensure Bedrock Linux binary is downloaded if missing
if [ ! -f /minecraft-bedrock/bedrock_server ]; then
  echo "[BEDROCK] Downloading official Bedrock Dedicated Server..."
  cd /minecraft-bedrock
  curl -H "User-Agent: Mozilla/5.0" -fsSL https://www.minecraft.net/bedrockdedicatedserver/bin-linux/bedrock-server-1.21.51.02.zip -o bedrock.zip \
    || curl -fsSL https://raw.githubusercontent.com/TheRemote/MinecraftBedrockServer/master/bedrock-server-1.21.50.07.zip -o bedrock.zip \
    || true
  if [ -f bedrock.zip ]; then
    unzip -q -o bedrock.zip && rm -f bedrock.zip && chmod +x bedrock_server || true
  fi
fi

# 7. Start Web Control Panel (Capped at 128MB RAM to stay well under Railway 512MB limit)
echo "[PANEL] Starting Bedrock Web Control Panel on port ${PORT}..."
cd /app

if [ ! -f dist/server.cjs ]; then
  echo "[PANEL] Compiling panel server..."
  npm run build || true
fi

echo "[PANEL] Launching Node.js Express server with 128MB RAM limit on port ${PORT}..."
exec node --max-old-space-size=128 dist/server.cjs
