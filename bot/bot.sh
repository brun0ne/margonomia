#!/bin/bash
date >> /home/ec2-user/margonomia/bot/bot.log
killall chromedriver
sleep 1
killall chromium-browser
sleep 1
pkill -o chromium
sleep 2
nohup python3 -u /home/ec2-user/margonomia/bot/bot.py >> /home/ec2-user/margonomia/bot/bot.log &
