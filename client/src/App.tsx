import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login";
import Canvas from "./components/canvas/Canvas";
import Lobby from "./components/lobby/Lobby";
import SocketHandling from "./components/socketHandling/socketHandling";
import { userType } from "./types/Types";

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
      </Routes>
    </Router>
  );
}

export default App;
