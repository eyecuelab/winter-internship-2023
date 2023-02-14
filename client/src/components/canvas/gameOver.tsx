import { useEffect, useState } from "react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface GameOverType {
  children?: ReactNode;
  isGameOverModalOpen: boolean;
  setIsGameOverModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleGameOver: () => void;
  scores: Map<string, number>;
}

export function GameOver(props: GameOverType) {
  const navigate = useNavigate();
  const goToLobby = () => {
    navigate("/lobby");
  };

  useEffect(() => {
    displayScores()
  }, [props.isGameOverModalOpen])
  
  const displayScores = () => {
    const scoresArr = Array.from(props.scores, function (score) {
      return [score[0], score[1] ?? 0];
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
      {props.isGameOverModalOpen && (
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
