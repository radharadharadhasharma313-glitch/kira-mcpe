#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "🚀 Starting Bedrock Server Panel + Ubuntu GUI + Playit.gg"
echo "=========================================================="

PORT="${PORT:-3000}"
NOVNC_PORT="${NOVNC_PORT:-6080}"
DISPLAY="${DISPLAY:-:1}"

mkdir -p /minecraft-bedrock/worlds /minecraft-bedrock/backups /root/.config/playit /app/data /tmp/.X11-unix
chmod 1777 /tmp/.X11-unix

# 1. Start Xvfb Virtual Framebuffer
echo "[GUI] Starting Xvfb on display ${DISPLAY}..."
Xvfb "${DISPLAY}" -screen 0 1280x720x16 &
sleep 1

# 2. Start Openbox Window Manager & Tint2 Panel
echo "[GUI] Starting Openbox Window Manager & Tint2..."
openbox --display "${DISPLAY}" &
tint2 -c /dev/null &

# 3. Start x11vnc Server
echo "[GUI] Starting x11vnc..."
x11vnc -display "${DISPLAY}" -forever -shared -nopw -rfbport 5901 -bg -o /var/log/x11vnc.log || true

# 4. Start noVNC (Websocket to VNC Bridge)
echo "[GUI] Starting noVNC on port ${NOVNC_PORT}..."
websockify --web /usr/share/novnc "${NOVNC_PORT}" localhost:5901 &

# 5. Initialize Playit.gg tunnel agent
echo "[TUNNEL] Initializing Playit.gg CLI..."
if [ ! -f /root/.config/playit/playit.toml ]; then
  echo "[TUNNEL] First time setup: starting playit agent to generate claim token..."
  playit --secret_path /root/.config/playit/playit.toml > /app/data/playit.log 2>&1 &
else
  echo "[TUNNEL] Existing playit configuration found. Connecting..."
  playit --secret_path /root/.config/playit/playit.toml >> /app/data/playit.log 2>&1 &
fi

# 6. Start Web Control Panel (Aternos-style UI)
echo "[PANEL] Starting Bedrock Web Control Panel on port ${PORT}..."
cd /app

# Ensure dependencies built
if [ ! -f dist/server.cjs ]; then
  echo "[PANEL] Compiling panel server..."
  npm run build
fi

node dist/server.cjs
