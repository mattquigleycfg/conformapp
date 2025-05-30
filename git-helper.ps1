# git-helper.ps1
# A comprehensive Git helper script for common operations

param (
    [string]$action = ""
)

function Show-Menu {
    Write-Host "======================================================"
    Write-Host "                   Git Helper Script                   "
    Write-Host "======================================================"
    Write-Host "1. Verify SSH Setup"
    Write-Host "2. Force Push Current Branch"
    Write-Host "3. Resolve Diverged Branches"
    Write-Host "4. Create New Branch"
    Write-Host "5. Stash/Unstash Changes"
    Write-Host "6. Update Remote URLs (HTTPS to SSH)"
    Write-Host "7. Show Status and Changes"
    Write-Host "8. Fix Push Problems"
    Write-Host "9. Exit"
    Write-Host "======================================================"
    
    $choice = Read-Host "Enter your choice (1-9)"
    return $choice
}

function Verify-SSH {
    # Run SSH verification with execution policy bypass
    powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\verify-ssh-setup.ps1"
}

function Force-Push {
    # Run force push script with execution policy bypass
    powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\force-push.ps1"
}

function Resolve-DivergedBranches {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "Checking status of branch: $currentBranch" -ForegroundColor Cyan
    
    $status = git status -uno
    if ($status -match "have diverged") {
        Write-Host "`nYour local and remote branches have diverged." -ForegroundColor Yellow
        Write-Host "Options:" -ForegroundColor Yellow
        Write-Host "1. Pull remote changes and merge"
        Write-Host "2. Pull remote changes and rebase your changes on top"
        Write-Host "3. Force push your local changes (overwrites remote)"
        Write-Host "4. Create a new branch for your local changes"
        Write-Host "5. View diff between local and remote"
        Write-Host "6. Cancel"
        
        $option = Read-Host "Choose an option (1-6)"
        
        switch ($option) {
            "1" {
                Write-Host "Pulling and merging remote changes..." -ForegroundColor Yellow
                git pull
            }
            "2" {
                Write-Host "Pulling and rebasing on remote changes..." -ForegroundColor Yellow
                git pull --rebase
            }
            "3" {
                Write-Host "Force pushing your local changes..." -ForegroundColor Yellow
                git push -f origin $currentBranch
            }
            "4" {
                $newBranch = Read-Host "Enter new branch name"
                Write-Host "Creating and switching to new branch: $newBranch" -ForegroundColor Yellow
                git checkout -b $newBranch
                git push -u origin $newBranch
            }
            "5" {
                Write-Host "Showing diff between local and remote..." -ForegroundColor Yellow
                git diff origin/$currentBranch..$currentBranch
            }
            "6" {
                Write-Host "Operation cancelled" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "Branches have not diverged or no tracking information available." -ForegroundColor Green
    }
}

function Create-NewBranch {
    $baseBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "Current branch: $baseBranch" -ForegroundColor Cyan
    
    $newBranch = Read-Host "Enter new branch name"
    
    Write-Host "Create branch from:" -ForegroundColor Yellow
    Write-Host "1. Current branch ($baseBranch)"
    Write-Host "2. main"
    Write-Host "3. Another branch"
    
    $branchFrom = Read-Host "Choose an option (1-3)"
    
    switch ($branchFrom) {
        "1" {
            $sourceBranch = $baseBranch
        }
        "2" {
            $sourceBranch = "main"
        }
        "3" {
            $branches = git branch
            Write-Host "Available branches:" -ForegroundColor Yellow
            foreach ($branch in $branches) {
                Write-Host "  $branch"
            }
            $sourceBranch = Read-Host "Enter source branch name"
        }
    }
    
    Write-Host "Creating new branch '$newBranch' from '$sourceBranch'..." -ForegroundColor Yellow
    
    if ($sourceBranch -ne $baseBranch) {
        git fetch
        git checkout $sourceBranch
        git pull
    }
    
    git checkout -b $newBranch
    
    $pushBranch = Read-Host "Push new branch to remote? (y/n)"
    if ($pushBranch -eq "y") {
        git push -u origin $newBranch
    }
}

function Manage-Stash {
    Write-Host "Stash Operations:" -ForegroundColor Yellow
    Write-Host "1. Stash current changes"
    Write-Host "2. List stashes"
    Write-Host "3. Apply most recent stash"
    Write-Host "4. Apply specific stash"
    Write-Host "5. Drop stash"
    Write-Host "6. Cancel"
    
    $stashOption = Read-Host "Choose an option (1-6)"
    
    switch ($stashOption) {
        "1" {
            $stashName = Read-Host "Enter a description for this stash (optional)"
            if ([string]::IsNullOrWhiteSpace($stashName)) {
                git stash push
            } else {
                git stash push -m $stashName
            }
        }
        "2" {
            git stash list
        }
        "3" {
            git stash apply
        }
        "4" {
            git stash list
            $stashIndex = Read-Host "Enter stash index (e.g., 0 for stash@{0})"
            git stash apply "stash@{$stashIndex}"
        }
        "5" {
            git stash list
            $stashIndex = Read-Host "Enter stash index to drop (e.g., 0 for stash@{0})"
            git stash drop "stash@{$stashIndex}"
        }
        "6" {
            Write-Host "Operation cancelled" -ForegroundColor Yellow
        }
    }
}

function Update-RemoteUrls {
    $remotes = git remote
    
    foreach ($remote in $remotes) {
        $url = git config --get remote.$remote.url
        
        if ($url -match "^https://") {
            Write-Host "$remote is using HTTPS: $url" -ForegroundColor Yellow
            
            if ($url -match "github\.com[:/]([^/]+)/([^/.]+)") {
                $username = $matches[1]
                $repo = $matches[2]
                
                $sshUrl = "git@github.com:$username/$repo.git"
                
                $update = Read-Host "Update $remote to use SSH? ($sshUrl) (y/n)"
                if ($update -eq "y") {
                    git remote set-url $remote $sshUrl
                    Write-Host "$remote updated to: $sshUrl" -ForegroundColor Green
                }
            } else {
                Write-Host "Could not parse repo info from URL: $url" -ForegroundColor Red
            }
        } else {
            Write-Host "$remote is already using SSH: $url" -ForegroundColor Green
        }
    }
}

function Show-Status {
    Write-Host "`nCurrent Git Status:" -ForegroundColor Cyan
    git status
    
    Write-Host "`nLocal Branches:" -ForegroundColor Cyan
    git branch
    
    Write-Host "`nRemote Branches:" -ForegroundColor Cyan
    git branch -r
    
    Write-Host "`nRecent Commits:" -ForegroundColor Cyan
    git log --oneline -n 5
}

function Fix-PushProblems {
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "                Git Push Problem Fixer                 " -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan
    
    # 1. Verify SSH first
    Write-Host "`nStep 1: Verifying SSH connection to GitHub..." -ForegroundColor Yellow
    $sshTest = ssh -T git@github.com 2>&1
    
    if ($sshTest -match "successfully authenticated") {
        Write-Host "SSH connection successful!" -ForegroundColor Green
    } else {
        Write-Host "SSH connection issue. Would you like to run the SSH setup script? (y/n)" -ForegroundColor Red
        $runSshSetup = Read-Host
        
        if ($runSshSetup -eq "y") {
            Verify-SSH
            return
        }
    }
    
    # 2. Check remote URLs
    Write-Host "`nStep 2: Checking remote URLs..." -ForegroundColor Yellow
    $originUrl = git config --get remote.origin.url
    
    if ($originUrl -match "^https://") {
        Write-Host "Your remote URL is using HTTPS: $originUrl" -ForegroundColor Red
        Write-Host "This is likely causing authentication issues." -ForegroundColor Red
        Write-Host "Would you like to update to SSH? (y/n)" -ForegroundColor Yellow
        $updateToSsh = Read-Host
        
        if ($updateToSsh -eq "y") {
            Update-RemoteUrls
        }
    } else {
        Write-Host "Remote URL is using SSH: $originUrl" -ForegroundColor Green
    }
    
    # 3. Check if branches have diverged
    Write-Host "`nStep 3: Checking branch status..." -ForegroundColor Yellow
    $currentBranch = git rev-parse --abbrev-ref HEAD
    $status = git status -uno
    
    if ($status -match "have diverged") {
        Write-Host "Your local and remote branches have diverged." -ForegroundColor Red
        Write-Host "This is preventing you from pushing changes normally." -ForegroundColor Red
        
        Write-Host "`nQuick Fix Options:" -ForegroundColor Yellow
        Write-Host "1. Force push your changes (overwrites remote)"
        Write-Host "2. Pull remote changes and merge (might cause conflicts)"
        Write-Host "3. Create a new branch for your changes"
        Write-Host "4. See detailed options for resolving diverged branches"
        
        $fixOption = Read-Host "Choose an option (1-4)"
        
        switch ($fixOption) {
            "1" {
                Write-Host "`nForce pushing your changes to remote..." -ForegroundColor Yellow
                Write-Host "This will OVERWRITE any changes on the remote branch!" -ForegroundColor Red
                $confirm = Read-Host "Are you sure? (y/n)"
                
                if ($confirm -eq "y") {
                    git push -f origin $currentBranch
                }
            }
            "2" {
                Write-Host "`nPulling remote changes and merging..." -ForegroundColor Yellow
                git pull
            }
            "3" {
                $newBranch = Read-Host "Enter name for new branch"
                Write-Host "`nCreating and switching to new branch: $newBranch" -ForegroundColor Yellow
                git checkout -b $newBranch
                git push -u origin $newBranch
            }
            "4" {
                Resolve-DivergedBranches
            }
        }
    } else {
        Write-Host "No branch divergence detected." -ForegroundColor Green
    }
    
    # 4. Check git config
    Write-Host "`nStep 4: Checking git configuration..." -ForegroundColor Yellow
    $userName = git config --get user.name
    $userEmail = git config --get user.email
    
    if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
        Write-Host "Git user information is not properly configured." -ForegroundColor Red
        
        if ([string]::IsNullOrWhiteSpace($userName)) {
            $newName = Read-Host "Enter your name for Git"
            git config --global user.name $newName
        }
        
        if ([string]::IsNullOrWhiteSpace($userEmail)) {
            $newEmail = Read-Host "Enter your email for Git"
            git config --global user.email $newEmail
        }
        
        Write-Host "Git user information updated." -ForegroundColor Green
    } else {
        Write-Host "Git user information is properly configured:" -ForegroundColor Green
        Write-Host "  Name: $userName" -ForegroundColor Green
        Write-Host "  Email: $userEmail" -ForegroundColor Green
    }
    
    # 5. Final check
    Write-Host "`nStep 5: Testing push capability..." -ForegroundColor Yellow
    Write-Host "Would you like to create a test commit and try pushing? (y/n)" -ForegroundColor Yellow
    $testPush = Read-Host
    
    if ($testPush -eq "y") {
        $testFile = ".gitkeep-test"
        "" | Out-File -FilePath $testFile
        git add $testFile
        git commit -m "Test commit for push capability"
        
        Write-Host "`nPushing test commit..." -ForegroundColor Yellow
        git push origin $currentBranch
        
        Write-Host "`nCleaning up test commit..." -ForegroundColor Yellow
        git reset --hard HEAD~1
    }
    
    Write-Host "`n======================================================" -ForegroundColor Cyan
    Write-Host "               Push Problem Fixer Complete               " -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan
}

# Main script logic
if ($action -eq "") {
    $choice = Show-Menu
} else {
    switch ($action.ToLower()) {
        "ssh" { $choice = "1" }
        "push" { $choice = "2" }
        "diverged" { $choice = "3" }
        "branch" { $choice = "4" }
        "stash" { $choice = "5" }
        "remote" { $choice = "6" }
        "status" { $choice = "7" }
        "fix" { $choice = "8" }
        default { $choice = Show-Menu }
    }
}

switch ($choice) {
    "1" { Verify-SSH }
    "2" { Force-Push }
    "3" { Resolve-DivergedBranches }
    "4" { Create-NewBranch }
    "5" { Manage-Stash }
    "6" { Update-RemoteUrls }
    "7" { Show-Status }
    "8" { Fix-PushProblems }
    "9" { 
        Write-Host "Exiting Git Helper" -ForegroundColor Yellow
        exit 
    }
    default { 
        Write-Host "Invalid choice. Please try again." -ForegroundColor Red
        Show-Menu 
    }
}
