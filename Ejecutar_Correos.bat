@echo off
title Airbnb AI Outreach - Autopilot
color 0A

echo ===================================================
echo   INICIANDO AUTOMATIZACION DIARIA DE CORREOS
echo ===================================================
echo.
echo No cierres esta ventana. Se cerrara sola al terminar.
echo.

:: Cambiar al directorio donde esta el batch file (raiz del proyecto)
cd /d "%~dp0"

:: Ejecutar el script maestro de Python
python 03-SCRIPTS\run_daily.py

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ===================================================
    echo   ERROR EN LA EJECUCION
    echo ===================================================
    echo Por favor, revisa los mensajes de arriba.
    pause
)
