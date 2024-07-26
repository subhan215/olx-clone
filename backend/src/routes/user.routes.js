const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postSignIn, postSignUp } = require("../controllers/user.controllers");
const router = Router();
router.post("/signin", postSignIn);
router.post("/signup",postSignUp)
const userRoute = router;
module.exports = userRoute;
