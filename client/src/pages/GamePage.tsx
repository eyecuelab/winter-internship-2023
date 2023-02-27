import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import { userType } from "../types/Types";

interface Props {
  userData: userType | undefined;
}

const GamePage = (props: Props) => {
  const { userData } = props;
  const { gameId } = useParams();

  return (
    <div>
      <Canvas gameId={gameId} userData={userData} />
    </div>
  );
};

GamePage.propTypes = {};

export default GamePage;
