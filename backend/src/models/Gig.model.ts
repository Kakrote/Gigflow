import { Schema,model,Document, Types } from "mongoose";

enum StatusTypes{
    OPEN="open",
    ASSIGNED="assigned"
}
export interface IGig extends Document{
    title:string
    description:string
    budget:number
    ownerId:Types.ObjectId
    status:StatusTypes
}

const gigSchema = new Schema<IGig>(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        budget:{
            type:Number,
            required:true
        },
        ownerId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"User",
            index:true // index for fast user-gig lookups
        },
        status:{
            type:String,
            default:StatusTypes.OPEN,
            required:true
        }
    },{timestamps:true}
);

// Index for ownerId to speed up queries by user
gigSchema.index({ ownerId: 1 });

export const Gig=model<IGig>("Gig",gigSchema);