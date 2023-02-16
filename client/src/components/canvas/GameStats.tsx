import React, { useEffect } from "react";
import { socketId } from "../../GlobalSocket";

interface GameStatsType {
  scores: Map<string, number>;
  playerInControl: string;
  myTeamColor: string;
}

const GameStats = (props: GameStatsType) => {
  const { scores, playerInControl, myTeamColor } = props;
  console.log(props);
  const isInControl = playerInControl === socketId;
  useEffect(() => {
    const displayScores = () => {
      const scoresArr = Array.from(scores, function (score) {
        return [score[0], score[1] ?? 0];
      });
  
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
  }, [scores]);

  return (
    <>
      <p>
        {isInControl ? `YOU ARE IN CONTROL` : `your are NOT in control`} | my
        team: {myTeamColor}
      </p>
      <p>scores:</p>
      <ul id="scoresList"></ul>
    </>
  );
};

GameStats.propTypes = {};

export default GameStats;
