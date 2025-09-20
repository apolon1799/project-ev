#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "You can now push to GitHub to trigger automatic deployment."
    echo "Or run: npx gh-pages -d dist for manual deployment"
else
    echo "Build failed!"
    exit 1
fi
