killall -s SIGINT python3
nohup python3 -u server.py >> server.log 2>&1 &
nohup python3 -u redirect.py 80 https://margonomia.pl &
