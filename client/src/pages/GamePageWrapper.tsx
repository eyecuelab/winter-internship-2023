import React, { useEffect, useRef, useState} from 'react';
import { roomGameType, myGameType } from '../types/Types';
import { Kart, Team } from "./../components/canvas/gameClasses";
import "./gamePageStyles.css";
import { verticalDirSvgString } from "../assets/verticalDirSvg";
import { horizontalDirSvgString } from "../assets/horizontalDirSvg";
import { redGhostIconSvgString } from "../assets/redGhostIconSvg";
import { pinkGhostIconSvgString } from "../assets/pinkGhostIconSvg";
import { blueGhostIconSvgString } from "../assets/blueGhostIconSvg";
import { orangeGhostIconSvgString } from "../assets/orangeGhostIconSvg";
import { redPacmanIconSvgString } from "../assets/redPacmanIconSvg";
import { bluePacmanIconSvgString } from "../assets/bluePacmanIconSvg";
import { orangePacmanIconSvgString } from "../assets/orangePacmanIconSvg";
import { pinkPacmanIconSvgString } from "../assets/pinkPacmanIconSvg";

interface Props {
  handlePauseClick: () => void;
  roomGameRef: React.RefObject<roomGameType>;
  myGameRef:  React.RefObject<myGameType>
}

function GamePageWrapper (props:Props) {
  const { handlePauseClick, roomGameRef, myGameRef } = props;
  
  const verticalDirSvgRef = useRef<HTMLImageElement | undefined>();
  const horizontalDirSvgRef = useRef<HTMLImageElement | undefined>();
  const bluePacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const orangePacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const redPacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const pinkPacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const pinkGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const redGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const blueGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const orangeGhostSvgRef = useRef<HTMLImageElement | undefined>();

  const [roomGame, setRoomGame] = useState<roomGameType | undefined>(undefined);
  const [myGame, setMyGame] = useState<myGameType | null>(null);
  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);

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
    bluePacmanImg.src = `data:image/svg+xml;base64,${window.btoa(bluePacmanIconSvgString)}`;
    bluePacmanImg.addEventListener("load", () => {
      bluePacmanSvgRef.current = bluePacmanImg;
    });

    const orangePacmanImg = new Image();
    orangePacmanImg.src = `data:image/svg+xml;base64,${window.btoa(orangePacmanIconSvgString)}`;
    orangePacmanImg.addEventListener("load", () => {
      orangePacmanSvgRef.current = orangePacmanImg;
    });

    const redPacmanImg = new Image();
    redPacmanImg.src = `data:image/svg+xml;base64,${window.btoa(redPacmanIconSvgString)}`;
    redPacmanImg.addEventListener("load", () => {
      redPacmanSvgRef.current = redPacmanImg;
    });

    const pinkPacmanImg = new Image();
    pinkPacmanImg.src = `data:image/svg+xml;base64,${window.btoa(pinkPacmanIconSvgString)}`;
    pinkPacmanImg.addEventListener("load", () => {
      pinkPacmanSvgRef.current = pinkPacmanImg;
    });

    const pinkGhostImg = new Image();
    pinkGhostImg.src = `data:image/svg+xml;base64,${window.btoa(pinkGhostIconSvgString)}`;
    pinkGhostImg.addEventListener("load", () => {
      pinkGhostSvgRef.current = pinkGhostImg;
    });

    const redGhostImg = new Image();
    redGhostImg.src = `data:image/svg+xml;base64,${window.btoa(redGhostIconSvgString)}`;
    redGhostImg.addEventListener("load", () => {
      redGhostSvgRef.current = redGhostImg;
    });

    const orangeGhostImg = new Image();
    orangeGhostImg.src = `data:image/svg+xml;base64,${window.btoa(orangeGhostIconSvgString)}`;
    orangeGhostImg.addEventListener("load", () => {
      orangeGhostSvgRef.current = orangeGhostImg;
    });

    const blueGhostImg = new Image();
    blueGhostImg.src = `data:image/svg+xml;base64,${window.btoa(blueGhostIconSvgString)}`;
    blueGhostImg.addEventListener("load", () => {
      blueGhostSvgRef.current = blueGhostImg;
    });

  }, [])

  useEffect(() => {
    if (roomGameRef.current && myGameRef.current) {
      const myCurrentTeam = myGameRef.current.myTeam;
      const myCurrentKart = roomGameRef.current.karts.get(myCurrentTeam.color);
      if (myCurrentTeam) {
        setMyTeam(myCurrentTeam);
      }
      setMyKart(myCurrentKart);
    }

    displayTeam();
  });


  const displayTeam = () => {
    const teamInfo = document.getElementById("wrapper-info");
    if (roomGameRef.current && myGameRef.current) {
      if (teamInfo) {        
        teamInfo.innerHTML = "";
      } 
      const li = document.createElement("li");
        const teamImg = document.createElement("img"); 
        teamImg.setAttribute('id', 'team-img');
        if (myKart?.isGhost === false) {
          if (myTeam?.color === "blue") {
            teamImg.setAttribute('src', `${bluePacmanSvgRef.current?.src}`);
          } 
          else if (myTeam?.color === "orange") {
            teamImg.setAttribute('src', `${orangePacmanSvgRef.current?.src}`);
          } 
          else if (myTeam?.color === "red") {
            teamImg.setAttribute('src', `${redPacmanSvgRef.current?.src}`);
          } 
          else if (myTeam?.color === "pink") {
            teamImg.setAttribute('src', `${pinkPacmanSvgRef.current?.src}`);
          } else {
            teamImg.setAttribute('src', `${bluePacmanSvgRef.current?.src}`);
          }
        }

        if (myKart?.isGhost === true) {
          if (myTeam?.color === "blue") {
            teamImg.setAttribute('src', `${blueGhostSvgRef.current?.src}`);
          } 
          else if (myTeam?.color === "orange") {
            teamImg.setAttribute('src', `${orangeGhostSvgRef.current?.src}`);
          } 
          else if (myTeam?.color === "red") {
            teamImg.setAttribute('src', `${redGhostSvgRef.current?.src}`);
          } 
          else if (myTeam?.color === "pink") {
            teamImg.setAttribute('src', `${pinkGhostSvgRef.current?.src}`);
          } else {
            teamImg.setAttribute('src', `${blueGhostSvgRef.current?.src}`);
          }
        }
        const divElement = document.createElement('div');
        divElement.style.display = 'block';
        divElement.appendChild(teamImg);
        li?.appendChild(divElement);
        teamInfo?.appendChild(li);
      }
     
  } 


  return (
    <>
      <div id="left">
      <button style={{marginTop: 50}} onClick={handlePauseClick}>music</button>
      <ul id="wrapper-info">
        </ul>
      </div>
      
      <div id="right"></div>
      <div id="top"></div>
      <div id="bottom"></div>
    </>
  )
}

export default GamePageWrapper;