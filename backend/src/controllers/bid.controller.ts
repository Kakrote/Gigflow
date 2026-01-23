import { Request,Response } from "express";
import * as bidServices from "../services/bid.services";
import { catchAsync } from "../utils/catchAsync";
import { Bid } from "../models/Bid.model";
import { hireService } from "../services/hireBid.services";


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

// @desc hiring a bid 
// @route POST/api/:bidId/hire
// @access Private

export const hireBid=catchAsync(
    async(req:Request,res:Response)=>{
        const result = await hireService(
            req.body.bidId,
            req.user?.id as string
        );
        res.status(200).json({
            success:true,
            message:"The Freelancer hired Successfully"
        })
    }
)