@echo off
echo Creating release package...

set VERSION=1.0.0
set OUTPUT=score-predictor-extension-v%VERSION%.zip

REM Create zip excluding unnecessary files
powershell -Command "Compress-Archive -Path manifest.json,popup.html,scripts,icons\*.png,.gitignore,README.md,QUICKSTART.md,SETUP_COMPLETE.md -DestinationPath %OUTPUT% -Force"

echo.
echo ✅ Package created: %OUTPUT%
echo.
echo Next steps:
echo 1. Go to https://github.com/Ray56monds/score-predictor-extension/releases/new
echo 2. Tag: v%VERSION%
echo 3. Title: Score Predictor Extension v%VERSION%
echo 4. Upload: %OUTPUT%
echo 5. Click "Publish release"
pause
