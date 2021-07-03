def get_weird():
    file = open("/home/ec2-user/margonomia/server.log", "r")

    lines = file.readlines()

    GOOD = [
        "/about" ,
        "/log" ,
        "/favicon.ico" ,
        "/stats" ,
        "/ HTTP" ,
        "/particles.min.js" ,
        "/particles.config.json" ,
        "/get_additions" ,
        "/get_items" ,
        "/get_graph" ,
        "/test" ,
        "/suggestion" ,
        "/save_price",
        "/weird",
        "/loading.svg",
        "/loading.gif"
    ]

    res = ""

    for line in lines:
        x = False
        for n in GOOD:
            if n in line:
                x = True
                break

        if x == True:
            continue

        if "HTTP/" in line:
            # print(line[:-1])
            res += line[:-1] + "<br />"

    file.close()
    return res

if __name__ == '__main__':
    get_weird()
