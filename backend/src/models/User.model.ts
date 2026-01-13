import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name: string
    email: string
    password: string
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true // index for faster queries
        },
        password: {
            type: String,
            required: true
        }
    }, { timestamps: true }
);

// Additional indexes can be added here if needed

export const User = model<IUser>("User", userSchema);