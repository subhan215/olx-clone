import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setChatData } from "../../redux/slices/chatsData";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

//sari chat uthani hogi backend say
function Inbox() {
  const location = useLocation();
  const user = location.state?.user;
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
    
    if (user) {
      fetchChats();
      
    } else {
      console.error("User data is missing");
    }
  }, [user, dispatch]);
  const chats = useSelector((state) => state.chatData.chats) || [];

  return (
    <div className="flex h-screen m-4 border border-gray rounded-xl">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-300">
        <div className="p-4  border-l border-gray-3 rounded-tl-xl bg-orange-100">
          <h2 className="text-2xl font-bold">INBOX</h2>
        </div>
        <div className="">
          <div className="">
            {/* Quick Filters */}
            {/* <div className="flex space-x-2 mb-4">
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                All
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded">
                Unread Chats
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded">
                Important
              </button>
            </div> */}
            {/* Chat List */}
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="relative flex items-center p-3 bg-gray-100 border border-gray-900"
              >
                <div className="ml-4 flex-1">
                  <div className="font-semibold">{chat.buyer.fullName}</div>
                  <div className="text-lg font-semibold text-gray-600">{chat.adTitle}</div>
                  <div className="text-sm text-gray-500">{chat.adPrice}</div>
                </div>
                <div className="absolute top-0 right-0 p-2 text-xs text-gray-400">
                  {user._id === chat.seller ? "You are selling" : "You looked for"}
                </div>
                <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Chat Detail */}
      <div className="w-2/3 bg-white">
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
      </div>
    </div>
  );
}

export default Inbox;
