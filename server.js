var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var socketIO = require('socket.io');
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
    res.render('home',{});
});

var players = {};
io.on('connection', function(socket) {
    socket.on('new player', function(data, callback) {
        if(data in players){
            callback(false);
        } else{
            callback(true);
            socket.nickname = data;
            players[socket.nickname] = socket;
            updateNickName();

        }
    });

    socket.on('chat message', function(data, callback) {
        io.sockets.emit('new message', data);
    });
    socket.on('disconnect', function (data) {
        if(!socket.nickname) return;
        delete players[socket.nickname];
        updateNickName();
    });
});

function updateNickName(){
    io.sockets.emit('list_player',Object.keys(players));
}

// setInterval(function() {
//     io.sockets.emit('state', players);
// }, 1000 / 60);

server.listen(port, function () {
    console.log('listen port '+ port);
});