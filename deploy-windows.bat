@echo off
echo ============================
echo Deploy Mi Playlist - Windows
echo ============================

REM Ruta al JAR generado por Maven (segun pom.xml)
set JAR_PATH=backend\target\mi-playlist-1.0.0.jar

if not exist %JAR_PATH% (
    echo ERROR: No se encontró el JAR en %JAR_PATH%
    exit /b 1
)

echo Iniciando backend (Spring Boot)...
start "" java -jar %JAR_PATH%

echo.
echo Backend levantado (Spring Boot) en http://localhost:8080
echo.
echo Para servir el frontend, desde una consola:
echo   cd Frontend
echo   npm install
echo   npm run preview
echo.
echo Deploy finalizado.
