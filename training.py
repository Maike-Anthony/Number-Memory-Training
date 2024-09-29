import keyboard
import time
from datetime import date, datetime

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
            self.cons.append(line[:-1])
        if len(self.cons) == 0:
            print("You need to add some constant first.")
            self.setconst()
        f.close()
    
    def setconst(self):
        name = input("Insert the number's name: ")
        digits = input("Paste its decimal places: ")
        names = open("Constants.txt", "a")
        names.write(name + "\n")
        names.close()
        self.cons.append(name)
        number = open(name + ".txt", "w")
        number.write(digits)
        number.close()

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

def get_int_in_range(message, rng):
    print(message, end="")
    while True:
        try:
            n = int(input())
        except ValueError:
            print("Invalid input. Please type a number: ", end = "")
            continue
        if (n-1) not in range(rng):
            print("Invalid number. Please type a number between 1 and " + str(rng) + ": ", end="")
            continue
        else:
            return n

def main():
    while True:
        global constant
        constant = Constants()
        print("Train one of these constants: ")
        print(constant)
        n = get_int_in_range("Choose a number: ", len(constant.getlist))
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
        while True:
            answ = input("Do you want to train again? (y, n) ").lower()
            if answ not in ["yes,", "y", "no", "n"]:
                print("Invalid input. Type 'yes' or 'no'.")
                continue
            else:
                break
        if answ in ["no", "n"]:
            break

if __name__ == "__main__":
    main()