#!/bin/bash

echo "Checking Git configuration..."
git config user.name
git config user.email

echo "Checking remote repository information..."
git remote -v

echo "Checking current branch..."
git branch
