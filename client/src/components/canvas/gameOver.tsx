// useGameOver.tsx

import { useState } from "react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function useGameOver() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGameOver = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    toggleGameOver,
  };
}

interface GameOverType {
  children?: ReactNode;
  isOpen: boolean;
  toggleGameOver: () => void;
  scores: Map<string, number>;
}

export function GameOver(props: GameOverType) {
  const navigate = useNavigate();
  const goToLobby = () => {
    navigate("/lobby");
  };

  const displayScores = () => {
    const scoresArr = Array.from(props.scores, function (score) {
      return [score[0], score[1]];
    });
    console.log(scoresArr);

    const scoresList = document.getElementById("scoresList");
    if (scoresList) {
      while (scoresList.firstChild) {
        scoresList.removeChild(scoresList.firstChild);
      }
      scoresArr.forEach((item) => {
        var li = document.createElement("li");
        li.appendChild(
          document.createTextNode(`${item[0]} team -- ${item[1]}`)
        );
        scoresList.appendChild(li);
      });
    }
  };

  displayScores();
  return (
    <>
      {props.isOpen && (
        <div className="gameover-overlay" onClick={props.toggleGameOver}>
          
          <div onClick={(e) => e.stopPropagation()} className="gameover-box">
            <div>
            <h1>Game Over</h1>
            <ul id="scoresList">
            </ul>
            <button onClick={goToLobby}>Back to Lobby</button>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
