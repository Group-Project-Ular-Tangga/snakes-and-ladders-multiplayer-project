const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const finish = 100;

let players = {};

io.on('connection', (socket) => {
    console.log(`Hello ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        if (socket.id in players) {
            delete players[socket.id];
            io.emit('updatePlayers', players);
        }
    });

    socket.on('joinGame', (playerName) => {
        players[socket.id] = {
            id: socket.id,
            name: playerName,
            position: 0
        };
        io.emit('updatePlayers', players);
    });

    socket.on('rollDice', () => {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        const newPosition = players[socket.id].position + diceValue;

        if (newPosition >= finish) {
            players[socket.id].position = finish;
            io.emit('playerWins', players[socket.id]);
        } else {
            players[socket.id].position = newPosition;
            io.emit('updatePlayers', players);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
