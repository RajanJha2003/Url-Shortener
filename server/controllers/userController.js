import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}


export const registerUser = async (req,res)=>{
    try {
        const {userName,email,password} = req.body;
        if(!userName || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const existingUserName = await User.findOne({userName})
        const existingUserEmail = await User.findOne({email})
        
        if(existingUserName){
            return res.status(400).json({
                message:"User name already exists"
            })
        }
        if(existingUserEmail){
            return res.status(400).json({
                message:"User email already exists"
            })
        }

        const passwordHash = await bcrypt.hash(password,10)
        const user = await User.create({userName,email,password: passwordHash});
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        
        res.cookie("token",token,cookieOptions)
        return res.status(201).json({
            message:"User registered successfully",
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong",
            error: error

        })
        
    }
}

export const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        
        res.cookie("token",token,cookieOptions)
        return res.status(200).json({
            message:"User logged in successfully",
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong",
            error: error
        })
        
    }

}

export const logoutUser = async(req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message:"User logged out successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong",
            error: error
        })
        
    }
}

