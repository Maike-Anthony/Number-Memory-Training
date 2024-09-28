import keyboard
import time
from datetime import date, datetime

CONSTANTS = ["Phi"]

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
        print("Train one of these constants: ")
        for i in range(len(CONSTANTS)):
            print((str)(i+1) + ". ", end="")
            print(CONSTANTS[i])
        print()
        n = get_int_in_range("Type one of the constant's number: ", len(CONSTANTS))
        filename = CONSTANTS[n-1] + ".txt"
        try:
            f = open(filename, 'r')
        except FileNotFoundError:
            print("There is no file named " + filename + ".")
            exit()
        digits = f.read()
        chosen_start = get_int_in_range("Do you want to start at what position? ", len(digits))
        check(digits, start = chosen_start, constantname=CONSTANTS[n-1])
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