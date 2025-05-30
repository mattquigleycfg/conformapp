# verify-ssh-setup.ps1
# Script to verify and fix SSH setup for GitHub authentication

Write-Host "========================================================"
Write-Host "      Verifying SSH Setup for GitHub Authentication     "
Write-Host "========================================================"

# Step 1: Check if SSH agent is running
$sshAgentStatus = Get-Service ssh-agent -ErrorAction SilentlyContinue
if ($sshAgentStatus -eq $null -or $sshAgentStatus.Status -ne "Running") {
    Write-Host "Starting SSH agent service..." -ForegroundColor Yellow
    Start-Service ssh-agent
    Set-Service -Name ssh-agent -StartupType Automatic
    Write-Host "SSH agent service started and set to automatic startup" -ForegroundColor Green
} else {
    Write-Host "SSH agent is already running" -ForegroundColor Green
}

# Step 2: Check for SSH keys
$sshDir = "$env:USERPROFILE\.ssh"
$deployKeyPath = "$sshDir\github_deploy_key"
$hasKeys = Test-Path $deployKeyPath

if (-not $hasKeys) {
    Write-Host "No SSH deploy key found at $deployKeyPath" -ForegroundColor Yellow
    Write-Host "Checking for other keys..."
    
    $keyFiles = Get-ChildItem -Path $sshDir -Filter "*.pub" -ErrorAction SilentlyContinue
    if ($keyFiles.Count -eq 0) {
        Write-Host "No SSH keys found. Would you like to generate a new key? (y/n)" -ForegroundColor Yellow
        $genKey = Read-Host
        
        if ($genKey -eq "y") {
            # Generate new SSH key
            $email = Read-Host "Enter your email address for the SSH key"
            Write-Host "Generating new SSH key..."
            ssh-keygen -t ed25519 -C $email -f "$sshDir\github_deploy_key"
            Write-Host "SSH key generated at $sshDir\github_deploy_key" -ForegroundColor Green
            
            # Display the public key
            Write-Host "`nYour public SSH key (add this to GitHub):" -ForegroundColor Cyan
            Get-Content "$sshDir\github_deploy_key.pub"
            Write-Host "`nAdd this key to GitHub at: https://github.com/settings/keys" -ForegroundColor Cyan
            
            $deployKeyPath = "$sshDir\github_deploy_key"
            $hasKeys = $true
        }
    } else {
        Write-Host "Found the following SSH keys:" -ForegroundColor Green
        foreach ($key in $keyFiles) {
            Write-Host "  - $($key.BaseName)"
        }
        
        Write-Host "Enter the name of the key you want to use (without extension):" -ForegroundColor Yellow
        $keyName = Read-Host
        $deployKeyPath = "$sshDir\$keyName"
        
        if (Test-Path "$deployKeyPath.pub") {
            $hasKeys = $true
            Write-Host "Using key: $deployKeyPath" -ForegroundColor Green
        } else {
            Write-Host "Key not found: $deployKeyPath" -ForegroundColor Red
            exit 1
        }
    }
}

# Step 3: Add the SSH key to the agent
if ($hasKeys) {
    Write-Host "Adding SSH key to agent..." -ForegroundColor Yellow
    ssh-add $deployKeyPath 2>&1 | Out-Null
    
    # Verify key was added
    $keysInAgent = ssh-add -l
    if ($keysInAgent -match "github") {
        Write-Host "SSH key added to agent successfully" -ForegroundColor Green
    } else {
        Write-Host "SSH key may not have been added to agent. Verify with 'ssh-add -l'" -ForegroundColor Yellow
    }
}

# Step 4: Test connection to GitHub
Write-Host "`nTesting connection to GitHub..." -ForegroundColor Yellow
$testConnection = ssh -T git@github.com 2>&1
if ($testConnection -match "successfully authenticated") {
    Write-Host "Successfully authenticated with GitHub" -ForegroundColor Green
} else {
    Write-Host "GitHub authentication test failed. Response:" -ForegroundColor Red
    Write-Host $testConnection
    
    Write-Host "`nTroubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Make sure your SSH key is added to your GitHub account"
    Write-Host "2. Check if your SSH key is correctly loaded with 'ssh-add -l'"
    Write-Host "3. Try running 'ssh -vT git@github.com' for verbose output"
    exit 1
}

# Step 5: Check Git remote configuration
Write-Host "`nChecking Git remote configuration..." -ForegroundColor Yellow
$remoteUrl = git config --get remote.origin.url

if ($remoteUrl -match "^https://") {
    Write-Host "Your Git remote is using HTTPS: $remoteUrl" -ForegroundColor Yellow
    Write-Host "Would you like to update it to use SSH? (y/n)" -ForegroundColor Yellow
    $updateRemote = Read-Host
    
    if ($updateRemote -eq "y") {
        # Extract repo info from HTTPS URL
        if ($remoteUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
            $username = $matches[1]
            $repo = $matches[2]
            
            # Update remote URL
            $sshUrl = "git@github.com:$username/$repo.git"
            git remote set-url origin $sshUrl
            
            Write-Host "Remote URL updated to: $sshUrl" -ForegroundColor Green
            
            # Check upstream if it exists
            $hasUpstream = git remote | Select-String -Pattern "upstream" -Quiet
            if ($hasUpstream) {
                $upstreamUrl = git config --get remote.upstream.url
                if ($upstreamUrl -match "^https://") {
                    git remote set-url upstream $sshUrl
                    Write-Host "Upstream URL updated to: $sshUrl" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "Could not parse repository information from URL: $remoteUrl" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Your Git remote is already using SSH: $remoteUrl" -ForegroundColor Green
}

# Step 6: Handle diverged branches
$branchStatus = git status -uno
if ($branchStatus -match "have diverged") {
    Write-Host "`nYour local and remote branches have diverged." -ForegroundColor Yellow
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Pull remote changes and merge (git pull)"
    Write-Host "2. Force push your local changes (git push -f)"
    Write-Host "3. Create a new branch for your changes"
    Write-Host "4. Skip for now"
    
    $divergeOption = Read-Host "Choose an option (1-4)"
    
    switch ($divergeOption) {
        "1" {
            Write-Host "Pulling remote changes..." -ForegroundColor Yellow
            git pull
        }
        "2" {
            Write-Host "Force pushing local changes..." -ForegroundColor Yellow
            git push -f origin main:main
        }
        "3" {
            $newBranch = Read-Host "Enter new branch name"
            Write-Host "Creating and switching to new branch: $newBranch" -ForegroundColor Yellow
            git checkout -b $newBranch
            git push -u origin $newBranch
        }
        "4" {
            Write-Host "Skipping branch reconciliation" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n========================================================"
Write-Host "SSH setup verification complete!" -ForegroundColor Green
Write-Host "You should now be able to push/pull with Git using SSH authentication."
Write-Host "========================================================"