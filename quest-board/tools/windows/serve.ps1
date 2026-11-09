# Minimal static file server for testing the game locally: serve.ps1 -Root <folder> [-Port 8765]
# Listens on localhost only. Every response is no-cache so a rebuild shows up on reload.
param([Parameter(Mandatory = $true)][string]$Root, [int]$Port = 8765)
$ErrorActionPreference = 'Stop'
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.json' = 'application/json'
  '.webp' = 'image/webp'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.svg' = 'image/svg+xml'; '.css' = 'text/css'
  '.webmanifest' = 'application/manifest+json'; '.ico' = 'image/x-icon'; '.txt' = 'text/plain; charset=utf-8'
}
$rootFull = [System.IO.Path]::GetFullPath($Root).TrimEnd('\') + '\'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "serving $rootFull on http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $res = $ctx.Response
  try {
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ($path.EndsWith('/')) { $path += 'index.html' }
    $file = [System.IO.Path]::GetFullPath((Join-Path $rootFull $path.TrimStart('/')))
    if (-not $file.StartsWith($rootFull, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $file -PathType Leaf)) {
      $res.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes('not found')
    } else {
      $ext = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
      $res.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' })
      $bytes = [System.IO.File]::ReadAllBytes($file)
    }
    $res.AddHeader('Cache-Control', 'no-cache')
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    try { $res.StatusCode = 500 } catch {}
  } finally {
    try { $res.OutputStream.Close() } catch {}
  }
}
