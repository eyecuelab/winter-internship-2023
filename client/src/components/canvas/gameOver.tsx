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
      return { color: score[0], score: score[1] };
    });

    const scoresList = document.getElementById("scoresList");
    scoresArr.forEach((item) => {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(`${item.color} team -- ${item.score}`));
      scoresList?.appendChild(li);
    })
    let teamOne = document.getElementById("team1");
    let teamTwo = document.getElementById("team2");

    if (teamOne && scoresArr[0]) {
      teamOne.innerText = scoresArr[0]["score"].toString();
    }
    if (teamTwo && scoresArr[1]) {
      teamTwo.innerText = scoresArr[1]["score"].toString();
    }
  };

  return (
    <>
      {props.isOpen && (
        
        <div className="gameover-overlay" onClick={props.toggleGameOver}>
          <div>
            <h1>Game Over</h1>
            <ul id="scoresList">
            </ul>
            <h2>Team 1: $score</h2>
            <hr />
            <h2>Team 2: $score</h2>
            <button onClick={goToLobby}>Start a Public Game!</button>
          </div>
          {/* <div onClick={(e) => e.stopPropagation()} >
            {props.children}
          </div> */}
        </div>
      )}
    </>
  );
}
