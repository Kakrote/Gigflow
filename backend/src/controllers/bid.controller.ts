import { Request,Response } from "express";
import * as bidServices from "../services/bid.services";
import { catchAsync } from "../utils/catchAsync";
import { Bid } from "../models/Bid.model";


// @desc Create a new bid
// @route POST/api/bids 
// @access Private

export const createBid=catchAsync(
    async(req:Request,res:Response)=>{
        const bid=await bidServices.bidCreate(
            {
                freelancerId:req.user?.id as string,
                gigId:req.body.gigId,
                message:req.body.message,
                price:req.body.price
            }
        );

        res.status(201).json({
            success:true,
            data:bid
        });
    }
)

// @desc Create a new bid
// @route POST/api/bids
// @access Private

export const getMyBid=catchAsync(
    async(req:Request,res:Response)=>{
        const result =await bidServices.getMyBids(
            req.user?.id as string,
            {
                page:Number(req.query.page),
                limit:Number(req.query.limit),
                status:req.query.status as string
            }
        );

        res.status(201).json(
            {
                success:true,
                data:result
            }
        );
    }
)


