@echo off
echo =====================================================
echo   GitHub SSH Setup and Authentication Helper
echo =====================================================
echo.
echo This script will help you set up SSH authentication
echo for GitHub and fix any issues with pushing changes.
echo.
echo Choose an option:
echo 1. Fix GitHub authentication (SSH setup)
echo 2. Force push your changes
echo 3. Resolve diverged branches
echo 4. Run full Git helper script
echo.
set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
    powershell -ExecutionPolicy Bypass -File "%~dp0verify-ssh-setup.ps1"
    goto end
)
if "%choice%"=="2" (
    powershell -ExecutionPolicy Bypass -File "%~dp0force-push.ps1"
    goto end
)
if "%choice%"=="3" (
    powershell -ExecutionPolicy Bypass -Command "& {$action='diverged'; . '%~dp0git-helper.ps1'}"
    goto end
)
if "%choice%"=="4" (
    powershell -ExecutionPolicy Bypass -File "%~dp0git-helper.ps1"
    goto end
)

echo Invalid choice. Please try again.

:end
echo.
echo Press any key to exit...
pause > nul
