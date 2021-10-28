"""
Project Name: WS2021_1; 
Team Members: 
Date: 6/03/2021
Task Description: Serve as an HTTP GET request tester for the main application
    Emulates the arduino's GET requests
"""

import requests
import time
import random
import requests
import socket

hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

number = str(random.randint(0, 1023))
r = requests.get(f"http://{ip_address}:5000/?gsrValue=" + number)
print(r)