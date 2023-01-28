import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from "./components/login/Login";
import Canvas from "./components/canvas/Canvas";
import Lobby from "./components/lobby/Lobby";
import { useState } from 'react';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/lobby" element={<Lobby />}></Route>
        <Route path="/game" element={<Canvas />}></Route>
      </Routes>
    </Router>
  );
}
export default App;