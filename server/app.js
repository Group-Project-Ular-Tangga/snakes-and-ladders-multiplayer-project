const express = require("express");
const { createServer } = require("http");

// const PORT = process.env.PORT || 3000;
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const finish = 100;

const SnakesAndLadders = {
  43: 17,
  50: 5,
  56: 8,
  73: 15,
  84: 58,
  87: 49,
  99: 40,
  //Tangga
  2: 23,
  6: 45,
  20: 59,
  52: 72,
  57: 96,
  71: 92,
  //Roket
  4: 68,
  30: 96,
};

app.get("/", (req, res) => {
  res.send("Snakes And Ladders Home Page");
});

let players = [];

function generateBoard(size = 10, positions) {
  let board = [];

  let counter = 1;

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    board[rowIndex] = [];
    for (let colIndex = 0; colIndex < size; colIndex++) {
      let players = [];
      // if (rowIndex === 0 && colIndex === 0) {
      //   console.log('masuk')
      //   players.push({ name: 'vasu' })
      //   players.push({ name: 'hakim' })
      // }
      if (positions[0]) {
        let positionPlayer1 = positions[0].position;
        if (counter === positionPlayer1) {
          players.push(positions[0]);
        }
      }
      if (positions[1]) {
        let positionPlayer2 = positions[1].position;
        if (counter === positionPlayer2) {
          players.push(positions[1]);
        }
      }
      board[rowIndex][colIndex] = {
        cellNumber: counter,
        players: players,
      };
      counter++;
    }
    if (rowIndex % 2) board[rowIndex] = board[rowIndex].reverse();
  }

  return board.reverse();
}

io.on("connection", (socket) => {
  socket.on("player-joined", (playerName) => {
    if (players.length < 2) {
      players.push({ name: playerName, id: socket.id, position: 1 });
    }

    socket.join("room");

    socket.nsp.to("room").emit("players-updated", players);
    //1->[9,0],
    //2->[9,1]
    //10->[9,9]
    //11->[8,9]
    let board = generateBoard(10, players);
    socket.nsp.to("room").emit("board-updated", board);
    if (players.length === 2) {
      socket.nsp.to("room").emit("set-turn", players[0].name);
    }
  });
  socket.on("get-players", () => {
    socket.nsp.to("room").emit("players-updated", players);
    let board = generateBoard(10, players);
    socket.nsp.to("room").emit("board-updated", board);
  });
  socket.on("roll-dice", (turn) => {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    let newPosition;
    if (turn === players[0].name) {
      newPosition = players[0].position + diceValue;
      if (SnakesAndLadders[newPosition]) {
        newPosition = SnakesAndLadders[newPosition];
      }
      if (newPosition >= finish) {
        players[0].position = finish;
        io.emit("playerWins", players[0]);
      } else {
        players[0].position = newPosition;
        io.emit("updatePlayers", players);
      }

      socket.to("room").emit("set-turn", players[1].name);
    } else {
      newPosition = players[1].position + diceValue;
      if (SnakesAndLadders[newPosition]) {
        newPosition = SnakesAndLadders[newPosition];
      }
      if (newPosition >= finish) {
        players[1].position = finish;
        io.emit("playerWins", players[1]);
      } else {
        players[1].position = newPosition;
        io.emit("updatePlayers", players);
      }
      socket.to("room").emit("set-turn", players[0].name);
    }
    let board = generateBoard(10, players);
    socket.nsp.to("room").emit("board-updated", board);
  });

  socket.on("disconnect", () => {
    const index = players.findIndex((player) => player.id === socket.id);
    if (index === 0) {
      players.shift();
    } else {
      players.pop();
    }

    socket.leave("room");
    socket.to("room").emit("players-updated", players);
  });
});

// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

module.exports = server;
