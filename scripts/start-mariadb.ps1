# Arranca MariaDB local en el puerto 3307 (AsisMediCare)
$mysqld = "C:\Program Files\MariaDB 12.3\bin\mysqld.exe"
$datadir = "C:\Program Files\MariaDB 12.3\data"
$port = 3307

$listening = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($listening) {
  Write-Host "MariaDB ya escucha en el puerto $port"
  exit 0
}

if (-not (Test-Path $mysqld)) {
  Write-Error "No se encontro mysqld en $mysqld"
  exit 1
}

Write-Host "Iniciando MariaDB en puerto $port..."
Start-Process -FilePath $mysqld -ArgumentList "--datadir=`"$datadir`"","--port=$port","--console" -WindowStyle Hidden
Start-Sleep -Seconds 4
$ok = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($ok) {
  Write-Host "OK: MariaDB en 127.0.0.1:$port"
} else {
  Write-Error "No se pudo verificar el puerto $port"
  exit 1
}
