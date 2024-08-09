import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { setChat, setChatId, setChatMessages } from "../redux/slices/chatsData";
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faTimes = require('@fortawesome/free-solid-svg-icons').faTimes;
const Notifications = ({ turnNotificationsToOff }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    let notifications = useSelector((state) => state.notifications.notifications);
    let user = useSelector((state) => state.userData.data);
    const handleSpecificClick = async (notification) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/chat/${notification.chatId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({ userId: user._id }),
            });
            const data = await response.json();
            console.log(data.messages);
            if (data.success) {
                dispatch(setChatMessages(data.messages));
                dispatch(setChatId(notification.chatId))
                dispatch(setChat(data.chat))
                navigate("/chat")
                try {
                    console.log("seen status hit")
                    const response = await fetch(`http://localhost:8000/api/v1/chat/${notification.chatId}` , {
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
    };

    useEffect(() => {
        const modalElement = document.getElementById("notificationModal");
        // Ensure that the element starts off-screen
        modalElement.classList.add("translate-x-full");
        // Allow a moment before starting the slide-in to ensure the class is applied
        setTimeout(() => {
            modalElement.classList.remove("translate-x-full");
            modalElement.classList.add("translate-x-0");
        }, 10); // Short delay before transitioning in
    }, []);

    return (
        <div
            id="notificationModal"
            className="fixed right-0 top-0 mt-4 mr-4 z-50 max-w-sm w-full transform transition-transform duration-500 ease-in-out translate-x-full"
        >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-gray-500 cursor-pointer hover:text-gray-800"
                        onClick={() => {
                            const modalElement = document.getElementById("notificationModal");
                            modalElement.classList.remove("translate-x-0");
                            modalElement.classList.add("translate-x-full");
                            setTimeout(() => {
                                turnNotificationsToOff();
                            }, 500); // Ensure the animation completes before unmounting
                        }}
                    />
                </div>
                <div className="p-4">
                    {notifications.length === 0 ? (
                        <p className="text-gray-600 text-sm">No notifications to show</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={()=> handleSpecificClick(notification)}
                                className="mb-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors duration-200"
                            >
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{notification.senderName} sent a new message</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
