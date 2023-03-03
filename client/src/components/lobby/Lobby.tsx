import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../apiHelper";
import { userType } from "../../types/Types";
import { socketId, socket } from "./../../GlobalSocket";
import { getUserDataGoogle } from "./services/lobby-services";
import CoverImage from "../../assets/cover.png";
import { Button, Container, Text, Card, Spacer } from "@nextui-org/react";
import { generateMapQuadrants } from "../canvas/quadrants";
import { GameMap } from "../canvas/gameClasses";

interface UserDataGoogle {
  name: string;
  picture: string;
  email: string;
}
interface Props {
  userData: userType | undefined;
  setUserData: React.Dispatch<React.SetStateAction<userType | undefined>>;
  logout: () => void;
}

const Lobby = (props: Props) => {
  const { userData, setUserData, logout } = props;
  const [userataGoogle, setUserDataGoogle] = useState<null | UserDataGoogle>(
    null
  );
  const loginWith = useRef(localStorage.getItem("loginWith"));
  const navigate = useNavigate();

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
      tempObj.email = `${socketId}`;
      tempObj.name = "Guest";
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
      setUserData({
        id: resp.id,
        email: resp.email,
        name: resp.name,
      });
    });
  };

  const accessOrCreateUser = (object: any) => {
    getData(`/user/${object.email}`).then((user) => {
      if (!user) {
        handleCreateUser(object);
      } else {
        if (user.id) {
          setUserData({
            id: user.id,
            email: user.email,
            name: user.name,
          });
        } else {
          navigate(`/`);
        }
      }
    });
  };

  const handleLogout = () => {
    setUserData(undefined);
    localStorage.clear();
    window.localStorage.clear();
  };

  //start game functions:
  const joinAGame = (gameUsers: any) => {
    postData(`/gameUser`, {
      gameId: gameUsers[0].gameId,
      userId: userData?.id,
      roleId: 1,
    }).then((gameUser) => {
      if (gameUser.gameId) {
        const gameId = gameUser.gameId;
        const userId = gameUser.userId;

        socket.emit("join_game_room", { gameId, userId });
        navigate(`/game/${gameId}`);
      } else {
        navigate(`/`);
      }
    });
  };

  const startAGame = () => {
    const quads = generateMapQuadrants();
    const newGameMap = new GameMap(quads);
    newGameMap.generateMapArr();
    newGameMap.generateMapPropertiesArrs();

    postData(`/game`, {
      map: newGameMap.mapArr,
      boundaries: newGameMap.boundaries,
      pellets: newGameMap.pellets,
      spawnPoints: newGameMap.spawnPoints,
    }).then((newGame) => {
      postData(`/gameUser`, {
        gameId: newGame.id,
        userId: userData?.id,
        roleId: 1,
      }).then((newGameUser) => {
        const gameId = newGameUser.gameId;
        const userId = newGameUser.userId;

        socket.emit("join_game_room", { gameId, userId });
        navigate(`/game/${gameId}`);
      });
    });
  };

  const handleStartGameClick = async () => {
    await getData(`/game/lastpost/desc`).then((lastPost) => {
      if (!lastPost) {
        startAGame();
      } else {
        getData(`/game/${lastPost.id}/gameUser`).then((gameUsers) => {
          if (
            gameUsers.length !== 0 &&
            gameUsers.length < 4 &&
            lastPost.isActive === true
          ) {
            joinAGame(gameUsers);
          } else if ((gameUsers.length = 0 || 4)) {
            startAGame();
          }
        });
      }
    });
  };

  return (
    <>
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

          <Button color="gradient" onClick={handleStartGameClick}>
            <Spacer x={0.5} />
            JOIN GAME!
          </Button>
          <Spacer y={1} />
          <Button color="gradient" onClick={handleLogout}>
            <Spacer x={0.5} />
            LOG OUT
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default Lobby;
