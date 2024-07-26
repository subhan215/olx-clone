const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postSignIn, getUser  , postSignUp} = require("../controllers/user.controllers");
const router = Router();
router.post("/signin", postSignIn);
router.post("/signup",postSignUp)
router.post("/getUser", getUser);
const userRoute = router;
module.exports = userRoute;
