import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken"
import { AuthRequest } from "../types/AuthRequest";
import { getDb } from "../config/db"
import { Comic } from "../types/comic";
import { verifyBodyComic } from "../middlewares/verifyBodyComic";
import { ObjectId } from "mongodb";
import { verifyComicOwner } from "../middlewares/verifyComicOwner";

const router = Router();

const getCollection = () => getDb().collection<Comic>("Comics");

router.get("/", verifyToken, async (req: AuthRequest, res) => {
    try {
        const data = await getCollection().find({ _id: req.user?.id }).toArray();
        data ? res.status(200).send(data) : res.status(404).send({ message: "no tienes comics publicados" });
    } catch (error) {
        console.log(error);
    }
});

router.post("/", verifyToken, verifyBodyComic, async (req: AuthRequest, res) => {
    try {
        const nuevoComic: Comic = {
            ...req.body,
            userId: req.user?.id
        }
        const idNuevo = await getCollection().insertOne(nuevoComic);
        const comicCreado = await getCollection().findOne({ _id: idNuevo.insertedId });
        res.status(201).send({ message: "Se ha credao un nuevo Comic", nuevoComic });
    } catch (error) {
        console.log(error);
    }
});

router.put("/:id", verifyToken, verifyBodyComic, verifyComicOwner, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const comicModificado = await getCollection().updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body },
        );
        res.status(200).send({ message: "Comic modifcado con existo", comicModificado });
    } catch (error) {
        console.log(error);
    }
});

router.delete("/:id", verifyToken, verifyBodyComic, verifyComicOwner, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const comicModificado = await getCollection().deleteOne(
            { _id: new ObjectId(id) },
        );
        res.status(200).send({ message: "Comic modifcado con existo", comicModificado })
    } catch (error) {
        console.log(error);
    }
});

export default router;
