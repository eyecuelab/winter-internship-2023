import React, { useEffect, useRef, useState} from 'react';
import { roomGameType, myGameType } from '../types/Types';
import { Kart, Team } from "../components/canvas/gameClasses";
import "./gamePageStyles.css";
import { verticalDirSvgString } from "../assets/verticalDirBothYellowSvg";
import { horizontalDirSvgString } from "../assets/horizontalDirBothYellowSvg";
import { redGhostIconSvgString } from "../assets/redGhostIconSvg";
import { pinkGhostIconSvgString } from "../assets/pinkGhostIconSvg";
import { blueGhostIconSvgString } from "../assets/blueGhostIconSvg";
import { orangeGhostIconSvgString } from "../assets/orangeGhostIconSvg";
import { redPacmanIconSvgString } from "../assets/redPacmanIconSvg";
import { bluePacmanIconSvgString } from "../assets/bluePacmanIconSvg";
import { orangePacmanIconSvgString } from "../assets/orangePacmanIconSvg";
import { pinkPacmanIconSvgString } from "../assets/pinkPacmanIconSvg";
import { socketId } from "./../GlobalSocket";

interface Props {
  handlePauseClick: () => void;
  roomGameStateWrapper: roomGameType;
  myGameStateWrapper:  myGameType;
  updateWrapperState: () => void;
}

function GamePageWrapper (props:Props) {
  const { handlePauseClick, roomGameStateWrapper, myGameStateWrapper, updateWrapperState } = props;
  
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

  // const [roomGame, setRoomGame] = useState<roomGameType | undefined>(undefined);
  // const [myGame, setMyGame] = useState<myGameType | null>(null);
  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [count, setCount] = useState(0);

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
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 33);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (myGameStateWrapper.myTeam && roomGameStateWrapper.karts) {
      const myCurrentTeam = myGameStateWrapper.myTeam;
      const myCurrentKart = roomGameStateWrapper.karts.get(myCurrentTeam.color);
      // console.log(roomGameStateWrapper);
      // console.log(myGameStateWrapper);
      // console.log(myCurrentTeam.color);
      // console.log(myCurrentKart)
      setMyTeam(myCurrentTeam);
      // console.log(myTeam);
      setMyKart(myCurrentKart);
      // console.log(myKart);
    }
    displayTeam();
    updateWrapperState();
    console.count();
  });

  useEffect(() => {
    displayTeam();
    console.count();
  }, [roomGameStateWrapper, myGameStateWrapper])


  const displayTeam = () => {
    const teamInfo = document.getElementById("wrapper-info");
    if (roomGameStateWrapper && myGameStateWrapper) {
      if (teamInfo) {        
        teamInfo.innerHTML = "";
      } 
      const li = document.createElement("li");
        const teamImg = document.createElement("img"); 
        teamImg.setAttribute('id', 'team-img');
        console.log(myKart);
        // console.log(myTeam);
        if (myKart?.isGhost === false) {
          if (myTeam?.color === "blue") {
            console.log(bluePacmanSvgRef.current?.src);
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

        const liTwo = document.createElement("li");
        liTwo.setAttribute('id', 'my-team');
        if (myKart) {
          liTwo.textContent =`${myKart.position.x} position`;
        }
        teamInfo?.appendChild(liTwo);
      }
      console.log(myTeam);
      console.log(myKart);
      
      const liThree = document.createElement("li");
      liThree.setAttribute('id', 'my-direction-wrapper');
      const dirImg = document.createElement("img"); 
      dirImg.setAttribute('id', 'dir-img-wrapper');
      console.log(myTeam?.playerInControl);
      if (socketId === myTeam?.playerInControl) {
        dirImg.setAttribute('src', `${verticalDirSvgRef.current?.src}`);
      } else {
        // dirImg.setAttribute('src', `${pinkGhostSvgRef.current?.src}`);
      }
      liThree.appendChild(dirImg);
      console.log(liThree.textContent);
      teamInfo?.appendChild(liThree);
  } 


  return (
    <>
      <div id="left">
      <ul id="wrapper-info">
        </ul>
        <button id="music-button"style={{marginTop: 50}} onClick={handlePauseClick}>music</button>
      </div>
      
      <div id="right"></div>
      <div id="top"></div>
      <div id="bottom">
        <div>{count}</div>;
      </div>
    </>
  )
}

export default GamePageWrapper;