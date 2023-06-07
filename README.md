# Margonomia
**Web app** and **periodically running bot** providing price history for in-game auction items inside [Margonem MMORPG](https://www.margonem.pl/).

It was up for a year on https://margonomia.pl

## Showcase
### Bot
![Bot showcase](misc/bot.gif)
### Web App
![Web app showcase](misc/webapp.gif)

## Installation
First clone this repo:
```console
$ git clone https://github.com/brun0ne/margonomia
```
Install [Python](https://www.python.org/downloads/). This code was tested on **Python 3.8**.
#### Bot
To run the bot, install [Chrome](https://www.google.com/intl/pl_pl/chrome/) and put the right version of [chromedriver](https://chromedriver.chromium.org/) into /bot.
To start it, run inside /bot:
```console
$ python3 -m pip install -r requirements.txt
$ python3 bot.py
```

By default it will open a browser window, but it can also run in **headless mode**. Just uncomment this line in bot.py:
```python
chrome_options.add_argument("--headless")
```

You also have to edit the `USERNAME` and `PASSWORD` variables and position your bot correctly as shown in the first GIF.
#### Web App
To start the server run these commands inside /webserver:
```console
$ python3 -m pip install -r requirements.txt
$ python3 server.py
```
## Ethics
Garmory (the company running Margonem) generally doesn't like bots, but this one was made only to gather anonymous, public data which can be later used for same academic studies. It doesn't automate any relevant part of the game and doesn't use up much of Margonem's resources - it's only one player checking auctions once in a while.

In any case, bots of any kind are not allowed in Margonem, so if you run Margonomia, you do it at your own responsibility and risk a ban.
## License
This project is licensed under the terms of the MIT license.
