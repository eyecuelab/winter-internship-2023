import React from 'react';
import { roomGameType } from '../types/Types';
import "./gamePageStyles.css";

interface Props {
  handlePauseClick: () => void;
  roomGameRef: React.RefObject<roomGameType>
}

function GamePageWrapper (props:Props) {
  const { handlePauseClick, roomGameRef } = props;

  console.log(roomGameRef.current)


  return (
    <>
      <div id="left">
      <button style={{marginTop: 50}} onClick={handlePauseClick}>music</button>
      <p>
        </p>
      </div>
      
      <div id="right"></div>
      <div id="top"></div>
      <div id="bottom"></div>
    </>
  )
}

export default GamePageWrapper;