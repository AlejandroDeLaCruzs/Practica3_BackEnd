import { getDb } from "../config/db"
import { Request, Response } from "express";
import { validateComicData, Comic } from "../utils/validateComic";


const coleccion = () => getDb().collection<Comic>("Comics");


export const getAllComics = async (req: Request, res: Response) => {
    try {
        const data = await coleccion().find().toArray();
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
}

export const postComic = async (req: Request, res: Response) => {
    try {
        const datosValidados = validateComicData(req.body);
        if (datosValidados.succes == true) {
            const comicPost = await coleccion().insertOne(req.body);
            res.status(202).send(comicPost.insertedId);
        }
    } catch (error) {
        console.log(error);
    }
}