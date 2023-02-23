import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../apiHelper";
import { userType } from "../../types/Types";
import { getUserDataGoogle } from "./services/lobby-services";
import CoverImage from "../../assets/cover.png";
import {
  Button,
  Col,
  Container,
  Navbar,
  Row,
  Text,
  User,
  Card,
  Spacer,
} from "@nextui-org/react";
import { socket } from "./../../GlobalSocket";
import mapSwitchCase from "../canvas/mapSwitchCase";
import { gameMap } from "../canvas/Maps";
import { generateMapQuadrants } from "../canvas/quadrants";
import { GameMap } from "../canvas/gameClasses";

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
  // const logo = require('./kartTest.png')
  const { userData, updateUserData } = props;
  const navigate = useNavigate();
  const [userDataGoogle, setUserDataGoogle] = useState<null | UserDataGoogle>(
    null
  );
  const loginWith = useRef(localStorage.getItem("loginWith"));

  //start game functions:
  const joinAGame = (gameUsers: any) => {
    postData(`/gameUser`, {
      gameId: gameUsers[0].gameId,
      userId: userData?.id,
      roleId: 1,
    })
    .then((gameUser) => {
       const gameId = gameUser.gameId;
        const userId = gameUser.userId;
        console.log(socket.id);
        socket.emit("join_game_room", {gameId, userId});
        navigate(`/game/${gameId}`);
      });
  };

  const startANewGame = () => {
    const quads = generateMapQuadrants();
    const newGameMap = new GameMap(quads);

    newGameMap.generateMapArr();
    newGameMap.generateMapPropertiesArrs();
    console.log(newGameMap);

    //generate game boundary and pellets
    postData(`/game`, { map: newGameMap.mapArr, boundaries: mapSwitchCase(gameMap).boundaries, pellets: mapSwitchCase(gameMap).pellets, spawnPoints: mapSwitchCase(gameMap).spawnPoints, isActive: true}).then(
      //replace boardarray and pelletcount with boundary array and pellet object, canvas has a map we can move to the lobby and the map switch cases that can run in the lobby and send to the db
      (newGame) => {
        // move boundary and pellets from canvas to lobby (state stays, functions to create are moved. Then canvas creates state from the lobby -> canvas prop transition)
        // db gets the boundaries and pellets as part of the game creation postData
        postData(`/gameUser`, {
          gameId: newGame.id,
          userId: userData?.id,
          //update roleId
          roleId: 1,
        }).then((newGameUser) => {
          // console.log("clientData:" + newGameUser);
          const gameId = newGameUser.gameId;
          const userId = newGameUser.userId;
            socket.emit
            ("join_game_room", {gameId, userId});
            navigate(`/game/${gameId}`);
        });
      }
    );
  };

  const handleStartGameClick = async () => {
    await getData(`/game/lastpost/desc`).then((lastPost) => {
      if (!lastPost) {
        startANewGame();
      } else {
        getData(`/game/${lastPost.id}/gameUser`).then((gameUsers) => {
          if (gameUsers.length !== 0 && gameUsers.length < 4) {
            joinAGame(gameUsers);
          } else if ((gameUsers.length = 0 || 4)) {
            startANewGame();
          }
        });
      }
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
        picture: "",
      });
      accessOrCreateUser(tempObj);
    }
  }, [loginWith]);

  const handleCreateUser = async (object: any) => {
    await postData("/user", {
      email: object.email,
      name: object.name,
    }).then((resp) => {
      updateUserData({
        id: resp.id,
        email: resp.email,
        name: resp.name,
        games: [],
        teams: [],
      });
    });
  };

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
          teams: [],
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
      {/* <Navbar isBordered variant="sticky">
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
      </div> */}

      <Container
        display="flex"
        alignItems="center"
        justify="center"
        css={{ minHeight: "100vh" }}
      >
        <Card css={{ mw: "420px", p: "20px" }}>
          <Card.Image
            src={CoverImage}
            objectFit="cover"
            width="100%"
            height="100%"
            alt="Relaxing app background"
          />

          <Text
            size={24}
            weight="bold"
            css={{
              as: "center",
              mb: "20px",
            }}
          >
            Welcome {userData?.name}!
          </Text>

          <Spacer y={1} />

          <Button color="gradient" auto ghost onClick={handleStartGameClick}>
            <Spacer x={0.5} />
            JOIN GAME!
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default Lobby;
