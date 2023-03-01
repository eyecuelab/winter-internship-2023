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
    displayScores();
  }, [props.isGameOverModalOpen]);

  const displayScores = () => {
    //this function exists in canvas so we could combine them.
    const scoresArr = Array.from(props.scores, function (score) {
      return [score[0], score[1] ?? 0];
    });
    
    const finalScoreHeading = document.createElement('h2');

    const scoresList = document.getElementById("scores-list");
    if (scoresList) {
      while (scoresList.firstChild) {
        scoresList.removeChild(scoresList.firstChild);
      }
      scoresArr.forEach((item) => {
        var li = document.createElement("li");
        li.appendChild(
          document.createTextNode(`${item[0]} team `)
        );
        var teamScore = document.createElement("span");
        teamScore.innerText = ` ${item[1]}`;
        teamScore.setAttribute('id','team-score');
        li.appendChild(
          teamScore
        );
        scoresList.appendChild(li);
        if (item[0] === "red") {
            li.style.color = "#D52527";
          } else if (item[0] === "orange") {
            li.style.color = "#F69343";
          } else if (item[0] === "blue") {
            li.style.color = "#005487";
          } else if (item[0] === "pink") {
            li.style.color = "#F06ACA";
          } else {
  
          }
      });
    }
  };

  displayScores();
  return (
    <>
      {props.isGameOverModalOpen && (
        <div className="gameover-overlay">
          <div onClick={(e) => e.stopPropagation()} className="gameover-box">
            <div>
              <h1 id="game-over-heading">game over</h1>
              <p id="final-score-heading">final scores</p>
              <ul id="scores-list"></ul>
              <button onClick={goToLobby}>Back to Lobby</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
