#!/bin/bash

ssh rsabots.com '

cd /home/ec2-user/rsabots
git pull origin master
npm run build
sudo systemctl restart rsabots.service

'