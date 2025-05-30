# force-push.ps1
# Script to force push changes to remote repository

Write-Host "=============================================="
Write-Host "    Force Pushing Changes to GitHub Remote    "
Write-Host "=============================================="

# 1. Ensure SSH authentication is working
Write-Host "`nVerifying SSH authentication with GitHub..." -ForegroundColor Yellow
$sshTest = ssh -T git@github.com 2>&1
if ($sshTest -match "successfully authenticated") {
    Write-Host "SSH authentication successful" -ForegroundColor Green
} else {
    Write-Host "SSH authentication issue detected." -ForegroundColor Red
    Write-Host "Adding SSH key to agent..." -ForegroundColor Yellow
    
    # Start SSH agent if not running
    $sshAgentStatus = Get-Service ssh-agent -ErrorAction SilentlyContinue
    if ($sshAgentStatus -eq $null -or $sshAgentStatus.Status -ne "Running") {
        Start-Service ssh-agent
    }
    
    # Add the key
    $deployKeyPath = "$env:USERPROFILE\.ssh\github_deploy_key"
    if (Test-Path $deployKeyPath) {
        ssh-add $deployKeyPath 2>&1 | Out-Null
        Write-Host "Added key: $deployKeyPath" -ForegroundColor Green
        
        # Test connection again
        $sshTestRetry = ssh -T git@github.com 2>&1
        if ($sshTestRetry -match "successfully authenticated") {
            Write-Host "SSH authentication successful after adding key" -ForegroundColor Green
        } else {
            Write-Host "SSH authentication still failing. Please run verify-ssh-setup.ps1 first" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "SSH key not found at $deployKeyPath" -ForegroundColor Red
        Write-Host "Please run verify-ssh-setup.ps1 first" -ForegroundColor Red
        exit 1
    }
}

# 2. Get current branch name
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "`nCurrent branch: $currentBranch" -ForegroundColor Cyan

# 3. Get remote name (usually 'origin')
$remotes = git remote
$defaultRemote = "origin"

if ($remotes.Count -gt 1) {
    Write-Host "`nMultiple remotes found:" -ForegroundColor Yellow
    foreach ($remote in $remotes) {
        Write-Host "  - $remote"
    }
    
    $useRemote = Read-Host "Which remote to use? (default: $defaultRemote)"
    if ([string]::IsNullOrWhiteSpace($useRemote)) {
        $useRemote = $defaultRemote
    }
} else {
    $useRemote = $defaultRemote
}

Write-Host "Using remote: $useRemote" -ForegroundColor Cyan

# 4. Verify remote URL is using SSH
$remoteUrl = git config --get remote.$useRemote.url
if ($remoteUrl -match "^https://") {
    Write-Host "`nWARNING: Your remote URL is using HTTPS: $remoteUrl" -ForegroundColor Red
    Write-Host "This may cause authentication issues." -ForegroundColor Red
    
    $updateUrl = Read-Host "Would you like to update to SSH? (y/n)"
    if ($updateUrl -eq "y") {
        if ($remoteUrl -match "github\.com[:/]([^/]+)/([^/.]+)") {
            $username = $matches[1]
            $repo = $matches[2]
            
            $sshUrl = "git@github.com:$username/$repo.git"
            git remote set-url $useRemote $sshUrl
            
            Write-Host "Remote URL updated to: $sshUrl" -ForegroundColor Green
            $remoteUrl = $sshUrl
        } else {
            Write-Host "Could not parse repository info from URL: $remoteUrl" -ForegroundColor Red
        }
    }
}

# 5. Show changes that will be pushed
Write-Host "`nCommits that will be pushed:" -ForegroundColor Yellow
git log $useRemote/$currentBranch..$currentBranch --oneline

# 6. Confirm force push
Write-Host "`nWARNING: Force pushing will overwrite remote changes!" -ForegroundColor Red
Write-Host "This action cannot be undone and may cause problems for collaborators." -ForegroundColor Red
$confirm = Read-Host "Are you sure you want to force push? (y/n)"

if ($confirm -eq "y") {
    # 7. Force push with detailed output
    Write-Host "`nForce pushing to $useRemote/$currentBranch..." -ForegroundColor Yellow
    
    # Using -v for verbose output
    git push -v -f $useRemote $currentBranch 2>&1
    
    # Check if push was successful
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nForce push successful!" -ForegroundColor Green
    } else {
        Write-Host "`nForce push encountered an issue. Trying alternative method..." -ForegroundColor Yellow
        
        # Alternative push method with explicit remote reference
        git push -f $useRemote "${currentBranch}:refs/heads/${currentBranch}" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nForce push successful with alternative method!" -ForegroundColor Green
        } else {
            Write-Host "`nForce push failed. Please check error messages above." -ForegroundColor Red
            
            # Offer to try once more with GIT_SSH_COMMAND
            $tryAgain = Read-Host "Would you like to try one more method? (y/n)"
            if ($tryAgain -eq "y") {
                Write-Host "Trying with explicit SSH command..." -ForegroundColor Yellow
                $env:GIT_SSH_COMMAND = "ssh -v"
                git push -f $useRemote $currentBranch 2>&1
                $env:GIT_SSH_COMMAND = $null
            }
        }
    }
    
    # 8. Verify push result
    git fetch $useRemote
    $localCommit = git rev-parse $currentBranch
    $remoteCommit = git rev-parse $useRemote/$currentBranch 2>$null
    
    if ($localCommit -eq $remoteCommit) {
        Write-Host "`nVerification successful: Local and remote branches are in sync!" -ForegroundColor Green
    } else {
        Write-Host "`nVerification failed: Local and remote branches are still different." -ForegroundColor Red
        Write-Host "Local commit: $localCommit" -ForegroundColor Yellow
        Write-Host "Remote commit: $remoteCommit" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nForce push cancelled." -ForegroundColor Yellow
}
