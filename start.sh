#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "🚀 Starting Bedrock Server Panel + Ubuntu XFCE4 GUI + Playit"
echo "=========================================================="

PORT="${PORT:-3000}"
NOVNC_PORT="${NOVNC_PORT:-6080}"
DISPLAY="${DISPLAY:-:1}"

mkdir -p /minecraft-bedrock/worlds /minecraft-bedrock/backups /root/.config/playit /app/data /tmp/.X11-unix /root/.vnc
chmod 1777 /tmp/.X11-unix

# Setup VNC passwordless xstartup for XFCE4 Desktop
cat << 'EOF' > /root/.vnc/xstartup
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey
vncconfig -iconic &
startxfce4 &
EOF
chmod +x /root/.vnc/xstartup

# 1. Start TigerVNC Server (Port 5901)
echo "[GUI] Starting TigerVNC server on ${DISPLAY} (Port 5901)..."
vncserver -kill "${DISPLAY}" 2>/dev/null || true
vncserver "${DISPLAY}" -localhost no -SecurityTypes None -geometry 1280x720 --I-KNOW-THIS-IS-INSECURE || true

# 2. Start noVNC Websockify Bridge (Port 6080)
echo "[GUI] Starting noVNC on port ${NOVNC_PORT}..."
websockify -D --web=/usr/share/novnc/ "${NOVNC_PORT}" localhost:5901 || websockify --web /usr/share/novnc "${NOVNC_PORT}" localhost:5901 &

# 3. Initialize Playit.gg tunnel agent
echo "[TUNNEL] Initializing Playit.gg CLI..."
if [ ! -f /root/.config/playit/playit.toml ]; then
  echo "[TUNNEL] First time setup: starting playit agent to generate claim token..."
  playit --secret_path /root/.config/playit/playit.toml > /app/data/playit.log 2>&1 &
else
  echo "[TUNNEL] Existing playit configuration found. Connecting..."
  playit --secret_path /root/.config/playit/playit.toml >> /app/data/playit.log 2>&1 &
fi

# 4. Ensure Bedrock Linux binary is downloaded if missing
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

# 5. Start Web Control Panel (UPI-style UI)
echo "[PANEL] Starting Bedrock Web Control Panel on port ${PORT}..."
cd /app

if [ ! -f dist/server.cjs ]; then
  echo "[PANEL] Compiling panel server..."
  npm run build
fi

exec node dist/server.cjs
