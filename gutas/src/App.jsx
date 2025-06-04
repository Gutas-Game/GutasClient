import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import io from "socket.io-client";
import Swal from "sweetalert2";
import LoginWaiting from "./components/LoginWaiting";
import GamePlaying from "./components/GamePlaying";
import GameOver from "./components/GameOver";

function App() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [gameState, setGameState] = useState("login");
  const [roomId, setRoomId] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState("");
  const [opponentChoice, setOpponentChoice] = useState("");
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [roundResult, setRoundResult] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);

  useEffect(() => {
    const newSocket = io("https://hck.duniahabbib.site");
    setSocket(newSocket);

    newSocket.on("gameJoined", (data) => {
      setRoomId(data.roomId);
      setGameState("waiting");

      Swal.fire({
        title: "Successfully Joined!",
        text: `Room ID: ${data.roomId}. Waiting for opponent...`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    });

    newSocket.on("gameStart", (data) => {
      setOpponentName(data.opponentName);
      setGameState("playing");
      setCurrentRound(1);
      setScores({ player: 0, opponent: 0 });
      setGameHistory([]);

      Swal.fire({
        title: "Game Started!",
        text: `Your opponent is ${data.opponentName}. Let the battle begin!`,
        icon: "success",
        confirmButtonText: "Start Playing!",
        confirmButtonColor: "#28a745",
      });
    });

    newSocket.on("roundResult", (data) => {
      setOpponentChoice(data.opponentChoice);
      setRoundResult(data.result);
      setScores(data.scores);
      setGameHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          playerChoice: data.playerChoice,
          opponentChoice: data.opponentChoice,
          result: data.result,
        },
      ]);
      setIsWaitingForOpponent(false);
      setTimeout(() => {
        if (currentRound >= 7) {
          // Game selesai setelah round 7
          setGameState("finished");
        } else {
          // Lanjut ke round berikutnya
          setCurrentRound((prev) => prev + 1);
          setPlayerChoice("");
          setOpponentChoice("");
          setRoundResult("");
        }
      }, 3000);
    });

    newSocket.on("gameOver", (data) => {
      // Server memberitahu game selesai
      console.log("Game Over received:", data);
      setGameState("finished");
      if (data.finalScores) {
        setScores(data.finalScores);
      }
    });

    newSocket.on("opponentDisconnected", () => {
      Swal.fire({
        title: "Opponent Disconnected!",
        text: "Your opponent has left the game. You will be redirected to the main page.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        resetGame();
        navigate("/");
      });
    });

    return () => newSocket.close();
  }, []);

  // Navigation effect based on game state
  useEffect(() => {
    if (gameState === "playing") {
      navigate("/game");
    } else if (gameState === "finished") {
      navigate("/gameover");
    } else if (gameState === "login" || gameState === "waiting") {
      navigate("/");
    }
  }, [gameState, navigate]);

  const resetGame = () => {
    setGameState("login");
    setUsername("");
    setCurrentRound(1);
    setPlayerChoice("");
    setOpponentChoice("");
    setScores({ player: 0, opponent: 0 });
    setGameHistory([]);
    setRoundResult("");
    setOpponentName("");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginWaiting
            socket={socket}
            gameState={gameState}
            username={username}
            setUsername={setUsername}
            roomId={roomId}
            opponentName={opponentName}
            setGameState={setGameState}
          />
        }
      />
      <Route
        path="/game"
        element={
          <GamePlaying
            socket={socket}
            gameState={gameState}
            username={username}
            opponentName={opponentName}
            roomId={roomId}
            currentRound={currentRound}
            setCurrentRound={setCurrentRound}
            playerChoice={playerChoice}
            setPlayerChoice={setPlayerChoice}
            opponentChoice={opponentChoice}
            setOpponentChoice={setOpponentChoice}
            scores={scores}
            setScores={setScores}
            gameHistory={gameHistory}
            setGameHistory={setGameHistory}
            roundResult={roundResult}
            setRoundResult={setRoundResult}
            isWaitingForOpponent={isWaitingForOpponent}
            setIsWaitingForOpponent={setIsWaitingForOpponent}
            setGameState={setGameState}
          />
        }
      />
      <Route
        path="/gameover"
        element={
          <GameOver
            gameState={gameState}
            username={username}
            opponentName={opponentName}
            scores={scores}
            gameHistory={gameHistory}
            resetGame={resetGame}
          />
        }
      />
    </Routes>
  );
}

export default App;
