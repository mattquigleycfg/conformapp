#!/bin/bash

# Script to create a feature branch for product import functionality

# Default branch name
DEFAULT_BRANCH="feature/product-import"

# Get branch name from command line argument or use default
BRANCH_NAME=${1:-$DEFAULT_BRANCH}

# Ensure we have the latest main branch
echo "Fetching latest changes from remote..."
git fetch origin

# Create a new branch from the latest main
echo "Creating new branch: $BRANCH_NAME based on origin/main"
git checkout -b $BRANCH_NAME origin/main

# Display git status
echo "Branch created successfully. Current status:"
git status

echo ""
echo "Now you can make changes and commit to your branch."
echo "After you commit, push your branch with:"
echo "git push -u origin $BRANCH_NAME"
echo ""
echo "When ready, create a pull request to merge your changes back to main."
