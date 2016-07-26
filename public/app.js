var socket;

var nickname;
var prevMsg = "";
var sound;

//So this will contain all links to image attachments
var attachments = []; 

function addMessage(nick, msg, sender, attaches) {

    var temp = document.createElement('div');
    if (sender) {
        temp.className = 'from-me';
    } else {
        temp.className = 'from-them';
    }
    temp.innerHTML = '<em>' + nick + ':' + '</em>' + msg + "<br>";

    SUL('#messages').append(temp);
    for (var i=0;i<attaches.length; i++) {
        temp.innerHTML += "<img src=\""+attaches+"\" width=\"200px\" height=\"200px\">";
    }
    SUL('#messages').append("<br>");
    SUL('#messages').append("<br>");
    SUL('#messages').append("<br>");


    //Auto-scroll DIV when adding content
    SUL('#messages').getNative().scrollTop =  SUL('#messages').getNative().scrollHeight;
}

function attachImage() {
    var link = prompt("Enter image link: ");
    attachments.push(link);

    renderAttachments();
}


//This function will show all attachments in list
function renderAttachments() {
    if (attachments.length == 0) {
       SUL("#attachmentsContainer").visibility(false);
       return; 
    }
    SUL("#attachmentsContainer").visibility(true);
    SUL("#attachmentsList").html("");
    for (var i = 0; i<attachments.length; i++) {
        var toAdd = document.createElement("li");
        toAdd.innerHTML = attachments[i].substring(0,32)+"...";
        SUL("#attachmentsList").append(toAdd);
    }
}


function login() {
    if (SUL('#nickname').isEmpty()) {
        SUL('#error').show();
        SUL('#error').html('Your nick must contain letters!');
        return;
    }
    socket = io();
    socket.on('connect', function(data) {
        console.log('connected');
    });

    socket.on('incomingMessage', function(data) {

        addMessage(data.nickname, data.msg, (data.nickname == nickname), data.attachments);
        sound.play();

        //online status
    });

    socket.on("online", function(data) {
        console.log("[Socket] Online changed = " + data);

        SUL("#messages").append('<b>Users online: </b>' + data + '<br>');
    });

    socket.on("writers", function(data) {
    	if (data == 0) {
    		SUL("#writersStatus").getNative().style.visibility = "hidden";
    	} else {
    		SUL("#writersStatus").getNative().style.visibility = "visible";
    		SUL("#writersCount").html(data);
    	}
    });

    nickname = SUL('#nickname').val().toUpperCase();
    console.log(nickname);


    SUL('#name').hide();
    SUL('#link').hide();
    SUL('#chatContainer').show();
    SUL('#loginForm').hide();

    //socket.emit("join", nickname);

}

function entermsg(e) {

    if (e.ctrlKey && e.keyCode == 13) {

        sendMessage();
    }
}


function sendMessage() {

    if (SUL('#messageText').isEmpty()) {
        return;
    }

    var newMsg = SUL('#messageText').val();

	if (newMsg.length > 256) {
		addMessage("Server", "How did you avoid HTML max-length attribute, scriptkiddy?", false);
		return;
	}

    if (newMsg.toLowerCase() == prevMsg) {
        addMessage("Server", "Do not repeat the same message!", false);
        return;
    }
    newMsg = newMsg.replace(/(?:(https?\:\/\/[^\s]+))/m,'<a href="$1">$1</a>'); 

    prevMsg = newMsg.toLowerCase();

    socket.emit('message', { msg: newMsg, nickname: nickname, attachments: attachments});

    SUL('#messageText').clear();
    attachments = [];
    renderAttachments();
}

SUL("window").on("beforeunload", function() {
	socket.emit("leave", nickname);
    socket.disconnect();
});


SUL("#messageText").on('keydown', entermsg);


sound = new Audio("./sound.wav");
sound.autoplay = false;
