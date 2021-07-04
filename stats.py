#!/usr/bin/env python3

from urllib.parse import unquote
import matplotlib.cm as cm

import sys

import subprocess

PATH = "/home/ec2-user/margonomia/"

def ftail(f, n):
    proc = subprocess.Popen(['tail', '-n', str(n), f], stdout=subprocess.PIPE)
    lines = proc.stdout.readlines()
    return lines

def color(s):
    r = lambda x: int(round((float(hash(x) % 256) / 256)*600))

    c = cm.hot(r(s))

    return '#%02X%02X%02X' % (int(c[0]*100),int(c[1]*100),int(c[2]*100))

def stats_f(args):
    file = open(PATH + "server.log", "r")

    lines = file.readlines()

    file.close()

    CENSOR = (len(args) > 1) and (args[1] == "-c")

    res = ""

    count = 0

    IPs = {}

    prevday = 0

    for line in lines:
        if "27/Jun/2021" in line or "28/Jun/2021 01:10" in line or "no_stats" in line: # filter out debug
            continue

        if ("31.2.125.206" not in line) and ("35.178.138.241" not in line) and ("66.249.65." not in line) and ("37.7.81.6" not in line) and ("66.249.75." not in line) and ("77.112.20.11" not in line) and ("95.41.115." not in line) and ("GET /get_graph?item=" in line) :
            IP = line.split(" - - ")[0]
            item = unquote(line.split("get_graph?item=")[1].split("&SIZE_X=")[0])
            d = line.split(" [")[1].split("] ")[0]

            HEX = color(IP)

            if prevday == 0:
                res += "<center><b>" + d.split(" ")[0].replace("/", " ") + "</b></center><br />"

            day = d.split("/")[0]
            if day != prevday and prevday != 0:
                res += "<hr><center><b>" + d.split(" ")[0].replace("/", " ") + "</b></center><br />"
            prevday = day

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

            day = d.split("/")[0]
            if day != prevday and prevday != 0:
                res += "<hr><center><b>" + d.split(" ")[0].replace("/", " ") + "</b></center><br />"
            prevday = day

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

        if ("31.2.125.206" not in line) and ("35.178.138.241" not in line) and ("77.112.20.11" not in line) and (" /about" in line):
            IP = line.split(" - - ")[0]
            d = line.split(" [")[1].split("] ")[0]

            HEX = color(IP)

            day = d.split("/")[0]
            if day != prevday and prevday != 0:
                res += "<hr><center><b>" + d.split(" ")[0].replace("/", " ") + "</b></center><br />"
            prevday = day

            if CENSOR:
                parts = IP.split(".")
                # try:
                new_ip = parts[0] + ".*.*." + parts[3]
                # except:
                # print("ERR")
                # print(parts)

                l = 40 - len(new_ip)*2

                r = d + "&nbsp"*20 + "<span style='color: " + HEX + "'>" + new_ip + "</span>" + "&nbsp"*l + "<b>ABOUT</b>"
            else:
                r = d + " "*10 + IP + " "*l + "<b>ABOUT</b>"

            if CENSOR == False:
                print(r)
            res += r + "\n"

            count += 1
            IPs[IP] = 1

        if ("31.2.125.206" not in line) and ("35.178.138.241" not in line) and ("/log?target=" in line):
            IP = line.split(" - - ")[0]
            target = unquote(line.split("log?target=")[1].split("& HTTP")[0])
            d = line.split(" [")[1].split("] ")[0]

            HEX = color(IP)

            day = d.split("/")[0]
            if day != prevday and prevday != 0:
                res += "<hr><center><b>" + d.split(" ")[0].replace("/", " ") + "</b></center><br />"
            prevday = day

            if CENSOR:
                parts = IP.split(".")
                new_ip = parts[0] + ".*.*." + parts[3]

                l = 40 - len(new_ip)*2

                r = d + "&nbsp"*20 + "<span style='color: " + HEX + "'>" + new_ip + "</span>" + "&nbsp"*l + "<b>LOG: </b>" + target
            else:
                r = d + " "*10 + IP + " "*l + "<b>LOG: </b>" + target

            if CENSOR == False:
                print(r)
            res += r + "\n"

            count += 1
            IPs[IP] = 1

    if CENSOR:
        head = "<html><head><meta charset='utf-8'></head><body>"
        tail = "<br /></body></html>"

        REST = "<hr><center><b>Bot</b></center>"

        bot_log = ftail("/home/ec2-user/margonomia/bot/bot.log", 10)

        for n in bot_log:
            REST += str( n.decode("utf-8") )

        REST += "<br /><hr><center><b>Tests</b></center>"

        test_log = ftail("/home/ec2-user/margonomia/test.log", 15)

        for n in test_log:
            REST += str( n.decode("utf-8") )

        REST += "<br /><hr><center><b>Prices</b></center>"

        price_log = ftail("/home/ec2-user/margonomia/prices/G%C5%82owa%20zbira.prices", 10)

        for n in price_log:
            REST += str( n.decode("utf-8") ).replace("%20", " ")

        REST += "<br /><hr><center><b>Stats</b></center>"

        ram_file = open("/home/ec2-user/margonomia/memory.txt", "r")
        ram = ram_file.read()
        ram_file.close()

        REST += "<b>RAM: </b>" + ram[:-1] + " %<br />"

        suggestions_file = open("/home/ec2-user/margonomia/suggestions.txt", "r")
        suggestions = suggestions_file.readlines()
        suggestions_file.close()

        return head + res.replace("\n", "<br />") + "<br /><b>Count: </b>" + str(count) + "<br /><b>Unique IPs: </b>" + str(len(IPs)) + "<br /><b>Suggestions: </b>" + str(len(suggestions)) + "<br /><br />" + REST.replace("\n", "<br />") + tail
    else:
        return res + "\n!! Count: " + str(count) + "\n!! Unique IPs: " + str(len(IPs))

if __name__ == '__main__':
    stats_f(sys.argv)
