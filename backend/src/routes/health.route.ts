import { Router } from "express";
import { Request,Response } from "express";
const route=Router();
route.get('/health',(req:Request,res:Response)=>{
    res.status(200).json({
        status:200,
        message:"the api is running"
    })
})

export default route;