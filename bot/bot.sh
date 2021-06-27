#!/bin/bash
date >> /home/ec2-user/margonomia/bot/bot.log
killall chromium-browser
sleep 2
nohup python3 -u /home/ec2-user/margonomia/bot/bot.py >> /home/ec2-user/margonomia/bot/bot.log &
