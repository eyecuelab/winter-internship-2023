import * as io from 'socket.io-client';

export const socket = io.connect('http://localhost:3001');
export let socketID = '';
socket.on('connect', () => {
  console.log(socket.id + "this function might not work")  
  socketID = socket.id
})
