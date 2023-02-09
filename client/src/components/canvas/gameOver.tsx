// useGameOver.tsx

import { useState } from "react";
import React, { ReactNode } from "react";

export function useGameOver() {
  const [isOpen, setisOpen] = useState(false);

  const toggle = () => {
    setisOpen(!isOpen);
  };

  return {
    isOpen,
    toggle
  };
}

//gameover



interface GameOverType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export function GameOver(props: GameOverType) {
  
  return (
    <>
      {props.isOpen && (
        <div className="gameover-overlay" onClick={props.toggle}>
          <div onClick={(e) => e.stopPropagation()} className="gameover-box">
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}