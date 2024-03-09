import { hash } from "bcrypt";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from 'jsonwebtoken'
//JWTs-> Used for authentication,where a user logs in and receives a JWT token,
//which is then sent with subsequent requests to authenticate the user.

//register for new user
export const registerController=async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer}=req.body
        console.log(name,email,password,phone,address,answer)
        //validations
        if(!name){
            res.send({Message:'Name is Required'})
        }
        if(!email){
            res.send({Message:'Email is Required'})
        }
        if(!password){
            res.send({Message:'Password is Required'})
        }
        if(!phone){
            res.send({Message:'Phone No. is Required'})
        }
        if(!answer){
            res.send({Message:'Phone No. is Required'})
        }
        if(!address){
            res.send({Message:'Address is Required'})
        }

        //existing user
        const existUser=await userModel.findOne({email})
        if(existUser){
            return res.status(200).send({
                success:false,
                message:'Already registered,Please Log in'
            })
        }

        //hashing a user password
        const hashedPassword=await hashPassword(password)

        //save details for user
        const user=await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()
        res.status(201).send({
            success:true,
            message:'Registration Successfully',
            user
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
}

//LOGIN
export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body

        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
        }

        //check user
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered'
            })
        }
        //Assuming a user email was found,this line compares the password with the hashed password stored in the user document
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'
            })
        }

        //token   -> for signing and generating JWTs.
        //JWT is sent as part of a successful login response along with some user information.
        const token=JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.status(200).send({
            success:true,
            message:'Login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
}

//forgot
export const forgotPasswordController=async(req,res)=>{
    try {
        const {email,answer,newPassword}=req.body
        console.log(email,answer,newPassword)
        if(!email){
            res.status(400).send({
                message:'Email is required'
            })
        }
        if(!answer){
            res.status(400).send({
                message:'Answer is required'
            })
        }
        if(!newPassword){
            res.status(400).send({
                message:'New Password is required'
            })
        }

        //check
        const user=await userModel.findOne({email,answer})
        if(!user){
            return res.status(400).send({
                success:false,
                message:'Wrong Email or Answer'
            })
        }
        const hashed=await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, {password:hashed})
        res.status(200).send({
            success:true,
            message:'Password Reset Successfully',
        })
    } 
    catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })
    }
}


//test controller
export const testController=(req,res)=>{
    res.send("Protected Route")
}

//update profile
export const updateProfileController=async(req,res)=>{
    try {
        const {name,email,password,address,phone}=req.body
        const user=await userModel.findById(req.user._id)

        //password
        if(password && password.length <5)
        return res.Json({error:'Password is required and 5 character long'})

        const hashedPassword=password ? await hashPassword(password) : undefined
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:hashedPassword || user.password,
            phone:phone || user.phone,
            address:address || user.address
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile Updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"error while updating profile",
            error
        })
    }
}

//orders
export const getOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find({buyer:req.user._id}).populate('products','-photo').populate('buyer','name')
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
}

//all orders
export const allOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find({}).populate('products','-photo').populate('buyer','name')
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
}

//status update
export const orderStatusController=async(req,res)=>{
    try {
        const {orderId}=req.params
        const {status}=req.body
        const orders=await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while status updating",
            error
        })
    }
}