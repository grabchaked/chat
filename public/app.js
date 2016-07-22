var socket;
var nickname;
function addMessage(nick, msg){
	SUL('#messages').html(SUL('#messages').html()+nick+':'+msg+"<br>");
}

function login(){
	if (SUL('#nickname').isEmpty()) {
SUL('#error').show();
SUL('#error').html('Your nick');
		return;
	}
socket = io();
socket.on('connect', function(data){
	console.log('connected');
});

socket.on('incomingMessage',function (data){
	addMessage(data.nickname, data.msg);
})

nickname = SUL('#nickname').val();
console.log(nickname);

addMessage('System','Chat');
SUL('#chatContainer').show();
SUL('#loginForm').hide();
 
 }

function sendMessage(){
	if(SUL('#messageText').isEmpty()){
		return;
	}
	socket.emit('message', {msg: SUL('#messageText').val(), nickname: nickname});
	SUL('#messageText').clear();
}
