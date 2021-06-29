import http.server, ssl
from http.server import BaseHTTPRequestHandler, HTTPServer
import time

from urllib.parse import urlparse
from urllib.parse import unquote

import json

import matplotlib
import matplotlib.pyplot as plt

import mpld3

import base64

import os

import stats

import importlib

hostName = "0.0.0.0"
serverPort = 443

PATH = "/home/ec2-user/margonomia/"

# BiegnacyDzik
# PlywajacyKrolik

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Access-Control-Allow-Origin", "https://aether.margonem.pl")
        self.end_headers()

        # print(self.headers)

        COMMAND = urlparse(self.path).path[1:]

        query = urlparse(self.path).query

        args = []
        if "?" in self.path and len(query) > 0:
            if query[-1] == "&":
                query = query[:-1]

            args = dict(qc.split("=") for qc in query.split("&"))

        print(COMMAND, args)

        if COMMAND == "save_price":
            self.save_price(args)
        elif COMMAND == "get_graph":
            self.get_graph(args)
        elif COMMAND == "get_items":
            self.get_items(args)
        elif COMMAND == "about":
            self.about(args)
        elif COMMAND == "suggestion":
            self.suggestion(args)
        elif COMMAND == "particles.min.js":
            self.wfile.write(bytes(open(PATH + "particles.min.js").read(), "utf-8"))
        elif COMMAND == "particles.config.json":
            self.wfile.write(bytes(open(PATH + "particles.config.json").read(), "utf-8"))
        elif COMMAND == "suggestions":
            self.wfile.write(bytes("<html><head><meta charset='utf-8'></head><body>" + open(PATH + "suggestions.txt").read() + "</body></html>", "utf-8"))
        elif COMMAND == "stats":
            if args["q"] != "abc123":
                return False

            importlib.reload(stats)
            self.wfile.write(bytes(stats.stats_f(["", "-c"]), "utf-8"))
        elif COMMAND == "":
            self.main(args)

    def save_price(self, args):
        password = args["pass"]

        if password != "asmxSdnaxlD231":
            return False

        filename = args["search"] + ".prices"

        line = {}
        line["price"] = args["price"]
        line["time"] = args["time"]

        if args["price"] == None or args["time"] == None or args["search"] == None:
            return False

        s = json.dumps(line)

        file = open(PATH + "prices/" + filename, "a")
        file.write(s + "\n")
        file.close()

    def get_graph(self, args):
        file = open(PATH + "prices/" + args["item"] + ".prices", "r")

        dates = []
        prices = []

        lines = file.readlines()

        for line in lines:
            line = json.loads(line)
            dates.append(line["time"].split(".")[0].replace("%20", " "))
            prices.append(int(line["price"]))

        dates = matplotlib.dates.date2num(dates)

        SIZE_X = int(args["SIZE_X"])
        SIZE_Y = int(args["SIZE_Y"])
        fig, ax = plt.subplots(figsize=(SIZE_X, SIZE_Y))

        plt.title(unquote(args["item"]))
        # plt.ylabel("Cena")
        # plt.xlabel("Czas")

        ax.plot(dates, prices, zorder=0)

        # ax.scatter(dates, prices, s=5, c='w', marker='o', zorder=5)
        ax.scatter(dates[-1], prices[-1], s=20, c='w', marker='o', zorder=5)

        plt.tight_layout()

        plt.gcf().subplots_adjust(left=0.05)

        ax.xaxis_date()

        html_str = mpld3.fig_to_html(fig)

        self.wfile.write(base64.b64encode(bytes(html_str, "utf-8")))

        plt.close('all')

    def get_items(self, args):
        files = os.listdir(PATH + "prices/")
        files.sort()
        items = []

        for n in files:
            items.append(unquote(n.split(".prices")[0]))

        self.wfile.write(base64.b64encode(bytes(json.dumps(items), "utf-8")))

    def suggestion(self, args):
        text = args["text"]

        if text == "" or text == None:
            return False

        file = open(PATH + "suggestions.txt", "a")
        file.write(unquote(text.replace("\n", "")) + "\n")
        file.close()

    def about(self, args):
        HTML = open(PATH + "about.html", "r").read()
        self.wfile.write(bytes(HTML, "utf-8"))

    def main(self, args):
        HTML = open(PATH + "main.html", "r").read()
        self.wfile.write(bytes(HTML, "utf-8"))


if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)

    webServer.socket = ssl.wrap_socket(webServer.socket,
         keyfile=PATH+"key.key",
         certfile=PATH+'cert.crt', server_side=True)

    print("Server started https://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
