param([switch]$IncludeWeb)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$stateFile = Join-Path $repoRoot '.local/demo-processes.json'
if (Test-Path -LiteralPath $stateFile) { throw 'Demo state exists. Run npm run demo:stop before starting another demo.' }
$tunnelExe = Join-Path $repoRoot '.local/bin/cloudflared.exe'
if (-not (Test-Path -LiteralPath $tunnelExe)) { throw 'Download cloudflared from the official Cloudflare site into .local/bin/cloudflared.exe first. See docs/CHATGPT_SETUP.md.' }
if (-not (Test-Path -LiteralPath (Join-Path $repoRoot 'apps/mcp-server/dist/server.js'))) { throw 'Run npm run build first.' }
foreach ($port in @(@(3001) + $(if ($IncludeWeb) { @(3000) } else { @() }))) {
  if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { throw "Port $port is already in use. Stop the existing dev server first." }
}
$runDir = Join-Path $repoRoot ('.local/demo-' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())
New-Item -ItemType Directory -Path $runDir -Force | Out-Null
$processes = @()
function Track-Process($process, $role) {
  $script:processes += @{ id=$process.Id; startedAt=$process.StartTime.ToUniversalTime().ToString('o'); role=$role }
}
try {
  $tunnel = Start-Process -FilePath $tunnelExe -ArgumentList @('tunnel','--no-autoupdate','--protocol','http2','--url','http://127.0.0.1:3001') -WorkingDirectory $repoRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runDir 'tunnel.out.log') -RedirectStandardError (Join-Path $runDir 'tunnel.err.log')
  Track-Process $tunnel 'tunnel'
  $origin = $null
  for ($attempt=0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Seconds 1
    $log = Get-Content -LiteralPath (Join-Path $runDir 'tunnel.err.log') -Raw -ErrorAction SilentlyContinue
    if ($log -match 'https://[a-z0-9-]+\.trycloudflare\.com') { $origin=$Matches[0]; break }
    if ($tunnel.HasExited) { throw "Tunnel exited. Inspect $runDir" }
  }
  if (-not $origin) { throw "Tunnel URL not received. Inspect $runDir" }
  $oldOrigin=$env:CONFIA_PUBLIC_BASE_URL; $oldPort=$env:PORT
  try {
    $env:CONFIA_PUBLIC_BASE_URL=$origin; $env:PORT='3001'
    $nodeExe=(Get-Command node).Source
    $backend=Start-Process -FilePath $nodeExe -ArgumentList @('apps/mcp-server/dist/server.js') -WorkingDirectory $repoRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runDir 'mcp.out.log') -RedirectStandardError (Join-Path $runDir 'mcp.err.log')
    Track-Process $backend 'mcp'
  } finally { $env:CONFIA_PUBLIC_BASE_URL=$oldOrigin; $env:PORT=$oldPort }
  for ($attempt=0; $attempt -lt 15; $attempt++) {
    try { $null=Invoke-RestMethod 'http://127.0.0.1:3001/ready'; break } catch { if ($attempt -eq 14) { throw }; Start-Sleep -Seconds 1 }
  }
  if ($IncludeWeb) {
    $web=Start-Process -FilePath $nodeExe -ArgumentList @('node_modules/next/dist/bin/next','start','apps/web','--port','3000') -WorkingDirectory $repoRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $runDir 'web.out.log') -RedirectStandardError (Join-Path $runDir 'web.err.log')
    Track-Process $web 'web'
  }
  @{ origin=$origin; mcpUrl="$origin/mcp"; logDirectory=$runDir; processes=$processes } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $stateFile
  Write-Output "ChatGPT MCP URL: $origin/mcp"
  Write-Output 'Authentication: None (synthetic read-only demo only).'
  if ($IncludeWeb) { Write-Output 'Business demo: http://localhost:3000/dashboard' }
  Write-Output 'Keep this computer awake. Stop with npm run demo:stop.'
} catch {
  foreach ($record in $processes) { $process=Get-Process -Id $record.id -ErrorAction SilentlyContinue; if ($process -and $process.StartTime.ToUniversalTime().ToString('o') -eq $record.startedAt) { Stop-Process -Id $process.Id } }
  throw
}
