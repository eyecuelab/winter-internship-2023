import { useEffect } from "react";
import React, { ReactNode } from "react";
import { Kart, Team } from "./gameClasses";

interface WaitingForStartType {
  children?: ReactNode;
  isWaitingForGameModalOpen: boolean;
  karts: Map<string, Kart>;
  myTeam: Team;
}

export function WaitingForStart(props: WaitingForStartType) {
  const { karts, myTeam, isWaitingForGameModalOpen } = props;

  useEffect(() => {
    displayTeam();
  }, [isWaitingForGameModalOpen]);

  const displayTeam = () => {
    const myKart = karts.get(myTeam.color);
    const teamInfo = document.getElementById("teamInfo");

    if (myKart) {
      const li = document.createElement("li");
          li.appendChild(
            document.createTextNode(`You are on Team ${myTeam.color}! You will be driving your kart in the (vertical(W/S)/horizontal(A/D)) direction while your teammate will be driving the (vvertical(W/S)/horizontal(A/D)) direction.`)
          );
          teamInfo?.appendChild(li);
      } else {
           const li = document.createElement("li");
            li.appendChild(
            document.createTextNode(`Waiting for your teammate to join...`)
          );
            teamInfo?.appendChild(li);
       }
  };

  displayTeam();
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
}
