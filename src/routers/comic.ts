import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken"
import { AuthRequest } from "../types/AuthRequest";
import { getDb } from "../config/db"
import { Comic } from "../types/comic";
import { verifyBodyComic } from "../middlewares/verifyBodyComic";

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
        const idNuevo = await getCollection().insertOne(req.body);
        const nuevoComic = await getCollection().findOne({ _id: idNuevo.insertedId });
        res.status(201).send({ message: "Se ha credao un nuevo Comic", nuevoComic });
    } catch (error) {
        console.log(error);
    }
});

//router.post("/:id", verifyToken, )

export default router;
