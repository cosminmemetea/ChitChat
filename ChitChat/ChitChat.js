		/**
		 * This method will execute when the login button is pressed.
		 */
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
				document.getElementById("user_div").style.display="initial";
				document.getElementById("login_div").style.display="none";
				document.getElementById("signup_div").style.display="none";
			} else {
				// No user is signed in.
				document.getElementById("user_div").style.display="none";
				document.getElementById("login_div").style.display="initial";
				document.getElementById("signup_div").style.display="initial";
			}
		});


		/**
		 * Method used to login a user.
		 * @param {*} email_field  the email user field id from the html element.
		 * @param {*} password_field the password field id from the html element.
		 */
		function login(email_field , password_field){
			var  userEmail = document.getElementById(email_field).value;
			var  userPass = document.getElementById(password_field).value;

			firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					window.alert("Error: "+errorCode+" :" + errorMessage );
				});
			window.alert(userEmail + " " + userPass);
		}

		/**
		 * Used to sign up a new user.
		 * @param { } username_field 
		 * @param {*} email_field 
		 * @param {*} password_field 
		 */
		function signUp(username_field, email_field, password_field){
			var  userName = document.getElementById(username_field).value;
			var  userEmail = document.getElementById(email_field).value;
			var  userPass = document.getElementById(password_field).value;

			firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
			// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				window.alert("Error: "+errorCode+" :" + errorMessage );	
				return;
			});
			//TODO add field when the UI will be imlemented.
			addUserInfo(userName,userEmail,null);
			login(userEmail,userPass);
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

		/**
		 * This method will add user info at sign-up time.
		 * @param {*} name user name.
		 * @param {*} email user email.
		 */
    	function addUserInfo(name,email,image){
			firebase.auth().onAuthStateChanged((user) => {
  			if (user) {
				firebase.database().ref('users/' +user.uid).set({
   				 username: name,
				 email: email,
			     image:image
  			 	});
  			}else{
					window.alert("User is NOT ready"+user.uid);	
				}
			});
		}


