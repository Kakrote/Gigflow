import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import routes from "./routes/index";


dotenv.config()
const server=async ()=>{
    const app=express();
    app.use(express.json());
    app.use(cors(
        {
            origin:process.env.CORS_ORIGIN,
            credentials:true
        }
    ));
    const PORT=process.env.PORT;
    await connectDB()
    app.use("/api",routes)
    app.listen(PORT,()=>{
        console.log("the app is listing in port:",PORT);
    })
}

server()