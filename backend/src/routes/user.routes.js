const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postSignIn } = require("../controllers/user.controllers");
const router = Router();
router.post("/signin", postSignIn);
const userRoute = router;
module.exports = userRoute;
