@echo off
SETLOCAL

REM Prompt for environment variables
set /p DATA_ENDPOINT=Please enter the DATA_ENDPOINT: 
set /p NEXT_PUBLIC_MAPBOX_TOKEN=Please enter the NEXT_PUBLIC_MAPBOX_TOKEN: 

REM Create or update the .env file
echo DATA_ENDPOINT=%DATA_ENDPOINT% > .env
echo NEXT_PUBLIC_MAPBOX_TOKEN=%NEXT_PUBLIC_MAPBOX_TOKEN% >> .env

REM Check if Node.js is installed
where node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Installing Node.js...
    curl -o nodejs.msi https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi
    start /wait msiexec /i nodejs.msi /quiet /norestart
    del nodejs.msi
)

REM Navigate to the application folder
cd /d "%~dp0"

REM Install npm dependencies
echo Installing npm dependencies and running the application...
npm i -g pnpm --silent && pnpm install --silent && pnpm run dev

ENDLOCAL
pause