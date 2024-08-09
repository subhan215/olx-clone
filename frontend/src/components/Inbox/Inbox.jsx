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
    <div className="flex h-screen m-4 border border-gray rounded-xl">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300">
        <div className="p-4 border-l border-gray-3 rounded-tl-xl bg-orange-100">
          <h2 className="text-2xl font-bold">INBOX</h2>
        </div>
        <div>
          {/* Chat List */}
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleSpecificClick(chat)}
              className="block no-underline text-black cursor-pointer"
            >
              <div className="relative flex items-center p-3 bg-white border border-gray-900">
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
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full px-4 py-2 border rounded"
            />
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
          </form>
        }
      </div>
    </div>
    // <div className="flex h-screen m-4 border border-gray rounded-xl">
    //   {/* Sidebar */}
    //   <div className="w-1/3 bg-white border-r border-gray-300">
    //     <div className="p-4  border-l border-gray-3 rounded-tl-xl bg-orange-100">
    //       <h2 className="text-2xl font-bold">INBOX</h2>
    //     </div>
    //     <div className="">
    //       <div className="">

    //         {/* Chat List */}
    //         {chats.map((chat) => (
    //         <div
    //           onClick={()=>{handleSpecificClick(chat)}}
    //           key={chat._id}
    //           to={`${chat._id}`}
    //           className="block no-underline text-black" // Added classes here
    //         >
    //           <div className="relative flex items-center p-3 bg-white border border-gray-900">
    //             <div className="ml-4 flex-1">
    //               <div className="font-semibold">{chat.seller._id===user._id ? `${chat.buyer.fullName}`:`${chat.seller.fullName}`}</div>
    //               <div className="text-lg font-semibold text-gray-600">{chat.adTitle}</div>
    //               <div className="text-sm text-gray-500">{chat.adPrice} PKR</div>
    //             </div>
    //             <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">
    //               {user._id === chat.seller._id ? "You are selling" : "You looked for"}
    //             </div>
    //             <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-400">
    //               {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="chat-detail">
    //     {selectedChat ? (
    //       <>
    //        <div className="w-2/3">
    //           <ChatDetail />
    //         </div>
    //         <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300">
    //           <input
    //             type="text"
    //             value={newMessage}
    //             onChange={(e) => setNewMessage(e.target.value)}
    //             placeholder="Type a message"
    //           />
    //           <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Send</button>
    //         </form>
    //       </>
    //     ) : (
    //       <p>Select a chat to view messages</p>
    //     )}
    //   </div>

    // </div>
  );
}

export default Inbox;

{/* <div className="chat-detail">
        {selectedChat ? (
          <>
            <ChatDetail messages={messages} />
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a chat to view messages</p>
        )}
      </div>
     */}
{/* Chat Detail */ }
{/* <div className="w-2/3 bg-white">
        <div className="p-4">
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="rounded-full mr-4"
            />
            <div>
              <div className="font-semibold">Farhan Ahmadzai Khan</div>
              <div className="text-sm text-gray-600">Last active 1 day ago</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/100"
                alt="Ad"
                className="rounded mr-4"
              />
              <div>
                <div className="font-semibold">iphone 13 pro max</div>
                <div className="text-lg text-gray-700">Rs 170,000</div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              View Ad
            </button>
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="text-sm text-gray-500">SATURDAY 3 AUGUST</div>
            <div className="mt-2 text-gray-700">SMS at 8:14 pm</div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gray-200 rounded">
                QUESTIONS
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded">OFFER</button>
            </div>
          </div>
          <div className="mt-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              placeholder="Type a message"
            />
          </div>
        </div>
      </div> */}
