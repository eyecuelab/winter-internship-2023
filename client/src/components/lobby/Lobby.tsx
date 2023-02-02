import * as io from "socket.io-client";
import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../ApiHelper";
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
  let gameId = 0;
  let teamId = 0;
  // const [gameId, setGameId] = useState(null);

  //start game functions:

  const handleStartGameClick = async () => {
    //logic to check if there is already a game with less than 4 players, if so, get the game instead of post
    await postData(`/game`, { timeLeft: 0, boardArray: [], pelletCount: 0 })
      .then((resp) => {
        // setGameId(resp.id);
        gameId = resp.id
        postData(`/gameUser`, { gameId: resp.id, userId: 1, roleId: 1 });
        postData(`/team`, { gameId: resp.id, teamName: "team1", score: 0, characterId: 1, currentDirectionMoving: "", nextDirection: "left", powerUp: false, kartId: 1 });
        //create team , return team data w/ id
      })
      .then((data) => {
        //create a team user with teamId and userId
        // postData(`/teamUser`, { teamId: resp.id, userId: 1, roleId: 1 });
        console.log(data);
        socket.emit("join_public");
        navigate(`/Game/${gameId}`);
      });
  };

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
        updateUserData(resp);
        tempObj.email = resp.email;
        tempObj.name = resp.name;
        accessOrCreateUser(tempObj);
      });
    }
  }, [loginWith]);

  const accessOrCreateUser = (object: any) => {
    getData(`/user/${object.email}`).then((user) => {
      if (!user) {
        const resp = postData("/user", {
          email: object.email,
          name: object.name,
        });
      }
    });
  };

  const setLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginWith");
    navigate("/");
  };

  //what is this if-clause doing?
  if (!userDataGoogle) return null;

  const createUser = (event: any) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <>
      <div>
        <form>
          <label htmlFor="name">Game Display Name:</label>
          <input type="text" placeholder="Name"></input>
          <button onClick={createUser}>Create Game User</button>
        </form>
      </div>
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
};

export default Lobby;
