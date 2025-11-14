import { Router } from "express";
import { getAllComics } from "../controllers/comic";

const router = Router();

router.get("/", getAllComics);

export default router;
