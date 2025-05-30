# PowerShell script to update Git remote URL

# Show current remote
Write-Host "Current remote URL:"
git remote -v

# Prompt for GitHub credentials
$username = Read-Host -Prompt "Enter your GitHub username (mattquigleycfg)"
if ([string]::IsNullOrWhiteSpace($username)) {
    $username = "mattquigleycfg"
}

$token = Read-Host -Prompt "Enter your GitHub personal access token" -AsSecureString
$tokenBSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($tokenBSTR)

# Update remote with personal access token
Write-Host "`nUpdating remote URL..."
git remote set-url origin "https://$username`:$tokenPlain@github.com/mattquigleycfg/conformapp.git"

# Show new remote (obscuring token)
Write-Host "`nNew remote URL (token hidden):"
Write-Host "https://$username:****@github.com/mattquigleycfg/conformapp.git"

Write-Host "`nRemote URL updated. Try pushing your changes now."
Write-Host "Your credentials should be stored for future operations."
