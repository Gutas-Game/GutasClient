import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import { useTheme } from "../contexts/ThemeContext";
import batu from "../assets/batu.png";
import gunting from "../assets/gunting.png";
import kertas from "../assets/kertas.png";

function LoginWaiting({
  socket,
  gameState,
  username,
  setUsername,
  roomId,
  opponentName,
  setGameState,
}) {
  const navigate = useNavigate();
  const { currentTheme, changeTheme, getAvailableThemes, cycleTheme } =
    useTheme();

  useEffect(() => {
    if (gameState === "playing") {
      navigate("/game");
    }
  }, [gameState, navigate]);
  const joinGame = () => {
    if (username.trim() && socket) {
      Swal.fire({
        title: 'Joining Game...',
        text: 'Finding an opponent for you!',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false,
        allowOutsideClick: false
      })
      
      socket.emit("joinGame", username.trim());
    } else {
      Swal.fire({
        title: 'Username Required!',
        text: 'Please enter a username to join the game.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffc107'
      })
    }
  };

  if (gameState === "login") {
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
        </div>{" "}
        <div className="login-container">
          <div>
            <img src={batu} alt="" />
            <img src={gunting} alt="" />
            <img src={kertas} alt="" />
          </div>
          <h1>GUTAS GAME!</h1>
          <p className="theme-demo-text">Lets Play Rock Paper Scissors!</p>
          <div className="login-form">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && joinGame()}
            />
            <button onClick={joinGame} disabled={!username.trim()}>
              Join Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === "waiting") {
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

        <div className="waiting-container">
          <h2>Waiting for opponent...</h2>
          <p>Room ID: {roomId}</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return null;
}

export default LoginWaiting;
