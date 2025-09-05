#!/bin/bash
echo "Installing npm dependencies..."
cd webapp
npm install

echo "Building Tailwind CSS..."
npm run build

echo "Build completed!"
