import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../apiHelper";
import React, { Dispatch, SetStateAction } from "react";
import { userType } from "../../types/Types";
import { Card, Spacer, Button, Text, Container } from "@nextui-org/react";
import { socketId, socket } from "./../../GlobalSocket";

interface Props {
  userData: userType | undefined;
  setUserData: Dispatch<SetStateAction<userType | undefined>>;
  logout: () => void;
}
// import { IconGitHub, IconGoogle } from "../../assets/icons"

// const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const Login = () => {
  const navigate = useNavigate();
  //  const loginToGithub = () => {
  //   localStorage.setItem("loginWith", "GitHub")
  //   window.location.assign(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`)
  //  }
  //   } )}
  const loginToGoogle = useGoogleLogin({
    onSuccess: (response) => {
      localStorage.clear();
      localStorage.setItem("loginWith", "Google");
      localStorage.setItem("accessToken", response.access_token);
      navigate("/lobby");
    },
  });

  const loginAsGuest = () => {
    localStorage.clear();
    localStorage.setItem("loginWith", "Guest");
    navigate("/lobby");
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
          <Text
            size={24}
            weight="bold"
            css={{
              as: "center",
              mb: "20px",
            }}
          >
            Login with
          </Text>
          <Spacer y={1} />
          {/* <Button color='gradient' auto ghost onClick={() => loginToGithub()}>
            <IconGitHub />
            <Spacer x={0.5} />
            GitHub
          </Button> */}

          <Button color="gradient" auto ghost onClick={() => loginToGoogle()}>
            {/* <IconGoogle /> */}
            <Spacer x={0.5} />
            Google
          </Button>
          <Spacer y={1} />
          <Button color="gradient" auto ghost onClick={() => loginAsGuest()}>
            {/* <IconGoogle /> */}
            <Spacer x={0.5} />
            Continue as Guest
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default Login;
