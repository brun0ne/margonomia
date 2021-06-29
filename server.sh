killall python3
sleep 2
nohup python3 -u /home/ec2-user/margonomia/server.py >> /home/ec2-user/margonomia/server.log 2>&1 &
nohup python3 -u /home/ec2-user/margonomia/redirect.py 80 https://margonomia.pl &
