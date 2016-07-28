var express = require('express');
var app = express();

var users = [];
var usersWriting = 0;


var getClientsCount = function() {
    return io.engine.clientsCount;
};

function broadcastOnline() {
    io.sockets.emit("online", getClientsCount());
};

function broadcastWriters() {
    io.sockets.emit("writers", usersWriting);
}

function askClients() {
    users = [];
    io.sockets.emit("askOnline", {});    
}

function randomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}



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
        this.commands["rollthedice"] = this.rollthediceHandler;
    },
    pingHandler: function() {
        return { global: false, msg: "Pong!" };
    },
    onlineHandler: function() {
        var result = '<br><ul> Users online: <br>';
        for (var i=0; i<users.length;i++) {
            result += "<li>" + users[i] + "</li>";
        }
        result += "</ul>";

        return { global: false, msg: result };
    },
    rollthediceHandler: function() {
        return { global: true, msg: "Rolled the Dice: " + randomInt(1, 100) };
    }
}

Commands.init();


app.use(express.static(__dirname + '/public'));
var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000!');
});

var io = require('socket.io')(server);



io.on('connection', function(socket) {
    console.log('connected');

    broadcastOnline();
    socket.on('message', function(data) {
        if (Commands.isCommand(data.msg)) {
            var cmdResult = Commands.processCommand(data.msg);

            if (cmdResult.global) {
                io.sockets.emit('incomingMessage', { nickname: "Server", msg: cmdResult.msg });
            } else {
                socket.emit('incomingMessage', { nickname: "Server", msg: cmdResult.msg });
            }
        } else {
            io.sockets.emit('incomingMessage', data);
        }
    });

    socket.on("askResponse", function(data) {
        users.push(data);
    });

    socket.on("startedWriting", function(data) {
        usersWriting++;
        broadcastWriters();
    });

    socket.on("stoppedWriting", function(data) {
        usersWriting--;
        broadcastWriters();
    });

    socket.on('disconnect', function(data) {
        broadcastOnline();
    });
});


setInterval(askClients, 1000*10);