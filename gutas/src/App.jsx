import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import io from "socket.io-client";
import Swal from "sweetalert2";
import LoginWaiting from "./components/LoginWaiting";


function App() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [gameState, setGameState] = useState("login");
  const [roomId, setRoomId] = useState("");
  const [opponentName, setOpponentName] = useState("");


  useEffect(() => {
    const newSocket = io("http://localhost:3001");
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


      Swal.fire({
        title: "Game Started!",
        text: `Your opponent is ${data.opponentName}. Let the battle begin!`,
        icon: "success",
        confirmButtonText: "Start Playing!",
        confirmButtonColor: "#28a745",
      });
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


  const resetGame = () => {
    setGameState("login");
    setUsername("");
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

    </Routes>
  );
}

export default App;
