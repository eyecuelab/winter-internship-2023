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
  toggleGameStart:  () => void;
}

export function WaitingForStart(props: WaitingForStartType) {
  const { roomGameState, myGameState, isWaitingForGameModalOpen, isCountingDown, toggleGameStart } = props;
  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const teamInfo = document.getElementById("teamInfo");

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

  useEffect(()=> {
    console.log(isCountingDown);
    if (isCountingDown) {
      console.log(isCountingDown);
      countDown(7);
    }
  }, [isCountingDown])
  
  const countDown = (seconds: number) => {
    console.log("countDown!54321")
    let counter = seconds;
    const interval = setInterval(() => {
      console.count();
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
      // if (counter === 2) {
      //   if (teamInfo) {        
      //     teamInfo.innerHTML = "";
      //   } 
      //   counter--;
      // }
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
          document.createTextNode(`You are on Team ${myTeam.color}! You will be driving your kart in the (vertical(W/S)/horizontal(A/D)) direction while your teammate will be driving the (vertical(W/S)/horizontal(A/D)) direction.`)
        );
        teamInfo?.appendChild(li);
      } else {
        if (teamInfo) {        
          teamInfo.innerHTML = "";
        } 
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
              <h1>Super Pacart</h1>
              <ul id="teamInfo"></ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
