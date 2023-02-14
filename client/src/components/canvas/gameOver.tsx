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
      return [ score[0], score[1]] ;
    });
    console.log(scoresArr);

    const scoresList = document.getElementById("scoresList");
    if(scoresList){
      while( scoresList.firstChild ){
        scoresList.removeChild( scoresList.firstChild );
      }
      scoresArr.forEach((item) => {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(`${item[0]} team -- ${item[1]}`));
        scoresList.appendChild(li);
      })
    }
  };

  displayScores();
  return (
    <>
      {props.isOpen && (
        
        <div className="gameover-overlay" >
          <div>
            <h1>Game Over</h1>
            <h3 id="displayWinner"> </h3>
            <ul id="scoresList">
            </ul>
            <button onClick={goToLobby}>Start a Public Game!</button>
          </div>
          <div onClick={(e) => e.stopPropagation()} >
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
