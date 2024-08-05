const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const router = Router();
const {createChat , allChats} = require('../controllers/chat.controller.js')

 router.post("/new",createChat)
 router.post("/",allChats)

 const chatRoute = router;
 module.exports = chatRoute;
