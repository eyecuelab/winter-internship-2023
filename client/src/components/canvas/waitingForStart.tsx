import { useEffect, useState, useRef } from "react";
import React, { ReactNode } from "react";
import { Kart, Team } from "./gameClasses";
import { myGameType, roomGameType } from "./../../types/Types";
import { verticalDirSvgString } from "../../assets/verticalDirSvg";
import { horizontalDirSvgString } from "../../assets/horizontalDirSvg";
import { redGhostIconSvgString } from "../../assets/redGhostIconSvg";
import { pinkGhostIconSvgString } from "../../assets/pinkGhostIconSvg";
import { blueGhostIconSvgString } from "../../assets/blueGhostIconSvg";
import { orangeGhostIconSvgString } from "../../assets/orangeGhostIconSvg";
import { redPacmanIconSvgString } from "../../assets/redPacmanIconSvg";
import { bluePacmanIconSvgString } from "../../assets/bluePacmanIconSvg";
import { orangePacmanIconSvgString } from "../../assets/orangePacmanIconSvg";
import { pinkPacmanIconSvgString } from "../../assets/pinkPacmanIconSvg";

interface WaitingForStartType {
  children?: ReactNode;
  isWaitingForGameModalOpen: boolean;
  roomGameState: roomGameType;
  myGameState: myGameType;
  isCountingDown: boolean;
}

export function WaitingForStart(props: WaitingForStartType) {
  const {
    roomGameState,
    myGameState,
    isWaitingForGameModalOpen,
    isCountingDown,
  } = props;
  const [myKart, setMyKart] = useState<Kart | undefined>(undefined);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const teamInfo = document.getElementById("teamInfo");

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

  useEffect(() => {
    const verticalDirImg = new Image();
    verticalDirImg.src = `data:image/svg+xml;base64,${window.btoa(
      verticalDirSvgString
    )}`;
    verticalDirImg.addEventListener("load", () => {
      verticalDirSvgRef.current = verticalDirImg;
    });

    const horizontalDirImg = new Image();
    horizontalDirImg.src = `data:image/svg+xml;base64,${window.btoa(
      horizontalDirSvgString
    )}`;
    horizontalDirImg.addEventListener("load", () => {
      horizontalDirSvgRef.current = horizontalDirImg;
    });

    const bluePacmanImg = new Image();
    bluePacmanImg.src = `data:image/svg+xml;base64,${window.btoa(
      bluePacmanIconSvgString
    )}`;
    bluePacmanImg.addEventListener("load", () => {
      bluePacmanSvgRef.current = bluePacmanImg;
    });

    const orangePacmanImg = new Image();
    orangePacmanImg.src = `data:image/svg+xml;base64,${window.btoa(
      orangePacmanIconSvgString
    )}`;
    orangePacmanImg.addEventListener("load", () => {
      orangePacmanSvgRef.current = orangePacmanImg;
    });

    const redPacmanImg = new Image();
    redPacmanImg.src = `data:image/svg+xml;base64,${window.btoa(
      redPacmanIconSvgString
    )}`;
    redPacmanImg.addEventListener("load", () => {
      redPacmanSvgRef.current = redPacmanImg;
    });

    const pinkPacmanImg = new Image();
    pinkPacmanImg.src = `data:image/svg+xml;base64,${window.btoa(
      pinkPacmanIconSvgString
    )}`;
    pinkPacmanImg.addEventListener("load", () => {
      pinkPacmanSvgRef.current = pinkPacmanImg;
    });

    const pinkGhostImg = new Image();
    pinkGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      pinkGhostIconSvgString
    )}`;
    pinkGhostImg.addEventListener("load", () => {
      pinkGhostSvgRef.current = pinkGhostImg;
    });

    const redGhostImg = new Image();
    redGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      redGhostIconSvgString
    )}`;
    redGhostImg.addEventListener("load", () => {
      redGhostSvgRef.current = redGhostImg;
    });

    const orangeGhostImg = new Image();
    orangeGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      orangeGhostIconSvgString
    )}`;
    orangeGhostImg.addEventListener("load", () => {
      orangeGhostSvgRef.current = orangeGhostImg;
    });

    const blueGhostImg = new Image();
    blueGhostImg.src = `data:image/svg+xml;base64,${window.btoa(
      blueGhostIconSvgString
    )}`;
    blueGhostImg.addEventListener("load", () => {
      blueGhostSvgRef.current = blueGhostImg;
    });
  }, []);

  useEffect(() => {
    if (myGameState.myTeam && roomGameState.karts) {
      const myCurrentTeam = myGameState.myTeam;
      const myCurrentKart = roomGameState.karts.get(myCurrentTeam.color);
      setMyTeam(myCurrentTeam);
      setMyKart(myCurrentKart);
    }

    displayTeam();
  });

  useEffect(() => {
    if (isCountingDown) {
      countDown(7);
    }
  }, [isCountingDown]);

  const countDown = (seconds: number) => {
    let counter = seconds;
    const interval = setInterval(() => {
      if (counter >= 2) {
        if (teamInfo) {
          teamInfo.innerHTML = "";
        }
        const li = document.createElement("li");
        li.setAttribute(`id`, `countdown`);
        li.appendChild(document.createTextNode(`${(counter - 2).toString()}`));
        teamInfo?.appendChild(li);
        counter--;
      }
      if (counter === 1) {
        if (teamInfo) {
          teamInfo.innerHTML = "";
        }
        const li = document.createElement("li");
        li.setAttribute(`id`, `go`);
        li.appendChild(document.createTextNode(`go!`));
        teamInfo?.appendChild(li);
        clearInterval(interval);
      }
    }, 1000);
  };

  const displayTeam = () => {
    if (myKart && myTeam) {
      if (teamInfo) {
        teamInfo.innerHTML = "";
      }
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(`My Team:`));
      const teamImg = document.createElement("img");
      teamImg.setAttribute("id", "team-img");
      if (myKart.isGhost === false) {
        if (myTeam.color === "blue") {
          teamImg.setAttribute("src", `${bluePacmanSvgRef.current?.src}`);
        } else if (myTeam.color === "orange") {
          teamImg.setAttribute("src", `${orangePacmanSvgRef.current?.src}`);
        } else if (myTeam.color === "red") {
          teamImg.setAttribute("src", `${redPacmanSvgRef.current?.src}`);
        } else if (myTeam.color === "pink") {
          teamImg.setAttribute("src", `${pinkPacmanSvgRef.current?.src}`);
        } else {
          teamImg.setAttribute("src", `${bluePacmanSvgRef.current?.src}`);
        }
      }

      if (myKart.isGhost === true) {
        if (myTeam.color === "blue") {
          teamImg.setAttribute("src", `${blueGhostSvgRef.current?.src}`);
        } else if (myTeam.color === "orange") {
          teamImg.setAttribute("src", `${orangeGhostSvgRef.current?.src}`);
        } else if (myTeam.color === "red") {
          teamImg.setAttribute("src", `${redGhostSvgRef.current?.src}`);
        } else if (myTeam.color === "pink") {
          teamImg.setAttribute("src", `${pinkGhostSvgRef.current?.src}`);
        } else {
          teamImg.setAttribute("src", `${blueGhostSvgRef.current?.src}`);
        }
      }

      const divElement = document.createElement("div");
      divElement.style.display = "block";
      divElement.appendChild(teamImg);
      li?.appendChild(divElement);
      teamInfo?.appendChild(li);

      const liTwo = document.createElement("li");
      liTwo.setAttribute("id", "my-team");
      if (myKart.isGhost) {
        liTwo.textContent = `${myTeam.color} ghost`;
      } else {
        liTwo.textContent = `${myTeam.color} pacman`;
      }
      teamInfo?.appendChild(liTwo);

      const liThree = document.createElement("li");
      liThree.appendChild(document.createTextNode(`My Direction:`));
      teamInfo?.appendChild(liThree);

      const liFour = document.createElement("li");
      liFour.setAttribute("id", "my-direction");

      const directionImg = document.createElement("img");
      if (myGameState.myControl === "y") {
        directionImg.setAttribute("src", `${verticalDirSvgRef.current?.src}`);
        directionImg.setAttribute("id", "vertical-img");
        const divElementTwo = document.createElement("div");
        divElementTwo.style.display = "block";
        divElementTwo.appendChild(directionImg);
        liFour?.appendChild(divElementTwo);
        teamInfo?.appendChild(liFour);
        liFour.appendChild(document.createTextNode(`vertical`));
      }
      if (myGameState.myControl === "x") {
        directionImg.setAttribute("src", `${horizontalDirSvgRef.current?.src}`);
        directionImg.setAttribute("id", "horizontal-img");
        const divElementTwo = document.createElement("div");
        divElementTwo.style.display = "block";
        divElementTwo.appendChild(directionImg);
        liFour?.appendChild(divElementTwo);
        teamInfo?.appendChild(liFour);
        liFour.appendChild(document.createTextNode(`horizontal`));
      }
    } else {
      if (teamInfo) {
        teamInfo.innerHTML = "";
      }
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(`Waiting for Teammate...`));
      teamInfo?.appendChild(li);
    }

    const liFour = document.getElementById("my-direction");
    const liTwo = document.getElementById("my-team");

    if (myTeam?.color === "blue") {
      if (liFour) {
        liFour.style.color = "#005487";
      }
      if (liTwo) {
        liTwo.style.color = "#005487";
      }
    } else if (myTeam?.color === "orange") {
      if (liFour) {
        liFour.style.color = "#F69343";
      }
      if (liTwo) {
        liTwo.style.color = "#F69343";
      }
    } else if (myTeam?.color === "pink") {
      if (liFour) {
        liFour.style.color = "#F06ACA";
      }
      if (liTwo) {
        liTwo.style.color = "#F06ACA";
      }
    } else if (myTeam?.color === "red") {
      if (liFour) {
        liFour.style.color = "#D52527";
      }
      if (liTwo) {
        liTwo.style.color = "#D52527";
      }
    }
  };

  return (
    <>
      {isWaitingForGameModalOpen && (
        <div className="waitingforstart-overlay">
          <div
            onClick={(e) => e.stopPropagation()}
            className="waitingforstart-box"
          >
            <div id="heading">
              <h1>lobby</h1>
            </div>
            <div>
              <ul id="teamInfo"></ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
