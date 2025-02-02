// ChatDetail.js
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { getCookie } from "../../cookies/getCookie";
import { verifyToken } from "../../functions/handlesUser/verifyToken";
import { io } from 'socket.io-client';
import { setChatMessages } from '../../redux/slices/chatsData';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { NavLink } from 'react-router-dom';
import { setIndividualAdData } from '../../redux/slices/individualAd';
import { getAllPosts } from '../../functions/handlesPosts/allPosts';
import { fetchMessages } from '../../functions/handleMessages/fetchMessages';
const socket = io('http://localhost:8000');
const ChatDetail = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  let messages = useSelector((state) => state.chatData.messages) || [];
  let chatId = useSelector((state)=> state.chatData.selectedChatId)
  let chat = useSelector((state)=> state.chatData.chats)
  let chatRedux = useSelector((state) => state?.chatData?.selectedChat)
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
    const addAdDataToRedux = async (adId) => {
      console.log(adId)
      try {
          const response = await fetch(`http://localhost:8000/api/v1/posts/${adId}`);
          const result = await response.json();
          console.log(result)
          if (result.success) {
              dispatch(setIndividualAdData({ payload: result.ad }))
          }
      } catch (error) {
          console.error("Error updating transaction rating:", error);
      }
  }
  const handleScroll = () => {
    const element = document.getElementById('messages-container');
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      // Check if scrolled close to the bottom
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        console.log("Scrolled to bottom");
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const element = document.getElementById('messages-container');
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPage]);
  useEffect(()=> {
      fetchMessages(chatId , user._id , currentPage , pageSize, dispatch, messages)
  } , [currentPage  ,dispatch]) 
  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      
      <NavLink to="/individualAd" onClick={()=> addAdDataToRedux(chatRedux.ad.adId)}>
      <button className='border rounded-xl bg-orange-300 border-black hover:bg-orange-500 '>
          Go to Ad
      </button>
      </NavLink>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col space-y-4" id="messages-container">
      {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-600">
            Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${(message.sender == user._id || message.sender._id == user._id) ? 'justify-end ' : 'justify-start'}`}
              
            >
              <div
                className={`p-2 rounded-lg ${
                  (message.sender == user._id || message.sender._id == user._id)
                    ? 'bg-orange-300 text-white'
                    : 'bg-orange-300 text-black'
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
