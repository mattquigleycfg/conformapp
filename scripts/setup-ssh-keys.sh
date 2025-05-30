#!/bin/bash

echo "Setting up SSH keys for Git authentication..."

# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key to the agent
ssh-add ~/.ssh/id_ed25519

echo "Your public SSH key is:"
cat ~/.ssh/id_ed25519.pub
echo "Copy this key and add it to your GitHub/GitLab account in the SSH keys section."

echo "After adding your key, update your repository remote URL:"
echo "git remote set-url origin git@github.com:username/repository.git"
