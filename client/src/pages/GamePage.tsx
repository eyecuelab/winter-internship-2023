import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import GamePageWrapper from "./GamePageWrapper";
import { userType } from "../types/Types";
import backgroundMusic from "../assets/backgroundMusic.wav";

interface Props {
  userData: userType | undefined;
}

const GamePage = (props: Props) => {
  const { userData } = props;
  const { gameId } = useParams();

  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [gameMusic, setGameMusic] = useState(new Audio(backgroundMusic));

  useEffect(() => {
    gameMusic.volume = 0.5;
    gameMusic.loop = true;
    if (isMusicPlaying) {
      gameMusic.play();
    } else {
      gameMusic.pause();
      gameMusic.currentTime = 0;
    }
  }, [gameMusic, isMusicPlaying]);

  const handlePauseClick = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className={`app-container`}>
      <GamePageWrapper handlePauseClick={handlePauseClick}/>
      <div>
        <Canvas gameId={gameId} userData={userData} />
      </div>
    </div>
  );
};

export default GamePage;

GamePage.propTypes = {};
