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
    res.render('layout',{});
});

var players = {};
io.on('connection', function(socket) {
    socket.on('new player', function() {
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });
    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });

    socket.on('disconnect', function (data) {
        delete  players[socket.id];
    });
});

setInterval(function() {
    io.sockets.emit('state', players);
}, 1000 / 60);

server.listen(port, function () {
    console.log('listen port '+ port);
});