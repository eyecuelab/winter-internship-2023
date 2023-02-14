import * as io from "socket.io-client";

export const socket = io.connect("https://super-pacart.fly.dev", {
  withCredentials: true})
export let socketId = "";
socket.on("connect", () => {
  socketId = socket.id;
});
