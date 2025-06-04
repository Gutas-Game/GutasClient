import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useTheme } from '../contexts/ThemeContext'
import kertas from '../assets/kertas.png'
import gunting from '../assets/gunting.png'
import batu from '../assets/batu.png'

const CHOICES = ['rock', 'paper', 'scissors']
const CHOICE_EMOJIS = {
  rock: <img src={batu} alt="" />,
  paper: <img src={kertas} alt="" />, 
  scissors: <img src={gunting} alt="" />
}

function GamePlaying({ 
  socket, 
  gameState, 
  username, 
  opponentName, 
  roomId, 
  currentRound, 
  setCurrentRound,
  playerChoice, 
  setPlayerChoice,
  opponentChoice, 
  setOpponentChoice,
  scores, 
  setScores,
  gameHistory, 
  setGameHistory,
  roundResult, 
  setRoundResult,
  isWaitingForOpponent, 
  setIsWaitingForOpponent,
  setGameState 
}) {
  const navigate = useNavigate()
  const { cycleTheme, currentTheme } = useTheme()
  const [aiRecommendation, setAiRecommendation] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (gameState === 'finished') {
      navigate('/gameover')
    }
  }, [gameState, navigate])  
  

  const makeChoice = (choice) => {
    setPlayerChoice(choice)
    setIsWaitingForOpponent(true)
    socket.emit('playerChoice', { choice, roomId })
  }

  const getResultText = (result) => {
    switch(result) {
      case 'win': return 'You Win! 🎉'
      case 'lose': return 'You Lose! 😢'
      case 'tie': return 'It\'s a Tie! 🤝'
      default: return ''
    }
  }

  // Show SweetAlert2 for round results
  useEffect(() => {
    if (roundResult && playerChoice && opponentChoice) {
      const getResultConfig = (result) => {
        switch(result) {
          case 'win':
            return {
              title: 'You Win! 🎉',
              text: `${playerChoice.toUpperCase()} beats ${opponentChoice.toUpperCase()}!`,
              icon: 'success',
              confirmButtonColor: '#28a745'
            }
          case 'lose':
            return {
              title: 'You Lose! 😢',
              text: `${opponentChoice.toUpperCase()} beats ${playerChoice.toUpperCase()}!`,
              icon: 'error',
              confirmButtonColor: '#dc3545'
            }
          case 'tie':
            return {
              title: "It's a Tie! 🤝",
              text: `Both chose ${playerChoice.toUpperCase()}!`,
              icon: 'info',
              confirmButtonColor: '#17a2b8'
            }
          default:
            return null
        }
      }

      const config = getResultConfig(roundResult)
      if (config) {
        Swal.fire({
          ...config,
          timer: 2500,
          showConfirmButton: false,
          position: 'center'
        })
      }
    }
  }, [roundResult, playerChoice, opponentChoice])

  if (gameState !== 'playing') {
    return null
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

      <div className="game-container">
        <div className="game-header">
          <h2>Round {currentRound}/7 {currentRound === 7 && <span className="final-round">🔥 FINAL ROUND!</span>}</h2>
          <div className="scores">
            <span>{username}: {scores.player}</span>
            <span>{opponentName}: {scores.opponent}</span>
          </div>
        </div>
        
        {currentRound >= 3 && (isLoadingAI || aiRecommendation || aiError) && (
          <div className="ai-recommendation">
            <h3>🤖 Personalized AI Recommendation for {username}</h3>
            {isLoadingAI ? (
              <p className="loading">🔄 AI is analyzing {opponentName}'s patterns for you...</p>
            ) : aiError ? (
              <p style={{color: '#ff9800'}}>⚠️ {aiError} - Using personalized pattern analysis</p>
            ) : (
              <p><strong>{CHOICE_EMOJIS[aiRecommendation]} </strong></p>
            )}
          </div>
        )}

        {!playerChoice ? (
          <div className="choice-container">
            <h3>Make your choice:</h3>
            <div className="choices">
              {CHOICES.map(choice => (
                <button
                  key={choice}
                  className="choice-btn"
                  onClick={() => makeChoice(choice)}
                >
                  <span className="emoji">{CHOICE_EMOJIS[choice]}</span>
                  <span className="text">{choice}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="round-result">
            <div className="choices-display">
              <div className="player-choice">
                <h4>You</h4>
                <div className="choice">{CHOICE_EMOJIS[playerChoice]}</div>
              </div>
              <div className="vs">VS</div>
              <div className="opponent-choice">
                <h4>{opponentName}</h4>
                <div className="choice">
                  {isWaitingForOpponent ? '?' : CHOICE_EMOJIS[opponentChoice]}
                </div>
              </div>
            </div>
            {roundResult && (
              <div className="result">
                <h3>{getResultText(roundResult)}</h3>
              </div>
            )}              
            {isWaitingForOpponent && (
              <p>Waiting for opponent's choice...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePlaying
