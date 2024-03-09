import express from "express";
import {registerController,loginController,forgotPasswordController,testController, updateProfileController, getOrdersController, allOrdersController, orderStatusController} from '../controller/authController.js'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//This router can be used to define routes and handle HTTP requests.
const router=express.Router()

router.post('/register',registerController)

//LOGIN || POST
router.post('/login',loginController)

//Forgot password
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignIn,isAdmin,testController)

//protected user route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

//protected admin route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update profile
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersController)

//all orders
router.get('/all-orders',requireSignIn,isAdmin,allOrdersController)

//status update
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController)
export default router;