import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import GamePageWrapper from "./GamePageWrapper";

const GamePage = () => {
  const { gameId } = useParams();

  return (
    <div className={`app-container`}>
      <GamePageWrapper />
      <div>
        <Canvas gameId={gameId} />
      </div>
    </div>
  );
};

GamePage.propTypes = {};

export default GamePage;
