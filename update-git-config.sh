#!/bin/bash

# Check current Git user configuration
echo "Current Git configuration:"
git config user.name
git config user.email
git config --list | grep credential

# Update Git user to match GitHub account
echo -e "\nUpdating Git configuration..."
git config --global user.name "mattquigleycfg"
git config --global user.email "matt@con-formgroup.com.au"  # Use your actual email

# Show updated config
echo -e "\nNew Git configuration:"
git config user.name
git config user.email

# Add credential helper to .gitconfig
echo -e "\nSetting up credential storage..."
cat >> ~/.gitconfig << EOF
[credential]
	helper = store
EOF

echo -e "\nGit credential helper configured to store credentials"
echo "Next, run update-git-remote.sh to update your remote URL"
