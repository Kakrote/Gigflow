import { Schema,Document,model, Types } from "mongoose";


enum StatusTypes{
    PENDING="pending",
    HIRED="hired",
    REJECTED="rejected"
}
export interface IBid extends Document{
    gigid:Types.ObjectId
    freelancerId:Types.ObjectId
    price:number
    message:String
    status:StatusTypes
}

const bidSchema=new Schema<IBid>(
    {
        gigid:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"Gig",
            index:true // index for fast gig-bid lookups
        },
        freelancerId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"User",
            index:true // index for fast user-bid lookups
        },
        price:{
            type:Number,
            required:true
        },
        message:{
            type:String,
            required:true
        },
        status:{
            type:String,
            default:StatusTypes.PENDING,
        }
    },{timestamps:true}
);


// Compound index for gigid and freelancerId
bidSchema.index({ gigid: 1, freelancerId: 1 });

export const Bid=model<IBid>("Bid",bidSchema);