const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postVehicle, postMobile, postJob, postService, allPosts } = require("../controllers/post.controllers");
const router = Router();
//get all posts //
router.get("/" , allPosts) ; 
router.post("/vehicle", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postVehicle);
router.post("/mobile", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postMobile);
  router.post("/jobs", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postJob);
  router.post("/services", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postService);
    
const postRoute = router;
module.exports = postRoute;
