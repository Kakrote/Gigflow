import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { gigCreate, bidForMygig, deleteGig, getAllOpenGigs, getMyGigsService } from "../services/gig.services";


// @desc Create a new gig
// @route POST/api/gigs 
// @access Private

export const createGig = catchAsync(
    async (req: Request, res: Response) => {
        const result = await gigCreate({
            ownerId: String(req.user?.id),
            budget: req.body.budget,
            description: req.body.description,
            title: req.body.title
        });

        res.status(201).json({
            success:true,
            data:result
        });
    }
);

// @desc Get all open gigs (public feed)
// @route GET/api/gigs 
// @access Private

export const getGigs=catchAsync(
    async(req:Request,res:Response)=>{
        const result=await getAllOpenGigs({
            search:req.query.search as string,
            page:Number(req.query.page),
            limit:Number(req.query.limit)
        });
        res.status(200).json({
            success:true,
            data:result
        })
    }
);

// @desc Delete a gig (Owner only, open gigs only)
// @route POST/api/gigs/:gigId
// @access Private

export const removeGig=catchAsync(
    async(req:Request,res:Response)=>{
        const message=await deleteGig(
            req.params.gigid as string,
            String(req.user?.id)
        );

        res.status(200).json({
            success:true,
            message:message
        });
    }
);


// @desc Get gigs created by logged-in user
// @route GET/api/gigs/my 
// @access Private

export const getMyGigs=catchAsync(
    async(req:Request,res:Response)=>{
        const result=await getMyGigsService(
            String(req.user?.id),{
                page:Number(req.query.page),
                limit:Number(req.query.limit),
                status:req.query.status as string
            }
        );

        res.status(201).json({
            success:true,
            data:result
        });
    }
);

// @desc Get gigs created by logged-in user
// @route GET/api/bid/:gigId 
// @access Private

export const getMyGigBid=catchAsync(
    async(req:Request,res:Response)=>{
        const result =await bidForMygig(
            req.params.gigId as string,
            req.user?.id as string
        );
        res.status(200).json({
            success:true,
            data:result
        });
    }
);