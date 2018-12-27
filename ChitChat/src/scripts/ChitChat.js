/**
 * Method used to login a user.
 * @param {*} email_field  the email user field id from the html element.
 * @param {*} password_field the password field id from the html element.
 */
function login(email_field , password_field){

    var  userEmail = document.getElementById(email_field).value;
    var  userPass = document.getElementById(password_field).value;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return firebase.auth().signInWithEmailAndPassword(userEmail, userPass);

        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage+":"+errorCode);
        });
    window.alert(userEmail + " " + userPass);
    window.open("../web/user.html",'_self',false);

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
    login(email_field,password_field);
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
    window.open("../web/home.html",'_self',false);
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

/**
 * Open a conversation with a user with specified id.
 * @param userID with which the current user wants to talk
 * @return a list of messages IDs
 */
function openConversationWithUser(userID)
{
    var currentUser = firebase.auth().currentUser;
    var ref = firebase.database().ref('users/'+currentUser.uid+'/conversations/'+userID+'/messages');

    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        return snapshot.val();
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function showFriends(elementID){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var currentUser = firebase.auth().currentUser;
            var ref = firebase.database().ref('users/'+currentUser.uid+'/friends');

            ref.on("value", function(snapshot) {
                console.log(snapshot.val());
                var friends = Object.values(snapshot.val());
                for(var i = 0; i < friends.length;i++){
                    var obj = friends[i];
                    showFriend(elementID,obj.username);
                }
                return snapshot.val();
            }, function (error) {
                console.log("Error: " + error.code);
            });
        } else {
            console.log("User is not signed in");
        }
    });
}

function showFriend(elementID,username){
    var node = document.createElement("LI");
    var textNode = document.createTextNode(username);
    node.appendChild(textNode);
    document.getElementById(elementID).appendChild(node);
}

function openUserPage(){
    window.open ('user.html','_self',false);
}

function getUserByPattern(pattern){
    var ref = firebase.database().ref('users')
}