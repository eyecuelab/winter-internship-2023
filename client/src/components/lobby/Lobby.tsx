import * as io from 'socket.io-client';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Col, Container, Navbar, Row, Text, User } from "@nextui-org/react"

import { getUserDataGoogle } from "./services/lobby-services"

interface UserdataGoogle {
  name: string
  picture: string
  email: string
 }

const socket = io.connect("http://localhost:3001");

const Lobby = () => {

  //sockets
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  //user auth
  const [userDataGoogle, setUserDataGoogle] = useState<null | UserdataGoogle>(null)

  const loginWith = useRef(localStorage.getItem("loginWith"))

  const navigate = useNavigate()

  // every communication that we want to run will be declared here as a const
  // this one is sendMessage, the "send_message" in the emit is what the backend is looking for
  // if we want to send data, the message is where we would send it
  // so with this, "Hello" is the data sent
  // we will build functions that just need to send the data over to the server based on the specific input
  // as long as the input receiver is good and differentiated, then none of that really matters what were sending
  // *unless its data like username or something
  
  const sendMessage = () => {
    socket.emit("send_message", {message: message}); //since the message and the variable are the same, you can just do {message}, I left it in there tho in case we want an example on how to send other information
  };


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      
      //this below would do a window alert with literally just "Hello" from the sendMessage function, we've changed it since tho
      //alert(data.message);
    });
  }, [socket]);

  //user auth
  // useEffect(() => {
  //   const queryString = window.location.search
  //   const urlParams = new URLSearchParams(queryString)
  //   const codeParam = urlParams.get("code")
  
  //   const accessToken = localStorage.getItem("accessToken")
  
  //   if (codeParam && !accessToken && loginWith.current === "GitHub") {
  //    getAccessTokenGithub(codeParam).then(resp => {
  //     localStorage.setItem("accessToken", resp.access_token)
  //     getUserDataGithub(resp.access_token).then((resp: UserDataGithub) => {
  //      setUserDataGithub(resp)
  //     })
  //    })
  //   } else if (codeParam && accessToken && loginWith.current === "GitHub") {
  //    getUserDataGithub(accessToken).then((resp: UserDataGithub) => {
  //     localStorage.setItem("accessToken", accessToken)
  //     setUserDataGithub(resp)
  //    })
  //   }
  //  }, [loginWith])
  
   useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
  
    if (accessToken && loginWith.current === "Google") {
     getUserDataGoogle(accessToken).then(resp => {
      setUserDataGoogle(resp)
     })
    }
   }, [loginWith])
  
   const setLogOut = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("loginWith")
    navigate("/")
   }
  //  if (!userDataGithub && !userDataGoogle) return null
   if (!userDataGoogle) return null

   const createUser = (event: any) => {
    event.preventDefault();
  console.log(event);
   }

  return (
    <>
    {/* sockets */}
        <div className="App">
          <input placeholder='Message...' onChange={(event) => {
            setMessage(event.target.value);
          }}/>
          <button onClick={sendMessage}>Send Message</button>
          <h1>Message: </h1>
          {messageReceived}
        </div>
        <hr/>
        {/* Google Auth */}
        <div>
  <form>
    <label htmlFor="name">Game Display Name:</label>
    <input type="text" placeholder='Name'></input>
    <button onClick={createUser}>Create Game User</button>
  </form>
</div>
        <Navbar isBordered variant='sticky'>
    <Navbar.Brand>
     <User
      bordered
      color='primary'
      size='lg'
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
       size='sm'
      //  icon={<LogOutIcon fill='currentColor' />}
       color='primary'
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
  </>
  )
}

export default Lobby;