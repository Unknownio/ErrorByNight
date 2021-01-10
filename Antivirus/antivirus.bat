@echo off
title Antivirus
echo Antivirus
echo created by: Unknownio
:start
echo enter your file name
set /p name=
echo the name you have entered of file us %name%
if EXIST %name% goto infected
if NOT EXIST %name% goto clean
cd D:
:infected
echo WARNING VIRUS DETECTED !
DEL %name%
pause
goto start
:clean
echo System secure !
pause
exit