@echo off
echo "Press Any Key"
call ./read-me.bat
echo Download will start 3,2,1,Now!!
powershell.exe ./Packages/install-scoop.ps1
powershell.exe ./Packages/Install-node.js-and-python.ps1
scoop update &nodejs&scoop update python&scoop update&npm i
PAUSE

