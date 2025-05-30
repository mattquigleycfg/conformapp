#!/bin/bash

# Script to backup changes while waiting for repository access

# Create a backup directory with timestamp
BACKUP_DIR="product-import-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Copy the CSV file
echo "Backing up CSV file..."
cp "../../../../Con-form Estimator v1.14.csv" $BACKUP_DIR/

# Copy any modified files from the git repository
echo "Backing up modified files..."
git diff --name-only | xargs -I{} cp --parents {} $BACKUP_DIR/

# Copy any new untracked files
echo "Backing up untracked files..."
git ls-files --others --exclude-standard | xargs -I{} cp --parents {} $BACKUP_DIR/

# Create a README in the backup directory
cat > $BACKUP_DIR/README.md << EOF
# Product Import Backup

This backup was created on $(date) while waiting for repository access.

## Contents
- CSV data file
- Modified git files
- New untracked files

When repository access is granted:
1. Create a feature branch
2. Copy these files to your working directory
3. Commit and push to your feature branch
4. Create a pull request
EOF

echo "Backup completed successfully. Your changes are saved in the $BACKUP_DIR directory."
