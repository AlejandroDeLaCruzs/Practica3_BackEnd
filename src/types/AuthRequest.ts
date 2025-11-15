import { Request } from "express";
import { JwtPayload } from "../types/JwtPayload"
import { Comic } from "./comic";

export interface AuthRequest extends Request {
    user?: JwtPayload;
};