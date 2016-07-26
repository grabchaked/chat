var socket;

var nickname;
var prevMsg = "";
var sound;

function addMessage(nick, msg, sender) {

    var temp = document.createElement('div');
    if (sender) {
        temp.className = 'from-me';
    } else {
        temp.className = 'from-them';
    }
    temp.innerHTML = '<em>' + nick + ':' + '</em>' + msg + "<br>";

    SUL('#messages').append(temp);
    SUL('#messages').append("<br>");
    SUL('#messages').append("<br>");
    SUL('#messages').append("<br>");


    //Auto-scroll DIV when adding content
    SUL('#messages').getNative().scrollTop =  SUL('#messages').getNative().scrollHeight;
}

function attachImage() {
    var link = prompt("Enter image link: ");
    SUL("#messageText").val(SUL("#messageText").val() + '<img src="' + link + '"  class="attachImg">');
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

        addMessage(data.nickname, data.msg, (data.nickname == nickname));
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

    /*SUL("#messageText").on("focus", function(e) {
    	socket.emit("startedWriting", {});
    });

    SUL("#messageText").on("blur", function(e) {
    	socket.emit("stoppedWriting", {});
    });*/
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

    socket.emit('message', { msg: newMsg, nickname: nickname });

    SUL('#messageText').clear();
}

SUL("window").on("beforeunload", function() {
	socket.emit("leave", nickname);
    socket.disconnect();
});


SUL("#messageText").on('keydown', entermsg);


sound = new Audio("./sound.wav");
sound.autoplay = false;
