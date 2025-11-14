import { ObjectId } from "mongodb";

export type User = {
    UserID?: ObjectId;
    email: string,
    password: string
}