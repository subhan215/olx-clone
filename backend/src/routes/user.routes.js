import { Router } from "express";   
const router = Router()

//examples of how to use it

//with middleware
// router.route("/registeration").post(
//     upload.fields([
//     {
//         name:"avatar",
//         maxCount:1
//     },
//     {
//         name:"coverImage",
//         maxCount:1
//     }
//     ]),
//         registerUser
//     )

//without middleware
// router.route("/login").post(loginUser)


export default router