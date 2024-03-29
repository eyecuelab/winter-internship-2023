import React, { useEffect, useRef, useState} from 'react';
import { roomGameType, myGameType, lastKeyType } from '../types/Types';
import { Kart, Team } from "../components/canvas/gameClasses";
import "./gamePageStyles.css";
import { verticalDirBothYellowSvgString } from "../assets/verticalDirBothYellowSvg";
import { verticalDirBothGreySvgString } from "../assets/verticalDirBothGreySvg";
import { verticalDirBottomGreySvgString } from "../assets/verticalDirBottomGreySvg";
import { verticalDirTopGreySvgString } from "../assets/verticalDirTopGreySvg";
import { horizontalDirBothYellowSvgString } from "../assets/horizontalDirBothYellowSvg";
import { horizontalDirBothGreySvgString } from "../assets/horizontalDirBothGreySvg";
import { horizontalDirLeftGreySvgString } from "../assets/horizontalDirLeftGreySvg";
import { horizontalDirRightGreySvgString } from "../assets/horizontalDirRightGreySvg";
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
  lastKeyRef:  React.RefObject<lastKeyType>;
  updateWrapperState: () => void;
}

function GamePageWrapper (props:Props) {
  const { handlePauseClick, roomGameStateWrapper, myGameStateWrapper, lastKeyRef } = props;
  
  const verticalDirBothYellowSvgRef = useRef<HTMLImageElement | undefined>();
  const verticalDirBothGreySvgRef = useRef<HTMLImageElement | undefined>();
  const verticalDirTopGreySvgRef = useRef<HTMLImageElement | undefined>();
  const verticalDirBottomGreySvgRef = useRef<HTMLImageElement | undefined>();
  const horizontalDirBothYellowSvgRef = useRef<HTMLImageElement | undefined>();
  const horizontalDirBothGreySvgRef = useRef<HTMLImageElement | undefined>();
  const horizontalDirLeftGreySvgRef = useRef<HTMLImageElement | undefined>();
  const horizontalDirRightGreySvgRef = useRef<HTMLImageElement | undefined>();
 
  const bluePacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const orangePacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const redPacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const pinkPacmanSvgRef = useRef<HTMLImageElement | undefined>();
  const pinkGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const redGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const blueGhostSvgRef = useRef<HTMLImageElement | undefined>();
  const orangeGhostSvgRef = useRef<HTMLImageElement | undefined>();

  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [count, setCount] = useState(0);
  const [lastKeyState, setLastKeyState] = useState("");

  useEffect(() => {
    const verticalDirBothYellowImg = new Image();
    verticalDirBothYellowImg.src = `data:image/svg+xml;base64,${window.btoa(verticalDirBothYellowSvgString)}`;
    verticalDirBothYellowImg.addEventListener("load", () => {
      verticalDirBothYellowSvgRef.current = verticalDirBothYellowImg;
    });

    const verticalDirBothGreyImg = new Image();
    verticalDirBothGreyImg.src = `data:image/svg+xml;base64,${window.btoa(verticalDirBothGreySvgString)}`;
    verticalDirBothGreyImg.addEventListener("load", () => {
      verticalDirBothGreySvgRef.current = verticalDirBothGreyImg;
    });

    const verticalDirBottomGreyImg = new Image();
    verticalDirBottomGreyImg.src = `data:image/svg+xml;base64,${window.btoa(verticalDirBottomGreySvgString)}`;
    verticalDirBottomGreyImg.addEventListener("load", () => {
      verticalDirBottomGreySvgRef.current = verticalDirBottomGreyImg;
    });

    const verticalDirTopGreyImg = new Image();
    verticalDirTopGreyImg.src = `data:image/svg+xml;base64,${window.btoa(verticalDirTopGreySvgString)}`;
    verticalDirTopGreyImg.addEventListener("load", () => {
      verticalDirTopGreySvgRef.current = verticalDirTopGreyImg;
    });

    const horizontalDirBothYellowImg = new Image();
    horizontalDirBothYellowImg.src = `data:image/svg+xml;base64,${window.btoa(horizontalDirBothYellowSvgString)}`;
    horizontalDirBothYellowImg.addEventListener("load", () => {
      horizontalDirBothYellowSvgRef.current = horizontalDirBothYellowImg;
    });

    const horizontalDirBothGreyImg = new Image();
    horizontalDirBothGreyImg.src = `data:image/svg+xml;base64,${window.btoa(horizontalDirBothGreySvgString)}`;
    horizontalDirBothGreyImg.addEventListener("load", () => {
      horizontalDirBothGreySvgRef.current = horizontalDirBothGreyImg;
    });

    const horizontalDirLeftGreyImg = new Image();
    horizontalDirLeftGreyImg.src = `data:image/svg+xml;base64,${window.btoa(horizontalDirLeftGreySvgString)}`;
    horizontalDirLeftGreyImg.addEventListener("load", () => {
      horizontalDirLeftGreySvgRef.current = horizontalDirLeftGreyImg;
    });

    const horizontalDirRightGreyImg = new Image();
    horizontalDirRightGreyImg.src = `data:image/svg+xml;base64,${window.btoa(horizontalDirRightGreySvgString)}`;
    horizontalDirRightGreyImg.addEventListener("load", () => {
      horizontalDirRightGreySvgRef.current = horizontalDirRightGreyImg;
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
      setMyTeam(myCurrentTeam);
      setMyKart(myCurrentKart);
    }
    displayWrapperContent();
    if (lastKeyRef.current) {
    if (lastKeyRef.current.lastKey === 'a' ||  lastKeyRef.current.lastKey === 'd' || lastKeyRef.current.lastKey === 's' || lastKeyRef.current.lastKey === 'w') {
      setLastKeyState(lastKeyRef.current.lastKey);
    }
    }
  });

  const displayWrapperContent = () => {
    const wrapperInfo = document.getElementById("wrapper-info");
    const scoresInfo = document.getElementById("scores-info");
    if (roomGameStateWrapper && myGameStateWrapper) {
      if (wrapperInfo) {        
        wrapperInfo.innerHTML = "";
      } 
      if (scoresInfo) {
        scoresInfo.innerHTML = "";
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
        wrapperInfo?.appendChild(li);

        const liTwo = document.createElement("li");
        liTwo.setAttribute('id', 'team-name');
        liTwo.textContent =`${myTeam?.color}`;
        if (myTeam?.color === "blue") {
          if (liTwo) {
            liTwo.style.color = "#005487";
          }
         } else if (myTeam?.color === "orange") {
            if (liTwo) {
              liTwo.style.color = "#F69343";
            }
          } else if (myTeam?.color === "pink") {
            if (liTwo) {
              liTwo.style.color = "#F06ACA";
            }
          } else if (myTeam?.color === "red") {
              if (liTwo) {
                liTwo.style.color = "#D52527";
              }
          }
        wrapperInfo?.appendChild(liTwo);
      }
      
      const liThree = document.createElement("li");
      liThree.setAttribute('class', 'my-direction-wrapper');
      const dirImg = document.createElement("img"); 
      if (socketId === myTeam?.playerInControl) {
        if (myGameStateWrapper.myControl === 'y') {
            liThree.setAttribute('class', 'vertical');
            dirImg.setAttribute('src', `${verticalDirBothGreySvgRef.current?.src}`)
            dirImg.setAttribute('id', 'my-turn'); 
        }
        else if (myGameStateWrapper.myControl === 'x') {
            liThree.setAttribute('class', 'horizontal');
            dirImg.setAttribute('src', `${horizontalDirBothGreySvgRef.current?.src}`)
            dirImg.setAttribute('id', 'my-turn'); 
          }
        }
        else {
          if (myGameStateWrapper.myControl === 'y') {
            dirImg.removeAttribute('id'); 
            liThree.setAttribute('class', 'vertical');
            if (lastKeyState === 'w') {
              dirImg.setAttribute('src', `${verticalDirBottomGreySvgRef.current?.src}`)
            } else if (lastKeyState === 's') {
              dirImg.setAttribute('src', `${verticalDirTopGreySvgRef.current?.src}`)
            } else {
              dirImg.setAttribute('src', `${verticalDirBothGreySvgRef.current?.src}`)
            }
          }
          else if (myGameStateWrapper.myControl === 'x') {
            dirImg.removeAttribute('id'); 
            liThree.setAttribute('class', 'horizontal');
            if (lastKeyState === 'a') {
              dirImg.setAttribute('src', `${horizontalDirRightGreySvgRef.current?.src}`)
            } else if (lastKeyState === 'd') {
              dirImg.setAttribute('src', `${horizontalDirLeftGreySvgRef.current?.src}`)
            } else {
              dirImg.setAttribute('src', `${horizontalDirBothGreySvgRef.current?.src}`)
            }
          }
        }
     
      liThree.appendChild(dirImg);

      wrapperInfo?.appendChild(liThree);
     
      const scoresArr = Array.from(roomGameStateWrapper.scores, function (score) {
        return score;
      }
      );

      for (let i = 0; i < scoresArr.length; i++) {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`${scoresArr[i]}`));
        if (scoresArr[i][0] === "blue") {
          li.style.color = "#005487";
        } else if (scoresArr[i][0] === "orange") {
          li.style.color = "#F69343";
        } else if (scoresArr[i][0] === "pink") {
          li.style.color = "#F06ACA";
        } else if (scoresArr[i][0] === "red") {
          li.style.color = "#D52527";
        }
        scoresInfo?.appendChild(li);
      }
  } 


  return (
    <>
      <div id="left">
        <ul id="wrapper-info">
        </ul>
        <p id="score-heading-wrapper">scores</p>
        <ul id="scores-info"></ul>
        <button id="music-button"style={{marginTop: 50}} onClick={handlePauseClick}>music on/off</button>
      </div>
      
      <div id="right"></div>
      <div id="top"></div>
      <div id="bottom">
      </div>
    </>
  )
}

export default GamePageWrapper;