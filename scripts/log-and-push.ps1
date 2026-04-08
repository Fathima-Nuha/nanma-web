# ─────────────────────────────────────────────────────────────
# Nanma Living — Auto Changelog + Progress Updater + Git Push
# Usage: cd to project root, then run: .\scripts\log-and-push.ps1
# ─────────────────────────────────────────────────────────────

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# ── 1. Show current git status ────────────────────────────────
Write-Host "`nChanged files:" -ForegroundColor Cyan
git status --short

# ── 2. Ask for changelog entry ────────────────────────────────
Write-Host "`nWhat did you change? (will be added to CHANGELOG.md)" -ForegroundColor Yellow
Write-Host "   Press Enter after each line. Leave blank to skip a section.`n"

$added   = @()
$changed = @()
$fixed   = @()

Write-Host "  ADDED (new pages/features):" -ForegroundColor Green
while ($true) {
    $line = Read-Host "    +"
    if ($line -eq 'done' -or $line -eq '') { break }
    $added += "- $line"
}

Write-Host "  CHANGED (existing features updated):" -ForegroundColor Blue
while ($true) {
    $line = Read-Host "    ~"
    if ($line -eq 'done' -or $line -eq '') { break }
    $changed += "- $line"
}

Write-Host "  FIXED (bugs resolved):" -ForegroundColor Red
while ($true) {
    $line = Read-Host "    !"
    if ($line -eq 'done' -or $line -eq '') { break }
    $fixed += "- $line"
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
if ($fixed.Count -gt 0) {
    $entry += "`n### Fixed`n" + ($fixed -join "`n") + "`n"
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
Write-Host "`nCHANGELOG.md updated." -ForegroundColor Green

# ── 4. Auto-update progress.md file status ────────────────────
$progressPath = "$root\docs\progress.md"
$progressContent = Get-Content $progressPath -Raw

$fileChecks = @{
    "LoginPage.jsx / .css"         = "src\pages\auth\LoginPage.jsx"
    "OtpPage.jsx / .css"           = "src\pages\auth\OtpPage.jsx"
    "MpinPage.jsx / .css"          = "src\pages\auth\MpinPage.jsx"
    "MpinVerifyPage.jsx / .css"    = "src\pages\auth\MpinVerifyPage.jsx"
    "PortalSelectPage.jsx"         = "src\pages\auth\PortalSelectPage.jsx"
    "AddFlatPage.jsx / .css"       = "src\pages\auth\AddFlatPage.jsx"
    "SelectApartmentPage.jsx"      = "src\pages\auth\SelectApartmentPage.jsx"
    "DashboardPage.jsx"            = "src\pages\admin\DashboardPage.jsx"
    "ApartmentGroupPage.jsx"       = "src\pages\admin\ApartmentGroupPage.jsx"
}

$roadmapChecks = @{
    "Login flow"          = "src\pages\auth\MpinVerifyPage.jsx"
    "Add Flat page"       = "src\pages\auth\AddFlatPage.jsx"
    "Select Apartment"    = "src\pages\auth\SelectApartmentPage.jsx"
    "Admin Dashboard"     = "src\pages\admin\DashboardPage.jsx"
}

foreach ($label in $fileChecks.Keys) {
    $filePath = "$root\" + $fileChecks[$label]
    if (Test-Path $filePath) {
        # Replace any variant of "label  [pending marker]" with done marker
        $progressContent = $progressContent -replace ([regex]::Escape($label) + '\s+\S+\s+Pending'), "$label          [Done]"
        $progressContent = $progressContent -replace ([regex]::Escape($label) + '\s+\[Pending\]'), "$label          [Done]"
    }
}

Set-Content $progressPath $progressContent -NoNewline
Write-Host "progress.md status updated." -ForegroundColor Green

# ── 5. Commit message ─────────────────────────────────────────
Write-Host "`nEnter your git commit message:" -ForegroundColor Yellow
$commitMsg = Read-Host "   message"
if ($commitMsg -eq '') { $commitMsg = "update [$date]" }

# ── 6. Stage, commit, push ────────────────────────────────────
git add .
git commit -m $commitMsg
git push origin main

Write-Host "`nPushed to GitHub successfully!`n" -ForegroundColor Green
