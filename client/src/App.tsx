import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/login/Login";
import Canvas from "./components/canvas/Canvas";
import Lobby from "./components/lobby/Lobby";
import Test1 from "./Test1";
import Test2 from "./Test2";
import { userType } from "./types/Types";
import GamePage from "./pages/GamePage";
import { socket } from "./GlobalSocket";

function App() {
  const [userData, setUserData] = useState<userType | undefined>();

  useEffect(() => {
    return () => {
      setUserData(undefined);
    };
  }, []);

  useEffect(()=>{
    const userId =userData?.id;
    socket.emit("user_id_update", { userId });
  }, [userData])

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
              setUserData={setUserData}
              userData={userData}
              logout={handleLogout}
            />
          }
        />

        <Route
          path="/game/:gameId"
          element={<GamePage userData={userData} />}
        />

        <Route path="/Test1" element={<Test1 />} />
        <Route path="/Test2" element={<Test2 />} />
      </Routes>
    </Router>
  );
}

export default App;
