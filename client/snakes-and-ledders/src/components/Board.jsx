import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";

const buttonStyle = {
  padding: "5px 10px",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "15px",
  color: "#3f3e5e",
  backgroundColor: "#f0f0f0",
};

const BoardSize = 10;

///[[{players:[],cellNumber:number(1-100)},{}],[{},{}]]

const Board = () => {
  let [board, setBoard] = useState([])
  const [turn, setTurn] = useState('')
  const [players, setPlayers] = useState([]);
  console.log(board)
  const handleRollDice = () => {
    socket.emit('roll-dice', turn)
  }
  useEffect(() => {
    socket.on('board-updated', (serverboard) => {
      setBoard(serverboard)
    })
    socket.on("players-updated", (payload) => {
      console.log(payload,"string")
      setPlayers(payload);
    });
    socket.on("set-turn", (player) => {
      console.log(player)
      setTurn(player)
      socket.emit('get-players')
    });
  }, [])
  let playerTurn = players.find((player) => player.name === turn)?.name
  console.log({playerTurn,turn,players})
  return (
    <div className="App">
      <h1>Ular Tangga</h1>
      <div className="tboard">
        {board.map((row) => {
          return <div style={{ display: 'flex' }}>{row.map((col) => {
            return <div style={{ display: 'flex', flexDirection: 'column', width: '50px', height: '50px' }}>
              <div>{col.cellNumber}</div>
              {col.players.map((player) => {
                return <div>{player.name}</div>
              })}
            </div>
          })}</div>
        })}
      </div>
      {turn && (
        <div>
          {turn === players.find((player) => player.name === turn)?.name && (
            <button onClick={handleRollDice} style={buttonStyle}>
              Roll the dice
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Board;