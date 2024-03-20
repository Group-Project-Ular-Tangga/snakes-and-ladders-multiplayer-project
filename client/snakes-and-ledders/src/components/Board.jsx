/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";

const buttonStyle = {
    padding: '5px 10px',
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "15px",
    color: "#3f3e5e",
    backgroundColor: "#f0f0f0", 
  };

const Board = ({ turn, rollDice }) => {
  console.log(turn);
  const location = useLocation();

  return (
    <div
      style={{
        position: "relative",
        height: "80vh",
        width: "80vh",
      }}>
      <div className="board"></div>
      <div className="dice">
        <img src="../../public/dice/dice1.png" id="dice" />
        <div
          style={{
            color: "white",
          }}>
          {turn === location.state.playerName ? <button onClick={rollDice} style={buttonStyle}>Roll the dice</button> : ""}
        </div>
      </div>
    </div>
  );
};

export default Board;
