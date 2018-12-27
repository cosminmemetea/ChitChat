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
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.alert(userEmail + " " + userPass);
            window.open("../web/user.html",'_self',false);
        } else {
            console.log("User is not signed in");
        }
    });


}
/**
 * Used to sign up a new user.
 * @param { } username_field
 * @param {*} email_field
 * @param {*} password_field
 */
function signUp(username_field, email_field, password_field){
    const  userName = document.getElementById(username_field).value;
    const  userEmail = document.getElementById(email_field).value;
    const  userPass = document.getElementById(password_field).value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
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

/**
 * Show all friends of a user in the specified HTML element
 * @param elementID
 */
function showFriends(elementID){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const currentUser = firebase.auth().currentUser;
            const ref = firebase.database().ref('users/'+currentUser.uid+'/friends');

            ref.on("value", function(snapshot) {
                console.log(snapshot.val());
                const friends = Object.values(snapshot.val());
                for(let i = 0; i < friends.length;i++){
                    let obj = friends[i];
                    showUser(elementID,obj);
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

/**
 *  Show a user as an element of a list specified by its element ID.
 * @param elementID
 * @param user
 */
function showUser(elementID, user){
    const node = document.createElement("LI");
    const textNode = document.createTextNode(user.username);
    node.appendChild(textNode);
    document.getElementById(elementID).appendChild(node);

    const img = document.createElement('img');
    img.src = user.image;
    img.width=50;
    img.height=50;
    document.getElementById(elementID).appendChild(img);
}

/**
 *Find  users that match the pattern from the textProviderID HTML element.
 * @param elementID where to render the names and images for the users.
 * @param textProviderID
 */
function findUsers(elementID, textProviderID) {
    const usersTable = document.getElementById(elementID);
    while(usersTable.firstChild){
        usersTable.removeChild(usersTable.firstChild);
    }
    const  pattern = document.getElementById(textProviderID).value;
    const ref = firebase.database().ref('users/');
    ref.on("value", function(snapshot) {
        const users = Object.values(snapshot.val());
        for(let i = 0; i < users.length;i++){
            let obj = users[i];
            if(obj.username.includes(pattern) && pattern != ''){
                showUser(elementID,obj);
            }
        }
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function uploadProfileImage(){
    const filename = selectedFile.name;
    const storageRef = filebase.storage().ref('/profileImages/'+filename);
    const uploadTask = storageRef.put(selectedFile);
    uploadTask.on('state_changed', function (snapshot) {
        //Observe state change events such as progress, pause, resume
    },function (error) {
     console.log(error);
    },function () {
        var downloadURL=uploadTask.snapshot.downloadURL;
        //TODO add the image url to each user.
    })
}