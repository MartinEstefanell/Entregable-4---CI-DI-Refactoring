#!/usr/bin/env bash
set -e

echo "============================"
echo "Deploy Mi Playlist - Mac/Unix"
echo "============================"

JAR_PATH="backend/target/mi-playlist-1.0.0.jar"

if [ ! -f "$JAR_PATH" ]; then
  echo "ERROR: No se encontró el JAR en $JAR_PATH"
  exit 1
fi

echo "Iniciando backend (Spring Boot) en segundo plano..."
nohup java -jar "$JAR_PATH" > mi-playlist-backend.log 2>&1 &

echo
echo "Backend levantado en http://localhost:8080"
echo
echo "Para servir el frontend (Vite) en Mac/Unix:"
echo "  cd Frontend"
echo "  npm install"
echo "  npm run preview -- --host 0.0.0.0 --port 4173"
echo
echo "Deploy finalizado."
