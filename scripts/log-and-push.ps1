# ─────────────────────────────────────────────────────────────
# Nanma Living — Auto Changelog + Progress Updater + Git Push
# Usage: npm run push
# Automatically detects changed files and updates docs.
# ─────────────────────────────────────────────────────────────

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# ── 1. Show current git status ────────────────────────────────
Write-Host "`nChanged files:" -ForegroundColor Cyan
git status --short

# ── 2. Auto-detect changed files from git ────────────────────
$gitStatus = git status --short
$added   = @()
$changed = @()

foreach ($line in $gitStatus) {
    $status = $line.Substring(0, 2).Trim()
    $file   = $line.Substring(3).Trim()
    $name   = Split-Path $file -Leaf

    if ($status -eq '??' -or $status -eq 'A') {
        $added += "- ``$name`` (new file)"
    } elseif ($status -eq 'M' -or $status -eq 'AM') {
        $changed += "- ``$name``"
    } elseif ($status -eq 'R') {
        $changed += "- ``$name`` (renamed/moved)"
    } elseif ($status -eq 'D') {
        $changed += "- ``$name`` (deleted)"
    }
}


# ── 3. Build changelog entry ──────────────────────────────────
$date  = Get-Date -Format "yyyy-MM-dd"
$entry = "## [$date]`n"

if ($added.Count -gt 0) {
    $entry += "`n### Added`n" + ($added -join "`n") + "`n"
}
if ($changed.Count -gt 0) {
    $entry += "`n### Changed`n" + ($changed -join "`n") + "`n"
}

# Prepend new entry after the header lines
$changelogPath = "$root\CHANGELOG.md"
$existing      = Get-Content $changelogPath -Raw
$splitMarker   = "---`n`n"
$parts         = $existing -split [regex]::Escape($splitMarker), 2

if ($parts.Count -eq 2) {
    $newContent = $parts[0] + $splitMarker + $entry + "`n---`n`n" + $parts[1].TrimStart()
} else {
    $newContent = $existing + "`n---`n`n" + $entry
}

Set-Content $changelogPath $newContent -NoNewline
Write-Host "CHANGELOG.md updated." -ForegroundColor Green

# ── 4. Auto-update progress.md file status ────────────────────
$progressPath    = "$root\docs\progress.md"
$progressContent = Get-Content $progressPath -Raw

$fileChecks = @{
    "LoginPage.jsx / .css"         = "src\pages\auth\LoginPage.jsx"
    "OtpPage.jsx / .css"           = "src\pages\auth\OtpPage.jsx"
    "MpinPage.jsx / .css"          = "src\pages\auth\MpinPage.jsx"
    "MpinVerifyPage.jsx / .css"    = "src\pages\auth\MpinVerifyPage.jsx"
    "PortalSelectPage.jsx"         = "src\pages\auth\PortalSelectPage.jsx"
    "AddFlatPage.jsx / .css"       = "src\pages\user\AddFlatPage.jsx"
    "SelectApartmentPage.jsx"      = "src\pages\user\SelectApartmentPage.jsx"
    "DashboardPage.jsx"            = "src\pages\admin\DashboardPage.jsx"
    "ApartmentGroupPage.jsx"       = "src\pages\admin\ApartmentGroupPage.jsx"
}

foreach ($label in $fileChecks.Keys) {
    $filePath = "$root\" + $fileChecks[$label]
    if (Test-Path $filePath) {
        $escapedLabel = [regex]::Escape($label)
        $progressContent = $progressContent -replace "$escapedLabel\s+\S+\s+(Pending|pending)", "$label          Done"
    }
}

Set-Content $progressPath $progressContent -NoNewline
Write-Host "progress.md updated." -ForegroundColor Green

# ── 5. Commit message (only thing you type) ───────────────────
Write-Host "`nCommit message (press Enter for auto):" -ForegroundColor Yellow
$commitMsg = Read-Host "  >"
if ($commitMsg -eq '') { $commitMsg = "update [$date]" }

# ── 6. Stage, commit, push ────────────────────────────────────
git add .
git commit -m $commitMsg
git push origin main

Write-Host "`nPushed to GitHub successfully!`n" -ForegroundColor Green

