#!/bin/bash

# Replace 'your-name-feature' with a descriptive branch name
NEW_BRANCH="product-import-feature"

echo "Creating new branch: $NEW_BRANCH"
git checkout -b $NEW_BRANCH

echo "Now you can make changes and commit to your branch"
echo "After you commit, push your branch with:"
echo "git push -u origin $NEW_BRANCH"
