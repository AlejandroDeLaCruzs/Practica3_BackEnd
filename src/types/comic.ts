import { ObjectId } from "mongodb";

export type Comic = {
    id: ObjectId | null,
    title: string;
    author: string,
    year: number,
    publisher?: string
    userId: string,
}
