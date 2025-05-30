#!/bin/bash

# Show current remote
echo "Current remote URL:"
git remote -v

# Prompt for GitHub credentials
read -p "Enter your GitHub username (mattquigleycfg): " username
username=${username:-mattquigleycfg}

read -sp "Enter your GitHub personal access token: " token
echo

# Update remote with personal access token
echo -e "\nUpdating remote URL..."
git remote set-url origin "https://$username:$token@github.com/mattquigleycfg/conformapp.git"

# Show new remote (obscuring token)
echo -e "\nNew remote URL (token hidden):"
echo "https://$username:****@github.com/mattquigleycfg/conformapp.git"

echo -e "\nRemote URL updated. Try pushing your changes now."
echo "Your credentials should be stored for future operations."
