@echo off
echo "Press Any Key"
call ./read-me.bat
echo Download will start 3,2,1,Now!!
powershell.exe ./install-scoop.ps1
powershell.exe ./Install-node.js-and-python.ps1
npm i
PAUSE
