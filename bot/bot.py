from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options

# from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

import time
import os

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")

PASSWORD = "hkaslwans123"

# dc = DesiredCapabilities.CHROME
# dc['goog:loggingPrefs'] = { 'browser':'ALL' }

driver = webdriver.Chrome(executable_path="/home/ec2-user/margonomia/bot/chromedriver", options=chrome_options)

driver.get("http://margonem.pl")


def log_in():
    login = driver.find_element_by_name("login")
    login.send_keys("BiegnacyDzik")

    password = driver.find_element_by_name("password")
    password.send_keys(PASSWORD)

    time.sleep(0.5)

    submit_button = driver.find_element_by_xpath('//input[@value="Zaloguj się"]')
    ActionChains(driver).click(submit_button).perform()


def join():
    join_button = driver.find_elements_by_class_name("enter-game")[0]
    ActionChains(driver).click(join_button).perform()

    time.sleep(0.5)

    driver.delete_cookie("interface")
    driver.add_cookie({"name": "interface", "value": "si"})

    time.sleep(0.2)

    driver.get("https://aether.margonem.pl")


def bot():
    file = open("/home/ec2-user/margonomia/bot/margonomia-SI.js", "r", encoding="utf8")
    script = file.read()
    file.close()
    driver.execute_script(script)


def quit_driver_and_reap_children(driver):
    print('Quitting session: ' + str(driver.session_id))
    driver.quit()
    try:
        pid = True
        while pid:
            pid = os.waitpid(-1, os.WNOHANG)
            print("Reaped child: " + str(pid))

            try:
                if pid[0] == 0:
                    pid = False
            except:
                pass

    except ChildProcessError:
        pass


log_in()
time.sleep(0.5)
join()
time.sleep(3)
bot()

print("Working")

time.sleep(60*5)

# log_file = open("/home/ec2-user/margonomia/bot/script.log", "a")
# for e in driver.get_log('browser'):
#     log_file.write(str(e) + "\n")
# log_file.close()

quit_driver_and_reap_children(driver)
