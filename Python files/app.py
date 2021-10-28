""" Project Name: D-Stress
Team Members: Kelvin Bian, Amanda Lau, Edmond Niu, TC Taylor, Annie Wang
Date: 6/6/2021
Task Description: Hosts the flask server. Connection from arduino to flask server to firebase and from html get requests from website to flask server
functions: acquires data from arduino that gets sent to the firebase and also starting and stopping functions"""


from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
import pyrebase
from datetime import datetime
import time
import matplotlib.pyplot as plt


# Configuration credentials (can be found in Firebase console)
config = {
  "apiKey": "AIzaSyBSk-jIkc7Xjk-K8TNKzhpRqakpMZ5prrs",
  "authDomain": "wearablesensor-36b85.firebaseapp.com",
  "databaseURL": "https://wearablesensor-36b85-default-rtdb.firebaseio.com/",
  "storageBucket": "wearablesensor-36b85.appspot.com"
}

# Initialize firebase connection
firebase = pyrebase.initialize_app(config)

# Create database object
db = firebase.database()


global gsrValues, resistanceValues, times, stressValues, justDate, justHour, justSeconds, recording
gsrValues=[]
resistanceValues=[]
times=[]
stressValues=[]
recording = False

# Server object
app = Flask(__name__)
CORS(app, supports_credentials=True)
@app.route("/startSess")
#@cross_origin(supports_credentials=True)

#python function starting recording values that is run when the startsess button is clicked
def startSess():
    global recording
    #response = jsonify(message="Simple server is running")
    #.headers.add("Access-Control-Allow-Origin", "*")
    recording = True
    return "arduino should now start sending values" 

#python function stopping recording values that is run when the stopsess button is clicked
@app.route("/stopSess")
def stopSess():
    global recording
    #response = jsonify(message="Simple server is running")
    #response.headers.add("Access-Control-Allow-Origin", "*")
    recording = False
    return "arduino should now stop sending values" 

#python function that is run when the arduino sends requests to flask server that takes the data and sorts it into lists
@app.route("/") 
#how to send over arguments that the user inputs on the website to be paramters for this function such as telling the firebase what session of the day this is
def acquireData():
    global returning, gsrValues, resistanceValues, times, stressValues, justDate, justHour, justSeconds
    # Take parameters from Artuino request
    args = request.args
    print('args: ' + str(args))

    # set date and time
    today = datetime.today()
    #date = datetime.date()
    justDate = str(today.replace(microsecond=0, second=0, minute=0, hour=0))
    
    #smallDate2 = str(today.replace(year=0, month=0, day=0, microsecond=0))
    justHour = str(today.replace(microsecond=0, second=0, minute=0))
    justSeconds = str(today.replace(microsecond=0))
    
    gsrValue = str(args['gsrValue'])
    
    ohmValue = round(((1024+2*int(gsrValue))*10000)/(600-int(gsrValue)),0)

    if int(gsrValue) < 140:
        stress = "low"
    elif int(gsrValue) >= 140 and int(gsrValue) < 257:
        stress = "moderate"
    else:
        stress = "high"


    #print("justDate: " + justDate)
    #print("justHour: " + justHour)
    #print("gsrvalue: " + gsrValue)
    #print("gsrvalues: " + str(gsrValues))
    #print("ohm value: " + str(ohmValue))
    if recording:
        gsrValues.append(gsrValue)
        resistanceValues.append(ohmValue)
        times.append(justSeconds)
        stressValues.append(stress)
    
    #print("justDate: " + justDate)
    #print("justHour: " + justHour)
    print("gsrvalues: " + str(gsrValues))
    print("ohmValues: " + str(resistanceValues))
    print("times: " + str(times))
    

    return "success"

#python function that is run when the sendtoDB button is clicked that sends data to firebase
@app.route("/sendtoDB") 
def sendtoDB():
    global gsrValues, resistanceValues, times, stressValues, justDate, justHour, justSeconds
    args = request.args
    print("args:" + str(args))
    fulldict = dict()
    #fulldict[justHour] = {}
    for i in range(len(gsrValues)):
        fulldict[times[i]] = {
            #"Times": times[i],
            "GSR Sensor Value": gsrValues[i],
            "Skin Resistance (in ohms)": resistanceValues[i],
            "Estimated Stress Level": stressValues[i],
            #"Are you dehydrated?": dehydratedValues[i]
        }
        print(fulldict)

    firebase.database().child("Users").child(str(args['userID'])).child(justDate).child(str(args['sessNum'])).set(fulldict)


# Run server on local IP address on port 5000
if __name__ == "__main__":
    app.run(debug=False, host='172.20.10.14', port=5000)
