#!/usr/bin/env python3

from urllib.parse import unquote
import matplotlib.cm as cm

import sys

def color(s):
    r = lambda x: int(round((float(hash(x) % 256) / 256)*600))

    c = cm.hot(r(s))

    return '#%02X%02X%02X' % (int(c[0]*100),int(c[1]*100),int(c[2]*100))

def stats_f(args):
    file = open("server.log", "r")

    lines = file.readlines()

    CENSOR = (len(args) > 1) and (args[1] == "-c")

    res = ""

    count = 0

    IPs = {}

    for line in lines:
        if "27/Jun/2021" in line or "28/Jun/2021 01:10" in line: # filter out debug
            continue

        if ("31.2.125.206" not in line) and ("35.178.138.241" not in line) and ("GET /get_graph?item=" in line) :
            IP = line.split(" - - ")[0]
            item = unquote(line.split("get_graph?item=")[1].split("&SIZE_X=")[0])
            d = line.split(" [")[1].split("] ")[0]

            HEX = color(IP)

            if CENSOR:
                parts = IP.split(".")
                new_ip = parts[0] + ".*.*." + parts[3]

                l = 40 - len(new_ip)*2

                r = d + "&nbsp"*20 + "<span style='color: " + HEX +  "'>" + new_ip + "</span>" + "&nbsp"*l + item
            else:
                l = 20 - len(IP)

                r = d + " "*10 + IP + " "*l + item

            if CENSOR == False:
                print(r)
            res += r + "\n"

            count += 1
            IPs[IP] = 1

        if ("GET /suggestion?" in line):
            IP = line.split(" - - ")[0]
            sug = unquote(line.split("suggestion?text=")[1].split("& HTTP")[0])
            d = line.split(" [")[1].split("] ")[0]

            HEX = color(IP)

            if CENSOR:
                parts = IP.split(".")
                new_ip = parts[0] + ".*.*." + parts[3]

                l = 40 - len(new_ip)*2

                r = d + "&nbsp"*20 + "<span style='color: " + HEX + "'>" + new_ip + "</span>" + "&nbsp"*l + "<b>SUGGESTION: </b>" + sug
            else:
                r = d + " "*10 + IP + " "*l + "<b>SUGGESTION: </b>" + sug

            if CENSOR == False:
                print(r)
            res += r + "\n"

            count += 1
            IPs[IP] = 1

        if ("31.2.125.206" not in line) and ("35.178.138.241" not in line) and ("/about" in line):
            IP = line.split(" - - ")[0]
            d = line.split(" [")[1].split("] ")[0]

            HEX = color(IP)

            if CENSOR:
                parts = IP.split(".")
                new_ip = parts[0] + ".*.*." + parts[3]

                l = 40 - len(new_ip)*2

                r = d + "&nbsp"*20 + "<span style='color: " + HEX + "'>" + new_ip + "</span>" + "&nbsp"*l + "<b>ABOUT</b>"
            else:
                r = d + " "*10 + IP + " "*l + "<b>ABOUT</b>"

            if CENSOR == False:
                print(r)
            res += r + "\n"

            count += 1
            IPs[IP] = 1

    file.close()

    if CENSOR:
        head = "<html><head><meta charset='utf-8'></head><body>"
        tail = "</body></html>"

        return head + res.replace("\n", "<br />") + tail + "<br /><b>Count: </b>" + str(count) + "<br /><b>Unique IPs: </b>" + str(len(IPs)) + "<br /><br />"
    else:
        return res + "\n!! Count: " + str(count) + "\n!! Unique IPs: " + str(len(IPs))

if __name__ == '__main__':
    stats_f(sys.argv)
