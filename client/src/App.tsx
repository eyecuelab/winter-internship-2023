import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login";
import Lobby from "./components/lobby/Lobby";
import GamePage from "./pages/GamePage/GamePage";
import { socket } from "./GlobalSocket";
import { userType } from "./types/Types";

function App() {
  const [userData, setUserData] = useState<userType | undefined>();

  useEffect(() => {
    const userId = userData?.id;
    socket.emit("user_id_update", { userId });
  }, [userData]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/lobby"
          element={
            <Lobby
              setUserData={setUserData}
              userData={userData}
            />
          }
        />
        <Route
          path="/game/:gameId"
          element={<GamePage userData={userData} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
