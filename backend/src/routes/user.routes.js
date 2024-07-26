const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postSignIn, getUser } = require("../controllers/user.controllers");
const router = Router();
router.post("/signin", postSignIn);
router.post("/getUser", getUser);
const userRoute = router;
module.exports = userRoute;
