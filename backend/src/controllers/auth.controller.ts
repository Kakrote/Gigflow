import { catchAsync } from "../utils/catchAsync";
import { signupService,loginService } from "../services/auth.services";
import { Request,Response } from "express";

export const signup=catchAsync(
    async(req:Request,res:Response)=>{
        const {user,token}=await signupService(req.body);
        res.status(201).json({
            status:"success",
            token,
            data:{
                name:user.name,
                email:user.email
            }
        });
    }
);

export const login=catchAsync(
    async(req:Request,res:Response)=>{
        const {user,token}=await loginService(req.body);
        res.status(200).json({
            status:"success",
            token,
            data:{
                name:user.name,
                email:user.email
            }
        });
    }
);