import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import GamePageWrapper from "./GamePageWrapper";
import { userType } from "../types/Types";

interface Props {
  userData: userType | undefined;
}

const GamePage = (props: Props) => {
  const { userData } = props;
  const { gameId } = useParams();

  return (
    <div className={`app-container`}>
      <GamePageWrapper />
    <div>
      <Canvas gameId={gameId} userData={userData} />
    </div>
    </div>
  )
};

export default GamePage;

GamePage.propTypes = {};