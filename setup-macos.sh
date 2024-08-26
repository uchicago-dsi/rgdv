#!/bin/bash

# Prompt for environment variables
read -p "Please enter the DATA_ENDPOINT: " DATA_ENDPOINT
read -p "Please enter the NEXT_PUBLIC_MAPBOX_TOKEN: " NEXT_PUBLIC_MAPBOX_TOKEN

# Create or update the .env file
echo "DATA_ENDPOINT=$DATA_ENDPOINT" > .env
echo "NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN" >> .env

# Navigate to the application folder
cd "$(dirname "$0")"

# Check if NVM (Node Version Manager) is installed
if ! command -v nvm &> /dev/null
then
    echo "NVM not found, installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
fi

# Load NVM into the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Install Node.js locally using NVM
nvm install 18.17.1
nvm use 18.17.1

# Install npm dependencies
echo "Installing npm dependencies..."
npm i -g pnpm && pnpm install 

# Run the Next.js development server
echo "Starting Next.js..."
pnpm dev