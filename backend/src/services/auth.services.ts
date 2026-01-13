import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { AppError } from "../utils/appError";

// signup services 

export const signupService=async (data:{
    name:string;
    email:string;
    password:string;
})=>{
    let user=await User.findOne({email:data.email});
    if(user){
        throw new AppError("User already exists",409);
    }

    const hashPassword=await bcrypt.hash(data.password,10);
    user=await User.create({
        name:data.name,
        email:data.email,
        password:hashPassword
    })

    const token=jwt.sign({ id: user.id }, process.env.JWT_SECRET as string,{
        expiresIn:"7d"
    })

    return {user,token}
};

// Login service

export const loginService=async (data:{
    email:string;
    password:string;
})=>{
    const user=await User.findOne({email:data.email}).select("+password");
    if(!user){
        throw new AppError("the user is not found or check your password",401);
    }
    const isMatch=await bcrypt.compare(data.password,user.password);
     if(!isMatch) {
        throw new AppError("the user is not found or check your password",401);
     }

    const token =jwt.sign({id:user.id},process.env.JWT_SECRET as string,{
        expiresIn:"7d"
    })

    return {user,token};

};