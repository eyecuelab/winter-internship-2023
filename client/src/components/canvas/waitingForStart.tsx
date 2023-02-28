import { useEffect, useState, useRef } from "react";
import React, { ReactNode } from "react";
import { Kart, Team } from "./gameClasses";
import { myGameType, roomGameType } from "./../../types/Types"
import { verticalDirSvgString } from "../../assets/verticalDirSvg";
import { horizontalDirSvgString } from "../../assets/horizontalDirSvg";
import { pinkGhostSvgString } from "../../assets/pinkGhostSvgString";
import { redPacmanSvgString } from "../../assets/redPacmanSvg";
import { bluePacmanSvgString } from "../../assets/bluePacmanSvg";

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
  const verticalDirSvgRef = useRef<HTMLImageElement | undefined>();
  const horizontalDirSvgRef = useRef<HTMLImageElement | undefined>();
  const bluePacmanSvgRef = useRef<HTMLImageElement | undefined>();

  useEffect(() => {
    const verticalDirImg = new Image();
    verticalDirImg.src = `data:image/svg+xml;base64,${window.btoa(verticalDirSvgString)}`;
    verticalDirImg.addEventListener("load", () => {
      verticalDirSvgRef.current = verticalDirImg;
    });

    const horizontalDirImg = new Image();
    horizontalDirImg.src = `data:image/svg+xml;base64,${window.btoa(horizontalDirSvgString)}`;
    horizontalDirImg.addEventListener("load", () => {
      horizontalDirSvgRef.current = horizontalDirImg;
    });

    const bluePacmanImg = new Image();
    bluePacmanImg.src = `data:image/svg+xml;base64,${window.btoa(bluePacmanSvgString)}`;
    bluePacmanImg.addEventListener("load", () => {
      bluePacmanSvgRef.current = bluePacmanImg;
    });
  }, [])

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
          document.createTextNode(`My Team:`)
        );
        const teamImg = document.createElement("img"); 
        teamImg.setAttribute('src', `${bluePacmanSvgRef.current?.src}`);
        teamImg.setAttribute('id', 'team-img');

        const divElement = document.createElement('div');
        divElement.style.display = 'block';
        divElement.appendChild(teamImg);
        li?.appendChild(divElement);
        teamInfo?.appendChild(li);

        const liTwo = document.createElement("li");
        liTwo.setAttribute('id', 'my-team');
        liTwo.textContent =`${myTeam.color}`;
        teamInfo?.appendChild(liTwo);
        const liThree= document.createElement("li");
        liThree.appendChild(
          document.createTextNode(`My Direction:`)
        );
        teamInfo?.appendChild(liThree);
        const liFour= document.createElement("li");
        liFour.setAttribute('id', 'my-direction');
        const horizontalImg = document.createElement("img");
        horizontalImg.setAttribute('src', `${horizontalDirSvgRef.current?.src}`);
        horizontalImg.setAttribute('id', 'horizontal-img');
    
        const divElementTwo = document.createElement('div');
        divElementTwo.style.display = 'block';
        divElementTwo.appendChild(horizontalImg);
        liFour?.appendChild(divElementTwo);
        teamInfo?.appendChild(liFour);
        liFour.appendChild(
          document.createTextNode(`horizontal`)
        );

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
            <div id="heading">
              <h1>lobby room</h1>
            </div>
            <div>
              <ul id="teamInfo"></ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
