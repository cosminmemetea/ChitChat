/**
 * This method will execute when the login button is pressed.
 */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
	  document.getElementById("user_div").style.display="initial";
	  document.getElementById("login_div").style.display="none";
  } else {
    // No user is signed in.
	  document.getElementById("user_div").style.display="none";
	  document.getElementById("login_div").style.display="initial";
  }
});


/**
 * This function is used to login a user.
 * @returns nothing.
 */
function login(){
	var  userEmail = document.getElementById("email_field").value;
	var  userPass = document.getElementById("password_field").value;

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  window.alert("Error: " + errorMessage );
		});
	window.alert(userEmail + " " + userPass);
}

/**
 * This function is used to logout a user.
 * @returns nothing.
 */
function logout(){
	firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		}).catch(function(error) {
		  // An error happened.
		});
}

function getUserInfo(){
	var c = document.getElementById("user_div").children;
	c[0].innerHTML ="wel";
	c[0].innerHTML ="sa";
//	var userId = firebase.auth().getCurrentUser().uid;
    
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/4B4ohoi9KbLHwlwNh2zT/name').then(function(snapshot) {
      c[0].innerHTML="asaas";
    });
}




