#!/bin/bash

# create command array
arr=( "git pull")
arr+=("npm install")
arr+=("npm run build")
arr+=("pm2 restart map")
arr+=("git log -1")

for i in "${arr[@]}"
do
    eval $i
    if [ $? != 0 ]
    then
        echo 'Error - exiting script'
        exit 1
    fi
done
