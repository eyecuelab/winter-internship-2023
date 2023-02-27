import { useEffect, useState, useRef } from "react";
import React, { ReactNode } from "react";
import { Kart, Team } from "./gameClasses";
import { myGameType, roomGameType } from "./../../types/Types"

interface WaitingForStartType {
  children?: ReactNode;
  isWaitingForGameModalOpen: boolean;
  roomGameState: roomGameType;
  myGameState: myGameType;
  updateWaitingForStart: boolean;
}

export function WaitingForStart(props: WaitingForStartType) {
  const { roomGameState, myGameState, isWaitingForGameModalOpen, updateWaitingForStart } = props;
  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (myGameState.myTeam && roomGameState.karts) {
      console.log(myGameState.myTeam)
      console.log(roomGameState.karts)
      const myCurrentTeam = myGameState.myTeam;
      const myCurrentKart = roomGameState.karts.get(myCurrentTeam.color);
      setMyTeam(myCurrentTeam);
      setMyKart(myCurrentKart);
      console.log(myKart);
      console.log(myTeam); 
    }
  console.log(myKart);
  console.log(myTeam);
  displayTeam();
  });
  

  // roomGameRef.current?.addEventListener('change', handleChange);

  // if (isWaitingForGameModalOpen) {
  //   displayTeam();
  // }

  const displayTeam = () => { 
    const teamInfo = document.getElementById("teamInfo");

    if (myKart && myTeam) {
      
      const li = document.createElement("li");
          li.appendChild(
            document.createTextNode(`You are on Team ${myTeam.color}! You will be driving your kart in the (vertical(W/S)/horizontal(A/D)) direction while your teammate will be driving the (vertical(W/S)/horizontal(A/D)) direction.`)
          );
          teamInfo?.appendChild(li);
      } else {
           const li = document.createElement("li");
            li.appendChild(
            document.createTextNode(`Waiting for your teammate to join...`)
          );
            teamInfo?.appendChild(li);
       }
    }

  return (
    <>
      {isWaitingForGameModalOpen && (
        <div className="waitingforstart-overlay">
          <div onClick={(e) => e.stopPropagation()} className="waitingforstart-box">
            <div>
              <h1>Waiting for everyone to join...</h1>
              <ul id="teamInfo"></ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
