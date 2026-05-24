@echo off
setlocal
cd /d "%~dp0"
echo Menjalankan CiviTrack di http://localhost:3000
call npm.cmd run dev
