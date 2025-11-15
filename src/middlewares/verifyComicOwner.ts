import { ObjectId } from "mongodb";
import { getDb } from "../config/db"
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { Comic } from "../types/comic";

export const verifyComicOwner = async (req:AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        const objectId = new ObjectId(id);
        const collection = getDb().collection<Comic>("Comics");

        const comic = await collection.findOne({ _id: objectId });
        if (!comic) {
            return res.status(404).json({ message: "No existe un cómic con ese ID" });
        }

        if (comic.userId !== req.user?.id) {
            return res.status(403).json({ message: "No tiene permisos para modificar este cómic" });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
