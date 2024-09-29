import keyboard
import time
from datetime import date, datetime
import os

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
        name = input("Insert the number's name: ").strip().lower()
        digits = input("Paste its decimal places: ")
        names = open("Constants.txt", "a")
        names.write(name + "\n")
        names.close()
        self.cons.append(name)
        number = open(name + ".txt", "w")
        number.write(digits)
        number.close()

    def delconst(self, index):
        question = yorn("Are you sure you want to delete " + constant.getconst(index) + "?")
        if question == False:
            return
        number = self.getconst(index)
        self.cons.pop(index)
        f = open("Constants.txt", "r")
        oldlines = f.readlines()
        f.close()
        f = open("Constants.txt", "w")
        for line in oldlines:
            if line.strip("\n") != number:
                f.write(line)
        f.close()
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
            text += (str(i+1)) + ". " + constant.getconst(i).capitalize() + "\n"
        return text
        

class Mistakes:
    date = ""
    time = 0
    constant = ""
    position = 0
    expected = 0
    received = 0

    def __init__(self, constant, position, expected, received):
        self.date = date.today().strftime("%b-%d-%Y")
        self.time = datetime.now().strftime("%H:%M:%S")
        self.constant = constant
        self.position = position
        self.expected = expected
        self.received = received

    def __str__(self):
        return self.date + "," + self.time + "," + str(self.constant) + "," +  str(self.position) \
            + "," +  str(self.expected) + "," + str(self.received)

def check(digits, start = 1, constantname = ""):
    print("Type the digits (esc to leave): ")
    time.sleep(0.1)
    i = start - 1
    while i < len(digits):
        tecla = keyboard.read_key()
        if tecla == "esc":
            break
        elif tecla == digits[i]:
            print(tecla)
            i += 1
        elif tecla != digits[i]:
            print("The " + str(i+1) + "th-digit is incorrect.")
            mistake = Mistakes(constant=constantname, position=i+1, expected=digits[i], received=tecla)
        while keyboard.is_pressed(tecla):
            time.sleep(0.01)

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