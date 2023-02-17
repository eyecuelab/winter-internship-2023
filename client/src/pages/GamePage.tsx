import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";

const GamePage = () => {
  const { gameId } = useParams();

  return (
    <div>
      <Canvas gameId={gameId} />
    </div>
  );
};

GamePage.propTypes = {};

export default GamePage;
