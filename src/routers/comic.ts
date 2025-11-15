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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const title = req.query.title;
        let filtro: any = { userId: req.user!.id };
        if (title) {
            filtro.title = title;
        }

        const comics = await getCollection().find(filtro).skip(skip).limit(limit).toArray();

        res.json({
            info: {
                page: page,
                numberOfComicsInPage: limit,
            },
            result: comics,
        });
    } catch (error) {
        console.log(error);
    }
});


router.post("/", verifyToken, verifyBodyComic, async (req: AuthRequest, res) => {
    try {
        const nuevoComic: Comic = {
            ...req.body,
            userId: req.user?.id,
            read: false
        }
        const idNuevo = await getCollection().insertOne(nuevoComic);
        const comicCreado = await getCollection().findOne({ _id: idNuevo.insertedId });
        res.status(201).send({ message: "Se ha credao un nuevo Comic", comicCreado });
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


router.delete("/:id", verifyToken, verifyComicOwner, async (req: AuthRequest, res) => {
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

//patch sirve para modificar parcialmente un recurso 
router.patch("/:id/read", verifyToken, verifyComicOwner, async (req: AuthRequest, res) => {
    try {
        const { id } = req.params;
        const { read } = req.body;

        if (typeof read !== "boolean") {
            return res.status(400).json({ message: "El campo read debe ser boolean" });
        }

        const result = await getCollection().updateOne(
            { _id: new ObjectId(id) },
            { $set: { read } }
        );

        res.status(200).json({ message: "Se ha actulizado el estado de lectura en el Comic: " + id, result });
    } catch (error) {

    }
})

export default router;
