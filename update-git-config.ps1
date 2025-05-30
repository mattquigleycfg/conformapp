# PowerShell script to update Git configuration

# Display current Git configuration
Write-Host "Current Git configuration:"
git config user.name
git config user.email
git config --list | Select-String "credential"

# Update Git user to match GitHub account
Write-Host "`nUpdating Git configuration..."
git config --global user.name "mattquigleycfg"
git config --global user.email "matt@con-formgroup.com.au"  # Replace with your actual email if needed

# Display updated Git configuration
Write-Host "`nNew Git configuration:"
git config user.name
git config user.email

# Create .gitconfig with credential helper
Write-Host "`nSetting up credential storage..."
@"
[credential]
    helper = store
"@ | Out-File -FilePath "$env:USERPROFILE\.gitconfig" -Append -Encoding ascii

Write-Host "`nGit credential helper configured to store credentials"
Write-Host "Next, run update-git-remote.ps1 to update your remote URL"
