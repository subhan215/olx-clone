import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setChatData, setChatId, setChatMessages, setChat } from "../../redux/slices/chatsData";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import ChatDetail from "../ChatDetail/ChatDetail";
import { io } from 'socket.io-client';
const socket = io('http://localhost:8000');
//sari chat uthani hogi backend say
function Inbox() {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [selectedChatId, setSelectedChatId] = useState(null)
  let chatId = useSelector((state) => state.chatData.selectedChatId)
  let chatRedux = useSelector((state) => state?.chatData?.selectedChat)
  console.log(chatId, chatRedux)
  let user = useSelector((state) => state.userData.data);
  let messages = useSelector((state) => state.chatData.messages) || [];
  console.log(messages)
  const dispatch = useDispatch();
  console.log(user);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/chat", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ user: user._id }),
        });
        const data = await response.json();
        console.log(data.chat)
        if (data.success) {
          dispatch(setChatData(data.chat));
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }

    };
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/chat/${chatId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({ userId: user._id }),
        });
        const data = await response.json();
        /// console.log(data.chat)
        if (data.success) {
          dispatch(setChatMessages(data.messages));
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      fetchChats();

    } else {
      console.error("User data is missing");
    }
    if (chatId && user) {
      fetchMessages()
    }
  }, [user, dispatch]);

  const chats = useSelector((state) => state.chatData.chats) || [];

  const handleSpecificClick = async (chat) => {
    try {
      setSelectedChat(chat)
      dispatch(setChatId(chat._id))
      dispatch(setChat(chat))
      setSelectedChatId(chat._id)
      console.log(chat._id)
      const response = await fetch(`http://localhost:8000/api/v1/chat/${chat._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await response.json();
      console.log(data.messages);
      if (data.success) {
        try {
          console.log("seen status hit")
          const response = await fetch(`http://localhost:8000/api/v1/chat/${chat._id}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ userId: user._id }),

          });
          const data = await response.json();
          console.log(data.messages);
          if (data.success) {
            dispatch(setChatMessages(data.messages));
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.log(error);
        }

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }

    if (!chatRedux) {
      alert("No chat selected");
      return;
    }
    socket.emit('message', {
      sender: user,
      recipient: (chatRedux.seller._id == user._id ? chatRedux.buyer : chatRedux.seller),
      content: newMessage,
      timestamp: new Date()
    })
    try {
      const response = await fetch(`http://localhost:8000/api/v1/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: user._id,
          content: newMessage,
          name: user.fullName
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update chat messages in Redux state
        dispatch(setChatMessages(data.messages));
        // Clear the message input
        setNewMessage('');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex h-[calc(100vh-120px)] mx-4 border border-gray rounded-xl ">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300">
        <div className="p-4 border-l border-gray-3 rounded-tl-xl bg-gray-100">
          <h2 className="text-2xl font-bold">INBOX</h2>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 210px)' }}>
          {/* Chat List */}
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleSpecificClick(chat)}
                className={`block no-underline text-black cursor-pointer ${chat._id === selectedChatId ? 'bg-orange-300':''}  hover:bg-orange-200`}
            >
              <div className={ `relative flex items-center p-3 bg-white border border-gray-900 ${chat._id === selectedChatId ? 'bg-orange-300':''}`}>
                <div className="ml-4 flex-1">
                  <div className="font-semibold">{chat.seller._id === user._id ? `${chat.buyer.fullName}` : `${chat.seller.fullName}`}</div>
                  <div className="text-lg font-semibold text-gray-600">{chat.adTitle}</div>
                  <div className="text-sm text-gray-500">{chat.adPrice} PKR</div>
                </div>
                <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">
                  {user._id === chat.seller._id ? "You are selling" : "You looked for"}
                </div>
                <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Detail and Message Input */}
      <div className="flex-1 flex flex-col bg-white">
        { chatRedux ? (
          <>
            <div className="flex-1 overflow-y-auto ">
              <ChatDetail />
            </div>

          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            Select a chat to view messages
          </div>
        )}
        {chatRedux &&
          <form onSubmit={handleSendMessage} className=" border-t border-gray-300">
            <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-grow p-3 border"
            />
            <button type="submit" className="p-3 px-5 bg-orange-500 text-white">Send</button>
            </div>
          </form>
        }
      </div>
    </div>
  );
}

export default Inbox;


