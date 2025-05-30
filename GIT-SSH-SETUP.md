# GitHub SSH Authentication Setup Guide

## Problem
You encountered the following error when trying to push to GitHub:
```
remote: Support for password authentication was removed on August 13, 2021.
remote: Please see https://docs.github.com/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
fatal: Authentication failed for 'https://github.com/mattquigleycfg/conformapp.git/'
```

This happens because GitHub no longer supports password authentication for Git operations. You need to use SSH authentication instead.

## Solution

### 1. Set up SSH Authentication (Only Once)

1. **Open PowerShell as Administrator** and run:

```powershell
# Start the SSH agent service
Start-Service ssh-agent
Set-Service -Name ssh-agent -StartupType Automatic

# Add your SSH key to the agent
ssh-add "$env:USERPROFILE\.ssh\github_deploy_key"
```

2. **Verify SSH Connection** by running:

```powershell
ssh -T git@github.com
```

You should see: "Hi mattquigleycfg/conformapp! You've successfully authenticated..."

3. **Update your repository URL** to use SSH instead of HTTPS:

```powershell
# Change from HTTPS to SSH
git remote set-url origin git@github.com:mattquigleycfg/conformapp.git
git remote set-url upstream git@github.com:mattquigleycfg/conformapp.git

# Verify the changes
git remote -v
```

### 2. Fix Diverged Branches

If your branches have diverged, you have a few options:

#### Option 1: Force Push Your Changes (if your local changes are more important)
```powershell
# Force push your local branch to overwrite remote
git push -f origin main:main
```

#### Option 2: Pull Remote Changes (if remote changes are important)
```powershell
# Pull remote changes and merge them with yours
git pull origin main
# Resolve any conflicts if they occur
```

#### Option 3: Create a New Branch (safest option)
```powershell
# Create and switch to a new branch with your changes
git checkout -b my-new-branch
# Push the new branch to remote
git push -u origin my-new-branch
```

### 3. Automated Scripts

We've created several helper scripts to make this process easier:

- **verify-ssh-setup.ps1**: Checks and fixes your SSH configuration
- **force-push.ps1**: Safely force pushes your changes to remote
- **git-helper.ps1**: Comprehensive Git helper with multiple functions

To run these scripts with PowerShell execution policy bypass:

```powershell
powershell -ExecutionPolicy Bypass -File .\verify-ssh-setup.ps1
powershell -ExecutionPolicy Bypass -File .\force-push.ps1
powershell -ExecutionPolicy Bypass -File .\git-helper.ps1
```

## Future Git Operations

After setting up SSH authentication, all future Git operations should work without authentication errors. If you encounter any issues:

1. Ensure the SSH agent is running: `Get-Service ssh-agent`
2. Verify your SSH key is loaded: `ssh-add -l`
3. Check your remote URLs are using SSH: `git remote -v`

## References

- [GitHub Documentation: About Remote Repositories](https://docs.github.com/get-started/getting-started-with-git/about-remote-repositories)
- [GitHub Documentation: Connecting to GitHub with SSH](https://docs.github.com/authentication/connecting-to-github-with-ssh)
