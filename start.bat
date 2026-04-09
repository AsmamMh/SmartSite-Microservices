@echo off
REM Script de démarrage complet du système SmartSite Microservices (Windows)

setlocal enabledelayedexpansion

echo.
echo ================================================
echo   SmartSite Microservices - Startup Script
echo ================================================
echo.

REM Vérifier Docker
echo Verification de Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo X Docker n'est pas installe
    exit /b 1
)

echo ✓ Docker found: 
docker --version
echo.

REM Vérifier Docker Compose
echo Verification de Docker Compose...
docker compose version >nul 2>&1
if errorlevel 1 (
    echo X Docker Compose n'est pas installe
    exit /b 1
)

echo ✓ Docker Compose found
echo.

REM Arrêter les anciens containers
echo Arret des containers existants...
docker-compose down --remove-orphans >nul 2>&1 || true
echo.

REM Démarrer les services
echo Demarrage des services...
echo.

docker-compose up -d

REM Attendre que les services se stabilisent
echo.
echo Attente du demarrage des services ^(30 secondes^)...
timeout /t 30 /nobreak

REM Vérifier le statut
echo.
echo Statut des services:
docker-compose ps

echo.
echo ================================================
echo   ✓ Demarrage complete!
echo ================================================
echo.
echo Services accessibles:
echo    * API Gateway:   http://localhost:8080
echo    * Eureka Server: http://localhost:8761
echo    * Config Server: http://localhost:8888
echo    * RabbitMQ:      http://localhost:15672 ^(chedly/chedly^)
echo.
echo Logs en temps reel:
echo    docker-compose logs -f
echo.
echo Arret des services:
echo    docker-compose down
echo.

pause
