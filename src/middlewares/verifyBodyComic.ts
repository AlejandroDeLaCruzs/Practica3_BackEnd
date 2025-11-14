import { NextFunction, Request, Response } from "express";
import { AuthRequest } from '../types/AuthRequest';
import { Comic } from "../types/comic";

export const verifyBodyComic = (req: AuthRequest, res: Response, next: NextFunction): void => {

    if (!req.body) {
        res.status(400).send({ succes: false, message: "no hay body" });
        return;
    }

    if (req.method === "POST") {
        const missing = validateCantidadParams(req.body);

        if (missing) {
            res.status(400).send({ succes: false, message: missing });
            return;
        }
    }


    const { title, author, year, publisher } = req.body;

    if (title && typeof title !== "string") {
        res.status(400).send({ succes: false, message: "El title debe ser un string" });
        return;
    }

    if (author && typeof author !== "string") {
        res.status(400).send({ succes: false, message: "El author debe ser un string" });
        return;
    }

    if ((year && typeof year !== "number") || year < 1990) {
        res.status(400).send({ succes: false, message: "year debe ser un número positivo" });
        return;
    }

    if (publisher && typeof publisher !== "string") {
        res.status(400).send({ succes: false, message: "publisher debe ser un string" });
        return;
    }

    next()
}

const validateCantidadParams = (data: any): string | null => {
    const { title, author, year} = data;
    if (!title || !author || !year) return "Faltan campos en el body";
    return null;
}