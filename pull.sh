#!/bin/bash


# create command array
# arr=( "git pull")
# arr+=("npm install")
# arr+=("REACT_APP_GIT_HASH=$(git rev-parse --short HEAD) npm run build")
# arr+=("pm2 restart ecosystem.config.js")
# arr+=("git log -1")

cp public/maintenance-page-min.html public/maintenance.html
if [ $? != 0 ]
then
    echo 'Error - exiting script'
    exit 1
fi

git pull
if [ $? != 0 ]
then
    echo 'Error - exiting script'
    exit 1
fi
npm install
if [ $? != 0 ]
then
    echo 'Error - exiting script'
    exit 1
fi
REACT_APP_GIT_HASH=$(git rev-parse --short HEAD) npm run build
if [ $? != 0 ]
then
    echo 'Error - exiting script'
    exit 1
fi
pm2 restart ecosystem.config.js
if [ $? != 0 ]
then
    echo 'Error - exiting script'
    exit 1
fi

rm  public/maintenance.html
if [ $? != 0 ]
then
    echo 'Error - exiting script'
    exit 1
fi

git log -1


# $(git rev-parse --short HEAD) GIT_HASH=$(git rev-parse --short HEAD) pm2 restart ecosystem.config.js

# pm2 command for map:
# NODE_ENV=production pm2 start --name map node server/server.js

# for i in "${arr[@]}"
# do
#     eval $i
#     if [ $? != 0 ]
#     then
#         echo 'Error - exiting script'
#         exit 1
#     fi
# done

