var socket;
var nickname;
var sound;
function addMessage(nick, msg){
	SUL('#messages').html(SUL('#messages').html()+'<b>'+nick+'</b>'+':'+msg+"<br>");
}

function login(){
	if (SUL('#nickname').isEmpty()) {
SUL('#error').show();
SUL('#error').html('Your nick must contain letters!');
		return;
	}
socket = io();
socket.on('connect', function(data){
	console.log('connected');
});

socket.on('incomingMessage',function (data){
	addMessage(data.nickname, data.msg);
	sound.play();

//online status
});

socket.on("online", function (data) {
        console.log("[Socket] Online changed = "+data);
        SUL("#playersOnline").html(data);
    });

nickname = SUL('#nickname').val();
console.log(nickname);

addMessage('Status','working<hr>');

SUL('#name').hide();
SUL('#link').hide();
SUL('#chatContainer').show();
SUL('#loginForm').hide();
 
 }

function entermsg(e) {

 if (e.ctrlKey && e.keyCode == 13) {
  
    sendMessage();
  }
 }


function sendMessage(){
	//window.addEventListener("keydown", entermsg, false );

	

	if(SUL('#messageText').isEmpty()){
		return;
	}

	socket.emit('message', {msg: SUL('#messageText').val(), nickname: nickname});

	SUL('#messageText').clear();
}

 SUL("window").on("beforeunload", function() { 
        socket.disconnect();
    });


SUL("#messageText").on('keydown', entermsg);


sound = new Audio("./sound.wav");
    sound.autoplay = false;