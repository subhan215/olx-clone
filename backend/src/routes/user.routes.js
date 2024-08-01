const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postSignIn, getUser  , postSignUp , postUpdateProf} = require("../controllers/user.controllers");
const router = Router();
router.post("/signin", postSignIn);
router.post("/signup",postSignUp)
router.post("/getUser", getUser);
router.post("/profileUpdate" ,upload.fields([
    {
        name: "image",
        maxCount: 1
    }
  ])  ,  postUpdateProf)
const userRoute = router;
module.exports = userRoute;
