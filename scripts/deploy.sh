#!/bin/bash

if [[ $1 = "--dry-run=0" ]] 
then
    ssh rsabots.com '

    cd /home/ec2-user/rsabots
    git pull origin master
    npm install
    npm run build
    sudo systemctl restart rsabots.service

    '
else
    echo 'Run with --dry-run=0 to do anything.'
fi