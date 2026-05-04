@echo off
setlocal

set PORT=8000
set URL=http://localhost:%PORT%/

echo Starting local website server...
echo Open %URL%

where py >nul 2>nul
if %ERRORLEVEL%==0 (
  start %URL%
  py -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %ERRORLEVEL%==0 (
  start %URL%
  python -m http.server %PORT%
  goto :eof
)

echo Python was not found on PATH.
echo Install Python, then run this script again.
exit /b 1
