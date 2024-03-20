import React, { useState, useEffect } from 'react';
import { socket } from './utils/socket';


function App() {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('playerWins', (winningPlayer) => {
      setWinner(winningPlayer);
    });

  }, []);

  const joinGame = () => {
    socket.emit('joinGame', playerName);
    setCurrentPlayer(playerName);
  };

  const rollDice = () => {
    socket.emit('rollDice');
  };

  return (
    <div>
      <h1>Ular Tangga</h1>
      <div>
        {currentPlayer ? (
          <>
            <p>Giliran Kamu, {currentPlayer}!</p>
            <button onClick={rollDice} disabled={winner}>Kocok Dadu</button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
            <button onClick={joinGame}>Join Game</button>
          </>
        )}
      </div>
      <div>
        <h2>Players:</h2>
        <ul>
          {Object.values(players).map((player) => (
            <li key={player.id}>{player.name} - {player.position}</li>
          ))}
        </ul>
      </div>
      {winner && <p>{winner.name} wins!</p>}
    </div>
  );
}

export default App;
