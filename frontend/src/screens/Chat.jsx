import React from 'react'
import Nav from "../components/Navbar/Nav";
import Inbox from '../components/Inbox/Inbox';
import { io } from 'socket.io-client';
const socket = io('http://localhost:8000');
function Chat() {
  socket.emit('register')
  return (
    <div>
      <Nav/>
      <Inbox/>
    </div>
  )
}

export default Chat
