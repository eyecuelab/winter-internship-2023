import React, { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Canvas from "../components/canvas/Canvas";
import GamePageWrapper from "./GamePage/GamePageWrapper";
import {
  roomGameType,
  userType,
  myGameType,
  lastKeyType,
} from "../types/Types";
import backgroundMusic from "../assets/backgroundMusic.wav";
import { Kart, Team } from "./../components/canvas/gameClasses";

interface Props {
  userData: userType | undefined;
}

const GamePage = (props: Props) => {
  const { userData } = props;
  const { gameId } = useParams();

  const roomGameRef = useRef<roomGameType>({
    karts: new Map(),
    scores: new Map(),
    isGameOver: false,
  });

  const myGameRef = useRef<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: new Team(),
    myKart: new Kart(), // deprecated
  });

  const lastKeyRef = useRef<lastKeyType>({
    lastKey: "",
  });

  const [roomGameStateWrapper, setRoomGameStateWrapper] =
    useState<roomGameType>({
      karts: new Map(),
      scores: new Map(),
      isGameOver: false,
    });

  const [myGameStateWrapper, setMyGameStateWrapper] = useState<myGameType>({
    userList: [],
    myTeamMate: "",
    myControl: "",
    myTeam: new Team(),
    myKart: new Kart(), // deprecated
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [gameMusic, setGameMusic] = useState(new Audio(backgroundMusic));

  useEffect(() => {
    gameMusic.volume = 0.1;
    gameMusic.loop = true;
    if (isMusicPlaying) {
      gameMusic.play();
    } else {
      gameMusic.pause();
      gameMusic.currentTime = 0;
    }
  }, [gameMusic, isMusicPlaying]);

  const updateWrapperState = () => {
    const myGameRefCurrent = myGameRef.current;
    const roomGameRefCurrent = roomGameRef.current;
    setMyGameStateWrapper(myGameRefCurrent);
    setRoomGameStateWrapper(roomGameRefCurrent);
  };

  const handlePauseClick = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className={`app-container`}>
      <GamePageWrapper
        handlePauseClick={handlePauseClick}
        roomGameStateWrapper={roomGameStateWrapper}
        myGameStateWrapper={myGameStateWrapper}
        updateWrapperState={updateWrapperState}
        lastKeyRef={lastKeyRef}
      />
      <div>
        <Canvas
          gameId={gameId}
          userData={userData}
          roomGameRef={roomGameRef}
          myGameRef={myGameRef}
          setRoomGameStateWrapper={setRoomGameStateWrapper}
          setMyGameStateWrapper={setMyGameStateWrapper}
          updateWrapperState={updateWrapperState}
          lastKeyRef={lastKeyRef}
        />
      </div>
    </div>
  );
};

export default GamePage;
