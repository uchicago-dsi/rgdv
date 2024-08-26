#!/bin/bash

# Prompt for environment variables
read -p "Please enter the DATA_ENDPOINT: " DATA_ENDPOINT
read -p "Please enter the NEXT_PUBLIC_MAPBOX_TOKEN: " NEXT_PUBLIC_MAPBOX_TOKEN

# Create or update the .env file
echo "DATA_ENDPOINT=$DATA_ENDPOINT" > .env
echo "NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN" >> .env

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js not found, installing..."
    curl -o nodejs.pkg https://nodejs.org/dist/v18.17.1/node-v18.17.1.pkg
    sudo installer -pkg nodejs.pkg -target /
    rm nodejs.pkg
fi

# Navigate to the application folder
cd "$(dirname "$0")"

# Install npm dependencies
echo "Installing npm dependencies..."
npm i -g pnpm
pnpm install

# Run the Next.js development server
echo "Starting Next.js..."
pnpm run dev