import { setChatMessages } from "../../redux/slices/chatsData";
const fetchMessages = async (chatId, userId, page = 1, limit = 10,dispatch , prevMessages = []) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/chat/${chatId}?page=${page}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.success) {
            dispatch(setChatMessages([ ...prevMessages ,...data.messages ]));
            // Optionally handle pagination metadata if needed
            console.log('Current Page:', data.pagination.currentPage);
            console.log('Total Pages:', data.pagination.totalPages);
            console.log('Total Messages:', data.pagination.totalMessages);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};
export {fetchMessages}