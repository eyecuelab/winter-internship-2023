import React from "react";
import { useNavigate } from "react-router-dom";
import { socketId, socket } from "./GlobalSocket";

function Test1() {
  const navigate = useNavigate();
  function buttoon() {
    navigate("/Test2");
  }
  function buttoon2() {
    navigate("/Sockets");
  }
  return (
    <div>
      <button onClick={buttoon}>go to the other test page</button>
      <button onClick={buttoon2}>go to the socket page</button>
    </div>
  );
}
export default Test1;
