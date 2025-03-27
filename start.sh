#!/bin/bash

# Run the first command
echo "Building app..."
npm run build

# Run the second command
echo "Deploying..."
firebase deploy