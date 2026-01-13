import jwt from "jsonwebtoken";
import { Request,Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { User } from "../models/User.model";

type AuthTokenPayload = {
    id: string;
    iat: number;
    exp: number;
};

const verifyToken = (token: string): AuthTokenPayload => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("JWT secret is not configured", 500);
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== "object" || decoded === null) {
        throw new AppError("Invalid token", 401);
    }

    const id = (decoded as { id?: unknown }).id;
    if (typeof id !== "string") {
        throw new AppError("Invalid token", 401);
    }

    return decoded as AuthTokenPayload;
};

export const protect=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        let token:string|undefined;
        // getting token from the headers
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
            token = authHeader.slice("bearer ".length).trim();
        }

        if(!token){
            throw new AppError("you are not logged in",401);
        }

        //verifiying the token

        let decode: AuthTokenPayload;
        try {
            decode = verifyToken(token);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError("Token expired", 401);
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AppError("Invalid token", 401);
            }
            throw error;
        }

        // check if user still exists
        const user=await User.findById(decode.id).select("-password");

        if(!user){
            throw new AppError("User no longer exists",401);
        }

        req.user=user;
        next();

    }
)
