import * as io from "socket.io-client";

export const socket = io.connect("http://localhost:3001");
export let socketId = "";
socket.on("connect", () => {
  socketId = socket.id;
});
