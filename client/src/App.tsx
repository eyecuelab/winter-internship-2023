import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login";
import Canvas from "./components/canvas/Canvas";
import Lobby from "./components/lobby/Lobby";
import Test1 from "./Test1";
import Test2 from "./Test2";
import SocketHandling from "./components/socketHandling/SocketHandling";
import { userType } from "./types/Types";
import GamePage from "./pages/GamePage";

function App() {
  const [userData, setUserData] = useState<userType | undefined>();

  const handleUserData = (newData: userType) => {
    setUserData(newData);
  };

  const handleLogout = () => {
    setUserData(undefined);
    localStorage.clear();
    window.localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/lobby"
          element={
            <Lobby
              updateUserData={handleUserData}
              userData={userData}
              logout={handleLogout}
            />
          }
        />
        <Route path="/sockets" element={<SocketHandling />} />
        <Route path="/game" element={<Canvas />} />

        <Route path="/game/:gameId" element={<GamePage />} />

        <Route path="/Test1" element={<Test1 />} />
        <Route path="/Test2" element={<Test2 />} />
      </Routes>
    </Router>
  );
}

export default App;
