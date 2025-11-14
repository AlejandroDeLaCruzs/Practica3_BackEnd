import { ObjectId } from "mongodb";

export type JwtPayload = {
    id: ObjectId;
    email: string;
}