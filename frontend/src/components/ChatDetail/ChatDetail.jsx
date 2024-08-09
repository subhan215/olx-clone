// ChatDetail.js
import React from 'react';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { getCookie } from "../../cookies/getCookie";
import { getAllPosts } from "../../functions/allPosts";
import { verifyToken } from "../../functions/verifyToken";
import { io } from 'socket.io-client';
import { setChatMessages } from '../../redux/slices/chatsData';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
const socket = io('http://localhost:8000');
const ChatDetail = () => {
  let messages = useSelector((state) => state.chatData.messages) || [];
  let chatId = useSelector((state)=> state.chatData.selectedChatId)
  let chat = useSelector((state)=> state.chatData.chats)
  console.log(chatId)
  console.log(messages)
  const dispatch = useDispatch();
  const token = getCookie("token");
  useEffect(() => {
    getAllPosts(dispatch);
    if (token) {
      verifyToken(dispatch);
    }
  }, [token, dispatch]);
  const user = useSelector((state) => state.userData.data);
  useEffect(()=> {
    socket.on('message' ,async (data)=> {
      try {
        console.log("seen status hit")
        const response = await fetch(`http://localhost:8000/api/v1/chat/${chatId}` , {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ userId: user._id }),

        });
        const data = await response.json();
        console.log(data.messages);
        console.log(data)
        if (data.success) {
          dispatch(setChatMessages(data.messages));
          console.log(messages)
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      } 
      })
      setTimeout(async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/v1/chat/${chatId}`, {
            method: "PUT"
          });
          const data = await response.json();
          if(data.success) {
            setChatMessages(data.messages)
          }

        }
        catch(err) {
          console.log(err)
        }
       
      }, 500);

    } , [socket , dispatch]) 
    
  
  return (
    <div className="flex flex-col h-full bg-orange-100 p-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col space-y-4">
      {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-600">
            Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${(message.sender == user._id || message.sender._id == user._id) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  (message.sender == user._id || message.sender._id == user._id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {message.content}
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </div>
                {(message.sender == user._id || message.sender._id == user._id) &&
                <div>
                  <FontAwesomeIcon icon={message.isSeen ? faCheckDouble : faCheck}>

                  </FontAwesomeIcon>
                </div>
}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
