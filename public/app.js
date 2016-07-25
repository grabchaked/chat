var socket;

var nickname;
var sound;
function addMessage(nick, msg, sender){

	var temp = document.createElement('div');
	if (sender) {
		temp.className = 'from-me';
	}else{
		temp.className = 'from-them';
	}
	temp.innerHTML = '<em>'+nick+':'+'</em>'+msg+"<br>";

	SUL('#messages').append(temp);
	SUL('#messages').append("<br>");
	SUL('#messages').append("<br>");
	SUL('#messages').append("<br>");
	

}

function attachImage() {
  var link = prompt("Enter image link: ");
  SUL("#messageText").val( SUL("#messageText").val()+'<img src="'+link+'"  class="attachImg">');
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

	addMessage(data.nickname, data.msg, (data.nickname==nickname));
	sound.play();

//online status
});

socket.on("online", function (data) {
        console.log("[Socket] Online changed = "+data);
       
        SUL("#messages").append('<b>Users online: </b>'+data+'<br>');
    });

nickname = SUL('#nickname').val().toUpperCase();
console.log(nickname);


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