#Requires -Version 5.1
<#
.SYNOPSIS
  Halix Cloud — Windows installer (interactive subset).

.DESCRIPTION
  Clones the repo (or uses current tree with -FromRepo), writes docker/.env and apps/api|web/.env,
  starts Docker Compose, npm install, prisma db push, and prisma db seed (first admin + optional PVE).

  Requires: Docker Desktop, Node.js 18+, npm, Git.

.EXAMPLE
  cd D:\H
  .\install\halix-install.ps1 -FromRepo
#>
param(
    [string]$HalixRepoUrl = "https://github.com/your-org/halix-cloud.git",
    [string]$InstallRoot = "C:\halix-cloud",
    [switch]$FromRepo
)

$ErrorActionPreference = "Stop"

function Require-GitUrl([string]$u) {
    if ($u -notmatch '\.git$') { throw "Repository URL must end with .git (got: $u)" }
}

function New-RandomHex([int]$byteCount = 32) {
    $b = New-Object byte[] $byteCount
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
    -join ($b | ForEach-Object { $_.ToString("x2") })
}

Require-GitUrl $HalixRepoUrl

if (-not $FromRepo) {
    if (Test-Path $InstallRoot) {
        throw "Path already exists: $InstallRoot. Remove it or use -FromRepo from an existing clone."
    }
    git clone --depth 1 $HalixRepoUrl $InstallRoot
    Set-Location $InstallRoot
}
else {
    $InstallRoot = Split-Path $PSScriptRoot -Parent
    Set-Location $InstallRoot
    Write-Host "[*] Using repository: $InstallRoot"
}

$dbUser = Read-Host "PostgreSQL user [halix]"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "halix" }
$dbName = Read-Host "PostgreSQL database [halix]"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "halix" }
$dbSec = Read-Host "PostgreSQL password" -AsSecureString
$BSTR = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbSec)
$dbPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR) | Out-Null
if ([string]::IsNullOrWhiteSpace($dbPass)) { throw "Database password required" }

$pgPort = Read-Host "Postgres host port [5432]"
if ([string]::IsNullOrWhiteSpace($pgPort)) { $pgPort = "5432" }
$rdPort = Read-Host "Redis host port [6379]"
if ([string]::IsNullOrWhiteSpace($rdPort)) { $rdPort = "6379" }

$apiPort = Read-Host "API port [4000]"
if ([string]::IsNullOrWhiteSpace($apiPort)) { $apiPort = "4000" }
$webPort = Read-Host "Web port [3000]"
if ([string]::IsNullOrWhiteSpace($webPort)) { $webPort = "3000" }

$panelUrl = Read-Host "Panel URL for CORS [http://127.0.0.1:$webPort]"
if ([string]::IsNullOrWhiteSpace($panelUrl)) { $panelUrl = "http://127.0.0.1:$webPort" }
$apiPublic = Read-Host "Public API URL for browser [$panelUrl]"
if ([string]::IsNullOrWhiteSpace($apiPublic)) { $apiPublic = $panelUrl }

$jwtA = New-RandomHex 32
$jwtR = New-RandomHex 32

$dockerDir = Join-Path $InstallRoot "docker"
if (-not (Test-Path $dockerDir)) { New-Item -ItemType Directory -Path $dockerDir | Out-Null }
@"
HALIX_DB_USER=$dbUser
HALIX_DB_PASSWORD=$dbPass
HALIX_DB_NAME=$dbName
HALIX_PG_PORT=$pgPort
HALIX_REDIS_PORT=$rdPort
"@ | Set-Content -Path (Join-Path $dockerDir ".env") -Encoding UTF8

@"
NODE_ENV=production
PORT=$apiPort
DATABASE_URL=postgresql://${dbUser}:${dbPass}@127.0.0.1:${pgPort}/${dbName}?schema=public
REDIS_URL=redis://127.0.0.1:${rdPort}
JWT_ACCESS_SECRET=$jwtA
JWT_REFRESH_SECRET=$jwtR
JWT_ACCESS_TTL=900s
JWT_REFRESH_TTL=30d
CORS_ORIGIN=$panelUrl
PROXMOX_DEFAULT_VERIFY_TLS=true
"@ | Set-Content -Path (Join-Path $InstallRoot "apps\api\.env") -Encoding UTF8

@"
NEXT_PUBLIC_API_URL=$apiPublic
NEXT_PUBLIC_SOCKET_URL=$apiPublic
"@ | Set-Content -Path (Join-Path $InstallRoot "apps\web\.env") -Encoding UTF8

$composeFile = Join-Path $InstallRoot "docker\docker-compose.yml"
$envFile = Join-Path $dockerDir ".env"
Write-Host "[*] Starting Docker Compose..."
docker compose -f $composeFile --env-file $envFile up -d
Start-Sleep -Seconds 6

Write-Host "[*] npm install..."
Set-Location $InstallRoot
npm install

Write-Host "[*] Prisma generate + db push..."
Set-Location (Join-Path $InstallRoot "apps\api")
npx prisma generate
npx prisma db push --accept-data-loss

$adminEmail = Read-Host "Admin email [admin@localhost]"
if ([string]::IsNullOrWhiteSpace($adminEmail)) { $adminEmail = "admin@localhost" }
$admSec = Read-Host "Admin password (min 12 chars)" -AsSecureString
$BSTR2 = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($admSec)
$adminPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR2)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR2) | Out-Null
if ($adminPass.Length -lt 12) { throw "Admin password must be at least 12 characters" }

$env:INSTALL_ADMIN_EMAIL = $adminEmail
$env:INSTALL_ADMIN_PASSWORD = $adminPass

$pve = Read-Host "Proxmox FQDN (optional, Enter to skip)"
if (-not [string]::IsNullOrWhiteSpace($pve)) {
    $env:INSTALL_PVE_FQDN = $pve
    $env:INSTALL_PVE_NODE_NAME = Read-Host "Node display name [Proxmox]"
    if ([string]::IsNullOrWhiteSpace($env:INSTALL_PVE_NODE_NAME)) { $env:INSTALL_PVE_NODE_NAME = "Proxmox" }
    $env:INSTALL_PVE_REALM = Read-Host "Realm [pam]"
    if ([string]::IsNullOrWhiteSpace($env:INSTALL_PVE_REALM)) { $env:INSTALL_PVE_REALM = "pam" }
    $env:INSTALL_PVE_API_USER = Read-Host "API user [root@pam]"
    if ([string]::IsNullOrWhiteSpace($env:INSTALL_PVE_API_USER)) { $env:INSTALL_PVE_API_USER = "root@pam" }
    $env:INSTALL_PVE_TOKEN_ID = Read-Host "Token ID [installer]"
    if ([string]::IsNullOrWhiteSpace($env:INSTALL_PVE_TOKEN_ID)) { $env:INSTALL_PVE_TOKEN_ID = "installer" }
    $ts = Read-Host "Token secret" -AsSecureString
    $BSTR3 = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($ts)
    $env:INSTALL_PVE_TOKEN_SECRET = [Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR3)
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR3) | Out-Null
    $v = Read-Host "Verify TLS for PVE API (Y/n) [Y]"
    if ($v -match '^[Nn]') { $env:INSTALL_PVE_VERIFY_TLS = "false" } else { $env:INSTALL_PVE_VERIFY_TLS = "true" }
}
else {
    foreach ($k in @(
        'INSTALL_PVE_FQDN','INSTALL_PVE_NODE_NAME','INSTALL_PVE_REGION','INSTALL_PVE_REALM',
        'INSTALL_PVE_API_USER','INSTALL_PVE_TOKEN_ID','INSTALL_PVE_TOKEN_SECRET','INSTALL_PVE_VERIFY_TLS'
    )) { Remove-Item "Env:$k" -ErrorAction SilentlyContinue }
}

Write-Host "[*] prisma db seed..."
npx prisma db seed

Write-Host ""
Write-Host "[OK] Halix install finished."
Write-Host "  API .env:  $(Join-Path $InstallRoot 'apps\api\.env')"
Write-Host "  Web .env:  $(Join-Path $InstallRoot 'apps\web\.env')"
Write-Host "  Next: npm run dev:api (from repo) and npm run dev"
Write-Host "  For systemd + nginx snippets, run install/halix-install.sh on Linux."
