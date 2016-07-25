var express = require('express');
var app = express();

var users = {};

var Commands = {
	commands: {},
	isCommand: function(str) {
		return (str.charAt(0) == "/");
	},
	processCommand: function(str) {
		var cmd = str.substring(1);
		if (!this.commands.hasOwnProperty(cmd)) {
			return "Unknown command.";
		}

		return this.commands[cmd]();
	},
	init: function() {
		this.commands["ping"] = this.pingHandler;
		this.commands["online"] = this.onlineHandler;
	},
	pingHandler: function() {
		return "Pong!";
	},
	onlineHandler: function() {
		var result = '<br><ul> Users online: <br>';
		for (var key in users) {
			result += "<li>"+key+"</li>";
		}
		result += "</ul>";

		return result;
	}
}

Commands.init();


app.use(express.static(__dirname+'/public'));
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

var io = require('socket.io')(server);



io.on('connection', function(socket){
	console.log('connected');

	broadcastOnline();
	socket.on('message', function(data){
		if (Commands.isCommand(data.msg)) {
			socket.emit('incomingMessage', {nickname: "Server", msg: Commands.processCommand(data.msg)});
		} else {
			io.sockets.emit('incomingMessage',data);
		}
	});

	socket.on("join", function(data) {
		users[data] = socket.id;
	});

	socket.on("leave", function(data) {
		users[data] = null;
	})

	socket.on('disconnect', function(data){
		broadcastOnline();
	})
});


var getClientsCount = function() {
    return io.engine.clientsCount;
};
function broadcastOnline() {
    io.sockets.emit("online", getClientsCount());
};
