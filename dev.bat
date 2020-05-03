setx jobname "timelapse"
setx jobpath %%CD%%
rem
mosquitto_pub -q 1 -h %awsip% -p 1884 -u ubuntu -P %%pw%% -t "status" -m "jobname=:=timelapse"
start "timelapse" cmd /k "color 80 & %%main%%\DOS\admin.cmd \"%%programfiles%%\\JetBrains\WebStorm\bin\webstorm64.exe\" %CD%"
