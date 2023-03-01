import React from 'react';
import "./gamePageStyles.css";

interface Props {
  handlePauseClick: () => void;
}

function GamePageWrapper (props:Props) {
  const { handlePauseClick } = props;


  return (
    <>
      <div id="left">
      <button style={{marginTop: 50}} onClick={handlePauseClick}>music</button>
      </div>
      
      <div id="right"></div>
      <div id="top"></div>
      <div id="bottom"></div>
    </>
  )
}

export default GamePageWrapper;