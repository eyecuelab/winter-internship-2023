import { useEffect, useState } from "react";
import React, { ReactNode } from "react";

interface InstructionsType {
  children?: ReactNode;
  areInstructionsModalOpen: boolean;
  //setareInstructionsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
 
}

export function useInstructions() {
  const [isOpen, setisOpen] = useState(false);
  const toggle = () => {
    setisOpen(!isOpen);
  }
  return {
    isOpen,
    toggle
  }
} 

export function Instructions(props: InstructionsType) {
return (
  <>
    {props.areInstructionsModalOpen && (
      <div className="instructions-overlay" onClick={props.toggle}>
        <div onClick={(e) => e.stopPropagation()} className="instructions-box">
          <div className="instructions-text">
          <p>
            You will be paired with a teammate, and the two of you will control one kart. One player controls the vertical movement with W and S, and the other players controls horizontal movement with A and D. After you change the kart's direction, you won't be able to change your kart's direction until after your partner changes the kart's direction.
          </p>
          <p>
          Pairs will initially be assigned to be either a pac man or a ghost. If you're a ghost, your kart will be black and it will be driven by a ghost of your team's color. As a pac man, your driver will be a pac man and your kart will be your team's color. As a pac man you avoid ghosts and collect pellets. As a ghost, your only goal is to catch the pacman players. When a ghost catches a pac man, the team that was a pac man will be sent to a different part of the map and become a ghost, and the team that was a ghost will become a pac man and be able to collect pellets.
          </p>
          <p>
            The pair with the highest amount of points when all the pellets are gone will win the game. 
          </p>
          </div>
        </div>
      </div>
    )}
  </>
  );
    }