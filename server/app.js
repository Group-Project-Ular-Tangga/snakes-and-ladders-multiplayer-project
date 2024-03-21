const express = require("express");
const { createServer } = require("http");

const PORT = process.env.PORT || 3000;
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

const finish = 100;

app.get("/", (req, res) => {
    res.send("Snakes And Ladders Home Page");
});

let players = [];

io.on("connection", (socket) => {
    socket.on("player-joined", (playerName) => {
        if (players.length < 2) {
            players.push({ name: playerName, id: socket.id, position: 0 })
        }

        socket.join('room')

        socket.nsp.to('room').emit('players-updated', players)

        if (players.length === 2) {
            socket.nsp.to('room').emit('set-turn', players[0].name)
        }
    });

    socket.on("roll-dice", (turn) => {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        let newPosition
        if (turn === players[0].name) {
            newPosition = players[0].position + diceValue;
            if (newPosition >= finish) {
                players[0].position = finish;
                io.emit('playerWins', players[0]);
              } else {
                players[0].position = newPosition;
                io.emit('updatePlayers', players);
              }
            socket.nsp.to('room').emit('set-turn', players[1].name)
        } else {
            newPosition = players[1].position + diceValue;
            if (newPosition >= finish) {
                players[1].position = finish;
                io.emit('playerWins', players[1]);
              } else {
                players[1].position = newPosition;
                io.emit('updatePlayers', players);
              }
            socket.nsp.to('room').emit('set-turn', players[0].name)
        }
    });

    socket.on("disconnect", () => {
        const index = players.findIndex((player) => player.id === socket.id)
        if (index === 0) {
            players.shift()
        } else {
            players.pop()
        }

        socket.leave('room')
        socket.nsp.to('room').emit('players-updated', players)
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;
