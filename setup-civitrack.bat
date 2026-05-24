@echo off
setlocal
cd /d "%~dp0"
echo Memasang dependency CiviTrack...
call npm.cmd install
if errorlevel 1 goto failed
echo.
echo Membuat database SQLite dan migrasi Prisma...
call npx.cmd prisma migrate dev --name init
if errorlevel 1 goto failed
echo.
echo Mengisi data konstruksi realistis...
call npx.cmd prisma db seed
if errorlevel 1 goto failed
echo.
echo Setup CiviTrack selesai.
echo Jalankan run-civitrack.bat lalu buka http://localhost:3000
exit /b 0

:failed
echo.
echo Setup gagal. Periksa pesan error di atas.
exit /b 1
