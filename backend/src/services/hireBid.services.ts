import { Bid,StatusTypes as BidStatus } from "../models/Bid.model";
import { Gig,StatusTypes as GigStatus } from "../models/Gig.model";
import { AppError } from "../utils/appError";
import mongoose from "mongoose";

export const hireService=async (
    bidId:string,
    ownerId:string
)=>{
    const session=await mongoose.startSession();

    try{
        session.startTransaction();

        const bid=await Bid.findById(bidId).session(session);
        if(!bid){
            throw new AppError("The bid is not found",404);
        }

        const gig=await Gig.findById(bid.gigid).session(session);
        if(!gig){
            throw new AppError("The gig is not found",404);
        }

        if(gig.ownerId.toString()!== ownerId){
            throw new AppError("unauthorize ",403);
        }

        if(gig.status!==GigStatus.OPEN){
            throw new AppError("The is no more open",400);
        }


        gig.status=GigStatus.ASSIGNED;
        await gig.save({session});

        bid.status=BidStatus.HIRED;
        await bid.save({session})

        //rejecting all other bids
        await Bid.updateMany(
            {gigid:gig._id,_id:{$ne:bid._id}},
            {status:BidStatus.REJECTED},
            {session}
        );
        await session.commitTransaction();

    }
    catch(error){
        await session.abortTransaction();
        throw new AppError(`${error}`,400);
    }
    finally{
        await session.endSession();
    }
}