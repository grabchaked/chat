var express = require('express');
var app = express();

app.use(express.static(__dirname+'/public'));
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
	console.log('connected');

	broadcastOnline();
	socket.on('message', function(data){
		io.sockets.emit('incomingMessage',data);

	});
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
