import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { useTheme } from '../contexts/ThemeContext'
import kertas from '../assets/kertas.png'
import gunting from '../assets/gunting.png'
import batu from '../assets/batu.png'

const CHOICE_EMOJIS = {
  rock: <img src={batu} alt="" />,
  paper: <img src={kertas} alt="" />, 
  scissors: <img src={gunting} alt="" />
}

function GameOver({ 
  gameState, 
  username, 
  opponentName, 
  scores, 
  gameHistory, 
  resetGame 
}) {
  const navigate = useNavigate()
  const { cycleTheme, currentTheme } = useTheme()

  // Show game over SweetAlert2 when component first loads
  useEffect(() => {
    if (gameState === 'finished') {
      let finalResult, icon, confirmButtonColor
      
      if (scores.player > scores.opponent) {
        finalResult = 'Congratulations! You Won! 🏆'
        icon = 'success'
        confirmButtonColor = '#28a745'
      } else if (scores.player < scores.opponent) {
        finalResult = 'Game Over! You Lost! 😢'
        icon = 'error'
        confirmButtonColor = '#dc3545'
      } else {
        finalResult = "It's a Draw! 🤝"
        icon = 'info'
        confirmButtonColor = '#17a2b8'
      }

      Swal.fire({
        title: 'Game Finished!',
        text: finalResult,
        icon: icon,
        confirmButtonText: 'View Results',
        confirmButtonColor: confirmButtonColor,
        allowOutsideClick: false
      })
    }
  }, [gameState, scores])
  const handleResetGame = () => {
    Swal.fire({
      title: 'Play Again?',
      text: 'Are you sure you want to start a new game?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Play Again!',
      cancelButtonText: 'Stay Here',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        resetGame()
        navigate('/')
        
        Swal.fire({
          title: 'New Game!',
          text: 'Starting a fresh game. Good luck!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  if (gameState !== 'finished') {
    return null
  }

  console.log('GAME HISTORY:', gameHistory);
  let finalResult
  let resultEmoji
  
  if (scores.player > scores.opponent) {
    finalResult = 'Anda Menang! 🎉'
    resultEmoji = '🏆'
  } else if (scores.player < scores.opponent) {
    finalResult = 'Anda Kalah! 😢'
    resultEmoji = '😞'
  } else {
    finalResult = 'Seri! 🤝'
    resultEmoji = '🤝'
  }

  return (
    <div className="app">
      {/* Floating Theme Controls */}
      <div className="theme-controls-floating">
        <button 
          className="theme-cycle-btn" 
          onClick={cycleTheme}
          title={`Current theme: ${currentTheme}`}
        >
          🎨
        </button>
      </div>

      <div className="game-over">
        <div className="result-emoji">{resultEmoji}</div>
        <h1>Game Selesai!</h1>
        <h2>{finalResult}</h2>
        <div className="final-scores">
          <h3>Skor Akhir:</h3>
          <p>{username}: {scores.player}</p>
          <p>{opponentName}: {scores.opponent}</p>
        </div>
        
        {gameHistory.length > 0 && (
          <div className="game-history">
            <h3>Riwayat Pertandingan:</h3>
            <div className="history-list">
              {gameHistory.map((round, index) => (
                <div key={index} className="history-item">
                  <span className="round-number">Ronde {index + 1}</span>
                  <div className="choices-history">
                    <span className="player-history">
                      {username} <span className="choice-icon">{CHOICE_EMOJIS[round.playerChoice]}</span>
                    </span>
                    <span className="vs-history">vs</span>
                    <span className="opponent-history">
                      {opponentName} <span className="choice-icon">{CHOICE_EMOJIS[round.opponentChoice]}</span>
                    </span>
                  </div>
                  <span className={`result-badge ${round.result}`}>
                    {round.result === 'win' ? 'Menang' : round.result === 'lose' ? 'Kalah' : 'Seri'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="game-summary">
          <h3>Ringkasan Pertandingan:</h3>
          <p>Total Ronde: 7</p>
          <p>Kemenangan Anda: {scores.player}</p>
          <p>Kemenangan Lawan: {scores.opponent}</p>
          <p>Seri: {7 - scores.player - scores.opponent}</p>
        </div>
        
        <button onClick={handleResetGame}>Main Lagi</button>
      </div>
    </div>
  )
}

export default GameOver
