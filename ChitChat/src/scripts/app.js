/**
 * This file is responsible for configuration of firebase
 * and another configurations for this project.
 */
<!-- Firebase App is always required and must be first -->
<!-- Firebase App is always required and must be first -->

function initFirebase() {
    // Initialize Firebase
  const config = {
    apiKey: "AIzaSyDz-XCOZbklX-wA_hJqfxfI3-J_1WnEe9s",
    authDomain: "chitchat-381f6.firebaseapp.com",
    databaseURL: "https://chitchat-381f6.firebaseio.com",
    projectId: "chitchat-381f6",
    storageBucket: "chitchat-381f6.appspot.com",
    messagingSenderId: "773934492943"
  };
  firebase.initializeApp(config);
}



