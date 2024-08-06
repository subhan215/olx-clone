// ChatDetail.js
import React from 'react';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { getCookie } from "../../cookies/getCookie";
import { getAllPosts } from "../../functions/allPosts";
import { verifyToken } from "../../functions/verifyToken";

const ChatDetail = () => {
  const messages = useSelector((state) => state.chatData.messages) || [];

  const dispatch = useDispatch();
  const token = getCookie("token");
  useEffect(() => {
    getAllPosts(dispatch);
    if (token) {
      verifyToken(dispatch);
    }
  }, [token, dispatch]);
  const user = useSelector((state) => state.userData.data);
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
              className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.sender._id === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {message.content}
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
