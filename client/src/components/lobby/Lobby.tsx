import * as io from "socket.io-client";
import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../apiHelper";
import {
  Button,
  Col,
  Container,
  Navbar,
  Row,
  Text,
  User,
} from "@nextui-org/react";
import { userType } from "../../types/Types";
import { socketID, socket } from "./../../GlobalSocket";

import { getUserDataGoogle } from "./services/lobby-services";

interface UserDataGoogle {
  name: string;
  picture: string;
  email: string;
}

interface Props {
  userData: userType | undefined;
  updateUserData: (newData: userType) => void;
  logout: () => void;
}

const Lobby = (props: Props) => {
  const { userData, updateUserData } = props;
  const navigate = useNavigate();
  const [userDataGoogle, setUserDataGoogle] = useState<null | UserDataGoogle>(
    null
  );
  const loginWith = useRef(localStorage.getItem("loginWith"));
  // let gameId = 1;
  // let teamId = 1;
  // let gameUsers = [];

  // const [gameId, setGameId] = useState(null);

  //start game functions:

  const handleStartGameClick = async () => {
  //game doesn't start until 4 people are in the room
  //maybe delete the gameUser association if they leave the room
  //connect sockets 
  //logic to check if there is already a game with less than 4 players, if so, get the game instead of post
  //cleanup function for gameId, get request for the last game 
  //start button: map through game table check if theres any open games
  //phase 2- MVP- list out buttons for open games

//get request to look for the last gameId posted
await getData(`/game/lastpost/desc`).then((lastPost) => {
  //handle if result is null
    const gameUsers = getData(`/game/${lastPost.gameId}/gameUser`)
    return gameUsers;
})
.then((gameUsers) => {

      if (gameUsers.length !== 0 && gameUsers.length < 4) {
       postData(`/gameUser`, { gameId: gameUsers[0].gameId, userId: userData?.id, roleId: 1 })

        .then((gameUser) => {
         postData(`/team`, {
            gameId: gameUser.gameId,
            teamName: "team1",
            score: 0,
            characterId: 1,
            currentDirectionMoving: "",
            nextDirection: "left",
            powerUp: false,
            kartId: 1,
          })
        .then((team) => {
          postData(`/teamUser`, { teamId: team.id, userId: userData?.id, verticalOrHorizontalControl: "vertical" });

          socket.emit("join_public");

          navigate(`/Game/${team.gameId}`);
      })
    })
  }
      else if (gameUsers.length = 0 | 4) {
        postData(`/game`, { timeLeft: 0, boardArray: [], pelletCount: 0 })
      .then((newGame) => {
        postData(`/gameUser`, { gameId: newGame.id, userId: userData?.id, roleId: 1 })
      .then((newGameUser) => {
        postData(`/team`, {
          gameId: newGameUser.id,
          teamName: "team1",
          score: 0,
          characterId: 1,
          currentDirectionMoving: "",
          nextDirection: "left",
          powerUp: false,
          kartId: 1,
        })
      .then((newTeam) => {
        postData(`/teamUser`, { teamId: newTeam.id, userId: userData?.id, verticalOrHorizontalControl: "vertical" });

        socket.emit("join_public");
        navigate(`/Game/${newTeam.gameId}`);
      })
      }) 
      })
    }
  })
}

  //create user with Google user data functions:
  useEffect(() => {
    let tempObj = {
      email: "",
      name: "",
    };
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && loginWith.current === "Google") {
      getUserDataGoogle(accessToken).then((resp) => {
        setUserDataGoogle(resp);
        tempObj.email = resp.email;
        tempObj.name = resp.name;
        accessOrCreateUser(tempObj);
      });
    }
    if (loginWith.current === "Guest") {
        tempObj.email = "Guest Email";
        tempObj.name = "Guest Name";
        setUserDataGoogle({
          email: tempObj.email,
          name: tempObj.name,
          picture: ""
        });
        accessOrCreateUser(tempObj);
      };
  }, [loginWith]);

  const handleCreateUser = async (object: any) => {
    await (postData("/user", {
      email: object.email,
      name: object.name,
    }))
    .then((resp) => {
      updateUserData({
        id: resp.id,
        email: resp.email,
        name: resp.name,
        games: [],
        teams: []
      });
    })
  }

  const accessOrCreateUser = (object: any) => {
    getData(`/user/${object.email}`).then((user) => {
      if (!user) {
        handleCreateUser(object);
      } else {
        updateUserData({
          id: user.id,
          email: user.email,
          name: user.name,
          games: [],
          teams: []
        });
      }
    });
  };

  const setLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginWith");
    navigate("/");
  };

  return (
    <>
      {/* <div>
        <form>
          <label htmlFor="name">Game Display Name:</label>
          <input type="text" placeholder="Name"></input>
          <button>Create Game User</button>
        </form>
      </div> */}
      <Navbar isBordered variant="sticky">
        <Navbar.Brand>
          <User
            bordered
            color="primary"
            size="lg"
            src={userDataGoogle?.picture}
            name={userDataGoogle?.name}
            description={userDataGoogle?.email}
          />
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item>
            <Button
              auto
              flat
              size="sm"
              //  icon={<LogOutIcon fill='currentColor' />}
              color="primary"
              onClick={() => setLogOut()}
            >
              Log out
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Container gap={0}>
        <Row gap={1}>
          <Col>
            <Text h2>Login with {loginWith.current}</Text>
          </Col>
        </Row>
      </Container>
      <div className="theButton">
        <button onClick={handleStartGameClick}>Start a Public Game!</button>
      </div>
    </>
  );
}


export default Lobby;
