import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Card, Spacer, Button, Text, Container } from "@nextui-org/react";
import CoverImage from '../../assets/cover.png';
import "./loginStyles.css";
import { userType } from "../../types/Types";

interface Props {
  userData: userType | undefined;
  setUserData: React.Dispatch<React.SetStateAction<userType | undefined>>;
}

const Login = () => {
  const navigate = useNavigate();

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
            Login with
          </Text>
          <Spacer y={1} />
          <Button color="gradient" onClick={() => loginToGoogle()}>
            <Spacer x={0.5} />
            Google
          </Button>
          <Spacer y={1} />
          <Button color="gradient" onClick={() => loginAsGuest()}>
            <Spacer x={0.5} />
            Continue as Guest
          </Button>
        </Card>

      </Container>
    </>
  );
};

export default Login;
