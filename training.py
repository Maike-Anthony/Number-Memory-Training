import keyboard
import time
from datetime import date, datetime
import os
from decimal import Decimal
import csv

class Constants:
    def __init__(self):
        self.cons = []
        while True:
            try:
                f = open("Constants.txt", "r")
                break
            except FileNotFoundError:
                f = open("Constants.txt", "a")
        reader = f.readlines()
        for line in reader:
            self.cons.append(line.strip("\n"))
        if len(self.cons) == 0:
            print("You need to add some constant first.")
            self.setconst()
        f.close()
    
    def setconst(self):
        name = input("Insert the number's name: ").strip().capitalize()
        while True:
            try:
                digits = input("Paste its decimal places: ")
                test = int(digits)
                if test < 0:
                    print("Please, don't type the minus sign.")
                else:
                    break
            except ValueError:
                print("Please, type only the decimal places.")
        with open("Constants.txt", "a") as names:
            names.write(name + "\n")
        self.cons.append(name)
        with open(name + ".txt", "w") as number:
            number.write(digits)

    def delconst(self, index):
        question = yorn("Are you sure you want to delete " + constant.getconst(index) + "?")
        if question == False:
            return
        number = self.getconst(index)
        self.cons.pop(index)
        with open("Constants.txt", "r") as f:
            oldlines = f.readlines()
        with open("Constants.txt", "w") as f:
            for line in oldlines:
                if line.strip("\n") != number:
                    f.write(line)
        if os.path.isfile(number + ".txt"):
            os.remove(number + ".txt")

    def getconst(self, index):
        return self.cons[index]
    
    @property
    def getlist(self):
        return self.cons
    
    def __str__(self) -> str:
        text = ""
        for i in range(len(constant.getlist)):
            text += (str(i+1)) + ". " + constant.getconst(i) + "\n"
        return text
        

class Mistakes:
    def __init__(self, constant, position, expected, received):
        self.date = date.today().strftime("%b-%d-%Y")
        self.time = datetime.now().strftime("%H:%M:%S")
        self.constant = str(constant)
        self.position = str(position)
        self.expected = str(expected)
        self.received = str(received)
        self.data = {
            "date": self.date, "time": self.time, "constant": self.constant, "position": self.position, "expected": self.expected, "received": self.received
            }
        self.register()

    def register(self):
        filename = self.constant + "_mistakes.csv"
        fieldnames = ["date", "time", "constant", "position", "expected", "received"]
        exists = False
        try:
            f = open(filename, "r")
            f.close()
            exists = True
        except FileNotFoundError:
            pass
        with open(filename, "a", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not exists:
                writer.writeheader()
            writer.writerow(self.data)

class Performance:
    def __init__(self, constant, start):
        self.date = date.today().strftime("%b-%d-%Y")
        self.time = datetime.now().strftime("%H:%M:%S")
        self.startposition = start
        self.digits = 0
        self.mistakes = 0
        self.constant = str(constant)
        
    def digitscounter(self):
        self.digits += 1

    def mistakescounter(self, expecteddigit, receiveddigit, position):
        self.mistakes += 1
        mistake = Mistakes(constant = self.constant, position = position, expected = expecteddigit, received = receiveddigit)

    def start(self):
        self.starttime = datetime.now()

    def stop(self):
        self.end = datetime.now()
        subtraction = self.end - self.starttime
        hours, remainder = divmod(subtraction.total_seconds(), 3600)
        minutes, seconds = divmod(remainder, 60)
        self.duration = f"{hours:02.0f}:{minutes:02.0f}:{seconds:02.0f}"
        if (Decimal(self.digits) + Decimal(self.mistakes)) != 0:
            self.rate = ((Decimal(self.digits) / (Decimal(self.digits) + Decimal(self.mistakes)))* 100).quantize(Decimal("0.01"))
        else:
            self.rate = 0
        self.data = {
            "date": self.date, "time": self.time, "constant": self.constant, "duration": self.duration, "start position": self.startposition, "# correct digits": self.digits, "# mistakes": self.mistakes, "accuracy rate": self.rate
        }
        self.register()

    def register(self):
        filename = self.constant + "_performance.csv"
        fieldnames = ["date", "time", "constant", "duration", "start position", "# correct digits", "# mistakes", "accuracy rate"]
        exists = False
        try:
            f = open(filename, "r")
            f.close()
            exists = True
        except FileNotFoundError:
            pass
        with open(filename, "a", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not exists:
                writer.writeheader()
            writer.writerow(self.data)

def check(digits, start = 1, constantname = ""):
    print("Type the digits (esc leaves / right arrow shows next): ")
    i = start - 1
    performance = Performance(constantname, start = start)
    performance.start()
    while i < len(digits):
        keyboard.block_key("enter")
        tecla = keyboard.read_key()
        keyboard.press_and_release("esc")
        if tecla == "esc":
            break
        elif tecla == "right":
            print(str(i+1) + "-th digit: " + digits[i])
            i += 1
        elif tecla == digits[i]:
            print(tecla)
            performance.digitscounter()
            i += 1
        elif tecla in [digits[i], "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]:
            print("The " + str(i+1) + "-th digit is incorrect.")
            performance.mistakescounter(expecteddigit=digits[i], receiveddigit=tecla, position=i+1)
        else:
            print("Type a digit.")
        while True:
            if not keyboard.is_pressed(tecla):
                time.sleep(0.01)
                break
    performance.stop()
    keyboard.unhook_all()

def get_int_in_range(message, rng, zero="invalid"):
    print(message, end="")
    while True:
        try:
            n = int(input())
        except ValueError:
            print("Invalid input. Please type a number: ", end = "")
            continue
        if n == 0 and zero=="valid":
            return None
        elif (n-1) not in range(rng):
            print("Invalid number. Please type a number between 1 and " + str(rng) + ": ", end="")
            continue
        else:
            return n

def yorn(message):
    while True:
        answ = input(message + " (y, n) ").lower()
        if answ not in ["yes,", "y", "no", "n"]:
            print("Invalid input. Type 'yes' or 'no'.")
            continue
        else:
            break
    if answ in ["no", "n"]:
        return False
    else:
        return True

def main():
    while True:
        global constant
        constant = Constants()
        while True:
            print("Train one of these constants: ")
            print(constant)
            n = get_int_in_range("Choose a number (type " + str(len(constant.getlist) + 1) + " to add a new one or 0 to delete one): ", len(constant.getlist) + 1, zero="valid")
            if n == len(constant.getlist) + 1:
                constant.setconst()
            elif n is None:
                index = get_int_in_range("Choose a number to delete: ", len(constant.getlist), zero="valid")
                if index != None:
                    constant.delconst(index-1)
            else:
                break
        filename = constant.getconst(n-1) + ".txt"
        try:
            f = open(filename, 'r')
        except FileNotFoundError:
            print("There is no file named " + filename + ".")
            exit()
        digits = f.read()
        chosen_start = get_int_in_range("Do you want to start at what position? ", len(digits))
        check(digits, start = chosen_start, constantname=constant.getconst(n-1))
        f.close()
        print()
        question = yorn("Do you want to train again?")
        if question == False:
            break

if __name__ == "__main__":
    main()