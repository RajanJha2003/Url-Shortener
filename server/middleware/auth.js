import User from "../models/userModel.js";
import jwt from "jsonwebtoken"

const isAuth = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decoded?.id)
        
        if(!req.user){
            return res.status(401).json({
                message:"User not found"
            })
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong",
            error: error
        })
        
    }
}

export default isAuth
