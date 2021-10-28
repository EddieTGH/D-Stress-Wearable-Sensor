  // Project Name: D-Stress
  // Team Members: Kelvin Bian, Amanda Lau, Edmond Niu, TC Taylor, Annie Wang
  // Date: 6/6/2021
  // Task Description: Javascript for firebase login system functionality

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var user;
var userid = "";
var database = firebase.database().ref();
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'form.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);


// Called when login status changes
firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    // User is signed in.
    user = firebase.auth().currentUser;
    userid = {id: user.uid};
  } else {
    // No user is signed in.
  }
});

function logout(){
  firebase.auth().signOut();
}

function getID(){
  console.log("userid: " + String(userid))
}
