const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const router = Router();
const {createChat , allChats , getChatMessages , sendMessage , updateSeenStatus, getNotifications} = require('../controllers/chat.controller.js')

 router.post("/new",createChat)
 router.post("/",allChats)
 /// this api is used for getting messages , I have used put here because I had to send userId from frontend but you can't do that with get.. ///
 router.put('/:chatId', getChatMessages);
 router.post('/:chatId' , updateSeenStatus)
 router.post('/:chatId/message', sendMessage);
router.get("/notifications/:recipientId" , getNotifications)

 const chatRoute = router;
 module.exports = chatRoute;
