import keyboard
import time
from datetime import date, datetime

class Mystakes:
    date = ""
    time = 0
    constant = ""
    position = 0

    def __init__(self, constant, position):
        self.constant = constant
        self.position = position
        self.date = date.today().strftime("%b-%d-%Y")
        self.time = datetime.now().strftime("%H:%M:%S")

mistake = Mystakes("ahhgo", 5)
print(mistake.date)
print(mistake.time)