const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const router = Router();
const {createChat , allChats , getChatMessages , sendMessage} = require('../controllers/chat.controller.js')

 router.post("/new",createChat)
 router.post("/",allChats)
 router.get('/:chatId', getChatMessages);
 router.post('/:chatId/message', sendMessage);

 const chatRoute = router;
 module.exports = chatRoute;
