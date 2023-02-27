import { useEffect, useState, useRef } from "react";
import React, { ReactNode } from "react";
import { Kart, Team } from "./gameClasses";
import { myGameType, roomGameType } from "./../../types/Types"

interface WaitingForStartType {
  children?: ReactNode;
  isWaitingForGameModalOpen: boolean;
  roomGameState: roomGameType;
  myGameState: myGameType;
  isCountingDown: boolean;
}

export function WaitingForStart(props: WaitingForStartType) {
  const { roomGameState, myGameState, isWaitingForGameModalOpen, isCountingDown } = props;
  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const teamInfo = document.getElementById("teamInfo");

  useEffect(() => {
    if (myGameState.myTeam && roomGameState.karts) {
      const myCurrentTeam = myGameState.myTeam;
      const myCurrentKart = roomGameState.karts.get(myCurrentTeam.color);
      setMyTeam(myCurrentTeam);
      setMyKart(myCurrentKart);
    }
    displayTeam();
  });

  useEffect(()=> {
    if (isCountingDown) {
      countDown(7);
    }
  }, [isCountingDown])
  
  const countDown = (seconds: number) => {
    let counter = seconds;
    const interval = setInterval(() => {
      if (counter >= 2) {
        if (teamInfo) {        
          teamInfo.innerHTML = "";
        } 
        const li = document.createElement("li");
        li.appendChild(
          document.createTextNode(`Count:${(counter-2).toString()}`)
        );
      teamInfo?.appendChild(li);
      counter--;
      }
      if (counter === 1) {
        if (teamInfo) {        
          teamInfo.innerHTML = "";
        } 
        const li = document.createElement("li");
        li.appendChild(
          document.createTextNode(`Go!`)
        );
        teamInfo?.appendChild(li);
        clearInterval(interval);
      }
    }, 1000);
  }

  const displayTeam = () => { 

    if (myKart && myTeam) {
      if (teamInfo) {        
        teamInfo.innerHTML = "";
      } 
      const li = document.createElement("li");
        li.appendChild(
          document.createTextNode(`You are on Team ${myTeam.color}! You will be driving your kart in the (vertical(W/S)/horizontal(A/D)) direction while your teammate will be driving in the (vertical(W/S)/horizontal(A/D)) direction.`)
        );
        teamInfo?.appendChild(li);
      } else {
        if (teamInfo) {        
          teamInfo.innerHTML = "";
        } 
        const li = document.createElement("li");
        li.appendChild(
        document.createTextNode(`Waiting for Teammate...`)
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
              <h1>Lobby Room</h1>
              <ul id="teamInfo"></ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
