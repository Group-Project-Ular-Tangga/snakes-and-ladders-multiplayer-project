import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./components/Loader";
import io from "socket.io-client";
import Board from "./components/Board";

const socket = io.connect("http://localhost:3000");

const containerStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#3f3e5e",
};

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState('')

  const handleBack = () => {
    navigate("/", { state: { playerName: "" } });
    socket.disconnect();
  };

  const handleRollDice = () => {
    socket.emit('roll-dice', turn)
  }

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("player-joined", location.state.playerName);
    socket.on("players-updated", (payload) => {
      setPlayers(payload);
    });

    socket.on("set-turn", (player) => {
      setTurn(player)
    });

    return () => {
        socket.removeAllListeners();
        socket.disconnect();
    };

  }, [location]);

  return (
    <div style={containerStyle}>
      <button className="button-back" onClick={handleBack}>
        Back
      </button>
      <h3 className="player-count">Player Count: {players.length}</h3>
      {players.length < 2 ? <Loader /> : <Board turn={turn} rollDice={handleRollDice}/>}
    </div>
  );
};

export default Game;
