killall python3
sleep 2
nohup python3 -u server.py >> server.log 2>&1 &
nohup python3 -u redirect.py 80 https://margonomia.pl &
