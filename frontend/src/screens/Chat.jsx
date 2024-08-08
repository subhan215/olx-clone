import React, { useEffect } from 'react'
import Nav from "../components/Navbar/Nav";
import Inbox from '../components/Inbox/Inbox';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const socket = io('http://localhost:8000');
function Chat() {
  socket.emit('register')
  const navigate = useNavigate()
  return (
    <div>
      <FontAwesomeIcon icon={faArrowCircleLeft} onClick={()=> {
         socket.disconnect();
         console.log('Socket disconnected');
        navigate('/home')}}/>
      <Inbox/>
    </div>
  )
}

export default Chat
