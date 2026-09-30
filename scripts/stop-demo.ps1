$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
$stateFile=Join-Path $repoRoot '.local/demo-processes.json'
if (-not (Test-Path -LiteralPath $stateFile)) { Write-Output 'No managed demo is running.'; exit }
$state=Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
foreach ($record in $state.processes) {
  $process=Get-Process -Id $record.id -ErrorAction SilentlyContinue
  if ($process -and $process.StartTime.ToUniversalTime().ToString('o') -eq $record.startedAt) { Stop-Process -Id $process.Id; Write-Output "Stopped $($record.role)" }
}
Remove-Item -LiteralPath $stateFile
