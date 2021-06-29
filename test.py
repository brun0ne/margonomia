import requests
import os

import time
today = time.strftime("%Y-%m-%d %H:%M:%S")

try:
    r = requests.get("https://0.0.0.0/", verify=False, timeout=2)
except:
    open("/home/ec2-user/margonomia/test.log", "a").write(today + " NOT OK\n")
    os.system("/bin/bash /home/ec2-user/margonomia/server.sh >> /home/ec2-user/margonomia/test.log")

if r.status_code != 200:
    open("/home/ec2-user/margonomia/test.log", "a").write(today + " NOT OK\n")
    os.system("/bin/bash /home/ec2-user/margonomia/server.sh >> /home/ec2-user/margonomia/test.log")
else:
    open("/home/ec2-user/margonomia/test.log", "a").write(today + " OK\n")
