import { useState } from "react";
import { useNavigate } from "react-router-dom";


const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#3f3e5e'
}

function App() {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState(false)

  const handleChange = (e) => {
    setError(false)
    setPlayerName(e.target.value)
  }

  const handleEnter = () => {
    if(!playerName) {
      setError(true)
    } else {
      navigate('/game', { state: { playerName } });
    }
  }

  return (
    <div style={containerStyle}>
      <div className="name-input-container">
        <h2>Input Name</h2>
        <input type="text" value={playerName} onChange={handleChange}/>
        <div style={{
          height: '15px',
          width: '80%',
          color: 'red',
          textAlign: 'center',
          lineHeight: '15px'
        }}>
         {error ? 'Please input your name' : ''}
        </div>
        <button className="button-join" onClick={handleEnter}>Enter</button>
      </div>
    </div>
  );
}

export default App;
