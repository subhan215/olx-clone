const { Router } = require("express");
const { upload } = require("../midddlewares/multer");
const { postVehicle, postMobile, postJob, postService, allPosts , postLike } = require("../controllers/post.controllers");
const router = Router();
//get all posts //
router.get("/" , allPosts) ;

router.post("/vehicle", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postVehicle);
router.put("/vehicle/:adId", upload.fields([
  {
    name: "images",
    maxCount: 15
  }
]), postVehicle);

router.post("/mobile", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postMobile);
router.put("/mobile/:adId", upload.fields([
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
  router.put("/jobs/:adId", upload.fields([
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
  router.put("/services/:adId", upload.fields([
    {
        name: "images",
        maxCount: 15
    }
  ]) , postService);

 router.post("/:adId/like" , postLike)   
const postRoute = router;
module.exports = postRoute;
