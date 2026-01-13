import mongoose from "mongoose";

const connectDB=async ():Promise<void>=>{
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("mongo db is connected now");
    }
    catch(error){
        console.error("Fail to connect with mongoDB",error);
        process.exit(1);
    }
};

export default connectDB