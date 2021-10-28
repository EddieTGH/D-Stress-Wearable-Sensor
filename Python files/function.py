def home():
    # Take parameters from Artuino request
    args = request.args

    #  Set the disance parameter in firebase to the collected ultrasonic distance from Arduino
    db.set({"distance":str(args['gsrValue'])})

    # Give Arduino a success response
    return "success"