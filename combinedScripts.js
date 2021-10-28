  // Project Name: D-Stress
  // Team Members: Kelvin Bian, Amanda Lau, Edmond Niu, TC Taylor, Annie Wang
  // Date: 6/6/2021
  // Task Description: Holds the JS behind all the buttons in the sensor data html website page. 
  // Sends get requests to the flask server / app.py to send sensor arduino data to firebsae and then retrieve data from firebase to display two dropdowns which can display more specific data in a table

//import { userid } from 'firebase.js';
var fb = document.getElementById('feedback')

var flaskServerIP = "172.20.10.14";
//used to dynamically set flaskserver IP
function setIP() {
    return
}
//used for debugging
function checkUserID(){
    console.log("userid: " + String(userID))
}

// Outputs session number
var session = 1
function setSession(){
    session = document.getElementById("sessionNum").value;
    console.log("session: " + String(session))
}

//not used (didnt work)
function sensorReady() {
    console.log("checking connection")
    
    try {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'http://' + flaskServerIP + ':5000/startSess');
        xhr.send();
        xhr.onload = function() {
            console.log(xhr.response); }
      }
      catch(err) {
        console.log("no connection")
      }
        
}

//const startSessButton = document.getElementById("startSess")
//startSessButton.addEventListener("click", startSess, false)
//sends a http get request to the flask server to start session
function startSess() {
    console.log("starting Session");
    fb.textContent = "Recording values now";
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'http://' + flaskServerIP + ':5000/startSess');
    xhr.send();

    xhr.onload = function() {
        console.log(xhr.response); }
}
//sends a http get request to the flask server to stop session
function stopSess() {
    console.log("stopping Session")
    fb.textContent = "Recording session stopped";
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'http://' + flaskServerIP + ':5000/stopSess');
    xhr.send();

    xhr.onload = function() {
        console.log(xhr.response); }
}

//sends a http get request to the flask server to send data to firebase 
function sendtoDB() {
    fb.textContent = "Sending to Firebase...";
    console.log(userID)
    console.log("sending data to DB")
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'http://' + flaskServerIP + ':5000/sendtoDB' + "?userID=" + userID + "&sessNum=" + session);
    xhr.send();
    xhr.onload = function() {
        console.log(xhr.response); }
    fb.textContent = "Data is now in firebase!";
}
    
var sensorValues = []
var skinResistance = []
var estimatedStress = []
//populates js arrays with the user data based on the sessionNum and date selected
function viewData() {
    console.log("retrieving data")
    fb.textContent = "Retrieving data...";
    config = {
        "apiKey": "AIzaSyBSk-jIkc7Xjk-K8TNKzhpRqakpMZ5prrs",
        "authDomain": "wearablesensor-36b85.firebaseapp.com",
        "databaseURL": "https://wearablesensor-36b85-default-rtdb.firebaseio.com/",
        "storageBucket": "wearablesensor-36b85.appspot.com"
    }
    
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
     }else {
        firebase.app(); // if already initialized, use that one
     }

    firebase.database().ref('Users/' + userID + "/" + finalDate + "/" + finalSession).on('value', function(snapshot){
        const data = snapshot.val();
        console.log(data);
        times = Object.keys(data);
        console.log(times);
        //console.log(Object.values(data)[0]);
        //console.log(Object.values(data)[0][0]);
        for (i = 0; i < times.length; i++) {
            twovalues = Object.values(data)[i];
            sensorValues.push(twovalues['GSR Sensor Value']);
            skinResistance.push(twovalues['Skin Resistance (in ohms)']);
            estimatedStress.push(twovalues['Estimated Stress Level']);
          }

        console.log(sensorValues)
        console.log(skinResistance)
        console.log(estimatedStress)
    })
    tableCreate()
    //toast("Selection Complete!");
}

//populates first dropdown with dates from firebase by obtaining the data
var dates = []
//Select Data, prints the existing data to the table based on the key
function retrieveDates() {
  console.log("retrieving dates");
  fb.textContent = "Retrieving dates...";
  config = {
      "apiKey": "AIzaSyBSk-jIkc7Xjk-K8TNKzhpRqakpMZ5prrs",
      "authDomain": "wearablesensor-36b85.firebaseapp.com",
      "databaseURL": "https://wearablesensor-36b85-default-rtdb.firebaseio.com/",
      "storageBucket": "wearablesensor-36b85.appspot.com"
  }
  
  if (!firebase.apps.length) {
      firebase.initializeApp(config);
   }else {
      firebase.app(); // if already initialized, use that one
   }

  //dataPrep();
  firebase.database().ref('Users/' + userID).on('value', function(snapshot){
      const data = snapshot.val();
      console.log(data);
      dates = Object.keys(data);
      console.log(dates);
  })
  GFG_Fun()
}

  //function that actually populates the dropdown
  function GFG_Fun() {
/*     var up = document.getElementById('geeks');
 *//*     var down = document.getElementById('gfg');
 */    var select = document.getElementById("arr");
    /* up.innerHTML = "Click on the button to "
                + "perform the operation"+
                ".<br>Array - [" + dates + "]"; */
    for (var i = 0; i < dates.length; i++) {
        var optn = dates[i];
        var el = document.createElement("option");
        el.textContent = optn;
        el.value = optn;
        select.appendChild(el);
    }
    //down.innerHTML = "Elements Added";
}

//confirm date variable
var finalDate = ""
function submitDate() {
  finalDate = document.getElementById("arr").value;
  console.log(finalDate);
  retrieveSessions()
}

//populates second dropdown with session nums from firebase by obtaining the data
var sessions = []
function retrieveSessions() {
  console.log("retrieving sessions");
  fb.textContent = "Retrieving sessions...";
  config = {
      "apiKey": "AIzaSyBSk-jIkc7Xjk-K8TNKzhpRqakpMZ5prrs",
      "authDomain": "wearablesensor-36b85.firebaseapp.com",
      "databaseURL": "https://wearablesensor-36b85-default-rtdb.firebaseio.com/",
      "storageBucket": "wearablesensor-36b85.appspot.com"
  }
  
  if (!firebase.apps.length) {
      firebase.initializeApp(config);
   }else {
      firebase.app(); // if already initialized, use that one
   }

  //dataPrep();
  firebase.database().ref('Users/' + userID + "/" + String(finalDate)).on('value', function(snapshot){
      const data = snapshot.val();
      console.log(data);
      sessions = Object.keys(data);
      console.log(sessions);
  })
  GFG_Fun2()
}

//actually populates the second session num array
function GFG_Fun2() {
  /*     var up = document.getElementById('geeks');
   *//*     var down = document.getElementById('gfg');
   */    var select = document.getElementById("arr2");
      /* up.innerHTML = "Click on the button to "
                  + "perform the operation"+
                  ".<br>Array - [" + dates + "]"; */
      for (var i = 0; i < sessions.length; i++) {
          var optn = sessions[i];
          var el = document.createElement("option");
          el.textContent = optn;
          el.value = optn;
          select.appendChild(el);
      }
      //down.innerHTML = "Elements Added";
  }

  //finalize session num js variable
  var finalSession = ""
  function submitSession() {
    finalSession = document.getElementById("arr2").value;
    console.log(finalSession);
    viewData()
  }

//actually create the table based on the info gathered in viewdata()
function tableCreate() {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    var trhead = document.createElement('tr');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    var thead = document.createElement('thead');
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    var th3 = document.createElement('th');
    var th4 = document.createElement('th');
    th1.textContent="Times";
    th2.textContent="GSR Sensor Values";
    th3.textContent="Skin Resistance";
    th4.textContent="Estimated Stress Level"
    trhead.appendChild(th1);
    trhead.appendChild(th2);
    trhead.appendChild(th3);
    trhead.appendChild(th4);
    thead.appendChild(trhead);
    tbl.appendChild(thead); 
    for (var i = 0; i < (times.length); i++) {
      var tr = document.createElement('tr');
      for (var j = 0; j < 4; j++) {
          var td = document.createElement('td');
          var p = document.createElement('P');
          if (j==0) {
            p.textContent=times[i]
          }
          if (j==1) {
            p.textContent=sensorValues[i]}
          if (j==2) {
            p.textContent=skinResistance[i]
          }
          if (j==3) {
            p.textContent=estimatedStress[i]
          }
          //td.appendChild(document.createTextNode('\u0020'))
          //i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
          td.appendChild(p);
          tr.appendChild(td);
        }
        tbdy.appendChild(tr);
      }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
  }



//get userID from firebase authen.
var userID = "";
firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      user = firebase.auth().currentUser;
      userID = user.uid;
    } else {
      // No user is signed in.
    }
  });



