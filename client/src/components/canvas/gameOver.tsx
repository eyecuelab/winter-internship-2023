// useGameOver.tsx

import { useState } from "react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function useGameOver() {
  const [isOpen, setisOpen] = useState(false);

  const toggleGameOver = () => {
    setisOpen(!isOpen);
  };

  return {
    isOpen,
    toggleGameOver,
  };
}

//gameover

interface GameOverType {
  children?: ReactNode;
  isOpen: boolean;
  toggleGameOver: () => void;
}

export function GameOver(props: GameOverType) {
  const navigate = useNavigate();
  const goToLobby = () => {
    navigate("/lobby");
  };

  return (
    <>
      {props.isOpen && (
        <div className="gameover-overlay" onClick={props.toggleGameOver}>
          <div>
            <h1>Game Over</h1>
            <h2>Team 1: $score</h2>
            <hr />
            <h2>Team 2: $score</h2>
            <button onClick={goToLobby}>Start a Public Game!</button>
          </div>
          <div onClick={(e) => e.stopPropagation()} className="gameover-box">
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
