var friendID;
var selfID;
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
 * Show all friends of a user in the specified HTML element
 * @param elementID
 */
function showFriends(elementID){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const currentUser = firebase.auth().currentUser;
            const ref = firebase.database().ref('users/'+currentUser.uid+'/friends');
            selfID=currentUser.uid;
            ref.on("value", function(snapshot) {
                console.log(snapshot.val());
                const friends = Object.values(snapshot.val());
                const friendsKeys= Object.keys(snapshot.val());
                for(let i = 0; i < friends.length;i++){
                    let obj = friends[i];
                    showUser(elementID,obj,friendsKeys[i]);
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
 * @param key of the user with which I want a conversation.
 */
function showUser(elementID, user, key){
    const node = document.createElement("LI");
    const textNode = document.createTextNode(user.username);
    node.appendChild(textNode);
    document.getElementById(elementID).appendChild(node);

    const img = document.createElement('img');
    img.src = user.image;
    img.width=50;
    img.height=50;
    img.setAttribute( 'type','button');
    img.setAttribute('onclick',`openConversationWithUser("${key}")`);
    document.getElementById(elementID).appendChild(img);
}

/**
 * Open a conversation with a user with specified id.
 * @param userID with which the current user wants to talk
 * @return a list of messages IDs
 */
function openConversationWithUser(userID)
{
    //TODO refactor this code.
    const chatLogs = document.getElementById('chat-logs');
    while(chatLogs.firstChild){
        chatLogs.removeChild(chatLogs.firstChild);
    }
    friendID=userID;
    var ref = firebase.database().ref('users/'+selfID+'/conversations/'+userID+'/messages');

    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        const messages=Object.values(snapshot.val());
        const messagesKeys=Object.keys(snapshot.val());
        for(let i = 0; i < messages.length;i++){
            showMessage('chat-logs', messages[i],messagesKeys[i],selfID);
        }
        return snapshot.val();
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

/**
 * Show a message in the message area of the user page.
 * @param elementID
 * @param message
 * @param messageID
 * @param userID
 */
function showMessage(elementID,message,messageID, userID) {
    const messageDiv = document.createElement("div");
    if(message.authorID === userID){
        messageDiv.className='chat self';
    }else{
        messageDiv.className='chat friend';
    }
    messageDiv.id=messageID;
    const userPhotoDiv = document.createElement("div");
    userPhotoDiv.className='user-photo';
    userPhotoDiv.className=messageID+"x";

    const img = document.createElement("img");
    img.className='user-photo';
    img.width=50;
    img.height=50;
    var userRef = firebase.database().ref('users/'+message.authorID);
    userRef.once("value", function(snapshot) {
        const user = snapshot.val()
        console.log(user);
        img.src=user.image;
    }, function (error) {
        console.log("Error: " + error.code);
    });

    const messageParagraph=document.createElement("p");
    messageParagraph.className="chat-message";
    messageParagraph.innerText=message.text;
    document.getElementById(elementID).appendChild(messageDiv);
    document.getElementById(messageDiv.id).appendChild(userPhotoDiv);
    document.getElementById(messageDiv.id).appendChild(img);
    document.getElementById(messageDiv.id).appendChild(messageParagraph);
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
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
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

function writeMessage(inputTextAreaID) {
    console.log(friendID);
    const message = document.getElementById(inputTextAreaID).value;


    const currentUser = firebase.auth().currentUser;
    const currentUserConversationsRef = firebase.database().ref('users/'+selfID+'/conversations/'+friendID+'/messages/');
    const friendConversationsRef = firebase.database().ref('users/'+friendID+'/conversations/'+selfID+'/messages/');
    const newSelfMessageRef = currentUserConversationsRef.push();
    const newFriendMessageRef=friendConversationsRef.push();
    const currentDate = new Date();
    console.log(message+":"+currentDate.toLocaleString());
    newSelfMessageRef.set({
        authorID:friendID,
        date:currentDate.toLocaleString(),
        text:message
    });
    newFriendMessageRef.set({
        authorID:currentUser.uid,
        date:currentDate.toLocaleString(),
        text:message
    });
    document.getElementById(inputTextAreaID).value="";
}