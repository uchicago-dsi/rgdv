@echo off
SETLOCAL

if exist .env (echo .env file exists, skipping prompts.) else (
    REM Prompt for environment variables
    set /p DATA_ENDPOINT=Please enter the DATA_ENDPOINT: 
    set /p NEXT_PUBLIC_MAPBOX_TOKEN=Please enter the NEXT_PUBLIC_MAPBOX_TOKEN: 

    REM Create or update the .env file
    echo DATA_ENDPOINT=%DATA_ENDPOINT% > .env
    echo NEXT_PUBLIC_MAPBOX_TOKEN=%NEXT_PUBLIC_MAPBOX_TOKEN% >> .env
)

REM Navigate to the application folder
cd /d "%~dp0"

REM Check if Node.js is locally installed
if not exist ".\node-v18.17.1-win-x64\node.exe" (
    echo Downloading Node.js...
    curl -o nodejs.zip https://nodejs.org/dist/v18.17.1/node-v18.17.1-win-x64.zip
    tar -xf nodejs.zip
    del nodejs.zip
)

REM Add the local Node.js to the PATH
set PATH=%CD%\node-v18.17.1-win-x64;%PATH%

REM Install npm dependencies
echo Installing npm dependencies...
.\node-v18.17.1-win-x64\npm install

REM Run the Next.js development server
echo Starting Next.js...
.\node-v18.17.1-win-x64\npx next dev

ENDLOCAL
pause