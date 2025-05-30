#!/bin/bash

echo "Stashing your current changes..."
git stash save "Product import functionality"

echo "Your changes are now saved in the stash."
echo "To retrieve your changes later, use: git stash apply"
echo "You can view all stashed changes with: git stash list"
