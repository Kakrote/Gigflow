import { Bid } from "../models/Bid.model";
import { Gig, StatusTypes as GigStatus } from "../models/Gig.model";
import { AppError } from "../utils/appError";

export const bidCreate = async (data: {
  gigId: string;
  freelancerId: string;
  price: number;
  message: string;
}) => {
  const gig = await Gig.findById(data.gigId);

  if (!gig) {
    throw new AppError("Gig not found", 404);
  }

  if (gig.status !== GigStatus.OPEN) {
    throw new AppError("Bidding is closed for this gig", 400);
  }

  if (gig.ownerId.toString() === data.freelancerId) {
    throw new AppError("You cannot bid on your own gig", 400);
  }

  try {
    const newBid = await Bid.create({
      gigid: gig._id,              // ✅ correct field
      freelancerId: data.freelancerId,
      price: data.price,
      message: data.message
    });

    return {
      bid: newBid,
      message: "New bid is created"
    };
  } catch (err: any) {
    // Duplicate bid (unique index)
    if (err.code === 11000) {
      throw new AppError("You have already bid on this gig", 400);
    }
    throw err;
  }
};


export const getMyBids=async (
    freelancerId:string,
    query:{
        page?:number;
        limit?:number;
        status?:string;
    }

)=>{
    const page=Math.max(Number(query.page)||1,1);
    const limit=Math.max(Number(query.limit)||10,50);
    const skip=(page-1)*limit;

    const filter:any={
        freelancerId
    };

    if(query.status){
        filter.status=query.status;
    }

    const [bids,total]=await Promise.all(
        [
            Bid.find(filter)
            .populate("gigid","title budget status ownerId")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit),
            Bid.countDocuments(filter)
        ]
    );

    return {
        bids,
        pagination:{
            total,
            page,
            pages:Math.ceil(total/limit)
        }
    }
}