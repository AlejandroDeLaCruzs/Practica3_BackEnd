import express from "express";
import denotev from "dotenv"
import { connectMongoDB } from "../src/config/db"
import routerComic from "../src/routers/comic"
import routerAuth from "../src/routers/auth";



denotev.config();

connectMongoDB();

const app = express();
app.use(express.json());
app.use("/auth", routerAuth);
app.use("/comics", routerComic);





app.listen(3000, () =>
    console.log("Servidor en http://localhost:3000"));