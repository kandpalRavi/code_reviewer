# Example Python code with various issues
def calculate_total(items):
    total = 0
    for i in range(len(items)):
        if items[i] > 0:
            if items[i] < 100:
                if items[i] % 2 == 0:
                    total = total + items[i]
                else:
                    total = total + items[i] * 2
            else:
                total = total + items[i]
    return total

# Unused import
import os

# Function without docstring
def process_data(data):
    result = []
    for item in data:
        result.append(item * 2)
    return result

# Using eval (security issue)
user_input = "print('hello')"
eval(user_input)
